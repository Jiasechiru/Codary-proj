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

export function getCourseGroups() {
  return apiRequest<CourseGroup[]>("/courses/groups");
}

export function getCourses() {
  return apiRequest<Course[]>("/courses");
}

export function getCourseModules(courseId: number) {
  return apiRequest<CourseModule[]>(`/courses/${courseId}/modules`);
}
