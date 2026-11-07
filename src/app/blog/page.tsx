import Link from "next/link";
import { BlogPostCard, TagPill } from "@/components/blog-post-card";
import { getAllTags, loadBlogPosts } from "@/lib/content";
import { buildMetadata, buildItemListJsonLd } from "@/lib/metadata";
import { getSiteUrl, persona, site } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Blog",
  description: `Engineering Blog Posts by ${persona.name} — Placeholder content.`,
  ogDescription: site.description,
  path: "/blog",
  includeRss: true,
});

export default function BlogIndexPage() {
  const posts = loadBlogPosts();
  const tags = getAllTags();
  const jsonLd = buildItemListJsonLd({
    name: "Blog Posts",
    url: `${getSiteUrl()}/blog`,
    items: posts.map((post) => ({
      type: "BlogPosting",
      headline: post.title,
      description: post.summary,
      url: `${getSiteUrl()}/blog/${post.slug}`,
      datePublished: String(post.date),
    })),
  });

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
