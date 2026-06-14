import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { M as MarketingPage } from "./MarketingPage-CGOjau1k.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { I as Input } from "./input-BHvIASyb.mjs";
import { T as Textarea } from "./textarea-7FPcqnpF.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useSiteSettings } from "./SiteFooter-CadeW0CQ.mjs";
import { u as Mail, M as MessageSquare, f as Twitter } from "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "./ThemeToggle-DNuVEMie.mjs";
import "./learnify-logo-CyXPmSny.mjs";
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
function ContactPage() {
  const [sending, setSending] = reactExports.useState(false);
  const {
    data: s
  } = useSiteSettings();
  const onSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent — we'll get back within 24 hours.");
      e.target.reset();
    }, 600);
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MarketingPage, { eyebrow: "Contact", title: "Say hello.", subtitle: "Sales, support, partnerships, or just a friendly chat — we read everything.", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid md:grid-cols-2 gap-10", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("form", { onSubmit, className: "space-y-4 rounded-2xl border border-border/60 bg-card p-6", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "text-sm font-medium", children: "Name" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
          lineNumber: 27,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { required: true, placeholder: "Your name", className: "mt-1.5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
          lineNumber: 28,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
        lineNumber: 26,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "text-sm font-medium", children: "Email" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
          lineNumber: 31,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { required: true, type: "email", placeholder: "you@example.com", className: "mt-1.5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
          lineNumber: 32,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
        lineNumber: 30,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "text-sm font-medium", children: "Message" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
          lineNumber: 35,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Textarea, { required: true, rows: 5, placeholder: "How can we help?", className: "mt-1.5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
          lineNumber: 36,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
        lineNumber: 34,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "submit", disabled: sending, className: "w-full", children: sending ? "Sending…" : "Send message" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
        lineNumber: 38,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
      lineNumber: 25,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: `mailto:${s?.contact_email ?? "hello@learnify.ai"}`, className: "flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 hover:border-primary/40 transition", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Mail, { className: "h-5 w-5 text-primary mt-0.5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
          lineNumber: 44,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-semibold", children: "Email us" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
            lineNumber: 46,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground", children: s?.contact_email ?? "hello@learnify.ai" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
            lineNumber: 47,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
          lineNumber: 45,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
        lineNumber: 43,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: s?.discord_url || "#", target: "_blank", rel: "noreferrer", className: "flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 hover:border-primary/40 transition", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MessageSquare, { className: "h-5 w-5 text-primary mt-0.5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
          lineNumber: 53,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-semibold", children: "Join Discord" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
            lineNumber: 55,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground", children: s?.discord_label ?? "Chat with the community in real time." }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
            lineNumber: 56,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
          lineNumber: 54,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
        lineNumber: 52,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: s?.twitter_url || "#", target: "_blank", rel: "noreferrer", className: "flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 hover:border-primary/40 transition", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Twitter, { className: "h-5 w-5 text-primary mt-0.5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
          lineNumber: 62,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-semibold", children: "Follow on X" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
            lineNumber: 64,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground", children: s?.twitter_handle ?? "@learnifyai" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
            lineNumber: 65,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
          lineNumber: 63,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
        lineNumber: 61,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
      lineNumber: 42,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
    lineNumber: 24,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/contact.tsx?tsr-split=component",
    lineNumber: 23,
    columnNumber: 10
  }, this);
}
export {
  ContactPage as component
};
