import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  extractVideoId,
  explainYoutubeError,
  classifyKeyStatus,
  fetchWithRetry,
} from "../youtube.functions";

describe("extractVideoId", () => {
  it("parses youtu.be short links", () => {
    expect(extractVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });
  it("parses ?v= query param", () => {
    expect(extractVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10")).toBe("dQw4w9WgXcQ");
  });
  it("parses /embed/<id>", () => {
    expect(extractVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });
  it("parses /shorts/<id>", () => {
    expect(extractVideoId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });
  it("accepts a raw 11-char id", () => {
    expect(extractVideoId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });
  it("returns null for invalid input", () => {
    expect(extractVideoId("not a url")).toBe(null);
    expect(extractVideoId("")).toBe(null);
  });
});

describe("explainYoutubeError", () => {
  it("maps keyInvalid to a friendly message", () => {
    const msg = explainYoutubeError(400, { error: { errors: [{ reason: "keyInvalid" }] } });
    expect(msg).toMatch(/key is invalid/i);
  });
  it("maps quotaExceeded", () => {
    const msg = explainYoutubeError(403, { error: { errors: [{ reason: "quotaExceeded" }] } });
    expect(msg).toMatch(/quota/i);
  });
  it("maps rateLimitExceeded", () => {
    const msg = explainYoutubeError(403, { error: { errors: [{ reason: "rateLimitExceeded" }] } });
    expect(msg).toMatch(/rate limit/i);
  });
  it("maps accessNotConfigured", () => {
    const msg = explainYoutubeError(403, {
      error: { errors: [{ reason: "accessNotConfigured" }] },
    });
    expect(msg).toMatch(/not enabled/i);
  });
  it("maps 404", () => {
    expect(explainYoutubeError(404, {})).toMatch(/not found|private/i);
  });
  it("maps 429", () => {
    expect(explainYoutubeError(429, {})).toMatch(/too many/i);
  });
  it("falls back to message field", () => {
    expect(explainYoutubeError(500, { error: { message: "boom" } })).toContain("boom");
  });
});

describe("classifyKeyStatus", () => {
  it("classifies invalid key", () => {
    expect(classifyKeyStatus(400, { error: { errors: [{ reason: "keyInvalid" }] } })).toBe(
      "invalid",
    );
  });
  it("classifies quota", () => {
    expect(classifyKeyStatus(403, { error: { errors: [{ reason: "quotaExceeded" }] } })).toBe(
      "quota",
    );
    expect(classifyKeyStatus(403, { error: { errors: [{ reason: "rateLimitExceeded" }] } })).toBe(
      "quota",
    );
  });
  it("classifies accessNotConfigured as invalid", () => {
    expect(classifyKeyStatus(403, { error: { errors: [{ reason: "accessNotConfigured" }] } })).toBe(
      "invalid",
    );
  });
  it("defaults to unknown", () => {
    expect(classifyKeyStatus(500, {})).toBe("unknown");
  });
});

describe("fetchWithRetry", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const sleep = () => Promise.resolve();

  it("returns immediately on success", async () => {
    (fetch as any).mockResolvedValueOnce(new Response("ok", { status: 200 }));
    const r = await fetchWithRetry("https://x", undefined, { sleep });
    expect(r.status).toBe(200);
    expect((fetch as any).mock.calls).toHaveLength(1);
  });

  it("retries on 429 then succeeds", async () => {
    (fetch as any)
      .mockResolvedValueOnce(new Response("", { status: 429 }))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));
    const r = await fetchWithRetry("https://x", undefined, { sleep });
    expect(r.status).toBe(200);
    expect((fetch as any).mock.calls).toHaveLength(2);
  });

  it("retries on 503 then succeeds", async () => {
    (fetch as any)
      .mockResolvedValueOnce(new Response("", { status: 503 }))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));
    const r = await fetchWithRetry("https://x", undefined, { sleep });
    expect(r.status).toBe(200);
  });

  it("does NOT retry 400", async () => {
    (fetch as any).mockResolvedValueOnce(new Response("", { status: 400 }));
    const r = await fetchWithRetry("https://x", undefined, { sleep });
    expect(r.status).toBe(400);
    expect((fetch as any).mock.calls).toHaveLength(1);
  });

  it("does NOT retry 403 (quota/invalid surfaced immediately)", async () => {
    (fetch as any).mockResolvedValueOnce(new Response("", { status: 403 }));
    const r = await fetchWithRetry("https://x", undefined, { sleep });
    expect(r.status).toBe(403);
    expect((fetch as any).mock.calls).toHaveLength(1);
  });

  it("gives up after maxAttempts on persistent 429", async () => {
    (fetch as any).mockResolvedValue(new Response("", { status: 429 }));
    const r = await fetchWithRetry("https://x", undefined, { sleep, maxAttempts: 3 });
    expect(r.status).toBe(429);
    expect((fetch as any).mock.calls).toHaveLength(3);
  });

  it("retries on network error then throws after maxAttempts", async () => {
    (fetch as any).mockRejectedValue(new Error("network down"));
    await expect(fetchWithRetry("https://x", undefined, { sleep, maxAttempts: 2 })).rejects.toThrow(
      /network down/,
    );
    expect((fetch as any).mock.calls).toHaveLength(2);
  });
});
