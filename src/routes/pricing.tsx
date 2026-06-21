import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Check,
  Loader2,
  LogIn,
  Zap,
  Users,
  Rocket,
  ArrowRight,
  Sparkles,
  Star,
  X,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import { MarketingPage } from "@/components/MarketingPage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useServerFn } from "@tanstack/react-start";
import { createSubscription, cancelSubscription } from "@/lib/subscription.functions";

export const Route = createFileRoute("/pricing")({
  validateSearch: (s: Record<string, unknown>) => ({
    subscribe: s.subscribe as string | undefined,
  }),
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

const PLAN_ICONS = [Zap, Rocket, Users];

const FEATURE_COMPARISON = [
  { name: "AI Credits/month", starter: "500", pro: "10,000", team: "50,000" },
  { name: "Courses", starter: "3 free", pro: "Unlimited", team: "Unlimited" },
  { name: "AI Tutor", starter: "Basic", pro: "Advanced", team: "Advanced" },
  { name: "Certificates", starter: false, pro: true, team: true },
  { name: "Creator Tools", starter: false, pro: true, team: true },
  { name: "Priority Support", starter: false, pro: true, team: true },
  { name: "Team Dashboard", starter: false, pro: false, team: true },
  { name: "Admin Panel", starter: false, pro: false, team: true },
  { name: "SSO + RBAC", starter: false, pro: false, team: true },
  { name: "Custom Branding", starter: false, pro: false, team: true },
  { name: "Dedicated Support", starter: false, pro: false, team: true },
  { name: "Community Access", starter: true, pro: true, team: true },
  { name: "Progress Tracking", starter: true, pro: true, team: true },
];

function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { subscribe } = useSearch({ from: "/pricing" });
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const doSubscribe = useServerFn(createSubscription);
  const doCancel = useServerFn(cancelSubscription);

  useEffect(() => {
    if (subscribe === "ok") {
      toast.success("Subscription successful! Welcome aboard.");
      navigate({ to: "/pricing", search: { subscribe: undefined }, replace: true });
      qc.invalidateQueries({ queryKey: ["user-subscription"] });
    }
  }, [subscribe]);

  const {
    data: tiers,
    isLoading,
    error,
  } = useQuery<Plan[]>({
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
    retry: 2,
    staleTime: 60_000,
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
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    setLoadingPlan(planId);
    try {
      const sub = await doSubscribe({ data: { planId } });
      if (sub.free) {
        toast.success("Free plan activated! Welcome to Learnify AI.");
        qc.invalidateQueries({ queryKey: ["my-subscription"] });
      } else if (sub.auth_link) {
        window.location.href = sub.auth_link;
      } else {
        toast.success("Subscription created! Check your dashboard.");
        qc.invalidateQueries({ queryKey: ["my-subscription"] });
      }
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
      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm text-muted-foreground">
        {[
          { icon: Star, label: "No hidden fees" },
          { icon: Sparkles, label: "Cancel anytime" },
          { icon: Check, label: "Instant access" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary" />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="space-y-3 rounded-3xl border border-destructive/20 bg-destructive/5 p-10 text-center">
          <p className="text-lg font-semibold text-destructive">
            Pricing is currently unavailable.
          </p>
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t load the pricing details right now. Please refresh or try again later.
          </p>
        </div>
      ) : !tiers || tiers.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Pricing coming soon.</p>
      ) : (
        <>
          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {tiers.map((t, idx) => {
              const isCurrent = activePlanId === t.id;
              const isFree = t.price_inr <= 0 && !t.interval;
              const hasPrice = t.price_inr > 0;
              const PlanIcon = PLAN_ICONS[idx] ?? Zap;
              const accentColor = t.color || "#7c3aed";

              return (
                <div
                  key={t.id}
                  className={`relative rounded-3xl flex flex-col overflow-hidden transition-all duration-300 ${
                    t.highlighted
                      ? "shadow-2xl shadow-violet-500/20 scale-[1.02] border-2"
                      : "border hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1"
                  }`}
                  style={{
                    borderColor: t.highlighted ? accentColor : undefined,
                    background: t.highlighted
                      ? `linear-gradient(145deg, hsl(var(--card)) 0%, hsl(var(--card)) 100%)`
                      : undefined,
                  }}
                >
                  {/* Gradient top bar */}
                  <div
                    className="h-1.5 w-full"
                    style={{
                      background: `linear-gradient(90deg, ${accentColor}, ${accentColor}99)`,
                    }}
                  />

                  {/* Popular badge */}
                  {(t.badge || isCurrent) && (
                    <div
                      className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white shadow-lg"
                      style={{ background: accentColor }}
                    >
                      {isCurrent ? "Your plan" : t.badge}
                    </div>
                  )}

                  <div className="flex flex-col flex-1 p-8">
                    {/* Icon + Name */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-md"
                      style={{ background: `${accentColor}20` }}
                    >
                      <PlanIcon className="h-6 w-6" style={{ color: accentColor }} />
                    </div>

                    <h3 className="text-xl font-bold">{t.name}</h3>
                    {t.description && (
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {t.description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="mt-6 mb-1">
                      <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                        {t.price_label}
                      </span>
                      {t.interval && (
                        <span className="text-sm text-muted-foreground ml-1">/{t.interval}</span>
                      )}
                    </div>

                    {/* AI Credits Prominent Label */}
                    {t.ai_credits_monthly > 0 && (
                      <div className="my-4 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 text-center">
                        <span className="text-sm font-semibold text-primary">
                          {t.ai_credits_monthly.toLocaleString("en-IN")} AI credits / mo
                        </span>
                      </div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-border/40 my-5" />

                    {/* Features */}
                    <ul className="space-y-3 text-sm flex-1">
                      {t.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div
                            className="mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: `${accentColor}18` }}
                          >
                            <Check className="h-3 w-3" style={{ color: accentColor }} />
                          </div>
                          <span className="text-foreground/80">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="mt-8 space-y-2">
                      {isCurrent ? (
                        <div className="flex gap-2">
                          <Button className="flex-1" variant="outline" disabled>
                            <Crown className="h-4 w-4 mr-2" />
                            Current plan
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            className="text-muted-foreground"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : !hasPrice ? (
                        <Button
                          asChild
                          className="w-full h-11 text-sm font-semibold"
                          variant={t.highlighted ? "default" : "outline"}
                        >
                          <Link to="/signup">
                            {t.cta_label || "Get started free"}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      ) : !user ? (
                        <Button
                          asChild
                          className="w-full h-11 text-sm font-semibold"
                          style={
                            t.highlighted
                              ? { background: accentColor, color: "#fff", border: "none" }
                              : undefined
                          }
                        >
                          <Link to="/login">
                            <LogIn className="h-4 w-4 mr-2" />
                            Sign in to subscribe
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          className="w-full h-11 text-sm font-semibold"
                          onClick={() => handleSubscribe(t.id)}
                          disabled={loadingPlan !== null}
                          style={
                            t.highlighted
                              ? { background: accentColor, color: "#fff", border: "none" }
                              : undefined
                          }
                        >
                          {loadingPlan === t.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : null}
                          {loadingPlan === t.id
                            ? "Processing..."
                            : `Subscribe ₹${t.price_inr}/${t.interval === "month" ? "month" : t.interval}`}
                        </Button>
                      )}
                    </div>
                    {/* Explicitly state Cashfree only processing */}
                    {hasPrice && (
                      <div className="mt-4 text-center">
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center justify-center gap-1.5">
                          <Check className="h-3 w-3 text-emerald-500" /> Securely processed by
                          Cashfree
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feature Comparison Table */}
          <div className="mt-20 rounded-2xl border bg-card overflow-hidden">
            <div className="p-6 border-b text-center">
              <h3 className="text-xl font-bold">Compare Plans</h3>
              <p className="text-sm text-muted-foreground mt-1">
                See what&apos;s included in each plan
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-muted-foreground w-1/4">
                      Feature
                    </th>
                    {tiers.map((t) => (
                      <th key={t.id} className="text-center p-4 font-semibold">
                        {t.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_COMPARISON.map((feature, idx) => (
                    <tr key={idx} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-4 text-foreground/80">{feature.name}</td>
                      <td className="text-center p-4">{renderFeatureValue(feature.starter)}</td>
                      <td className="text-center p-4">{renderFeatureValue(feature.pro)}</td>
                      <td className="text-center p-4">{renderFeatureValue(feature.team)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ / reassurance strip */}
          <div className="mt-16 rounded-2xl border border-border/50 bg-muted/30 px-8 py-7 text-center space-y-2">
            <p className="text-sm font-medium">Have questions about which plan is right for you?</p>
            <p className="text-sm text-muted-foreground">
              All plans include a 7-day trial. No credit card required for Starter.{" "}
              <a
                href="mailto:hello@learnify.ai"
                className="text-primary underline underline-offset-2 hover:opacity-80 transition"
              >
                Contact us
              </a>{" "}
              anytime.
            </p>
          </div>
        </>
      )}
    </MarketingPage>
  );
}

function renderFeatureValue(value: boolean | string) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 text-emerald-500 mx-auto" />
    ) : (
      <X className="h-5 w-5 text-zinc-400 mx-auto" />
    );
  }
  return <span className="text-foreground">{value}</span>;
}
