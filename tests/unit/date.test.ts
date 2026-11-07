import { describe, it, expect } from "vitest";
import { formatDate, formatDateShort, formatDateTime } from "@/lib/date";

/**
 * Shared date helpers (finding 1): one source of truth for Blog Post,
 * Newsletter Issue, and Metric timestamp display formatting.
 */
describe("shared date helpers", () => {
  it("formats a date long-style (e.g. October 24, 2026)", () => {
    expect(formatDate("2026-10-24")).toContain("October");
    expect(formatDate("2026-10-24")).toContain("24");
    expect(formatDate("2026-10-24")).toContain("2026");
  });

  it("formats a date short-style as YYYY-MM-DD", () => {
    expect(formatDateShort("2026-10-24")).toBe("2026-10-24");
  });

  it("formats a timestamp with time-of-day visible", () => {
    const formatted = formatDateTime("2026-11-01T14:30:00.000Z");
    expect(formatted).toContain("November");
    expect(formatted).toContain("2026");
    expect(formatted).toMatch(/2:30/);
  });

  it("returns the raw string for invalid dates", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
    expect(formatDateShort("not-a-date")).toBe("not-a-date");
    expect(formatDateTime("not-a-date")).toBe("not-a-date");
  });
});
