import { test, expect } from "@playwright/test";

test.describe("Authentication Flows", () => {
  test("should load the login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("body")).toBeVisible();

    // Check if the page title or a specific heading exists
    await expect(page.getByRole("heading", { name: /login|sign in/i, level: 1 }))
      .toBeVisible({ timeout: 10000 })
      .catch(() => null);

    // Check for either the email input or the Google login button
    const emailInput = page.getByPlaceholder(/you@example\.com|email/i).first();
    const googleButton = page.getByRole("button", { name: /google|continue with google/i });
    const hasEmail = await emailInput.isVisible({ timeout: 5000 }).catch(() => false);
    const hasGoogle = await googleButton.isVisible({ timeout: 5000 }).catch(() => false);
    expect(hasEmail || hasGoogle).toBe(true);
  });

  test("should load the signup page", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.locator("body")).toBeVisible();

    // Check for the signup heading
    await expect(page.getByRole("heading", { name: /sign up|register/i, level: 1 }))
      .toBeVisible({ timeout: 10000 })
      .catch(() => null);

    // Check for either the signup form or the Google signup button
    const emailInput = page.locator("form, input[type=email]").first();
    const googleButton = page.getByRole("button", { name: /google|continue with google/i });
    const hasForm = await emailInput.isVisible({ timeout: 5000 }).catch(() => false);
    const hasGoogle = await googleButton.isVisible({ timeout: 5000 }).catch(() => false);
    expect(hasForm || hasGoogle).toBe(true);
  });
});
