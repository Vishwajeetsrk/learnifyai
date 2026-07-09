import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ShoppingCart, Search, ChevronLeft, ChevronRight, Star, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getAllPurchases } from "@/lib/gamification.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/store")({
  head: () => ({ meta: [{ title: "XP Store Admin — Learnify AI" }] }),
  component: AdminStorePage,
});

const PER_PAGE = 25;

function AdminStorePage() {
  const fetchAll = useServerFn(getAllPurchases);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-purchases", page],
    queryFn: () => fetchAll({ data: { page, limit: PER_PAGE } }),
  });

  const purchases = data?.purchases ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PER_PAGE);

  const filtered = search
    ? purchases.filter(
        (p) =>
          p.perkName.toLowerCase().includes(search.toLowerCase()) ||
          p.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
          p.user?.email?.toLowerCase().includes(search.toLowerCase())
      )
    : purchases;

  const totalRevenue = purchases.reduce((sum, p) => sum + p.cost, 0);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">XP Store — Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Purchase history & redemption management</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total Purchases</p>
              <p className="font-bold">{total.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total XP Spent</p>
              <p className="font-bold text-primary">{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by perk, user, or email..."
            className="pl-8 h-9 text-xs"
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total Items" value={String(purchases.length)} color="text-blue-500" />
          <StatCard label="Unique Users" value={String(new Set(purchases.map((p) => p.userId)).size)} color="text-purple-500" />
          <StatCard label="Avg Cost" value={purchases.length > 0 ? `${Math.round(totalRevenue / purchases.length)} XP` : "—"} color="text-emerald-500" />
          <StatCard label="Page" value={`${page}/${totalPages}`} color="text-amber-500" />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Perk</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Cost</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No purchases found</td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={p.user?.avatarUrl ?? ""} />
                            <AvatarFallback className="text-[8px]">
                              {p.user?.fullName?.charAt(0) || p.user?.email?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{p.user?.fullName || "Unknown"}</p>
                            <p className="text-[10px] text-muted-foreground">{p.user?.email || ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{p.perkName}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          {p.cost}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px]",
                            p.status === "active" && "bg-green-500/10 text-green-500 border-green-500/30",
                            p.status === "revoked" && "bg-red-500/10 text-red-500 border-red-500/30",
                            p.status === "expired" && "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
                          )}
                        >
                          {p.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(p.purchasedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (page <= 4) {
                pageNum = i + 1;
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = page - 3 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0 text-xs"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={cn("text-sm font-bold mt-0.5", color)}>{value}</p>
    </div>
  );
}
