import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

export const getPublicProfile = createServerFn({ method: "GET" })
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const id = data.id;

    const request = getRequest();
    let currentUserId: string | null = null;
    if (request?.headers) {
      const cookieHeader = request.headers.get("cookie") || "";
      const cookiesMap: Record<string, string> = {};
      cookieHeader.split(";").forEach((c) => {
        const eqIndex = c.indexOf("=");
        if (eqIndex > -1) {
          cookiesMap[c.substring(0, eqIndex).trim()] = c.substring(eqIndex + 1).trim();
        }
      });
      const token =
        cookiesMap["sb-access-token"] ||
        cookiesMap["supabase-auth-token"] ||
        cookiesMap["sb-auth-token"] ||
        cookiesMap["sb-refresh-token"] ||
        Object.keys(cookiesMap).find((k) => k.startsWith("sb-") && k.endsWith("-auth-token")) ||
        Object.keys(cookiesMap).find((k) => k.startsWith("sb-") && !k.endsWith("-refresh-token"));
      if (token) {
        try {
          const {
            data: { user },
          } = await supabaseAdmin.auth.getUser(token);
          if (user) {
            currentUserId = user.id;
          }
        } catch (err) {
          console.error("Error parsing user token in getPublicProfile:", err);
        }
      }
    }

    const [
      profileRes,
      subRes,
      likesRes,
      enrollRes,
      createdRes,
      certsRes,
      projectsRes,
      postsRes,
      rolesRes,
    ] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select(
          "id, full_name, avatar_url, bio, created_at, banner_url, social_links, username, location, work, education, skills, email, website, xp, current_streak",
        )
        .eq("id", id)
        .maybeSingle(),
      supabaseAdmin
        .from("creator_subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("creator_id", id),
      supabaseAdmin
        .from("lesson_likes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", id),
      supabaseAdmin
        .from("enrollments")
        .select("course_id, enrolled_at, courses!inner(id, slug, title, cover_url, category)")
        .eq("user_id", id)
        .order("enrolled_at", { ascending: false })
        .limit(24),
      supabaseAdmin
        .from("courses")
        .select("id, slug, title, cover_url, category")
        .eq("created_by", id)
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(24),
      supabaseAdmin
        .from("certificates")
        .select("*", { count: "exact", head: true })
        .eq("user_id", id),
      (() => {
        let query = (supabaseAdmin as any)
          .from("playground_projects")
          .select(
            "id, title, description, language, template, is_public, tags, created_at, updated_at",
          )
          .eq("user_id", id);
        if (currentUserId !== id) {
          query = query.eq("is_public", true);
        }
        return query.order("updated_at", { ascending: false }).limit(24);
      })(),
      supabaseAdmin
        .from("posts" as any)
        .select(
          `
          *,
          author:profiles!posts_author_id_fkey (id, full_name, avatar_url),
          likes:post_likes(id, user_id),
          comments:post_comments(id, content, author_id, created_at, author:author_id(id, full_name, avatar_url)),
          saves:post_saves(id, user_id)
        `,
        )
        .eq("author_id", id)
        .order("created_at", { ascending: false })
        .limit(24),
      supabaseAdmin.from("user_roles").select("role").eq("user_id", id),
    ]);

    if (!profileRes.data) return null;

    return {
      profile: profileRes.data,
      subscribers: subRes.count ?? 0,
      likes: likesRes.count ?? 0,
      certificates: certsRes.count ?? 0,
      enrolled: (enrollRes.data ?? []).map((e: any) => e.courses).filter(Boolean),
      created: createdRes.data ?? [],
      projects: projectsRes.data ?? [],
      posts: postsRes.data ?? [],
      roles: rolesRes.data?.map((r: any) => r.role) ?? [],
    };
  });

export const getCreatorAnalytics = createServerFn({ method: "GET" })
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const id = data.id;

    // Get creator's courses with lesson ids
    const { data: courses } = await supabaseAdmin
      .from("courses")
      .select("id, slug, title, cover_url")
      .eq("created_by", id);
    const courseIds = (courses ?? []).map((c) => c.id);

    if (courseIds.length === 0) {
      return { subscribers: 0, totalLikes: 0, totalViews: 0, totalEnrollments: 0, courses: [] };
    }

    const { data: lessons } = await supabaseAdmin
      .from("lessons")
      .select("id, course_id")
      .in("course_id", courseIds);
    const lessonIds = (lessons ?? []).map((l) => l.id);
    const lessonsByCourse = new Map<string, string[]>();
    for (const l of lessons ?? []) {
      const arr = lessonsByCourse.get(l.course_id) ?? [];
      arr.push(l.id);
      lessonsByCourse.set(l.course_id, arr);
    }

    const [subRes, enrollRes, likesRes, viewsRes] = await Promise.all([
      supabaseAdmin
        .from("creator_subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("creator_id", id),
      supabaseAdmin.from("enrollments").select("course_id").in("course_id", courseIds),
      lessonIds.length
        ? supabaseAdmin.from("lesson_likes").select("lesson_id").in("lesson_id", lessonIds)
        : Promise.resolve({ data: [] as any[] }),
      lessonIds.length
        ? supabaseAdmin.from("lesson_views").select("lesson_id").in("lesson_id", lessonIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const enrollByCourse = new Map<string, number>();
    for (const e of enrollRes.data ?? [])
      enrollByCourse.set(e.course_id, (enrollByCourse.get(e.course_id) ?? 0) + 1);

    const likesByLesson = new Map<string, number>();
    for (const l of (likesRes.data ?? []) as any[])
      likesByLesson.set(l.lesson_id, (likesByLesson.get(l.lesson_id) ?? 0) + 1);

    const viewsByLesson = new Map<string, number>();
    for (const v of (viewsRes.data ?? []) as any[])
      viewsByLesson.set(v.lesson_id, (viewsByLesson.get(v.lesson_id) ?? 0) + 1);

    const perCourse = (courses ?? []).map((c) => {
      const lids = lessonsByCourse.get(c.id) ?? [];
      const likes = lids.reduce((s, lid) => s + (likesByLesson.get(lid) ?? 0), 0);
      const views = lids.reduce((s, lid) => s + (viewsByLesson.get(lid) ?? 0), 0);
      return {
        id: c.id,
        slug: c.slug,
        title: c.title,
        cover_url: c.cover_url,
        lessons: lids.length,
        likes,
        views,
        enrollments: enrollByCourse.get(c.id) ?? 0,
      };
    });

    return {
      subscribers: subRes.count ?? 0,
      totalLikes: perCourse.reduce((s, c) => s + c.likes, 0),
      totalViews: perCourse.reduce((s, c) => s + c.views, 0),
      totalEnrollments: perCourse.reduce((s, c) => s + c.enrollments, 0),
      courses: perCourse.sort((a, b) => b.views - a.views),
    };
  });
