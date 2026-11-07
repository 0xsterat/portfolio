import type { MetadataRoute } from "next";
import { loadProjects } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  const projectRoutes: MetadataRoute.Sitemap = loadProjects().map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: now,
  }));
  return [
    { url: base, lastModified: now },
    { url: `${base}/projects`, lastModified: now },
    ...projectRoutes,
    { url: `${base}/about`, lastModified: now },
  ];
}
