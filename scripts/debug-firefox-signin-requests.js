import { firefox } from "playwright";

(async () => {
  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const base = process.env.PLAYWRIGHT_TEST_BASE_URL || "https://learnifyaitool.vercel.app";

  page.on("console", (msg) => console.log("PAGE:", msg.type(), msg.text()));
  page.on("pageerror", (error) => console.error("PAGE ERROR", error));
  page.on("requestfailed", (req) => console.log("REQ FAILED", req.url(), req.failure()?.errorText));
  page.on("response", async (res) => {
    const url = res.url();
    if (
      url.includes("/auth/v1/token") ||
      url.includes("/auth/v1/") ||
      url.includes("/auth/v1") ||
      url.includes("supabase.co")
    ) {
      console.log("RESP", res.status(), url);
      if (url.includes("/auth/v1/token")) {
        try {
          console.log("RESP BODY", await res.text());
        } catch (err) {
          console.log("RESP BODY ERR", err);
        }
      }
    }
  });

  try {
    await page.goto(`${base}/login`, { waitUntil: "networkidle", timeout: 60000 });
    console.log("loaded", page.url());
    const emailInput = page.getByPlaceholder(/you@example\.com/i);
    const passwordInput = page.locator("input#password");
    const signInButton = page.getByRole("button", { name: /sign in/i });

    const acceptAll = page.getByRole("button", { name: /accept all/i });
    if (await acceptAll.isVisible().catch(() => false)) {
      console.log("accept all visible, clicking");
      await acceptAll.click();
      await page.waitForTimeout(1000);
    }

    const privacy = page.locator("text=We value your privacy");
    console.log("privacy count", await privacy.count());
    if ((await privacy.count()) > 0) {
      console.log(
        "privacy outer",
        await privacy.first().evaluate((el) => el.closest("div")?.outerHTML || "none"),
      );
    }

    await emailInput.fill("admin@learnify.ai");
    await passwordInput.fill("AdminPass123!");
    console.log(
      "ready to submit, signin visible",
      await signInButton.isVisible().catch(() => false),
    );

    const [request] = await Promise.all([
      page
        .waitForRequest((req) => req.url().includes("/auth/v1/token") && req.method() === "POST", {
          timeout: 30000,
        })
        .catch(() => null),
      signInButton.click({ trial: true }).catch(() => null),
    ]);
    console.log("trial click request", request ? request.url() : "none");

    await Promise.all([
      signInButton.click().catch((e) => console.log("click error", e.message)),
      page.waitForTimeout(5000),
    ]);
    console.log("after click url", page.url());
    const errorText = await page
      .locator("text=/error|invalid|incorrect|failed|problem|signin|sign in/i")
      .allTextContents()
      .catch(() => []);
    console.log("error texts", errorText);
    const body = await page.content();
    console.log("body snippet", body.slice(0, 500));
  } catch (error) {
    console.error("ERROR", error);
  } finally {
    await browser.close();
  }
})();
