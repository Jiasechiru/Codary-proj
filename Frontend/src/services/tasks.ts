import { apiRequest } from "../lib/api";

export type Task = {
  id: number;
  moduleId: number;
  title: string;
  description: string;
  starterCode: string;
  difficulty: string;
  codeTests: Array<{ id: number; input: string; expectedOutput: string }>;
};

export type TaskAttempt = {
  id: number;
  code: string;
  isCorrect: boolean;
  createdAt: string;
};

export function getTask(taskId: number) {
  return apiRequest<Task>(`/tasks/${taskId}`);
}

export function submitTask(taskId: number, code: string) {
  return apiRequest<{ isCorrect: boolean }>(`/tasks/${taskId}/submit`, {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export function getTaskAttempts(taskId: number) {
  return apiRequest<TaskAttempt[]>(`/tasks/${taskId}/attempts`);
}
