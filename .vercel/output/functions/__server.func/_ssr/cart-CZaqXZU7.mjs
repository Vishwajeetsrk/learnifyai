import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AppShell } from "./AppShell-BXcQmjDj.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { I as Input } from "./input-BHvIASyb.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { c as checkoutCart, C as COUPONS, a as CelebrationOverlay } from "./CelebrationOverlay-Dehe7viu.mjs";
import "../_libs/seroval.mjs";
import { N as ShoppingCart, L as LoaderCircle, A as ArrowRight, ah as Trash2, aK as Tag, c as Check, $ as X, k as Sparkles, ae as CreditCard, af as Smartphone, aL as Landmark, Y as Shield } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
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
import "../_libs/zod.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "./createSsrRpc-BR3wbl1z.mjs";
import "./server-BLOOEPZP.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-BVm8xUae.mjs";
function PaymentLoader({ label = "Processing your payment…" }) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "fixed inset-0 z-[90] grid place-items-center bg-background/70 backdrop-blur-md", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    motion.div,
    {
      initial: { opacity: 0, y: 16, scale: 0.96 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: { type: "spring", stiffness: 240, damping: 22 },
      className: "relative w-[min(360px,90vw)] rounded-3xl border bg-card p-7 text-center shadow-2xl overflow-hidden",
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative mx-auto h-20 w-20", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            motion.div,
            {
              className: "absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500",
              animate: { rotate: 360 },
              transition: { duration: 2.2, repeat: Infinity, ease: "linear" },
              style: {
                maskImage: "radial-gradient(circle, transparent 56%, black 58%)",
                WebkitMaskImage: "radial-gradient(circle, transparent 56%, black 58%)"
              }
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/PaymentLoader.tsx",
              lineNumber: 15,
              columnNumber: 11
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "absolute inset-2 rounded-full bg-card grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            motion.div,
            {
              animate: { scale: [1, 1.08, 1] },
              transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
              className: "h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground grid place-items-center shadow-lg",
              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreditCard, { className: "h-5 w-5" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/PaymentLoader.tsx",
                lineNumber: 30,
                columnNumber: 15
              }, this)
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/PaymentLoader.tsx",
              lineNumber: 25,
              columnNumber: 13
            },
            this
          ) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/PaymentLoader.tsx",
            lineNumber: 24,
            columnNumber: 11
          }, this),
          [0, 1, 2].map((i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            motion.span,
            {
              className: "absolute top-1/2 left-1/2 h-2 w-2 rounded-full bg-primary shadow-glow",
              animate: {
                x: Math.cos(i / 3 * Math.PI * 2) * 44,
                y: Math.sin(i / 3 * Math.PI * 2) * 44,
                opacity: [0.3, 1, 0.3]
              },
              transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }
            },
            i,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/PaymentLoader.tsx",
              lineNumber: 35,
              columnNumber: 13
            },
            this
          ))
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/PaymentLoader.tsx",
          lineNumber: 14,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "mt-5 font-display text-lg font-semibold", children: label }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/PaymentLoader.tsx",
          lineNumber: 48,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          motion.div,
          {
            className: "h-full w-1/3 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500",
            animate: { x: ["-120%", "320%"] },
            transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
          },
          void 0,
          false,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/PaymentLoader.tsx",
            lineNumber: 52,
            columnNumber: 11
          },
          this
        ) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/PaymentLoader.tsx",
          lineNumber: 51,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "mt-5 space-y-1.5 text-left text-xs text-muted-foreground", children: [
          { icon: Shield, text: "Securing your transaction" },
          { icon: Check, text: "Validating wallet & coupon" },
          { icon: Sparkles, text: "Activating your enrollments" }
        ].map((step, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          motion.li,
          {
            initial: { opacity: 0, x: -8 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: 0.15 + i * 0.18 },
            className: "flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(step.icon, { className: "h-3.5 w-3.5 text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/PaymentLoader.tsx",
                lineNumber: 72,
                columnNumber: 15
              }, this),
              step.text
            ]
          },
          i,
          true,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/PaymentLoader.tsx",
            lineNumber: 65,
            columnNumber: 13
          },
          this
        )) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/PaymentLoader.tsx",
          lineNumber: 59,
          columnNumber: 9
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/PaymentLoader.tsx",
      lineNumber: 7,
      columnNumber: 7
    },
    this
  ) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/PaymentLoader.tsx",
    lineNumber: 6,
    columnNumber: 5
  }, this);
}
const inr = (n) => n === 0 ? "Free" : new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
}).format(n);
function CartPage() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const checkout = useServerFn(checkoutCart);
  const [paying, setPaying] = reactExports.useState(false);
  const [celebration, setCelebration] = reactExports.useState(null);
  const [couponInput, setCouponInput] = reactExports.useState("");
  const [appliedCoupon, setAppliedCoupon] = reactExports.useState(null);
  const [method, setMethod] = reactExports.useState("wallet");
  const q = useQuery({
    enabled: !!user,
    queryKey: ["cart", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("cart_items").select("id, added_at, course_id, courses:course_id (id, slug, title, cover_url, price_inr, instructor, level)").eq("user_id", user.id).order("added_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const balQ = useQuery({
    enabled: !!user,
    queryKey: ["wallet-balance", user?.id],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("wallet_transactions").select("amount_inr, type, status").eq("user_id", user.id);
      return (data ?? []).filter((t) => t.status === "completed").reduce((s, t) => s + (t.type === "credit" ? Number(t.amount_inr) : -Number(t.amount_inr)), 0);
    }
  });
  const items = q.data ?? [];
  const subtotal = items.reduce((s, it) => s + Number(it.courses?.price_inr ?? 0), 0);
  const discount = reactExports.useMemo(() => {
    if (!appliedCoupon) return 0;
    const c = COUPONS[appliedCoupon];
    if (!c) return 0;
    const raw = c.type === "percent" ? Math.floor(subtotal * c.value / 100) : c.value;
    return Math.min(raw, subtotal);
  }, [appliedCoupon, subtotal]);
  const total = Math.max(0, subtotal - discount);
  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (!COUPONS[code]) {
      toast.error("Invalid coupon code");
      return;
    }
    setAppliedCoupon(code);
    toast.success(`Coupon applied: ${COUPONS[code].label}`);
  };
  const remove = async (id) => {
    await supabase.from("cart_items").delete().eq("id", id);
    qc.invalidateQueries({
      queryKey: ["cart"]
    });
  };
  const pay = async () => {
    if (method !== "wallet") {
      toast.info(`${method.toUpperCase()} payments will be enabled once an admin connects payments. Use wallet for now.`);
      return;
    }
    setPaying(true);
    try {
      const r = await checkout({
        data: {
          coupon: appliedCoupon
        }
      });
      toast.success(`Enrolled in ${r.enrolled} course${r.enrolled === 1 ? "" : "s"}`);
      qc.invalidateQueries({
        queryKey: ["cart"]
      });
      qc.invalidateQueries({
        queryKey: ["wallet-tx"]
      });
      qc.invalidateQueries({
        queryKey: ["wallet-balance"]
      });
      qc.invalidateQueries({
        queryKey: ["enrollments"]
      });
      setCelebration({
        title: "You're enrolled!",
        message: r.slugs[0] ? "Opening your first lesson now…" : "Your learning dashboard is ready.",
        to: r.slugs[0] ? "/courses/$slug" : "/dashboard",
        slug: r.slugs[0]
      });
    } catch (e) {
      toast.error(e?.message ?? "Checkout failed");
    } finally {
      setPaying(false);
    }
  };
  const methods = [{
    id: "wallet",
    label: "Wallet",
    icon: Sparkles,
    note: "Instant"
  }, {
    id: "card",
    label: "Card",
    icon: CreditCard,
    note: "Coming soon"
  }, {
    id: "upi",
    label: "UPI",
    icon: Smartphone,
    note: "Coming soon"
  }, {
    id: "bank",
    label: "Bank",
    icon: Landmark,
    note: "Manual"
  }];
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: [
    paying && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(PaymentLoader, { label: "Processing your enrollment…" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
      lineNumber: 153,
      columnNumber: 18
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CelebrationOverlay, { show: !!celebration, title: celebration?.title ?? "Congratulations", message: celebration?.message, withSound: true, durationMs: 1500, onDone: () => {
      if (celebration?.slug) navigate({
        to: "/courses/$slug",
        params: {
          slug: celebration.slug
        }
      });
      else navigate({
        to: "/dashboard"
      });
    } }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
      lineNumber: 154,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-5xl", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs uppercase tracking-[0.3em] text-primary font-medium", children: "Checkout" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
          lineNumber: 167,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "mt-1 text-2xl sm:text-3xl font-display font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ShoppingCart, { className: "h-6 w-6 text-primary" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
            lineNumber: 171,
            columnNumber: 15
          }, this),
          " Your Cart",
          items.length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "ml-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold", children: items.length }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
            lineNumber: 172,
            columnNumber: 36
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
          lineNumber: 170,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
        lineNumber: 166,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
        lineNumber: 165,
        columnNumber: 9
      }, this),
      q.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-20 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
        lineNumber: 180,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
        lineNumber: 179,
        columnNumber: 24
      }, this) : items.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 rounded-3xl border bg-gradient-to-br from-indigo-50 via-violet-50 to-fuchsia-50 p-12 text-center shadow-card", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mx-auto h-16 w-16 rounded-2xl bg-white grid place-items-center shadow-card", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ShoppingCart, { className: "h-8 w-8 text-primary" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
          lineNumber: 183,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
          lineNumber: 182,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-4 font-display font-semibold text-lg", children: "Your cart is empty" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
          lineNumber: 185,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1 max-w-sm mx-auto", children: "Add a course from the catalog — pay with your Learnify wallet and start learning instantly." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
          lineNumber: 186,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, className: "mt-5", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/courses", children: [
          "Browse courses ",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowRight, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
            lineNumber: 192,
            columnNumber: 32
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
          lineNumber: 191,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
          lineNumber: 190,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
        lineNumber: 181,
        columnNumber: 41
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: items.map((it) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-xl border bg-card p-3 flex gap-3 shadow-card", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-24 sm:w-32 aspect-video bg-muted rounded-lg overflow-hidden shrink-0", children: it.courses?.cover_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: it.courses.cover_url, alt: it.courses.title, className: "w-full h-full object-cover" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
            lineNumber: 199,
            columnNumber: 47
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
            lineNumber: 198,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/courses/$slug", params: {
              slug: it.courses?.slug
            }, className: "font-medium hover:text-primary line-clamp-2", children: it.courses?.title }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
              lineNumber: 202,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 text-xs text-muted-foreground mt-1", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-[10px]", children: it.courses?.level }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                lineNumber: 208,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                "· ",
                it.courses?.instructor
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                lineNumber: 211,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
              lineNumber: 207,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-2 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-sm font-semibold", children: inr(Number(it.courses?.price_inr ?? 0)) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                lineNumber: 214,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "icon", variant: "ghost", onClick: () => remove(it.id), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trash2, { className: "h-4 w-4 text-destructive" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                lineNumber: 218,
                columnNumber: 25
              }, this) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                lineNumber: 217,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
              lineNumber: 213,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
            lineNumber: 201,
            columnNumber: 19
          }, this)
        ] }, it.id, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
          lineNumber: 197,
          columnNumber: 39
        }, this)) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
          lineNumber: 196,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card p-5 shadow-card h-fit sticky top-4 space-y-4", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold", children: "Order summary" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
            lineNumber: 226,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "text-xs font-medium flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Tag, { className: "h-3.5 w-3.5 text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                lineNumber: 231,
                columnNumber: 19
              }, this),
              " Coupon / offer"
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
              lineNumber: 230,
              columnNumber: 17
            }, this),
            appliedCoupon ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 text-sm", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { className: "h-4 w-4 text-emerald-600" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                  lineNumber: 235,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-semibold text-emerald-700", children: appliedCoupon }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                  lineNumber: 236,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs text-emerald-600", children: [
                  "· ",
                  COUPONS[appliedCoupon]?.label
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                  lineNumber: 237,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                lineNumber: 234,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => {
                setAppliedCoupon(null);
                setCouponInput("");
              }, className: "text-emerald-700 hover:text-emerald-900", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(X, { className: "h-4 w-4" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                lineNumber: 245,
                columnNumber: 23
              }, this) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                lineNumber: 241,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
              lineNumber: 233,
              columnNumber: 34
            }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: couponInput, onChange: (e) => setCouponInput(e.target.value.toUpperCase()), placeholder: "Try WELCOME10, LEARN20…", className: "h-9 text-sm uppercase", onKeyDown: (e) => e.key === "Enter" && applyCoupon() }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                lineNumber: 248,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: applyCoupon, children: "Apply" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                lineNumber: 249,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
              lineNumber: 247,
              columnNumber: 28
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap gap-1", children: Object.entries(COUPONS).slice(0, 3).map(([code, c]) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => {
              setCouponInput(code);
              setAppliedCoupon(code);
              toast.success(`Coupon applied: ${c.label}`);
            }, className: "text-[10px] px-2 py-0.5 rounded-full border border-dashed border-primary/40 text-primary hover:bg-primary/5", children: [
              code,
              " · ",
              c.label
            ] }, code, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
              lineNumber: 254,
              columnNumber: 75
            }, this)) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
              lineNumber: 253,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
            lineNumber: 229,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "text-xs font-medium", children: "Payment method" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
              lineNumber: 266,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-4 gap-1.5", children: methods.map((m) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setMethod(m.id), className: `rounded-lg border p-2 text-[10px] flex flex-col items-center gap-1 transition ${method === m.id ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent"}`, children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(m.icon, { className: "h-4 w-4" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                lineNumber: 269,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-medium", children: m.label }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                lineNumber: 270,
                columnNumber: 23
              }, this)
            ] }, m.id, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
              lineNumber: 268,
              columnNumber: 37
            }, this)) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
              lineNumber: 267,
              columnNumber: 17
            }, this),
            method !== "wallet" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5", children: method === "bank" ? "Bank transfer: top up wallet first, then check out." : `${method.toUpperCase()} live checkout will be enabled once an admin connects payments.` }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
              lineNumber: 273,
              columnNumber: 41
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
            lineNumber: 265,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "border-t pt-3 space-y-1.5 text-sm", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-muted-foreground", children: [
                "Subtotal (",
                items.length,
                ")"
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                lineNumber: 281,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: inr(subtotal) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                lineNumber: 282,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
              lineNumber: 280,
              columnNumber: 17
            }, this),
            discount > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-between text-emerald-600", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Discount" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                lineNumber: 285,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                "−",
                inr(discount)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                lineNumber: 286,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
              lineNumber: 284,
              columnNumber: 34
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-between font-display text-lg font-semibold pt-1", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Total" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                lineNumber: 289,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: inr(total) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
                lineNumber: 290,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
              lineNumber: 288,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
            lineNumber: 279,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "border-t pt-3 text-xs text-muted-foreground", children: [
            "Wallet balance:",
            " ",
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: `font-semibold ${(balQ.data ?? 0) < total ? "text-destructive" : "text-foreground"}`, children: inr(balQ.data ?? 0) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
              lineNumber: 296,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
            lineNumber: 294,
            columnNumber: 15
          }, this),
          (balQ.data ?? 0) < total && method === "wallet" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/wallet", className: "text-xs text-primary block", children: "Top up wallet →" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
            lineNumber: 300,
            columnNumber: 67
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { className: "w-full", onClick: pay, disabled: paying || items.length === 0, children: [
            paying ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
              lineNumber: 304,
              columnNumber: 27
            }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreditCard, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
              lineNumber: 304,
              columnNumber: 74
            }, this),
            " ",
            "Pay ",
            inr(total)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
            lineNumber: 303,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-muted-foreground", children: "Free courses enroll instantly. Coupon savings applied at checkout." }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
            lineNumber: 307,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
          lineNumber: 225,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
        lineNumber: 195,
        columnNumber: 20
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
      lineNumber: 164,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cart.tsx?tsr-split=component",
    lineNumber: 152,
    columnNumber: 10
  }, this);
}
export {
  CartPage as component
};
