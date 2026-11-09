# Personal Portfolio

Static-first personal portfolio (Next.js App Router + TypeScript). Home, About,
Blog Posts, Metrics Dashboard, Projects, and Newsletter Issues — no backend.
All sample content is placeholder; replace it in place with your own.

## 1. Setup locally

Prerequisites: Node >= 18.18, pnpm, git.

```bash
git clone <repository-url>
cd portfolio_rea
pnpm install
cp .env.example .env.local
pnpm dev          # http://localhost:3000
```

`NEXT_PUBLIC_SITE_URL` in `.env.local` drives canonical URLs, sitemap, RSS,
and metadata. Set it to your production domain before deploying.

Useful commands:

```bash
pnpm test         # Vitest unit tests (content + config validation)
pnpm test:e2e     # Playwright end-to-end tests
pnpm typecheck    # tsc --noEmit
pnpm build        # production build
pnpm start        # serve the production build
```

Push to `main` — Vercel auto-deploys (or `pnpm dlx vercel deploy --prod`).

## 2. Edit personal info

**Single source of truth: `src/lib/site.ts`.**

- `persona` — name, role, org, tagline, email, location, image, social links.
  Home hero, About page, footer, metadata/OG, and JSON-LD all read from here.
- `site` — site name + description (used in metadata and structured data).
- `getSiteUrl()` — reads `NEXT_PUBLIC_SITE_URL` (canonicals, sitemap, RSS).

Example:

```ts
export const persona = {
  name: "Your Name",
  role: "Your Role",
  org: "Your Org",
  tagline: "What you build / write about",
  image: "/avatar.jpg",
  email: "you@example.com",
  location: "City",
  links: [
    { label: "GitHub", href: "https://github.com/your-handle" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle" },
    { label: "X", href: "https://x.com/your-handle" },
  ],
} as const;
```

Profile picture: replace `public/avatar.jpg` (keep the same filename, or update
`persona.image`). No component changes needed — Home, About, footer, and
metadata pick it up automatically.

## 3. Add a new blog post

Add one file per post in `src/content/blog/my-post-slug.mdx`:

```mdx
---
title: "My post title"
date: "2026-11-10"
slug: "my-post-slug"
tags: ["web", "notes"]
summary: "One-line summary shown on cards and RSS."
---

Your Markdown here — headings, paragraphs, lists, GFM tables, and fenced
code blocks (```ts, etc.) with syntax highlighting.
```

- Frontmatter is required: `title`, `date` (valid date), `slug` (unique,
  used in `/blog/[slug]`), `tags` (at least one), `summary`.
- Keep posts as plain Markdown. MDX components, JSX (`{...}`), and
  imports are intentionally not supported — they render as text.
- Posts are sorted newest-first, appear in `/blog`, tag pages, the home
  "Latest" list, RSS (`/feed.xml`), and sitemap automatically.
- Validation: `pnpm test` fails on bad frontmatter (`src/lib/content.ts`).

## 4. Edit the dashboard

Dashboard data lives in `src/data/metrics.json` (array of metrics):

```json
{
  "name": "Posts Published",
  "value": 12,
  "unit": "posts",
  "category": "writing",
  "source": "manual-count",
  "timestamp": "2026-11-10T00:00:00.000Z",
  "historicalValues": [
    { "value": 8, "timestamp": "2026-09-01T00:00:00.000Z" },
    { "value": 10, "timestamp": "2026-10-01T00:00:00.000Z" },
    { "value": 12, "timestamp": "2026-11-01T00:00:00.000Z" }
  ]
}
```

- `name` — card title. `value` — current number (non-negative).
  `unit` — suffix label (e.g. `posts`, `%`). `category` — grouping label.
  `source` — where the number comes from.
- `timestamp` — last-updated date for the metric.
- `historicalValues` — at least one `{ value, timestamp }` point; the trend
  chart and rising/falling/flat badge are computed from these automatically.

No code changes needed: `/dashboard` renders a card + trend chart per metric
(`src/app/dashboard/page.tsx`, `src/components/dashboard/metric-card.tsx`,
`metric-chart.tsx`). To change layout or charts, edit those components and
`src/lib/dashboard.ts` (chart/trend helpers).

## 5. Edit the Projects section

Project data lives in `src/data/projects.json` (array of projects):

```json
{
  "title": "My Project",
  "slug": "my-project",
  "description": "What it is, one or two sentences.",
  "status": "active",
  "technologies": ["Next.js", "TypeScript"],
  "githubUrl": "https://github.com/you/my-project",
  "demoUrl": "https://my-project.example.com/",
  "createdAt": "2026-08-01"
}
```

- `title` — display title; `slug` — unique ID used in `/projects/[slug]`.
- `description` — shown on index cards and the detail page.
- `status` — one of `active | maintenance | archived | idea | completed`.
- `technologies` — at least one tag. `githubUrl` / `demoUrl` — optional live
  links (real URLs, or omit the field). `createdAt` — valid date.
- `/projects` (index) and `/projects/[slug]` (detail) render automatically
  from this file — no component changes needed for content edits.
  To change card design, edit `src/components/project-card.tsx` and
  `src/app/projects/page.tsx` / `[slug]/page.tsx`; schema lives in
  `src/lib/projects.ts`.
