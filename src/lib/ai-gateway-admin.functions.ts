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
