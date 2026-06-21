import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Eye, ShieldCheck, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminListFeatureFlags, adminUpdateFeatureFlag } from "@/lib/admin-features.functions";

type FeatureFlag = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  enabled: boolean;
  roles: string[];
  maintenance_mode: boolean;
};

export default function FeaturesManager() {
  const qc = useQueryClient();
  const listFlagsFn = useServerFn(adminListFeatureFlags);
  const updateFlagFn = useServerFn(adminUpdateFeatureFlag);

  const [editing, setEditing] = useState<FeatureFlag | null>(null);
  const [busy, setBusy] = useState(false);

  const { data: untypedFlags = [], isLoading } = useQuery({
    queryKey: ["admin-feature-flags"],
    queryFn: () => listFlagsFn(),
  });
  const flags = untypedFlags as unknown as FeatureFlag[];

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      await updateFlagFn({ data: { id, updates: { enabled } } });
      toast.success(enabled ? "Feature enabled" : "Feature disabled");
      qc.invalidateQueries({ queryKey: ["admin-feature-flags"] });
    } catch (e) {
      toast.error("Failed to toggle feature");
    }
  };

  const handleMaintenanceToggle = async (id: string, maintenance_mode: boolean) => {
    try {
      await updateFlagFn({ data: { id, updates: { maintenance_mode } } });
      toast.success(maintenance_mode ? "Maintenance mode enabled" : "Maintenance mode disabled");
      qc.invalidateQueries({ queryKey: ["admin-feature-flags"] });
    } catch (e) {
      toast.error("Failed to toggle maintenance mode");
    }
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    try {
      await updateFlagFn({
        data: {
          id: editing.id,
          updates: {
            name: editing.name,
            description: editing.description,
            roles: editing.roles,
          },
        },
      });
      toast.success("Feature flag updated");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-feature-flags"] });
    } catch (err) {
      toast.error("Failed to update feature flag");
    } finally {
      setBusy(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold font-display">Feature Visibility Manager</h2>
          <p className="text-sm text-muted-foreground">
            Instantly toggle platform modules, enable maintenance modes, and manage role-based access.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
              <tr>
                <th className="px-4 py-3">Feature</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Maintenance</th>
                <th className="px-4 py-3">Roles Allowed</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {flags.map((f: FeatureFlag) => (
                <tr key={f.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{f.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{f.key}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={f.enabled}
                        onCheckedChange={(c) => handleToggle(f.id, c)}
                      />
                      {f.enabled ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Enabled</Badge>
                      ) : (
                        <Badge variant="secondary">Disabled</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={f.maintenance_mode}
                        onCheckedChange={(c) => handleMaintenanceToggle(f.id, c)}
                      />
                      {f.maintenance_mode ? (
                        <Badge variant="destructive">Active</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {f.roles?.map((r: string) => (
                        <Badge key={r} variant="outline" className="text-[10px]">
                          {r}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => setEditing(f)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {flags.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No feature flags found. Run the seed script.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Feature Flag</DialogTitle>
          </DialogHeader>
          {editing && (
            <form onSubmit={saveEdit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Allowed Roles (comma separated)</Label>
                <Input
                  value={editing.roles?.join(", ") || ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      roles: e.target.value.split(",").map((r) => r.trim()).filter(Boolean),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Valid roles: super_admin, admin, creator, student. Use "public" or "guest" to allow unauthenticated access.
                </p>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={busy}>
                  {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
