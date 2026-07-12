import { firefox } from "playwright";

(async () => {
  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const base = process.env.PLAYWRIGHT_TEST_BASE_URL || "https://learnifyaitool.vercel.app";

  page.on("console", (msg) => console.log("PAGE:", msg.type(), msg.text()));
  page.on("pageerror", (error) => console.error("PAGE ERROR", error));

  page.on("response", async (res) => {
    const url = res.url();
    if (
      url.includes("/user_roles") ||
      url.includes("/profiles") ||
      url.includes("/auth/v1/token")
    ) {
      console.log("RESP", res.status(), url);
      try {
        const text = await res.text();
        console.log("BODY", text.slice(0, 1000));
      } catch (err) {
        console.log("BODY ERR", err);
      }
    }
  });

  try {
    await page.goto(`${base}/login`, { waitUntil: "networkidle", timeout: 60000 });
    const acceptAll = page.getByRole("button", { name: /accept all/i });
    if (await acceptAll.isVisible().catch(() => false)) {
      await acceptAll.click();
      await page.waitForTimeout(500);
    }
    await page.getByPlaceholder(/you@example\.com/i).fill("admin@learnify.ai");
    await page.locator("input#password").fill("AdminPass123!");
    await Promise.all([
      page.waitForResponse((res) => res.url().includes("/auth/v1/token") && res.status() === 200, {
        timeout: 30000,
      }),
      page.getByRole("button", { name: /sign in/i }).click({ force: true }),
    ]);
    await page.waitForURL(/\/dashboard|\/onboarding/, { timeout: 30000 });
    console.log("post-login url", page.url());
    await page.waitForTimeout(3000);
    await page.goto(`${base}/admin/content`, { waitUntil: "load", timeout: 60000 });
    console.log("admin content attempt url", page.url());
    await page.waitForTimeout(3000);
    const adminHeading = page.getByRole("heading", { name: /content manager/i }).first();
    console.log(
      "heading count",
      await adminHeading.count(),
      "visible",
      await adminHeading.isVisible().catch(() => false),
    );
    const body = await page.content();
    console.log("body snippet", body.slice(0, 1000));
  } catch (error) {
    console.error("ERROR", error);
  } finally {
    await browser.close();
  }
})();
