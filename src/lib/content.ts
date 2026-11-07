import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/**
 * Content seam — Placeholder Blog Post / Metric / Project / Newsletter Issue
 * schemas + loaders. Vocabulary follows GLOSSARY.md; all sample content is
 * independently written Placeholder content (ADR-0002).
 */

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

// --- Metric ---

export const MetricSchema = z.object({
  name: z.string().min(1, "Metric name is required"),
  value: z.number().nonnegative("Metric value must be non-negative"),
  unit: z.string().min(1, "Metric unit is required"),
  category: z.string().min(1, "Metric category is required"),
  source: z.string().min(1, "Metric source is required"),
  timestamp: z.string().refine(
    (v) => !Number.isNaN(Date.parse(v)),
    "Metric timestamp must be a valid date",
  ),
  historicalValues: z
    .array(
      z.object({
        value: z.number().nonnegative("Metric historical value must be non-negative"),
        timestamp: z.string().refine(
          (v) => !Number.isNaN(Date.parse(v)),
          "Metric historical timestamp must be a valid date",
        ),
      }),
    )
    .min(1, "Metric needs at least one historical value"),
});

export type Metric = z.infer<typeof MetricSchema>;

export function parseMetric(input: unknown) {
  return MetricSchema.parse(input);
}

// --- Project ---

const ProjectStatus = z.enum([
  "active",
  "maintenance",
  "archived",
  "idea",
  "completed",
]);

export const ProjectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  slug: z.string().min(1, "Project slug is required"),
  description: z.string().min(1, "Project description is required"),
  status: ProjectStatus,
  technologies: z.array(z.string().min(1)).min(1, "Project needs technologies"),
  image: z.string().optional(),
  githubUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  createdAt: z.string().refine(
    (v) => !Number.isNaN(Date.parse(v)),
    "Project createdAt must be a valid date",
  ),
});

export type Project = z.infer<typeof ProjectSchema>;

export function parseProject(input: unknown) {
  return ProjectSchema.parse(input);
}

// --- Newsletter Issue ---

export const NewsletterIssueSchema = z.object({
  title: z.string().min(1, "Newsletter Issue title is required"),
  date: z
    .string()
    .min(1)
    .refine((v) => !Number.isNaN(Date.parse(v)), "Newsletter Issue date must be a valid date"),
  description: z.string().min(1, "Newsletter Issue description is required"),
  url: z.string().url("Newsletter Issue url must be a valid URL"),
});

export type NewsletterIssue = z.infer<typeof NewsletterIssueSchema>;

export function parseNewsletterIssue(input: unknown) {
  return NewsletterIssueSchema.parse(input);
}

// --- Loaders ---

function readJson<T>(relativePath: string): T {
  const filePath = path.join(process.cwd(), "src", relativePath);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

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

export function loadMetrics(): Metric[] {
  const raw = readJson<unknown>("data/metrics.json");
  const list = Array.isArray(raw) ? raw : [raw];
  return list.map((m) => parseMetric(m));
}

export function loadProjects(): Project[] {
  const raw = readJson<unknown>("data/projects.json");
  const list = Array.isArray(raw) ? raw : [raw];
  return list.map((p) => parseProject(p));
}

export function getProjectBySlug(slug: string): Project | undefined {
  return loadProjects().find((p) => p.slug === slug);
}

export function loadNewsletterIssues(): NewsletterIssue[] {
  const raw = readJson<unknown>("data/newsletter.json");
  const list = Array.isArray(raw) ? raw : [raw];
  return list
    .map((i) => parseNewsletterIssue(i))
    .sort(
      (a, b) => new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime(),
    );
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
