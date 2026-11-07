import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostCard, TagPill } from "@/components/blog-post-card";
import { getAllTags, getBlogPostsByTag } from "@/lib/content";
import { buildMetadata, buildItemListJsonLd } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site";

type Props = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getBlogPostsByTag(decoded);
  if (posts.length === 0) return { title: "Tag not found" };
  const description = `${posts.length} Placeholder Blog Post${posts.length === 1 ? "" : "s"} with the Tag “${decoded}”.`;
  return buildMetadata({
    title: `Blog Posts tagged ${decoded}`,
    description,
    path: `/tags/${encodeURIComponent(decoded)}`,
    ogTitle: `Blog Posts tagged ${decoded}`,
  });
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getBlogPostsByTag(decoded);
  if (posts.length === 0) notFound();
  const allTags = getAllTags();
  const jsonLd = buildItemListJsonLd({
    name: `Blog Posts tagged ${decoded}`,
    url: `${getSiteUrl()}/tags/${encodeURIComponent(decoded)}`,
    items: posts.map((post) => ({
      type: "BlogPosting",
      headline: post.title,
      url: `${getSiteUrl()}/blog/${post.slug}`,
    })),
  });

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/blog" className="text-sm text-accent hover:underline">
        ← Back to Blog
      </Link>
      <p className="mt-4 text-sm font-medium tracking-wide text-accent dark:text-accent-light">
        Tag
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        Blog Posts tagged {decoded}
      </h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-300">
        {posts.length} Placeholder Blog Post{posts.length === 1 ? "" : "s"} with the Tag
        “{decoded}”, most recent first.
      </p>

      <ul className="mt-8 flex flex-col gap-4" data-testid="tag-post-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <BlogPostCard post={post} />
          </li>
        ))}
      </ul>

      <section aria-labelledby="other-tags" className="mt-10">
        <h2 id="other-tags" className="text-lg font-semibold">
          Other Tags
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {allTags
            .filter((t) => t.toLowerCase() !== decoded.toLowerCase())
            .map((t) => (
              <li key={t}>
                <TagPill tag={t} />
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
