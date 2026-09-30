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
  Users,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Search,
  Loader2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAdminCoaches,
  saveCoach,
  deleteCoach,
  type CoachRecord,
} from "@/lib/coach-creator.functions";
import { getRealHumanAvatar } from "@/lib/real-avatars";
import {
  useAdminDraft,
  AutosaveStatusBadge,
  DraftRecoveryBanner,
} from "@/lib/admin-editor-workspace";

const EMPTY_COACH: CoachRecord = {
  id: "",
  name: "",
  photo: "",
  title: "",
  expertise: "",
  bio: "",
  hourly_rate: 999,
  currency: "INR",
  languages: ["English"],
  availability: "Weekends & Evenings",
  verification_status: "unverified",
  visibility: "draft",
  featured: false,
  sort_order: 1,
  is_demo: false,
};

export default function CoachesManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editingCoach, setEditingCoach] = useState<CoachRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CoachRecord | null>(null);

  const { data: coaches = [], isLoading } = useQuery<CoachRecord[]>({
    queryKey: ["admin-coaches-list"],
    queryFn: () => getAdminCoaches(),
  });

  const saveMutation = useMutation({
    mutationFn: (coach: CoachRecord) => saveCoach({ data: { coach } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coaches-list"] });
      queryClient.invalidateQueries({ queryKey: ["public-coaches-directory"] });
      toast.success("Coach saved successfully");
      setIsDialogOpen(false);
      setEditingCoach(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to save coach");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (coachId: string) => deleteCoach({ data: { coachId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coaches-list"] });
      queryClient.invalidateQueries({ queryKey: ["public-coaches-directory"] });
      toast.success("Coach deleted");
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete coach");
    },
  });

  const handleOpenNew = () => {
    setEditingCoach({
      ...EMPTY_COACH,
      id: `coach-${Date.now()}`,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (coach: CoachRecord) => {
    setEditingCoach({ ...coach });
    setIsDialogOpen(true);
  };

  const handleToggleVisibility = (coach: CoachRecord) => {
    const nextVisibility = coach.visibility === "published" ? "draft" : "published";
    if (coach.is_demo && nextVisibility === "published") {
      toast.info("Demo coaches remain hidden from public directory to protect production credibility.");
    }
    saveMutation.mutate({
      ...coach,
      visibility: nextVisibility,
    });
  };

  const handleToggleVerification = (coach: CoachRecord) => {
    const nextStatus = coach.verification_status === "verified" ? "unverified" : "verified";
    saveMutation.mutate({
      ...coach,
      verification_status: nextStatus,
    });
  };

  const filteredCoaches = useMemo(() => {
    if (!search.trim()) return coaches;
    const q = search.toLowerCase();
    return coaches.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.expertise.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q)
    );
  }, [coaches, search]);

  const stats = useMemo(() => {
    const total = coaches.length;
    const published = coaches.filter((c) => c.visibility === "published" && !c.is_demo).length;
    const verified = coaches.filter((c) => c.verification_status === "verified").length;
    const demo = coaches.filter((c) => c.is_demo).length;
    return { total, published, verified, demo };
  }, [coaches]);

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display tracking-tight text-foreground">
              Coaches &amp; Mentors CMS
            </h2>
            <Badge variant="outline" className="text-xs font-semibold">
              {coaches.length} Profiles
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage 1-on-1 tech mentors, verify industry credentials, set rates, and control public listing.
          </p>
        </div>

        <Button onClick={handleOpenNew} size="sm" className="gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" /> Add Mentor
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border bg-card/60 space-y-1">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total Roster</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="p-3.5 rounded-xl border bg-card/60 space-y-1">
          <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Live &amp; Published</p>
          <p className="text-2xl font-bold text-foreground">{stats.published}</p>
        </div>
        <div className="p-3.5 rounded-xl border bg-card/60 space-y-1">
          <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Verified Credential</p>
          <p className="text-2xl font-bold text-foreground">{stats.verified}</p>
        </div>
        <div className="p-3.5 rounded-xl border bg-card/60 space-y-1">
          <p className="text-[11px] font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">Demo / In Review</p>
          <p className="text-2xl font-bold text-foreground">{stats.demo}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filter mentors by name, tech stack, or expertise..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-xs bg-card"
        />
      </div>

      {/* Coach List Table / Cards */}
      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredCoaches.length === 0 ? (
        <div className="py-12 text-center border border-dashed rounded-xl space-y-2 bg-muted/10">
          <Users className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
          <p className="text-sm font-semibold text-foreground">No coaches found</p>
          <p className="text-xs text-muted-foreground">Try adjusting your search or add a new mentor profile.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCoaches.map((coach) => {
            const avatar = coach.photo || getRealHumanAvatar(coach.name);
            const isLive = coach.visibility === "published" && !coach.is_demo;

            return (
              <div
                key={coach.id}
                className="p-4 rounded-xl border bg-card hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <img
                    src={avatar}
                    alt={coach.name}
                    className="h-12 w-12 rounded-xl object-cover bg-muted border border-border/80 shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-sm text-foreground truncate">
                        {coach.name}
                      </h4>
                      {coach.is_demo && (
                        <Badge variant="secondary" className="text-[10px] bg-purple-500/10 text-purple-600 border-purple-500/20">
                          Demo Profile (Draft)
                        </Badge>
                      )}
                      {coach.verification_status === "verified" ? (
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
                          coach.visibility === "published"
                            ? "text-[10px] bg-emerald-500/10 text-emerald-600"
                            : coach.visibility === "draft"
                            ? "text-[10px] bg-amber-500/10 text-amber-600"
                            : "text-[10px] bg-muted text-muted-foreground"
                        }
                      >
                        {coach.visibility}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground truncate max-w-md">
                      {coach.title} • {coach.expertise}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-0.5">
                      <span className="font-semibold text-foreground">₹{coach.hourly_rate}/hr</span>
                      <span>•</span>
                      <span>{coach.availability || "Flexible"}</span>
                      {coach.languages && coach.languages.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{coach.languages.join(", ")}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1"
                    onClick={() => handleToggleVerification(coach)}
                    title={coach.verification_status === "verified" ? "Revoke Verification" : "Mark as Verified Mentor"}
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                    {coach.verification_status === "verified" ? "Unverify" : "Verify"}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1"
                    onClick={() => handleToggleVisibility(coach)}
                    title={coach.visibility === "published" ? "Unpublish to Draft" : "Publish to Live Site"}
                  >
                    {coach.visibility === "published" ? (
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
                    onClick={() => handleEdit(coach)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(coach)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Create Dialog with Draft Autosave */}
      {isDialogOpen && editingCoach && (
        <CoachEditorDialog
          coach={editingCoach}
          open={isDialogOpen}
          onOpenChange={(val) => {
            setIsDialogOpen(val);
            if (!val) setEditingCoach(null);
          }}
          onSave={(updated) => saveMutation.mutate(updated)}
          isSaving={saveMutation.isPending}
        />
      )}

      {/* Delete Confirmation Alert */}
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Mentor Profile?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{deleteTarget?.name}</strong> from the coaching directory? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              Delete Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Coach Editor Dialog Component with useAdminDraft
// ─────────────────────────────────────────────────────────────────────────────

interface CoachEditorDialogProps {
  coach: CoachRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (coach: CoachRecord) => void;
  isSaving: boolean;
}

function CoachEditorDialog({
  coach,
  open,
  onOpenChange,
  onSave,
  isSaving,
}: CoachEditorDialogProps) {
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
  } = useAdminDraft<CoachRecord>({
    module: "coaches",
    recordId: coach.id || "new",
    initialData: coach,
    getTitle: (d) => d.name || "Untitled Coach",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Mentor full name is required");
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
              {coach.id.startsWith("demo-") || coach.is_demo ? "Edit Demo Mentor" : coach.name ? "Edit Mentor Profile" : "Add Mentor Profile"}
            </DialogTitle>
            <AutosaveStatusBadge status={status} lastSavedAt={lastSavedAt} isDirty={isDirty} />
          </div>
          <DialogDescription className="text-xs">
            Configure mentor credentials, pricing, bio, and visibility settings.
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
                placeholder="e.g. Priya Sharma"
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Professional Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Principal AI Architect @ Razorpay"
                className="text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Expertise &amp; Tech Stack *</Label>
              <Input
                value={formData.expertise}
                onChange={(e) => updateField("expertise", e.target.value)}
                placeholder="e.g. System Design, LLMs & LangChain"
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Hourly Rate (₹ INR) *</Label>
              <Input
                type="number"
                value={formData.hourly_rate}
                onChange={(e) => updateField("hourly_rate", Number(e.target.value) || 0)}
                placeholder="1499"
                className="text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Languages (comma-separated)</Label>
              <Input
                value={(formData.languages || []).join(", ")}
                onChange={(e) =>
                  updateField(
                    "languages",
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                placeholder="English, Hindi"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Availability Slots</Label>
              <Input
                value={formData.availability || ""}
                onChange={(e) => updateField("availability", e.target.value)}
                placeholder="Weekends &amp; Evenings"
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
                onClick={() => updateField("photo", getRealHumanAvatar(formData.name || "Coach"))}
              >
                Auto Generate
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Bio &amp; Mentoring Philosophy</Label>
            <Textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              placeholder="Tell students about your real-world experience, interview tips, and how you conduct 1-on-1 sessions."
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
                  <SelectItem value="verified">Verified (Shows Badge)</SelectItem>
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
                id="is_demo_toggle"
              />
              <Label htmlFor="is_demo_toggle" className="text-xs cursor-pointer">
                <span className="font-semibold block">Demo Test Profile</span>
                <span className="text-muted-foreground text-[11px] block">
                  Excludes this profile from the live public student directory so no demo data leaks.
                </span>
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={Boolean(formData.featured)}
                onCheckedChange={(val) => updateField("featured", val)}
                id="featured_toggle"
              />
              <Label htmlFor="featured_toggle" className="text-xs cursor-pointer">
                <span className="font-semibold block">Featured</span>
                <span className="text-muted-foreground text-[11px] block">
                  Highlight at the top of directory.
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
              Save Mentor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
