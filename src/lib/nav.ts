import { site } from "./site";

/**
 * Single source of truth for header/footer navigation.
 * Later slices (#3–#6) append Blog/Dashboard/Projects/Newsletter links here.
 */
export type NavLink = { label: string; href: string };

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

export const FOOTER_LINKS: NavLink[] = NAV_LINKS;

export const WORDMARK = site.name;
