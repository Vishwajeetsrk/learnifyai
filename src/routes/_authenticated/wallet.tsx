import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Wallet as WalletIcon,
  Plus,
  IndianRupee,
  CreditCard,
  ArrowDownToLine,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Clock3,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { useServerFn } from "@tanstack/react-start";
import {
  createCashfreeOrder,
  verifyCashfreePayment,
  processCashfreePayout,
} from "@/lib/payment.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/wallet")({
  head: () => ({ meta: [{ title: "Wallet — Learnify AI" }] }),
  component: WalletPage,
});

const loadCashfree = () =>
  new Promise((resolve) => {
    if ((window as any).Cashfree) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

function WalletPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>("500");
  const [submitting, setSubmitting] = useState(false);
  const createOrder = useServerFn(createCashfreeOrder);
  const verifyTopup = useServerFn(verifyCashfreePayment);

  const txQuery = useQuery({
    enabled: !!user,
    queryKey: ["wallet-tx", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("id, amount_inr, type, status, description, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel("wallet-live-" + user.id)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wallet_transactions",
          filter: `user_id=eq.${user.id}`,
        },
        () => qc.invalidateQueries({ queryKey: ["wallet-tx"] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user, qc]);

  const txs = txQuery.data ?? [];
  const completed = txs.filter((t) => t.status === "completed");
  const balance = completed.reduce(
    (s, t) => s + (t.type === "credit" ? Number(t.amount_inr) : -Number(t.amount_inr)),
    0,
  );
  const totalIn = completed
    .filter((t) => t.type === "credit")
    .reduce((s, t) => s + Number(t.amount_inr), 0);
  const totalOut = completed
    .filter((t) => t.type === "debit")
    .reduce((s, t) => s + Number(t.amount_inr), 0);
  const creatorEarnings = completed.filter(
    (t) => t.type === "credit" && (t.description ?? "").startsWith("Creator earning:"),
  );
  const creatorWithdrawals = completed.filter(
    (t) => t.type === "debit" && (t.description ?? "").startsWith("Withdrawal"),
  );
  const creatorBalance = Math.max(
    0,
    creatorEarnings.reduce((s, t) => s + Number(t.amount_inr), 0) -
      creatorWithdrawals.reduce((s, t) => s + Number(t.amount_inr), 0),
  );
  const pendingTxs = txs.filter((t) => t.status === "pending" && t.type === "credit");

  const invoiceSettingsQuery = useQuery({
    queryKey: ["invoice-settings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key,value")
        .in("key", [
          "invoice_company_name",
          "invoice_legal_name",
          "invoice_gstin",
          "invoice_prefix",
          "invoice_footer",
          "invoice_logo_url",
          "invoice_contact",
        ]);
      const m: Record<string, string> = {};
      for (const r of data ?? []) m[r.key] = r.value || "";
      return m;
    },
    staleTime: 300_000,
  });
  const inv = invoiceSettingsQuery.data ?? {};

  async function submitTopup() {
    if (!user) return;
    const amt = Number(amount);
    if (!amt || amt < 50) return toast.error("Minimum amount is ₹50");
    if (amt > 100000) return toast.error("Maximum amount is ₹1,00,000");

    setSubmitting(true);
    try {
      const order = await createOrder({ data: { amountInr: amt, email: user?.email } });

      const loaded = await loadCashfree();
      if (!loaded) throw new Error("Cashfree SDK failed to load");

      const cashfree = new (window as any).Cashfree({ mode: "production" });
      const result = await cashfree.checkout({
        paymentSessionId: order.payment_session_id,
        redirectTarget: "_modal",
      });

      const msg = result?.paymentDetails?.paymentMessage;
      if (!msg || msg === "USER_DROPPED") {
        toast.info("Payment cancelled.");
        return;
      }
      if (msg === "FAILED") {
        throw new Error("Payment failed. Please try again.");
      }
      await verifyTopup({
        data: {
          amountInr: amt,
          method: "online",
          cashfree_order_id: order.order_id,
        },
      });
      toast.success(`Successfully added ${inr(amt)} to your wallet.`);
      qc.invalidateQueries({ queryKey: ["wallet-tx"] });
      qc.invalidateQueries({ queryKey: ["wallet-balance"] });
      setOpen(false);
    } catch (err: any) {
      let msg = err.message || "Failed to initiate top-up";
      try {
        const parsed = JSON.parse(msg);
        msg = parsed.message || parsed.error?.message || "An unexpected payment error occurred.";
      } catch (e) {
        // Not JSON
      }
      toast.error(
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-sm">Payment Failed</span>
          <span className="text-xs opacity-90">{msg}</span>
        </div>,
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function downloadInvoice(tx: any) {
    if (!user) return;
    try {
      const doc = new jsPDF();

      // Check user's own branding settings (Team plan admins can customize)
      const { data: profileBrand } = await supabase
        .from("profiles")
        .select(
          "invoice_company_name, invoice_legal_name, invoice_gstin, invoice_prefix, invoice_footer, invoice_logo_url, invoice_contact, org_name, org_logo_url",
        )
        .eq("id", user.id)
        .maybeSingle();

      const companyName =
        profileBrand?.invoice_company_name || inv.invoice_company_name || "Learnify AI";
      const legalName =
        profileBrand?.invoice_legal_name || inv.invoice_legal_name || "Learnify EdTech Pvt. Ltd.";
      const gstin = profileBrand?.invoice_gstin || inv.invoice_gstin || "29XXXXX1234X1Z5";
      const prefix = profileBrand?.invoice_prefix || inv.invoice_prefix || "LRN";
      const footerText =
        profileBrand?.invoice_footer ||
        inv.invoice_footer ||
        "This is a computer generated invoice and does not require a signature.";
      const logoUrl =
        profileBrand?.invoice_logo_url || profileBrand?.org_logo_url || inv.invoice_logo_url;
      const contact = profileBrand?.invoice_contact || inv.invoice_contact;

      // Logo (if configured) — fetch and convert to base64
      let logoHeight = 0;
      if (logoUrl) {
        try {
          const resp = await fetch(logoUrl);
          const blob = await resp.blob();
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          doc.addImage(base64, "PNG", 14, 10, 36, 36);
          logoHeight = 36;
        } catch (e) {
          console.warn("Invoice logo load failed:", e);
        }
      }

      // Header
      const headerY = logoHeight > 0 ? 16 : 22;
      doc.setFontSize(22);
      doc.setTextColor(79, 70, 229);
      doc.text(companyName, logoHeight > 0 ? 56 : 14, headerY);

      let infoY = headerY + 8;
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(legalName, logoHeight > 0 ? 56 : 14, infoY);

      infoY += 5;
      doc.text(`GSTIN: ${gstin}`, logoHeight > 0 ? 56 : 14, infoY);

      let rightY = headerY;
      doc.setFontSize(20);
      doc.setTextColor(0);
      doc.text("INVOICE", 150, rightY);

      rightY += 8;
      doc.setFontSize(10);
      doc.setTextColor(50);
      doc.text(
        `Invoice Number: ${prefix}-${tx.id?.split("-")[0]?.toUpperCase() ?? "NA"}`,
        150,
        rightY,
      );

      rightY += 5;
      doc.text(
        `Date: ${tx.created_at ? format(new Date(tx.created_at), "dd MMM yyyy") : "N/A"}`,
        150,
        rightY,
      );

      // Contact (if configured)
      let separatorY = Math.max(infoY, rightY) + 6;
      if (contact) {
        separatorY += 5;
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(contact, logoHeight > 0 ? 56 : 14, separatorY - 3);
      }

      doc.setDrawColor(200);
      doc.line(14, separatorY, 196, separatorY);

      const billToY = separatorY + 10;
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Bill To:", 14, billToY);
      doc.setFontSize(10);
      doc.setTextColor(80);
      doc.text(user.email ?? "Customer", 14, billToY + 7);

      // Table
      autoTable(doc, {
        startY: billToY + 16,
        headStyles: { fillColor: [79, 70, 229] },
        head: [["Description", "Amount"]],
        body: [[tx.description ?? "Wallet Top-up", `INR ${Number(tx.amount_inr ?? 0).toFixed(2)}`]],
        foot: [["Total Paid", `INR ${Number(tx.amount_inr ?? 0).toFixed(2)}`]],
        footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
      });

      // Footer
      doc.setFontSize(9);
      doc.setTextColor(150);
      const lastTable = (doc as any).lastAutoTable;
      doc.text(footerText, 14, (lastTable?.finalY ?? 200) + 30);

      doc.save(`${companyName.replace(/\s+/g, "_")}_Invoice_${tx.id?.split("-")[0] ?? "NA"}.pdf`);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to generate invoice");
    }
  }

  const presets = [200, 500, 1000, 2500, 5000, 10000];

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-6xl">
        {/* Hero balance card */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 text-white shadow-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600">
          {/* decorative orbs */}
          <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />

          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur grid place-items-center">
                <WalletIcon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.3em] opacity-80">
                  Learnify Wallet
                </div>
                <div className="text-sm opacity-90">Available balance</div>
              </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-white text-indigo-700 hover:bg-white/90 font-semibold shadow-lg"
                >
                  <Plus className="h-4 w-4" /> Top up
                </Button>
              </DialogTrigger>
              <TopUpDialogContent
                amount={amount}
                setAmount={setAmount}
                submitting={submitting}
                submitTopup={submitTopup}
                presets={presets}
                onClose={() => setOpen(false)}
              />
            </Dialog>
          </div>

          <div className="relative mt-8">
            <div className="text-5xl sm:text-6xl font-display font-semibold tracking-tight tabular-nums">
              {inr(balance)}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs opacity-90">
              <span className="inline-flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> Added {inr(totalIn)}
              </span>
              <span className="opacity-50">·</span>
              <span className="inline-flex items-center gap-1">
                <TrendingDown className="h-3.5 w-3.5" /> Spent {inr(totalOut)}
              </span>
              {pendingTxs.length > 0 && (
                <>
                  <span className="opacity-50">·</span>
                  <span className="inline-flex items-center gap-1 bg-amber-300/20 text-amber-100 px-2 py-0.5 rounded-full">
                    <Clock3 className="h-3 w-3" /> {pendingTxs.length} processing
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick add chips */}
          <div className="relative mt-6 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setAmount(String(p));
                  setOpen(true);
                }}
                className="px-3 py-1.5 rounded-full text-xs bg-white/10 hover:bg-white/20 backdrop-blur border border-white/15 transition"
              >
                + ₹{p.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
        </div>

        {/* Processing top-ups */}
        {pendingTxs.length > 0 && (
          <div className="mt-6 rounded-2xl border bg-card p-5 shadow-card">
            <h3 className="font-display font-semibold flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-amber-500" /> Processing top-ups
            </h3>
            <ul className="space-y-2">
              {pendingTxs.map((t) => (
                <li key={t.id} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">{inr(Number(t.amount_inr))}</div>
                    <div className="text-xs text-muted-foreground">
                      Cashfree · {format(new Date(t.created_at), "dd MMM HH:mm")}
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                  >
                    Processing
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        )}

        <CreatorWithdrawSection balance={creatorBalance} />

        {/* Transactions */}
        <div className="mt-6 rounded-2xl border bg-card shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-display font-semibold">Transactions</h2>
            <span className="text-xs text-muted-foreground">{txs.length} entries</span>
          </div>
          {txQuery.isLoading ? (
            <div className="p-8 grid place-items-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : txs.length === 0 ? (
            <div className="p-12 text-center">
              <WalletIcon className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">No transactions yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Top up your wallet to enroll in paid courses.
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {txs.map((t) => (
                <li key={t.id} className="px-4 sm:px-6 py-3 flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-full grid place-items-center shrink-0 ${t.type === "credit" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                  >
                    {t.type === "credit" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {t.description ?? (t.type === "credit" ? "Wallet top-up" : "Purchase")}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {format(new Date(t.created_at), "dd MMM yyyy · HH:mm")}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-semibold tabular-nums ${t.type === "credit" ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {t.type === "credit" ? "+" : "−"}
                      {inr(Number(t.amount_inr))}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center justify-end gap-2 mt-1">
                      <span>{t.status}</span>
                      {t.status === "completed" && (
                        <button
                          onClick={() => downloadInvoice(t)}
                          className="text-primary hover:text-primary/80 transition-colors p-1"
                          title="Download Invoice"
                        >
                          <Download className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function TopUpDialogContent({
  amount,
  setAmount,
  submitting,
  submitTopup,
  presets,
  onClose,
}: {
  amount: string;
  setAmount: (v: string) => void;
  submitting: boolean;
  submitTopup: () => void;
  presets: number[];
  onClose: () => void;
}) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add money to wallet</DialogTitle>
        <DialogDescription>Top up instantly via Cashfree (card/UPI/netbanking).</DialogDescription>
      </DialogHeader>
      <div className="space-y-5">
        <div className="space-y-2">
          <Label>Amount (INR)</Label>
          <div className="relative">
            <IndianRupee className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="number"
              min={50}
              max={100000}
              className="pl-9 text-lg font-semibold h-12"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAmount(String(p))}
                className={`px-3 py-1.5 rounded-full text-xs border transition ${amount === String(p) ? "border-primary bg-primary/10 text-primary font-semibold" : "hover:bg-accent"}`}
              >
                ₹{p.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
        </div>
        <div className="text-xs text-emerald-800 rounded-lg bg-emerald-50 p-3 border border-emerald-200 flex items-center gap-2">
          <CreditCard className="h-4 w-4 shrink-0" />
          You will be redirected to Cashfree to securely add funds instantly via card, UPI, or
          netbanking.
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={submitTopup} disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}{" "}
          Proceed to pay
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function CreatorWithdrawSection({ balance }: { balance: number }) {
  const { user, hasRole } = useAuth();
  const qc = useQueryClient();
  const isCreator = hasRole("creator") || hasRole("super_admin") || hasRole("admin");
  const [open, setOpen] = useState(false);
  const [amt, setAmt] = useState("500");
  const [method, setMethod] = useState<"bank" | "upi">("upi");
  const [dest, setDest] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Saved payout destination from creator settings
  const payoutQuery = useQuery({
    enabled: !!user && isCreator,
    queryKey: ["my-payout-dest", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("payout_destination")
        .eq("id", user!.id)
        .maybeSingle();
      return (data?.payout_destination ?? null) as null | {
        method?: "bank" | "upi";
        upi_id?: string;
        account_name?: string;
        account_number?: string;
        ifsc?: string;
      };
    },
  });

  const wQuery = useQuery({
    enabled: !!user && isCreator,
    queryKey: ["my-withdrawals", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("creator_withdrawals")
        .select("id, amount_inr, method, status, created_at, admin_notes")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });

  function autofillFor(m: "bank" | "upi") {
    const p = payoutQuery.data;
    if (!p) return "";
    if (m === "upi") return p.upi_id ?? "";
    if (m === "bank") {
      const parts = [p.account_name, p.account_number, p.ifsc].filter(Boolean);
      return parts.join(" · ");
    }
    return "";
  }

  // When dialog opens or method changes, prefill from saved details
  useEffect(() => {
    if (!open) return;
    const preferred = payoutQuery.data?.method ?? "upi";
    setMethod(preferred);
    setDest(autofillFor(preferred));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, payoutQuery.data]);

  if (!isCreator) return null;

  const processPayout = useServerFn(processCashfreePayout);

  async function submit() {
    if (!user) return;
    const n = Number(amt);
    if (!n || n < 100) return toast.error("Minimum withdrawal is ₹100");
    if (n > balance) return toast.error("Insufficient balance");
    if (!dest.trim()) return toast.error("Destination details required");
    setSubmitting(true);
    try {
      await processPayout({ data: { amountInr: n, method, destination: dest.trim() } });
      toast.success("Withdrawal processed via Cashfree Payouts");
      setOpen(false);
      setDest("");
      qc.invalidateQueries({ queryKey: ["my-withdrawals"] });
      qc.invalidateQueries({ queryKey: ["wallet-tx"] });
    } catch (err: any) {
      let msg = err.message || "Withdrawal failed";
      try {
        const parsed = JSON.parse(msg);
        msg = parsed.message || parsed.error?.message || "An unexpected withdrawal error occurred.";
      } catch (e) {
        // Not JSON
      }
      toast.error(
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-sm">Withdrawal Failed</span>
          <span className="text-xs opacity-90">{msg}</span>
        </div>,
      );
    } finally {
      setSubmitting(false);
    }
  }

  const pending = (wQuery.data ?? []).filter((w) => w.status === "pending");

  return (
    <div className="mt-6 rounded-2xl border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-display font-semibold flex items-center gap-2">
            <ArrowDownToLine className="h-4 w-4 text-primary" /> Creator withdrawals
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Withdraw earnings via Cashfree (UPI or bank). Available: <b>{inr(balance)}</b>
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={balance < 100}>
              <ArrowDownToLine className="h-4 w-4" /> Request withdrawal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Withdraw funds</DialogTitle>
              <DialogDescription>Available balance: {inr(balance)}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Amount (INR)</Label>
                <Input
                  type="number"
                  min={100}
                  max={balance}
                  value={amt}
                  onChange={(e) => setAmt(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["upi", "bank"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMethod(m);
                        setDest(autofillFor(m));
                      }}
                      className={`rounded-xl border p-2 text-xs capitalize ${method === m ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>
                    {method === "upi" ? "UPI ID" : "Account details (name, account number, IFSC)"}
                  </Label>
                  {autofillFor(method) && autofillFor(method) !== dest && (
                    <button
                      type="button"
                      className="text-[11px] text-primary hover:underline"
                      onClick={() => setDest(autofillFor(method))}
                    >
                      Use saved
                    </button>
                  )}
                </div>
                <Input
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                  maxLength={200}
                  placeholder={autofillFor(method) || "Enter details"}
                />
                {!payoutQuery.data && (
                  <p className="text-[11px] text-muted-foreground">
                    Tip: save your details in{" "}
                    <a href="/creator/settings" className="text-primary hover:underline">
                      Creator settings
                    </a>{" "}
                    to autofill next time.
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={submit} disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Withdraw via
                Cashfree
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {(wQuery.data ?? []).length > 0 && (
        <ul className="mt-4 divide-y border-t">
          {(wQuery.data ?? []).map((w) => (
            <li key={w.id} className="py-2.5 flex items-center justify-between text-sm">
              <div>
                <div className="font-medium">
                  {inr(Number(w.amount_inr))} ·{" "}
                  <span className="capitalize text-muted-foreground">{w.method}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(w.created_at), "dd MMM yyyy HH:mm")}
                  {w.admin_notes ? ` · ${w.admin_notes}` : ""}
                </div>
              </div>
              <Badge
                variant={
                  w.status === "paid"
                    ? "default"
                    : w.status === "rejected"
                      ? "destructive"
                      : "secondary"
                }
                className="capitalize text-[10px]"
              >
                {w.status}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
