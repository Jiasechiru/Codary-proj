import { apiRequest } from "../lib/api";

export type Quiz = {
  id: number;
  moduleId: number;
  question: string;
  questionRu: string | null;
  answerVariants: string[];
  correctAnswer: string;
};

export type ModuleQuizQuestion = {
  id: number;
  question: string;
  questionRu: string | null;
  answerVariants: string[];
};

export type ModuleQuiz = {
  moduleId: number;
  isCompleted: boolean;
  questions: ModuleQuizQuestion[];
};

export type ModuleQuizResult = {
  passed: boolean;
  correct: number;
  total: number;
  required: number;
};

export type ModuleQuizAnswer = {
  quizId: number;
  answer: string;
};

export function getModuleQuiz(moduleId: number) {
  return apiRequest<ModuleQuiz>(`/quizzes/module/${moduleId}`);
}

export function submitModuleQuiz(moduleId: number, answers: ModuleQuizAnswer[]) {
  return apiRequest<ModuleQuizResult>(`/quizzes/module/${moduleId}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
}
