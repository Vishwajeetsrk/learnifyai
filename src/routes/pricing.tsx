import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { MarketingPage } from "@/components/MarketingPage";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useServerFn } from "@tanstack/react-start";
import { createSubscription, cancelSubscription } from "@/lib/subscription.functions";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Learnify AI" },
      {
        name: "description",
        content: "Simple, transparent pricing. Start free, upgrade when you're ready.",
      },
      { property: "og:title", content: "Pricing — Learnify AI" },
      {
        property: "og:description",
        content: "Free forever core. Pro and Team plans for serious learners and creators.",
      },
    ],
  }),
  component: PricingPage,
});

type Plan = {
  id: string;
  name: string;
  price_label: string;
  description: string | null;
  features: string[];
  cta_label: string;
  cta_to: string;
  highlighted: boolean;
  price_inr: number;
  interval: string | null;
  badge: string | null;
  color: string | null;
  ai_credits_monthly: number;
  max_courses: number;
  cashfree_plan_id: string | null;
};

function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const doSubscribe = useServerFn(createSubscription);
  const doCancel = useServerFn(cancelSubscription);

  const { data: tiers, isLoading, error } = useQuery<Plan[]>({
    queryKey: ["pricing-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("*")
        .eq("active", true)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return ((data ?? []) as any[]).map((p) => ({
        ...p,
        features: Array.isArray(p.features) ? p.features : [],
        price_inr: Number(p.price_inr || 0),
        max_courses: Number(p.max_courses ?? -1),
        ai_credits_monthly: Number(p.ai_credits_monthly || 0),
      })) as Plan[];
    },
    retry: false,
  });

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

  const handleSubscribe = async (planId: string) => {
    if (!user) { navigate({ to: "/login" }); return; }
    setLoadingPlan(planId);
    try {
      const sub = await doSubscribe({ data: { planId } });
      if (sub.auth_link) window.location.href = sub.auth_link;
      else toast.success("Subscription created! Check your dashboard.");
      qc.invalidateQueries({ queryKey: ["my-subscription"] });
    } catch (e: any) {
      toast.error(e?.message || "Subscription failed");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCancel = async () => {
    try {
      await doCancel({ data: {} });
      toast.success("Subscription cancelled");
      qc.invalidateQueries({ queryKey: ["my-subscription"] });
    } catch (e: any) {
      toast.error(e?.message || "Cancel failed");
    }
  };

  const activePlanId = currentSub.data?.plan_id;

  return (
    <MarketingPage
      eyebrow="Pricing"
      title="Simple pricing. Real value."
      subtitle="Start free. Upgrade when Learnify becomes part of your routine."
    >
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="space-y-3 rounded-3xl border border-destructive/20 bg-destructive/5 p-10 text-center">
          <p className="text-lg font-semibold text-destructive">Pricing is currently unavailable.</p>
          <p className="text-sm text-muted-foreground">We couldn&apos;t load the pricing details right now. Please refresh or try again later.</p>
        </div>
      ) : !tiers || tiers.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Pricing coming soon.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t) => {
            const isCurrent = activePlanId === t.id;
            const isFree = t.price_inr <= 0 && !t.interval;
            const showSubscribe = !isFree && !isCurrent;
            const showLogin = !user && !isFree;

            return (
              <div
                key={t.id}
                className={`rounded-2xl border p-8 flex flex-col ${t.highlighted ? "border-primary/50 bg-card shadow-xl shadow-primary/10 ring-1 ring-primary/20" : "border-border/60 bg-card"}`}
                style={t.color ? { borderColor: isCurrent ? t.color : undefined } : undefined}
              >
                {(t.badge || isCurrent) && (
                  <div
                    className={`inline-flex self-start rounded-full px-3 py-1 text-xs font-medium mb-4 ${isCurrent ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground"}`}
                    style={isCurrent ? { background: t.color || "#7c3aed", color: "#fff" } : undefined}
                  >
                    {isCurrent ? "Your plan" : t.badge || "Most popular"}
                  </div>
                )}
                <h3 className="font-display text-2xl font-semibold">{t.name}</h3>
                <div className="mt-3 text-4xl font-bold tracking-tight">{t.price_label}</div>
                {t.description && <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>}
                {t.ai_credits_monthly > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">{t.ai_credits_monthly.toLocaleString("en-IN")} AI credits / mo</p>
                )}
                <ul className="mt-6 space-y-3 text-sm flex-1">
                  {t.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 w-full space-y-2">
                  {isCurrent ? (
                    <div className="flex gap-2">
                      <Button className="flex-1" variant="outline" disabled>
                        Active
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  ) : isFree ? (
                    <Button asChild className="w-full" variant="outline">
                      <Link to="/signup">Get started free</Link>
                    </Button>
                  ) : showLogin ? (
                    <Button asChild className="w-full">
                      <Link to="/login"><LogIn className="h-4 w-4 mr-1" /> Sign in to subscribe</Link>
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant={t.highlighted ? "default" : "outline"}
                      onClick={() => handleSubscribe(t.id)}
                      disabled={loadingPlan !== null}
                    >
                      {loadingPlan === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {loadingPlan === t.id ? "Processing..." : `Subscribe ₹${t.price_inr}/${t.interval}`}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </MarketingPage>
  );
}
