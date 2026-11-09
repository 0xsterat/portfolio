# is-a.dev PR — atharvatayade.is-a.dev (prep only, do not file yet)

Status: **PREPARED LOCALLY** — not filed. Per request, you file the PR yourself
after the Vercel deploy is live and the real records are filled in.

Subdomain `atharvatayade.is-a.dev` checked 2026-11-08: **available**
(`domains/atharvatayade.json` returns 404 in is-a-dev/register).
GitHub owner for `owner.username`: `0xsterat`.

## Why this is blocked until AFTER Vercel deploy

is-a.dev Vercel flow requires two values that only exist after you add the
custom domain in the Vercel dashboard (see https://docs.is-a.dev/guides/vercel/):

1. `A` record IP (e.g. `216.198.79.1` in current docs; use whatever your
   dashboard shows — do NOT hardcode from the old README).
2. `_vercel` `TXT` verification string.

Both JSON files must be in `domains/` in your fork of `is-a-dev/register`:

- `domains/atharvatayade.json` → root prep copy: `./atharvatayade.json`
- `domains/_vercel.atharvatayade.json` → root prep copy: `./_vercel.atharvatayade.json`

## Files in this folder

| File | Purpose |
| ---- | ------- |
| `atharvatayade.json` | A-record file — replace `REPLACE_WITH_VERCEL_A_RECORD_FROM_DASHBOARD` |
| `_vercel.atharvatayade.json` | TXT verification file — replace `REPLACE_WITH_VERCEL_TXT_VERIFICATION_STRING_FROM_DASHBOARD` |
| `PULL_REQUEST_BODY.md` | Copy-paste body for the PR (template + preview + purpose) |
| `RUNBOOK.md` | Step-by-step deploy → domain → fork → PR → env update |

## Before filing

- [ ] Replace both `TODO-replace-with-real-email@example.com` with a real
      contact email (or use a contact path the maintainers accept; the PR
      template requires contact info). `username` stays `0xsterat` — it must
      exactly match the GitHub account that opens the PR.
- [ ] Fill in the real `A` and `TXT` values from Vercel. Keep `A` as an array
      of strings. Validate both files with `jsonlint` / `npx prettier --check`.
- [ ] Confirm filename rules: lowercase, alphanumeric + `-`, no `--`, no
      reserved name (`atharvatayade` is not reserved).
- [ ] Confirm the site is reachable at the Vercel preview/prod URL and
      includes a live link in the PR (required by the template).
- [ ] Note the repo's own warning: "Do not use AI to generate your request" —
      since you are filing manually, adjust the wording in your own voice if
      needed. The structure below conserves the mandatory template exactly.
