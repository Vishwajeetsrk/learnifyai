import { e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { M as MarketingPage } from "./MarketingPage-CGOjau1k.mjs";
import { g as getPlatformStats, A as AnimatedCounter } from "./stats.functions-mKen3CaI.mjs";
import { R as Reveal, S as StaggerGroup, a as StaggerItem } from "./Reveal-Bq96pMeu.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./SiteFooter-CadeW0CQ.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
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
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "./router-BGh9Ntsg.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./client.server-BbcUHF3e.mjs";
import "../_libs/zod.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/lucide-react.mjs";
import "./createSsrRpc-BR3wbl1z.mjs";
import "./server-BLOOEPZP.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function AboutPage() {
  const {
    data
  } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: () => getPlatformStats(),
    refetchInterval: 15e3
  });
  const stats = [{
    value: Math.max(data?.learners ?? 0, 12e4),
    suffix: "+",
    label: "Active learners",
    compact: true
  }, {
    value: Math.max(data?.courses ?? 0, 3400),
    suffix: "+",
    label: "Courses shipped",
    compact: true
  }, {
    value: data?.countries ?? 42,
    suffix: "",
    label: "Countries",
    compact: false
  }];
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MarketingPage, { eyebrow: "About", title: "Learning, reimagined.", subtitle: "We believe the next generation of education is personal, AI-augmented, and creator-driven.", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Reveal, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "prose prose-neutral dark:prose-invert max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { children: "Our mission" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/about.tsx?tsr-split=component",
        lineNumber: 34,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { children: "Make world-class learning accessible to every curious mind on the planet. We're building the intelligent learning OS — one platform where learners study, creators teach, and coaches grow careers." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/about.tsx?tsr-split=component",
        lineNumber: 35,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { children: "Why now" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/about.tsx?tsr-split=component",
        lineNumber: 40,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { children: "AI has changed what a single teacher can do, what a single learner can absorb, and what a single creator can ship. Learnify is the home for that shift." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/about.tsx?tsr-split=component",
        lineNumber: 41,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { children: "Where we're going" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/about.tsx?tsr-split=component",
        lineNumber: 45,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { children: "From AI tutoring to live cohorts, certificates, career coaching, and a fully native creator economy — all in one cohesive product." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/about.tsx?tsr-split=component",
        lineNumber: 46,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/about.tsx?tsr-split=component",
      lineNumber: 33,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/about.tsx?tsr-split=component",
      lineNumber: 32,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StaggerGroup, { className: "mt-16 grid md:grid-cols-3 gap-6", children: stats.map((s) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StaggerItem, { variant: "scale", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.div, { whileHover: {
      y: -6,
      scale: 1.02
    }, transition: {
      type: "spring",
      stiffness: 300,
      damping: 18
    }, className: "rounded-2xl border border-border/60 bg-card p-8 text-center hover:border-primary/40 hover:shadow-glow transition h-full", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AnimatedCounter, { value: s.value, suffix: s.suffix, compact: s.compact, className: "font-display text-4xl font-semibold text-primary inline-block" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/about.tsx?tsr-split=component",
        lineNumber: 62,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-sm text-muted-foreground mt-2", children: s.label }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/about.tsx?tsr-split=component",
        lineNumber: 63,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/about.tsx?tsr-split=component",
      lineNumber: 54,
      columnNumber: 13
    }, this) }, s.label, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/about.tsx?tsr-split=component",
      lineNumber: 53,
      columnNumber: 25
    }, this)) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/about.tsx?tsr-split=component",
      lineNumber: 52,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/about.tsx?tsr-split=component",
    lineNumber: 31,
    columnNumber: 10
  }, this);
}
export {
  AboutPage as component
};
