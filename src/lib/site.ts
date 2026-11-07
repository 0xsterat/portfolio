/**
 * Env-driven site identity. NEXT_PUBLIC_SITE_URL drives canonical URLs,
 * sitemap, RSS, and metadata (parent spec). Persona is Placeholder content
 * (GLOSSARY: Persona / Placeholder, ADR-0002) — replace before real deploy.
 */

export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export const persona = {
  name: "Placeholder Persona",
  role: "Software Engineer",
  tagline:
    "Building and writing about the web. This is a Placeholder Persona shown on Home and About until real content replaces it.",
  email: "hello@example.com",
  location: "Remote",
  links: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "X", href: "https://x.com/" },
  ],
} as const;

export const site = {
  name: "Placeholder Portfolio",
  description:
    "A static-first personal portfolio with Blog Posts, a Metrics Dashboard, Projects, and Newsletter Issues.",
};
