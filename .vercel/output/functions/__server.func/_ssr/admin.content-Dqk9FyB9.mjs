import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, f as useLocation, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as CertificateRender, D as DEFAULT_DESIGN, F as FONT_OPTIONS, L as LAYOUTS, B as BACKGROUND_PATTERNS, b as BORDER_STYLES, c as CORNER_STYLES, a as CertificateFullPreviewDialog } from "./CertificateFullPreviewDialog-Bqwk9fl-.mjs";
import { A as AppShell } from "./AppShell-BXcQmjDj.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { I as Input } from "./input-BHvIASyb.mjs";
import { L as Label } from "./label-Dmhuxdmf.mjs";
import { T as Textarea } from "./textarea-7FPcqnpF.mjs";
import { S as Switch } from "./switch-DyY6BxUU.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-CCbL2pbx.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-CV-3vits.mjs";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dn0qHyRx.mjs";
import { L as LoaderCircle, av as ArrowLeft, q as Calendar, z as Briefcase, aK as Tag, V as Settings, J as Award, y as Send, o as CircleQuestionMark, aa as Plus, an as Pencil, ah as Trash2, $ as X, a2 as Maximize2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
const IssueCertificate = reactExports.lazy(() => import("./IssueCertificate-3119441W.mjs"));
function LazyFallback() {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-center py-16", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 26,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 25,
    columnNumber: 10
  }, this);
}
const SITE_LOGO_URL = "/__l5e/assets-v1/3b594ffd-98a6-4642-9661-dba29f6bb4c5/learnify-logo.png";
function AdminContentPage() {
  const {
    isAdmin,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const requestedTab = (() => {
    const search = location.search;
    if (search && typeof search === "object" && "tab" in search) return String(search.tab ?? "");
    if (typeof window !== "undefined") return new URLSearchParams(window.location.search).get("tab") ?? "";
    return "";
  })();
  const tabAlias = {
    templates: "cert-templates",
    certificate: "cert-templates",
    certificates: "cert-templates"
  }[requestedTab] ?? requestedTab;
  const tabFromUrl = ["events", "jobs", "pricing", "site", "cert-templates", "issue-cert", "faqs"].includes(tabAlias) ? tabAlias : "events";
  const [tab, setTab] = reactExports.useState(tabFromUrl || "events");
  reactExports.useEffect(() => {
    if (!loading && !isAdmin) navigate({
      to: "/dashboard"
    });
  }, [loading, isAdmin, navigate]);
  reactExports.useEffect(() => {
    setTab(tabFromUrl || "events");
  }, [tabFromUrl]);
  if (loading || !isAdmin) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 82,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 81,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 80,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-5xl mx-auto px-6 py-10 space-y-6", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/admin", className: "text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 mb-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowLeft, { className: "h-3.5 w-3.5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 91,
          columnNumber: 15
        }, this),
        " Back to admin"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 90,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "font-display text-3xl font-bold", children: "Content Manager" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 93,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1", children: "Manage events, jobs, pricing, FAQs, site settings and certificate templates from one place. Past events auto-delete 24h after they end. Jobs auto-close when their close date passes." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 94,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 89,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 88,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Tabs, { value: tab, onValueChange: setTab, children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsList, { className: "flex-wrap h-auto", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "events", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Calendar, { className: "h-4 w-4 mr-2" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 105,
            columnNumber: 15
          }, this),
          "Events"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 104,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "jobs", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Briefcase, { className: "h-4 w-4 mr-2" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 109,
            columnNumber: 15
          }, this),
          "Jobs"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 108,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "pricing", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Tag, { className: "h-4 w-4 mr-2" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 113,
            columnNumber: 15
          }, this),
          "Pricing"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 112,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "site", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Settings, { className: "h-4 w-4 mr-2" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 117,
            columnNumber: 15
          }, this),
          "Site"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 116,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "cert-templates", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Award, { className: "h-4 w-4 mr-2" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 121,
            columnNumber: 15
          }, this),
          "Cert Templates"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 120,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "issue-cert", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Send, { className: "h-4 w-4 mr-2" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 125,
            columnNumber: 15
          }, this),
          "Issue Cert"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 124,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "faqs", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleQuestionMark, { className: "h-4 w-4 mr-2" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 129,
            columnNumber: 15
          }, this),
          "FAQs"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 128,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 103,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsContent, { value: "events", className: "mt-6", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(EventsManager, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 134,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 133,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsContent, { value: "jobs", className: "mt-6", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(JobsManager, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 137,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 136,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsContent, { value: "pricing", className: "mt-6", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(PricingManager, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 140,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 139,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsContent, { value: "site", className: "mt-6", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SiteSettingsManager, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 143,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 142,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsContent, { value: "cert-templates", className: "mt-6", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CertTemplatesManager, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 146,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 145,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsContent, { value: "issue-cert", className: "mt-6", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LazyFallback, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 149,
        columnNumber: 33
      }, this), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(IssueCertificate, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 150,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 149,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 148,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsContent, { value: "faqs", className: "mt-6", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(FaqsManager, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 155,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 154,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 102,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 87,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 86,
    columnNumber: 10
  }, this);
}
function EventsManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(false);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const {
    data: events = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("events").select("*").order("starts_at", {
        ascending: true
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const newEvent = () => {
    setEditing({
      id: "",
      title: "",
      description: "",
      starts_at: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 16),
      location: "",
      rsvp_url: "",
      image_url: ""
    });
    setOpen(true);
  };
  const removeEvent = async () => {
    if (!deleteId) return;
    const {
      error
    } = await supabase.from("events").delete().eq("id", deleteId);
    if (error) return toast.error(error.message);
    toast.success("Event deleted");
    setDeleteId(null);
    qc.invalidateQueries({
      queryKey: ["admin-events"]
    });
    qc.invalidateQueries({
      queryKey: ["events-public"]
    });
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: newEvent, children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "h-4 w-4 mr-2" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 215,
        columnNumber: 11
      }, this),
      "New event"
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 214,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 213,
      columnNumber: 7
    }, this),
    isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-center py-10", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 221,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 220,
      columnNumber: 20
    }, this) : events.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground text-center py-10", children: "No events yet." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 222,
      columnNumber: 40
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: events.map((e) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-xl border border-border/60 bg-card p-4 flex items-center gap-3", children: [
      e.image_url ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: e.image_url, alt: "", className: "h-14 w-20 rounded-md object-cover shrink-0" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 224,
        columnNumber: 30
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-14 w-20 rounded-md bg-muted grid place-items-center shrink-0", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Calendar, { className: "h-5 w-5 text-muted-foreground" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 225,
        columnNumber: 19
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 224,
        columnNumber: 120
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-semibold truncate", children: e.title }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 228,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground mt-1 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: format(new Date(e.starts_at), "PPp") }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 230,
            columnNumber: 19
          }, this),
          e.location && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
            "· ",
            e.location
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 231,
            columnNumber: 34
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 229,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 227,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-2 shrink-0", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => {
          setEditing(e);
          setOpen(true);
        }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Pencil, { className: "h-3.5 w-3.5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 239,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 235,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => setDeleteId(e.id), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 242,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 241,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 234,
        columnNumber: 15
      }, this)
    ] }, e.id, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 223,
      columnNumber: 28
    }, this)) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 222,
      columnNumber: 124
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(EventDialog, { open, onOpenChange: (v) => {
      setOpen(v);
      if (!v) setEditing(null);
    }, event: editing, onSaved: () => {
      qc.invalidateQueries({
        queryKey: ["admin-events"]
      });
      qc.invalidateQueries({
        queryKey: ["events-public"]
      });
    } }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 248,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialog, { open: !!deleteId, onOpenChange: (v) => !v && setDeleteId(null), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogTitle, { children: "Delete event?" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 263,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogDescription, { children: "This cannot be undone." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 264,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 262,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogCancel, { children: "Cancel" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 267,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogAction, { onClick: removeEvent, children: "Delete" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 268,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 266,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 261,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 260,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 212,
    columnNumber: 10
  }, this);
}
function EventDialog({
  open,
  onOpenChange,
  event,
  onSaved
}) {
  const [form, setForm] = reactExports.useState(event);
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
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
      image_url: form.image_url?.trim() || null
    };
    const {
      error
    } = form.id ? await supabase.from("events").update(payload).eq("id", form.id) : await supabase.from("events").insert(payload);
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
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { className: "max-w-lg", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { children: form.id ? "Edit event" : "New event" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 324,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: "Public on the /events page until 24h after start." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 325,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 323,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Title" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 329,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.title, onChange: (e) => setForm({
          ...form,
          title: e.target.value
        }) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 330,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 328,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Description" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 336,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Textarea, { rows: 3, value: form.description ?? "", onChange: (e) => setForm({
          ...form,
          description: e.target.value
        }) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 337,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 335,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Date & time" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 344,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "datetime-local", value: localValue, onChange: (e) => setForm({
            ...form,
            starts_at: e.target.value
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 345,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 343,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Location" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 351,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.location ?? "", onChange: (e) => setForm({
            ...form,
            location: e.target.value
          }), placeholder: "Online · Zoom" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 352,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 350,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 342,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "RSVP URL" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 359,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.rsvp_url ?? "", onChange: (e) => setForm({
          ...form,
          rsvp_url: e.target.value
        }), placeholder: "https://..." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 360,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 358,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Cover image URL" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 366,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.image_url ?? "", onChange: (e) => setForm({
          ...form,
          image_url: e.target.value
        }), placeholder: "https://... (banner shown on dashboard)" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 367,
          columnNumber: 13
        }, this),
        form.image_url ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: form.image_url, alt: "", className: "mt-2 h-24 w-full rounded-md object-cover border" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 371,
          columnNumber: 31
        }, this) : null
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 365,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 327,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 375,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: save, disabled: saving, children: [
        saving && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 379,
          columnNumber: 24
        }, this),
        "Save"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 378,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 374,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 322,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 321,
    columnNumber: 10
  }, this);
}
function JobsManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(false);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const {
    data: jobs = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("job_postings").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
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
      closes_at: null
    });
    setOpen(true);
  };
  const removeJob = async () => {
    if (!deleteId) return;
    const {
      error
    } = await supabase.from("job_postings").delete().eq("id", deleteId);
    if (error) return toast.error(error.message);
    toast.success("Job deleted");
    setDeleteId(null);
    qc.invalidateQueries({
      queryKey: ["admin-jobs"]
    });
    qc.invalidateQueries({
      queryKey: ["jobs-public"]
    });
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: newJob, children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "h-4 w-4 mr-2" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 441,
        columnNumber: 11
      }, this),
      "New job"
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 440,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 439,
      columnNumber: 7
    }, this),
    isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-center py-10", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 447,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 446,
      columnNumber: 20
    }, this) : jobs.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground text-center py-10", children: "No jobs yet." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 448,
      columnNumber: 38
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: jobs.map((j) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-xl border border-border/60 bg-card p-4 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-semibold truncate flex items-center gap-2", children: [
          j.title,
          !j.active && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground", children: "Closed" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 453,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 451,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground mt-1", children: [
          j.team,
          " · ",
          j.location,
          j.closes_at && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
            " · closes ",
            format(new Date(j.closes_at), "PP")
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 459,
            columnNumber: 35
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 457,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 450,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-2 shrink-0", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => {
          setEditing(j);
          setOpen(true);
        }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Pencil, { className: "h-3.5 w-3.5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 467,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 463,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => setDeleteId(j.id), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 470,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 469,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 462,
        columnNumber: 15
      }, this)
    ] }, j.id, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 449,
      columnNumber: 26
    }, this)) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 448,
      columnNumber: 120
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(JobDialog, { open, onOpenChange: (v) => {
      setOpen(v);
      if (!v) setEditing(null);
    }, job: editing, onSaved: () => {
      qc.invalidateQueries({
        queryKey: ["admin-jobs"]
      });
      qc.invalidateQueries({
        queryKey: ["jobs-public"]
      });
    } }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 476,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialog, { open: !!deleteId, onOpenChange: (v) => !v && setDeleteId(null), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogTitle, { children: "Delete job?" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 491,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogDescription, { children: "This cannot be undone." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 492,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 490,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogCancel, { children: "Cancel" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 495,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogAction, { onClick: removeJob, children: "Delete" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 496,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 494,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 489,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 488,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 438,
    columnNumber: 10
  }, this);
}
function JobDialog({
  open,
  onOpenChange,
  job,
  onSaved
}) {
  const [form, setForm] = reactExports.useState(job);
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
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
      closes_at: form.closes_at ? new Date(form.closes_at).toISOString() : null
    };
    const {
      error
    } = form.id ? await supabase.from("job_postings").update(payload).eq("id", form.id) : await supabase.from("job_postings").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Job updated" : "Job created");
    onSaved();
    onOpenChange(false);
  };
  const closesLocal = form.closes_at ? (() => {
    try {
      return format(new Date(form.closes_at), "yyyy-MM-dd'T'HH:mm");
    } catch {
      return "";
    }
  })() : "";
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { className: "max-w-lg", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { children: form.id ? "Edit job" : "New job" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 553,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: "Public on the /careers page while active." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 554,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 552,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Title" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 558,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.title, onChange: (e) => setForm({
          ...form,
          title: e.target.value
        }) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 559,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 557,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Team" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 566,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.team, onChange: (e) => setForm({
            ...form,
            team: e.target.value
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 567,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 565,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Location" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 573,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.location, onChange: (e) => setForm({
            ...form,
            location: e.target.value
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 574,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 572,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 564,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Description" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 581,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Textarea, { rows: 3, value: form.description ?? "", onChange: (e) => setForm({
          ...form,
          description: e.target.value
        }) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 582,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 580,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Apply URL" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 588,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.apply_url ?? "", onChange: (e) => setForm({
          ...form,
          apply_url: e.target.value
        }), placeholder: "mailto:careers@learnify.ai or https://..." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 589,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 587,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-3 items-end", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Auto-close on" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 596,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "datetime-local", value: closesLocal, onChange: (e) => setForm({
            ...form,
            closes_at: e.target.value || null
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 597,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 595,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 pb-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Switch, { checked: form.active, onCheckedChange: (v) => setForm({
            ...form,
            active: v
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 603,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "cursor-pointer", children: "Active" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 607,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 602,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 594,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 556,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 612,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: save, disabled: saving, children: [
        saving && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 616,
          columnNumber: 24
        }, this),
        "Save"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 615,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 611,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 551,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 550,
    columnNumber: 10
  }, this);
}
function PricingManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(false);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const {
    data: plans = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-plans"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("pricing_plans").select("*").order("order_index", {
        ascending: true
      });
      if (error) throw error;
      return (data ?? []).map((p) => ({
        ...p,
        features: Array.isArray(p.features) ? p.features : []
      }));
    }
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
      active: true
    });
    setOpen(true);
  };
  const removePlan = async () => {
    if (!deleteId) return;
    const {
      error
    } = await supabase.from("pricing_plans").delete().eq("id", deleteId);
    if (error) return toast.error(error.message);
    toast.success("Plan deleted");
    setDeleteId(null);
    qc.invalidateQueries({
      queryKey: ["admin-plans"]
    });
    qc.invalidateQueries({
      queryKey: ["pricing-plans"]
    });
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: newPlan, children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "h-4 w-4 mr-2" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 695,
        columnNumber: 11
      }, this),
      "New plan"
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 694,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 693,
      columnNumber: 7
    }, this),
    isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-center py-10", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 700,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 699,
      columnNumber: 20
    }, this) : plans.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground text-center py-10", children: "No plans yet." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 701,
      columnNumber: 39
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: plans.map((p) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-xl border border-border/60 bg-card p-4 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-semibold truncate flex items-center gap-2", children: [
          p.name,
          " ",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs text-muted-foreground", children: [
            "· ",
            p.price_label
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 705,
            columnNumber: 28
          }, this),
          p.highlighted && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5", children: "Featured" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 706,
            columnNumber: 37
          }, this),
          !p.active && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground", children: "Hidden" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 709,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 704,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground mt-1 truncate", children: [
          p.features.length,
          " features"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 713,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 703,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-2 shrink-0", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => {
          setEditing(p);
          setOpen(true);
        }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Pencil, { className: "h-3.5 w-3.5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 722,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 718,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => setDeleteId(p.id), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 725,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 724,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 717,
        columnNumber: 15
      }, this)
    ] }, p.id, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 702,
      columnNumber: 27
    }, this)) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 701,
      columnNumber: 122
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(PlanDialog, { open, onOpenChange: (v) => {
      setOpen(v);
      if (!v) setEditing(null);
    }, plan: editing, onSaved: () => {
      qc.invalidateQueries({
        queryKey: ["admin-plans"]
      });
      qc.invalidateQueries({
        queryKey: ["pricing-plans"]
      });
    } }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 731,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialog, { open: !!deleteId, onOpenChange: (v) => !v && setDeleteId(null), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogTitle, { children: "Delete plan?" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 746,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogDescription, { children: "This cannot be undone." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 747,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 745,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogCancel, { children: "Cancel" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 750,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogAction, { onClick: removePlan, children: "Delete" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 751,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 749,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 744,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 743,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 692,
    columnNumber: 10
  }, this);
}
function PlanDialog({
  open,
  onOpenChange,
  plan,
  onSaved
}) {
  const [form, setForm] = reactExports.useState(plan);
  const [featureInput, setFeatureInput] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setForm(plan);
    setFeatureInput("");
  }, [plan]);
  if (!form) return null;
  const addFeature = () => {
    const v = featureInput.trim();
    if (!v) return;
    setForm({
      ...form,
      features: [...form.features, v]
    });
    setFeatureInput("");
  };
  const removeFeature = (i) => {
    setForm({
      ...form,
      features: form.features.filter((_, idx) => idx !== i)
    });
  };
  const save = async () => {
    if (!form.name.trim() || !form.price_label.trim()) {
      toast.error("Name and price are required");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      price_label: form.price_label.trim(),
      description: form.description?.trim() || null,
      features: form.features,
      cta_label: form.cta_label.trim() || "Get started",
      cta_to: form.cta_to.trim() || "/signup",
      highlighted: form.highlighted,
      order_index: form.order_index,
      active: form.active
    };
    const {
      error
    } = form.id ? await supabase.from("pricing_plans").update(payload).eq("id", form.id) : await supabase.from("pricing_plans").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Plan updated" : "Plan created");
    onSaved();
    onOpenChange(false);
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { className: "max-w-lg", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { children: form.id ? "Edit plan" : "New plan" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 820,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: "Shown publicly on the /pricing page." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 821,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 819,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3 max-h-[60vh] overflow-y-auto pr-1", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Name" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 826,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.name, onChange: (e) => setForm({
            ...form,
            name: e.target.value
          }), placeholder: "Pro" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 827,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 825,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Price label" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 833,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.price_label, onChange: (e) => setForm({
            ...form,
            price_label: e.target.value
          }), placeholder: "₹499/mo" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 834,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 832,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 824,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Description" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 841,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Textarea, { rows: 2, value: form.description ?? "", onChange: (e) => setForm({
          ...form,
          description: e.target.value
        }) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 842,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 840,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Features" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 848,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-2 mt-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: featureInput, onChange: (e) => setFeatureInput(e.target.value), onKeyDown: (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addFeature();
            }
          }, placeholder: "Add a feature, then press Enter" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 850,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "button", variant: "outline", onClick: addFeature, children: "Add" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 856,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 849,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-2 space-y-1", children: form.features.map((f, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between rounded-md bg-muted/50 px-3 py-1.5 text-sm", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: f }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 862,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => removeFeature(i), className: "text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(X, { className: "h-3.5 w-3.5" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 864,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 863,
            columnNumber: 19
          }, this)
        ] }, i, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 861,
          columnNumber: 44
        }, this)) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 860,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 847,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "CTA label" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 871,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.cta_label, onChange: (e) => setForm({
            ...form,
            cta_label: e.target.value
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 872,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 870,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "CTA link" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 878,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.cta_to, onChange: (e) => setForm({
            ...form,
            cta_to: e.target.value
          }), placeholder: "/signup or mailto:..." }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 879,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 877,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 869,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-3 gap-3 items-end", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Order" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 887,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "number", value: form.order_index, onChange: (e) => setForm({
            ...form,
            order_index: Number(e.target.value) || 0
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 888,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 886,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 pb-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Switch, { checked: form.highlighted, onCheckedChange: (v) => setForm({
            ...form,
            highlighted: v
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 894,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "cursor-pointer", children: "Featured" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 898,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 893,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 pb-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Switch, { checked: form.active, onCheckedChange: (v) => setForm({
            ...form,
            active: v
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 901,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "cursor-pointer", children: "Active" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 905,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 900,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 885,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 823,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 910,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: save, disabled: saving, children: [
        saving && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 914,
          columnNumber: 24
        }, this),
        "Save"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 913,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 909,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 818,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 817,
    columnNumber: 10
  }, this);
}
const SETTING_FIELDS = [{
  key: "contact_email",
  label: "Contact email",
  placeholder: "hello@learnify.ai"
}, {
  key: "careers_email",
  label: "Careers email",
  placeholder: "careers@learnify.ai"
}, {
  key: "discord_url",
  label: "Discord URL",
  placeholder: "https://discord.gg/..."
}, {
  key: "discord_label",
  label: "Discord tagline",
  placeholder: "Chat with the community in real time."
}, {
  key: "twitter_url",
  label: "X (Twitter) URL",
  placeholder: "https://x.com/learnifyai"
}, {
  key: "twitter_handle",
  label: "X handle",
  placeholder: "@learnifyai"
}, {
  key: "github_url",
  label: "GitHub URL",
  placeholder: "https://github.com/..."
}, {
  key: "events_auto_delete_enabled",
  label: "Auto-delete past events (true/false)",
  placeholder: "true"
}, {
  key: "events_auto_delete_hours",
  label: "Auto-delete events after (hours)",
  placeholder: "24"
}, {
  key: "jobs_auto_close_enabled",
  label: "Auto-close jobs past close date (true/false)",
  placeholder: "true"
}];
function SiteSettingsManager() {
  const qc = useQueryClient();
  const [values, setValues] = reactExports.useState({});
  const [newKey, setNewKey] = reactExports.useState("");
  const [newValue, setNewValue] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin-site-settings"],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("site_settings").select("key,value");
      if (error) throw error;
      const m = {};
      (data2 ?? []).forEach((r) => {
        m[r.key] = r.value ?? "";
      });
      return m;
    }
  });
  reactExports.useEffect(() => {
    if (data) setValues(data);
  }, [data]);
  const settingMeta = (key) => SETTING_FIELDS.find((f) => f.key === key);
  const settingKeys = [...SETTING_FIELDS.map((f) => f.key), ...Object.keys(values).filter((key) => !SETTING_FIELDS.some((f) => f.key === key)).sort()];
  const save = async () => {
    setSaving(true);
    const rows = settingKeys.filter((key) => key.trim()).map((key) => ({
      key: key.trim(),
      value: values[key] ?? ""
    }));
    const {
      error
    } = await supabase.from("site_settings").upsert(rows, {
      onConflict: "key"
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Site settings saved");
    qc.invalidateQueries({
      queryKey: ["admin-site-settings"]
    });
    qc.invalidateQueries({
      queryKey: ["site-settings"]
    });
  };
  const addSetting = async () => {
    const key = newKey.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (!key) return toast.error("Setting key is required");
    if (values[key] !== void 0) return toast.error("That setting already exists");
    setSaving(true);
    const {
      error
    } = await supabase.from("site_settings").upsert({
      key,
      value: newValue
    }, {
      onConflict: "key"
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    setValues({
      ...values,
      [key]: newValue
    });
    setNewKey("");
    setNewValue("");
    toast.success("Setting added");
    qc.invalidateQueries({
      queryKey: ["admin-site-settings"]
    });
    qc.invalidateQueries({
      queryKey: ["site-settings"]
    });
  };
  const deleteSetting = async (key) => {
    if (!window.confirm(`Delete ${key}?`)) return;
    const {
      error
    } = await supabase.from("site_settings").delete().eq("key", key);
    if (error) return toast.error(error.message);
    const next = {
      ...values
    };
    delete next[key];
    setValues(next);
    toast.success("Setting deleted");
    qc.invalidateQueries({
      queryKey: ["admin-site-settings"]
    });
    qc.invalidateQueries({
      queryKey: ["site-settings"]
    });
  };
  if (isLoading) return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-center py-10", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin" }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 1068,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 1067,
    columnNumber: 25
  }, this);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-5 max-w-2xl", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-xl border border-border/60 bg-card p-4 space-y-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-semibold", children: "Add custom setting" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 1072,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid sm:grid-cols-[1fr_1fr_auto] gap-2 items-end", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Key" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1075,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: newKey, onChange: (e) => setNewKey(e.target.value), placeholder: "support_url" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1076,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 1074,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Value" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1079,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: newValue, onChange: (e) => setNewValue(e.target.value), placeholder: "https://..." }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1080,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 1078,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: addSetting, disabled: saving, children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "h-4 w-4 mr-2" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1083,
            columnNumber: 13
          }, this),
          "Add"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 1082,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 1073,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 1071,
      columnNumber: 7
    }, this),
    settingKeys.map((key) => {
      const meta = settingMeta(key);
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-xl border border-border/60 bg-card p-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between gap-3 mb-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: meta?.label ?? key.replaceAll("_", " ") }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1094,
              columnNumber: 17
            }, this),
            !meta && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] text-muted-foreground font-mono", children: key }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1095,
              columnNumber: 27
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1093,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => deleteSetting(key), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1098,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1097,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 1092,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: values[key] ?? "", onChange: (e) => setValues({
          ...values,
          [key]: e.target.value
        }), placeholder: meta?.placeholder ?? "Value" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 1101,
          columnNumber: 13
        }, this)
      ] }, key, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 1091,
        columnNumber: 14
      }, this);
    }),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "pt-2 sticky bottom-0 bg-background/95 backdrop-blur py-3", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: save, disabled: saving, children: [
      saving && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 1109,
        columnNumber: 22
      }, this),
      "Save all changes"
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 1108,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 1107,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 1070,
    columnNumber: 10
  }, this);
}
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
  qrDataUrl: ""
};
function CertTemplatesManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(false);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const {
    data: templates = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-cert-templates"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("certificate_templates").select("*").order("created_at", {
        ascending: true
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const newTemplate = () => {
    setEditing({
      ...DEFAULT_DESIGN,
      id: "",
      name: "New template",
      is_default: false
    });
    setOpen(true);
  };
  const loadPresets = async () => {
    const presets = buildPresetTemplates();
    const {
      error
    } = await supabase.from("certificate_templates").insert(presets);
    if (error) return toast.error(error.message);
    toast.success(`${presets.length} preset templates added`);
    qc.invalidateQueries({
      queryKey: ["admin-cert-templates"]
    });
  };
  const removeTemplate = async () => {
    if (!deleteId) return;
    const {
      error
    } = await supabase.from("certificate_templates").delete().eq("id", deleteId);
    if (error) return toast.error(error.message);
    toast.success("Template deleted");
    setDeleteId(null);
    qc.invalidateQueries({
      queryKey: ["admin-cert-templates"]
    });
  };
  const exportTemplates = () => {
    const payload = {
      kind: "learnify-certificate-templates",
      version: 1,
      exported_at: (/* @__PURE__ */ new Date()).toISOString(),
      palettes: COLOR_PALETTES,
      templates: templates.map(({
        id: _id,
        created_by: _cb,
        created_at: _ca,
        updated_at: _ua,
        ...rest
      }) => rest)
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learnify-cert-templates-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${templates.length} template(s) exported`);
  };
  const importTemplates = async (file) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const rows = Array.isArray(json) ? json : Array.isArray(json?.templates) ? json.templates : [];
      if (!rows.length) return toast.error("No templates found in file");
      const clean = rows.map((r) => {
        const {
          id,
          created_by,
          created_at,
          updated_at,
          is_default,
          ...rest
        } = r ?? {};
        return {
          ...rest,
          name: String(rest.name ?? "Imported template"),
          is_default: false
        };
      });
      const {
        error
      } = await supabase.from("certificate_templates").insert(clean);
      if (error) return toast.error(error.message);
      toast.success(`Imported ${clean.length} template(s)`);
      qc.invalidateQueries({
        queryKey: ["admin-cert-templates"]
      });
    } catch (e) {
      toast.error(e?.message ?? "Invalid JSON file");
    }
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap justify-end gap-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("input", { id: "cert-import-file", type: "file", accept: "application/json,.json", className: "hidden", onChange: (e) => {
        const f = e.target.files?.[0];
        if (f) importTemplates(f);
        e.target.value = "";
      } }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 1254,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: () => document.getElementById("cert-import-file")?.click(), children: "Import JSON" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 1259,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: exportTemplates, disabled: !templates.length, children: "Export JSON" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 1262,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: loadPresets, children: "Load preset templates" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 1265,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: newTemplate, children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "h-4 w-4 mr-2" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 1269,
          columnNumber: 11
        }, this),
        "New template"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 1268,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 1253,
      columnNumber: 7
    }, this),
    isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-center py-10", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 1274,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 1273,
      columnNumber: 20
    }, this) : templates.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground text-center py-10", children: "No templates yet." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 1275,
      columnNumber: 43
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid sm:grid-cols-2 gap-4", children: templates.map((t) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-xl border border-border/60 bg-card p-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-semibold truncate flex items-center gap-2", children: [
            t.name,
            t.is_default && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-[10px] rounded-full bg-primary/10 text-primary px-2 py-0.5", children: "Default" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1281,
              columnNumber: 38
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1279,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground", children: t.font_family }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1285,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 1278,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => {
            setEditing(t);
            setOpen(true);
          }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Pencil, { className: "h-3.5 w-3.5" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1292,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1288,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => setDeleteId(t.id), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1295,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1294,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 1287,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 1277,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-3 rounded-md overflow-hidden border border-border/60", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { style: {
        transform: "scale(0.34)",
        transformOrigin: "top left",
        width: "294%",
        height: "200px"
      }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CertificateRender, { design: t, ctx: PREVIEW_CTX }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 1306,
        columnNumber: 19
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 1300,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 1299,
        columnNumber: 15
      }, this)
    ] }, t.id, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 1276,
      columnNumber: 31
    }, this)) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 1275,
      columnNumber: 130
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TemplateDialog, { open, onOpenChange: (v) => {
      setOpen(v);
      if (!v) setEditing(null);
    }, template: editing, onSaved: () => qc.invalidateQueries({
      queryKey: ["admin-cert-templates"]
    }) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 1312,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialog, { open: !!deleteId, onOpenChange: (v) => !v && setDeleteId(null), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogTitle, { children: "Delete template?" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 1322,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogDescription, { children: "Certificates already issued keep their saved design." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 1323,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 1321,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogCancel, { children: "Cancel" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 1328,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogAction, { onClick: removeTemplate, children: "Delete" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 1329,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 1327,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 1320,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 1319,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 1252,
    columnNumber: 10
  }, this);
}
function TemplateDialog({
  open,
  onOpenChange,
  template,
  onSaved
}) {
  const [form, setForm] = reactExports.useState(template);
  const [saving, setSaving] = reactExports.useState(false);
  const [fullPreviewOpen, setFullPreviewOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setForm(template);
  }, [template]);
  if (!form) return null;
  const set = (patch) => setForm({
    ...form,
    ...patch
  });
  const save = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    setSaving(true);
    const payload = {
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
      layout: form.layout ?? "classic"
    };
    const {
      error
    } = form.id ? await supabase.from("certificate_templates").update(payload).eq("id", form.id) : await supabase.from("certificate_templates").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Template updated" : "Template created");
    onSaved();
    onOpenChange(false);
  };
  const exportSingle = () => {
    const {
      id: _id,
      ...rest
    } = form;
    const blob = new Blob([JSON.stringify({
      kind: "learnify-certificate-templates",
      version: 1,
      templates: [rest]
    }, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(form.name || "template").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { className: "max-w-6xl w-[96vw] max-h-[92vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: form.id ? "Edit template" : "New template" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1420,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "button", size: "sm", variant: "outline", onClick: exportSingle, children: "Export JSON" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1421,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 1419,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: "Customize text, colors, fonts, borders and background. Live preview updates instantly." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 1425,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 1418,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid lg:grid-cols-5 gap-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "lg:col-span-3 lg:order-2", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-md border border-border/60 overflow-hidden lg:sticky lg:top-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-muted/40 px-3 py-2 text-xs text-muted-foreground flex items-center justify-between", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Live preview · A4 landscape" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1434,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "button", size: "sm", variant: "outline", className: "h-7 text-[11px]", onClick: () => setFullPreviewOpen(true), children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Maximize2, { className: "h-3.5 w-3.5" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1436,
                columnNumber: 21
              }, this),
              " View full certificate"
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1435,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1433,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-muted/20 flex justify-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-full", style: {
            maxWidth: "min(100%, calc((78vh - 120px) * 1.414))"
          }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CertificateRender, { design: form, ctx: PREVIEW_CTX }, JSON.stringify(form), false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1443,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1440,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1439,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 1432,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 1431,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "lg:col-span-2 lg:order-1 space-y-3 pr-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Template name" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1452,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.name, onChange: (e) => set({
              name: e.target.value
            }) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1453,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1451,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Title" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1459,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.title_text, onChange: (e) => set({
                title_text: e.target.value
              }) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1460,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1458,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Subtitle" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1465,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.subtitle, onChange: (e) => set({
                subtitle: e.target.value
              }) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1466,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1464,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1457,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: [
              "Body (use ",
              "{name}",
              " ",
              "{course}",
              " ",
              "{date}",
              " ",
              "{role}",
              " ",
              "{from}",
              " ",
              "{to}",
              ")"
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1472,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Textarea, { rows: 3, value: form.body_template, onChange: (e) => set({
              body_template: e.target.value
            }) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1475,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1471,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Signatory name" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1481,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.signatory_name, onChange: (e) => set({
                signatory_name: e.target.value
              }) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1482,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1480,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Signatory title" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1487,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.signatory_title, onChange: (e) => set({
                signatory_title: e.target.value
              }) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1488,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1486,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1479,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-lg border border-dashed border-border/60 p-3 space-y-3 bg-muted/20", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Branding" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1496,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Color palette" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1500,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-1 grid grid-cols-2 gap-2", children: COLOR_PALETTES.map((p) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { type: "button", onClick: () => set({
                accent_color: p.accent,
                bg_color: p.bg,
                text_color: p.text
              }), className: "rounded-md border border-border/60 px-2 py-1.5 text-left hover:border-primary transition", title: p.name, children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-1 mb-1", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "h-3 w-3 rounded-full", style: {
                    background: p.accent
                  } }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                    lineNumber: 1508,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "h-3 w-3 rounded-full border", style: {
                    background: p.bg
                  } }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                    lineNumber: 1511,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "h-3 w-3 rounded-full", style: {
                    background: p.text
                  } }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                    lineNumber: 1514,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1507,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[10px] leading-tight", children: p.name }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1518,
                  columnNumber: 25
                }, this)
              ] }, p.name, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1502,
                columnNumber: 46
              }, this)) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1501,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1499,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-4 gap-2", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Accent" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1524,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "color", value: form.accent_color, onChange: (e) => set({
                  accent_color: e.target.value
                }) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1525,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1523,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Accent 2" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1530,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "color", value: form.accent_color_2 ?? form.accent_color, onChange: (e) => set({
                  accent_color_2: e.target.value
                }) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1531,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1529,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Background" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1536,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "color", value: form.bg_color, onChange: (e) => set({
                  bg_color: e.target.value
                }) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1537,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1535,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Text" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1542,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "color", value: form.text_color, onChange: (e) => set({
                  text_color: e.target.value
                }) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1543,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1541,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1522,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1495,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-lg border border-dashed border-border/60 p-3 space-y-3 bg-muted/20", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Typography" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1552,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Title font" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1557,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("select", { className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm", value: form.title_font ?? form.font_family, onChange: (e) => set({
                  title_font: e.target.value
                }), children: FONT_OPTIONS.map((f) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: f, children: f }, f, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1561,
                  columnNumber: 46
                }, this)) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1558,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1556,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Body font" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1567,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("select", { className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm", value: form.body_font ?? form.font_family, onChange: (e) => set({
                  body_font: e.target.value,
                  font_family: e.target.value
                }), children: FONT_OPTIONS.map((f) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: f, children: f }, f, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1572,
                  columnNumber: 46
                }, this)) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1568,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1566,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1555,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-3 gap-2", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: [
                  "Title size (",
                  (form.title_size ?? 1).toFixed(2),
                  "×)"
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1580,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "range", min: 0.6, max: 1.6, step: 0.05, value: form.title_size ?? 1, onChange: (e) => set({
                  title_size: Number(e.target.value)
                }) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1583,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1579,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: [
                  "Name size (",
                  (form.name_size ?? 1).toFixed(2),
                  "×)"
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1588,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "range", min: 0.6, max: 1.8, step: 0.05, value: form.name_size ?? 1, onChange: (e) => set({
                  name_size: Number(e.target.value)
                }) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1591,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1587,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: [
                  "Body size (",
                  (form.body_size ?? 1).toFixed(2),
                  "×)"
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1596,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "range", min: 0.7, max: 1.4, step: 0.05, value: form.body_size ?? 1, onChange: (e) => set({
                  body_size: Number(e.target.value)
                }) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1599,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1595,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1578,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1551,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-lg border border-dashed border-border/60 p-3 space-y-3 bg-muted/20", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Layout & decoration" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1608,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Layout" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1613,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("select", { className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize", value: form.layout ?? "classic", onChange: (e) => set({
                  layout: e.target.value
                }), children: LAYOUTS.map((l) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: l, children: l }, l, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1617,
                  columnNumber: 41
                }, this)) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1614,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1612,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Background pattern" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1623,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("select", { className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize", value: form.background_pattern ?? "none", onChange: (e) => set({
                  background_pattern: e.target.value
                }), children: BACKGROUND_PATTERNS.map((b) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: b, children: b }, b, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1627,
                  columnNumber: 53
                }, this)) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1624,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1622,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Border style" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1633,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("select", { className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize", value: form.border_style ?? "double", onChange: (e) => set({
                  border_style: e.target.value
                }), children: BORDER_STYLES.map((b) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: b, children: b }, b, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1637,
                  columnNumber: 47
                }, this)) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1634,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1632,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Corners" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1643,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("select", { className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize", value: form.corner_style ?? "diagonal", onChange: (e) => set({
                  corner_style: e.target.value
                }), children: CORNER_STYLES.map((c) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: c, children: c }, c, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1647,
                  columnNumber: 47
                }, this)) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1644,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1642,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1611,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: [
                "Border width (",
                form.border_width ?? 10,
                "px)"
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1654,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "range", min: 0, max: 24, step: 1, value: form.border_width ?? 10, onChange: (e) => set({
                border_width: Number(e.target.value)
              }) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1655,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1653,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1607,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-lg border border-dashed border-border/60 p-3 space-y-3 bg-muted/20", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Assets" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1663,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Logo URL" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1668,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "button", size: "sm", variant: "ghost", className: "h-7 text-[11px]", onClick: () => set({
                  logo_url: SITE_LOGO_URL
                }), children: "Use site logo" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                  lineNumber: 1669,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1667,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.logo_url ?? "", onChange: (e) => set({
                logo_url: e.target.value
              }), placeholder: "https://..." }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1675,
                columnNumber: 19
              }, this),
              form.logo_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: form.logo_url, alt: "Logo preview", className: "h-10 object-contain bg-white rounded border p-1" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1678,
                columnNumber: 37
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1666,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Signature image URL" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1681,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.signature_url ?? "", onChange: (e) => set({
                signature_url: e.target.value
              }), placeholder: "https://...signature.png" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1682,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1680,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Stamp image URL" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1687,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.stamp_url ?? "", onChange: (e) => set({
                stamp_url: e.target.value
              }), placeholder: "https://...stamp.png" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
                lineNumber: 1688,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1686,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1662,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 pt-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Switch, { checked: form.is_default, onCheckedChange: (v) => set({
              is_default: v
            }) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1695,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "cursor-pointer", children: "Default template" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
              lineNumber: 1698,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1694,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 1450,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 1429,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 1703,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: save, disabled: saving, children: [
          saving && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 1707,
            columnNumber: 26
          }, this),
          " Save"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 1706,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 1702,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 1417,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 1416,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CertificateFullPreviewDialog, { open: fullPreviewOpen, onOpenChange: setFullPreviewOpen, design: form, ctx: PREVIEW_CTX, title: form.name || "Certificate preview" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 1712,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 1415,
    columnNumber: 10
  }, this);
}
function buildPresetTemplates() {
  return [{
    name: "Learnify Official (Navy + Gold)",
    title_text: "Certificate of Completion",
    subtitle: "This is proudly presented to",
    body_template: "for successfully completing the {course} program on {date}. This achievement reflects dedication, curiosity and rigor.",
    signatory_name: "Learnify AI",
    signatory_title: "Director of Learning",
    accent_color: "#c9a84c",
    bg_color: "#fdfbf5",
    text_color: "#0f1b3d",
    font_family: "Playfair Display",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: true
  }, {
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
    is_default: false
  }, {
    name: "Modern Indigo",
    title_text: "Certificate of Achievement",
    subtitle: "This certifies that",
    body_template: "has successfully completed the {course} curriculum on {date} with distinction.",
    signatory_name: "Learnify AI",
    signatory_title: "Head of Programs",
    accent_color: "#6366f1",
    bg_color: "#ffffff",
    text_color: "#1e1b4b",
    font_family: "Montserrat",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false
  }, {
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
    is_default: false
  }, {
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
    is_default: false
  }, ...EXTRA_PRESETS];
}
const COLOR_PALETTES = [{
  name: "Navy & Gold",
  accent: "#c9a84c",
  bg: "#fdfbf5",
  text: "#0f1b3d"
}, {
  name: "Black & Gold",
  accent: "#d4af37",
  bg: "#0d0d0d",
  text: "#f5f0e0"
}, {
  name: "Indigo Modern",
  accent: "#6366f1",
  bg: "#ffffff",
  text: "#1e1b4b"
}, {
  name: "Emerald Prestige",
  accent: "#c9a84c",
  bg: "#f8faf7",
  text: "#064e3b"
}, {
  name: "Burgundy Classic",
  accent: "#b08d57",
  bg: "#fbf6ef",
  text: "#581c1c"
}, {
  name: "Slate Minimal",
  accent: "#64748b",
  bg: "#ffffff",
  text: "#0f172a"
}, {
  name: "Rose & Charcoal",
  accent: "#b76e79",
  bg: "#fff8f5",
  text: "#1f1f1f"
}, {
  name: "Teal Editorial",
  accent: "#0d9488",
  bg: "#f0fdfa",
  text: "#134e4a"
}, {
  name: "Royal Purple",
  accent: "#a855f7",
  bg: "#faf5ff",
  text: "#3b0764"
}, {
  name: "Sunset Amber",
  accent: "#f59e0b",
  bg: "#fffbeb",
  text: "#7c2d12"
}, {
  name: "Forest & Cream",
  accent: "#4a6741",
  bg: "#f7f4ec",
  text: "#1c2e1a"
}, {
  name: "Steel Blue",
  accent: "#1e40af",
  bg: "#f1f5f9",
  text: "#0c1d4f"
}];
const EXTRA_PRESETS = [{
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
  is_default: false
}, {
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
  is_default: false
}, {
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
  is_default: false
}, {
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
  is_default: false
}, {
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
  is_default: false
}, {
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
  is_default: false
}, {
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
  is_default: false
}, {
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
  is_default: false
}, {
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
  is_default: false
}, {
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
  is_default: false
}, {
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
  is_default: false
}, {
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
  is_default: false
}];
function FaqsManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(false);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const {
    data: faqs = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("faqs").select("*").order("category").order("order_index");
      if (error) throw error;
      return data ?? [];
    }
  });
  const newFaq = () => {
    setEditing({
      id: "",
      question: "",
      answer: "",
      category: "General",
      order_index: (faqs.length + 1) * 10,
      published: true
    });
    setOpen(true);
  };
  const remove = async () => {
    if (!deleteId) return;
    const {
      error
    } = await supabase.from("faqs").delete().eq("id", deleteId);
    if (error) return toast.error(error.message);
    toast.success("FAQ deleted");
    setDeleteId(null);
    qc.invalidateQueries({
      queryKey: ["admin-faqs"]
    });
    qc.invalidateQueries({
      queryKey: ["public-faqs"]
    });
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: newFaq, children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "h-4 w-4 mr-2" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 2101,
        columnNumber: 11
      }, this),
      "New FAQ"
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 2100,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 2099,
      columnNumber: 7
    }, this),
    isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-center py-10", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 2106,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 2105,
      columnNumber: 20
    }, this) : faqs.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground text-center py-10", children: "No FAQs yet." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 2107,
      columnNumber: 38
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: faqs.map((f) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-xl border border-border/60 bg-card p-4 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-medium truncate flex items-center gap-2", children: [
          f.question,
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-[10px] rounded-full bg-muted px-2 py-0.5 text-muted-foreground", children: f.category }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 2112,
            columnNumber: 19
          }, this),
          !f.published && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-[10px] rounded-full bg-muted px-2 py-0.5 text-muted-foreground", children: "Hidden" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 2115,
            columnNumber: 36
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 2110,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground truncate mt-1", children: f.answer }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 2119,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 2109,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-2 shrink-0", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => {
          setEditing(f);
          setOpen(true);
        }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Pencil, { className: "h-3.5 w-3.5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 2126,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 2122,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => setDeleteId(f.id), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 2129,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 2128,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 2121,
        columnNumber: 15
      }, this)
    ] }, f.id, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 2108,
      columnNumber: 26
    }, this)) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 2107,
      columnNumber: 120
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(FaqDialog, { open, onOpenChange: (v) => {
      setOpen(v);
      if (!v) setEditing(null);
    }, faq: editing, onSaved: () => {
      qc.invalidateQueries({
        queryKey: ["admin-faqs"]
      });
      qc.invalidateQueries({
        queryKey: ["public-faqs"]
      });
    } }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 2135,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialog, { open: !!deleteId, onOpenChange: (v) => !v && setDeleteId(null), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogTitle, { children: "Delete FAQ?" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 2150,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogDescription, { children: "This cannot be undone." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 2151,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 2149,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogCancel, { children: "Cancel" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 2154,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogAction, { onClick: remove, children: "Delete" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 2155,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 2153,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 2148,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 2147,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 2098,
    columnNumber: 10
  }, this);
}
function FaqDialog({
  open,
  onOpenChange,
  faq,
  onSaved
}) {
  const [form, setForm] = reactExports.useState(faq);
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setForm(faq);
  }, [faq]);
  if (!form) return null;
  const save = async () => {
    if (!form.question.trim() || !form.answer.trim()) return toast.error("Question and answer are required");
    setSaving(true);
    const payload = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      category: form.category.trim() || "General",
      order_index: form.order_index,
      published: form.published
    };
    const {
      error
    } = form.id ? await supabase.from("faqs").update(payload).eq("id", form.id) : await supabase.from("faqs").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "FAQ updated" : "FAQ created");
    onSaved();
    onOpenChange(false);
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { children: form.id ? "Edit FAQ" : "New FAQ" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 2200,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: "Shown publicly on /faq." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 2201,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 2199,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Question" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 2205,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.question, onChange: (e) => setForm({
          ...form,
          question: e.target.value
        }) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 2206,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 2204,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Answer" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 2212,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Textarea, { rows: 4, value: form.answer, onChange: (e) => setForm({
          ...form,
          answer: e.target.value
        }) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 2213,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 2211,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-3 gap-2 items-end", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Category" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 2220,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: form.category, onChange: (e) => setForm({
            ...form,
            category: e.target.value
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 2221,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 2219,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Order" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 2227,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "number", value: form.order_index, onChange: (e) => setForm({
            ...form,
            order_index: Number(e.target.value) || 0
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 2228,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 2226,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 pb-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Switch, { checked: form.published, onCheckedChange: (v) => setForm({
            ...form,
            published: v
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 2234,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "cursor-pointer", children: "Published" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
            lineNumber: 2238,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 2233,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 2218,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 2203,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 2243,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: save, disabled: saving, children: [
        saving && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
          lineNumber: 2247,
          columnNumber: 24
        }, this),
        " Save"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
        lineNumber: 2246,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
      lineNumber: 2242,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 2198,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.content.tsx?tsr-split=component",
    lineNumber: 2197,
    columnNumber: 10
  }, this);
}
export {
  AdminContentPage as component
};
