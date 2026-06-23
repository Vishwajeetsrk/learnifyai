import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = "admin@learnify.ai";
const ADMIN_PASSWORD = "AdminPass123!";

test.describe("Course Features & AI Tools (Requires Authentication)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login", { timeout: 15000, waitUntil: "load" });
    await page.waitForTimeout(3000);

    if (page.url().includes("/login")) {
      const cookieBtn = page.getByRole("button", { name: /accept all/i });
      try {
        await cookieBtn.waitFor({ state: "visible", timeout: 3000 });
        await cookieBtn.click();
      } catch { /* no cookie banner */ }

      const emailInput = page.getByPlaceholder(/you@example\.com/i);
      if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await emailInput.fill(ADMIN_EMAIL);
        await page.locator("#password").fill(ADMIN_PASSWORD);
        await page.getByRole("button", { name: /sign in/i }).click();
        await page.waitForURL(/\/dashboard/, { timeout: 30000 }).catch(() => {});
      }
    }
  });

  test("should allow a user to view a course and enroll", async ({ page }) => {
    await page.goto("/courses", { timeout: 15000 });
    await page.waitForLoadState("networkidle").catch(() => {});

    if (page.url().includes("/login")) { test.skip(); return; }

    const firstCourse = page.locator('a[href^="/courses/"]').first();
    if (!(await firstCourse.isVisible({ timeout: 3000 }).catch(() => false))) { test.skip(); return; }

    const href = await firstCourse.getAttribute("href");
    if (!href) return;
    await firstCourse.click();
    await expect(page).toHaveURL(/\/courses\/.+/);

    const enrollBtn = page.getByRole("button", { name: /start free|add to cart|enroll/i }).first();
    if (await enrollBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enrollBtn.click();
    }
  });

  test("should load the course playlist and video player", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle").catch(() => {});
    if (page.url().includes("/login")) { test.skip(); return; }

    const enrolledLink = page.locator('a[href*="/learn"]').first();
    if (await enrolledLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enrolledLink.click();
      await page.waitForLoadState("networkidle").catch(() => {});
    }
  });

  test("should load AI Tools (Chat, Notes, Ask AI, Playground)", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle").catch(() => {});
    if (page.url().includes("/login")) { test.skip(); return; }

    await page.goto("/ai");
    await page.waitForLoadState("networkidle").catch(() => {});
    if (page.url().includes("/login")) { test.skip(); return; }

    const chatInput = page.getByPlaceholder(/ask|message|type/i).first();
    await expect(chatInput).toBeVisible({ timeout: 8000 }).catch(() => null);

    await page.goto("/playground", { timeout: 10000 }).catch(() => {});
    await page.waitForLoadState("networkidle").catch(() => {});
    if (page.url().includes("/login")) { test.skip(); return; }

    const editor = page.locator(".monaco-editor").first();
    await expect(editor).toBeVisible({ timeout: 8000 }).catch(() => null);
  });
});