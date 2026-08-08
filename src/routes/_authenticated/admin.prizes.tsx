import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Gift, Plus, Pencil, Loader2, Trophy, CheckCircle2, XCircle, Clock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  adminListPrizes,
  adminSavePrize,
  adminListClaims,
  adminSetClaimStatus,
} from "@/lib/leaderboard-prizes.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/prizes")({
  head: () => ({ meta: [{ title: "Leaderboard Prizes — Learnify AI" }] }),
  component: AdminPrizesPage,
});

const ITEM_TYPES = [
  "xp",
  "badge",
  "avatar_frame",
  "premium_resume",
  "ai_credits",
  "discount",
  "store_item",
  "custom",
];

function AdminPrizesPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"prizes" | "claims">("prizes");
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    period: "weekly",
    rank: 1,
    name: "",
    description: "",
    icon: "🎖️",
    item_type: "xp",
    item_value: "",
    enabled: true,
  });

  const prizesQuery = useQuery({
    queryKey: ["admin-prizes"],
    queryFn: () => adminListPrizes().catch(() => []),
  });

  const claimsQuery = useQuery({
    queryKey: ["admin-prize-claims"],
    queryFn: () => adminListClaims().catch(() => []),
  });

  const prizes = prizesQuery.data ?? [];
  const claims = claimsQuery.data ?? [];

  const openNew = () => {
    setEditing(null);
    setForm({
      period: "weekly",
      rank: 1,
      name: "",
      description: "",
      icon: "🎖️",
      item_type: "xp",
      item_value: "100",
      enabled: true,
    });
    setDialog(true);
  };

  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      period: p.period,
      rank: p.rank,
      name: p.name,
      description: p.description || "",
      icon: p.icon || "🎖️",
      item_type: p.item_type,
      item_value: p.item_value || "",
      enabled: p.enabled !== false,
    });
    setDialog(true);
  };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Prize name is required");
    try {
      await adminSavePrize({
        data: { ...form, name: form.name.trim(), rank: Number(form.rank) },
      });
      toast.success(editing ? "Prize updated" : "Prize created");
      setDialog(false);
      qc.invalidateQueries({ queryKey: ["admin-prizes"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    }
  };

  const setStatus = async (id: string, status: string) => {
    try {
      await adminSetClaimStatus({ data: { id, status: status as any } });
      toast.success("Claim status updated");
      qc.invalidateQueries({ queryKey: ["admin-prize-claims"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Update failed");
    }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      pending: { label: "Pending", cls: "bg-amber-100 text-amber-700" },
      claimed: { label: "Claimed", cls: "bg-emerald-100 text-emerald-700" },
      expired: { label: "Expired", cls: "bg-slate-100 text-slate-600" },
      revoked: { label: "Revoked", cls: "bg-red-100 text-red-700" },
    };
    const m = map[s] ?? map.pending;
    return <Badge className={m.cls}>{m.label}</Badge>;
  };

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 grid place-items-center shadow-lg">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold tracking-tight">Leaderboard Prizes</h1>
              <p className="text-muted-foreground text-sm">
                Free digital prizes for weekly and all-time top 3. Winners are emailed every Sunday.
              </p>
            </div>
          </div>
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> Add Prize
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-muted/50 rounded-xl p-1 w-fit border">
          <Button
            variant={tab === "prizes" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTab("prizes")}
            className="rounded-lg text-xs gap-1"
          >
            <Trophy className="h-3.5 w-3.5" /> Prize Config ({prizes.length})
          </Button>
          <Button
            variant={tab === "claims" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTab("claims")}
            className="rounded-lg text-xs gap-1"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Claims ({claims.length})
          </Button>
        </div>

        {tab === "prizes" ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {["weekly", "all"].map((period) => (
              <div key={period} className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b bg-muted/40 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="font-semibold text-sm capitalize">
                    {period === "weekly" ? "Weekly" : "All-Time"} Prizes
                  </span>
                  <Badge variant="outline" className="text-[10px] ml-auto">
                    Top 3
                  </Badge>
                </div>
                <div className="divide-y">
                  {prizes
                    .filter((p: any) => p.period === period)
                    .sort((a: any, b: any) => a.rank - b.rank)
                    .map((p: any) => (
                      <div key={p.id} className="p-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 grid place-items-center text-lg shrink-0">
                            {p.icon || "🎖️"}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold flex items-center gap-2">
                              #{p.rank} {p.name}
                              {!p.enabled && (
                                <Badge variant="outline" className="text-[9px] text-red-500 border-red-200">
                                  Disabled
                                </Badge>
                              )}
                            </div>
                            <div className="text-[11px] text-muted-foreground line-clamp-1">
                              {p.item_type} · {p.item_value || "—"} · {p.description}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  {prizes.filter((p: any) => p.period === period).length === 0 && (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      No prizes configured for {period} period.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              {claimsQuery.isLoading ? (
                <div className="p-12 text-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />
                </div>
              ) : claims.length === 0 ? (
                <div className="p-12 text-center text-sm text-muted-foreground">
                  No prize claims yet. Weekly winners are created by the Sunday cron.
                </div>
              ) : (
                <div className="divide-y">
                  {claims.map((c: any) => (
                    <div key={c.id} className="p-3.5 flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-muted grid place-items-center text-base shrink-0">
                          {c.prize_icon || "🎖️"}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold truncate">
                            {c.prize_name}
                            <span className="text-[10px] font-normal text-muted-foreground ml-2">
                              {c.period === "weekly" ? "Weekly" : "All-Time"} · #{c.rank} ·{" "}
                              {c.period_key}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">
                            {(c.profiles as any)?.full_name ?? "Unknown"} ·{" "}
                            {(c.profiles as any)?.email ?? "—"} · {c.item_type} {c.item_value || ""}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {statusBadge(c.status)}
                        {c.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={() => setStatus(c.id, "claimed")}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Mark Claimed
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={() => setStatus(c.id, "revoked")}
                            >
                              <XCircle className="h-3.5 w-3.5 text-red-500" /> Revoke
                            </Button>
                          </>
                        )}
                        {c.status === "claimed" && (
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {c.claimed_at ? new Date(c.claimed_at).toLocaleDateString() : "—"}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Edit dialog */}
        <Dialog open={dialog} onOpenChange={setDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Prize" : "Add Prize"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Period</Label>
                  <Select
                    value={form.period}
                    onValueChange={(v) => setForm({ ...form, period: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="all">All-Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Rank</Label>
                  <Select
                    value={String(form.rank)}
                    onValueChange={(v) => setForm({ ...form, rank: Number(v) })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">#1</SelectItem>
                      <SelectItem value="2">#2</SelectItem>
                      <SelectItem value="3">#3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs">Prize Name</Label>
                <Input
                  className="mt-1"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Weekly Champion Pack"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Icon (emoji)</Label>
                  <Input
                    className="mt-1"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Item Type</Label>
                  <Select
                    value={form.item_type}
                    onValueChange={(v) => setForm({ ...form, item_type: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ITEM_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs">Item Value</Label>
                <Input
                  className="mt-1"
                  value={form.item_value}
                  onChange={(e) => setForm({ ...form, item_value: e.target.value })}
                  placeholder="XP amount, badge id, frame name, etc."
                />
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Textarea
                  className="mt-1"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What does this prize include?"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="text-sm font-medium">Enabled</div>
                  <div className="text-[11px] text-muted-foreground">
                    Disabled prizes are not awarded or emailed.
                  </div>
                </div>
                <Switch
                  checked={form.enabled}
                  onCheckedChange={(v) => setForm({ ...form, enabled: v })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialog(false)}>
                Cancel
              </Button>
              <Button onClick={save}>Save Prize</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
