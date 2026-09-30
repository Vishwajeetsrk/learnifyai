import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  GraduationCap,
  Clock,
  Star,
  Search,
  Loader2,
  ShoppingCart,
  Check,
  Sparkles,
  TrendingUp,
  Flame,
  Layers,
  ArrowRight,
  Cpu,
  BookOpen,
  Award,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getRealHumanAvatar } from "@/lib/real-avatars";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { enrollFree, getMarketplaceStats } from "@/lib/course.functions";
import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import { getCourseLearners } from "@/lib/gamification.functions";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  CANONICAL_CAREER_PATHS,
  getCourseCareerPaths,
  getCareerPathCounts,
} from "@/lib/course-taxonomy";
import { CourseCardVisual } from "@/components/courses/CourseCardVisual";
import { formatCourseDuration } from "@/lib/brand-registry";

export const Route = createFileRoute("/_authenticated/courses/")({
  head: () => ({
    meta: [
      { title: "Courses & Masteries — Learnify AI" },
      {
        name: "description",
        content:
          "Explore hands-on software masteries and interactive courses in React, Python, System Design, AI, and Cloud on Learnify AI.",
      },
      { property: "og:title", content: "Courses & Masteries — Learnify AI" },
      {
        property: "og:description",
        content:
          "Explore hands-on software masteries and interactive courses on Learnify AI.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.learnifyai.in/courses" }],
  }),
  component: CoursesPage,
});

const inr = (n: number) =>
  n === 0
    ? "Free"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(n);

function CourseCardLearners({ courseId }: { courseId: string }) {
  const getLearners = useServerFn(getCourseLearners);
  const { data } = useQuery({
    queryKey: ["course-learners", courseId],
    queryFn: () => getLearners({ data: { courseId, limit: 3 } }),
  });

  if (!data || data.total === 0) return null;

  return (
    <div className="mt-3 flex items-center gap-1.5">
      <div className="flex -space-x-1.5 overflow-hidden">
        {data.learners.map((l, i) => (
          <img
            key={l.user_id ?? i}
            className="inline-block h-5 w-5 rounded-full ring-2 ring-card bg-muted object-cover"
            src={
              l.avatar_url ||
              getRealHumanAvatar(l.full_name || l.user_id)
            }
            alt=""
          />
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground font-medium">
        +{data.total} learner{data.total > 1 ? "s" : ""}
      </span>
    </div>
  );
}

type PriceFilter = "all" | "free" | "paid";
type LevelFilter = "all" | "beginner" | "intermediate" | "advanced";
type SortFilter = "newest" | "popular" | "price-low" | "price-high";

function CoursesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [price, setPrice] = useState<PriceFilter>("all");
  const [level, setLevel] = useState<LevelFilter>("all");
  const [careerPath, setCareerPath] = useState("all");
  const [sort, setSort] = useState<SortFilter>("newest");
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const enrollFreeFn = useServerFn(enrollFree);
  const getStatsFn = useServerFn(getMarketplaceStats);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [celebrationSlug, setCelebrationSlug] = useState<string | null>(null);

  // Database-backed marketplace statistics
  const statsQuery = useQuery({
    queryKey: ["marketplace-stats"],
    queryFn: () => getStatsFn(),
  });

  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(
          "id, slug, title, description, cover_url, category, level, price_inr, instructor, duration_minutes",
        )
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const enrollmentsQuery = useQuery({
    queryKey: ["enrollments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      const map: Record<string, boolean> = {};
      (data ?? []).forEach((r: any) => {
        map[r.course_id as string] = true;
      });
      return map;
    },
  });

  const cartQuery = useQuery({
    queryKey: ["cart-items", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cart_items")
        .select("course_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      const map: Record<string, boolean> = {};
      (data ?? []).forEach((r: any) => {
        map[r.course_id as string] = true;
      });
      return map;
    },
  });

  const handleCardAction = async (e: React.MouseEvent, c: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return navigate({ to: "/login" as any });
    if (enrollmentsQuery.data?.[c.id])
      return navigate({ to: "/courses/$slug", params: { slug: c.slug } });
    if (cartQuery.data?.[c.id]) return navigate({ to: "/cart" });
    setBusyId(c.id);
    try {
      if (Number(c.price_inr) === 0) {
        await enrollFreeFn({ data: { courseId: c.id } });
        toast.success("Enrolled — let's start learning!");
        qc.invalidateQueries({ queryKey: ["enrollments"] });
        qc.invalidateQueries({ queryKey: ["my-certs"] });
        qc.invalidateQueries({ queryKey: ["my-attempts"] });
        qc.invalidateQueries({ queryKey: ["marketplace-stats"] });
        setCelebrationSlug(c.slug);
        return;
      } else {
        const { error } = await supabase
          .from("cart_items")
          .insert({ user_id: user.id, course_id: c.id });
        if (error) throw error;
        toast.success("Added to cart — redirecting to checkout…");
        qc.invalidateQueries({ queryKey: ["cart-items"] });
        qc.invalidateQueries({ queryKey: ["cart-count"] });
        qc.invalidateQueries({ queryKey: ["cart"] });
        qc.invalidateQueries({ queryKey: ["cart-item"] });
        navigate({ to: "/cart" });
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setBusyId(null);
    }
  };

  // Derive categories dynamically from canonical course records
  const { categories, categoryCounts } = useMemo(() => {
    const counts: Record<string, number> = { All: coursesQuery.data?.length ?? 0 };
    const set = new Set<string>();

    (coursesQuery.data ?? []).forEach((c) => {
      if (c.category) {
        set.add(c.category);
        counts[c.category] = (counts[c.category] || 0) + 1;
      }
    });

    return {
      categories: ["All", ...Array.from(set).sort()],
      categoryCounts: counts,
    };
  }, [coursesQuery.data]);

  // Derive non-zero career path counts
  const careerPathCounts = useMemo(() => {
    return getCareerPathCounts(coursesQuery.data ?? []);
  }, [coursesQuery.data]);

  // Filter courses with taxonomy synchronization
  const filtered = useMemo(() => {
    const data = coursesQuery.data ?? [];
    const needle = q.trim().toLowerCase();
    return data.filter((c) => {
      const matchCat = cat === "All" || c.category === cat;
      const matchPrice =
        price === "all" ||
        (price === "free" && Number(c.price_inr) === 0) ||
        (price === "paid" && Number(c.price_inr) > 0);
      const matchLevel = level === "all" || c.level === level;
      const matchCareer =
        careerPath === "all" || getCourseCareerPaths(c).includes(careerPath);
      const matchQ =
        !needle ||
        c.title.toLowerCase().includes(needle) ||
        (c.description ?? "").toLowerCase().includes(needle) ||
        c.instructor.toLowerCase().includes(needle);
      return matchCat && matchPrice && matchQ && matchLevel && matchCareer;
    });
  }, [coursesQuery.data, q, cat, price, level, careerPath]);

  const trending = useMemo(() => {
    return (coursesQuery.data ?? []).filter((c) => (c as any).enrollment_count > 5).slice(0, 4);
  }, [coursesQuery.data]);

  const recommended = useMemo(() => {
    return (coursesQuery.data ?? []).filter((c) => c.level === "beginner").slice(0, 4);
  }, [coursesQuery.data]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "popular":
        return arr.sort(
          (a, b) => ((b as any).enrollment_count ?? 0) - ((a as any).enrollment_count ?? 0),
        );
      case "price-low":
        return arr.sort((a, b) => Number(a.price_inr) - Number(b.price_inr));
      case "price-high":
        return arr.sort((a, b) => Number(b.price_inr) - Number(a.price_inr));
      default:
        return arr;
    }
  }, [filtered, sort]);

  const stats = statsQuery.data ?? {
    totalCourses: coursesQuery.data?.length ?? 0,
    totalLessons: 0,
    totalFreeCourses: (coursesQuery.data ?? []).filter((c) => Number(c.price_inr) === 0).length,
    totalLearners: 0,
  };
  const isStatsLoading = statsQuery.isLoading && !statsQuery.data;

  return (
    <AppShell>
      <CelebrationOverlay
        show={!!celebrationSlug}
        title="You’re enrolled!"
        message="Opening your first lesson now…"
        withSound
        durationMs={1500}
        onDone={() =>
          celebrationSlug && navigate({ to: "/courses/$slug", params: { slug: celebrationSlug } })
        }
      />
      <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12 max-w-7xl mx-auto space-y-10">
        {/* Apple Pro Hero & Search Stage */}
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 bg-neutral-950 border border-white/10 shadow-2xl text-white">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-gradient-to-b from-blue-500/10 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-widest bg-white/10 text-neutral-300 border border-white/10">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Learnify Masteries · Designed for Engineers
              </div>
              <h1 className="text-3xl sm:text-5xl font-display font-semibold tracking-tight text-neutral-100">
                Master Modern Engineering.
              </h1>
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
                Production-grade curricula in Full-Stack, System Design, AI Agents, and Cloud Architecture. Learn by building real systems.
              </p>
            </div>

            {/* Apple-style Spotlight Search */}
            <div className="relative w-full lg:w-96 shrink-0">
              <Search
                className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                aria-hidden="true"
              />
              <label htmlFor="course-search" className="sr-only">
                Search courses
              </label>
              <Input
                id="course-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search masteries, tools, frameworks…"
                className="pl-10 pr-12 h-12 text-sm rounded-2xl border-white/15 bg-white/5 backdrop-blur-2xl text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-white/30 shadow-inner"
              />
              <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] bg-white/10 border border-white/10 px-2 py-0.5 rounded-md text-neutral-300 font-mono">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Apple Pro Metrics Bar */}
          <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-1">
              <div className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                {isStatsLoading ? <Skeleton className="h-7 w-12 rounded bg-white/10" /> : stats.totalCourses}
              </div>
              <div className="text-xs text-neutral-400 font-medium">Curated Masteries</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-1">
              <div className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                {isStatsLoading ? <Skeleton className="h-7 w-12 rounded bg-white/10" /> : stats.totalLessons}
              </div>
              <div className="text-xs text-neutral-400 font-medium">Interactive Lessons</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-1">
              <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-400 tracking-tight">
                {isStatsLoading ? <Skeleton className="h-7 w-12 rounded bg-white/10" /> : stats.totalFreeCourses}
              </div>
              <div className="text-xs text-neutral-400 font-medium">Free Access Tracks</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-1">
              <div className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                {isStatsLoading ? <Skeleton className="h-7 w-12 rounded bg-white/10" /> : stats.totalLearners.toLocaleString()}
              </div>
              <div className="text-xs text-neutral-400 font-medium">Active Engineers</div>
            </div>
          </div>
        </div>

        {/* Featured System Design Academy Banner */}
        <div className="rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl hover:border-white/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white text-black grid place-items-center shrink-0 shadow-lg shadow-white/10 font-bold">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">System Design Academy</h2>
                <Badge className="bg-primary/10 text-primary border border-primary/20 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                  10 Architectural Blueprints
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-normal leading-relaxed">
                Deconstruct Netflix, Uber, WhatsApp, YouTube, and Google Search high-scale architectures.
              </p>
            </div>
          </div>
          <Button
            asChild
            size="sm"
            className="gap-2 shrink-0 font-semibold rounded-full px-5 cursor-pointer bg-foreground text-background hover:bg-foreground/90 shadow-md"
          >
            <Link to="/system-design" className="inline-flex items-center gap-2">
              <span>Explore Blueprints</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Simplified & Clean Filter Toolbar */}
        <div className="space-y-3.5 bg-card/60 border border-border/80 rounded-2xl p-4 shadow-xs">
          {/* Top Curated Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
            {CANONICAL_CAREER_PATHS.slice(0, 8).map((p) => {
              const IconComp = p.icon;
              const active = careerPath === p.id;
              const pathCount = careerPathCounts[p.id] ?? 0;
              return (
                <button
                  key={p.id}
                  onClick={() => setCareerPath(p.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 inline-flex items-center gap-1.5 cursor-pointer",
                    active
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  aria-pressed={active}
                >
                  <IconComp className="h-3.5 w-3.5" />
                  <span>{p.label}</span>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-md font-mono font-medium",
                      active ? "bg-white/20 text-white" : "bg-background/80 text-muted-foreground",
                    )}
                  >
                    {pathCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Price Filter Toggle */}
              <div className="inline-flex items-center bg-muted/60 p-1 rounded-xl border border-border/60 text-xs">
                {(
                  [
                    { id: "all", label: "All Pricing" },
                    { id: "free", label: "Free" },
                    { id: "paid", label: "Pro" },
                  ] as { id: PriceFilter; label: string }[]
                ).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPrice(p.id)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer",
                      price === p.id
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Level Dropdown */}
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="h-8 px-3 rounded-xl text-xs font-semibold border border-border/80 bg-background text-foreground cursor-pointer shadow-xs"
                aria-label="Filter by level"
              >
                <option value="all">All Difficulty Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              {(careerPath !== "all" || price !== "all" || level !== "all" || q) && (
                <button
                  onClick={() => {
                    setCareerPath("all");
                    setCat("All");
                    setPrice("all");
                    setLevel("all");
                    setQ("");
                  }}
                  className="text-xs text-muted-foreground hover:text-primary underline cursor-pointer ml-1"
                >
                  Reset filters
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortFilter)}
                className="h-8 px-3 rounded-xl text-xs font-semibold border border-border/80 bg-background text-foreground cursor-pointer shadow-xs"
                aria-label="Sort courses"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Trending rail */}
        {trending.length > 0 &&
          !q &&
          cat === "All" &&
          price === "all" &&
          level === "all" &&
          careerPath === "all" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-primary" />
                <h2 className="text-base font-bold text-foreground">Trending Now</h2>
                <Badge
                  variant="outline"
                  className="text-[10px] bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 font-bold"
                >
                  <Flame className="h-3 w-3 mr-0.5 fill-rose-500" /> Hot
                </Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {trending.map((c) => (
                  <MiniCourseCard
                    key={c.id}
                    course={c}
                    enrollments={enrollmentsQuery.data}
                  />
                ))}
              </div>
            </div>
          )}

        {/* Recommended rail */}
        {recommended.length > 0 &&
          !q &&
          cat === "All" &&
          price === "all" &&
          level === "all" &&
          careerPath === "all" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                <h2 className="text-base font-bold text-foreground">Recommended for You</h2>
                <span className="text-xs text-muted-foreground font-medium">
                  Beginner-friendly foundational picks
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {recommended.map((c) => (
                  <MiniCourseCard
                    key={c.id}
                    course={c}
                    enrollments={enrollmentsQuery.data}
                  />
                ))}
              </div>
            </div>
          )}

        {coursesQuery.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm p-4 space-y-4"
              >
                <Skeleton className="aspect-video w-full rounded-xl" />
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-16 rounded-full" />
                    <Skeleton className="h-4 w-12 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-[90%]" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
                <Skeleton className="h-9 w-full rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-border/80 bg-card p-12 grid place-items-center text-center shadow-sm">
            <GraduationCap className="h-12 w-12 text-primary mb-3" />
            <p className="font-display text-lg font-bold text-foreground">
              No courses match your filter
            </p>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              Try selecting "All Paths" or clearing your search keywords.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQ("");
                setCat("All");
                setCareerPath("all");
                setPrice("all");
                setLevel("all");
              }}
              className="mt-4 rounded-xl"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {sorted.map((c) => (
              <Link
                key={c.id}
                to="/courses/$slug"
                params={{ slug: c.slug }}
                className="group rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Canonical Brand Asset Visual Container */}
                  <CourseCardVisual course={c} />

                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20"
                      >
                        {c.category}
                      </Badge>
                      <span className="text-muted-foreground text-xs">·</span>
                      <span className="text-xs font-semibold text-muted-foreground capitalize">
                        {c.level}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {c.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2 font-medium leading-relaxed">
                        {c.description}
                      </p>
                    </div>
                    <CourseCardLearners courseId={c.id} />
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-border/40 mt-3 space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold pt-3">
                    {(() => {
                      const durInfo = formatCourseDuration(c.duration_minutes);
                      const lessonCount = statsQuery.data?.courseLessonCounts?.[c.id] ?? 0;
                      return (
                        <>
                          <span className="flex items-center gap-1 text-foreground/80 font-medium">
                            <Clock className="h-3.5 w-3.5 text-primary shrink-0" /> {durInfo.totalDuration}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground font-medium">
                            <BookOpen className="h-3.5 w-3.5 text-primary/70 shrink-0" />{" "}
                            {lessonCount > 0 ? `${lessonCount} lessons` : "Self-paced"}
                          </span>
                        </>
                      );
                    })()}
                    <span
                      className={cn(
                        "font-extrabold text-sm ml-auto",
                        Number(c.price_inr) === 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-foreground",
                      )}
                    >
                      {enrollmentsQuery.data?.[c.id] ? "Purchased" : inr(Number(c.price_inr))}
                    </span>
                  </div>

                  {(() => {
                    const enrolled = enrollmentsQuery.data?.[c.id];
                    const inCart = cartQuery.data?.[c.id];
                    const isFree = Number(c.price_inr) === 0;
                    const busy = busyId === c.id;
                    const label = enrolled
                      ? "Continue Learning"
                      : inCart
                        ? "View in Cart"
                        : isFree
                          ? "Enroll Free"
                          : "Add to Cart";
                    const Icon = enrolled ? Check : isFree ? Sparkles : ShoppingCart;
                    return (
                      <Button
                        size="sm"
                        variant={enrolled ? "secondary" : "default"}
                        className="w-full font-bold cursor-pointer rounded-xl shadow-xs"
                        disabled={busy}
                        onClick={(e) => handleCardAction(e, c)}
                      >
                        {busy ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                        {label}
                      </Button>
                    );
                  })()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function MiniCourseCard({
  course,
  enrollments,
}: {
  course: any;
  enrollments?: Record<string, boolean>;
}) {
  return (
    <Link
      to="/courses/$slug"
      params={{ slug: course.slug }}
      className="group rounded-xl border border-border/80 bg-card overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
    >
      <CourseCardVisual course={course} />
      <div className="p-3 space-y-1.5">
        <p className="text-[10px] font-bold text-primary uppercase tracking-wider truncate">
          {course.category}
        </p>
        <h3 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <div className="flex items-center justify-between pt-1 text-[11px] font-semibold">
          <span className="text-muted-foreground capitalize">{course.level}</span>
          <span
            className={cn(
              "font-extrabold",
              Number(course.price_inr) === 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-foreground",
            )}
          >
            {enrollments?.[course.id] ? "Purchased" : inr(Number(course.price_inr))}
          </span>
        </div>
      </div>
    </Link>
  );
}
