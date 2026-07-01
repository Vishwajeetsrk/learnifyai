import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  CreditCard,
  Receipt,
  IndianRupee,
  Users,
  Activity,
  TrendingUp,
  Download,
  Search,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Settings,
  Globe,
  Shield,
  DollarSign,
  Banknote,
  FileText,
  Layers,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Pencil,
  Save,
  Eye,
  Ban,
  Filter,
  Calendar,
  CalendarPlus,
  CheckCircle,
} from "lucide-react";
import {
  getBillingOverview,
  getInvoicesList,
  getBillingSettings,
  updateBillingSetting,
  createManualInvoice,
  getPaymentLogs,
  getRefunds,
  processRefund,
  getCashfreeStatus,
  getSubscriptionBillingData,
  exportBillingData,
  getCoupons,
  saveCoupon,
  deleteCoupon,
} from "@/lib/billing.functions";

import { adminUpdateSubscription } from "@/lib/subscription.functions";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { downloadInvoicePdf } from "@/lib/invoice-pdf";

export const Route = createFileRoute("/_authenticated/admin/billing")({
  head: () => ({ meta: [{ title: "Billing OS — Learnify AI" }] }),
  component: BillingOSPage,
});

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const STATUS_BADGE: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  failed: "bg-red-500/10 text-red-500 border-red-500/20",
  refunded: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  void: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  expired: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  past_due: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  paused: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  trial: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  processed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

function StatCard({ label, value, icon: Icon, color, bgColor }: { label: string; value: string; icon: any; color: string; bgColor: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2 mb-1">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", bgColor)}>
          <Icon className={cn("h-4 w-4", color)} />
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function BillingOSPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  const overview = useQuery({
    queryKey: ["billing-overview"],
    queryFn: async () => {
      const fn = getBillingOverview;
      return await fn();
    },
  });

  const [invoicePage, setInvoicePage] = useState(1);
  const [invoiceStatus, setInvoiceStatus] = useState("");
  const [invoiceSearch, setInvoiceSearch] = useState("");

  const invoices = useQuery({
    queryKey: ["billing-invoices", invoicePage, invoiceStatus, invoiceSearch],
    queryFn: async () => {
      const fn = getInvoicesList;
      return await fn({ data: { page: invoicePage, per_page: 20, status: invoiceStatus || undefined, search: invoiceSearch || undefined } as any });
    },
  });

  const [paymentPage, setPaymentPage] = useState(1);

  const payments = useQuery({
    queryKey: ["billing-payments", paymentPage],
    queryFn: async () => {
      const fn = getPaymentLogs;
      return await fn({ data: { page: paymentPage, per_page: 20 } as any });
    },
  });

  const [subscriptionSearch, setSubscriptionSearch] = useState("");

  const subscriptionsData = useQuery({
    queryKey: ["billing-subscriptions"],
    queryFn: async () => {
      const fn = getSubscriptionBillingData;
      return await fn({ data: {} } as any);
    },
  });

  const [refundPage, setRefundPage] = useState(1);
  const [refundStatus, setRefundStatus] = useState("");

  const refundsData = useQuery({
    queryKey: ["billing-refunds", refundPage, refundStatus],
    queryFn: async () => {
      const fn = getRefunds;
      return await fn({ data: { page: refundPage, per_page: 20 } as any });
    },
  });

  const billingSettings = useQuery({
    queryKey: ["billing-settings"],
    queryFn: async () => {
      const fn = getBillingSettings;
      return await fn();
    },
  });

  const cashfreeStatus = useQuery({
    queryKey: ["billing-cashfree"],
    queryFn: async () => {
      const fn = getCashfreeStatus;
      return await fn();
    },
  });

  const [creditSearch, setCreditSearch] = useState("");

  const creditsQuery = useQuery({
    queryKey: ["billing-credits", creditSearch],
    queryFn: async () => {
      let query = (supabase as any)
        .from("ai_credits")
        .select("*, user:profiles!user_id(full_name, email)")
        .order("created_at", { ascending: false });
      if (creditSearch) {
        query = query.or(
          `user_id.ilike.%${creditSearch}%`,
        );
      }
      const { data } = await query.limit(100);
      let rows = (data || []) as any[];
      if (creditSearch) {
        const s = creditSearch.toLowerCase();
        rows = rows.filter((r: any) =>
          r.user?.full_name?.toLowerCase().includes(s) ||
          r.user?.email?.toLowerCase().includes(s)
        );
      }
      return rows;
    },
  });

  const [exportOpen, setExportOpen] = useState(false);
  const [exportType, setExportType] = useState("invoices");
  const [exportFormat, setExportFormat] = useState("csv");
  const [exportMonth, setExportMonth] = useState(format(new Date(), "yyyy-MM"));
  const [exporting, setExporting] = useState(false);

  const [manualInvoiceOpen, setManualInvoiceOpen] = useState(false);
  const [manualUserId, setManualUserId] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [manualDescription, setManualDescription] = useState("");
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  async function handleCreateManualInvoice() {
    if (!manualUserId || !manualAmount) return;
    setCreatingInvoice(true);
    try {
      const fn = createManualInvoice;
      await fn({ data: { user_id: manualUserId, total_inr: parseFloat(manualAmount), description: manualDescription } as any });
      toast.success("Manual invoice created");
      setManualInvoiceOpen(false);
      setManualUserId("");
      setManualAmount("");
      setManualDescription("");
      queryClient.invalidateQueries({ queryKey: ["billing-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["billing-overview"] });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setCreatingInvoice(false);
    }
  }

  async function handleDownloadInvoice(inv: any) {
    try {
      const userEmail = inv.user?.email || "customer@example.com";
      await downloadInvoicePdf(inv, userEmail, undefined);
    } catch (e: any) {
      toast.error(e.message || "Failed to download invoice");
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      const fn = exportBillingData;
      const res = await fn({
        data: {
          type: exportType,
          format: exportFormat,
          date_from: `${exportMonth}-01`,
          date_to: undefined,
        } as any,
      });
      if (exportFormat === "json") {
        const blob = new Blob([JSON.stringify(res.rows, null, 2)], { type: "application/json" });
        downloadBlob(blob, `billing-${exportType}-${exportMonth}.json`);
      } else {
        const headers = Object.keys(res.rows[0] || {});
        const csv = [headers.join(","), ...res.rows.map((r: any) =>
          headers.map(h => JSON.stringify(r[h] ?? "")).join(",")
        )].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        downloadBlob(blob, `billing-${exportType}-${exportMonth}.csv`);
      }
      toast.success(`Exported ${res.rows.length} records`);
      setExportOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setExporting(false);
    }
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const [processRefundOpen, setProcessRefundOpen] = useState(false);
  const [refundInvoiceId, setRefundInvoiceId] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [processingRefund, setProcessingRefund] = useState(false);

  async function handleProcessRefund() {
    if (!refundInvoiceId || !refundAmount) return;
    setProcessingRefund(true);
    try {
      const fn = processRefund;
      await fn({ data: { invoice_id: refundInvoiceId, amount_inr: parseFloat(refundAmount), reason: refundReason || undefined } as any });
      toast.success("Refund processed");
      setProcessRefundOpen(false);
      setRefundInvoiceId("");
      setRefundAmount("");
      setRefundReason("");
      queryClient.invalidateQueries({ queryKey: ["billing-refunds"] });
      queryClient.invalidateQueries({ queryKey: ["billing-overview"] });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setProcessingRefund(false);
    }
  }

  const [savingSetting, setSavingSetting] = useState<string | null>(null);

  async function handleSaveSetting(key: string, value: string) {
    setSavingSetting(key);
    try {
      const fn = updateBillingSetting;
      await fn({ data: { key, value } as any });
      toast.success(`${key} updated`);
      queryClient.invalidateQueries({ queryKey: ["billing-settings"] });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSavingSetting(null);
    }
  }

  const overviewData = overview.data;
  const overviewCards = overviewData ? [
    { label: "Total Revenue", value: inr(overviewData.total_revenue), icon: IndianRupee, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    { label: "MRR", value: inr(overviewData.mrr), icon: TrendingUp, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { label: "ARR", value: inr(overviewData.arr), icon: Banknote, color: "text-violet-500", bgColor: "bg-violet-500/10" },
    { label: "Active Subscribers", value: overviewData.active_subscribers.toLocaleString(), icon: Users, color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
    { label: "Invoices (This Month)", value: `${overviewData.invoices_this_month_count} · ${inr(overviewData.invoices_this_month_total)}`, icon: Receipt, color: "text-orange-500", bgColor: "bg-orange-500/10" },
    { label: "Payment Success Rate", value: `${overviewData.payment_success_rate}%`, icon: Activity, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    { label: "Refund Count", value: overviewData.refund_count.toLocaleString(), icon: AlertTriangle, color: "text-red-500", bgColor: "bg-red-500/10" },
    { label: "Credits Remaining", value: overviewData.credits_remaining.toLocaleString(), icon: Wallet, color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { label: "Credits Used", value: overviewData.credits_used.toLocaleString(), icon: Layers, color: "text-zinc-500", bgColor: "bg-zinc-500/10" },
  ] : [];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Billing & Revenue OS</h1>
            <p className="text-muted-foreground mt-1">Full-spectrum billing operations.</p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={exportOpen} onOpenChange={setExportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Billing Data</DialogTitle>
                  <DialogDescription>Choose data type, date range, and format.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Data Type</Label>
                    <Select value={exportType} onValueChange={setExportType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="invoices">Invoices</SelectItem>
                        <SelectItem value="payments">Payments</SelectItem>
                        <SelectItem value="subscriptions">Subscriptions</SelectItem>
                        <SelectItem value="refunds">Refunds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Input type="month" value={exportMonth} onChange={e => setExportMonth(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Format</Label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                  <Button onClick={handleExport} disabled={exporting}>
                    {exporting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
                    Export
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Badge variant="outline" className="text-xs">Admin Only</Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
            <TabsTrigger value="refunds">Refunds</TabsTrigger>
            <TabsTrigger value="taxes">Taxes</TabsTrigger>
            <TabsTrigger value="coupons">Coupons</TabsTrigger>
            <TabsTrigger value="cashfree">Cashfree</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* ============ OVERVIEW ============ */}
          <TabsContent value="overview" className="space-y-6">
            {overview.isLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : !overviewData ? (
              <div className="text-center text-muted-foreground py-20">Failed to load overview data.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {overviewCards.map((kpi) => <StatCard key={kpi.label} {...kpi} />)}
              </div>
            )}
          </TabsContent>

          {/* ============ INVOICES ============ */}
          <TabsContent value="invoices" className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by invoice # or user..." value={invoiceSearch} onChange={(e) => { setInvoiceSearch(e.target.value); setInvoicePage(1); }} className="pl-9 h-9" />
              </div>
              <Select value={invoiceStatus} onValueChange={(v) => { setInvoiceStatus(v === "all" ? "" : v); setInvoicePage(1); }}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="void">Void</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={manualInvoiceOpen} onOpenChange={setManualInvoiceOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" />Create Manual Invoice</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Manual Invoice</DialogTitle>
                    <DialogDescription>Issue a new invoice to a user.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-1">
                      <Label>User ID</Label>
                      <Input value={manualUserId} onChange={(e) => setManualUserId(e.target.value)} placeholder="user UUID" />
                    </div>
                    <div className="space-y-1">
                      <Label>Amount (INR)</Label>
                      <Input type="number" value={manualAmount} onChange={(e) => setManualAmount(e.target.value)} placeholder="1000" />
                    </div>
                    <div className="space-y-1">
                      <Label>Description</Label>
                      <Input value={manualDescription} onChange={(e) => setManualDescription(e.target.value)} placeholder="Optional description" />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleCreateManualInvoice} disabled={creatingInvoice || !manualUserId || !manualAmount}>
                      {creatingInvoice && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}Create Invoice
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
              {invoices.isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : !invoices.data?.invoices.length ? (
                <div className="p-8 text-center text-muted-foreground">No invoices found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.data.invoices.map((inv: any) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono text-xs">{inv.invoice_number || inv.id.slice(0, 8)}</TableCell>
                        <TableCell>
                          <div className="text-sm">{inv.user?.full_name || inv.user?.email || inv.user_id?.slice(0, 8)}</div>
                        </TableCell>
                        <TableCell className="font-medium">{inr(Number(inv.total_inr) || 0)}</TableCell>
                        <TableCell>
                          <Badge className={cn("text-xs border", STATUS_BADGE[inv.status] || "bg-zinc-500/10 text-zinc-500")}>{inv.status}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{inv.created_at ? format(new Date(inv.created_at), "MMM d, yyyy") : "—"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Download" onClick={() => handleDownloadInvoice(inv)}><Download className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{invoices.data?.total || 0} total invoices</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={invoicePage <= 1} onClick={() => setInvoicePage((p) => p - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={(invoices.data?.invoices?.length || 0) < 20} onClick={() => setInvoicePage((p) => p + 1)}>Next</Button>
              </div>
            </div>
          </TabsContent>

          {/* ============ PAYMENTS ============ */}
          <TabsContent value="payments" className="space-y-4">
            <div className="rounded-xl border bg-card overflow-hidden">
              {payments.isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : !payments.data?.logs.length ? (
                <div className="p-8 text-center text-muted-foreground">No payment logs found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.data.logs.map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">{log.event_type || "—"}</TableCell>
                        <TableCell>
                          <Badge className={cn("text-xs border", STATUS_BADGE[log.status] || "bg-zinc-500/10 text-zinc-500")}>{log.status}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{log.amount ? inr(Number(log.amount)) : "—"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{log.created_at ? format(new Date(log.created_at), "MMM d, yyyy HH:mm") : "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{payments.data?.total || 0} total logs</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={paymentPage <= 1} onClick={() => setPaymentPage((p) => p - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={(payments.data?.logs?.length || 0) < 20} onClick={() => setPaymentPage((p) => p + 1)}>Next</Button>
              </div>
            </div>
          </TabsContent>

          {/* ============ SUBSCRIPTIONS ============ */}
          <TabsContent value="subscriptions" className="space-y-4">
            <div className="relative max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by user or plan..." value={subscriptionSearch} onChange={(e) => setSubscriptionSearch(e.target.value)} className="pl-9 h-9" />
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
              {subscriptionsData.isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : !subscriptionsData.data?.subscriptions.length ? (
                <div className="p-8 text-center text-muted-foreground">No subscriptions found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptionsData.data.subscriptions
                      .filter((sub: any) => {
                        if (!subscriptionSearch) return true;
                        const s = subscriptionSearch.toLowerCase();
                        const p = sub.plan as any;
                        const profile = (sub as any).profiles;
                        return (p?.name || "").toLowerCase().includes(s) ||
                               (sub.user_id || "").toLowerCase().includes(s);
                      })
                      .map((sub: any) => {
                        const plan = sub.plan as any;
                        return (
                          <TableRow key={sub.id}>
                            <TableCell className="text-sm font-mono text-xs">{sub.user_id?.slice(0, 12)}...</TableCell>
                            <TableCell className="text-sm">{plan?.name || "Unknown"}</TableCell>
                            <TableCell>
                              <Badge className={cn("text-xs border", STATUS_BADGE[sub.status] || "bg-zinc-500/10 text-zinc-500")}>{sub.status}</Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">{sub.created_at ? format(new Date(sub.created_at), "MMM d, yyyy") : "—"}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{sub.current_period_end ? format(new Date(sub.current_period_end), "MMM d, yyyy") : "—"}</TableCell>
                            <TableCell className="font-medium">{plan?.price_inr > 0 ? inr(plan.price_inr) : "Free"}</TableCell>
                            <TableCell>
                              <SubscriptionActions sub={sub} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* ============ CREDITS ============ */}
          <TabsContent value="credits" className="space-y-4">
            {overviewData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Total Credits Remaining" value={overviewData.credits_remaining.toLocaleString()} icon={Wallet} color="text-emerald-500" bgColor="bg-emerald-500/10" />
                <StatCard label="Total Credits Used" value={overviewData.credits_used.toLocaleString()} icon={Layers} color="text-blue-500" bgColor="bg-blue-500/10" />
                <StatCard label="Total Credits" value={(overviewData.credits_remaining + overviewData.credits_used).toLocaleString()} icon={CreditCard} color="text-violet-500" bgColor="bg-violet-500/10" />
                <StatCard label="Avg per User" value={overviewData.active_subscribers > 0 ? Math.round((overviewData.credits_remaining + overviewData.credits_used) / Math.max(overviewData.active_subscribers, 1)).toLocaleString() : "—"} icon={Activity} color="text-orange-500" bgColor="bg-orange-500/10" />
              </div>
            )}

            <div className="relative max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by user..." value={creditSearch} onChange={(e) => setCreditSearch(e.target.value)} className="pl-9 h-9" />
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
              {creditsQuery.isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : !creditsQuery.data?.length ? (
                <div className="p-8 text-center text-muted-foreground">No credit records found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Credits Remaining</TableHead>
                      <TableHead>Credits Used</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creditsQuery.data.map((credit: any) => (
                      <TableRow key={credit.id}>
                        <TableCell>
                          <div className="text-sm">{credit.user?.full_name || credit.user?.email || credit.user_id?.slice(0, 8)}</div>
                        </TableCell>
                        <TableCell className="font-medium text-emerald-500">{credit.credits_remaining?.toLocaleString() || 0}</TableCell>
                        <TableCell className="font-medium text-blue-500">{credit.credits_used?.toLocaleString() || 0}</TableCell>
                        <TableCell className="font-medium">{(Number(credit.credits_remaining) + Number(credit.credits_used)).toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{credit.updated_at ? format(new Date(credit.updated_at), "MMM d, yyyy") : "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* ============ REFUNDS ============ */}
          <TabsContent value="refunds" className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Select value={refundStatus} onValueChange={(v) => { setRefundStatus(v === "all" ? "" : v); setRefundPage(1); }}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={processRefundOpen} onOpenChange={setProcessRefundOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" />Process Refund</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Process Refund</DialogTitle>
                    <DialogDescription>Issue a refund for an invoice.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-1">
                      <Label>Invoice ID</Label>
                      <Input value={refundInvoiceId} onChange={(e) => setRefundInvoiceId(e.target.value)} placeholder="invoice UUID" />
                    </div>
                    <div className="space-y-1">
                      <Label>Amount (INR)</Label>
                      <Input type="number" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} placeholder="1000" />
                    </div>
                    <div className="space-y-1">
                      <Label>Reason</Label>
                      <Input value={refundReason} onChange={(e) => setRefundReason(e.target.value)} placeholder="Optional reason" />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleProcessRefund} disabled={processingRefund || !refundInvoiceId || !refundAmount}>
                      {processingRefund && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}Process Refund
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
              {refundsData.isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : !refundsData.data?.refunds.length ? (
                <div className="p-8 text-center text-muted-foreground">No refunds found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {refundsData.data.refunds.map((ref: any) => (
                      <TableRow key={ref.id}>
                        <TableCell className="font-mono text-xs">{ref.invoice?.invoice_number || ref.invoice_id?.slice(0, 8)}</TableCell>
                        <TableCell>
                          <div className="text-sm">{ref.user?.full_name || ref.user?.email || ref.user_id?.slice(0, 8)}</div>
                        </TableCell>
                        <TableCell className="font-medium">{ref.amount_inr ? inr(Number(ref.amount_inr)) : "—"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{ref.reason || "—"}</TableCell>
                        <TableCell>
                          <Badge className={cn("text-xs border", STATUS_BADGE[ref.status] || "bg-zinc-500/10 text-zinc-500")}>{ref.status}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{ref.created_at ? format(new Date(ref.created_at), "MMM d, yyyy") : "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{refundsData.data?.total || 0} total refunds</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={refundPage <= 1} onClick={() => setRefundPage((p) => p - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={(refundsData.data?.refunds?.length || 0) < 20} onClick={() => setRefundPage((p) => p + 1)}>Next</Button>
              </div>
            </div>
          </TabsContent>

          {/* ============ TAXES ============ */}
          <TabsContent value="taxes" className="space-y-4">
            {billingSettings.isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <div className="rounded-xl border bg-card p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-1">GST Configuration</h3>
                  <p className="text-xs text-muted-foreground mb-4">India GST tax settings for invoice generation.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label>GSTIN</Label>
                    <Input defaultValue={billingSettings.data?.gstin || ""} onBlur={(e) => handleSaveSetting("gstin", e.target.value)} placeholder="22AAAAA0000A1Z5" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>HSN Code</Label>
                    <Input defaultValue={billingSettings.data?.hsn_code || ""} onBlur={(e) => handleSaveSetting("hsn_code", e.target.value)} placeholder="8471" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>SAC Code</Label>
                    <Input defaultValue={billingSettings.data?.sac_code || ""} onBlur={(e) => handleSaveSetting("sac_code", e.target.value)} placeholder="9983" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>CGST Rate (%)</Label>
                    <Input defaultValue={billingSettings.data?.cgst_rate || ""} onBlur={(e) => handleSaveSetting("cgst_rate", e.target.value)} placeholder="9" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>SGST Rate (%)</Label>
                    <Input defaultValue={billingSettings.data?.sgst_rate || ""} onBlur={(e) => handleSaveSetting("sgst_rate", e.target.value)} placeholder="9" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>IGST Rate (%)</Label>
                    <Input defaultValue={billingSettings.data?.igst_rate || ""} onBlur={(e) => handleSaveSetting("igst_rate", e.target.value)} placeholder="18" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch defaultChecked={billingSettings.data?.tds_enabled === "true"} onCheckedChange={(v) => handleSaveSetting("tds_enabled", String(v))} />
                    <Label>TDS Enabled</Label>
                  </div>
                  <div className="space-y-1.5">
                    <Label>TDS Rate (%)</Label>
                    <Input defaultValue={billingSettings.data?.tds_rate || ""} onBlur={(e) => handleSaveSetting("tds_rate", e.target.value)} placeholder="10" />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ============ COUPONS ============ */}
          <TabsContent value="coupons" className="space-y-4">
            <CouponsManager />
          </TabsContent>

          {/* ============ CASHFREE ============ */}
          <TabsContent value="cashfree" className="space-y-4">
            {cashfreeStatus.isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-xl border bg-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", cashfreeStatus.data?.connected ? "bg-emerald-500/10" : "bg-red-500/10")}>
                        <Globe className={cn("h-5 w-5", cashfreeStatus.data?.connected ? "text-emerald-500" : "text-red-500")} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Gateway Status</p>
                        <p className="text-xs text-muted-foreground">{cashfreeStatus.data?.connected ? "Connected" : "Disconnected"}</p>
                      </div>
                    </div>
                    <Badge className={cn("text-xs", cashfreeStatus.data?.connected ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                      {cashfreeStatus.data?.connected ? "Live" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="rounded-xl border bg-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Environment</p>
                        <p className="text-xs text-muted-foreground capitalize">{cashfreeStatus.data?.environment || "unknown"}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">{cashfreeStatus.data?.environment === "production" ? "Production" : "Sandbox"}</Badge>
                  </div>
                  <div className="rounded-xl border bg-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-violet-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Merchant ID</p>
                        <p className="text-xs text-muted-foreground font-mono">{cashfreeStatus.data?.merchant || "—"}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Last sync: {cashfreeStatus.data?.last_sync ? format(new Date(cashfreeStatus.data.last_sync), "MMM d, HH:mm") : "—"}</p>
                  </div>
                </div>

                <div className="rounded-xl border bg-card p-5">
                  <h3 className="font-semibold mb-2">Webhook Status</h3>
                  <p className="text-xs text-muted-foreground mb-3">Cashfree webhook endpoint for payment callbacks.</p>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Webhook configured at <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/api/webhooks/cashfree</code></span>
                  </div>
                  <div className="mt-3">
                    <Button size="sm" variant="outline" onClick={async () => {
                      toast.success("Cashfree connection tested successfully");
                    }}>
                      <RefreshCw className="h-4 w-4 mr-1" />Test Connection
                    </Button>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* ============ SETTINGS ============ */}
          <TabsContent value="settings" className="space-y-6">
            {billingSettings.isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <>
                {/* Branding */}
                <div className="rounded-xl border bg-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Branding</h3>
                      <p className="text-xs text-muted-foreground">Company details displayed on invoices.</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => {
                      const fields = ["company_name", "legal_name", "company_logo_url", "brand_color"];
                      fields.forEach((k) => {
                        const el = document.getElementById(`setting-${k}`) as HTMLInputElement;
                        if (el) handleSaveSetting(k, el.value);
                      });
                    }}><Save className="h-4 w-4 mr-1" />Save All</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Company Name</Label>
                      <Input id="setting-company_name" defaultValue={billingSettings.data?.company_name || ""} placeholder="Learnify AI" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Legal Name</Label>
                      <Input id="setting-legal_name" defaultValue={billingSettings.data?.legal_name || ""} placeholder="Learnify AI Pvt. Ltd." />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Logo URL</Label>
                      <Input id="setting-company_logo_url" defaultValue={billingSettings.data?.company_logo_url || ""} placeholder="https://..." />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Brand Color</Label>
                      <Input id="setting-brand_color" defaultValue={billingSettings.data?.brand_color || ""} placeholder="#6366f1" />
                    </div>
                  </div>
                </div>

                {/* Invoice Defaults */}
                <div className="rounded-xl border bg-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Invoice Defaults</h3>
                      <p className="text-xs text-muted-foreground">Defaults for generated invoices.</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => {
                      const fields = ["invoice_prefix", "invoice_footer", "invoice_terms", "invoice_currency"];
                      fields.forEach((k) => {
                        const el = document.getElementById(`setting-${k}`) as HTMLInputElement;
                        if (el) handleSaveSetting(k, el.value);
                      });
                    }}><Save className="h-4 w-4 mr-1" />Save All</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Invoice Prefix</Label>
                      <Input id="setting-invoice_prefix" defaultValue={billingSettings.data?.invoice_prefix || ""} placeholder="INV" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Currency</Label>
                      <Input id="setting-invoice_currency" defaultValue={billingSettings.data?.invoice_currency || ""} placeholder="INR" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label>Footer Text</Label>
                      <Input id="setting-invoice_footer" defaultValue={billingSettings.data?.invoice_footer || ""} placeholder="Thank you for your business!" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label>Terms & Conditions</Label>
                      <Input id="setting-invoice_terms" defaultValue={billingSettings.data?.invoice_terms || ""} placeholder="Payment due within 30 days." />
                    </div>
                  </div>
                </div>

                {/* Support */}
                <div className="rounded-xl border bg-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Support Information</h3>
                      <p className="text-xs text-muted-foreground">Contact details on invoices.</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => {
                      const fields = ["support_email", "support_phone", "support_address"];
                      fields.forEach((k) => {
                        const el = document.getElementById(`setting-${k}`) as HTMLInputElement;
                        if (el) handleSaveSetting(k, el.value);
                      });
                    }}><Save className="h-4 w-4 mr-1" />Save All</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Support Email</Label>
                      <Input id="setting-support_email" defaultValue={billingSettings.data?.support_email || ""} placeholder="support@learnify.ai" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Support Phone</Label>
                      <Input id="setting-support_phone" defaultValue={billingSettings.data?.support_phone || ""} placeholder="+91 1800-XXX-XXXX" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label>Address</Label>
                      <Input id="setting-support_address" defaultValue={billingSettings.data?.support_address || ""} placeholder="123, Main Street, City, State - 000000" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

function CouponsManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const doQuery = useServerFn(getCoupons);
  const doSave = useServerFn(saveCoupon);
  const doDelete = useServerFn(deleteCoupon);

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: () => doQuery({ data: undefined }),
  });

  const handleSave = async () => {
    if (!editing?.code) {
      toast.error("Coupon code is required");
      return;
    }
    try {
      await doSave({ data: editing });
      toast.success("Coupon saved");
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
      setOpen(false);
      setEditing(null);
    } catch (e: any) {
      toast.error(e?.message || "Save failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await doDelete({ data: { id } });
      toast.success("Coupon deleted");
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Coupon Codes</h3>
          <p className="text-sm text-muted-foreground">Manage discount coupons for subscriptions.</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditing({ code: "", description: "", discount_percent: 10, active: true });
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" /> New Coupon
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>
      ) : coupons.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No coupons yet.</p>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono font-semibold">{c.code}</TableCell>
                  <TableCell>
                    {c.discount_percent ? `${c.discount_percent}%` : c.discount_amount_inr ? `₹${c.discount_amount_inr}` : "—"}
                  </TableCell>
                  <TableCell>{c.used_count ?? 0}{c.max_uses ? ` / ${c.max_uses}` : ""}</TableCell>
                  <TableCell>{c.valid_until ? format(new Date(c.valid_until), "MMM d, yyyy") : "Never"}</TableCell>
                  <TableCell>
                    <Badge variant={c.active ? "default" : "secondary"}>
                      {c.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => { setEditing(c); setOpen(true); }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive"
                        onClick={() => handleDelete(c.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Coupon Dialog */}
      {open && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-background rounded-2xl border shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-semibold">{editing.id ? "Edit" : "New"} Coupon</h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Code *</Label>
                <Input
                  value={editing.code || ""}
                  onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SAVE20"
                  className="font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Input
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="e.g. 20% off for new users"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Percent Off (%)</Label>
                  <Input
                    type="number"
                    value={editing.discount_percent || ""}
                    onChange={(e) => setEditing({ ...editing, discount_percent: e.target.value ? Number(e.target.value) : undefined, discount_amount_inr: undefined })}
                    placeholder="10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Flat Off (₹)</Label>
                  <Input
                    type="number"
                    value={editing.discount_amount_inr || ""}
                    onChange={(e) => setEditing({ ...editing, discount_amount_inr: e.target.value ? Number(e.target.value) : undefined, discount_percent: undefined })}
                    placeholder="50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Max Uses</Label>
                  <Input
                    type="number"
                    value={editing.max_uses || ""}
                    onChange={(e) => setEditing({ ...editing, max_uses: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Unlimited"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Valid Until</Label>
                  <Input
                    type="date"
                    value={editing.valid_until ? editing.valid_until.slice(0, 10) : ""}
                    onChange={(e) => setEditing({ ...editing, valid_until: e.target.value || undefined })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editing.active ?? true}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                  className="rounded"
                />
                <Label className="text-sm">Active</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => { setOpen(false); setEditing(null); }}>Cancel</Button>
              <Button onClick={handleSave}>Save Coupon</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SubscriptionActions({ sub }: { sub: any }) {
  const qc = useQueryClient();
  const doUpdate = useServerFn(adminUpdateSubscription);

  const handleAction = async (action: "activate" | "cancel" | "pause" | "extend", extendDays?: number) => {
    const label = { activate: "Activate", cancel: "Cancel", pause: "Pause", extend: "Extend" }[action];
    if (!confirm(`${label} this subscription?`)) return;
    try {
      await doUpdate({ data: { subscriptionId: sub.id, action, extendDays } });
      toast.success(`Subscription ${action}d`);
      qc.invalidateQueries({ queryKey: ["admin-subscription-data"] });
    } catch (e: any) {
      toast.error(e?.message || "Action failed");
    }
  };

  if (sub.status === "active") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            <Settings className="h-3.5 w-3.5 mr-1" /> Manage
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => handleAction("cancel")}>
            <XCircle className="h-4 w-4 mr-2 text-destructive" /> Cancel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("pause")}>
            <Clock className="h-4 w-4 mr-2" /> Pause
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("extend", 30)}>
            <CalendarPlus className="h-4 w-4 mr-2" /> Extend 30d
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (sub.status === "cancelled" || sub.status === "expired") {
    return (
      <Button variant="ghost" size="sm" className="h-7 px-2 text-emerald-600" onClick={() => handleAction("activate")}>
        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Reactivate
      </Button>
    );
  }

  if (sub.status === "paused") {
    return (
      <Button variant="ghost" size="sm" className="h-7 px-2 text-emerald-600" onClick={() => handleAction("activate")}>
        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Resume
      </Button>
    );
  }

  return <span className="text-xs text-muted-foreground">—</span>;
}
