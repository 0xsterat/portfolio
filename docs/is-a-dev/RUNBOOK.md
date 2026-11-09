# Runbook: Vercel deploy → atharvatayade.is-a.dev

Status (2026-11-08): **Steps 1–3 DONE** — production live at
`https://atharvabuilds.vercel.app` (`atharvabuilds-d5epb1967…`, Ready,
canonicals + sitemap/RSS correct, `PLAYWRIGHT_BASE_URL=… pnpm test:e2e` 54/54 pass).
Project renamed `portfolio_rea → atharvabuilds` + `vercel domains add
atharvabuilds.vercel.app`; old `https://portfoliorea.vercel.app` still
resolves to the prior production build. Git fix applied:
Project Settings / Git shows `0xsterat/portfolio` **Connected just now**,
which mapped the GitHub noreply commit author and unblocked deploys.
**Next: step 4 (you add the custom domain).**

Ordered steps. Steps 1–3 need your Vercel login; steps 4–8 produce the real
DNS values; step 9 is the manual PR (prep-only mode).

## 1. Log in to Vercel (you run this)

```bash
pnpm dlx vercel login
# or: npx vercel login
```

This opens a browser. After it succeeds, tell the agent "vercel login done" and
it will run steps 2–3 for you. The CLI is currently `Logged out` (checked via
`pnpm dlx vercel whoami`).

## 2. Link the project (agent, after login)

```bash
cd /Users/atharva/projects/pankaj_rea/portfolio_rea
pnpm dlx vercel link
# If prompted: project "portfolio", framework Next.js, no root override.
```

If a Vercel project for this repo already exists and is linked to GitHub, the
`main` push (PR #8, commit `69f75e2`) may already have deployed — the agent
will verify via `vercel ls` / `vercel inspect` instead of creating a duplicate.

## 3. Deploy to production (agent, after link)

```bash
pnpm dlx vercel deploy --prod
```

Then set the production site URL and redeploy (NEXT_PUBLIC vars are baked at
build time — see README "Deployment"):

```bash
pnpm dlx vercel env add NEXT_PUBLIC_SITE_URL production
# value: the deployed https://*.vercel.app URL from step 3
pnpm dlx vercel deploy --prod
```

Verify locally remote routes return 200 with no console errors:

```bash
PLAYWRIGHT_BASE_URL=https://<your-app>.vercel.app pnpm test:e2e
```

## 4. Add custom domain in Vercel dashboard (you do this)

Vercel → Project → Settings → Domains → Add Domain →
`atharvatayade.is-a.dev`.

- **Disable** the automatic "redirect to www" option (per
  https://docs.is-a.dev/guides/vercel/ and README).
- Choose "Configure DNS manually" / "Continue manually" when shown.
- **Copy both values immediately**:
  - the `A` record IP Vercel shows (current docs example: `216.198.79.1`);
  - the `_vercel` `TXT` verification string.

Paste them into the prep files in this folder (see README.md).

## 5. Fork and add files (you do this)

```bash
gh repo fork is-a-dev/register --clone=false
# Then via GitHub web UI or a fresh clone: create in domains/
#   domains/atharvatayade.json          (copy of ./atharvatayade.json)
#   domains/_vercel.atharvatayade.json  (copy of ./_vercel.atharvatayade.json)
```

Keep `owner.username` = `0xsterat`. Validate JSON, e.g.
`npx prettier --check domains/atharvatayade.json`.

## 6. Open the PR (you do this)

Base: `is-a-dev/register`, head: your fork's branch. Body: exact contents of
`PULL_REQUEST_BODY.md` with the real Vercel URL substituted and checkboxes
left as `[x]`. Do not strip the HTML comments — validation depends on them.

## 7. After merge (Vercel → is-a.dev live)

- Wait a few minutes for DNS publication; confirm Vercel marks
  `atharvatayade.is-a.dev` Verified and the site loads over HTTPS.
- Check `/sitemap.xml`, `/feed.xml`, `/robots.txt` reflect the final URL
  (after step 8 redeploy).

## 8. Point canonicals at production and redeploy

```bash
pnpm dlx vercel env add NEXT_PUBLIC_SITE_URL production
# value: https://atharvatayade.is-a.dev
pnpm dlx vercel deploy --prod
```

## Caveats

- The site still ships **Placeholder content** (ADR-0002). is-a.dev manual
  review checks "reachable and completed" and may reject very little content.
  Replace Placeholder Persona / Blog Posts / Projects before expecting approval.
- README steps say `A 76.76.21.21`; current is-a.dev Vercel docs show
  `216.198.79.1`. **Always use the value your own Vercel dashboard shows.**
