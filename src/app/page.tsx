import Link from "next/link";
import { BlogPostCard } from "@/components/blog-post-card";
import { loadBlogPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { getSiteUrl, persona, site } from "@/lib/site";

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
      <section aria-labelledby="home-heading">
        <p className="text-sm font-medium tracking-wide text-accent dark:text-accent-light">
          Hi 👋, I&apos;m {persona.name}
        </p>
        <h1 id="home-heading" className="mt-2 text-4xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            {persona.role}
          </span>
        </h1>
        <p className="mt-4 max-w-prose text-neutral-600 dark:text-neutral-300">
          {persona.tagline}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`mailto:${persona.email}`}
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-dark"
          >
            Contact
          </a>
          <a
            href="/about"
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-700"
          >
            About
          </a>
        </div>
      </section>

      <section aria-label="Sections" className="mt-12">
        <h2 className="text-xl font-semibold">Sections</h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Blog Posts, Dashboard of Metrics, Projects, and Newsletter Issues —
          all live with Placeholder content.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
          ].map((card) => (
            <article
              key={card.title}
              className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
            >
              <h3 className="font-medium">{card.title}</h3>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {card.body}
              </p>
              <a
                href={card.href}
                data-testid={card.testId}
                className="mt-2 inline-block text-sm text-accent hover:underline"
              >
                {card.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="recent-posts-heading" className="mt-12">
        <h2 id="recent-posts-heading" className="text-xl font-semibold">
          Latest Blog Posts
        </h2>
        <ul className="mt-4 flex flex-col gap-4">
          {recentPosts.map((post) => (
            <li key={post.slug} data-testid="home-recent-post">
              <BlogPostCard post={post} />
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          <Link href="/blog" className="text-accent hover:underline">
            View all Blog Posts →
          </Link>
        </p>
      </section>
    </div>
  );
}
