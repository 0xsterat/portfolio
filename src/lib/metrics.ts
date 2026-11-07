import { z } from "zod";
import { readJson } from "./data";

/**
 * Metric slice — Metric schema + loader (finding 4: split from content.ts).
 * Vocabulary follows GLOSSARY.md; all sample content is independently
 * written Placeholder content (ADR-0002).
 *
 * Note: Metric `category` is a spec field (story 15) that groups Metrics
 * by category. It is distinct from the Glossary `Tag` grouping which
 * applies to Blog Posts — see GLOSSARY.md.
 */

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

export function loadMetrics(): Metric[] {
  const raw = readJson<unknown>("data/metrics.json");
  const list = Array.isArray(raw) ? raw : [raw];
  return list.map((m) => parseMetric(m));
}
