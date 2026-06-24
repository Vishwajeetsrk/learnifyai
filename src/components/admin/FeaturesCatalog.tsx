import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Palette,
  Save,
  X,
  Star,
  Zap,
  Code,
  Users,
  Award,
  Trophy,
  Map,
  MessageSquare,
  Bot,
  Image,
  MessageCircle,
  Smartphone,
  Folder,
  Code2,
  Trophy as TrophyIcon,
  FileCode,
  Flame,
  BookOpen,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { wcmsListFeatures, wcmsUpsertFeature, wcmsDeleteFeature } from "@/lib/wcms.functions";

type WcmsFeature = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  icon: string;
  category: string;
  color: string;
  url: string | null;
  badge: string | null;
  sort_order: number;
  enabled: boolean;
};

const ICON_OPTIONS = [
  { value: "Sparkles", label: "Sparkles", Icon: Sparkles },
  { value: "Zap", label: "Zap", Icon: Zap },
  { value: "Code", label: "Code", Icon: Code },
  { value: "Users", label: "Users", Icon: Users },
  { value: "Award", label: "Award", Icon: Award },
  { value: "Trophy", label: "Trophy", Icon: TrophyIcon },
  { value: "Map", label: "Map", Icon: Map },
  { value: "MessageSquare", label: "MessageSquare", Icon: MessageSquare },
  { value: "Bot", label: "Bot", Icon: Bot },
  { value: "Image", label: "Image", Icon: Image },
  { value: "MessageCircle", label: "MessageCircle", Icon: MessageCircle },
  { value: "Smartphone", label: "Smartphone", Icon: Smartphone },
  { value: "Folder", label: "Folder", Icon: Folder },
  { value: "BookOpen", label: "BookOpen", Icon: BookOpen },
  { value: "Rocket", label: "Rocket", Icon: Rocket },
  { value: "Flame", label: "Flame", Icon: Flame },
  { value: "Star", label: "Star", Icon: Star },
  { value: "Palette", label: "Palette", Icon: Palette },
  { value: "FileCode", label: "FileCode", Icon: FileCode },
];

const CATEGORIES = [
  "ai",
  "learning",
  "development",
  "social",
  "gamification",
  "career",
  "platform",
  "general",
];

const PRESET_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
];

export default function FeaturesCatalog() {
  const qc = useQueryClient();
  const listFeaturesFn = useServerFn(wcmsListFeatures);
  const upsertFeatureFn = useServerFn(wcmsUpsertFeature);
  const deleteFeatureFn = useServerFn(wcmsDeleteFeature);

  const [editing, setEditing] = useState<WcmsFeature | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: features = [], isLoading } = useQuery({
    queryKey: ["wcms-features"],
    queryFn: () => listFeaturesFn(),
  });

  const newFeature = () => {
    setEditing({
      id: "",
      key: "",
      name: "",
      description: "",
      icon: "Sparkles",
      category: "general",
      color: "#6366f1",
      url: null,
      badge: null,
      sort_order: features.length,
      enabled: true,
    });
    setOpen(true);
  };

  const saveFeature = async () => {
    if (!editing) return;
    if (!editing.key || !editing.name) return toast.error("Key and name required");
    try {
      await upsertFeatureFn({
        data: {
          ...editing,
          key: editing.key
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-")
            .replace(/-+/g, "-"),
        },
      });
      toast.success(editing.id ? "Feature updated" : "Feature created");
      setOpen(false);
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["wcms-features"] });
    } catch (e: any) {
      toast.error(e?.message || "Save failed");
    }
  };

  const toggleFeature = async (id: string, enabled: boolean) => {
    const feat = features.find((f: WcmsFeature) => f.id === id);
    if (!feat) return;
    try {
      await upsertFeatureFn({ data: { ...feat, enabled } });
      toast.success(enabled ? "Feature enabled" : "Feature disabled");
      qc.invalidateQueries({ queryKey: ["wcms-features"] });
    } catch (e: any) {
      toast.error(e?.message || "Toggle failed");
    }
  };

  const removeFeature = async () => {
    if (!deleteId) return;
    try {
      await deleteFeatureFn({ data: { id: deleteId } });
      toast.success("Deleted");
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    }
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["wcms-features"] });
  };

  const moveFeature = async (idx: number, dir: -1 | 1) => {
    const arr = [...features];
    const swap = idx + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    for (let i = 0; i < arr.length; i++) {
      await upsertFeatureFn({ data: { ...arr[i], sort_order: i } });
    }
    qc.invalidateQueries({ queryKey: ["wcms-features"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold font-display flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> Features & Tools Catalog
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage all platform features, tools, and capabilities with icons and colors.
          </p>
        </div>
        <Button onClick={newFeature}>
          <Plus className="h-4 w-4 mr-2" /> New Feature
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : features.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No features yet.</p>
      ) : (
        <div className="space-y-2">
          {features.map((f: WcmsFeature, idx: number) => {
            const IconComp = ICON_OPTIONS.find((io) => io.value === f.icon)?.Icon ?? Sparkles;
            return (
              <div
                key={f.id}
                className="rounded-xl border bg-card p-4 flex items-center gap-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex flex-col gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4"
                    onClick={() => moveFeature(idx, -1)}
                    disabled={idx === 0}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4"
                    onClick={() => moveFeature(idx, 1)}
                    disabled={idx === features.length - 1}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: f.color + "20" }}
                >
                  <IconComp className="h-5 w-5" style={{ color: f.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {f.name}
                    {f.badge && (
                      <Badge
                        className="text-[10px] px-1.5"
                        style={{ backgroundColor: f.color, color: "white" }}
                      >
                        {f.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex gap-3">
                    <span className="font-mono">{f.key}</span>
                    <span className="uppercase">{f.category}</span>
                    {f.url && <span className="truncate max-w-[150px]">{f.url}</span>}
                  </div>
                </div>
                <Switch checked={f.enabled} onCheckedChange={(v) => toggleFeature(f.id, v)} />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(f);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteId(f.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Feature Edit Dialog */}
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) {
            setOpen(false);
            setEditing(null);
          }
        }}
      >
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit Feature" : "New Feature"}</DialogTitle>
            <DialogDescription>
              Configure feature display, icon, color, and category.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Feature Name</Label>
                  <Input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    placeholder="AI Assistant"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unique Key</Label>
                  <Input
                    value={editing.key}
                    onChange={(e) => setEditing({ ...editing, key: e.target.value })}
                    placeholder="ai-assistant"
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={editing.category}
                    onValueChange={(v) => setEditing({ ...editing, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>URL (optional)</Label>
                  <Input
                    value={editing.url ?? ""}
                    onChange={(e) => setEditing({ ...editing, url: e.target.value || null })}
                    placeholder="/ai-tools"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Badge Text (optional)</Label>
                <Input
                  value={editing.badge ?? ""}
                  onChange={(e) => setEditing({ ...editing, badge: e.target.value || null })}
                  placeholder="NEW, BETA, PRO"
                />
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((io) => {
                    const IC = io.Icon;
                    return (
                      <Button
                        key={io.value}
                        size="sm"
                        variant={editing.icon === io.value ? "default" : "outline"}
                        className="h-9 w-9 p-0"
                        onClick={() => setEditing({ ...editing, icon: io.value })}
                        title={io.label}
                      >
                        <IC className="h-4 w-4" />
                      </Button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2 items-center">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      className={`h-7 w-7 rounded-full border-2 transition-all ${editing.color === c ? "border-foreground scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setEditing({ ...editing, color: c })}
                    />
                  ))}
                  <input
                    type="color"
                    value={editing.color}
                    onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                    className="h-7 w-7 rounded-full cursor-pointer border-0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={editing.enabled}
                  onCheckedChange={(v) => setEditing({ ...editing, enabled: v })}
                />
                <Label>{editing.enabled ? "Visible on platform" : "Hidden"}</Label>
              </div>
              {/* Live Preview */}
              <div className="p-4 border rounded-xl bg-muted/30">
                <Label className="text-xs text-muted-foreground mb-2 block">PREVIEW</Label>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: editing.color + "20" }}
                  >
                    {ICON_OPTIONS.find((io) => io.value === editing.icon)?.Icon ? (
                      (() => {
                        const IC = ICON_OPTIONS.find((io) => io.value === editing.icon)!.Icon;
                        return <IC className="h-5 w-5" style={{ color: editing.color }} />;
                      })()
                    ) : (
                      <Sparkles className="h-5 w-5" style={{ color: editing.color }} />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{editing.name || "Feature Name"}</div>
                    <div className="text-xs text-muted-foreground">
                      {editing.description || "Description"}
                    </div>
                  </div>
                  {editing.badge && (
                    <Badge
                      className="ml-auto text-[10px]"
                      style={{ backgroundColor: editing.color, color: "white" }}
                    >
                      {editing.badge}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setEditing(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={saveFeature}>
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feature?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this feature from the catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={removeFeature}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
