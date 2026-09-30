import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Search,
  Loader2,
  BookOpen,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAdminCreators,
  saveCreator,
  deleteCreator,
  type CreatorRecord,
} from "@/lib/coach-creator.functions";
import { getRealHumanAvatar } from "@/lib/real-avatars";
import {
  useAdminDraft,
  AutosaveStatusBadge,
  DraftRecoveryBanner,
} from "@/lib/admin-editor-workspace";

const EMPTY_CREATOR: CreatorRecord = {
  id: "",
  name: "",
  photo: "",
  title: "",
  expertise: "",
  bio: "",
  courses_count: 0,
  social_links: {},
  verification_status: "unverified",
  visibility: "draft",
  featured: false,
  sort_order: 1,
  is_demo: false,
};

export default function CreatorsManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editingCreator, setEditingCreator] = useState<CreatorRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CreatorRecord | null>(null);

  const { data: creators = [], isLoading } = useQuery<CreatorRecord[]>({
    queryKey: ["admin-creators-list"],
    queryFn: () => getAdminCreators(),
  });

  const saveMutation = useMutation({
    mutationFn: (creator: CreatorRecord) => saveCreator({ data: { creator } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-creators-list"] });
      queryClient.invalidateQueries({ queryKey: ["public-creators-directory"] });
      toast.success("Creator profile saved successfully");
      setIsDialogOpen(false);
      setEditingCreator(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to save creator");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (creatorId: string) => deleteCreator({ data: { creatorId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-creators-list"] });
      queryClient.invalidateQueries({ queryKey: ["public-creators-directory"] });
      toast.success("Creator profile deleted");
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete creator");
    },
  });

  const handleOpenNew = () => {
    setEditingCreator({
      ...EMPTY_CREATOR,
      id: `creator-${Date.now()}`,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (creator: CreatorRecord) => {
    setEditingCreator({ ...creator });
    setIsDialogOpen(true);
  };

  const handleToggleVisibility = (creator: CreatorRecord) => {
    const nextVisibility = creator.visibility === "published" ? "draft" : "published";
    if (creator.is_demo && nextVisibility === "published") {
      toast.info("Demo creators remain hidden from the public directory to preserve production authenticity.");
    }
    saveMutation.mutate({
      ...creator,
      visibility: nextVisibility,
    });
  };

  const handleToggleVerification = (creator: CreatorRecord) => {
    const nextStatus = creator.verification_status === "verified" ? "unverified" : "verified";
    saveMutation.mutate({
      ...creator,
      verification_status: nextStatus,
    });
  };

  const filteredCreators = useMemo(() => {
    if (!search.trim()) return creators;
    const q = search.toLowerCase();
    return creators.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.expertise.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q)
    );
  }, [creators, search]);

  const stats = useMemo(() => {
    const total = creators.length;
    const published = creators.filter((c) => c.visibility === "published" && !c.is_demo).length;
    const verified = creators.filter((c) => c.verification_status === "verified").length;
    const demo = creators.filter((c) => c.is_demo).length;
    return { total, published, verified, demo };
  }, [creators]);

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display tracking-tight text-foreground">
              Creators &amp; Tech Educators CMS
            </h2>
            <Badge variant="outline" className="text-xs font-semibold">
              {creators.length} Creators
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage course creators, verify author credentials, review published courses, and control public listing.
          </p>
        </div>

        <Button onClick={handleOpenNew} size="sm" className="gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" /> Add Creator
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border bg-card/60 space-y-1">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total Creators</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="p-3.5 rounded-xl border bg-card/60 space-y-1">
          <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Live on Site</p>
          <p className="text-2xl font-bold text-foreground">{stats.published}</p>
        </div>
        <div className="p-3.5 rounded-xl border bg-card/60 space-y-1">
          <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Verified Educator</p>
          <p className="text-2xl font-bold text-foreground">{stats.verified}</p>
        </div>
        <div className="p-3.5 rounded-xl border bg-card/60 space-y-1">
          <p className="text-[11px] font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">Demo / In Review</p>
          <p className="text-2xl font-bold text-foreground">{stats.demo}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filter creators by name, topic, or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-xs bg-card"
        />
      </div>

      {/* Creator List */}
      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredCreators.length === 0 ? (
        <div className="py-12 text-center border border-dashed rounded-xl space-y-2 bg-muted/10">
          <Sparkles className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
          <p className="text-sm font-semibold text-foreground">No creators found</p>
          <p className="text-xs text-muted-foreground">Adjust your search filter or create a new educator profile.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCreators.map((creator) => {
            const avatar = creator.photo || getRealHumanAvatar(creator.name);

            return (
              <div
                key={creator.id}
                className="p-4 rounded-xl border bg-card hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <img
                    src={avatar}
                    alt={creator.name}
                    className="h-12 w-12 rounded-xl object-cover bg-muted border border-border/80 shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-sm text-foreground truncate">
                        {creator.name}
                      </h4>
                      {creator.is_demo && (
                        <Badge variant="secondary" className="text-[10px] bg-purple-500/10 text-purple-600 border-purple-500/20">
                          Demo Profile (Draft)
                        </Badge>
                      )}
                      {creator.verification_status === "verified" ? (
                        <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-500/10 border-emerald-500/30 gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">
                          Unverified
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className={
                          creator.visibility === "published"
                            ? "text-[10px] bg-emerald-500/10 text-emerald-600"
                            : creator.visibility === "draft"
                            ? "text-[10px] bg-amber-500/10 text-amber-600"
                            : "text-[10px] bg-muted text-muted-foreground"
                        }
                      >
                        {creator.visibility}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground truncate max-w-md">
                      {creator.title} • {creator.expertise}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-0.5">
                      <span className="font-semibold text-foreground flex items-center gap-1">
                        <BookOpen className="h-3 w-3 text-primary" />
                        {creator.courses_count || 0} Courses
                      </span>
                      {creator.social_links?.github && (
                        <span>GitHub: {creator.social_links.github}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1"
                    onClick={() => handleToggleVerification(creator)}
                    title={creator.verification_status === "verified" ? "Revoke Verification" : "Mark as Verified"}
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                    {creator.verification_status === "verified" ? "Unverify" : "Verify"}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1"
                    onClick={() => handleToggleVisibility(creator)}
                    title={creator.visibility === "published" ? "Unpublish to Draft" : "Publish to Live Site"}
                  >
                    {creator.visibility === "published" ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5 text-amber-500" /> Unpublish
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5 text-emerald-500" /> Publish
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => handleEdit(creator)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(creator)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Create Dialog */}
      {isDialogOpen && editingCreator && (
        <CreatorEditorDialog
          creator={editingCreator}
          open={isDialogOpen}
          onOpenChange={(val) => {
            setIsDialogOpen(val);
            if (!val) setEditingCreator(null);
          }}
          onSave={(updated) => saveMutation.mutate(updated)}
          isSaving={saveMutation.isPending}
        />
      )}

      {/* Delete Confirmation Alert */}
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Creator Profile?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This will remove their public educator listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              Delete Creator
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Creator Editor Dialog Component with useAdminDraft
// ─────────────────────────────────────────────────────────────────────────────

interface CreatorEditorDialogProps {
  creator: CreatorRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (creator: CreatorRecord) => void;
  isSaving: boolean;
}

function CreatorEditorDialog({
  creator,
  open,
  onOpenChange,
  onSave,
  isSaving,
}: CreatorEditorDialogProps) {
  const {
    formData,
    updateField,
    isDirty,
    status,
    lastSavedAt,
    restoreDraft,
    discardRecoverableDraft,
    hasRecoverableDraft,
    recoverableDraftDate,
  } = useAdminDraft<CreatorRecord>({
    module: "creators",
    recordId: creator.id || "new",
    initialData: creator,
    getTitle: (d) => d.name || "Untitled Creator",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Creator full name is required");
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle>
              {creator.id.startsWith("demo-") || creator.is_demo ? "Edit Demo Creator" : creator.name ? "Edit Creator Profile" : "Add Creator Profile"}
            </DialogTitle>
            <AutosaveStatusBadge status={status} lastSavedAt={lastSavedAt} isDirty={isDirty} />
          </div>
          <DialogDescription className="text-xs">
            Manage creator credentials, published course count, bio, and visibility.
          </DialogDescription>
        </DialogHeader>

        {hasRecoverableDraft && (
          <DraftRecoveryBanner
            hasRecoverableDraft={hasRecoverableDraft}
            recoverableDraftDate={recoverableDraftDate}
            onRestore={restoreDraft}
            onDiscard={discardRecoverableDraft}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Full Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. Siddharth Rao"
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Professional Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Frontend Architect"
                className="text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Expertise &amp; Category *</Label>
              <Input
                value={formData.expertise}
                onChange={(e) => updateField("expertise", e.target.value)}
                placeholder="e.g. Next.js 15, AI Sandboxes"
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Courses Published</Label>
              <Input
                type="number"
                value={formData.courses_count || 0}
                onChange={(e) => updateField("courses_count", Number(e.target.value) || 0)}
                placeholder="3"
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Profile Photo URL</Label>
            <div className="flex gap-2">
              <Input
                value={formData.photo || ""}
                onChange={(e) => updateField("photo", e.target.value)}
                placeholder="https://images.unsplash.com/... or blank for auto avatar"
                className="text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs shrink-0"
                onClick={() => updateField("photo", getRealHumanAvatar(formData.name || "Creator"))}
              >
                Auto Generate
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Public Bio</Label>
            <Textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              placeholder="Overview of creator's curriculum, production engineering background, and teaching experience."
              className="text-xs leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Verification Status</Label>
              <Select
                value={formData.verification_status}
                onValueChange={(val: any) => updateField("verification_status", val)}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unverified">Unverified</SelectItem>
                  <SelectItem value="verified">Verified Educator (Shows Badge)</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Visibility</Label>
              <Select
                value={formData.visibility}
                onValueChange={(val: any) => updateField("visibility", val)}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published (Live to Students)</SelectItem>
                  <SelectItem value="draft">Draft (Hidden)</SelectItem>
                  <SelectItem value="hidden">Archived / Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-lg border bg-muted/20">
            <div className="flex items-center gap-3">
              <Switch
                checked={Boolean(formData.is_demo)}
                onCheckedChange={(val) => updateField("is_demo", val)}
                id="is_demo_creator_toggle"
              />
              <Label htmlFor="is_demo_creator_toggle" className="text-xs cursor-pointer">
                <span className="font-semibold block">Demo Test Profile</span>
                <span className="text-muted-foreground text-[11px] block">
                  Excludes this creator from the live public student directory.
                </span>
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={Boolean(formData.featured)}
                onCheckedChange={(val) => updateField("featured", val)}
                id="featured_creator_toggle"
              />
              <Label htmlFor="featured_creator_toggle" className="text-xs cursor-pointer">
                <span className="font-semibold block">Featured</span>
                <span className="text-muted-foreground text-[11px] block">
                  Highlight at the top of creators showcase.
                </span>
              </Label>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSaving}>
              {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Save Creator
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
