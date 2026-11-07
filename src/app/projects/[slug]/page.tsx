import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, loadProjects } from "@/lib/projects";
import { buildMetadata } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site";
import { formatDate } from "@/lib/date";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return loadProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return buildMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const createdLabel = formatDate(String(project.createdAt));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${getSiteUrl()}/projects/${project.slug}`,
    dateCreated: String(project.createdAt),
    ...(project.githubUrl ? { sameAs: project.githubUrl } : {}),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/projects" className="text-sm text-accent hover:underline">
        ← All Projects
      </Link>

      <header className="mt-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
          <span
            data-testid="project-status"
            className="mt-1 rounded-full border border-neutral-300 px-3 py-1 text-xs capitalize dark:border-neutral-700"
          >
            {project.status}
          </span>
        </div>
        <p className="mt-3 max-w-prose text-neutral-600 dark:text-neutral-300">
          {project.description}
        </p>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Created {createdLabel}
        </p>
      </header>

      <section aria-labelledby="tech-heading" className="mt-8">
        <h2 id="tech-heading" className="text-xl font-semibold">
          Technology stack
        </h2>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-full bg-neutral-100 px-3 py-1 text-sm dark:bg-neutral-800"
            >
              {tech}
            </li>
          ))}
        </ul>
      </section>

      {project.image ? (
        <figure className="mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={`${project.title} preview`}
            className="w-full rounded-xl border border-neutral-200 object-cover dark:border-neutral-800"
          />
        </figure>
      ) : null}

      <section aria-labelledby="links-heading" className="mt-8">
        <h2 id="links-heading" className="text-xl font-semibold">
          Links
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {project.githubUrl ? (
            <li>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-accent hover:underline"
              >
                GitHub ↗
              </a>
            </li>
          ) : null}
          {project.demoUrl ? (
            <li>
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-accent hover:underline"
              >
                Live demo ↗
              </a>
            </li>
          ) : null}
          {!project.githubUrl && !project.demoUrl ? (
            <li className="text-sm text-neutral-500">No external links for this Placeholder Project yet.</li>
          ) : null}
        </ul>
      </section>
    </article>
  );
}
