import { apiRequest } from "../lib/api";

export type LeaderboardEntry = {
  id: number;
  username: string;
  totalPoints: number;
  level: string;
};

export function getLeaderboard() {
  return apiRequest<LeaderboardEntry[]>("/leaderboard");
}
