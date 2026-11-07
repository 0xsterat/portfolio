import { test, expect } from "@playwright/test";

/**
 * Integration gate (ticket #7) — whole-site smoke.
 * Verifies Home, About, Blog Posts, Dashboard, Projects, and Newsletter Issues
 * work together: all routes load with no critical console errors, SEO metadata /
 * sitemap / RSS are complete on every route, and the full journey
 * Home → Blog → Post → Dashboard → Projects → Newsletter → Substack works.
 * Vocabulary follows GLOSSARY.md. All content is Placeholder.
 */

const ROUTES = [
  "/",
  "/about",
  "/blog",
  "/blog/getting-started-with-static-content",
  "/tags/web",
  "/dashboard",
  "/projects",
  "/projects/placeholder-dashboard",
  "/newsletter",
];

test.describe("integration gate — whole-site smoke (issue #7)", () => {
  test("every public route loads with no console errors and has SEO metadata", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(String(err)));

    for (const route of ROUTES) {
      const res = await page.goto(route);
      expect(res?.status(), `${route} status`).toBe(200);
      // Distinct <title> on every route.
      const title = await page.title();
      expect(title.trim().length, `${route} has a title`).toBeGreaterThan(0);
      await expect(
        page.locator('meta[name="description"]'),
        `${route} has meta description`,
      ).toBeAttached();
      const desc = await page
        .locator('meta[name="description"]')
        .first()
        .getAttribute("content");
      expect((desc ?? "").trim().length, `${route} description non-empty`).toBeGreaterThan(0);
      // Open Graph + Twitter cards present.
      await expect(
        page.locator('meta[property="og:title"]'),
        `${route} has og:title`,
      ).toBeAttached();
      await expect(
        page.locator('meta[property="og:description"]'),
        `${route} has og:description`,
      ).toBeAttached();
      await expect(
        page.locator('meta[name="twitter:card"]'),
        `${route} has twitter:card`,
      ).toBeAttached();
      // Canonical URL present.
      await expect(
        page.locator('link[rel="canonical"]'),
        `${route} has canonical`,
      ).toBeAttached();
      // Consistent header/footer on every route.
      await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();
      // JSON-LD present (WebSite / BlogPosting / ItemList structured data).
      const jsonLd = page.locator('script[type="application/ld+json"]');
      await expect(jsonLd.first(), `${route} has JSON-LD`).toBeAttached();
      const ldText = (await jsonLd.first().textContent()) ?? "";
      expect(ldText.length, `${route} JSON-LD non-empty`).toBeGreaterThan(0);
    }

    expect(errors, "no console errors across all routes").toEqual([]);
  });

  test("Home is live: shows Persona, 5 recent Blog Posts, and links to every section", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(String(err)));

    await page.goto("/");
    await expect(page).toHaveTitle(/Placeholder/);
    await expect(page.getByText("Placeholder Persona").first()).toBeVisible();

    // Home must not contain stale "coming in" copy — all sections are live.
    await expect(page.getByText(/coming in #/i)).toHaveCount(0);

    // 5 most recent Blog Posts on Home (user story 2).
    const recent = page.getByTestId("home-recent-post");
    await expect(recent).toHaveCount(5);
    await expect(recent.first()).toContainText(
      "Getting started with static content",
    );
    await expect(recent.last()).toContainText("Theming without flash");
    // Each recent post links to its own Blog Post URL.
    for (const card of await recent.all()) {
      const href = await card.locator("a").first().getAttribute("href");
      expect(href).toMatch(/^\/blog\//);
    }

    // All four sections are live links (story 3).
    await expect(page.getByTestId("home-section-blog")).toHaveAttribute(
      "href",
      "/blog",
    );
    await expect(page.getByTestId("home-section-dashboard")).toHaveAttribute(
      "href",
      "/dashboard",
    );
    await expect(page.getByTestId("home-section-projects")).toHaveAttribute(
      "href",
      "/projects",
    );
    await expect(page.getByTestId("home-section-newsletter")).toHaveAttribute(
      "href",
      "/newsletter",
    );

    expect(errors, "no console errors on Home").toEqual([]);
  });

  test("NAV union: Home, Blog, Dashboard, Projects, Newsletter, About in header/footer", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = page.locator("header nav[aria-label='Primary']");
    const navVisible = await nav.isVisible();
    const labels = ["Home", "Blog", "Dashboard", "Projects", "Newsletter", "About"];
    if (navVisible) {
      for (const label of labels) {
        await expect(nav.getByRole("link", { name: label })).toBeVisible();
      }
    } else {
      // Mobile: all six links must be in the drawer.
      await page.getByTestId("menu-button").click();
      const drawer = page.getByTestId("mobile-nav");
      await expect(drawer).toBeVisible();
      for (const label of labels) {
        await expect(drawer.getByRole("link", { name: label })).toBeVisible();
      }
    }
    // Footer always shows the full union.
    const footer = page.locator("footer nav[aria-label='Footer']");
    for (const label of labels) {
      await expect(footer.getByRole("link", { name: label })).toBeVisible();
    }
  });

  test("full journey: Home → Blog → Blog Post → Dashboard → Projects → Newsletter → Substack", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(String(err)));

    // Home → Blog
    await page.goto("/");
    await page.getByTestId("home-section-blog").click();
    await expect(page).toHaveURL(/\/blog$/);
    await expect(page.getByTestId("blog-card")).toHaveCount(5);

    // Blog → Blog Post
    await page
      .getByTestId("blog-card")
      .first()
      .getByRole("link", { name: /Getting started/ })
      .click();
    await expect(page).toHaveURL(/\/blog\/getting-started-with-static-content/);
    await expect(page.getByTestId("blog-body")).toBeVisible();

    // → Dashboard (via header nav)
    await page.getByRole("link", { name: "Dashboard" }).first().click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId("metric-card")).toHaveCount(4);

    // → Projects
    await page.getByRole("link", { name: /^Projects$/ }).first().click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByTestId("project-card")).toHaveCount(5);

    // Projects → Project detail
    await page
      .getByTestId("project-card")
      .first()
      .locator("a[href^='/projects/']")
      .first()
      .click();
    await expect(page).toHaveURL(/\/projects\//);
    await expect(page.getByTestId("project-status")).toBeVisible();

    // → Newsletter
    await page.getByRole("link", { name: "Newsletter" }).first().click();
    await expect(page).toHaveURL(/\/newsletter$/);
    await expect(page.getByTestId("newsletter-issue")).toHaveCount(4);

    // Newsletter → Substack (external href + new-tab indicators; do not navigate away).
    const substack = page.getByTestId("newsletter-external-link").first();
    await expect(substack).toBeVisible();
    const href = await substack.getAttribute("href");
    expect(href).toMatch(/^https?:\/\//);
    expect(await substack.getAttribute("target")).toBe("_blank");
    expect(await substack.getAttribute("rel")).toContain("noopener");
    await expect(page.getByText(/external/i).first()).toBeAttached();

    expect(errors, "no console errors across the journey").toEqual([]);
  });

  test("sitemap, robots.txt, and RSS are complete for the whole site", async ({
    request,
  }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const sitemapBody = await sitemap.text();
    // Every public index route.
    for (const path of [
      "/about",
      "/blog",
      "/dashboard",
      "/projects",
      "/newsletter",
      "/blog/getting-started-with-static-content",
      "/blog/notes-on-lightweight-tests",
      "/blog/designing-a-simple-dashboard",
      "/projects/placeholder-dashboard",
      "/projects/static-blog-starter",
      "/tags/web",
    ]) {
      expect(sitemapBody, `sitemap contains ${path}`).toContain(path);
    }
    // All 5 Blog Posts + all 5 Projects + every Tag present.
    const blogCount = (sitemapBody.match(/\/blog\//g) ?? []).length;
    const projectCount = (sitemapBody.match(/\/projects\//g) ?? []).length;
    expect(blogCount).toBeGreaterThanOrEqual(5);
    expect(projectCount).toBeGreaterThanOrEqual(5);
    expect(sitemapBody).toContain("/tags/");

    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    const robotsBody = await robots.text();
    expect(robotsBody).toContain("Sitemap:");
    expect(robotsBody).toContain("/sitemap.xml");

    const feed = await request.get("/feed.xml");
    expect(feed.status()).toBe(200);
    expect(feed.headers()["content-type"]).toContain("application/rss+xml");
    const feedBody = await feed.text();
    expect((feedBody.match(/<item>/g) ?? []).length).toBe(5);
    expect(feedBody).toContain("/blog/getting-started-with-static-content");
  });
});
