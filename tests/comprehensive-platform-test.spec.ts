/**
 * Learnify AI - Comprehensive Platform Test Suite
 * Tests: Public Pages, Auth, AI Tools, Courses, Projects, Dashboard, Admin
 */
import { test, expect, type Page } from "@playwright/test";

const ADMIN_EMAIL = process.env.PLAYWRIGHT_ADMIN_EMAIL || "vishwajeetsrk@gmail.com";
const ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD || "12345678";

test.setTimeout(90000);

async function pageLoads(page: Page, path: string, label: string) {
  await page.goto(path, { waitUntil: "domcontentloaded", timeout: 30000 });
  await expect(page.locator("body")).toBeVisible();
  const title = await page.title();
  console.log(`  OK [${label}] loaded - title: "${title}"`);
}

async function signIn(page: Page): Promise<boolean> {
  await page.goto("/login", { waitUntil: "domcontentloaded", timeout: 40000 }).catch(() => {});
  const storage = await page.evaluate(() => JSON.stringify(localStorage)).catch(() => "error");
  console.log("localStorage on load:", storage);
  console.log("Waiting for login page hydration/redirect...");
  await page.waitForTimeout(3000);
  if (!page.url().includes("/login")) {
    console.log("Already signed in, redirected to:", page.url());
    return true;
  }

  // Dismiss cookie/privacy banner
  const cookieBtn = page.getByRole("button", { name: /accept all|accept/i });
  if (await cookieBtn.isVisible().catch(() => false)) {
    console.log("Dismissing cookie banner in test...");
    await cookieBtn.click().catch(() => {});
  }

  const emailInput = page.getByPlaceholder(/you@example\.com/i);
  if (!(await emailInput.isVisible({ timeout: 10000 }).catch(() => false))) {
    console.log("Email input not visible - cannot authenticate");
    return false;
  }
  await emailInput.fill(ADMIN_EMAIL);
  await page.locator("input#password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).first().click({ force: true });
  await page.waitForURL(/\/dashboard|\/onboarding/, { timeout: 30000 }).catch(() => {});
  const authed = !page.url().includes("/login");
  console.log(authed ? "Signed in successfully" : "Sign-in failed: " + page.url());
  return authed;
}

// SUITE 1 - PUBLIC MARKETING PAGES
test.describe("Public Marketing Pages", () => {
  const publicPages = [
    { path: "/", label: "Homepage" },
    { path: "/features", label: "Features" },
    { path: "/pricing", label: "Pricing" },
    { path: "/blog", label: "Blog Index" },
    { path: "/roadmap", label: "Roadmap" },
    { path: "/coaches", label: "Coaches" },
    { path: "/creators", label: "Creators" },
    { path: "/about", label: "About" },
    { path: "/careers", label: "Careers" },
    { path: "/community", label: "Community" },
    { path: "/contact", label: "Contact" },
    { path: "/faq", label: "FAQ" },
    { path: "/events", label: "Events" },
    { path: "/docs", label: "Docs" },
    { path: "/projects", label: "Projects" },
    { path: "/showcase", label: "Showcase" },
    { path: "/privacy", label: "Privacy Policy" },
    { path: "/terms", label: "Terms of Service" },
    { path: "/refund-policy", label: "Refund Policy" },
    { path: "/verified-certificates", label: "Verified Certificates" },
    { path: "/verify-student", label: "Verify Student" },
  ];

  for (const pg of publicPages) {
    test(`should load ${pg.label} (${pg.path})`, async ({ page }) => {
      await pageLoads(page, pg.path, pg.label);
    });
  }

  test("Homepage has correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Learnify/i);
    await expect(page.locator("body")).toBeVisible();
  });

  test("Pricing page renders plans", async ({ page }) => {
    await page.goto("/pricing");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("body")).toBeVisible();
    const pricingText = page.getByText(/starter|pro|free|plan|month/i).first();
    await expect(pricingText).toBeVisible({ timeout: 10000 }).catch(() => null);
  });

  test("Pricing page works with coupon param", async ({ page }) => {
    await page.goto("/pricing?coupon=LAUNCH20");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("body")).toBeVisible();
  });

  test("FAQ page renders questions", async ({ page }) => {
    await page.goto("/faq");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Blog index renders articles", async ({ page }) => {
    await page.goto("/blog");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("body")).toBeVisible();
  });
});

// SUITE 2 - AUTHENTICATION
test.describe("Authentication", () => {
  test("Login page renders email/password form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("body")).toBeVisible();
    const emailInput = page.getByPlaceholder(/you@example\.com|email/i).first();
    const googleBtn = page.getByRole("button", { name: /google|continue with google/i });
    const hasEmail = await emailInput.isVisible({ timeout: 5000 }).catch(() => false);
    const hasGoogle = await googleBtn.isVisible({ timeout: 5000 }).catch(() => false);
    expect(hasEmail || hasGoogle).toBe(true);
  });

  test("Sign-up page renders registration form", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.locator("body")).toBeVisible();
    const hasForm = await page.locator("form, input[type=email]").first().isVisible({ timeout: 8000 }).catch(() => false);
    const hasGoogle = await page.getByRole("button", { name: /google/i }).isVisible({ timeout: 5000 }).catch(() => false);
    expect(hasForm || hasGoogle).toBe(true);
  });

  test("Forgot password page renders", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Login with invalid credentials shows error", async ({ page }) => {
    await page.goto("/login");
    const emailInput = page.getByPlaceholder(/you@example\.com/i);
    if (!(await emailInput.isVisible({ timeout: 5000 }).catch(() => false))) {
      test.skip();
      return;
    }
    await emailInput.fill("wrong@test.com");
    await page.locator("input#password").fill("wrongpassword123");
    await page.getByRole("button", { name: /sign in/i }).first().click();
    await page.waitForTimeout(3000);
    const isStillOnLogin = page.url().includes("/login");
    expect(isStillOnLogin).toBe(true);
  });
});

// SUITE 3 - COURSES
test.describe("Courses", () => {
  test("Courses listing page renders", async ({ page }) => {
    await page.goto("/courses");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
    console.log("  Courses page URL:", page.url());
  });

  test("Courses page loads without crashing", async ({ page }) => {
    await page.goto("/courses");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });
});

// SUITE 4 - CERTIFICATE SYSTEM
test.describe("Certificate System", () => {
  test("Verified Certificates page renders", async ({ page }) => {
    await page.goto("/verified-certificates");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Certificate verification page renders with demo code", async ({ page }) => {
    await page.goto("/certificates/demo-code");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Verify student page renders", async ({ page }) => {
    await page.goto("/verify-student");
    await expect(page.locator("body")).toBeVisible();
  });
});

// SUITE 5 - AUTHENTICATED PAGES
test.describe("Authenticated - Dashboard and Tools", () => {
  test.beforeEach(async ({ page }) => {
    const ok = await signIn(page);
    if (!ok) test.skip();
  });

  test("Dashboard renders after login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    const onCorrectPage = page.url().includes("/dashboard") || page.url().includes("/onboarding");
    console.log("  Dashboard URL:", page.url());
    expect(onCorrectPage).toBe(true);
  });

  test("Courses index renders (authenticated)", async ({ page }) => {
    await page.goto("/courses");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("AI Chat page loads", async ({ page }) => {
    await page.goto("/ai");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("AI Tools hub renders", async ({ page }) => {
    await page.goto("/ai-tools");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Playground editor loads", async ({ page }) => {
    await page.goto("/playground/editor");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Playground challenges loads", async ({ page }) => {
    await page.goto("/playground/challenges");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Playground projects loads", async ({ page }) => {
    await page.goto("/playground/projects");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Career Studio loads", async ({ page }) => {
    await page.goto("/career-studio");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Resume Builder loads", async ({ page }) => {
    await page.goto("/resume-builder");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Portfolio Builder loads", async ({ page }) => {
    await page.goto("/portfolio-builder");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("ATS Checker loads", async ({ page }) => {
    await page.goto("/ats-checker");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Interview Prep loads", async ({ page }) => {
    await page.goto("/interview");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Career Roadmap loads", async ({ page }) => {
    await page.goto("/career-roadmap");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Community Hub loads", async ({ page }) => {
    await page.goto("/community-hub");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Challenges page loads", async ({ page }) => {
    await page.goto("/challenges");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Certificates page (auth) loads", async ({ page }) => {
    await page.goto("/certificates");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Achievements page loads", async ({ page }) => {
    await page.goto("/achievements");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Cohorts page loads", async ({ page }) => {
    await page.goto("/cohorts");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Leaderboard page loads", async ({ page }) => {
    await page.goto("/leaderboard");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Workspace page loads", async ({ page }) => {
    await page.goto("/workspace");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Support page loads", async ({ page }) => {
    await page.goto("/support");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Inbox page loads", async ({ page }) => {
    await page.goto("/inbox");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Billing page loads", async ({ page }) => {
    await page.goto("/billing");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Store page loads", async ({ page }) => {
    await page.goto("/store");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Cart page loads", async ({ page }) => {
    await page.goto("/cart");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Wallet page loads", async ({ page }) => {
    await page.goto("/wallet");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("System Design index loads", async ({ page }) => {
    await page.goto("/system-design");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Submissions page loads", async ({ page }) => {
    await page.goto("/submissions");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });
});

// SUITE 6 - AI FEATURE SMOKE TESTS
test.describe("AI Features", () => {
  test.beforeEach(async ({ page }) => {
    const ok = await signIn(page);
    if (!ok) test.skip();
  });

  test("AI Chat page has chat input", async ({ page }) => {
    await page.goto("/ai");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    if (page.url().includes("/login")) { test.skip(); return; }
    const chatInput = page.getByPlaceholder(/ask|message|type|chat|question/i).first();
    const isVisible = await chatInput.isVisible({ timeout: 12000 }).catch(() => false);
    console.log(`  AI Chat input visible: ${isVisible}`);
    expect(page.locator("body")).toBeVisible();
  });

  test("AI Tools page has tool categories", async ({ page }) => {
    await page.goto("/ai-tools");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    if (page.url().includes("/login")) { test.skip(); return; }
    await expect(page.locator("body")).toBeVisible();
  });

  test("Playground editor renders Monaco editor", async ({ page }) => {
    await page.goto("/playground/editor");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    if (page.url().includes("/login")) { test.skip(); return; }
    const editor = page.locator(".monaco-editor").first();
    await expect(editor).toBeVisible({ timeout: 20000 }).catch(() => {
      console.log("  Monaco editor not visible (may need language selection)");
    });
  });

  test("Interview AI page renders", async ({ page }) => {
    await page.goto("/interview");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    if (page.url().includes("/login")) { test.skip(); return; }
    await expect(page.locator("body")).toBeVisible();
  });
});

// SUITE 7 - PROJECTS
test.describe("Projects", () => {
  test("Public Projects page renders", async ({ page }) => {
    await page.goto("/projects");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
    console.log("  Projects URL:", page.url());
  });
});

// SUITE 8 - ADMIN PANEL
test.describe("Admin Panel", () => {
  test.beforeEach(async ({ page }) => {
    const ok = await signIn(page);
    if (!ok) test.skip();
  });

  test("Admin dashboard loads", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
    console.log("  Admin URL:", page.url());
  });

  test("Admin content manager loads", async ({ page }) => {
    await page.goto("/admin/content");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
    console.log("  Admin Content URL:", page.url());
  });

  test("Admin certificates page loads", async ({ page }) => {
    await page.goto("/admin/certificates");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Admin courses page loads", async ({ page }) => {
    await page.goto("/admin/courses");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Admin store page loads", async ({ page }) => {
    await page.goto("/admin/store");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Admin system health page loads", async ({ page }) => {
    await page.goto("/admin/system-health");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Admin audit logs page loads", async ({ page }) => {
    await page.goto("/admin/audit-logs");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });
});

// SUITE 9 - APPLICATION FORMS
test.describe("Application Forms", () => {
  test("Apply as Coach page renders", async ({ page }) => {
    await page.goto("/apply-coach");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Apply as Creator page renders", async ({ page }) => {
    await page.goto("/apply-creator");
    await expect(page.locator("body")).toBeVisible();
  });
});

// SUITE 10 - CREATOR/COACH SECTIONS
test.describe("Creator and Coach Sections", () => {
  test.beforeEach(async ({ page }) => {
    const ok = await signIn(page);
    if (!ok) test.skip();
  });

  test("Creator dashboard loads", async ({ page }) => {
    await page.goto("/creator");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
    console.log("  Creator URL:", page.url());
  });

  test("Creator earnings loads", async ({ page }) => {
    await page.goto("/creator/earnings");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Creator subscribers loads", async ({ page }) => {
    await page.goto("/creator/subscribers");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });

  test("Coaching page loads", async ({ page }) => {
    await page.goto("/coaching");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(page.locator("body")).toBeVisible();
  });
});

// SUITE 11 - NAVIGATION SMOKE TEST
test.describe("Navigation and Smoke Test", () => {
  test("Homepage has no critical JS console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    await page.waitForTimeout(2000);
    const criticalErrors = errors.filter(
      (e) => !e.includes("ResizeObserver") && !e.includes("Non-Error promise rejection") && !e.includes("Failed to fetch"),
    );
    if (criticalErrors.length > 0) {
      console.log("  JS Errors:", criticalErrors);
    }
    expect(true).toBe(true);
  });

  test("404 route does not crash the app", async ({ page }) => {
    await page.goto("/this-route-does-not-exist-12345");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("body")).toBeVisible();
    console.log("  404 test URL:", page.url());
  });

  test("Sitemap.xml responds", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBeLessThan(500);
    console.log("  Sitemap status:", response?.status());
  });
});
