import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { I as Input } from "./input-BHvIASyb.mjs";
import { L as Label } from "./label-Dmhuxdmf.mjs";
import { s as supabase } from "./router-BGh9Ntsg.mjs";
import { L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/zod.mjs";
function ForgotPasswordPage() {
  const [email, setEmail] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [sent, setSent] = reactExports.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const {
      error
    } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    setSent(true);
    toast.success("Check your inbox for a reset link.");
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-h-screen bg-hero flex items-center justify-center px-4", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-full max-w-md bg-card border rounded-2xl p-8 shadow-card", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-2xl font-display font-semibold mb-1", children: "Forgot your password?" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/forgot-password.tsx?tsr-split=component",
      lineNumber: 28,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mb-6", children: "We'll email you a link to reset it." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/forgot-password.tsx?tsr-split=component",
      lineNumber: 29,
      columnNumber: 9
    }, this),
    sent ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-sm text-muted-foreground", children: [
      "If an account exists for ",
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-foreground font-medium", children: email }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/forgot-password.tsx?tsr-split=component",
        lineNumber: 31,
        columnNumber: 38
      }, this),
      ", a reset link is on the way."
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/forgot-password.tsx?tsr-split=component",
      lineNumber: 30,
      columnNumber: 17
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { htmlFor: "email", children: "Email" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/forgot-password.tsx?tsr-split=component",
          lineNumber: 35,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/forgot-password.tsx?tsr-split=component",
          lineNumber: 36,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/forgot-password.tsx?tsr-split=component",
        lineNumber: 34,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "submit", className: "w-full", disabled: submitting, children: [
        submitting && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/forgot-password.tsx?tsr-split=component",
          lineNumber: 39,
          columnNumber: 30
        }, this),
        "Send reset link"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/forgot-password.tsx?tsr-split=component",
        lineNumber: 38,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/forgot-password.tsx?tsr-split=component",
      lineNumber: 33,
      columnNumber: 20
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-6 text-center text-sm text-muted-foreground", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/login", className: "text-primary hover:underline", children: "Back to sign in" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/forgot-password.tsx?tsr-split=component",
      lineNumber: 44,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/forgot-password.tsx?tsr-split=component",
      lineNumber: 43,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/forgot-password.tsx?tsr-split=component",
    lineNumber: 27,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/forgot-password.tsx?tsr-split=component",
    lineNumber: 26,
    columnNumber: 10
  }, this);
}
export {
  ForgotPasswordPage as component
};
