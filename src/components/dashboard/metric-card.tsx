import type { Metric } from "@/lib/metrics";
import type { MetricTrend } from "@/lib/dashboard";
import {
  formatMetricTimestamp,
  formatMetricValue,
  getMetricTrend,
  toChartData,
} from "@/lib/dashboard";
import { MetricChart } from "./metric-chart";

const TREND_ICON: Record<MetricTrend, string> = {
  rising: "▲",
  falling: "▼",
  flat: "■",
};

/**
 * One Metric card: value, unit, category, source, last-updated timestamp
 * plus its historical trend chart. Index-only per spec — no detail page.
 */
export function MetricCard({ metric }: { metric: Metric }) {
  const points = toChartData(metric);
  const trend = getMetricTrend(metric);

  return (
    <article
      data-testid="metric-card"
      aria-labelledby={`metric-${metric.name}`}
      className="flex min-w-0 flex-col rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 id={`metric-${metric.name}`} className="text-base font-semibold">
          {metric.name}
        </h2>
        <span
          data-testid="metric-trend"
          title={`Trend: ${trend}`}
          aria-label={`Trend: ${trend}`}
          className="text-xs font-medium text-accent dark:text-accent-light"
        >
          {TREND_ICON[trend]} <span className="capitalize">{trend}</span>
        </span>
      </div>

      <p data-testid="metric-value" className="mt-2 text-3xl font-bold tracking-tight">
        {formatMetricValue(metric.value, metric.unit)}
      </p>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-neutral-600 dark:text-neutral-400">
        <div>
          <dt className="font-medium">Category</dt>
          <dd data-testid="metric-category">{metric.category}</dd>
        </div>
        <div>
          <dt className="font-medium">Source</dt>
          <dd data-testid="metric-source">{metric.source}</dd>
        </div>
        <div className="col-span-2">
          <dt className="font-medium">Last updated</dt>
          <dd data-testid="metric-timestamp">
            <time dateTime={metric.timestamp}>
              {formatMetricTimestamp(metric.timestamp)}
            </time>
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex-1">
        <p className="mb-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          Historical trend
        </p>
        <MetricChart points={points} unit={metric.unit} />
      </div>
    </article>
  );
}
