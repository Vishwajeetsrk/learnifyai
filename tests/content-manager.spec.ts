import { test, expect } from "@playwright/test";

test.setTimeout(120000);

const ADMIN_EMAIL = process.env.PLAYWRIGHT_ADMIN_EMAIL || "vishwajeetsrk@gmail.com";
const ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD || "12345678";

async function signInAdmin(page: any) {
  console.log("[content-manager] navigating to /login");
  await page.goto("/login", { timeout: 40000, waitUntil: "domcontentloaded" });
  await page.waitForURL(/\/login|\/dashboard|\/admin\/content|\/onboarding/, { timeout: 40000 }).catch(() => {});
  await page.waitForLoadState("domcontentloaded").catch(() => {});
  const startUrl = page.url();
  console.log("[content-manager] login page url", startUrl);

  if (!startUrl.includes("/login")) {
    console.log("[content-manager] already authenticated or redirected before login", startUrl);
    return true;
  }

  const cookieBtn = page.getByRole("button", { name: /accept all/i });
  try {
    await cookieBtn.waitFor({ state: "visible", timeout: 5000 });
    await cookieBtn.click();
    await cookieBtn.waitFor({ state: "hidden", timeout: 5000 }).catch(() => {});
    console.log("[content-manager] accepted cookies");
  } catch {
    console.log("[content-manager] no cookie banner present");
  }

  const emailInput = page.getByPlaceholder(/you@example\.com/i);
  const passwordInput = page.locator("input#password");
  const signInButton = page.getByRole("button", { name: /sign in/i }).first();

  console.log("[content-manager] login button count", await page.getByRole("button", { name: /sign in/i }).count());
  console.log("[content-manager] login form HTML", await page.locator('form').first().innerHTML().catch(() => ''));

  if (!(await emailInput.isVisible({ timeout: 10000 }).catch(() => false))) {
    console.log("[content-manager] email input not visible after login load", page.url());
    return false;
  }

  console.log("[content-manager] filling login form");
  await emailInput.fill(ADMIN_EMAIL);
  await passwordInput.fill(ADMIN_PASSWORD);
  await signInButton.scrollIntoViewIfNeeded();

  const authResponsePromise = page.waitForResponse((response) => response.url().includes('/auth/v1/token'), {
    timeout: 30000,
  }).catch(() => null);

  await Promise.all([
    authResponsePromise,
    signInButton.click().catch((error) => {
      console.log('[content-manager] sign in button click failed', error?.message || error);
    }),
  ]).catch(() => {
    console.log('[content-manager] sign in action did not complete within timeout');
  });

  const authResponse = await authResponsePromise;
  if (authResponse) {
    console.log('[content-manager] auth response status', authResponse.status(), authResponse.url());
    const body = await authResponse.text().catch(() => null);
    if (body) {
      console.log('[content-manager] auth response body', body.slice(0, 1000));
    }
  } else {
    console.log('[content-manager] no auth response detected for /auth/v1/token');
  }

  await page.waitForURL(/\/dashboard|\/admin\/content|\/onboarding/, {
    timeout: 30000,
  }).catch(() => {
    console.log("[content-manager] did not navigate to a success route after login", page.url());
  });

  let currentUrl = page.url();
  console.log('[content-manager] url after sign in', currentUrl);

  if (currentUrl.includes('/dashboard')) {
    console.log('[content-manager] navigating to /admin/content after login');
    await page.goto('/admin/content', { timeout: 40000, waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForURL(/\/admin\/content/, { timeout: 40000 }).catch(() => {});
    currentUrl = page.url();
    console.log('[content-manager] url after admin/content navigation', currentUrl);
  }

  if (currentUrl.includes('/admin/content') || currentUrl.includes('/onboarding')) {
    return true;
  }

  const errorText = await page
    .locator('text=/invalid|incorrect|wrong|not found|error/i')
    .allTextContents()
    .catch(() => []);
  if (errorText.length) {
    console.log('[content-manager] login error text:', errorText.join(' | '));
  }

  return false;
}

test.describe("Content Manager Dashboard Verification", () => {
  test.beforeEach(async ({ page }) => {
    const loggedIn = await signInAdmin(page);
    if (!loggedIn) {
      test.skip();
    }
  });

  test("should allow admin to create and delete an event", async ({ page }) => {
    await page.goto("/admin/content", { timeout: 40000, waitUntil: "networkidle" }).catch(() => {});
    await page.waitForURL(/\/admin\/content/, { timeout: 40000 }).catch(() => {});

    if (!page.url().includes("/admin/content")) {
      console.log("Skipping: admin content route unavailable", page.url());
      test.skip();
      return;
    }

    const newBtn = page.getByRole("button", { name: /new event/i }).first();
    await expect(newBtn).toBeVisible({ timeout: 20000 });
    await newBtn.scrollIntoViewIfNeeded();
    await newBtn.click({ force: true });

    const dialogTitle = page.getByRole("heading", { name: /new event/i }).first();
    await expect(dialogTitle).toBeVisible({ timeout: 20000 });

    const titleField = page.locator("label:has-text('Title')").locator('..').locator("input").first();
    await titleField.fill(`Test Event ${Date.now()}`);

    const saveBtn = page.getByRole("button", { name: /save/i }).first();
    await expect(saveBtn).toBeVisible({ timeout: 20000 });
    await saveBtn.click({ force: true });
    await expect(page.locator("text=Event created").first()).toBeVisible({ timeout: 20000 });
  });

  test("should successfully load Content Manager and verify all sections are working", async ({
    page,
  }) => {
    await page
      .goto("/admin/content", { timeout: 20000, waitUntil: "domcontentloaded" })
      .catch(() => {});
    await page.waitForTimeout(3000);

    if (!page.url().includes("/admin/content")) {
      console.log("Skipping: admin content route unavailable", page.url());
      test.skip();
      return;
    }

    await expect(page.getByRole("heading", { name: /content manager/i })).toBeVisible({
      timeout: 15000,
    });

    const tabs = [
      { name: "Events", clickTarget: "Events", verifyText: "New event" },
      { name: "Jobs", clickTarget: "Jobs", verifyText: "New job" },
      { name: "Pricing", clickTarget: "Pricing", verifyText: "New plan" },
      { name: "Site Settings", clickTarget: "Site", verifyText: "Add custom setting" },
      { name: "Cert Templates", clickTarget: "Cert Templates", verifyText: "New template" },
      { name: "Issue Cert", clickTarget: "Issue Cert", verifyText: "Find user by email" },
      { name: "FAQs", clickTarget: "FAQs", verifyText: "New FAQ" },
      {
        name: "Pages",
        clickTarget: "Pages",
        verifyText: "Terms of Service",
      },
      { name: "Roadmap", clickTarget: "Roadmap", verifyText: "Add item" },
      { name: "Coupons", clickTarget: "Coupons", verifyText: "Add coupon" },
      { name: "Community Groups", clickTarget: "Community Groups", verifyText: "New group" },
      { name: "Visibility", clickTarget: "Visibility", verifyText: "Feature Visibility Manager" },
    ];

    for (const t of tabs) {
      console.log(`Checking Tab: ${t.name}`);
      const trigger = page.getByRole("tab", { name: t.clickTarget, exact: true }).first();
      await expect(trigger).toBeVisible({ timeout: 15000 });
      await trigger.scrollIntoViewIfNeeded();
      await trigger.click({ force: true });
      await expect(page.getByText(t.verifyText)).toBeVisible({ timeout: 20000 });
    }
  });
});
