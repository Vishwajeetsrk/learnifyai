import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { I as Input } from "./input-BHvIASyb.mjs";
import { L as Label } from "./label-Dmhuxdmf.mjs";
import { s as supabase } from "./router-BGh9Ntsg.mjs";
import { L as LoaderCircle, E as EyeOff, a as Eye } from "../_libs/lucide-react.mjs";
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
function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [sessionReady, setSessionReady] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) setSessionReady(true);
      else if (event === "SIGNED_OUT") setSessionReady(false);
    });
    supabase.auth.getSession().then(({
      data
    }) => {
      if (data.session) {
        setSessionReady(true);
      } else {
        setTimeout(async () => {
          const {
            data: again
          } = await supabase.auth.getSession();
          setSessionReady(!!again.session);
        }, 800);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("Password must be at least 8 characters.");
    setSubmitting(true);
    const {
      error
    } = await supabase.auth.updateUser({
      password
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated.");
    navigate({
      to: "/dashboard",
      replace: true
    });
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-h-screen bg-hero flex items-center justify-center px-4", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-full max-w-md bg-card border rounded-2xl p-8 shadow-card", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-2xl font-display font-semibold mb-1", children: "Set a new password" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
      lineNumber: 62,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mb-6", children: "Pick something strong you'll remember." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
      lineNumber: 63,
      columnNumber: 9
    }, this),
    sessionReady === null && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 text-sm text-muted-foreground py-6", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
        lineNumber: 66,
        columnNumber: 13
      }, this),
      " Verifying reset link…"
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
      lineNumber: 65,
      columnNumber: 35
    }, this),
    sessionReady === false && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-sm text-destructive", children: "Your reset link is invalid or has expired. Reset links can only be used once and expire after a short time." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
        lineNumber: 70,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, className: "w-full", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/forgot-password", children: "Request a new link" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
        lineNumber: 75,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
        lineNumber: 74,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
      lineNumber: 69,
      columnNumber: 36
    }, this),
    sessionReady === true && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { htmlFor: "password", children: "New password" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
          lineNumber: 81,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { id: "password", type: showPassword ? "text" : "password", required: true, minLength: 8, value: password, onChange: (e) => setPassword(e.target.value), className: "pr-10" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
            lineNumber: 83,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { type: "button", onClick: () => setShowPassword((v) => !v), className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", "aria-label": showPassword ? "Hide password" : "Show password", children: showPassword ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(EyeOff, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
            lineNumber: 85,
            columnNumber: 35
          }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Eye, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
            lineNumber: 85,
            columnNumber: 68
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
            lineNumber: 84,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
          lineNumber: 82,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
        lineNumber: 80,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "submit", className: "w-full", disabled: submitting, children: [
        submitting && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
          lineNumber: 90,
          columnNumber: 30
        }, this),
        "Update password"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
        lineNumber: 89,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
      lineNumber: 79,
      columnNumber: 35
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
    lineNumber: 61,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/reset-password.tsx?tsr-split=component",
    lineNumber: 60,
    columnNumber: 10
  }, this);
}
export {
  ResetPasswordPage as component
};
