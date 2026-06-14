import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { I as Input$1 } from "./input-BHvIASyb.mjs";
import { L as Label } from "./label-Dmhuxdmf.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BR3wbl1z.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import { l as logoUrl } from "./learnify-logo-CyXPmSny.mjs";
import "../_libs/seroval.mjs";
import { E as EyeOff, a as Eye, L as LoaderCircle } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const Input = objectType({
  email: stringType().email(),
  fullName: stringType().max(120).optional()
});
const sendWelcomeEmail = createServerFn({
  method: "POST"
}).inputValidator((input) => Input.parse(input)).handler(createSsrRpc("2c8daa5f1ea93e574a34c03dce003349931bbef772e387a1cafe14f69bdf379b"));
function SignupPage() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    loading
  } = useAuth();
  const welcomeEmailFn = useServerFn(sendWelcomeEmail);
  const [fullName, setFullName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!loading && isAuthenticated) navigate({
      to: "/dashboard",
      replace: true
    });
  }, [loading, isAuthenticated, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const {
      data,
      error
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: fullName
        }
      }
    });
    setSubmitting(false);
    if (error) {
      return toast.error(error.message);
    }
    try {
      await welcomeEmailFn({
        data: {
          email,
          fullName
        }
      });
    } catch {
    }
    toast.success("Account created — welcome to Learnify AI!");
    if (data?.session) {
      navigate({
        to: "/dashboard",
        replace: true
      });
    } else {
      navigate({
        to: "/login",
        replace: true
      });
    }
  };
  const handleGoogle = async () => {
    const {
      data,
      error
    } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    if (error) {
      toast.error(error.message ?? "Google sign-in failed");
      return;
    }
    if (data?.url) {
      window.location.href = data.url;
    }
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-h-screen bg-hero flex items-center justify-center px-4 py-12", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/", className: "flex items-center justify-center mb-8", "aria-label": "Learnify AI", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: logoUrl, alt: "Learnify AI", className: "h-12 w-auto" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
      lineNumber: 95,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
      lineNumber: 94,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-card border rounded-2xl p-8 shadow-card", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-2xl font-display font-semibold mb-1", children: "Create your account" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
        lineNumber: 98,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mb-6", children: "Start learning smarter in seconds." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
        lineNumber: 99,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "button", variant: "outline", className: "w-full mb-4", onClick: handleGoogle, children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
            lineNumber: 103,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
            lineNumber: 104,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("path", { fill: "#FBBC05", d: "M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
            lineNumber: 105,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
            lineNumber: 106,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
          lineNumber: 102,
          columnNumber: 13
        }, this),
        "Continue with Google"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
        lineNumber: 101,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3 my-4 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-px flex-1 bg-border" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
          lineNumber: 112,
          columnNumber: 13
        }, this),
        " OR ",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-px flex-1 bg-border" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
          lineNumber: 112,
          columnNumber: 58
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
        lineNumber: 111,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { htmlFor: "name", children: "Full name" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
            lineNumber: 117,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$1, { id: "name", required: true, value: fullName, onChange: (e) => setFullName(e.target.value), placeholder: "Ada Lovelace" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
            lineNumber: 118,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
          lineNumber: 116,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { htmlFor: "email", children: "Email" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
            lineNumber: 121,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$1, { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.com" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
            lineNumber: 122,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
          lineNumber: 120,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { htmlFor: "password", children: "Password" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
            lineNumber: 125,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$1, { id: "password", type: showPassword ? "text" : "password", required: true, minLength: 8, value: password, onChange: (e) => setPassword(e.target.value), className: "pr-10" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
              lineNumber: 127,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { type: "button", onClick: () => setShowPassword((v) => !v), className: "absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground", "aria-label": showPassword ? "Hide password" : "Show password", children: showPassword ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(EyeOff, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
              lineNumber: 129,
              columnNumber: 35
            }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Eye, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
              lineNumber: 129,
              columnNumber: 68
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
              lineNumber: 128,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
            lineNumber: 126,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-1 text-xs text-muted-foreground", children: "At least 8 characters." }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
            lineNumber: 132,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
          lineNumber: 124,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "submit", className: "w-full", disabled: submitting, children: [
          submitting && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
            lineNumber: 135,
            columnNumber: 30
          }, this),
          "Create account"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
          lineNumber: 134,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
        lineNumber: 115,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-6 text-center text-sm text-muted-foreground", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/login", className: "text-primary hover:underline", children: "Sign in" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
          lineNumber: 142,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
        lineNumber: 140,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
      lineNumber: 97,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
    lineNumber: 93,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/signup.tsx?tsr-split=component",
    lineNumber: 92,
    columnNumber: 10
  }, this);
}
export {
  SignupPage as component
};
