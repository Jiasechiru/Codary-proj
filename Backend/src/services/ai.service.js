const prisma = require("../prisma/client");

async function globalChat(userId, message) {
  let chat = await prisma.globalAIChat.findFirst({
    where: { userId },
  });

  if (!chat) {
    chat = await prisma.globalAIChat.create({ data: { userId } });
  }

  await prisma.globalAIMessage.create({
    data: { chatId: chat.id, role: "user", message },
  });

  const response = "This is a stub AI response";

  await prisma.globalAIMessage.create({
    data: { chatId: chat.id, role: "assistant", message: response },
  });

  return { response };
}

async function getGlobalHistory(userId) {
  const chat = await prisma.globalAIChat.findFirst({
    where: { userId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  return chat?.messages || [];
}

async function taskChat(userId, taskId, message) {
  const chat = await prisma.taskAIChat.upsert({
    where: { userId_taskId: { userId, taskId } },
    create: { userId, taskId },
    update: {},
  });

  await prisma.taskAIMessage.create({
    data: { chatId: chat.id, role: "user", message },
  });

  const response = "Try to think about variables";
  await prisma.taskAIMessage.create({
    data: { chatId: chat.id, role: "assistant", message: response },
  });

  return { response };
}

module.exports = {
  globalChat,
  getGlobalHistory,
  taskChat,
};
