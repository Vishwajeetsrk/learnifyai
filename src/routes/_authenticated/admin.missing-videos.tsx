import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Loader2, RefreshCw, ShieldAlert, VideoOff, BookOpen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { buildCourseVideoEmbedUrl } from "@/lib/course-player";

export const Route = createFileRoute("/_authenticated/admin/missing-videos")({
  head: () => ({ meta: [{ title: "Missing lesson videos — Admin" }] }),
  component: MissingVideosPage,
});

type LessonRow = {
  id: string;
  title: string;
  video_url: string | null;
  order_index: number;
  courses: { id: string; title: string; slug: string; published: boolean } | null;
};

function MissingVideosPage() {
  const { isAdmin, loading } = useAuth();

  const lessonsQ = useQuery({
    enabled: !loading && isAdmin,
    queryKey: ["admin", "missing-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("id, title, video_url, order_index, courses:course_id (id, title, slug, published)")
        .order("order_index", { ascending: true });
      if (error) throw error;
      return ((data ?? []) as unknown as LessonRow[])
        .map((lesson) => {
          const check = buildCourseVideoEmbedUrl(lesson.video_url);
          return { ...lesson, issue: check.ok ? null : check.message };
        })
        .filter((lesson) => lesson.issue);
    },
  });

  const emptyCoursesQ = useQuery({
    enabled: !loading && isAdmin,
    queryKey: ["admin", "empty-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, slug, published")
        .order("title", { ascending: true });
      if (error) throw error;
      const withLessonCount = await Promise.all(
        (data ?? []).map(async (c) => {
          const { count } = await supabase
            .from("lessons")
            .select("*", { count: "exact", head: true })
            .eq("course_id", c.id);
          return { ...c, lessonCount: count ?? 0 };
        }),
      );
      return withLessonCount.filter((c) => c.lessonCount === 0);
    },
  });

  if (!loading && !isAdmin) {
    return (
      <AppShell>
        <div className="px-6 py-16 max-w-xl mx-auto text-center">
          <ShieldAlert className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-3 font-medium">Admins only.</p>
        </div>
      </AppShell>
    );
  }

  const rows = lessonsQ.data ?? [];
  const emptyCourses = emptyCoursesQ.data ?? [];
  const totalIssues = rows.length + emptyCourses.length;

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-medium">
              Admin QA
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-display font-semibold flex items-center gap-2">
              <VideoOff className="h-6 w-6 text-primary" /> Missing lesson videos
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Lessons with empty or invalid video URLs that can break the player.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => { lessonsQ.refetch(); emptyCoursesQ.refetch(); }}>
            <RefreshCw className={`h-4 w-4 ${lessonsQ.isFetching || emptyCoursesQ.isFetching ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        {!lessonsQ.isLoading && !emptyCoursesQ.isLoading && totalIssues === 0 && (
          <div className="p-12 text-center text-sm text-muted-foreground">
            All lessons have playable video URLs.
          </div>
        )}

        {rows.length > 0 && (
          <div className="rounded-2xl border bg-card overflow-hidden mb-6">
            <div className="px-4 py-2 text-xs font-medium text-muted-foreground border-b bg-muted/20">
              {rows.length} lesson{rows.length === 1 ? "" : "s"} with missing/invalid video URL{rows.length === 1 ? "" : "s"}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Lesson</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Current URL</TableHead>
                  <TableHead className="text-right">Fix</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {row.courses?.title ?? "Untitled course"}
                        {row.courses?.published ? (
                          <Badge variant="outline" className="text-[10px]">
                            Live
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">
                            Draft
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {row.order_index + 1}. {row.title}
                    </TableCell>
                    <TableCell className="text-destructive text-xs">
                      <AlertTriangle className="h-3.5 w-3.5 inline mr-1" />
                      {row.issue}
                    </TableCell>
                    <TableCell className="max-w-[280px] truncate font-mono text-xs text-muted-foreground">
                      {row.video_url || "Empty"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link to="/studio">Open Studio</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {emptyCourses.length > 0 && (
          <div className="rounded-2xl border bg-card overflow-hidden">
            <div className="px-4 py-2 text-xs font-medium text-muted-foreground border-b bg-muted/20">
              {emptyCourses.length} course{emptyCourses.length === 1 ? "" : "s"} with no lessons (no content at all)
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emptyCourses.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell>
                      {c.published ? (
                        <Badge variant="outline" className="text-[10px]">Live</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link to="/studio">Open Studio</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {lessonsQ.isLoading || emptyCoursesQ.isLoading ? (
          <div className="p-12 grid place-items-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
