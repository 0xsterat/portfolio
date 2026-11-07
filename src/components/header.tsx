"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS, WORDMARK } from "@/lib/nav";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          data-testid="wordmark"
          className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-50"
        >
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            {WORDMARK}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-600 transition hover:text-accent dark:text-neutral-300"
            >
              {link.label}
            </Link>
          ))}
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
            className="rounded-md border border-neutral-300 px-3 py-1 text-sm dark:border-neutral-700 md:hidden"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          data-testid="mobile-nav"
          className="border-t border-neutral-200 px-4 py-3 md:hidden dark:border-neutral-800"
        >
          <ul className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded px-2 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
