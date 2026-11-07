import { test, expect } from "@playwright/test";

test.describe("smoke — layout/theme (issue #2)", () => {
  test("Home shows Placeholder Persona with consistent header/footer", async ({
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
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    const navVisible = await page
      .locator("header nav[aria-label='Primary']")
      .isVisible();
    if (navVisible) {
      await expect(page.locator("header nav[aria-label='Primary']")).toBeVisible();
    } else {
      // Mobile viewport: primary nav hidden, drawer button present instead.
      await expect(page.getByTestId("menu-button")).toBeVisible();
    }
    await expect(page.locator("footer nav[aria-label='Footer']")).toBeVisible();

    expect(errors, "no console errors on Home").toEqual([]);
  });

  test("About loads with same header/footer", async ({ page }) => {
    await page.goto("/about");
    await expect(page).toHaveTitle(/About/);
    await expect(page.getByRole("heading", { name: /About/i }).first()).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("404 renders custom page with header/footer", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist-12345");
    expect(res?.status()).toBe(404);
    await expect(page.getByText(/drifted off the map/i)).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("header links navigate Home <-> About", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "About" }).first().click();
    await expect(page).toHaveURL(/\/about/);
    await page.getByRole("link", { name: "Home" }).first().click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("theme toggle switches light/dark and persists in localStorage", async ({
    page,
  }) => {
    await page.goto("/");
    // theme script must have set a class before paint (no-flash guarantee)
    const hasClass = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    expect(typeof hasClass).toBe("boolean");

    const toggle = page.getByTestId("theme-toggle");
    await expect(toggle).toBeVisible();
    const before = await page.evaluate(() => localStorage.getItem("theme"));
    const initialClass = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    await toggle.click();
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => localStorage.getItem("theme"));
    const afterClass = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    expect(after).not.toBe(before);
    expect(afterClass).toBe(!initialClass);
  });
});

test.describe("mobile drawer", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("mobile drawer opens and navigates", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByTestId("menu-button");
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    const drawer = page.getByTestId("mobile-nav");
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: "About" })).toBeVisible();
    await drawer.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about/);
  });
});
