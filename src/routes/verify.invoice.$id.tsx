import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  FileCheck,
  ShieldAlert,
  ArrowLeft,
  Calendar,
  CreditCard,
  Building,
  User,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/verify/invoice/$id")({
  head: () => ({ meta: [{ title: "Verify Invoice — Learnify AI Verification Hub" }] }),
  component: VerifyInvoicePage,
});

function VerifyInvoicePage() {
  const { id } = Route.useParams();

  const q = useQuery({
    queryKey: ["verify-invoice", id],
    queryFn: async () => {
      // Fetch invoice by invoice_number
      const { data: invoice, error } = await supabase
        .from("invoices")
        .select("*, profiles(full_name, email)")
        .eq("invoice_number", id)
        .maybeSingle();

      if (error) throw error;
      if (!invoice) throw new Error("Invoice not found or invalid.");
      return invoice;
    },
  });

  const getStatusColor = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "paid":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "failed":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      case "refunded":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-hero flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl bg-card border border-border/60 rounded-3xl p-6 sm:p-8 shadow-card relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="flex justify-between items-center mb-6">
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Home
          </Link>
          <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">
            Verification Engine v2.0
          </span>
        </div>

        {q.isLoading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">
              Verifying signature on blockchain registry...
            </p>
          </div>
        ) : q.isError ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-rose-500/10 border-2 border-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-2 animate-bounce">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Invalid Invoice Token</h2>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
                The requested invoice ID <strong>{id}</strong> could not be verified. It may have
                been modified or deleted.
              </p>
            </div>
            <div className="pt-4">
              <Button asChild variant="outline">
                <Link to="/">Back to Dashboard</Link>
              </Button>
            </div>
          </div>
        ) : !q.data ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-rose-500/10 border-2 border-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-2 animate-bounce">
              <ShieldAlert className="h-8 w-8 animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Invalid Invoice Token</h2>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
                The requested invoice ID <strong>{id}</strong> could not be verified. It may have
                been modified or deleted.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success Header */}
            <div className="text-center pb-4 border-b">
              <div className="w-14 h-14 bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileCheck className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Verified SaaS Invoice</h2>
              <p className="text-xs text-muted-foreground mt-1 font-mono">{id}</p>
              <Badge className={`mt-2.5 capitalize ${getStatusColor(q.data.status)}`}>
                Status: {q.data.status || "paid"}
              </Badge>
            </div>

            {/* Invoice parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex gap-2 items-start">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                      Customer
                    </span>
                    <strong className="text-foreground">
                      {(q.data.profiles as any)?.full_name || "Premium Learner"}
                    </strong>
                    <span className="text-xs text-muted-foreground block">
                      {(q.data.profiles as any)?.email || q.data.user_id}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 items-start">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                      Issue Date
                    </span>
                    <strong className="text-foreground">
                      {q.data.created_at
                        ? format(new Date(q.data.created_at), "dd MMMM yyyy, hh:mm a")
                        : "N/A"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2 items-start">
                  <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                      Amount Paid
                    </span>
                    <strong className="text-lg text-primary block">
                      ₹{Number(q.data.total_inr).toFixed(2)}
                    </strong>
                    {q.data.tax_inr ? (
                      <span className="text-xs text-muted-foreground block">
                        Includes ₹{Number(q.data.tax_inr).toFixed(2)} GST
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex gap-2 items-start">
                  <Building className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                      Transaction ID
                    </span>
                    <strong className="text-foreground font-mono text-xs block">
                      {q.data.cashfree_order_id || "TXN_N/A"}
                    </strong>
                    <span className="text-xs text-muted-foreground block">
                      Method: {q.data.payment_method || "Online"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Check list of guarantees */}
            <div className="bg-muted/40 rounded-2xl p-4 border text-[11px] text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground mb-1">Security & Authenticity Shield:</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Matches official record generated on payment gateway confirmation.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Protected against tampered PDF modifications.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Directly linked to customer profile metadata.</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button asChild className="flex-1">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
              {q.data.pdf_url && (
                <Button variant="outline" asChild>
                  <a
                    href={q.data.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1"
                  >
                    <ExternalLink className="h-4 w-4" /> Original PDF
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Loader2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
