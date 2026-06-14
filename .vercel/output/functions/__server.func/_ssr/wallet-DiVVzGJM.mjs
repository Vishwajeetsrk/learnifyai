import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AppShell } from "./AppShell-BXcQmjDj.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { I as Input } from "./input-BHvIASyb.mjs";
import { L as Label } from "./label-Dmhuxdmf.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { D as Dialog, f as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-CV-3vits.mjs";
import { W as Wallet, aa as Plus, x as TrendingUp, ab as TrendingDown, ac as Clock3, k as Sparkles, L as LoaderCircle, ad as IndianRupee, ae as CreditCard, af as Smartphone, ag as ArrowDownToLine } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
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
const inr = (n) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
}).format(n);
function WalletPage() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const [amount, setAmount] = reactExports.useState("500");
  const [method, setMethod] = reactExports.useState("razorpay");
  const [reference, setReference] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const txQuery = useQuery({
    enabled: !!user,
    queryKey: ["wallet-tx", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("wallet_transactions").select("id, amount_inr, type, status, description, created_at").eq("user_id", user.id).order("created_at", {
        ascending: false
      }).limit(50);
      if (error) throw error;
      return data ?? [];
    }
  });
  const topupsQuery = useQuery({
    enabled: !!user,
    queryKey: ["wallet-topups", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("wallet_topup_requests").select("*").eq("user_id", user.id).order("created_at", {
        ascending: false
      }).limit(20);
      if (error) throw error;
      return data ?? [];
    }
  });
  reactExports.useEffect(() => {
    if (!user) return;
    const ch = supabase.channel("wallet-live-" + user.id).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "wallet_transactions",
      filter: `user_id=eq.${user.id}`
    }, () => qc.invalidateQueries({
      queryKey: ["wallet-tx"]
    })).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "wallet_topup_requests",
      filter: `user_id=eq.${user.id}`
    }, () => qc.invalidateQueries({
      queryKey: ["wallet-topups"]
    })).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user, qc]);
  const txs = txQuery.data ?? [];
  const completed = txs.filter((t) => t.status === "completed");
  const balance = completed.reduce((s, t) => s + (t.type === "credit" ? Number(t.amount_inr) : -Number(t.amount_inr)), 0);
  const totalIn = completed.filter((t) => t.type === "credit").reduce((s, t) => s + Number(t.amount_inr), 0);
  const totalOut = completed.filter((t) => t.type === "debit").reduce((s, t) => s + Number(t.amount_inr), 0);
  const creatorEarnings = completed.filter((t) => t.type === "credit" && (t.description ?? "").startsWith("Creator earning:"));
  const creatorWithdrawals = completed.filter((t) => t.type === "debit" && (t.description ?? "").startsWith("Withdrawal"));
  const creatorBalance = Math.max(0, creatorEarnings.reduce((s, t) => s + Number(t.amount_inr), 0) - creatorWithdrawals.reduce((s, t) => s + Number(t.amount_inr), 0));
  const pending = (topupsQuery.data ?? []).filter((t) => t.status === "pending");
  async function submitTopup() {
    if (!user) return;
    const amt = Number(amount);
    if (!amt || amt < 50) return toast.error("Minimum amount is ₹50");
    if (amt > 1e5) return toast.error("Maximum amount is ₹1,00,000");
    setSubmitting(true);
    const {
      error
    } = await supabase.from("wallet_topup_requests").insert({
      user_id: user.id,
      amount_inr: amt,
      method,
      reference: reference.trim() || null
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Top-up request submitted. Admin will approve shortly.");
    setOpen(false);
    setReference("");
    qc.invalidateQueries({
      queryKey: ["wallet-topups"]
    });
  }
  const presets = [200, 500, 1e3, 2500, 5e3, 1e4];
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-6xl", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative overflow-hidden rounded-3xl p-6 sm:p-10 text-white shadow-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "absolute -top-20 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 116,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 117,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "absolute inset-0 opacity-[0.07]", style: {
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "22px 22px"
      } }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 118,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative flex items-start justify-between gap-4 flex-wrap", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-12 w-12 rounded-2xl bg-white/15 backdrop-blur grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Wallet, { className: "h-6 w-6" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 126,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 125,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] uppercase tracking-[0.3em] opacity-80", children: "Learnify Wallet" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
              lineNumber: 129,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-sm opacity-90", children: "Available balance" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
              lineNumber: 132,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 128,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 124,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open, onOpenChange: setOpen, children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "lg", className: "bg-white text-indigo-700 hover:bg-white/90 font-semibold shadow-lg", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
              lineNumber: 139,
              columnNumber: 19
            }, this),
            " Top up"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 138,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 137,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TopUpDialogContent, { amount, setAmount, method, setMethod, reference, setReference, submitting, submitTopup, presets, onClose: () => setOpen(false) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 142,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 136,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 123,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative mt-8", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-5xl sm:text-6xl font-display font-semibold tracking-tight tabular-nums", children: inr(balance) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 147,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-2 flex flex-wrap items-center gap-3 text-xs opacity-90", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TrendingUp, { className: "h-3.5 w-3.5" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
              lineNumber: 152,
              columnNumber: 17
            }, this),
            " Added ",
            inr(totalIn)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 151,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "opacity-50", children: "·" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 154,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TrendingDown, { className: "h-3.5 w-3.5" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
              lineNumber: 156,
              columnNumber: 17
            }, this),
            " Spent ",
            inr(totalOut)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 155,
            columnNumber: 15
          }, this),
          pending.length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "opacity-50", children: "·" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
              lineNumber: 159,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "inline-flex items-center gap-1 bg-amber-300/20 text-amber-100 px-2 py-0.5 rounded-full", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Clock3, { className: "h-3 w-3" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
                lineNumber: 161,
                columnNumber: 21
              }, this),
              " ",
              pending.length,
              " pending"
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
              lineNumber: 160,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 158,
            columnNumber: 38
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 150,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 146,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative mt-6 flex flex-wrap gap-2", children: presets.map((p) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => {
        setAmount(String(p));
        setOpen(true);
      }, className: "px-3 py-1.5 rounded-full text-xs bg-white/10 hover:bg-white/20 backdrop-blur border border-white/15 transition", children: [
        "+ ₹",
        p.toLocaleString("en-IN")
      ] }, p, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 169,
        columnNumber: 31
      }, this)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 168,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
      lineNumber: 114,
      columnNumber: 9
    }, this),
    pending.length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 rounded-2xl border bg-card p-5 shadow-card", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-4 w-4 text-amber-500" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 181,
          columnNumber: 15
        }, this),
        " Pending top-ups"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 180,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "space-y-2", children: pending.map((t) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "flex items-center justify-between text-sm border-b last:border-0 pb-2 last:pb-0", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-medium", children: inr(Number(t.amount_inr)) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 186,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground capitalize", children: [
            t.method,
            " · ",
            format(new Date(t.created_at), "dd MMM HH:mm")
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 187,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 185,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", className: "bg-amber-100 text-amber-800 hover:bg-amber-100", children: "Awaiting approval" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 191,
          columnNumber: 19
        }, this)
      ] }, t.id, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 184,
        columnNumber: 33
      }, this)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 183,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
      lineNumber: 179,
      columnNumber: 32
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreatorWithdrawSection, { balance: creatorBalance }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
      lineNumber: 198,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 rounded-2xl border bg-card shadow-card overflow-hidden", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-6 py-4 border-b flex items-center justify-between", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display font-semibold", children: "Transactions" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 203,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs text-muted-foreground", children: [
          txs.length,
          " entries"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 204,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 202,
        columnNumber: 11
      }, this),
      txQuery.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-8 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 207,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 206,
        columnNumber: 32
      }, this) : txs.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-12 text-center", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Wallet, { className: "h-10 w-10 mx-auto text-muted-foreground" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 209,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-3 text-sm font-medium", children: "No transactions yet" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 210,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground mt-1", children: "Top up your wallet to enroll in paid courses." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 211,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 208,
        columnNumber: 41
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "divide-y", children: txs.map((t) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "px-4 sm:px-6 py-3 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: `h-9 w-9 rounded-full grid place-items-center shrink-0 ${t.type === "credit" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`, children: t.type === "credit" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TrendingUp, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 217,
          columnNumber: 44
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TrendingDown, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 217,
          columnNumber: 81
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 216,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm font-medium truncate", children: t.description ?? (t.type === "credit" ? "Wallet top-up" : "Purchase") }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 220,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-muted-foreground", children: format(new Date(t.created_at), "dd MMM yyyy · HH:mm") }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 223,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 219,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: `text-sm font-semibold tabular-nums ${t.type === "credit" ? "text-emerald-600" : "text-rose-600"}`, children: [
            t.type === "credit" ? "+" : "−",
            inr(Number(t.amount_inr))
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 228,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: t.status }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 232,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 227,
          columnNumber: 19
        }, this)
      ] }, t.id, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 215,
        columnNumber: 29
      }, this)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 214,
        columnNumber: 22
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
      lineNumber: 201,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
    lineNumber: 112,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
    lineNumber: 111,
    columnNumber: 10
  }, this);
}
function TopUpDialogContent({
  amount,
  setAmount,
  method,
  setMethod,
  reference,
  setReference,
  submitting,
  submitTopup,
  presets,
  onClose
}) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { children: "Add money to wallet" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 267,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: "Top up instantly via card/UPI, or submit a bank transfer for admin approval." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 268,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
      lineNumber: 266,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Amount (INR)" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 274,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(IndianRupee, { className: "h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 276,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "number", min: 50, max: 1e5, className: "pl-9 text-lg font-semibold h-12", value: amount, onChange: (e) => setAmount(e.target.value) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 277,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 275,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap gap-1.5", children: presets.map((p) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { type: "button", onClick: () => setAmount(String(p)), className: `px-3 py-1.5 rounded-full text-xs border transition ${amount === String(p) ? "border-primary bg-primary/10 text-primary font-semibold" : "hover:bg-accent"}`, children: [
          "₹",
          p.toLocaleString("en-IN")
        ] }, p, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 280,
          columnNumber: 31
        }, this)) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 279,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 273,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Payment method" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 286,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-3 gap-2", children: [{
          v: "razorpay",
          l: "Card",
          icon: CreditCard
        }, {
          v: "upi",
          l: "UPI",
          icon: Smartphone
        }, {
          v: "manual",
          l: "Bank",
          icon: ArrowDownToLine
        }].map(({
          v,
          l,
          icon: Icon
        }) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { type: "button", onClick: () => setMethod(v), className: `rounded-xl border p-3 text-xs flex flex-col items-center gap-1.5 transition ${method === v ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent"}`, children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Icon, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 305,
            columnNumber: 17
          }, this),
          " ",
          l
        ] }, v, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 304,
          columnNumber: 17
        }, this)) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 287,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 285,
        columnNumber: 9
      }, this),
      method !== "razorpay" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Reference / UTR (optional)" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 310,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: reference, onChange: (e) => setReference(e.target.value), placeholder: "e.g. UPI ref id", maxLength: 64 }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 311,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 309,
        columnNumber: 35
      }, this),
      method === "razorpay" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground rounded-lg bg-muted p-3", children: [
        "Live card checkout will be enabled once an admin connects payments. Your request will be created as ",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("b", { children: "pending" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 315,
          columnNumber: 24
        }, this),
        "."
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 313,
        columnNumber: 35
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
      lineNumber: 272,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: onClose, disabled: submitting, children: "Cancel" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 319,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: submitTopup, disabled: submitting, children: [
        submitting ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 323,
          columnNumber: 25
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 323,
          columnNumber: 72
        }, this),
        " ",
        "Submit"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 322,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
      lineNumber: 318,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
    lineNumber: 265,
    columnNumber: 10
  }, this);
}
function CreatorWithdrawSection({
  balance
}) {
  const {
    user,
    hasRole
  } = useAuth();
  const qc = useQueryClient();
  const isCreator = hasRole("creator") || hasRole("super_admin") || hasRole("admin");
  const [open, setOpen] = reactExports.useState(false);
  const [amt, setAmt] = reactExports.useState("500");
  const [method, setMethod] = reactExports.useState("upi");
  const [dest, setDest] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const payoutQuery = useQuery({
    enabled: !!user && isCreator,
    queryKey: ["my-payout-dest", user?.id],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("profiles").select("payout_destination").eq("id", user.id).maybeSingle();
      return data?.payout_destination ?? null;
    }
  });
  const wQuery = useQuery({
    enabled: !!user && isCreator,
    queryKey: ["my-withdrawals", user?.id],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("creator_withdrawals").select("id, amount_inr, method, status, created_at, admin_notes").eq("user_id", user.id).order("created_at", {
        ascending: false
      }).limit(20);
      return data ?? [];
    }
  });
  function autofillFor(m) {
    const p = payoutQuery.data;
    if (!p) return "";
    if (m === "upi") return p.upi_id ?? "";
    if (m === "paypal") return p.paypal_email ?? "";
    if (m === "bank") {
      const parts = [p.account_name, p.account_number, p.ifsc].filter(Boolean);
      return parts.join(" · ");
    }
    return "";
  }
  reactExports.useEffect(() => {
    if (!open) return;
    const preferred = payoutQuery.data?.method ?? "upi";
    setMethod(preferred);
    setDest(autofillFor(preferred));
  }, [open, payoutQuery.data]);
  if (!isCreator) return null;
  async function submit() {
    if (!user) return;
    const n = Number(amt);
    if (!n || n < 100) return toast.error("Minimum withdrawal is ₹100");
    if (n > balance) return toast.error("Insufficient balance");
    if (!dest.trim()) return toast.error("Destination details required");
    setSubmitting(true);
    const {
      error
    } = await supabase.from("creator_withdrawals").insert({
      user_id: user.id,
      amount_inr: n,
      method,
      destination: {
        details: dest.trim(),
        saved: payoutQuery.data ?? null
      }
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Withdrawal requested");
    setOpen(false);
    setDest("");
    qc.invalidateQueries({
      queryKey: ["my-withdrawals"]
    });
  }
  (wQuery.data ?? []).filter((w) => w.status === "pending");
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 rounded-2xl border bg-card p-5 shadow-card", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowDownToLine, { className: "h-4 w-4 text-primary" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 429,
            columnNumber: 13
          }, this),
          " Creator withdrawals"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 428,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground mt-1", children: [
          "Withdraw earnings to bank, UPI, or PayPal. Available: ",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("b", { children: inr(balance) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 432,
            columnNumber: 67
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 431,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 427,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", disabled: balance < 100, children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowDownToLine, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 438,
            columnNumber: 15
          }, this),
          " Request withdrawal"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 437,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 436,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { className: "sm:max-w-md", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { children: "Withdraw funds" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
              lineNumber: 443,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: [
              "Available balance: ",
              inr(balance)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
              lineNumber: 444,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 442,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Amount (INR)" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
                lineNumber: 448,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "number", min: 100, max: balance, value: amt, onChange: (e) => setAmt(e.target.value) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
                lineNumber: 449,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
              lineNumber: 447,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Method" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
                lineNumber: 452,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-3 gap-2", children: ["upi", "bank", "paypal"].map((m) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { type: "button", onClick: () => {
                setMethod(m);
                setDest(autofillFor(m));
              }, className: `rounded-xl border p-2 text-xs capitalize ${method === m ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent"}`, children: m }, m, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
                lineNumber: 454,
                columnNumber: 66
              }, this)) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
                lineNumber: 453,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
              lineNumber: 451,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: method === "upi" ? "UPI ID" : method === "bank" ? "Account number + IFSC" : "PayPal email" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
                  lineNumber: 464,
                  columnNumber: 19
                }, this),
                autofillFor(method) && autofillFor(method) !== dest && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { type: "button", className: "text-[11px] text-primary hover:underline", onClick: () => setDest(autofillFor(method)), children: "Use saved" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
                  lineNumber: 467,
                  columnNumber: 75
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
                lineNumber: 463,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: dest, onChange: (e) => setDest(e.target.value), maxLength: 200, placeholder: autofillFor(method) || "Enter details" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
                lineNumber: 471,
                columnNumber: 17
              }, this),
              !payoutQuery.data && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-muted-foreground", children: [
                "Tip: save your details in",
                " ",
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: "/creator/settings", className: "text-primary hover:underline", children: "Creator settings" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
                  lineNumber: 474,
                  columnNumber: 21
                }, this),
                " ",
                "to autofill next time."
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
                lineNumber: 472,
                columnNumber: 39
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
              lineNumber: 462,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 446,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: submit, disabled: submitting, children: [
            submitting ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
              lineNumber: 483,
              columnNumber: 31
            }, this) : null,
            " Submit request"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 482,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 481,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 441,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 435,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
      lineNumber: 426,
      columnNumber: 7
    }, this),
    (wQuery.data ?? []).length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "mt-4 divide-y border-t", children: (wQuery.data ?? []).map((w) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "py-2.5 flex items-center justify-between text-sm", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-medium", children: [
          inr(Number(w.amount_inr)),
          " ·",
          " ",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "capitalize text-muted-foreground", children: w.method }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
            lineNumber: 494,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 492,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground", children: [
          format(new Date(w.created_at), "dd MMM yyyy HH:mm"),
          w.admin_notes ? ` · ${w.admin_notes}` : ""
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
          lineNumber: 496,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 491,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: w.status === "paid" ? "default" : w.status === "rejected" ? "destructive" : "secondary", className: "capitalize text-[10px]", children: w.status }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
        lineNumber: 501,
        columnNumber: 15
      }, this)
    ] }, w.id, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
      lineNumber: 490,
      columnNumber: 41
    }, this)) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
      lineNumber: 489,
      columnNumber: 42
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/wallet.tsx?tsr-split=component",
    lineNumber: 425,
    columnNumber: 10
  }, this);
}
export {
  WalletPage as component
};
