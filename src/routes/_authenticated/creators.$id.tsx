import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Bell,
  BellOff,
  GraduationCap,
  Loader2,
  ArrowLeft,
  Users,
  Heart,
  Eye,
  BookOpen,
  TrendingUp,
  ExternalLink,
  Globe,
  Verified,
  BarChart3,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { getCreatorAnalytics } from "@/lib/profile.functions";

export const Route = createFileRoute("/_authenticated/creators/$id")({
  head: () => ({ meta: [{ title: "Creator — Learnify AI" }] }),
  component: CreatorProfile,
});

const inr = (n: number) =>
  n === 0
    ? "Free"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(n);

function CreatorProfile() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const profileQuery = useQuery({
    queryKey: ["creator-profile", id],
    queryFn: async () => {
      const [{ data: profile }, { data: courses, error: cErr }, { count: subs }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("id, full_name, avatar_url, banner_url, bio, social_links")
            .eq("id", id)
            .maybeSingle(),
          supabase
            .from("courses")
            .select(
              "id, slug, title, description, cover_url, category, level, price_inr, duration_minutes",
            )
            .eq("created_by", id)
            .eq("published", true)
            .order("created_at", { ascending: false }),
          supabase
            .from("creator_subscriptions")
            .select("*", { count: "exact", head: true })
            .eq("creator_id", id),
        ]);
      if (cErr) throw cErr;
      return { profile, courses: courses ?? [], subscribers: subs ?? 0 };
    },
  });

  const subQuery = useQuery({
    enabled: !!user && user.id !== id,
    queryKey: ["my-sub", id, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("creator_subscriptions")
        .select("id")
        .eq("subscriber_id", user!.id)
        .eq("creator_id", id)
        .maybeSingle();
      return !!data;
    },
  });

  const toggleSub = async () => {
    if (!user) return navigate({ to: "/login" });
    if (user.id === id) return;
    if (subQuery.data) {
      await supabase
        .from("creator_subscriptions")
        .delete()
        .eq("subscriber_id", user.id)
        .eq("creator_id", id);
      toast.success("Unsubscribed");
    } else {
      const { error } = await supabase
        .from("creator_subscriptions")
        .insert({ subscriber_id: user.id, creator_id: id });
      if (error) return toast.error(error.message);
      toast.success("Subscribed!");
    }
    qc.invalidateQueries({ queryKey: ["my-sub", id, user.id] });
    qc.invalidateQueries({ queryKey: ["creator-profile", id] });
  };

  if (profileQuery.isLoading) {
    return (
      <AppShell>
        <div className="py-24 grid place-items-center">
          <div className="relative">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          </div>
        </div>
      </AppShell>
    );
  }

  const p = profileQuery.data;
  const name = p?.profile?.full_name ?? "Creator";
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const subscribed = !!subQuery.data;
  const isSelf = user?.id === id;

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-6xl">
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />{" "}
          Back to courses
        </Link>

        {/* Enhanced Channel Header */}
        <div className="rounded-3xl border bg-card overflow-hidden shadow-lg relative">
          <div className="h-48 md:h-64 w-full relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500">
            {p?.profile?.banner_url && p?.profile?.show_banner !== false ? (
              <>
                <img
                  src={p.profile.banner_url}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_50%)]" />
                <div className="flex items-center justify-center h-full">
                  <span className="text-white/30 font-display font-medium tracking-widest text-lg uppercase">
                    Creator
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 pb-6 sm:px-8 sm:pb-8 flex flex-col sm:flex-row items-start gap-5 relative">
            <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-card rounded-full -mt-14 sm:-mt-16 shadow-xl bg-card shrink-0 ring-2 ring-primary/20">
              {p?.profile?.avatar_url && <AvatarImage src={p.profile.avatar_url} alt="" />}
              <AvatarFallback className="text-3xl sm:text-4xl font-display font-bold bg-gradient-to-br from-primary to-primary/60 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0 pt-1 sm:pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                      {name}
                    </h1>
                    {isSelf && <Verified className="h-5 w-5 text-primary shrink-0" />}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">
                        {p?.subscribers ?? 0}
                      </span>{" "}
                      subscribers
                    </span>
                    <span className="text-muted-foreground/40">|</span>
                    <span>
                      <span className="font-medium text-foreground">{p?.courses.length ?? 0}</span>{" "}
                      courses
                    </span>
                  </div>
                </div>

                {!isSelf && (
                  <Button
                    onClick={toggleSub}
                    variant={subscribed ? "outline" : "default"}
                    size="lg"
                    className="rounded-full shadow-sm gap-2 w-full sm:w-auto"
                  >
                    {subscribed ? (
                      <>
                        <BellOff className="h-4 w-4" /> Subscribed
                      </>
                    ) : (
                      <>
                        <Bell className="h-4 w-4" /> Subscribe
                      </>
                    )}
                  </Button>
                )}
              </div>

              {p?.profile?.bio && (
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-3xl">
                  {p.profile.bio}
                </p>
              )}

              {p?.profile?.social_links && typeof p.profile.social_links === "object" && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {Object.entries(p.profile.social_links as Record<string, string>).map(
                    ([platform, url]) => {
                      if (!url) return null;
                      return (
                        <a
                          key={platform}
                          href={url.startsWith("http") ? url : `https://${url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-muted/30 hover:bg-muted text-xs font-medium transition-all hover:scale-105 capitalize"
                        >
                          <Globe className="h-3 w-3" /> {platform}
                        </a>
                      );
                    },
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {isSelf && <CreatorAnalyticsBlock creatorId={id} canSee={isSelf} />}

        <div className="mt-12 mb-6 flex items-center gap-3">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-bold">Courses by {name}</h2>
          <Badge variant="secondary" className="text-xs">
            {p?.courses.length ?? 0}
          </Badge>
        </div>

        {!p?.courses || p.courses.length === 0 ? (
          <div className="rounded-2xl border bg-card p-12 text-center">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="font-medium">No published courses yet</p>
            <p className="text-sm text-muted-foreground mt-1">Check back later for new content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {p.courses.map((c, i) => (
              <Link
                key={c.id}
                to="/courses/$slug"
                params={{ slug: c.slug }}
                className="group rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 overflow-hidden relative">
                  {c.cover_url ? (
                    <img
                      src={c.cover_url}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center">
                      <GraduationCap className="h-12 w-12 text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant="secondary"
                      className="text-[10px] backdrop-blur-sm bg-background/80"
                    >
                      {c.level}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <Badge className="text-[10px] px-1.5 py-0.5">{c.category}</Badge>
                  </div>
                  <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                  <div className="pt-2 flex items-center justify-between border-t">
                    <span className="font-bold text-sm">{inr(Number(c.price_inr))}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> {c.duration_minutes || 0} min
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function CreatorAnalyticsBlock({ creatorId, canSee }: { creatorId: string; canSee: boolean }) {
  const fetchAnalytics = useServerFn(getCreatorAnalytics);
  const q = useQuery({
    enabled: canSee,
    queryKey: ["creator-analytics", creatorId],
    queryFn: () => fetchAnalytics({ data: { id: creatorId } }),
  });
  if (!canSee) return null;
  if (q.isLoading)
    return (
      <div className="mt-12 rounded-2xl border bg-card p-8 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
      </div>
    );
  const d = q.data;
  if (!d) return null;

  const chartData = d.courses.map((c) => ({
    name: c.title.length > 18 ? c.title.slice(0, 18) + "…" : c.title,
    Views: c.views,
    Likes: c.likes,
    Enrolled: c.enrollments,
  }));

  return (
    <section className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-bold">Analytics</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Users}
          label="Subscribers"
          value={d.subscribers}
          trend="+"
          color="from-violet-500 to-purple-600"
        />
        <StatCard
          icon={Eye}
          label="Views"
          value={d.totalViews}
          trend="+"
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={Heart}
          label="Likes"
          value={d.totalLikes}
          trend="+"
          color="from-rose-500 to-pink-500"
        />
        <StatCard
          icon={BookOpen}
          label="Enrollments"
          value={d.totalEnrollments}
          trend="+"
          color="from-emerald-500 to-teal-500"
        />
      </div>

      {d.courses.length > 0 && (
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          <div className="p-5 border-b bg-gradient-to-r from-transparent via-primary/[0.02] to-transparent">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Per-course performance
            </h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={Math.max(240, d.courses.length * 48)}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
              >
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" opacity={0.5} />
                <XAxis
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={130}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="Views" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
                <Bar dataKey="Likes" fill="hsl(271, 81%, 56%)" radius={[0, 6, 6, 0]} />
                <Bar dataKey="Enrolled" fill="hsl(160, 84%, 39%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="border-t">
            <div className="px-5 py-3 bg-muted/20 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Course breakdown
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="text-left px-4 py-3 font-medium">Course</th>
                    <th className="text-right px-4 py-3 font-medium">Lessons</th>
                    <th className="text-right px-4 py-3 font-medium">Views</th>
                    <th className="text-right px-4 py-3 font-medium">Likes</th>
                    <th className="text-right px-4 py-3 font-medium">Enrolled</th>
                  </tr>
                </thead>
                <tbody>
                  {d.courses.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b last:border-0 hover:bg-accent/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          to="/courses/$slug"
                          params={{ slug: c.slug }}
                          className="hover:text-primary font-medium flex items-center gap-1.5"
                        >
                          {c.title}{" "}
                          <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{c.lessons}</td>
                      <td className="px-4 py-3 text-right font-medium">{c.views}</td>
                      <td className="px-4 py-3 text-right">{c.likes}</td>
                      <td className="px-4 py-3 text-right font-semibold">{c.enrollments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
}: {
  icon: any;
  label: string;
  value: number;
  trend?: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden group">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity`}
      />
      <div className="relative">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon className="h-3.5 w-3.5" /> {label}
        </div>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="text-2xl font-bold font-display">{value.toLocaleString()}</span>
          {trend && value > 0 && (
            <span className="text-xs text-emerald-500 font-medium">{trend}</span>
          )}
        </div>
      </div>
    </div>
  );
}
