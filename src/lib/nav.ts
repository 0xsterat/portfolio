import { site } from "./site";

/**
 * Single source of truth for header/footer navigation.
 * Blog (#3) appended; Dashboard/Projects/Newsletter (#4–#6) append next.
 */
export type NavLink = { label: string; href: string };

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export const FOOTER_LINKS: NavLink[] = NAV_LINKS;

export const WORDMARK = site.name;
