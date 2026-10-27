import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const targetDir = "C:\\Users\\Vishwajeet\\.gemini\\antigravity-ide\\brain\\b3cc9d33-a176-43c5-bede-3cdb9b693aa5\\.tempmediaStorage";
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function run() {
  let browser;
  try {
    browser = await chromium.launch({ channel: "chrome", headless: true });
  } catch {
    browser = await chromium.launch({ channel: "msedge", headless: true });
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
  });
  const page = await context.newPage();

  // First log in with test credentials
  console.log("Logging in at http://localhost:8081/login...");
  await page.goto("http://localhost:8081/login", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(1000);

  // Fill credentials
  await page.fill("input[type='email'], input[autoComplete*='email']", "vishwajeetsrk@gmail.com");
  await page.fill("input[type='password']", "12345678");
  await page.click("button:has-text('Sign in')");
  await page.waitForTimeout(3000);

  // Now navigate to /coaching
  console.log("Navigating to http://localhost:8081/coaching...");
  await page.goto("http://localhost:8081/coaching", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(2500);

  // Capture Tab 1: Live Booking & Sessions
  console.log("Capturing Tab 1: 1:1 Live Booking...");
  await page.screenshot({ path: path.join(targetDir, "coaching_tab1_live_booking.png"), fullPage: false });

  // Click on "My Sessions & Thermal Receipts" sub-tab
  const mySessionsSubTab = page.locator("button:has-text('My Sessions & Thermal Receipts')").first();
  if (await mySessionsSubTab.isVisible()) {
    await mySessionsSubTab.click();
    await page.waitForTimeout(1000);
    console.log("Capturing Tab 1: My Sessions & Thermal Receipt Ledger...");
    await page.screenshot({ path: path.join(targetDir, "coaching_tab1_my_sessions_thermal.png"), fullPage: false });
  }

  // Click on "Coach Studio & Availability Matrix" sub-tab
  const coachStudioSubTab = page.locator("button:has-text('Coach Studio & Availability Matrix')").first();
  if (await coachStudioSubTab.isVisible()) {
    await coachStudioSubTab.click();
    await page.waitForTimeout(1000);
    console.log("Capturing Tab 1: Coach Studio & Availability Matrix...");
    await page.screenshot({ path: path.join(targetDir, "coaching_tab1_availability_studio.png"), fullPage: false });
  }

  // Switch to Tab 2: 10-Role AI Studio & Messenger
  console.log("Navigating to Tab 2: 10-Role AI Studio & Messenger...");
  const tab2 = page.locator("button:has-text('10-Role AI Studio & Messenger')").first();
  await tab2.click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(targetDir, "coaching_tab2_ai_studio_messenger.png"), fullPage: false });

  // Switch to Tab 3: Roadmaps
  console.log("Navigating to Tab 3: Roadmaps...");
  const tab3 = page.locator("button:has-text('Roadmaps')").first();
  await tab3.click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(targetDir, "coaching_tab3_roadmaps.png"), fullPage: false });

  // Switch to Tab 4: Cohorts
  console.log("Navigating to Tab 4: Cohorts...");
  const tab4 = page.locator("button:has-text('Cohorts')").first();
  await tab4.click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(targetDir, "coaching_tab4_cohorts.png"), fullPage: false });

  // Switch to Tab 5: Outcomes
  console.log("Navigating to Tab 5: Outcomes...");
  const tab5 = page.locator("button:has-text('Outcomes')").first();
  await tab5.click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(targetDir, "coaching_tab5_outcomes.png"), fullPage: false });

  // Visit Public Coaches page to verify cleanup
  console.log("Navigating to http://localhost:8081/coaches...");
  await page.goto("http://localhost:8081/coaches", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(targetDir, "public_coaches_cleaned.png"), fullPage: false });

  // Test Navbar hover sliding pill
  console.log("Testing Navbar hover pill...");
  await page.goto("http://localhost:8081/courses", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(1000);
  const studioLink = page.locator("header nav a:has-text('Studio IDE')").first();
  if (await studioLink.isVisible()) {
    await studioLink.hover();
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: path.join(targetDir, "navbar_hover_pill.png"), fullPage: false });

  console.log("All screenshots captured successfully!");
  await browser.close();
}

run().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
