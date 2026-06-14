import { e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-BXcQmjDj.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import "../_libs/sonner.mjs";
import { J as Award, L as LoaderCircle, a6 as ShieldCheck, ai as ExternalLink, a5 as Download, u as Mail } from "../_libs/lucide-react.mjs";
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
function CertsPage() {
  const {
    user
  } = useAuth();
  const q = useQuery({
    enabled: !!user,
    queryKey: ["certificates-list", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("certificates").select("id, code, score, total, issued_at, course_id, courses:course_id (title, instructor, cover_url, slug, category)").eq("user_id", user.id).order("issued_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const certs = q.data ?? [];
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 sm:px-6 lg:px-10 py-8 max-w-6xl", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-xl", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "absolute -top-10 -right-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
        lineNumber: 32,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-amber-300/30 blur-2xl" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
        lineNumber: 33,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative flex items-center gap-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-14 w-14 rounded-2xl bg-white/15 backdrop-blur grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Award, { className: "h-7 w-7" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
          lineNumber: 36,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
          lineNumber: 35,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] uppercase tracking-[0.25em] opacity-80", children: "Learnify AI" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
            lineNumber: 39,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-2xl sm:text-3xl font-display font-semibold", children: "Your Certificates" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
            lineNumber: 40,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm opacity-90 mt-1", children: "Download as PDF, share publicly, or email a verified copy." }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
            lineNumber: 41,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
          lineNumber: 38,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "ml-auto hidden sm:block text-right", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-4xl font-display font-semibold", children: certs.length }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
            lineNumber: 46,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs opacity-80", children: "earned" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
            lineNumber: 47,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
          lineNumber: 45,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
        lineNumber: 34,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
      lineNumber: 31,
      columnNumber: 9
    }, this),
    q.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-20 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
      lineNumber: 53,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
      lineNumber: 52,
      columnNumber: 24
    }, this) : certs.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 rounded-2xl border bg-card p-12 text-center shadow-card", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ShieldCheck, { className: "h-10 w-10 mx-auto text-muted-foreground" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
        lineNumber: 55,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-3 font-medium", children: "No certificates yet." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
        lineNumber: 56,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1", children: "Complete a course and pass the final test to earn one." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
        lineNumber: 57,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/courses", className: "text-sm text-primary mt-3 inline-block", children: "Browse courses →" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
        lineNumber: 60,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
      lineNumber: 54,
      columnNumber: 41
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: certs.map((c) => {
      const pct = c.total ? Math.round(c.score / c.total * 100) : 0;
      `/certificates/${c.code}`;
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card overflow-hidden shadow-card flex flex-col", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "aspect-video relative bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-4 flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Award, { className: "h-5 w-5" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
              lineNumber: 70,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: "bg-white/15 hover:bg-white/15 text-[10px] backdrop-blur", children: [
              pct,
              "%"
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
              lineNumber: 71,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
            lineNumber: 69,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[10px] uppercase tracking-[0.25em] opacity-80", children: "Certificate of Completion" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
              lineNumber: 76,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-display font-semibold leading-tight line-clamp-2", children: c.courses?.title }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
              lineNumber: 79,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
            lineNumber: 75,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
          lineNumber: 68,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 flex-1 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 text-[11px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-[10px]", children: c.courses?.category }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
              lineNumber: 86,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
              "· ",
              format(new Date(c.issued_at), "dd MMM yyyy")
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
              lineNumber: 89,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
            lineNumber: 85,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground font-mono break-all", children: [
            "#",
            c.code
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
            lineNumber: 91,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-auto pt-3 grid grid-cols-3 gap-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, size: "sm", variant: "outline", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/certificates/$code", params: {
              code: c.code
            }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ExternalLink, { className: "h-3.5 w-3.5" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
              lineNumber: 97,
              columnNumber: 27
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
              lineNumber: 94,
              columnNumber: 25
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
              lineNumber: 93,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, size: "sm", variant: "outline", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/certificates/$code", params: {
              code: c.code
            }, search: {
              download: 1
            }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Download, { className: "h-3.5 w-3.5" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
              lineNumber: 106,
              columnNumber: 27
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
              lineNumber: 101,
              columnNumber: 25
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
              lineNumber: 100,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, size: "sm", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/certificates/$code", params: {
              code: c.code
            }, search: {
              email: 1
            }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Mail, { className: "h-3.5 w-3.5" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
              lineNumber: 115,
              columnNumber: 27
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
              lineNumber: 110,
              columnNumber: 25
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
              lineNumber: 109,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
            lineNumber: 92,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
          lineNumber: 84,
          columnNumber: 19
        }, this)
      ] }, c.id, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
        lineNumber: 67,
        columnNumber: 18
      }, this);
    }) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
      lineNumber: 63,
      columnNumber: 20
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
    lineNumber: 30,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/certificates.tsx?tsr-split=component",
    lineNumber: 29,
    columnNumber: 10
  }, this);
}
export {
  CertsPage as component
};
