import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Heart,
  Eye,
  IndianRupee,
  BookOpen,
  MessageSquare,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CreatorGate } from "@/components/CreatorGate";
import { CreatorTabs } from "@/components/CreatorTabs";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardSkeleton } from "@/components/Skeletons";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/creator")({
  head: () => ({ meta: [{ title: "Creator Hub — Learnify AI" }] }),
  component: () => (
    <CreatorGate>
      <CreatorRouteShell />
    </CreatorGate>
  ),
});

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

function CreatorHub() {
  const { user } = useAuth();

  const overview = useQuery({
    enabled: !!user,
    queryKey: ["creator-overview", user?.id],
    queryFn: async () => {
      const uid = user!.id;

      const { data: courses } = await supabase
        .from("courses")
        .select("id, slug, title, cover_url, price_inr, published, created_at")
        .eq("created_by", uid)
        .order("created_at", { ascending: false });

      const courseIds = (courses ?? []).map((c) => c.id);

      const [{ count: subs }, lessonsRes, enrollmentsRes] = await Promise.all([
        supabase
          .from("creator_subscriptions")
          .select("*", { count: "exact", head: true })
          .eq("creator_id", uid),
        courseIds.length
          ? supabase.from("lessons").select("id, course_id, title").in("course_id", courseIds)
          : Promise.resolve({ data: [] as { id: string; course_id: string; title: string }[] }),
        courseIds.length
          ? supabase.from("enrollments").select("course_id").in("course_id", courseIds)
          : Promise.resolve({ data: [] as { course_id: string }[] }),
      ]);

      const lessons = lessonsRes.data ?? [];
      const lessonIds = lessons.map((l) => l.id);

      const [{ count: likes }, { count: views }, recentComments] = await Promise.all([
        lessonIds.length
          ? supabase
              .from("lesson_likes")
              .select("*", { count: "exact", head: true })
              .in("lesson_id", lessonIds)
          : Promise.resolve({ count: 0 }),
        lessonIds.length
          ? supabase
              .from("lesson_views")
              .select("*", { count: "exact", head: true })
              .in("lesson_id", lessonIds)
          : Promise.resolve({ count: 0 }),
        lessonIds.length
          ? supabase
              .from("lesson_comments")
              .select("id, body, created_at, lesson_id, user_id")
              .in("lesson_id", lessonIds)
              .order("created_at", { ascending: false })
              .limit(5)
          : Promise.resolve({ data: [] as any[] }),
      ]);

      const enrolls = enrollmentsRes.data ?? [];
      const enrollByCourse = new Map<string, number>();
      enrolls.forEach((e: any) =>
        enrollByCourse.set(e.course_id, (enrollByCourse.get(e.course_id) ?? 0) + 1),
      );

      // Earnings = sum(enrollments × price) per course
      const earnings = (courses ?? []).reduce(
        (sum, c) => sum + (enrollByCourse.get(c.id) ?? 0) * Number(c.price_inr ?? 0),
        0,
      );

      const totalEnrolls = enrolls.length;

      const commentsByLesson = new Map(lessons.map((l) => [l.id, l.title]));

      return {
        courses: courses ?? [],
        subs: subs ?? 0,
        likes: likes ?? 0,
        views: views ?? 0,
        earnings,
        totalEnrolls,
        recentComments: (recentComments.data ?? []).map((c: any) => ({
          ...c,
          lesson_title: commentsByLesson.get(c.lesson_id) ?? "Lesson",
        })),
        enrollByCourse,
        lessonsByCourse: lessons.reduce<Record<string, number>>((acc, l) => {
          acc[l.course_id] = (acc[l.course_id] ?? 0) + 1;
          return acc;
        }, {}),
      };
    },
  });

  const data = overview.data;

  if (overview.isLoading) {
    return (
      <AppShell>
        <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-7xl">
          <CreatorTabs />
          <div className="mt-6">
            <DashboardSkeleton />
          </div>
        </div>
      </AppShell>
    );
  }

  if (overview.isError) {
    return (
      <AppShell>
        <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-7xl">
          <CreatorTabs />
          <div className="mt-6">
            <Card className="p-8 text-center">
              <p className="text-destructive font-medium">Failed to load dashboard</p>
              <p className="text-sm text-muted-foreground mt-1">
                {overview.error instanceof Error
                  ? overview.error.message
                  : "An unexpected error occurred"}
              </p>
              <Button className="mt-4" size="sm" onClick={() => overview.refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" /> Retry
              </Button>
            </Card>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-7xl">
        <CreatorTabs />
        <div className="flex items-end justify-between flex-wrap gap-4 mt-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-medium">
              Creator Hub
            </div>
            <h1 className="mt-1 text-3xl font-display font-semibold tracking-tight">
              Your creator dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Audience, engagement, and revenue at a glance.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => overview.refetch()}
              disabled={overview.isFetching}
              title="Refresh dashboard"
            >
              <RefreshCw className={`h-4 w-4 ${overview.isFetching ? "animate-spin" : ""}`} />
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/studio">Open Studio</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/settings">Creator settings</Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-3">
          <Stat icon={Users} label="Subscribers" value={data?.subs ?? 0} />
          <Stat icon={BookOpen} label="Enrollments" value={data?.totalEnrolls ?? 0} />
          <Stat icon={Eye} label="Lesson views" value={data?.views ?? 0} />
          <Stat icon={Heart} label="Likes" value={data?.likes ?? 0} />
          <Stat icon={IndianRupee} label="Gross earnings" value={inr(data?.earnings ?? 0)} />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold">Your courses</h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/studio">Manage in Studio</Link>
              </Button>
            </div>
            {!overview.isLoading && !data?.courses.length ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No courses yet.{" "}
                <Link to="/studio" className="text-primary underline">
                  Create one in Studio
                </Link>
                .
              </div>
            ) : (
              <div className="divide-y">
                {data?.courses.map((c) => (
                  <div key={c.id} className="py-3 flex items-center gap-3">
                    <div className="h-12 w-20 rounded-md bg-muted overflow-hidden shrink-0">
                      {c.cover_url ? (
                        <img
                          src={c.cover_url}
                          alt={c.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{c.title}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                        <span>{data?.lessonsByCourse[c.id] ?? 0} lessons</span>
                        <span>{data?.enrollByCourse.get(c.id) ?? 0} enrolled</span>
                        <span>{inr(Number(c.price_inr ?? 0))}</span>
                        {!c.published && (
                          <Badge variant="secondary" className="text-[10px]">
                            Draft
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="icon" aria-label="Open course">
                      <Link to="/courses/$slug" params={{ slug: c.slug }}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Recent comments
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/creator/comments">View all</Link>
              </Button>
            </div>
            {!overview.isLoading && !data?.recentComments.length ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No comments yet.</p>
            ) : (
              <ul className="space-y-3">
                {data?.recentComments.map((c) => (
                  <li key={c.id} className="text-sm">
                    <p className="line-clamp-2">{c.body}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      on <span className="font-medium">{c.lesson_title}</span> ·{" "}
                      {new Date(c.created_at).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function CreatorRouteShell() {
  const location = useLocation();
  if (location.pathname !== "/creator") return <Outlet />;
  return <CreatorHub />;
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: number | string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 text-2xl font-display font-semibold">{value}</div>
    </Card>
  );
}
