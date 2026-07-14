import { create } from "zustand";

export type Theme = "dark" | "light";

const STORAGE_KEY = "astara-theme";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

function applyThemeClass(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;

  return "dark";
}

const initialTheme = getInitialTheme();
applyThemeClass(initialTheme);

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,
  toggleTheme: () => {
    const next: Theme = get().theme === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    applyThemeClass(next);
    set({ theme: next });
  },
  setTheme: (theme) => {
    localStorage.setItem(STORAGE_KEY, theme);
    applyThemeClass(theme);
    set({ theme });
  },
}));
