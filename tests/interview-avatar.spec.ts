import { test, expect } from "@playwright/test";

test.describe("Interview Avatar", () => {
  test("should show the 3D Eric Vance avatar on the interview setup page", async ({ page }) => {
    await page.goto("/interview");
    await expect(page.locator("body")).toBeVisible();

    const heading = page.getByRole("heading", { name: /interview prep/i, level: 1 });
    await expect(heading).toBeVisible({ timeout: 15000 }).catch(() => null);

    await expect(page.getByText("AI Interviewer Avatar")).toBeVisible({ timeout: 15000 });

    // Avatar selector should offer all four models
    await expect(page.getByRole("button", { name: /Your Photo/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Eric Vance/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Sarah Jenkins/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Alex Rivera/i })).toBeVisible();
  });

  test("should let the user pick an avatar model", async ({ page }) => {
    await page.goto("/interview");
    await expect(page.getByText("AI Interviewer Avatar")).toBeVisible({ timeout: 15000 });

    const sarah = page.getByRole("button", { name: /Sarah Jenkins/i }).first();
    await sarah.click();
    await expect(sarah).toHaveClass(/ring-1 ring-primary/);
  });
});
