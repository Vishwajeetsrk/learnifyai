/**
 * Playwright Global Setup — Learnify AI
 * Logs in once, saves localStorage/sessionStorage auth state to a fixture file.
 * All authenticated test suites reuse this state (no re-login per test).
 */
import { chromium, type FullConfig } from "@playwright/test";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AUTH_FILE = path.resolve(__dirname, "../playwright/.auth/user.json");
const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || "http://127.0.0.1:4173";
const EMAIL = process.env.PLAYWRIGHT_ADMIN_EMAIL || "vishwajeetsrk@gmail.com";
const PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD || "12345678";

export default async function globalSetup(_config: FullConfig) {
  // Ensure auth dir exists
  const authDir = path.dirname(AUTH_FILE);
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("[global-setup] Navigating to login with networkidle…");
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle", timeout: 40000 }).catch(() => {});

  console.log("[global-setup] Waiting 4 seconds for full hydration and React event attachment…");
  await page.waitForTimeout(4000);

  if (!page.url().includes("/login")) {
    console.log("[global-setup] Already authenticated, saving state…");
    await context.storageState({ path: AUTH_FILE });
    await browser.close();
    return;
  }

  // Dismiss cookie/privacy banner
  console.log("[global-setup] Dismissing cookie banner if present…");
  const cookieBtn = page.getByRole("button", { name: /accept all|accept/i });
  if (await cookieBtn.isVisible().catch(() => false)) {
    await cookieBtn.click().catch(() => {});
    await page.waitForTimeout(1000);
  }

  const emailInput = page.getByPlaceholder(/you@example\.com/i);
  const visible = await emailInput.isVisible({ timeout: 10000 }).catch(() => false);

  if (!visible) {
    console.warn("[global-setup] Login form not visible. Auth state will be empty.");
    await browser.close();
    return;
  }

  console.log("[global-setup] Filling login form…");
  await emailInput.fill(EMAIL);
  await page.locator("input#password").fill(PASSWORD);
  await page.waitForTimeout(500);

  // Capture auth API response
  const authResponsePromise = page
    .waitForResponse((r) => r.url().includes("/auth/v1/token"), { timeout: 30000 })
    .catch(() => null);

  console.log("[global-setup] Clicking Sign In…");
  await page.getByRole("button", { name: /sign in/i }).first().click({ force: true });
  
  const authResp = await authResponsePromise;
  if (authResp) {
    console.log("[global-setup] Auth response status:", authResp.status());
  }

  console.log("[global-setup] Waiting for redirect to /dashboard or /onboarding…");
  await page.waitForURL(/\/dashboard|\/onboarding/, { timeout: 30000 }).catch(() => {
    console.warn("[global-setup] Did not redirect to dashboard. Current URL:", page.url());
  });

  console.log("[global-setup] Final URL reached:", page.url());

  // Save storage state (cookies + localStorage)
  await context.storageState({ path: AUTH_FILE });
  console.log("[global-setup] Auth state saved successfully to:", AUTH_FILE);

  await browser.close();
}
