import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, FileCheck2, ExternalLink, Paperclip, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/submissions")({
  head: () => ({ meta: [{ title: "My Submissions — Learnify AI" }] }),
  component: SubmissionsPage,
});

const STATUS_STYLE: Record<string, string> = {
  submitted: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  reviewed: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  needs_changes: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
};

function SubmissionsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const q = useQuery({
    enabled: !!user,
    queryKey: ["my-submissions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assignment_submissions")
        .select(
          "*, courses:course_id(title, slug), course_assignments:assignment_id(title, prompt)",
        )
        .eq("user_id", user!.id)
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const del = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    await supabase.from("assignment_submissions").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["my-submissions"] });
    toast.success("Deleted");
  };

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-5xl">
        <h1 className="text-2xl sm:text-3xl font-display font-semibold flex items-center gap-2">
          <FileCheck2 className="h-6 w-6 text-primary" /> My Submissions
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          All your assignment work across courses.
        </p>

        {q.isLoading ? (
          <div className="py-20 grid place-items-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (q.data ?? []).length === 0 ? (
          <div className="mt-8 rounded-2xl border bg-card p-12 text-center shadow-card text-sm text-muted-foreground">
            No submissions yet. Submit assignments from any enrolled course.
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {(q.data ?? []).map((s: any) => (
              <div key={s.id} className="rounded-xl border bg-card p-4 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium">{s.course_assignments?.title ?? "Assignment"}</p>
                    <Link
                      to="/courses/$slug"
                      params={{ slug: s.courses?.slug }}
                      className="text-xs text-primary hover:underline"
                    >
                      {s.courses?.title}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] capitalize ${STATUS_STYLE[s.status] ?? ""}`}
                    >
                      {s.status.replace("_", " ")}
                    </Badge>
                    <Button size="icon" variant="ghost" onClick={() => del(s.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                {s.content && (
                  <p className="text-sm mt-2 whitespace-pre-wrap text-muted-foreground line-clamp-4">
                    {s.content}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs">
                  {s.link_url && (
                    <a
                      href={s.link_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" /> Project link
                    </a>
                  )}
                  {s.attachment_url && (
                    <a
                      href={s.attachment_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <Paperclip className="h-3 w-3" /> Attachment
                    </a>
                  )}
                  <span className="text-muted-foreground ml-auto">
                    {format(new Date(s.submitted_at), "dd MMM yyyy · HH:mm")}
                  </span>
                </div>
                {s.feedback && (
                  <div className="mt-3 rounded-lg bg-muted/50 border p-3 text-sm">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                      Instructor feedback
                    </p>
                    {s.feedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
