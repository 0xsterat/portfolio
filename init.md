# How `pankajtanwar.in` works

**Target:** https://www.pankajtanwar.in/
**Analysis date:** 2026-11-06
**Site title:** "Pankaj Tanwar - CS Engineer, writer & creator."
**Author:** Pankaj Tanwar; Senior Software Engineer at InMobi; GitHub `pankajtanwarbanna`, Twitter `the2ndfloorguy`, email `pankajtanwar510@gmail.com`.

**Summary:** It is a **statically generated Next.js 11 blog + personal dashboard** (pages router, React 17.0.2), deployed on **Vercel**, styled with **Tailwind CSS 2.2.7**, with **MDX** articles compiled at build time, a **Firebase-backed view counter** exposed through `/api/views/*`, a **next-themes** dark/light/"spotlight" theme system, and a paid **Hacker Hub** sold through **Dodo Payments**. There is no native binary anywhere in the stack, so **Hopper/Ghidra were not applicable** — REA's web-bundle + CDP analysis was the right provider.

## 1. What the site is

A personal site for Pankaj Tanwar (Senior Software Engineer at InMobi) combining:

- a technical **blog** (37 posts) and a **coding diary** (39 LeetCode-style posts)
- an **open dashboard** of personal metrics
- a **side-hustles** portfolio
- a **newsletter** index pointing to Substack
- a paid **Hacker Hub** product

## 2. Technology stack

| Layer | Technology | How it was established |
|---|---|---|
| Framework | **Next.js 11.1.4**, pages router | `__NEXT_DATA__`, `_buildManifest.js`, route chunks |
| UI runtime | **React 17.0.2** (no Preact) | version string in the framework chunk |
| Styling | **Tailwind CSS 2.2.7**, class-based `dark:` variant, CSS vars via `--tw-*` | 425 `tw-`/`--tw-` occurrences; `.dark .dark\:prose-dark` rules |
| Theming | **next-themes** with `light` / `dark` / `spotlight` | inline anti-flash script with `next-themes-script`, `localStorage["theme"]` |
| Content | **MDX compiled at build time** → serialized `mdxSource` + `toc` + `frontMatter`, hydrated via `getMDXComponent` | `getMDXComponent` factory in page chunk; `_next/data/*.json` payloads |
| Code blocks | **Custom MDX code component** — `<pre><code class="language-cpp">` wrapped in `.code-line`, token colors as `text-code-*` classes | article HTML + CSS (`#93DDFD`, `#B5F4A5`, `#D9A9FF`, `#FF8383`, `#FFE484`) |
| Math | **KaTeX 0.13.11** CSS from jsDelivr | `<link>` in `<head>` |
| Data fetching | **SWR** (`dedupingInterval`, `focusThrottleInterval`, `revalidateOnFocus`, `mutate`) | option names + cached-hook usage in `f4.js` / `f12.js` |
| Dates / reading time | **date-fns**, `reading-time` | bundle markers |
| Fonts | **Inter** via Google Fonts (400/600/700) | `<link>` + CSS `font-family` |
| Analytics | **GA4 `G-1EFPYRD5SV`** + **Google Tag Manager** | `gtag`/`googletagmanager` requests |
| Hosting | **Vercel** | `server: Vercel`, `x-vercel-cache`, `x-matched-path` |
| Payments | **Dodo Payments** checkout | `checkout.dodopayments.com/buy/pdt_…` |
| Backend data | **Firebase Realtime Database** behind a Next.js API route | inferred — see §7 |
| SEO | JSON-LD (`Organization` + `Article`), OG/Twitter tags, canonical, sitemap, RSS, web manifest | page HTML |

**Build ID:** `DgPFBT6OU-Xqgkdib6r3U`
**Main CSS:** `/_next/static/css/ab073e758c5198a6fb2e.css`

## 3. Architecture and workflow

### Build time

1. Author writes posts as **MDX files** in the repo.
2. `getStaticProps` / `getStaticPaths` compile each MDX file into `{ mdxSource, toc, frontMatter }`, add `authorDetails`, `prev`, `next`, and emit static HTML.
3. Next.js also emits `_next/data/<buildId>/<route>.json` for client-side navigation:
   - `index.json` → `pageProps.posts` (37)
   - `blogs.json` → `initialDisplayPosts`, `posts`, `pagination` (currentPage / totalPages)
   - `coding-diary.json` → 39 posts
   - `open-dashboard.json` → `stats` (`social-media`, `bike-report-card`, `bike-fuel-efficiency`, `bike-cost-split`)
   - `blog/<slug>.json` → `post`, `authorDetails`, `prev`, `next`
4. Vercel serves the output with `cache-control: public, max-age=0, must-revalidate` and edge caching (`age`, `x-vercel-cache`).

### Runtime

```
Browser
 ├─ HTML (SSG) + inline theme script   → paints correct theme before hydration
 ├─ hydrate React 17 + page chunk
 ├─ SWR  GET  /api/views/<slug>        → { total }        (view counter)
 ├─ POST /api/views/<slug>             → increment        (only on blog pages)
 ├─ GET       /api/views/analytics     → { total, trending, analytics }
 ├─ gtag/GTM beacons                   → GA4
 └─ external: KaTeX CDN, Google Fonts, Substack, Dodo checkout
```

### View-counter flow (the only real dynamic feature)

- A shared `ViewCounter` component takes `slug` and `blogPage`.
- It renders `SWR("/api/views/" + slug)` → `total`, formatted with `toLocaleString()`, showing `–––` when zero.
- On article pages (`blogPage=true`) an effect fires `fetch(..., { method: "POST" })` once per slug.
- The Next.js API route (serverless) reads/writes **Firebase Realtime Database**; the browser never talks to Firebase directly — good for privacy and avoids shipping credentials.
- Observed live values: one post `20,967` views; site aggregate **382,504** views at capture time. `/api/views/analytics` returns per-date series + per-slug totals, which is what powers the dashboard's "Realtime Blog Views" widget.

### Dashboard flow

- Page props already contain four stat blocks at build time.
- The client makes exactly one extra call, `/api/views/analytics`, for live blog numbers.
- Sections observed: Workout Tracker, Food Tracker, Social Media Metrics, Bike Report Card, Fuel Efficiency, Expenses Split, Realtime Blog Views.

### Monetization flow

- `/hacker-hub` is a marketing page: pricing (`$10 Lifetime Access`, `$99 Lifetime Premium`), feature categories, testimonials.
- CTAs link to `checkout.dodopayments.com/buy/pdt_i32pUo96IgEYgj6Qf6kdC` and `…pdt_psrwSAT75o40oSHZSXxjW`, each with `redirect_url=https://pankajtanwar.in/thank-you`.
- `/thank-you` is the post-purchase landing page.

## 4. Feature inventory

| Route | What it does |
|---|---|
| `/` | Hero ("Hi 👋, I'm Pankaj."), 5 latest posts with date + view count, "All Posts" |
| `/blogs` | Paginated archive (37 posts, `pagination.totalPages`) |
| `/blog/[...slug]` | MDX article: reading time, TOC, syntax-highlighted code, KaTeX, prev/next, view counter |
| `/coding-diary` + `/code/[...slug]` | 39 daily coding problems, same MDX pipeline, view counter |
| `/about` | Bio, current role, contact email, pet names (Kafka & Docker) |
| `/open-dashboard` | Personal metrics dashboard + live view analytics |
| `/side-hustles` | Project cards (AI Helmet, Zerodha-controlled lights, "Real Dark Mode", etc.) with view counts |
| `/newsletter` | Archive of issues, links out to `pankajtanwar.substack.com`; **no on-site signup form** |
| `/hacker-hub` | Paid project/code library via Dodo Payments |
| `/side-quests` | Passport-style side-quest page |
| `/thank-you` | Post-purchase confirmation |
| `/404` | Custom playful 404 |
| `/travel/[...slug]` | Declared in `_buildManifest.js` but returns 404 — unused/scaffolded |

Supporting artifacts: `/feed.xml` (RSS), `/sitemap.xml` (60 URLs), `/robots.txt` (ASCII art + `Disallow: /*?*`), `/static/favicons/site.webmanifest`.

## 5. Design system

- **Dark-first**: `body { background:#0a0a0a }`, neutral gray scale (`#171717`, `#262626`, `#404040`, `#737373`, `#a3a3a3`, `#f5f5f5`).
- **Accent**: teal (`#14b8a6` / `#2dd4bf`) for links and "Read more"; the name in the hero uses a **pink→purple gradient**.
- **Type**: Inter; monospace stack (`ui-monospace, SFMono-Regular, Menlo…`) for code.
- **Layout**: narrow centered column (~700 px prose), bordered rounded cards, generous vertical rhythm, minimal chrome.
- **Header**: wordmark + `Blogs`, `Open Dashboard`, `Side Hustles`, `About` + theme dropdown (moon icon + chevron). Repeated in a mobile drawer.
- **Footer**: two-column link lists (Blogs, 404, Newsletter, Coding Diary, About, My Projects), social icons (GitHub, LinkedIn, Twitter, mail, RSS), copyright.
- **Themes**: `light`, `dark`, `spotlight`. Spotlight is the author's "Real Dark Mode" side project — screen stays pitch black and a flashlight follows the cursor. Theme is applied by an inline script before paint (no flash), stored in `localStorage["theme"]`.
- **Content styling**: `prose` typography, custom token palette for code, KaTeX for math, anchor-linked headings.

## 6. Shared content shape

```jsonc
// _next/data/<buildId>/blog/<slug>.json
{
  "pageProps": {
    "post": { "mdxSource": { "compiledSource": "...", "scope": {} },
              "toc": [{ "value": "TLDR;", "url": "#tldr", "depth": 2 }],
              "frontMatter": { "title", "date", "tags", "summary", "draft", ... } },
    "authorDetails": [{ "name", "avatar", "readingTime", "slug" }],
    "prev": { ... }, "next": { ... }
  }
}
```

Post front matter consistently carries `title`, `date`, `tags`, `draft`, `summary`, `author`, `slug` (+ `popularity`/`readingTime` in some lists).

## 7. Observed vs inferred vs unknown

### Observed (direct evidence)
- Next.js 11.1.4 / React 17.0.2, pages router, build ID, per-route chunks
- All `_next/data` payload shapes, post counts, pagination
- Complete route table from `_buildManifest.js`
- Tailwind 2.2.7 output, custom `text-code-*` palette, dark/spotlight theming
- SWR usage and the exact `/api/views` calls (GET + POST)
- Live API responses: `{"total":20967}` and `{"total":382504,"trending":{…},"analytics":{…}}`
- Vercel headers, GA4/GTM traffic, KaTeX/Inter CDNs
- Dodo Payments checkout URLs and pricing
- RSS/sitemap/robots/manifest

### Inferred (strong but not directly proven)
- **Firebase Realtime Database** is the store behind `/api/views` — the client bundle contains **no Firebase SDK**, and the author's own article documents the Next.js API route + Firebase design. So the API route is a thin proxy over Firebase's REST API.
- **next-mdx-remote-style pipeline** — `getMDXComponent` + serialized `compiledSource` is that library's fingerprint.
- **Custom syntax highlighter** rather than Prism/Shiki/highlight.js — none of those appear, while `text-code-*` classes and `.code-line` wrappers do.
- Dashboard stats are **baked at build** (they arrive in `open-dashboard.json`), refreshed only when the site is rebuilt/redeployed.
- No comments, auth, or on-site newsletter capture — no forms, no auth SDK, no comment vendor in the bundle.

### Unknown / not observable from the client
- Server-side source of `/api/views/[slug]` and `/api/views/analytics`, plus the Firebase schema, security rules, and write throttling.
- Whether paid **Hacker Hub content** is delivered via a separate gated route, email, or post-purchase redirect — only the public marketing page is visible.
- Whether ISR/`revalidate` is used. The HTML was served with a very old `age` (~969k s) and `must-revalidate`, consistent with a long-lived static deployment, but that alone doesn't prove the config.
- Why `/travel/[...slug]` is compiled but empty.
- Any analytics beyond GA4/GTM.

## 8. Why not Hopper or Ghidra

Hopper and Ghidra analyze **native machine code**. This target ships only HTML, CSS, and minified JavaScript — there is no Mach-O/ELF/PE binary, WASM module, or firmware image to disassemble. REA's `analyze_web_bundle` (15 scripts, 98,892 AST nodes, 0 parse failures) plus `inspect_web_page` and live HTTP/CDP observation covered every layer that exists here.

## 9. Method and evidence

- **REA (primary):**
  - `list_browser_targets` via loopback CDP `http://127.0.0.1:9333` — page target `EE8114E38AAD23BA3ABEFE4A73AA9966`
  - `analyze_web_bundle` — 15 scripts, 98,892 AST nodes, 0 parse failures, Next.js high-confidence fingerprint
  - `inspect_web_page` — DOM (331 nodes), accessibility tree (285 nodes), resources, storage
  - `get_evidence_bundle` / route summary views for chunk graph and route inventory
- **Browser tools:** navigation/screenshot of homepage and `/open-dashboard`, network request list + bodies for response headers and API JSON
- **Direct HTTP inspection:** `_next/data/<buildId>/*.json`, `_buildManifest.js`, sitemap, RSS, robots.txt, web manifest, MDX article HTML, Hacker Hub checkout links
- **Local bundle greps:** downloaded JS/CSS into `/private/var/folders/jx/ydyj1xrx2mggqkp3qpcry2100000gn/T/pankaj-js/` and searched stack markers (`tailwind`, `next-themes`, `date-fns`, `api/views`, `text-code-*`, SWR options)

### Evidence IDs

| Evidence | ID |
|---|---|
| Full bundle analysis (routes, chunks, vendor fingerprints) | `ev_ac34d8fcbc00851bf2bef1774d7ee3763b339512e5f24d9f016c574f76a6a2b7` |
| Second bundle pass (parent record) | `ev_691d8e8ca359efd2cde6d27cbd98f24208825b707fc1d53485a7d6ee56f33532` |
| Route summary view (10 routes) | `ev_bd8da5ff0d7521278039855d6431790f6f8465c511101da8bfaef0ebcee38cca` |
| Passive page inspection (DOM/a11y/resources) | `ev_d53b7d3bee4efe78ebffc687f29a08bd67dc2c924ca693176c4015e51d66ffa2` |

### Key artifacts observed

- **Next.js build ID:** `DgPFBT6OU-Xqgkdib6r3U`
- **Chrome CDP endpoint:** `http://127.0.0.1:9333`; page target `EE8114E38AAD23BA3ABEFE4A73AA9966`
- **Analyzed bundle:** 15 captured scripts, 98,892 AST nodes
- **Routes from bundle:** `/`, `/404`, `/about`, `/blogs`, `/blog/[...slug]`, `/coding-diary`, `/newsletter`, `/open-dashboard`, `/side-hustles`, plus from `_buildManifest.js`: `/code/[...slug]`, `/hacker-hub`, `/side-quests`, `/thank-you`, `/travel/[...slug]`
- **View counter API:** `GET /api/views/what-is-the-sorting-algorithm-behind-order-by-query-in-mysql` → `{"total":20967}`; `GET /api/views/analytics` → `{"total":382504,"trending":{…},"analytics":{"date":count,…}}`
- **Hacker Hub payouts:**
  - `https://checkout.dodopayments.com/buy/pdt_i32pUo96IgEYgj6Qf6kdC?quantity=1&redirect_url=https://pankajtanwar.in/thank-you`
  - `https://checkout.dodopayments.com/buy/pdt_psrwSAT75o40oSHZSXxjW?quantity=1&redirect_url=https://pankajtanwar.in/thank-you`
  - Prices `$10 Lifetime Access`, `$99 Lifetime Premium`
- **Vercel headers observed:** `server: Vercel`, `cache-control: public, max-age=0, must-revalidate`, `x-matched-path: /`

### Known artifacts (local, ephemeral)

- `/private/var/folders/jx/ydyj1xrx2mggqkp3qpcry2100000gn/T/pankaj-js/`: downloaded site JS/CSS for stack greps
- `f2.js`: Next.js 11.1.4 runtime and Preact/React internals
- `f3.js`: next-themes, gtag, analytics config
- `f4.js`: SWR implementation (module 821)
- `f12.js`, `f14.js`, `f5.js`: view-counter component, SWR fetch, POST increment
- `f15.js`: Tailwind CSS 2.2.7, spotlight CSS, remark/code styles
- `f8.js`: date-fns
- `/private/var/folders/jx/ydyj1xrx2mggqkp3qpcry2100000gn/T/rea-pankaj-profile`: headless Chrome profile
- `/private/var/folders/jx/ydyj1xrx2mggqkp3qpcry2100000gn/T/rea-pankaj-chrome.log`: Chrome CDP log
