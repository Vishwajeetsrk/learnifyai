import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AppShell } from "./AppShell-BXcQmjDj.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { I as Input } from "./input-BHvIASyb.mjs";
import { L as Label } from "./label-Dmhuxdmf.mjs";
import { T as Textarea } from "./textarea-7FPcqnpF.mjs";
import { D as Dialog, f as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter } from "./dialog-CV-3vits.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CxVLEfDB.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-CCbL2pbx.mjs";
import { aa as Plus, L as LoaderCircle, k as Sparkles, q as Calendar, U as Users } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./ThemeToggle-DNuVEMie.mjs";
import "./learnify-logo-CyXPmSny.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./client.server-BbcUHF3e.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/zod.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/radix-ui__react-tabs.mjs";
const KIND_LABEL = {
  cohort: "Live cohort",
  office_hours: "Office hours",
  study_group: "Study group"
};
function CohortsPage() {
  const {
    user,
    hasRole
  } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const isCreator = hasRole("creator") || hasRole("super_admin") || hasRole("admin");
  const [open, setOpen] = reactExports.useState(false);
  const cohortsQuery = useQuery({
    queryKey: ["cohorts"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("cohorts").select("id, title, description, kind, starts_at, ends_at, capacity, status, creator_id, course_id").order("starts_at", {
        ascending: true
      }).limit(100);
      if (error) throw error;
      return data ?? [];
    }
  });
  const membersQuery = useQuery({
    enabled: !!user,
    queryKey: ["my-cohorts", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("cohort_members").select("cohort_id").eq("user_id", user.id);
      if (error) throw error;
      return new Set((data ?? []).map((m) => m.cohort_id));
    }
  });
  const countsQuery = useQuery({
    queryKey: ["cohort-counts", (cohortsQuery.data ?? []).map((c) => c.id).join(",")],
    enabled: !!cohortsQuery.data,
    queryFn: async () => {
      const ids = (cohortsQuery.data ?? []).map((c) => c.id);
      if (!ids.length) return /* @__PURE__ */ new Map();
      const {
        data
      } = await supabase.from("cohort_members").select("cohort_id").in("cohort_id", ids);
      const m = /* @__PURE__ */ new Map();
      for (const r of data ?? []) m.set(r.cohort_id, (m.get(r.cohort_id) ?? 0) + 1);
      return m;
    }
  });
  async function joinCohort(id) {
    if (!user) return navigate({
      to: "/login"
    });
    const {
      error
    } = await supabase.from("cohort_members").insert({
      cohort_id: id,
      user_id: user.id
    });
    if (error) return toast.error(error.message);
    toast.success("Joined");
    qc.invalidateQueries({
      queryKey: ["my-cohorts"]
    });
    qc.invalidateQueries({
      queryKey: ["cohort-counts"]
    });
  }
  async function leaveCohort(id) {
    if (!user) return;
    const {
      error
    } = await supabase.from("cohort_members").delete().eq("cohort_id", id).eq("user_id", user.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({
      queryKey: ["my-cohorts"]
    });
    qc.invalidateQueries({
      queryKey: ["cohort-counts"]
    });
  }
  const cohorts = cohortsQuery.data ?? [];
  const filterBy = (kind) => cohorts.filter((c) => c.kind === kind);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 sm:px-6 lg:px-10 py-8 max-w-6xl", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap items-end justify-between gap-4 mb-8", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs uppercase tracking-widest text-primary font-medium", children: "Community" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 109,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "mt-1 font-display text-3xl font-semibold tracking-tight", children: "Cohorts, office hours & study groups" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 112,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1", children: "Learn together, ship faster." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 115,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
        lineNumber: 108,
        columnNumber: 11
      }, this),
      isCreator && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
            lineNumber: 120,
            columnNumber: 19
          }, this),
          " Create cohort"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 119,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 118,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreateCohortDialog, { onCreated: () => {
          setOpen(false);
          qc.invalidateQueries({
            queryKey: ["cohorts"]
          });
        } }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 123,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
        lineNumber: 117,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
      lineNumber: 107,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Tabs, { defaultValue: "all", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsList, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "all", children: "All" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 134,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "cohort", children: "Live cohorts" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 135,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "office_hours", children: "Office hours" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 136,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "study_group", children: "Study groups" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 137,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
        lineNumber: 133,
        columnNumber: 11
      }, this),
      ["all", "cohort", "office_hours", "study_group"].map((k) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsContent, { value: k, className: "mt-6", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CohortList, { cohorts: k === "all" ? cohorts : filterBy(k), loading: cohortsQuery.isLoading, joined: membersQuery.data ?? /* @__PURE__ */ new Set(), counts: countsQuery.data ?? /* @__PURE__ */ new Map(), onJoin: joinCohort, onLeave: leaveCohort }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
        lineNumber: 140,
        columnNumber: 15
      }, this) }, k, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
        lineNumber: 139,
        columnNumber: 70
      }, this))
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
      lineNumber: 132,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
    lineNumber: 106,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
    lineNumber: 105,
    columnNumber: 10
  }, this);
}
function CohortList({
  cohorts,
  loading,
  joined,
  counts,
  onJoin,
  onLeave
}) {
  if (loading) return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-20 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
    lineNumber: 162,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
    lineNumber: 161,
    columnNumber: 23
  }, this);
  if (cohorts.length === 0) return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card p-12 text-center text-sm text-muted-foreground", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
      lineNumber: 165,
      columnNumber: 9
    }, this),
    "Nothing scheduled yet. Be the first to host!"
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
    lineNumber: 164,
    columnNumber: 36
  }, this);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: cohorts.map((c) => {
    const isJoined = joined.has(c.id);
    const memberCount = counts.get(c.id) ?? 0;
    const isFull = memberCount >= c.capacity;
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card p-5 shadow-card hover:shadow-lg transition", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", className: "text-[10px] mb-2", children: KIND_LABEL[c.kind] ?? c.kind }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
            lineNumber: 176,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/cohorts/$id", params: {
            id: c.id
          }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold leading-snug hover:text-primary", children: c.title }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
            lineNumber: 182,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
            lineNumber: 179,
            columnNumber: 17
          }, this),
          c.description && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-2", children: c.description }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
            lineNumber: 186,
            columnNumber: 35
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 175,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: c.status === "live" ? "default" : "outline", className: "text-[10px] capitalize shrink-0", children: c.status }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 188,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
        lineNumber: 174,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Calendar, { className: "h-3 w-3" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
            lineNumber: 194,
            columnNumber: 17
          }, this),
          " ",
          format(new Date(c.starts_at), "dd MMM, HH:mm")
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 193,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Users, { className: "h-3 w-3" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
            lineNumber: 197,
            columnNumber: 17
          }, this),
          " ",
          memberCount,
          "/",
          c.capacity
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 196,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
        lineNumber: 192,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-4 flex gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, variant: "outline", size: "sm", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/cohorts/$id", params: {
          id: c.id
        }, children: "Details" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 202,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 201,
          columnNumber: 15
        }, this),
        isJoined ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "secondary", onClick: () => onLeave(c.id), children: "Leave" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 208,
          columnNumber: 27
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", onClick: () => onJoin(c.id), disabled: isFull, children: isFull ? "Full" : "Join" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 210,
          columnNumber: 29
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
        lineNumber: 200,
        columnNumber: 13
      }, this)
    ] }, c.id, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
      lineNumber: 173,
      columnNumber: 14
    }, this);
  }) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
    lineNumber: 168,
    columnNumber: 10
  }, this);
}
function CreateCohortDialog({
  onCreated
}) {
  const {
    user
  } = useAuth();
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [kind, setKind] = reactExports.useState("cohort");
  const [startsAt, setStartsAt] = reactExports.useState(() => new Date(Date.now() + 864e5).toISOString().slice(0, 16));
  const [capacity, setCapacity] = reactExports.useState("50");
  const [meetingUrl, setMeetingUrl] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  async function submit() {
    if (!user) return;
    if (!title.trim()) return toast.error("Title required");
    setSaving(true);
    const {
      error
    } = await supabase.from("cohorts").insert({
      creator_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      kind,
      starts_at: new Date(startsAt).toISOString(),
      capacity: Math.max(1, Number(capacity) || 50),
      meeting_url: meetingUrl.trim() || null
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Cohort created");
    onCreated();
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { children: "Create cohort" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
      lineNumber: 255,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
      lineNumber: 254,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Title" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 259,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: title, onChange: (e) => setTitle(e.target.value), maxLength: 120 }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 260,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
        lineNumber: 258,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Description" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 263,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Textarea, { value: description, onChange: (e) => setDescription(e.target.value), rows: 3, maxLength: 500 }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 264,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
        lineNumber: 262,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Type" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
            lineNumber: 268,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Select, { value: kind, onValueChange: setKind, children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectTrigger, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectValue, {}, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
              lineNumber: 271,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
              lineNumber: 270,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectContent, { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectItem, { value: "cohort", children: "Live cohort" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
                lineNumber: 274,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectItem, { value: "office_hours", children: "Office hours" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
                lineNumber: 275,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectItem, { value: "study_group", children: "Study group" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
                lineNumber: 276,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
              lineNumber: 273,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
            lineNumber: 269,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 267,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Capacity" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
            lineNumber: 281,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "number", min: 1, max: 1e3, value: capacity, onChange: (e) => setCapacity(e.target.value) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
            lineNumber: 282,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 280,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
        lineNumber: 266,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Starts at" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 286,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "datetime-local", value: startsAt, onChange: (e) => setStartsAt(e.target.value) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 287,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
        lineNumber: 285,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Meeting URL (Zoom/Meet)" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 290,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: meetingUrl, onChange: (e) => setMeetingUrl(e.target.value), placeholder: "https://" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
          lineNumber: 291,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
        lineNumber: 289,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
      lineNumber: 257,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: submit, disabled: saving, children: [
      saving ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
        lineNumber: 296,
        columnNumber: 21
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "h-4 w-4" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
        lineNumber: 296,
        columnNumber: 68
      }, this),
      " ",
      "Create"
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
      lineNumber: 295,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
      lineNumber: 294,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.tsx?tsr-split=component",
    lineNumber: 253,
    columnNumber: 10
  }, this);
}
export {
  CohortsPage as component
};
