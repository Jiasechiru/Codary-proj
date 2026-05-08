import { apiRequest } from "../lib/api";

export type Quiz = {
  id: number;
  moduleId: number;
  question: string;
  answerVariants: string[];
  correctAnswer: string;
};

export function getQuiz(quizId: number) {
  return apiRequest<Quiz>(`/quizzes/${quizId}`);
}

export function submitQuiz(quizId: number, answer: string) {
  return apiRequest<{ isCorrect: boolean }>(`/quizzes/${quizId}/submit`, {
    method: "POST",
    body: JSON.stringify({ answer }),
  });
}
