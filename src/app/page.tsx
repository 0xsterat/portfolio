import { persona } from "@/lib/site";

export default function HomePage() {
  return (
    <div>
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
          Blog Posts, Dashboard of Metrics, Projects, and Newsletter Issues are
          scaffolded in content. Home, About, and Projects are live.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Blog Posts",
              body: "5 Placeholder Blog Posts with Tags and reading time — coming in #3.",
            },
            {
              title: "Dashboard",
              body: "4 Placeholder Metrics with historical trends — coming in #4.",
            },
            {
              title: "Projects",
              body: "5 Placeholder Projects with status and tech stack.",
              href: "/projects",
            },
            {
              title: "Newsletter Issues",
              body: "4 Placeholder Newsletter Issues linking to Substack — coming in #6.",
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
              {"href" in card && card.href ? (
                <a href={card.href} className="mt-2 inline-block text-sm text-accent hover:underline">
                  View Projects →
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
