import type { Page } from "@playwright/test";

/**
 * Shared console-error watcher for route smoke tests (finding 3).
 * Captures console errors + page errors so each test can assert a clean
 * console with `expect(errors, "...").toEqual([])`.
 */
export function watchConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));
  return errors;
}
