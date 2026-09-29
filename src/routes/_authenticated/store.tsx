import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  Star,
  Download,
  ExternalLink,
  Package,
  Search,
  Check,
  Sparkles,
  CreditCard,
  FileText,
  Code2,
  BookOpen,
  LayoutTemplate,
  Palette,
  Wrench,
  Loader2,
  Clock,
  ArrowRight,
  ShieldCheck,
  FolderDown,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  deductXP,
  recordPurchase,
  getUserPurchases,
  purchaseWithWallet,
} from "@/lib/gamification.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  PRODUCT_CATEGORIES,
  CATEGORY_LABELS,
  parseProductMetadata,
} from "@/lib/store-products";

export const Route = createFileRoute("/_authenticated/store")({
  component: StorePage,
  head: () => ({ meta: [{ title: "Digital Store & XP Marketplace — Learnify AI" }] }),
});

// Backward-compatibility exports
export function isPerkActive(_perkId: string): boolean {
  return false;
}
export function hasDiscount(): boolean {
  return false;
}
export function getDiscountPercent(): number {
  return 0;
}

export default function StorePage() {
  const { user, isAdmin } = useAuth();
  const qc = useQueryClient();
  const deductFn = useServerFn(deductXP);
  const recordFn = useServerFn(recordPurchase);
  const fetchPurchases = useServerFn(getUserPurchases);
  const purchaseWalletFn = useServerFn(purchaseWithWallet);

  const [activeTab, setActiveTab] = useState<"browse" | "library" | "history">("browse");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [confirmItem, setConfirmItem] = useState<{
    item: any;
    method: "xp" | "wallet";
  } | null>(null);

  // Fetch enabled store items from database
  const { data: storeItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ["store-items-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_items")
        .select("*")
        .eq("enabled", true)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Failed to load store items:", error);
        return [];
      }
      return data ?? [];
    },
  });

  // Fetch user profile for XP
  const { data: profile } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("xp, avatar_url, full_name")
        .eq("id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  // Fetch user purchases
  const { data: serverPurchases = [] } = useQuery({
    queryKey: ["my-purchases", user?.id],
    queryFn: () => fetchPurchases({ data: { userId: user!.id } }),
    enabled: !!user,
  });

  // Fetch wallet transactions for cash balance
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

  const walletBalance = useMemo(() => {
    return walletTxs
      .filter((t: any) => t.status === "completed")
      .reduce(
        (s: number, t: any) =>
          s + (t.type === "credit" ? Number(t.amount_inr) : -Number(t.amount_inr)),
        0,
      );
  }, [walletTxs]);

  const purchasedMap = useMemo(() => {
    return (serverPurchases as any[]).reduce(
      (acc: Record<string, any>, p: any) => {
        acc[p.perkId] = p;
        return acc;
      },
      {} as Record<string, any>,
    );
  }, [serverPurchases]);

  const xp = profile?.xp || 0;
  const ownedCount = Object.keys(purchasedMap).length;

  // Filtered store items
  const filteredItems = useMemo(() => {
    return storeItems.filter((item: any) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags || []).some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [storeItems, selectedCategory, searchQuery]);

  // User's unlocked/owned products joined with store items metadata
  const unlockedProducts = useMemo(() => {
    const list: any[] = [];
    for (const purchase of serverPurchases as any[]) {
      const matchingItem = storeItems.find((i: any) => i.id === purchase.perkId);
      list.push({
        id: purchase.perkId,
        purchaseId: purchase.id,
        name: purchase.perkName || matchingItem?.name || "Digital Asset",
        purchasedAt: purchase.purchasedAt || purchase.created_at,
        cost: purchase.cost,
        item: matchingItem,
      });
    }
    return list;
  }, [serverPurchases, storeItems]);

  const handlePurchase = async () => {
    if (!user || !confirmItem) return;
    const { item, method } = confirmItem;
    const perkId = item.id;
    const name = item.name;

    setPurchasing(perkId);
    try {
      if (method === "xp") {
        if (xp < item.cost) {
          toast.error("Not enough XP to unlock this item!");
          return;
        }
        await deductFn({ data: { userId: user.id, amount: item.cost, item: name } });
        await recordFn({ data: { userId: user.id, perkId, perkName: name, cost: item.cost } });
      } else {
        const costInr = item.prime_price || 0;
        if (walletBalance < costInr) {
          toast.error(`Insufficient wallet balance. Need ₹${costInr}, have ₹${walletBalance}.`);
          return;
        }
        await purchaseWalletFn({ data: { userId: user.id, perkId, perkName: name, costInr } });
      }

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"],
      });

      toast.success(`Successfully unlocked "${name}"!`);
      setConfirmItem(null);
      qc.invalidateQueries({ queryKey: ["my-profile", user.id] });
      qc.invalidateQueries({ queryKey: ["my-purchases", user.id] });
      qc.invalidateQueries({ queryKey: ["wallet-tx", user.id] });
      qc.invalidateQueries({ queryKey: ["wallet-balance"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to complete purchase");
    } finally {
      setPurchasing(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "software":
        return <Code2 className="h-4 w-4" />;
      case "books_guides":
        return <BookOpen className="h-4 w-4" />;
      case "website_designs":
        return <Palette className="h-4 w-4" />;
      case "tools":
        return <Wrench className="h-4 w-4" />;
      default:
        return <LayoutTemplate className="h-4 w-4" />;
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Marketplace Header */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="h-3.5 w-3.5" /> Digital Downloads & Asset Store
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                Digital Products & XP Marketplace
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Spend your hard-earned XP or Wallet Cash on downloadable software, production templates,
                books, interview guides, and website designs.
              </p>
            </div>

            {/* User Balances Card */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <div className="bg-card/90 backdrop-blur-md border border-border rounded-2xl p-4 shadow-sm min-w-[140px]">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> XP Available
                </div>
                <div className="text-xl font-bold font-display text-foreground">
                  {xp.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">XP</span>
                </div>
              </div>

              <div className="bg-card/90 backdrop-blur-md border border-border rounded-2xl p-4 shadow-sm min-w-[140px]">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <CreditCard className="h-4 w-4 text-emerald-500" /> Wallet Cash
                </div>
                <div className="text-xl font-bold font-display text-emerald-600">
                  ₹{walletBalance.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Bar inside Header */}
          <div className="mt-8 pt-6 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("browse")}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
                  activeTab === "browse"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Package className="h-4 w-4" /> Browse Store ({storeItems.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("library")}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
                  activeTab === "library"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <FolderDown className="h-4 w-4" /> My Library & Downloads
                {ownedCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
                    {ownedCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
                  activeTab === "history"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Clock className="h-4 w-4" /> Transaction History
              </button>
            </div>

            {isAdmin && (
              <Link
                to="/admin/store"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20"
              >
                <Wrench className="h-3.5 w-3.5" /> Manage Store in Admin
              </Link>
            )}
          </div>
        </div>

        {/* TAB 1: BROWSE DIGITAL PRODUCTS */}
        {activeTab === "browse" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors",
                    selectedCategory === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  All Products
                </button>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
                      selectedCategory === cat.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {getCategoryIcon(cat.id)}
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative sm:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates, guides, software..."
                  className="pl-9 h-9 text-xs"
                />
              </div>
            </div>

            {/* Products Grid */}
            {itemsLoading ? (
              <div className="text-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Loading digital products...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 px-4 border border-dashed rounded-3xl bg-card/50 max-w-xl mx-auto space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Package className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">Catalog is being prepared</h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    {searchQuery || selectedCategory !== "all"
                      ? "No products matched your filters. Try clearing your search."
                      : "Digital products, code templates, software, and books are currently being published by the admin."}
                  </p>
                </div>
                {isAdmin && (
                  <Link to="/admin/store">
                    <Button size="sm" className="gap-2 mt-2">
                      <Sparkles className="h-4 w-4" /> Add Products in Admin Panel
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item: any, idx: number) => {
                  const meta = parseProductMetadata(item.perks);
                  const isOwned = !!purchasedMap[item.id];
                  const canAffordXp = item.cost > 0 && xp >= item.cost;
                  const canAffordWallet = item.prime_price > 0 && walletBalance >= item.prime_price;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card
                        className={cn(
                          "h-full flex flex-col justify-between overflow-hidden border transition-all duration-200 group bg-card",
                          isOwned
                            ? "ring-2 ring-emerald-500/40 shadow-emerald-500/5 shadow-md"
                            : "hover:border-primary/50 hover:shadow-lg",
                        )}
                      >
                        {/* Cover Image Banner */}
                        <div className="relative h-48 bg-muted overflow-hidden border-b border-border">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-muted flex flex-col items-center justify-center gap-2">
                              {item.category === "software" && <Code2 className="h-12 w-12 text-primary/40" />}
                              {item.category === "templates" && <LayoutTemplate className="h-12 w-12 text-primary/40" />}
                              {item.category === "books_guides" && <BookOpen className="h-12 w-12 text-primary/40" />}
                              {item.category === "website_designs" && <Palette className="h-12 w-12 text-primary/40" />}
                              {item.category === "tools" && <Wrench className="h-12 w-12 text-primary/40" />}
                              <span className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                {CATEGORY_LABELS[item.category] || item.category}
                              </span>
                            </div>
                          )}

                          {/* Category Badge */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                            <Badge
                              variant="secondary"
                              className="text-[10px] backdrop-blur-md bg-background/80 font-semibold"
                            >
                              {getCategoryIcon(item.category)}
                              <span className="ml-1">{CATEGORY_LABELS[item.category] || item.category}</span>
                            </Badge>
                            {meta.format && (
                              <Badge
                                variant="outline"
                                className="text-[10px] backdrop-blur-md bg-background/70 border-border/80"
                              >
                                {meta.format}
                              </Badge>
                            )}
                          </div>

                          {/* Ownership indicator */}
                          {isOwned && (
                            <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1">
                              <Check className="h-3 w-3" /> Unlocked
                            </div>
                          )}
                        </div>

                        {/* Card Body */}
                        <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <h3 className="font-display font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors">
                              {item.name}
                            </h3>

                            {item.description && (
                              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                {item.description}
                              </p>
                            )}

                            {/* Tags */}
                            {item.tags?.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {item.tags.slice(0, 3).map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="text-[10px] text-muted-foreground/80 bg-muted px-2 py-0.5 rounded-md font-mono"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Price and Download CTAs */}
                          <div className="pt-4 border-t border-border/80 space-y-3">
                            {isOwned ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-emerald-600 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-xl">
                                  <span className="flex items-center gap-1.5">
                                    <ShieldCheck className="h-4 w-4" /> Ready in Your Library
                                  </span>
                                  {meta.size && <span className="text-[10px] text-muted-foreground">{meta.size}</span>}
                                </div>

                                <div className="flex items-center gap-2">
                                  {meta.downloadUrl ? (
                                    <a
                                      href={meta.downloadUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
                                    >
                                      <Download className="h-3.5 w-3.5" /> Download Asset
                                    </a>
                                  ) : (
                                    <button
                                      type="button"
                                      disabled
                                      className="flex-1 text-center py-2 text-xs text-muted-foreground bg-muted rounded-xl"
                                    >
                                      Access in Library
                                    </button>
                                  )}

                                  {meta.demoUrl && (
                                    <a
                                      href={meta.demoUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                      title="Live Preview"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div>
                                {/* Price Summary */}
                                <div className="flex items-center justify-between text-xs mb-3">
                                  <span className="text-muted-foreground">Price</span>
                                  <div className="flex items-center gap-2">
                                    {item.cost > 0 && (
                                      <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                                        {item.cost.toLocaleString()} XP
                                      </span>
                                    )}
                                    {item.prime_price > 0 && (
                                      <span className="font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                        ₹{item.prime_price}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Purchase Options */}
                                <div className="flex items-center gap-2">
                                  {item.cost > 0 && (
                                    <Button
                                      size="sm"
                                      onClick={() => setConfirmItem({ item, method: "xp" })}
                                      disabled={!canAffordXp || purchasing === item.id}
                                      className="flex-1 gap-1.5 text-xs h-9"
                                      variant={canAffordXp ? "default" : "secondary"}
                                    >
                                      <Star className="h-3.5 w-3.5 fill-current" />
                                      {canAffordXp ? "Unlock with XP" : "Need more XP"}
                                    </Button>
                                  )}

                                  {item.prime_price > 0 && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setConfirmItem({ item, method: "wallet" })}
                                      disabled={purchasing === item.id}
                                      className="flex-1 gap-1.5 text-xs h-9 border-primary/30 hover:border-primary"
                                    >
                                      <CreditCard className="h-3.5 w-3.5 text-primary" />
                                      Pay ₹{item.prime_price}
                                    </Button>
                                  )}

                                  {meta.demoUrl && (
                                    <a
                                      href={meta.demoUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
                                      title="Live Preview"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY LIBRARY & DOWNLOADS */}
        {activeTab === "library" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold">My Digital Library</h2>
                <p className="text-xs text-muted-foreground">
                  All templates, guides, and software products you have unlocked
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {unlockedProducts.length} Item{unlockedProducts.length !== 1 ? "s" : ""} Owned
              </Badge>
            </div>

            {unlockedProducts.length === 0 ? (
              <div className="text-center py-20 px-4 border border-dashed rounded-3xl bg-card max-w-lg mx-auto space-y-4">
                <FolderDown className="h-12 w-12 text-muted-foreground/40 mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-bold text-base">Your library is empty</h3>
                  <p className="text-xs text-muted-foreground">
                    You haven't unlocked any digital products yet. Use your XP or wallet balance to get templates, books, and code.
                  </p>
                </div>
                <Button size="sm" onClick={() => setActiveTab("browse")} className="gap-2">
                  <Package className="h-4 w-4" /> Browse Store Catalog
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unlockedProducts.map((p) => {
                  const meta = parseProductMetadata(p.item?.perks);
                  return (
                    <Card key={p.purchaseId} className="overflow-hidden border bg-card hover:border-primary/40 transition-colors">
                      <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-base truncate text-foreground">{p.name}</h3>
                            {meta.format && (
                              <Badge variant="secondary" className="text-[10px]">
                                {meta.format}
                              </Badge>
                            )}
                          </div>
                          {p.item?.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {p.item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                            <span>Unlocked {new Date(p.purchasedAt).toLocaleDateString()}</span>
                            {meta.size && <span>• {meta.size}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                          {meta.downloadUrl ? (
                            <a
                              href={meta.downloadUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
                            >
                              <Download className="h-3.5 w-3.5" /> Download
                            </a>
                          ) : (
                            <Button size="sm" variant="outline" disabled className="text-xs">
                              Link Pending
                            </Button>
                          )}

                          {meta.demoUrl && (
                            <a
                              href={meta.demoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center h-9 w-9 rounded-xl border hover:bg-muted text-muted-foreground hover:text-foreground"
                              title="Live Demo"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TRANSACTION HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <h2 className="text-xl font-display font-bold">Transaction History</h2>
            <Tabs defaultValue="xp" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-sm mb-4">
                <TabsTrigger value="xp">XP Orders ({serverPurchases.length})</TabsTrigger>
                <TabsTrigger value="wallet">Wallet Activity ({walletTxs.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="xp">
                <Card>
                  <CardContent className="p-0">
                    {serverPurchases.length === 0 ? (
                      <div className="text-center py-12 text-sm text-muted-foreground">
                        No XP purchases recorded yet.
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {(serverPurchases as any[]).map((p) => (
                          <div key={p.id} className="p-4 flex items-center justify-between hover:bg-muted/10">
                            <div>
                              <p className="font-semibold text-sm">{p.perk_name || p.perkName}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {new Date(p.created_at || p.purchasedAt || Date.now()).toLocaleString()}
                              </p>
                            </div>
                            <Badge className="bg-amber-500/10 text-amber-600 font-bold text-xs">
                              <Star className="h-3 w-3 mr-1 fill-amber-500" />
                              {p.cost} XP
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wallet">
                <Card>
                  <CardContent className="p-0">
                    {walletTxs.length === 0 ? (
                      <div className="text-center py-12 text-sm text-muted-foreground">
                        No wallet transactions recorded yet.
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {[...walletTxs]
                          .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
                          .map((tx: any, idx: number) => (
                            <div key={idx} className="p-4 flex items-center justify-between hover:bg-muted/10">
                              <div>
                                <p className="font-semibold text-sm">
                                  {tx.description || (tx.type === "credit" ? "Wallet Topup" : "Digital Asset Purchase")}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  {tx.created_at ? new Date(tx.created_at).toLocaleString() : ""}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={cn("text-xs font-bold font-mono", tx.type === "credit" ? "text-emerald-500" : "text-destructive")}>
                                  {tx.type === "credit" ? "+" : "-"}₹{tx.amount_inr}
                                </span>
                                <Badge className="text-[10px] capitalize bg-muted text-foreground">
                                  {tx.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* CONFIRMATION PURCHASE DIALOG */}
        <Dialog open={!!confirmItem} onOpenChange={(open) => !open && setConfirmItem(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" /> Unlock {confirmItem?.item.name}
              </DialogTitle>
              <DialogDescription>
                Confirm your purchase to get instant access and download rights for this asset.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 border-y border-border/80 my-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Asset:</span>
                <span className="font-semibold">{confirmItem?.item.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-semibold capitalize">
                  {confirmItem?.method === "xp" ? "Learnify XP" : "Wallet Cash (₹)"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cost:</span>
                <span className="font-bold text-primary">
                  {confirmItem?.method === "xp"
                    ? `${confirmItem.item.cost.toLocaleString()} XP`
                    : `₹${confirmItem?.item.prime_price}`}
                </span>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setConfirmItem(null)} disabled={purchasing !== null}>
                Cancel
              </Button>
              <Button onClick={handlePurchase} disabled={purchasing !== null} className="gap-2">
                {purchasing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Unlocking...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Confirm & Unlock
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
