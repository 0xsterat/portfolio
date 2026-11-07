import { describe, it, expect } from "vitest";
import { parseMetric, loadMetrics } from "@/lib/content";
import {
  toChartData,
  formatMetricValue,
  getMetricTrend,
} from "@/lib/dashboard";

/**
 * Dashboard arrange/act-pronoun agreement: Metric validation and history.
 * Uses GLOSSARY vocabulary (Metric, Dashboard, Placeholder).
 */
const baseMetric = {
  name: "Placeholder Posts",
  value: 5,
  unit: "posts",
  category: "writing",
  source: "placeholder-local-file",
  timestamp: "2026-11-01T00:00:00.000Z",
  historicalValues: [
    { value: 2, timestamp: "2026-09-01T00:00:00.000Z" },
    { value: 3, timestamp: "2026-10-01T00:00:00.000Z" },
    { value: 5, timestamp: "2026-11-01T00:00:00.000Z" },
  ],
};

describe("Metric validation", () => {
  it("accepts a well-formed Placeholder Metric", () => {
    expect(() => parseMetric(baseMetric)).not.toThrow();
  });

  it("rejects a Metric missing its unit, category, or source", () => {
    const { unit: _unit, ...noUnit } = baseMetric;
    expect(() => parseMetric(noUnit)).toThrow();
    const { category: _category, ...noCategory } = baseMetric;
    expect(() => parseMetric(noCategory)).toThrow();
    const { source: _source, ...noSource } = baseMetric;
    expect(() => parseMetric(noSource)).toThrow();
  });

  it("rejects a Metric with an empty name or an invalid timestamp", () => {
    expect(() => parseMetric({ ...baseMetric, name: "" })).toThrow();
    expect(() =>
      parseMetric({ ...baseMetric, timestamp: "not-a-date" }),
    ).toThrow();
  });

  it("rejects a Metric with no historical Values", () => {
    expect(() =>
      parseMetric({ ...baseMetric, historicalValues: [] }),
    ).toThrow();
  });

  it("rejects a Metric with a negative historical Value or bad history timestamp", () => {
    expect(() =>
      parseMetric({
        ...baseMetric,
        historicalValues: [
          { value: -1, timestamp: "2026-09-01T00:00:00.000Z" },
        ],
      }),
    ).toThrow();
    expect(() =>
      parseMetric({
        ...baseMetric,
        historicalValues: [{ value: 1, timestamp: "yesterday" }],
      }),
    ).toThrow();
  });

  it("accepts a decimal Metric Value such as an uptime percentage", () => {
    expect(() =>
      parseMetric({
        ...baseMetric,
        name: "Uptime (30 days)",
        value: 99.9,
        unit: "%",
        historicalValues: [
          { value: 98.1, timestamp: "2026-09-01T00:00:00.000Z" },
          { value: 99.9, timestamp: "2026-11-01T00:00:00.000Z" },
        ],
      }),
    ).not.toThrow();
  });
});

describe("Metric history", () => {
  it("loads exactly 4 Placeholder Metrics for the Dashboard", () => {
    const metrics = loadMetrics();
    expect(metrics).toHaveLength(4);
    for (const metric of metrics) {
      expect(metric.name).toBeTruthy();
      expect(metric.unit).toBeTruthy();
      expect(metric.category).toBeTruthy();
      expect(metric.source).toBeTruthy();
      expect(Number.isNaN(Date.parse(metric.timestamp))).toBe(false);
      expect(metric.historicalValues.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("returns chart data sorted oldest-first regardless of input order", () => {
    const shuffled = {
      ...baseMetric,
      historicalValues: [
        { value: 5, timestamp: "2026-11-01T00:00:00.000Z" },
        { value: 2, timestamp: "2026-09-01T00:00:00.000Z" },
        { value: 3, timestamp: "2026-10-01T00:00:00.000Z" },
      ],
    };
    const points = toChartData(shuffled);
    expect(points.map((p) => p.value)).toEqual([2, 3, 5]);
    expect(points.map((p) => p.timestamp)).toEqual([
      "2026-09-01T00:00:00.000Z",
      "2026-10-01T00:00:00.000Z",
      "2026-11-01T00:00:00.000Z",
    ]);
  });

  it("formats a Metric Value with its unit", () => {
    expect(formatMetricValue(5, "posts")).toBe("5 posts");
    expect(formatMetricValue(99.9, "%")).toBe("99.9%");
  });

  it("reports trend direction from the oldest to the newest historical Value", () => {
    // Genuinely rising example: oldest value is smaller than newest.
    expect(getMetricTrend(baseMetric)).toBe("rising");
    // Flat example: oldest and newest are equal.
    const flat = {
      ...baseMetric,
      historicalValues: [
        { value: 3, timestamp: "2026-09-01T00:00:00.000Z" },
        { value: 3, timestamp: "2026-11-01T00:00:00.000Z" },
      ],
    };
    expect(getMetricTrend(flat)).toBe("flat");
    // Falling example: oldest value is larger than newest.
    const falling = {
      ...baseMetric,
      historicalValues: [
        { value: 5, timestamp: "2026-09-01T00:00:00.000Z" },
        { value: 2, timestamp: "2026-11-01T00:00:00.000Z" },
      ],
    };
    expect(getMetricTrend(falling)).toBe("falling");
  });
});
