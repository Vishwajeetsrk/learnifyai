/**
 * Upstash Redis helper (server-only).
 *
 * - Uses the Upstash REST API directly via fetch (no extra dependency).
 * - Never logs or returns credential values — errors report status/latency only.
 * - Every operation degrades gracefully: when Redis is missing or unreachable,
 *   callers get a clear signal (RedisUnavailableError / "missing_config") and
 *   must fall back to their in-process behavior.
 */

export type RedisHealthStatus = "connected" | "missing_config" | "unreachable" | "auth_error";

export interface RedisHealth {
  status: RedisHealthStatus;
  latencyMs: number | null;
  message: string;
}

export interface RedisConfig {
  url: string;
  token: string;
}

const HEALTH_TIMEOUT_MS = 5000;

export function getRedisConfig(): RedisConfig | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

export class RedisUnavailableError extends Error {
  constructor(message = "Redis unavailable") {
    super(message);
    this.name = "RedisUnavailableError";
  }
}

/** Lightweight connectivity check: GET <url>/ping with a strict timeout. */
export async function checkRedisHealth(): Promise<RedisHealth> {
  const config = getRedisConfig();
  if (!config) {
    return {
      status: "missing_config",
      latencyMs: null,
      message: "UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set",
    };
  }
  const start = Date.now();
  try {
    const res = await fetch(`${config.url}/ping`, {
      headers: { Authorization: `Bearer ${config.token}` },
      signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
    });
    const latencyMs = Date.now() - start;
    if (res.status === 401 || res.status === 403) {
      return { status: "auth_error", latencyMs, message: "Redis token rejected (401/403)" };
    }
    if (!res.ok) {
      return { status: "unreachable", latencyMs, message: `Redis ping HTTP ${res.status}` };
    }
    return { status: "connected", latencyMs, message: "PONG" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    // Never include the URL (may contain credentials) — report the failure class only.
    const cls = /timeout|timed out|abort/i.test(message)
      ? "timeout"
      : /ENOTFOUND|EAI_AGAIN|getaddrinfo/i.test(message)
        ? "dns"
        : /ECONNREFUSED|Failed to fetch|fetch failed/i.test(message)
          ? "connection"
          : "error";
    return {
      status: "unreachable",
      latencyMs: Date.now() - start,
      message: `Redis unreachable (${cls})`,
    };
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

/**
 * Fixed-window rate limit backed by Redis (INCR + EXPIRE on first hit).
 * @throws RedisUnavailableError when Redis is not configured or unreachable,
 *   so callers can fall back to an in-process limiter instead of failing open.
 */
export async function redisRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const config = getRedisConfig();
  if (!config) throw new RedisUnavailableError("Redis not configured");

  const safeKey = `ratelimit:${key.replace(/[^a-zA-Z0-9:_-]/g, "_")}`;
  let count: number;
  try {
    const incrRes = await fetch(`${config.url}/incr/${encodeURIComponent(safeKey)}`, {
      headers: { Authorization: `Bearer ${config.token}` },
      signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
    });
    if (incrRes.status === 401 || incrRes.status === 403) {
      throw new RedisUnavailableError("Redis token rejected");
    }
    if (!incrRes.ok) throw new RedisUnavailableError(`Redis INCR HTTP ${incrRes.status}`);
    const incrJson = (await incrRes.json()) as { result?: number | string };
    count = Number(incrJson.result);
    if (!Number.isFinite(count)) throw new RedisUnavailableError("Redis INCR bad response");

    if (count === 1) {
      // First hit in this window — set the TTL (best effort).
      await fetch(
        `${config.url}/expire/${encodeURIComponent(safeKey)}/${windowSeconds}`,
        {
          headers: { Authorization: `Bearer ${config.token}` },
          signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
        },
      ).catch(() => undefined);
    }
  } catch (err) {
    if (err instanceof RedisUnavailableError) throw err;
    throw new RedisUnavailableError(err instanceof Error ? err.message : "Redis error");
  }

  return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
}
