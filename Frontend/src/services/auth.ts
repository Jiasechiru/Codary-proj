import { apiRequest } from "../lib/api";

export type AuthUser = {
  id: number;
  username: string;
  totalPoints: number;
  level: string;
  daysStreak: number;
};

type AuthResponse = {
  user: AuthUser;
};

export function register(username: string, password: string) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function login(username: string, password: string) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function me() {
  return apiRequest<AuthResponse>("/auth/me");
}

export function logout() {
  return apiRequest<void>("/auth/logout", {
    method: "POST",
  });
}
