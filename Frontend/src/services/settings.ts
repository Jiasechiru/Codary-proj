import { apiRequest } from "../lib/api";

export type UserSettingsResponse = {
  id: number;
  userId: number;
  settings: {
    theme?: "dark" | "light";
    language?: "ru" | "en";
    notifications?: boolean;
    aiEnabled?: boolean;
    autoSuggestions?: boolean;
    dailyReminders?: boolean;
  };
};

export function getSettings() {
  return apiRequest<UserSettingsResponse | null>("/users/settings");
}

export function updateSettings(settings: UserSettingsResponse["settings"]) {
  return apiRequest<UserSettingsResponse>("/users/settings", {
    method: "PUT",
    body: JSON.stringify({ settings }),
  });
}
