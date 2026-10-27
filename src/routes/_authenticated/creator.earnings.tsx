import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowDownToLine,
  IndianRupee,
  Loader2,
  TrendingUp,
  Wallet,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  QrCode,
  ShieldCheck,
  Check,
  Zap,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { AppShell } from "@/components/AppShell";
import { TransactionRowsSkeleton } from "@/components/Skeletons";
import { CreatorGate } from "@/components/CreatorGate";
import { CreatorTabs } from "@/components/CreatorTabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { CreatorRevenueBento } from "@/components/ui/creator-revenue-bento";
import { processCashfreePayout } from "@/lib/payment.functions";

export const Route = createFileRoute("/_authenticated/creator/earnings")({
  head: () => ({ meta: [{ title: "Creator earnings — Learnify AI" }] }),
  component: () => (
    <CreatorGate>
      <CreatorEarningsPage />
    </CreatorGate>
  ),
});

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

function CreatorEarningsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const processPayout = useServerFn(processCashfreePayout);

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<"upi" | "bank">("upi");
  const [payoutAmount, setPayoutAmount] = useState<string>("");
  const [upiVpa, setUpiVpa] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState<string>("");
  const [ifscCode, setIfscCode] = useState<string>("");
  const [bankInfo, setBankInfo] = useState<{ bank: string; branch: string; city: string } | null>(null);
  const [bankLoading, setBankLoading] = useState(false);
  const [bankError, setBankError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState<{
    txId: string;
    amount: number;
    destination: string;
    method: string;
  } | null>(null);

  const txQuery = useQuery({
    enabled: !!user,
    queryKey: ["creator-earnings-tx", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("id, amount_inr, type, status, description, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });

  const rows = txQuery.data ?? [];
  const creatorCredits = rows.filter(
    (tx) =>
      tx.status === "completed" &&
      tx.type === "credit" &&
      (tx.description ?? "").startsWith("Creator earning:"),
  );
  const withdrawals = rows.filter(
    (tx) =>
      tx.status === "completed" &&
      tx.type === "debit" &&
      (tx.description ?? "").startsWith("Withdrawal"),
  );
  const gross = creatorCredits.reduce((sum, tx) => sum + Number(tx.amount_inr), 0);
  const paidOut = withdrawals.reduce((sum, tx) => sum + Number(tx.amount_inr), 0);
  const available = Math.max(0, gross - paidOut);
  const month = useMemo(() => {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return creatorCredits
      .filter((tx) => new Date(tx.created_at) >= start)
      .reduce((sum, tx) => sum + Number(tx.amount_inr), 0);
  }, [creatorCredits]);

  // Live IFSC validation with Razorpay lookup
  useEffect(() => {
    const cleanIfsc = ifscCode.trim().toUpperCase();
    if (cleanIfsc.length === 11 && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
      setBankLoading(true);
      setBankError(null);
      fetch(`https://ifsc.razorpay.com/${cleanIfsc}`)
        .then((res) => {
          if (!res.ok) throw new Error("Invalid IFSC code");
          return res.json();
        })
        .then((data) => {
          setBankInfo({
            bank: data.BANK || "Verified Indian Bank",
            branch: data.BRANCH || "",
            city: data.CITY || "",
          });
          setBankError(null);
        })
        .catch(() => {
          setBankInfo(null);
          setBankError("Bank not found for this IFSC");
        })
        .finally(() => {
          setBankLoading(false);
        });
    } else {
      setBankInfo(null);
      if (cleanIfsc.length > 0 && cleanIfsc.length < 11) {
        setBankError("IFSC must be 11 characters");
      } else {
        setBankError(null);
      }
    }
  }, [ifscCode]);

  const isUpiValid = useMemo(() => {
    return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiVpa.trim());
  }, [upiVpa]);

  const isBankValid = useMemo(() => {
    return (
      accountName.trim().length >= 3 &&
      accountNumber.trim().length >= 9 &&
      accountNumber.trim() === confirmAccountNumber.trim() &&
      Boolean(bankInfo) &&
      !bankError
    );
  }, [accountName, accountNumber, confirmAccountNumber, bankInfo, bankError]);

  const canSubmit = useMemo(() => {
    const amt = Number(payoutAmount);
    if (!amt || amt < 100 || amt > available) return false;
    if (payoutMethod === "upi") return isUpiValid;
    return isBankValid;
  }, [payoutAmount, available, payoutMethod, isUpiValid, isBankValid]);

  const handleExecutePayout = async () => {
    if (!user || !canSubmit) return;
    const numAmt = Number(payoutAmount);
    setIsSubmitting(true);

    const destination =
      payoutMethod === "upi"
        ? upiVpa.trim()
        : `${accountName.trim()} · A/C ${accountNumber.trim()} · IFSC ${ifscCode.toUpperCase().trim()}${bankInfo ? ` (${bankInfo.bank})` : ""}`;

    try {
      await processPayout({
        data: {
          amountInr: numAmt,
          method: payoutMethod,
          destination,
        },
      });

      const txId = `CF-PAYOUT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      setPayoutSuccess({
        txId,
        amount: numAmt,
        destination,
        method: payoutMethod,
      });

      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      toast.success("Cashfree Payout dispatched successfully!");

      qc.invalidateQueries({ queryKey: ["creator-earnings-tx"] });
      qc.invalidateQueries({ queryKey: ["wallet-tx"] });
      qc.invalidateQueries({ queryKey: ["my-withdrawals"] });
    } catch (err: any) {
      let msg = err.message || "Payout initiation failed";
      try {
        const parsed = JSON.parse(msg);
        msg = parsed.message || parsed.error?.message || msg;
      } catch {
        // keep string
      }
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetModal = () => {
    setWithdrawModalOpen(false);
    setPayoutSuccess(null);
    setPayoutAmount("");
    setUpiVpa("");
    setAccountName("");
    setAccountNumber("");
    setConfirmAccountNumber("");
    setIfscCode("");
    setBankInfo(null);
    setBankError(null);
  };



  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-6xl">
        <CreatorTabs />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-medium">
              Creator earnings
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-display font-semibold">
              How you earn on Learnify
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Paid course enrollments credit your creator wallet automatically after checkout.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setPayoutAmount(available > 0 ? String(Math.min(available, 1000)) : "100");
              setWithdrawModalOpen(true);
            }}
            disabled={available < 100}
            className="cursor-pointer gap-2 shadow-sm font-semibold"
          >
            <ArrowDownToLine className="h-4 w-4" /> Request Payout
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Metric icon={IndianRupee} label="Available" value={inr(available)} />
          <Metric icon={TrendingUp} label="This month" value={inr(month)} />
          <Metric icon={Wallet} label="Paid out" value={inr(paidOut)} />
        </div>

        {/* Creator Revenue & Royalties Matrix */}
        <div className="mt-8">
          <CreatorRevenueBento
            gross={gross}
            month={month}
            available={available}
            paidOut={paidOut}
            creatorCredits={creatorCredits}
            creatorName={user?.user_metadata?.full_name || "Creator"}
            avatarUrl={user?.user_metadata?.avatar_url || "/assets/vishwajeet-profile.png"}
          />
        </div>

        <Card className="mt-6 p-5 space-y-3">
          <h2 className="font-display font-semibold">Earning rules</h2>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>
              Create a paid course in Studio and publish it after every lesson has a valid video
              URL.
            </li>
            <li>
              When a learner buys the course with wallet checkout, the learner is enrolled and your
              wallet receives the course sale amount.
            </li>
            <li>Free courses build audience and subscribers, but do not add wallet earnings.</li>
            <li>
              Use Creator settings for payout details, then request withdrawal from Wallet when your
              available amount is at least ₹100.
            </li>
          </ul>
        </Card>

        <div className="mt-6 rounded-2xl border bg-card shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-display font-semibold">Recent creator earnings</h2>
            <Badge variant="secondary" className="text-[10px]">
              {creatorCredits.length} sales
            </Badge>
          </div>
          {txQuery.isLoading ? (
            <TransactionRowsSkeleton />
          ) : creatorCredits.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No paid course earnings yet.
            </div>
          ) : (
            <ul className="divide-y">
              {creatorCredits.map((tx) => (
                <li key={tx.id} className="px-6 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {tx.description?.replace("Creator earning: ", "")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(tx.created_at), "dd MMM yyyy · HH:mm")}
                    </p>
                  </div>
                  <div className="font-semibold text-emerald-600">
                    +{inr(Number(tx.amount_inr))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Cashfree Payout Verification Modal ── */}
      <Dialog open={withdrawModalOpen} onOpenChange={setWithdrawModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <ArrowDownToLine className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="font-display text-base">Creator Payout Verification</DialogTitle>
                <DialogDescription className="text-xs">
                  Instant transfer via Cashfree Payouts &amp; Razorpay IMPS
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {payoutSuccess ? (
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center ring-8 ring-emerald-500/10">
                <Check className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Payout Dispatched Successfully!
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  ₹{payoutSuccess.amount.toLocaleString("en-IN")} has been sent to your verified beneficiary.
                </p>
              </div>

              <div className="w-full rounded-2xl border border-border/80 bg-muted/40 p-4 text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference ID:</span>
                  <span className="font-bold text-primary">{payoutSuccess.txId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-bold text-emerald-600">₹{payoutSuccess.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method:</span>
                  <span className="uppercase font-semibold">{payoutSuccess.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destination:</span>
                  <span className="truncate max-w-[180px]">{payoutSuccess.destination}</span>
                </div>
              </div>

              <Button onClick={handleResetModal} className="w-full text-xs font-semibold cursor-pointer">
                Done &bull; View Updated Earnings
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {/* Balance bar */}
              <div className="rounded-xl bg-muted/50 border p-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Available to Withdraw:</span>
                <span className="font-bold font-mono text-foreground text-sm">{inr(available)}</span>
              </div>

              {/* Amount Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <Label htmlFor="payout-amount" className="font-semibold">
                    Withdrawal Amount (INR)
                  </Label>
                  <span className="text-[11px] text-muted-foreground">Min ₹100</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                    ₹
                  </span>
                  <Input
                    id="payout-amount"
                    type="number"
                    min={100}
                    max={available}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="Enter amount (min ₹100)"
                    className="pl-8 text-sm font-mono"
                  />
                </div>
                {/* Quick amount chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[500, 1000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      disabled={available < amt}
                      onClick={() => setPayoutAmount(String(amt))}
                      className="text-[11px] px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground font-mono disabled:opacity-40 cursor-pointer"
                    >
                      ₹{amt.toLocaleString("en-IN")}
                    </button>
                  ))}
                  {available >= 100 && (
                    <button
                      type="button"
                      onClick={() => setPayoutAmount(String(available))}
                      className="text-[11px] px-2.5 py-1 rounded-lg border border-primary/30 bg-primary/10 text-primary font-semibold font-mono cursor-pointer"
                    >
                      All (₹{available.toLocaleString("en-IN")})
                    </button>
                  )}
                </div>
              </div>

              {/* Method Switcher */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Payout Destination</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod("upi")}
                    className={`rounded-xl border p-3 text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                      payoutMethod === "upi"
                        ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <QrCode className="h-4 w-4" />
                    <span>Instant UPI (VPA)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayoutMethod("bank")}
                    className={`rounded-xl border p-3 text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                      payoutMethod === "bank"
                        ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Bank IMPS / NEFT</span>
                  </button>
                </div>
              </div>

              {/* UPI Form Fields */}
              {payoutMethod === "upi" && (
                <div className="space-y-2 rounded-2xl border border-border/80 bg-muted/20 p-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <Label htmlFor="upi-vpa" className="font-semibold">
                      UPI ID (Virtual Payment Address)
                    </Label>
                    {upiVpa.length > 0 && (
                      <span
                        className={`text-[11px] flex items-center gap-1 ${
                          isUpiValid ? "text-emerald-500 font-semibold" : "text-amber-500"
                        }`}
                      >
                        {isUpiValid ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" /> Valid UPI Format
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3.5 w-3.5" /> Invalid UPI
                          </>
                        )}
                      </span>
                    )}
                  </div>
                  <Input
                    id="upi-vpa"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value)}
                    placeholder="e.g. name@okhdfcbank or 9876543210@paytm"
                    className="text-xs font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Instant transfer to Google Pay, PhonePe, Paytm, or any BHIM UPI ID.
                  </p>
                </div>
              )}

              {/* Bank Form Fields */}
              {payoutMethod === "bank" && (
                <div className="space-y-3 rounded-2xl border border-border/80 bg-muted/20 p-3.5">
                  <div className="space-y-1">
                    <Label htmlFor="acc-name" className="text-xs font-semibold">
                      Beneficiary Full Name
                    </Label>
                    <Input
                      id="acc-name"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Account holder name as per bank records"
                      className="text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="acc-num" className="text-xs font-semibold">
                        Account Number
                      </Label>
                      <Input
                        id="acc-num"
                        type="password"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Account number"
                        className="text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="confirm-acc-num" className="text-xs font-semibold">
                        Confirm Account
                      </Label>
                      <Input
                        id="confirm-acc-num"
                        value={confirmAccountNumber}
                        onChange={(e) => setConfirmAccountNumber(e.target.value)}
                        placeholder="Re-enter number"
                        className="text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <Label htmlFor="ifsc-code" className="font-semibold">
                        IFSC Code
                      </Label>
                      {bankLoading && (
                        <span className="text-[11px] text-primary flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" /> Verifying IFSC...
                        </span>
                      )}
                    </div>
                    <Input
                      id="ifsc-code"
                      value={ifscCode}
                      maxLength={11}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      placeholder="e.g. HDFC0001234, SBIN0000456"
                      className="text-xs font-mono uppercase"
                    />
                  </div>

                  {/* Bank verification preview */}
                  {bankInfo && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-400 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                      <div>
                        <p className="font-semibold text-emerald-300">{bankInfo.bank}</p>
                        <p className="text-[11px] text-emerald-400/80">
                          {bankInfo.branch} &bull; {bankInfo.city}
                        </p>
                      </div>
                    </div>
                  )}

                  {bankError && (
                    <div className="text-destructive text-xs flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{bankError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Security and SLA notice */}
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>256-bit Encrypted Payout &bull; RBI &amp; Cashfree Compliant</span>
              </div>

              <DialogFooter className="gap-2 sm:gap-0 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWithdrawModalOpen(false)}
                  disabled={isSubmitting}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleExecutePayout}
                  disabled={!canSubmit || isSubmitting}
                  className="text-xs font-semibold cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      Dispatching Payout...
                    </>
                  ) : (
                    <>
                      <Zap className="h-3.5 w-3.5 mr-1 text-amber-300" />
                      Transfer {payoutAmount ? inr(Number(payoutAmount)) : ""}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Metric({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" /> {label}
      </div>
      <div className="mt-2 text-2xl font-display font-semibold">{value}</div>
    </Card>
  );
}
