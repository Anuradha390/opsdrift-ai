import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dim" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme?: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

function getStoredTheme(defaultTheme: Theme): Theme {
  if (typeof window === "undefined") return defaultTheme;
  const stored = window.localStorage.getItem("opsdrift-theme");
  return stored === "light" || stored === "dim" || stored === "dark" || stored === "system" ? stored : defaultTheme;
}

export function ThemeProvider({ children, defaultTheme = "light", switchable = false }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => switchable ? getStoredTheme(defaultTheme) : defaultTheme);

  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    const effective = theme === "system" ? (prefersDark ? "dark" : "light") : theme;
    root.dataset.theme = effective;
    root.classList.toggle("dark", effective === "dark");
    if (switchable) window.localStorage.setItem("opsdrift-theme", theme);
  }, [theme, switchable]);

  useEffect(() => {
    if (theme !== "system" || !window.matchMedia) return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      const effective = query.matches ? "dark" : "light";
      document.documentElement.dataset.theme = effective;
      document.documentElement.classList.toggle("dark", effective === "dark");
    };
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, [theme]);

  const toggleTheme = switchable ? () => setTheme(prev => prev === "dark" ? "light" : "dark") : undefined;

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, switchable }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
