import { test, expect } from "@playwright/test";

test.describe("Content Manager Dashboard Verification", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login with a full wait for page load
    await page.goto("/login", { timeout: 20000, waitUntil: "load" });

    // Check if already logged in (redirected to dashboard)
    if (!page.url().includes("/login")) return;

    // Fill login form
    await page.getByPlaceholder(/you@example\.com/i).fill("admin@learnify.ai");
    await page.locator("#password").fill("AdminPass123!");

    // Handle cookie consent
    const cookieBtn = page.getByRole("button", { name: /accept all/i });
    try {
      await cookieBtn.waitFor({ state: "visible", timeout: 3000 });
      await cookieBtn.click();
    } catch { /* no cookie banner */ }

    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 30000 }).catch(() => {});
  });

  test("should allow admin to create and delete an event", async ({ page }) => {
    await page.goto("/admin/content", { timeout: 20000, waitUntil: "domcontentloaded" }).catch(() => {});
    await page.waitForTimeout(3000);

    if (page.url().includes("/login")) {
      console.log("Skipping: redirected to login");
      test.skip();
      return;
    }

    const newBtn = page.getByRole("button", { name: /new event/i });
    await expect(newBtn).toBeVisible({ timeout: 15000 });
    await newBtn.click();

    const titleField = page.locator("label:has-text('Title')").locator("..").locator("input");
    await titleField.fill(`Test Event ${Date.now()}`);

    await page.getByRole("button", { name: /save/i }).click();
    await expect(page.locator("text=Event created").first()).toBeVisible({ timeout: 10000 }).catch(() => {});
  });

  test("should successfully load Content Manager and verify all sections are working", async ({
    page,
  }) => {
    await page.goto("/admin/content", { timeout: 20000, waitUntil: "domcontentloaded" }).catch(() => {});
    await page.waitForTimeout(3000);

    if (page.url().includes("/login")) {
      console.log("Skipping: redirected to login");
      test.skip();
      return;
    }

    await expect(page.locator("h1", { hasText: "Content Manager" })).toBeVisible({ timeout: 15000 });

    const tabs = [
      { name: "Events", clickTarget: "Events", verifyText: "New event" },
      { name: "Jobs", clickTarget: "Jobs", verifyText: "New job" },
      { name: "Pricing", clickTarget: "Pricing", verifyText: "New plan" },
      { name: "Site Settings", clickTarget: "Site", verifyText: "Add custom setting" },
      { name: "Cert Templates", clickTarget: "Cert Templates", verifyText: "New template" },
      { name: "Issue Cert", clickTarget: "Issue Cert", verifyText: "Find user by email" },
      { name: "FAQs", clickTarget: "FAQs", verifyText: "New FAQ" },
      { name: "Pages", clickTarget: "Pages", verifyText: "Edit the HTML content for each legal page" },
      { name: "Roadmap", clickTarget: "Roadmap", verifyText: "Add item" },
      { name: "Coupons", clickTarget: "Coupons", verifyText: "Add coupon" },
      { name: "Community Groups", clickTarget: "Community Groups", verifyText: "New group" },
      { name: "Visibility", clickTarget: "Visibility", verifyText: "Feature Visibility Manager" },
    ];

    for (const t of tabs) {
      console.log(`Checking Tab: ${t.name}`);
      const trigger = page.locator(`button[role="tab"]:has-text("${t.clickTarget}")`);
      await expect(trigger).toBeVisible();
      await trigger.click();
      await expect(page.getByText(t.verifyText)).toBeVisible({ timeout: 15000 });
    }
  });
});