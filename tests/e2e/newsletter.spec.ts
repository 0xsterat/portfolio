import { test, expect } from "@playwright/test";

test.describe("newsletter — issue #6", () => {
  test("Newsletter index lists 4 Placeholder Newsletter Issues with external Substack links", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(String(err)));

    await page.goto("/newsletter");

    await expect(page).toHaveTitle(/Newsletter/);
    await expect(
      page.getByRole("heading", { name: /Newsletter/i }).first(),
    ).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();

    const cards = page.getByTestId("newsletter-issue");
    await expect(cards).toHaveCount(4);

    // Title, date, description visible on each card.
    for (const card of await cards.all()) {
      await expect(card.locator("h2, h3").first()).toBeVisible();
      await expect(card.locator("time")).toBeVisible();
      await expect(card.locator("p").first()).toBeVisible();
    }

    // External-link indicator visible; links open in a new tab with noopener.
    const links = page.getByTestId("newsletter-external-link");
    await expect(links).toHaveCount(4);
    for (const link of await links.all()) {
      await expect(link).toBeVisible();
      expect(await link.getAttribute("target")).toBe("_blank");
      expect(await link.getAttribute("rel")).toContain("noopener");
      const href = await link.getAttribute("href");
      expect(href).toMatch(/^https?:\/\//);
    }

    expect(errors, "no console errors on /newsletter").toEqual([]);
  });

  test("Newsletter Issues are sorted by date descending", async ({ page }) => {
    await page.goto("/newsletter");
    const times = page.getByTestId("newsletter-issue").locator("time");
    const datetimes = await times.evaluateAll((els: HTMLTimeElement[]) =>
      els.map((el) => el.getAttribute("datetime")),
    );
    expect(datetimes).toHaveLength(4);
    const stamps = datetimes.map((d) => new Date(d ?? 0).getTime());
    const sorted = [...stamps].sort((a, b) => b - a);
    expect(stamps).toEqual(sorted);
  });

  test("header links navigate to Newsletter", async ({ page }) => {
    await page.goto("/");
    const primaryNav = page.locator("header nav[aria-label='Primary']");
    if ((await primaryNav.isVisible()) ) {
      await primaryNav.getByRole("link", { name: "Newsletter" }).click();
    } else {
      // Mobile viewport: primary nav hidden, drawer button present instead.
      await page.getByTestId("menu-button").click();
      await page
        .getByTestId("mobile-nav")
        .getByRole("link", { name: "Newsletter" })
        .click();
    }
    await expect(page).toHaveURL(/\/newsletter/);
    await expect(
      page.getByRole("heading", { name: /Newsletter/i }).first(),
    ).toBeVisible();
  });
});
