import { describe, it, expect } from "vitest";
import { loadProjects, parseProject } from "@/lib/content";

/**
 * Projects seam (content/data): 5 Placeholder Projects must validate via the
 * shared Project Zod schema and load as a deterministic list.
 * Vocabulary: GLOSSARY (Project, Placeholder).
 */
describe("Projects loading and validation", () => {
  it("loads exactly 5 Placeholder Projects", () => {
    const projects = loadProjects();
    expect(projects).toHaveLength(5);
  });

  it("every Project has title, description, status, technology stack and slug", () => {
    const projects = loadProjects();
    for (const p of projects) {
      expect(p.title.trim()).not.toBe("");
      expect(p.slug.trim()).not.toBe("");
      expect(p.description.trim()).not.toBe("");
      expect(p.status).toMatch(/^(active|maintenance|archived|idea|completed)$/);
      expect(p.technologies.length).toBeGreaterThanOrEqual(1);
      for (const tech of p.technologies) {
        expect(tech.trim()).not.toBe("");
      }
      // every stored Project must round-trip through the schema
      expect(() => parseProject(p)).not.toThrow();
    }
  });

  it("Project slugs are unique and URL-safe", () => {
    const projects = loadProjects();
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("external GitHub/demo links are valid absolute URLs when present", () => {
    const projects = loadProjects();
    for (const p of projects) {
      if (p.githubUrl !== undefined) {
        expect(() => new URL(p.githubUrl as string)).not.toThrow();
      }
      if (p.demoUrl !== undefined) {
        expect(() => new URL(p.demoUrl as string)).not.toThrow();
      }
    }
    // acceptance: projects should expose GitHub links (story 22)
    const withGithub = projects.filter((p) => p.githubUrl);
    expect(withGithub.length).toBeGreaterThanOrEqual(1);
  });

  it("at least one Project exposes a live demo link", () => {
    const projects = loadProjects();
    const withDemo = projects.filter((p) => p.demoUrl);
    expect(withDemo.length).toBeGreaterThanOrEqual(1);
  });

  it("rejects a Project with an unknown status", () => {
    expect(() =>
      parseProject({
        title: "Mystery",
        slug: "mystery",
        description: "desc",
        status: "unknown-status",
        technologies: ["TypeScript"],
        createdAt: "2026-01-01",
      }),
    ).toThrow();
  });

  it("rejects a Project missing title or description", () => {
    expect(() =>
      parseProject({
        slug: "no-title",
        description: "desc",
        status: "active",
        technologies: ["TypeScript"],
        createdAt: "2026-01-01",
      }),
    ).toThrow();
    expect(() =>
      parseProject({
        title: "No description",
        slug: "no-desc",
        status: "active",
        technologies: ["TypeScript"],
        createdAt: "2026-01-01",
      }),
    ).toThrow();
  });

  it("rejects a Project with an empty technology stack", () => {
    expect(() =>
      parseProject({
        title: "No stack",
        slug: "no-stack",
        description: "desc",
        status: "active",
        technologies: [],
        createdAt: "2026-01-01",
      }),
    ).toThrow();
  });

  it("rejects a Project with invalid GitHub/demo URLs", () => {
    expect(() =>
      parseProject({
        title: "Bad link",
        slug: "bad-link",
        description: "desc",
        status: "active",
        technologies: ["TypeScript"],
        githubUrl: "not-a-url",
        createdAt: "2026-01-01",
      }),
    ).toThrow();
    expect(() =>
      parseProject({
        title: "Bad demo",
        slug: "bad-demo",
        description: "desc",
        status: "active",
        technologies: ["TypeScript"],
        demoUrl: "not-a-url",
        createdAt: "2026-01-01",
      }),
    ).toThrow();
  });

  it("rejects a Project with an invalid createdAt date", () => {
    expect(() =>
      parseProject({
        title: "Bad date",
        slug: "bad-date",
        description: "desc",
        status: "active",
        technologies: ["TypeScript"],
        createdAt: "not-a-date",
      }),
    ).toThrow();
  });

  it("accepts a Project with an image field when present", () => {
    const parsed = parseProject({
      title: "With image",
      slug: "with-image",
      description: "desc",
      status: "active",
      technologies: ["Next.js"],
      image: "/images/placeholder.png",
      createdAt: "2026-01-01",
    });
    expect(parsed.image).toBe("/images/placeholder.png");
  });
});
