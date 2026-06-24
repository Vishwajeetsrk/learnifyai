import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ═══════════════════════════════════════════════════════════════
// Onboarding Server Functions
// ═══════════════════════════════════════════════════════════════

const ONBOARDING_STEPS = [
  "welcome",
  "ai_onboarding",
  "product_tour",
  "first_project",
  "ai_coach",
  "daily_usage",
  "advanced",
  "complete",
] as const;

type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

const TABLE_MISSING_CODE = "42P01";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isTableMissing(err: any): boolean {
  return (
    err?.code === TABLE_MISSING_CODE ||
    err?.message?.includes("does not exist") ||
    err?.message?.includes("relation") ||
    err?.status === 404
  );
}

// ───────── Get or Create Progress ─────────
export const getOnboardingProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId!;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseAdmin as any)
      .from("onboarding_progress")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      if (isTableMissing(error)) return null;
      throw error;
    }

    if (!data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: created, error: createErr } = await (supabaseAdmin as any)
        .from("onboarding_progress")
        .insert({
          user_id: userId,
          current_step: "welcome",
          completed_steps: [],
          ai_profile: {},
          product_tour_completed: false,
          onboarding_completed: false,
        })
        .select()
        .single();
      if (createErr) {
        if (isTableMissing(createErr)) return null;
        throw createErr;
      }
      return created;
    }

    return data;
  });

// ───────── Complete a Step ─────────
export const completeOnboardingStep = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        step: z.enum(ONBOARDING_STEPS),
        data: z.any().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId!;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: progress, error: fetchErr } = await (supabaseAdmin as any)
      .from("onboarding_progress")
      .select("completed_steps, ai_profile")
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchErr && isTableMissing(fetchErr)) {
      return { success: true, nextStep: "welcome", completed: false, skipped: true };
    }

    const completedSteps = progress?.completed_steps ?? [];
    const newCompleted = [...new Set([...completedSteps, data.step])];

    const currentStepIdx = ONBOARDING_STEPS.indexOf(data.step as OnboardingStep);
    const nextStep =
      currentStepIdx < ONBOARDING_STEPS.length - 1
        ? ONBOARDING_STEPS[currentStepIdx + 1]
        : "complete";

    const isComplete = nextStep === "complete";

    const updateData: Record<string, unknown> = {
      current_step: nextStep,
      completed_steps: newCompleted,
      updated_at: new Date().toISOString(),
    };

    if (data.step === "ai_onboarding" && data.data) {
      updateData.ai_profile = data.data;
    }
    if (data.step === "product_tour") {
      updateData.product_tour_completed = true;
    }
    if (data.step === "first_project" && data.data?.project_id) {
      updateData.first_project_id = data.data.project_id;
    }
    if (isComplete) {
      updateData.onboarding_completed = true;
      updateData.onboarding_completed_at = new Date().toISOString();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any)
      .from("onboarding_progress")
      .update(updateData)
      .eq("user_id", userId);
    if (error && !isTableMissing(error)) throw error;

    return { success: true, nextStep, completed: isComplete };
  });

// ───────── Save AI Profile ─────────
export const saveAiOnboardingProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        goals: z.array(z.string()),
        experience: z.string(),
        interests: z.array(z.string()),
        preferred_hours: z.string().optional(),
        learning_style: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId!;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any)
      .from("onboarding_progress")
      .update({
        ai_profile: data,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
    if (error && !isTableMissing(error)) throw error;
    return { success: true };
  });

// ───────── AI Coach Chat ─────────
export const sendOnboardingCoachMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        message: z.string().min(1),
        step: z.string(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId!;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let aiProfile: Record<string, unknown> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: progress } = await (supabaseAdmin as any)
      .from("onboarding_progress")
      .select("ai_profile")
      .eq("user_id", userId)
      .maybeSingle();
    if (progress) aiProfile = progress.ai_profile ?? {};

    const { generateText } = await import("ai");
    const { createOpenAICompatible } = await import("@ai-sdk/openai-compatible");

    const groqKey = process.env.GROQ_API_KEY?.trim();
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const openrouterKey = process.env.OPENROUTER_API_KEY?.trim();

    const providers: Array<{ name: string; baseURL: string; key: string; model: string }> = [];
    if (groqKey)
      providers.push({
        name: "groq",
        baseURL: "https://api.groq.com/openai/v1",
        key: groqKey,
        model: "llama-3.3-70b-versatile",
      });
    if (geminiKey)
      providers.push({
        name: "gemini",
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
        key: geminiKey,
        model: "gemini-2.0-flash",
      });
    if (openrouterKey)
      providers.push({
        name: "openrouter",
        baseURL: "https://openrouter.ai/api/v1",
        key: openrouterKey,
        model: "meta-llama/llama-3.3-70b-instruct:free",
      });

    if (providers.length === 0) throw new Error("AI not configured");

    const systemPrompt = `You are an AI Success Coach onboarding a new user on Learnify AI, an intelligent learning platform.

User Profile:
- Goals: ${JSON.stringify(aiProfile.goals ?? [])}
- Experience: ${aiProfile.experience ?? "Not specified"}
- Interests: ${JSON.stringify(aiProfile.interests ?? [])}
- Learning Style: ${aiProfile.learning_style ?? "Not specified"}

Your role:
1. Welcome them warmly
2. Ask about their goals and what they want to learn
3. Suggest relevant courses, features, and learning paths
4. Help them create their first project
5. Encourage daily learning habits
6. Be concise, friendly, and actionable
7. Use emojis sparingly but naturally
8. End each response with a clear next step or question

Current step: ${data.step}
Keep responses under 150 words.`;

    let result: { text: string } | null = null;
    let lastError: unknown = null;

    for (const p of providers) {
      try {
        const provider = createOpenAICompatible({
          name: p.name,
          baseURL: p.baseURL,
          headers: {
            Authorization: `Bearer ${p.key}`,
            "HTTP-Referer": "https://learnify.ai",
            "X-Title": "Learnify AI Onboarding Coach",
          },
        });
        result = await generateText({
          model: provider(p.model),
          system: systemPrompt,
          prompt: data.message,
        });
        break;
      } catch (e) {
        lastError = e;
        continue;
      }
    }

    if (!result) {
      console.error("All AI providers failed for onboarding coach:", lastError);
      throw new Error("AI provider unavailable");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin as any)
      .from("onboarding_coaching")
      .insert({
        user_id: userId,
        step: data.step,
        message: data.message,
        response: result.text,
      })
      .then(() => {})
      .catch(() => {});

    return { response: result.text };
  });

// ───────── Log Daily Usage ─────────
export const logDailyUsage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        actions_count: z.number().optional(),
        features_used: z.array(z.string()).optional(),
        xp_earned: z.number().optional(),
        notes: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId!;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const today = new Date().toISOString().split("T")[0];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any).from("onboarding_daily_usage").upsert(
      {
        user_id: userId,
        usage_date: today,
        actions_count: data.actions_count ?? 0,
        features_used: data.features_used ?? [],
        xp_earned: data.xp_earned ?? 0,
        notes: data.notes ?? null,
      },
      { onConflict: "user_id,usage_date" },
    );
    if (error && isTableMissing(error)) return { success: true, streak: 0, skipped: true };
    if (error) throw error;

    // Update streak
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: usage } = await (supabaseAdmin as any)
      .from("onboarding_daily_usage")
      .select("usage_date")
      .eq("user_id", userId)
      .order("usage_date", { ascending: false })
      .limit(30);

    let streak = 0;
    if (usage && usage.length > 0) {
      const dates = usage.map((u: Record<string, unknown>) =>
        new Date(u.usage_date as string).getTime(),
      );
      const now = new Date();
      const todayMs = new Date(now.toISOString().split("T")[0]).getTime();
      for (let i = 0; i < dates.length; i++) {
        const expectedMs = todayMs - i * 86400000;
        if (dates[i] === expectedMs) {
          streak++;
        } else {
          break;
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin as any)
      .from("onboarding_progress")
      .update({ daily_streak: streak, last_active_date: today })
      .eq("user_id", userId)
      .then(() => {})
      .catch(() => {});

    return { success: true, streak };
  });

// ───────── Skip Onboarding ─────────
export const skipOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId!;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any)
      .from("onboarding_progress")
      .update({
        current_step: "complete",
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        completed_steps: ONBOARDING_STEPS,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
    if (error && !isTableMissing(error)) throw error;
    return { success: true };
  });

// ───────── Reset Onboarding (for testing) ─────────
export const resetOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId!;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any)
      .from("onboarding_progress")
      .update({
        current_step: "welcome",
        completed_steps: [],
        ai_profile: {},
        product_tour_completed: false,
        first_project_id: null,
        coaching_session_count: 0,
        onboarding_completed: false,
        onboarding_completed_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
    if (error && !isTableMissing(error)) throw error;
    return { success: true };
  });
