import type { Metadata } from "next";
import { MetricCard } from "@/components/dashboard/metric-card";
import { loadMetrics } from "@/lib/content";
import { getSiteUrl, site } from "@/lib/site";

const description =
  "Public Metrics Dashboard with Placeholder Metrics, values, units, categories, sources, and historical trends.";

export const metadata: Metadata = {
  title: "Dashboard",
  description,
  alternates: { canonical: "/dashboard" },
  openGraph: {
    title: `Dashboard | ${site.name}`,
    description,
    url: `${getSiteUrl()}/dashboard`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `Dashboard | ${site.name}`,
    description,
  },
};

export default function DashboardPage() {
  const metrics = loadMetrics();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Public Metrics Dashboard",
    url: `${getSiteUrl()}/dashboard`,
    itemListElement: metrics.map((metric, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: metric.name,
        value: metric.value,
        ...(metric.unit ? { unitText: metric.unit } : {}),
      },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
