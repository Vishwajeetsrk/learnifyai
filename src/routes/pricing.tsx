import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import { MarketingPage } from "@/components/MarketingPage";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

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
};

function PricingPage() {
  const {
    data: tiers,
    isLoading,
    error,
  } = useQuery<Plan[]>({
    queryKey: ["pricing-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("id,name,price_label,description,features,cta_label,cta_to,highlighted")
        .eq("active", true)
        .order("order_index", { ascending: true });
      if (error) throw error;

      return (data ?? []).map((plan) => ({
        ...plan,
        features: Array.isArray(plan.features) ? plan.features : [],
      })) as Plan[];
    },
    retry: false,
  });

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
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.id}
              className={`rounded-2xl border p-8 flex flex-col ${t.highlighted ? "border-primary/50 bg-card shadow-xl shadow-primary/10 ring-1 ring-primary/20" : "border-border/60 bg-card"}`}
            >
              {t.highlighted && (
                <div className="inline-flex self-start rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-medium mb-4">
                  Most popular
                </div>
              )}
              <h3 className="font-display text-2xl font-semibold">{t.name}</h3>
              <div className="mt-3 text-4xl font-bold tracking-tight">{t.price_label}</div>
              {t.description && (
                <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
              )}
              <ul className="mt-6 space-y-3 text-sm flex-1">
                {t.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="mt-8 w-full"
                variant={t.highlighted ? "default" : "outline"}
              >
                <a href={t.cta_to}>{t.cta_label}</a>
              </Button>
            </div>
          ))}
        </div>
      )}
    </MarketingPage>
  );
}
