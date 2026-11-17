/**
 * Standalone IndexNow Submission Script
 * Usage: node scripts/submit-indexnow.mjs
 */

const INDEXNOW_KEY = "e8d2a4f61b7c4390b14e2026a1b2c3d4";
const INDEXNOW_HOST = "www.learnifyai.in";
const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

const URLS = [
  "https://www.learnifyai.in/",
  "https://www.learnifyai.in/courses",
  "https://www.learnifyai.in/projects",
  "https://www.learnifyai.in/coaching",
  "https://www.learnifyai.in/pricing",
  "https://www.learnifyai.in/updates",
  "https://www.learnifyai.in/features",
  "https://www.learnifyai.in/blog",
  "https://www.learnifyai.in/blog/full-stack-ai-engineer-roadmap-2026",
  "https://www.learnifyai.in/blog/ultimate-guide-free-courses-certificates-2026",
  "https://www.learnifyai.in/blog/cashfree-vs-razorpay-india-saas",
  "https://www.learnifyai.in/blog/autonomous-ai-agents-langgraph-python",
  "https://www.learnifyai.in/verified-certificates",
  "https://www.learnifyai.in/faq",
  "https://www.learnifyai.in/about",
  "https://www.learnifyai.in/careers",
  "https://www.learnifyai.in/community",
  "https://www.learnifyai.in/events",
  "https://www.learnifyai.in/support-us",
  "https://www.learnifyai.in/terms",
  "https://www.learnifyai.in/privacy",
  "https://www.learnifyai.in/refund-policy",
];

async function main() {
  console.log(`[IndexNow] Dispatching ${URLS.length} URLs to IndexNow API for ${INDEXNOW_HOST}...`);
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: INDEXNOW_HOST,
        key: INDEXNOW_KEY,
        keyLocation: INDEXNOW_KEY_LOCATION,
        urlList: URLS,
      }),
    });

    console.log(`[IndexNow] Response status: ${res.status}`);
    if (res.status === 200 || res.status === 202) {
      console.log(`[IndexNow] Success! All ${URLS.length} URLs submitted for immediate indexing across Bing, Yandex, Seznam & Naver.`);
    } else {
      const body = await res.text();
      console.warn(`[IndexNow] Warning response: ${body}`);
    }
  } catch (err) {
    console.error("[IndexNow] Failed:", err.message);
  }
}

main();
