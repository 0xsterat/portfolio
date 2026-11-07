import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { loadProjects } from "@/lib/content";
import { getSiteUrl, persona, site } from "@/lib/site";

const description = `Placeholder Projects by ${persona.name} — ${site.name}`;

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: `Projects | ${site.name}`,
    description,
    url: `${getSiteUrl()}/projects`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `Projects | ${site.name}`,
    description,
  },
};

export default function ProjectsIndexPage() {
  const projects = loadProjects();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Projects",
    url: `${getSiteUrl()}/projects`,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: project.title,
        description: project.description,
        url: `${getSiteUrl()}/projects/${project.slug}`,
      },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header>
        <p className="text-sm font-medium tracking-wide text-accent">Projects</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Projects</h1>
        <p className="mt-3 max-w-prose text-neutral-600 dark:text-neutral-300">
          5 Placeholder Projects with status and technology stack. Each card links
          to a detail page with GitHub and live demo links.
        </p>
      </header>

      {projects.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No Projects yet.</p>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2" aria-label="Projects list">
          {projects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
