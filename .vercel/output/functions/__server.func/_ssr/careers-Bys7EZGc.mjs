import { e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { M as MarketingPage } from "./MarketingPage-CGOjau1k.mjs";
import { S as StaggerGroup, a as StaggerItem, R as Reveal } from "./Reveal-Bq96pMeu.mjs";
import { s as supabase } from "./router-BGh9Ntsg.mjs";
import { u as useSiteSettings } from "./SiteFooter-CadeW0CQ.mjs";
import "../_libs/sonner.mjs";
import { L as LoaderCircle, z as Briefcase, s as MapPin } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./client.server-BbcUHF3e.mjs";
import "../_libs/zod.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "./ThemeToggle-DNuVEMie.mjs";
import "./learnify-logo-CyXPmSny.mjs";
import "./button-s-7T9USx.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
function CareersPage() {
  const {
    data: settings
  } = useSiteSettings();
  const careersEmail = settings?.careers_email || "careers@learnify.ai";
  const {
    data: roles,
    isLoading
  } = useQuery({
    queryKey: ["jobs-public"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("job_postings").select("id,title,team,location,description,apply_url").eq("active", true).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MarketingPage, { eyebrow: "Careers", title: "Build the future of learning with us.", subtitle: "A small, ambitious team building tools for a billion learners.", children: [
    isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
      lineNumber: 39,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
      lineNumber: 38,
      columnNumber: 20
    }, this) : !roles || roles.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-center text-muted-foreground py-12", children: "No open roles right now. Email us anytime." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
      lineNumber: 40,
      columnNumber: 49
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StaggerGroup, { className: "space-y-3", stagger: 0.06, children: roles.map((r) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StaggerItem, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.a, { href: r.apply_url || `mailto:${careersEmail}?subject=Application`, target: r.apply_url?.startsWith("http") ? "_blank" : void 0, rel: "noreferrer", whileHover: {
      x: 4,
      y: -2
    }, transition: {
      type: "spring",
      stiffness: 320,
      damping: 22
    }, className: "block rounded-xl border border-border/60 bg-card p-5 hover:shadow-glow hover:border-primary/40 transition-colors group", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-semibold group-hover:text-primary transition-colors", children: r.title }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
          lineNumber: 54,
          columnNumber: 21
        }, this),
        r.description && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1 line-clamp-2", children: r.description }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
          lineNumber: 57,
          columnNumber: 39
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Briefcase, { className: "h-3.5 w-3.5" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
              lineNumber: 62,
              columnNumber: 25
            }, this),
            r.team
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
            lineNumber: 61,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MapPin, { className: "h-3.5 w-3.5" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
              lineNumber: 66,
              columnNumber: 25
            }, this),
            r.location
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
            lineNumber: 65,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
          lineNumber: 60,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
        lineNumber: 53,
        columnNumber: 19
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-sm text-primary shrink-0 transition-transform group-hover:translate-x-1", children: "Apply →" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
        lineNumber: 71,
        columnNumber: 19
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
      lineNumber: 52,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
      lineNumber: 44,
      columnNumber: 15
    }, this) }, r.id, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
      lineNumber: 43,
      columnNumber: 27
    }, this)) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
      lineNumber: 42,
      columnNumber: 16
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Reveal, { delay: 0.2, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-10 text-center text-sm text-muted-foreground", children: [
      "Don't see your role? Email",
      " ",
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { className: "text-primary hover:underline", href: `mailto:${careersEmail}`, children: careersEmail }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
        lineNumber: 81,
        columnNumber: 11
      }, this),
      "."
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
      lineNumber: 79,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
      lineNumber: 78,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/careers.tsx?tsr-split=component",
    lineNumber: 37,
    columnNumber: 10
  }, this);
}
export {
  CareersPage as component
};
