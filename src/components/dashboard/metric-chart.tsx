"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartPoint } from "@/lib/dashboard";

/**
 * Historical trend chart for one Metric. Client-only chart seam:
 * data comes from static Placeholder content, never fetched (ADR-0003).
 * ResponsiveContainer keeps the chart readable on mobile (spec: works
 * on mobile) without a live backend or view counter.
 */
export function MetricChart({ points, unit }: { points: ChartPoint[]; unit: string }) {
  const data = points.map((point) => ({
    name: point.label,
    value: point.value,
    timestamp: point.timestamp,
  }));

  return (
    <div
      data-testid="metric-chart"
      className="h-40 w-full min-w-0"
      aria-hidden="false"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -12 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-800" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            formatter={(value) => [`${String(value)} ${unit}`, "Value"]}
            labelFormatter={(_, payload) => {
              const item = payload?.[0]?.payload as
                | { timestamp?: string }
                | undefined;
              return item?.timestamp ? `Updated ${item.timestamp.slice(0, 10)}` : "";
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#14b8a6"
            strokeWidth={2}
            dot={{ r: 3 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
