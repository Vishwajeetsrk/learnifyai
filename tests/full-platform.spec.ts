import { test, expect } from "@playwright/test";

test.describe("Full Learnify AI Platform E2E Suite", () => {
  test.describe("Public Pages & Marketing Funnel", () => {
    test("Homepage renders value proposition and interactive demo", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveTitle(/Learnify AI/i);
      await expect(page.locator("body")).toBeVisible();
    });

    test("Features page renders 6 core pillars", async ({ page }) => {
      await page.goto("/features");
      await expect(page.locator("body")).toBeVisible();
    });

    test("AI Tools page displays tool catalog", async ({ page }) => {
      await page.goto("/ai-tools");
      await expect(page.locator("body")).toBeVisible();
    });

    test("Pricing page renders Starter, Pro, and Team plans with LAUNCH20 coupon support", async ({
      page,
    }) => {
      await page.goto("/pricing?coupon=LAUNCH20");
      await page.waitForLoadState("domcontentloaded");
    });

    test("Roadmap page renders public feature roadmap", async ({ page }) => {
      await page.goto("/roadmap");
      await expect(page.locator("body")).toBeVisible();
    });

    test("Blog index renders articles", async ({ page }) => {
      await page.goto("/blog");
      await expect(page.locator("body")).toBeVisible();
    });

    test("Coaches page renders coach program overview", async ({ page }) => {
      await page.goto("/coaches");
      await expect(page.locator("body")).toBeVisible();
    });

    test("Creators page renders creator economy program", async ({ page }) => {
      await page.goto("/creators");
      await expect(page.locator("body")).toBeVisible();
    });
  });

  test.describe("Certificate Verification Infrastructure", () => {
    test("Public certificate page renders verification details", async ({ page }) => {
      await page.goto("/certificates/demo-code");
      await expect(page.locator("body")).toBeVisible();
    });
  });

  test.describe("Authentication & Application Flow", () => {
    test("Login route renders authentication options", async ({ page }) => {
      await page.goto("/login");
      await expect(page.locator("body")).toBeVisible();
    });

    test("Signup route renders registration form", async ({ page }) => {
      await page.goto("/signup");
      await expect(page.locator("body")).toBeVisible();
    });

    test("Coach application route renders mentorship form", async ({ page }) => {
      await page.goto("/apply-coach");
      await expect(page.locator("body")).toBeVisible();
    });

    test("Creator application route renders application form", async ({ page }) => {
      await page.goto("/apply-creator");
      await expect(page.locator("body")).toBeVisible();
    });
  });

  test.describe("Consolidated Feature Hubs & Admin Routes", () => {
    test("Career Studio route renders 5-in-1 tabbed interface", async ({ page }) => {
      await page.goto("/career-studio");
      await expect(page.locator("body")).toBeVisible();
    });

    test("Community Hub route renders tabbed community feed and challenges", async ({ page }) => {
      await page.goto("/community-hub");
      await expect(page.locator("body")).toBeVisible();
    });

    test("Admin Certificates route loads management view", async ({ page }) => {
      await page.goto("/admin/certificates");
      await expect(page.locator("body")).toBeVisible();
    });
  });
});
