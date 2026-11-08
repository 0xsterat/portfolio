import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { formatDate } from "./date";
import { loadMetrics } from "./metrics";
import { loadProjects } from "./projects";
import { loadNewsletterIssues } from "./newsletter";

/**
 * Content seam — Blog Post / Tag schemas + loaders (slice #3).
 * Metric / Project / Newsletter Issue slices live in their own focused
 * modules (src/lib/metrics.ts, src/lib/projects.ts, src/lib/newsletter.ts)
 * and are re-exported here so existing imports from "@/lib/content" keep
 * working (finding 4). Vocabulary follows GLOSSARY.md; all sample content
 * is independently written Placeholder content (ADR-0002).
 */

/**
 * Backward-compat re-exports (finding 4). Tests and pages that import
 * from "@/lib/content" continue to resolve; new code should import from
 * the focused modules directly.
 */
export { MetricSchema, parseMetric, loadMetrics } from "./metrics";
export type { Metric } from "./metrics";
export { ProjectStatus, ProjectSchema, parseProject, loadProjects, getProjectBySlug } from "./projects";
export type { Project } from "./projects";
export {
  NewsletterIssueSchema,
  parseNewsletterIssue,
  loadNewsletterIssues,
} from "./newsletter";
export type { NewsletterIssue } from "./newsletter";

// Re-export shared date helpers for callers already importing from here.
export { formatDate, formatDateShort, formatDateTime } from "./date";

// --- Blog Post ---

export const BlogPostSchema = z.object({
  title: z.string().min(1, "Blog Post title is required"),
  date: z
    .string()
    .min(1)
    .refine((v) => !Number.isNaN(Date.parse(v)), "Blog Post date must be a valid date"),
  slug: z.string().min(1, "Blog Post slug is required"),
  tags: z.array(z.string().min(1)).min(1, "Blog Post needs at least one Tag"),
  summary: z.string().min(1, "Blog Post summary is required"),
  draft: z.boolean().optional(),
  persona: z.string().optional(),
});

export type BlogPost = z.infer<typeof BlogPostSchema> & {
  content: string;
};

export function parseBlogPost(input: unknown) {
  return BlogPostSchema.parse(input);
}

// --- Blog Loaders ---

export function loadBlogPosts(): BlogPost[] {
  const dir = path.join(process.cwd(), "src", "content", "blog");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    const parsed = parseBlogPost(data);
    return { ...parsed, content: content.trim() };
  });
  return posts.sort(
    (a, b) => new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime(),
  );
}

/**
 * Blog Post / Tag helpers (ticket #3): pure lookups over the Placeholder
 * Blog Post files. Loaders return most-recent-first order (loadBlogPosts
 * sorts descending); Tag matching is case-insensitive so /tags/WEB and
 * /tags/web resolve to the same Blog Posts.
 */
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  if (!slug) return undefined;
  return loadBlogPosts().find((post) => post.slug === slug);
}

export function getAllTags(): string[] {
  const seen = new Set<string>();
  for (const post of loadBlogPosts()) {
    for (const tag of post.tags) {
      seen.add(tag.trim());
    }
  }
  return [...seen].sort((a, b) => a.localeCompare(b));
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  const needle = tag.trim().toLowerCase();
  if (!needle) return [];
  return loadBlogPosts().filter((post) =>
    post.tags.some((t) => t.trim().toLowerCase() === needle),
  );
}

const WORDS_PER_MINUTE = 200;

/**
 * Estimated reading time in minutes (200 wpm, 1-minute floor).
 * Counts words outside fenced code blocks so code-heavy Blog Posts
 * don't inflate the estimate, but still floors at 1 minute.
 */
export function estimateReadingTime(content: string): number {
  const withoutCode = content.replace(/```[\s\S]*?```/g, " ");
  const words = withoutCode.split(/\s+/).filter((w) => w.length > 0).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/**
 * Display-ready Blog Post date (e.g. "October 24, 2026").
 * Delegates to the shared helper in src/lib/date.ts (finding 1).
 */
export function formatBlogDate(date: string): string {
  return formatDate(date);
}

export function validateAllContent() {
  return {
    blogPosts: loadBlogPosts().map((p) => {
      const { content: _content, ...rest } = p;
      return parseBlogPost(rest);
    }),
    metrics: loadMetrics(),
    projects: loadProjects(),
    newsletterIssues: loadNewsletterIssues(),
  };
}
