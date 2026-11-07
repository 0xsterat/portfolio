import type { Metric } from "@/lib/content";

export type ChartPoint = {
  /** Original ISO timestamp string for tooltip/label formatting. */
  timestamp: string;
  value: number;
  /** Short label (e.g. "2026-09-01") for the X axis. */
  label: string;
};

export type MetricTrend = "rising" | "falling" | "flat";

/**
 * Dashboard helpers — pure functions over a validated Metric.
 * They never fetch: all Metric data is static Placeholder content
 * (ADR-0003 static-first, ADR-0002 placeholder-only).
 */

export function toChartData(metric: Pick<Metric, "historicalValues">): ChartPoint[] {
  return [...metric.historicalValues]
    .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
    .map((point) => ({
      timestamp: point.timestamp,
      value: point.value,
      label: point.timestamp.slice(0, 10),
    }));
}

export function formatMetricValue(value: number, unit: string): string {
  const trimmed = Number.isInteger(value) ? String(value) : String(value);
  return unit === "%" ? `${trimmed}%` : `${trimmed} ${unit}`;
}

export function getMetricTrend(
  metric: Pick<Metric, "historicalValues">,
): MetricTrend {
  const points = toChartData(metric);
  if (points.length < 2) return "flat";
  const first = points[0].value;
  const last = points[points.length - 1].value;
  if (last > first) return "rising";
  if (last < first) return "falling";
  return "flat";
}

export function formatMetricTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toISOString().slice(0, 10);
}
