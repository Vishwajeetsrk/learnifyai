import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyCronRequest } from "@/lib/cron-auth";

export const Route = (createFileRoute as any)("/api/cron/publish-scheduled")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const denied = verifyCronRequest(request);
        if (denied) return denied;

        const results: {
          postsPublished: number;
          lessonsPublished: number;
          errors: string[];
        } = {
          postsPublished: 0,
          lessonsPublished: 0,
          errors: [],
        };

        const now = new Date().toISOString();

        try {
          // 1. Release scheduled blog posts
          const { data: scheduledPosts, error: postsErr } = await supabaseAdmin
            .from("blog_posts" as any)
            .select("id, title, slug")
            .eq("published", false)
            .not("scheduled_at", "is", null)
            .lte("scheduled_at", now);

          if (!postsErr && scheduledPosts && scheduledPosts.length > 0) {
            const { error: updateErr } = await supabaseAdmin
              .from("blog_posts" as any)
              .update({
                published: true,
                published_at: now,
                updated_at: now,
              })
              .in(
                "id",
                scheduledPosts.map((p: any) => p.id),
              );

            if (updateErr) {
              results.errors.push(`Blog posts update error: ${updateErr.message}`);
            } else {
              results.postsPublished = scheduledPosts.length;
            }
          }

          // 2. Release scheduled lessons
          const { data: scheduledLessons, error: lessonsErr } = await supabaseAdmin
            .from("lessons" as any)
            .select("id, title")
            .eq("is_published", false)
            .not("scheduled_at", "is", null)
            .lte("scheduled_at", now);

          if (!lessonsErr && scheduledLessons && scheduledLessons.length > 0) {
            const { error: lessonUpdateErr } = await supabaseAdmin
              .from("lessons" as any)
              .update({
                is_published: true,
                updated_at: now,
              })
              .in(
                "id",
                scheduledLessons.map((l: any) => l.id),
              );

            if (lessonUpdateErr) {
              results.errors.push(`Lessons update error: ${lessonUpdateErr.message}`);
            } else {
              results.lessonsPublished = scheduledLessons.length;
            }
          }

          return new Response(
            JSON.stringify({
              success: true,
              timestamp: now,
              results,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        } catch (err: any) {
          console.error("Scheduled publishing error:", err);
          return new Response(
            JSON.stringify({ success: false, error: err.message || "Unknown error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
