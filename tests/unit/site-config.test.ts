import { describe, it, expect } from "vitest";
import { getSiteUrl, persona } from "@/lib/site";
import { NAV_LINKS } from "@/lib/nav";

describe("site config", () => {
  it("returns a site URL that defaults to localhost", () => {
    expect(getSiteUrl()).toBeTruthy();
    expect(() => new URL(getSiteUrl())).not.toThrow();
  });

  it("defines a Persona with name and role", () => {
    expect(persona.name).toBeTruthy();
    expect(persona.role).toBeTruthy();
    expect(persona.name).toBe("Atharva Tayade");
  });

  it("exposes navigation links for Home and About", () => {
    const hrefs = NAV_LINKS.map((l) => l.href);
    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/about");
  });
});
