import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  CreditCard,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Loader2,
  IndianRupee,
  Users,
  Zap,
  Crown,
  Search,
} from "lucide-react";

type PricingPlan = {
  id: string;
  name: string;
  price_inr: number;
  price_label: string;
  features: string[] | null;
  max_courses: number | null;
  ai_credits_monthly: number | null;
  interval: string | null;
  highlighted: boolean;
  badge: string | null;
  color: string | null;
  trial_days: number | null;
  grace_period_days: number | null;
  cashfree_plan_id: string | null;
  created_at: string;
};

export function SubscriptionManager() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["admin-pricing-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("*")
        .order("price_inr", { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []) as PricingPlan[];
    },
  });

  const { data: subscribers = [] } = useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("id, plan_id, status, created_at, profiles:user_id(full_name, email)");
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return plans.filter((p) => !needle || p.name.toLowerCase().includes(needle));
  }, [plans, search]);

  const subscriberCount = useMemo(() => {
    const map = new Map<string, number>();
    (subscribers as any[]).forEach((s) => {
      if (s.plan_id) map.set(s.plan_id, (map.get(s.plan_id) ?? 0) + 1);
    });
    return map;
  }, [subscribers]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from("pricing_plans").delete().eq("id", deleteId);
      if (error) throw new Error(error.message);
      toast.success("Plan deleted");
      qc.invalidateQueries({ queryKey: ["admin-pricing-plans"] });
    } catch (e: any) {
      toast.error(e.message);
    }
    setDeleteId(null);
  };

  const handleSave = async (form: Partial<PricingPlan>) => {
    try {
      if (editingPlan?.id && editingPlan.id !== "new") {
        const { error } = await supabase
          .from("pricing_plans")
          .update(form)
          .eq("id", editingPlan.id);
        if (error) throw new Error(error.message);
        toast.success("Plan updated");
      } else {
        const { error } = await supabase.from("pricing_plans").insert({
          name: form.name ?? "New Plan",
          price_inr: form.price_inr ?? 0,
          price_label: form.price_label ?? "₹0",
          features: form.features ?? [],
          max_courses: form.max_courses ?? null,
          ai_credits_monthly: form.ai_credits_monthly ?? 0,
          interval: form.interval ?? null,
          highlighted: form.highlighted ?? false,
          badge: form.badge ?? null,
          color: form.color ?? null,
          trial_days: form.trial_days ?? null,
          grace_period_days: form.grace_period_days ?? null,
        });
        if (error) throw new Error(error.message);
        toast.success("Plan created");
      }
      qc.invalidateQueries({ queryKey: ["admin-pricing-plans"] });
      setShowEditor(false);
      setEditingPlan(null);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const activeSubs = (subscribers as any[]).filter((s) => s.status === "active").length;
  const mrr = (subscribers as any[])
    .filter((s) => s.status === "active")
    .reduce((sum, s) => {
      const plan = plans.find((p) => p.id === s.plan_id);
      return sum + (plan?.price_inr ?? 0);
    }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5" /> Subscription Plans
          </h2>
          <p className="text-sm text-muted-foreground">Manage pricing plans and subscribers</p>
        </div>
        <Button
          onClick={() => {
            setEditingPlan(null);
            setShowEditor(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" /> New Plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <div className="text-2xl font-bold">{plans.length}</div>
              <div className="text-xs text-muted-foreground">Plans</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50 text-green-500">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <div className="text-2xl font-bold">{activeSubs}</div>
              <div className="text-xs text-muted-foreground">Active Subscribers</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-50 text-violet-500">
              <IndianRupee className="h-4 w-4" />
            </div>
            <div>
              <div className="text-2xl font-bold">₹{mrr.toLocaleString("en-IN")}</div>
              <div className="text-xs text-muted-foreground">MRR</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${plan.highlighted ? "ring-2 ring-primary" : ""}`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-4">
                <Badge className="bg-primary text-primary-foreground text-[10px]">
                  {plan.badge}
                </Badge>
              </div>
            )}
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      ₹{plan.price_inr.toLocaleString("en-IN")}
                    </span>
                    {plan.interval && (
                      <span className="text-muted-foreground text-sm">/{plan.interval}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => {
                      setEditingPlan(plan);
                      setShowEditor(true);
                    }}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-red-500"
                    onClick={() => setDeleteId(plan.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                {subscriberCount.get(plan.id) ?? 0} subscribers
              </div>
              {plan.features && plan.features.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {plan.features.slice(0, 5).map((f, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {plan.max_courses != null && (
                  <Badge variant="secondary">{plan.max_courses} courses</Badge>
                )}
                {plan.ai_credits_monthly != null && (
                  <Badge variant="secondary">{plan.ai_credits_monthly} AI credits/mo</Badge>
                )}
                {plan.trial_days != null && (
                  <Badge variant="secondary">{plan.trial_days}d trial</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Editor Dialog */}
      {showEditor && (
        <PlanEditor
          plan={editingPlan}
          onSave={handleSave}
          onClose={() => {
            setShowEditor(false);
            setEditingPlan(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Plan</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete this pricing plan. Active subscribers will not be affected
            but will not renew.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PlanEditor({
  plan,
  onSave,
  onClose,
}: {
  plan: PricingPlan | null;
  onSave: (form: Partial<PricingPlan>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: plan?.name ?? "",
    price_inr: plan?.price_inr ?? 0,
    price_label: plan?.price_label ?? "",
    features: (plan?.features ?? []).join("\n"),
    max_courses: plan?.max_courses ?? "",
    ai_credits_monthly: plan?.ai_credits_monthly ?? 0,
    interval: plan?.interval ?? "monthly",
    highlighted: plan?.highlighted ?? false,
    badge: plan?.badge ?? "",
    trial_days: plan?.trial_days ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    onSave({
      name: form.name,
      price_inr: form.price_inr,
      price_label: form.price_label || `₹${form.price_inr}`,
      features: form.features.split("\n").filter((f) => f.trim()),
      max_courses: form.max_courses === "" ? null : Number(form.max_courses),
      ai_credits_monthly: form.ai_credits_monthly,
      interval: form.interval,
      highlighted: form.highlighted,
      badge: form.badge || null,
      trial_days: form.trial_days === "" ? null : Number(form.trial_days),
    });
    setSaving(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{plan?.id && plan.id !== "new" ? "Edit Plan" : "Create Plan"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium">Plan Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Pro"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Price (INR)</label>
              <Input
                type="number"
                value={form.price_inr}
                onChange={(e) => setForm({ ...form, price_inr: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Interval</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={form.interval}
                onChange={(e) => setForm({ ...form, interval: e.target.value })}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="">One-time</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Max Courses</label>
              <Input
                type="number"
                value={form.max_courses}
                onChange={(e) => setForm({ ...form, max_courses: e.target.value })}
                placeholder="Unlimited"
              />
            </div>
            <div>
              <label className="text-sm font-medium">AI Credits/mo</label>
              <Input
                type="number"
                value={form.ai_credits_monthly}
                onChange={(e) => setForm({ ...form, ai_credits_monthly: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Badge Text</label>
              <Input
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="e.g. Most Popular"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Trial Days</label>
              <Input
                type="number"
                value={form.trial_days}
                onChange={(e) => setForm({ ...form, trial_days: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Features (one per line)</label>
            <Textarea
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              rows={5}
              placeholder="Unlimited courses&#10;AI-powered tools&#10;Certificate generation"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.highlighted}
              onChange={(e) => setForm({ ...form, highlighted: e.target.checked })}
              className="rounded"
            />
            <label className="text-sm font-medium">Highlighted (featured plan)</label>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !form.name}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            Save Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
