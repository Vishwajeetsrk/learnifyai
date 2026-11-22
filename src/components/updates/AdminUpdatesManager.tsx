import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Save,
  Eye,
  EyeOff,
  Video,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
  ProductUpdate,
  getProductUpdates,
  saveProductUpdates,
  DEFAULT_PRODUCT_UPDATES,
} from "@/lib/updatesStore";

interface AdminUpdatesManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

export function AdminUpdatesManager({
  open,
  onOpenChange,
  onSaved,
}: AdminUpdatesManagerProps) {
  const [items, setItems] = useState<ProductUpdate[]>(() => getProductUpdates());
  const [editingItem, setEditingItem] = useState<ProductUpdate | null>(null);
  const [bulletPointsRaw, setBulletPointsRaw] = useState<string>("");

  const refreshFromStore = () => {
    setItems(getProductUpdates());
  };

  const handleStartEdit = (item: ProductUpdate) => {
    setEditingItem({ ...item });
    setBulletPointsRaw((item.bulletPoints || []).join("\n"));
  };

  const handleStartCreate = () => {
    const newItem: ProductUpdate = {
      id: `update-custom-${Date.now()}`,
      version: `v4.${items.length + 1}`,
      releaseDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      title: "New Feature Release Title",
      summary: "Brief overview of what was added or improved.",
      mediaType: "video",
      mediaUrl: "/videos/video-update-software.mp4",
      badge: "Feature Drop",
      bulletPoints: ["Highlight point 1", "Highlight point 2", "Highlight point 3"],
      isPublished: true,
      order: 0,
    };
    setEditingItem(newItem);
    setBulletPointsRaw(newItem.bulletPoints.join("\n"));
  };

  const handleSaveCurrentEdit = () => {
    if (!editingItem) return;

    const cleanedBullets = bulletPointsRaw
      .split("\n")
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    const updatedItem: ProductUpdate = {
      ...editingItem,
      bulletPoints: cleanedBullets.length > 0 ? cleanedBullets : ["Platform enhancement"],
    };

    const exists = items.some((i) => i.id === updatedItem.id);
    let nextItems: ProductUpdate[];
    if (exists) {
      nextItems = items.map((i) => (i.id === updatedItem.id ? updatedItem : i));
    } else {
      nextItems = [updatedItem, ...items];
    }

    // Re-index orders
    const normalized = nextItems.map((item, idx) => ({ ...item, order: idx }));
    setItems(normalized);
    saveProductUpdates(normalized);
    setEditingItem(null);
    toast.success(`Saved "${updatedItem.title}"`);
    onSaved?.();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this update entry?")) return;
    const next = items.filter((i) => i.id !== id).map((item, idx) => ({ ...item, order: idx }));
    setItems(next);
    saveProductUpdates(next);
    toast.success("Update deleted");
    onSaved?.();
  };

  const handleTogglePublish = (id: string) => {
    const next = items.map((i) =>
      i.id === id ? { ...i, isPublished: !i.isPublished } : i
    );
    setItems(next);
    saveProductUpdates(next);
    toast.success("Publication status updated");
    onSaved?.();
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const next = [...items];
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;

    const normalized = next.map((item, idx) => ({ ...item, order: idx }));
    setItems(normalized);
    saveProductUpdates(normalized);
    onSaved?.();
  };

  const handleResetToDefaults = () => {
    if (!confirm("Reset all product updates to system factory defaults?")) return;
    saveProductUpdates(DEFAULT_PRODUCT_UPDATES);
    setItems(DEFAULT_PRODUCT_UPDATES);
    setEditingItem(null);
    toast.success("Reset to factory defaults");
    onSaved?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-display flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Manage Product Updates & Changelog
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetToDefaults}
                className="text-xs gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset Defaults
              </Button>
              <Button
                size="sm"
                onClick={handleStartCreate}
                className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Add New Update
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Admins can add, edit, reorder, and publish/unpublish release items shown on /updates.
          </DialogDescription>
        </DialogHeader>

        {/* Edit Form Modal if an item is selected for editing */}
        {editingItem ? (
          <div className="border border-border/80 rounded-xl p-5 bg-card/70 space-y-4 my-2">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                <Edit2 className="h-4 w-4 text-emerald-500" />
                Editing: {editingItem.version} — {editingItem.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingItem(null)}
                className="text-xs h-7"
              >
                Cancel
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Version Tag</Label>
                <Input
                  value={editingItem.version}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, version: e.target.value })
                  }
                  placeholder="e.g. v4.4"
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Release Date</Label>
                <Input
                  value={editingItem.releaseDate}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, releaseDate: e.target.value })
                  }
                  placeholder="e.g. Nov 22, 2026"
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Badge Label</Label>
                <Input
                  value={editingItem.badge || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, badge: e.target.value })
                  }
                  placeholder="e.g. Major Release, Feature Drop"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Headline Title</Label>
              <Input
                value={editingItem.title}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, title: e.target.value })
                }
                placeholder="Title of release..."
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Summary / Subtitle</Label>
              <Input
                value={editingItem.summary || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, summary: e.target.value })
                }
                placeholder="High-level summary..."
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Media Type</Label>
                <select
                  value={editingItem.mediaType}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      mediaType: e.target.value as "video" | "image",
                    })
                  }
                  className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs"
                >
                  <option value="video">Video (MP4 / WebM)</option>
                  <option value="image">Image (WebP / PNG)</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-xs">Media URL (Local path or HTTPS)</Label>
                <Input
                  value={editingItem.mediaUrl}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, mediaUrl: e.target.value })
                  }
                  placeholder="e.g. /videos/video-update-software.mp4"
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Bullet Points (One per line)</Label>
              <Textarea
                rows={5}
                value={bulletPointsRaw}
                onChange={(e) => setBulletPointsRaw(e.target.value)}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                className="text-xs leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={editingItem.isPublished}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      isPublished: e.target.checked,
                    })
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium">Published & Publicly Visible</span>
              </label>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingItem(null)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveCurrentEdit}
                  className="text-xs h-8 bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5"
                >
                  <Save className="h-3.5 w-3.5" /> Save Update
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* List of all updates */
          <div className="divide-y divide-border/60 border rounded-xl overflow-hidden mt-3 bg-card/40">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 flex items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Reorder arrows */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, "up")}
                      className="p-1 rounded hover:bg-accent disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => handleMove(idx, "down")}
                      className="p-1 rounded hover:bg-accent disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Media icon */}
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    {item.mediaType === "video" ? (
                      <Video className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-sky-500" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0">
                        {item.version}
                      </Badge>
                      <span className="text-xs font-semibold text-foreground truncate">
                        {item.title}
                      </span>
                      {item.badge && (
                        <Badge className="text-[9px] px-1.5 py-0 bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate max-w-lg mt-0.5">
                      {item.releaseDate} · {item.bulletPoints.length} features · {item.mediaUrl}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublish(item.id)}
                    className="h-7 px-2 text-xs gap-1"
                    title={item.isPublished ? "Unpublish" : "Publish"}
                  >
                    {item.isPublished ? (
                      <>
                        <Eye className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-500 font-medium">Published</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Draft</span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartEdit(item)}
                    className="h-7 px-2.5 text-xs gap-1"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="h-7 px-2 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                    title="Delete update"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
