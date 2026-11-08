import { test, expect } from "@playwright/test";
import { watchConsole } from "./helpers";

const KNOWN_PROJECTS = [
  "placeholder-dashboard",
  "static-blog-starter",
  "theme-toggle-experiment",
  "newsletter-index",
  "reading-notes-cli",
];

test.describe("Projects slice (issue #5)", () => {
  test("Projects index lists 5 Placeholder Projects as cards", async ({ page }) => {
    const errors = watchConsole(page);

    await page.goto("/projects");
    await expect(page).toHaveTitle(/Projects/);
    await expect(
      page.getByRole("heading", { name: /Projects/i }).first(),
    ).toBeVisible();

    // 5 cards
    const cards = page.locator("[data-testid='project-card']");
    await expect(cards).toHaveCount(5);

    // Each card shows title, description, status, tech stack
    for (let i = 0; i < 5; i++) {
      const card = cards.nth(i);
      await expect(card.locator("[data-testid='project-title']")).not.toBeEmpty();
      await expect(card.locator("[data-testid='project-description']")).toBeVisible();
      await expect(card.locator("[data-testid='project-status']")).not.toBeEmpty();
      await expect(card.locator("[data-testid='project-tech']")).not.toBeEmpty();
      // link to detail
      const slug = KNOWN_PROJECTS[i];
      const href = await card
        .locator("a[href^='/projects/']")
        .first()
        .getAttribute("href");
      expect(href).toBe(`/projects/${slug}`);
    }

    // Header/footer still present
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();

    expect(errors, "no console errors on /projects").toEqual([]);
  });

  test("Project cards link to detail pages", async ({ page }) => {
    await page.goto("/projects");
    // click first card
    const firstCardLink = page
      .locator("[data-testid='project-card']")
      .first()
      .locator("a[href^='/projects/']")
      .first();
    await firstCardLink.click();
    await expect(page).toHaveURL(/\/projects\//);
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("Project detail page shows title, description, status, tech, external links", async ({
    page,
  }) => {
    const errors = watchConsole(page);

    await page.goto("/projects/placeholder-dashboard");
    await expect(page).toHaveTitle(/Placeholder Dashboard/);
    await expect(
      page.getByRole("heading", { name: /Placeholder Dashboard/i }),
    ).toBeVisible();
    await expect(page.getByText(/Showing a generic Dashboard/i)).toBeVisible();
    await expect(page.getByText("active").first()).toBeVisible();

    // tech stack visible
    await expect(page.getByText("Next.js")).toBeVisible();
    await expect(page.getByText("TypeScript")).toBeVisible();

    // external links
    const github = page.getByRole("link", { name: /GitHub/i }).first();
    await expect(github).toBeVisible();
    await expect(github).toHaveAttribute("href", /^https?:\/\//);
    await expect(github).toHaveAttribute("target", "_blank");

    const demo = page.getByRole("link", { name: /Demo|Live demo/i }).first();
    await expect(demo).toBeVisible();
    await expect(demo).toHaveAttribute("href", /^https?:\/\//);
    await expect(demo).toHaveAttribute("target", "_blank");

    // back link
    await expect(page.getByRole("link", { name: /All Projects|Back to Projects/i })).toBeVisible();

    expect(errors, "no console errors on project detail").toEqual([]);
  });

  test("every Project detail page loads", async ({ page }) => {
    for (const slug of KNOWN_PROJECTS) {
      await page.goto(`/projects/${slug}`);
      await expect(page.getByRole("heading").first()).toBeVisible();
      await expect(page.getByRole("banner")).toBeVisible();
      // status visible
      await expect(page.locator("[data-testid='project-status']")).not.toBeEmpty();
    }
  });

  test("nav links to Projects from header/footer", async ({ page }) => {
    await page.goto("/");
    const navLink = page.getByRole("link", { name: /^Projects$/ }).first();
    await expect(navLink).toBeVisible();
    await navLink.click();
    await expect(page).toHaveURL(/\/projects/);
  });
});
