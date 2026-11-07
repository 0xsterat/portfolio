import { describe, it, expect } from "vitest";
import {
  parseBlogPost,
  parseMetric,
  parseProject,
  parseNewsletterIssue,
  validateAllContent,
} from "@/lib/content";

/**
 * Content seam: Blog Post / Metric / Project / Newsletter Issue files must
 * validate against schemas. Uses GLOSSARY vocabulary for test naming.
 */
describe("content scaffolding validation", () => {
  it("validates every Placeholder Blog Post file against the Blog Post schema", () => {
    const posts = validateAllContent().blogPosts;
    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      expect(() => parseBlogPost(post)).not.toThrow();
    }
  });

  it("rejects a Blog Post missing required fields", () => {
    expect(() =>
      parseBlogPost({ title: "Incomplete", date: "2026-01-01" }),
    ).toThrow();
  });

  it("rejects a Blog Post with an invalid date", () => {
    expect(() =>
      parseBlogPost({
        title: "Bad date",
        date: "not-a-date",
        slug: "bad-date",
        tags: ["test"],
        summary: "summary",
      }),
    ).toThrow();
  });

  it("validates every Placeholder Metric against the Metric schema", () => {
    const metrics = validateAllContent().metrics;
    expect(metrics.length).toBeGreaterThan(0);
    for (const metric of metrics) {
      expect(() => parseMetric(metric)).not.toThrow();
    }
  });

  it("rejects a Metric with a negative value or missing history", () => {
    expect(() =>
      parseMetric({
        name: "Broken Metric",
        value: -1,
        unit: "widgets",
        category: "test",
        source: "placeholder",
        timestamp: "2026-01-01T00:00:00.000Z",
        historicalValues: [{ value: -1, timestamp: "2026-01-01T00:00:00.000Z" }],
      }),
    ).toThrow();
  });

  it("validates every Placeholder Project against the Project schema", () => {
    const projects = validateAllContent().projects;
    expect(projects.length).toBeGreaterThan(0);
    for (const project of projects) {
      expect(() => parseProject(project)).not.toThrow();
    }
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

  it("validates every Placeholder Newsletter Issue against the Newsletter Issue schema", () => {
    const issues = validateAllContent().newsletterIssues;
    expect(issues.length).toBeGreaterThan(0);
    for (const issue of issues) {
      expect(() => parseNewsletterIssue(issue)).not.toThrow();
    }
  });

  it("rejects a Newsletter Issue without an external Substack URL", () => {
    expect(() =>
      parseNewsletterIssue({
        title: "Missing link",
        date: "2026-01-01",
        description: "desc",
        url: "not-a-url",
      }),
    ).toThrow();
  });

  it("returns Blog Posts sorted by date descending", () => {
    const { blogPosts } = validateAllContent();
    const dates = blogPosts.map((p) => new Date(String(p.date)).getTime());
    const sorted = [...dates].sort((a, b) => b - a);
    expect(dates).toEqual(sorted);
  });

  it("returns Metrics with historical trends for the Dashboard", () => {
    const { metrics } = validateAllContent();
    for (const metric of metrics) {
      expect(metric.historicalValues.length).toBeGreaterThanOrEqual(1);
    }
  });
});
