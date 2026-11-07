import { z } from "zod";
import { readJson } from "./data";

/**
 * Project slice — Project schema + loaders (finding 4: split from content.ts).
 * Vocabulary follows GLOSSARY.md; all sample content is independently
 * written Placeholder content (ADR-0002).
 */

export const ProjectStatus = z.enum([
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

export function loadProjects(): Project[] {
  const raw = readJson<unknown>("data/projects.json");
  const list = Array.isArray(raw) ? raw : [raw];
  return list.map((p) => parseProject(p));
}

export function getProjectBySlug(slug: string): Project | undefined {
  return loadProjects().find((p) => p.slug === slug);
}
