"use client";

import { Moon, Sun } from "lucide-react";
import type { Theme } from "@/hooks/useTheme";

export default function ThemeToggleButton({ theme, onClick }: { theme: Theme; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 ring-1 ring-black/5 active:bg-neutral-50 dark:bg-neutral-800 dark:ring-white/10 dark:active:bg-neutral-700"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-400" />
      ) : (
        <Moon className="h-5 w-5 text-neutral-500" />
      )}
    </button>
  );
}
