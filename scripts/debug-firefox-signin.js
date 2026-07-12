import { firefox } from "playwright";

(async () => {
  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const base = process.env.PLAYWRIGHT_TEST_BASE_URL || "https://learnifyaitool.vercel.app";

  page.on("console", (msg) => console.log("PAGE:", msg.type(), msg.text()));
  page.on("requestfailed", (req) =>
    console.log("REQUEST FAILED", req.url(), req.failure()?.errorText),
  );
  page.on("requestfinished", (req) => console.log("REQUEST DONE", req.url()));

  try {
    console.log("goto", `${base}/login`);
    await page.goto(`${base}/login`, { waitUntil: "networkidle", timeout: 60000 });
    console.log("url after load", page.url());
    await page.waitForLoadState("networkidle");
    const cookieBtn = page.getByRole("button", { name: /accept all/i });
    const hasCookie = await cookieBtn.isVisible().catch(() => false);
    console.log("cookie visible", hasCookie);
    if (hasCookie) {
      await cookieBtn.click();
    }

    const emailInput = page.getByPlaceholder(/you@example\.com/i);
    const passwordInput = page.locator("input#password");
    const signInButton = page.getByRole("button", { name: /sign in/i });

    console.log("email count", await emailInput.count());
    console.log("password count", await passwordInput.count());
    console.log("sign in button count", await signInButton.count());

    console.log("email visible", await emailInput.isVisible().catch(() => false));
    console.log("password visible", await passwordInput.isVisible().catch(() => false));
    console.log("signin visible", await signInButton.isVisible().catch(() => false));

    if (await emailInput.isVisible({ timeout: 10000 }).catch(() => false)) {
      await emailInput.fill("admin@learnify.ai");
      await passwordInput.fill("AdminPass123!");
      await signInButton.click();
      await page
        .waitForURL(/\/dashboard|\/admin\/content|\/onboarding|\/login/, { timeout: 30000 })
        .catch(() => {});
      console.log("after click url", page.url());
    }

    await page.waitForLoadState("networkidle");
    console.log("final url", page.url());
  } catch (error) {
    console.error("ERROR", error);
  } finally {
    await browser.close();
  }
})();
