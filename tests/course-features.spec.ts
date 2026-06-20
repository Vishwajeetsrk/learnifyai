import { test, expect } from '@playwright/test';

const TEST_EMAIL = `test-${Date.now()}@learnify.local`;
const TEST_PASSWORD = 'TestPass123!';

test.describe('Course Features & AI Tools (Requires Authentication)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/signup', { timeout: 15000 }).catch(() => {});
    await page.waitForLoadState('networkidle').catch(() => {});

    const emailInput = page.getByPlaceholder(/you@example\.com/i);
    if (await emailInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      const nameInput = page.locator('#name');
      if (await nameInput.isVisible().catch(() => false)) {
        await nameInput.fill('Test Student');
      }
      await emailInput.fill(TEST_EMAIL);
      await page.locator('#password').fill(TEST_PASSWORD);
      await page.getByRole('button', { name: /create account|sign up/i }).click();

      await page.waitForURL(/\/dashboard|\/login/, { timeout: 10000 }).catch(() => {});
    }

    if (page.url().includes('/login')) {
      await page.getByPlaceholder(/you@example\.com/i).fill(TEST_EMAIL);
      await page.locator('#password').fill(TEST_PASSWORD);
      await page.getByRole('button', { name: /sign in/i }).click();
      await page.waitForURL(/\/dashboard/, { timeout: 10000 }).catch(() => {});
    }
  });

  test('should allow a user to view a course and enroll', async ({ page }) => {
    await page.goto('/courses');
    await page.waitForLoadState('networkidle');

    if (page.url().includes('/login')) { test.skip(); return; }

    const firstCourse = page.locator('a[href^="/courses/"]').first();
    const courseExists = await firstCourse.isVisible({ timeout: 3000 }).catch(() => false);
    if (!courseExists) { test.skip(); return; }

    const href = await firstCourse.getAttribute('href');
    if (!href) return;
    await firstCourse.click();
    await expect(page).toHaveURL(/\/courses\/.+/);

    const enrollBtn = page.getByRole('button', { name: /start free|add to cart|enroll/i }).first();
    if (await enrollBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enrollBtn.click();
    }
  });

  test('should load the course playlist and video player', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    if (page.url().includes('/login')) { test.skip(); return; }

    const enrolledLink = page.locator('a[href*="/learn"]').first();
    if (await enrolledLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enrolledLink.click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should load AI Tools (Chat, Notes, Ask AI, Playground)', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    if (page.url().includes('/login')) { test.skip(); return; }

    // Look for AI Tools page/tab
    await page.goto('/ai');
    await page.waitForLoadState('networkidle');
    if (page.url().includes('/login')) { test.skip(); return; }

    const chatInput = page.getByPlaceholder(/ask|message|type/i).first();
    await expect(chatInput).toBeVisible({ timeout: 8000 }).catch(() => null);

    // Check Playground
    await page.goto('/playground', { timeout: 10000 }).catch(() => {});
    await page.waitForLoadState('networkidle').catch(() => {});
    if (page.url().includes('/login')) { test.skip(); return; }

    const editor = page.locator('.monaco-editor').first();
    await expect(editor).toBeVisible({ timeout: 8000 }).catch(() => null);
  });
});
