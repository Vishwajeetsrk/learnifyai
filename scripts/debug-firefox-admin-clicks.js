import { firefox } from "playwright";

(async () => {
  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const base = process.env.PLAYWRIGHT_TEST_BASE_URL || "https://learnifyaitool.vercel.app";

  page.on("console", (msg) => console.log("PAGE:", msg.type(), msg.text()));
  page.on("pageerror", (error) => console.error("PAGE ERROR", error));
  page.on("requestfailed", (req) =>
    console.log("REQUEST FAILED", req.url(), req.failure()?.errorText),
  );

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

    await page.goto(`${base}/admin/content`, { waitUntil: "networkidle", timeout: 60000 });
    console.log("admin content url", page.url());
    const heading = page.getByRole("heading", { name: /content manager/i }).first();
    console.log("heading visible", await heading.isVisible().catch(() => false));

    const tabs = ["Events", "Jobs", "Pricing", "Site Settings"];
    for (const tab of tabs) {
      const trigger = page.getByRole("tab", { name: tab, exact: true });
      console.log(
        "tab",
        tab,
        "count",
        await trigger.count(),
        "visible",
        await trigger.isVisible().catch(() => false),
      );
      if (await trigger.isVisible().catch(() => false)) {
        await trigger
          .click({ force: true })
          .catch((e) => console.error("click tab error", tab, e.message));
        await page.waitForTimeout(1000);
        console.log("after click tab", tab, "url", page.url());
      }
    }

    const saveBtn = page.getByRole("button", { name: /save/i });
    console.log(
      "save button count",
      await saveBtn.count(),
      "visible",
      await saveBtn.isVisible().catch(() => false),
    );
  } catch (error) {
    console.error("ERROR", error);
  } finally {
    await browser.close();
  }
})();
