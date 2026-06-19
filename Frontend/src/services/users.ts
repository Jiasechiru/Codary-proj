import { apiRequest } from "../lib/api";

export type UserProfile = {
  id: number;
  username: string;
  totalPoints: number;
  level: string;
  daysStreak: number;
  completedTasks: number;
  totalTimeSpentSeconds: number;
  achievements: Array<{
    id: number;
    title: string;
    description: string;
  }>;
  enrolledCourses: Array<{
    courseId: number;
    percentage: number;
    startDate: string | null;
    endDate: string | null;
    title: string;
    description: string | null;
    level: string;
    language: string;
    groupTitle: string | null;
  }>;
};

export type UserActivity = {
  id: number;
  date: string;
  timeSpentSeconds: number;
};

export function getUserProfile() {
  return apiRequest<UserProfile | null>("/users/profile");
}

export function getUserActivity() {
  return apiRequest<UserActivity[]>("/users/activity");
}
