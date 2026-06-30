import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Trophy,
  GraduationCap,
  Loader2,
  Award,
  ArrowRight,
  FileCheck2,
  Calendar,
  FileBadge2,
  NotebookPen,
  Check,
  Sparkles,
  PlayCircle,
  Code2,
  Users,
  ExternalLink,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { getCleanBannerUrl } from "@/lib/utils";
import { getCourseActionLabel } from "@/lib/course-player";
import { logDailyUsage } from "@/lib/onboarding.functions";
import { RecommendedCourses } from "@/components/RecommendedCourses";
import { DashboardEventsJobs } from "@/components/DashboardEventsJobs";
import { DashboardSkeleton, StatCardSkeleton } from "@/components/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Learnify AI" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const name = (user?.user_metadata?.full_name as string) ?? user?.email?.split("@")[0] ?? "there";
  const [brokenImgs, setBrokenImgs] = useState<Set<string>>(new Set());

  const markBroken = (id: string) => setBrokenImgs((p) => new Set(p).add(id));

  const logDailyFn = useServerFn(logDailyUsage);
  useEffect(() => {
    if (!user) return;
    const today = new Date().toDateString();
    const lastLog = localStorage.getItem("last_daily_log");
    if (lastLog === today) return;
    localStorage.setItem("last_daily_log", today);
    logDailyFn({ data: { actions_count: 1, xp_earned: 10, notes: "Dashboard visit" } }).catch(
      () => {},
    );
  }, [user, logDailyFn]);

  const enrollQ = useQuery({
    enabled: !!user,
    queryKey: ["enrollments", user?.id],
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("*, courses:course_id (id, slug, title, cover_url, category, level, instructor)")
        .eq("user_id", user!.id)
        .order("last_activity_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const certsQ = useQuery({
    enabled: !!user,
    queryKey: ["my-certs", user?.id],
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    queryFn: async () => {
      const { data } = await supabase
        .from("certificates")
        .select("course_id, code, score, total, issued_at")
        .eq("user_id", user!.id);
      return data ?? [];
    },
  });

  const attemptsQ = useQuery({
    enabled: !!user,
    queryKey: ["my-attempts", user?.id],
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    queryFn: async () => {
      const { data } = await supabase
        .from("mcq_attempts")
        .select("course_id, score, total, passed, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const certMap = new Map((certsQ.data ?? []).map((c) => [c.course_id, c]));
  const attemptsByCourse: Record<string, any[]> = {};
  (attemptsQ.data ?? []).forEach((a) => {
    (attemptsByCourse[a.course_id] ||= []).push(a);
  });

  const enrolled = Array.isArray(enrollQ.data) ? enrollQ.data : [];
  const totalCompleted = enrolled.filter((e: any) => e.status === "completed").length;
  const totalCerts = Array.isArray(certsQ.data) ? certsQ.data.length : 0;

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-display font-semibold tracking-tight">
          Welcome back, {name}.
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Track your courses, tests, and certificates.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          {enrollQ.isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard label="Enrolled" value={String(enrolled.length)} icon={BookOpen} />
              <StatCard label="Completed" value={String(totalCompleted)} icon={GraduationCap} />
              <StatCard label="Certificates" value={String(totalCerts)} icon={Award} />
              <StatCard
                label="Test attempts"
                value={String((attemptsQ.data ?? []).length)}
                icon={Trophy}
              />
            </>
          )}
        </div>

        {isAdmin && (
          <div className="mt-6">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">
              Admin shortcuts
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <AdminShortcut
                to="/admin/content"
                icon={NotebookPen}
                title="Content Manager"
                desc="Events, jobs, pricing, FAQs"
              />
              <AdminShortcut
                to="/admin/content"
                search={{ tab: "events" }}
                icon={Calendar}
                title="Events & Jobs"
                desc="Create, edit, delete listings"
              />
              <AdminShortcut
                to="/admin/content"
                search={{ tab: "cert-templates" }}
                icon={FileBadge2}
                title="Certificate Templates"
                desc="Design & manage templates"
              />
              <AdminShortcut
                to="/studio"
                icon={NotebookPen}
                title="Course Builder"
                desc="Add lessons & modules"
              />
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-xl font-semibold">My Learning</h2>
            <Link
              to="/courses"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              Browse more <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {enrollQ.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border bg-card overflow-hidden shadow-card">
                  <div className="aspect-video bg-muted animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="flex gap-2">
                      <div className="h-4 w-16 rounded-full bg-muted animate-pulse" />
                    </div>
                    <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                    <div className="h-2 w-full rounded-full bg-muted animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : enrolled.length === 0 ? (
            <div className="rounded-2xl border bg-card p-12 text-center shadow-card">
              <BookOpen className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="mt-3 font-medium">No courses yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Enroll in a course to start learning and tracking progress.
              </p>
              <Link to="/courses" className="text-sm text-primary mt-3 inline-block">
                Explore courses →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {enrolled.map((e: any) => {
                const cert = certMap.get(e.course_id);
                const attempts = attemptsByCourse[e.course_id] ?? [];
                const best = attempts.reduce(
                  (b, a) =>
                    a.score / Math.max(a.total, 1) > (b ?? 0)
                      ? a.score / Math.max(a.total, 1)
                      : (b ?? 0),
                  0,
                );
                const actionLabel = getCourseActionLabel(e.progress_pct, e.status);
                return (
                  <div
                    key={e.id}
                    className="group rounded-2xl border bg-card overflow-hidden shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col"
                  >
                    <Link to="/courses/$slug" params={{ slug: e.courses?.slug }} className="block">
                      <div className="aspect-video bg-muted overflow-hidden">
                        {e.courses?.cover_url && !brokenImgs.has(e.courses.slug) ? (
                          <img
                            src={getCleanBannerUrl(e.courses.cover_url) ?? e.courses.cover_url}
                            alt={e.courses.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                            loading="lazy"
                            onError={() => markBroken(e.courses.slug)}
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center">
                            <GraduationCap className="h-10 w-10 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-4 flex-1 flex flex-col gap-2 min-w-0">
                      <div className="flex items-center gap-2 text-[10px] uppercase flex-wrap">
                        <Badge variant="secondary" className="text-[10px] shrink-0">
                          {e.courses?.category}
                        </Badge>
                        {cert && (
                          <Badge className="text-[10px] bg-emerald-500 hover:bg-emerald-500 shrink-0">
                            Certified
                          </Badge>
                        )}
                        {e.status === "completed" && !cert && (
                          <Badge variant="outline" className="text-[10px] shrink-0">
                            Done
                          </Badge>
                        )}
                      </div>
                      <Link
                        to="/courses/$slug"
                        params={{ slug: e.courses?.slug }}
                        className="font-display font-semibold line-clamp-2 group-hover:text-primary transition break-words"
                      >
                        {e.courses?.title}
                      </Link>
                      <div className="mt-auto">
                        <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                          <span className="truncate">{e.progress_pct}% complete</span>
                          <span className="shrink-0 ml-2">
                            {format(new Date(e.last_activity_at), "dd MMM")}
                          </span>
                        </div>
                        <Progress value={e.progress_pct} className="h-1.5" />
                        {attempts.length > 0 && (
                          <p className="text-[10px] text-muted-foreground mt-1.5">
                            {attempts.length} test attempt{attempts.length === 1 ? "" : "s"} · best{" "}
                            {Math.round(best * 100)}%
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-col sm:flex-row">
                        <Button asChild size="sm" variant="default" className="h-8 text-xs flex-1">
                          <Link to="/courses/$slug" params={{ slug: e.courses?.slug }}>
                            <PlayCircle className="h-3.5 w-3.5 shrink-0" /> {actionLabel}
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="h-8 text-xs flex-1">
                          <Link
                            to="/courses/$slug"
                            params={{ slug: e.courses?.slug }}
                            search={{ tab: "playground" } as any}
                          >
                            <Code2 className="h-3.5 w-3.5 shrink-0" /> Playground
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Certificates strip */}
        {(certsQ.data ?? []).length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" /> Your Certificates
              </h2>
              <Link
                to="/certificates"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(certsQ.data ?? []).slice(0, 3).map((c: any) => {
                const pct = c.total ? Math.round((c.score / c.total) * 100) : 0;
                return (
                  <Link
                    key={c.code}
                    to="/certificates/$code"
                    params={{ code: c.code }}
                    className="group rounded-xl p-4 text-white bg-gradient-to-br from-indigo-600 to-violet-700 shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <Award className="h-5 w-5" />
                      <Badge className="bg-white/15 hover:bg-white/15 text-[10px] backdrop-blur">
                        {pct}%
                      </Badge>
                    </div>
                    <p className="mt-6 text-[10px] uppercase tracking-[0.25em] opacity-80">
                      Certificate
                    </p>
                    <p className="font-display font-semibold leading-tight line-clamp-2">
                      {(enrolled.find((e: any) => e.course_id === c.course_id) as any)?.courses
                        ?.title ?? "Course"}
                    </p>
                    <p className="text-[10px] opacity-80 mt-2 font-mono">
                      {format(new Date(c.issued_at), "dd MMM yyyy")} · #{c.code.slice(0, 8)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/submissions"
            className="rounded-2xl border bg-card p-5 shadow-card hover:shadow-lg transition"
          >
            <FileCheck2 className="h-5 w-5 text-primary" />
            <h3 className="mt-3 font-display font-semibold">My Submissions</h3>
            <p className="text-xs text-muted-foreground mt-1">
              View status and feedback on your assignment work.
            </p>
          </Link>
          <Link
            to="/ai-tools"
            className="rounded-2xl border bg-card p-5 shadow-card hover:shadow-lg transition"
          >
            <Trophy className="h-5 w-5 text-primary" />
            <h3 className="mt-3 font-display font-semibold">AI Tools History</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Reuse past quizzes, flashcards, and study briefs.
            </p>
          </Link>
        </div>

        <RecommendedCourses />

        <DashboardEventsJobs />

        <DashboardCommunity />

        <UpgradePlans />
      </div>
    </AppShell>
  );
}

function UpgradePlans() {
  const { user } = useAuth();
  const currentSub = useQuery({
    enabled: !!user,
    queryKey: ["my-subscription", user?.id],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("user_subscriptions")
        .select("*, plan:pricing_plans(*)")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .maybeSingle();
      return data || null;
    },
  });

  const activePlanName = currentSub.data?.plan?.name ?? "Free";
  if (activePlanName !== "Free") return null;

  return (
    <div className="mt-12 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 text-center md:text-left">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold flex items-center justify-center md:justify-start gap-2">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" /> Upgrade to Pro
        </h2>
        <p className="text-muted-foreground mt-2 max-w-lg text-sm sm:text-base">
          Unlock unlimited AI sessions, premium courses, creator tools, and priority support.
          Elevate your learning journey today.
        </p>
      </div>
      <Button
        asChild
        size="lg"
        className="shrink-0 relative z-10 shadow-glow hover:-translate-y-0.5 transition-all w-full md:w-auto"
      >
        <Link to="/pricing" search={{ subscribe: undefined }}>
          View Pricing & Upgrade <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function DashboardCommunity() {
  const { user } = useAuth();

  const { data: cohorts = [], isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["dashboard-cohorts", user?.id],
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const { data: myIds } = await supabase
        .from("cohort_members")
        .select("cohort_id")
        .eq("user_id", user!.id);
      const memberIds = (myIds ?? []).map((r) => r.cohort_id);

      const { data: mine } = await supabase
        .from("cohorts")
        .select("id, title, description, kind, starts_at, capacity, status, group_link, creator_id")
        .or(
          memberIds.length
            ? `creator_id.eq.${user!.id},id.in.(${memberIds.join(",")})`
            : `creator_id.eq.${user!.id}`,
        )
        .order("starts_at", { ascending: false })
        .limit(20);
      return mine ?? [];
    },
  });

  if (isLoading)
    return (
      <div className="mt-10 space-y-3">
        <Skeleton className="h-6 w-36 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-4 shadow-card space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-3 w-24 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  if (cohorts.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> Your Community
        </h2>
        <Link
          to="/cohorts"
          className="text-xs text-primary hover:underline inline-flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cohorts.map((c: any) => (
          <div
            key={c.id}
            className="rounded-xl border bg-card p-4 shadow-card hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">{c.title}</div>
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                  {c.kind?.replace("_", " ")} · {c.status}
                </p>
              </div>
              <Badge
                variant={c.status === "live" ? "default" : "outline"}
                className="text-[10px] capitalize shrink-0"
              >
                {c.status}
              </Badge>
            </div>
            {c.group_link && (
              <a
                href={c.group_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Join group chat
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof BookOpen;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5 shadow-card">
      <Icon className="h-5 w-5 text-primary" />
      <div className="mt-3 text-2xl font-display font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function AdminShortcut({
  to,
  search,
  icon: Icon,
  title,
  desc,
}: {
  to: string;
  search?: Record<string, string>;
  icon: typeof BookOpen;
  title: string;
  desc: string;
}) {
  return (
    <Link
      to={to as any}
      search={search as any}
      className="group rounded-xl border bg-card p-4 shadow-card hover:shadow-lg hover:-translate-y-0.5 transition flex items-start gap-3"
    >
      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="font-display font-semibold text-sm group-hover:text-primary transition-colors">
          {title}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto self-center opacity-0 group-hover:opacity-100 transition" />
    </Link>
  );
}
