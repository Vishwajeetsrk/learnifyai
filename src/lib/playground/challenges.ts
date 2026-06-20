import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getChallenges = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    category: z.string().optional(),
  }).optional().parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const supabase = context.supabase as any;
    let query = supabase
      .from("playground_challenges")
      .select("id, title, slug, difficulty, category, language, points, hints, created_at")
      .eq("is_published", true);
    if (data?.difficulty) query = query.eq("difficulty", data.difficulty);
    if (data?.category) query = query.eq("category", data.category);
    const { data: challenges, error } = await query.order("points");
    if (error) throw new Error(error.message);
    return challenges ?? [];
  });

export const getChallenge = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string() }).parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const supabase = context.supabase as any;
    const { data: challenge, error } = await supabase
      .from("playground_challenges")
      .select("*")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .single();
    if (error) throw new Error("Challenge not found");
    return challenge;
  });

export const submitChallenge = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({
    challengeId: z.string().uuid(),
    language: z.string(),
    code: z.string().min(1),
    testResults: z.any(),
    passed: z.boolean(),
    score: z.number(),
    totalPoints: z.number(),
    executionTimeMs: z.number().optional(),
  }).parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const supabase = context.supabase as any;
    const { userId } = context;

    const { error } = await supabase.from("playground_submissions").insert({
      user_id: userId,
      challenge_id: data.challengeId,
      language: data.language,
      code: data.code,
      passed: data.passed,
      test_results: data.testResults,
      score: data.score,
      total_points: data.totalPoints,
      execution_time_ms: data.executionTimeMs || null,
    });
    if (error) throw new Error(error.message);

    // Update leaderboard
    if (data.passed) {
      const { data: challenge } = await supabase
        .from("playground_challenges").select("difficulty").eq("id", data.challengeId).single();
      const diff = challenge?.difficulty || "easy";
      const { data: existing } = await supabase
        .from("playground_leaderboard").select("*").eq("user_id", userId).maybeSingle();

      if (existing) {
        await supabase.from("playground_leaderboard").update({
          total_points: (existing.total_points || 0) + data.score,
          challenges_solved: (existing.challenges_solved || 0) + 1,
          easy_solved: (existing.easy_solved || 0) + (diff === "easy" ? 1 : 0),
          medium_solved: (existing.medium_solved || 0) + (diff === "medium" ? 1 : 0),
          hard_solved: (existing.hard_solved || 0) + (diff === "hard" ? 1 : 0),
          updated_at: new Date().toISOString(),
        }).eq("user_id", userId);
      } else {
        await supabase.from("playground_leaderboard").insert({
          user_id: userId,
          total_points: data.score,
          challenges_solved: 1,
          easy_solved: diff === "easy" ? 1 : 0,
          medium_solved: diff === "medium" ? 1 : 0,
          hard_solved: diff === "hard" ? 1 : 0,
        });
      }
    }

    return { success: true };
  });

export const getUserSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabase = context.supabase as any;
    const { userId } = context;
    const { data, error } = await supabase
      .from("playground_submissions")
      .select("id, challenge_id, language, passed, score, total_points, execution_time_ms, created_at, challenge:challenge_id(title, slug, difficulty)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getLeaderboard = createServerFn({ method: "GET" })
  .handler(async () => {
    const supabase = (await import("@/integrations/supabase/client")).supabase as any;
    const { data, error } = await supabase
      .from("playground_leaderboard")
      .select("user_id, total_points, challenges_solved, easy_solved, medium_solved, hard_solved, total_runs, updated_at")
      .order("total_points", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    // Fetch profiles separately
    const userIds = (data ?? []).map((r: any) => r.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", userIds);
    const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
    return (data ?? []).map((r: any) => ({
      ...r,
      profile: profileMap.get(r.user_id) || null,
    }));
  });

export const createInterview = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({
    title: z.string().min(1).max(200),
    difficulty: z.enum(["easy", "medium", "hard"]),
    durationMinutes: z.number().min(5).max(180).default(30),
  }).parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const supabase = context.supabase as any;
    const { userId } = context;
    const { data: challenges, error } = await supabase
      .from("playground_challenges")
      .select("id, title, difficulty, points")
      .eq("is_published", true)
      .eq("difficulty", data.difficulty)
      .limit(10);
    if (error) throw new Error(error.message);
    const { data: interview, error: iError } = await supabase
      .from("playground_interviews")
      .insert({
        user_id: userId,
        title: data.title,
        difficulty: data.difficulty,
        duration_minutes: data.durationMinutes,
        total_questions: (challenges ?? []).length,
      })
      .select()
      .single();
    if (iError) throw new Error(iError.message);
    return { interview, questions: challenges ?? [] };
  });
