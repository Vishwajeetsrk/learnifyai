import { firefox } from "playwright";

(async () => {
  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const base = process.env.PLAYWRIGHT_TEST_BASE_URL || "https://learnifyaitool.vercel.app";

  page.on("console", (msg) => {
    console.log("PAGE:", msg.type(), msg.text());
  });

  try {
    console.log("goto login", `${base}/login`);
    await page.goto(`${base}/login`, { waitUntil: "networkidle", timeout: 60000 });
    console.log("after login goto url", page.url());

    const cookieBtn = page.getByRole("button", { name: /accept all/i });
    if (await cookieBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await cookieBtn.click();
      console.log("clicked accept all");
    }

    const emailInput = page.getByPlaceholder(/you@example\.com/i);
    const passwordInput = page.locator("#password");
    const signInButton = page.getByRole("button", { name: /sign in/i });
    console.log("email input count", await emailInput.count());
    console.log("password input count", await passwordInput.count());
    console.log("sign in button count", await signInButton.count());
    if (await emailInput.isVisible({ timeout: 10000 }).catch(() => false)) {
      await emailInput.fill("admin@learnify.ai");
      await passwordInput.fill("AdminPass123!");
      await signInButton.click();
      await page.waitForTimeout(1000);
      const toast = await page
        .locator("text=/error|failed|invalid|incorrect|toast/i")
        .allTextContents()
        .catch(() => []);
      console.log("potential toast texts", toast);
      await page
        .waitForURL(/\/dashboard|\/admin\/content|\/login|\//, { timeout: 60000 })
        .catch(() => {});
      console.log("after sign in url", page.url());
    } else {
      console.log("email input not visible");
    }

    await page
      .goto(`${base}/admin/content`, { waitUntil: "networkidle", timeout: 60000 })
      .catch(() => {});
    console.log("after goto admin content", page.url());

    const heading = page.locator("h1", { hasText: "Content Manager" }).first();
    console.log("heading visible", await heading.isVisible().catch(() => false));
    console.log("heading text", await heading.textContent().catch(() => null));

    const newBtn = page.getByRole("button", { name: /new event/i });
    console.log("new event visible", await newBtn.isVisible().catch(() => false));
    console.log("new event count", await newBtn.count());

    const body = await page.content();
    console.log("body length", body.length);
  } catch (error) {
    console.error("ERROR", error);
  } finally {
    await browser.close();
  }
})();
