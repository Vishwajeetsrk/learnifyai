import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ShoppingCart, Search, ChevronLeft, ChevronRight, Star, Plus, Pencil, Trash2, Crown, Sparkles, Image, X, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { getAllPurchases } from "@/lib/gamification.functions";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/store")({
  head: () => ({ meta: [{ title: "XP Store Admin — Learnify AI" }] }),
  component: AdminStorePage,
});

const PER_PAGE = 25;
const CATEGORIES = ["tools", "cosmetics", "discounts", "credits", "badges", "prime"];

function AdminStorePage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"purchases" | "items">("purchases");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [itemDialog, setItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [itemForm, setItemForm] = useState({
    name: "", description: "", category: "tools", cost: 100, icon: "Sparkles", color: "from-blue-500 to-blue-600", perks: "", is_prime: false, prime_price: 0, auto_claim: false, enabled: true,
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
      const { data } = await supabase.from("store_items").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const purchases = purchasesQuery.data?.purchases ?? [];
  const total = purchasesQuery.data?.total ?? 0;
  const totalPages = Math.ceil(total / PER_PAGE);
  const items = itemsQuery.data ?? [];

  const filtered = search
    ? purchases.filter((p: any) =>
        p.perkName?.toLowerCase().includes(search.toLowerCase()) ||
        p.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        p.user?.email?.toLowerCase().includes(search.toLowerCase())
      )
    : purchases;

  const totalRevenue = purchases.reduce((sum: number, p: any) => sum + p.cost, 0);

  const openNewItem = () => {
    setEditingItem(null);
    setItemForm({ name: "", description: "", category: "tools", cost: 100, icon: "Sparkles", color: "from-blue-500 to-blue-600", perks: "", is_prime: false, prime_price: 0, auto_claim: false, enabled: true });
    setItemDialog(true);
  };

  const openEditItem = (item: any) => {
    setEditingItem(item);
    setItemForm({
      name: item.name, description: item.description || "", category: item.category, cost: item.cost,
      icon: item.icon || "Sparkles", color: item.color || "from-blue-500 to-blue-600",
      perks: (item.perks || []).join(", "), is_prime: item.is_prime || false,
      prime_price: item.prime_price || 0, auto_claim: item.auto_claim || false, enabled: item.enabled !== false,
    });
    setItemDialog(true);
  };

  const saveItem = async () => {
    if (!itemForm.name.trim()) return toast.error("Name is required");
    const payload = {
      name: itemForm.name.trim(),
      description: itemForm.description.trim() || null,
      category: itemForm.category,
      cost: Math.max(0, Number(itemForm.cost)),
      icon: itemForm.icon,
      color: itemForm.color,
      perks: itemForm.perks.split(",").map((s) => s.trim()).filter(Boolean),
      is_prime: itemForm.is_prime,
      prime_price: Math.max(0, Number(itemForm.prime_price)),
      auto_claim: itemForm.auto_claim,
      enabled: itemForm.enabled,
    };
    try {
      if (editingItem) {
        const { error } = await supabase.from("store_items").update(payload).eq("id", editingItem.id);
        if (error) throw error;
        toast.success("Item updated");
      } else {
        const { error } = await supabase.from("store_items").insert(payload);
        if (error) throw error;
        toast.success("Item created");
      }
      setItemDialog(false);
      qc.invalidateQueries({ queryKey: ["admin-store-items"] });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm("Delete this store item? Purchases will remain.")) return;
    const { error } = await supabase.from("store_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Item deleted");
    qc.invalidateQueries({ queryKey: ["admin-store-items"] });
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">XP Store</h1>
              <p className="text-xs text-muted-foreground">Items & purchase management</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 text-sm">
            <div className="text-right">
              <p className="text-xs text-muted-foreground hidden sm:block">Purchases</p>
              <p className="font-bold text-xs sm:text-sm">{total.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground hidden sm:block">XP Spent</p>
              <p className="font-bold text-primary text-xs sm:text-sm">{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-1 bg-muted rounded-lg p-0.5 w-fit">
          <Button size="sm" variant={tab === "purchases" ? "default" : "ghost"} onClick={() => setTab("purchases")} className="text-xs h-8">Purchases</Button>
          <Button size="sm" variant={tab === "items" ? "default" : "ghost"} onClick={() => setTab("items")} className="text-xs h-8">Store Items</Button>
        </div>

        {tab === "purchases" && (
          <>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-8 h-9 text-xs" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Total" value={String(purchases.length)} color="text-blue-500" />
              <StatCard label="Unique Users" value={String(new Set(purchases.map((p: any) => p.userId)).size)} color="text-purple-500" />
              <StatCard label="Avg Cost" value={purchases.length > 0 ? `${Math.round(totalRevenue / purchases.length)} XP` : "—"} color="text-emerald-500" />
              <StatCard label="Page" value={`${page}/${totalPages}`} color="text-amber-500" />
            </div>
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="border-b bg-muted/30"><th className="text-left px-3 sm:px-4 py-3 font-medium text-muted-foreground">User</th><th className="text-left px-3 sm:px-4 py-3 font-medium text-muted-foreground">Perk</th><th className="text-left px-3 sm:px-4 py-3 font-medium text-muted-foreground">Cost</th><th className="text-left px-3 sm:px-4 py-3 font-medium text-muted-foreground">Status</th><th className="text-left px-3 sm:px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Date</th></tr></thead>
                  <tbody>
                    {purchasesQuery.isLoading ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
                    ) : filtered.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No purchases found</td></tr>
                    ) : filtered.map((p: any) => (
                      <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20">
                        <td className="px-3 sm:px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 shrink-0">
                              <AvatarImage src={p.user?.avatarUrl ?? ""} />
                              <AvatarFallback className="text-[8px]">{p.user?.fullName?.charAt(0) || "?"}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-medium truncate max-w-[100px] sm:max-w-none">{p.user?.fullName || "Unknown"}</p>
                              <p className="text-[10px] text-muted-foreground truncate max-w-[100px] sm:max-w-none hidden sm:block">{p.user?.email || ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-3 font-medium">{p.perkName}</td>
                        <td className="px-3 sm:px-4 py-3"><span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500 fill-yellow-500 shrink-0" />{p.cost}</span></td>
                        <td className="px-3 sm:px-4 py-3"><Badge variant="outline" className={cn("text-[10px]", p.status === "active" && "bg-green-500/10 text-green-500 border-green-500/30", p.status === "revoked" && "bg-red-500/10 text-red-500 border-red-500/30")}>{p.status}</Badge></td>
                        <td className="px-3 sm:px-4 py-3 text-muted-foreground hidden sm:table-cell">{new Date(p.purchasedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}><ChevronLeft className="h-3.5 w-3.5" /></Button>
                <span className="text-xs text-muted-foreground">{page} / {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}><ChevronRight className="h-3.5 w-3.5" /></Button>
              </div>
            )}
          </>
        )}

        {tab === "items" && (
          <>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">{items.length} items · Click to edit or delete</p>
              <Button size="sm" onClick={openNewItem}><Plus className="h-3.5 w-3.5 mr-1" /> Add Item</Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {itemsQuery.isLoading ? (
                <div className="col-span-full p-8 text-center text-sm text-muted-foreground">Loading...</div>
              ) : items.length === 0 ? (
                <div className="col-span-full p-8 text-center text-sm text-muted-foreground">No items yet.</div>
              ) : items.map((item: any) => (
                <Card key={item.id} className={cn("relative overflow-hidden", !item.enabled && "opacity-60")}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br", item.color || "from-primary to-primary/60")}>
                          {item.is_prime ? <Crown className="h-5 w-5 text-white" /> : <Sparkles className="h-5 w-5 text-white" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">{item.category}{item.is_prime ? ` · Prime ₹${item.prime_price}` : ` · ${item.cost} XP`}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEditItem(item)}><Pencil className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => deleteItem(item.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </div>
                    {item.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.description}</p>}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.auto_claim && <Badge variant="secondary" className="text-[9px]"><Check className="h-2.5 w-2.5 mr-0.5" /> Auto-claim</Badge>}
                      {!item.enabled && <Badge variant="outline" className="text-[9px] text-muted-foreground">Disabled</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        <Dialog open={itemDialog} onOpenChange={(o) => !o && setItemDialog(false)}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> {editingItem ? "Edit Item" : "Add Store Item"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 col-span-2">
                  <Label>Name *</Label>
                  <Input value={itemForm.name} onChange={(e) => setItemForm((f) => ({ ...f, name: e.target.value }))} placeholder="Item name" />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label>Description</Label>
                  <Textarea value={itemForm.description} onChange={(e) => setItemForm((f) => ({ ...f, description: e.target.value }))} rows={2} placeholder="What does this item do?" />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select value={itemForm.category} onValueChange={(v) => setItemForm((f) => ({ ...f, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Cost (XP)</Label>
                  <Input type="number" min={0} value={itemForm.cost} onChange={(e) => setItemForm((f) => ({ ...f, cost: Number(e.target.value) }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Color theme</Label>
                  <Input value={itemForm.color} onChange={(e) => setItemForm((f) => ({ ...f, color: e.target.value }))} placeholder="from-blue-500 to-blue-600" />
                </div>
                <div className="space-y-1.5">
                  <Label>Icon name</Label>
                  <Input value={itemForm.icon} onChange={(e) => setItemForm((f) => ({ ...f, icon: e.target.value }))} placeholder="Sparkles" />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label>Perk IDs (comma separated)</Label>
                  <Input value={itemForm.perks} onChange={(e) => setItemForm((f) => ({ ...f, perks: e.target.value }))} placeholder="resume_premium, gold_frame" />
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <Label className="cursor-pointer">Prime Item</Label>
                  <Switch checked={itemForm.is_prime} onCheckedChange={(v) => setItemForm((f) => ({ ...f, is_prime: v }))} />
                </div>
                {itemForm.is_prime && (
                  <div className="flex items-center gap-3">
                    <Label className="shrink-0 text-xs text-muted-foreground">Prime Price (₹)</Label>
                    <Input type="number" min={0} value={itemForm.prime_price} onChange={(e) => setItemForm((f) => ({ ...f, prime_price: Number(e.target.value) }))} className="h-8 w-28" />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Label className="cursor-pointer">Auto-claim on payment</Label>
                  <Switch checked={itemForm.auto_claim} onCheckedChange={(v) => setItemForm((f) => ({ ...f, auto_claim: v }))} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="cursor-pointer">Enabled</Label>
                  <Switch checked={itemForm.enabled} onCheckedChange={(v) => setItemForm((f) => ({ ...f, enabled: v }))} />
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setItemDialog(false)}>Cancel</Button>
              <Button onClick={saveItem}>{editingItem ? "Update" : "Create"} Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border bg-card p-3">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={cn("text-sm font-bold mt-0.5", color)}>{value}</p>
    </div>
  );
}
