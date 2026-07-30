import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";
import { InteractiveAvatar } from "@/components/InteractiveAvatar";
import {
  ShoppingCart,
  Star,
  Palette,
  FileText,
  Loader2,
  Check,
  Sparkles,
  Zap,
  Tag,
  Trophy,
  User2,
  CreditCard,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  deductXP,
  recordPurchase,
  getUserPurchases,
  purchaseWithWallet,
} from "@/lib/gamification.functions";
import { saveProfileField } from "@/lib/profile-save.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  } catch {
    return {};
  }
}

function StorePage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const deductFn = useServerFn(deductXP);
  const recordFn = useServerFn(recordPurchase);
  const fetchPurchases = useServerFn(getUserPurchases);
  const purchaseWalletFn = useServerFn(purchaseWithWallet);
  const saveFieldFn = useServerFn(saveProfileField);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [avatarPurchaseItem, setAvatarPurchaseItem] = useState<any>(null);

  const { data: avatarItems = [] } = useQuery({
    queryKey: ["store-avatar-items"],
    queryFn: async () => {
      const { data } = await supabase
        .from("store_items")
        .select("*")
        .contains("tags", ["avatar"])
        .eq("enabled", true);
      return data ?? [];
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("xp, avatar_url")
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

  const { data: walletTxs = [] } = useQuery({
    enabled: !!user,
    queryKey: ["wallet-tx", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("wallet_transactions")
        .select("amount_inr, type, status, created_at, description")
        .eq("user_id", user!.id);
      return data ?? [];
    },
  });

  const walletBalance = walletTxs
    .filter((t: any) => t.status === "completed")
    .reduce(
      (s: number, t: any) =>
        s + (t.type === "credit" ? Number(t.amount_inr) : -Number(t.amount_inr)),
      0,
    );

  const purchasedPerks = (serverPurchases as any[]).reduce(
    (acc: Record<string, number>, p: any) => {
      acc[p.perkId] = new Date(p.purchasedAt).getTime();
      return acc;
    },
    {} as Record<string, number>,
  );
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
        `Purchased ${name}!${perk?.autoApply ? " Auto-applied." : " Check your profile to activate."}`,
      );
      qc.invalidateQueries({ queryKey: ["my-profile", user.id] });
      qc.invalidateQueries({ queryKey: ["my-purchases", user.id] });
    } catch (err: any) {
      toast.error(err.message || "Failed to purchase item");
    } finally {
      setPurchasing(null);
    }
  };

  const handleAvatarPurchase = async (method: "xp" | "wallet") => {
    if (!user || !avatarPurchaseItem) return;
    const perkId = avatarPurchaseItem.id;
    const name = avatarPurchaseItem.name;

    setPurchasing(perkId);
    try {
      if (method === "xp") {
        if (xp < 1) throw new Error("Not enough XP!");
        await deductFn({ data: { userId: user.id, amount: 1, item: name } });
        await recordFn({ data: { userId: user.id, perkId, perkName: name, cost: 1 } });
      } else {
        const costInr = avatarPurchaseItem.prime_price || 1;
        if (walletBalance < costInr)
          throw new Error("Insufficient wallet balance. Please top up your wallet.");
        await purchaseWalletFn({ data: { userId: user.id, perkId, perkName: name, costInr } });
      }

      // Auto-apply avatar
      const currentAvatarUrl = (profile as any)?.avatar_url || "";
      const borderMatch = currentAvatarUrl.match(/[?&]profile_border=([^&]+)/);
      const activeBorder = borderMatch ? borderMatch[1] : "";
      const nextUrl = activeBorder
        ? `${avatarPurchaseItem.image_url}?profile_border=${activeBorder}`
        : avatarPurchaseItem.image_url;
      await saveFieldFn({ data: { field: "avatar_url", value: nextUrl } });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"],
      });

      toast.success(`Successfully unlocked and applied ${name}!`);
      setAvatarPurchaseItem(null);
      qc.invalidateQueries({ queryKey: ["my-profile", user.id] });
      qc.invalidateQueries({ queryKey: ["my-purchases", user.id] });
      qc.invalidateQueries({ queryKey: ["wallet-tx", user.id] });
      qc.invalidateQueries({ queryKey: ["wallet-balance"] });
      qc.invalidateQueries({ queryKey: ["profile-full"] });
      qc.invalidateQueries({ queryKey: ["profile-mini"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
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
                <span className="text-sm font-medium text-emerald-600">
                  {ownedCount} Perk{ownedCount !== 1 ? "s" : ""} Owned
                </span>
              </div>
            )}
            {hasDiscount() && (
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
              >
                <Tag className="h-3 w-3 mr-1" /> 10% Discount Active
              </Badge>
            )}
          </div>
        </header>

        {avatarItems.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User2 className="h-5 w-5 text-primary" /> 3D Profile Avatars
              <Badge variant="secondary" className="text-[10px]">
                ₹1 each
              </Badge>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {avatarItems.map((item: any) => {
                const owned = !!purchasedPerks[item.id];
                const isPurchasing = purchasing === item.id;
                const currentAvatarUrl = (profile as any)?.avatar_url || "";
                const isActive = owned && currentAvatarUrl.includes(item.image_url);

                return (
                  <div key={item.id} className="flex flex-col items-center gap-2">
                    <div
                      className={`relative rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer group ${
                        isActive
                          ? "ring-4 ring-primary shadow-lg shadow-primary/20 scale-105"
                          : owned
                            ? "ring-2 ring-emerald-500 hover:ring-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
                            : "ring-2 ring-border hover:ring-primary/50 hover:shadow-xl hover:scale-105"
                      }`}
                      style={{ width: 96, height: 96 }}
                      onClick={async () => {
                        if (isPurchasing) return;
                        if (!owned) {
                          setAvatarPurchaseItem(item);
                          return;
                        }
                        if (isActive) {
                          toast.info(`${item.name} is already your active avatar.`);
                          return;
                        }
                        try {
                          const borderMatch = currentAvatarUrl.match(/[?&]profile_border=([^&]+)/);
                          const activeBorder = borderMatch ? borderMatch[1] : "";
                          const nextUrl = activeBorder
                            ? `${item.image_url}?profile_border=${activeBorder}`
                            : item.image_url;

                          setPurchasing(item.id);
                          await saveFieldFn({ data: { field: "avatar_url", value: nextUrl } });
                          toast.success(`${item.name} set as active avatar!`);

                          qc.invalidateQueries({ queryKey: ["my-profile", user?.id] });
                          qc.invalidateQueries({ queryKey: ["profile-full"] });
                          qc.invalidateQueries({ queryKey: ["profile-mini"] });
                          qc.invalidateQueries({ queryKey: ["profile"] });
                        } catch (err: any) {
                          toast.error(err.message || "Failed to update avatar");
                        } finally {
                          setPurchasing(null);
                        }
                      }}
                    >
                      <InteractiveAvatar
                        src={item.image_url || `/avatars/${item.id || "avatar-m1"}.svg`}
                        name={item.name}
                        size={96}
                        className="w-full h-full"
                      />
                      {/* Hover overlay */}
                      {!owned && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">Unlock</span>
                        </div>
                      )}
                      {owned && (
                        <div
                          className={`absolute top-1.5 right-1.5 rounded-full p-1 shadow-md ${isActive ? "bg-primary text-white" : "bg-emerald-500 text-white"}`}
                        >
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <p
                      className={`text-xs font-semibold text-center truncate max-w-[96px] ${isActive ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {item.name}
                    </p>
                    <div className="flex items-center gap-1 text-[10px]">
                      {isActive ? (
                        <span className="text-primary font-medium">Active</span>
                      ) : owned ? (
                        <span className="text-emerald-600 font-medium">Owned</span>
                      ) : (
                        <span className="text-muted-foreground">₹{item.prime_price || 1}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
                    <Card
                      className={`h-full flex flex-col overflow-hidden border-border bg-card ${owned ? "ring-2 ring-emerald-500/30" : ""}`}
                    >
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-xl ${perk.bg}`}>
                            <Icon className={`h-6 w-6 ${perk.color}`} />
                          </div>
                          <div className="flex items-center gap-2">
                            {perk.autoApply && (
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                              >
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
                        <p className="text-sm text-muted-foreground flex-1">{perk.description}</p>

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

        {/* Transaction History & Log */}
        {user && (
          <div className="mt-16 border-t pt-10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" /> Purchase & Transaction History
            </h2>
            <Tabs defaultValue="perks" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
                <TabsTrigger value="perks">XP Perks ({serverPurchases.length})</TabsTrigger>
                <TabsTrigger value="wallet">Wallet Transactions ({walletTxs.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="perks" className="space-y-3">
                {serverPurchases.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground bg-muted/20 rounded-2xl border">
                    No XP perk purchases recorded yet.
                  </div>
                ) : (
                  <div className="border rounded-2xl overflow-hidden bg-card divide-y divide-border">
                    {(serverPurchases as any[]).map((p) => (
                      <div
                        key={p.id}
                        className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-sm">{p.perk_name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(p.created_at || p.purchasedAt || Date.now()).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-primary/5 text-primary text-[10px]"
                          >
                            {p.cost} XP
                          </Badge>
                          <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px] hover:bg-emerald-500/10">
                            Active
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="wallet" className="space-y-3">
                {walletTxs.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground bg-muted/20 rounded-2xl border">
                    No wallet transactions recorded yet.
                  </div>
                ) : (
                  <div className="border rounded-2xl overflow-hidden bg-card divide-y divide-border">
                    {[...walletTxs]
                      .sort(
                        (a: any, b: any) =>
                          new Date(b.created_at || 0).getTime() -
                          new Date(a.created_at || 0).getTime(),
                      )
                      .map((tx: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-sm">
                              {tx.description ||
                                (tx.type === "credit" ? "Wallet Topup" : "Store Purchase")}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {tx.created_at ? new Date(tx.created_at).toLocaleString() : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono text-xs font-bold ${tx.type === "credit" ? "text-emerald-500" : "text-destructive"}`}
                            >
                              {tx.type === "credit" ? "+" : "-"}₹{tx.amount_inr}
                            </span>
                            <Badge
                              className={cn(
                                "text-[10px] capitalize",
                                tx.status === "completed"
                                  ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10"
                                  : "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/10",
                              )}
                            >
                              {tx.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      <Dialog
        open={!!avatarPurchaseItem}
        onOpenChange={(open) => !open && setAvatarPurchaseItem(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Unlock {avatarPurchaseItem?.name}</DialogTitle>
            <DialogDescription>
              Purchase this 3D avatar and set it as your profile image.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-xl flex items-center justify-center bg-card">
              {avatarPurchaseItem?.name === "Avatar M1" ? (
                <InteractiveAvatar
                  src={avatarPurchaseItem.image_url || "/avatars/avatar-m1.svg"}
                  name={avatarPurchaseItem.name}
                  size={128}
                />
              ) : (
                <img
                  src={avatarPurchaseItem?.image_url || "/avatars/avatar-m1.svg"}
                  alt={avatarPurchaseItem?.name || "Avatar"}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {avatarPurchaseItem?.description ||
                "A professional 3D avatar for your Learnify profile."}
            </p>
          </div>
          <DialogFooter>
            <Button
              className="w-full flex items-center justify-center gap-1.5 h-11"
              disabled={
                walletBalance < (avatarPurchaseItem?.prime_price || 1) || purchasing !== null
              }
              onClick={() => handleAvatarPurchase("wallet")}
            >
              <CreditCard className="h-4 w-4" />
              Pay with ₹{avatarPurchaseItem?.prime_price || 1} Cash
            </Button>
          </DialogFooter>
          <div className="text-[11px] text-center text-muted-foreground border-t pt-3">
            Your balance: <strong className="text-foreground">₹{walletBalance}</strong> Wallet Cash.
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
