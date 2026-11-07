"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const current = theme ?? resolvedTheme ?? "dark";
  const next = current === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      data-testid="theme-toggle"
      onClick={() => setTheme(next)}
      className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-800 transition hover:border-accent dark:border-neutral-700 dark:text-neutral-100"
    >
      <span aria-hidden="true">{current === "dark" ? "🌙" : "☀️"}</span>
      <span className="hidden sm:inline">{current === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
