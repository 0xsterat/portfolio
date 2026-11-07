import type { MetadataRoute } from "next";
import {
  getAllTags,
  getBlogPostsByTag,
  loadBlogPosts,
  loadProjects,
} from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  const posts = loadBlogPosts();
  const blogLastModified = posts[0] ? new Date(String(posts[0].date)) : now;

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(String(post.date)),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const tagEntries: MetadataRoute.Sitemap = getAllTags().map((tag) => {
    const tagged = getBlogPostsByTag(tag);
    const lastModified = tagged[0] ? new Date(String(tagged[0].date)) : now;
    return {
      url: `${base}/tags/${encodeURIComponent(tag)}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    };
  });

  const projectRoutes: MetadataRoute.Sitemap = loadProjects().map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: now,
  }));

  return [
    { url: base, lastModified: now, priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly" },
    {
      url: `${base}/blog`,
      lastModified: blogLastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...blogEntries,
    ...tagEntries,
    { url: `${base}/dashboard`, lastModified: now },
    { url: `${base}/projects`, lastModified: now },
    ...projectRoutes,
    { url: `${base}/newsletter`, lastModified: now },
  ];
}
