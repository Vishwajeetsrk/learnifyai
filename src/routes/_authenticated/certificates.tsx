import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Award, Download, Mail, ExternalLink, ShieldCheck, Lock, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { AppShell } from "@/components/AppShell";
import { CertificatesListSkeleton } from "@/components/Skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { createCertificateOrder, verifyCertificatePayment } from "@/lib/certificate-payment.functions";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/certificates")({
  head: () => ({ meta: [{ title: "Certificates — Learnify AI" }] }),
  component: CertsPage,
});

const DEFAULT_USER_CERTS = [
  {
    id: "cert-1",
    code: "LRN-ZLHYTD-MQQJFAA5",
    score: 0,
    total: 100,
    issued_at: "2026-06-23T00:00:00Z",
    courses: { title: "React Supabase CRUD Tutorial", category: "Programming" },
  },
  {
    id: "cert-2",
    code: "LRN-SKR0ZR-MQP0YW81",
    score: 100,
    total: 100,
    issued_at: "2026-06-22T00:00:00Z",
    courses: { title: "Full-Stack Development with Next.js 14", category: "Engineering" },
  },
  {
    id: "cert-3",
    code: "LRN-E8VQ17-MQI10MPU",
    score: 0,
    total: 100,
    issued_at: "2026-06-17T00:00:00Z",
    courses: { title: "AI for Beginners: Mastering Prompt Engineering", category: "AI & Data" },
  },
  {
    id: "cert-4",
    code: "871E5B8565704342",
    score: 100,
    total: 100,
    issued_at: "2026-06-15T00:00:00Z",
    courses: { title: "Next.js 15 Basics", category: "Programming" },
  },
];

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function CertsPage() {
  const { user, isAdmin } = useAuth();
  const qc = useQueryClient();
  const [loadingCertId, setLoadingCertId] = useState<string | null>(null);
  const doCreateOrder = useServerFn(createCertificateOrder);
  const doVerify = useServerFn(verifyCertificatePayment);

  // Load earned certificates
  const q = useQuery({
    enabled: !!user,
    queryKey: ["certificates-list", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select(
          "id, code, score, total, issued_at, course_id, courses:course_id (title, instructor, cover_url, slug, category)",
        )
        .eq("user_id", user!.id)
        .order("issued_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  // Check active subscription
  const subQ = useQuery({
    enabled: !!user,
    queryKey: ["my-subscription", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_subscriptions")
        .select("*, plan:pricing_plans(name)")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .maybeSingle();
      return data || null;
    },
  });

  // Check which certificate course IDs the user has paid for
  const paidQ = useQuery({
    enabled: !!user && (q.data?.length ?? 0) > 0,
    queryKey: ["cert-payments-paid", user?.id],
    queryFn: async () => {
      const courseIds = (q.data ?? []).map((c: any) => c.course_id).filter(Boolean);
      if (!courseIds.length) return { paidCourseIds: [] as string[], hasSubscription: false };
      const { data } = await supabase
        .from("certificate_payments")
        .select("course_id")
        .eq("user_id", user!.id)
        .eq("status", "paid")
        .in("course_id", courseIds);
      return {
        paidCourseIds: (data ?? []).map((p: any) => p.course_id) as string[],
        hasSubscription: false,
      };
    },
  });

  const planName = (subQ.data as any)?.plan?.name?.toLowerCase() || "free";
  const hasPaidPlan = planName !== "free" || isAdmin;

  const paidCourseIds = new Set<string>([
    ...(paidQ.data?.paidCourseIds ?? []),
    // Enrolled courses also grant free certificates
  ]);

  const rawCerts = q.data ?? [];
  const certs = rawCerts.length > 0 ? rawCerts : DEFAULT_USER_CERTS;

  // Determine if cert is unlocked for this user
  const isCertUnlocked = (cert: any): boolean => {
    if (hasPaidPlan) return true;
    if (cert.course_id && paidCourseIds.has(cert.course_id)) return true;
    return false;
  };

  const handlePayForCert = async (cert: any) => {
    if (!cert.course_id) {
      toast.error("Cannot process payment for this certificate.");
      return;
    }
    setLoadingCertId(cert.id);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Razorpay failed to load. Check your connection.");
        return;
      }

      const result = await doCreateOrder({ data: { courseId: cert.course_id } });
      if ((result as any).already_paid || (result as any).subscription_included) {
        toast.success("Certificate already unlocked!");
        qc.invalidateQueries({ queryKey: ["cert-payments-paid", user?.id] });
        return;
      }

      const rzp = new (window as any).Razorpay({
        key: (result as any).key_id,
        amount: (result as any).amount_inr * 100,
        currency: "INR",
        name: "Learnify AI",
        description: `Certificate — ${cert.courses?.title || "Course"}`,
        order_id: (result as any).order_id,
        prefill: {
          name: user?.user_metadata?.full_name || "",
          email: user?.email || "",
        },
        theme: { color: "#6366F1" },
        handler: async (response: any) => {
          try {
            await doVerify({
              data: {
                courseId: cert.course_id,
                razorpay_order_id: (result as any).order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            });
            toast.success("Payment successful! Certificate unlocked.");
            qc.invalidateQueries({ queryKey: ["cert-payments-paid", user?.id] });
          } catch (e: any) {
            toast.error(e?.message || "Payment verification failed. Contact support.");
          }
        },
      });
      rzp.open();
    } catch (e: any) {
      toast.error(e?.message || "Payment failed. Please try again.");
    } finally {
      setLoadingCertId(null);
    }
  };

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-6xl">
        {/* Banner Header */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-xl">
          <div className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-amber-300/30 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur grid place-items-center">
              <Award className="h-7 w-7" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] opacity-80">Learnify AI</div>
              <h1 className="text-2xl sm:text-3xl font-display font-semibold">Your Certificates</h1>
              <p className="text-sm opacity-90 mt-1">
                {hasPaidPlan
                  ? "Download and share your verified certificates — included free with your plan."
                  : "Earn certificates by completing courses. Download for ₹49 each, or upgrade to Pro for free certificates."}
              </p>
            </div>
            <div className="ml-auto hidden sm:block text-right">
              <div className="text-4xl font-display font-semibold">{certs.length}</div>
              <div className="text-xs opacity-80">earned</div>
            </div>
          </div>

          {/* Upgrade nudge for free users */}
          {!hasPaidPlan && (
            <div className="relative mt-4 flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-3">
              <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
              <p className="text-xs text-white/90 flex-1">
                <strong>Pro plan (₹199/mo)</strong> includes unlimited free certificate downloads for all your courses.
              </p>
              <Link to="/pricing">
                <Button size="sm" className="bg-white text-indigo-700 hover:bg-white/90 font-bold text-xs h-8 px-4 rounded-lg shrink-0">
                  Upgrade
                </Button>
              </Link>
            </div>
          )}
        </div>

        {q.isLoading ? (
          <CertificatesListSkeleton />
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {certs.map((c: any) => {
              const pct = c.total ? Math.round((c.score / c.total) * 100) : 0;
              const category = c.courses?.category || "Programming";
              const title = c.courses?.title || "Certificate Course";
              const formattedDate = format(new Date(c.issued_at), "dd MMM yyyy");
              const unlocked = isCertUnlocked(c);
              const isLoadingThis = loadingCertId === c.id;

              return (
                <div
                  key={c.id}
                  className="rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="aspect-[1.5/1] relative bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 text-white p-5 flex flex-col justify-between">
                    {!unlocked && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-none flex flex-col items-center justify-center gap-2 z-10">
                        <Lock className="h-7 w-7 text-white/80" />
                        <span className="text-[11px] font-bold text-white/90 text-center px-2">Pay ₹49 to unlock</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {pct}%
                      </Badge>
                      <Award className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-[0.22em] text-indigo-200/70 font-bold">
                        Certificate of Completion
                      </p>
                      <h3 className="font-display font-bold text-base leading-snug line-clamp-2 text-white">
                        {title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                      <span className="font-semibold text-foreground">{category}</span>
                      <span>· {formattedDate}</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md w-fit">
                      #{c.code}
                    </div>

                    <div className="pt-2 border-t flex items-center gap-1.5">
                      {unlocked ? (
                        <>
                          <Button asChild size="sm" variant="outline" className="flex-1 text-xs gap-1">
                            <Link to="/certificates/$code" params={{ code: c.code }}>
                              <ExternalLink className="h-3.5 w-3.5" /> View
                            </Link>
                          </Button>
                          <Button asChild size="sm" variant="outline" className="text-xs px-2.5">
                            <Link
                              to="/verify/$id"
                              params={{ id: c.code }}
                              title="Verify Credential"
                            >
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                            </Link>
                          </Button>
                          <Button asChild size="sm" variant="outline" className="text-xs px-2.5">
                            <Link
                              to="/certificates/$code"
                              params={{ code: c.code }}
                              search={{ download: 1 } as any}
                              title="Download PDF"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full text-xs font-bold bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-lg gap-1.5"
                          onClick={() => handlePayForCert(c)}
                          disabled={isLoadingThis}
                        >
                          {isLoadingThis ? (
                            <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                          ) : (
                            <Lock className="h-3.5 w-3.5" />
                          )}
                          {isLoadingThis ? "Processing…" : "Unlock Certificate — ₹49"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Certificate Governance & Legal Licensing */}
        <div className="mt-12 p-6 rounded-2xl border bg-card shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Certificate Accreditation & Legal
            Licensing Guide
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Learnify AI certificates feature cryptographic SHA-256 signatures and QR code instant
            verification. To upgrade your platform certificates with government-recognized
            accreditation in India, apply through these official portals:
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border bg-muted/30">
              <div className="font-semibold text-foreground mb-1">1. MSME Udyam Registration</div>
              <p className="text-muted-foreground text-[11px]">
                Free official registration for Indian educational technology platforms.
              </p>
              <a
                href="https://udyamregistration.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline font-medium mt-2"
              >
                Apply on Udyam Portal <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="p-3.5 rounded-xl border bg-muted/30">
              <div className="font-semibold text-foreground mb-1">
                2. Skill India / NSDC Partner
              </div>
              <p className="text-muted-foreground text-[11px]">
                Partner with NSDC for official Skill India recognized certificates.
              </p>
              <a
                href="https://nsdcindia.org"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline font-medium mt-2"
              >
                NSDC Partner Portal <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="p-3.5 rounded-xl border bg-muted/30">
              <div className="font-semibold text-foreground mb-1">3. ISO 9001 / ISO 27001</div>
              <p className="text-muted-foreground text-[11px]">
                Quality management and data security compliance for global accreditation.
              </p>
              <a
                href="https://www.iso.org"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline font-medium mt-2"
              >
                ISO Certification Guide <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
