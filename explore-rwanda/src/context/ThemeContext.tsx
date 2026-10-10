import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Theme = "light" | "dark" | "system";

type ThemeCtx = {
  theme: Theme;
  /** The theme actually applied right now (resolves "system"). */
  resolved: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggle: () => void;
};

const STORAGE_KEY = "er.theme";
const Ctx = createContext<ThemeCtx | null>(null);

const readStored = (): Theme => {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* storage unavailable - fall back to system */
  }
  return "system";
};

const systemPrefersDark = (): boolean => {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
};

/**
 * Theme provider — light / dark / system. The chosen theme is stored and mirrored onto
 * <html data-theme="..."> so the CSS variables can switch. Default follows the OS.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => readStored());
  const [systemDark, setSystemDark] = useState<boolean>(() => systemPrefersDark());

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const resolved: "light" | "dark" = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  }, [resolved]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    // Briefly enable a color transition so the switch animates smoothly.
    const root = document.documentElement;
    root.classList.add("theme-anim");
    setTheme(resolved === "dark" ? "light" : "dark");
    window.setTimeout(() => root.classList.remove("theme-anim"), 260);
  }, [resolved, setTheme]);

  const value = useMemo(() => ({ theme, resolved, setTheme, toggle }), [theme, resolved, setTheme, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
