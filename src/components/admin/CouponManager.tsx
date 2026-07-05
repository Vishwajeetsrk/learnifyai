import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Ticket, Loader2, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function CouponManager() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: "", discount_percent: 20, max_uses: 100 });

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
      if (error && error.code !== "42P01") throw error; // ignore table not found during migration
      return data || [];
    },
  });

  const createMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("coupons").insert([newCoupon]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Coupon created!");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
      setNewCoupon({ code: "", discount_percent: 20, max_uses: 100 });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Coupon deleted!");
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Creator Coupons</h2>
          <p className="text-sm text-muted-foreground">Manage discount codes and drip schedules.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-xl">
          <Ticket className="h-8 w-8 mx-auto text-muted-foreground mb-3 opacity-50" />
          <p className="text-sm font-medium">No coupons generated yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Create your first coupon to offer discounts.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coupons.map((c: any) => (
            <div key={c.id} className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-bold text-primary tracking-wider">{c.code}</span>
                <span className="text-xs font-semibold bg-green-500/10 text-green-500 px-2 py-1 rounded-md">
                  {c.discount_percent}% OFF
                </span>
              </div>
              <div className="text-xs text-muted-foreground flex items-center justify-between">
                <span>Uses: {c.current_uses} / {c.max_uses}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                <Button variant="secondary" size="sm" className="flex-1 text-xs" onClick={() => {
                  navigator.clipboard.writeText(c.code);
                  toast.success("Code copied!");
                }}>
                  <Copy className="h-3 w-3 mr-2" /> Copy
                </Button>
                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => deleteMut.mutate(c.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Coupon</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Coupon Code</label>
              <Input 
                placeholder="e.g. SUMMER25" 
                value={newCoupon.code} 
                onChange={e => setNewCoupon(p => ({ ...p, code: e.target.value.toUpperCase() }))} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Discount (%)</label>
                <Input 
                  type="number" 
                  min="1" max="100" 
                  value={newCoupon.discount_percent} 
                  onChange={e => setNewCoupon(p => ({ ...p, discount_percent: parseInt(e.target.value) || 0 }))} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Uses</label>
                <Input 
                  type="number" 
                  min="1" 
                  value={newCoupon.max_uses} 
                  onChange={e => setNewCoupon(p => ({ ...p, max_uses: parseInt(e.target.value) || 0 }))} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => createMut.mutate()} disabled={createMut.isPending || !newCoupon.code}>
              {createMut.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Generate Coupon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
