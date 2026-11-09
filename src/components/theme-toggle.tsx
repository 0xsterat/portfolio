"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const current = theme ?? resolvedTheme ?? "dark";
  const next = current === "dark" ? "light" : "dark";

  useEffect(() => {
    if (!isTransitioning) return;
    const id = setTimeout(() => setIsTransitioning(false), 150);
    return () => clearTimeout(id);
  }, [isTransitioning]);

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      data-testid="theme-toggle"
      onClick={() => {
        setIsTransitioning(true);
        setTheme(next);
      }}
      className="pressable inline-flex h-10 items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-[#030711] hover:border-[#030711] dark:border-[#1F2937] dark:bg-[#030711] dark:text-[#E1E7EF] dark:hover:border-[#9CA3B0]"
    >
      <span aria-hidden="true" className={`theme-icon ${isTransitioning ? "is-transitioning" : ""}`}>
        {current === "dark" ? "🌙" : "☀️"}
      </span>
      <span className="hidden sm:inline">{current === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
