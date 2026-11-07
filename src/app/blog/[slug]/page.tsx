import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TagPill } from "@/components/blog-post-card";
import { estimateReadingTime, formatBlogDate, getBlogPostBySlug, loadBlogPosts } from "@/lib/content";
import { renderMarkdownToHtml } from "@/lib/markdown";
import { getSiteUrl, persona } from "@/lib/site";

export function generateStaticParams() {
  return loadBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Blog Post not found" };
  const url = `${getSiteUrl()}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.summary,
      url,
      type: "article",
      publishedTime: String(post.date),
      authors: [persona.name],
      tags: [...post.tags],
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.summary,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const html = await renderMarkdownToHtml(post.content);
  const minutes = estimateReadingTime(post.content);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    url: `${getSiteUrl()}/blog/${post.slug}`,
    datePublished: String(post.date),
    author: { "@type": "Person", name: persona.name },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/blog"
        className="text-sm text-accent hover:underline"
        data-testid="back-to-blog"
      >
        ← Back to Blog
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{post.title}</h1>
      <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
        <time dateTime={String(post.date)}>{formatBlogDate(String(post.date))}</time>
        <span aria-hidden="true"> · </span>
        <span>{minutes} min read</span>
        <span aria-hidden="true"> · </span>
        <span>{persona.name}</span>
      </p>
      <ul aria-label="Tags" className="mt-3 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <li key={tag}>
            <TagPill tag={tag} />
          </li>
        ))}
      </ul>
      <p className="mt-4 max-w-prose text-neutral-600 dark:text-neutral-300">
        {post.summary}
      </p>
      <div
        className="blog-prose mt-6"
        data-testid="blog-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <footer className="mt-10 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          More Badge Posts in the{" "}
          <Link href="/blog" className="text-accent hover:underline">
            Blog index
          </Link>{" "}
          and{" "}
          <Link href="/feed.xml" className="text-accent hover:underline">
            RSS feed
          </Link>
          .
        </p>
      </footer>
    </article>
  );
}
