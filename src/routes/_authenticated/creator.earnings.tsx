import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownToLine, IndianRupee, Loader2, TrendingUp, Wallet, Sparkles, LayoutGrid } from "lucide-react";
import { format } from "date-fns";
import { AppShell } from "@/components/AppShell";
import { TransactionRowsSkeleton } from "@/components/Skeletons";
import { CreatorGate } from "@/components/CreatorGate";
import { CreatorTabs } from "@/components/CreatorTabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { FinanceBento, FinanceBentoData } from "@/components/ui/finance-bento";
import { sampleFinanceData } from "@/components/ui/finance-bento.demo";

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

  const creatorBentoData: FinanceBentoData = useMemo(() => {
    const paymentRows = creatorCredits.slice(0, 3).map((tx) => ({
      name: tx.description?.replace("Creator earning: ", "") || "Course Sale",
      date: format(new Date(tx.created_at), "MMM d"),
      amount: Number(tx.amount_inr),
    }));

    return {
      ...sampleFinanceData,
      payments: paymentRows.length > 0 ? paymentRows : sampleFinanceData.payments,
      goals: [
        { name: "Milestone Target ₹100K", progress: Math.min(1, gross / 100000 || 0.45), target: 100000 },
        { name: "Monthly Goal ₹25K", progress: Math.min(1, month / 25000 || 0.62), target: 25000 },
      ],
      crypto: [
        { name: "Course Sales", symbol: "CRS", share: 0.65, change: "+5.2%", ohlc: [[70, 72, 69, 71], [71, 74, 70, 73], [73, 75, 71, 74], [74, 76, 72, 75], [75, 78, 74, 77], [77, 79, 75, 78], [78, 81, 77, 80]] },
        { name: "1-on-1 Mentorship", symbol: "MNT", share: 0.25, change: "+3.1%", ohlc: [[28, 30, 27, 29], [29, 31, 28, 30], [30, 32, 29, 31], [31, 33, 30, 32], [32, 34, 31, 33], [33, 35, 32, 34], [34, 36, 33, 35]] },
        { name: "Digital Assets", symbol: "AST", share: 0.10, change: "+1.8%", ohlc: [[12, 13, 11, 12.5], [12.5, 14, 12, 13], [13, 14.5, 12.5, 13.8], [13.8, 15, 13, 14.2], [14.2, 15.5, 13.5, 14.8], [14.8, 16, 14, 15.2], [15.2, 16.5, 14.5, 15.8]] },
      ],
    };
  }, [creatorCredits, gross, month]);

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
          <Button asChild size="sm">
            <Link to="/wallet">
              <ArrowDownToLine className="h-4 w-4" /> Withdraw
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Metric icon={IndianRupee} label="Available" value={inr(available)} />
          <Metric icon={TrendingUp} label="This month" value={inr(month)} />
          <Metric icon={Wallet} label="Paid out" value={inr(paidOut)} />
        </div>

        {/* Creator Revenue & Asset Bento */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-black p-3 sm:p-5 overflow-hidden shadow-2xl">
          <div className="p-3 sm:p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#E8FF1F]" />
                <h2 className="text-lg font-semibold text-white">Creator Revenue & Asset Bento</h2>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                Multi-channel breakdown of course sales, mentorship hours, and digital resource payouts.
              </p>
            </div>
            <Badge variant="outline" className="border-[#E8FF1F]/30 text-[#E8FF1F] bg-[#E8FF1F]/10 text-xs">
              Live Interactive Bento
            </Badge>
          </div>
          <div className="pt-2 w-full overflow-hidden">
            <FinanceBento
              data={creatorBentoData}
              title="Creator Earnings"
              subtitle={format(new Date(), "'Updated' dd MMM, HH:mm")}
              avatar={user?.user_metadata?.avatar_url || "/assets/vishwajeet-profile.png"}
              avatarAlt={user?.user_metadata?.full_name || "Creator"}
              credit={false}
            />
          </div>
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
