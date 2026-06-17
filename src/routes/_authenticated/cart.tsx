import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import {
  Loader2,
  ShoppingCart,
  Trash2,
  CreditCard,
  ArrowRight,
  Tag,
  Check,
  X,
  Smartphone,
  Landmark,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { checkoutCart, COUPONS } from "@/lib/course.functions";
<<<<<<< HEAD
import { createRazorpayOrder } from "@/lib/payment.functions";
=======
import { createRazorpayOrder, verifyWalletTopup } from "@/lib/payment.functions";
>>>>>>> fc4522b843573bc1c1f5dd8e35d41f7bbd28de87
import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import { PaymentLoader } from "@/components/PaymentLoader";

export const Route = createFileRoute("/_authenticated/cart")({
  head: () => ({ meta: [{ title: "Cart — Learnify AI" }] }),
  component: CartPage,
});

const loadRazorpay = () =>
  new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const inr = (n: number) =>
  n === 0
    ? "Free"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(n);

type PayMethod = "wallet" | "card" | "upi" | "bank";

function CartPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const checkout = useServerFn(checkoutCart);
  const createOrder = useServerFn(createRazorpayOrder);
<<<<<<< HEAD
=======
  const verifyTopup = useServerFn(verifyWalletTopup);
>>>>>>> fc4522b843573bc1c1f5dd8e35d41f7bbd28de87
  const [paying, setPaying] = useState(false);
  const [celebration, setCelebration] = useState<{
    title: string;
    message: string;
    to: string | null;
    slug?: string;
  } | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [method, setMethod] = useState<PayMethod>("wallet");

  const q = useQuery({
    enabled: !!user,
    queryKey: ["cart", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cart_items")
        .select(
          "id, added_at, course_id, courses:course_id (id, slug, title, cover_url, price_inr, instructor, level)",
        )
        .eq("user_id", user!.id)
        .order("added_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const balQ = useQuery({
    enabled: !!user,
    queryKey: ["wallet-balance", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("wallet_transactions")
        .select("amount_inr, type, status")
        .eq("user_id", user!.id);
      return (data ?? [])
        .filter((t) => t.status === "completed")
        .reduce(
          (s, t) => s + (t.type === "credit" ? Number(t.amount_inr) : -Number(t.amount_inr)),
          0,
        );
    },
  });

  const items = q.data ?? [];
  const subtotal = items.reduce((s, it: any) => s + Number(it.courses?.price_inr ?? 0), 0);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const c = COUPONS[appliedCoupon];
    if (!c) return 0;
    const raw = c.type === "percent" ? Math.floor((subtotal * c.value) / 100) : c.value;
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

  const remove = async (id: string) => {
    await supabase.from("cart_items").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["cart"] });
  };

  const handleCheckoutSuccess = async (rzpData?: any) => {
    try {
<<<<<<< HEAD
=======
      if (rzpData && rzpData.razorpay_payment_id) {
        await verifyTopup({
          data: {
            amountInr: total,
            method: method,
            razorpay_payment_id: rzpData.razorpay_payment_id,
            razorpay_order_id: rzpData.razorpay_order_id,
            razorpay_signature: rzpData.razorpay_signature,
          }
        });
      }

>>>>>>> fc4522b843573bc1c1f5dd8e35d41f7bbd28de87
      const r = await checkout({ data: { coupon: appliedCoupon } });
      toast.success(`Enrolled in ${r.enrolled} course${r.enrolled === 1 ? "" : "s"}`);
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["wallet-tx"] });
      qc.invalidateQueries({ queryKey: ["wallet-balance"] });
      qc.invalidateQueries({ queryKey: ["enrollments"] });
      setCelebration({
        title: "You're enrolled!",
        message: r.slugs[0]
          ? "Opening your first lesson now…"
          : "Your learning dashboard is ready.",
        to: r.slugs[0] ? "/courses/$slug" : "/dashboard",
        slug: r.slugs[0],
      });
    } catch (e: any) {
      toast.error(e?.message ?? "Checkout failed");
    } finally {
      setPaying(false);
    }
  };

  const pay = async () => {
    setPaying(true);
    try {
      if (method !== "wallet") {
        const loaded = await loadRazorpay();
        if (!loaded) throw new Error("Razorpay SDK failed to load");

        const order = await createOrder({ data: { amountInr: total } });
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_T1tN8tDaacLQxo",
          amount: order.amount,
          currency: order.currency,
          name: "Learnify AI",
          description: "Course Enrollment",
          order_id: order.id,
          handler: async function (response: any) {
            await handleCheckoutSuccess(response);
          },
          prefill: {
            email: user?.email || "",
          },
          theme: { color: "#4f46e5" },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setPaying(false);
          toast.error(response.error.description || "Payment failed");
        });
        rzp.open();
      } else {
        await handleCheckoutSuccess();
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Checkout failed");
      setPaying(false);
    }
  };

  const methods: { id: PayMethod; label: string; icon: any; note?: string }[] = [
    { id: "wallet", label: "Wallet", icon: Sparkles, note: "Instant" },
    { id: "card", label: "Card", icon: CreditCard, note: "Fast" },
    { id: "upi", label: "UPI", icon: Smartphone, note: "Fast" },
    { id: "bank", label: "Bank", icon: Landmark, note: "Netbanking" },
  ];

  return (
    <AppShell>
      {paying && <PaymentLoader label="Processing your enrollment…" />}
      <CelebrationOverlay
        show={!!celebration}
        title={celebration?.title ?? "Congratulations"}
        message={celebration?.message}
        withSound
        durationMs={1500}
        onDone={() => {
          if (celebration?.slug)
            navigate({ to: "/courses/$slug", params: { slug: celebration.slug } });
          else navigate({ to: "/dashboard" });
        }}
      />
      <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-5xl">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
              Checkout
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-display font-semibold flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" /> Your Cart
              {items.length > 0 && (
                <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                  {items.length}
                </span>
              )}
            </h1>
          </div>
        </div>

        {q.isLoading ? (
          <div className="py-20 grid place-items-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-8 rounded-3xl border bg-gradient-to-br from-indigo-50 via-violet-50 to-fuchsia-50 p-12 text-center shadow-card">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-white grid place-items-center shadow-card">
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
            <p className="mt-4 font-display font-semibold text-lg">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              Add a course from the catalog — pay with your Learnify wallet and start learning
              instantly.
            </p>
            <Button asChild className="mt-5">
              <Link to="/courses">
                Browse courses <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
            <div className="space-y-3">
              {items.map((it: any) => (
                <div key={it.id} className="rounded-xl border bg-card p-3 flex gap-3 shadow-card">
                  <div className="w-24 sm:w-32 aspect-video bg-muted rounded-lg overflow-hidden shrink-0">
                    {it.courses?.cover_url && (
                      <img
                        src={it.courses.cover_url}
                        alt={it.courses.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to="/courses/$slug"
                      params={{ slug: it.courses?.slug }}
                      className="font-medium hover:text-primary line-clamp-2"
                    >
                      {it.courses?.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Badge variant="outline" className="text-[10px]">
                        {it.courses?.level}
                      </Badge>
                      <span>· {it.courses?.instructor}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {inr(Number(it.courses?.price_inr ?? 0))}
                      </span>
                      <Button size="icon" variant="ghost" onClick={() => remove(it.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border bg-card p-5 shadow-card h-fit sticky top-4 space-y-4">
              <h3 className="font-display font-semibold">Order summary</h3>

              {/* Coupon */}
              <div className="space-y-2">
                <label className="text-xs font-medium flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-primary" /> Coupon / offer
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-700">{appliedCoupon}</span>
                      <span className="text-xs text-emerald-600">
                        · {COUPONS[appliedCoupon]?.label}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponInput("");
                      }}
                      className="text-emerald-700 hover:text-emerald-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Try WELCOME10, LEARN20…"
                      className="h-9 text-sm uppercase"
                      onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    />
                    <Button size="sm" variant="outline" onClick={applyCoupon}>
                      Apply
                    </Button>
                  </div>
                )}
                <div className="flex flex-wrap gap-1">
                  {Object.entries(COUPONS)
                    .slice(0, 3)
                    .map(([code, c]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setCouponInput(code);
                          setAppliedCoupon(code);
                          toast.success(`Coupon applied: ${c.label}`);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-dashed border-primary/40 text-primary hover:bg-primary/5"
                      >
                        {code} · {c.label}
                      </button>
                    ))}
                </div>
              </div>

              {/* Payment method */}
              <div className="space-y-2">
                <label className="text-xs font-medium">Payment method</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {methods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`rounded-lg border p-2 text-[10px] flex flex-col items-center gap-1 transition ${method === m.id ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent"}`}
                    >
                      <m.icon className="h-4 w-4" />
                      <span className="font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
                {method !== "wallet" && (
                  <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
                    {method === "bank"
                      ? "Bank transfer via Razorpay."
                      : `${method.toUpperCase()} live checkout via Razorpay.`}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="border-t pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({items.length})</span>
                  <span>{inr(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>−{inr(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-display text-lg font-semibold pt-1">
                  <span>Total</span>
                  <span>{inr(total)}</span>
                </div>
              </div>

              <div className="border-t pt-3 text-xs text-muted-foreground">
                Wallet balance:{" "}
                <span
                  className={`font-semibold ${(balQ.data ?? 0) < total ? "text-destructive" : "text-foreground"}`}
                >
                  {inr(balQ.data ?? 0)}
                </span>
              </div>
              {(balQ.data ?? 0) < total && method === "wallet" && (
                <Link to="/wallet" className="text-xs text-primary block">
                  Top up wallet →
                </Link>
              )}
              <Button className="w-full" onClick={pay} disabled={paying || items.length === 0}>
                {paying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )}{" "}
                Pay {inr(total)}
              </Button>
              <p className="text-[11px] text-muted-foreground">
                Free courses enroll instantly. Coupon savings applied at checkout.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
