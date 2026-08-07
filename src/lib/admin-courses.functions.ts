import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

/* ─── List all courses (admin) ─── */
export const adminListCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("courses")
      .select("*, modules:course_modules(count), lessons(count), enrollments(count)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/* ─── Get course detail with modules + lessons ─── */
export const adminGetCourse = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ courseId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: course, error: cErr } = await supabase
      .from("courses")
      .select("*")
      .eq("id", data.courseId)
      .single();
    if (cErr) throw new Error(cErr.message);

    const { data: modules } = await supabase
      .from("course_modules")
      .select("*")
      .eq("course_id", data.courseId)
      .order("order_index");

    const { data: lessons } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", data.courseId)
      .order("order_index");

    const { data: enrollments } = await supabase
      .from("enrollments")
      .select(
        "id, user_id, status, progress_pct, enrolled_at, completed_at, profiles:user_id(full_name, email)",
      )
      .eq("course_id", data.courseId)
      .order("enrolled_at", { ascending: false });

    return {
      course,
      modules: modules ?? [],
      lessons: lessons ?? [],
      enrollments: enrollments ?? [],
    };
  });

/* ─── Create course ─── */
export const adminCreateCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        title: z.string().min(2).max(200),
        slug: z.string().min(2).max(200),
        description: z.string().max(2000).optional(),
        category: z.string().max(100).default("General"),
        level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
        price_inr: z.number().min(0).default(0),
        instructor: z.string().max(100).default("Learnify AI"),
        cover_url: z.string().max(500).optional(),
        duration_minutes: z.number().min(0).default(0),
        published: z.boolean().default(false),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("courses").insert({
      ...data,
      created_by: userId,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ─── Update course ─── */
export const adminUpdateCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        courseId: z.string().uuid(),
        title: z.string().min(2).max(200).optional(),
        slug: z.string().min(2).max(200).optional(),
        description: z.string().max(2000).optional(),
        category: z.string().max(100).optional(),
        level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
        price_inr: z.number().min(0).optional(),
        instructor: z.string().max(100).optional(),
        cover_url: z.string().max(500).optional(),
        duration_minutes: z.number().min(0).optional(),
        published: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { courseId, ...updates } = data;
    const { error } = await supabase.from("courses").update(updates).eq("id", courseId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ─── Delete course ─── */
export const adminDeleteCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ courseId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("courses").delete().eq("id", data.courseId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ─── Add module ─── */
export const adminAddModule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        courseId: z.string().uuid(),
        title: z.string().min(2).max(200),
        description: z.string().max(1000).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { count } = await supabase
      .from("course_modules")
      .select("*", { count: "exact", head: true })
      .eq("course_id", data.courseId);
    const { error } = await supabase.from("course_modules").insert({
      course_id: data.courseId,
      title: data.title,
      description: data.description ?? "",
      order_index: count ?? 0,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ─── Update module ─── */
export const adminUpdateModule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        moduleId: z.string().uuid(),
        title: z.string().min(2).max(200).optional(),
        description: z.string().max(1000).optional(),
        order_index: z.number().min(0).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { moduleId, ...updates } = data;
    const { error } = await supabase.from("course_modules").update(updates).eq("id", moduleId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ─── Delete module ─── */
export const adminDeleteModule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ moduleId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("course_modules").delete().eq("id", data.moduleId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ─── Add lesson ─── */
export const adminAddLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        courseId: z.string().uuid(),
        moduleId: z.string().uuid(),
        title: z.string().min(2).max(200),
        description: z.string().max(1000).optional(),
        video_url: z.string().max(500).optional(),
        content_md: z.string().max(50000).optional(),
        content_translations: z.record(z.string()).optional(),
        duration_minutes: z.number().min(0).default(0),
        is_preview: z.boolean().default(false),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { count } = await supabase
      .from("lessons")
      .select("*", { count: "exact", head: true })
      .eq("course_id", data.courseId);
    const { error } = await supabase.from("lessons").insert({
      course_id: data.courseId,
      module_id: data.moduleId,
      title: data.title,
      description: data.description ?? "",
      video_url: data.video_url ?? "",
      content_md: data.content_md ?? null,
      content_translations: data.content_translations ?? {},
      duration_minutes: data.duration_minutes,
      is_preview: data.is_preview,
      order_index: count ?? 0,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ─── Update lesson ─── */
export const adminUpdateLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        lessonId: z.string().uuid(),
        title: z.string().min(2).max(200).optional(),
        description: z.string().max(1000).optional(),
        video_url: z.string().max(500).optional(),
        content_md: z.string().max(50000).optional(),
        content_translations: z.record(z.string()).optional(),
        duration_minutes: z.number().min(0).optional(),
        is_preview: z.boolean().optional(),
        order_index: z.number().min(0).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { lessonId, ...updates } = data;
    const { error } = await supabase.from("lessons").update(updates).eq("id", lessonId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ─── Delete lesson ─── */
export const adminDeleteLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ lessonId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("lessons").delete().eq("id", data.lessonId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ─── Course analytics ─── */
export const adminCourseAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data: courses } = await supabase
      .from("courses")
      .select("id, title, published, created_at");

    const results = [];
    for (const c of courses ?? []) {
      const [{ count: enrolled }, { count: completed }, { count: totalLessons }] =
        await Promise.all([
          supabase
            .from("enrollments")
            .select("*", { count: "exact", head: true })
            .eq("course_id", c.id),
          supabase
            .from("enrollments")
            .select("*", { count: "exact", head: true })
            .eq("course_id", c.id)
            .eq("status", "completed"),
          supabase
            .from("lessons")
            .select("*", { count: "exact", head: true })
            .eq("course_id", c.id),
        ]);
      results.push({
        ...c,
        enrolled: enrolled ?? 0,
        completed: completed ?? 0,
        totalLessons: totalLessons ?? 0,
      });
    }
    return results;
  });
