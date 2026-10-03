/**
 * Learnify AI — Shared API Rate Limiter
 *
 * Provides a ready-to-use rate-limit check for any TanStack Start server handler.
 * Distributed-first: uses Upstash Redis when configured, falls back to in-memory.
 *
 * Usage:
 *   import { apiRateLimit, API_RATE_CONFIGS } from "@/lib/api-rate-limit";
 *
 *   POST: async ({ request }) => {
 *     const userId = await getUserIdFromRequest(request); // your auth logic
 *     const limited = await apiRateLimit(userId, "ai");
 *     if (limited) return limited; // returns a 429 Response
 *     // ... handler logic
 *   }
 */

import { redisRateLimit, RedisUnavailableError } from "@/lib/redis";

// ── Rate Limit Configurations ─────────────────────────────────────────────────

export type RateLimitConfig = {
  /** Redis + in-memory key prefix */
  prefix: string;
  /** Max requests per window */
  limit: number;
  /** Window in seconds */
  windowSeconds: number;
};

export const API_RATE_CONFIGS: Record<string, RateLimitConfig> = {
  /** Default AI chat limit: 15 req / 60s */
  ai: { prefix: "ai", limit: 15, windowSeconds: 60 },
  /** Resume AI scoring: 5 req / 60s (heavier model) */
  ai_resume: { prefix: "ai_resume", limit: 5, windowSeconds: 60 },
  /** Roadmap generation: 3 req / 60s */
  ai_roadmap: { prefix: "ai_roadmap", limit: 3, windowSeconds: 60 },
  /** Auth endpoints: 10 req / 60s */
  auth: { prefix: "auth", limit: 10, windowSeconds: 60 },
  /** Webhook endpoints: 100 req / 60s */
  webhook: { prefix: "webhook", limit: 100, windowSeconds: 60 },
};

// ── In-memory fallback ────────────────────────────────────────────────────────

const memoryBuckets = new Map<string, number[]>();

function isRateLimitedInMemory(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = memoryBuckets.get(key) ?? [];
  const valid = timestamps.filter((t) => now - t < windowMs);
  if (valid.length >= limit) {
    memoryBuckets.set(key, valid);
    return true;
  }
  valid.push(now);
  memoryBuckets.set(key, valid);
  return false;
}

// Periodic GC — every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, ts] of memoryBuckets) {
    const valid = ts.filter((t) => now - t < 60_000 * 60); // prune entries older than 1h
    if (valid.length === 0) memoryBuckets.delete(key);
    else memoryBuckets.set(key, valid);
  }
}, 5 * 60_000).unref?.();

// ── Rate Limit Check ──────────────────────────────────────────────────────────

/**
 * Check if the given identifier is rate-limited.
 *
 * @param identifier - Usually userId; can be userId + IP combo
 * @param configKey  - One of the keys in API_RATE_CONFIGS (default: "ai")
 * @returns A 429 Response if rate-limited, or null if allowed
 */
export async function apiRateLimit(
  identifier: string,
  configKey: keyof typeof API_RATE_CONFIGS = "ai",
): Promise<Response | null> {
  const config = API_RATE_CONFIGS[configKey] ?? API_RATE_CONFIGS.ai;
  const key = `${config.prefix}:${identifier}`;

  let limited = false;
  let remaining = config.limit;

  try {
    const result = await redisRateLimit(key, config.limit, config.windowSeconds);
    limited = !result.allowed;
    remaining = result.remaining;
  } catch (err) {
    if (!(err instanceof RedisUnavailableError)) {
      console.warn("[API Rate Limit] Unexpected Redis error — falling back to in-memory:", err);
    }
    limited = isRateLimitedInMemory(
      key,
      config.limit,
      config.windowSeconds * 1000,
    );
    remaining = limited ? 0 : config.limit - 1;
  }

  if (!limited) return null;

  return new Response(
    JSON.stringify({
      error: "Too many requests. Please slow down.",
      retryAfter: config.windowSeconds,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(config.windowSeconds),
        "X-RateLimit-Limit": String(config.limit),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(Math.ceil(Date.now() / 1000) + config.windowSeconds),
      },
    },
  );
}

/**
 * Helper to extract a user's ID from a request's Authorization header.
 * Falls back to the IP address when no auth header is present.
 */
export function getIdentifierFromRequest(request: Request): string {
  // Try auth header (Bearer token)
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    return `bearer:${auth.slice(7, 30)}`; // Use first 23 chars of token as proxy
  }
  // Try X-Forwarded-For (Vercel / CDN)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return `ip:${forwarded.split(",")[0].trim()}`;
  // Fallback
  return "ip:unknown";
}
