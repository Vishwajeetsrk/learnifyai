import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Check, Sparkles } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { initiateCheckout, verifyClientPayment } from "@/lib/payments/payment.functions";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export function PricingPlanUpgrade({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const doInitiateCheckout = useServerFn(initiateCheckout);
  const doVerifyPayment = useServerFn(verifyClientPayment);

  const { data: plans, isLoading } = useQuery({
    queryKey: ["pricing-plans-upgrade"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("*")
        .eq("active", true)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return (data || []).filter((p) => p.price_inr && p.price_inr > 0);
    },
    enabled: open,
  });

  const handleSubscribe = async (planId: string) => {
    if (!user) return;
    setLoadingPlan(planId);
    try {
      const checkout = await doInitiateCheckout({
        data: {
          planId,
          provider: "razorpay",
          billingCycle,
        },
      });

      if (checkout.provider === "razorpay" && checkout.keyId && (checkout.orderId || checkout.subscriptionId)) {
        const scriptLoaded = await loadRazorpay();
        if (!scriptLoaded) {
          toast.error("Unable to load Razorpay payment SDK.");
          return;
        }

        const options: any = {
          key: checkout.keyId,
          amount: Math.round(checkout.amount * 100),
          currency: "INR",
          name: "Learnify AI",
          description: `${checkout.notes?.planName || "Plan"} Subscription`,
          prefill: checkout.prefill,
          notes: checkout.notes,
          theme: { color: "#6366f1" },
        };
        
        if (checkout.subscriptionId) {
          options.subscription_id = checkout.subscriptionId;
        } else {
          options.order_id = checkout.orderId;
        }

        options.handler = async function (response: any) {
            try {
              setLoadingPlan(planId);
              const verified = await doVerifyPayment({
                data: {
                  provider: "razorpay",
                  orderId: checkout.subscriptionId || checkout.orderId!,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  planId,
                  billingCycle,
                  amountInr: checkout.amount,
                },
              });
              if (verified.success) {
                toast.success("Payment verified! Subscription active.");
                qc.invalidateQueries({ queryKey: ["my-subscription"] });
                setOpen(false);
              } else {
                toast.error(verified.message || "Payment verification incomplete.");
              }
            } catch (err: any) {
              toast.error(err?.message || "Failed to verify payment with server.");
            } finally {
              setLoadingPlan(null);
            }
        };

        options.modal = {
          ondismiss: function () {
            setLoadingPlan(null);
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else if (checkout.checkoutUrl) {
        window.location.href = checkout.checkoutUrl;
      } else {
        toast.success("Subscription requested.");
        qc.invalidateQueries({ queryKey: ["my-subscription"] });
        setOpen(false);
      }
    } catch (e: any) {
      toast.error(e?.message || "Checkout failed");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upgrade your plan</DialogTitle>
          <DialogDescription>
            Choose a plan that fits your career goals.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center my-4">
          <div className="bg-muted p-1 rounded-full flex gap-1 items-center border">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                billingCycle === "monthly" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Save 17%</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(plans || []).map((p) => {
              const plan = p as any;
              const priceInr = plan.price_inr || 0;
              const price = billingCycle === "monthly" ? priceInr : plan.yearly_price ?? priceInr * 10;
              const perMonth = billingCycle === "monthly" ? price : Math.round(price / 12);
              
              return (
                <div key={plan.id} className="border rounded-2xl p-5 flex flex-col relative overflow-hidden bg-card transition-all hover:border-primary/50">
                  <div className="font-semibold text-lg">{plan.name}</div>
                  <div className="text-3xl font-bold mt-2">
                    ₹{perMonth} <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {billingCycle === "yearly" ? `Billed ₹${price} yearly` : `Billed monthly`}
                  </div>
                  
                  <div className="mt-6 flex-1 space-y-2">
                    {Array.isArray(plan.features) && plan.features.slice(0, 4).map((f: any, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="mt-6 w-full" 
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loadingPlan === plan.id}
                  >
                    {loadingPlan === plan.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    Upgrade to {plan.name}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
