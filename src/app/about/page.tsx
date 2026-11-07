import type { Metadata } from "next";
import { persona } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${persona.name} — ${persona.role}`,
};

export default function AboutPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">About {persona.name}</h1>
      <p className="mt-4 max-w-prose text-neutral-600 dark:text-neutral-300">
        {persona.name} is a {persona.role}. {persona.tagline}
      </p>
      <dl className="mt-6 grid max-w-md gap-3">
        <div className="flex gap-2">
          <dt className="font-medium">Role</dt>
          <dd className="text-neutral-600 dark:text-neutral-400">{persona.role}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium">Based</dt>
          <dd className="text-neutral-600 dark:text-neutral-400">{persona.location}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium">Contact</dt>
          <dd>
            <a href={`mailto:${persona.email}`} className="text-accent hover:underline">
              {persona.email}
            </a>
          </dd>
        </div>
      </dl>
      <h2 className="mt-8 text-xl font-semibold">Links</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {persona.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-accent hover:underline"
              {...(link.href.startsWith("http")
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
