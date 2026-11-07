import Link from "next/link";
import { FOOTER_LINKS, WORDMARK } from "@/lib/nav";
import { persona, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto grid max-w-3xl gap-8 px-4 py-10 text-sm md:grid-cols-3">
        <div>
          <p className="font-semibold text-neutral-900 dark:text-neutral-50">{WORDMARK}</p>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">{site.description}</p>
        </div>
        <nav aria-label="Footer">
          <p className="font-medium text-neutral-900 dark:text-neutral-50">Site</p>
          <ul className="mt-2 flex flex-col gap-1">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-neutral-600 hover:text-accent dark:text-neutral-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="font-medium text-neutral-900 dark:text-neutral-50">Elsewhere</p>
          <ul className="mt-2 flex flex-col gap-1">
            {persona.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-neutral-600 hover:text-accent dark:text-neutral-400"
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
      </div>
      <div className="border-t border-neutral-200 py-4 text-center text-xs text-neutral-500 dark:border-neutral-800">
        © {new Date().getFullYear()} {persona.name} · Placeholder content
      </div>
    </footer>
  );
}
