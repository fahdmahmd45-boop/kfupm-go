"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "kfupm-go:theme";

export type Theme = "beige" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("beige");

  useEffect(() => {
    let initial: Theme = "beige";
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "dark" || stored === "beige") initial = stored;
    } catch {
      // localStorage unavailable — fall back to default theme
    }
    // Reads the persisted theme and applies it once on mount — an
    // intentional external-system sync, not a state cascade.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "beige" : "dark";
      applyTheme(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore write failures (private browsing, quota, etc.)
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
