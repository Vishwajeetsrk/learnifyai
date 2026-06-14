import { e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AppShell } from "./AppShell-BXcQmjDj.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { O as FileCheckCorner, L as LoaderCircle, ah as Trash2, ai as ExternalLink, aj as Paperclip } from "../_libs/lucide-react.mjs";
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
import "../_libs/tailwind-merge.mjs";
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
const STATUS_STYLE = {
  submitted: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  reviewed: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  needs_changes: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30"
};
function SubmissionsPage() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const q = useQuery({
    enabled: !!user,
    queryKey: ["my-submissions", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("assignment_submissions").select("*, courses:course_id(title, slug), course_assignments:assignment_id(title, prompt)").eq("user_id", user.id).order("submitted_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const del = async (id) => {
    if (!confirm("Delete this submission?")) return;
    await supabase.from("assignment_submissions").delete().eq("id", id);
    qc.invalidateQueries({
      queryKey: ["my-submissions"]
    });
    toast.success("Deleted");
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-5xl", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-2xl sm:text-3xl font-display font-semibold flex items-center gap-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(FileCheckCorner, { className: "h-6 w-6 text-primary" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
        lineNumber: 47,
        columnNumber: 11
      }, this),
      " My Submissions"
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
      lineNumber: 46,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1", children: "All your assignment work across courses." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
      lineNumber: 49,
      columnNumber: 9
    }, this),
    q.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-20 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
      lineNumber: 54,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
      lineNumber: 53,
      columnNumber: 24
    }, this) : (q.data ?? []).length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 rounded-2xl border bg-card p-12 text-center shadow-card text-sm text-muted-foreground", children: "No submissions yet. Submit assignments from any enrolled course." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
      lineNumber: 55,
      columnNumber: 50
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 space-y-3", children: (q.data ?? []).map((s) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-xl border bg-card p-4 shadow-card", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-medium", children: s.course_assignments?.title ?? "Assignment" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
            lineNumber: 61,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/courses/$slug", params: {
            slug: s.courses?.slug
          }, className: "text-xs text-primary hover:underline", children: s.courses?.title }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
            lineNumber: 62,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
          lineNumber: 60,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: `text-[10px] capitalize ${STATUS_STYLE[s.status] ?? ""}`, children: s.status.replace("_", " ") }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
            lineNumber: 69,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "icon", variant: "ghost", onClick: () => del(s.id), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trash2, { className: "h-4 w-4 text-destructive" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
            lineNumber: 73,
            columnNumber: 23
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
            lineNumber: 72,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
          lineNumber: 68,
          columnNumber: 19
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
        lineNumber: 59,
        columnNumber: 17
      }, this),
      s.content && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm mt-2 whitespace-pre-wrap text-muted-foreground line-clamp-4", children: s.content }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
        lineNumber: 77,
        columnNumber: 31
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-4 mt-2 text-xs", children: [
        s.link_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: s.link_url, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1 text-primary hover:underline", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ExternalLink, { className: "h-3 w-3" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
            lineNumber: 82,
            columnNumber: 23
          }, this),
          " Project link"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
          lineNumber: 81,
          columnNumber: 34
        }, this),
        s.attachment_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: s.attachment_url, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1 text-primary hover:underline", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Paperclip, { className: "h-3 w-3" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
            lineNumber: 85,
            columnNumber: 23
          }, this),
          " Attachment"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
          lineNumber: 84,
          columnNumber: 40
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-muted-foreground ml-auto", children: format(new Date(s.submitted_at), "dd MMM yyyy · HH:mm") }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
          lineNumber: 87,
          columnNumber: 19
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
        lineNumber: 80,
        columnNumber: 17
      }, this),
      s.feedback && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-3 rounded-lg bg-muted/50 border p-3 text-sm", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] uppercase tracking-wide text-muted-foreground mb-1", children: "Instructor feedback" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
          lineNumber: 92,
          columnNumber: 21
        }, this),
        s.feedback
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
        lineNumber: 91,
        columnNumber: 32
      }, this)
    ] }, s.id, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
      lineNumber: 58,
      columnNumber: 45
    }, this)) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
      lineNumber: 57,
      columnNumber: 20
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
    lineNumber: 45,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/submissions.tsx?tsr-split=component",
    lineNumber: 44,
    columnNumber: 10
  }, this);
}
export {
  SubmissionsPage as component
};
