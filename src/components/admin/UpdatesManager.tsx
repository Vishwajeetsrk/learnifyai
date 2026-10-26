import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Video, ImageIcon, Check, Sparkles, ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getProductUpdates, saveProductUpdates, ProductUpdate } from "@/lib/updatesStore";

export default function UpdatesManager() {
  const [updates, setUpdates] = useState<ProductUpdate[]>([]);
  const [editingItem, setEditingItem] = useState<ProductUpdate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bulletPointsRaw, setBulletPointsRaw] = useState("");

  useEffect(() => {
    setUpdates(getProductUpdates());
  }, []);

  const handleOpenAdd = () => {
    const newItem: ProductUpdate = {
      id: `update-${Date.now()}`,
      version: `v4.${updates.length + 2}`,
      releaseDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      title: "",
      summary: "",
      mediaType: "video",
      mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-code-on-a-computer-screen-40763-large.mp4",
      badge: "Feature Release",
      bulletPoints: ["New capability", "Performance enhancements"],
      isPublished: true,
      order: 0,
    };
    setEditingItem(newItem);
    setBulletPointsRaw(newItem.bulletPoints.join("\n"));
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: ProductUpdate) => {
    setEditingItem({ ...item });
    setBulletPointsRaw(item.bulletPoints.join("\n"));
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!editingItem) return;
    if (!editingItem.title.trim()) {
      toast.error("Please enter an update title");
      return;
    }

    const parsedBullets = bulletPointsRaw
      .split("\n")
      .map((b) => b.replace(/^[•\-\*]\s*/, "").trim())
      .filter(Boolean);

    const updatedItem: ProductUpdate = {
      ...editingItem,
      bulletPoints: parsedBullets.length > 0 ? parsedBullets : ["General platform improvements"],
    };

    let newUpdates: ProductUpdate[];
    const exists = updates.some((u) => u.id === updatedItem.id);
    if (exists) {
      newUpdates = updates.map((u) => (u.id === updatedItem.id ? updatedItem : u));
    } else {
      newUpdates = [updatedItem, ...updates];
    }

    setUpdates(newUpdates);
    saveProductUpdates(newUpdates);
    setIsDialogOpen(false);
    toast.success("Product update saved! Live on /updates now.");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this update entry?")) {
      const filtered = updates.filter((u) => u.id !== id);
      setUpdates(filtered);
      saveProductUpdates(filtered);
      toast.success("Update deleted.");
    }
  };

  const handleTogglePublish = (id: string, published: boolean) => {
    const updated = updates.map((u) => (u.id === id ? { ...u, isPublished: published } : u));
    setUpdates(updated);
    saveProductUpdates(updated);
    toast.success(published ? "Update published" : "Update saved as draft");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sky-400" />
            Product Updates &amp; Changelog Manager
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Publish and edit new releases displayed publicly on <a href="/updates" target="_blank" className="text-sky-400 underline font-mono">/updates</a>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="gap-1.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Release</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-xs gap-1"
          >
            <a href="/updates" target="_blank" rel="noreferrer">
              <Eye className="h-3.5 w-3.5" />
              <span>View Public Page</span>
            </a>
          </Button>
        </div>
      </div>

      {/* List of Updates */}
      <div className="space-y-4">
        {updates.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-border/80 bg-card/60 hover:border-primary/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {item.version}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {item.releaseDate}
                </span>
                {item.badge && (
                  <Badge variant="secondary" className="text-[10px]">
                    {item.badge}
                  </Badge>
                )}
                <Badge
                  variant={item.isPublished ? "default" : "outline"}
                  className="text-[10px]"
                >
                  {item.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>

              <h3 className="font-semibold text-base text-foreground">
                {item.title}
              </h3>

              <div className="text-xs text-muted-foreground line-clamp-1">
                {item.bulletPoints.length} highlights: {item.bulletPoints.join(" • ")}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 mr-2">
                <span className="text-xs text-muted-foreground">Live:</span>
                <Switch
                  checked={item.isPublished}
                  onCheckedChange={(checked) => handleTogglePublish(item.id, checked)}
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenEdit(item)}
                className="h-8 px-2.5 gap-1 text-xs"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(item.id)}
                className="h-8 px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id.startsWith("update-") ? "Edit Product Release" : "New Release"}
            </DialogTitle>
            <DialogDescription>
              Configure the release card as seen in the updates video.
            </DialogDescription>
          </DialogHeader>

          {editingItem && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Version Tag</Label>
                  <Input
                    value={editingItem.version}
                    onChange={(e) => setEditingItem({ ...editingItem, version: e.target.value })}
                    placeholder="e.g. v4.3"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Release Date</Label>
                  <Input
                    value={editingItem.releaseDate}
                    onChange={(e) => setEditingItem({ ...editingItem, releaseDate: e.target.value })}
                    placeholder="e.g. Oct 26, 2026"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Learnify Studio, Multi-Video Playlists & Realtime Explainer"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Summary (Optional)</Label>
                <Input
                  value={editingItem.summary || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, summary: e.target.value })}
                  placeholder="One sentence summary of this drop"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Media Type</Label>
                  <select
                    value={editingItem.mediaType}
                    onChange={(e) => setEditingItem({ ...editingItem, mediaType: e.target.value as "video" | "image" })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="video">MP4 Video Preview</option>
                    <option value="image">Screenshot Image</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Badge Label</Label>
                  <Input
                    value={editingItem.badge || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                    placeholder="e.g. Major Release"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Media URL</Label>
                <Input
                  value={editingItem.mediaUrl}
                  onChange={(e) => setEditingItem({ ...editingItem, mediaUrl: e.target.value })}
                  placeholder="https://...mp4 or image URL"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Bullet Points (One per line)</Label>
                <Textarea
                  rows={6}
                  value={bulletPointsRaw}
                  onChange={(e) => setBulletPointsRaw(e.target.value)}
                  placeholder="Video auto-play in preview&#10;Show/hide toggle for Filters and Collections&#10;Multi-video playlists"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-sky-500 hover:bg-sky-600 text-white">
              Save Release
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
