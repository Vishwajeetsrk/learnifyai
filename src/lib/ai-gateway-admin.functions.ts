import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { logAdminAction } from "./admin-audit.functions";
import {
  AI_MODEL_REGISTRY,
  testAiProviderConnection,
  type ModelRegistryEntry,
} from "./user-ai";

async function checkAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const userRoles = (roles ?? []).map((r: any) => r.role);
  if (!userRoles.includes("super_admin") && !userRoles.includes("admin")) {
    throw new Error("Forbidden: Admin privileges required.");
  }
}

export interface AdminProviderStatus {
  id: "groq" | "gemini" | "openrouter";
  displayName: string;
  keyEnv: string;
  hasKeyConfigured: boolean;
  maskedKey: string;
  primaryModel: string;
  status: "connected" | "degraded" | "missing_key" | "untested";
  lastTested?: string;
  latencyMs?: number;
  testMessage?: string;
}

export const getAdminAiInfrastructure = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await checkAdmin(context.userId);

    const maskKey = (key?: string | null) => {
      if (!key || key.length < 8) return "Not configured";
      return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
    };

    const providers: AdminProviderStatus[] = [
      {
        id: "groq",
        displayName: "Groq Cloud (LPU Inference)",
        keyEnv: "GROQ_API_KEY",
        hasKeyConfigured: Boolean(process.env.GROQ_API_KEY?.trim()),
        maskedKey: maskKey(process.env.GROQ_API_KEY),
        primaryModel: "llama-3.3-70b-versatile",
        status: process.env.GROQ_API_KEY?.trim() ? "connected" : "missing_key",
      },
      {
        id: "gemini",
        displayName: "Google Gemini API (Generative Language)",
        keyEnv: "GEMINI_API_KEY",
        hasKeyConfigured: Boolean(process.env.GEMINI_API_KEY?.trim()),
        maskedKey: maskKey(process.env.GEMINI_API_KEY),
        primaryModel: "gemini-2.0-flash",
        status: process.env.GEMINI_API_KEY?.trim() ? "connected" : "missing_key",
      },
      {
        id: "openrouter",
        displayName: "OpenRouter (Unified Multi-Model Gateway)",
        keyEnv: "OPENROUTER_API_KEY",
        hasKeyConfigured: Boolean(process.env.OPENROUTER_API_KEY?.trim()),
        maskedKey: maskKey(process.env.OPENROUTER_API_KEY),
        primaryModel: "google/gemini-2.0-flash-001",
        status: process.env.OPENROUTER_API_KEY?.trim() ? "connected" : "missing_key",
      },
    ];

    return {
      providers,
      modelRegistry: AI_MODEL_REGISTRY,
    };
  });

export const testAiProvider = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        provider: z.enum(["groq", "gemini", "openrouter"]),
        customKey: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId);
    const result = await testAiProviderConnection(data.provider, data.customKey);
    try {
      await logAdminAction({
        data: {
          action: "test_ai_provider",
          entityType: "ai_provider",
          entityId: data.provider,
          metadata: { ok: result.ok, status: result.status, latencyMs: result.latencyMs },
        },
      });
    } catch {}
    return result;
  });

export interface AiUsageByModel {
  model: string;
  requests: number;
  tokens: number;
}

export interface AiUsageDay {
  day: string;
  requests: number;
  tokens: number;
}

/**
 * Admin: token/request metering from ai_usage (lesson AI + copilot chat).
 * Powers the usage section of the AI Infrastructure manager.
 */
export const getAiUsageStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await checkAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
    const { data: rows } = await supabaseAdmin
      .from("ai_usage")
      .select("model, total_tokens, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000);

    const list = ((rows ?? []) as any[]) as Array<{
      model: string;
      total_tokens: number;
      created_at: string;
    }>;

    const byModel = new Map<string, { requests: number; tokens: number }>();
    const byDay = new Map<string, { requests: number; tokens: number }>();
    for (const r of list) {
      const m = byModel.get(r.model) ?? { requests: 0, tokens: 0 };
      m.requests += 1;
      m.tokens += Number(r.total_tokens ?? 0);
      byModel.set(r.model, m);
      const day = String(r.created_at).slice(0, 10);
      const d = byDay.get(day) ?? { requests: 0, tokens: 0 };
      d.requests += 1;
      d.tokens += Number(r.total_tokens ?? 0);
      byDay.set(day, d);
    }

    const models: AiUsageByModel[] = [...byModel.entries()]
      .map(([model, v]) => ({ model, ...v }))
      .sort((a, b) => b.tokens - a.tokens);
    const days: AiUsageDay[] = [...byDay.entries()]
      .map(([day, v]) => ({ day, ...v }))
      .sort((a, b) => (a.day < b.day ? 1 : -1))
      .slice(0, 14);

    return {
      models,
      days,
      totals: {
        requests: list.length,
        tokens: list.reduce((s, r) => s + Number(r.total_tokens ?? 0), 0),
      },
    };
  });
