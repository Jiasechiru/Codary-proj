import { apiRequest } from "../lib/api";

export type DailyChallengeLanguage = "javascript" | "c";

export type DailyChallenge = {
  id: number;
  title: string;
  description: string;
  language: DailyChallengeLanguage;
  difficulty: string;
  starterCode: string;
  tests: Array<{ input: string; expectedOutput: string }>;
};

export type DailyChallengeResponse = {
  challenge: DailyChallenge;
  completedToday: boolean;
};

export type DailyChallengeStatus = {
  completedToday: boolean;
};

export type DailyChallengeSubmitResult = {
  status: string;
  isCorrect: boolean;
  alreadyCompleted: boolean;
  completedToday: boolean;
  message?: string;
};

export function getDailyChallengeStatus() {
  return apiRequest<DailyChallengeStatus>("/daily-challenge/status");
}

export function getDailyChallenge(language: DailyChallengeLanguage) {
  return apiRequest<DailyChallengeResponse>(`/daily-challenge/${language}`);
}

export function submitDailyChallenge(language: DailyChallengeLanguage, code: string) {
  return apiRequest<DailyChallengeSubmitResult>("/daily-challenge/submit", {
    method: "POST",
    body: JSON.stringify({ language, code }),
  });
}
