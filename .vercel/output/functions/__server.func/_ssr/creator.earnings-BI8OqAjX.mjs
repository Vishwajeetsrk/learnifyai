import { e as jsxDevRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-BXcQmjDj.mjs";
import { C as CreatorGate, a as CreatorTabs } from "./CreatorTabs-BevizuQm.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { C as Card } from "./card-1p_vtslP.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import "../_libs/sonner.mjs";
import { ag as ArrowDownToLine, ad as IndianRupee, x as TrendingUp, W as Wallet, L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
const inr = (n) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
}).format(n);
function CreatorEarningsPage() {
  const {
    user
  } = useAuth();
  const txQuery = useQuery({
    enabled: !!user,
    queryKey: ["creator-earnings-tx", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("wallet_transactions").select("id, amount_inr, type, status, description, created_at").eq("user_id", user.id).order("created_at", {
        ascending: false
      }).limit(100);
      if (error) throw error;
      return data ?? [];
    }
  });
  const rows = txQuery.data ?? [];
  const creatorCredits = rows.filter((tx) => tx.status === "completed" && tx.type === "credit" && (tx.description ?? "").startsWith("Creator earning:"));
  const withdrawals = rows.filter((tx) => tx.status === "completed" && tx.type === "debit" && (tx.description ?? "").startsWith("Withdrawal"));
  const gross = creatorCredits.reduce((sum, tx) => sum + Number(tx.amount_inr), 0);
  const paidOut = withdrawals.reduce((sum, tx) => sum + Number(tx.amount_inr), 0);
  const available = Math.max(0, gross - paidOut);
  const month = reactExports.useMemo(() => {
    const start = /* @__PURE__ */ new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return creatorCredits.filter((tx) => new Date(tx.created_at) >= start).reduce((sum, tx) => sum + Number(tx.amount_inr), 0);
  }, [creatorCredits]);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 sm:px-6 lg:px-10 py-8 max-w-6xl", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreatorTabs, {}, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
      lineNumber: 51,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 flex flex-wrap items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs uppercase tracking-widest text-primary font-medium", children: "Creator earnings" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
          lineNumber: 54,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "mt-1 text-2xl sm:text-3xl font-display font-semibold", children: "How you earn on Learnify" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
          lineNumber: 57,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1", children: "Paid course enrollments credit your creator wallet automatically after checkout." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
          lineNumber: 60,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
        lineNumber: 53,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, size: "sm", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/wallet", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowDownToLine, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
          lineNumber: 66,
          columnNumber: 15
        }, this),
        " Withdraw"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
        lineNumber: 65,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
        lineNumber: 64,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
      lineNumber: 52,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Metric, { icon: IndianRupee, label: "Available", value: inr(available) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
        lineNumber: 72,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Metric, { icon: TrendingUp, label: "This month", value: inr(month) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
        lineNumber: 73,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Metric, { icon: Wallet, label: "Paid out", value: inr(paidOut) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
        lineNumber: 74,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
      lineNumber: 71,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "mt-6 p-5 space-y-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display font-semibold", children: "Earning rules" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
        lineNumber: 78,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "text-sm text-muted-foreground space-y-2 list-disc pl-5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: "Create a paid course in Studio and publish it after every lesson has a valid video URL." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
          lineNumber: 80,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: "When a learner buys the course with wallet checkout, the learner is enrolled and your wallet receives the course sale amount." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
          lineNumber: 84,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: "Free courses build audience and subscribers, but do not add wallet earnings." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
          lineNumber: 88,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: "Use Creator settings for payout details, then request withdrawal from Wallet when your available amount is at least ₹100." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
          lineNumber: 89,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
        lineNumber: 79,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
      lineNumber: 77,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 rounded-2xl border bg-card shadow-card overflow-hidden", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-6 py-4 border-b flex items-center justify-between", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display font-semibold", children: "Recent creator earnings" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
          lineNumber: 98,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", className: "text-[10px]", children: [
          creatorCredits.length,
          " sales"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
          lineNumber: 99,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
        lineNumber: 97,
        columnNumber: 11
      }, this),
      txQuery.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-10 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
        lineNumber: 104,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
        lineNumber: 103,
        columnNumber: 32
      }, this) : creatorCredits.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-10 text-center text-sm text-muted-foreground", children: "No paid course earnings yet." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
        lineNumber: 105,
        columnNumber: 52
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "divide-y", children: creatorCredits.map((tx) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "px-6 py-3 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm font-medium truncate", children: tx.description?.replace("Creator earning: ", "") }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
            lineNumber: 110,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground", children: format(new Date(tx.created_at), "dd MMM yyyy · HH:mm") }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
            lineNumber: 113,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
          lineNumber: 109,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-semibold text-emerald-600", children: [
          "+",
          inr(Number(tx.amount_inr))
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
          lineNumber: 117,
          columnNumber: 19
        }, this)
      ] }, tx.id, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
        lineNumber: 108,
        columnNumber: 41
      }, this)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
        lineNumber: 107,
        columnNumber: 22
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
      lineNumber: 96,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
    lineNumber: 50,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
    lineNumber: 49,
    columnNumber: 10
  }, this);
}
function Metric({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "p-5", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Icon, { className: "h-4 w-4 text-primary" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
        lineNumber: 137,
        columnNumber: 9
      }, this),
      " ",
      label
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
      lineNumber: 136,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-2 text-2xl font-display font-semibold", children: value }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
      lineNumber: 139,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
    lineNumber: 135,
    columnNumber: 10
  }, this);
}
const SplitComponent = () => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreatorGate, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreatorEarningsPage, {}, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
  lineNumber: 143,
  columnNumber: 7
}, void 0) }, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.earnings.tsx?tsr-split=component",
  lineNumber: 142,
  columnNumber: 30
}, void 0);
export {
  SplitComponent as component
};
