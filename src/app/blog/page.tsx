import type { Metadata } from "next";
import Link from "next/link";
import { BlogPostCard, TagPill } from "@/components/blog-post-card";
import { getAllTags, loadBlogPosts } from "@/lib/content";
import { getSiteUrl, persona, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `Engineering Blog Posts by ${persona.name} — Placeholder content.`,
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": `${getSiteUrl()}/feed.xml`,
    },
  },
  openGraph: {
    title: `Blog | ${site.name}`,
    description: site.description,
    url: `${getSiteUrl()}/blog`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `Blog | ${site.name}`,
    description: site.description,
  },
};

export default function BlogIndexPage() {
  const posts = loadBlogPosts();
  const tags = getAllTags();

  return (
    <div>
      <p className="text-sm font-medium tracking-wide text-accent dark:text-accent-light">
        Blog
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Engineering Blog Posts</h1>
      <p className="mt-3 max-w-prose text-neutral-600 dark:text-neutral-300">
        Placeholder Blog Posts by {persona.name}, most recent first. Each Blog Post
        has its own URL with date, reading time, and highlighted code.
      </p>

      <ul className="mt-8 flex flex-col gap-4" data-testid="blog-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <BlogPostCard post={post} />
          </li>
        ))}
      </ul>

      <section aria-labelledby="browse-tags" className="mt-10">
        <h2 id="browse-tags" className="text-lg font-semibold">
          Browse by Tag
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2" data-testid="tag-list">
          {tags.map((tag) => (
            <li key={tag}>
              <TagPill tag={tag} />
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          Subscribe via the{" "}
          <Link href="/feed.xml" className="text-accent hover:underline">
            RSS feed
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
