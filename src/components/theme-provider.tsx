import { createContext, useContext, useEffect, type ReactNode } from "react";

export type Theme = "light" | "dark" | "system";

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = "ui-theme";

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

function applyLight() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("dark");
  root.classList.add("light");
  root.style.colorScheme = "light";
}

/** App is light-only — dark/system preferences are ignored and overwritten. */
export function ThemeProvider({ children }: { children: ReactNode; defaultTheme?: Theme }) {
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, "light");
    applyLight();
  }, []);

  const value: ThemeProviderState = {
    theme: "light",
    resolvedTheme: "light",
    setTheme: () => {
      localStorage.setItem(STORAGE_KEY, "light");
      applyLight();
    },
    toggleTheme: () => {
      localStorage.setItem(STORAGE_KEY, "light");
      applyLight();
    },
  };

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeProviderContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

/* The pre-paint theme init script lives inline in index.html so the correct
   theme class is applied before first render (no FOUC). Keep it in sync with
   STORAGE_KEY above. */
