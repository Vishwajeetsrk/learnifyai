import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownToLine, IndianRupee, Loader2, TrendingUp, Wallet } from "lucide-react";
import { format } from "date-fns";
import { AppShell } from "@/components/AppShell";
import { CreatorGate } from "@/components/CreatorGate";
import { CreatorTabs } from "@/components/CreatorTabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

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
            <div className="p-10 grid place-items-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
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
