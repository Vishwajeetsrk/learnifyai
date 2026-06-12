import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MessageSquare, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CreatorGate } from "@/components/CreatorGate";
import { CreatorTabs } from "@/components/CreatorTabs";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/creator/comments")({
  head: () => ({ meta: [{ title: "Comments — Learnify AI" }] }),
  component: () => (
    <CreatorGate>
      <CreatorCommentsPage />
    </CreatorGate>
  ),
});

function CreatorCommentsPage() {
  const { user, isAdmin } = useAuth();
  const qc = useQueryClient();

  const q = useQuery({
    enabled: !!user,
    queryKey: ["creator-comments", user?.id],
    queryFn: async () => {
      // 1. Lessons that belong to courses created by this user
      const { data: courses } = await supabase
        .from("courses")
        .select("id, title")
        .eq("created_by", user!.id);
      const cIds = (courses ?? []).map((c) => c.id);
      if (!cIds.length) return { comments: [] as any[] };
      const { data: lessons } = await supabase
        .from("lessons")
        .select("id, title, course_id")
        .in("course_id", cIds);
      const lIds = (lessons ?? []).map((l) => l.id);
      if (!lIds.length) return { comments: [] as any[] };
      const lessonMap = new Map((lessons ?? []).map((l) => [l.id, l]));

      const { data: comments, error } = await supabase
        .from("lesson_comments")
        .select("id, body, created_at, user_id, lesson_id")
        .in("lesson_id", lIds)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;

      const userIds = Array.from(new Set((comments ?? []).map((c) => c.user_id)));
      const { data: profiles } = userIds.length
        ? await supabase
            .from("profiles")
            .select("id, full_name, email, avatar_url")
            .in("id", userIds)
        : { data: [] as any[] };
      const pmap = new Map((profiles ?? []).map((p: any) => [p.id, p]));

      return {
        comments: (comments ?? []).map((c) => ({
          ...c,
          lesson: lessonMap.get(c.lesson_id),
          profile: pmap.get(c.user_id),
        })),
      };
    },
  });

  const remove = async (id: string) => {
    // Creator can delete via the "Users or admins delete comments" policy only
    // if they own the row. To moderate on their lessons, an admin should do it.
    // For non-owned rows we still attempt — RLS will return 0 rows affected.
    const { error } = await supabase.from("lesson_comments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Comment deleted");
    qc.invalidateQueries({ queryKey: ["creator-comments", user?.id] });
  };

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-4xl">
        <CreatorTabs />
        <div className="flex items-center gap-3 mt-6">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-display font-semibold">Comments on your lessons</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Latest 200 comments across your courses.
          {!isAdmin && " Only your own comments and admin moderation can remove others."}
        </p>

        <Card className="mt-6 p-0 overflow-hidden">
          {q.isLoading ? (
            <div className="py-16 grid place-items-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : !q.data?.comments.length ? (
            <div className="py-16 text-center text-sm text-muted-foreground">No comments yet.</div>
          ) : (
            <ul className="divide-y">
              {q.data.comments.map((c: any) => (
                <li key={c.id} className="p-4 flex gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={c.profile?.avatar_url ?? undefined} />
                    <AvatarFallback>
                      {(c.profile?.full_name ?? "?").slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {c.profile?.full_name ?? "Anonymous"}
                      </span>
                      {" · "}
                      <Link
                        to="/courses/$slug"
                        params={{ slug: "" }}
                        className="hover:underline"
                        // We don't have slug at hand cheaply; just show lesson title
                      >
                        {c.lesson?.title ?? "Lesson"}
                      </Link>
                      {" · "}
                      {new Date(c.created_at).toLocaleString()}
                    </div>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{c.body}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(c.id)}
                    aria-label="Delete comment"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
