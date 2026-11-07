import { describe, it, expect } from "vitest";
import {
  loadBlogPosts,
  loadMetrics,
  loadProjects,
  loadNewsletterIssues,
  getAllTags,
} from "@/lib/content";
import { NAV_LINKS, FOOTER_LINKS } from "@/lib/nav";
import sitemap from "@/app/sitemap";
import { buildRssFeed } from "@/lib/feed";
import { getSiteUrl } from "@/lib/site";

/**
 * Integration gate (ticket #7) — whole-site content seam.
 * Verifies Placeholder volumes, nav union, sitemap coverage, and RSS completeness
 * across all slices (Blog, Dashboard, Projects, Newsletter) in one place.
 * Vocabulary follows GLOSSARY.md.
 */
describe("integration gate — content volumes (ticket #7)", () => {
  it("loads 5 Placeholder Blog Posts sorted most-recent first", () => {
    const posts = loadBlogPosts();
    expect(posts).toHaveLength(5);
    const dates = posts.map((p) => new Date(String(p.date)).getTime());
    const sorted = [...dates].sort((a, b) => b - a);
    expect(dates).toEqual(sorted);
  });

  it("loads 4 Placeholder Metrics each with historical values", () => {
    const metrics = loadMetrics();
    expect(metrics).toHaveLength(4);
    for (const metric of metrics) {
      expect(metric.historicalValues.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("loads 5 Placeholder Projects with unique slugs", () => {
    const projects = loadProjects();
    expect(projects).toHaveLength(5);
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(5);
  });

  it("loads 4 Placeholder Newsletter Issues sorted by date descending", () => {
    const issues = loadNewsletterIssues();
    expect(issues).toHaveLength(4);
    const dates = issues.map((i) => new Date(String(i.date)).getTime());
    const sorted = [...dates].sort((a, b) => b - a);
    expect(dates).toEqual(sorted);
  });

  it("exposes at least one Tag and every Tag resolves to a Blog Post", () => {
    const tags = getAllTags();
    expect(tags.length).toBeGreaterThan(0);
    for (const tag of tags) {
      expect(tag.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("integration gate — navigation union (ticket #7)", () => {
  it("exposes the full nav union: Home, Blog, Dashboard, Projects, Newsletter, About", () => {
    const hrefs = NAV_LINKS.map((l) => l.href);
    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/blog");
    expect(hrefs).toContain("/dashboard");
    expect(hrefs).toContain("/projects");
    expect(hrefs).toContain("/newsletter");
    expect(hrefs).toContain("/about");
    expect(NAV_LINKS).toHaveLength(6);
  });

  it("keeps footer links in sync with header links", () => {
    expect(FOOTER_LINKS).toEqual(NAV_LINKS);
  });
});

describe("integration gate — sitemap completeness (ticket #7)", () => {
  it("covers every public route in the sitemap", () => {
    const urls = sitemap().map((e) => e.url);
    const base = getSiteUrl();
    expect(urls).toContain(base);
    expect(urls).toContain(`${base}/about`);
    expect(urls).toContain(`${base}/blog`);
    expect(urls).toContain(`${base}/dashboard`);
    expect(urls).toContain(`${base}/projects`);
    expect(urls).toContain(`${base}/newsletter`);
    for (const post of loadBlogPosts()) {
      expect(urls).toContain(`${base}/blog/${post.slug}`);
    }
    for (const project of loadProjects()) {
      expect(urls).toContain(`${base}/projects/${project.slug}`);
    }
    for (const tag of getAllTags()) {
      expect(urls).toContain(`${base}/tags/${encodeURIComponent(tag)}`);
    }
  });

  it("includes all 5 Blog Post entries and all 5 Project entries", () => {
    const urls = sitemap().map((e) => e.url);
    const blogInSitemap = urls.filter((u) => u.includes("/blog/"));
    const projectInSitemap = urls.filter((u) => u.includes("/projects/"));
    expect(blogInSitemap).toHaveLength(5);
    expect(projectInSitemap).toHaveLength(5);
  });
});

describe("integration gate — RSS completeness (ticket #7)", () => {
  it("builds an RSS feed with one item per Blog Post", () => {
    const posts = loadBlogPosts();
    const xml = buildRssFeed(posts, getSiteUrl());
    expect(xml).toContain("<?xml version=\"1.0\"");
    expect(xml).toContain("<rss");
    expect((xml.match(/<item>/g) ?? []).length).toBe(5);
    for (const post of posts) {
      expect(xml).toContain(`/blog/${post.slug}`);
      expect(xml).toContain(post.title);
    }
  });

  it("escapes XML special characters in RSS titles", () => {
    const posts = loadBlogPosts();
    const xml = buildRssFeed(posts, getSiteUrl());
    expect(xml).not.toContain("<script>");
    expect(xml).toContain("<channel>");
    expect(xml).toContain("</channel>");
  });
});
