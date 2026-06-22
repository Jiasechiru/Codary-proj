import { apiRequest } from "../lib/api";

export type CourseGroup = {
  id: number;
  title: string;
  type: string;
  description: string | null;
};

export type Course = {
  id: number;
  courseGroupId: number;
  title: string;
  description: string | null;
  language: string;
  level: string;
  points: number;
  courseGroup?: CourseGroup;
};

export type CourseModule = {
  id: number;
  courseId: number;
  title: string;
  orderIndex: number;
  theory: { id: number; moduleId: number; content: string } | null;
};

export type CourseModuleStatus = {
  id: number;
  title: string;
  orderIndex: number;
  isCompleted: boolean;
  isLocked: boolean;
  quizId: number | null;
  taskId: number | null;
  quizCompleted: boolean;
  taskCompleted: boolean;
};

export type CourseDetails = {
  enrolled: boolean;
  course: Course & { percentage: number };
  modules: CourseModuleStatus[];
};

export type CourseEnrollment = {
  courseId: number;
  enrolled: boolean;
  percentage: number;
  alreadyEnrolled?: boolean;
};

export function getCourseGroups() {
  return apiRequest<CourseGroup[]>("/courses/groups");
}

export function getCourses() {
  return apiRequest<Course[]>("/courses");
}

export function getCourseModules(courseId: number) {
  return apiRequest<CourseModule[]>(`/courses/${courseId}/modules`);
}

export function getCourseDetails(courseId: number) {
  return apiRequest<CourseDetails>(`/courses/${courseId}/details`);
}

export function enrollCourse(courseId: number) {
  return apiRequest<CourseEnrollment>(`/courses/${courseId}/enroll`, {
    method: "POST",
  });
}
