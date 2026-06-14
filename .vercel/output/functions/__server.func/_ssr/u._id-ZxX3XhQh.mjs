import { e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { A as AppShell, a as Avatar, b as AvatarImage, c as AvatarFallback } from "./AppShell-BXcQmjDj.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { g as getPublicProfile } from "./profile.functions-CeSHSID-.mjs";
import { R as Route$s } from "./router-BGh9Ntsg.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { L as LoaderCircle, q as Calendar, U as Users, I as Heart, J as Award, l as GraduationCap, d as BookOpen } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "./button-s-7T9USx.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
import "./createSsrRpc-BR3wbl1z.mjs";
import "./server-BLOOEPZP.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/zod.mjs";
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
function PublicProfilePage() {
  const {
    id
  } = Route$s.useParams();
  const fetchProfile = useServerFn(getPublicProfile);
  const q = useQuery({
    queryKey: ["public-profile", id],
    queryFn: () => fetchProfile({
      data: {
        id
      }
    })
  });
  if (q.isLoading) return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-20 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
    lineNumber: 26,
    columnNumber: 11
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
    lineNumber: 25,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
    lineNumber: 24,
    columnNumber: 27
  }, this);
  if (!q.data) return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-20 text-center text-sm text-muted-foreground", children: "Profile not found." }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
    lineNumber: 30,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
    lineNumber: 29,
    columnNumber: 23
  }, this);
  const {
    profile,
    subscribers,
    likes,
    certificates,
    enrolled,
    created
  } = q.data;
  const name = profile.full_name ?? "Learner";
  const initials = name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 sm:px-6 lg:px-10 py-8 max-w-6xl", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-3xl border bg-card p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-5", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Avatar, { className: "h-24 w-24", children: [
        profile.avatar_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AvatarImage, { src: profile.avatar_url, alt: "" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
          lineNumber: 46,
          columnNumber: 36
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AvatarFallback, { className: "text-2xl", children: initials }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
          lineNumber: 47,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
        lineNumber: 45,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "font-display text-3xl font-semibold tracking-tight", children: name }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
          lineNumber: 50,
          columnNumber: 13
        }, this),
        profile.bio && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-2 max-w-2xl", children: profile.bio }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
          lineNumber: 51,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap gap-x-5 gap-y-1 mt-3 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Calendar, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
              lineNumber: 54,
              columnNumber: 17
            }, this),
            " Joined",
            " ",
            format(new Date(profile.created_at), "MMM yyyy")
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
            lineNumber: 53,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Users, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
              lineNumber: 58,
              columnNumber: 17
            }, this),
            " ",
            subscribers,
            " subscribers"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
            lineNumber: 57,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Heart, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
              lineNumber: 61,
              columnNumber: 17
            }, this),
            " ",
            likes,
            " likes given"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
            lineNumber: 60,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Award, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
              lineNumber: 64,
              columnNumber: 17
            }, this),
            " ",
            certificates,
            " certificates"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
            lineNumber: 63,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
          lineNumber: 52,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
        lineNumber: 49,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
      lineNumber: 44,
      columnNumber: 9
    }, this),
    created.length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { className: "mt-10", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-xl font-semibold mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(GraduationCap, { className: "h-5 w-5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
          lineNumber: 72,
          columnNumber: 15
        }, this),
        " Courses created"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
        lineNumber: 71,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CourseGrid, { courses: created }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
        lineNumber: 74,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
      lineNumber: 70,
      columnNumber: 32
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { className: "mt-10", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-xl font-semibold mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(BookOpen, { className: "h-5 w-5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
          lineNumber: 79,
          columnNumber: 13
        }, this),
        " Enrolled courses"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
        lineNumber: 78,
        columnNumber: 11
      }, this),
      enrolled.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card p-10 text-center text-sm text-muted-foreground", children: "No enrolled courses yet." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
        lineNumber: 81,
        columnNumber: 36
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CourseGrid, { courses: enrolled }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
        lineNumber: 83,
        columnNumber: 22
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
      lineNumber: 77,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
    lineNumber: 43,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
    lineNumber: 42,
    columnNumber: 10
  }, this);
}
function CourseGrid({
  courses
}) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: courses.map((c) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/courses/$slug", params: {
    slug: c.slug
  }, className: "group rounded-2xl border bg-card overflow-hidden shadow-card hover:shadow-lg transition", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "aspect-video bg-muted overflow-hidden", children: c.cover_url ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: c.cover_url, alt: "", className: "w-full h-full object-cover group-hover:scale-105 transition-transform", loading: "lazy" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
      lineNumber: 104,
      columnNumber: 28
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-full h-full grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(GraduationCap, { className: "h-10 w-10 text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
      lineNumber: 105,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
      lineNumber: 104,
      columnNumber: 160
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
      lineNumber: 103,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4", children: [
      c.category && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", className: "text-[10px]", children: c.category }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
        lineNumber: 109,
        columnNumber: 28
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "mt-2 font-display font-semibold leading-snug line-clamp-2 group-hover:text-primary", children: c.title }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
        lineNumber: 112,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
      lineNumber: 108,
      columnNumber: 11
    }, this)
  ] }, c.id, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
    lineNumber: 100,
    columnNumber: 25
  }, this)) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/u.$id.tsx?tsr-split=component",
    lineNumber: 99,
    columnNumber: 10
  }, this);
}
export {
  PublicProfilePage as component
};
