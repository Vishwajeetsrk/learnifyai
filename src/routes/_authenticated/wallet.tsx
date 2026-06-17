import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Wallet as WalletIcon,
  Plus,
  IndianRupee,
  CreditCard,
  Smartphone,
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
import { createRazorpayOrder, verifyWalletTopup } from "@/lib/payment.functions";
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

const loadRazorpay = () =>
  new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
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
  const [method, setMethod] = useState<"razorpay" | "upi" | "manual">("razorpay");
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const createOrder = useServerFn(createRazorpayOrder);
  const verifyTopup = useServerFn(verifyWalletTopup);

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

  const topupsQuery = useQuery({
    enabled: !!user,
    queryKey: ["wallet-topups", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallet_topup_requests")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
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
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wallet_topup_requests",
          filter: `user_id=eq.${user.id}`,
        },
        () => qc.invalidateQueries({ queryKey: ["wallet-topups"] }),
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
  const pending = (topupsQuery.data ?? []).filter((t) => t.status === "pending");

  async function submitTopup() {
    if (!user) return;
    const amt = Number(amount);
    if (!amt || amt < 50) return toast.error("Minimum amount is ₹50");
    if (amt > 100000) return toast.error("Maximum amount is ₹1,00,000");
    
    setSubmitting(true);
    try {
      if (method === "manual") {
        const { error } = await supabase.from("wallet_topup_requests").insert({
          user_id: user.id,
          amount_inr: amt,
          method,
          reference: reference.trim() || null,
        });
        if (error) throw error;
        toast.success("Top-up request submitted. Admin will approve shortly.");
        setOpen(false);
        setReference("");
        qc.invalidateQueries({ queryKey: ["wallet-topups"] });
      } else {
        const loaded = await loadRazorpay();
        if (!loaded) throw new Error("Razorpay SDK failed to load");

        const order = await createOrder({ data: { amountInr: amt } });
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_T1tN8tDaacLQxo",
          amount: order.amount,
          currency: order.currency,
          name: "Learnify AI",
          description: "Wallet Top-up",
          order_id: order.id,
          handler: async function (response: any) {
            try {
              await verifyTopup({ 
                data: {
                  amountInr: amt,
                  method,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }
              });
              toast.success(`Successfully added ₹${amt} to your wallet.`);
              qc.invalidateQueries({ queryKey: ["wallet-tx"] });
              qc.invalidateQueries({ queryKey: ["wallet-balance"] });
              setOpen(false);
              setReference("");
            } catch (err: any) {
              toast.error(err.message || "Failed to verify topup");
            }
          },
          prefill: { email: user?.email || "" },
          theme: { color: "#4f46e5" },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          toast.error(response.error.description || "Payment failed");
        });
        rzp.open();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate top-up");
    } finally {
      setSubmitting(false);
    }
  }

  function downloadInvoice(tx: any) {
    if (!user) return;
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(22);
      doc.setTextColor(79, 70, 229);
      doc.text("Learnify AI", 14, 22);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Learnify EdTech Pvt. Ltd.", 14, 30);
      doc.text("GSTIN: 29XXXXX1234X1Z5", 14, 35);

      doc.setFontSize(20);
      doc.setTextColor(0);
      doc.text("INVOICE", 150, 22);

      // Details
      doc.setFontSize(10);
      doc.setTextColor(50);
      doc.text(`Invoice Number: LRN-${tx.id?.split("-")[0]?.toUpperCase() ?? "NA"}`, 150, 30);
      doc.text(`Date: ${tx.created_at ? format(new Date(tx.created_at), "dd MMM yyyy") : "N/A"}`, 150, 35);

      doc.setDrawColor(200);
      doc.line(14, 45, 196, 45);

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Bill To:", 14, 55);
      doc.setFontSize(10);
      doc.setTextColor(80);
      doc.text(user.email ?? "Customer", 14, 62);

      // Table
      (doc as any).autoTable({
        startY: 75,
        headStyles: { fillColor: [79, 70, 229] },
        head: [["Description", "Amount"]],
        body: [
          [tx.description ?? "Wallet Top-up", `INR ${Number(tx.amount_inr ?? 0).toFixed(2)}`],
        ],
        foot: [["Total Paid", `INR ${Number(tx.amount_inr ?? 0).toFixed(2)}`]],
        footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
      });

      // Footer
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text("This is a computer generated invoice and does not require a signature.", 14, (doc as any).lastAutoTable.finalY + 30);

      doc.save(`Learnify_Invoice_${tx.id?.split("-")[0] ?? "NA"}.pdf`);
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
                method={method}
                setMethod={setMethod}
                reference={reference}
                setReference={setReference}
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
              {pending.length > 0 && (
                <>
                  <span className="opacity-50">·</span>
                  <span className="inline-flex items-center gap-1 bg-amber-300/20 text-amber-100 px-2 py-0.5 rounded-full">
                    <Clock3 className="h-3 w-3" /> {pending.length} pending
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

        {/* Pending top-ups */}
        {pending.length > 0 && (
          <div className="mt-6 rounded-2xl border bg-card p-5 shadow-card">
            <h3 className="font-display font-semibold flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-amber-500" /> Pending top-ups
            </h3>
            <ul className="space-y-2">
              {pending.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between text-sm border-b last:border-0 pb-2 last:pb-0"
                >
                  <div>
                    <div className="font-medium">{inr(Number(t.amount_inr))}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {t.method} · {format(new Date(t.created_at), "dd MMM HH:mm")}
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-800 hover:bg-amber-100"
                  >
                    Awaiting approval
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
  method,
  setMethod,
  reference,
  setReference,
  submitting,
  submitTopup,
  presets,
  onClose,
}: {
  amount: string;
  setAmount: (v: string) => void;
  method: "razorpay" | "upi" | "manual";
  setMethod: (v: "razorpay" | "upi" | "manual") => void;
  reference: string;
  setReference: (v: string) => void;
  submitting: boolean;
  submitTopup: () => void;
  presets: number[];
  onClose: () => void;
}) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add money to wallet</DialogTitle>
        <DialogDescription>
          Top up instantly via card/UPI, or submit a bank transfer for admin approval.
        </DialogDescription>
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
        <div className="space-y-2">
          <Label>Payment method</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: "razorpay" as const, l: "Card", icon: CreditCard },
              { v: "upi" as const, l: "UPI", icon: Smartphone },
              { v: "manual" as const, l: "Bank", icon: ArrowDownToLine },
            ].map(({ v, l, icon: Icon }) => (
              <button
                key={v}
                type="button"
                onClick={() => setMethod(v)}
                className={`rounded-xl border p-3 text-xs flex flex-col items-center gap-1.5 transition ${method === v ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent"}`}
              >
                <Icon className="h-4 w-4" /> {l}
              </button>
            ))}
          </div>
        </div>
        {method === "manual" && (
          <div className="space-y-2">
            <Label>Reference / UTR (optional)</Label>
            <Input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. Bank transfer ref id"
              maxLength={64}
            />
          </div>
        )}
        {method !== "manual" && (
          <div className="text-xs text-emerald-800 rounded-lg bg-emerald-50 p-3 border border-emerald-200">
            You will be redirected to Razorpay to securely add funds instantly.
          </div>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={submitTopup} disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}{" "}
          Submit
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
  const [method, setMethod] = useState<"bank" | "upi" | "paypal">("upi");
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
        method?: "bank" | "upi" | "paypal";
        upi_id?: string;
        account_name?: string;
        account_number?: string;
        ifsc?: string;
        paypal_email?: string;
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

  function autofillFor(m: "bank" | "upi" | "paypal") {
    const p = payoutQuery.data;
    if (!p) return "";
    if (m === "upi") return p.upi_id ?? "";
    if (m === "paypal") return p.paypal_email ?? "";
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

  async function submit() {
    if (!user) return;
    const n = Number(amt);
    if (!n || n < 100) return toast.error("Minimum withdrawal is ₹100");
    if (n > balance) return toast.error("Insufficient balance");
    if (!dest.trim()) return toast.error("Destination details required");
    setSubmitting(true);
    const { error } = await supabase.from("creator_withdrawals").insert({
      user_id: user.id,
      amount_inr: n,
      method,
      destination: { details: dest.trim(), saved: payoutQuery.data ?? null },
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Withdrawal requested");
    setOpen(false);
    setDest("");
    qc.invalidateQueries({ queryKey: ["my-withdrawals"] });
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
            Withdraw earnings to bank, UPI, or PayPal. Available: <b>{inr(balance)}</b>
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
                <div className="grid grid-cols-3 gap-2">
                  {(["upi", "bank", "paypal"] as const).map((m) => (
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
                    {method === "upi"
                      ? "UPI ID"
                      : method === "bank"
                        ? "Account number + IFSC"
                        : "PayPal email"}
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
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Submit request
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
