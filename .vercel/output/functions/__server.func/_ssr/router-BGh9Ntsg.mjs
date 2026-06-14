import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, d as useRouterState } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { supabaseAdmin } from "./client.server-BbcUHF3e.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const appCss = "/assets/styles-Ce_HTfTm.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function createSupabaseClient() {
  process.env.VITE_SUPABASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
  const SUPABASE_URL = "https://gnvsqwyexjuuwkjibxrr.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_dDegAO1asawpDuaW4EJqjw_6YpsZbZQ";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
const AuthContext = reactExports.createContext(void 0);
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [roles, setRoles] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const fetchRoles = async (userId) => {
    try {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      setRoles((data ?? []).map((r) => r.role));
    } catch (error) {
      console.error("Failed to load user roles", error);
      setRoles([]);
    }
  };
  reactExports.useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        fetchRoles(newSession.user.id);
      } else {
        setRoles([]);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        return fetchRoles(data.session.user.id);
      }
    }).catch((error) => {
      console.error("Failed to restore Supabase session", error);
    }).finally(() => {
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  const value = {
    user: session?.user ?? null,
    session,
    roles,
    loading,
    isAuthenticated: !!session,
    hasRole: (role) => roles.includes(role),
    isAdmin: roles.includes("super_admin") || roles.includes("admin"),
    isCreator: roles.includes("super_admin") || roles.includes("admin") || roles.includes("creator"),
    signOut: async () => {
      await supabase.auth.signOut();
    }
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AuthContext.Provider, { value, children }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/hooks/use-auth.tsx",
    lineNumber: 84,
    columnNumber: 10
  }, this);
}
const emptyAuthContext = {
  user: null,
  session: null,
  roles: [],
  loading: true,
  isAuthenticated: false,
  hasRole: () => false,
  isAdmin: false,
  isCreator: false,
  signOut: async () => {
  }
};
function useAuth() {
  const ctx = reactExports.useContext(AuthContext);
  return ctx ?? emptyAuthContext;
}
const COLOR_THEMES = [
  { id: "indigo", label: "Indigo", swatch: "oklch(0.55 0.22 260)" },
  { id: "ocean", label: "Ocean", swatch: "oklch(0.62 0.16 215)" },
  { id: "sunset", label: "Sunset", swatch: "oklch(0.66 0.21 35)" },
  { id: "forest", label: "Forest", swatch: "oklch(0.58 0.15 155)" },
  { id: "rose", label: "Rose", swatch: "oklch(0.64 0.21 0)" },
  { id: "noir", label: "Noir", swatch: "oklch(0.2 0 0)" }
];
const ThemeContext = reactExports.createContext(null);
const MODE_KEY = "ui.mode";
const COLOR_KEY = "ui.color";
function getSystemMode() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function applyTheme(mode, color) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const resolved = mode === "system" ? getSystemMode() : mode;
  root.classList.toggle("dark", resolved === "dark");
  if (color === "indigo") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", color);
}
function ThemeProvider({ children }) {
  const [mode, setModeState] = reactExports.useState("system");
  const [color, setColorState] = reactExports.useState("indigo");
  const [resolvedMode, setResolvedMode] = reactExports.useState("light");
  reactExports.useEffect(() => {
    try {
      const m = localStorage.getItem(MODE_KEY) || "system";
      const c = localStorage.getItem(COLOR_KEY) || "indigo";
      setModeState(m);
      setColorState(c);
      applyTheme(m, c);
      setResolvedMode(m === "system" ? getSystemMode() : m);
    } catch {
      applyTheme("system", "indigo");
    }
  }, []);
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (mode === "system") {
        applyTheme("system", color);
        setResolvedMode(getSystemMode());
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode, color]);
  const setMode = reactExports.useCallback(
    (m) => {
      setModeState(m);
      try {
        localStorage.setItem(MODE_KEY, m);
      } catch {
      }
      applyTheme(m, color);
      setResolvedMode(m === "system" ? getSystemMode() : m);
    },
    [color]
  );
  const setColor = reactExports.useCallback(
    (c) => {
      setColorState(c);
      try {
        localStorage.setItem(COLOR_KEY, c);
      } catch {
      }
      applyTheme(mode, c);
    },
    [mode]
  );
  const value = reactExports.useMemo(
    () => ({
      mode,
      color,
      resolvedMode,
      setMode,
      setColor
    }),
    [mode, color, resolvedMode, setMode, setColor]
  );
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ThemeContext.Provider, { value, children }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/hooks/use-theme.tsx",
    lineNumber: 117,
    columnNumber: 10
  }, this);
}
function useTheme() {
  const ctx = reactExports.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
const MotionCtx = reactExports.createContext(null);
const KEY = "ui.motion";
function osPrefersReduced() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function MotionPrefProvider({ children }) {
  const [pref, setPrefState] = reactExports.useState("auto");
  const [osReduced, setOsReduced] = reactExports.useState(false);
  reactExports.useEffect(() => {
    try {
      const p = localStorage.getItem(KEY) || "auto";
      setPrefState(p);
    } catch {
    }
    setOsReduced(osPrefersReduced());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setOsReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  const reduced = pref === "reduced" || pref === "auto" && osReduced;
  reactExports.useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("reduce-motion", reduced);
  }, [reduced]);
  const setPref = reactExports.useCallback((p) => {
    setPrefState(p);
    try {
      localStorage.setItem(KEY, p);
    } catch {
    }
  }, []);
  const value = reactExports.useMemo(() => ({ pref, setPref, reduced }), [pref, setPref, reduced]);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MotionCtx.Provider, { value, children }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/hooks/use-motion-pref.tsx",
    lineNumber: 60,
    columnNumber: 10
  }, this);
}
const FALLBACK = {
  pref: "auto",
  setPref: () => {
  },
  reduced: false
};
function useMotionPref() {
  const ctx = reactExports.useContext(MotionCtx);
  return ctx ?? FALLBACK;
}
function ThemeSync() {
  const { user } = useAuth();
  const { mode, color, setMode, setColor } = useTheme();
  const hydratedFor = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!user) {
      hydratedFor.current = null;
      return;
    }
    if (hydratedFor.current === user.id) return;
    hydratedFor.current = user.id;
    (async () => {
      const { data } = await supabase.from("profiles").select("ui_prefs").eq("id", user.id).maybeSingle();
      const prefs = data?.ui_prefs;
      if (prefs?.mode && prefs.mode !== mode) setMode(prefs.mode);
      if (prefs?.color && prefs.color !== color) setColor(prefs.color);
    })();
  }, [user?.id]);
  reactExports.useEffect(() => {
    if (!user || hydratedFor.current !== user.id) return;
    const t = setTimeout(() => {
      supabase.from("profiles").update({ ui_prefs: { mode, color } }).eq("id", user.id);
    }, 400);
    return () => clearTimeout(t);
  }, [user, mode, color]);
  return null;
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    },
    void 0,
    false,
    {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/sonner.tsx",
      lineNumber: 7,
      columnNumber: 5
    },
    void 0
  );
};
function NavigationProgress() {
  const isLoading = useRouterState({
    select: (s) => s.status === "pending" || s.isLoading || s.isTransitioning
  });
  const [visible, setVisible] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  reactExports.useEffect(() => {
    let raf = 0;
    let hideT;
    if (isLoading) {
      setVisible(true);
      setProgress(8);
      const tick = () => {
        setProgress((p) => p < 88 ? p + Math.max(0.5, (90 - p) * 0.04) : p);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    } else if (visible) {
      setProgress(100);
      hideT = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 220);
    }
    return () => {
      cancelAnimationFrame(raf);
      if (hideT) clearTimeout(hideT);
    };
  }, [isLoading]);
  if (!visible) return null;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      "aria-hidden": true,
      style: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 9999,
        background: "transparent",
        pointerEvents: "none"
      },
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "div",
        {
          style: {
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.6))",
            boxShadow: "0 0 12px hsl(var(--primary) / 0.6)",
            transition: "width 200ms ease-out, opacity 200ms ease-out",
            opacity: progress >= 100 ? 0 : 1
          }
        },
        void 0,
        false,
        {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/NavigationProgress.tsx",
          lineNumber: 55,
          columnNumber: 7
        },
        this
      )
    },
    void 0,
    false,
    {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/NavigationProgress.tsx",
      lineNumber: 42,
      columnNumber: 5
    },
    this
  );
}
function PageTransition({ children }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { reduced } = useMotionPref();
  if (reduced) return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/PageTransition.tsx",
    lineNumber: 10,
    columnNumber: 23
  }, this);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -4 },
      transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      children
    },
    path,
    false,
    {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/PageTransition.tsx",
      lineNumber: 14,
      columnNumber: 7
    },
    this
  ) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/PageTransition.tsx",
    lineNumber: 13,
    columnNumber: 5
  }, this);
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-7xl font-bold text-foreground", children: "404" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
      lineNumber: 19,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
      lineNumber: 20,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
      lineNumber: 21,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      },
      void 0,
      false,
      {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
        lineNumber: 25,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
      lineNumber: 24,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
    lineNumber: 18,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
    lineNumber: 17,
    columnNumber: 5
  }, this);
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
      lineNumber: 47,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
      lineNumber: 50,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        },
        void 0,
        false,
        {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
          lineNumber: 54,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        },
        void 0,
        false,
        {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
          lineNumber: 63,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
      lineNumber: 53,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
    lineNumber: 46,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
    lineNumber: 45,
    columnNumber: 5
  }, this);
}
const Route$L = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Learnify AI" },
      {
        name: "description",
        content: "Learnify AI is the intelligent learning OS for learners, creators, and teams."
      },
      { name: "author", content: "Learnify AI" },
      { property: "og:title", content: "Learnify AI" },
      {
        property: "og:description",
        content: "AI-native tutoring, creator tools, gamification, and career growth in one platform."
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@LearnifyAI" }
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico"
      },
      {
        rel: "stylesheet",
        href: appCss
      }
    ],
    scripts: [
      {
        children: `(function(){try{var m=localStorage.getItem('ui.mode')||'system';var c=localStorage.getItem('ui.color')||'indigo';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;if(d)r.classList.add('dark');if(c&&c!=='indigo')r.setAttribute('data-theme',c);r.classList.add('no-theme-transition');setTimeout(function(){r.classList.remove('no-theme-transition')},0);}catch(e){}})();`
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("html", { lang: "en", suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("head", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(HeadContent, {}, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
      lineNumber: 122,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
      lineNumber: 121,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("body", { children: [
      children,
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Scripts, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
        lineNumber: 126,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
      lineNumber: 124,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
    lineNumber: 120,
    columnNumber: 5
  }, this);
}
function RootComponent() {
  const { queryClient } = Route$L.useRouteContext();
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ThemeProvider, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MotionPrefProvider, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AuthProvider, { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ThemeSync, {}, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
      lineNumber: 148,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(NavigationProgress, {}, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
      lineNumber: 149,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(PageTransition, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Outlet, {}, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
      lineNumber: 152,
      columnNumber: 15
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
      lineNumber: 150,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Toaster, { richColors: true, position: "top-right" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
      lineNumber: 154,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
    lineNumber: 147,
    columnNumber: 11
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
    lineNumber: 146,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
    lineNumber: 145,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/__root.tsx",
    lineNumber: 144,
    columnNumber: 5
  }, this);
}
const $$splitComponentImporter$I = () => import("./signup-BFIvynSl.mjs");
const Route$K = createFileRoute("/signup")({
  head: () => ({
    meta: [{
      title: "Create your account — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$I, "component")
});
const $$splitComponentImporter$H = () => import("./roadmap-Ca7GCK4K.mjs");
const Route$J = createFileRoute("/roadmap")({
  head: () => ({
    meta: [{
      title: "Roadmap — Learnify AI"
    }, {
      name: "description",
      content: "What we've shipped, what's in progress, and what's next on the Learnify AI roadmap."
    }, {
      property: "og:title",
      content: "Roadmap — Learnify AI"
    }, {
      property: "og:description",
      content: "Public roadmap: shipped, in progress, and coming soon."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$H, "component")
});
const $$splitComponentImporter$G = () => import("./reset-password-B10GeIRn.mjs");
const Route$I = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{
      title: "Set new password — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$G, "component")
});
const $$splitComponentImporter$F = () => import("./privacy-BzGW1-y8.mjs");
const Route$H = createFileRoute("/privacy")({
  head: () => ({
    meta: [{
      title: "Privacy Policy — Learnify AI"
    }, {
      name: "description",
      content: "How Learnify AI collects, uses, and protects your data."
    }, {
      property: "og:title",
      content: "Privacy Policy — Learnify AI"
    }, {
      property: "og:description",
      content: "Our privacy practices, in plain language."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$F, "component")
});
const $$splitComponentImporter$E = () => import("./pricing-CFfZHekf.mjs");
const Route$G = createFileRoute("/pricing")({
  head: () => ({
    meta: [{
      title: "Pricing — Learnify AI"
    }, {
      name: "description",
      content: "Simple, transparent pricing. Start free, upgrade when you're ready."
    }, {
      property: "og:title",
      content: "Pricing — Learnify AI"
    }, {
      property: "og:description",
      content: "Free forever core. Pro and Team plans for serious learners and creators."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$E, "component")
});
const $$splitComponentImporter$D = () => import("./login-CIaBcTdA.mjs");
const Route$F = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Sign in — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$D, "component")
});
const $$splitComponentImporter$C = () => import("./forgot-password-DBX95elJ.mjs");
const Route$E = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{
      title: "Reset password — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$C, "component")
});
const $$splitComponentImporter$B = () => import("./features-CaZoYAQX.mjs");
const Route$D = createFileRoute("/features")({
  head: () => ({
    meta: [{
      title: "Features — Learnify AI"
    }, {
      name: "description",
      content: "Everything Learnify AI gives you: AI tutoring, smart notes, gamified progress, creator economy, wallet, and career intelligence."
    }, {
      property: "og:title",
      content: "Features — Learnify AI"
    }, {
      property: "og:description",
      content: "AI tutoring, smart notes, gamified progress, wallet, and career intelligence — all in one platform."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$B, "component")
});
const $$splitErrorComponentImporter$3 = () => import("./faq-Bn2EaV1F.mjs");
const $$splitComponentImporter$A = () => import("./faq-BFg8F0wg.mjs");
const Route$C = createFileRoute("/faq")({
  head: () => ({
    meta: [{
      title: "FAQ — Learnify AI"
    }, {
      name: "description",
      content: "Answers to the most common questions about Learnify AI: certificates, courses, billing, and more."
    }, {
      property: "og:title",
      content: "FAQ — Learnify AI"
    }, {
      property: "og:description",
      content: "Answers to common questions about Learnify AI."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$A, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$3, "errorComponent")
});
const $$splitComponentImporter$z = () => import("./events-DtVATmjC.mjs");
const Route$B = createFileRoute("/events")({
  head: () => ({
    meta: [{
      title: "Events — Learnify AI"
    }, {
      name: "description",
      content: "Live workshops, AMAs, and creator showcases — join us in person and online."
    }, {
      property: "og:title",
      content: "Events — Learnify AI"
    }, {
      property: "og:description",
      content: "Upcoming Learnify AI workshops, AMAs, and creator meetups."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$z, "component")
});
const $$splitComponentImporter$y = () => import("./creators-Cb1S3vU0.mjs");
const Route$A = createFileRoute("/creators")({
  head: () => ({
    meta: [{
      title: "Creators — Learnify AI"
    }, {
      name: "description",
      content: "Build a course, grow an audience, and earn — with AI tooling that does the heavy lifting."
    }, {
      property: "og:title",
      content: "Creators — Learnify AI"
    }, {
      property: "og:description",
      content: "Launch a course in days, not months. Built-in audience, payouts, and AI co-pilot."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$y, "component")
});
const $$splitComponentImporter$x = () => import("./contact-DlBry0Xu.mjs");
const Route$z = createFileRoute("/contact")({
  head: () => ({
    meta: [{
      title: "Contact — Learnify AI"
    }, {
      name: "description",
      content: "Get in touch with the Learnify AI team. Sales, support, partnerships, or just say hi."
    }, {
      property: "og:title",
      content: "Contact — Learnify AI"
    }, {
      property: "og:description",
      content: "Reach the Learnify AI team by email, chat, or social."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$x, "component")
});
const $$splitComponentImporter$w = () => import("./community-DDpS5mK9.mjs");
const Route$y = createFileRoute("/community")({
  head: () => ({
    meta: [{
      title: "Community — Learnify AI"
    }, {
      name: "description",
      content: "Join live cohorts, office hours, and study groups led by creators on Learnify AI."
    }, {
      property: "og:title",
      content: "Learnify AI Community"
    }, {
      property: "og:description",
      content: "Live cohorts, office hours, and study groups for AI-era learners."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$w, "component")
});
const $$splitComponentImporter$v = () => import("./coaches-CDGjP4tD.mjs");
const Route$x = createFileRoute("/coaches")({
  head: () => ({
    meta: [{
      title: "Coaches — Learnify AI"
    }, {
      name: "description",
      content: "Offer 1-on-1 coaching with built-in scheduling, messaging, and payments."
    }, {
      property: "og:title",
      content: "Coaches — Learnify AI"
    }, {
      property: "og:description",
      content: "All the tools you need to run a coaching practice — without the spreadsheet juggling."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$v, "component")
});
const $$splitComponentImporter$u = () => import("./careers-Bys7EZGc.mjs");
const Route$w = createFileRoute("/careers")({
  head: () => ({
    meta: [{
      title: "Careers — Learnify AI"
    }, {
      name: "description",
      content: "Help us build the intelligent learning OS. Open roles across engineering, design, and content."
    }, {
      property: "og:title",
      content: "Careers — Learnify AI"
    }, {
      property: "og:description",
      content: "Join Learnify AI — open roles across engineering, design, content, and growth."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$u, "component")
});
const $$splitComponentImporter$t = () => import("./about-DrmJoPII.mjs");
const Route$v = createFileRoute("/about")({
  head: () => ({
    meta: [{
      title: "About — Learnify AI"
    }, {
      name: "description",
      content: "We're building the intelligent learning OS — a single home for learners, creators, and coaches."
    }, {
      property: "og:title",
      content: "About — Learnify AI"
    }, {
      property: "og:description",
      content: "Our mission, story, and the team behind Learnify AI."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("../_authenticated-B9CEAaQC.mjs");
const Route$u = createFileRoute("/_authenticated")({
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("./index-DTnL4NNs.mjs");
const Route$t = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Learnify AI — Learn Smarter. Grow Faster."
    }, {
      name: "description",
      content: "The AI-native learning OS: intelligent tutoring, creator economy, gamification, and career growth — all in one platform."
    }, {
      property: "og:title",
      content: "Learnify AI — The Intelligent Learning OS"
    }, {
      property: "og:description",
      content: "AI tutoring, notes, quizzes, community, and career growth in one cohesive platform."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("./u._id-ZxX3XhQh.mjs");
const Route$s = createFileRoute("/u/$id")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `Profile — Learnify AI`
    }, {
      name: "description",
      content: `Public profile on Learnify AI.`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitErrorComponentImporter$2 = () => import("./certificates._code-BIgW8H5s.mjs");
const $$splitComponentImporter$p = () => import("./certificates._code-Q4KCZfPw.mjs");
const Route$r = createFileRoute("/certificates/$code")({
  head: () => ({
    meta: [{
      title: "Certificate — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent")
});
const PROVIDERS = {
  groq: {
    url: "https://api.groq.com/openai/v1/chat/completions",
    keyEnv: "GROQ_API_KEY",
    stripPrefix: true
  },
  openrouter: {
    url: "https://openrouter.ai/api/v1/chat/completions",
    keyEnv: "OPENROUTER_API_KEY",
    stripPrefix: true
  },
  gemini: {
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    keyEnv: "GEMINI_API_KEY",
    stripPrefix: false
  }
};
function resolveProvider(model) {
  const parts = model.split("/");
  const prefix = parts[0];
  const cfg = PROVIDERS[prefix];
  if (cfg) {
    const providerModel = cfg.stripPrefix ? parts.slice(1).join("/") : model.replace(/^gemini\//, "");
    return { cfg, providerModel };
  }
  if (model.includes("gemini"))
    return { cfg: PROVIDERS.gemini, providerModel: model.replace(/^gemini\//, "") };
  if (model.includes("groq"))
    return { cfg: PROVIDERS.groq, providerModel: model.replace(/^groq\//, "") };
  if (model.includes("openrouter") || model.includes("openrouter.ai"))
    return { cfg: PROVIDERS.openrouter, providerModel: model.replace(/^openrouter\//, "") };
  return { cfg: PROVIDERS.gemini, providerModel: model };
}
const BodySchema = objectType({
  conversationId: stringType().uuid().nullable().optional(),
  model: stringType().min(1).max(200),
  content: stringType().min(1).max(2e4)
});
const MODEL_PRICING = {
  "google/gemini-2.5-flash": { in: 0.3, out: 2.5 },
  "google/gemini-2.5-pro": { in: 1.25, out: 10 },
  "google/gemini-2.5-flash-lite": { in: 0.1, out: 0.4 },
  "openai/gpt-5": { in: 1.25, out: 10 },
  "openai/gpt-5-mini": { in: 0.25, out: 2 },
  "openai/gpt-5-nano": { in: 0.05, out: 0.4 }
};
const USD_TO_INR = 84;
const CREDITS_PER_REQUEST = 1;
function priceFor(modelWithPrefix, ptok, ctok) {
  const keys = Object.keys(MODEL_PRICING);
  let key = keys.find((k) => modelWithPrefix.endsWith(k));
  if (!key) key = keys.find((k) => modelWithPrefix.includes(k));
  const p = MODEL_PRICING[key ?? ""] ?? { in: 0.3, out: 2.5 };
  const usd = ptok / 1e6 * p.in + ctok / 1e6 * p.out;
  return { usd, inr: usd * USD_TO_INR };
}
const Route$q = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = request.headers.get("authorization");
        const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
        if (!token) return new Response("Unauthorized", { status: 401 });
        const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
        if (userErr || !userData.user) return new Response("Unauthorized", { status: 401 });
        const userId = userData.user.id;
        const { data: creditRow } = await supabaseAdmin.from("ai_credits").select("credits_remaining").eq("user_id", userId).maybeSingle();
        let remaining = creditRow?.credits_remaining ?? null;
        if (remaining === null) {
          await supabaseAdmin.from("ai_credits").insert({ user_id: userId, credits_remaining: 500 });
          remaining = 500;
        }
        if (remaining < CREDITS_PER_REQUEST) {
          return new Response(
            JSON.stringify({ error: "You're out of AI credits. Please top up to continue." }),
            { status: 402, headers: { "Content-Type": "application/json" } }
          );
        }
        let parsed;
        try {
          parsed = BodySchema.parse(await request.json());
        } catch (e) {
          return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
        }
        let conversationId = parsed.conversationId ?? null;
        if (!conversationId) {
          const { data: conv, error } = await supabaseAdmin.from("chat_conversations").insert({ user_id: userId, model: parsed.model, title: parsed.content.slice(0, 60) }).select("id").single();
          if (error || !conv) return new Response("Could not create conversation", { status: 500 });
          conversationId = conv.id;
        } else {
          const { data: conv } = await supabaseAdmin.from("chat_conversations").select("id, user_id").eq("id", conversationId).single();
          if (!conv || conv.user_id !== userId) return new Response("Forbidden", { status: 403 });
        }
        await supabaseAdmin.from("chat_messages").insert({
          conversation_id: conversationId,
          user_id: userId,
          role: "user",
          content: parsed.content
        });
        const { data: history } = await supabaseAdmin.from("chat_messages").select("role, content").eq("conversation_id", conversationId).order("created_at", { ascending: true }).limit(30);
        const { cfg, providerModel } = resolveProvider(parsed.model);
        const apiKey = process.env[cfg.keyEnv];
        if (!apiKey) {
          return new Response(JSON.stringify({ error: `${cfg.keyEnv} not configured` }), {
            status: 500
          });
        }
        const systemPrompt = `You are Learnify AI — a Senior Technical Mentor, Research Assistant, Career Coach, Software Architect, Documentation Writer, and Product Educator. You are NOT a casual chatbot.

CORE IDENTITY
Every response must feel premium, expert-level, structured, and production-grade — like Notion AI, Perplexity Pro, or a senior consulting report. The user should feel they are interacting with a senior engineer and mentor.

GLOBAL RULES
- Always be professionally formatted with proper markdown: clear H2/H3 headings, sections, subsections, tables for comparisons, numbered steps, bullet lists, and fenced code blocks with language tags.
- Always explain WHY and HOW, not just WHAT.
- Always include prerequisites, realistic timelines, free resources (real, current), project-based learning, industry best practices, and common mistakes when relevant.
- Use real, up-to-date information and modern tools (2025–2026 standards). Never invent libraries, courses, or links.
- No emoji spam. No motivational filler. No shallow "Here's a simple guide" intros. No unstructured text walls.

DEFAULT OUTPUT STRUCTURE (adapt sections to the question; omit irrelevant ones)
1. Title (H1)
2. Overview — short professional intro
3. Prerequisites
4. Skills Required (technical + soft)
5. Step-by-Step Roadmap / Solution (phased, with milestones)
6. Recommended Stack / Tools — explain why each
7. Free Courses & Resources — official docs, freeCodeCamp, MDN, YouTube channels, GitHub repos, practice platforms
8. Projects to Build — Beginner → Intermediate → Advanced
9. Industry Best Practices (production-level)
10. Common Mistakes
11. Timeline Estimate (realistic)
12. Career Opportunities (roles + salary ranges where relevant)
13. Final Recommendation

ROADMAP REQUESTS
When asked for a roadmap (frontend, backend, fullstack, AI, DevOps, etc.), always deliver: Beginner → Advanced phases, monthly breakdown, real project milestones, free courses, practice platforms, GitHub repos, deployment platforms, resume-worthy projects, interview prep, and career path guidance.

README REQUESTS
Generate production-grade READMEs only. Include: Project Name, Overview, Features, Tech Stack, Architecture & folder structure, Screenshots section, Installation steps, Environment Variables (example .env), API Endpoints (if backend), Authentication, Database Schema, Deployment (Vercel/Render/Docker), Performance Optimizations, Security Features (rate limiting, JWT, RLS, XSS), Future Improvements, License, Author.

CODE RESPONSES
- Explain the approach and architecture before code.
- Add inline comments.
- Discuss folder structure, scalability, security, and performance implications.
- Never dump raw code without explanation.

LEARNING REQUESTS ("How do I learn X?")
Always cover: what it is, why it matters, prerequisites, step-by-step learning path, free resources, practice projects, real-world use cases, industry tools, and portfolio projects.

QUALITY GUARDRAILS
NEVER give shallow answers, a single resource, outdated stacks, generic boilerplate, or incomplete roadmaps. ALWAYS recommend scalable architecture, deployment guidance, and production-level practices.`;
        const upstream = await fetch(cfg.url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            ...cfg === PROVIDERS.openrouter ? { "HTTP-Referer": "https://learnify.ai", "X-Title": "Learnify AI" } : {}
          },
          body: JSON.stringify({
            model: providerModel,
            stream: true,
            stream_options: { include_usage: true },
            messages: [
              { role: "system", content: systemPrompt },
              ...(history ?? []).map((m) => ({ role: m.role, content: m.content }))
            ]
          })
        });
        if (!upstream.ok || !upstream.body) {
          const text = await upstream.text().catch(() => "");
          console.error("Upstream AI error", upstream.status, text);
          return new Response(JSON.stringify({ error: `AI provider error (${upstream.status})` }), {
            status: 502
          });
        }
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        let assistantText = "";
        let promptTokens = 0;
        let completionTokens = 0;
        const stream = new ReadableStream({
          async start(controller) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ conversationId })}

`));
            const reader = upstream.body.getReader();
            let buffer = "";
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                let nl;
                while ((nl = buffer.indexOf("\n")) !== -1) {
                  let line = buffer.slice(0, nl);
                  buffer = buffer.slice(nl + 1);
                  if (line.endsWith("\r")) line = line.slice(0, -1);
                  if (!line.startsWith("data: ")) continue;
                  const payload = line.slice(6).trim();
                  if (payload === "[DONE]") continue;
                  try {
                    const json = JSON.parse(payload);
                    const delta = json.choices?.[0]?.delta?.content;
                    if (typeof delta === "string" && delta.length) {
                      assistantText += delta;
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}

`));
                    }
                    if (json.usage) {
                      promptTokens = json.usage.prompt_tokens ?? promptTokens;
                      completionTokens = json.usage.completion_tokens ?? completionTokens;
                    }
                  } catch {
                  }
                }
              }
            } catch (err) {
              console.error("Stream error", err);
            } finally {
              if (assistantText) {
                if (!promptTokens) {
                  const promptChars = (history ?? []).reduce((s, m) => s + m.content.length, 0) + systemPrompt.length;
                  promptTokens = Math.ceil(promptChars / 4);
                }
                if (!completionTokens) completionTokens = Math.ceil(assistantText.length / 4);
                const { usd, inr } = priceFor(parsed.model, promptTokens, completionTokens);
                await supabaseAdmin.from("chat_messages").insert({
                  conversation_id: conversationId,
                  user_id: userId,
                  role: "assistant",
                  content: assistantText,
                  model: parsed.model,
                  token_count: promptTokens + completionTokens
                });
                await supabaseAdmin.from("chat_conversations").update({ updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", conversationId);
                await supabaseAdmin.from("ai_usage").insert({
                  user_id: userId,
                  conversation_id: conversationId,
                  model: parsed.model,
                  prompt_tokens: promptTokens,
                  completion_tokens: completionTokens,
                  total_tokens: promptTokens + completionTokens,
                  cost_usd: Number(usd.toFixed(6)),
                  cost_inr: Number(inr.toFixed(4)),
                  credits_charged: CREDITS_PER_REQUEST
                });
                const { data: cur } = await supabaseAdmin.from("ai_credits").select("credits_remaining, credits_used").eq("user_id", userId).maybeSingle();
                const curRemaining = cur?.credits_remaining ?? remaining;
                const curUsed = cur?.credits_used ?? 0;
                const newRemaining = Math.max(0, curRemaining - CREDITS_PER_REQUEST);
                await supabaseAdmin.from("ai_credits").update({
                  credits_remaining: newRemaining,
                  credits_used: curUsed + CREDITS_PER_REQUEST,
                  updated_at: (/* @__PURE__ */ new Date()).toISOString()
                }).eq("user_id", userId);
                remaining = newRemaining;
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ credits_remaining: newRemaining, cost_inr: Number(inr.toFixed(4)) })}

`
                  )
                );
              }
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              controller.close();
            }
          }
        });
        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive"
          }
        });
      }
    }
  }
});
const $$splitComponentImporter$o = () => import("./wallet-DiVVzGJM.mjs");
const Route$p = createFileRoute("/_authenticated/wallet")({
  head: () => ({
    meta: [{
      title: "Wallet — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./submissions-DVQJ-9z5.mjs");
const Route$o = createFileRoute("/_authenticated/submissions")({
  head: () => ({
    meta: [{
      title: "My Submissions — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitErrorComponentImporter$1 = () => import("./studio-DN5p391l.mjs");
const $$splitComponentImporter$m = () => import("./studio-C5QzuXvV.mjs");
const Route$n = createFileRoute("/_authenticated/studio")({
  head: () => ({
    meta: [{
      title: "Creator Studio — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$m, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent")
});
const $$splitComponentImporter$l = () => import("./settings-CqtB6jqJ.mjs");
const Route$m = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [{
      title: "Settings — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./inbox-V4CfkHeh.mjs");
const Route$l = createFileRoute("/_authenticated/inbox")({
  head: () => ({
    meta: [{
      title: "Inbox — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./dashboard-DFJpfcom.mjs");
const Route$k = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{
      title: "Dashboard — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./creator-DazpLhL5.mjs");
const Route$j = createFileRoute("/_authenticated/creator")({
  head: () => ({
    meta: [{
      title: "Creator Hub — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./cohorts-CAtWbwlg.mjs");
const Route$i = createFileRoute("/_authenticated/cohorts")({
  head: () => ({
    meta: [{
      title: "Cohorts & Study Groups — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./certificates-B6NBMJzL.mjs");
const Route$h = createFileRoute("/_authenticated/certificates")({
  head: () => ({
    meta: [{
      title: "Certificates — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./cart-CZaqXZU7.mjs");
const Route$g = createFileRoute("/_authenticated/cart")({
  head: () => ({
    meta: [{
      title: "Cart — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./apply-creator-CclzB2__.mjs");
const Route$f = createFileRoute("/_authenticated/apply-creator")({
  head: () => ({
    meta: [{
      title: "Apply to Creator Program — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./ai-tools-BZ6JdQT3.mjs");
const Route$e = createFileRoute("/_authenticated/ai-tools")({
  head: () => ({
    meta: [{
      title: "AI Tools — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./ai-CELA_tzu.mjs");
const Route$d = createFileRoute("/_authenticated/ai")({
  head: () => ({
    meta: [{
      title: "AI Tutor — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./admin-BZ9wXcjH.mjs");
const Route$c = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{
      title: "Admin Command Center — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./courses.index-84q0mNi_.mjs");
const Route$b = createFileRoute("/_authenticated/courses/")({
  head: () => ({
    meta: [{
      title: "Courses — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./creators._id-DB0x9P9V.mjs");
const Route$a = createFileRoute("/_authenticated/creators/$id")({
  head: () => ({
    meta: [{
      title: "Creator — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./creator.subscribers-eMslFVYJ.mjs");
const Route$9 = createFileRoute("/_authenticated/creator/subscribers")({
  head: () => ({
    meta: [{
      title: "Subscribers — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./creator.settings-DOsoTXth.mjs");
const Route$8 = createFileRoute("/_authenticated/creator/settings")({
  head: () => ({
    meta: [{
      title: "Creator settings — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./creator.earnings-BI8OqAjX.mjs");
const Route$7 = createFileRoute("/_authenticated/creator/earnings")({
  head: () => ({
    meta: [{
      title: "Creator earnings — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./creator.comments-CsrNO00T.mjs");
const Route$6 = createFileRoute("/_authenticated/creator/comments")({
  head: () => ({
    meta: [{
      title: "Comments — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitNotFoundComponentImporter = () => import("./courses._slug-CZgJOXs_.mjs");
const $$splitErrorComponentImporter = () => import("./courses._slug-C7yU1rKJ.mjs");
const $$splitComponentImporter$4 = () => import("./courses._slug-mQE8vSPE.mjs");
const VALID_TABS = ["notes", "summary", "doubt", "exercise", "playground"];
const Route$5 = createFileRoute("/_authenticated/courses/$slug")({
  head: () => ({
    meta: [{
      title: "Course — Learnify AI"
    }]
  }),
  validateSearch: (search) => {
    const t = typeof search.tab === "string" ? search.tab : void 0;
    return {
      tab: t && VALID_TABS.includes(t) ? t : void 0
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$4, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
const $$splitComponentImporter$3 = () => import("./cohorts._id-De8jvn1y.mjs");
const Route$4 = createFileRoute("/_authenticated/cohorts/$id")({
  head: () => ({
    meta: [{
      title: "Cohort — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin.missing-videos-BcznM-B4.mjs");
const Route$3 = createFileRoute("/_authenticated/admin/missing-videos")({
  head: () => ({
    meta: [{
      title: "Missing lesson videos — Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin.enrichment-runs-CWboIjsx.mjs");
const Route$2 = createFileRoute("/_authenticated/admin/enrichment-runs")({
  head: () => ({
    meta: [{
      title: "Enrichment Runs — Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./admin.content-Dqk9FyB9.mjs");
const Route$1 = createFileRoute("/_authenticated/admin/content")({
  head: () => ({
    meta: [{
      title: "Content Manager — Learnify AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
function advance(frequency, current) {
  const d = new Date(current);
  if (frequency === "daily") {
    d.setDate(d.getDate() + 1);
    return d;
  }
  if (frequency === "weekly") {
    d.setDate(d.getDate() + 7);
    return d;
  }
  if (frequency === "hourly") {
    d.setHours(d.getHours() + 1);
    return d;
  }
  return null;
}
async function sendEmail(to, subject, html) {
  const lovKey = process.env.LOVABLE_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!lovKey || !resendKey) return;
  try {
    await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovKey}`,
        "X-Connection-Api-Key": resendKey
      },
      body: JSON.stringify({
        from: "Learnify AI <onboarding@resend.dev>",
        to: [to],
        subject,
        html
      })
    });
  } catch (e) {
    console.error("resend send failed", e);
  }
}
const Route = createFileRoute("/api/public/hooks/run-reminders")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env.CRON_SECRET;
        if (!expected) {
          return new Response(JSON.stringify({ error: "CRON_SECRET not configured" }), {
            status: 503
          });
        }
        const provided = request.headers.get("x-cron-secret") ?? (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
        if (!provided || provided !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }
        const nowIso = (/* @__PURE__ */ new Date()).toISOString();
        const { data: due, error } = await supabaseAdmin.from("scheduled_reminders").select("id, user_id, title, body, frequency, next_run_at").eq("active", true).lte("next_run_at", nowIso).limit(200);
        if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        const list = due ?? [];
        let processed = 0;
        for (const r of list) {
          await supabaseAdmin.from("notifications").insert({
            user_id: r.user_id,
            title: r.title,
            body: r.body,
            type: "reminder"
          });
          const { data: profile } = await supabaseAdmin.from("profiles").select("email, full_name").eq("id", r.user_id).single();
          if (profile?.email) {
            const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;background:#fff;color:#111">
              <h2 style="color:#4f46e5;margin:0 0 12px">${r.title}</h2>
              <p style="line-height:1.6;white-space:pre-wrap">${(r.body ?? "").replace(/</g, "&lt;")}</p>
              <hr style="margin:24px 0;border:none;border-top:1px solid #eee" />
              <p style="font-size:12px;color:#888">— Learnify AI reminders</p>
            </div>`;
            await sendEmail(profile.email, r.title, html);
          }
          const next = advance(r.frequency, new Date(r.next_run_at));
          if (next) {
            await supabaseAdmin.from("scheduled_reminders").update({ next_run_at: next.toISOString(), last_sent_at: nowIso }).eq("id", r.id);
          } else {
            await supabaseAdmin.from("scheduled_reminders").update({ active: false, last_sent_at: nowIso }).eq("id", r.id);
          }
          processed++;
        }
        return new Response(JSON.stringify({ ok: true, processed }), {
          headers: { "Content-Type": "application/json" }
        });
      },
      GET: async () => new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" }
      })
    }
  }
});
const SignupRoute = Route$K.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$L
});
const RoadmapRoute = Route$J.update({
  id: "/roadmap",
  path: "/roadmap",
  getParentRoute: () => Route$L
});
const ResetPasswordRoute = Route$I.update({
  id: "/reset-password",
  path: "/reset-password",
  getParentRoute: () => Route$L
});
const PrivacyRoute = Route$H.update({
  id: "/privacy",
  path: "/privacy",
  getParentRoute: () => Route$L
});
const PricingRoute = Route$G.update({
  id: "/pricing",
  path: "/pricing",
  getParentRoute: () => Route$L
});
const LoginRoute = Route$F.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$L
});
const ForgotPasswordRoute = Route$E.update({
  id: "/forgot-password",
  path: "/forgot-password",
  getParentRoute: () => Route$L
});
const FeaturesRoute = Route$D.update({
  id: "/features",
  path: "/features",
  getParentRoute: () => Route$L
});
const FaqRoute = Route$C.update({
  id: "/faq",
  path: "/faq",
  getParentRoute: () => Route$L
});
const EventsRoute = Route$B.update({
  id: "/events",
  path: "/events",
  getParentRoute: () => Route$L
});
const CreatorsRoute = Route$A.update({
  id: "/creators",
  path: "/creators",
  getParentRoute: () => Route$L
});
const ContactRoute = Route$z.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$L
});
const CommunityRoute = Route$y.update({
  id: "/community",
  path: "/community",
  getParentRoute: () => Route$L
});
const CoachesRoute = Route$x.update({
  id: "/coaches",
  path: "/coaches",
  getParentRoute: () => Route$L
});
const CareersRoute = Route$w.update({
  id: "/careers",
  path: "/careers",
  getParentRoute: () => Route$L
});
const AboutRoute = Route$v.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$L
});
const AuthenticatedRoute = Route$u.update({
  id: "/_authenticated",
  getParentRoute: () => Route$L
});
const IndexRoute = Route$t.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$L
});
const UIdRoute = Route$s.update({
  id: "/u/$id",
  path: "/u/$id",
  getParentRoute: () => Route$L
});
const CertificatesCodeRoute = Route$r.update({
  id: "/certificates/$code",
  path: "/certificates/$code",
  getParentRoute: () => Route$L
});
const ApiChatRoute = Route$q.update({
  id: "/api/chat",
  path: "/api/chat",
  getParentRoute: () => Route$L
});
const AuthenticatedWalletRoute = Route$p.update({
  id: "/wallet",
  path: "/wallet",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedSubmissionsRoute = Route$o.update({
  id: "/submissions",
  path: "/submissions",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedStudioRoute = Route$n.update({
  id: "/studio",
  path: "/studio",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedSettingsRoute = Route$m.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedInboxRoute = Route$l.update({
  id: "/inbox",
  path: "/inbox",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardRoute = Route$k.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedCreatorRoute = Route$j.update({
  id: "/creator",
  path: "/creator",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedCohortsRoute = Route$i.update({
  id: "/cohorts",
  path: "/cohorts",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedCertificatesRoute = Route$h.update({
  id: "/certificates",
  path: "/certificates",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedCartRoute = Route$g.update({
  id: "/cart",
  path: "/cart",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedApplyCreatorRoute = Route$f.update({
  id: "/apply-creator",
  path: "/apply-creator",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedAiToolsRoute = Route$e.update({
  id: "/ai-tools",
  path: "/ai-tools",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedAiRoute = Route$d.update({
  id: "/ai",
  path: "/ai",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedAdminRoute = Route$c.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedCoursesIndexRoute = Route$b.update({
  id: "/courses/",
  path: "/courses/",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedCreatorsIdRoute = Route$a.update({
  id: "/creators/$id",
  path: "/creators/$id",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedCreatorSubscribersRoute = Route$9.update({
  id: "/subscribers",
  path: "/subscribers",
  getParentRoute: () => AuthenticatedCreatorRoute
});
const AuthenticatedCreatorSettingsRoute = Route$8.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AuthenticatedCreatorRoute
});
const AuthenticatedCreatorEarningsRoute = Route$7.update({
  id: "/earnings",
  path: "/earnings",
  getParentRoute: () => AuthenticatedCreatorRoute
});
const AuthenticatedCreatorCommentsRoute = Route$6.update({
  id: "/comments",
  path: "/comments",
  getParentRoute: () => AuthenticatedCreatorRoute
});
const AuthenticatedCoursesSlugRoute = Route$5.update({
  id: "/courses/$slug",
  path: "/courses/$slug",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedCohortsIdRoute = Route$4.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => AuthenticatedCohortsRoute
});
const AuthenticatedAdminMissingVideosRoute = Route$3.update({
  id: "/missing-videos",
  path: "/missing-videos",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminEnrichmentRunsRoute = Route$2.update({
  id: "/enrichment-runs",
  path: "/enrichment-runs",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminContentRoute = Route$1.update({
  id: "/content",
  path: "/content",
  getParentRoute: () => AuthenticatedAdminRoute
});
const ApiPublicHooksRunRemindersRoute = Route.update({
  id: "/api/public/hooks/run-reminders",
  path: "/api/public/hooks/run-reminders",
  getParentRoute: () => Route$L
});
const AuthenticatedAdminRouteChildren = {
  AuthenticatedAdminContentRoute,
  AuthenticatedAdminEnrichmentRunsRoute,
  AuthenticatedAdminMissingVideosRoute
};
const AuthenticatedAdminRouteWithChildren = AuthenticatedAdminRoute._addFileChildren(AuthenticatedAdminRouteChildren);
const AuthenticatedCohortsRouteChildren = {
  AuthenticatedCohortsIdRoute
};
const AuthenticatedCohortsRouteWithChildren = AuthenticatedCohortsRoute._addFileChildren(AuthenticatedCohortsRouteChildren);
const AuthenticatedCreatorRouteChildren = {
  AuthenticatedCreatorCommentsRoute,
  AuthenticatedCreatorEarningsRoute,
  AuthenticatedCreatorSettingsRoute,
  AuthenticatedCreatorSubscribersRoute
};
const AuthenticatedCreatorRouteWithChildren = AuthenticatedCreatorRoute._addFileChildren(AuthenticatedCreatorRouteChildren);
const AuthenticatedRouteChildren = {
  AuthenticatedAdminRoute: AuthenticatedAdminRouteWithChildren,
  AuthenticatedAiRoute,
  AuthenticatedAiToolsRoute,
  AuthenticatedApplyCreatorRoute,
  AuthenticatedCartRoute,
  AuthenticatedCertificatesRoute,
  AuthenticatedCohortsRoute: AuthenticatedCohortsRouteWithChildren,
  AuthenticatedCreatorRoute: AuthenticatedCreatorRouteWithChildren,
  AuthenticatedDashboardRoute,
  AuthenticatedInboxRoute,
  AuthenticatedSettingsRoute,
  AuthenticatedStudioRoute,
  AuthenticatedSubmissionsRoute,
  AuthenticatedWalletRoute,
  AuthenticatedCoursesSlugRoute,
  AuthenticatedCreatorsIdRoute,
  AuthenticatedCoursesIndexRoute
};
const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  AboutRoute,
  CareersRoute,
  CoachesRoute,
  CommunityRoute,
  ContactRoute,
  CreatorsRoute,
  EventsRoute,
  FaqRoute,
  FeaturesRoute,
  ForgotPasswordRoute,
  LoginRoute,
  PricingRoute,
  PrivacyRoute,
  ResetPasswordRoute,
  RoadmapRoute,
  SignupRoute,
  ApiChatRoute,
  CertificatesCodeRoute,
  UIdRoute,
  ApiPublicHooksRunRemindersRoute
};
const routeTree = Route$L._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  COLOR_THEMES as C,
  Route$s as R,
  useTheme as a,
  useMotionPref as b,
  Route$r as c,
  Route$a as d,
  Route$5 as e,
  Route$4 as f,
  router as r,
  supabase as s,
  useAuth as u
};
