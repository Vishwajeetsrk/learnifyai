import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import {
  ShoppingCart, Star, Palette, FileText, Loader2, Check,
  Sparkles, Zap, Tag, Trophy,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { deductXP, recordPurchase, getUserPurchases } from "@/lib/gamification.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/_authenticated/store")({
  component: StorePage,
  head: () => ({ meta: [{ title: "XP Store — Learnify AI" }] }),
});

const PERKS = [
  {
    id: "premium-resume",
    name: "Resume Builder Premium",
    description: "Unlock all premium templates in the Resume Builder.",
    icon: FileText,
    cost: 500,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    category: "tools",
    autoApply: false,
  },
  {
    id: "avatar-frame-gold",
    name: "Gold Avatar Frame",
    description: "A shiny gold border around your profile picture.",
    icon: Star,
    cost: 250,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    category: "cosmetic",
    autoApply: false,
  },
  {
    id: "ide-theme-cyberpunk",
    name: "Cyberpunk IDE Theme",
    description: "Unlock the exclusive Cyberpunk theme in the Code Playground.",
    icon: Palette,
    cost: 300,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    category: "cosmetic",
    autoApply: false,
  },
  {
    id: "course-discount-10",
    name: "10% Course Discount",
    description: "Get 10% off any premium course. Auto-applies at checkout.",
    icon: Tag,
    cost: 1000,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    category: "discount",
    autoApply: true,
  },
  {
    id: "ai-credits-500",
    name: "500 Extra AI Credits",
    description: "Bonus AI credits for tutoring, quiz generation, and career tools.",
    icon: Zap,
    cost: 400,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    category: "credits",
    autoApply: true,
  },
  {
    id: "priority-support",
    name: "Priority Support Badge",
    description: "Get faster response times from the support team for 30 days.",
    icon: Sparkles,
    cost: 200,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    category: "badge",
    autoApply: false,
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  tools: "Tools & Premium",
  cosmetic: "Cosmetics & Themes",
  discount: "Discounts & Deals",
  credits: "AI Credits",
  badge: "Badges & Perks",
};

export function isPerkActive(perkId: string): boolean {
  return !!getStoredPerks()[perkId];
}

export function hasDiscount(): boolean {
  return isPerkActive("course-discount-10");
}

export function getDiscountPercent(): number {
  return hasDiscount() ? 10 : 0;
}

// Backward-compatible localStorage fallback for non-user contexts
const PURCHASED_KEY = "learnify_purchased_perks";
function getStoredPerks(): Record<string, number> {
  try {
    const raw = localStorage.getItem(PURCHASED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function StorePage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const deductFn = useServerFn(deductXP);
  const recordFn = useServerFn(recordPurchase);
  const fetchPurchases = useServerFn(getUserPurchases);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const { data: profile } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("xp")
        .eq("id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: serverPurchases = [] } = useQuery({
    queryKey: ["my-purchases", user?.id],
    queryFn: () => fetchPurchases({ data: { userId: user!.id } }),
    enabled: !!user,
  });

  const purchasedPerks = (serverPurchases as any[]).reduce((acc: Record<string, number>, p: any) => {
    acc[p.perkId] = new Date(p.purchasedAt).getTime();
    return acc;
  }, {} as Record<string, number>);
  const xp = profile?.xp || 0;

  const handlePurchase = async (perkId: string, cost: number, name: string) => {
    if (!user) return;
    if (xp < cost) {
      toast.error("Not enough XP!");
      return;
    }
    if (purchasedPerks[perkId]) {
      toast.info("You already own this perk!");
      return;
    }

    setPurchasing(perkId);
    try {
      await deductFn({ data: { userId: user.id, amount: cost, item: name } });
      await recordFn({ data: { userId: user.id, perkId, perkName: name, cost } });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"],
      });

      const perk = PERKS.find((p) => p.id === perkId);
      toast.success(
        `Purchased ${name}!${perk?.autoApply ? " Auto-applied." : " Check your profile to activate."}`
      );
      qc.invalidateQueries({ queryKey: ["my-profile", user.id] });
      qc.invalidateQueries({ queryKey: ["my-purchases", user.id] });
    } catch (err: any) {
      toast.error(err.message || "Failed to purchase item");
    } finally {
      setPurchasing(null);
    }
  };

  const categories = [...new Set(PERKS.map((p) => p.category))];
  const ownedCount = Object.keys(purchasedPerks).length;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/20 p-2 rounded-xl">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold">XP Store</h1>
          </div>
          <p className="text-muted-foreground">
            Spend your hard-earned XP on exclusive perks, themes, and discounts.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-xl border border-border">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-lg">{xp.toLocaleString()} XP Available</span>
            </div>
            {ownedCount > 0 && (
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                <Trophy className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-600">{ownedCount} Perk{ownedCount !== 1 ? "s" : ""} Owned</span>
              </div>
            )}
            {hasDiscount() && (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                <Tag className="h-3 w-3 mr-1" /> 10% Discount Active
              </Badge>
            )}
          </div>
        </header>

        {categories.map((cat) => (
          <div key={cat} className="mb-10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {CATEGORY_LABELS[cat] || cat}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PERKS.filter((p) => p.category === cat).map((perk, i) => {
                const Icon = perk.icon;
                const canAfford = xp >= perk.cost;
                const isPurchasing = purchasing === perk.id;
                const owned = !!purchasedPerks[perk.id];

                return (
                  <motion.div
                    key={perk.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Card className={`h-full flex flex-col overflow-hidden border-border bg-card ${owned ? "ring-2 ring-emerald-500/30" : ""}`}>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-xl ${perk.bg}`}>
                            <Icon className={`h-6 w-6 ${perk.color}`} />
                          </div>
                          <div className="flex items-center gap-2">
                            {perk.autoApply && (
                              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                                Auto-apply
                              </Badge>
                            )}
                            <div className="flex items-center gap-1.5 bg-background border border-border px-3 py-1 rounded-full shadow-sm">
                              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-bold">{perk.cost}</span>
                            </div>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold mb-2">{perk.name}</h3>
                        <p className="text-sm text-muted-foreground flex-1">
                          {perk.description}
                        </p>

                        {owned ? (
                          <div className="mt-6 w-full flex items-center justify-center gap-2 py-2 rounded-md bg-emerald-500/10 text-emerald-600 font-medium text-sm">
                            <Check className="h-4 w-4" /> Owned & Active
                          </div>
                        ) : (
                          <Button
                            onClick={() => handlePurchase(perk.id, perk.cost, perk.name)}
                            disabled={!canAfford || isPurchasing}
                            className="mt-6 w-full group relative overflow-hidden"
                            variant={canAfford ? "default" : "secondary"}
                          >
                            {isPurchasing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : canAfford ? (
                              "Purchase"
                            ) : (
                              "Not enough XP"
                            )}

                            {canAfford && !isPurchasing && (
                              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            )}
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
