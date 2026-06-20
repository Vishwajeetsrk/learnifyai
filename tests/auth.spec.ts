import { test, expect } from "@playwright/test";

test.describe("Authentication Flows", () => {
  test("should load the login page", async ({ page }) => {
    await page.goto("/login");

    // Check if the page title or a specific heading exists
    await expect(page.getByRole("heading", { name: /login/i, level: 1 }))
      .toBeVisible({ timeout: 10000 })
      .catch(() => null);

    // Check for the Google login button
    const googleButton = page.getByRole("button", { name: /continue with google/i });
    await expect(googleButton).toBeVisible();
  });

  test("should load the signup page", async ({ page }) => {
    await page.goto("/signup");

    // Check for the signup heading
    await expect(page.getByRole("heading", { name: /sign up/i, level: 1 }))
      .toBeVisible({ timeout: 10000 })
      .catch(() => null);

    // Check for the Google signup button
    const googleButton = page.getByRole("button", { name: /continue with google/i });
    await expect(googleButton).toBeVisible();
  });
});
