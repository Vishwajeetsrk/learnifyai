import { e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell, a as Avatar, b as AvatarImage, c as AvatarFallback } from "./AppShell-BXcQmjDj.mjs";
import { C as CreatorGate, a as CreatorTabs } from "./CreatorTabs-BevizuQm.mjs";
import { C as Card } from "./card-1p_vtslP.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import "../_libs/sonner.mjs";
import { U as Users, L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
function SubscribersPage() {
  const {
    user
  } = useAuth();
  const q = useQuery({
    enabled: !!user,
    queryKey: ["my-subscribers", user?.id],
    queryFn: async () => {
      const {
        data: subs,
        error
      } = await supabase.from("creator_subscriptions").select("subscriber_id, created_at").eq("creator_id", user.id).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      const ids = (subs ?? []).map((s) => s.subscriber_id);
      if (!ids.length) return [];
      const {
        data: profiles
      } = await supabase.from("profiles").select("id, full_name, email, avatar_url").in("id", ids);
      const map = new Map((profiles ?? []).map((p) => [p.id, p]));
      return (subs ?? []).map((s) => ({
        ...s,
        profile: map.get(s.subscriber_id)
      }));
    }
  });
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 sm:px-6 lg:px-10 py-8 max-w-4xl", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreatorTabs, {}, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
      lineNumber: 40,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3 mt-6", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Users, { className: "h-5 w-5 text-primary" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
        lineNumber: 42,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-2xl font-display font-semibold", children: "Subscribers" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
        lineNumber: 43,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
      lineNumber: 41,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1", children: "People following your work — they'll be notified about new lessons." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
      lineNumber: 45,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "mt-6 p-0 overflow-hidden", children: q.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-16 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
      lineNumber: 51,
      columnNumber: 15
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
      lineNumber: 50,
      columnNumber: 26
    }, this) : !q.data?.length ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-16 text-center text-sm text-muted-foreground", children: [
      "No subscribers yet. Share your",
      " ",
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/creators/$id", params: {
        id: user.id
      }, className: "text-primary underline", children: "creator page" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
        lineNumber: 54,
        columnNumber: 15
      }, this),
      "."
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
      lineNumber: 52,
      columnNumber: 40
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "divide-y", children: q.data.map((s) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "flex items-center gap-3 p-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Avatar, { className: "h-9 w-9", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AvatarImage, { src: s.profile?.avatar_url ?? void 0 }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
          lineNumber: 63,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AvatarFallback, { children: (s.profile?.full_name ?? s.profile?.email ?? "?").slice(0, 1).toUpperCase() }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
          lineNumber: 64,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
        lineNumber: 62,
        columnNumber: 19
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-sm font-medium truncate", children: s.profile?.full_name ?? "Anonymous" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
          lineNumber: 69,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] text-muted-foreground truncate", children: s.profile?.email }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
          lineNumber: 72,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
        lineNumber: 68,
        columnNumber: 19
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] text-muted-foreground", children: new Date(s.created_at).toLocaleDateString() }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
        lineNumber: 76,
        columnNumber: 19
      }, this)
    ] }, s.subscriber_id, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
      lineNumber: 61,
      columnNumber: 32
    }, this)) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
      lineNumber: 60,
      columnNumber: 22
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
      lineNumber: 49,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
    lineNumber: 39,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
    lineNumber: 38,
    columnNumber: 10
  }, this);
}
const SplitComponent = () => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreatorGate, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SubscribersPage, {}, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
  lineNumber: 86,
  columnNumber: 7
}, void 0) }, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.subscribers.tsx?tsr-split=component",
  lineNumber: 85,
  columnNumber: 30
}, void 0);
export {
  SplitComponent as component
};
