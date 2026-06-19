import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Loader2, Plus, Users, Video, BookOpen, Sparkles, Pencil, Trash2, MessageCircle, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/cohorts")({
  head: () => ({ meta: [{ title: "Cohorts & Study Groups — Learnify AI" }] }),
  component: CohortsPage,
});

const KIND_LABEL: Record<string, string> = {
  cohort: "Live cohort",
  office_hours: "Office hours",
  study_group: "Study group",
};

function CohortsPage() {
  const { user, isAdmin, hasRole } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const isCreator = hasRole("creator") || hasRole("super_admin") || hasRole("admin");
  const [open, setOpen] = useState(false);
  const [editingCohort, setEditingCohort] = useState<any | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const cohortsQuery = useQuery({
    queryKey: ["cohorts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cohorts")
        .select(
          "id, title, description, kind, starts_at, ends_at, capacity, status, creator_id, course_id, meeting_url, group_link",
        )
        .order("starts_at", { ascending: true })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });

  const membersQuery = useQuery({
    enabled: !!user,
    queryKey: ["my-cohorts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cohort_members")
        .select("cohort_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      return new Set((data ?? []).map((m) => m.cohort_id));
    },
  });

  const countsQuery = useQuery({
    queryKey: ["cohort-counts", (cohortsQuery.data ?? []).map((c) => c.id).join(",")],
    enabled: !!cohortsQuery.data,
    queryFn: async () => {
      const ids = (cohortsQuery.data ?? []).map((c) => c.id);
      if (!ids.length) return new Map<string, number>();
      const { data } = await supabase
        .from("cohort_members")
        .select("cohort_id, user_id")
        .in("cohort_id", ids);
      const m = new Map<string, number>();
      const userIdsByCohort = new Map<string, string[]>();
      const allUserIds = new Set<string>();
      for (const r of data ?? []) {
        m.set(r.cohort_id, (m.get(r.cohort_id) ?? 0) + 1);
        const uids = userIdsByCohort.get(r.cohort_id) ?? [];
        uids.push(r.user_id);
        userIdsByCohort.set(r.cohort_id, uids);
        allUserIds.add(r.user_id);
      }
      return { counts: m, userIdsByCohort, allUserIds: [...allUserIds] };
    },
  });

  const memberProfilesQuery = useQuery({
    queryKey: ["cohort-member-profiles", (countsQuery.data as any)?.allUserIds?.join(",")],
    enabled: !!(countsQuery.data as any)?.allUserIds?.length,
    queryFn: async () => {
      const ids = (countsQuery.data as any).allUserIds as string[];
      if (!ids.length) return new Map<string, { avatar_url: string | null; full_name: string | null }>();
      const { data } = await supabase
        .from("profiles")
        .select("id, avatar_url, full_name")
        .in("id", ids);
      const m = new Map<string, { avatar_url: string | null; full_name: string | null }>();
      for (const p of data ?? []) m.set(p.id, p);
      return m;
    },
  });

  async function joinCohort(id: string) {
    if (!user) return navigate({ to: "/login" });
    const { data: cohort } = await supabase
      .from("cohorts")
      .select("meeting_url, group_link, title")
      .eq("id", id)
      .single();
    const { error } = await supabase
      .from("cohort_members")
      .insert({ cohort_id: id, user_id: user.id });
    if (error) return toast.error(error.message);
    toast.success(`Joined "${cohort?.title ?? id}"`);
    qc.invalidateQueries({ queryKey: ["my-cohorts"] });
    qc.invalidateQueries({ queryKey: ["cohort-counts"] });
    if (cohort?.group_link) window.open(cohort.group_link, "_blank");
    if (cohort?.meeting_url) window.open(cohort.meeting_url, "_blank");
  }

  async function leaveCohort(id: string) {
    if (!user) return;
    const { error } = await supabase
      .from("cohort_members")
      .delete()
      .eq("cohort_id", id)
      .eq("user_id", user.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["my-cohorts"] });
    qc.invalidateQueries({ queryKey: ["cohort-counts"] });
  }

  const cohorts = cohortsQuery.data ?? [];
  const filterBy = (kind: string) => cohorts.filter((c) => c.kind === kind);

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-medium">
              Community
            </div>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
              Cohorts, office hours & study groups
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Learn together, ship faster.</p>
          </div>
          {isCreator && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4" /> Create cohort
                </Button>
              </DialogTrigger>
              <CreateCohortDialog
                onCreated={() => {
                  setOpen(false);
                  qc.invalidateQueries({ queryKey: ["cohorts"] });
                }}
              />
            </Dialog>
          )}
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="cohort">Live cohorts</TabsTrigger>
            <TabsTrigger value="office_hours">Office hours</TabsTrigger>
            <TabsTrigger value="study_group">Study groups</TabsTrigger>
          </TabsList>
          {["all", "cohort", "office_hours", "study_group"].map((k) => (
            <TabsContent key={k} value={k} className="mt-6">
              <CohortList
                cohorts={k === "all" ? cohorts : filterBy(k)}
                loading={cohortsQuery.isLoading}
                joined={membersQuery.data ?? new Set()}
                counts={(countsQuery.data as any)?.counts ?? new Map()}
                userIdsByCohort={(countsQuery.data as any)?.userIdsByCohort}
                memberProfiles={memberProfilesQuery.data}
                onJoin={joinCohort}
                onLeave={leaveCohort}
                userId={user?.id}
                isAdmin={isAdmin}
                onEdit={(c) => { setEditingCohort(c); setEditOpen(true); }}
                onDelete={(id) => setDeleteId(id)}
              />
            </TabsContent>
          ))}
        </Tabs>

        <EditCohortDialog
          cohort={editingCohort}
          open={editOpen}
          onOpenChange={(v) => { setEditOpen(v); if (!v) setEditingCohort(null); }}
          onSaved={() => { qc.invalidateQueries({ queryKey: ["cohorts"] }); }}
        />

        <DeleteCohortDialog
          deleteId={deleteId}
          onClose={() => setDeleteId(null)}
          onDeleted={() => {
            qc.invalidateQueries({ queryKey: ["cohorts"] });
            qc.invalidateQueries({ queryKey: ["cohort-counts"] });
          }}
        />
      </div>
    </AppShell>
  );
}

function DeleteCohortDialog({ deleteId, onClose, onDeleted }: { deleteId: string | null; onClose: () => void; onDeleted: () => void }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { error } = await supabase.from("cohorts").delete().eq("id", deleteId);
    setDeleting(false);
    if (error) return toast.error(error.message);
    toast.success("Cohort deleted");
    onDeleted();
    onClose();
  }

  return (
    <AlertDialog open={!!deleteId} onOpenChange={(v) => { if (!v) onClose(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete cohort?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleting}>
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function EditCohortDialog({ cohort, open, onOpenChange, onSaved }: { cohort: any; open: boolean; onOpenChange: (v: boolean) => void; onSaved: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState("cohort");
  const [startsAt, setStartsAt] = useState("");
  const [capacity, setCapacity] = useState("50");
  const [status, setStatus] = useState("draft");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [groupLink, setGroupLink] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (cohort) {
      setTitle(cohort.title || "");
      setDescription(cohort.description || "");
      setKind(cohort.kind || "cohort");
      setStartsAt(cohort.starts_at ? new Date(cohort.starts_at).toISOString().slice(0, 16) : "");
      setCapacity(String(cohort.capacity ?? "50"));
      setStatus(cohort.status || "draft");
      setMeetingUrl(cohort.meeting_url || "");
      setGroupLink(cohort.group_link || "");
    }
  }, [cohort]);

  async function submit() {
    if (!cohort?.id) return;
    if (!title.trim()) return toast.error("Title required");
    setSaving(true);
    const { error } = await (supabase as any)
      .from("cohorts")
      .update({
        title: title.trim(),
        description: description.trim() || null,
        kind,
        starts_at: new Date(startsAt).toISOString(),
        capacity: Math.max(1, Number(capacity) || 50),
        status,
        meeting_url: meetingUrl.trim() || null,
        group_link: groupLink.trim() || null,
      })
      .eq("id", cohort.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Cohort updated");
    onSaved();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit cohort</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={500} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={kind} onValueChange={setKind}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cohort">Live cohort</SelectItem>
                  <SelectItem value="office_hours">Office hours</SelectItem>
                  <SelectItem value="study_group">Study group</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Starts at</Label>
              <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Capacity</Label>
              <Input type="number" min={1} max={1000} value={capacity} onChange={(e) => setCapacity(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Meeting URL</Label>
            <Input value={meetingUrl} onChange={(e) => setMeetingUrl(e.target.value)} placeholder="https://" />
          </div>
          <div className="space-y-1.5">
            <Label>Group chat link (WhatsApp / Discord)</Label>
            <Input value={groupLink} onChange={(e) => setGroupLink(e.target.value)} placeholder="https://chat.whatsapp.com/..." />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CohortList({
  cohorts,
  loading,
  joined,
  counts,
  userIdsByCohort,
  memberProfiles,
  onJoin,
  onLeave,
  userId,
  isAdmin,
  onEdit,
  onDelete,
}: {
  cohorts: any[];
  loading: boolean;
  joined: Set<string>;
  counts: Map<string, number>;
  userIdsByCohort?: Map<string, string[]>;
  memberProfiles?: Map<string, { avatar_url: string | null; full_name: string | null }>;
  onJoin: (id: string) => void;
  onLeave: (id: string) => void;
  userId?: string;
  isAdmin?: boolean;
  onEdit?: (c: any) => void;
  onDelete?: (id: string) => void;
}) {
  if (loading)
    return (
      <div className="py-20 grid place-items-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  if (cohorts.length === 0)
    return (
      <div className="rounded-2xl border bg-card p-12 text-center text-sm text-muted-foreground">
        <Sparkles className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        Nothing scheduled yet. Be the first to host!
      </div>
    );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cohorts.map((c) => {
        const isJoined = joined.has(c.id);
        const memberCount = counts.get(c.id) ?? 0;
        const isFull = memberCount >= c.capacity;
        return (
          <div
            key={c.id}
            className="rounded-2xl border bg-card p-5 shadow-card hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Badge variant="secondary" className="text-[10px] mb-2">
                  {KIND_LABEL[c.kind] ?? c.kind}
                </Badge>
                <Link to="/cohorts/$id" params={{ id: c.id }}>
                  <h3 className="font-display font-semibold leading-snug hover:text-primary">
                    {c.title}
                  </h3>
                </Link>
                {c.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {(isAdmin || c.creator_id === userId) && (
                  <>
                    <button onClick={() => onEdit?.(c)} className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => onDelete?.(c.id)} className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
                <Badge
                  variant={c.status === "live" ? "default" : "outline"}
                  className="text-[10px] capitalize"
                >
                  {c.status}
                  {c.status !== "live" && c.status !== "ended" && c.status !== "cancelled" && (() => {
                    const diffMs = new Date(c.starts_at).getTime() - Date.now();
                    if (diffMs > 0 && diffMs <= 60 * 60 * 1000) return " · soon";
                    return "";
                  })()}
                </Badge>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {format(new Date(c.starts_at), "dd MMM, HH:mm")}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {memberCount}/{c.capacity}
              </span>
              {memberCount > 0 && userIdsByCohort && memberProfiles && (
                <span className="flex -space-x-1.5 ml-1">
                  {(userIdsByCohort.get(c.id) ?? []).slice(0, 5).map((uid) => {
                    const p = memberProfiles.get(uid);
                    return (
                      <div key={uid} className="h-5 w-5 rounded-full border border-background bg-muted overflow-hidden" title={p?.full_name ?? ""}>
                        {p?.avatar_url ? (
                          <img src={p.avatar_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-[7px] font-medium flex items-center justify-center h-full text-muted-foreground">
                            {(p?.full_name ?? "?")[0]}
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {memberCount > 5 && (
                    <span className="h-5 w-5 rounded-full border border-background bg-muted flex items-center justify-center text-[7px] font-medium text-muted-foreground">
                      +{memberCount - 5}
                    </span>
                  )}
                </span>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/cohorts/$id" params={{ id: c.id }}>
                  Details
                </Link>
              </Button>
              {c.group_link && (
                <a href={c.group_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                  <MessageCircle className="h-3 w-3" /> Group chat
                </a>
              )}
              {isJoined ? (
                <Button size="sm" variant="secondary" onClick={() => onLeave(c.id)}>
                  Leave
                </Button>
              ) : (
                <Button size="sm" onClick={() => onJoin(c.id)} disabled={isFull}>
                  {isFull ? "Full" : "Join"}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CreateCohortDialog({ onCreated }: { onCreated: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState("cohort");
  const [startsAt, setStartsAt] = useState(() =>
    new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  );
  const [capacity, setCapacity] = useState("50");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!user) return;
    if (!title.trim()) return toast.error("Title required");
    setSaving(true);
    const { error } = await supabase.from("cohorts").insert({
      creator_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      kind,
      starts_at: new Date(startsAt).toISOString(),
      capacity: Math.max(1, Number(capacity) || 50),
      meeting_url: meetingUrl.trim() || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Cohort created");
    onCreated();
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create cohort</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={500}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={kind} onValueChange={setKind}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cohort">Live cohort</SelectItem>
                <SelectItem value="office_hours">Office hours</SelectItem>
                <SelectItem value="study_group">Study group</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Capacity</Label>
            <Input
              type="number"
              min={1}
              max={1000}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Starts at</Label>
          <Input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Meeting URL (Zoom/Meet)</Label>
          <Input
            value={meetingUrl}
            onChange={(e) => setMeetingUrl(e.target.value)}
            placeholder="https://"
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={submit} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}{" "}
          Create
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
