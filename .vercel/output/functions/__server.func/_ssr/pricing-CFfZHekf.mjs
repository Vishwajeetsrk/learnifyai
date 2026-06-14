import { e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { M as MarketingPage } from "./MarketingPage-CGOjau1k.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { s as supabase } from "./router-BGh9Ntsg.mjs";
import "../_libs/sonner.mjs";
import { L as LoaderCircle, c as Check } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
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
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
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
function PricingPage() {
  const {
    data: tiers,
    isLoading,
    error
  } = useQuery({
    queryKey: ["pricing-plans"],
    queryFn: async () => {
      const {
        data,
        error: error2
      } = await supabase.from("pricing_plans").select("id,name,price_label,description,features,cta_label,cta_to,highlighted").eq("active", true).order("order_index", {
        ascending: true
      });
      if (error2) throw error2;
      return (data ?? []).map((plan) => ({
        ...plan,
        features: Array.isArray(plan.features) ? plan.features : []
      }));
    },
    retry: false
  });
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MarketingPage, { eyebrow: "Pricing", title: "Simple pricing. Real value.", subtitle: "Start free. Upgrade when Learnify becomes part of your routine.", children: isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/pricing.tsx?tsr-split=component",
    lineNumber: 41,
    columnNumber: 11
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/pricing.tsx?tsr-split=component",
    lineNumber: 40,
    columnNumber: 20
  }, this) : error ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3 rounded-3xl border border-destructive/20 bg-destructive/5 p-10 text-center", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-lg font-semibold text-destructive", children: "Pricing is currently unavailable." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/pricing.tsx?tsr-split=component",
      lineNumber: 43,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground", children: "We couldn't load the pricing details right now. Please refresh or try again later." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/pricing.tsx?tsr-split=component",
      lineNumber: 46,
      columnNumber: 11
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/pricing.tsx?tsr-split=component",
    lineNumber: 42,
    columnNumber: 26
  }, this) : !tiers || tiers.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-center text-muted-foreground py-12", children: "Pricing coming soon." }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/pricing.tsx?tsr-split=component",
    lineNumber: 49,
    columnNumber: 49
  }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid md:grid-cols-3 gap-6", children: tiers.map((t) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: `rounded-2xl border p-8 flex flex-col ${t.highlighted ? "border-primary/50 bg-card shadow-xl shadow-primary/10 ring-1 ring-primary/20" : "border-border/60 bg-card"}`, children: [
    t.highlighted && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "inline-flex self-start rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-medium mb-4", children: "Most popular" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/pricing.tsx?tsr-split=component",
      lineNumber: 51,
      columnNumber: 33
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display text-2xl font-semibold", children: t.name }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/pricing.tsx?tsr-split=component",
      lineNumber: 54,
      columnNumber: 15
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-3 text-4xl font-bold tracking-tight", children: t.price_label }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/pricing.tsx?tsr-split=component",
      lineNumber: 55,
      columnNumber: 15
    }, this),
    t.description && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-2 text-sm text-muted-foreground", children: t.description }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/pricing.tsx?tsr-split=component",
      lineNumber: 56,
      columnNumber: 33
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "mt-6 space-y-3 text-sm flex-1", children: t.features.map((f, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "flex items-start gap-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { className: "h-4 w-4 text-primary mt-0.5 shrink-0" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/pricing.tsx?tsr-split=component",
        lineNumber: 59,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: f }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/pricing.tsx?tsr-split=component",
        lineNumber: 60,
        columnNumber: 21
      }, this)
    ] }, i, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/pricing.tsx?tsr-split=component",
      lineNumber: 58,
      columnNumber: 43
    }, this)) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/pricing.tsx?tsr-split=component",
      lineNumber: 57,
      columnNumber: 15
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, className: "mt-8 w-full", variant: t.highlighted ? "default" : "outline", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: t.cta_to, children: t.cta_label }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/pricing.tsx?tsr-split=component",
      lineNumber: 64,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/pricing.tsx?tsr-split=component",
      lineNumber: 63,
      columnNumber: 15
    }, this)
  ] }, t.id, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/pricing.tsx?tsr-split=component",
    lineNumber: 50,
    columnNumber: 27
  }, this)) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/pricing.tsx?tsr-split=component",
    lineNumber: 49,
    columnNumber: 131
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/pricing.tsx?tsr-split=component",
    lineNumber: 39,
    columnNumber: 10
  }, this);
}
export {
  PricingPage as component
};
