/**
 * Shared date formatting — single source of truth for Blog Post dates,
 * Newsletter Issue dates, and Metric timestamps. UTC is used everywhere
 * so SSR and client hydration agree on the rendered value.
 */

/** Long date, e.g. "October 24, 2026". */
export function formatDate(date: string): string {
  const parsed = new Date(String(date));
  if (Number.isNaN(parsed.getTime())) return String(date);
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Short ISO date, e.g. "2026-10-24" (Newsletter Issues). */
export function formatDateShort(date: string): string {
  const parsed = new Date(String(date));
  if (Number.isNaN(parsed.getTime())) return String(date);
  return parsed.toISOString().slice(0, 10);
}

/** Full date + time-of-day, e.g. "November 1, 2026 at 2:30 PM" (Metrics). */
export function formatDateTime(date: string): string {
  const parsed = new Date(String(date));
  if (Number.isNaN(parsed.getTime())) return String(date);
  return parsed.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });
}
