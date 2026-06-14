import { e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { A as AppShell, a as Avatar, b as AvatarImage, c as AvatarFallback } from "./AppShell-BXcQmjDj.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { d as Route$a, u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as getCreatorAnalytics } from "./profile.functions-CeSHSID-.mjs";
import "../_libs/seroval.mjs";
import { L as LoaderCircle, av as ArrowLeft, U as Users, a_ as BellOff, m as Bell, l as GraduationCap, x as TrendingUp, a as Eye, I as Heart, d as BookOpen } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, L as Legend, b as Bar } from "../_libs/recharts.mjs";
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
import "./createSsrRpc-BR3wbl1z.mjs";
import "./server-BLOOEPZP.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/lodash.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
const inr = (n) => n === 0 ? "Free" : new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
}).format(n);
function CreatorProfile() {
  const {
    id
  } = Route$a.useParams();
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const profileQuery = useQuery({
    queryKey: ["creator-profile", id],
    queryFn: async () => {
      const [{
        data: profile
      }, {
        data: courses,
        error: cErr
      }, {
        count: subs
      }] = await Promise.all([supabase.from("profiles").select("id, full_name, avatar_url").eq("id", id).maybeSingle(), supabase.from("courses").select("id, slug, title, description, cover_url, category, level, price_inr, duration_minutes").eq("created_by", id).eq("published", true).order("created_at", {
        ascending: false
      }), supabase.from("creator_subscriptions").select("*", {
        count: "exact",
        head: true
      }).eq("creator_id", id)]);
      if (cErr) throw cErr;
      return {
        profile,
        courses: courses ?? [],
        subscribers: subs ?? 0
      };
    }
  });
  const subQuery = useQuery({
    enabled: !!user && user.id !== id,
    queryKey: ["my-sub", id, user?.id],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("creator_subscriptions").select("id").eq("subscriber_id", user.id).eq("creator_id", id).maybeSingle();
      return !!data;
    }
  });
  const toggleSub = async () => {
    if (!user) return navigate({
      to: "/login"
    });
    if (user.id === id) return;
    if (subQuery.data) {
      await supabase.from("creator_subscriptions").delete().eq("subscriber_id", user.id).eq("creator_id", id);
      toast.success("Unsubscribed");
    } else {
      const {
        error
      } = await supabase.from("creator_subscriptions").insert({
        subscriber_id: user.id,
        creator_id: id
      });
      if (error) return toast.error(error.message);
      toast.success("Subscribed — you'll get notified for new lessons");
    }
    qc.invalidateQueries({
      queryKey: ["my-sub", id, user.id]
    });
    qc.invalidateQueries({
      queryKey: ["creator-profile", id]
    });
  };
  if (profileQuery.isLoading) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-20 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
      lineNumber: 91,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
      lineNumber: 90,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
      lineNumber: 89,
      columnNumber: 12
    }, this);
  }
  const p = profileQuery.data;
  const name = p?.profile?.full_name ?? "Creator";
  const initials = name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  const subscribed = !!subQuery.data;
  const isSelf = user?.id === id;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 sm:px-6 lg:px-10 py-6 max-w-6xl", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/courses", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowLeft, { className: "h-4 w-4" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
        lineNumber: 103,
        columnNumber: 11
      }, this),
      " Back to courses"
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
      lineNumber: 102,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 rounded-3xl border bg-card p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-5", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Avatar, { className: "h-20 w-20", children: [
        p?.profile?.avatar_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AvatarImage, { src: p.profile.avatar_url, alt: "" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
          lineNumber: 108,
          columnNumber: 40
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AvatarFallback, { className: "text-xl", children: initials }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
          lineNumber: 109,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
        lineNumber: 107,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "font-display text-2xl sm:text-3xl font-semibold tracking-tight", children: name }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
          lineNumber: 112,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Users, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
              lineNumber: 117,
              columnNumber: 17
            }, this),
            " ",
            p?.subscribers ?? 0,
            " subscribers"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
            lineNumber: 116,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "·" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
            lineNumber: 119,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
            p?.courses.length ?? 0,
            " courses"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
            lineNumber: 120,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
          lineNumber: 115,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
        lineNumber: 111,
        columnNumber: 11
      }, this),
      !isSelf && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: toggleSub, variant: subscribed ? "outline" : "default", size: "lg", className: "rounded-full", "aria-pressed": subscribed, children: subscribed ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(BellOff, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
          lineNumber: 125,
          columnNumber: 19
        }, this),
        " Subscribed"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
        lineNumber: 124,
        columnNumber: 29
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Bell, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
          lineNumber: 127,
          columnNumber: 19
        }, this),
        " Subscribe"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
        lineNumber: 126,
        columnNumber: 23
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
        lineNumber: 123,
        columnNumber: 23
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
      lineNumber: 106,
      columnNumber: 9
    }, this),
    (isSelf || user && user.id) && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreatorAnalyticsBlock, { creatorId: id, canSee: isSelf }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
      lineNumber: 132,
      columnNumber: 50
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-xl font-semibold mt-10 mb-4", children: [
      "Courses by ",
      name
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
      lineNumber: 134,
      columnNumber: 9
    }, this),
    !p?.courses || p.courses.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card p-10 text-center text-sm text-muted-foreground", children: "No published courses yet." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
      lineNumber: 136,
      columnNumber: 50
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: p.courses.map((c) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/courses/$slug", params: {
      slug: c.slug
    }, className: "group rounded-2xl border bg-card overflow-hidden shadow-card hover:shadow-lg transition-all hover:-translate-y-0.5", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "aspect-video bg-muted overflow-hidden", children: c.cover_url ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: c.cover_url, alt: "", className: "w-full h-full object-cover group-hover:scale-105 transition-transform", loading: "lazy" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
        lineNumber: 143,
        columnNumber: 34
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-full h-full grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(GraduationCap, { className: "h-10 w-10 text-muted-foreground" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
        lineNumber: 144,
        columnNumber: 23
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
        lineNumber: 143,
        columnNumber: 166
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
        lineNumber: 142,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 text-[10px] uppercase tracking-wide text-muted-foreground", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", className: "text-[10px]", children: c.category }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
            lineNumber: 149,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "·" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
            lineNumber: 152,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: c.level }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
            lineNumber: 153,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
          lineNumber: 148,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "mt-2 font-display font-semibold leading-snug line-clamp-2 group-hover:text-primary", children: c.title }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
          lineNumber: 155,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-1 text-xs text-muted-foreground line-clamp-2", children: c.description }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
          lineNumber: 158,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-3 text-xs font-semibold", children: inr(Number(c.price_inr)) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
          lineNumber: 159,
          columnNumber: 19
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
        lineNumber: 147,
        columnNumber: 17
      }, this)
    ] }, c.id, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
      lineNumber: 139,
      columnNumber: 33
    }, this)) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
      lineNumber: 138,
      columnNumber: 20
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
    lineNumber: 101,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
    lineNumber: 100,
    columnNumber: 10
  }, this);
}
function CreatorAnalyticsBlock({
  creatorId,
  canSee
}) {
  const fetchAnalytics = useServerFn(getCreatorAnalytics);
  const q = useQuery({
    enabled: canSee,
    queryKey: ["creator-analytics", creatorId],
    queryFn: () => fetchAnalytics({
      data: {
        id: creatorId
      }
    })
  });
  if (!canSee) return null;
  if (q.isLoading) return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 rounded-2xl border bg-card p-6", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground mx-auto" }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
    lineNumber: 185,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
    lineNumber: 184,
    columnNumber: 27
  }, this);
  const d = q.data;
  if (!d) return null;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { className: "mt-8", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-xl font-semibold mb-4 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TrendingUp, { className: "h-5 w-5" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
        lineNumber: 191,
        columnNumber: 9
      }, this),
      " Your analytics"
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
      lineNumber: 190,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StatCard, { icon: Users, label: "Subscribers", value: d.subscribers }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
        lineNumber: 194,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StatCard, { icon: Eye, label: "Total views", value: d.totalViews }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
        lineNumber: 195,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StatCard, { icon: Heart, label: "Total likes", value: d.totalLikes }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
        lineNumber: 196,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StatCard, { icon: BookOpen, label: "Enrollments", value: d.totalEnrollments }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
        lineNumber: 197,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
      lineNumber: 193,
      columnNumber: 7
    }, this),
    d.courses.length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card p-4 shadow-card mb-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-sm font-semibold mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TrendingUp, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
            lineNumber: 202,
            columnNumber: 15
          }, this),
          " Per-course performance"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
          lineNumber: 201,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ResponsiveContainer, { width: "100%", height: Math.max(220, d.courses.length * 44), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(BarChart, { data: d.courses.map((c) => ({
          name: c.title.length > 22 ? c.title.slice(0, 22) + "…" : c.title,
          Views: c.views,
          Likes: c.likes,
          Enrolled: c.enrollments
        })), layout: "vertical", margin: {
          left: 8,
          right: 16,
          top: 8,
          bottom: 8
        }, children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CartesianGrid, { stroke: "hsl(var(--border))", strokeDasharray: "3 3" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
            lineNumber: 216,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(XAxis, { type: "number", stroke: "hsl(var(--muted-foreground))", fontSize: 11 }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
            lineNumber: 217,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(YAxis, { dataKey: "name", type: "category", width: 140, stroke: "hsl(var(--muted-foreground))", fontSize: 11 }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
            lineNumber: 218,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Tooltip, { contentStyle: {
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 12,
            fontSize: 12
          } }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
            lineNumber: 219,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Legend, { wrapperStyle: {
            fontSize: 11
          } }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
            lineNumber: 225,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Bar, { dataKey: "Views", fill: "hsl(var(--primary))", radius: [0, 4, 4, 0] }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
            lineNumber: 228,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Bar, { dataKey: "Likes", fill: "hsl(var(--accent))", radius: [0, 4, 4, 0] }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
            lineNumber: 229,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Bar, { dataKey: "Enrolled", fill: "hsl(var(--secondary))", radius: [0, 4, 4, 0] }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
            lineNumber: 230,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
          lineNumber: 205,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
          lineNumber: 204,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
        lineNumber: 200,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card shadow-card overflow-hidden", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-6 py-3 border-b text-sm font-semibold", children: "Course breakdown" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
          lineNumber: 235,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("thead", { className: "bg-muted/40 text-xs uppercase text-muted-foreground", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-4 py-2", children: "Course" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
              lineNumber: 240,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-right px-4 py-2", children: "Lessons" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
              lineNumber: 241,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-right px-4 py-2", children: "Views" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
              lineNumber: 242,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-right px-4 py-2", children: "Likes" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
              lineNumber: 243,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-right px-4 py-2", children: "Enrolled" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
              lineNumber: 244,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
            lineNumber: 239,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
            lineNumber: 238,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tbody", { children: d.courses.map((c) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { className: "border-t hover:bg-accent/30", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/courses/$slug", params: {
              slug: c.slug
            }, className: "hover:text-primary font-medium", children: c.title }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
              lineNumber: 250,
              columnNumber: 25
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
              lineNumber: 249,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-2 text-right text-muted-foreground", children: c.lessons }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
              lineNumber: 256,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-2 text-right", children: c.views }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
              lineNumber: 257,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-2 text-right", children: c.likes }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
              lineNumber: 258,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-2 text-right", children: c.enrollments }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
              lineNumber: 259,
              columnNumber: 23
            }, this)
          ] }, c.id, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
            lineNumber: 248,
            columnNumber: 39
          }, this)) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
            lineNumber: 247,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
          lineNumber: 237,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
          lineNumber: 236,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
        lineNumber: 234,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
      lineNumber: 199,
      columnNumber: 32
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
    lineNumber: 189,
    columnNumber: 10
  }, this);
}
function StatCard({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card p-4 shadow-card", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Icon, { className: "h-3.5 w-3.5" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
        lineNumber: 279,
        columnNumber: 9
      }, this),
      " ",
      label
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
      lineNumber: 278,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-1 text-2xl font-display font-semibold", children: value.toLocaleString() }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
      lineNumber: 281,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creators.$id.tsx?tsr-split=component",
    lineNumber: 277,
    columnNumber: 10
  }, this);
}
export {
  CreatorProfile as component
};
