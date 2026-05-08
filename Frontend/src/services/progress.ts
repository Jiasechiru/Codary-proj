import { apiRequest } from "../lib/api";

export type CourseProgress = {
  courseId: number;
  percentage: number;
};

export type ProgressOverview = {
  courses: Array<{ courseId: number; percentage: number }>;
  modules: Array<{ moduleId: number; isCompleted: boolean }>;
  tasks: Array<{ taskId: number; isCompleted: boolean }>;
  quizzes: Array<{ quizId: number; isCompleted: boolean }>;
};

export function getCourseProgress(courseId: number) {
  return apiRequest<CourseProgress>(`/progress/course/${courseId}`);
}

export function getProgressOverview() {
  return apiRequest<ProgressOverview>("/progress/overview");
}
