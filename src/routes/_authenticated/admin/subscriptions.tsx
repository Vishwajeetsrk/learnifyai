import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  BarChart3,
  Users,
  IndianRupee,
  TrendingUp,
  CreditCard,
  Loader2,
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
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
} from "recharts";
import { AppShell } from "@/components/AppShell";
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
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const DATE_RANGE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "Last 7 Days" },
  { value: "month", label: "Last Month" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "180d", label: "Last 180 Days" },
  { value: "year", label: "This Year" },
  { value: "custom", label: "Custom Range" },
  { value: "all", label: "All" },
] as const;

const REPORT_TYPE_OPTIONS = [
  { value: "all", label: "All", icon: Layers },
  { value: "revenue", label: "Revenue", icon: IndianRupee },
  { value: "subscriptions", label: "Subscriptions", icon: Users },
  { value: "invoices", label: "Invoices", icon: FileText },
  { value: "payments", label: "Payments", icon: CreditCard },
  { value: "refunds", label: "Refunds", icon: RefreshCw },
  { value: "credits", label: "Credits", icon: Wallet },
  { value: "ai-usage", label: "AI Usage", icon: Bot },
  { value: "certificates", label: "Certificates", icon: Award },
  { value: "courses", label: "Courses", icon: Briefcase },
  { value: "interviews", label: "Interviews", icon: Zap },
  { value: "resume", label: "Resume Usage", icon: FileText },
  { value: "ats", label: "ATS", icon: Target },
] as const;

const PIE_COLORS = ["#10b981", "#8b5cf6", "#f59e0b", "#3b82f6", "#ec4899", "#06b6d4"];

function exportToCSV(data: Record<string, any>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = row[h];
          const str = String(val ?? "");
          return str.includes(",") || str.includes('"') || str.includes("\n")
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(","),
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportToExcel(data: Record<string, any>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const xml =
    '<?xml version="1.0"?>\n' +
    '<?mso-application progid="Excel.Sheet"?>\n' +
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n' +
    ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +
    '<Worksheet ss:Name="Sheet1">\n<Table>\n' +
    `<Row>${headers.map((h) => `<Cell><Data ss:Type="String">${h}</Data></Cell>`).join("")}</Row>\n` +
    data
      .map(
        (row) =>
          `<Row>${headers
            .map((h) => {
              const val = row[h];
              const isNum =
                typeof val === "number" || (typeof val === "string" && /^\d+\.?\d*$/.test(val));
              return `<Cell><Data ss:Type="${isNum ? "Number" : "String"}">${String(val ?? "")}</Data></Cell>`;
            })
            .join("")}</Row>`,
      )
      .join("\n") +
    "\n</Table>\n</Worksheet>\n</Workbook>";
  const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}

function AdminSubscriptionsPage() {
  const [dateRange, setDateRange] = useState<string>("30d");
  const [reportType, setReportType] = useState<string>("all");
  const [chartTab, setChartTab] = useState<"overview" | "revenue" | "subscribers" | "plans">(
    "overview",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [exportOpen, setExportOpen] = useState(false);

  const filters: AnalyticsFilters = {
    dateRange: dateRange as AnalyticsFilters["dateRange"],
    startDate: customStart || undefined,
    endDate: customEnd || undefined,
    reportType: reportType as AnalyticsFilters["reportType"],
  };

  const getAnalyticsFn = useServerFn(getAdminSubscriptionAnalytics);

  const analytics = useQuery({
    queryKey: ["admin-subscription-analytics", filters],
    queryFn: async () => {
      return await getAnalyticsFn({ data: filters });
    },
    retry: 2,
    retryDelay: 1000,
  });

  const data = analytics.data;

  const kpiCards = data
    ? [
        {
          label: "MRR",
          value: inr(data.mrr),
          icon: IndianRupee,
          color: "text-emerald-500",
          bgColor: "bg-emerald-500/10",
        },
        {
          label: "ARR",
          value: inr(data.arr),
          icon: TrendingUp,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
        },
        {
          label: "Active Subscribers",
          value: data.totalSubscribers.toLocaleString(),
          icon: Users,
          color: "text-violet-500",
          bgColor: "bg-violet-500/10",
        },
        {
          label: "New (30d)",
          value: data.newSubscribers.toLocaleString(),
          icon: UserPlus,
          color: "text-emerald-500",
          bgColor: "bg-emerald-500/10",
        },
        {
          label: "Cancelled",
          value: data.cancelledCount.toLocaleString(),
          icon: UserX,
          color: "text-red-500",
          bgColor: "bg-red-500/10",
        },
        {
          label: "Expired",
          value: data.expiredCount.toLocaleString(),
          icon: Timer,
          color: "text-zinc-500",
          bgColor: "bg-zinc-500/10",
        },
        {
          label: "Trial",
          value: data.trialCount.toLocaleString(),
          icon: Target,
          color: "text-purple-500",
          bgColor: "bg-purple-500/10",
        },
        {
          label: "Conversion",
          value: `${data.conversionRate}%`,
          icon: Activity,
          color: "text-orange-500",
          bgColor: "bg-orange-500/10",
        },
        {
          label: "Churn Rate",
          value: `${data.churnRate}%`,
          icon: ArrowDownRight,
          color: data.churnRate > 10 ? "text-red-500" : "text-emerald-500",
          bgColor: data.churnRate > 10 ? "bg-red-500/10" : "bg-emerald-500/10",
        },
        {
          label: "ARPU",
          value: inr(data.arpu),
          icon: DollarSign,
          color: "text-cyan-500",
          bgColor: "bg-cyan-500/10",
        },
      ]
    : [];

  const hasRealRevenue = data?.revenueHistory?.some((d: any) => d.revenue > 0);
  const hasRealSubs = data?.subscriberHistory?.some((d: any) => d.count > 0);

  const overviewData = useMemo(() => {
    if (!data?.revenueHistory) return [];
    return data.revenueHistory.map((r: any, i: number) => ({
      date: r.date,
      revenue: r.revenue,
      subscribers: data.subscriberHistory?.[i]?.count || 0,
    }));
  }, [data]);

  const handleExport = (fileFormat: "csv" | "excel") => {
    if (!data) return;
    const exportData = data.recentSubscriptions.map((s: any) => ({
      Name: s.profiles?.full_name || s.profiles?.email || s.user_id,
      Email: s.profiles?.email || "",
      Mobile: s.profiles?.mobile || s.profiles?.phone || "",
      Plan: s.plan?.name || "Unknown",
      Price: s.plan?.price_inr || 0,
      Status: s.status,
      Created: s.created_at ? new Date(s.created_at).toISOString() : "",
    }));

    if (fileFormat === "csv") {
      exportToCSV(exportData, `subscriptions_${dateRange}`);
    } else {
      exportToExcel(exportData, `subscriptions_${dateRange}`);
    }
  };

  const selectedRangeLabel =
    DATE_RANGE_OPTIONS.find((o) => o.value === dateRange)?.label || dateRange;

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Subscription Analytics</h1>
            <p className="text-muted-foreground mt-1">Real metrics from database records.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button variant="outline" size="sm" onClick={() => setExportOpen(!exportOpen)}>
                <Download className="h-4 w-4 mr-1.5" /> Export
              </Button>
              {exportOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-card border rounded-lg shadow-lg py-1 min-w-[120px]">
                  <button
                    onClick={() => {
                      handleExport("csv");
                      setExportOpen(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-muted flex items-center gap-2"
                  >
                    <FileText className="h-3.5 w-3.5" /> CSV
                  </button>
                  <button
                    onClick={() => {
                      handleExport("excel");
                      setExportOpen(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-muted flex items-center gap-2"
                  >
                    <FileText className="h-3.5 w-3.5" /> Excel (.xls)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div>
            <Label className="text-xs mb-1.5 block font-bold text-muted-foreground uppercase tracking-wider">Date Range</Label>
            <div className="flex overflow-x-auto no-scrollbar pb-1 gap-1 flex-nowrap shrink-0 max-w-full">
              {DATE_RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDateRange(opt.value)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors shrink-0 whitespace-nowrap",
                    dateRange === opt.value
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {dateRange === "custom" && (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="h-9 text-xs w-36"
              />
              <span className="text-muted-foreground text-xs">to</span>
              <Input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="h-9 text-xs w-36"
              />
            </div>
          )}
        </div>

        {/* Report Type Tabs */}
        <div>
          <Label className="text-xs mb-1.5 block font-bold text-muted-foreground uppercase tracking-wider">Report Type</Label>
          <div className="flex overflow-x-auto no-scrollbar pb-1 gap-1 flex-nowrap shrink-0 max-w-full">
            {REPORT_TYPE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => setReportType(opt.value)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 shrink-0 whitespace-nowrap",
                    reportType === opt.value
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {analytics.isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : analytics.isError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-10 text-center space-y-3">
            <p className="font-semibold text-destructive">Failed to load analytics</p>
            <p className="text-sm text-muted-foreground">
              {(analytics.error as any)?.message || "An error occurred while fetching data."}
            </p>
            <Button size="sm" variant="outline" onClick={() => analytics.refetch()}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Retry
            </Button>
          </div>
        ) : !data ? (
          <div className="text-center text-muted-foreground py-20">
            No analytics data available.
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {kpiCards.map((kpi) => (
                <div key={kpi.label} className="rounded-xl border bg-card/60 backdrop-blur p-3.5 sm:p-4 flex flex-col justify-between shadow-xs">
                  <div className="flex items-center gap-2 mb-1.5 min-w-0">
                    <div
                      className={cn(
                        "w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0",
                        kpi.bgColor,
                      )}
                    >
                      <kpi.icon className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", kpi.color)} />
                    </div>
                    <p className="text-[11px] sm:text-xs font-medium text-muted-foreground truncate">{kpi.label}</p>
                  </div>
                  <p className="text-lg sm:text-xl font-bold font-display truncate tracking-tight">{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                {(["overview", "revenue", "subscribers", "plans"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setChartTab(tab)}
                    className={cn(
                      "px-3 py-1 text-xs rounded-md transition-colors capitalize",
                      chartTab === tab
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                    )}
                  >
                    {tab}
                  </button>
                ))}
                <span className="ml-auto text-xs text-muted-foreground">{selectedRangeLabel}</span>
              </div>

              {chartTab === "overview" && (
                <div className="h-80">
                  {!hasRealRevenue && !hasRealSubs ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                      <BarChart3 className="h-8 w-8 mb-2 opacity-30" />
                      <p className="text-sm">No data available for selected date range.</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={overviewData}>
                        <defs>
                          <linearGradient id="overviewRevGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0 0 0 / 0.05)" />
                        <XAxis dataKey="date" stroke="oklch(0.5 0.03 260)" fontSize={11} />
                        <YAxis
                          yAxisId="left"
                          stroke="oklch(0.5 0.03 260)"
                          fontSize={11}
                          tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke="oklch(0.5 0.03 260)"
                          fontSize={11}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: "1px solid var(--border)",
                            background: "var(--card)",
                          }}
                          formatter={(value: number, name: string) => [
                            name === "revenue" ? inr(value) : value,
                            name === "revenue" ? "Revenue" : "New Subscribers",
                          ]}
                        />
                        <Legend />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10b981"
                          fill="url(#overviewRevGrad)"
                          strokeWidth={2}
                          name="Revenue"
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="subscribers"
                          fill="#8b5cf6"
                          radius={[4, 4, 0, 0]}
                          name="Subscribers"
                          opacity={0.7}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </div>
              )}

              {chartTab === "revenue" && (
                <div className="h-72">
                  {!hasRealRevenue ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                      <IndianRupee className="h-8 w-8 mb-2 opacity-30" />
                      <p className="text-sm">No revenue data for selected range.</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.revenueHistory}>
                        <defs>
                          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0 0 0 / 0.05)" />
                        <XAxis dataKey="date" stroke="oklch(0.5 0.03 260)" fontSize={11} />
                        <YAxis
                          stroke="oklch(0.5 0.03 260)"
                          fontSize={11}
                          tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
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
                          stroke="#10b981"
                          fill="url(#revGrad)"
                          strokeWidth={2}
                        />
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
                      <p className="text-sm">No subscriber data for selected range.</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.subscriberHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0 0 0 / 0.05)" />
                        <XAxis dataKey="date" stroke="oklch(0.5 0.03 260)" fontSize={11} />
                        <YAxis stroke="oklch(0.5 0.03 260)" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: "1px solid var(--border)",
                            background: "var(--card)",
                          }}
                          formatter={(v: number) => [v, "New"]}
                        />
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
                      <Pie
                        data={data.plans.filter((p: any) => p.active_subscribers > 0)}
                        dataKey="active_subscribers"
                        nameKey="plan_name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ plan_name, percent }: any) =>
                          `${plan_name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {data.plans
                          .filter((p: any) => p.active_subscribers > 0)
                          .map((_: any, i: number) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid var(--border)",
                          background: "var(--card)",
                        }}
                        formatter={(v: number, n: string) => [v, n]}
                      />
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
                  <div className="p-8 text-center text-muted-foreground">
                    No plan data available.
                  </div>
                ) : (
                  data.plans.map((plan: any) => (
                    <div
                      key={plan.plan_id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                          {(plan.plan_name || "P").charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{plan.plan_name}</p>
                          <p className="text-xs text-muted-foreground font-medium">
                            {plan.price_inr > 0 ? inr(plan.price_inr) : "Free"}/mo
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 text-xs w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-t-0">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 sm:p-1.5 rounded-lg text-center min-w-[60px]">
                          <p className="font-bold text-emerald-600 dark:text-emerald-400">{plan.active_subscribers}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Active</p>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/20 p-2 sm:p-1.5 rounded-lg text-center min-w-[60px]">
                          <p className="font-bold text-red-600 dark:text-red-400">{plan.cancelled_count}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Cancelled</p>
                        </div>
                        <div className="bg-zinc-500/10 border border-zinc-500/20 p-2 sm:p-1.5 rounded-lg text-center min-w-[60px]">
                          <p className="font-bold text-zinc-600 dark:text-zinc-400">{plan.expired_count}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Expired</p>
                        </div>
                        <div className="bg-primary/10 border border-primary/20 p-2 sm:p-1.5 rounded-lg text-center min-w-[80px]">
                          <p className="font-bold text-primary">{inr(plan.mrr)}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">MRR</p>
                        </div>
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
                  <div className="relative w-40">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-7 h-8 text-xs"
                    />
                  </div>
                </div>
                {data.recentSubscriptions.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No subscriptions in this period.
                  </div>
                ) : (
                  <div className="divide-y max-h-80 overflow-y-auto">
                    {data.recentSubscriptions
                      .filter((sub: any) => {
                        if (!searchTerm) return true;
                        const profile = sub.profiles as any;
                        const plan = sub.plan as any;
                        return (
                          (profile?.full_name || "")
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          (profile?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (plan?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
                        );
                      })
                      .map((sub: any) => {
                        const plan = sub.plan as any;
                        const profile = sub.profiles as any;
                        return (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between px-4 py-3 hover:bg-muted/30"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                                {profile?.full_name?.charAt(0) || "?"}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {profile?.full_name || profile?.email || sub.user_id?.slice(0, 8)}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {plan?.name || "Unknown"} ·{" "}
                                  {sub.created_at
                                    ? format(new Date(sub.created_at), "MMM d, yyyy")
                                    : "—"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge
                                className={cn(
                                  "text-xs border",
                                  STATUS_COLORS[sub.status] || "bg-zinc-500/10 text-zinc-500",
                                )}
                              >
                                {sub.status}
                              </Badge>
                              <span className="text-xs font-medium">
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
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Payment Events</h3>
                </div>
                {data.recentPayments.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No payments in this period.
                  </div>
                ) : (
                  <div className="divide-y max-h-80 overflow-y-auto">
                    {data.recentPayments.map((payment: any) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          {payment.status === "processed" || payment.status === "completed" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : payment.status === "failed" ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{payment.event_type || "Payment"}</p>
                            <p className="text-xs text-muted-foreground">
                              {payment.created_at
                                ? format(new Date(payment.created_at), "MMM d, HH:mm")
                                : "—"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {payment.amount && (
                            <span className="text-xs font-medium">{inr(payment.amount)}</span>
                          )}
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              payment.status === "processed" || payment.status === "completed"
                                ? "border-emerald-500/20 text-emerald-500"
                                : payment.status === "failed"
                                  ? "border-red-500/20 text-red-500"
                                  : "border-zinc-500/20 text-zinc-500",
                            )}
                          >
                            {payment.status}
                          </Badge>
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
