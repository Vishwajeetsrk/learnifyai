import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  GraduationCap,
  Clock,
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
  ArrowRight,
  Cpu,
  Keyboard,
  Users,
  BadgeCheck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
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

type CareerPathId = (typeof CAREER_PATHS)[number]["id"];
type CareerPathFilter = Exclude<CareerPathId, "all">;

const CATEGORY_CAREER_PATHS: Record<string, CareerPathFilter[]> = {
  "Full Stack Development": ["fullstack", "frontend", "backend"],
  Python: ["data-science", "ai-ml", "backend"],
  "AI & Prompt Engineering": ["ai-ml"],
  "Data Science": ["data-science", "ai-ml"],
  "Cyber Security": ["cybersecurity"],
  "UI/UX Design": ["frontend"],
  "Academic & CS Fundamentals": ["fullstack", "frontend", "backend", "data-science", "ai-ml"],
  "Career Roadmaps": ["fullstack", "frontend", "backend", "data-science", "ai-ml", "cybersecurity", "devops", "mobile"],
};

const CAREER_PATH_KEYWORDS: Record<CareerPathFilter, { words: string[]; phrases: string[] }> = {
  frontend: {
    words: ["frontend", "react", "next.js", "nextjs", "vue", "angular", "html", "css", "javascript", "typescript", "svelte", "tailwind", "wordpress", "gatsby"],
    phrases: ["front end", "ui design", "web design", "ui/ux"],
  },
  backend: {
    words: ["backend", "node", "express", "nestjs", "graphql", "postgres", "mongodb", "sql", "database", "django", "spring", "go", "rust", "java", "php", "prisma", "supabase"],
    phrases: ["back end", "rest api"],
  },
  fullstack: {
    words: ["fullstack", "mern"],
    phrases: ["full stack", "web development", "web dev", "full stack development"],
  },
  "data-science": {
    words: ["pandas", "numpy", "tableau", "statistics"],
    phrases: ["data science", "data analysis", "data engineering", "power bi"],
  },
  "ai-ml": {
    words: ["ml", "llm", "openai", "tensorflow", "pytorch", "nlp"],
    phrases: ["machine learning", "deep learning", "prompt engineering", "artificial intelligence", "neural network", "generative ai"],
  },
  cybersecurity: {
    words: ["cybersecurity", "hacking", "cissp", "kali", "devsecops"],
    phrases: ["cyber security", "ethical hacking", "penetration testing", "network security", "security engineer"],
  },
  devops: {
    words: ["devops", "docker", "kubernetes", "k8s", "aws", "azure", "gcp", "cloud", "terraform", "jenkins", "linux", "sre"],
    phrases: ["ci/cd"],
  },
  mobile: {
    words: ["mobile", "android", "ios", "flutter", "kotlin", "swift", "expo"],
    phrases: ["react native", "app development"],
  },
};

function courseCareerPaths(c: {
  category: string;
  title: string;
  description?: string | null;
}): CareerPathFilter[] {
  const hay = `${c.category} ${c.title} ${c.description ?? ""}`.replace(/-/g, " ").toLowerCase();
  const tokens = new Set(hay.split(/[^a-z0-9.]+/).filter(Boolean));
  const fromCategory = CATEGORY_CAREER_PATHS[c.category] ?? [];
  const fromKeywords = (Object.entries(CAREER_PATH_KEYWORDS) as [CareerPathFilter, { words: string[]; phrases: string[] }][])
    .filter(([, { words, phrases }]) => words.some((w) => tokens.has(w)) || phrases.some((p) => hay.includes(p)))
    .map(([id]) => id);
  return Array.from(new Set([...fromCategory, ...fromKeywords]));
}

type PriceFilter = "all" | "free" | "paid";
type LevelFilter = "all" | "beginner" | "intermediate" | "advanced";
type SortFilter = "newest" | "popular" | "price-low" | "price-high";

function CoursesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [price, setPrice] = useState<PriceFilter>("all");
  const [level, setLevel] = useState<LevelFilter>("all");
  const [careerPath, setCareerPath] = useState<CareerPathId>("all");
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
          "id, slug, title, description, cover_url, category, level, price_inr, instructor, duration_minutes, enrollment_count, created_at",
        )
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const lessonCountsQuery = useQuery({
    queryKey: ["lesson-counts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("lessons").select("course_id");
      if (error) throw error;
      const map: Record<string, number> = {};
      (data ?? []).forEach((r: any) => {
        map[r.course_id as string] = (map[r.course_id as string] ?? 0) + 1;
      });
      return map;
    },
  });

  const lessonCount = (id: string) => lessonCountsQuery.data?.[id] ?? 0;
  const lessonTotal = useMemo(
    () => Object.values(lessonCountsQuery.data ?? {}).reduce((a, b) => a + b, 0),
    [lessonCountsQuery.data],
  );
  const learnerTotal = useMemo(
    () => (coursesQuery.data ?? []).reduce((a, c) => a + Number(c.enrollment_count ?? 0), 0),
    [coursesQuery.data],
  );
  const freeCount = useMemo(
    () => (coursesQuery.data ?? []).filter((c) => Number(c.price_inr) === 0).length,
    [coursesQuery.data],
  );

  const isNewCourse = (createdAt?: string | null) => {
    if (!createdAt) return false;
    const ageDays = (Date.now() - Date.parse(createdAt)) / 86_400_000;
    return ageDays >= 0 && ageDays < 21;
  };

  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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

  const careerCounts = useMemo(() => {
    const counts: Partial<Record<CareerPathFilter, number>> = {};
    (coursesQuery.data ?? []).forEach((c) => {
      courseCareerPaths(c).forEach((p) => {
        counts[p] = (counts[p] ?? 0) + 1;
      });
    });
    return counts;
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
      const matchLevel = level === "all" || String(c.level).toLowerCase() === level;
      const matchCareer =
        careerPath === "all" || courseCareerPaths(c).includes(careerPath as CareerPathFilter);
      const matchQ =
        !needle ||
        c.title.toLowerCase().includes(needle) ||
        (c.description ?? "").toLowerCase().includes(needle) ||
        c.instructor.toLowerCase().includes(needle);
      return matchCat && matchPrice && matchQ && matchLevel && matchCareer;
    });
  }, [coursesQuery.data, q, cat, price, level, careerPath]);

  const trending = useMemo(() => {
    return (coursesQuery.data ?? [])
      .filter((c) => c.enrollment_count > 0)
      .sort((a, b) => b.enrollment_count - a.enrollment_count)
      .slice(0, 4);
  }, [coursesQuery.data]);

  const recommended = useMemo(() => {
    const trendingIds = new Set(trending.map((c) => c.id));
    const enrolledIds = new Set(Object.keys(enrollmentsQuery.data ?? {}));
    return (coursesQuery.data ?? [])
      .filter(
        (c) =>
          String(c.level).toLowerCase() === "beginner" &&
          !trendingIds.has(c.id) &&
          !enrolledIds.has(c.id),
      )
      .slice(0, 4);
  }, [coursesQuery.data, trending, enrollmentsQuery.data]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "popular":
        return arr.sort((a, b) => b.enrollment_count - a.enrollment_count);
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
      <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-primary/10 overflow-hidden relative shadow-sm">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
          <div className="absolute -left-10 -bottom-20 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" aria-hidden="true" />
          <div className="relative p-5 sm:p-7 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-primary font-bold flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" /> Marketplace
                </div>
                <h1 className="mt-1 text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground">
                  Courses
                </h1>
                <p className="text-muted-foreground mt-1 text-xs sm:text-sm font-medium">
                  Learn from world-class instructors. Track your progress.
                </p>
              </div>
              <div className="relative w-full sm:w-84">
                <Search
                  className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <label htmlFor="course-search" className="sr-only">
                  Search courses
                </label>
                <Input
                  id="course-search"
                  ref={searchRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search courses…"
                  className="pl-9 pr-12 h-10 text-sm rounded-xl border-border/80 bg-background/70 backdrop-blur shadow-sm"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono flex items-center gap-0.5">
                  <Keyboard className="h-3 w-3" />K
                </kbd>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { icon: Layers, label: "Lessons", value: String(lessonTotal), color: "text-primary" },
                { icon: GraduationCap, label: "Courses", value: String(coursesQuery.data?.length ?? 0), color: "text-violet-500" },
                { icon: BadgeCheck, label: "Free Courses", value: String(freeCount), color: "text-emerald-500" },
                ...(learnerTotal > 0
                  ? [{ icon: Users, label: "Learners", value: learnerTotal.toLocaleString("en-IN"), color: "text-amber-500" }]
                  : [{ icon: Users, label: "Career Paths", value: String(CAREER_PATHS.length - 1), color: "text-amber-500" }]),
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border/60 bg-background/50 backdrop-blur px-3.5 py-2.5 flex items-center gap-2.5"
                >
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                  <div className="leading-tight">
                    <div className="text-sm font-extrabold text-foreground tabular-nums">{s.value}</div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured System Design Academy Banner */}
        <div className="rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/15 via-card to-background p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg hover:border-primary/60 transition-all">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground grid place-items-center shrink-0 shadow-md shadow-primary/30">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">System Design Academy</h2>
                <Badge className="bg-primary/20 text-primary border border-primary/30 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                  10 Topics
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium leading-relaxed">
                Master Netflix, Uber, WhatsApp, YouTube, Amazon, and Google Search architectures.
              </p>
            </div>
          </div>
          <Button
            asChild
            size="sm"
            className="gap-2 shrink-0 shadow-md font-bold rounded-full px-5 cursor-pointer"
          >
            <Link to="/system-design" className="inline-flex items-center gap-2">
              <span>Explore System Design</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Filter Toolbar */}
        <div className="space-y-4">
          {/* Career Path Horizontal Scrollable Bar */}
          <div className="space-y-2">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
              Career Path
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
              {CAREER_PATHS.map((p) => {
                const IconComp = p.icon;
                const active = careerPath === p.id;
                const count = p.id === "all" ? (coursesQuery.data?.length ?? 0) : (careerCounts[p.id as CareerPathFilter] ?? 0);
                const zero = p.id !== "all" && count === 0;
                return (
                  <button
                    key={p.id}
                    onClick={() => setCareerPath(p.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 inline-flex items-center gap-1.5 cursor-pointer shadow-xs",
                      active
                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                        : zero
                          ? "border-border/50 bg-card/60 text-muted-foreground/40 hover:border-primary/30 hover:text-foreground/70"
                          : "border-border/80 bg-card text-foreground/80 hover:border-primary/40 hover:text-foreground",
                    )}
                    aria-pressed={active}
                    title={zero ? "No courses in this path yet" : undefined}
                  >
                    <IconComp className="h-3.5 w-3.5" />
                    <span>{p.label}</span>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none",
                        active
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : zero
                            ? "bg-muted/60 text-muted-foreground/50"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories Pill Row */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                Categories
              </div>
              <span className="text-[10px] text-muted-foreground/70 font-medium">
                {categories.length} categories
              </span>
            </div>
            <div
              className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth"
              role="group"
              aria-label="Filter by category"
            >
              {categories.map((c) => {
                const count = (coursesQuery.data ?? []).filter((x) => x.category === c).length;
                return (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 inline-flex items-center gap-1.5 cursor-pointer shadow-xs",
                      cat === c
                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                        : "border-border/80 bg-card text-foreground/80 hover:border-primary/40 hover:text-foreground",
                    )}
                    aria-pressed={cat === c}
                  >
                    {c}
                    {c !== "All" && (
                      <span
                        className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none",
                          cat === c
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/60">
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                  Level
                </span>
                <div className="flex gap-1.5" role="group" aria-label="Filter by level">
                  {(["all", "beginner", "intermediate", "advanced"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[11px] font-bold border capitalize transition cursor-pointer",
                        level === l
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "border-border/80 bg-card text-muted-foreground hover:text-foreground",
                      )}
                      aria-pressed={level === l}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
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
                        "px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer",
                        price === p.id
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "border-border/80 bg-card text-muted-foreground hover:text-foreground",
                      )}
                      aria-pressed={price === p.id}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                Sort
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortFilter)}
                className="h-8 px-3 rounded-xl text-xs font-bold border border-border/80 bg-card text-foreground cursor-pointer shadow-xs"
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
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                <h2 className="text-base font-bold text-foreground">Recommended for You</h2>
                <span className="text-xs text-muted-foreground font-medium">
                  Beginner-friendly picks
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
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
              No courses match your search
            </p>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              Try a different keyword or category.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">
                All Courses
                <span className="ml-2 text-xs font-semibold text-muted-foreground">
                  {sorted.length} of {filtered.length}
                  {q ? ` for "${q}"` : ""}
                </span>
              </h2>
              <button
                onClick={() => {
                  setQ("");
                  setCat("All");
                  setPrice("all");
                  setLevel("all");
                  setCareerPath("all");
                  setSort("newest");
                }}
                className={cn(
                  "text-[11px] font-bold px-3 py-1.5 rounded-full border transition cursor-pointer",
                  q || cat !== "All" || price !== "all" || level !== "all" || careerPath !== "all"
                    ? "border-primary/40 text-primary bg-primary/5 hover:bg-primary/10"
                    : "border-border/60 text-muted-foreground/50 pointer-events-none opacity-50",
                )}
              >
                Reset filters
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {sorted.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3), ease: "easeOut" }}
              >
                <Link
                  to="/courses/$slug"
                  params={{ slug: c.slug }}
                  className="group rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full"
                >
                <div>
                  <div className="aspect-video w-full overflow-hidden bg-muted relative border-b border-border/50">
                    {c.cover_url ? (
                      <SafeImage
                        src={getCleanBannerUrl(c.cover_url) ?? c.cover_url}
                        alt={c.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/15 to-violet-500/15 flex items-center justify-center text-primary/40">
                        <GraduationCap className="h-10 w-10" />
                      </div>
                    )}
                    {isNewCourse(c.created_at) && (
                      <span className="absolute top-2.5 left-2.5 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-md">
                        New
                      </span>
                    )}
                    {Number(c.price_inr) === 0 && (
                      <span className="absolute top-2.5 right-2.5 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-background/90 backdrop-blur border border-border/60 text-emerald-600 dark:text-emerald-400 shadow-sm">
                        Free
                      </span>
                    )}
                  </div>
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
                    <span className="flex items-center gap-1 text-foreground/80">
                      <Clock className="h-3.5 w-3.5 text-primary" /> {c.duration_minutes} min
                    </span>
                    <span className="flex items-center gap-1 text-foreground/80">
                      <Layers className="h-3.5 w-3.5 text-violet-500" />
                      {lessonCount(c.id) > 0 ? `${lessonCount(c.id)} lessons` : "Live course"}
                    </span>
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
                  {c.instructor && (
                    <div className="flex items-center gap-2 pt-0.5">
                      <img
                        src={`https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(c.instructor)}`}
                        alt=""
                        className="h-5 w-5 rounded-full ring-1 ring-border bg-muted object-cover"
                      />
                      <span className="text-[11px] font-semibold text-muted-foreground truncate">
                        {c.instructor}
                      </span>
                    </div>
                  )}

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
              </motion.div>
            ))}
            </div>
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        to="/courses/$slug"
        params={{ slug: course.slug }}
        className="group rounded-xl border border-border/80 bg-card overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between h-full"
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
    </motion.div>
  );
}
