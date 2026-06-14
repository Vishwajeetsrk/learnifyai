import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AppShell } from "./AppShell-BXcQmjDj.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { I as Input } from "./input-BHvIASyb.mjs";
import { L as Label } from "./label-Dmhuxdmf.mjs";
import { T as Textarea } from "./textarea-7FPcqnpF.mjs";
import { b as CircleCheck, aA as CircleX, r as Clock, L as LoaderCircle, k as Sparkles } from "../_libs/lucide-react.mjs";
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
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
function ApplyCreator() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const nav = useNavigate();
  const [motivation, setMotivation] = reactExports.useState("");
  const [expertise, setExpertise] = reactExports.useState("");
  const [portfolio, setPortfolio] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const appQuery = useQuery({
    enabled: !!user,
    queryKey: ["creator-app", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("creator_applications").select("*").eq("user_id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  async function submit() {
    if (!user) return;
    if (motivation.trim().length < 30) return toast.error("Tell us a bit more (min 30 chars)");
    setSubmitting(true);
    const {
      error
    } = await supabase.from("creator_applications").insert({
      user_id: user.id,
      motivation: motivation.trim(),
      expertise: expertise.trim() || null,
      portfolio_url: portfolio.trim() || null
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Application submitted!");
    qc.invalidateQueries({
      queryKey: ["creator-app"]
    });
  }
  const existing = appQuery.data;
  const statusIcon = existing?.status === "approved" ? CircleCheck : existing?.status === "rejected" ? CircleX : Clock;
  const statusColor = existing?.status === "approved" ? "text-emerald-600" : existing?.status === "rejected" ? "text-destructive" : "text-amber-500";
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 md:px-10 py-10 max-w-2xl", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs uppercase tracking-widest text-primary font-medium", children: "Creator Program" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
      lineNumber: 59,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "mt-1 text-3xl font-display font-semibold", children: "Become a Learnify Creator" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
      lineNumber: 62,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-muted-foreground mt-2", children: "Publish premium courses, earn from every enrollment, and reach thousands of learners." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
      lineNumber: 63,
      columnNumber: 9
    }, this),
    appQuery.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
      lineNumber: 68,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
      lineNumber: 67,
      columnNumber: 31
    }, this) : existing ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 rounded-2xl border bg-card p-6 shadow-card", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
        (() => {
          const Icon = statusIcon;
          return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Icon, { className: `h-5 w-5 ${statusColor}` }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
            lineNumber: 73,
            columnNumber: 20
          }, this);
        })(),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-xl font-semibold capitalize", children: existing.status }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
          lineNumber: 75,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
        lineNumber: 70,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-2 text-sm text-muted-foreground", children: [
        existing.status === "approved" && "You're in! You can now publish courses from Creator Studio.",
        existing.status === "pending" && "Your application is under review. We'll notify you shortly.",
        existing.status === "rejected" && "Your application wasn't accepted this time."
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
        lineNumber: 77,
        columnNumber: 13
      }, this),
      existing.admin_notes && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-4 rounded-lg bg-muted p-4 text-sm", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs uppercase text-muted-foreground mb-1", children: "Admin notes" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
          lineNumber: 83,
          columnNumber: 17
        }, this),
        existing.admin_notes
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
        lineNumber: 82,
        columnNumber: 38
      }, this),
      existing.status === "approved" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { className: "mt-5", onClick: () => nav({
        to: "/studio"
      }), children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
          lineNumber: 89,
          columnNumber: 17
        }, this),
        " Open Creator Studio"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
        lineNumber: 86,
        columnNumber: 48
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
      lineNumber: 69,
      columnNumber: 31
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 rounded-2xl border bg-card p-6 shadow-card space-y-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { htmlFor: "expertise", children: "Your area of expertise" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
          lineNumber: 93,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { id: "expertise", value: expertise, onChange: (e) => setExpertise(e.target.value), placeholder: "e.g. AI engineering, Design systems, DSA", maxLength: 120 }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
          lineNumber: 94,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
        lineNumber: 92,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { htmlFor: "portfolio", children: "Portfolio / website (optional)" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
          lineNumber: 97,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { id: "portfolio", value: portfolio, onChange: (e) => setPortfolio(e.target.value), placeholder: "https://", maxLength: 255 }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
          lineNumber: 98,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
        lineNumber: 96,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { htmlFor: "motivation", children: "Why do you want to teach on Learnify?" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
          lineNumber: 101,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Textarea, { id: "motivation", rows: 5, maxLength: 1e3, value: motivation, onChange: (e) => setMotivation(e.target.value), placeholder: "Tell us about your experience and what you'd teach…" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
          lineNumber: 102,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[10px] text-muted-foreground text-right", children: [
          motivation.length,
          "/1000"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
          lineNumber: 103,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
        lineNumber: 100,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: submit, disabled: submitting, className: "w-full", children: [
        submitting ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
          lineNumber: 108,
          columnNumber: 29
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
          lineNumber: 108,
          columnNumber: 76
        }, this),
        " ",
        "Submit application"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
        lineNumber: 107,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
      lineNumber: 91,
      columnNumber: 20
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
    lineNumber: 58,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/apply-creator.tsx?tsr-split=component",
    lineNumber: 57,
    columnNumber: 10
  }, this);
}
export {
  ApplyCreator as component
};
