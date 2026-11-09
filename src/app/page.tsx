import Link from "next/link";
import { BlogPostCard } from "@/components/blog-post-card";
import { loadBlogPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { getSiteUrl, persona, site } from "@/lib/site";
import Image from "next/image";

export const metadata = buildMetadata({
  title: `${persona.name} — Home`,
  description: site.description,
  path: "/",
  ogTitle: `${persona.name} — ${site.name}`,
  includeRss: true,
});

export default function HomePage() {
  const recentPosts = loadBlogPosts().slice(0, 5);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: getSiteUrl(),
    description: site.description,
    author: {
      "@type": "Person",
      name: persona.name,
      email: `mailto:${persona.email}`,
      url: `${getSiteUrl()}/about`,
    },
  };
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="grid items-center gap-6 py-8 md:grid-cols-[1fr_280px] md:py-12 lg:grid-cols-[1fr_320px] lg:gap-6">
        {/* LEFT: text */}
        <div className="stagger-item" style={{ animationDelay: "0ms" }}>
          <h1 className="mt-4 text-[2.5rem] font-bold leading-none tracking-[-0.025em] text-[#DC9F7B] dark:text-[#DC9F7B] md:text-[3rem]">
            {persona.name}
          </h1>
          <p className="text-sm font-medium leading-[1.43] tracking-wide text-[#6B7280] dark:text-[#9CA3B0]">
            {persona.role} . {persona.org}
          </p>
          <p className="mt-4 text-[2.25rem] font-bold leading-none tracking-[-0.025em] text-[#030711] dark:text-[#E1E7EF] md:text-[3rem]">
            {persona.tagline.trim()}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${persona.email}`}
              className="pressable hover-lift inline-flex h-10 items-center rounded-full bg-[#F5E3C7] px-5 text-base font-semibold leading-none text-white dark:bg-[#F5E3C7] dark:text-black"
            >
              Contact
            </a>
            <a
              href="/about"
              className="pressable inline-flex h-10 items-center rounded-full border border-[#E5E7EB] px-5 text-base font-semibold leading-none text-[#030711] hover:border-[#030711] dark:border-[#1F2937] dark:text-[#E1E7EF] dark:hover:border-[#9CA3B0]"
            >
              About
            </a>
          </div>
        </div>

        {/* RIGHT: portrait card — docs/design.md card 12px / #1F2937 */}
        <figure
          className="stagger-item w-full max-w-[320px] overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)] dark:border-[#1F2937] dark:bg-[#030711] md:justify-self-end"
          style={{ animationDelay: "50ms" }}
        >
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={persona.image}
              alt={persona.name}
              fill
              sizes="(max-width: 640px) 100vw, 320px"
              className="object-cover object-top"
              priority
            />
          </div>
        </figure>
      </section>

      <section aria-label="Sections" className="mt-10">
        <h2 className="text-[20px] font-bold leading-[1.4] tracking-[-0.025em] text-[#030711] dark:text-[#E1E7EF]">
          Sections
        </h2>
        <p className="mt-2 text-sm leading-[1.43] text-[#6B7280] dark:text-[#9CA3B0]">
          Blog Posts, Dashboard of Metrics, Projects, and Newsletter Issues —
          all live with Placeholder content.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            {
              title: "Blog Posts",
              body: "5 Placeholder Blog Posts with Tags, reading time, and highlighted code.",
              href: "/blog",
              testId: "home-section-blog",
              cta: "View Blog Posts →",
            },
            {
              title: "Dashboard",
              body: "4 Placeholder Metrics with values, units, sources, and historical trends.",
              href: "/dashboard",
              testId: "home-section-dashboard",
              cta: "View Dashboard →",
            },
            {
              title: "Projects",
              body: "5 Placeholder Projects with status and tech stack.",
              href: "/projects",
              testId: "home-section-projects",
              cta: "View Projects →",
            },
            {
              title: "Newsletter Issues",
              body: "4 Placeholder Newsletter Issues linking to Substack.",
              href: "/newsletter",
              testId: "home-section-newsletter",
              cta: "View Newsletter Issues →",
            },
          ].map((card, index) => (
            <article
              key={card.title}
              style={{ animationDelay: `${index * 50}ms` }}
              className="stagger-item rounded-[12px] border border-[#E5E7EB] bg-white p-4 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)] dark:border-[#1F2937] dark:bg-[#030711]"
            >
              <h3 className="text-base font-semibold leading-[1.2] text-[#030711] dark:text-[#E1E7EF]">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-[1.43] text-[#6B7280] dark:text-[#9CA3B0]">
                {card.body}
              </p>
              <a
                href={card.href}
                data-testid={card.testId}
                className="mt-2 inline-block text-sm font-medium leading-[1.43] text-[#030711] transition-[color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:underline dark:text-[#E1E7EF]"
              >
                {card.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="recent-posts-heading" className="mt-10">
        <h2
          id="recent-posts-heading"
          className="text-[20px] font-bold leading-[1.4] tracking-[-0.025em] text-[#030711] dark:text-[#E1E7EF]"
        >
          Latest Blog Posts
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {recentPosts.map((post) => (
            <li key={post.slug} data-testid="home-recent-post">
              <BlogPostCard post={post} />
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-[1.43] text-[#6B7280] dark:text-[#9CA3B0]">
          <Link
            href="/blog"
            className="font-medium text-[#030711] transition-[color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:underline dark:text-[#E1E7EF]"
          >
            View all Blog Posts →
          </Link>
        </p>
      </section>
    </div>
  );
}
