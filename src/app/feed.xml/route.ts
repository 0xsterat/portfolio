import { loadBlogPosts } from "@/lib/content";
import { buildRssFeed } from "@/lib/feed";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const xml = buildRssFeed(loadBlogPosts(), getSiteUrl());
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
