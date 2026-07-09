import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getBillingOverview, getInvoicesList } from "@/lib/billing.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IndianRupee, TrendingUp, Users, CreditCard, ArrowUpRight, ArrowDownRight,
  Download, Loader2, BarChart3, Wallet, FileText,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = ["#4F46E5", "#7C3AED", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4"];

export function RevenueDashboard() {
  const doOverview = useServerFn(getBillingOverview);
  const doInvoices = useServerFn(getInvoicesList);

  const { data: overview, isLoading: loadingOverview } = useQuery({
    queryKey: ["admin-revenue-overview"],
    queryFn: async () => { const r = await doOverview(); return r as any; },
  });

  const { data: invoicesData, isLoading: loadingInvoices } = useQuery({
    queryKey: ["admin-revenue-invoices"],
    queryFn: doInvoices,
  });
  const invoices: any[] = (invoicesData as any)?.invoices ?? [];

  if (loadingOverview) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const stats = overview ?? {};
  const monthlyData = stats.monthlyRevenue ?? [];
  const planDistribution = stats.planDistribution ?? [];
  const recentInvoices = invoices.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Revenue Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">Financial overview and analytics</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `₹${(stats.totalRevenue ?? 0).toLocaleString("en-IN")}`,
            icon: IndianRupee,
            color: "text-green-500",
            bg: "bg-green-50",
          },
          {
            label: "MRR",
            value: `₹${(stats.mrr ?? 0).toLocaleString("en-IN")}`,
            icon: TrendingUp,
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            label: "Active Subscriptions",
            value: stats.activeSubscriptions ?? 0,
            icon: Users,
            color: "text-violet-500",
            bg: "bg-violet-50",
          },
          {
            label: "This Month",
            value: `₹${(stats.monthlyTotal ?? 0).toLocaleString("en-IN")}`,
            icon: CreditCard,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <div className="text-xs text-muted-foreground">{kpi.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <h3 className="font-medium mb-4">Monthly Revenue</h3>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]} />
                  <Area type="monotone" dataKey="revenue" stroke="#4F46E5" fill="#4F46E520" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
                No revenue data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card>
          <CardContent className="p-5">
            <h3 className="font-medium mb-4">Plan Distribution</h3>
            {planDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="count"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {planDistribution.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
                No subscription data
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" /> Recent Invoices
            </h3>
          </div>
          {recentInvoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No invoices yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Invoice</th>
                    <th className="pb-2 font-medium">User</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((inv: any) => (
                    <tr key={inv.id} className="border-b last:border-0">
                      <td className="py-2.5 font-mono text-xs">{inv.invoice_number}</td>
                      <td className="py-2.5">{inv.profiles?.email ?? "—"}</td>
                      <td className="py-2.5 font-medium">₹{Number(inv.total_inr).toLocaleString("en-IN")}</td>
                      <td className="py-2.5">
                        <Badge variant={inv.status === "paid" ? "default" : inv.status === "pending" ? "secondary" : "destructive"}>
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-muted-foreground text-xs">
                        {new Date(inv.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
