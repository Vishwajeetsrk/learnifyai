import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  Lock,
  PlayCircle,
  Sparkles,
  NotebookPen,
  Code2,
  Send,
  RefreshCcw,
  Award,
  Trophy,
  X as XIcon,
  Check as CheckIcon,
  ShoppingCart,
  FileCheck2,
  Paperclip,
  ExternalLink,
  Upload,
  Bell,
  BellOff,
  Users,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LessonSocial } from "@/components/LessonSocial";

import { CustomVideoPlayer } from "@/components/CustomVideoPlayer";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
// isAdmin pulled from useAuth below
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { lessonAiHelper } from "@/lib/lesson-ai.functions";
import { enrollFree, markCourseStarted, recomputeProgress } from "@/lib/course.functions";
import { awardXP } from "@/lib/gamification.functions";

import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import {
  buildCourseVideoEmbedUrl,
  choosePlayableResumeLessonId,
  chooseResumeLessonId,
  hasCourseToolAccess,
} from "@/lib/course-player";

type CourseTab = "notes" | "summary" | "doubt" | "exercise" | "playground";
const VALID_TABS: CourseTab[] = ["notes", "summary", "doubt", "exercise", "playground"];

export const Route = createFileRoute("/_authenticated/courses/$slug")({
  head: () => ({ meta: [{ title: "Course — Learnify AI" }] }),
  validateSearch: (search: Record<string, unknown>): { tab?: CourseTab } => {
    const t = typeof search.tab === "string" ? (search.tab as CourseTab) : undefined;
    return { tab: t && VALID_TABS.includes(t) ? t : undefined };
  },
  component: CourseDetail,
  errorComponent: ({ error, reset }) => (
    <AppShell>
      <div className="p-10 text-center max-w-xl mx-auto">
        <p className="text-sm font-medium">Couldn't load this course.</p>
        <p className="text-xs text-muted-foreground mt-1 break-words">{error.message}</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button size="sm" onClick={() => reset()}>
            <RefreshCcw className="h-4 w-4" /> Try again
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/courses">Back to courses</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell>
      <div className="p-10 text-center">
        <p className="text-sm text-muted-foreground">Course not found.</p>
        <Link to="/courses" className="text-primary text-sm underline mt-2 inline-block">
          Back to courses
        </Link>
      </div>
    </AppShell>
  ),
});

const inr = (n: number) =>
  n === 0
    ? "Free"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(n);

function formatDuration(minutes: number) {
  if (!minutes) return "0m";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const hoursStr = hours > 0 ? `${hours}h` : "";
  const minutesStr = remainingMinutes > 0 ? `${remainingMinutes}m` : "";
  const durationStr = [hoursStr, minutesStr].filter(Boolean).join(" ");
  
  // Estimate daily learning load (assuming ~45 mins of dedicated focus/study per day)
  const daysLoad = Math.max(1, Math.ceil(minutes / 45));
  return `${durationStr} (${daysLoad} ${daysLoad === 1 ? "day" : "days"} load)`;
}

function formatLessonTime(minutes: number) {
  if (!minutes) return "0:00";
  const m = Math.floor(minutes);
  const s = Math.round((minutes - m) * 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function CourseDetail() {
  const { slug } = Route.useParams();
  const { tab: initialTab } = Route.useSearch();
  const { user, isAdmin } = useAuth();
  const qc = useQueryClient();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [speed, setSpeed] = useState<number>(1);
  const [enrollCelebration, setEnrollCelebration] = useState(false);
  const [playerRetry, setPlayerRetry] = useState(0);
  const [playerLoadFailed, setPlayerLoadFailed] = useState(false);

  const courseQuery = useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      const { data: course, error } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      const { data: lessons, error: lErr } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", course.id)
        .order("order_index", { ascending: true });
      if (lErr) throw lErr;

      let instructorProfile = null;
      if (course.created_by) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", course.created_by)
          .maybeSingle();
        instructorProfile = profile;
      }

      return { course, lessons: lessons ?? [], instructorProfile };
    },
  });

  const progressQuery = useQuery({
    enabled: !!user && !!courseQuery.data?.course.id,
    queryKey: ["progress", courseQuery.data?.course.id, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("lesson_id, completed, watched_seconds, updated_at")
        .eq("course_id", courseQuery.data!.course.id)
        .eq("user_id", user!.id);
      if (error) throw error;
      return data ?? [];
    },
  });

  const enrollmentQuery = useQuery({
    enabled: !!user && !!courseQuery.data?.course.id,
    queryKey: ["enrollment", courseQuery.data?.course.id, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", user!.id)
        .eq("course_id", courseQuery.data!.course.id)
        .maybeSingle();
      return data;
    },
  });

  const cartQuery = useQuery({
    enabled: !!user && !!courseQuery.data?.course.id,
    queryKey: ["cart-item", courseQuery.data?.course.id, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("cart_items")
        .select("id")
        .eq("user_id", user!.id)
        .eq("course_id", courseQuery.data!.course.id)
        .maybeSingle();
      return data;
    },
  });

  const enrollFreeFn = useServerFn(enrollFree);
  const markStarted = useServerFn(markCourseStarted);
  const recompute = useServerFn(recomputeProgress);
  const awardXPFn = useServerFn(awardXP);
  const navigate = useNavigate();

  const isEnrolled = !!enrollmentQuery.data;
  const inCart = !!cartQuery.data;
  const isFree = courseQuery.data ? Number(courseQuery.data.course.price_inr) === 0 : false;

  const progressRows = progressQuery.data ?? [];
  const completed = useMemo(
    () => new Set(progressRows.filter((d) => d.completed).map((d) => d.lesson_id)),
    [progressRows],
  );
  const lessons = courseQuery.data?.lessons ?? [];
  const course = courseQuery.data?.course;
  const instructorProfile = courseQuery.data?.instructorProfile;

  const creatorId = course?.created_by;

  const creatorSubsQuery = useQuery({
    enabled: !!creatorId,
    queryKey: ["creator-subs-count", creatorId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("creator_subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("creator_id", creatorId!);
      if (error) throw error;
      return count ?? 0;
    },
  });

  const mySubQuery = useQuery({
    enabled: !!user && !!creatorId && user.id !== creatorId,
    queryKey: ["my-sub-to-creator", creatorId, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("creator_subscriptions")
        .select("id")
        .eq("subscriber_id", user!.id)
        .eq("creator_id", creatorId!)
        .maybeSingle();
      return !!data;
    },
  });

  const toggleCreatorSub = async () => {
    if (!user) return navigate({ to: "/login" });
    if (!creatorId || user.id === creatorId) return;

    const isSubscribed = !!mySubQuery.data;
    if (isSubscribed) {
      const { error } = await supabase
        .from("creator_subscriptions")
        .delete()
        .eq("subscriber_id", user.id)
        .eq("creator_id", creatorId);
      if (error) return toast.error(error.message);
      toast.success("Unsubscribed");
    } else {
      const { error } = await supabase
        .from("creator_subscriptions")
        .insert({ subscriber_id: user.id, creator_id: creatorId });
      if (error) return toast.error(error.message);
      toast.success("Subscribed — you'll get notified for new lessons");
    }
    qc.invalidateQueries({ queryKey: ["my-sub-to-creator", creatorId, user.id] });
    qc.invalidateQueries({ queryKey: ["creator-subs-count", creatorId] });
  };
  const hasFullToolAccess = hasCourseToolAccess({
    isAdmin,
    isEnrolled,
    enrollmentStatus: enrollmentQuery.data?.status,
    progressPct: enrollmentQuery.data?.progress_pct,
    hasSavedProgress: progressRows.length > 0,
  });

  // Lesson-locking logic: first unlocked + free-preview always unlocked +
  // a lesson is unlocked if the previous one is completed.
  const unlocked = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < lessons.length; i++) {
      const l = lessons[i];
      if (hasFullToolAccess) set.add(l.id);
      else if (i === 0 || l.is_preview) set.add(l.id);
      else if (completed.has(lessons[i - 1].id)) set.add(l.id);
    }
    return set;
  }, [lessons, completed, hasFullToolAccess]);

  // Default active lesson = first unlocked lesson with a playable video, otherwise normal resume fallback
  useEffect(() => {
    if (!lessons.length || activeLessonId) return;
    const nextId =
      choosePlayableResumeLessonId(lessons, progressRows, unlocked) ??
      chooseResumeLessonId(lessons, progressRows, unlocked);
    if (nextId) setActiveLessonId(nextId);
  }, [lessons, unlocked, completed, progressRows, activeLessonId]);

  const active = lessons.find((l) => l.id === activeLessonId);
  const activeProgress = active ? progressRows.find((p) => p.lesson_id === active.id) : undefined;
  const activeVideo = active
    ? buildCourseVideoEmbedUrl(
        active.video_url,
        activeProgress?.watched_seconds ?? 0,
        typeof window !== "undefined" ? window.location.origin : undefined,
      )
    : null;
  const pct = lessons.length ? Math.round((completed.size / lessons.length) * 100) : 0;

  useEffect(() => {
    setPlayerLoadFailed(false);
  }, [active?.id, activeVideo?.ok, activeVideo?.ok ? activeVideo.src : null, playerRetry]);

  // Log a lesson view once per session per lesson (RLS allows anon/auth insert)
  useEffect(() => {
    if (!active?.id) return;
    const key = `lv:${active.id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
    supabase
      .from("lesson_views")
      .insert({ lesson_id: active.id, user_id: user?.id ?? null })
      .then(() => {});
  }, [active?.id, user?.id]);

  useEffect(() => {
    if (!user || !course || !active?.id || !isEnrolled) return;
    const key = `started:${course.id}:${active.id}`;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      markStarted({ data: { courseId: course.id, lessonId: active.id } })
        .then(() => {
          qc.invalidateQueries({ queryKey: ["progress", course.id, user.id] });
          qc.invalidateQueries({ queryKey: ["enrollments", user.id] });
        })
        .catch(() => {});
    }
    const base = progressRows.find((p) => p.lesson_id === active.id)?.watched_seconds ?? 0;
    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      const watched = Math.max(base + Math.floor((Date.now() - startedAt) / 1000), 1);
      supabase
        .from("lesson_progress")
        .upsert(
          {
            user_id: user.id,
            course_id: course.id,
            lesson_id: active.id,
            watched_seconds: watched,
          },
          { onConflict: "user_id,lesson_id" },
        )
        .then(() => {});
    }, 15000);
    return () => window.clearInterval(interval);
  }, [active?.id, course?.id, isEnrolled, markStarted, progressRows, qc, user?.id]);

  const addToCart = async () => {
    if (!user || !course) return;
    const { error } = await supabase
      .from("cart_items")
      .insert({ user_id: user.id, course_id: course.id });
    if (error) return toast.error(error.message);
    toast.success("Added to cart");
    qc.invalidateQueries({ queryKey: ["cart-item", course.id, user.id] });
    qc.invalidateQueries({ queryKey: ["cart-count"] });
  };

  const startFree = async () => {
    if (!course) return;
    try {
      await enrollFreeFn({ data: { courseId: course.id } });
      toast.success("Enrolled — let's start learning!");
      const firstPlayable =
        choosePlayableResumeLessonId(lessons, [], new Set(lessons.map((lesson) => lesson.id))) ??
        lessons[0]?.id;
      if (firstPlayable) setActiveLessonId(firstPlayable);
      setEnrollCelebration(true);
      qc.invalidateQueries({ queryKey: ["enrollment", course.id, user?.id] });
      qc.invalidateQueries({ queryKey: ["enrollments"] });
      if (firstPlayable)
        markStarted({ data: { courseId: course.id, lessonId: firstPlayable } }).catch(() => {});
    } catch (e: any) {
      toast.error(e?.message ?? "Could not enroll");
    }
  };

  const toggleComplete = async (lessonId: string) => {
    if (!user || !course) return;
    if (!isEnrolled) return toast.error("Enroll first to track progress");
    const isDone = completed.has(lessonId);
    const { error } = await supabase
      .from("lesson_progress")
      .upsert(
        { user_id: user.id, course_id: course.id, lesson_id: lessonId, completed: !isDone },
        { onConflict: "user_id,lesson_id" },
      );
    if (error) return toast.error(error.message);
    toast.success(!isDone ? "Lesson completed 🎉" : "Marked as not done");
    
    if (!isDone) {
      awardXPFn({ data: { userId: user.id, amount: 10 } }).then((res) => {
        if (res.success) {
          toast.success(`+10 XP Earned! 🔥 Streak: ${res.streak}`);
          qc.invalidateQueries({ queryKey: ["profile-mini", user.id] });
        }
      }).catch(() => {});
    }

    qc.invalidateQueries({ queryKey: ["progress", course.id, user.id] });
    recompute({ data: { courseId: course.id } })
      .then(() => {
        qc.invalidateQueries({ queryKey: ["enrollment", course.id, user.id] });
        qc.invalidateQueries({ queryKey: ["enrollments", user.id] });
      })
      .catch(() => {});
  };

  if (courseQuery.isLoading) {
    return (
      <AppShell>
        <div className="py-20 grid place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  if (courseQuery.error || !course) {
    return (
      <AppShell>
        <div className="p-10 text-center">
          <p className="text-sm text-muted-foreground">Course not found.</p>
          <Link to="/courses" className="text-primary text-sm underline mt-2 inline-block">
            Back to courses
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <CelebrationOverlay
        show={enrollCelebration}
        title="You’re enrolled!"
        message={
          lessons.length ? "Your first lesson is ready." : "This course is now in your dashboard."
        }
        withSound
        durationMs={1400}
        onDone={() => setEnrollCelebration(false)}
      />
      <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-7xl">
        <Link
          to="/courses"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to courses
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{course.category}</Badge>
          <Badge variant="outline">{course.level}</Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> {formatDuration(course.duration_minutes)}
          </span>
          <span className="text-xs font-semibold ml-auto">{inr(Number(course.price_inr))}</span>
        </div>

        <h1 className="mt-2 text-2xl sm:text-3xl font-display font-semibold tracking-tight">
          {course.title}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm max-w-3xl">{course.description}</p>
        {course.cover_url && (
          <div className="mt-4 overflow-hidden rounded-2xl border bg-muted max-w-4xl aspect-video">
            <img
              src={course.cover_url}
              alt={`${course.title} cover`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          By{" "}
          {course.created_by ? (
            <Link
              to="/creators/$id"
              params={{ id: course.created_by }}
              className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              {course.instructor}
            </Link>
          ) : (
            course.instructor
          )}
        </p>

        {/* Enrollment CTA */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {isEnrolled ? (
            <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white">
              Enrolled · Continue learning
            </Badge>
          ) : isFree ? (
            <Button onClick={startFree}>
              <PlayCircle className="h-4 w-4" /> Start free course
            </Button>
          ) : inCart ? (
            <Button onClick={() => navigate({ to: "/cart" })}>
              <ShoppingCart className="h-4 w-4" /> View cart
            </Button>
          ) : (
            <Button onClick={addToCart}>
              <ShoppingCart className="h-4 w-4" /> Add to cart · {inr(Number(course.price_inr))}
            </Button>
          )}
          {!isEnrolled && (
            <p className="text-xs text-muted-foreground">
              Preview lessons are free. Enroll to unlock the full course, tests, and certificate.
            </p>
          )}
        </div>

        {isEnrolled && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>Your progress</span>
              <span>
                {completed.size} / {lessons.length} lessons · {pct}%
              </span>
            </div>
            <Progress value={pct} className="h-2" />
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Player */}
          <div className="space-y-4 min-w-0">
            <div className="aspect-video rounded-2xl border bg-black overflow-hidden">
              {activeVideo?.ok && !playerLoadFailed ? (
                <CustomVideoPlayer
                  key={`${active?.id}-${playerRetry}`}
                  url={activeVideo.src}
                  startSeconds={activeProgress?.watched_seconds ?? 0}
                  onError={() => setPlayerLoadFailed(true)}
                  onReady={() => setPlayerLoadFailed(false)}
                  onEnded={() => {
                    if (active && user) {
                      if (!completed.has(active.id)) {
                        toggleComplete(active.id);
                      }
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-muted-foreground text-sm text-center px-6">
                  {playerLoadFailed ? (
                    <VideoFallback
                      message="The video player could not load this lesson. Check the URL, your connection, or retry the embed."
                      canRetry
                      onRetry={() => {
                        setPlayerLoadFailed(false);
                        setPlayerRetry((n) => n + 1);
                      }}
                    />
                  ) : activeVideo && !activeVideo.ok ? (
                    <VideoFallback
                      message={activeVideo.message}
                      canRetry={activeVideo.reason !== "missing-url"}
                      onRetry={() => setPlayerRetry((n) => n + 1)}
                    />
                  ) : lessons.length === 0 ? (
                    <div className="space-y-3">
                      <p>No lessons added yet for this course.</p>
                      {isAdmin && (
                        <Button asChild size="sm" variant="secondary">
                          <Link to="/studio">
                            <NotebookPen className="h-4 w-4" /> Open Course Builder
                          </Link>
                        </Button>
                      )}
                    </div>
                  ) : (
                    "Select a lesson from the list to begin."
                  )}
                </div>
              )}
            </div>

            {active && (
              <div className="rounded-2xl border bg-card p-5 shadow-card space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-display text-lg font-semibold">{active.title}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatLessonTime(active.duration_minutes)}{active.is_preview ? " · Free preview" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={String(speed)}
                      onValueChange={(v) => {
                        const n = Number(v);
                        setSpeed(n);
                      }}
                    >
                      <SelectTrigger className="h-8 w-[88px] text-xs">
                        <SelectValue placeholder="Speed" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((s) => (
                          <SelectItem key={s} value={String(s)}>
                            {s}x
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => toggleComplete(active.id)}
                      variant={completed.has(active.id) ? "secondary" : "default"}
                      size="sm"
                    >
                      {completed.has(active.id) ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" /> Completed
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-4 w-4" /> Mark complete
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Captions &amp; quality are available in the player's built-in controls (⚙ icon).
                </p>

                <LessonAiTabs
                  key={active.id}
                  courseId={course.id}
                  courseTitle={course.title}
                  lesson={active}
                  initialTab={initialTab}
                  hasToolAccess={hasFullToolAccess}
                />

                <LessonSocial lessonId={active.id} />
              </div>
            )}
          </div>

          {/* Right Sidebar (Content + Details) */}
          <div className="space-y-6">
            {/* Course Summary Card */}
            <div className="rounded-2xl border bg-card p-5 shadow-card space-y-4">
              <h3 className="font-display font-semibold text-sm">Course Details</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-muted/40 p-2.5">
                  <span className="text-muted-foreground block mb-0.5">Duration</span>
                  <span className="font-medium flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {formatDuration(course.duration_minutes)}
                  </span>
                </div>
                <div className="rounded-lg bg-muted/40 p-2.5">
                  <span className="text-muted-foreground block mb-0.5">Level</span>
                  <span className="font-medium capitalize">{course.level}</span>
                </div>
                <div className="rounded-lg bg-muted/40 p-2.5">
                  <span className="text-muted-foreground block mb-0.5">Category</span>
                  <span className="font-medium capitalize">{course.category}</span>
                </div>
                <div className="rounded-lg bg-muted/40 p-2.5">
                  <span className="text-muted-foreground block mb-0.5">Lessons</span>
                  <span className="font-medium">{lessons.length} lessons</span>
                </div>
              </div>
            </div>

            {/* Lesson list */}
            <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b">
                <h3 className="font-display font-semibold text-sm">Course content</h3>
                <p className="text-[11px] text-muted-foreground">{lessons.length} lessons</p>
              </div>
              <ul className="divide-y max-h-[60vh] overflow-y-auto">
                {lessons.map((l, i) => {
                  const isUnlocked = unlocked.has(l.id);
                  const isDone = completed.has(l.id);
                  const isActive = activeLessonId === l.id;
                  return (
                    <li key={l.id}>
                      <button
                        onClick={() => isUnlocked && setActiveLessonId(l.id)}
                        disabled={!isUnlocked}
                        className={cn(
                          "w-full text-left px-4 py-3 flex items-center gap-3 transition",
                          isActive && "bg-primary/5",
                          isUnlocked
                            ? "hover:bg-accent cursor-pointer"
                            : "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <div className="shrink-0">
                          {!isUnlocked ? (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          ) : isDone ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className={cn(
                              "text-sm truncate",
                              isActive && "font-semibold text-primary",
                            )}
                          >
                            {i + 1}. {l.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                            <Clock className="h-3 w-3" /> {formatLessonTime(l.duration_minutes)}
                            {l.is_preview && (
                              <Badge variant="outline" className="text-[9px] py-0">
                                Preview
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Instructor Profile Card */}
            <div className="rounded-2xl border bg-card p-5 shadow-card space-y-4">
              <h3 className="font-display font-semibold text-sm">Your Instructor</h3>
              <div className="flex items-center gap-3">
                {course.created_by ? (
                  <Link
                    to="/u/$id"
                    params={{ id: course.created_by }}
                    className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full hover:opacity-90 transition-opacity"
                  >
                    {instructorProfile?.avatar_url ? (
                      <img
                        src={instructorProfile.avatar_url}
                        alt={instructorProfile.full_name || course.instructor}
                        className="h-12 w-12 rounded-full object-cover border-2 border-primary/20"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold text-lg border-2 border-primary/20 shrink-0">
                        {(instructorProfile?.full_name || course.instructor).charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                ) : (
                  instructorProfile?.avatar_url ? (
                    <img
                      src={instructorProfile.avatar_url}
                      alt={instructorProfile.full_name || course.instructor}
                      className="h-12 w-12 rounded-full object-cover border-2 border-primary/20 shrink-0"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold text-lg border-2 border-primary/20 shrink-0">
                      {(instructorProfile?.full_name || course.instructor).charAt(0).toUpperCase()}
                    </div>
                  )
                )}
                <div className="min-w-0 flex-1">
                  {course.created_by ? (
                    <Link
                      to="/u/$id"
                      params={{ id: course.created_by }}
                      className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded inline-block max-w-full"
                    >
                      <h4 className="font-display font-semibold text-sm truncate">
                        {instructorProfile?.full_name || course.instructor}
                      </h4>
                    </Link>
                  ) : (
                    <h4 className="font-display font-semibold text-sm truncate">
                      {instructorProfile?.full_name || course.instructor}
                    </h4>
                  )}
                  <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-muted-foreground">
                    <Users className="h-3 w-3 text-primary" />
                    <span>{creatorSubsQuery.data ?? 0} subscribers</span>
                  </div>
                  {instructorProfile?.email && (
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {instructorProfile.email}
                    </p>
                  )}
                </div>
              </div>

              {creatorId && user?.id !== creatorId && (
                <Button
                  onClick={toggleCreatorSub}
                  variant={mySubQuery.data ? "outline" : "default"}
                  size="sm"
                  className="w-full rounded-full gap-1.5"
                >
                  {mySubQuery.data ? (
                    <>
                      <BellOff className="h-3.5 w-3.5" /> Subscribed
                    </>
                  ) : (
                    <>
                      <Bell className="h-3.5 w-3.5" /> Subscribe
                    </>
                  )}
                </Button>
              )}
              {instructorProfile?.bio ? (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {instructorProfile.bio}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Expert instructor delivering high-quality learning experiences.
                </p>
              )}
              {instructorProfile?.social_links && typeof instructorProfile.social_links === "object" && (
                <div className="flex flex-wrap gap-2 pt-2 border-t text-xs">
                  {Object.entries(instructorProfile.social_links as Record<string, string>).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline capitalize"
                    >
                      {platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {course && user && isEnrolled && <AssignmentsPanel courseId={course.id} userId={user.id} />}

        {course && user && isEnrolled && (
          <FinalTestSection
            courseId={course.id}
            userId={user.id}
            allComplete={lessons.length > 0 && completed.size >= lessons.length}
          />
        )}
      </div>
    </AppShell>
  );
}

// ---------- YouTube helpers ----------

function VideoFallback({
  message,
  canRetry,
  onRetry,
}: {
  message: string;
  canRetry: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="max-w-sm space-y-3">
      <AlertTriangle className="h-8 w-8 text-primary mx-auto" />
      <p className="font-medium text-foreground">Video can’t load</p>
      <p>{message}</p>
      <p className="text-xs">
        If the video is quota-limited or restricted by YouTube, ask an admin or creator to refresh
        the lesson video status.
      </p>
      {canRetry && (
        <Button size="sm" variant="secondary" onClick={onRetry}>
          <RefreshCcw className="h-4 w-4" /> Retry player
        </Button>
      )}
    </div>
  );
}

function setYouTubeSpeed(rate: number) {
  // Deprecated: speed is now managed by CustomVideoPlayer
}

// ---------- AI Tutor + Playground tabs ----------

type Lesson = {
  id: string;
  title: string;
  description?: string | null;
};

function LessonAiTabs({
  courseId,
  courseTitle,
  lesson,
  initialTab,
  hasToolAccess,
}: {
  courseId: string;
  courseTitle: string;
  lesson: Lesson;
  initialTab?: CourseTab;
  hasToolAccess: boolean;
}) {
  const helper = useServerFn(lessonAiHelper);
  const [summary, setSummary] = useState<string>("");
  const [exercise, setExercise] = useState<string>("");
  const [doubt, setDoubt] = useState<string>("");
  const [doubtQ, setDoubtQ] = useState<string>("");
  const [busy, setBusy] = useState<"" | "summary" | "exercise" | "doubt">("");

  const run = async (action: "summary" | "exercise" | "doubt") => {
    setBusy(action);
    try {
      const res = await helper({
        data: {
          action,
          courseId,
          lessonId: lesson.id,
          courseTitle,
          lessonTitle: lesson.title,
          lessonDescription: lesson.description ?? "",
          question: action === "doubt" ? doubtQ : undefined,
        },
      });
      if (action === "summary") setSummary(res.content);
      if (action === "exercise") setExercise(res.content);
      if (action === "doubt") setDoubt(res.content);
    } catch (e: any) {
      toast.error(e?.message ?? "AI request failed");
    } finally {
      setBusy("");
    }
  };

  return (
    <Tabs defaultValue={hasToolAccess ? (initialTab ?? "notes") : "notes"} className="mt-2">
      <TabsList className="w-full overflow-x-auto flex justify-start">
        <TabsTrigger value="notes" className="gap-1.5">
          <NotebookPen className="h-3.5 w-3.5" /> Notes
        </TabsTrigger>
        {hasToolAccess && (
          <>
            <TabsTrigger value="summary" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Summary
            </TabsTrigger>
            <TabsTrigger value="doubt" className="gap-1.5">
              <Send className="h-3.5 w-3.5" /> Ask AI
            </TabsTrigger>
            <TabsTrigger value="exercise" className="gap-1.5">
              <PlayCircle className="h-3.5 w-3.5" /> Exercise
            </TabsTrigger>
            <TabsTrigger value="playground" className="gap-1.5">
              <Code2 className="h-3.5 w-3.5" /> Playground
            </TabsTrigger>
          </>
        )}
      </TabsList>

      <TabsContent value="notes" className="pt-4">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {lesson.description || "No instructor notes for this lesson."}
        </p>
      </TabsContent>

      {!hasToolAccess && <LockedCourseTools />}

      {hasToolAccess && (
        <TabsContent value="summary" className="pt-4 space-y-3">
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => run("summary")} disabled={busy === "summary"}>
              {busy === "summary" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate summary
            </Button>
            {summary && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => run("summary")}
                disabled={busy === "summary"}
              >
                <RefreshCcw className="h-3.5 w-3.5" /> Regenerate
              </Button>
            )}
          </div>
          {summary && <Markdown>{summary}</Markdown>}
        </TabsContent>
      )}

      {hasToolAccess && (
        <TabsContent value="doubt" className="pt-4 space-y-3">
          <Textarea
            placeholder="Ask anything about this lesson — concepts, code, errors, real-world use…"
            value={doubtQ}
            onChange={(e) => setDoubtQ(e.target.value)}
            rows={3}
          />
          <Button
            size="sm"
            onClick={() => run("doubt")}
            disabled={busy === "doubt" || !doubtQ.trim()}
          >
            {busy === "doubt" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Get answer
          </Button>
          {doubt && <Markdown>{doubt}</Markdown>}
        </TabsContent>
      )}

      {hasToolAccess && (
        <TabsContent value="exercise" className="pt-4 space-y-3">
          <Button size="sm" onClick={() => run("exercise")} disabled={busy === "exercise"}>
            {busy === "exercise" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlayCircle className="h-4 w-4" />
            )}
            Generate practical exercise
          </Button>
          {exercise && <Markdown>{exercise}</Markdown>}
        </TabsContent>
      )}

      {hasToolAccess && (
        <TabsContent value="playground" className="pt-4">
          <CodePlayground />
        </TabsContent>
      )}
    </Tabs>
  );
}

function LockedCourseTools() {
  return (
    <div className="mt-4 rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
      <div className="flex items-start gap-3">
        <Lock className="h-4 w-4 mt-0.5 text-primary" />
        <div>
          <p className="font-medium text-foreground">Course tools unlock after access is active.</p>
          <p className="mt-1">
            Enroll or purchase the course to use Playground, AI hints, suggestions, solving help,
            and lesson summaries.
          </p>
        </div>
      </div>
    </div>
  );
}

function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-muted prose-pre:text-foreground prose-code:before:hidden prose-code:after:hidden">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

// ---------- Inbuilt HTML/CSS/JS preview + editor ----------

const DEFAULT_HTML = `<!doctype html>
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <h1>Hello, Learnify!</h1>
    <p id="msg">Edit me — preview updates live.</p>
    <button onclick="document.getElementById('msg').innerText = 'Clicked at ' + new Date().toLocaleTimeString()">
      Click me
    </button>
  </body>
</html>`;
const DEFAULT_CSS = `body { font-family: ui-sans-serif, system-ui; padding: 24px; color: #111; }
h1 { color: #4f46e5; }
button { padding: 8px 14px; border-radius: 8px; border: 1px solid #ddd; cursor: pointer; }`;
const DEFAULT_JS = `console.log("Playground ready");`;

function CodePlayground() {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [tab, setTab] = useState<"html" | "css" | "js">("html");
  const [doc, setDoc] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      setDoc(`${html}<style>${css}</style><script>${js}<\/script>`);
    }, 350);
    return () => clearTimeout(id);
  }, [html, css, js]);

  const value = tab === "html" ? html : tab === "css" ? css : js;
  const setValue = tab === "html" ? setHtml : tab === "css" ? setCss : setJs;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="rounded-lg border bg-card overflow-hidden flex flex-col">
        <div className="flex border-b bg-muted/40 text-xs">
          {(["html", "css", "js"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-3 py-2 font-mono uppercase tracking-wide",
                tab === t
                  ? "bg-background text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="font-mono text-xs min-h-[260px] rounded-none border-0 resize-none focus-visible:ring-0"
          spellCheck={false}
        />
      </div>
      <div className="rounded-lg border bg-white overflow-hidden min-h-[260px]">
        <iframe
          title="Live preview"
          sandbox="allow-scripts"
          srcDoc={doc}
          className="w-full h-full min-h-[260px]"
        />
      </div>
    </div>
  );
}

/* ---------- Final MCQ Test + Certificate ---------- */

type MCQ = { id: string; question: string; options: string[] };

function FinalTestSection({
  courseId,
  userId,
  allComplete,
}: {
  courseId: string;
  userId: string;
  allComplete: boolean;
}) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [celebratePass, setCelebratePass] = useState(false);

  const cert = useQuery({
    queryKey: ["cert", courseId, userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("certificates")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", userId)
        .maybeSingle();
      return data;
    },
  });

  const mcqs = useQuery({
    queryKey: ["mcq-count", courseId],
    queryFn: async () => {
      const { count } = await supabase
        .from("mcq_questions")
        .select("*", { count: "exact", head: true })
        .eq("course_id", courseId);
      return count ?? 0;
    },
  });

  if (cert.data) {
    return (
      <div className="mt-8 rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-emerald-500 text-white grid place-items-center shrink-0">
          <Trophy className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-lg">Course completed 🎉</h3>
          <p className="text-sm text-muted-foreground">
            Score: {cert.data.score}/{cert.data.total} · Issued{" "}
            {new Date(cert.data.issued_at).toLocaleDateString()}
          </p>
        </div>
        <Link
          to="/certificates/$code"
          params={{ code: cert.data.code }}
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
        >
          <Award className="h-4 w-4" /> View certificate
        </Link>
      </div>
    );
  }

  if (!allComplete) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        <Award className="h-6 w-6 mx-auto mb-2 opacity-50" />
        Complete all lessons to unlock the final test and claim your certificate.
      </div>
    );
  }

  if ((mcqs.data ?? 0) === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        Final test not yet available for this course.
      </div>
    );
  }

  return (
    <>
      <CelebrationOverlay
        show={celebratePass}
        title="Certificate unlocked!"
        message="Great work — your course certificate is ready."
        withSound
        durationMs={1800}
        onDone={() => setCelebratePass(false)}
      />
      <div className="mt-8 rounded-2xl border bg-gradient-to-br from-primary/10 to-fuchsia-500/10 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground grid place-items-center shrink-0">
          <Award className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-lg">Ready for your certificate?</h3>
          <p className="text-sm text-muted-foreground">
            Pass the final test ({mcqs.data} questions, ≥70%) to claim your certificate.
          </p>
        </div>
        <Button size="lg" onClick={() => setOpen(true)}>
          <Trophy className="h-4 w-4" /> Take final test
        </Button>

        {open && (
          <FinalTestDialog
            courseId={courseId}
            userId={userId}
            onClose={() => setOpen(false)}
            onPassed={() => {
              qc.invalidateQueries({ queryKey: ["cert", courseId, userId] });
              qc.invalidateQueries({ queryKey: ["my-certs"] });
              qc.invalidateQueries({ queryKey: ["my-attempts"] });
              qc.invalidateQueries({ queryKey: ["enrollments"] });
              setOpen(false);
              setCelebratePass(true);
              qc.invalidateQueries({ queryKey: ["profile-mini", userId] });
            }}
          />
        )}
      </div>
    </>
  );
}

function FinalTestDialog({
  courseId,
  userId,
  onClose,
  onPassed,
}: {
  courseId: string;
  userId: string;
  onClose: () => void;
  onPassed: () => void;
}) {
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localCelebrate, setLocalCelebrate] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; passed: boolean } | null>(
    null,
  );

  const q = useQuery({
    queryKey: ["mcqs", courseId],
    queryFn: async () => {
      // Note: 'answer' and 'explanation' are intentionally hidden by column-level grants;
      // grading happens server-side via the submit_final_test RPC.
      const { data, error } = await supabase
        .from("mcq_questions")
        .select("id, course_id, question, options, order_index")
        .eq("course_id", courseId)
        .order("order_index");
      if (error) throw error;
      return (data ?? []) as MCQ[];
    },
  });

  const questions = q.data ?? [];
  const score = result?.score ?? 0;
  const pct = result && result.total ? Math.round((result.score / result.total) * 100) : 0;
  const passed = result?.passed ?? false;

  const submit = async () => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc("submit_final_test", {
        _course_id: courseId,
        _answers: picks as any,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      const row = Array.isArray(data) ? data[0] : data;
      if (row) {
        setResult({ score: row.score, total: row.total, passed: row.passed });
        if (row.passed) {
          toast.success("Certificate issued!");
          setLocalCelebrate(true);
        }
      }
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <CelebrationOverlay
        show={localCelebrate}
        title="You passed!"
        message="Your certificate has been issued."
        withSound
        durationMs={1600}
        onDone={() => setLocalCelebrate(false)}
      />
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur flex items-start sm:items-center justify-center p-4 overflow-y-auto">
        <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-3xl my-4 sm:my-0 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold">Final Test</h2>
              <p className="text-xs text-muted-foreground">Pass ≥ 70% to claim your certificate</p>
            </div>
            <Button size="icon" variant="ghost" onClick={onClose}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-6 space-y-4">
            {q.isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            ) : (
              <>
                {submitted && (
                  <div
                    className={cn(
                      "rounded-xl p-4 text-center",
                      passed
                        ? "bg-emerald-500/10 border border-emerald-500/40"
                        : "bg-rose-500/10 border border-rose-500/40",
                    )}
                  >
                    <p className="text-2xl font-display font-bold">
                      {score} / {questions.length} · {pct}%
                    </p>
                    <p className="text-sm mt-1">
                      {passed ? "🎉 You passed!" : "Not yet — review and try again."}
                    </p>
                    {passed && (
                      <Button className="mt-3" onClick={onPassed}>
                        <Award className="h-4 w-4" /> Claim certificate
                      </Button>
                    )}
                  </div>
                )}

                {questions.map((qq, i) => (
                  <div key={qq.id} className="rounded-lg border p-4 space-y-2">
                    <div className="text-sm font-medium">
                      {i + 1}. {qq.question}
                    </div>
                    <div className="grid gap-1.5">
                      {qq.options.map((opt, idx) => {
                        const picked = picks[i] === idx;
                        return (
                          <button
                            key={idx}
                            disabled={submitted}
                            onClick={() => setPicks((p) => ({ ...p, [i]: idx }))}
                            className={cn(
                              "text-left text-sm rounded-md border px-3 py-2 flex items-center gap-2 transition",
                              !submitted && picked && "border-primary bg-primary/5",
                              submitted && picked && "border-primary/60 bg-primary/10",
                            )}
                          >
                            <span className="text-xs text-muted-foreground w-5">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            <span className="flex-1">{opt}</span>
                            {submitted && picked && <CheckIcon className="h-4 w-4 text-primary" />}
                          </button>
                        );
                      })}
                    </div>
                    {submitted && (
                      <p className="text-xs text-muted-foreground pt-1">
                        Your answer was recorded. The final result is shown above.
                      </p>
                    )}
                  </div>
                ))}

                {!submitted && questions.length > 0 && (
                  <Button
                    onClick={submit}
                    disabled={submitting || Object.keys(picks).length < questions.length}
                    className="w-full"
                    size="lg"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Submit final test
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Assignments + Submissions ---------- */

type Assignment = {
  id: string;
  title: string;
  prompt: string;
  starter_code: string | null;
  order_index: number;
};

function AssignmentsPanel({ courseId, userId }: { courseId: string; userId: string }) {
  const qc = useQueryClient();
  const [openFor, setOpenFor] = useState<Assignment | null>(null);

  const aq = useQuery({
    queryKey: ["course-assignments", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_assignments")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index");
      if (error) throw error;
      return (data ?? []) as Assignment[];
    },
  });

  const sq = useQuery({
    queryKey: ["my-submissions-for", courseId, userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("assignment_submissions")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", userId)
        .order("submitted_at", { ascending: false });
      return data ?? [];
    },
  });

  const latestByAssignment = new Map<string, any>();
  (sq.data ?? []).forEach((s: any) => {
    if (!latestByAssignment.has(s.assignment_id)) latestByAssignment.set(s.assignment_id, s);
  });

  if ((aq.data ?? []).length === 0) return null;

  return (
    <div className="mt-8 rounded-2xl border bg-card p-5 sm:p-6 shadow-card">
      <h3 className="font-display font-semibold text-lg flex items-center gap-2">
        <FileCheck2 className="h-5 w-5 text-primary" /> Practice & Projects
      </h3>
      <p className="text-sm text-muted-foreground mt-1">
        Hands-on assignments and projects for this course.
      </p>
      <div className="mt-4 space-y-3">
        {(aq.data ?? []).map((a, i) => {
          const sub = latestByAssignment.get(a.id);
          return (
            <div key={a.id} className="border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {i + 1}. {a.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap line-clamp-3">
                    {a.prompt}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                  {sub && (
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {String(sub.status).replace("_", " ")}
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant={sub ? "outline" : "default"}
                    onClick={() => setOpenFor(a)}
                  >
                    <Upload className="h-4 w-4" /> {sub ? "Resubmit" : "Submit"}
                  </Button>
                </div>
              </div>
              {sub?.feedback && (
                <div className="mt-3 rounded bg-muted/50 border p-2 text-xs">
                  <span className="font-medium">Feedback: </span>
                  {sub.feedback}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {openFor && (
        <SubmitAssignmentDialog
          assignment={openFor}
          courseId={courseId}
          userId={userId}
          onClose={() => setOpenFor(null)}
          onSaved={() => {
            setOpenFor(null);
            qc.invalidateQueries({ queryKey: ["my-submissions-for", courseId, userId] });
            qc.invalidateQueries({ queryKey: ["my-submissions"] });
          }}
        />
      )}
    </div>
  );
}

function SubmitAssignmentDialog({
  assignment,
  courseId,
  userId,
  onClose,
  onSaved,
}: {
  assignment: Assignment;
  courseId: string;
  userId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [content, setContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!content.trim() && !linkUrl.trim() && !file) {
      return toast.error("Add notes, a link, or a file");
    }
    setSaving(true);
    try {
      let attachment_url: string | null = null;
      if (file) {
        if (file.size > 20 * 1024 * 1024) throw new Error("File too large (max 20 MB)");
        const path = `${userId}/${courseId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const { error: upErr } = await supabase.storage
          .from("submissions")
          .upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        const { data: signed } = await supabase.storage
          .from("submissions")
          .createSignedUrl(path, 60 * 60 * 24 * 365);
        attachment_url = signed?.signedUrl ?? null;
      }
      const { error } = await supabase.from("assignment_submissions").insert({
        user_id: userId,
        course_id: courseId,
        assignment_id: assignment.id,
        content: content.trim() || null,
        link_url: linkUrl.trim() || null,
        attachment_url,
        status: "submitted",
      });
      if (error) throw error;
      toast.success("Submitted");
      onSaved();
    } catch (e: any) {
      toast.error(e?.message ?? "Submit failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit · {assignment.title}</DialogTitle>
          <DialogDescription>Notes, a public link, or a file (≤ 20 MB).</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="rounded-lg bg-muted/50 border p-3 text-xs whitespace-pre-wrap">
            {assignment.prompt}
          </div>
          <Textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Your notes, summary, or code…"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1">
                <ExternalLink className="h-3 w-3" /> Project link (Replit, GitHub, CodeSandbox)
              </label>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1">
                <Paperclip className="h-3 w-3" /> Attachment
              </label>
              <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}{" "}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
