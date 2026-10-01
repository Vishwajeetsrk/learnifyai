/**
 * Shared authorization for cron/hook HTTP endpoints (server-only).
 *
 * Fails closed: when CRON_SECRET is unset the endpoint answers 503 instead
 * of comparing against the literal "Bearer undefined". Accepts either the
 * standard `Authorization: Bearer <secret>` header (which Vercel Cron sends
 * automatically when CRON_SECRET is configured) or `x-cron-secret: <secret>`.
 *
 * Usage: `const denied = verifyCronRequest(request); if (denied) return denied;`
 */

function json(status: number, body: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function verifyCronRequest(request: Request): Response | null {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return json(503, { error: "CRON_SECRET not configured" });
  }
  const provided =
    request.headers.get("x-cron-secret") ??
    (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!provided || provided !== expected) {
    return json(401, { error: "Unauthorized" });
  }
  return null;
}
