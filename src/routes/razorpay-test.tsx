import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  IndianRupee,
  Loader2,
  FileText,
  AlertTriangle,
  ArrowLeft,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/razorpay-test")({
  head: () => ({ meta: [{ title: "Razorpay Sandbox — Learnify AI" }] }),
  component: RazorpayTestPage,
});

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function RazorpayTestPage() {
  const { user, isAuthenticated } = useAuth();
  const [amount, setAmount] = useState<string>("500");
  const [submitting, setSubmitting] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    paymentId: string;
    orderId: string;
    amount: number;
    date: string;
    userCredited: boolean;
  } | null>(null);

  const parsedAmount = Number(amount) || 0;
  const gstRate = 0.18;
  const baseAmount = parsedAmount / (1 + gstRate);
  const cgst = baseAmount * 0.09;
  const sgst = baseAmount * 0.09;

  async function handleCheckout() {
    if (isNaN(parsedAmount) || parsedAmount < 1) {
      toast.error("Please enter a valid amount (minimum ₹1)");
      return;
    }

    setSubmitting(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay Checkout SDK failed to load. Please check your internet connection.");
      }

      // Convert INR to Paise (Razorpay expects smallest currency unit)
      const paiseAmount = Math.round(parsedAmount * 100);

      // Extract Supabase session cookie token if logged in
      const sessionToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("sb-access-token="))
        ?.split("=")[1];

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionToken) {
        headers["Authorization"] = `Bearer ${sessionToken}`;
      }

      // 1. Call backend API to create an order
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers,
        body: JSON.stringify({
          amount: paiseAmount,
          currency: "INR",
        }),
      });

      if (orderRes.status === 401) {
        throw new Error("Authentication Required: Please log in to complete the transaction.");
      }

      if (!orderRes.ok) {
        const errText = await orderRes.text();
        let errMsg = "Failed to initiate payment";
        try {
          errMsg = JSON.parse(errText).error || errMsg;
        } catch {
          // not json
        }
        throw new Error(errMsg);
      }

      const orderData = await orderRes.json();

      // 2. Configure Razorpay Standard Checkout options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TPC7AGGMfWNxlz",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Learnify AI Sandbox",
        description: "Add funds to wallet via Razorpay Standard Checkout",
        order_id: orderData.order_id,
        prefill: {
          name: user?.user_metadata?.full_name || "Guest Learner",
          email: user?.email || "student@learnifyai.in",
          contact: user?.phone || "9999999999",
        },
        theme: {
          color: "#4f46e5", // Sleek indigo matching theme
        },
        handler: async function (response: any) {
          setSubmitting(true);
          try {
            // 3. Send payment details to verification endpoint
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers,
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount_inr: parsedAmount, // needed to credit wallet
              }),
            });

            if (!verifyRes.ok) {
              const errText = await verifyRes.text();
              let errMsg = "Verification failed";
              try {
                errMsg = JSON.parse(errText).error || errMsg;
              } catch {
                // not json
              }
              throw new Error(errMsg);
            }

            toast.success("Payment completed and verified!");
            setPaymentResult({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: parsedAmount,
              date: new Date().toLocaleString("en-IN"),
              userCredited: !!user,
            });
          } catch (err: any) {
            toast.error(err.message || "Failed to verify payment signature");
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled.");
            setSubmitting(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on("payment.failed", function (resp: any) {
        toast.error(`Payment failed: ${resp.error.description || "An error occurred."}`);
        setSubmitting(false);
      });

      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout");
      setSubmitting(false);
    }
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12 max-w-4xl mx-auto min-h-[90dvh] flex flex-col justify-start">
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/wallet"
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to Wallet
          </Link>
          <div className="text-xs text-muted-foreground">
            Environment: <span className="text-amber-500 font-semibold uppercase">Sandbox (Test)</span>
          </div>
        </div>

        {!paymentResult ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
            {/* Input Checkout Form */}
            <div className="md:col-span-3 space-y-6">
              <div className="space-y-2">
                <h1 className="font-display text-3xl font-semibold tracking-tight">
                  Razorpay Checkout
                </h1>
                <p className="text-muted-foreground text-sm">
                  Test the integration using Razorpay's Standard Web Checkout modal.
                </p>
              </div>

              {!isAuthenticated && (
                <div className="rounded-xl border border-amber-200/50 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Guest Test Mode</span>
                    You are not logged in. You can complete the checkout and signature verification, but the funds will not be credited to any wallet.{" "}
                    <Link to="/login" className="underline hover:text-foreground font-medium transition-colors">
                      Log In
                    </Link>{" "}
                    first to credit your wallet balance.
                  </div>
                </div>
              )}

              {isAuthenticated && (
                <div className="rounded-xl border border-indigo-200/50 bg-indigo-50/50 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/20 text-xs text-indigo-800 dark:text-indigo-300 flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Live Wallet Account</span>
                    Logged in as <strong className="font-medium">{user?.email}</strong>. A successful checkout will verify the payment and credit your available wallet balance.
                  </div>
                </div>
              )}

              <Card className="shadow-card border bg-card">
                <CardHeader>
                  <CardTitle className="text-base font-display">Configure Top-up Amount</CardTitle>
                  <CardDescription>Select or enter an amount in Indian Rupees (INR)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topup-amount" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Amount (INR)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center">
                        <IndianRupee className="h-4 w-4" />
                      </span>
                      <Input
                        id="topup-amount"
                        type="number"
                        min="1"
                        max="100000"
                        className="pl-9 h-12 text-lg font-semibold tracking-tight transition-all focus-visible:ring-indigo-500"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="500"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[10, 100, 500, 1000, 2500, 5000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(String(val))}
                        disabled={submitting}
                        className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                          parsedAmount === val
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-background hover:bg-accent border-input"
                        }`}
                      >
                        ₹{val.toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button
                    onClick={handleCheckout}
                    disabled={submitting || parsedAmount <= 0}
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg hover:shadow-indigo-600/10 transition-all hover:scale-[1.01] active:scale-[0.99] focus-visible:ring-indigo-500 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Pay with Razorpay
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Price Calculations */}
            <div className="md:col-span-2 space-y-6">
              <Card className="border bg-card shadow-card">
                <CardHeader>
                  <CardTitle className="text-base font-display">Invoice Summary</CardTitle>
                  <CardDescription>Estimated GST & SAC details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Base Tuition Fee</span>
                      <span>₹{baseAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>CGST (9%)</span>
                      <span>₹{cgst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>SGST (9%)</span>
                      <span>₹{sgst.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-semibold text-foreground text-base">
                      <span>Total Amount</span>
                      <span className="text-indigo-600 dark:text-indigo-400">
                        ₹{parsedAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2.5 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>SAC Code</span>
                      <span className="font-mono text-foreground font-medium">998431</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service</span>
                      <span className="text-foreground font-medium">Online Education Services</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Place of Supply</span>
                      <span className="text-foreground font-medium">State Code (POS)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Instructions / Credentials */}
              <div className="p-4 rounded-2xl border bg-muted/40 text-[11px] leading-relaxed space-y-3">
                <h4 className="font-semibold uppercase tracking-wider text-muted-foreground">
                  Sandbox Test Guidelines
                </h4>
                <div className="space-y-2">
                  <p>
                    Use the following test credentials to verify the checkout without spending real money:
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between border-b border-muted py-1">
                      <span className="text-muted-foreground">Test Card</span>
                      <span className="font-mono text-foreground font-medium">4111 1111 1111 1111</span>
                    </div>
                    <div className="flex justify-between border-b border-muted py-1">
                      <span className="text-muted-foreground">Expiry / CVV</span>
                      <span className="font-mono text-foreground font-medium">Any future date / 123</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Test UPI ID</span>
                      <span className="font-mono text-foreground font-medium">test@razorpay</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">
                    When the Razorpay modal loads, select Netbanking, Card, or UPI and follow the checkout steps to complete verification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Checkout Success Invoice */
          <div className="max-w-2xl mx-auto w-full space-y-8 animate-fade-in print:bg-white print:text-black print:p-0">
            {/* Header Success Animation */}
            <div className="text-center space-y-3 print:hidden">
              <div className="inline-flex h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 items-center justify-center">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-display font-semibold tracking-tight">Payment Verified!</h2>
              <p className="text-sm text-muted-foreground">
                Your transaction has been processed and verified successfully.
              </p>
            </div>

            {/* Print Invoice Frame */}
            <div className="bg-card border rounded-3xl p-6 sm:p-8 shadow-card space-y-6 print:border-none print:shadow-none print:rounded-none">
              {/* Invoice Title Bar */}
              <div className="flex justify-between items-start border-b pb-6 flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-display font-semibold tracking-tight">LEARNIFY AI</h3>
                  <p className="text-xs text-muted-foreground mt-1">GSTIN: 27AAAAA1111A1Z1</p>
                  <p className="text-xs text-muted-foreground">support.learnifyai@gmail.com</p>
                </div>
                <div className="text-right">
                  <h4 className="text-base font-semibold text-foreground uppercase tracking-wider">
                    TAX INVOICE
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">Receipt: {paymentResult.orderId.replace("order_", "INV-")}</p>
                  <p className="text-xs text-muted-foreground">Date: {paymentResult.date}</p>
                </div>
              </div>

              {/* Bill Details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <h5 className="font-semibold text-muted-foreground uppercase tracking-wider">
                    Billed To
                  </h5>
                  <p className="text-foreground font-medium mt-1">
                    {user?.user_metadata?.full_name || "Guest Student"}
                  </p>
                  <p className="text-muted-foreground">{user?.email || "student@learnifyai.in"}</p>
                </div>
                <div className="text-right">
                  <h5 className="font-semibold text-muted-foreground uppercase tracking-wider">
                    Transaction Details
                  </h5>
                  <p className="text-foreground font-medium mt-1">
                    Razorpay Payment ID
                  </p>
                  <p className="font-mono text-muted-foreground text-[10px]">
                    {paymentResult.paymentId}
                  </p>
                </div>
              </div>

              {/* Item Table */}
              <div className="border rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/40 font-semibold border-b">
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">SAC Code</th>
                      <th className="p-3 text-right">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3">
                        <span className="font-medium text-foreground">Learnify Wallet Top-up</span>
                        <p className="text-muted-foreground text-[10px] mt-0.5">
                          Standard checkout credits added to available learning balance
                        </p>
                      </td>
                      <td className="p-3 text-right font-mono">998431</td>
                      <td className="p-3 text-right font-medium">
                        ₹{(paymentResult.amount / 1.18).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 text-muted-foreground">Central GST (CGST @ 9%)</td>
                      <td className="p-3 text-right font-mono">-</td>
                      <td className="p-3 text-right text-muted-foreground">
                        ₹{((paymentResult.amount / 1.18) * 0.09).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 text-muted-foreground">State GST (SGST @ 9%)</td>
                      <td className="p-3 text-right font-mono">-</td>
                      <td className="p-3 text-right text-muted-foreground">
                        ₹{((paymentResult.amount / 1.18) * 0.09).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/15 font-semibold text-sm">
                      <td colSpan={2} className="p-3 text-right">
                        Total Paid
                      </td>
                      <td className="p-3 text-right text-indigo-600 dark:text-indigo-400">
                        ₹{paymentResult.amount.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Status Note */}
              <div className="flex justify-between items-center text-xs flex-wrap gap-2 pt-2 border-t">
                <span className="text-muted-foreground italic">
                  * This is an automated tax invoice generated for sandbox testing.
                </span>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/20 dark:text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full">
                  Status: {paymentResult.userCredited ? "CREDITED" : "PAID"}
                </Badge>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex justify-between items-center print:hidden flex-wrap gap-4">
              <Button
                variant="outline"
                onClick={() => setPaymentResult(null)}
                className="h-10 text-xs font-semibold px-4 flex items-center gap-2 border hover:bg-accent"
              >
                <ArrowLeft className="h-4 w-4" /> Start New Test
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  className="h-10 text-xs font-semibold px-4 flex items-center gap-2 border hover:bg-accent"
                >
                  <Download className="h-4 w-4" /> Print Invoice
                </Button>
                <Link to="/wallet">
                  <Button className="h-10 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-5 shadow-lg flex items-center gap-2">
                    Go to Wallet <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
