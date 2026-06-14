import { e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-BXcQmjDj.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BVpJdHW-.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { b as buildCourseVideoEmbedUrl } from "./course-player-MW9-dEKE.mjs";
import "../_libs/sonner.mjs";
import { ak as ShieldAlert, aU as VideoOff, aV as RefreshCw, L as LoaderCircle, as as TriangleAlert } from "../_libs/lucide-react.mjs";
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
function MissingVideosPage() {
  const {
    isAdmin,
    loading
  } = useAuth();
  const q = useQuery({
    enabled: !loading && isAdmin,
    queryKey: ["admin", "missing-videos"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("lessons").select("id, title, video_url, order_index, courses:course_id (id, title, slug, published)").order("order_index", {
        ascending: true
      });
      if (error) throw error;
      return (data ?? []).map((lesson) => {
        const check = buildCourseVideoEmbedUrl(lesson.video_url);
        return {
          ...lesson,
          issue: check.ok ? null : check.message
        };
      }).filter((lesson) => lesson.issue);
    }
  });
  if (!loading && !isAdmin) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-6 py-16 max-w-xl mx-auto text-center", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ShieldAlert, { className: "h-10 w-10 mx-auto text-muted-foreground" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
        lineNumber: 51,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-3 font-medium", children: "Admins only." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
        lineNumber: 52,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
      lineNumber: 50,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
      lineNumber: 49,
      columnNumber: 12
    }, this);
  }
  const rows = q.data ?? [];
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 sm:px-6 lg:px-10 py-8 max-w-7xl", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap items-end justify-between gap-4 mb-6", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs uppercase tracking-widest text-primary font-medium", children: "Admin QA" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
          lineNumber: 61,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "mt-1 text-2xl sm:text-3xl font-display font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(VideoOff, { className: "h-6 w-6 text-primary" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
            lineNumber: 65,
            columnNumber: 15
          }, this),
          " Missing lesson videos"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
          lineNumber: 64,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1", children: "Lessons with empty or invalid video URLs that can break the player." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
          lineNumber: 67,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
        lineNumber: 60,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => q.refetch(), children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefreshCw, { className: `h-4 w-4 ${q.isFetching ? "animate-spin" : ""}` }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
          lineNumber: 72,
          columnNumber: 13
        }, this),
        " Refresh"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
        lineNumber: 71,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
      lineNumber: 59,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card overflow-hidden", children: q.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-12 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
      lineNumber: 78,
      columnNumber: 15
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
      lineNumber: 77,
      columnNumber: 26
    }, this) : rows.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-12 text-center text-sm text-muted-foreground", children: "All lessons have playable video URLs." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
      lineNumber: 79,
      columnNumber: 42
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Table, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TableHeader, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TableRow, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TableHead, { children: "Course" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
          lineNumber: 84,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TableHead, { children: "Lesson" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
          lineNumber: 85,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TableHead, { children: "Issue" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
          lineNumber: 86,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TableHead, { children: "Current URL" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
          lineNumber: 87,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TableHead, { className: "text-right", children: "Fix" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
          lineNumber: 88,
          columnNumber: 19
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
        lineNumber: 83,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
        lineNumber: 82,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TableBody, { children: rows.map((row) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TableRow, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
          row.courses?.title ?? "Untitled course",
          row.courses?.published ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-[10px]", children: "Live" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
            lineNumber: 96,
            columnNumber: 51
          }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", className: "text-[10px]", children: "Draft" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
            lineNumber: 98,
            columnNumber: 38
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
          lineNumber: 94,
          columnNumber: 23
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
          lineNumber: 93,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TableCell, { children: [
          row.order_index + 1,
          ". ",
          row.title
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
          lineNumber: 103,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TableCell, { className: "text-destructive text-xs", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TriangleAlert, { className: "h-3.5 w-3.5 inline mr-1" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
            lineNumber: 107,
            columnNumber: 23
          }, this),
          row.issue
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
          lineNumber: 106,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TableCell, { className: "max-w-[280px] truncate font-mono text-xs text-muted-foreground", children: row.video_url || "Empty" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
          lineNumber: 110,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, size: "sm", variant: "outline", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/studio", children: "Open Studio" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
          lineNumber: 115,
          columnNumber: 25
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
          lineNumber: 114,
          columnNumber: 23
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
          lineNumber: 113,
          columnNumber: 21
        }, this)
      ] }, row.id, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
        lineNumber: 92,
        columnNumber: 34
      }, this)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
        lineNumber: 91,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
      lineNumber: 81,
      columnNumber: 22
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
      lineNumber: 76,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
    lineNumber: 58,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.missing-videos.tsx?tsr-split=component",
    lineNumber: 57,
    columnNumber: 10
  }, this);
}
export {
  MissingVideosPage as component
};
