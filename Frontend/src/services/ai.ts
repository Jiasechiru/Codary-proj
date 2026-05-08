import { apiRequest } from "../lib/api";

export type AIMessage = {
  id: number;
  role: "user" | "assistant";
  message: string;
  createdAt: string;
};

export function getGlobalChatHistory() {
  return apiRequest<AIMessage[]>("/ai/chat/history");
}

export function sendGlobalMessage(message: string) {
  return apiRequest<{ response: string }>("/ai/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export function sendTaskMessage(taskId: number, message: string) {
  return apiRequest<{ response: string }>(`/ai/tasks/${taskId}/chat`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}
