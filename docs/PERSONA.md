# Persona: add your name, contact, and profile picture

Single source of truth: `src/lib/site.ts` → `persona` + `site`. Home, About,
metadata/OG, and JSON-LD all read from there — no other files need touching for
text. The site currently shows **Placeholder Persona** (ADR-0002).

## 1. Name and contact (one file)

Edit `src/lib/site.ts`:

```ts
export const persona = {
  name: "Atharva Tayade",
  role: "Software Engineer",
  tagline: "I build and write about the web.",
  email: "atharva.tayade555@gmail.com",
  location: "India",
  links: [
    { label: "GitHub", href: "https://github.com/0xsterat" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "X", href: "https://x.com/" },
  ],
} as const;

export const site = {
  name: "Atharva Tayade",
  description: "Portfolio with engineering notes, a metrics dashboard, projects, and newsletter index.",
};
```

Replace every value with your own. This updates automatically:

- `src/app/page.tsx` — Home hero (`Hi, I'm {name}`), role, tagline, Contact
  `mailto:` button, WebSite JSON-LD author.
- `src/app/about/page.tsx` — About heading, Role/Based/Contact rows, links,
  Person JSON-LD.
- `src/app/layout.tsx` — `<title>`, Open Graph, Twitter.
- `src/components/footer.tsx` — ® name + links. Note: it hardcodes
  `· Placeholder content` — delete that suffix when you go real.

## 2. Profile picture (image file + `persona.image`)

There is **no avatar UI yet** — `persona` has no image field. Add it:

a) Drop your image in `public/` (Next serves `public/*` at `/`):

```bash
# square crop, 512×512+, < 500KB JPG/WebP recommended
cp ~/Pictures/profile.jpg public/avatar.jpg
```

b) Add the field + render it. In `src/lib/site.ts`, add `image: "/avatar.jpg",`
to `persona`. Then in `src/app/page.tsx` (hero, above the heading) and
`src/app/about/page.tsx` (top), render:

```tsx
import Image from "next/image";
// ...
<Image
  src={persona.image}
  alt={persona.name}
  width={120}
  height={120}
  className="rounded-full"
/>
```

`persona` is `as const`, so `persona.image` type-checks once the field exists.

## 3. Tests to update

These assert "Placeholder Persona" and will fail after a real swap — update:

- `tests/unit/site-config.test.ts` — `expect(persona.name).toContain("Placeholder")`.
- `tests/unit/metadata.test.ts` — authors `["Placeholder Persona"]` (or assert your name).
- `tests/e2e/smoke.spec.ts` + `tests/e2e/integration.spec.ts` — `getByText("Placeholder Persona")`.

## 4. Verify and ship

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
pnpm dev  # check / and /about at http://localhost:3000
```

Then commit + push (`main` is Vercel-connected, so push auto-deploys), or:

```bash
pnpm dlx vercel deploy --prod
```

Confirm `https://atharvabuilds.vercel.app` and `/about` show your name, photo,
and contact, and that `NEXT_PUBLIC_SITE_URL` is still `https://atharvabuilds.vercel.app`
(or the is-a.dev URL after DNS). No Vercel env change is needed for persona —
it's build-time code.
