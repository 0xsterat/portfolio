"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { NAV_LINKS, WORDMARK } from "@/lib/nav";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-[20px] backdrop-saturate-150 dark:bg-[#030711]/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          data-testid="wordmark"
          className="text-base font-semibold leading-none tracking-[0.01em] text-[#030711] dark:text-[#E1E7EF]"
        >
          {WORDMARK}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-sm leading-[1.43] transition-[color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-[#030711] dark:hover:text-[#E1E7EF] ${
                  isActive
                    ? "font-semibold text-[#030711] dark:text-[#E1E7EF]"
                    : "font-medium text-[#6B7280] dark:text-[#9CA3B0]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
            data-testid="menu-button"
            onClick={() => setOpen((v) => !v)}
            className="pressable rounded-full border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#030711] dark:border-[#1F2937] dark:text-[#E1E7EF] md:hidden"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            data-open="true"
            data-testid="mobile-nav"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -8, scale: 0.98, filter: "blur(8px)" }
            }
            animate={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
            }
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98, filter: "blur(8px)" }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            style={{ transformOrigin: "top right" }}
            className="border-t border-[#E5E7EB] bg-white/80 px-4 py-3 backdrop-blur-[20px] backdrop-saturate-150 md:hidden dark:border-[#1F2937] dark:bg-[#030711]/80"
          >
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`block rounded-md px-3 py-2 text-sm transition-[background-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#F3F4F6] dark:hover:bg-[#1F2937] ${
                        isActive
                          ? "font-semibold text-[#030711] dark:text-[#E1E7EF]"
                          : "font-medium text-[#374151] dark:text-[#E1E7EF]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
