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

export type TaskSubmitResponse = {
  attemptId: number;
  status: "pending";
};

export type AttemptStatus =
  | "pending"
  | "SUCCESS"
  | "FAILED"
  | "TIME_LIMIT"
  | "RUNTIME_ERROR"
  | "COMPILATION_ERROR";

export type TaskAttemptStatus = {
  attemptId: number;
  status: AttemptStatus;
  isCorrect: boolean;
  message?: string;
};

export type TaskResultMessage = {
  type: "success" | "error";
  message: string;
};

export function getTask(taskId: number) {
  return apiRequest<Task>(`/tasks/${taskId}`);
}

export function submitTask(taskId: number, code: string) {
  return apiRequest<TaskSubmitResponse>(`/tasks/${taskId}/submit`, {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export function getAttemptStatus(attemptId: number) {
  return apiRequest<TaskAttemptStatus>(`/tasks/attempts/${attemptId}`);
}

export function getTaskAttempts(taskId: number) {
  return apiRequest<TaskAttempt[]>(`/tasks/${taskId}/attempts`);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitForAttemptResult(
  attemptId: number,
  options?: { intervalMs?: number; timeoutMs?: number }
) {
  const intervalMs = options?.intervalMs ?? 1000;
  const timeoutMs = options?.timeoutMs ?? 30000;
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const status = await getAttemptStatus(attemptId);
    if (status.status !== "pending") {
      return status;
    }
    await delay(intervalMs);
  }

  throw new Error("Checking timed out. Please try again.");
}

export function getAttemptResultMessage(status: TaskAttemptStatus): TaskResultMessage {
  switch (status.status) {
    case "SUCCESS":
      return {
        type: "success",
        message: "Great job! Your solution passed all test cases. Task completed!",
      };
    case "FAILED":
      return {
        type: "error",
        message: "Not all test cases passed. Check your output and try again.",
      };
    case "TIME_LIMIT":
      return {
        type: "error",
        message: "Your code exceeded the 3 second time limit.",
      };
    case "RUNTIME_ERROR":
      return {
        type: "error",
        message: status.message || "Your code crashed during execution. Check for runtime errors.",
      };
    case "COMPILATION_ERROR":
      return {
        type: "error",
        message: "Your code failed to compile. Check syntax and try again.",
      };
    default:
      return {
        type: "error",
        message: "Something went wrong while checking your solution.",
      };
  }
}
