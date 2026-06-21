import { createFileRoute, useLocation, useNavigate, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Calendar as CalendarIcon,
  Briefcase,
  ArrowLeft,
  Tag,
  Settings,
  X,
  Eye,
  Award,
  HelpCircle,
  Send,
  FileText,
  GitBranch,
  Percent,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  CertificateRender,
  DEFAULT_DESIGN,
  FONT_OPTIONS,
  BORDER_STYLES,
  CORNER_STYLES,
  BACKGROUND_PATTERNS,
  LAYOUTS,
  type CertDesign,
} from "@/components/CertificateDesign";
import { CertificateFullPreviewDialog } from "@/components/CertificateFullPreviewDialog";
import { Maximize2, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { savePlan, deletePlan, syncPlanToCashfree } from "@/lib/subscription.functions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import FeaturesManager from "@/components/admin/FeaturesManager";

// Heavy admin panels — code-split so initial admin page paints fast.
const IssueCertificate = lazy(() => import("@/components/admin/IssueCertificate"));

function LazyFallback() {
  return (
    <div className="flex justify-center py-16">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/admin/content")({
  head: () => ({ meta: [{ title: "Content Manager — Learnify AI" }] }),
  component: AdminContentPage,
});

const SITE_LOGO_URL = "/favicon.ico";

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  location: string | null;
  rsvp_url: string | null;
  image_url: string | null;
};

type JobRow = {
  id: string;
  title: string;
  team: string;
  location: string;
  description: string | null;
  apply_url: string | null;
  active: boolean;
  closes_at: string | null;
};

function AdminContentPage() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const requestedTab = (() => {
    const search = location.search as unknown;
    if (search && typeof search === "object" && "tab" in search)
      return String((search as { tab?: unknown }).tab ?? "");
    if (typeof window !== "undefined")
      return new URLSearchParams(window.location.search).get("tab") ?? "";
    return "";
  })();
  const tabAlias =
    (
      {
        templates: "cert-templates",
        certificate: "cert-templates",
        certificates: "cert-templates",
      } as Record<string, string>
    )[requestedTab] ?? requestedTab;
  const tabFromUrl = [
    "events",
    "jobs",
    "pricing",
    "site",
    "cert-templates",
    "issue-cert",
    "faqs",
    "pages",
    "roadmap",
    "coupons",
    "community",
    "features",
  ].includes(tabAlias)
    ? tabAlias
    : "events";
  const [tab, setTab] = useState(tabFromUrl || "events");

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/dashboard" });
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    setTab(tabFromUrl || "events");
  }, [tabFromUrl]);

  if (loading || !isAdmin) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link
              to="/admin"
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to admin
            </Link>
            <h1 className="font-display text-3xl font-bold">Content Manager</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage events, jobs, pricing, FAQs, site settings and certificate templates from one
              place. Past events auto-delete 24h after they end. Jobs auto-close when their close
              date passes.
            </p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="events">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <Briefcase className="h-4 w-4 mr-2" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="pricing">
              <Tag className="h-4 w-4 mr-2" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="site">
              <Settings className="h-4 w-4 mr-2" />
              Site
            </TabsTrigger>
            <TabsTrigger value="cert-templates">
              <Award className="h-4 w-4 mr-2" />
              Cert Templates
            </TabsTrigger>
            <TabsTrigger value="issue-cert">
              <Send className="h-4 w-4 mr-2" />
              Issue Cert
            </TabsTrigger>
            <TabsTrigger value="faqs">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="pages">
              <FileText className="h-4 w-4 mr-2" />
              Pages
            </TabsTrigger>
            <TabsTrigger value="roadmap">
              <GitBranch className="h-4 w-4 mr-2" />
              Roadmap
            </TabsTrigger>
            <TabsTrigger value="coupons">
              <Percent className="h-4 w-4 mr-2" />
              Coupons
            </TabsTrigger>
            <TabsTrigger value="community">
              <Users className="h-4 w-4 mr-2" />
              Community Groups
            </TabsTrigger>
            <TabsTrigger value="features">
              <Eye className="h-4 w-4 mr-2" />
              Visibility
            </TabsTrigger>
          </TabsList>
          <TabsContent value="events" className="mt-6">
            <EventsManager />
          </TabsContent>
          <TabsContent value="jobs" className="mt-6">
            <JobsManager />
          </TabsContent>
          <TabsContent value="pricing" className="mt-6">
            <PricingManager />
          </TabsContent>
          <TabsContent value="site" className="mt-6">
            <SiteSettingsManager />
          </TabsContent>
          <TabsContent value="cert-templates" className="mt-6">
            <CertTemplatesManager />
          </TabsContent>
          <TabsContent value="issue-cert" className="mt-6">
            <Suspense fallback={<LazyFallback />}>
              <IssueCertificate />
            </Suspense>
          </TabsContent>

          <TabsContent value="faqs" className="mt-6">
            <FaqsManager />
          </TabsContent>
          <TabsContent value="pages" className="mt-6">
            <PagesManager />
          </TabsContent>
          <TabsContent value="roadmap" className="mt-6">
            <RoadmapManager />
          </TabsContent>
          <TabsContent value="coupons" className="mt-6">
            <CouponManager />
          </TabsContent>
          <TabsContent value="community" className="mt-6">
            <CohortsManager />
          </TabsContent>
          <TabsContent value="features" className="mt-6">
            <FeaturesManager />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

// ─────────────────────────── Events ───────────────────────────

function EventsManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<EventRow | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("starts_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as EventRow[];
    },
  });

  const newEvent = () => {
    setEditing({
      id: "",
      title: "",
      description: "",
      starts_at: new Date(Date.now() + 7 * 86400_000).toISOString().slice(0, 16),
      location: "",
      rsvp_url: "",
      image_url: "",
    });
    setOpen(true);
  };

  const removeEvent = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("events").delete().eq("id", deleteId);
    if (error) return toast.error(error.message);
    toast.success("Event deleted");
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["admin-events"] });
    qc.invalidateQueries({ queryKey: ["events-public"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={newEvent}>
          <Plus className="h-4 w-4 mr-2" />
          New event
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No events yet.</p>
      ) : (
        <div className="space-y-2">
          {events.map((e) => (
            <div
              key={e.id}
              className="rounded-xl border border-border/60 bg-card p-4 flex items-center gap-3"
            >
              {e.image_url ? (
                <img
                  src={e.image_url}
                  alt=""
                  className="h-14 w-20 rounded-md object-cover shrink-0"
                />
              ) : (
                <div className="h-14 w-20 rounded-md bg-muted grid place-items-center shrink-0">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate">{e.title}</div>
                <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-3">
                  <span>{format(new Date(e.starts_at), "PPp")}</span>
                  {e.location && <span>· {e.location}</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(e);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDeleteId(e.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EventDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        event={editing}
        onSaved={() => {
          qc.invalidateQueries({ queryKey: ["admin-events"] });
          qc.invalidateQueries({ queryKey: ["events-public"] });
        }}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete event?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeEvent}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EventDialog({
  open,
  onOpenChange,
  event,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  event: EventRow | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<EventRow | null>(event);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(event);
  }, [event]);

  if (!form) return null;

  const save = async () => {
    if (!form.title.trim() || !form.starts_at) {
      toast.error("Title and date are required");
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description?.trim() || null,
      starts_at: new Date(form.starts_at).toISOString(),
      location: form.location?.trim() || null,
      rsvp_url: form.rsvp_url?.trim() || null,
      image_url: form.image_url?.trim() || null,
    };
    const { error } = form.id
      ? await supabase.from("events").update(payload).eq("id", form.id)
      : await supabase.from("events").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Event updated" : "Event created");
    onSaved();
    onOpenChange(false);
  };

  const localValue = (() => {
    try {
      return format(new Date(form.starts_at), "yyyy-MM-dd'T'HH:mm");
    } catch {
      return "";
    }
  })();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit event" : "New event"}</DialogTitle>
          <DialogDescription>Public on the /events page until 24h after start.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Date & time</Label>
              <Input
                type="datetime-local"
                value={localValue}
                onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={form.location ?? ""}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Online · Zoom"
              />
            </div>
          </div>
          <div>
            <Label>RSVP URL</Label>
            <Input
              value={form.rsvp_url ?? ""}
              onChange={(e) => setForm({ ...form, rsvp_url: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label>Cover image URL</Label>
            <Input
              value={form.image_url ?? ""}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://... (banner shown on dashboard)"
            />
            {form.image_url ? (
              <img
                src={form.image_url}
                alt=""
                className="mt-2 h-24 w-full rounded-md object-cover border"
              />
            ) : null}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────── Jobs ───────────────────────────

function JobsManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<JobRow | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_postings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as JobRow[];
    },
  });

  const newJob = () => {
    setEditing({
      id: "",
      title: "",
      team: "Engineering",
      location: "Remote · India",
      description: "",
      apply_url: "",
      active: true,
      closes_at: null,
    });
    setOpen(true);
  };

  const removeJob = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("job_postings").delete().eq("id", deleteId);
    if (error) return toast.error(error.message);
    toast.success("Job deleted");
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["admin-jobs"] });
    qc.invalidateQueries({ queryKey: ["jobs-public"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={newJob}>
          <Plus className="h-4 w-4 mr-2" />
          New job
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No jobs yet.</p>
      ) : (
        <div className="space-y-2">
          {jobs.map((j) => (
            <div
              key={j.id}
              className="rounded-xl border border-border/60 bg-card p-4 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="font-semibold truncate flex items-center gap-2">
                  {j.title}
                  {!j.active && (
                    <span className="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                      Closed
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {j.team} · {j.location}
                  {j.closes_at && <> · closes {format(new Date(j.closes_at), "PP")}</>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(j);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDeleteId(j.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <JobDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        job={editing}
        onSaved={() => {
          qc.invalidateQueries({ queryKey: ["admin-jobs"] });
          qc.invalidateQueries({ queryKey: ["jobs-public"] });
        }}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete job?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeJob}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function JobDialog({
  open,
  onOpenChange,
  job,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  job: JobRow | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<JobRow | null>(job);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(job);
  }, [job]);

  if (!form) return null;

  const save = async () => {
    if (!form.title.trim() || !form.team.trim() || !form.location.trim()) {
      toast.error("Title, team, and location are required");
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      team: form.team.trim(),
      location: form.location.trim(),
      description: form.description?.trim() || null,
      apply_url: form.apply_url?.trim() || null,
      active: form.active,
      closes_at: form.closes_at ? new Date(form.closes_at).toISOString() : null,
    };
    const { error } = form.id
      ? await supabase.from("job_postings").update(payload).eq("id", form.id)
      : await supabase.from("job_postings").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Job updated" : "Job created");
    onSaved();
    onOpenChange(false);
  };

  const closesLocal = form.closes_at
    ? (() => {
        try {
          return format(new Date(form.closes_at!), "yyyy-MM-dd'T'HH:mm");
        } catch {
          return "";
        }
      })()
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit job" : "New job"}</DialogTitle>
          <DialogDescription>Public on the /careers page while active.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Team</Label>
              <Input
                value={form.team}
                onChange={(e) => setForm({ ...form, team: e.target.value })}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <Label>Apply URL</Label>
            <Input
              value={form.apply_url ?? ""}
              onChange={(e) => setForm({ ...form, apply_url: e.target.value })}
              placeholder="mailto:careers@learnify.ai or https://..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <Label>Auto-close on</Label>
              <Input
                type="datetime-local"
                value={closesLocal}
                onChange={(e) => setForm({ ...form, closes_at: e.target.value || null })}
              />
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch
                checked={form.active}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
              />
              <Label className="cursor-pointer">Active</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────── Pricing Plans ───────────────────────────

type PlanRow = {
  id: string;
  name: string;
  price_label: string;
  description: string | null;
  features: string[];
  cta_label: string;
  cta_to: string;
  highlighted: boolean;
  order_index: number;
  active: boolean;
  price_inr: number;
  interval: string | null;
  ai_credits_monthly: number;
  max_courses: number;
  badge: string | null;
  color: string | null;
  cashfree_plan_id: string | null;
};

function PricingManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<PlanRow | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const doSavePlan = useServerFn(savePlan);
  const doDeletePlan = useServerFn(deletePlan);
  const doSyncPlan = useServerFn(syncPlanToCashfree);

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["admin-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("*")
        .order("order_index", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((p: any) => ({
        ...p,
        features: Array.isArray(p.features) ? p.features : [],
      })) as PlanRow[];
    },
  });

  const newPlan = () => {
    setEditing({
      id: "",
      name: "",
      price_label: "Free",
      description: "",
      features: [],
      cta_label: "Get started",
      cta_to: "/signup",
      highlighted: false,
      order_index: (plans.length + 1) * 10,
      active: true,
      price_inr: 0,
      interval: "month",
      ai_credits_monthly: 0,
      max_courses: -1,
      badge: "",
      color: "",
      cashfree_plan_id: null,
    });
    setOpen(true);
  };

  const removePlan = async () => {
    if (!deleteId) return;
    try {
      await doDeletePlan({ data: { planId: deleteId } });
      toast.success("Plan deleted");
      setDeleteId(null);
      qc.invalidateQueries({ queryKey: ["admin-plans"] });
      qc.invalidateQueries({ queryKey: ["pricing-plans"] });
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={newPlan}>
          <Plus className="h-4 w-4 mr-2" />
          New plan
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : plans.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No plans yet.</p>
      ) : (
        <div className="space-y-2">
          {plans.map((p) => (
            <div key={p.id} className="rounded-xl border border-border/60 bg-card p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate flex items-center gap-2">
                    {p.name}{" "}
                    <span className="text-xs text-muted-foreground">· {p.price_label}</span>
                    {p.highlighted && (
                      <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5">
                        Featured
                      </span>
                    )}
                    {!p.active && (
                      <span className="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 break-words">
                    {p.interval ? `${p.interval}ly` : "One-time"} ·{" "}
                    {p.ai_credits_monthly > 0
                      ? `${p.ai_credits_monthly.toLocaleString("en-IN")} AI credits/mo`
                      : "No AI credits"}
                    {p.cashfree_plan_id
                      ? ` · Synced to Cashfree`
                      : p.price_inr > 0 && p.interval
                        ? ` · Not synced`
                        : ` · No recurring billing`}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 shrink-0 w-full sm:w-auto">

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setEditing(p);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5 sm:mr-0 mr-2" />{" "}
                    <span className="sm:hidden">Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => setDeleteId(p.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:mr-0 mr-2" />{" "}
                    <span className="sm:hidden">Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <PlanDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        plan={editing}
        onSaved={async (form) => {
          try {
            await doSavePlan({ data: { plan: form } });
            toast.success(form.id ? "Plan updated" : "Plan created");
            qc.invalidateQueries({ queryKey: ["admin-plans"] });
            qc.invalidateQueries({ queryKey: ["pricing-plans"] });
            setOpen(false);
            setEditing(null);
          } catch (e: any) {
            toast.error(e?.message || "Failed to save plan");
          }
        }}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete plan?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removePlan}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PlanDialog({
  open,
  onOpenChange,
  plan,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  plan: PlanRow | null;
  onSaved: (form: any) => Promise<void>;
}) {
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (plan) {
      setForm({
        ...plan,
        features: Array.isArray(plan.features) ? plan.features.join("\n") : "",
      });
    }
  }, [plan]);

  if (!form) return null;

  const save = async () => {
    if (!form.name.trim() || !form.price_label.trim()) {
      toast.error("Name and price are required");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      features: form.features
        .split("\n")
        .map((s: string) => s.trim())
        .filter(Boolean),
    };
    await onSaved(payload);
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit plan" : "New plan"}</DialogTitle>
          <DialogDescription>Shown publicly on the /pricing page.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Pro"
              />
            </div>
            <div>
              <Label>Price label</Label>
              <Input
                value={form.price_label}
                onChange={(e) => setForm({ ...form, price_label: e.target.value })}
                placeholder="₹499/mo"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Price INR</Label>
              <Input
                type="number"
                value={form.price_inr}
                onChange={(e) => setForm({ ...form, price_inr: Number(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Interval</Label>
              <Select
                value={form.interval || "none"}
                onValueChange={(v) => setForm({ ...form, interval: v === "none" ? null : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="year">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>AI credits / mo</Label>
              <Input
                type="number"
                value={form.ai_credits_monthly}
                onChange={(e) =>
                  setForm({ ...form, ai_credits_monthly: Number(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label>Max courses (-1 = unlimited)</Label>
              <Input
                type="number"
                value={form.max_courses}
                onChange={(e) => setForm({ ...form, max_courses: Number(e.target.value) || -1 })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Badge</Label>
              <Input
                value={form.badge || ""}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="Most popular"
              />
            </div>
            <div>
              <Label>Color</Label>
              <Input
                value={form.color || ""}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="#7c3aed"
              />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={2}
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <Label>Features (one per line)</Label>
            <Textarea
              rows={4}
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              placeholder="Unlimited courses&#10;Advanced AI tools&#10;Certificates"
            />
          </div>
          <div className="grid grid-cols-3 gap-3 items-end">
            <div>
              <Label>Order</Label>
              <Input
                type="number"
                value={form.order_index}
                onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch
                checked={form.highlighted}
                onCheckedChange={(v) => setForm({ ...form, highlighted: v })}
              />
              <Label className="cursor-pointer">Featured</Label>
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch
                checked={form.active !== false}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
              />
              <Label className="cursor-pointer">Active</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────── Site Settings ───────────────────────────

const SETTING_FIELDS: { key: string; label: string; placeholder: string }[] = [
  { key: "contact_email", label: "Contact email", placeholder: "hello@learnify.ai" },
  { key: "careers_email", label: "Careers email", placeholder: "careers@learnify.ai" },
  { key: "discord_url", label: "Discord URL", placeholder: "https://discord.gg/..." },
  {
    key: "discord_label",
    label: "Discord tagline",
    placeholder: "Chat with the community in real time.",
  },
  { key: "twitter_url", label: "X (Twitter) URL", placeholder: "https://x.com/learnifyai" },
  { key: "twitter_handle", label: "X handle", placeholder: "@learnifyai" },
  { key: "github_url", label: "GitHub URL", placeholder: "https://github.com/..." },
  { key: "linkedin_url", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/..." },
  { key: "youtube_url", label: "YouTube URL", placeholder: "https://youtube.com/@..." },
  {
    key: "events_auto_delete_enabled",
    label: "Auto-delete past events (true/false)",
    placeholder: "true",
  },
  { key: "events_auto_delete_hours", label: "Auto-delete events after (hours)", placeholder: "24" },
  {
    key: "jobs_auto_close_enabled",
    label: "Auto-close jobs past close date (true/false)",
    placeholder: "true",
  },
  // Invoice customization
  { key: "invoice_company_name", label: "Invoice company name", placeholder: "Learnify AI" },
  {
    key: "invoice_legal_name",
    label: "Invoice legal name",
    placeholder: "Learnify EdTech Pvt. Ltd.",
  },
  { key: "invoice_gstin", label: "Invoice GSTIN", placeholder: "29XXXXX1234X1Z5" },
  { key: "invoice_prefix", label: "Invoice number prefix", placeholder: "LRN" },
  {
    key: "invoice_footer",
    label: "Invoice footer text",
    placeholder: "This is a computer generated invoice...",
  },
  {
    key: "invoice_logo_url",
    label: "Invoice logo URL",
    placeholder: "https://example.com/logo.png",
  },
  {
    key: "invoice_contact",
    label: "Invoice contact (email/phone)",
    placeholder: "hello@learnify.ai · +91 98765 43210",
  },
];

function SiteSettingsManager() {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) throw error;
      const m: Record<string, string> = {};
      (data ?? []).forEach((r: any) => {
        m[r.key] = r.value ?? "";
      });
      return m;
    },
  });

  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const settingMeta = (key: string) => SETTING_FIELDS.find((f) => f.key === key);
  const settingKeys = [
    ...SETTING_FIELDS.map((f) => f.key),
    ...Object.keys(values)
      .filter((key) => !SETTING_FIELDS.some((f) => f.key === key))
      .sort(),
  ];

  const save = async () => {
    setSaving(true);
    const rows = settingKeys
      .filter((key) => key.trim())
      .map((key) => ({ key: key.trim(), value: values[key] ?? "" }));
    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Site settings saved");
    qc.invalidateQueries({ queryKey: ["admin-site-settings"] });
    qc.invalidateQueries({ queryKey: ["site-settings"] });
  };

  const addSetting = async () => {
    const key = newKey
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_");
    if (!key) return toast.error("Setting key is required");
    if (values[key] !== undefined) return toast.error("That setting already exists");
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value: newValue }, { onConflict: "key" });
    setSaving(false);
    if (error) return toast.error(error.message);
    setValues({ ...values, [key]: newValue });
    setNewKey("");
    setNewValue("");
    toast.success("Setting added");
    qc.invalidateQueries({ queryKey: ["admin-site-settings"] });
    qc.invalidateQueries({ queryKey: ["site-settings"] });
  };

  const deleteSetting = async (key: string) => {
    if (!window.confirm(`Delete ${key}?`)) return;
    const { error } = await supabase.from("site_settings").delete().eq("key", key);
    if (error) return toast.error(error.message);
    const next = { ...values };
    delete next[key];
    setValues(next);
    toast.success("Setting deleted");
    qc.invalidateQueries({ queryKey: ["admin-site-settings"] });
    qc.invalidateQueries({ queryKey: ["site-settings"] });
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
        <div className="font-semibold">Add custom setting</div>
        <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">
          <div>
            <Label>Key</Label>
            <Input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="support_url"
            />
          </div>
          <div>
            <Label>Value</Label>
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <Button onClick={addSetting} disabled={saving}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {settingKeys.map((key) => {
        const meta = settingMeta(key);
        return (
          <div key={key} className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div>
                <Label>{meta?.label ?? key.replaceAll("_", " ")}</Label>
                {!meta && <div className="text-[11px] text-muted-foreground font-mono">{key}</div>}
              </div>
              <Button size="sm" variant="outline" onClick={() => deleteSetting(key)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Input
              value={values[key] ?? ""}
              onChange={(e) => setValues({ ...values, [key]: e.target.value })}
              placeholder={meta?.placeholder ?? "Value"}
            />
          </div>
        );
      })}
      <div className="pt-2 sticky bottom-0 bg-background/95 backdrop-blur py-3">
        <Button onClick={save} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save all changes
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────── Certificate Templates ───────────────────────────

type TemplateRow = CertDesign & { id: string; name: string; is_default: boolean };

const PREVIEW_CTX = {
  name: "Ada Lovelace",
  course: "Introduction to AI & LLMs",
  date: "02 Jun 2026",
  role: "Lead Engineer",
  from: "01 Apr 2026",
  to: "02 Jun 2026",
  instructor: "Learnify AI",
  code: "LRN-PREVIEW-001",
  score: 18,
  total: 20,
  qrDataUrl: "",
};

function CertTemplatesManager() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<TemplateRow | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["admin-cert-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificate_templates")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as TemplateRow[];
    },
  });

  const newTemplate = () => {
    setEditing({ ...DEFAULT_DESIGN, id: "", name: "New template", is_default: false });
    setOpen(true);
  };

  const loadPresets = async () => {
    const presets = buildPresetTemplates();
    const { error } = await supabase.from("certificate_templates").insert(presets as any);
    if (error) return toast.error(error.message);
    toast.success(`${presets.length} preset templates added`);
    qc.invalidateQueries({ queryKey: ["admin-cert-templates"] });
  };

  const removeTemplate = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("certificate_templates").delete().eq("id", deleteId);
    if (error) return toast.error(error.message);
    toast.success("Template deleted");
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["admin-cert-templates"] });
  };

  // ── Export all templates as JSON ────────────────────────────────────────
  const exportTemplates = () => {
    const payload = {
      kind: "learnify-certificate-templates",
      version: 1,
      exported_at: new Date().toISOString(),
      palettes: COLOR_PALETTES,
      templates: templates.map(
        ({ id: _id, created_by: _cb, created_at: _ca, updated_at: _ua, ...rest }: any) => rest,
      ),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learnify-cert-templates-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${templates.length} template(s) exported`);
  };

  // ── Import templates from JSON ──────────────────────────────────────────
  const importTemplates = async (file: File) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const rows: any[] = Array.isArray(json)
        ? json
        : Array.isArray(json?.templates)
          ? json.templates
          : json?.name
            ? [json]
            : [];
      if (!rows.length) return toast.error("No templates found in file");
      const clean = rows.map((r) => {
        const { id, created_by, created_at, updated_at, is_default, ...rest } = r ?? {};
        return { ...rest, name: String(rest.name ?? "Imported template"), is_default: false };
      });
      const { error } = await supabase.from("certificate_templates").insert(clean as any);
      if (error) return toast.error(error.message);
      toast.success(`Imported ${clean.length} template(s)`);
      qc.invalidateQueries({ queryKey: ["admin-cert-templates"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Invalid JSON file");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        <input
          id="cert-import-file"
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importTemplates(f);
            e.target.value = "";
          }}
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById("cert-import-file")?.click()}
        >
          Import JSON
        </Button>
        <Button variant="outline" onClick={exportTemplates} disabled={!templates.length}>
          Export JSON
        </Button>
        <Button variant="outline" onClick={loadPresets}>
          Load preset templates
        </Button>
        <Button variant="outline" onClick={() => navigate({ to: "/admin/certificates" })}>
          <ShieldCheck className="h-4 w-4 mr-2" />
          Open Designer
        </Button>
        <Button onClick={newTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          New template
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : templates.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No templates yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {templates.map((t) => (
            <div key={t.id} className="rounded-xl border border-border/60 bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold truncate flex items-center gap-2">
                    {t.name}
                    {t.is_default && (
                      <span className="text-[10px] rounded-full bg-primary/10 text-primary px-2 py-0.5">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.font_family}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate({ to: "/admin/certificates" })}
                    title="Edit in Certificate Designer"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditing(t);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setDeleteId(t.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 rounded-md overflow-hidden border border-border/60">
                <div
                  style={{
                    transform: "scale(0.34)",
                    transformOrigin: "top left",
                    width: "294%",
                    height: "200px",
                  }}
                >
                  <CertificateRender design={t} ctx={PREVIEW_CTX} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TemplateDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        template={editing}
        onSaved={() => qc.invalidateQueries({ queryKey: ["admin-cert-templates"] })}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete template?</AlertDialogTitle>
            <AlertDialogDescription>
              Certificates already issued keep their saved design.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeTemplate}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function TemplateDialog({
  open,
  onOpenChange,
  template,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  template: TemplateRow | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<TemplateRow | null>(template);
  const [saving, setSaving] = useState(false);
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);

  useEffect(() => {
    setForm(template);
  }, [template]);

  if (!form) return null;
  const set = (patch: Partial<TemplateRow>) => setForm({ ...form, ...patch });

  const save = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    setSaving(true);
    const payload: any = {
      name: form.name.trim(),
      title_text: form.title_text,
      subtitle: form.subtitle,
      body_template: form.body_template,
      signatory_name: form.signatory_name,
      signatory_title: form.signatory_title,
      accent_color: form.accent_color,
      bg_color: form.bg_color,
      text_color: form.text_color,
      font_family: form.font_family,
      logo_url: form.logo_url || null,
      signature_url: form.signature_url || null,
      stamp_url: form.stamp_url || null,
      is_default: form.is_default,
      title_font: form.title_font || null,
      body_font: form.body_font || null,
      title_size: form.title_size ?? 1,
      name_size: form.name_size ?? 1,
      body_size: form.body_size ?? 1,
      border_style: form.border_style ?? "double",
      border_width: form.border_width ?? 10,
      corner_style: form.corner_style ?? "diagonal",
      background_pattern: form.background_pattern ?? "none",
      accent_color_2: form.accent_color_2 || null,
      layout: form.layout ?? "classic",
    };
    const { error } = form.id
      ? await supabase.from("certificate_templates").update(payload).eq("id", form.id)
      : await supabase.from("certificate_templates").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Template updated" : "Template created");
    onSaved();
    onOpenChange(false);
  };

  const exportSingle = () => {
    const { id: _id, ...rest } = form as any;
    const blob = new Blob(
      [
        JSON.stringify(
          { kind: "learnify-certificate-templates", version: 1, templates: [rest] },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(form.name || "template").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl w-[96vw] max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-3">
              <span>{form.id ? "Edit template" : "New template"}</span>
              <Button type="button" size="sm" variant="outline" onClick={exportSingle}>
                Export JSON
              </Button>
            </DialogTitle>
            <DialogDescription>
              Customize text, colors, fonts, borders and background. Live preview updates instantly.
            </DialogDescription>
          </DialogHeader>
          <div className="grid lg:grid-cols-5 gap-4">
            {/* Preview — full width on mobile, 3 cols on lg, sticky so it stays in view */}
            <div className="lg:col-span-3 lg:order-2 sticky top-0 lg:top-2 z-30 bg-background/95 backdrop-blur pb-2 lg:pb-0 mb-4 lg:mb-0">
              <div className="rounded-md border border-border/60 overflow-hidden shadow-sm">
                <div className="bg-muted/40 px-3 py-2 text-xs text-muted-foreground flex items-center justify-between">
                  <span>Live preview · A4 landscape</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px]"
                    onClick={() => setFullPreviewOpen(true)}
                  >
                    <Maximize2 className="h-3.5 w-3.5 mr-1" /> Full
                  </Button>
                </div>
                <div className="p-2 sm:p-3 bg-muted/20 flex justify-center">
                  <div
                    className="w-full"
                    style={{ maxWidth: "min(100%, calc((78vh - 120px) * 1.414))" }}
                  >
                    <CertificateRender key={JSON.stringify(form)} design={form} ctx={PREVIEW_CTX} />
                  </div>
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="lg:col-span-2 lg:order-1 space-y-3 pr-2">
              <div>
                <Label>Template name</Label>
                <Input value={form.name} onChange={(e) => set({ name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={form.title_text}
                    onChange={(e) => set({ title_text: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input
                    value={form.subtitle}
                    onChange={(e) => set({ subtitle: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>
                  Body (use {"{name}"} {"{course}"} {"{date}"} {"{role}"} {"{from}"} {"{to}"})
                </Label>
                <Textarea
                  rows={3}
                  value={form.body_template}
                  onChange={(e) => set({ body_template: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Signatory name</Label>
                  <Input
                    value={form.signatory_name}
                    onChange={(e) => set({ signatory_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Signatory title</Label>
                  <Input
                    value={form.signatory_title}
                    onChange={(e) => set({ signatory_title: e.target.value })}
                  />
                </div>
              </div>

              {/* Branding */}
              <div className="rounded-lg border border-dashed border-border/60 p-3 space-y-3 bg-muted/20">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Branding
                </div>
                <div>
                  <Label className="text-xs">Color palette</Label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    {COLOR_PALETTES.map((p) => (
                      <button
                        type="button"
                        key={p.name}
                        onClick={() =>
                          set({ accent_color: p.accent, bg_color: p.bg, text_color: p.text })
                        }
                        className="rounded-md border border-border/60 px-2 py-1.5 text-left hover:border-primary transition"
                        title={p.name}
                      >
                        <div className="flex gap-1 mb-1">
                          <span className="h-3 w-3 rounded-full" style={{ background: p.accent }} />
                          <span
                            className="h-3 w-3 rounded-full border"
                            style={{ background: p.bg }}
                          />
                          <span className="h-3 w-3 rounded-full" style={{ background: p.text }} />
                        </div>
                        <div className="text-[10px] leading-tight">{p.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <Label className="text-xs">Accent</Label>
                    <Input
                      type="color"
                      value={form.accent_color}
                      onChange={(e) => set({ accent_color: e.target.value })}
                      className="h-8 p-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Accent 2</Label>
                    <Input
                      type="color"
                      value={form.accent_color_2 ?? form.accent_color}
                      onChange={(e) => set({ accent_color_2: e.target.value })}
                      className="h-8 p-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Background</Label>
                    <Input
                      type="color"
                      value={form.bg_color}
                      onChange={(e) => set({ bg_color: e.target.value })}
                      className="h-8 p-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Text</Label>
                    <Input
                      type="color"
                      value={form.text_color}
                      onChange={(e) => set({ text_color: e.target.value })}
                      className="h-8 p-1"
                    />
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="rounded-lg border border-dashed border-border/60 p-3 space-y-3 bg-muted/20">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Typography
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Title font</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={form.title_font ?? form.font_family}
                      onChange={(e) => set({ title_font: e.target.value })}
                    >
                      {FONT_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Body font</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={form.body_font ?? form.font_family}
                      onChange={(e) =>
                        set({ body_font: e.target.value, font_family: e.target.value })
                      }
                    >
                      {FONT_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">
                      Title size ({(form.title_size ?? 1).toFixed(2)}×)
                    </Label>
                    <Input
                      type="range"
                      min={0.6}
                      max={1.6}
                      step={0.05}
                      value={form.title_size ?? 1}
                      onChange={(e) => set({ title_size: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">
                      Name size ({(form.name_size ?? 1).toFixed(2)}×)
                    </Label>
                    <Input
                      type="range"
                      min={0.6}
                      max={1.8}
                      step={0.05}
                      value={form.name_size ?? 1}
                      onChange={(e) => set({ name_size: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">
                      Body size ({(form.body_size ?? 1).toFixed(2)}×)
                    </Label>
                    <Input
                      type="range"
                      min={0.7}
                      max={1.4}
                      step={0.05}
                      value={form.body_size ?? 1}
                      onChange={(e) => set({ body_size: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* Layout & decoration */}
              <div className="rounded-lg border border-dashed border-border/60 p-3 space-y-3 bg-muted/20">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Layout & decoration
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Layout</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize"
                      value={form.layout ?? "classic"}
                      onChange={(e) => set({ layout: e.target.value })}
                    >
                      {LAYOUTS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Background pattern</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize"
                      value={form.background_pattern ?? "none"}
                      onChange={(e) => set({ background_pattern: e.target.value })}
                    >
                      {BACKGROUND_PATTERNS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Border style</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize"
                      value={form.border_style ?? "double"}
                      onChange={(e) => set({ border_style: e.target.value })}
                    >
                      {BORDER_STYLES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Corners</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize"
                      value={form.corner_style ?? "diagonal"}
                      onChange={(e) => set({ corner_style: e.target.value })}
                    >
                      {CORNER_STYLES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Border width ({form.border_width ?? 10}px)</Label>
                  <Input
                    type="range"
                    min={0}
                    max={24}
                    step={1}
                    value={form.border_width ?? 10}
                    onChange={(e) => set({ border_width: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Assets */}
              <div className="rounded-lg border border-dashed border-border/60 p-3 space-y-3 bg-muted/20">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Assets
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Logo URL</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 text-[11px]"
                      onClick={() => set({ logo_url: SITE_LOGO_URL })}
                    >
                      Use site logo
                    </Button>
                  </div>
                  <Input
                    value={form.logo_url ?? ""}
                    onChange={(e) => set({ logo_url: e.target.value })}
                    placeholder="https://..."
                  />
                  {form.logo_url && (
                    <img
                      src={form.logo_url}
                      alt="Logo preview"
                      className="h-10 object-contain bg-white rounded border p-1"
                    />
                  )}
                </div>
                <div>
                  <Label className="text-xs">Signature image URL</Label>
                  <Input
                    value={form.signature_url ?? ""}
                    onChange={(e) => set({ signature_url: e.target.value })}
                    placeholder="https://...signature.png"
                  />
                </div>
                <div>
                  <Label className="text-xs">Stamp image URL</Label>
                  <Input
                    value={form.stamp_url ?? ""}
                    onChange={(e) => set({ stamp_url: e.target.value })}
                    placeholder="https://...stamp.png"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Switch checked={form.is_default} onCheckedChange={(v) => set({ is_default: v })} />
                <Label className="cursor-pointer">Default template</Label>
              </div>
            </div>
          </div>
          <DialogFooter className="sticky bottom-0 -mx-6 -mb-6 px-6 py-4 bg-background/95 backdrop-blur border-t z-40 mt-6 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CertificateFullPreviewDialog
        open={fullPreviewOpen}
        onOpenChange={setFullPreviewOpen}
        design={form}
        ctx={PREVIEW_CTX}
        title={form.name || "Certificate preview"}
      />
    </>
  );
}

function buildPresetTemplates() {
  return [
    {
      name: "Learnify Official (Navy + Gold)",
      title_text: "Certificate of Completion",
      subtitle: "This is proudly presented to",
      body_template:
        "for successfully completing the {course} program on {date}. This achievement reflects dedication, curiosity and rigor.",
      signatory_name: "Learnify AI",
      signatory_title: "Director of Learning",
      accent_color: "#c9a84c",
      bg_color: "#fdfbf5",
      text_color: "#0f1b3d",
      font_family: "Playfair Display",
      logo_url: SITE_LOGO_URL,
      signature_url: null,
      stamp_url: null,
      is_default: true,
    },
    {
      name: "Executive Black & Gold",
      title_text: "Certificate of Excellence",
      subtitle: "Awarded to",
      body_template: "in recognition of outstanding performance in {course}, completed on {date}.",
      signatory_name: "Learnify AI",
      signatory_title: "Chief Academic Officer",
      accent_color: "#d4af37",
      bg_color: "#0d0d0d",
      text_color: "#f5f0e0",
      font_family: "Cinzel",
      logo_url: SITE_LOGO_URL,
      signature_url: null,
      stamp_url: null,
      is_default: false,
    },
    {
      name: "Modern Indigo",
      title_text: "Certificate of Achievement",
      subtitle: "This certifies that",
      body_template:
        "has successfully completed the {course} curriculum on {date} with distinction.",
      signatory_name: "Learnify AI",
      signatory_title: "Head of Programs",
      accent_color: "#6366f1",
      bg_color: "#ffffff",
      text_color: "#1e1b4b",
      font_family: "Montserrat",
      logo_url: SITE_LOGO_URL,
      signature_url: null,
      stamp_url: null,
      is_default: false,
    },
    {
      name: "Editorial Cream",
      title_text: "Certificate of Completion",
      subtitle: "Presented to",
      body_template: "for completing {course} on {date} as part of the Learnify AI learning track.",
      signatory_name: "Learnify AI",
      signatory_title: "Director of Learning",
      accent_color: "#8b6f3d",
      bg_color: "#f7f1e3",
      text_color: "#2c2416",
      font_family: "Cormorant Garamond",
      logo_url: SITE_LOGO_URL,
      signature_url: null,
      stamp_url: null,
      is_default: false,
    },
    {
      name: "Calligraphic Blush",
      title_text: "Certificate of Participation",
      subtitle: "Awarded with appreciation to",
      body_template: "for active participation and completion of {course} on {date}.",
      signatory_name: "Learnify AI",
      signatory_title: "Program Lead",
      accent_color: "#b76e79",
      bg_color: "#fff8f5",
      text_color: "#3a1d24",
      font_family: "Great Vibes",
      logo_url: SITE_LOGO_URL,
      signature_url: null,
      stamp_url: null,
      is_default: false,
    },
    ...EXTRA_PRESETS,
  ];
}

const COLOR_PALETTES: { name: string; accent: string; bg: string; text: string }[] = [
  { name: "Navy & Gold", accent: "#c9a84c", bg: "#fdfbf5", text: "#0f1b3d" },
  { name: "Black & Gold", accent: "#d4af37", bg: "#0d0d0d", text: "#f5f0e0" },
  { name: "Indigo Modern", accent: "#6366f1", bg: "#ffffff", text: "#1e1b4b" },
  { name: "Emerald Prestige", accent: "#c9a84c", bg: "#f8faf7", text: "#064e3b" },
  { name: "Burgundy Classic", accent: "#b08d57", bg: "#fbf6ef", text: "#581c1c" },
  { name: "Slate Minimal", accent: "#64748b", bg: "#ffffff", text: "#0f172a" },
  { name: "Rose & Charcoal", accent: "#b76e79", bg: "#fff8f5", text: "#1f1f1f" },
  { name: "Teal Editorial", accent: "#0d9488", bg: "#f0fdfa", text: "#134e4a" },
  { name: "Royal Purple", accent: "#a855f7", bg: "#faf5ff", text: "#3b0764" },
  { name: "Sunset Amber", accent: "#f59e0b", bg: "#fffbeb", text: "#7c2d12" },
  { name: "Forest & Cream", accent: "#4a6741", bg: "#f7f4ec", text: "#1c2e1a" },
  { name: "Steel Blue", accent: "#1e40af", bg: "#f1f5f9", text: "#0c1d4f" },
];

const EXTRA_PRESETS = [
  {
    name: "Emerald Prestige",
    title_text: "Certificate of Achievement",
    subtitle: "Awarded to",
    body_template: "in recognition of completing {course} on {date} with academic distinction.",
    signatory_name: "Learnify AI",
    signatory_title: "Dean of Programs",
    accent_color: "#c9a84c",
    bg_color: "#f8faf7",
    text_color: "#064e3b",
    font_family: "Playfair Display",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Burgundy Classic",
    title_text: "Certificate of Completion",
    subtitle: "Proudly presented to",
    body_template: "for the successful completion of {course} on {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Registrar",
    accent_color: "#b08d57",
    bg_color: "#fbf6ef",
    text_color: "#581c1c",
    font_family: "Cormorant Garamond",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Minimal Slate",
    title_text: "Certificate",
    subtitle: "This certifies that",
    body_template: "completed {course} on {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Program Director",
    accent_color: "#64748b",
    bg_color: "#ffffff",
    text_color: "#0f172a",
    font_family: "Inter",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Teal Editorial",
    title_text: "Certificate of Mastery",
    subtitle: "Awarded to",
    body_template: "for demonstrated mastery of {course} as of {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Head of Curriculum",
    accent_color: "#0d9488",
    bg_color: "#f0fdfa",
    text_color: "#134e4a",
    font_family: "Montserrat",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Royal Purple",
    title_text: "Certificate of Honour",
    subtitle: "Presented with distinction to",
    body_template: "for outstanding completion of {course} on {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Academic Council",
    accent_color: "#a855f7",
    bg_color: "#faf5ff",
    text_color: "#3b0764",
    font_family: "Cinzel",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Sunset Amber",
    title_text: "Certificate of Participation",
    subtitle: "With appreciation to",
    body_template: "for participating in {course} on {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Community Lead",
    accent_color: "#f59e0b",
    bg_color: "#fffbeb",
    text_color: "#7c2d12",
    font_family: "Montserrat",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Forest & Cream",
    title_text: "Certificate of Completion",
    subtitle: "Granted to",
    body_template: "for completing the {course} program on {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Director of Learning",
    accent_color: "#4a6741",
    bg_color: "#f7f4ec",
    text_color: "#1c2e1a",
    font_family: "Cormorant Garamond",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Steel Blue Corporate",
    title_text: "Professional Certificate",
    subtitle: "This is to certify that",
    body_template: "has completed the professional curriculum of {course} on {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Director, Professional Programs",
    accent_color: "#1e40af",
    bg_color: "#f1f5f9",
    text_color: "#0c1d4f",
    font_family: "Inter",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Rose Charcoal",
    title_text: "Certificate of Recognition",
    subtitle: "Awarded to",
    body_template: "for excellence demonstrated in {course} on {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Faculty Lead",
    accent_color: "#b76e79",
    bg_color: "#fff8f5",
    text_color: "#1f1f1f",
    font_family: "Playfair Display",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Onyx Calligraphy",
    title_text: "Certificate of Excellence",
    subtitle: "Presented to",
    body_template: "for exemplary work in {course}, completed {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Chancellor",
    accent_color: "#caa472",
    bg_color: "#111111",
    text_color: "#f4ebd6",
    font_family: "Great Vibes",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Ivory Academic",
    title_text: "Diploma",
    subtitle: "Conferred upon",
    body_template: "having fulfilled all requirements of {course} on {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Provost",
    accent_color: "#7a5e2b",
    bg_color: "#fbf7ec",
    text_color: "#2b210f",
    font_family: "Cinzel",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Skyline Tech",
    title_text: "Certificate of Skill",
    subtitle: "Issued to",
    body_template: "for completing the {course} technical track on {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Head of Engineering Education",
    accent_color: "#0ea5e9",
    bg_color: "#f0f9ff",
    text_color: "#0c4a6e",
    font_family: "Inter",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
];

// IssueCertificate moved to src/components/admin/IssueCertificate.tsx (lazy-loaded).

// ─────────────────────────── FAQs ───────────────────────────

type FaqRow = {
  id: string;
  question: string;
  answer: string;
  category: string;
  order_index: number;
  published: boolean;
};

function FaqsManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<FaqRow | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("category")
        .order("order_index");
      if (error) throw error;
      return (data ?? []) as FaqRow[];
    },
  });

  const newFaq = () => {
    setEditing({
      id: "",
      question: "",
      answer: "",
      category: "General",
      order_index: (faqs.length + 1) * 10,
      published: true,
    });
    setOpen(true);
  };

  const remove = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("faqs").delete().eq("id", deleteId);
    if (error) return toast.error(error.message);
    toast.success("FAQ deleted");
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["admin-faqs"] });
    qc.invalidateQueries({ queryKey: ["public-faqs"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={newFaq}>
          <Plus className="h-4 w-4 mr-2" />
          New FAQ
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : faqs.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No FAQs yet.</p>
      ) : (
        <div className="space-y-2">
          {faqs.map((f) => (
            <div
              key={f.id}
              className="rounded-xl border border-border/60 bg-card p-4 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="font-medium truncate flex items-center gap-2">
                  {f.question}
                  <span className="text-[10px] rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                    {f.category}
                  </span>
                  {!f.published && (
                    <span className="text-[10px] rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground truncate mt-1">{f.answer}</div>
              </div>
              <div className="flex gap-2 shrink-0">
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
                <Button size="sm" variant="outline" onClick={() => setDeleteId(f.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FaqDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        faq={editing}
        onSaved={() => {
          qc.invalidateQueries({ queryKey: ["admin-faqs"] });
          qc.invalidateQueries({ queryKey: ["public-faqs"] });
        }}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function FaqDialog({
  open,
  onOpenChange,
  faq,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  faq: FaqRow | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FaqRow | null>(faq);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setForm(faq);
  }, [faq]);
  if (!form) return null;

  const save = async () => {
    if (!form.question.trim() || !form.answer.trim())
      return toast.error("Question and answer are required");
    setSaving(true);
    const payload = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      category: form.category.trim() || "General",
      order_index: form.order_index,
      published: form.published,
    };
    const { error } = form.id
      ? await supabase.from("faqs").update(payload).eq("id", form.id)
      : await supabase.from("faqs").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "FAQ updated" : "FAQ created");
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit FAQ" : "New FAQ"}</DialogTitle>
          <DialogDescription>Shown publicly on /faq.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Question</Label>
            <Input
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
            />
          </div>
          <div>
            <Label>Answer</Label>
            <Textarea
              rows={4}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 items-end">
            <div>
              <Label>Category</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div>
              <Label>Order</Label>
              <Input
                type="number"
                value={form.order_index}
                onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch
                checked={form.published}
                onCheckedChange={(v) => setForm({ ...form, published: v })}
              />
              <Label className="cursor-pointer">Published</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────── Pages (Terms, Refund, Privacy) ───────────────────────────

const PAGE_KEYS = [
  { key: "page_terms", label: "Terms of Service", slug: "/terms" },
  { key: "page_refund", label: "Refund Policy", slug: "/refund-policy" },
  { key: "page_privacy", label: "Privacy Policy", slug: "/privacy" },
];

function PagesManager() {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-page-content"],
    queryFn: async () => {
      const keys = PAGE_KEYS.map((p) => p.key);
      const { data, error } = await supabase
        .from("site_settings")
        .select("key,value")
        .in("key", keys);
      if (error) throw error;
      const m: Record<string, string> = {};
      (data ?? []).forEach((r: any) => {
        m[r.key] = r.value ?? "";
      });
      keys.forEach((k) => {
        if (!(k in m)) m[k] = "";
      });
      return m;
    },
  });

  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const save = async () => {
    setSaving(true);
    const rows = PAGE_KEYS.map((p) => ({ key: p.key, value: values[p.key] ?? "" }));
    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Page content saved");
    qc.invalidateQueries({ queryKey: ["admin-page-content"] });
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-5 max-w-3xl">
      <p className="text-sm text-muted-foreground">
        Edit the HTML content for each legal page. These are rendered on the public site.
      </p>
      {PAGE_KEYS.map((page) => (
        <div key={page.key} className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">{page.label}</Label>
            <span className="text-xs text-muted-foreground font-mono">{page.slug}</span>
          </div>
          <Textarea
            rows={12}
            value={values[page.key] ?? ""}
            onChange={(e) => setValues({ ...values, [page.key]: e.target.value })}
            placeholder="Paste HTML content here..."
            className="font-mono text-xs"
          />
        </div>
      ))}
      <div className="pt-2 sticky bottom-0 bg-background/95 backdrop-blur py-3">
        <Button onClick={save} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save page content
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────── Roadmap Manager ───────────────────────────

type RoadmapItem = {
  id: string;
  status: "done" | "progress" | "planned";
  title: string;
  desc: string;
};

const ROADMAP_KEY = "roadmap_items";
const DEFAULT_ROADMAP: RoadmapItem[] = [
  {
    id: "1",
    status: "done",
    title: "AI Tutor & Doubt Solver",
    desc: "Multi-model chat with course context.",
  },
  {
    id: "2",
    status: "done",
    title: "Courses, Modules & Lessons",
    desc: "Full course builder with assignments and MCQ tests.",
  },
  {
    id: "3",
    status: "done",
    title: "Wallet & Cart Checkout",
    desc: "Top-up, paid course enrollment, transaction history.",
  },
  {
    id: "4",
    status: "done",
    title: "Certificates",
    desc: "Issue, design, PDF download, QR verify, email delivery.",
  },
  {
    id: "5",
    status: "progress",
    title: "Cohort Live Sessions",
    desc: "Scheduled live rooms with recordings.",
  },
  {
    id: "6",
    status: "progress",
    title: "Creator Payouts",
    desc: "Automatic monthly creator settlements.",
  },
  { id: "7", status: "planned", title: "Mobile App", desc: "iOS + Android with offline lessons." },
  {
    id: "8",
    status: "planned",
    title: "Skill Graph & Career AI",
    desc: "Personalized career paths with skill gap analysis.",
  },
];

function RoadmapManager() {
  const qc = useQueryClient();
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<RoadmapItem | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-roadmap"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", ROADMAP_KEY)
        .single();
      if (data?.value) {
        try {
          return JSON.parse(data.value as string) as RoadmapItem[];
        } catch {
          return DEFAULT_ROADMAP;
        }
      }
      return DEFAULT_ROADMAP;
    },
  });

  useEffect(() => {
    if (data) setItems(data);
  }, [data]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: ROADMAP_KEY, value: JSON.stringify(items) }, { onConflict: "key" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Roadmap saved");
    qc.invalidateQueries({ queryKey: ["admin-roadmap"] });
  };

  const addItem = () => {
    const newItem: RoadmapItem = {
      id: Date.now().toString(),
      status: "planned",
      title: "",
      desc: "",
    };
    setItems([...items, newItem]);
    setEditing(newItem);
  };

  const deleteItem = (id: string) => {
    if (!window.confirm("Delete this roadmap item?")) return;
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, updates: Partial<RoadmapItem>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Manage the public roadmap shown at /roadmap. Add, edit, or reorder items.
        </p>
        <Button onClick={addItem}>
          <Plus className="h-4 w-4 mr-2" /> Add item
        </Button>
      </div>

      <DragDropContext
        onDragEnd={(result: DropResult) => {
          if (!result.destination) return;
          const reordered = Array.from(items);
          const [moved] = reordered.splice(result.source.index, 1);
          reordered.splice(result.destination.index, 0, moved);
          setItems(reordered);
        }}
      >
        <Droppable droppableId="roadmap">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
              {items.map((item, idx) => (
                <Draggable key={item.id} draggableId={item.id} index={idx}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`rounded-xl border bg-card p-4 transition-shadow ${snapshot.isDragging ? "shadow-lg border-primary/40" : "border-border/60"}`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <button
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-0.5"
                          >
                            <GripVertical className="h-4 w-4" />
                          </button>
                          <select
                            value={item.status}
                            onChange={(e) =>
                              updateItem(item.id, {
                                status: e.target.value as RoadmapItem["status"],
                              })
                            }
                            className="text-xs border rounded px-1.5 py-0.5 bg-background"
                          >
                            <option value="done">Shipped</option>
                            <option value="progress">In progress</option>
                            <option value="planned">Planned</option>
                          </select>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditing(editing?.id === item.id ? null : item)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      {editing?.id === item.id ? (
                        <div className="space-y-2">
                          <Input
                            value={item.title}
                            onChange={(e) => updateItem(item.id, { title: e.target.value })}
                            placeholder="Title"
                          />
                          <Input
                            value={item.desc}
                            onChange={(e) => updateItem(item.id, { desc: e.target.value })}
                            placeholder="Description"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="font-semibold text-sm">{item.title || "Untitled"}</div>
                          {item.desc && (
                            <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {items.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No roadmap items yet. Click "Add item" to start.
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="pt-2 sticky bottom-0 bg-background/95 backdrop-blur py-3">
        <Button onClick={save} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save roadmap
        </Button>
      </div>
    </div>
  );
}

const COUPON_KEY = "coupons";
const DEFAULT_COUPONS = [
  { code: "WELCOME10", type: "percent", value: 10, label: "10% off", active: true },
  { code: "LEARN20", type: "percent", value: 20, label: "20% off", active: true },
  { code: "STUDENT25", type: "percent", value: 25, label: "25% student discount", active: true },
];

function CouponManager() {
  const qc = useQueryClient();
  const [items, setItems] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", COUPON_KEY)
        .maybeSingle();
      if (data?.value) {
        try {
          return JSON.parse(data.value as string);
        } catch {
          return DEFAULT_COUPONS;
        }
      }
      return DEFAULT_COUPONS;
    },
  });

  useEffect(() => {
    if (data) setItems(data);
  }, [data]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: COUPON_KEY, value: JSON.stringify(items) }, { onConflict: "key" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Coupons saved");
    qc.invalidateQueries({ queryKey: ["admin-coupons"] });
  };

  const addItem = () => {
    setItems([...items, { code: "", type: "percent", value: 10, label: "", active: true }]);
  };

  const deleteItem = (i: number) => {
    if (!window.confirm("Delete this coupon?")) return;
    setItems(items.filter((_, idx) => idx !== i));
  };

  const updateItem = (i: number, updates: any) => {
    setItems(items.map((item, idx) => (idx === i ? { ...item, ...updates } : item)));
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Manage coupon codes. Users can apply these at checkout for discounts.
        </p>
        <Button onClick={addItem}>
          <Plus className="h-4 w-4 mr-2" /> Add coupon
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={item.code}
                  onChange={(e) => updateItem(i, { code: e.target.value.toUpperCase() })}
                  placeholder="COUPON_CODE"
                  className="w-36 font-mono text-xs uppercase"
                />
                <select
                  value={item.type}
                  onChange={(e) => updateItem(i, { type: e.target.value })}
                  className="text-xs border rounded px-1.5 py-0.5 bg-background"
                >
                  <option value="percent">%</option>
                  <option value="flat">₹</option>
                </select>
                <Input
                  type="number"
                  value={item.value}
                  onChange={(e) => updateItem(i, { value: Number(e.target.value) })}
                  className="w-20 text-xs"
                />
                <Input
                  value={item.label}
                  onChange={(e) => updateItem(i, { label: e.target.value })}
                  placeholder="Label (e.g. 10% off)"
                  className="flex-1 text-xs"
                />
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={item.active !== false}
                    onChange={(e) => updateItem(i, { active: e.target.checked })}
                  />
                  Active
                </label>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive"
                onClick={() => deleteItem(i)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No coupons yet. Click "Add coupon" to start.
          </div>
        )}
      </div>

      <div className="pt-2 sticky bottom-0 bg-background/95 backdrop-blur py-3">
        <Button onClick={save} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save coupons
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────── Community Groups (Cohorts) ───────────────────────────

type CohortRow = {
  id: string;
  title: string;
  description: string | null;
  kind: string;
  starts_at: string;
  capacity: number | null;
  status: string;
  group_link: string | null;
  creator_id: string;
};

function CohortsManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<CohortRow | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: cohorts = [], isLoading } = useQuery({
    queryKey: ["admin-cohorts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cohorts")
        .select("id, title, description, kind, starts_at, capacity, status, group_link, creator_id")
        .order("starts_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data ?? []) as unknown as CohortRow[];
    },
  });

  const newCohort = () => {
    setEditing({
      id: "",
      title: "",
      description: "",
      kind: "study_group",
      starts_at: new Date().toISOString().slice(0, 16),
      capacity: 50,
      status: "draft",
      group_link: "",
      creator_id: "",
    });
    setOpen(true);
  };

  const removeCohort = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("cohorts").delete().eq("id", deleteId);
    if (error) return toast.error(error.message);
    toast.success("Cohort deleted");
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["admin-cohorts"] });
    qc.invalidateQueries({ queryKey: ["cohorts"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={newCohort}>
          <Plus className="h-4 w-4 mr-2" />
          New group
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : cohorts.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No community groups yet.</p>
      ) : (
        <div className="space-y-2">
          {cohorts.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-border/60 bg-card p-4 flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate flex items-center gap-2">
                  {c.title}
                  <Badge
                    variant={c.status === "live" ? "default" : "outline"}
                    className="text-[10px] capitalize"
                  >
                    {c.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground capitalize">
                    {c.kind?.replace("_", " ")}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-3">
                  <span>{c.starts_at ? format(new Date(c.starts_at), "PP") : "—"}</span>
                  {c.capacity && <span>· {c.capacity} seats</span>}
                  {c.group_link && <span>· 🔗 link set</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(c);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDeleteId(c.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CohortDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        cohort={editing}
        onSaved={() => {
          qc.invalidateQueries({ queryKey: ["admin-cohorts"] });
          qc.invalidateQueries({ queryKey: ["cohorts"] });
        }}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this group?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the cohort and associated member data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeCohort}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CohortDialog({
  open,
  onOpenChange,
  cohort,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  cohort: CohortRow | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<CohortRow | null>(cohort);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(cohort);
  }, [cohort]);

  if (!form) return null;

  const save = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const payload: Record<string, any> = {
      title: form.title.trim(),
      description: form.description?.trim() || null,
      kind: form.kind,
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
      capacity: form.capacity || null,
      status: form.status,
      group_link: form.group_link?.trim() || null,
    };
    const { error } = form.id
      ? await (supabase as any).from("cohorts").update(payload).eq("id", form.id)
      : await (supabase as any)
          .from("cohorts")
          .insert({ ...payload, creator_id: form.creator_id || undefined });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Group updated" : "Group created");
    onSaved();
    onOpenChange(false);
  };

  const localStarts = (() => {
    try {
      return format(new Date(form.starts_at), "yyyy-MM-dd'T'HH:mm");
    } catch {
      return "";
    }
  })();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit group" : "New group"}</DialogTitle>
          <DialogDescription>
            Manage community groups, study groups, and office hours.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Kind</Label>
              <select
                value={form.kind}
                onChange={(e) => setForm({ ...form, kind: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="cohort">Live cohort</option>
                <option value="study_group">Study group</option>
                <option value="office_hours">Office hours</option>
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="live">Live</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Start date</Label>
              <Input
                type="datetime-local"
                value={localStarts}
                onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
              />
            </div>
            <div>
              <Label>Capacity</Label>
              <Input
                type="number"
                value={form.capacity ?? ""}
                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) || null })}
              />
            </div>
          </div>
          <div>
            <Label>Group chat link (WhatsApp / Discord / Telegram)</Label>
            <Input
              value={form.group_link ?? ""}
              onChange={(e) => setForm({ ...form, group_link: e.target.value })}
              placeholder="https://chat.whatsapp.com/... or https://discord.gg/..."
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              This link will be shown on the dashboard so members can join the group chat.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
