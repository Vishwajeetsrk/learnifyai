import { e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { f as useLocation, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-BXcQmjDj.mjs";
import { C as CreatorGate, a as CreatorTabs } from "./CreatorTabs-BevizuQm.mjs";
import { C as Card } from "./card-1p_vtslP.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import "../_libs/sonner.mjs";
import { U as Users, d as BookOpen, a as Eye, I as Heart, ad as IndianRupee, ai as ExternalLink, M as MessageSquare } from "../_libs/lucide-react.mjs";
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
const inr = (n) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
}).format(n);
function CreatorHub() {
  const {
    user
  } = useAuth();
  const overview = useQuery({
    enabled: !!user,
    queryKey: ["creator-overview", user?.id],
    queryFn: async () => {
      const uid = user.id;
      const {
        data: courses
      } = await supabase.from("courses").select("id, slug, title, cover_url, price_inr, published, created_at").eq("created_by", uid).order("created_at", {
        ascending: false
      });
      const courseIds = (courses ?? []).map((c) => c.id);
      const [{
        count: subs
      }, lessonsRes, enrollmentsRes] = await Promise.all([supabase.from("creator_subscriptions").select("*", {
        count: "exact",
        head: true
      }).eq("creator_id", uid), courseIds.length ? supabase.from("lessons").select("id, course_id, title").in("course_id", courseIds) : Promise.resolve({
        data: []
      }), courseIds.length ? supabase.from("enrollments").select("course_id").in("course_id", courseIds) : Promise.resolve({
        data: []
      })]);
      const lessons = lessonsRes.data ?? [];
      const lessonIds = lessons.map((l) => l.id);
      const [{
        count: likes
      }, {
        count: views
      }, recentComments] = await Promise.all([lessonIds.length ? supabase.from("lesson_likes").select("*", {
        count: "exact",
        head: true
      }).in("lesson_id", lessonIds) : Promise.resolve({
        count: 0
      }), lessonIds.length ? supabase.from("lesson_views").select("*", {
        count: "exact",
        head: true
      }).in("lesson_id", lessonIds) : Promise.resolve({
        count: 0
      }), lessonIds.length ? supabase.from("lesson_comments").select("id, body, created_at, lesson_id, user_id").in("lesson_id", lessonIds).order("created_at", {
        ascending: false
      }).limit(5) : Promise.resolve({
        data: []
      })]);
      const enrolls = enrollmentsRes.data ?? [];
      const enrollByCourse = /* @__PURE__ */ new Map();
      enrolls.forEach((e) => enrollByCourse.set(e.course_id, (enrollByCourse.get(e.course_id) ?? 0) + 1));
      const earnings = (courses ?? []).reduce((sum, c) => sum + (enrollByCourse.get(c.id) ?? 0) * Number(c.price_inr ?? 0), 0);
      const totalEnrolls = enrolls.length;
      const commentsByLesson = new Map(lessons.map((l) => [l.id, l.title]));
      return {
        courses: courses ?? [],
        subs: subs ?? 0,
        likes: likes ?? 0,
        views: views ?? 0,
        earnings,
        totalEnrolls,
        recentComments: (recentComments.data ?? []).map((c) => ({
          ...c,
          lesson_title: commentsByLesson.get(c.lesson_id) ?? "Lesson"
        })),
        enrollByCourse,
        lessonsByCourse: lessons.reduce((acc, l) => {
          acc[l.course_id] = (acc[l.course_id] ?? 0) + 1;
          return acc;
        }, {})
      };
    }
  });
  const data = overview.data;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 sm:px-6 lg:px-10 py-8 max-w-7xl", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreatorTabs, {}, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
      lineNumber: 99,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-end justify-between flex-wrap gap-4 mt-6", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs uppercase tracking-widest text-primary font-medium", children: "Creator Hub" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
          lineNumber: 102,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "mt-1 text-3xl font-display font-semibold tracking-tight", children: "Your creator dashboard" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
          lineNumber: 105,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-muted-foreground mt-1 text-sm", children: "Audience, engagement, and revenue at a glance." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
          lineNumber: 108,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
        lineNumber: 101,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, variant: "outline", size: "sm", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/studio", children: "Open Studio" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
          lineNumber: 114,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
          lineNumber: 113,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, size: "sm", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/creator/settings", children: "Creator settings" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
          lineNumber: 117,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
          lineNumber: 116,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
        lineNumber: 112,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
      lineNumber: 100,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 grid grid-cols-2 lg:grid-cols-5 gap-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Stat, { icon: Users, label: "Subscribers", value: data?.subs ?? 0 }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
        lineNumber: 123,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Stat, { icon: BookOpen, label: "Enrollments", value: data?.totalEnrolls ?? 0 }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
        lineNumber: 124,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Stat, { icon: Eye, label: "Lesson views", value: data?.views ?? 0 }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
        lineNumber: 125,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Stat, { icon: Heart, label: "Likes", value: data?.likes ?? 0 }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
        lineNumber: 126,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Stat, { icon: IndianRupee, label: "Gross earnings", value: inr(data?.earnings ?? 0) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
        lineNumber: 127,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
      lineNumber: 122,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display font-semibold", children: "Your courses" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
            lineNumber: 133,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/studio", children: "Manage in Studio" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
            lineNumber: 135,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
            lineNumber: 134,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
          lineNumber: 132,
          columnNumber: 13
        }, this),
        !data?.courses.length ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-12 text-center text-sm text-muted-foreground", children: [
          "No courses yet.",
          " ",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/studio", className: "text-primary underline", children: "Create one in Studio" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
            lineNumber: 140,
            columnNumber: 17
          }, this),
          "."
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
          lineNumber: 138,
          columnNumber: 38
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "divide-y", children: data.courses.map((c) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-12 w-20 rounded-md bg-muted overflow-hidden shrink-0", children: c.cover_url ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: c.cover_url, alt: c.title, className: "w-full h-full object-cover" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
            lineNumber: 147,
            columnNumber: 38
          }, this) : null }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
            lineNumber: 146,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-sm font-medium truncate", children: c.title }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
              lineNumber: 150,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] text-muted-foreground mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                data.lessonsByCourse[c.id] ?? 0,
                " lessons"
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
                lineNumber: 152,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                data.enrollByCourse.get(c.id) ?? 0,
                " enrolled"
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
                lineNumber: 153,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: inr(Number(c.price_inr ?? 0)) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
                lineNumber: 154,
                columnNumber: 25
              }, this),
              !c.published && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", className: "text-[10px]", children: "Draft" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
                lineNumber: 155,
                columnNumber: 42
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
              lineNumber: 151,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
            lineNumber: 149,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, variant: "ghost", size: "icon", "aria-label": "Open course", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/courses/$slug", params: {
            slug: c.slug
          }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ExternalLink, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
            lineNumber: 164,
            columnNumber: 25
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
            lineNumber: 161,
            columnNumber: 23
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
            lineNumber: 160,
            columnNumber: 21
          }, this)
        ] }, c.id, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
          lineNumber: 145,
          columnNumber: 40
        }, this)) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
          lineNumber: 144,
          columnNumber: 24
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
        lineNumber: 131,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MessageSquare, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
              lineNumber: 174,
              columnNumber: 17
            }, this),
            " Recent comments"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
            lineNumber: 173,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/creator/comments", children: "View all" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
            lineNumber: 177,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
            lineNumber: 176,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
          lineNumber: 172,
          columnNumber: 13
        }, this),
        !data?.recentComments.length ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground py-6 text-center", children: "No comments yet." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
          lineNumber: 180,
          columnNumber: 45
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "space-y-3", children: data.recentComments.map((c) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "text-sm", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "line-clamp-2", children: c.body }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
            lineNumber: 182,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-muted-foreground mt-1", children: [
            "on ",
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-medium", children: c.lesson_title }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
              lineNumber: 184,
              columnNumber: 26
            }, this),
            " ·",
            " ",
            new Date(c.created_at).toLocaleDateString()
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
            lineNumber: 183,
            columnNumber: 21
          }, this)
        ] }, c.id, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
          lineNumber: 181,
          columnNumber: 47
        }, this)) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
          lineNumber: 180,
          columnNumber: 130
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
        lineNumber: 171,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
      lineNumber: 130,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
    lineNumber: 98,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
    lineNumber: 97,
    columnNumber: 10
  }, this);
}
function CreatorRouteShell() {
  const location = useLocation();
  if (location.pathname !== "/creator") return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Outlet, {}, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
    lineNumber: 196,
    columnNumber: 48
  }, this);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreatorHub, {}, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
    lineNumber: 197,
    columnNumber: 10
  }, this);
}
function Stat({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "p-4", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Icon, { className: "h-3.5 w-3.5" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
        lineNumber: 210,
        columnNumber: 9
      }, this),
      " ",
      label
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
      lineNumber: 209,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-1 text-2xl font-display font-semibold", children: value }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
      lineNumber: 212,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
    lineNumber: 208,
    columnNumber: 10
  }, this);
}
const SplitComponent = () => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreatorGate, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreatorRouteShell, {}, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
  lineNumber: 216,
  columnNumber: 7
}, void 0) }, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.tsx?tsr-split=component",
  lineNumber: 215,
  columnNumber: 30
}, void 0);
export {
  SplitComponent as component
};
