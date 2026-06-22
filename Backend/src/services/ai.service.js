const prisma = require("../prisma/client");
const AppError = require("../utils/AppError");
const aiClient = require("../utils/aiClient");
const {
  buildChatCompletionRequest,
  extractAssistantContent,
} = require("../utils/deepseekConfig");
const { loadRecentChatMessages } = require("../utils/aiContext");
const {
  buildGlobalSystemPrompt,
  getContextResetMessage,
  CONTEXT_WINDOW_SIZE,
} = require("../utils/globalAiPrompt");
const {
  buildTaskSystemPrompt,
  TASK_CONTEXT_WINDOW_SIZE,
} = require("../utils/taskAiPrompt");
const { isModuleAccessible } = require("./moduleAccess.service");

async function getUserAiPreferences(userId) {
  const row = await prisma.userSettings.findUnique({
    where: { userId },
    select: { settings: true },
  });
  const settings = row?.settings || {};
  return {
    language: settings.language === "en" ? "en" : "ru",
    aiEnabled: settings.aiEnabled !== false,
  };
}

async function getOrCreateGlobalChat(userId) {
  let chat = await prisma.globalAIChat.findUnique({ where: { userId } });
  if (!chat) {
    chat = await prisma.globalAIChat.create({ data: { userId } });
  }
  return chat;
}

function ensureAiConfigured() {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new AppError("AI service is not configured", 503);
  }
}

function ensureAiEnabled(aiEnabled) {
  if (!aiEnabled) {
    throw new AppError("AI assistant is disabled in settings", 403);
  }
}

function ensureMessage(message) {
  const trimmed = message.trim();
  if (!trimmed) {
    throw new AppError("Message is required", 400);
  }
  return trimmed;
}

function toPublicMessage(saved) {
  return {
    id: saved.id,
    role: saved.role,
    message: saved.message,
    createdAt: saved.createdAt,
  };
}

async function callDeepSeek(systemPrompt, contextMessages) {
  ensureAiConfigured();

  const completion = await aiClient.chat.completions.create(
    buildChatCompletionRequest(systemPrompt, contextMessages)
  );

  const content = extractAssistantContent(completion);
  if (!content) {
    throw new AppError("Empty response from AI", 502);
  }

  return content;
}

async function streamDeepSeek(systemPrompt, contextMessages, onDelta) {
  ensureAiConfigured();

  const stream = await aiClient.chat.completions.create(
    buildChatCompletionRequest(systemPrompt, contextMessages, { stream: true })
  );

  let fullContent = "";
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content || "";
    if (!delta) {
      continue;
    }
    fullContent += delta;
    onDelta(delta);
  }

  const trimmed = fullContent.trim();
  if (!trimmed) {
    throw new AppError("Empty response from AI", 502);
  }

  return fullContent;
}

async function globalChat(userId, message) {
  const trimmed = ensureMessage(message);
  const { language, aiEnabled } = await getUserAiPreferences(userId);
  ensureAiEnabled(aiEnabled);

  const chat = await getOrCreateGlobalChat(userId);

  await prisma.globalAIMessage.create({
    data: { chatId: chat.id, role: "user", message: trimmed },
  });

  const contextMessages = await loadRecentChatMessages(prisma.globalAIMessage, chat.id, {
    contextAfterMessageId: chat.contextAfterMessageId,
    windowSize: CONTEXT_WINDOW_SIZE,
  });
  const systemPrompt = buildGlobalSystemPrompt(language);

  let response;
  try {
    response = await callDeepSeek(systemPrompt, contextMessages);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to get AI response", 502);
  }

  const saved = await prisma.globalAIMessage.create({
    data: { chatId: chat.id, role: "assistant", message: response },
  });

  return {
    response,
    message: toPublicMessage(saved),
  };
}

async function globalChatStream(userId, message, emit) {
  const trimmed = ensureMessage(message);
  const { language, aiEnabled } = await getUserAiPreferences(userId);
  ensureAiEnabled(aiEnabled);

  const chat = await getOrCreateGlobalChat(userId);

  await prisma.globalAIMessage.create({
    data: { chatId: chat.id, role: "user", message: trimmed },
  });

  const contextMessages = await loadRecentChatMessages(prisma.globalAIMessage, chat.id, {
    contextAfterMessageId: chat.contextAfterMessageId,
    windowSize: CONTEXT_WINDOW_SIZE,
  });
  const systemPrompt = buildGlobalSystemPrompt(language);

  let response;
  try {
    response = await streamDeepSeek(systemPrompt, contextMessages, (delta) => {
      emit({ type: "delta", content: delta });
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to get AI response", 502);
  }

  const saved = await prisma.globalAIMessage.create({
    data: { chatId: chat.id, role: "assistant", message: response },
  });

  emit({ type: "done", message: toPublicMessage(saved) });
}

async function getGlobalHistory(userId) {
  const chat = await prisma.globalAIChat.findUnique({
    where: { userId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  return chat?.messages || [];
}

async function resetGlobalContext(userId) {
  const { language } = await getUserAiPreferences(userId);
  const chat = await getOrCreateGlobalChat(userId);

  const lastMessage = await prisma.globalAIMessage.findFirst({
    where: { chatId: chat.id },
    orderBy: { id: "desc" },
    select: { id: true },
  });

  const contextAfterMessageId = lastMessage?.id ?? 0;

  await prisma.globalAIChat.update({
    where: { id: chat.id },
    data: { contextAfterMessageId },
  });

  const notice = await prisma.globalAIMessage.create({
    data: {
      chatId: chat.id,
      role: "system",
      message: getContextResetMessage(language),
    },
  });

  return {
    message: toPublicMessage(notice),
  };
}

async function getTaskForAi(userId, taskId) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { codeTests: true },
  });
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const accessible = await isModuleAccessible(userId, task.moduleId);
  if (!accessible) {
    throw new AppError("Module is locked. Complete the previous module first.", 403);
  }

  return task;
}

async function getOrCreateTaskChat(userId, taskId) {
  return prisma.taskAIChat.upsert({
    where: { userId_taskId: { userId, taskId } },
    create: { userId, taskId },
    update: {},
  });
}

async function taskChat(userId, taskId, message, userCode = "") {
  const trimmed = ensureMessage(message);
  const { language, aiEnabled } = await getUserAiPreferences(userId);
  ensureAiEnabled(aiEnabled);

  const task = await getTaskForAi(userId, taskId);
  const chat = await getOrCreateTaskChat(userId, taskId);

  await prisma.taskAIMessage.create({
    data: { chatId: chat.id, role: "user", message: trimmed },
  });

  const contextMessages = await loadRecentChatMessages(prisma.taskAIMessage, chat.id, {
    windowSize: TASK_CONTEXT_WINDOW_SIZE,
  });
  const systemPrompt = buildTaskSystemPrompt({
    language,
    task,
    userCode: typeof userCode === "string" ? userCode : "",
  });

  let response;
  try {
    response = await callDeepSeek(systemPrompt, contextMessages);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to get AI response", 502);
  }

  const saved = await prisma.taskAIMessage.create({
    data: { chatId: chat.id, role: "assistant", message: response },
  });

  return {
    response,
    message: toPublicMessage(saved),
  };
}

async function taskChatStream(userId, taskId, message, userCode, emit) {
  const trimmed = ensureMessage(message);
  const { language, aiEnabled } = await getUserAiPreferences(userId);
  ensureAiEnabled(aiEnabled);

  const task = await getTaskForAi(userId, taskId);
  const chat = await getOrCreateTaskChat(userId, taskId);

  await prisma.taskAIMessage.create({
    data: { chatId: chat.id, role: "user", message: trimmed },
  });

  const contextMessages = await loadRecentChatMessages(prisma.taskAIMessage, chat.id, {
    windowSize: TASK_CONTEXT_WINDOW_SIZE,
  });
  const systemPrompt = buildTaskSystemPrompt({
    language,
    task,
    userCode: typeof userCode === "string" ? userCode : "",
  });

  let response;
  try {
    response = await streamDeepSeek(systemPrompt, contextMessages, (delta) => {
      emit({ type: "delta", content: delta });
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to get AI response", 502);
  }

  const saved = await prisma.taskAIMessage.create({
    data: { chatId: chat.id, role: "assistant", message: response },
  });

  emit({ type: "done", message: toPublicMessage(saved) });
}

async function getTaskChatHistory(userId, taskId) {
  await getTaskForAi(userId, taskId);

  const chat = await prisma.taskAIChat.findUnique({
    where: { userId_taskId: { userId, taskId } },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  return chat?.messages || [];
}

module.exports = {
  globalChat,
  globalChatStream,
  getGlobalHistory,
  resetGlobalContext,
  taskChat,
  taskChatStream,
  getTaskChatHistory,
};
