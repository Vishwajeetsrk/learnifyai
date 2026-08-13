/**
 * SubscriptionPaymentAlert
 *
 * Shows a banner + "Update Payment Method" button when a user's subscription
 * is in `past_due` status (Razorpay pending or halted states).
 *
 * Uses Razorpay checkout with `subscription_card_change: true` per Razorpay docs:
 * https://razorpay.com/docs/payments/subscriptions/payment-retries/
 */
import { useState } from "react";
import { AlertTriangle, CreditCard, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SubscriptionPaymentAlertProps {
  razorpaySubscriptionId: string;
  planName: string;
  userEmail?: string;
  userName?: string;
  onSuccess?: () => void;
}

const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

export function SubscriptionPaymentAlert({
  razorpaySubscriptionId,
  planName,
  userEmail = "",
  userName = "",
  onSuccess,
}: SubscriptionPaymentAlertProps) {
  const [loading, setLoading] = useState(false);

  async function handleUpdatePayment() {
    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Razorpay failed to load. Please check your internet connection.");
        return;
      }

      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!keyId) {
        toast.error("Payment configuration error. Please contact support.");
        return;
      }

      const options = {
        key: keyId,
        subscription_id: razorpaySubscriptionId,
        name: "Learnify AI",
        description: `Update payment method for ${planName}`,
        image: "/logo.png",
        // This is the magic flag — allows customer to change card/UPI/emandate
        subscription_card_change: true,
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#6366F1",
        },
        handler: async function (response: any) {
          // Payment method updated successfully
          // Razorpay will re-attempt charge automatically
          toast.success(
            "Payment method updated! Razorpay will retry the charge automatically.",
          );
          onSuccess?.();
        },
        modal: {
          ondismiss: () => {
            toast.info("Update cancelled.");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err?.message || "Failed to open payment update. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Alert
      className="border-amber-500/40 bg-amber-500/10 dark:bg-amber-950/20"
      role="alert"
      aria-label="Payment failed alert"
    >
      <AlertTriangle className="h-5 w-5 text-amber-500" />
      <AlertTitle className="text-amber-700 dark:text-amber-400 font-semibold">
        Payment Failed — Action Required
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="text-sm text-muted-foreground">
          We couldn't charge your payment method for your{" "}
          <strong>{planName}</strong> subscription. Razorpay will automatically
          retry for up to 3 days. You can also update your payment method now to
          avoid service interruption.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Button
            size="sm"
            onClick={handleUpdatePayment}
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
            id="update-payment-method-btn"
            aria-label="Update payment method"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            Update Payment Method
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              toast.info(
                "Razorpay will auto-retry your payment for 3 days. Check your email for updates.",
              )
            }
            className="gap-2"
            id="retry-info-btn"
          >
            <RefreshCw className="h-4 w-4" />
            Auto-Retry Active
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          You can also change to UPI or bank account (eMandate) on the payment screen.
        </p>
      </AlertDescription>
    </Alert>
  );
}
