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
  Target,
  Globe,
  Cog,
  RefreshCw,
  BarChart3,
  Bot,
  ShieldCheck,
  Zap,
  Smartphone,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { enrollFree } from "@/lib/course.functions";
import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import { getCourseLearners } from "@/lib/gamification.functions";
import { SafeImage } from "@/components/ui/SafeImage";
import { getCleanBannerUrl } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/courses/")({
  head: () => ({ meta: [{ title: "Courses — Learnify AI" }] }),
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
              `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(l.full_name || l.user_id)}`
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

const FIXED_CATEGORIES = [
  "All",
  "Full Stack Development",
  "Python",
  "AI & Prompt Engineering",
  "Data Science",
  "Cyber Security",
  "UI/UX Design",
  "Resume Builder",
  "Interview Preparation",
  "Career Roadmaps",
  "Digital Marketing",
  "Freelancing",
  "Personal Branding",
  "Academic & CS Fundamentals",
  "Business & Startups",
  "Finance & Investing",
] as const;

const CAREER_PATHS = [
  { id: "all", label: "All Paths", icon: Target },
  { id: "frontend", label: "Frontend Developer", icon: Globe },
  { id: "backend", label: "Backend Developer", icon: Cog },
  { id: "fullstack", label: "Full Stack", icon: RefreshCw },
  { id: "data-science", label: "Data Scientist", icon: BarChart3 },
  { id: "ai-ml", label: "AI/ML Engineer", icon: Bot },
  { id: "cybersecurity", label: "Security Engineer", icon: ShieldCheck },
  { id: "devops", label: "DevOps/SRE", icon: Zap },
  { id: "mobile", label: "Mobile Developer", icon: Smartphone },
] as const;

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
  const [busyId, setBusyId] = useState<string | null>(null);
  const [celebrationSlug, setCelebrationSlug] = useState<string | null>(null);

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

  const categories = useMemo(() => {
    const set = new Set<string>(FIXED_CATEGORIES);
    (coursesQuery.data ?? []).forEach((c) => set.add(c.category));
    return Array.from(set);
  }, [coursesQuery.data]);

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
      const matchCareer = careerPath === "all" || (c as any).career_path?.includes(careerPath);
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
      <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-medium">
              Marketplace
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-display font-semibold tracking-tight">
              Courses
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Learn from world-class instructors. Track your progress.
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search
              className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <label htmlFor="course-search" className="sr-only">
              Search courses
            </label>
            <Input
              id="course-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search courses…"
              className="pl-9"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {/* Top filters row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium shrink-0">
              Career Path
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CAREER_PATHS.map((p) => {
                const IconComp = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => setCareerPath(p.id)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-medium border transition inline-flex items-center gap-1.5",
                      careerPath === p.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-foreground/30",
                    )}
                    aria-pressed={careerPath === p.id}
                  >
                    <IconComp className="h-3 w-3" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">
              Categories
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {categories.map((c) => (
                <Button
                  key={c}
                  size="sm"
                  variant={cat === c ? "default" : "outline"}
                  onClick={() => setCat(c)}
                  className="rounded-full"
                  aria-pressed={cat === c}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Level
              </span>
              <div className="flex gap-1.5" role="group" aria-label="Filter by level">
                {(["all", "beginner", "intermediate", "advanced"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-medium border capitalize transition",
                      level === l
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-foreground/30",
                    )}
                    aria-pressed={level === l}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Price
              </span>
              <div className="flex gap-1.5" role="group" aria-label="Filter by price">
                {(
                  [
                    { id: "all", label: "All" },
                    { id: "free", label: "Free" },
                    { id: "paid", label: "Paid" },
                  ] as { id: PriceFilter; label: string }[]
                ).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPrice(p.id)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-medium border transition",
                      price === p.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-foreground/30",
                    )}
                    aria-pressed={price === p.id}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Sort
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortFilter)}
                className="h-7 px-2 rounded-lg text-[10px] border border-border bg-background text-muted-foreground"
                aria-label="Sort courses"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low–High</option>
                <option value="price-high">Price: High–Low</option>
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
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold">Trending Now</h2>
                <Badge
                  variant="outline"
                  className="text-[10px] bg-red-500/10 text-red-500 border-red-500/30"
                >
                  <Flame className="h-3 w-3 mr-0.5" /> Hot
                </Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {trending.map((c) => (
                  <MiniCourseCard
                    key={c.id}
                    course={c}
                    enrollments={enrollmentsQuery.data}
                    cart={cartQuery.data}
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
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <h2 className="text-sm font-semibold">Recommended for You</h2>
                <span className="text-[10px] text-muted-foreground">Beginner-friendly picks</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {recommended.map((c) => (
                  <MiniCourseCard
                    key={c.id}
                    course={c}
                    enrollments={enrollmentsQuery.data}
                    cart={cartQuery.data}
                  />
                ))}
              </div>
            </div>
          )}

        {coursesQuery.isLoading ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="rounded-2xl border bg-card overflow-hidden shadow-card p-4 space-y-4"
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
                <Skeleton className="h-9 w-full rounded-lg mt-4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border bg-card p-12 grid place-items-center text-center shadow-card">
            <GraduationCap className="h-10 w-10 text-primary mb-3" />
            <p className="font-display text-lg font-semibold">No courses match your search</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try a different keyword or category.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {sorted.map((c) => (
              <Link
                key={c.id}
                to="/courses/$slug"
                params={{ slug: c.slug }}
                className="group rounded-2xl border bg-card overflow-hidden shadow-card hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <div className="aspect-video w-full overflow-hidden bg-muted relative border-b border-border/50">
                  {c.cover_url ? (
                    <SafeImage
                      src={getCleanBannerUrl(c.cover_url) ?? c.cover_url}
                      alt={c.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-violet-500/10 flex items-center justify-center text-primary/30">
                      <GraduationCap className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                    <Badge variant="secondary" className="text-[10px]">
                      {c.category}
                    </Badge>
                    <span>·</span>
                    <span>{c.level}</span>
                  </div>
                  <h3 className="mt-2 font-display font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                  <CourseCardLearners courseId={c.id} />
                  <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 shrink-0" /> {c.duration_minutes} min
                    </span>
                    <span className="flex items-center gap-1">
                      <img
                        src="/illustrations/Star_Rating_interaction.svg"
                        loading="lazy"
                        alt=""
                        className="h-4 w-12 shrink-0"
                      />{" "}
                      4.8
                    </span>
                    <span className="font-semibold text-foreground ml-auto">
                      {enrollmentsQuery.data?.[c.id]
                        ? "Purchased"
                        : inr(Number(c.price_inr))}
                    </span>
                  </div>
                  {(() => {
                    const enrolled = enrollmentsQuery.data?.[c.id];
                    const inCart = cartQuery.data?.[c.id];
                    const isFree = Number(c.price_inr) === 0;
                    const busy = busyId === c.id;
                    const label = enrolled
                      ? "Continue"
                      : inCart
                        ? "View cart"
                        : isFree
                          ? "Enroll free"
                          : "Add to cart";
                    const Icon = enrolled ? Check : isFree ? Sparkles : ShoppingCart;
                    return (
                      <Button
                        size="sm"
                        variant={enrolled ? "secondary" : "default"}
                        className="mt-4 w-full"
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
  cart,
}: {
  course: any;
  enrollments?: Record<string, boolean>;
  cart?: Record<string, boolean>;
}) {
  return (
    <Link
      to="/courses/$slug"
      params={{ slug: course.slug }}
      className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5"
    >
      <div className="aspect-video w-full overflow-hidden bg-muted relative">
        {course.cover_url ? (
          <SafeImage
            src={getCleanBannerUrl(course.cover_url) ?? course.cover_url}
            alt={course.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-violet-500/10 flex items-center justify-center text-primary/30">
            <GraduationCap className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">
          {course.category}
        </p>
        <h3 className="text-xs font-semibold mt-0.5 truncate group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-muted-foreground">{course.level}</span>
          <span className="text-[10px] font-semibold">
            {enrollments?.[course.id] ? "Purchased" : inr(Number(course.price_inr))}
          </span>
        </div>
      </div>
    </Link>
  );
}
