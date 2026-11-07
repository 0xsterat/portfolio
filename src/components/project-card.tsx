import Link from "next/link";
import type { Project } from "@/lib/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      data-testid="project-card"
      className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
    >
      {project.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.image}
          alt={`${project.title} preview`}
          className="aspect-[16/9] w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-teal-500/20 to-purple-500/20 text-4xl font-bold tracking-tight text-neutral-400"
        >
          {project.title.charAt(0)}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 data-testid="project-title" className="font-semibold">
            <Link href={`/projects/${project.slug}`} className="hover:text-accent hover:underline">
              {project.title}
            </Link>
          </h3>
          <span
            data-testid="project-status"
            className="rounded-full border border-neutral-300 px-2 py-0.5 text-xs capitalize text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
          >
            {project.status}
          </span>
        </div>

        <p
          data-testid="project-description"
          className="text-sm text-neutral-600 dark:text-neutral-400"
        >
          {project.description}
        </p>

        <ul data-testid="project-tech" className="flex flex-wrap gap-1.5" aria-label="Technology stack">
          {project.technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap gap-3 pt-1 text-sm">
          <Link
            href={`/projects/${project.slug}`}
            className="font-medium text-accent hover:underline"
          >
            View details →
          </Link>
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-neutral-600 hover:text-accent dark:text-neutral-400"
              aria-label={`${project.title} on GitHub`}
            >
              GitHub ↗
            </a>
          ) : null}
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-neutral-600 hover:text-accent dark:text-neutral-400"
              aria-label={`${project.title} live demo`}
            >
              Live demo ↗
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
