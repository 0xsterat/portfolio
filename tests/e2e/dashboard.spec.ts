import { test, expect } from "@playwright/test";
import { watchConsole } from "./helpers";

test.describe("dashboard slice (issue #4)", () => {
  test("Dashboard shows 4 Metric cards with value, unit, category, source, timestamp and trend charts", async ({
    page,
  }) => {
    const errors = watchConsole(page);

    await page.goto("/dashboard");
    await expect(page).toHaveTitle(/Dashboard/);
    await expect(
      page.getByRole("heading", { name: "Dashboard", exact: true }).first(),
    ).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();

    const cards = page.getByTestId("metric-card");
    await expect(cards).toHaveCount(4);

    // Each card shows value+unit, category, source, timestamp, and a chart.
    for (let i = 0; i < 4; i++) {
      const card = cards.nth(i);
      await expect(card.getByTestId("metric-value")).toBeVisible();
      await expect(card.getByTestId("metric-category")).toBeVisible();
      await expect(card.getByTestId("metric-source")).toBeVisible();
      await expect(card.getByTestId("metric-timestamp")).toBeVisible();
      await expect(card.getByTestId("metric-chart")).toBeVisible();
      await expect(card).toContainText(/Historical trend/i);
    }

    // Header/footer navigation includes Dashboard.
    await expect(page.getByRole("link", { name: "Dashboard" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Dashboard" }).last()).toBeVisible();

    expect(errors, "no console errors on Dashboard").toEqual([]);
  });

  test("Dashboard is usable on mobile widths", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const errors = watchConsole(page);

    await page.goto("/dashboard");
    const cards = page.getByTestId("metric-card");
    await expect(cards).toHaveCount(4);
    // Cards stack in a single column: widths should all be near viewport.
    const widths = await cards.evaluateAll((els) =>
      els.map((el) => el.getBoundingClientRect().width),
    );
    for (const width of widths) {
      expect(width).toBeGreaterThan(280);
      expect(width).toBeLessThanOrEqual(375);
    }
    expect(errors, "no console errors on mobile Dashboard").toEqual([]);
  });
});
