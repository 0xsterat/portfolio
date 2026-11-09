import Link from "next/link";
import { FOOTER_LINKS, WORDMARK } from "@/lib/nav";
import { persona, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] dark:border-[#1F2937]">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 text-sm sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-semibold leading-none text-[#030711] dark:text-[#E1E7EF]">{WORDMARK}</p>
          <p className="mt-2 leading-[1.43] text-[#6B7280] dark:text-[#9CA3B0]">{site.description}</p>
        </div>
        <nav aria-label="Footer">
          <p className="text-sm font-semibold text-[#030711] dark:text-[#E1E7EF]">Site</p>
          <ul className="mt-2 flex flex-col gap-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm leading-[1.43] text-[#6B7280] transition-[color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-[#030711] dark:text-[#9CA3B0] dark:hover:text-[#E1E7EF]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-sm font-semibold text-[#030711] dark:text-[#E1E7EF]">Elsewhere</p>
          <ul className="mt-2 flex flex-col gap-2">
            {persona.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm leading-[1.43] text-[#6B7280] transition-[color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-[#030711] dark:text-[#9CA3B0] dark:hover:text-[#E1E7EF]"
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
      <div className="border-t border-[#E5E7EB] py-4 text-center text-xs leading-[1.43] text-[#6B7280] dark:border-[#1F2937] dark:text-[#9CA3B0]">
        © {new Date().getFullYear()} {persona.name}
      </div>
    </footer>
  );
}
