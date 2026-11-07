import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { loadProjects } from "@/lib/content";
import { persona, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description: `Placeholder Projects by ${persona.name} — ${site.name}`,
};

export default function ProjectsIndexPage() {
  const projects = loadProjects();

  return (
    <div>
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
