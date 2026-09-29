import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ShoppingCart,
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  Plus,
  Pencil,
  Trash2,
  Crown,
  Sparkles,
  Image as ImageIcon,
  Check,
  Tags,
  Package,
  Eye,
  Download,
  ExternalLink,
  Code2,
  BookOpen,
  LayoutTemplate,
  Palette,
  Wrench,
  FileText,
  AlertCircle,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getAllPurchases } from "@/lib/gamification.functions";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  PRODUCT_CATEGORIES,
  CATEGORY_LABELS,
  parseProductMetadata,
  buildProductPerks,
} from "@/lib/store-products";

export const Route = createFileRoute("/_authenticated/admin/store")({
  head: () => ({ meta: [{ title: "Digital Store & Products Admin — Learnify AI" }] }),
  component: AdminStorePage,
});

const PER_PAGE = 25;

export default function AdminStorePage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"items" | "purchases">("items");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [itemDialog, setItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form State for Digital Products
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    category: "templates",
    cost: 500,
    prime_price: 199,
    is_prime: true,
    enabled: true,
    image_url: "",
    downloadUrl: "",
    demoUrl: "",
    format: "",
    size: "",
    tags: "",
    stock: "",
    auto_claim: true,
  });

  const purchasesQuery = useQuery({
    queryKey: ["admin-purchases", page],
    queryFn: async () => {
      const res = await getAllPurchases({ data: { page, limit: PER_PAGE } });
      return res;
    },
  });

  const itemsQuery = useQuery({
    queryKey: ["admin-store-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_items")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const purchases = purchasesQuery.data?.purchases ?? [];
  const total = purchasesQuery.data?.total ?? 0;
  const totalPages = Math.ceil(total / PER_PAGE);
  const items = itemsQuery.data ?? [];

  const filteredItems = items.filter((item: any) => {
    const matchesSearch =
      search.trim() === "" ||
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      (item.tags || []).some((t: string) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const filteredPurchases = search
    ? purchases.filter(
        (p: any) =>
          p.perkName?.toLowerCase().includes(search.toLowerCase()) ||
          p.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
          p.user?.email?.toLowerCase().includes(search.toLowerCase()),
      )
    : purchases;

  const totalXpSpent = purchases.reduce((sum: number, p: any) => sum + (p.cost || 0), 0);

  const openNewItem = () => {
    setEditingItem(null);
    setItemForm({
      name: "",
      description: "",
      category: "templates",
      cost: 500,
      prime_price: 199,
      is_prime: true,
      enabled: true,
      image_url: "",
      downloadUrl: "",
      demoUrl: "",
      format: "Next.js 15 + Tailwind",
      size: "15 MB",
      tags: "template, react, modern",
      stock: "",
      auto_claim: true,
    });
    setItemDialog(true);
  };

  const openEditItem = (item: any) => {
    setEditingItem(item);
    const meta = parseProductMetadata(item.perks);
    setItemForm({
      name: item.name || "",
      description: item.description || "",
      category: item.category || "templates",
      cost: item.cost ?? 0,
      prime_price: item.prime_price ?? 0,
      is_prime: item.is_prime ?? true,
      enabled: item.enabled !== false,
      image_url: item.image_url || "",
      downloadUrl: meta.downloadUrl || "",
      demoUrl: meta.demoUrl || "",
      format: meta.format || "",
      size: meta.size || "",
      tags: (item.tags || []).join(", "),
      stock: item.stock != null ? String(item.stock) : "",
      auto_claim: item.auto_claim !== false,
    });
    setItemDialog(true);
  };

  const saveItem = async () => {
    if (!itemForm.name.trim()) return toast.error("Product name is required");

    const perksArray = buildProductPerks({
      downloadUrl: itemForm.downloadUrl,
      demoUrl: itemForm.demoUrl,
      format: itemForm.format,
      size: itemForm.size,
    });

    const payload = {
      name: itemForm.name.trim(),
      description: itemForm.description.trim() || null,
      category: itemForm.category,
      cost: Math.max(0, Number(itemForm.cost) || 0),
      is_prime: itemForm.is_prime || itemForm.prime_price > 0,
      prime_price: Math.max(0, Number(itemForm.prime_price) || 0),
      auto_claim: itemForm.auto_claim,
      enabled: itemForm.enabled,
      image_url: itemForm.image_url.trim() || null,
      stock: itemForm.stock ? parseInt(itemForm.stock, 10) : null,
      tags: itemForm.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      perks: perksArray,
    };

    try {
      if (editingItem) {
        const { error } = await supabase
          .from("store_items")
          .update(payload)
          .eq("id", editingItem.id);
        if (error) throw error;
        toast.success(`Updated "${payload.name}" successfully!`);
      } else {
        const { error } = await supabase.from("store_items").insert(payload);
        if (error) throw error;
        toast.success(`Created "${payload.name}" successfully!`);
      }
      setItemDialog(false);
      qc.invalidateQueries({ queryKey: ["admin-store-items"] });
      qc.invalidateQueries({ queryKey: ["store-items-public"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to save item");
    }
  };

  const deleteItem = async (item: any) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"? Existing purchases will not be affected.`)) {
      return;
    }
    try {
      const { error } = await supabase.from("store_items").delete().eq("id", item.id);
      if (error) throw error;
      toast.success("Item deleted successfully");
      qc.invalidateQueries({ queryKey: ["admin-store-items"] });
      qc.invalidateQueries({ queryKey: ["store-items-public"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to delete item");
    }
  };

  const toggleItemStatus = async (item: any) => {
    try {
      const { error } = await supabase
        .from("store_items")
        .update({ enabled: !item.enabled })
        .eq("id", item.id);
      if (error) throw error;
      toast.success(`Item is now ${!item.enabled ? "Active" : "Disabled"}`);
      qc.invalidateQueries({ queryKey: ["admin-store-items"] });
      qc.invalidateQueries({ queryKey: ["store-items-public"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to update status");
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Top Header & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">Digital Products & XP Store</h1>
              <p className="text-xs text-muted-foreground">
                Manage downloadable software, templates, guides, website designs, and assets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={openNewItem} className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" /> Add Digital Product
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Total Products"
            value={items.length.toString()}
            sub={`${items.filter((i: any) => i.enabled).length} active in store`}
            color="text-primary"
          />
          <StatCard
            label="Total Orders"
            value={total.toLocaleString()}
            sub="Across all items"
            color="text-emerald-500"
          />
          <StatCard
            label="XP Spent"
            value={totalXpSpent.toLocaleString()}
            sub="Points redeemed"
            color="text-amber-500"
          />
          <StatCard
            label="Store Categories"
            value="5 Types"
            sub="Templates, Soft, Books, Web, Tools"
            color="text-blue-500"
          />
        </div>

        {/* Navigation Tabs */}
        <Tabs value={tab} onValueChange={(v: any) => setTab(v)} className="w-full">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
            <TabsList className="grid grid-cols-2 w-full sm:w-auto">
              <TabsTrigger value="items" className="gap-2">
                <Package className="h-4 w-4" /> Products Catalog ({items.length})
              </TabsTrigger>
              <TabsTrigger value="purchases" className="gap-2">
                <ShoppingCart className="h-4 w-4" /> Orders & Downloads ({total})
              </TabsTrigger>
            </TabsList>

            {/* Filter and Search */}
            <div className="flex items-center gap-2">
              {tab === "items" && (
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px] h-9 text-xs">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {PRODUCT_CATEGORIES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </div>
          </div>

          {/* TAB 1: Digital Products Catalog */}
          <TabsContent value="items" className="space-y-4">
            {itemsQuery.isLoading ? (
              <div className="text-center py-16 text-muted-foreground text-sm">
                Loading products catalog...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16 px-4 border border-dashed rounded-2xl bg-card">
                <Package className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="font-bold text-base mb-1">No products found</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto mb-4">
                  {search || categoryFilter !== "all"
                    ? "Try adjusting your search terms or category filter."
                    : "Add your first downloadable template, software package, or guide to start selling in the store."}
                </p>
                <Button onClick={openNewItem} size="sm" className="gap-2">
                  <Plus className="h-3.5 w-3.5" /> Add First Product
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item: any) => {
                  const meta = parseProductMetadata(item.perks);
                  return (
                    <Card
                      key={item.id}
                      className={cn(
                        "overflow-hidden border transition-all flex flex-col justify-between group",
                        item.enabled ? "bg-card hover:border-primary/40 shadow-sm" : "bg-muted/30 opacity-70 border-dashed",
                      )}
                    >
                      {/* Product Thumbnail Banner */}
                      <div className="relative h-40 bg-gradient-to-br from-primary/10 via-primary/5 to-muted overflow-hidden border-b border-border">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-2">
                            {item.category === "software" && <Code2 className="h-10 w-10 text-primary/40" />}
                            {item.category === "templates" && <LayoutTemplate className="h-10 w-10 text-primary/40" />}
                            {item.category === "books_guides" && <BookOpen className="h-10 w-10 text-primary/40" />}
                            {item.category === "website_designs" && <Palette className="h-10 w-10 text-primary/40" />}
                            {item.category === "tools" && <Wrench className="h-10 w-10 text-primary/40" />}
                            {item.category === "cosmetics" && <Sparkles className="h-10 w-10 text-primary/40" />}
                            <span className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                              {CATEGORY_LABELS[item.category] || item.category}
                            </span>
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                          <Badge variant="secondary" className="text-[10px] backdrop-blur-md bg-background/80 font-medium">
                            {CATEGORY_LABELS[item.category] || item.category}
                          </Badge>
                          {meta.format && (
                            <Badge variant="outline" className="text-[10px] backdrop-blur-md bg-background/70 border-border/80">
                              {meta.format}
                            </Badge>
                          )}
                        </div>

                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => toggleItemStatus(item)}
                            title={item.enabled ? "Click to disable" : "Click to enable"}
                            className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm transition-colors",
                              item.enabled
                                ? "bg-emerald-500/90 text-white"
                                : "bg-muted-foreground/70 text-white",
                            )}
                          >
                            {item.enabled ? "Active" : "Disabled"}
                          </button>
                        </div>
                      </div>

                      {/* Card Content */}
                      <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-bold text-sm leading-tight text-foreground group-hover:text-primary transition-colors">
                              {item.name}
                            </h3>
                          </div>

                          {item.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          )}

                          {/* Metadata row: Download & Demo status */}
                          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                            {meta.downloadUrl ? (
                              <a
                                href={meta.downloadUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md hover:underline font-medium"
                              >
                                <Download className="h-3 w-3" /> Download Link Ready
                              </a>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md text-[10px]">
                                <AlertCircle className="h-3 w-3" /> No download URL set
                              </span>
                            )}

                            {meta.demoUrl && (
                              <a
                                href={meta.demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-md hover:underline font-medium"
                              >
                                <ExternalLink className="h-3 w-3" /> Demo Preview
                              </a>
                            )}

                            {meta.size && (
                              <span className="text-muted-foreground text-[10px] bg-muted px-1.5 py-0.5 rounded">
                                {meta.size}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price and Action Bar */}
                        <div className="pt-3 border-t border-border flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {item.cost > 0 && (
                              <div className="flex items-center gap-1 font-bold text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg">
                                <Star className="h-3.5 w-3.5 fill-amber-500" />
                                {item.cost.toLocaleString()} XP
                              </div>
                            )}
                            {item.prime_price > 0 && (
                              <div className="font-bold text-xs text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-lg">
                                ₹{item.prime_price}
                              </div>
                            )}
                            {item.cost === 0 && item.prime_price === 0 && (
                              <Badge variant="outline" className="text-xs text-muted-foreground">
                                Free
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => openEditItem(item)}
                              title="Edit product"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => deleteItem(item)}
                              title="Delete product"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* TAB 2: Orders & Downloads History */}
          <TabsContent value="purchases" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                {purchasesQuery.isLoading ? (
                  <div className="text-center py-12 text-sm text-muted-foreground">
                    Loading orders...
                  </div>
                ) : filteredPurchases.length === 0 ? (
                  <div className="text-center py-12 text-sm text-muted-foreground">
                    No orders or downloads recorded yet.
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredPurchases.map((p: any) => (
                      <div
                        key={p.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/10 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm">{p.perkName}</p>
                            <Badge
                              variant="outline"
                              className="text-[10px] capitalize bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            >
                              {p.status || "active"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            User: <strong className="text-foreground">{p.user?.fullName || "Anonymous"}</strong> ({p.user?.email || p.userId})
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Purchased: {new Date(p.purchasedAt || Date.now()).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            {p.cost > 0 ? (
                              <Badge className="bg-amber-500/10 text-amber-600 text-xs">
                                <Star className="h-3 w-3 mr-1 fill-amber-500" /> {p.cost} XP
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-500/10 text-emerald-600 text-xs">
                                Cash / Wallet
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                <span>
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* DIALOG: Add / Edit Product */}
        <Dialog open={itemDialog} onOpenChange={(o) => !o && setItemDialog(false)}>
          <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5 text-primary" />
                {editingItem ? "Edit Digital Product" : "Add New Digital Product"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Product Title *</Label>
                  <Input
                    value={itemForm.name}
                    onChange={(e) => setItemForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Next.js 15 SaaS Starter Kit or React Interview Handbook"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Category *</Label>
                  <Select
                    value={itemForm.category}
                    onValueChange={(v) => setItemForm((f) => ({ ...f, category: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.label} ({c.desc})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Description / What is included</Label>
                  <Textarea
                    value={itemForm.description}
                    onChange={(e) => setItemForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    placeholder="Provide a compelling overview of what the buyer receives, technologies used, and how to use it..."
                  />
                </div>
              </div>

              {/* Digital Assets & Links */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5" /> Digital Asset & Access Links
                </h4>

                <div className="space-y-1.5">
                  <Label className="text-xs">
                    Direct Download URL or Access Link (ZIP, PDF, GitHub Repo, Google Drive, Notion)
                  </Label>
                  <Input
                    value={itemForm.downloadUrl}
                    onChange={(e) => setItemForm((f) => ({ ...f, downloadUrl: e.target.value }))}
                    placeholder="https://drive.google.com/... or https://github.com/... or /downloads/file.zip"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    This link is delivered immediately in the user's "My Library / Downloads" upon unlocking.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" /> Live Demo URL (Optional)
                    </Label>
                    <Input
                      value={itemForm.demoUrl}
                      onChange={(e) => setItemForm((f) => ({ ...f, demoUrl: e.target.value }))}
                      placeholder="https://demo.example.com or Figma URL"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs flex items-center gap-1">
                      <FileText className="h-3 w-3" /> File Format / Stack
                    </Label>
                    <Input
                      value={itemForm.format}
                      onChange={(e) => setItemForm((f) => ({ ...f, format: e.target.value }))}
                      placeholder="e.g. Next.js 15, PDF eBook, Figma UI Kit"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">File Size / Content Length</Label>
                    <Input
                      value={itemForm.size}
                      onChange={(e) => setItemForm((f) => ({ ...f, size: e.target.value }))}
                      placeholder="e.g. 18.5 MB, 140 Pages, Notion Workspace"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" /> Cover Image URL
                    </Label>
                    <Input
                      value={itemForm.image_url}
                      onChange={(e) => setItemForm((f) => ({ ...f, image_url: e.target.value }))}
                      placeholder="https://... image banner"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Visibility */}
              <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> Pricing & Availability
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">XP Price (Points)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={itemForm.cost}
                      onChange={(e) => setItemForm((f) => ({ ...f, cost: Number(e.target.value) }))}
                      placeholder="500 (Set 0 if cash only)"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Cash / Wallet Price (₹ INR)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={itemForm.prime_price}
                      onChange={(e) => setItemForm((f) => ({ ...f, prime_price: Number(e.target.value) }))}
                      placeholder="199 (Set 0 if XP only)"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs flex items-center gap-1">
                      <Tags className="h-3 w-3" /> Tags (comma separated)
                    </Label>
                    <Input
                      value={itemForm.tags}
                      onChange={(e) => setItemForm((f) => ({ ...f, tags: e.target.value }))}
                      placeholder="e.g. react, nextjs, saas, downloadable, bestselling"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border/60">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="enabled-toggle"
                      checked={itemForm.enabled}
                      onCheckedChange={(v) => setItemForm((f) => ({ ...f, enabled: v }))}
                    />
                    <Label htmlFor="enabled-toggle" className="cursor-pointer text-xs font-semibold">
                      Visible & Available in Store
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="prime-toggle"
                      checked={itemForm.is_prime}
                      onCheckedChange={(v) => setItemForm((f) => ({ ...f, is_prime: v }))}
                    />
                    <Label htmlFor="prime-toggle" className="cursor-pointer text-xs">
                      Allow Cash / Wallet Purchase
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button variant="outline" onClick={() => setItemDialog(false)}>
                Cancel
              </Button>
              <Button onClick={saveItem} className="gap-1.5">
                <Check className="h-4 w-4" />
                {editingItem ? "Update Product" : "Publish to Store"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-3.5 space-y-1 shadow-sm">
      <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
      <p className={cn("text-xl font-bold font-display", color)}>{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground/80">{sub}</p>}
    </div>
  );
}
