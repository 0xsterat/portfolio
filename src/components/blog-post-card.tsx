import Link from "next/link";
import type { BlogPost } from "@/lib/content";
import { estimateReadingTime, formatBlogDate } from "@/lib/content";

export function TagPill({ tag }: { tag: string }) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      data-testid={`tag-${tag}`}
      className="rounded-full border border-neutral-300 px-2.5 py-0.5 text-xs font-medium text-neutral-600 transition hover:border-accent hover:text-accent dark:border-neutral-700 dark:text-neutral-300"
    >
      {tag}
    </Link>
  );
}

export function BlogPostCard({ post }: { post: BlogPost }) {
  const minutes = estimateReadingTime(post.content);
  return (
    <article
      data-testid="blog-card"
      className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
    >
      <p className="text-xs font-medium tracking-wide text-neutral-500 dark:text-neutral-400">
        <time dateTime={String(post.date)}>{formatBlogDate(String(post.date))}</time>
        <span aria-hidden="true"> · </span>
        <span>{minutes} min read</span>
      </p>
      <h2 className="mt-1 text-lg font-semibold tracking-tight">
        <Link href={`/blog/${post.slug}`} className="hover:text-accent">
          {post.title}
        </Link>
      </h2>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{post.summary}</p>
      <ul aria-label="Tags" className="mt-3 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <li key={tag}>
            <TagPill tag={tag} />
          </li>
        ))}
      </ul>
    </article>
  );
}
