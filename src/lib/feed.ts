import type { BlogPost } from "./content";
import { site } from "./site";

/**
 * RSS 2.0 builder for Blog Posts (ticket #3, user stories #11–#12).
 * Pure string builder so it is unit-testable at the content seam; the
 * /feed.xml route handler wraps this with the right Content-Type.
 */

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildRssFeed(posts: BlogPost[], siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  const title = site.name;
  const description = site.description;
  const sorted = [...posts].sort(
    (a, b) => new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime(),
  );

  const items = sorted
    .map((post) => {
      const link = `${base}/blog/${post.slug}`;
      const pubDate = new Date(String(post.date)).toUTCString();
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid>${escapeXml(link)}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${escapeXml(post.summary)}</description>`,
        `      <category>${escapeXml(post.tags.join(", "))}</category>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(base)}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    `    <atom:link href="${escapeXml(`${base}/feed.xml`)}" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}
