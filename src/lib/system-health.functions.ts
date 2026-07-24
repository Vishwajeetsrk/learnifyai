import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function checkAdminRole(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const userRoles = (roles ?? []).map((r: any) => r.role);
  if (!userRoles.includes("super_admin") && !userRoles.includes("admin")) {
    throw new Error("Forbidden: Admin role required");
  }
}

export const getSystemHealth = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId!;
    await checkAdminRole(userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const results: Record<string, any> = {};

    // 1. Supabase connection health
    try {
      const start = Date.now();
      const { data: ping, error: pingErr } = await supabaseAdmin
        .from("admin_audit_logs")
        .select("id")
        .limit(1);
      results.supabase = {
        status: pingErr ? "error" : "healthy",
        latency: Date.now() - start,
        error: pingErr?.message || null,
      };
    } catch (e: any) {
      results.supabase = { status: "error", latency: null, error: e.message };
    }

    // 2. Database connection pool
    try {
      const { data: poolInfo } = await supabaseAdmin.rpc("pg_stat_activity" as any);
      const activeConns = Array.isArray(poolInfo)
        ? poolInfo.filter((r: any) => r.state === "active").length
        : 0;
      const idleConns = Array.isArray(poolInfo)
        ? poolInfo.filter((r: any) => r.state === "idle").length
        : 0;
      results.database = {
        status: "healthy",
        activeConnections: activeConns,
        idleConnections: idleConns,
      };
    } catch {
      results.database = { status: "unknown", note: "Cannot query pool stats" };
    }

    // 3. AI Provider status checks
    const providers = ["Groq", "Gemini", "OpenRouter"];
    for (const name of providers) {
      const key =
        name === "Groq"
          ? process.env.GROQ_API_KEY
          : name === "Gemini"
            ? process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY
            : process.env.OPENROUTER_API_KEY;
      const url =
        name === "Groq"
          ? "https://api.groq.com/openai/v1/models"
          : name === "Gemini"
            ? `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
            : "https://openrouter.ai/api/v1/models";

      if (!key?.trim()) {
        results[name] = { status: "not_configured", message: "API key not set" };
        continue;
      }

      try {
        const start = Date.now();
        const headers: Record<string, string> =
          name === "Gemini" ? {} : { Authorization: `Bearer ${key}` };
        const res = await fetch(url, {
          headers,
          signal: AbortSignal.timeout(5000),
        });
        results[name] = {
          status: res.ok ? "healthy" : "error",
          latency: Date.now() - start,
          statusCode: res.status,
        };
      } catch (e: any) {
        results[name] = { status: "unreachable", error: e.message };
      }
    }

    // 4. Storage health (check media bucket)
    try {
      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      const mediaBucket = buckets?.find((b: any) => b.name === "media");
      results.storage = {
        status: mediaBucket ? "healthy" : "no_media_bucket",
        buckets: buckets?.length ?? 0,
      };
    } catch (e: any) {
      results.storage = { status: "error", error: e.message };
    }

    // 5. Auth provider health
    try {
      const start = Date.now();
      const { data: users, error: usersErr } = await supabaseAdmin
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .limit(1);
      results.auth = {
        status: usersErr ? "error" : "healthy",
        latency: Date.now() - start,
        totalProfiles: users?.length ?? 0,
        error: usersErr?.message || null,
      };
    } catch (e: any) {
      results.auth = { status: "error", error: e.message };
    }

    // 6. Cron jobs / scheduled tasks
    try {
      const { data: cronJobs, error: cronErr } = await supabaseAdmin
        .from("cron_jobs" as any)
        .select("*")
        .limit(10);
      if (!cronErr && cronJobs) {
        results.cron = {
          status: "healthy",
          jobCount: cronJobs.length,
          jobs: cronJobs,
        };
      } else {
        results.cron = { status: "unavailable", note: "No cron_jobs table" };
      }
    } catch {
      results.cron = { status: "unavailable", note: "Cannot query cron jobs" };
    }

    // 7. Error rate (last 24h from audit logs)
    try {
      const yesterday = new Date(Date.now() - 86400000).toISOString();
      const { count: errorCount } = await supabaseAdmin
        .from("admin_audit_logs")
        .select("*", { count: "exact", head: true })
        .gte("created_at", yesterday)
        .eq("action", "error");
      results.errors24h = errorCount ?? 0;
    } catch {
      results.errors24h = null;
    }

    return results;
  });

export const getQueueStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId!;
    await checkAdminRole(userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Check pending email sends
    const { count: pendingEmails } = await supabaseAdmin
      .from("email_queue" as any)
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    // Check failed email sends (last 24h)
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    const { count: failedEmails } = await supabaseAdmin
      .from("email_queue" as any)
      .select("*", { count: "exact", head: true })
      .eq("status", "failed")
      .gte("created_at", yesterday);

    return {
      pendingEmails: pendingEmails ?? 0,
      failedEmails24h: failedEmails ?? 0,
    };
  });
