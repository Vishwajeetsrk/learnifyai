import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const INDEXNOW_KEY = "e8d2a4f61b7c4390b14e2026a1b2c3d4";
export const INDEXNOW_HOST = "www.learnifyai.in";
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

export const CANONICAL_INDEXNOW_URLS = [
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

export async function sendIndexNowRequest(urlList: string[]): Promise<{
  success: boolean;
  status: number;
  message: string;
  urlsSubmitted: number;
}> {
  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList,
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 200 || res.status === 202) {
      return {
        success: true,
        status: res.status,
        message: "Successfully submitted pages to IndexNow network (Bing, Yandex, Seznam, Naver).",
        urlsSubmitted: urlList.length,
      };
    }

    const text = await res.text().catch(() => "");
    return {
      success: false,
      status: res.status,
      message: `IndexNow returned status ${res.status}: ${text}`,
      urlsSubmitted: 0,
    };
  } catch (err: any) {
    return {
      success: false,
      status: 500,
      message: err?.message || "IndexNow network dispatch failed",
      urlsSubmitted: 0,
    };
  }
}

export const submitToIndexNow = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        urls: z.array(z.string().url()).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const urls = data.urls && data.urls.length > 0 ? data.urls : CANONICAL_INDEXNOW_URLS;
    return await sendIndexNowRequest(urls);
  });
