import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  CreditCard,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Loader2,
  ExternalLink,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  Clock,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import {
  cancelSubscription,
  resumeSubscription,
  getUserInvoices,
  getSubscriptionHistory,
} from "@/lib/subscription.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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
  paid: "bg-emerald-500/10 text-emerald-500",
  pending: "bg-yellow-500/10 text-yellow-500",
  failed: "bg-red-500/10 text-red-500",
  refunded: "bg-blue-500/10 text-blue-500",
  void: "bg-zinc-500/10 text-zinc-500",
};

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

function BillingPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const doCancel = useServerFn(cancelSubscription);
  const doResume = useServerFn(resumeSubscription);

  const currentSub = useQuery({
    enabled: !!user,
    queryKey: ["my-subscription", user?.id],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("user_subscriptions")
        .select("*, plan:pricing_plans(*)")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .maybeSingle();
      return data || null;
    },
  });

  const invoices = useQuery({
    enabled: !!user,
    queryKey: ["my-invoices", user?.id],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("invoices")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      return data || [];
    },
  });

  const history = useQuery({
    enabled: !!user,
    queryKey: ["sub-history", user?.id],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("user_subscriptions")
        .select("*, plan:pricing_plans(name, price_inr, interval)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      return data || [];
    },
  });

  const credits = useQuery({
    enabled: !!user,
    queryKey: ["ai-credits", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("ai_credits")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const handleCancel = async () => {
    try {
      await doCancel({ data: {} });
      toast.success("Subscription cancelled. Access continues until period end.");
      setCancelDialogOpen(false);
      qc.invalidateQueries({ queryKey: ["my-subscription"] });
    } catch (e: any) {
      toast.error(e?.message || "Failed to cancel subscription");
    }
  };

  const handleResume = async () => {
    try {
      await doResume({ data: {} });
      toast.success("Subscription resumed!");
      setResumeDialogOpen(false);
      qc.invalidateQueries({ queryKey: ["my-subscription"] });
    } catch (e: any) {
      toast.error(e?.message || "Failed to resume subscription");
    }
  };

  const sub = currentSub.data;
  const plan = sub?.plan as any;
  const isActive = sub?.status === "active";
  const isCancelled = sub?.status === "cancelled";
  const isPaused = sub?.status === "paused";
  const isPastDue = sub?.status === "past_due";
  const canResume = isCancelled || isPaused;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground mt-1">Manage your plan, invoices, and payment history.</p>
        </div>

        {/* Current Plan Card */}
        <div className="rounded-2xl border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  {plan?.name || "Starter"} Plan
                </h2>
                <p className="text-sm text-muted-foreground">
                  {plan?.price_inr > 0
                    ? `${inr(plan.price_inr)}/${plan.interval}`
                    : "Free forever"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isActive && (
                <Badge className={cn("border", STATUS_COLORS.active)}>
                  <Check className="h-3 w-3 mr-1" /> Active
                </Badge>
              )}
              {isPastDue && (
                <Badge className={cn("border", STATUS_COLORS.past_due)}>
                  <AlertTriangle className="h-3 w-3 mr-1" /> Past Due
                </Badge>
              )}
              {isCancelled && (
                <Badge className={cn("border", STATUS_COLORS.cancelled)}>
                  <X className="h-3 w-3 mr-1" /> Cancelled
                </Badge>
              )}
              {isPaused && (
                <Badge className={cn("border", STATUS_COLORS.paused)}>
                  <Clock className="h-3 w-3 mr-1" /> Paused
                </Badge>
              )}
            </div>
          </div>

          {/* Plan Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground">AI Credits</p>
              <p className="text-lg font-bold">
                {(credits.data?.credits_remaining || 0).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-muted-foreground">remaining</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Renewal Date</p>
              <p className="text-lg font-bold">
                {sub?.current_period_end
                  ? format(new Date(sub.current_period_end), "MMM d, yyyy")
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Courses</p>
              <p className="text-lg font-bold">
                {plan?.max_courses === -1 ? "Unlimited" : plan?.max_courses || 3}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Member Since</p>
              <p className="text-lg font-bold">
                {sub?.created_at
                  ? format(new Date(sub.created_at), "MMM d, yyyy")
                  : "—"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t">
            {isActive && plan?.price_inr > 0 && (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link to="/pricing">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    Upgrade Plan
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={() => setCancelDialogOpen(true)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel Subscription
                </Button>
              </>
            )}
            {canResume && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResumeDialogOpen(true)}
              >
                <ArrowUpRight className="h-4 w-4 mr-1" />
                Resume Subscription
              </Button>
            )}
            {!isActive && !canResume && (
              <Button asChild variant="outline" size="sm">
                <Link to="/pricing">
                  <Sparkles className="h-4 w-4 mr-1" />
                  Choose a Plan
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList>
            <TabsTrigger value="invoices" className="gap-2">
              <Receipt className="h-4 w-4" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="h-4 w-4" />
              Subscription History
            </TabsTrigger>
          </TabsList>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <div className="rounded-2xl border bg-card overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Invoices</h3>
              </div>
              {invoices.isLoading ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !invoices.data?.length ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No invoices yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {invoices.data.map((inv: any) => (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-mono text-sm font-medium">{inv.invoice_number}</p>
                          <p className="text-xs text-muted-foreground">
                            {inv.created_at
                              ? format(new Date(inv.created_at), "MMM d, yyyy")
                              : "—"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          className={cn(
                            "text-xs",
                            INVOICE_STATUS_COLORS[inv.status] || "bg-zinc-500/10 text-zinc-500",
                          )}
                        >
                          {inv.status}
                        </Badge>
                        <span className="font-semibold text-sm">{inr(inv.total_inr)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <div className="rounded-2xl border bg-card overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Subscription History</h3>
              </div>
              {history.isLoading ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !history.data?.length ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No subscription history</p>
                </div>
              ) : (
                <div className="divide-y">
                  {history.data.map((sub: any) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium text-sm">
                            {(sub.plan as any)?.name || "Unknown Plan"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {sub.created_at
                              ? format(new Date(sub.created_at), "MMM d, yyyy")
                              : "—"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          className={cn(
                            "text-xs border",
                            STATUS_COLORS[sub.status] || "bg-zinc-500/10 text-zinc-500",
                          )}
                        >
                          {sub.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {(sub.plan as any)?.price_inr > 0
                            ? inr((sub.plan as any).price_inr)
                            : "Free"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Your subscription will remain active until the end of the current billing period.
              After that, you'll be downgraded to the Starter plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Check className="h-4 w-4 text-emerald-500" />
              Access continues until {sub?.current_period_end ? format(new Date(sub.current_period_end), "MMM d, yyyy") : "period end"}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Check className="h-4 w-4 text-emerald-500" />
              You can resume anytime before the period ends
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Check className="h-4 w-4 text-emerald-500" />
              Your data and progress are saved
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resume Dialog */}
      <Dialog open={resumeDialogOpen} onOpenChange={setResumeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resume Subscription</DialogTitle>
            <DialogDescription>
              Your subscription will be reactivated and billing will resume at the next cycle.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResumeDialogOpen(false)}>
              Not Now
            </Button>
            <Button onClick={handleResume}>
              <ArrowUpRight className="h-4 w-4 mr-1" />
              Resume
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
