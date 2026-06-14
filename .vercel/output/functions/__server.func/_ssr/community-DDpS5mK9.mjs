import { e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { M as MarketingPage } from "./MarketingPage-CGOjau1k.mjs";
import { s as supabase } from "./router-BGh9Ntsg.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowRight, L as LoaderCircle, k as Sparkles, q as Calendar, U as Users } from "../_libs/lucide-react.mjs";
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
import "./SiteFooter-CadeW0CQ.mjs";
import "./ThemeToggle-DNuVEMie.mjs";
import "./learnify-logo-CyXPmSny.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
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
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const KIND_LABEL = {
  cohort: "Live cohort",
  office_hours: "Office hours",
  study_group: "Study group"
};
function CommunityPage() {
  const q = useQuery({
    queryKey: ["community-cohorts"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("cohorts").select("id, title, description, kind, starts_at, capacity, status").gte("starts_at", new Date(Date.now() - 864e5).toISOString()).order("starts_at", {
        ascending: true
      }).limit(50);
      return data ?? [];
    }
  });
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MarketingPage, { eyebrow: "Community", title: "Learn together, build together", subtitle: "Browse live cohorts, drop into office hours, or join a study group.", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-end mb-6", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/cohorts", children: [
      "Open community dashboard ",
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowRight, { className: "h-4 w-4" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
        lineNumber: 30,
        columnNumber: 38
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
      lineNumber: 29,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
      lineNumber: 28,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
      lineNumber: 27,
      columnNumber: 7
    }, this),
    q.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-16 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
      lineNumber: 35,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
      lineNumber: 34,
      columnNumber: 22
    }, this) : (q.data ?? []).length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card p-12 text-center", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-8 w-8 mx-auto text-muted-foreground mb-2" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
        lineNumber: 37,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-medium", children: "No upcoming sessions yet" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
        lineNumber: 38,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1", children: "Become a creator to host the first cohort." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
        lineNumber: 39,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
      lineNumber: 36,
      columnNumber: 48
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid md:grid-cols-2 gap-5", children: (q.data ?? []).map((c) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/cohorts/$id", params: {
      id: c.id
    }, className: "rounded-2xl border border-border/60 bg-card p-6 hover:shadow-lg transition group", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", className: "text-[10px]", children: KIND_LABEL[c.kind] ?? c.kind }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
          lineNumber: 47,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: c.status === "live" ? "default" : "outline", className: "capitalize", children: c.status }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
          lineNumber: 50,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
        lineNumber: 46,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "mt-3 font-display text-xl font-semibold group-hover:text-primary", children: c.title }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
        lineNumber: 54,
        columnNumber: 15
      }, this),
      c.description && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1 line-clamp-2", children: c.description }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
        lineNumber: 57,
        columnNumber: 33
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-3 flex items-center gap-4 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Calendar, { className: "h-3 w-3" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
            lineNumber: 60,
            columnNumber: 19
          }, this),
          " ",
          format(new Date(c.starts_at), "dd MMM, HH:mm")
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
          lineNumber: 59,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Users, { className: "h-3 w-3" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
            lineNumber: 63,
            columnNumber: 19
          }, this),
          " ",
          c.capacity,
          " seats"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
          lineNumber: 62,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
        lineNumber: 58,
        columnNumber: 15
      }, this)
    ] }, c.id, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
      lineNumber: 43,
      columnNumber: 36
    }, this)) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
      lineNumber: 42,
      columnNumber: 18
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/community.tsx?tsr-split=component",
    lineNumber: 26,
    columnNumber: 10
  }, this);
}
export {
  CommunityPage as component
};
