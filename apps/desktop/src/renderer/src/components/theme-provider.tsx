import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  setTheme: (theme: Theme) => void;
  theme: Theme;
}

const initialState: ThemeProviderState = {
  setTheme: () => null,
  theme: "system",
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

const getSystemTheme = (): Exclude<Theme, "system"> =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const ThemeProvider = ({
  children,
  defaultTheme = "dark",
  storageKey = "electron-app-theme",
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme | null) ?? defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const activeTheme = theme === "system" ? getSystemTheme() : theme;

    root.classList.remove("light", "dark");
    root.classList.add(activeTheme);
  }, [theme]);

  const value = useMemo(
    () => ({
      setTheme: (nextTheme: Theme): void => {
        localStorage.setItem(storageKey, nextTheme);
        setTheme(nextTheme);
      },
      theme,
    }),
    [storageKey, theme],
  );

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
};

export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
