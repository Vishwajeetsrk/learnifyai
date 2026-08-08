/**
 * Learnify AI — Lesson Exercise Server Functions
 * Curated, runnable in-lesson exercises with AI grading and one-time XP rewards.
 */
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { assertLessonOwnership } from "@/lib/lesson-blocks.functions";
import { awardXP } from "@/lib/gamification.functions";

const ExerciseInput = z.object({
  lessonId: z.string().uuid(),
  language: z.string().min(1).max(50).default("python"),
  instructions: z.string().min(1).max(4000),
  starterCode: z.string().max(20000).default(""),
  solutionCode: z.string().max(20000).default(""),
  hint: z.string().max(2000).nullable().optional(),
  passingGrade: z.number().int().min(1).max(100).default(70),
  xpReward: z.number().int().min(0).max(500).default(10),
});

/* ─── Read: exercise for a lesson ─── */
export const getLessonExercise = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ lessonId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: exercise, error } = await (supabase as any)
      .from("lesson_exercises")
      .select("*")
      .eq("lesson_id", data.lessonId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return exercise ?? null;
  });

/* ─── Write: upsert exercise for a lesson (admin or course creator) ─── */
export const saveLessonExercise = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => ExerciseInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertLessonOwnership(supabase, data.lessonId, userId);

    const { data: saved, error } = await (supabase as any)
      .from("lesson_exercises")
      .upsert(
        {
          lesson_id: data.lessonId,
          language: data.language,
          instructions: data.instructions,
          starter_code: data.starterCode,
          solution_code: data.solutionCode,
          hint: data.hint ?? null,
          passing_grade: data.passingGrade,
          xp_reward: data.xpReward,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "lesson_id" },
      )
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return saved;
  });

/* ─── Write: delete exercise for a lesson (admin or course creator) ─── */
export const deleteLessonExercise = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ lessonId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertLessonOwnership(supabase, data.lessonId, userId);
    const { error } = await (supabase as any)
      .from("lesson_exercises")
      .delete()
      .eq("lesson_id", data.lessonId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ─── Read: the current user's solve state for an exercise ─── */
export const getExerciseSolve = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ exerciseId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: solve, error } = await (supabase as any)
      .from("exercise_solves")
      .select("id, score, passed, solved_at")
      .eq("exercise_id", data.exerciseId)
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return solve ?? null;
  });

/* ─── Write: record a solve attempt; award XP once on first pass ─── */
export const recordExerciseSolve = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        exerciseId: z.string().uuid(),
        score: z.number().int().min(0).max(100).nullable().default(null),
        passed: z.boolean(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: exercise, error: exErr } = await (supabase as any)
      .from("lesson_exercises")
      .select("xp_reward")
      .eq("id", data.exerciseId)
      .maybeSingle();
    if (exErr) throw new Error(exErr.message);
    if (!exercise) throw new Error("Exercise not found");

    const { data: existing } = await (supabase as any)
      .from("exercise_solves")
      .select("id, passed")
      .eq("exercise_id", data.exerciseId)
      .eq("user_id", userId)
      .maybeSingle();

    const { error: upsErr } = await (supabase as any)
      .from("exercise_solves")
      .upsert(
        {
          exercise_id: data.exerciseId,
          user_id: userId,
          score: data.score,
          passed: data.passed,
        },
        { onConflict: "exercise_id,user_id" },
      )
      .select("id")
      .single();
    if (upsErr) throw new Error(upsErr.message);

    const newlySolved = data.passed && !existing?.passed;
    let xpAwarded = 0;
    if (newlySolved) {
      await awardXP({
        data: { userId, amount: exercise.xp_reward, source: "exercise" },
      });
      xpAwarded = exercise.xp_reward;
    }

    return { newlySolved, xpAwarded, passed: data.passed };
  });
