import { apiRequest } from "../lib/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export type AIMessageRole = "user" | "assistant" | "system";

export type AIMessage = {
  id: number;
  role: AIMessageRole;
  message: string;
  createdAt: string;
};

export type ChatMessage = {
  id?: number;
  role: AIMessageRole;
  content: string;
  isStreaming?: boolean;
};

type StreamEvent =
  | { type: "delta"; content: string }
  | { type: "done"; message: AIMessage }
  | { type: "error"; message: string };

export type StreamChatHandlers = {
  onDelta: (content: string) => void;
  onDone: (message: AIMessage) => void;
  onError: (message: string) => void;
};

async function postChatStream(path: string, body: unknown): Promise<Response> {
  return fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

async function readErrorMessage(response: Response): Promise<string> {
  let errorMessage = `Request failed with status ${response.status}`;

  try {
    const payload = (await response.json()) as { message?: string };
    if (payload.message) {
      errorMessage = payload.message;
    }
  } catch (_error) {
    // Keep default message when server sends no JSON body.
  }

  return errorMessage;
}

function parseSseBlock(block: string): StreamEvent | null {
  const dataLines = block
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart());

  if (dataLines.length === 0) {
    return null;
  }

  try {
    return JSON.parse(dataLines.join("\n")) as StreamEvent;
  } catch (_error) {
    return null;
  }
}

export async function consumeChatStream(
  response: Response,
  handlers: StreamChatHandlers
): Promise<void> {
  if (!response.ok) {
    handlers.onError(await readErrorMessage(response));
    return;
  }

  if (!response.body) {
    handlers.onError("Streaming is not supported in this browser");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finished = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    let separatorIndex = buffer.indexOf("\n\n");
    while (separatorIndex !== -1) {
      const block = buffer.slice(0, separatorIndex);
      buffer = buffer.slice(separatorIndex + 2);
      const event = parseSseBlock(block);

      if (event?.type === "delta") {
        handlers.onDelta(event.content);
      } else if (event?.type === "done") {
        handlers.onDone(event.message);
        finished = true;
      } else if (event?.type === "error") {
        handlers.onError(event.message);
        finished = true;
      }

      separatorIndex = buffer.indexOf("\n\n");
    }
  }

  if (!finished && buffer.trim()) {
    const event = parseSseBlock(buffer);
    if (event?.type === "delta") {
      handlers.onDelta(event.content);
    } else if (event?.type === "done") {
      handlers.onDone(event.message);
      finished = true;
    } else if (event?.type === "error") {
      handlers.onError(event.message);
      finished = true;
    }
  }

  if (!finished) {
    handlers.onError("Stream ended unexpectedly");
  }
}

export function getGlobalChatHistory() {
  return apiRequest<AIMessage[]>("/ai/chat/history");
}

export function sendGlobalMessage(message: string) {
  return apiRequest<{ response: string; message: AIMessage }>("/ai/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function streamGlobalMessage(message: string, handlers: StreamChatHandlers) {
  const response = await postChatStream("/ai/chat/stream", { message });
  await consumeChatStream(response, handlers);
}

export function resetGlobalChatContext() {
  return apiRequest<{ message: AIMessage }>("/ai/chat/reset", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function sendTaskMessage(taskId: number, message: string, userCode: string) {
  return apiRequest<{ response: string; message: AIMessage }>(`/ai/tasks/${taskId}/chat`, {
    method: "POST",
    body: JSON.stringify({ message, userCode }),
  });
}

export async function streamTaskMessage(
  taskId: number,
  message: string,
  userCode: string,
  handlers: StreamChatHandlers
) {
  const response = await postChatStream(`/ai/tasks/${taskId}/chat/stream`, {
    message,
    userCode,
  });
  await consumeChatStream(response, handlers);
}

export function getTaskChatHistory(taskId: number) {
  return apiRequest<AIMessage[]>(`/ai/tasks/${taskId}/chat/history`);
}

export function appendStreamingDelta(
  messages: ChatMessage[],
  delta: string
): ChatMessage[] {
  return messages.map((message) =>
    message.isStreaming ? { ...message, content: message.content + delta } : message
  );
}

export function finalizeStreamingMessage(
  messages: ChatMessage[],
  saved: AIMessage
): ChatMessage[] {
  return messages.map((message) =>
    message.isStreaming
      ? {
          id: saved.id,
          role: saved.role,
          content: saved.message,
          isStreaming: false,
        }
      : message
  );
}

export function replaceStreamingWithError(
  messages: ChatMessage[],
  errorMessage: string
): ChatMessage[] {
  return messages.map((message) =>
    message.isStreaming
      ? {
          role: "assistant",
          content: errorMessage,
          isStreaming: false,
        }
      : message
  );
}
