import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
  ];
}
