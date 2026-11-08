import { describe, it, expect } from "vitest";
import { renderMarkdownToHtml } from "@/lib/markdown";
import { buildRssFeed } from "@/lib/feed";
import type { BlogPost } from "@/lib/content";

/**
 * Blog seam (ticket #3): markdown rendering (code highlighting) and the
 * RSS feed builder. Vocabulary follows GLOSSARY.md (Blog Post, Tag).
 */
describe("renderMarkdownToHtml", () => {
  it("renders headings and paragraphs", async () => {
    const html = await renderMarkdownToHtml("# Hello\n\nThis is a paragraph.\n");
    expect(html).toContain("<h1");
    expect(html).toContain("Hello");
    expect(html).toContain("<p>");
  });

  it("renders fenced code blocks with syntax highlighting classes", async () => {
    const html = await renderMarkdownToHtml(
      "```ts\nconst x: number = 42;\n```\n",
    );
    expect(html).toContain("<pre");
    expect(html).toContain("language-ts");
    // rehype-highlight annotates tokens with hljs classes.
    expect(html).toMatch(/hljs/);
  });

  it("escapes raw HTML instead of injecting it", async () => {
    const html = await renderMarkdownToHtml("<script>alert(1)</script>");
    expect(html).not.toContain("<script>");
    // Escaped as text (either &lt; or &#x3C;), never as a live element.
    expect(html).toMatch(/(&lt;|&#x3[cC];)/);
    expect(html).toContain("script");
  });
});

describe("buildRssFeed", () => {
  const posts: BlogPost[] = [
    {
      title: "Newest Post",
      date: "2026-10-24",
      slug: "newest-post",
      tags: ["web"],
      summary: "Newest summary",
      content: "Body",
    },
    {
      title: "Older & Tricky <Post>",
      date: "2026-08-14",
      slug: "older-post",
      tags: ["web"],
      summary: "Older summary with & entity",
      content: "Body",
    },
  ];

  it("builds a valid RSS feed with a channel and one item per Blog Post", () => {
    const xml = buildRssFeed(posts, "http://localhost:3000");
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<rss");
    expect(xml).toContain("<channel>");
    expect(xml).toContain("Newest Post");
    expect(xml).toContain("Older &amp; Tricky &lt;Post&gt;");
    expect(xml).toContain("http://localhost:3000/blog/newest-post");
    expect(xml).toContain("http://localhost:3000/blog/older-post");
    expect(xml).toContain("<pubDate>");
    expect(xml).toContain("<guid>");
    // Most recent Blog Post first.
    expect(xml.indexOf("newest-post")).toBeLessThan(xml.indexOf("older-post"));
  });

  it("escapes XML entities in titles and summaries", () => {
    const xml = buildRssFeed(posts, "http://localhost:3000");
    expect(xml).not.toContain("<Post>");
    expect(xml).toContain("Older summary with &amp; entity");
  });

  it("handles an empty Blog Post list", () => {
    const xml = buildRssFeed([], "http://localhost:3000");
    expect(xml).toContain("<channel>");
    expect(xml).not.toContain("<item>");
  });
});
