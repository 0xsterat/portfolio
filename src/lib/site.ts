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
  name: "Atharva Tayade",
  role: "Devops Engineer",
  org: "Accenture",
  tagline:
    "Building and writing about Cloud, Infra and AIops  ",
  image: "/avatar.jpg",
  email: "atharvatayadeint@gmail.com",
  location: "Pune",
  links: [
    { label: "GitHub", href: "https://github.com/0xsterat" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/itzatharva" },
    { label: "X", href: "https://x.com/atharvatayade5" },
  ],
} as const;

export const site = {
  name: "Atharva's Portfolio",
  description:
    "A personal portfolio with Blog Posts, a Metrics Dashboard, Projects, and Daily logs.",
};
