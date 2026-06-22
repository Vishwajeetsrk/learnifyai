import { test, expect } from "@playwright/test";

test.describe("Content Manager Dashboard Verification", () => {
  test.beforeEach(async ({ page }) => {
    // 1. Log in as admin
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    const emailInput = page.getByPlaceholder(/you@example\.com/i);
    await emailInput.fill("admin@learnify.ai");
    await page.locator("#password").fill("AdminPass123!");

    // Dismiss cookie consent if it appears to prevent click interception
    const acceptCookies = page.getByRole("button", { name: /accept all/i });
    await acceptCookies.waitFor({ state: "visible", timeout: 3000 }).catch(() => null);
    if (await acceptCookies.isVisible()) {
      await acceptCookies.click();
    }

    await page.getByRole("button", { name: /sign in/i }).click();

    // Wait for authentication and redirection to dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
  });

  test("should successfully load Content Manager and verify all sections are working", async ({ page }) => {
    // Navigate to admin content manager
    await page.goto("/admin/content");
    await page.waitForLoadState("networkidle");

    // Verify main header
    await expect(page.locator("h1", { hasText: "Content Manager" })).toBeVisible();

    // Verify Tab Triggers are present
    const tabs = [
      { name: "Events", clickTarget: 'Events', verifyText: "New event" },
      { name: "Jobs", clickTarget: 'Jobs', verifyText: "New job" },
      { name: "Pricing", clickTarget: 'Pricing', verifyText: "New plan" },
      { name: "Site Settings", clickTarget: 'Site', verifyText: "Add custom setting" },
      { name: "Cert Templates", clickTarget: 'Cert Templates', verifyText: "New template" },
      { name: "Issue Cert", clickTarget: 'Issue Cert', verifyText: "Find user by email" },
      { name: "FAQs", clickTarget: 'FAQs', verifyText: "New FAQ" },
      { name: "Pages", clickTarget: 'Pages', verifyText: "Edit the HTML content for each legal page" },
      { name: "Roadmap", clickTarget: 'Roadmap', verifyText: "Add item" },
      { name: "Coupons", clickTarget: 'Coupons', verifyText: "Add coupon" },
      { name: "Community Groups", clickTarget: 'Community Groups', verifyText: "New group" },
      { name: "Visibility", clickTarget: 'Visibility', verifyText: "Feature Visibility Manager" }
    ];

    for (const t of tabs) {
      console.log(`Checking Tab: ${t.name}`);
      const trigger = page.locator(`button[role="tab"]:has-text("${t.clickTarget}")`);
      await expect(trigger).toBeVisible();
      await trigger.click();
      
      // Allow up to 15 seconds for lazy-loaded modules and Supabase queries to load
      await expect(page.getByText(t.verifyText)).toBeVisible({ timeout: 15000 });
    }
  });
});
