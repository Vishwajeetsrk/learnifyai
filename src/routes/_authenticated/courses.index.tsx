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
import { getCleanBannerUrl } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

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
              `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(l.full_name || l.user_id)}`
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
  "Development",
  "Design",
  "Marketing",
  "AI & Data",
  "Business",
  "Personal Growth",
] as const;
type PriceFilter = "all" | "free" | "paid";

function CoursesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [price, setPrice] = useState<PriceFilter>("all");
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
      const matchQ =
        !needle ||
        c.title.toLowerCase().includes(needle) ||
        (c.description ?? "").toLowerCase().includes(needle) ||
        c.instructor.toLowerCase().includes(needle);
      return matchCat && matchPrice && matchQ;
    });
  }, [coursesQuery.data, q, cat, price]);

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

        <div className="mt-6 space-y-3">
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
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">
              Price
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by price">
              {(
                [
                  { id: "all", label: "All" },
                  { id: "free", label: "Free" },
                  { id: "paid", label: "Paid" },
                ] as { id: PriceFilter; label: string }[]
              ).map((p) => (
                <Button
                  key={p.id}
                  size="sm"
                  variant={price === p.id ? "default" : "outline"}
                  onClick={() => setPrice(p.id)}
                  className="rounded-full"
                  aria-pressed={price === p.id}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

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
            {filtered.map((c) => (
              <Link
                key={c.id}
                to="/courses/$slug"
                params={{ slug: c.slug }}
                className="group rounded-2xl border bg-card overflow-hidden shadow-card hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <div className="aspect-video w-full overflow-hidden bg-muted relative border-b border-border/50">
                  {c.cover_url ? (
                    <img
                      src={getCleanBannerUrl(c.cover_url) ?? c.cover_url}
                      alt={c.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
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
                      <img src="/illustrations/Star_Rating.svg" alt="" className="h-4 w-12 shrink-0" /> 4.8
                    </span>
                    <span className="font-semibold text-foreground ml-auto">
                      {inr(Number(c.price_inr))}
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
