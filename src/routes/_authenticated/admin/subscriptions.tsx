import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Users,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  CreditCard,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  XCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { getAdminSubscriptionAnalytics } from "@/lib/subscription.functions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/admin/subscriptions")({
  head: () => ({ meta: [{ title: "Subscription Analytics — Learnify AI" }] }),
  component: AdminSubscriptionsPage,
});

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  expired: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  past_due: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  paused: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

function AdminSubscriptionsPage() {
  const analytics = useQuery({
    queryKey: ["admin-subscription-analytics"],
    queryFn: async () => {
      const fn = getAdminSubscriptionAnalytics;
      return await fn();
    },
  });

  const data = analytics.data;

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Subscription Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Revenue, subscribers, and billing insights.
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            Admin Only
          </Badge>
        </div>

        {analytics.isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !data ? (
          <div className="text-center text-muted-foreground py-20">Failed to load analytics.</div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="MRR"
                value={inr(data.mrr)}
                icon={IndianRupee}
                color="text-emerald-500"
                bgColor="bg-emerald-500/10"
              />
              <StatCard
                label="ARR"
                value={inr(data.arr)}
                icon={TrendingUp}
                color="text-blue-500"
                bgColor="bg-blue-500/10"
              />
              <StatCard
                label="Active Subscribers"
                value={data.totalSubscribers.toString()}
                icon={Users}
                color="text-violet-500"
                bgColor="bg-violet-500/10"
              />
              <StatCard
                label="Active Plans"
                value={data.plans.filter((p: any) => p.active_subscribers > 0).length.toString()}
                icon={BarChart3}
                color="text-orange-500"
                bgColor="bg-orange-500/10"
              />
            </div>

            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Revenue History Chart */}
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">30-Day Paid Revenue Trend</h3>
                    <p className="text-xs text-muted-foreground">Daily transaction revenue</p>
                  </div>
                  <IndianRupee className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.revenueHistory || []}>
                      <defs>
                        <linearGradient id="revSub" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.72 0.18 245)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="oklch(0.72 0.18 245)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0 0 0 / 0.05)" />
                      <XAxis dataKey="date" stroke="oklch(0.5 0.03 260)" fontSize={11} />
                      <YAxis
                        stroke="oklch(0.5 0.03 260)"
                        fontSize={11}
                        tickFormatter={(v) => `₹${v}`}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid var(--border)",
                          background: "var(--card)",
                        }}
                        formatter={(v: number) => [inr(v), "Revenue"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="oklch(0.72 0.18 245)"
                        fill="url(#revSub)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Subscriptions Growth Chart */}
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">30-Day Subscriber Growth</h3>
                    <p className="text-xs text-muted-foreground">Daily new subscriptions</p>
                  </div>
                  <Users className="h-4 w-4 text-violet-500" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.subscriberHistory || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0 0 0 / 0.05)" />
                      <XAxis dataKey="date" stroke="oklch(0.5 0.03 260)" fontSize={11} />
                      <YAxis
                        stroke="oklch(0.5 0.03 260)"
                        fontSize={11}
                        tickFormatter={(v) => Math.round(v).toString()}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid var(--border)",
                          background: "var(--card)",
                        }}
                        formatter={(v: number) => [v, "New Subscribers"]}
                      />
                      <Bar dataKey="count" fill="oklch(0.65 0.2 290)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Plan Breakdown */}
            <div className="rounded-2xl border bg-card overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Plan Breakdown</h3>
              </div>
              <div className="divide-y">
                {data.plans.map((plan: any) => (
                  <div key={plan.plan_id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{plan.plan_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {plan.price_inr > 0 ? inr(plan.price_inr) : "Free"} / month
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-bold text-emerald-500">{plan.active_subscribers || 0}</p>
                        <p className="text-xs text-muted-foreground">Active</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-red-500">{plan.cancelled_count || 0}</p>
                        <p className="text-xs text-muted-foreground">Cancelled</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-zinc-500">{plan.expired_count || 0}</p>
                        <p className="text-xs text-muted-foreground">Expired</p>
                      </div>
                      <div className="text-center min-w-[80px]">
                        <p className="font-bold">{inr(plan.mrr || 0)}</p>
                        <p className="text-xs text-muted-foreground">MRR</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Subscriptions */}
            <div className="rounded-2xl border bg-card overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Recent Subscriptions</h3>
              </div>
              {data.recentSubscriptions.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No subscriptions yet.</div>
              ) : (
                <div className="divide-y">
                  {data.recentSubscriptions.map((sub: any) => {
                    const plan = sub.plan as any;
                    const profile = sub.profiles as any;
                    return (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                            {profile?.full_name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {profile?.full_name || profile?.email || sub.user_id?.slice(0, 8)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {plan?.name || "Unknown"} •{" "}
                              {sub.created_at
                                ? format(new Date(sub.created_at), "MMM d, yyyy")
                                : "—"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            className={cn(
                              "text-xs border",
                              STATUS_COLORS[sub.status] || "bg-zinc-500/10 text-zinc-500",
                            )}
                          >
                            {sub.status}
                          </Badge>
                          <span className="text-sm font-medium">
                            {plan?.price_inr > 0 ? inr(plan.price_inr) : "Free"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Payments */}
            <div className="rounded-2xl border bg-card overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Recent Payment Events</h3>
              </div>
              {data.recentPayments.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No payment events yet.</div>
              ) : (
                <div className="divide-y">
                  {data.recentPayments.map((payment: any) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        {payment.status === "processed" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : payment.status === "failed" ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{payment.event_type}</p>
                          <p className="text-xs text-muted-foreground">
                            {payment.created_at
                              ? format(new Date(payment.created_at), "MMM d, HH:mm")
                              : "—"}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          payment.status === "processed"
                            ? "border-emerald-500/20 text-emerald-500"
                            : payment.status === "failed"
                              ? "border-red-500/20 text-red-500"
                              : "border-zinc-500/20 text-zinc-500",
                        )}
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bgColor,
}: {
  label: string;
  value: string;
  icon: any;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bgColor)}>
          <Icon className={cn("h-5 w-5", color)} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
