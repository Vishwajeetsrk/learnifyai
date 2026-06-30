import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { downloadInvoicePdf } from "@/lib/invoice-pdf";
import {
  CreditCard, Receipt, ArrowUpRight, ArrowDownRight, Calendar, Loader2,
  ExternalLink, Check, X, AlertTriangle, Sparkles, Clock, Download, Search,
  Filter, Printer, Share2, Mail, Eye, FileText, IndianRupee, Wallet,
  Banknote, TrendingUp, Users, Activity, ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import {
  cancelSubscription, resumeSubscription,
} from "@/lib/subscription.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { BillingSkeleton } from "@/components/Skeletons";

export const Route = createFileRoute("/_authenticated/billing")({
  head: () => ({ meta: [{ title: "Billing — Learnify AI" }] }),
  component: BillingPage,
});

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  expired: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  past_due: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  paused: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

const INVOICE_STATUS_COLORS: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 ring-yellow-500/20",
  failed: "bg-red-500/10 text-red-500 ring-red-500/20",
  refunded: "bg-blue-500/10 text-blue-500 ring-blue-500/20",
  void: "bg-zinc-500/10 text-zinc-500 ring-zinc-500/20",
};

const PAYMENT_ICONS: Record<string, typeof CreditCard> = {
  card: CreditCard, upi: Banknote, net_banking: Banknote, wallet: Wallet, enach: CreditCard, default: CreditCard,
};

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function BillingPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<any>(null);
  const [invoiceFilter, setInvoiceFilter] = useState<string>("all");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const doCancel = useServerFn(cancelSubscription);
  const doResume = useServerFn(resumeSubscription);

  async function downloadInvoice(inv: any) {
    if (!user) return;
    try {
      const [profileBrand, siteSettings] = await Promise.all([
        supabase.from("profiles").select("invoice_company_name,invoice_legal_name,invoice_gstin,invoice_prefix,invoice_footer,invoice_logo_url,invoice_contact,org_name,org_logo_url").eq("id", user.id).maybeSingle(),
        supabase.from("site_settings").select("key,value").in("key", ["invoice_company_name","invoice_legal_name","invoice_gstin","invoice_prefix","invoice_footer","invoice_logo_url","invoice_contact"]),
      ]);
      const pb = profileBrand.data;
      const ss: Record<string, string> = {};
      for (const r of siteSettings.data ?? []) ss[r.key] = r.value || "";
      await downloadInvoicePdf(inv, user.email ?? "Customer", {
        company_name: pb?.invoice_company_name || ss.invoice_company_name,
        legal_name: pb?.invoice_legal_name || ss.invoice_legal_name,
        gstin: pb?.invoice_gstin || ss.invoice_gstin,
        prefix: pb?.invoice_prefix || ss.invoice_prefix,
        footer: pb?.invoice_footer || ss.invoice_footer,
        logo_url: pb?.invoice_logo_url || pb?.org_logo_url || ss.invoice_logo_url,
        contact: pb?.invoice_contact || ss.invoice_contact,
      });
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to generate invoice");
    }
  }

  function printInvoice(inv: any) {
    downloadInvoice(inv).then(() => {
      setTimeout(() => {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        if (iframe.contentWindow) iframe.contentWindow.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
      }, 500);
    });
  }

  async function emailInvoice(inv: any) {
    if (!user?.email) { toast.error("No email on file"); return; }
    try {
      await navigator.clipboard.writeText(`Invoice ${inv.invoice_number}: ${window.location.origin}/invoices/${inv.id}`);
      toast.success("Invoice link copied — you can email it to yourself");
    } catch {
      toast.success(`Invoice #${inv.invoice_number} — shareable link ready`);
    }
  }

  async function shareInvoice(inv: any) {
    const url = `${window.location.origin}/invoices/${inv.id}`;
    try {
      if (navigator.share) { await navigator.share({ title: `Invoice ${inv.invoice_number}`, text: `Invoice from Learnify AI: ${inv.invoice_number}`, url }); }
      else { await navigator.clipboard.writeText(url); toast.success("Invoice link copied"); }
    } catch { await navigator.clipboard.writeText(url); toast.success("Invoice link copied"); }
  }

  const currentSub = useQuery({
    enabled: !!user, queryKey: ["my-subscription", user?.id],
    queryFn: async () => {
      const { data } = await (supabase as any).from("user_subscriptions").select("*, plan:pricing_plans(*)").eq("user_id", user!.id).eq("status", "active").maybeSingle();
      return data || null;
    },
  });

  const invoices = useQuery({
    enabled: !!user, queryKey: ["my-invoices", user?.id],
    queryFn: async () => {
      const { data } = await (supabase as any).from("invoices").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(100);
      return data || [];
    },
  });

  const history = useQuery({
    enabled: !!user, queryKey: ["sub-history", user?.id],
    queryFn: async () => {
      const { data } = await (supabase as any).from("user_subscriptions").select("*, plan:pricing_plans(name, price_inr, interval)").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(20);
      return data || [];
    },
  });

  const credits = useQuery({
    enabled: !!user, queryKey: ["ai-credits", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("ai_credits").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
  });

  const creditPurchases = useQuery({
    enabled: !!user, queryKey: ["credit-purchases", user?.id],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("payment_logs")
        .select("*")
        .eq("user_id", user!.id)
        .or("event_type.ilike.%credit%,event_type.ilike.%topup%")
        .order("created_at", { ascending: false })
        .limit(20);
      return data || [];
    },
  });

  const handleCancel = async () => {
    try {
      await doCancel({ data: {} });
      toast.success("Subscription cancelled. Access continues until period end.");
      setCancelDialogOpen(false);
      qc.invalidateQueries({ queryKey: ["my-subscription"] });
    } catch (e: any) { toast.error(e?.message || "Failed to cancel subscription"); }
  };

  const handleResume = async () => {
    try {
      await doResume({ data: {} });
      toast.success("Subscription resumed!");
      setResumeDialogOpen(false);
      qc.invalidateQueries({ queryKey: ["my-subscription"] });
    } catch (e: any) { toast.error(e?.message || "Failed to resume subscription"); }
  };

  const sub = currentSub.data;
  const plan = sub?.plan as any;
  const isActive = sub?.status === "active";
  const isCancelled = sub?.status === "cancelled";
  const isPaused = sub?.status === "paused";
  const isPastDue = sub?.status === "past_due";
  const canResume = isCancelled || isPaused;

  const filteredInvoices = (invoices.data || []).filter((inv: any) => {
    if (invoiceFilter !== "all" && inv.status !== invoiceFilter) return false;
    if (invoiceSearch && !inv.invoice_number?.toLowerCase().includes(invoiceSearch.toLowerCase())) return false;
    return true;
  });

  const invStats = {
    total: invoices.data?.length || 0,
    paid: (invoices.data || []).filter((i: any) => i.status === "paid").length,
    pending: (invoices.data || []).filter((i: any) => i.status === "pending").length,
    totalPaid: (invoices.data || []).filter((i: any) => i.status === "paid").reduce((s: number, i: any) => s + Number(i.total_inr || 0), 0),
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="w-28 h-28 shrink-0 hidden sm:block">
              <img src="/illustrations/Payment_Card_Security_animation_Floating_Cards_Morphing_into_Padlock.svg" alt="Billing" className="w-full h-full" loading="lazy" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Billing & Subscription</h1>
              <p className="text-muted-foreground mt-1">Manage your plan, invoices, payments, and billing history.</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">{invStats.total} invoices</Badge>
        </div>

        {/* Invoice Stats */}
        {invStats.total > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">Total</p><p className="text-xl font-bold">{invStats.total}</p></div>
            <div className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">Paid</p><p className="text-xl font-bold text-emerald-500">{invStats.paid}</p></div>
            <div className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">Pending</p><p className="text-xl font-bold text-yellow-500">{invStats.pending}</p></div>
            <div className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">Total Paid</p><p className="text-xl font-bold">{inr(invStats.totalPaid)}</p></div>
          </div>
        )}

        {/* Current Plan Card */}
        <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><CreditCard className="h-5 w-5 text-primary" /></div>
              <div>
                <h2 className="text-lg font-semibold">{plan?.name || "Starter"} Plan</h2>
                <p className="text-sm text-muted-foreground">{plan?.price_inr > 0 ? `${inr(plan.price_inr)}/${plan.interval?.startsWith("month") ? "mo" : plan.interval}` : "Free forever"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isActive && <Badge className={cn("border", STATUS_COLORS.active)}><Check className="h-3 w-3 mr-1" /> Active</Badge>}
              {isPastDue && <Badge className={cn("border", STATUS_COLORS.past_due)}><AlertTriangle className="h-3 w-3 mr-1" /> Past Due</Badge>}
              {isCancelled && <Badge className={cn("border", STATUS_COLORS.cancelled)}><X className="h-3 w-3 mr-1" /> Cancelled</Badge>}
              {isPaused && <Badge className={cn("border", STATUS_COLORS.paused)}><Clock className="h-3 w-3 mr-1" /> Paused</Badge>}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div><p className="text-xs text-muted-foreground">AI Credits</p><p className="text-lg font-bold">{(credits.data?.credits_remaining || 0).toLocaleString("en-IN")}</p><p className="text-xs text-muted-foreground">remaining</p></div>
            <div><p className="text-xs text-muted-foreground">Renewal Date</p><p className="text-lg font-bold">{sub?.current_period_end ? format(new Date(sub.current_period_end), "MMM d, yyyy") : "—"}</p></div>
            <div><p className="text-xs text-muted-foreground">Courses</p><p className="text-lg font-bold">{plan?.max_courses === -1 ? "Unlimited" : plan?.max_courses || 3}</p></div>
            <div><p className="text-xs text-muted-foreground">Member Since</p><p className="text-lg font-bold">{sub?.created_at ? format(new Date(sub.created_at), "MMM d, yyyy") : "—"}</p></div>
          </div>
          <div className="flex items-center gap-3 pt-4 border-t">
            {isActive && plan?.price_inr > 0 && <>
              <Button asChild variant="outline" size="sm"><Link to="/pricing" search={{ subscribe: undefined }}><ArrowUpRight className="h-4 w-4 mr-1" /> Upgrade Plan</Link></Button>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => setCancelDialogOpen(true)}><X className="h-4 w-4 mr-1" /> Cancel</Button>
            </>}
            {canResume && <Button variant="outline" size="sm" onClick={() => setResumeDialogOpen(true)}><ArrowUpRight className="h-4 w-4 mr-1" /> Resume</Button>}
            {!isActive && !canResume && <Button asChild variant="outline" size="sm"><Link to="/pricing" search={{ subscribe: undefined }}><Sparkles className="h-4 w-4 mr-1" /> Choose a Plan</Link></Button>}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList>
            <TabsTrigger value="invoices" className="gap-2"><Receipt className="h-4 w-4" /> Invoices</TabsTrigger>
            <TabsTrigger value="history" className="gap-2"><Clock className="h-4 w-4" /> Subscription History</TabsTrigger>
            <TabsTrigger value="credits" className="gap-2"><Wallet className="h-4 w-4" /> Credits</TabsTrigger>
          </TabsList>

          {/* ──────── Invoices Tab ──────── */}
          <TabsContent value="invoices">
            <div className="rounded-2xl border bg-card overflow-hidden shadow-card">
              <div className="p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {["all","paid","pending","failed","refunded","void"].map((s) => (
                    <button key={s} onClick={() => setInvoiceFilter(s)}
                      className={cn("px-3 py-1 text-xs rounded-full border transition-colors", invoiceFilter === s ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40")}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input placeholder="Search invoice #..." value={invoiceSearch} onChange={(e) => setInvoiceSearch(e.target.value)} className="pl-8 h-8 text-xs" />
                </div>
              </div>
              {invoices.isLoading ? (
                <div className="divide-y">{Array.from({ length: 3 }).map((_, i) => (<div key={i} className="flex items-center justify-between px-4 py-3"><div className="space-y-1"><div className="h-4 w-24 rounded bg-muted animate-pulse" /><div className="h-3 w-20 rounded bg-muted animate-pulse" /></div><div className="h-4 w-16 rounded bg-muted animate-pulse" /></div>))}</div>
              ) : filteredInvoices.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground"><Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" /><p>{invoiceSearch || invoiceFilter !== "all" ? "No matching invoices" : "No invoices yet"}</p></div>
              ) : (
                <div className="divide-y">
                  {filteredInvoices.map((inv: any) => (
                    <div key={inv.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 group">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="min-w-0">
                          <p className="font-mono text-sm font-medium truncate">{inv.invoice_number}</p>
                          <p className="text-xs text-muted-foreground">{inv.created_at ? format(new Date(inv.created_at), "MMM d, yyyy") : "—"}{inv.due_date && <> · Due {format(new Date(inv.due_date), "MMM d")}</>}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <Badge className={cn("text-xs ring-1", INVOICE_STATUS_COLORS[inv.status] || "bg-zinc-500/10 text-zinc-500")}>{inv.status}</Badge>
                        <span className="font-semibold text-sm hidden sm:block">{inr(inv.total_inr)}</span>
                        <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewInvoice(inv)} title="View"><Eye className="h-3.5 w-3.5" /></Button>
                          {inv.status === "paid" && <>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => downloadInvoice(inv)} title="Download PDF"><Download className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => emailInvoice(inv)} title="Email"><Mail className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 hidden sm:inline-flex" onClick={() => shareInvoice(inv)} title="Share"><Share2 className="h-3.5 w-3.5" /></Button>
                          </>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ──────── History Tab ──────── */}
          <TabsContent value="history">
            <div className="rounded-2xl border bg-card overflow-hidden shadow-card">
              <div className="p-4 border-b"><h3 className="font-semibold">Subscription History</h3></div>
              {history.isLoading ? (
                <div className="divide-y">{Array.from({ length: 3 }).map((_, i) => (<div key={i} className="flex items-center justify-between px-4 py-3"><div className="space-y-1"><div className="h-4 w-28 rounded bg-muted animate-pulse" /><div className="h-3 w-20 rounded bg-muted animate-pulse" /></div><div className="h-5 w-16 rounded-full bg-muted animate-pulse" /></div>))}</div>
              ) : !history.data?.length ? (
                <div className="p-8 text-center text-muted-foreground"><Clock className="h-12 w-12 mx-auto mb-3 opacity-50" /><p>No subscription history</p></div>
              ) : (
                <div className="divide-y max-h-[500px] overflow-y-auto">
                  {history.data.map((subEntry: any) => (
                    <div key={subEntry.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium text-sm">{(subEntry.plan as any)?.name || "Unknown Plan"}</p>
                          <p className="text-xs text-muted-foreground">{subEntry.created_at ? format(new Date(subEntry.created_at), "MMM d, yyyy") : "—"}
                            {subEntry.current_period_end && <> · until {format(new Date(subEntry.current_period_end), "MMM d, yyyy")}</>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={cn("text-xs border", STATUS_COLORS[subEntry.status] || "bg-zinc-500/10 text-zinc-500")}>{subEntry.status}</Badge>
                        <span className="text-sm text-muted-foreground">{(subEntry.plan as any)?.price_inr > 0 ? inr((subEntry.plan as any).price_inr) : "Free"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ──────── Credits Tab ──────── */}
          <TabsContent value="credits">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl border bg-card p-5 shadow-card"><Wallet className="h-5 w-5 text-primary" /><p className="mt-3 text-2xl font-bold">{(credits.data?.credits_remaining || 0).toLocaleString("en-IN")}</p><p className="text-xs text-muted-foreground mt-1">Credits Remaining</p></div>
              <div className="rounded-xl border bg-card p-5 shadow-card"><Activity className="h-5 w-5 text-orange-500" /><p className="mt-3 text-2xl font-bold">{(credits.data?.credits_used || 0).toLocaleString("en-IN")}</p><p className="text-xs text-muted-foreground mt-1">Credits Used</p></div>
              <div className="rounded-xl border bg-card p-5 shadow-card"><TrendingUp className="h-5 w-5 text-emerald-500" /><p className="mt-3 text-2xl font-bold">{(((credits.data?.credits_used || 0) / Math.max((credits.data?.credits_remaining || 0) + (credits.data?.credits_used || 0), 1)) * 100).toFixed(1)}%</p><p className="text-xs text-muted-foreground mt-1">Usage Rate</p></div>
            </div>
            <div className="rounded-2xl border bg-card overflow-hidden shadow-card">
              <div className="p-4 border-b"><h3 className="font-semibold">Credit Purchase History</h3></div>
              {creditPurchases.isLoading ? (
                <div className="p-8 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div>
              ) : !creditPurchases.data?.length ? (
                <div className="p-8 text-center text-muted-foreground"><Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" /><p>No credit purchases yet</p></div>
              ) : (
                <div className="divide-y max-h-[400px] overflow-y-auto">
                  {creditPurchases.data.map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">{p.event_type || "Credit Purchase"}</p>
                        <p className="text-xs text-muted-foreground">{p.created_at ? format(new Date(p.created_at), "MMM d, yyyy · HH:mm") : "—"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {p.amount && <span className="text-sm font-semibold">{inr(p.amount)}</span>}
                        <Badge variant="outline" className={cn("text-xs", p.status === "completed" || p.status === "processed" ? "text-emerald-500 border-emerald-500/20" : "text-yellow-500 border-yellow-500/20")}>{p.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ──────── Invoice Detail Dialog ──────── */}
      <Dialog open={!!viewInvoice} onOpenChange={(v) => !v && setViewInvoice(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-mono text-base">{viewInvoice?.invoice_number}</DialogTitle>
            <DialogDescription>
              {viewInvoice?.created_at && format(new Date(viewInvoice.created_at), "MMMM d, yyyy")}
              {viewInvoice?.status === "paid" && viewInvoice?.paid_at && <> · Paid {format(new Date(viewInvoice.paid_at), "MMM d, yyyy")}</>}
            </DialogDescription>
          </DialogHeader>
          {viewInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Status</span><Badge className={cn("ml-2 text-xs", INVOICE_STATUS_COLORS[viewInvoice.status])}>{viewInvoice.status}</Badge></div>
                <div><span className="text-muted-foreground">Amount</span><span className="ml-2 font-bold">{inr(viewInvoice.total_inr)}</span></div>
                <div><span className="text-muted-foreground">Subtotal</span><span className="ml-2">{inr(viewInvoice.amount_inr)}</span></div>
                <div><span className="text-muted-foreground">Tax (GST)</span><span className="ml-2">{inr(viewInvoice.tax_inr)}</span></div>
                {viewInvoice.due_date && <div><span className="text-muted-foreground">Due Date</span><span className="ml-2">{format(new Date(viewInvoice.due_date), "MMM d, yyyy")}</span></div>}
                {viewInvoice.payment_method && <div><span className="text-muted-foreground">Payment</span><span className="ml-2 capitalize">{viewInvoice.payment_method}</span></div>}
                {viewInvoice.gstin && <div className="col-span-2"><span className="text-muted-foreground">GSTIN</span><span className="ml-2 font-mono text-xs">{viewInvoice.gstin}</span></div>}
              </div>
              {viewInvoice.line_items && Array.isArray(viewInvoice.line_items) && viewInvoice.line_items.length > 0 && (
                <div className="border-t pt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Line Items</p>
                  <div className="space-y-1">{viewInvoice.line_items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm"><span>{item.description || "Item"}</span><span>{inr(item.amount || viewInvoice.amount_inr)}</span></div>
                  ))}</div>
                </div>
              )}
              {viewInvoice.notes && <div className="border-t pt-3 text-sm"><span className="text-muted-foreground">Notes:</span><p className="mt-1">{viewInvoice.notes}</p></div>}
              <div className="flex items-center gap-2 pt-2">
                {viewInvoice.status === "paid" && (
                  <Button size="sm" className="flex-1" onClick={() => { downloadInvoice(viewInvoice); setViewInvoice(null); }}><Download className="h-4 w-4 mr-1" /> Download PDF</Button>
                )}
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setViewInvoice(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Cancel Subscription</DialogTitle><DialogDescription>Your subscription will remain active until the end of the current billing period. After that, you'll be downgraded to the Starter plan.</DialogDescription></DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><Check className="h-4 w-4 text-emerald-500" /> Access continues until {sub?.current_period_end ? format(new Date(sub.current_period_end), "MMM d, yyyy") : "period end"}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Check className="h-4 w-4 text-emerald-500" /> You can resume anytime before the period ends</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Check className="h-4 w-4 text-emerald-500" /> Your data and progress are saved</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>Keep Subscription</Button>
            <Button variant="destructive" onClick={handleCancel}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resume Dialog */}
      <Dialog open={resumeDialogOpen} onOpenChange={setResumeDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Resume Subscription</DialogTitle><DialogDescription>Your subscription will be reactivated and billing will resume at the next cycle.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResumeDialogOpen(false)}>Not Now</Button>
            <Button onClick={handleResume}><ArrowUpRight className="h-4 w-4 mr-1" /> Resume</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
