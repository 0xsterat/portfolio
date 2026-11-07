import { describe, it, expect } from "vitest";
import {
  loadBlogPosts,
  getBlogPostBySlug,
  getAllTags,
  getBlogPostsByTag,
  estimateReadingTime,
  formatBlogDate,
} from "@/lib/content";

/**
 * Blog seam (ticket #3): Blog Post and Tag loading behavior.
 * Vocabulary follows GLOSSARY.md (Blog Post, Tag). All fixtures are
 * Placeholder content — the real files in src/content/blog.
 */
describe("Blog Post and Tag loading", () => {
  it("loads 5 Placeholder Blog Posts", () => {
    const posts = loadBlogPosts();
    expect(posts).toHaveLength(5);
  });

  it("returns Blog Posts sorted by date descending (most recent first)", () => {
    const posts = loadBlogPosts();
    const dates = posts.map((p) => new Date(String(p.date)).getTime());
    const sorted = [...dates].sort((a, b) => b - a);
    expect(dates).toEqual(sorted);
    // Most recent Placeholder Blog Post is the October static-content note.
    expect(posts[0].slug).toBe("getting-started-with-static-content");
    expect(posts[posts.length - 1].slug).toBe("theming-without-flash");
  });

  it("finds a Blog Post by slug", () => {
    const post = getBlogPostBySlug("getting-started-with-static-content");
    expect(post).toBeDefined();
    expect(post?.title).toBe("Getting started with static content");
    expect(post?.tags).toContain("web");
    expect(post?.content).toContain("Static content");
  });

  it("returns undefined for an unknown Blog Post slug", () => {
    expect(getBlogPostBySlug("no-such-blog-post")).toBeUndefined();
    expect(getBlogPostBySlug("")).toBeUndefined();
  });

  it("collects every unique Tag across Blog Posts, sorted", () => {
    const tags = getAllTags();
    expect(tags).toEqual([
      "accessibility",
      "dashboard",
      "metrics",
      "nextjs",
      "static-sites",
      "testing",
      "theming",
      "typescript",
      "web",
    ]);
  });

  it("lists only Blog Posts with the requested Tag, most recent first", () => {
    const webPosts = getBlogPostsByTag("web");
    expect(webPosts.map((p) => p.slug)).toEqual([
      "getting-started-with-static-content",
      "accessible-navigation-patterns",
    ]);
    for (const post of webPosts) {
      expect(post.tags).toContain("web");
    }
  });

  it("matches Tags case-insensitively", () => {
    const upper = getBlogPostsByTag("WEB").map((p) => p.slug);
    const lower = getBlogPostsByTag("web").map((p) => p.slug);
    expect(upper).toEqual(lower);
  });

  it("returns no Blog Posts for an unknown Tag", () => {
    expect(getBlogPostsByTag("no-such-tag")).toEqual([]);
    expect(getBlogPostsByTag("")).toEqual([]);
  });

  it("estimates reading time at 200 words per minute with a 1-minute floor", () => {
    expect(estimateReadingTime("")).toBe(1);
    expect(estimateReadingTime(Array(100).fill("word").join(" "))).toBe(1);
    expect(estimateReadingTime(Array(200).fill("word").join(" "))).toBe(1);
    expect(estimateReadingTime(Array(400).fill("word").join(" "))).toBe(2);
    expect(estimateReadingTime(Array(601).fill("word").join(" "))).toBe(4);
  });

  it("formats a Blog Post date for display", () => {
    expect(formatBlogDate("2026-10-24")).toContain("October");
    expect(formatBlogDate("2026-10-24")).toContain("24");
    expect(formatBlogDate("2026-10-24")).toContain("2026");
  });
});
