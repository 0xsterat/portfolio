import Link from "next/link";
import type { BlogPost } from "@/lib/content";
import { estimateReadingTime, formatBlogDate } from "@/lib/content";

export function TagPill({ tag }: { tag: string }) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      data-testid={`tag-${tag}`}
      className="pressable inline-flex items-center rounded-full border border-[#E5E7EB] px-3 py-1 text-xs font-medium leading-[1.43] text-[#6B7280] hover:border-[#030711] hover:text-[#030711] dark:border-[#1F2937] dark:text-[#9CA3B0] dark:hover:border-[#9CA3B0] dark:hover:text-[#E1E7EF]"
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
      className="rounded-[12px] border border-[#E5E7EB] bg-white p-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] dark:border-[#1F2937] dark:bg-[#030711] dark:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)]"
    >
      <p className="text-[14px] font-normal leading-[1.43] text-[#6B7280] dark:text-[#9CA3B0]">
        <time dateTime={String(post.date)}>{formatBlogDate(String(post.date))}</time>
        <span aria-hidden="true"> · </span>
        <span>{minutes} min read</span>
      </p>
      <h2 className="mt-1 text-[20px] font-bold leading-[1.4] tracking-[-0.025em] text-[#030711] dark:text-[#E1E7EF]">
        <Link
          href={`/blog/${post.slug}`}
          className="hover-lift transition-[opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:opacity-70"
        >
          {post.title}
        </Link>
      </h2>
      <p className="mt-1 text-[14px] font-normal leading-[1.43] text-[#6B7280] dark:text-[#9CA3B0]">{post.summary}</p>
      <ul aria-label="Tags" className="mt-3 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <li key={tag}>
            <TagPill tag={tag} />
          </li>
        ))}
      </ul>
    </article>
  );
}
