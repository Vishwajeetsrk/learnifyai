import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { A as AppShell } from "./AppShell-BXcQmjDj.mjs";
import { I as Input } from "./input-BHvIASyb.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { e as enrollFree, a as CelebrationOverlay } from "./CelebrationOverlay-Dehe7viu.mjs";
import "../_libs/seroval.mjs";
import { n as Search, L as LoaderCircle, l as GraduationCap, r as Clock, aZ as Star, c as Check, k as Sparkles, N as ShoppingCart } from "../_libs/lucide-react.mjs";
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
import "./auth-middleware-BVm8xUae.mjs";
const inr = (n) => n === 0 ? "Free" : new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
}).format(n);
const FIXED_CATEGORIES = ["All", "Development", "Design", "Marketing", "AI & Data", "Business", "Personal Growth"];
function CoursesPage() {
  const [q, setQ] = reactExports.useState("");
  const [cat, setCat] = reactExports.useState("All");
  const [price, setPrice] = reactExports.useState("all");
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const enrollFreeFn = useServerFn(enrollFree);
  const [busyId, setBusyId] = reactExports.useState(null);
  const [celebrationSlug, setCelebrationSlug] = reactExports.useState(null);
  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("courses").select("id, slug, title, description, cover_url, category, level, price_inr, instructor, duration_minutes").eq("published", true).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const enrollmentsQuery = useQuery({
    queryKey: ["enrollments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("enrollments").select("course_id").eq("user_id", user.id);
      if (error) throw error;
      return new Set((data ?? []).map((r) => r.course_id));
    }
  });
  const cartQuery = useQuery({
    queryKey: ["cart-items", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("cart_items").select("course_id").eq("user_id", user.id);
      if (error) throw error;
      return new Set((data ?? []).map((r) => r.course_id));
    }
  });
  const handleCardAction = async (e, c) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return navigate({
      to: "/auth"
    });
    if (enrollmentsQuery.data?.has(c.id)) return navigate({
      to: "/courses/$slug",
      params: {
        slug: c.slug
      }
    });
    if (cartQuery.data?.has(c.id)) return navigate({
      to: "/cart"
    });
    setBusyId(c.id);
    try {
      if (Number(c.price_inr) === 0) {
        await enrollFreeFn({
          data: {
            courseId: c.id
          }
        });
        toast.success("Enrolled — let's start learning!");
        qc.invalidateQueries({
          queryKey: ["enrollments"]
        });
        qc.invalidateQueries({
          queryKey: ["my-certs"]
        });
        qc.invalidateQueries({
          queryKey: ["my-attempts"]
        });
        setCelebrationSlug(c.slug);
        return;
      } else {
        const {
          error
        } = await supabase.from("cart_items").insert({
          user_id: user.id,
          course_id: c.id
        });
        if (error) throw error;
        toast.success("Added to cart — redirecting to checkout…");
        qc.invalidateQueries({
          queryKey: ["cart-items"]
        });
        qc.invalidateQueries({
          queryKey: ["cart-count"]
        });
        qc.invalidateQueries({
          queryKey: ["cart"]
        });
        qc.invalidateQueries({
          queryKey: ["cart-item"]
        });
        navigate({
          to: "/cart"
        });
      }
    } catch (err) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setBusyId(null);
    }
  };
  const categories = reactExports.useMemo(() => {
    const set = new Set(FIXED_CATEGORIES);
    (coursesQuery.data ?? []).forEach((c) => set.add(c.category));
    return Array.from(set);
  }, [coursesQuery.data]);
  const filtered = reactExports.useMemo(() => {
    const data = coursesQuery.data ?? [];
    const needle = q.trim().toLowerCase();
    return data.filter((c) => {
      const matchCat = cat === "All" || c.category === cat;
      const matchPrice = price === "all" || price === "free" && Number(c.price_inr) === 0 || price === "paid" && Number(c.price_inr) > 0;
      const matchQ = !needle || c.title.toLowerCase().includes(needle) || (c.description ?? "").toLowerCase().includes(needle) || c.instructor.toLowerCase().includes(needle);
      return matchCat && matchPrice && matchQ;
    });
  }, [coursesQuery.data, q, cat, price]);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CelebrationOverlay, { show: !!celebrationSlug, title: "You’re enrolled!", message: "Opening your first lesson now…", withSound: true, durationMs: 1500, onDone: () => celebrationSlug && navigate({
      to: "/courses/$slug",
      params: {
        slug: celebrationSlug
      }
    }) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
      lineNumber: 153,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-7xl", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs uppercase tracking-widest text-primary font-medium", children: "Marketplace" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
            lineNumber: 162,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "mt-1 text-2xl sm:text-3xl font-display font-semibold tracking-tight", children: "Courses" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
            lineNumber: 165,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-muted-foreground mt-1 text-sm", children: "Learn from world-class instructors. Track your progress." }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
            lineNumber: 168,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
          lineNumber: 161,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative w-full sm:w-80", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Search, { className: "h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", "aria-hidden": "true" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
            lineNumber: 173,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { htmlFor: "course-search", className: "sr-only", children: "Search courses" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
            lineNumber: 174,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { id: "course-search", value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search courses…", className: "pl-9" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
            lineNumber: 177,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
          lineNumber: 172,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
        lineNumber: 160,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 space-y-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] uppercase tracking-wider text-muted-foreground mb-2 font-medium", children: "Categories" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
            lineNumber: 183,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap gap-2", role: "group", "aria-label": "Filter by category", children: categories.map((c) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: cat === c ? "default" : "outline", onClick: () => setCat(c), className: "rounded-full", "aria-pressed": cat === c, children: c }, c, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
            lineNumber: 187,
            columnNumber: 36
          }, this)) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
            lineNumber: 186,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
          lineNumber: 182,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] uppercase tracking-wider text-muted-foreground mb-2 font-medium", children: "Price" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
            lineNumber: 193,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap gap-2", role: "group", "aria-label": "Filter by price", children: [{
            id: "all",
            label: "All"
          }, {
            id: "free",
            label: "Free"
          }, {
            id: "paid",
            label: "Paid"
          }].map((p) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: price === p.id ? "default" : "outline", onClick: () => setPrice(p.id), className: "rounded-full", "aria-pressed": price === p.id, children: p.label }, p.id, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
            lineNumber: 209,
            columnNumber: 27
          }, this)) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
            lineNumber: 196,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
          lineNumber: 192,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
        lineNumber: 181,
        columnNumber: 9
      }, this),
      coursesQuery.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-20 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
        lineNumber: 217,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
        lineNumber: 216,
        columnNumber: 35
      }, this) : filtered.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-10 rounded-2xl border bg-card p-12 grid place-items-center text-center shadow-card", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(GraduationCap, { className: "h-10 w-10 text-primary mb-3" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
          lineNumber: 219,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-display text-lg font-semibold", children: "No courses match your search" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
          lineNumber: 220,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1", children: "Try a different keyword or category." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
          lineNumber: 221,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
        lineNumber: 218,
        columnNumber: 44
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: filtered.map((c) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/courses/$slug", params: {
        slug: c.slug
      }, className: "group rounded-2xl border bg-card overflow-hidden shadow-card hover:shadow-lg transition-all hover:-translate-y-0.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "aspect-video bg-muted overflow-hidden", children: c.cover_url ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: c.cover_url, alt: c.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500", loading: "lazy" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
          lineNumber: 229,
          columnNumber: 34
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-full h-full grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(GraduationCap, { className: "h-10 w-10 text-muted-foreground" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
          lineNumber: 230,
          columnNumber: 23
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
          lineNumber: 229,
          columnNumber: 186
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
          lineNumber: 228,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 text-[10px] uppercase tracking-wide text-muted-foreground", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", className: "text-[10px]", children: c.category }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
              lineNumber: 235,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "·" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
              lineNumber: 238,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: c.level }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
              lineNumber: 239,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
            lineNumber: 234,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "mt-2 font-display font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors", children: c.title }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
            lineNumber: 241,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-1 text-xs text-muted-foreground line-clamp-2", children: c.description }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
            lineNumber: 244,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-4 flex items-center justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Clock, { className: "h-3 w-3" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
                lineNumber: 247,
                columnNumber: 23
              }, this),
              " ",
              c.duration_minutes,
              " min"
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
              lineNumber: 246,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Star, { className: "h-3 w-3 fill-amber-400 text-amber-400" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
                lineNumber: 250,
                columnNumber: 23
              }, this),
              " 4.8"
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
              lineNumber: 249,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-semibold text-foreground", children: inr(Number(c.price_inr)) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
              lineNumber: 252,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
            lineNumber: 245,
            columnNumber: 19
          }, this),
          (() => {
            const enrolled = enrollmentsQuery.data?.has(c.id);
            const inCart = cartQuery.data?.has(c.id);
            const isFree = Number(c.price_inr) === 0;
            const busy = busyId === c.id;
            const label = enrolled ? "Continue" : inCart ? "View cart" : isFree ? "Enroll free" : "Add to cart";
            const Icon = enrolled ? Check : isFree ? Sparkles : ShoppingCart;
            return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: enrolled ? "secondary" : "default", className: "mt-4 w-full", disabled: busy, onClick: (e) => handleCardAction(e, c), children: [
              busy ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
                lineNumber: 264,
                columnNumber: 33
              }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Icon, { className: "h-4 w-4" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
                lineNumber: 264,
                columnNumber: 80
              }, this),
              label
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
              lineNumber: 263,
              columnNumber: 22
            }, this);
          })()
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
          lineNumber: 233,
          columnNumber: 17
        }, this)
      ] }, c.id, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
        lineNumber: 225,
        columnNumber: 32
      }, this)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
        lineNumber: 224,
        columnNumber: 20
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
      lineNumber: 159,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.index.tsx?tsr-split=component",
    lineNumber: 152,
    columnNumber: 10
  }, this);
}
export {
  CoursesPage as component
};
