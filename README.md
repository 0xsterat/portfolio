# Personal Portfolio — static-first (integration gate #7)

A deployable static-first portfolio (Next.js App Router + TypeScript) where Home,
About, Blog Posts, Dashboard, Projects, and Newsletter Issues work together —
production build passes, all routes smoke-tested with no console errors, and
per-page SEO metadata + JSON-LD + Open Graph/Twitter + sitemap/RSS are complete.
All Blog Posts, Metrics, Projects, Newsletter Issues, and the Persona are
independently written Placeholder content (ADR-0002), not copied from any
reference site. Static-first, no backend (ADR-0003). Live routes:

- `/` — Home: Placeholder Persona, 5 most recent Blog Posts, live cards for all sections
- `/about` — About: Persona bio/contact + Person JSON-LD
- `/blog` — Blog index (5 Placeholder Blog Posts, Tag browse, RSS link)
- `/blog/[slug]` — Blog Post reader (5 static posts, BlogPosting JSON-LD)
- `/tags/[tag]` — Tag pages (search-friendly URLs, ItemList JSON-LD)
- `/dashboard` — Dashboard: 4 Placeholder Metrics with historical trends/charts
- `/projects` — Projects index (5 Placeholder Projects)
- `/projects/[slug]` — Project detail (5 static detail pages)
- `/newsletter` — Newsletter Issues index (4 Placeholder Issues → Substack)
- `/feed.xml` — RSS 2.0 feed (5 Blog Post items)
- `/sitemap.xml`, `/robots.txt` — generated from `NEXT_PUBLIC_SITE_URL`
- 404 — custom `not-found` page

Header/footer navigation is unioned from `src/lib/nav.ts` (Home, Blog, Dashboard,
Projects, Newsletter, About) — consistent on every route. Theme: light/dark via
next-themes with an inline flash-free script in `src/app/layout.tsx`.

## Setup (verified for the integration gate)

### Prerequisites

```bash
node --version   # >= 18.18.0
pnpm --version   # corepack enable && corepack prepare pnpm@latest --activate
git --version
```

### Install

```bash
git clone <repository-url>
cd portfolio_rea
pnpm install
cp .env.example .env.local
```

`NEXT_PUBLIC_SITE_URL` drives canonical URLs, sitemap, RSS, and metadata
(default `http://localhost:3000`). Edit `.env.local` before metadata/sitemap
work. No secrets required — everything else is static Placeholder content.

### Development

```bash
pnpm dev          # http://localhost:3000
```

### Test (all four — integration gate checklist)

```bash
pnpm test         # Vitest unit — content seam + site config + integration gates (65 tests)
pnpm test:e2e     # Playwright — per-slice smoke + whole-site integration (Home→Blog→Post→Dashboard→Projects→Newsletter→Substack)
pnpm typecheck    # tsc --noEmit
pnpm build        # Next production build — all 31 static routes must generate
pnpm start        # serve the production build (http://localhost:3000)
```

Integration gates enforced by `tests/unit/integration.test.ts` (volumes 5/4/5/4,
nav union, sitemap/RSS completeness) and `tests/e2e/integration.spec.ts`
(all routes load with no console errors, SEO tags on every route, sitemap/RSS
complete, full journey works).

### Content scaffolding

- Blog Posts: `src/content/blog/*.mdx` (frontmatter: title, date, slug, tags, summary)
- Metrics: `src/data/metrics.json`
- Projects: `src/data/projects.json`
- Newsletter Issues: `src/data/newsletter.json`
- Schemas + loaders: Blog in `src/lib/content.ts`, Metrics in `src/lib/metrics.ts`, Projects in `src/lib/projects.ts`, Newsletter in `src/lib/newsletter.ts` (Zod, validated by `pnpm test`; `content.ts` re-exports the focused modules for backward compatibility)

Replace Placeholder content with real Blog Posts, Metrics, Projects, and Newsletter
Issues via these files — no component changes needed.

### Blog content format (supported Markdown only)

The `.mdx` files are authoring containers: frontmatter (title, date, slug,
tags, summary) plus a Markdown body. Supported: headings, paragraphs, lists,
GFM tables, and fenced code blocks (```ts etc.) with syntax highlighting
(`rehype-highlight`). Raw HTML in a post body is escaped to text, never
rendered as markup.

**Not supported (intentional MVP limitation):** MDX components, JSX
expressions (`{...}`), imports/exports, and other MDX runtime syntax. The
pipeline is `remark` (no MDX compiler by design — no full MDX compiler in
MVP scope). If you add components/expressions they will render as text,
not components. Write posts as plain Markdown + code blocks.

### Newsletter URLs are placeholder (must swap before real use)

Newsletter Issue `url` fields in `src/data/newsletter.json` are placeholder
`https://example.com/` links (ADR-0002). The UI button therefore says
“Read ↗” (honest label — no Substack claim over a placeholder URL). Before
deploying real content, replace each `url` with the real Substack post URL.
Project `githubUrl`/`demoUrl` placeholders (`https://github.com/`,
`https://example.com/`) need the same swap.

## Deployment

### Vercel (ADR-0004)

1. Push to GitHub; import the repo in Vercel (Framework: Next.js, no root override).
2. Build command: `pnpm build` (Next auto-detects; `pnpm install` on install).
3. Environment: set `NEXT_PUBLIC_SITE_URL` to the production URL
   (e.g. `https://your-app.vercel.app`, then the is-a.dev URL below). No backend
   env is needed — no database, auth, or secrets.
4. Deploy; verify `/`, `/blog`, `/dashboard`, `/projects`, `/newsletter`,
   `/sitemap.xml`, `/robots.txt`, and `/feed.xml` all return 200 with no
   console errors (Playwright `pnpm test:e2e` against the preview/prod URL
   via `PLAYWRIGHT_BASE_URL`).

### is-a.dev subdomain wiring

After the Vercel deployment is live:

1. In Vercel → Project → Settings → Domains, add your `*.is-a.dev` subdomain
   (e.g. `yourname.is-a.dev`). Disable the automatic `www` redirect for that
   domain if the register docs require it.
2. Vercel shows the required DNS records — typically an `A` record pointing to
   Vercel (e.g. `76.76.21.21`) at the apex of the registered subdomain and a
   `_vercel` `TXT` record for ownership verification.
3. Add the `A` + `_vercel` `TXT` records via a PR to `is-a-dev/register`
   (the is-a.dev registration repo) per its README. Wait for DNS propagation,
   then confirm Vercel marks the domain verified and the site loads over HTTPS
   at the subdomain.
4. Update `NEXT_PUBLIC_SITE_URL` to the final subdomain URL and redeploy so
   canonicals, sitemap, RSS, and Open Graph point at production.

No code change is needed for the subdomain — `NEXT_PUBLIC_SITE_URL` is
env-driven (`src/lib/site.ts`).

------------------------------------------------------------------------

## Objective

Use **REA (Reverse Engineering Agent)** to understand how
[pankajtanwar.in](https://www.pankajtanwar.in/) works, then rebuild a
simpler or full-featured version using original code and the most
suitable modern technology stack.

The goal is **not to copy proprietary source code**. The target site
should be studied for architecture, UX patterns, feature behavior,
workflows, and publicly observable implementation details, while the
rebuilt application uses independently written code.

------------------------------------------------------------------------

## Target Website

**Reference:** https://www.pankajtanwar.in/

### Areas to Investigate

REA should investigate the website systematically and document:

-   Overall site architecture
-   Page structure and navigation
-   Main user journeys
-   Technical blog implementation
-   Personal metrics/dashboard implementation
-   Side-hustles portfolio
-   Newsletter index and Substack integration
-   Responsive behavior
-   Visual design system
-   Animations and interactions
-   Data sources and API usage
-   Authentication, if any
-   Deployment and hosting clues
-   Static vs dynamic content
-   SEO and metadata
-   Performance characteristics
-   Client-side and server-side technologies
-   Third-party integrations

> **Important:** Only analyze publicly accessible software and behavior.
> Do not bypass authentication, access private systems, or attempt to
> extract secrets, credentials, private data, or protected source code.

------------------------------------------------------------------------

# Reverse Engineering Plan

## Phase 1 --- Reconnaissance

Use REA to map the public-facing application.

### Deliverables

Create an investigation report containing:

``` text
Website
├── Pages
├── Components
├── Navigation
├── User Flows
├── Data Sources
├── APIs
├── External Services
├── Assets
├── Deployment Clues
└── Technology Stack
```

Capture:

-   URL routes
-   Page titles
-   Navigation hierarchy
-   Forms
-   Buttons and interactive elements
-   External links
-   API/network requests where observable
-   Static assets
-   JavaScript bundles and framework indicators
-   HTTP headers
-   Metadata
-   robots.txt
-   sitemap.xml
-   publicly exposed configuration
-   browser console/network behavior where useful

------------------------------------------------------------------------

# Tools

REA is the primary investigation tool.

Use additional tools only when appropriate:

### Browser / Web Inspection

Use browser-based inspection for:

-   DOM structure
-   Network requests
-   JavaScript behavior
-   Responsive layouts
-   Performance
-   Accessibility
-   SEO

### Hopper / Ghidra

Use **Hopper or Ghidra only if there is a legitimate need to inspect
locally obtained executable/binary artifacts**.

They are not expected to be necessary for a normal public website
investigation.

Do not use reverse-engineering tools to bypass access controls or obtain
private/protected material.

------------------------------------------------------------------------

# Feature Requirements

The rebuilt application must contain the following major sections.

## 1. Technical Blog

A technical writing section for publishing engineering articles.

### Requirements

-   Blog index
-   Individual article pages
-   Categories/tags
-   Publication date
-   Reading time
-   Author information
-   Syntax-highlighted code blocks
-   Markdown/MDX support preferred
-   SEO metadata
-   RSS feed
-   Search-friendly URLs
-   Responsive reading experience

### Example Routes

``` text
/blog
/blog/<slug>
/tags/<tag>
```

------------------------------------------------------------------------

## 2. Open Personal Metrics Dashboard

A publicly accessible dashboard displaying selected personal metrics.

### Requirements

-   Dashboard landing page
-   Metric cards
-   Historical trends
-   Charts
-   Last-updated timestamp
-   Clear data-source attribution
-   Mobile-friendly layout
-   Ability to add new metrics later

### Example Routes

``` text
/dashboard
/dashboard/<metric>
```

### Example Metrics

The implementation should keep the data model generic so metrics can be
changed without redesigning the application.

``` text
Metric
├── name
├── value
├── unit
├── timestamp
├── category
├── source
└── historical_values
```

Do not expose sensitive personal information.

------------------------------------------------------------------------

## 3. Side-Hustles Portfolio

A portfolio showcasing projects, experiments, businesses, and side
projects.

### Requirements

-   Portfolio index
-   Project cards
-   Project detail pages
-   Project status
-   Description
-   Technology stack
-   Links
-   Screenshots/images
-   Optional GitHub/demo links

### Example Routes

``` text
/projects
/projects/<slug>
```

### Suggested Project Model

``` text
Project
├── title
├── slug
├── description
├── status
├── technologies
├── image
├── github_url
├── demo_url
└── created_at
```

------------------------------------------------------------------------

## 4. Newsletter Index

Create an index of newsletter content that points to Substack.

### Requirements

-   Newsletter landing page
-   Newsletter/archive cards
-   Publication date
-   Title
-   Short description
-   Substack URL
-   External-link indicator

### Example Route

``` text
/newsletter
```

The application does not need to reproduce Substack itself. It should
act as an organized index linking readers to the original Substack
content.

------------------------------------------------------------------------

# Suggested Information Architecture

``` text
                         ┌──────────────────────┐
                         │      Home Page       │
                         └──────────┬───────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
      ┌─────────────┐       ┌──────────────┐       ┌──────────────┐
      │ Technical   │       │   Personal   │       │ Side-Hustles │
      │    Blog     │       │   Dashboard  │       │   Portfolio  │
      └──────┬──────┘       └──────┬───────┘       └──────┬───────┘
             │                     │                      │
             ▼                     ▼                      ▼
      ┌─────────────┐       ┌──────────────┐       ┌──────────────┐
      │ Blog Posts  │       │    Metrics   │       │   Projects   │
      └─────────────┘       │    Charts    │       │    Details   │
                            └──────────────┘       └──────────────┘

                         ┌──────────────────────┐
                         │ Newsletter / Substack│
                         └──────────────────────┘
```

------------------------------------------------------------------------

# Technical Architecture

The implementation should favor a simple architecture unless
investigation shows that a more complex architecture is justified.

Recommended baseline:

``` text
                    ┌──────────────────────┐
                    │       Browser        │
                    └──────────┬───────────┘
                               │ HTTPS
                               ▼
                    ┌──────────────────────┐
                    │   Web Application    │
                    │  React / Next.js     │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
          ┌──────────┐   ┌───────────┐  ┌────────────┐
          │ Markdown │   │ Metrics   │  │ Substack   │
          │ / MDX    │   │   Data    │  │   Links    │
          └──────────┘   └───────────┘  └────────────┘
                               │
                               ▼
                         ┌───────────┐
                         │ Optional  │
                         │ Database  │
                         └───────────┘
```

------------------------------------------------------------------------

# Initial Technology Stack

The final stack must be selected **after the investigation**, rather
than blindly copying the target site's technology.

A strong default candidate is:

  Layer             Recommended Technology
  ----------------- ------------------------
  Framework         Next.js
  Language          TypeScript
  UI                React
  Styling           Tailwind CSS
  Content           MDX / Markdown
  Charts            Recharts or equivalent
  Validation        Zod
  Testing           Vitest + Playwright
  Package Manager   pnpm
  Deployment        Vercel or equivalent
  Version Control   Git + GitHub

### Architecture Principle

Prefer:

> **Static-first + server-rendered where useful + minimal backend**

Avoid introducing a database, API server, authentication system, or
microservices unless the requirements actually need them.

------------------------------------------------------------------------

# Implementation Plan

## Phase 1 --- Investigation

### Tasks

-   [ ] Analyze the target website with REA
-   [ ] Map all important routes
-   [ ] Identify major UI components
-   [ ] Document user workflows
-   [ ] Identify observable technology-stack indicators
-   [ ] Identify external services
-   [ ] Analyze responsive behavior
-   [ ] Analyze performance
-   [ ] Document SEO implementation
-   [ ] Document content/data architecture
-   [ ] Identify reusable design patterns

### Output

Create:

``` text
docs/
└── reverse-engineering-report.md
```

------------------------------------------------------------------------

# Phase 2 --- Architecture Design

Based on the investigation:

-   [ ] Select final framework
-   [ ] Select content strategy
-   [ ] Select data storage strategy
-   [ ] Define application routes
-   [ ] Define component architecture
-   [ ] Define data models
-   [ ] Define deployment architecture
-   [ ] Define testing strategy

Create:

``` text
docs/
└── architecture.md
```

------------------------------------------------------------------------

# Phase 3 --- Project Bootstrap

Create the application with:

``` text
src/
├── app/
├── components/
├── content/
├── data/
├── lib/
├── styles/
└── types/
```

Additional directories:

``` text
docs/
public/
tests/
```

------------------------------------------------------------------------

# Phase 4 --- Build Core UI

Implement:

-   [ ] Global layout
-   [ ] Header/navigation
-   [ ] Footer
-   [ ] Responsive design
-   [ ] Typography
-   [ ] Theme system if required
-   [ ] Reusable cards
-   [ ] Buttons/links
-   [ ] Loading states
-   [ ] Error states
-   [ ] 404 page

------------------------------------------------------------------------

# Phase 5 --- Implement Blog

Build:

-   [ ] Blog index
-   [ ] Article page
-   [ ] Markdown/MDX pipeline
-   [ ] Tags
-   [ ] Metadata
-   [ ] Code highlighting
-   [ ] RSS
-   [ ] SEO
-   [ ] Sitemap integration

------------------------------------------------------------------------

# Phase 6 --- Implement Metrics Dashboard

Build:

-   [ ] Metric data model
-   [ ] Metric cards
-   [ ] Historical data
-   [ ] Charts
-   [ ] Dashboard layout
-   [ ] Last-updated timestamps
-   [ ] Responsive charts
-   [ ] Data validation

Example:

``` text
/dashboard

┌─────────────────────────────────────────┐
│ Personal Metrics                        │
├─────────────┬─────────────┬─────────────┤
│ Metric A    │ Metric B    │ Metric C    │
│ 123         │ 82%         │ 4.7         │
├─────────────┴─────────────┴─────────────┤
│                                         │
│             Historical Chart             │
│                                         │
└─────────────────────────────────────────┘
```

------------------------------------------------------------------------

# Phase 7 --- Implement Side-Hustles Portfolio

Build:

-   [ ] Portfolio index
-   [ ] Project cards
-   [ ] Project detail pages
-   [ ] Technology tags
-   [ ] Project status
-   [ ] External links
-   [ ] Images/screenshots

------------------------------------------------------------------------

# Phase 8 --- Implement Newsletter Index

Build:

-   [ ] Newsletter page
-   [ ] Newsletter cards
-   [ ] Substack links
-   [ ] Publication metadata
-   [ ] External-link handling

------------------------------------------------------------------------

# Phase 9 --- Testing

Testing must happen before considering the implementation complete.

## Unit Tests

Test:

-   [ ] Utility functions
-   [ ] Data transformation
-   [ ] Validation
-   [ ] Content parsing

## Component Tests

Test:

-   [ ] Navigation
-   [ ] Blog cards
-   [ ] Metric cards
-   [ ] Charts
-   [ ] Project cards
-   [ ] Newsletter cards

## End-to-End Tests

Test:

``` text
Home
  ↓
Blog
  ↓
Article
  ↓
Dashboard
  ↓
Project Portfolio
  ↓
Newsletter
  ↓
Substack
```

Verify:

-   [ ] All routes load
-   [ ] Internal links work
-   [ ] External links work
-   [ ] Mobile layout works
-   [ ] Desktop layout works
-   [ ] No console errors
-   [ ] No broken images
-   [ ] SEO metadata exists
-   [ ] Accessibility basics pass

------------------------------------------------------------------------

# Phase 10 --- Performance & Security

Check:

-   [ ] Lighthouse performance
-   [ ] Core Web Vitals
-   [ ] Image optimization
-   [ ] JavaScript bundle size
-   [ ] Unnecessary client-side JavaScript
-   [ ] Dependency vulnerabilities
-   [ ] Security headers
-   [ ] Content Security Policy where appropriate
-   [ ] No secrets committed to Git
-   [ ] No sensitive personal metrics exposed

------------------------------------------------------------------------

# Phase 11 --- Final Review

Compare the implementation against the original requirements.

### Functional Checklist

-   [ ] Technical blog works
-   [ ] Personal metrics dashboard works
-   [ ] Side-hustles portfolio works
-   [ ] Newsletter index works
-   [ ] Substack links work
-   [ ] Responsive design works
-   [ ] Navigation works
-   [ ] SEO works
-   [ ] Tests pass
-   [ ] Build succeeds
-   [ ] No critical console errors
-   [ ] No critical security issues

------------------------------------------------------------------------

# Expected Repository Structure

The final repository should approximately look like:

``` text
personal-site/
│
├── app/
│   ├── blog/
│   ├── dashboard/
│   ├── newsletter/
│   ├── projects/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   ├── blog/
│   ├── dashboard/
│   ├── projects/
│   └── newsletter/
│
├── content/
│   └── blog/
│
├── data/
│   ├── metrics/
│   ├── projects/
│   └── newsletter/
│
├── lib/
│   ├── content.ts
│   ├── metrics.ts
│   └── utils.ts
│
├── public/
│   ├── images/
│   └── icons/
│
├── tests/
│   ├── unit/
│   ├── component/
│   └── e2e/
│
├── docs/
│   ├── reverse-engineering-report.md
│   └── architecture.md
│
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── tsconfig.json
└── ...
```

------------------------------------------------------------------------

# Multi-Agent Strategy

Up to **8 sub-agents** may be used.

The agents should have clearly separated responsibilities to avoid
duplicated work.

  Agent     Responsibility
  --------- -------------------------------------------------
  Agent 1   Website reconnaissance and route mapping
  Agent 2   Technology-stack and architecture investigation
  Agent 3   UI/UX and responsive-design analysis
  Agent 4   Blog implementation
  Agent 5   Metrics dashboard
  Agent 6   Side-hustles + newsletter
  Agent 7   Testing, accessibility and performance
  Agent 8   Final integration, bug fixing and documentation

### Important

Do not automatically use all 8 agents if the task does not benefit from
parallelization.

Use the minimum number of agents required to complete the work reliably.

------------------------------------------------------------------------

# Development Workflow

Use the following sequence:

``` text
┌─────────────────────┐
│ 1. Investigate      │
│    target website   │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 2. Document findings│
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 3. Design architecture
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 4. Bootstrap project│
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 5. Implement features
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 6. Test             │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 7. Fix bugs         │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 8. Performance + SEO│
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 9. Final validation │
└─────────────────────┘
```

------------------------------------------------------------------------

# Setup Instructions

The final README must be updated with exact setup instructions after
implementation.

At minimum, document:

## Prerequisites

``` bash
node --version
pnpm --version
git --version
```

## Install

``` bash
git clone <repository-url>
cd <project-directory>
pnpm install
```

## Environment Variables

Provide:

``` bash
cp .env.example .env.local
```

Document every required environment variable.

Never commit real secrets.

## Development

``` bash
pnpm dev
```

Application should be available at:

``` text
http://localhost:3000
```

## Test

``` bash
pnpm test
pnpm test:e2e
```

## Production Build

``` bash
pnpm build
pnpm start
```

------------------------------------------------------------------------

# Definition of Done

The task is complete only when:

1.  The target website has been investigated.
2.  Investigation findings are documented.
3.  A simple implementation plan exists.
4.  Architecture is documented.
5.  The application is implemented with independently written code.
6.  Blog functionality works.
7.  Metrics dashboard works.
8.  Side-hustles portfolio works.
9.  Newsletter index works.
10. Substack links work.
11. Responsive behavior is verified.
12. Automated tests pass.
13. Bugs discovered during testing are fixed.
14. Production build succeeds.
15. Basic performance and accessibility checks pass.
16. Setup instructions are complete.
17. Source code is organized and maintainable.
18. No secrets or private information are committed.

------------------------------------------------------------------------

# Final Deliverables

The completed work should provide:

``` text
├── Source code
├── README.md
├── Reverse-engineering report
├── Architecture documentation
├── Test suite
├── Environment-variable example
└── Setup/deployment instructions
```

The final response should also summarize:

-   What was learned from the reference website
-   Which architectural decisions were made
-   Why the selected technology stack was chosen
-   What was implemented
-   What was tested
-   Any known limitations
-   How to run the application locally
-   How to deploy it
