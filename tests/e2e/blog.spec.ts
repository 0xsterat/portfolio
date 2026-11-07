import { test, expect } from "@playwright/test";

/**
 * Blog slice (ticket #3) — route seam smoke.
 * Vocabulary follows GLOSSARY.md (Blog Post, Tag). All content is Placeholder.
 */

test.describe("Blog slice", () => {
  test("Blog index lists 5 Placeholder Blog Posts sorted by date", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(String(err)));

    await page.goto("/blog");
    await expect(page).toHaveTitle(/Blog/);
    await expect(
      page.getByRole("heading", { name: /Engineering Blog Posts/i }),
    ).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();

    const cards = page.getByTestId("blog-card");
    await expect(cards).toHaveCount(5);
    // Most recent first.
    await expect(cards.first()).toContainText("Getting started with static content");
    await expect(cards.last()).toContainText("Theming without flash");
    // Each card shows date, reading time, and summary.
    await expect(cards.first()).toContainText("October 24, 2026");
    await expect(cards.first()).toContainText(/min read/);
    await expect(cards.first()).toContainText(
      "A Placeholder note on keeping content as Markdown files",
    );
    // Tag pills link to search-friendly Tag pages.
    await expect(
      page.getByTestId("blog-list").getByRole("link", { name: "web" }).first(),
    ).toHaveAttribute("href", "/tags/web");

    expect(errors, "no console errors on /blog").toEqual([]);
  });

  test("Blog Post reader shows title, date, reading time, and highlighted code", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(String(err)));

    await page.goto("/blog/getting-started-with-static-content");
    await expect(page).toHaveTitle(/Getting started with static content/);
    await expect(
      page.getByRole("heading", { name: "Getting started with static content" }),
    ).toBeVisible();
    await expect(page.getByText("October 24, 2026").first()).toBeVisible();
    await expect(page.getByText(/min read/).first()).toBeVisible();
    // Fenced code renders with syntax highlighting classes.
    const body = page.getByTestId("blog-body");
    await expect(body).toBeVisible();
    await expect(body.locator("pre")).toContainText("parseBlogPost");
    await expect(body.locator("pre code")).toHaveClass(/language-ts/);
    await expect(body.locator("pre")).toContainText("gray-matter");
    // Highlighted token spans present (rehype-highlight output).
    await expect(body.locator(".hljs-keyword").first()).toBeAttached();
    // Tag pills on the reader link to Tag pages.
    await expect(page.getByTestId("tag-web").first()).toBeVisible();

    // SEO metadata: distinct title/description/canonical.
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /Placeholder note on keeping content/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/blog\/getting-started-with-static-content/,
    );

    expect(errors, "no console errors on Blog Post reader").toEqual([]);
  });

  test("Blog Post reader navigates back to the Blog index", async ({ page }) => {
    await page.goto("/blog/theming-without-flash");
    await expect(
      page.getByRole("heading", { name: "Theming without flash" }),
    ).toBeVisible();
    await page.getByTestId("back-to-blog").click();
    await expect(page).toHaveURL(/\/blog$/);
    await expect(page.getByTestId("blog-card")).toHaveCount(5);
  });

  test("Tag page lists only Blog Posts with that Tag", async ({ page }) => {
    await page.goto("/tags/web");
    await expect(page).toHaveTitle(/web/);
    await expect(
      page.getByRole("heading", { name: /tagged web/i }),
    ).toBeVisible();
    const cards = page.getByTestId("tag-post-list").getByTestId("blog-card");
    await expect(cards).toHaveCount(2);
    await expect(cards.first()).toContainText("Getting started with static content");
    await expect(cards.last()).toContainText("Accessible navigation patterns");
    // Unrelated Blog Posts must not appear.
    await expect(
      page.getByTestId("tag-post-list").getByText("Theming without flash"),
    ).toHaveCount(0);

    // Follow a reader link from the Tag page.
    await cards.first().getByRole("link", { name: /Getting started/ }).click();
    await expect(page).toHaveURL(/\/blog\/getting-started-with-static-content/);
  });

  test("RSS feed, sitemap, and robots.txt are generated and valid", async ({
    request,
  }) => {
    const feed = await request.get("/feed.xml");
    expect(feed.status()).toBe(200);
    expect(feed.headers()["content-type"]).toContain("application/rss+xml");
    const feedBody = await feed.text();
    expect(feedBody).toContain("<?xml version=\"1.0\"");
    expect(feedBody).toContain("<rss");
    expect(feedBody).toContain("<channel>");
    expect(feedBody).toContain("Getting started with static content");
    expect(feedBody).toContain("/blog/getting-started-with-static-content");
    expect(feedBody).toContain("<pubDate>");
    expect((feedBody.match(/<item>/g) ?? []).length).toBe(5);

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const sitemapBody = await sitemap.text();
    expect(sitemapBody).toContain("/blog");
    expect(sitemapBody).toContain("/blog/getting-started-with-static-content");
    expect(sitemapBody).toContain("/tags/web");
    expect(sitemapBody).toContain("/about");

    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    const robotsBody = await robots.text();
    expect(robotsBody).toContain("User-Agent: *");
    expect(robotsBody).toContain("Sitemap:");
    expect(robotsBody).toContain("/sitemap.xml");
  });

  test("Blog link in header/footer navigates from Home to Blog and back", async ({
    page,
  }) => {
    await page.goto("/");
    const blogLinks = page.getByRole("link", { name: "Blog" });
    await expect(blogLinks.first()).toBeVisible();
    await blogLinks.first().click();
    await expect(page).toHaveURL(/\/blog$/);
    await expect(page.getByTestId("blog-card")).toHaveCount(5);
  });
});
