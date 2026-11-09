import { buildMetadata } from "@/lib/metadata";
import { getSiteUrl, persona } from "@/lib/site";
import Image from "next/image";

const description = `About ${persona.name} — ${persona.role}`;

export const metadata = buildMetadata({
  title: "About",
  description,
  path: "/about",
});

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: persona.name,
    jobTitle: persona.role,
    email: `mailto:${persona.email}`,
    url: `${getSiteUrl()}/about`,
    description: persona.tagline,
  };
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-[36px] font-bold leading-none tracking-[-0.025em] text-[#030711] dark:text-[#E1E7EF] md:text-[48px]">
        About {persona.name}
      </h1>
      <figure className="mt-6 w-full max-w-[280px] overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)] dark:border-[#1F2937] dark:bg-[#030711]">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={persona.image}
            alt={persona.name}
            fill
            sizes="(max-width: 640px) 100vw, 280px"
            className="object-cover object-top"
          />
        </div>
        <figcaption className="px-4 py-3 text-sm font-medium leading-[1.43] text-[#030711] dark:text-[#E1E7EF]">
          {persona.name}
          <span className="block text-xs font-normal leading-[1.43] uppercase tracking-wide text-[#6B7280] dark:text-[#9CA3B0]">
            {persona.role} · {persona.location}
          </span>
        </figcaption>
      </figure>
      <p className="mt-4 max-w-prose text-base font-normal leading-[1.5] text-[#374151] dark:text-[#9CA3B0]">
        {persona.name} is a {persona.role}. {persona.tagline}
      </p>
      <dl className="mt-6 grid max-w-md gap-3">
        <div className="flex gap-2">
          <dt className="text-base font-semibold leading-none">Role</dt>
          <dd className="text-base leading-[1.5] text-[#374151] dark:text-[#9CA3B0]">{persona.role}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-base font-semibold leading-none">Based</dt>
          <dd className="text-base leading-[1.5] text-[#374151] dark:text-[#9CA3B0]">{persona.location}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-base font-semibold leading-none">Contact</dt>
          <dd>
            <a
              href={`mailto:${persona.email}`}
              className="text-base leading-[1.5] text-[#030711] underline dark:text-[#E1E7EF]"
            >
              {persona.email}
            </a>
          </dd>
        </div>
      </dl>
      <h2 className="mt-8 text-[20px] font-bold leading-[1.4] tracking-[-0.025em] text-[#030711] dark:text-[#E1E7EF]">
        Links
      </h2>
      <ul className="mt-3 flex flex-col gap-2">
        {persona.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm font-medium leading-[1.43] text-[#030711] underline dark:text-[#E1E7EF]"
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
