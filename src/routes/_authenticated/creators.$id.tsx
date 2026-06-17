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
          supabase.from("profiles").select("id, full_name, avatar_url, banner_url, bio, social_links").eq("id", id).maybeSingle(),
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
      toast.success("Subscribed — you'll get notified for new lessons");
    }
    qc.invalidateQueries({ queryKey: ["my-sub", id, user.id] });
    qc.invalidateQueries({ queryKey: ["creator-profile", id] });
  };

  if (profileQuery.isLoading) {
    return (
      <AppShell>
        <div className="py-20 grid place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
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
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to courses
        </Link>

        {/* YouTube-Style Channel Layout */}
        <div className="mt-6 rounded-3xl border bg-card overflow-hidden shadow-card relative">
          {/* Channel Banner */}
          <div className="h-44 md:h-56 w-full relative overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500">
            {p?.profile?.banner_url ? (
              <img
                src={p.profile.banner_url}
                alt="Channel Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                <span className="text-white/40 font-display font-medium tracking-wider text-sm">
                  Welcome to {name}'s Channel
                </span>
              </div>
            )}
          </div>

          {/* Channel Info & Avatar Container */}
          <div className="px-6 pb-6 sm:px-8 sm:pb-8 flex flex-col sm:flex-row items-start gap-5 relative">
            {/* Overlapping Avatar */}
            <Avatar className="h-28 w-28 border-4 border-card rounded-full -mt-14 shadow-md bg-card shrink-0">
              {p?.profile?.avatar_url && <AvatarImage src={p.profile.avatar_url} alt="" />}
              <AvatarFallback className="text-3xl font-display font-bold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0 pt-2 sm:pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
                    {name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary" /> {p?.subscribers ?? 0} subscribers
                    </span>
                    <span>·</span>
                    <span>{p?.courses.length ?? 0} courses</span>
                  </div>
                </div>

                {!isSelf && (
                  <Button
                    onClick={toggleSub}
                    variant={subscribed ? "outline" : "default"}
                    size="lg"
                    className="rounded-full shadow-sm gap-1.5 w-full sm:w-auto"
                    aria-pressed={subscribed}
                  >
                    {subscribed ? (
                      <>
                        <BellOff className="h-5 w-5" /> Subscribed
                      </>
                    ) : (
                      <>
                        <Bell className="h-5 w-5" /> Subscribe
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Bio / About */}
              {p?.profile?.bio && (
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-3xl">
                  {p.profile.bio}
                </p>
              )}

              {/* Social Media Links */}
              {p?.profile?.social_links && typeof p.profile.social_links === "object" && (
                <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t text-xs">
                  {Object.entries(p.profile.social_links as Record<string, string>).map(([platform, url]) => {
                    if (!url) return null;
                    // Try to resolve clean URL display
                    let displayUrl = url.replace(/https?:\/\/(www\.)?/, "");
                    if (displayUrl.length > 25) displayUrl = displayUrl.slice(0, 25) + "…";
                    return (
                      <a
                        key={platform}
                        href={url.startsWith("http") ? url : `https://${url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border bg-muted/30 hover:bg-muted text-primary transition-colors hover:underline capitalize"
                      >
                        <span className="font-medium">{platform}</span>
                        <span className="text-[10px] text-muted-foreground">({displayUrl})</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {(isSelf || (user && (user as any).id)) && (
          <CreatorAnalyticsBlock creatorId={id} canSee={isSelf} />
        )}

        <h2 className="font-display text-xl font-semibold mt-10 mb-4">Courses by {name}</h2>

        {!p?.courses || p.courses.length === 0 ? (
          <div className="rounded-2xl border bg-card p-10 text-center text-sm text-muted-foreground">
            No published courses yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {p.courses.map((c) => (
              <Link
                key={c.id}
                to="/courses/$slug"
                params={{ slug: c.slug }}
                className="group rounded-2xl border bg-card overflow-hidden shadow-card hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <div className="aspect-video bg-muted overflow-hidden">
                  {c.cover_url ? (
                    <img
                      src={c.cover_url}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center">
                      <GraduationCap className="h-10 w-10 text-muted-foreground" />
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
                  <h3 className="mt-2 font-display font-semibold leading-snug line-clamp-2 group-hover:text-primary">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                  <div className="mt-3 text-xs font-semibold">{inr(Number(c.price_inr))}</div>
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
      <div className="mt-8 rounded-2xl border bg-card p-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto" />
      </div>
    );
  const d = q.data;
  if (!d) return null;
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5" /> Your analytics
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard icon={Users} label="Subscribers" value={d.subscribers} />
        <StatCard icon={Eye} label="Total views" value={d.totalViews} />
        <StatCard icon={Heart} label="Total likes" value={d.totalLikes} />
        <StatCard icon={BookOpen} label="Enrollments" value={d.totalEnrollments} />
      </div>
      {d.courses.length > 0 && (
        <>
          <div className="rounded-2xl border bg-card p-4 shadow-card mb-4">
            <div className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Per-course performance
            </div>
            <ResponsiveContainer width="100%" height={Math.max(220, d.courses.length * 44)}>
              <BarChart
                data={d.courses.map((c) => ({
                  name: c.title.length > 22 ? c.title.slice(0, 22) + "…" : c.title,
                  Views: c.views,
                  Likes: c.likes,
                  Enrolled: c.enrollments,
                }))}
                layout="vertical"
                margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
              >
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Views" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Likes" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Enrolled" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
            <div className="px-6 py-3 border-b text-sm font-semibold">Course breakdown</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-2">Course</th>
                    <th className="text-right px-4 py-2">Lessons</th>
                    <th className="text-right px-4 py-2">Views</th>
                    <th className="text-right px-4 py-2">Likes</th>
                    <th className="text-right px-4 py-2">Enrolled</th>
                  </tr>
                </thead>
                <tbody>
                  {d.courses.map((c) => (
                    <tr key={c.id} className="border-t hover:bg-accent/30">
                      <td className="px-4 py-2">
                        <Link
                          to="/courses/$slug"
                          params={{ slug: c.slug }}
                          className="hover:text-primary font-medium"
                        >
                          {c.title}
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-right text-muted-foreground">{c.lessons}</td>
                      <td className="px-4 py-2 text-right">{c.views}</td>
                      <td className="px-4 py-2 text-right">{c.likes}</td>
                      <td className="px-4 py-2 text-right">{c.enrollments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-card">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 text-2xl font-display font-semibold">{value.toLocaleString()}</div>
    </div>
  );
}
