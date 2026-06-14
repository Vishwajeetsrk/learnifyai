import { e as jsxDevRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-BXcQmjDj.mjs";
import { P as Progress } from "./progress-BdEZ1sO8.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { B as Button, c as cn } from "./button-s-7T9USx.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { g as getCourseActionLabel } from "./course-player-MW9-dEKE.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BR3wbl1z.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BVm8xUae.mjs";
import { P as Provider, R as Root3, T as Trigger, a as Portal, C as Content2 } from "../_libs/radix-ui__react-tooltip.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { d as BookOpen, l as GraduationCap, J as Award, T as Trophy, aF as NotebookPen, q as Calendar, aG as FileBadge, A as ArrowRight, L as LoaderCircle, F as CirclePlay, aH as CodeXml, O as FileCheckCorner, k as Sparkles, aI as Info, s as MapPin, z as Briefcase, c as Check } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-progress.mjs";
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
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
const getRecommendedCourses = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("a7c24171bf57ffee1da0697bb684003a49aeebe73f78cd1b93f8840650b57cbb"));
const TooltipProvider = Provider;
const Tooltip = Root3;
const TooltipTrigger = Trigger;
const TooltipContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Portal, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)",
      className
    ),
    ...props
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/tooltip.tsx",
    lineNumber: 19,
    columnNumber: 5
  },
  void 0
) }, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/tooltip.tsx",
  lineNumber: 18,
  columnNumber: 3
}, void 0));
TooltipContent.displayName = Content2.displayName;
function RecommendedCourses() {
  const fn = useServerFn(getRecommendedCourses);
  const q = useQuery({
    queryKey: ["recommended-courses"],
    queryFn: () => fn(),
    staleTime: 5 * 60 * 1e3
  });
  if (q.isLoading || !q.data || q.data.items.length === 0) return null;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TooltipProvider, { delayDuration: 150, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-10", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-xl font-semibold flex items-center gap-2 text-foreground", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-5 w-5 text-primary" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
          lineNumber: 25,
          columnNumber: 13
        }, this),
        " Recommended for you"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
        lineNumber: 24,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        Link,
        {
          to: "/courses",
          className: "text-xs text-primary hover:underline inline-flex items-center gap-1",
          children: [
            "Browse all ",
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowRight, { className: "h-3 w-3" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
              lineNumber: 31,
              columnNumber: 24
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
          lineNumber: 27,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
      lineNumber: 23,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mb-4", children: q.data.summary }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
      lineNumber: 34,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: q.data.items.slice(0, 6).map((c) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "div",
      {
        className: "group rounded-2xl border bg-card text-card-foreground overflow-hidden shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col motion-reduce:transform-none motion-reduce:transition-none",
        children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Link,
            {
              to: "/courses/$slug",
              params: { slug: c.slug },
              preload: "intent",
              className: "aspect-video bg-muted overflow-hidden block",
              "aria-label": `Open ${c.title}`,
              children: c.cover_url ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "img",
                {
                  src: c.cover_url,
                  alt: c.title,
                  loading: "lazy",
                  className: "w-full h-full object-cover group-hover:scale-105 transition motion-reduce:transform-none"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                  lineNumber: 49,
                  columnNumber: 19
                },
                this
              ) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-full h-full grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(GraduationCap, { className: "h-10 w-10 text-muted-foreground" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                lineNumber: 57,
                columnNumber: 21
              }, this) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                lineNumber: 56,
                columnNumber: 19
              }, this)
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
              lineNumber: 41,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 flex-1 flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
              c.category && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", className: "text-[10px]", children: c.category }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                lineNumber: 64,
                columnNumber: 21
              }, this),
              c.level && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-[10px]", children: c.level }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                lineNumber: 69,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
              lineNumber: 62,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Link,
              {
                to: "/courses/$slug",
                params: { slug: c.slug },
                preload: "intent",
                className: "font-display font-semibold text-sm line-clamp-2 group-hover:text-primary transition text-foreground",
                children: c.title
              },
              void 0,
              false,
              {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                lineNumber: 74,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-lg bg-muted/60 border border-border/50 px-2 py-1.5 flex items-start gap-1.5", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-3 w-3 text-primary mt-0.5 shrink-0" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                lineNumber: 85,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[10px] uppercase tracking-wide text-muted-foreground font-medium flex items-center gap-1", children: [
                  "Why this?",
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Tooltip, { children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "button",
                      {
                        type: "button",
                        "aria-label": "How recommendations are scored",
                        className: "text-muted-foreground hover:text-foreground",
                        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Info, { className: "h-2.5 w-2.5" }, void 0, false, {
                          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                          lineNumber: 96,
                          columnNumber: 29
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                        lineNumber: 91,
                        columnNumber: 27
                      },
                      this
                    ) }, void 0, false, {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                      lineNumber: 90,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TooltipContent, { side: "top", className: "max-w-[220px] text-xs", children: "Based on the categories and levels of courses you've enrolled in, weighted by your progress." }, void 0, false, {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                      lineNumber: 99,
                      columnNumber: 25
                    }, this)
                  ] }, void 0, true, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                    lineNumber: 89,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                  lineNumber: 87,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] text-foreground/80 line-clamp-2", children: c.reason }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                  lineNumber: 105,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                lineNumber: 86,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
              lineNumber: 84,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1.5 mt-auto pt-1", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, size: "sm", variant: "default", className: "h-7 px-2 text-xs flex-1", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/courses/$slug", params: { slug: c.slug }, preload: "intent", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CirclePlay, { className: "h-3 w-3 mr-1" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                  lineNumber: 113,
                  columnNumber: 23
                }, this),
                " Start learning"
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                lineNumber: 112,
                columnNumber: 21
              }, this) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                lineNumber: 111,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Tooltip, { children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, size: "sm", variant: "outline", className: "h-7 px-2 text-xs", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  Link,
                  {
                    to: "/courses/$slug",
                    params: { slug: c.slug },
                    hash: "syllabus",
                    preload: "intent",
                    "aria-label": "View syllabus",
                    children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(BookOpen, { className: "h-3 w-3" }, void 0, false, {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                      lineNumber: 126,
                      columnNumber: 27
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                    lineNumber: 119,
                    columnNumber: 25
                  },
                  this
                ) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                  lineNumber: 118,
                  columnNumber: 23
                }, this) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                  lineNumber: 117,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TooltipContent, { side: "top", children: "View syllabus" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                  lineNumber: 130,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
                lineNumber: 116,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
              lineNumber: 110,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
            lineNumber: 61,
            columnNumber: 15
          }, this)
        ]
      },
      c.id,
      true,
      {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
        lineNumber: 37,
        columnNumber: 13
      },
      this
    )) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
      lineNumber: 35,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
    lineNumber: 22,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/RecommendedCourses.tsx",
    lineNumber: 21,
    columnNumber: 5
  }, this);
}
function DashboardEventsJobs() {
  const eventsQ = useQuery({
    queryKey: ["dashboard-events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("id, title, starts_at, location, image_url, rsvp_url").gte("starts_at", (/* @__PURE__ */ new Date()).toISOString()).order("starts_at", { ascending: true }).limit(3);
      return data ?? [];
    }
  });
  const jobsQ = useQuery({
    queryKey: ["dashboard-jobs"],
    queryFn: async () => {
      const { data } = await supabase.from("job_postings").select("id, title, team, location, apply_url, created_at").eq("active", true).order("created_at", { ascending: false }).limit(3);
      return data ?? [];
    }
  });
  const events = eventsQ.data ?? [];
  const jobs = jobsQ.data ?? [];
  if (events.length === 0 && jobs.length === 0) return null;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { className: "rounded-2xl border bg-card shadow-card p-5", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-lg font-semibold flex items-center gap-2 text-foreground", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Calendar, { className: "h-4 w-4 text-primary" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
            lineNumber: 44,
            columnNumber: 13
          }, this),
          " Upcoming Events"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
          lineNumber: 43,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Link,
          {
            to: "/events",
            className: "text-xs text-primary hover:underline inline-flex items-center gap-1",
            children: [
              "View all ",
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowRight, { className: "h-3 w-3" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
                lineNumber: 50,
                columnNumber: 22
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
            lineNumber: 46,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
        lineNumber: 42,
        columnNumber: 9
      }, this),
      events.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground py-6 text-center", children: "No upcoming events." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
        lineNumber: 54,
        columnNumber: 11
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "space-y-3", children: events.map((e) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "flex gap-3", children: [
        e.image_url ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "img",
          {
            src: e.image_url,
            alt: "",
            className: "h-14 w-20 rounded-md object-cover shrink-0 border",
            loading: "lazy"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
            lineNumber: 60,
            columnNumber: 19
          },
          this
        ) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-14 w-20 rounded-md bg-muted grid place-items-center shrink-0", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Calendar, { className: "h-5 w-5 text-muted-foreground" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
          lineNumber: 68,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
          lineNumber: 67,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-medium text-sm text-foreground truncate", children: e.title }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
            lineNumber: 72,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] text-muted-foreground mt-0.5 flex flex-wrap gap-x-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: format(new Date(e.starts_at), "dd MMM · p") }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
              lineNumber: 74,
              columnNumber: 21
            }, this),
            e.location && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "inline-flex items-center gap-0.5", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MapPin, { className: "h-3 w-3" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
                lineNumber: 77,
                columnNumber: 25
              }, this),
              e.location
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
              lineNumber: 76,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
            lineNumber: 73,
            columnNumber: 19
          }, this),
          e.rsvp_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "a",
            {
              href: e.rsvp_url,
              target: "_blank",
              rel: "noreferrer",
              className: "text-[11px] text-primary hover:underline",
              children: "RSVP →"
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
              lineNumber: 83,
              columnNumber: 21
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
          lineNumber: 71,
          columnNumber: 17
        }, this)
      ] }, e.id, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
        lineNumber: 58,
        columnNumber: 15
      }, this)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
        lineNumber: 56,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
      lineNumber: 41,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { className: "rounded-2xl border bg-card shadow-card p-5", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-lg font-semibold flex items-center gap-2 text-foreground", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Briefcase, { className: "h-4 w-4 text-primary" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
            lineNumber: 103,
            columnNumber: 13
          }, this),
          " Latest Jobs"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
          lineNumber: 102,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Link,
          {
            to: "/careers",
            className: "text-xs text-primary hover:underline inline-flex items-center gap-1",
            children: [
              "View all ",
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowRight, { className: "h-3 w-3" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
                lineNumber: 109,
                columnNumber: 22
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
            lineNumber: 105,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
        lineNumber: 101,
        columnNumber: 9
      }, this),
      jobs.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground py-6 text-center", children: "No open roles right now." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
        lineNumber: 113,
        columnNumber: 11
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "space-y-3", children: jobs.map((j) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "li",
        {
          className: "rounded-lg border border-border/60 p-3 hover:border-primary/40 transition-colors",
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-medium text-sm text-foreground", children: j.title }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
              lineNumber: 121,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] text-muted-foreground mt-0.5 flex flex-wrap gap-x-2", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: j.team }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
                lineNumber: 123,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                "· ",
                j.location
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
                lineNumber: 124,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
              lineNumber: 122,
              columnNumber: 17
            }, this),
            j.apply_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "a",
              {
                href: j.apply_url,
                target: "_blank",
                rel: "noreferrer",
                className: "text-[11px] text-primary hover:underline mt-1 inline-block",
                children: "Apply →"
              },
              void 0,
              false,
              {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
                lineNumber: 127,
                columnNumber: 19
              },
              this
            )
          ]
        },
        j.id,
        true,
        {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
          lineNumber: 117,
          columnNumber: 15
        },
        this
      )) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
        lineNumber: 115,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
      lineNumber: 100,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DashboardEventsJobs.tsx",
    lineNumber: 39,
    columnNumber: 5
  }, this);
}
function DashboardPage() {
  const {
    user,
    isAdmin
  } = useAuth();
  const name = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "there";
  const enrollQ = useQuery({
    enabled: !!user,
    queryKey: ["enrollments", user?.id],
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("enrollments").select("*, courses:course_id (id, slug, title, cover_url, category, level, instructor)").eq("user_id", user.id).order("last_activity_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const certsQ = useQuery({
    enabled: !!user,
    queryKey: ["my-certs", user?.id],
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    queryFn: async () => {
      const {
        data
      } = await supabase.from("certificates").select("course_id, code, score, total, issued_at").eq("user_id", user.id);
      return data ?? [];
    }
  });
  const attemptsQ = useQuery({
    enabled: !!user,
    queryKey: ["my-attempts", user?.id],
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    queryFn: async () => {
      const {
        data
      } = await supabase.from("mcq_attempts").select("course_id, score, total, passed, created_at").eq("user_id", user.id).order("created_at", {
        ascending: false
      });
      return data ?? [];
    }
  });
  const certMap = new Map((certsQ.data ?? []).map((c) => [c.course_id, c]));
  const attemptsByCourse = {};
  (attemptsQ.data ?? []).forEach((a) => {
    (attemptsByCourse[a.course_id] ||= []).push(a);
  });
  const enrolled = enrollQ.data ?? [];
  const totalCompleted = enrolled.filter((e) => e.status === "completed").length;
  const totalCerts = (certsQ.data ?? []).length;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 sm:px-6 lg:px-10 py-8 max-w-6xl", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-2xl sm:text-3xl font-display font-semibold tracking-tight", children: [
      "Welcome back, ",
      name,
      "."
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 72,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-muted-foreground mt-1 text-sm", children: "Track your courses, tests, and certificates." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 75,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StatCard, { label: "Enrolled", value: String(enrolled.length), icon: BookOpen }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 80,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StatCard, { label: "Completed", value: String(totalCompleted), icon: GraduationCap }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 81,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StatCard, { label: "Certificates", value: String(totalCerts), icon: Award }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 82,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StatCard, { label: "Test attempts", value: String((attemptsQ.data ?? []).length), icon: Trophy }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 83,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 79,
      columnNumber: 9
    }, this),
    isAdmin && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] uppercase tracking-wider text-muted-foreground mb-2 font-medium", children: "Admin shortcuts" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 87,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AdminShortcut, { to: "/admin/content", icon: NotebookPen, title: "Content Manager", desc: "Events, jobs, pricing, FAQs" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 91,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AdminShortcut, { to: "/admin/content", search: {
          tab: "events"
        }, icon: Calendar, title: "Events & Jobs", desc: "Create, edit, delete listings" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 92,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AdminShortcut, { to: "/admin/content", search: {
          tab: "cert-templates"
        }, icon: FileBadge, title: "Certificate Templates", desc: "Design & manage templates" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 95,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AdminShortcut, { to: "/studio", icon: NotebookPen, title: "Course Builder", desc: "Add lessons & modules" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 98,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 90,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 86,
      columnNumber: 21
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-xl font-semibold", children: "My Learning" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 104,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/courses", className: "text-xs text-primary hover:underline inline-flex items-center gap-1", children: [
          "Browse more ",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowRight, { className: "h-3 w-3" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
            lineNumber: 106,
            columnNumber: 27
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 105,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 103,
        columnNumber: 11
      }, this),
      enrollQ.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-16 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 111,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 110,
        columnNumber: 32
      }, this) : enrolled.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card p-12 text-center shadow-card", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(BookOpen, { className: "h-10 w-10 mx-auto text-muted-foreground" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 113,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-3 font-medium", children: "No courses yet." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 114,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1", children: "Enroll in a course to start learning and tracking progress." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 115,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/courses", className: "text-sm text-primary mt-3 inline-block", children: "Explore courses →" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 118,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 112,
        columnNumber: 46
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: enrolled.map((e) => {
        const cert = certMap.get(e.course_id);
        const attempts = attemptsByCourse[e.course_id] ?? [];
        const best = attempts.reduce((b, a) => a.score / Math.max(a.total, 1) > (b ?? 0) ? a.score / Math.max(a.total, 1) : b ?? 0, 0);
        const actionLabel = getCourseActionLabel(e.progress_pct, e.status);
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "group rounded-2xl border bg-card overflow-hidden shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/courses/$slug", params: {
            slug: e.courses?.slug
          }, className: "block", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "aspect-video bg-muted overflow-hidden", children: e.courses?.cover_url ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: e.courses.cover_url, alt: e.courses.title, className: "w-full h-full object-cover group-hover:scale-105 transition", loading: "lazy" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
            lineNumber: 132,
            columnNumber: 49
          }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-full h-full grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(GraduationCap, { className: "h-10 w-10 text-muted-foreground" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
            lineNumber: 133,
            columnNumber: 29
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
            lineNumber: 132,
            columnNumber: 194
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
            lineNumber: 131,
            columnNumber: 23
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
            lineNumber: 128,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 flex-1 flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 text-[10px] uppercase", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", className: "text-[10px]", children: e.courses?.category }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
                lineNumber: 139,
                columnNumber: 25
              }, this),
              cert && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: "text-[10px] bg-emerald-500 hover:bg-emerald-500", children: "Certified" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
                lineNumber: 142,
                columnNumber: 34
              }, this),
              e.status === "completed" && !cert && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-[10px]", children: "Done" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
                lineNumber: 145,
                columnNumber: 63
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
              lineNumber: 138,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/courses/$slug", params: {
              slug: e.courses?.slug
            }, className: "font-display font-semibold line-clamp-2 group-hover:text-primary transition", children: e.courses?.title }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
              lineNumber: 149,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-1", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-between text-[11px] text-muted-foreground mb-1", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                  e.progress_pct,
                  "% complete"
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
                  lineNumber: 156,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: format(new Date(e.last_activity_at), "dd MMM") }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
                  lineNumber: 157,
                  columnNumber: 27
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
                lineNumber: 155,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Progress, { value: e.progress_pct, className: "h-1.5" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
                lineNumber: 159,
                columnNumber: 25
              }, this),
              attempts.length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[10px] text-muted-foreground mt-1.5", children: [
                attempts.length,
                " test attempt",
                attempts.length === 1 ? "" : "s",
                " · best",
                " ",
                Math.round(best * 100),
                "%"
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
                lineNumber: 160,
                columnNumber: 49
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
              lineNumber: 154,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-3 grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, size: "sm", variant: "default", className: "h-8 text-xs", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/courses/$slug", params: {
                slug: e.courses?.slug
              }, children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CirclePlay, { className: "h-3.5 w-3.5" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
                  lineNumber: 170,
                  columnNumber: 29
                }, this),
                " ",
                actionLabel
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
                lineNumber: 167,
                columnNumber: 27
              }, this) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
                lineNumber: 166,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, size: "sm", variant: "outline", className: "h-8 text-xs", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/courses/$slug", params: {
                slug: e.courses?.slug
              }, search: {
                tab: "playground"
              }, children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CodeXml, { className: "h-3.5 w-3.5" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
                  lineNumber: 179,
                  columnNumber: 29
                }, this),
                " Playground"
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
                lineNumber: 174,
                columnNumber: 27
              }, this) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
                lineNumber: 173,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
              lineNumber: 165,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
            lineNumber: 137,
            columnNumber: 21
          }, this)
        ] }, e.id, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 127,
          columnNumber: 20
        }, this);
      }) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 121,
        columnNumber: 22
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 102,
      columnNumber: 9
    }, this),
    (certsQ.data ?? []).length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-10", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-xl font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Award, { className: "h-5 w-5 text-primary" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
            lineNumber: 193,
            columnNumber: 17
          }, this),
          " Your Certificates"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 192,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/certificates", className: "text-xs text-primary hover:underline inline-flex items-center gap-1", children: [
          "View all ",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowRight, { className: "h-3 w-3" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
            lineNumber: 196,
            columnNumber: 26
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 195,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 191,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: (certsQ.data ?? []).slice(0, 3).map((c) => {
        const pct = c.total ? Math.round(c.score / c.total * 100) : 0;
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/certificates/$code", params: {
          code: c.code
        }, className: "group rounded-xl p-4 text-white bg-gradient-to-br from-indigo-600 to-violet-700 shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Award, { className: "h-5 w-5" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
              lineNumber: 206,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: "bg-white/15 hover:bg-white/15 text-[10px] backdrop-blur", children: [
              pct,
              "%"
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
              lineNumber: 207,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
            lineNumber: 205,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-6 text-[10px] uppercase tracking-[0.25em] opacity-80", children: "Certificate" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
            lineNumber: 211,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-display font-semibold leading-tight line-clamp-2", children: enrolled.find((e) => e.course_id === c.course_id)?.courses?.title ?? "Course" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
            lineNumber: 214,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[10px] opacity-80 mt-2 font-mono", children: [
            format(new Date(c.issued_at), "dd MMM yyyy"),
            " · #",
            c.code.slice(0, 8)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
            lineNumber: 217,
            columnNumber: 21
          }, this)
        ] }, c.code, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 202,
          columnNumber: 20
        }, this);
      }) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 199,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 190,
      columnNumber: 44
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/submissions", className: "rounded-2xl border bg-card p-5 shadow-card hover:shadow-lg transition", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(FileCheckCorner, { className: "h-5 w-5 text-primary" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 227,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "mt-3 font-display font-semibold", children: "My Submissions" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 228,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground mt-1", children: "View status and feedback on your assignment work." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 229,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 226,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/ai-tools", className: "rounded-2xl border bg-card p-5 shadow-card hover:shadow-lg transition", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trophy, { className: "h-5 w-5 text-primary" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 234,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "mt-3 font-display font-semibold", children: "AI Tools History" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 235,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground mt-1", children: "Reuse past quizzes, flashcards, and study briefs." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 236,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 233,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 225,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RecommendedCourses, {}, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 242,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DashboardEventsJobs, {}, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 244,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(UpgradePlans, {}, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 246,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
    lineNumber: 71,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
    lineNumber: 70,
    columnNumber: 10
  }, this);
}
function UpgradePlans() {
  const {
    data: plans,
    isLoading
  } = useQuery({
    queryKey: ["dashboard-pricing-plans"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("pricing_plans").select("*").eq("active", true).order("order_index", {
        ascending: true
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  if (isLoading || !plans || plans.length === 0) return null;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-12", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-xl font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-5 w-5 text-primary" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 271,
          columnNumber: 11
        }, this),
        " Upgrade your plan"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 270,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/pricing", className: "text-xs text-primary hover:underline inline-flex items-center gap-1", children: [
        "Compare all ",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowRight, { className: "h-3 w-3" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 274,
          columnNumber: 23
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 273,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 269,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mb-5", children: "Unlock unlimited AI sessions, premium courses, and creator tools." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 277,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: plans.slice(0, 3).map((p) => {
      const features = Array.isArray(p.features) ? p.features : [];
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: `relative rounded-2xl border p-6 shadow-card hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col ${p.highlighted ? "border-primary/60 bg-gradient-to-b from-primary/5 to-card" : "bg-card"}`, children: [
        p.highlighted && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: "absolute -top-2 right-4 bg-primary text-primary-foreground", children: "Popular" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 284,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold text-lg", children: p.name }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 287,
          columnNumber: 15
        }, this),
        p.description && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground mt-1", children: p.description }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 288,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-4 font-display text-3xl font-semibold", children: p.price_label }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 289,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "mt-4 space-y-2 flex-1", children: features.slice(0, 5).map((f, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "flex items-start gap-2 text-xs", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { className: "h-3.5 w-3.5 text-primary shrink-0 mt-0.5" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
            lineNumber: 292,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: f }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
            lineNumber: 293,
            columnNumber: 21
          }, this)
        ] }, i, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 291,
          columnNumber: 53
        }, this)) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 290,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, className: `mt-6 w-full ${p.highlighted ? "" : "bg-foreground text-background hover:bg-foreground/90"}`, variant: p.highlighted ? "default" : "default", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: p.cta_to, children: p.cta_label }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 297,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
          lineNumber: 296,
          columnNumber: 15
        }, this)
      ] }, p.id, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 283,
        columnNumber: 16
      }, this);
    }) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 280,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
    lineNumber: 268,
    columnNumber: 10
  }, this);
}
function StatCard({
  label,
  value,
  icon: Icon
}) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-xl border bg-card p-4 sm:p-5 shadow-card", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Icon, { className: "h-5 w-5 text-primary" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 314,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-3 text-2xl font-display font-semibold", children: value }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 315,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground mt-1", children: label }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 316,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
    lineNumber: 313,
    columnNumber: 10
  }, this);
}
function AdminShortcut({
  to,
  search,
  icon: Icon,
  title,
  desc
}) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to, search, className: "group rounded-xl border bg-card p-4 shadow-card hover:shadow-lg hover:-translate-y-0.5 transition flex items-start gap-3", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Icon, { className: "h-5 w-5" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 334,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 333,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-display font-semibold text-sm group-hover:text-primary transition-colors", children: title }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 337,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground mt-0.5", children: desc }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
        lineNumber: 340,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 336,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowRight, { className: "h-4 w-4 text-muted-foreground ml-auto self-center opacity-0 group-hover:opacity-100 transition" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
      lineNumber: 342,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/dashboard.tsx?tsr-split=component",
    lineNumber: 332,
    columnNumber: 10
  }, this);
}
export {
  DashboardPage as component
};
