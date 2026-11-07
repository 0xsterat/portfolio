import { site } from "./site";

/**
 * Single source of truth for header/footer navigation.
 * Slices #3–#6 each appended their section; About stays last.
 */
export type NavLink = { label: string; href: string };

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Projects", href: "/projects" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "About", href: "/about" },
];

export const FOOTER_LINKS: NavLink[] = NAV_LINKS;

export const WORDMARK = site.name;
