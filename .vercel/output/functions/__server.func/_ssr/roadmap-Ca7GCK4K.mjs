import { e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { M as MarketingPage } from "./MarketingPage-CGOjau1k.mjs";
import "../_libs/sonner.mjs";
import { C as Circle, L as LoaderCircle, b as CircleCheck } from "../_libs/lucide-react.mjs";
import "./SiteFooter-CadeW0CQ.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
const items = [{
  status: "done",
  title: "AI Tutor & Doubt Solver",
  desc: "Multi-model chat with course context."
}, {
  status: "done",
  title: "Courses, Modules & Lessons",
  desc: "Full course builder with assignments and MCQ tests."
}, {
  status: "done",
  title: "Wallet & Cart Checkout",
  desc: "Top-up, paid course enrollment, transaction history."
}, {
  status: "done",
  title: "Certificates",
  desc: "Issue, design, PDF download, QR verify, email delivery."
}, {
  status: "progress",
  title: "Cohort Live Sessions",
  desc: "Scheduled live rooms with recordings."
}, {
  status: "progress",
  title: "Creator Payouts",
  desc: "Automatic monthly creator settlements."
}, {
  status: "planned",
  title: "Mobile App",
  desc: "iOS + Android with offline lessons."
}, {
  status: "planned",
  title: "Skill Graph & Career AI",
  desc: "Personalized career paths with skill gap analysis."
}];
const icon = {
  done: CircleCheck,
  progress: LoaderCircle,
  planned: Circle
};
const labelClass = {
  done: "text-emerald-500",
  progress: "text-amber-500",
  planned: "text-muted-foreground"
};
const labelText = {
  done: "Shipped",
  progress: "In progress",
  planned: "Planned"
};
function RoadmapPage() {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MarketingPage, { eyebrow: "Roadmap", title: "Built in the open.", subtitle: "A living view of what we're shipping next.", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: items.map((it) => {
    const Icon = icon[it.status];
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-xl border border-border/60 bg-card p-5 flex items-start gap-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Icon, { className: `h-5 w-5 mt-0.5 shrink-0 ${labelClass[it.status]} ${it.status === "progress" ? "animate-spin" : ""}` }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/roadmap.tsx?tsr-split=component",
        lineNumber: 57,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-semibold", children: it.title }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/roadmap.tsx?tsr-split=component",
            lineNumber: 60,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: `text-xs uppercase tracking-wider ${labelClass[it.status]}`, children: labelText[it.status] }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/roadmap.tsx?tsr-split=component",
            lineNumber: 61,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/roadmap.tsx?tsr-split=component",
          lineNumber: 59,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1", children: it.desc }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/roadmap.tsx?tsr-split=component",
          lineNumber: 65,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/roadmap.tsx?tsr-split=component",
        lineNumber: 58,
        columnNumber: 15
      }, this)
    ] }, it.title, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/roadmap.tsx?tsr-split=component",
      lineNumber: 56,
      columnNumber: 16
    }, this);
  }) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/roadmap.tsx?tsr-split=component",
    lineNumber: 53,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/roadmap.tsx?tsr-split=component",
    lineNumber: 52,
    columnNumber: 10
  }, this);
}
export {
  RoadmapPage as component
};
