import { z } from "zod";
import { readJson } from "./data";

/**
 * Newsletter Issue slice — Newsletter Issue schema + loader (finding 4: split
 * from content.ts). Vocabulary follows GLOSSARY.md; all sample content is
 * independently written Placeholder content (ADR-0002).
 */

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

export function loadNewsletterIssues(): NewsletterIssue[] {
  const raw = readJson<unknown>("data/newsletter.json");
  const list = Array.isArray(raw) ? raw : [raw];
  return list
    .map((i) => parseNewsletterIssue(i))
    .sort(
      (a, b) => new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime(),
    );
}
