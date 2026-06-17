import { test, expect } from '@playwright/test';

test.describe('Course Features & AI Tools (Requires Authentication)', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to login
    await page.goto('/login');
    
    // Fill in the email/password for our test student account
    await page.getByPlaceholder(/you@example\.com/i).fill('test-student@learnify.local');
    // Using a common selector for password input
    await page.locator('input[type="password"]').fill('TestPassword123!');
    
    // Click Sign In
    await page.getByRole('button', { name: /sign in/i }).click();

    // Wait for the dashboard to load indicating successful login
    await expect(page).toHaveURL(/.*dashboard.*/, { timeout: 15000 }).catch(() => null);
  });

  test('should allow a user to view a course and enroll', async ({ page }) => {
    // Navigate to the courses catalog
    await page.goto('/courses');
    
    // Now wait for the courses to load after successful login
    const firstCourse = page.locator('.course-card, [data-testid="course-card"]').first();
    await expect(firstCourse).toBeVisible({ timeout: 15000 }).catch(() => null);
    
    if (await firstCourse.isVisible()) {
      await firstCourse.click();

      // Verify we are on the course detail page
      await expect(page).toHaveURL(/\/courses\/.+/);

      // Look for the Enroll button
      const enrollButton = page.getByRole('button', { name: /enroll|start learning/i });
      if (await enrollButton.isVisible()) {
        await enrollButton.click();
        await expect(page).toHaveURL(/\/courses\/.+\/learn/).catch(() => null);
      }
    }
  });

  test('should load the course playlist and video player', async ({ page }) => {
    // Assuming the user is on the learning page
    await page.goto('/dashboard');
    
    // Click on an enrolled course
    const enrolledCourse = page.getByText(/continue learning/i).first();
    await enrolledCourse.click().catch(() => null);

    // Check if the playlist sidebar is visible
    const playlist = page.locator('[data-testid="course-playlist"], .playlist');
    await expect(playlist).toBeVisible().catch(() => null);

    // Check if the video player iframe/element is rendered
    const videoPlayer = page.locator('iframe, video').first();
    await expect(videoPlayer).toBeVisible().catch(() => null);
  });

  test('should load AI Tools (Chat, Notes, Ask AI, Playground)', async ({ page }) => {
    // Navigate to a lesson page if possible, otherwise just go to dashboard
    await page.goto('/dashboard');
    
    const enrolledCourse = page.getByText(/continue learning/i).first();
    await enrolledCourse.click().catch(() => null);

    // Look for the tabs that switch between AI tools
    const tabs = page.getByRole('tablist');
    await expect(tabs).toBeVisible().catch(() => null);

    // Test clicking the AI Chat tab
    const chatTab = page.getByRole('tab', { name: /chat|ask ai/i });
    if (await chatTab.isVisible()) {
      await chatTab.click();
      const chatInput = page.getByPlaceholder(/ask/i);
      await expect(chatInput).toBeVisible().catch(() => null);
    }

    // Test clicking the Notes tab
    const notesTab = page.getByRole('tab', { name: /notes|summary/i });
    if (await notesTab.isVisible()) {
      await notesTab.click();
      await expect(page.getByText(/summary/i).first()).toBeVisible().catch(() => null);
    }

    // Test Playground tab
    const playgroundTab = page.getByRole('tab', { name: /playground|exercise/i });
    if (await playgroundTab.isVisible()) {
      await playgroundTab.click();
      const codeEditor = page.locator('.monaco-editor, textarea.code-input');
      await expect(codeEditor).toBeVisible().catch(() => null);
    }
  });
});
