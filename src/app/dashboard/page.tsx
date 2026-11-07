import type { Metadata } from "next";
import { MetricCard } from "@/components/dashboard/metric-card";
import { loadMetrics } from "@/lib/content";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Public Metrics Dashboard with Placeholder Metrics, values, units, categories, sources, and historical trends.",
};

export default function DashboardPage() {
  const metrics = loadMetrics();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-2 max-w-prose text-sm text-neutral-600 dark:text-neutral-400">
        Placeholder Metrics from a single generic schema, shown with current
        values and historical trends. All numbers are Placeholder content.
      </p>

      <section
        aria-label="Metrics"
        data-testid="dashboard-metrics"
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {metrics.map((metric) => (
          <MetricCard key={metric.name} metric={metric} />
        ))}
      </section>
    </div>
  );
}
