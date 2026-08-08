/**
 * Learnify AI — Lesson Content Blocks Server Functions
 * Full CRUD for the no-code block editor system
 * Handles: blocks, lessons, modules, course settings
 */
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// ────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────

const BlockTypeEnum = z.enum([
  "text", "video", "image", "quiz", "code",
  "callout", "divider", "embed", "diagram", "file",
]);

const BlockSchema = z.object({
  id: z.string().uuid().optional(),
  type: BlockTypeEnum,
  content: z.record(z.unknown()).default({}),
  order_index: z.number().int().min(0).default(0),
});

// ────────────────────────────────────────────────────────────
// BLOCKS — READ
// ────────────────────────────────────────────────────────────

/**
 * Fetch all content blocks for a lesson, ordered
 */
export const getLessonBlocks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ lessonId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: blocks, error } = await (supabase as any)
      .from("lesson_content_blocks")
      .select("id, type, content, order_index, created_at, updated_at")
      .eq("lesson_id", data.lessonId)
      .order("order_index", { ascending: true });
    if (error) throw new Error(error.message);
    return { blocks: blocks ?? [] };
  });

// ────────────────────────────────────────────────────────────
// BLOCKS — WRITE (creator/admin only)
// ────────────────────────────────────────────────────────────

/**
 * Save all blocks for a lesson (full replace — used by auto-save)
 */
export const saveLessonBlocks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      lessonId: z.string().uuid(),
      blocks: z.array(BlockSchema),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Verify ownership
    await assertLessonOwnership(supabase, data.lessonId, userId);

    // Delete all existing blocks for this lesson
    const { error: delErr } = await (supabase as any)
      .from("lesson_content_blocks")
      .delete()
      .eq("lesson_id", data.lessonId);
    if (delErr) throw new Error(delErr.message);

    if (!data.blocks.length) return { ok: true, count: 0 };

    // Insert fresh blocks
    const rows = data.blocks.map((b, i) => ({
      lesson_id: data.lessonId,
      type: b.type,
      content: b.content,
      order_index: i,
    }));

    const { data: inserted, error: insErr } = await (supabase as any)
      .from("lesson_content_blocks")
      .insert(rows)
      .select("id, type, content, order_index");
    if (insErr) throw new Error(insErr.message);

    // Update lesson content_format to 'blocks'
    await (supabase as any)
      .from("lessons")
      .update({ content_format: "blocks", updated_at: new Date().toISOString() })
      .eq("id", data.lessonId);

    return { ok: true, count: inserted?.length ?? 0, blocks: inserted };
  });

/**
 * Add a single block at a position
 */
export const addLessonBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      lessonId: z.string().uuid(),
      type: BlockTypeEnum,
      content: z.record(z.unknown()).default({}),
      orderIndex: z.number().int().min(0).default(0),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertLessonOwnership(supabase, data.lessonId, userId);

    // Shift existing blocks at and after orderIndex
    await (supabase as any).rpc("increment_block_order", {
      p_lesson_id: data.lessonId,
      p_from_index: data.orderIndex,
    }).throwOnError();

    const { data: block, error } = await (supabase as any)
      .from("lesson_content_blocks")
      .insert({
        lesson_id: data.lessonId,
        type: data.type,
        content: data.content,
        order_index: data.orderIndex,
      })
      .select("id, type, content, order_index")
      .single();
    if (error) throw new Error(error.message);

    return { ok: true, block };
  });

/**
 * Update a single block's content
 */
export const updateLessonBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      blockId: z.string().uuid(),
      content: z.record(z.unknown()),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Verify ownership via join
    const { data: block } = await (supabase as any)
      .from("lesson_content_blocks")
      .select("lesson_id")
      .eq("id", data.blockId)
      .single();
    if (!block) throw new Error("Block not found");
    await assertLessonOwnership(supabase, block.lesson_id, userId);

    const { error } = await (supabase as any)
      .from("lesson_content_blocks")
      .update({ content: data.content })
      .eq("id", data.blockId);
    if (error) throw new Error(error.message);

    return { ok: true };
  });

/**
 * Delete a single block
 */
export const deleteLessonBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ blockId: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: block } = await (supabase as any)
      .from("lesson_content_blocks")
      .select("lesson_id")
      .eq("id", data.blockId)
      .single();
    if (!block) throw new Error("Block not found");
    await assertLessonOwnership(supabase, block.lesson_id, userId);

    const { error } = await (supabase as any)
      .from("lesson_content_blocks")
      .delete()
      .eq("id", data.blockId);
    if (error) throw new Error(error.message);

    return { ok: true };
  });

/**
 * Reorder blocks (pass new ordered array of block IDs)
 */
export const reorderLessonBlocks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      lessonId: z.string().uuid(),
      orderedIds: z.array(z.string().uuid()),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertLessonOwnership(supabase, data.lessonId, userId);

    const updates = data.orderedIds.map((id, i) =>
      (supabase as any)
        .from("lesson_content_blocks")
        .update({ order_index: i })
        .eq("id", id)
        .eq("lesson_id", data.lessonId),
    );
    await Promise.all(updates);
    return { ok: true };
  });

// ────────────────────────────────────────────────────────────
// LESSON CRUD
// ────────────────────────────────────────────────────────────

export const createLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      courseId: z.string().uuid(),
      moduleId: z.string().uuid(),
      title: z.string().min(1).max(200),
      orderIndex: z.number().int().min(0).default(0),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertCourseOwnership(supabase, data.courseId, userId);

    const { data: lesson, error } = await (supabase as any)
      .from("lessons")
      .insert({
        course_id: data.courseId,
        module_id: data.moduleId,
        title: data.title,
        order_index: data.orderIndex,
        content_md: "",
        content_format: "blocks",
        duration_minutes: 10,
        is_preview: false,
        is_free_preview: false,
      })
      .select("id, title, order_index, duration_minutes, is_preview, is_free_preview, content_format")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, lesson };
  });

export const updateLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      lessonId: z.string().uuid(),
      title: z.string().min(1).max(200).optional(),
      isFreePreview: z.boolean().optional(),
      durationMinutes: z.number().int().min(1).max(600).optional(),
      description: z.string().max(500).optional(),
      tags: z.array(z.string()).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertLessonOwnership(supabase, data.lessonId, userId);

    const patch: Record<string, unknown> = {};
    if (data.title !== undefined) patch.title = data.title;
    if (data.isFreePreview !== undefined) patch.is_free_preview = data.isFreePreview;
    if (data.durationMinutes !== undefined) patch.duration_minutes = data.durationMinutes;
    if (data.description !== undefined) patch.description = data.description;
    if (data.tags !== undefined) patch.tags = data.tags;

    const { error } = await (supabase as any)
      .from("lessons")
      .update(patch)
      .eq("id", data.lessonId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ lessonId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertLessonOwnership(supabase, data.lessonId, userId);

    const { error } = await supabase
      .from("lessons")
      .delete()
      .eq("id", data.lessonId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderLessons = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      moduleId: z.string().uuid(),
      orderedIds: z.array(z.string().uuid()),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const updates = data.orderedIds.map((id, i) =>
      supabase.from("lessons").update({ order_index: i }).eq("id", id).eq("module_id", data.moduleId),
    );
    await Promise.all(updates);
    return { ok: true };
  });

// ────────────────────────────────────────────────────────────
// MODULE CRUD
// ────────────────────────────────────────────────────────────

export const createModule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      courseId: z.string().uuid(),
      title: z.string().min(1).max(200),
      orderIndex: z.number().int().min(0).default(0),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertCourseOwnership(supabase, data.courseId, userId);

    const { data: mod, error } = await supabase
      .from("course_modules")
      .insert({
        course_id: data.courseId,
        title: data.title,
        description: "",
        order_index: data.orderIndex,
      })
      .select("id, title, description, order_index")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, module: mod };
  });

export const updateModule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      moduleId: z.string().uuid(),
      title: z.string().min(1).max(200).optional(),
      description: z.string().max(600).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: mod } = await supabase
      .from("course_modules")
      .select("course_id")
      .eq("id", data.moduleId)
      .single();
    if (!mod) throw new Error("Module not found");
    await assertCourseOwnership(supabase, mod.course_id, userId);

    const patch: Record<string, unknown> = {};
    if (data.title !== undefined) patch.title = data.title;
    if (data.description !== undefined) patch.description = data.description;

    const { error } = await (supabase as any)
      .from("course_modules")
      .update(patch)
      .eq("id", data.moduleId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteModule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ moduleId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: mod } = await supabase
      .from("course_modules")
      .select("course_id")
      .eq("id", data.moduleId)
      .single();
    if (!mod) throw new Error("Module not found");
    await assertCourseOwnership(supabase, mod.course_id, userId);

    const { error } = await supabase
      .from("course_modules")
      .delete()
      .eq("id", data.moduleId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderModules = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      courseId: z.string().uuid(),
      orderedIds: z.array(z.string().uuid()),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertCourseOwnership(supabase, data.courseId, userId);

    const updates = data.orderedIds.map((id, i) =>
      supabase.from("course_modules").update({ order_index: i }).eq("id", id).eq("course_id", data.courseId),
    );
    await Promise.all(updates);
    return { ok: true };
  });

// ────────────────────────────────────────────────────────────
// COURSE SETTINGS
// ────────────────────────────────────────────────────────────

export const getCourseForEditor = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ courseId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertCourseOwnership(supabase, data.courseId, userId);

    const { data: course, error: cErr } = await supabase
      .from("courses")
      .select(`
        id, slug, title, description, category, level, price_inr,
        published, cover_url, instructor, duration_minutes,
        teaser_video_url, requirements, outcomes, target_audience,
        settings, language, certificate_enabled, completion_threshold,
        created_at, created_by
      `)
      .eq("id", data.courseId)
      .single();
    if (cErr || !course) throw new Error("Course not found or access denied");

    const { data: modules, error: mErr } = await supabase
      .from("course_modules")
      .select(`
        id, title, description, order_index,
        lessons (
          id, title, description, order_index, duration_minutes,
          is_preview, is_free_preview, video_url, content_format, tags
        )
      `)
      .eq("course_id", data.courseId)
      .order("order_index", { ascending: true });
    if (mErr) throw new Error(mErr.message);

    // Sort lessons within each module
    const sortedModules = (modules ?? []).map((m: any) => ({
      ...m,
      lessons: (m.lessons ?? []).sort((a: any, b: any) => a.order_index - b.order_index),
    }));

    return { course, modules: sortedModules };
  });

export const updateCourseSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      courseId: z.string().uuid(),
      title: z.string().min(2).max(120).optional(),
      description: z.string().max(1000).optional(),
      category: z.string().max(100).optional(),
      level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
      priceInr: z.number().min(0).optional(),
      published: z.boolean().optional(),
      instructor: z.string().max(120).optional(),
      language: z.string().max(10).optional(),
      teaserVideoUrl: z.string().url().optional().nullable(),
      requirements: z.array(z.string()).optional(),
      outcomes: z.array(z.string()).optional(),
      targetAudience: z.string().max(300).optional(),
      certificateEnabled: z.boolean().optional(),
      completionThreshold: z.number().int().min(0).max(100).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertCourseOwnership(supabase, data.courseId, userId);

    const patch: Record<string, unknown> = {};
    if (data.title !== undefined) patch.title = data.title;
    if (data.description !== undefined) patch.description = data.description;
    if (data.category !== undefined) patch.category = data.category;
    if (data.level !== undefined) patch.level = data.level;
    if (data.priceInr !== undefined) patch.price_inr = data.priceInr;
    if (data.published !== undefined) patch.published = data.published;
    if (data.instructor !== undefined) patch.instructor = data.instructor;
    if (data.language !== undefined) patch.language = data.language;
    if (data.teaserVideoUrl !== undefined) patch.teaser_video_url = data.teaserVideoUrl;
    if (data.requirements !== undefined) patch.requirements = data.requirements;
    if (data.outcomes !== undefined) patch.outcomes = data.outcomes;
    if (data.targetAudience !== undefined) patch.target_audience = data.targetAudience;
    if (data.certificateEnabled !== undefined) patch.certificate_enabled = data.certificateEnabled;
    if (data.completionThreshold !== undefined) patch.completion_threshold = data.completionThreshold;

    const { error } = await (supabase as any)
      .from("courses")
      .update(patch)
      .eq("id", data.courseId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateCourseCover = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      courseId: z.string().uuid(),
      coverUrl: z.string().url().or(z.literal("")),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertCourseOwnership(supabase, data.courseId, userId);

    const { error } = await supabase
      .from("courses")
      .update({ cover_url: data.coverUrl || null })
      .eq("id", data.courseId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const duplicateCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ courseId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertCourseOwnership(supabase, data.courseId, userId);

    // Fetch original
    const { data: orig, error: origErr } = await supabase
      .from("courses")
      .select("*")
      .eq("id", data.courseId)
      .single();
    if (origErr || !orig) throw new Error("Course not found");

    const slug = `${(orig as any).slug}-copy-${Math.random().toString(36).slice(2, 6)}`;

    // Create new course
    const { data: newCourse, error: ncErr } = await supabase
      .from("courses")
      .insert({
        ...(orig as any),
        id: undefined,
        slug,
        title: `${(orig as any).title} (Copy)`,
        published: false,
        created_at: undefined,
        updated_at: undefined,
        created_by: userId,
      })
      .select("id, slug")
      .single();
    if (ncErr) throw new Error(ncErr.message);

    // Copy modules + lessons
    const { data: modules } = await supabase
      .from("course_modules")
      .select("*, lessons(*)")
      .eq("course_id", data.courseId)
      .order("order_index");

    for (const mod of modules ?? []) {
      const { data: newMod } = await supabase
        .from("course_modules")
        .insert({
          course_id: (newCourse as any).id,
          title: (mod as any).title,
          description: (mod as any).description,
          order_index: (mod as any).order_index,
        })
        .select("id")
        .single();

      for (const lesson of (mod as any).lessons ?? []) {
        const { data: newLesson } = await (supabase as any)
          .from("lessons")
          .insert({
            course_id: (newCourse as any).id,
            module_id: (newMod as any).id,
            title: lesson.title,
            description: lesson.description,
            content_md: lesson.content_md,
            content_format: lesson.content_format,
            video_url: lesson.video_url,
            duration_minutes: lesson.duration_minutes,
            order_index: lesson.order_index,
            is_preview: false,
            is_free_preview: false,
          })
          .select("id")
          .single();

        // Copy blocks
        if ((newLesson as any)?.id) {
          const { data: blocks } = await (supabase as any)
            .from("lesson_content_blocks")
            .select("type, content, order_index")
            .eq("lesson_id", lesson.id)
            .order("order_index");

          if (blocks?.length) {
            await (supabase as any).from("lesson_content_blocks").insert(
              blocks.map((b: any) => ({
                lesson_id: (newLesson as any).id,
                type: b.type,
                content: b.content,
                order_index: b.order_index,
              })),
            );
          }
        }
      }
    }

    return { ok: true, slug: (newCourse as any).slug, courseId: (newCourse as any).id };
  });

// ────────────────────────────────────────────────────────────
// QUIZ ATTEMPTS
// ────────────────────────────────────────────────────────────

export const saveQuizAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      blockId: z.string().uuid(),
      lessonId: z.string().uuid(),
      courseId: z.string().uuid(),
      answers: z.array(z.number()),
      score: z.number().int(),
      maxScore: z.number().int(),
      passed: z.boolean(),
      timeTakenS: z.number().int().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await (supabase as any).from("user_quiz_attempts").insert({
      user_id: userId,
      block_id: data.blockId,
      lesson_id: data.lessonId,
      course_id: data.courseId,
      answers: data.answers,
      score: data.score,
      max_score: data.maxScore,
      passed: data.passed,
      time_taken_s: data.timeTakenS,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getQuizAttempt = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ blockId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: attempt } = await (supabase as any)
      .from("user_quiz_attempts")
      .select("id, score, max_score, passed, answers, attempted_at")
      .eq("user_id", userId)
      .eq("block_id", data.blockId)
      .order("attempted_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return { attempt };
  });

// ────────────────────────────────────────────────────────────
// ADMIN — Course List
// ────────────────────────────────────────────────────────────

export const adminGetAllCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      search: z.string().optional(),
      level: z.string().optional(),
      published: z.boolean().optional(),
      page: z.number().int().min(1).default(1),
      pageSize: z.number().int().min(1).max(50).default(20),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // Require admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
    if (!["admin", "super_admin"].includes((profile as any)?.role ?? "")) {
      throw new Error("Admin access required");
    }

    let query = supabase
      .from("courses")
      .select(`
        id, slug, title, level, category, price_inr, published,
        cover_url, created_at, duration_minutes, instructor,
        profiles!courses_created_by_fkey (id, full_name, avatar_url)
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range((data.page - 1) * data.pageSize, data.page * data.pageSize - 1);

    if (data.search) query = query.ilike("title", `%${data.search}%`);
    if (data.level) query = query.eq("level", data.level);
    if (data.published !== undefined) query = query.eq("published", data.published);

    const { data: courses, error, count } = await query;
    if (error) throw new Error(error.message);
    return { courses: courses ?? [], total: count ?? 0 };
  });

// ────────────────────────────────────────────────────────────
// HELPERS (private)
// ────────────────────────────────────────────────────────────

export async function assertLessonOwnership(supabase: any, lessonId: string, userId: string) {
  const { data: lesson } = await supabase
    .from("lessons")
    .select("course_id, courses!inner(created_by)")
    .eq("id", lessonId)
    .single();

  if (!lesson) throw new Error("Lesson not found");

  const courseCreatedBy = (lesson as any).courses?.created_by;
  if (courseCreatedBy === userId) return; // owner

  // Check if admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (["admin", "super_admin"].includes((profile as any)?.role ?? "")) return;

  throw new Error("Access denied: you do not own this course");
}

async function assertCourseOwnership(supabase: any, courseId: string, userId: string) {
  const { data: course } = await supabase
    .from("courses")
    .select("created_by")
    .eq("id", courseId)
    .single();
  if (!course) throw new Error("Course not found");
  if ((course as any).created_by === userId) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (["admin", "super_admin"].includes((profile as any)?.role ?? "")) return;

  throw new Error("Access denied: you do not own this course");
}
