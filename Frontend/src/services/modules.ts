import { apiRequest } from "../lib/api";

export type ModuleDetails = {
  id: number;
  courseId: number;
  title: string;
  orderIndex: number;
  theory: { id: number; moduleId: number; content: string; contentRu: string | null } | null;
  tasks: Array<{ id: number; title: string; description: string; starterCode: string; difficulty: string }>;
  quizzes: Array<{ id: number; question: string; questionRu: string | null; answerVariants: string[]; correctAnswer: string }>;
};

export function getModule(moduleId: number) {
  return apiRequest<ModuleDetails | null>(`/modules/${moduleId}`);
}
