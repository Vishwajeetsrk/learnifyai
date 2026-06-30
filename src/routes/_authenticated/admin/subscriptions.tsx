import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
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
  DollarSign,
  UserPlus,
  UserX,
  Timer,
  Target,
  Activity,
  Download,
  Calendar,
  Search,
  Zap,
  Award,
  FileText,
  Briefcase,
  Layers,
  Wallet,
  Bot,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { getAdminSubscriptionAnalytics, type AnalyticsFilters } from "@/lib/subscription.functions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  trial: "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const DATE_RANGE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "180d", label: "Last 180 Days" },
  { value: "year", label: "This Year" },
  { value: "custom", label: "Custom Range" },
] as const;

const REPORT_TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "revenue", label: "Revenue" },
  { value: "subscriptions", label: "Subscriptions" },
  { value: "invoices", label: "Invoices" },
  { value: "payments", label: "Payments" },
  { value: "refunds", label: "Refunds" },
  { value: "credits", label: "Credits" },
  { value: "ai-usage", label: "AI Usage" },
  { value: "certificates", label: "Certificates" },
  { value: "courses", label: "Courses" },
  { value: "interviews", label: "Interviews" },
  { value: "resume", label: "Resume Usage" },
  { value: "ats", label: "ATS" },
] as const;

const PIE_COLORS = ["#10b981", "#8b5cf6", "#f59e0b", "#3b82f6", "#ec4899", "#06b6d4"];

function AdminSubscriptionsPage() {
  const [dateRange, setDateRange] = useState<string>("30d");
  const [reportType, setReportType] = useState<string>("all");
  const [chartTab, setChartTab] = useState<"revenue" | "subscribers" | "plans">("revenue");
  const [searchTerm, setSearchTerm] = useState("");

  const filters: AnalyticsFilters = {
    dateRange: dateRange as AnalyticsFilters["dateRange"],
    reportType: reportType as AnalyticsFilters["reportType"],
  };

  const analytics = useQuery({
    queryKey: ["admin-subscription-analytics", filters],
    queryFn: async () => {
      const fn = getAdminSubscriptionAnalytics;
      return await fn();
    },
  });

  const data = analytics.data;

  const kpiCards = data ? [
    { label: "MRR", value: inr(data.mrr), icon: IndianRupee, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    { label: "ARR", value: inr(data.arr), icon: TrendingUp, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { label: "Active Subscribers", value: data.totalSubscribers.toLocaleString(), icon: Users, color: "text-violet-500", bgColor: "bg-violet-500/10" },
    { label: "New (30d)", value: data.newSubscribers.toLocaleString(), icon: UserPlus, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    { label: "Cancelled", value: data.cancelledCount.toLocaleString(), icon: UserX, color: "text-red-500", bgColor: "bg-red-500/10" },
    { label: "Expired", value: data.expiredCount.toLocaleString(), icon: Timer, color: "text-zinc-500", bgColor: "bg-zinc-500/10" },
    { label: "Trial", value: data.trialCount.toLocaleString(), icon: Target, color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { label: "Conversion", value: `${data.conversionRate}%`, icon: Activity, color: "text-orange-500", bgColor: "bg-orange-500/10" },
    { label: "Churn Rate", value: `${data.churnRate}%`, icon: ArrowDownRight, color: data.churnRate > 10 ? "text-red-500" : "text-emerald-500", bgColor: data.churnRate > 10 ? "bg-red-500/10" : "bg-emerald-500/10" },
    { label: "ARPU", value: inr(data.arpu), icon: DollarSign, color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
  ] : [];

  const hasRealRevenue = data?.revenueHistory?.some((d) => d.revenue > 0);
  const hasRealSubs = data?.subscriberHistory?.some((d) => d.count > 0);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Subscription Analytics</h1>
            <p className="text-muted-foreground mt-1">Real metrics from database records.</p>
          </div>
          <Badge variant="outline" className="text-xs">Admin Only</Badge>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <Label className="text-xs mb-1 block">Date Range</Label>
            <div className="flex flex-wrap gap-1">
              {DATE_RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDateRange(opt.value)}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-lg border transition-colors",
                    dateRange === opt.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Report Type Tabs */}
        <div className="flex flex-wrap gap-1">
          {REPORT_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setReportType(opt.value)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-lg border transition-colors",
                reportType === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/40",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {analytics.isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : !data ? (
          <div className="text-center text-muted-foreground py-20">Failed to load analytics.</div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {kpiCards.map((kpi) => (
                <div key={kpi.label} className="rounded-xl border bg-card p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", kpi.bgColor)}>
                      <kpi.icon className={cn("h-4 w-4", kpi.color)} />
                    </div>
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  </div>
                  <p className="text-xl font-bold">{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setChartTab("revenue")} className={cn("px-3 py-1 text-xs rounded-md transition-colors", chartTab === "revenue" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>Revenue</button>
                <button onClick={() => setChartTab("subscribers")} className={cn("px-3 py-1 text-xs rounded-md transition-colors", chartTab === "subscribers" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>Subscribers</button>
                <button onClick={() => setChartTab("plans")} className={cn("px-3 py-1 text-xs rounded-md transition-colors", chartTab === "plans" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>Plans</button>
              </div>
              {chartTab === "revenue" && (
                <div className="h-72">
                  {!hasRealRevenue ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                      <IndianRupee className="h-8 w-8 mb-2 opacity-30" />
                      <p className="text-sm">No data available for selected date range.</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.revenueHistory}>
                        <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0 0 0 / 0.05)" />
                        <XAxis dataKey="date" stroke="oklch(0.5 0.03 260)" fontSize={11} />
                        <YAxis stroke="oklch(0.5 0.03 260)" fontSize={11} tickFormatter={(v: number) => `₹${(v/1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} formatter={(v: number) => [inr(v), "Revenue"]} />
                        <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              )}
              {chartTab === "subscribers" && (
                <div className="h-72">
                  {!hasRealSubs ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Users className="h-8 w-8 mb-2 opacity-30" />
                      <p className="text-sm">No data available for selected date range.</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.subscriberHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0 0 0 / 0.05)" />
                        <XAxis dataKey="date" stroke="oklch(0.5 0.03 260)" fontSize={11} />
                        <YAxis stroke="oklch(0.5 0.03 260)" fontSize={11} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} formatter={(v: number) => [v, "New"]} />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              )}
              {chartTab === "plans" && (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.plans.filter((p: any) => p.active_subscribers > 0)} dataKey="active_subscribers" nameKey="plan_name" cx="50%" cy="50%" outerRadius={100} label={({ plan_name, percent }: any) => `${plan_name} ${(percent * 100).toFixed(0)}%`}>
                        {data.plans.filter((p: any) => p.active_subscribers > 0).map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} formatter={(v: number, n: string) => [v, n]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Plan Breakdown */}
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Plan Breakdown</h3>
                <span className="text-xs text-muted-foreground">Dynamic from subscriptions</span>
              </div>
              <div className="divide-y">
                {data.plans.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No data available for selected date range.</div>
                ) : (
                  data.plans.map((plan: any) => (
                    <div key={plan.plan_id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30">
                      <div className="flex items-center gap-4">
                        <div><p className="font-medium">{plan.plan_name}</p><p className="text-xs text-muted-foreground">{plan.price_inr > 0 ? inr(plan.price_inr) : "Free"}/mo</p></div>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="text-center min-w-[50px]"><p className="font-bold text-emerald-500">{plan.active_subscribers}</p><p className="text-muted-foreground">Active</p></div>
                        <div className="text-center min-w-[50px]"><p className="font-bold text-red-500">{plan.cancelled_count}</p><p className="text-muted-foreground">Cancelled</p></div>
                        <div className="text-center min-w-[50px]"><p className="font-bold text-zinc-500">{plan.expired_count}</p><p className="text-muted-foreground">Expired</p></div>
                        <div className="text-center min-w-[80px]"><p className="font-bold">{inr(plan.mrr)}</p><p className="text-muted-foreground">MRR</p></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Subscriptions + Payments */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Subscriptions */}
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold">Recent Subscriptions</h3>
                  <div className="relative w-40"><Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" /><Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-7 h-8 text-xs" /></div>
                </div>
                {data.recentSubscriptions.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No data available for selected date range.</div>
                ) : (
                  <div className="divide-y max-h-80 overflow-y-auto">
                    {data.recentSubscriptions.filter((sub: any) => {
                      if (!searchTerm) return true;
                      const profile = sub.profiles as any;
                      const plan = sub.plan as any;
                      return (profile?.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (profile?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (plan?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
                    }).map((sub: any) => {
                      const plan = sub.plan as any;
                      const profile = sub.profiles as any;
                      return (
                        <div key={sub.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">{profile?.full_name?.charAt(0) || "?"}</div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{profile?.full_name || profile?.email || sub.user_id?.slice(0, 8)}</p>
                              <p className="text-xs text-muted-foreground truncate">{plan?.name || "Unknown"} · {sub.created_at ? format(new Date(sub.created_at), "MMM d, yyyy") : "—"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge className={cn("text-xs border", STATUS_COLORS[sub.status] || "bg-zinc-500/10 text-zinc-500")}>{sub.status}</Badge>
                            <span className="text-xs font-medium">{plan?.price_inr > 0 ? inr(plan.price_inr) : "Free"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Payments */}
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b"><h3 className="font-semibold">Payment Events</h3></div>
                {data.recentPayments.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No data available for selected date range.</div>
                ) : (
                  <div className="divide-y max-h-80 overflow-y-auto">
                    {data.recentPayments.map((payment: any) => (
                      <div key={payment.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30">
                        <div className="flex items-center gap-3">
                          {payment.status === "processed" || payment.status === "completed" ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
                           payment.status === "failed" ? <XCircle className="h-4 w-4 text-red-500" /> :
                           <Clock className="h-4 w-4 text-yellow-500" />}
                          <div><p className="text-sm font-medium">{payment.event_type || "Payment"}</p><p className="text-xs text-muted-foreground">{payment.created_at ? format(new Date(payment.created_at), "MMM d, HH:mm") : "—"}</p></div>
                        </div>
                        <div className="flex items-center gap-2">
                          {payment.amount && <span className="text-xs font-medium">{inr(payment.amount)}</span>}
                          <Badge variant="outline" className={cn("text-xs", payment.status === "processed" || payment.status === "completed" ? "border-emerald-500/20 text-emerald-500" : payment.status === "failed" ? "border-red-500/20 text-red-500" : "border-zinc-500/20 text-zinc-500")}>{payment.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
