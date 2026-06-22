export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const PUBLIC_PATHS = ["/", "/login", "/register"];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname);
}

export function getStoredTheme(): Theme {
  return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
}

function setDarkClass(enabled: boolean) {
  document.documentElement.classList.toggle("dark", enabled);
}

export function applyTheme(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, theme);
  setDarkClass(theme === "dark");
}

export function syncThemeForPath(pathname: string) {
  if (isPublicPath(pathname)) {
    setDarkClass(false);
  } else {
    setDarkClass(getStoredTheme() === "dark");
  }
}
