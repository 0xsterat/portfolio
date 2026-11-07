import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Global loading/error boundaries (spec: "404 (+ loading/error states)").
 * File-level guard at the App Router seam: the boundaries must exist with
 * stable data-testids so Playwright and users can observe them.
 */
describe("global loading/error boundaries", () => {
  it("defines a loading boundary with a global-loading testid", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src", "app", "loading.tsx"),
      "utf-8",
    );
    expect(source).toContain("global-loading");
    expect(source).toContain("export default function");
  });

  it("defines an error boundary with a global-error testid and reset retry", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src", "app", "error.tsx"),
      "utf-8",
    );
    expect(source).toContain("global-error");
    expect(source).toContain('"use client"');
    expect(source).toContain("reset");
  });
});
