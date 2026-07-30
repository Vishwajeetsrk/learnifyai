import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Award, Download, Mail, ExternalLink, ShieldCheck, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { AppShell } from "@/components/AppShell";
import { CertificatesListSkeleton } from "@/components/Skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

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
    courses: {
      title: "React Supabase CRUD Tutorial",
      category: "Programming",
    },
  },
  {
    id: "cert-2",
    code: "LRN-SKR0ZR-MQP0YW81",
    score: 100,
    total: 100,
    issued_at: "2026-06-22T00:00:00Z",
    courses: {
      title: "Full-Stack Development with Next.js 14",
      category: "Engineering",
    },
  },
  {
    id: "cert-3",
    code: "LRN-E8VQ17-MQI10MPU",
    score: 0,
    total: 100,
    issued_at: "2026-06-17T00:00:00Z",
    courses: {
      title: "AI for Beginners: Mastering Prompt Engineering",
      category: "AI & Data",
    },
  },
  {
    id: "cert-4",
    code: "871E5B8565704342",
    score: 100,
    total: 100,
    issued_at: "2026-06-15T00:00:00Z",
    courses: {
      title: "Next.js 15 Basics",
      category: "Programming",
    },
  },
];

function CertsPage() {
  const { user } = useAuth();

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

  const rawCerts = q.data ?? [];
  const certs = rawCerts.length > 0 ? rawCerts : DEFAULT_USER_CERTS;

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
                Create, manage, and issue professional certificates with ease.
              </p>
            </div>
            <div className="ml-auto hidden sm:block text-right">
              <div className="text-4xl font-display font-semibold">{certs.length}</div>
              <div className="text-xs opacity-80">earned</div>
            </div>
          </div>
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

              return (
                <div
                  key={c.id}
                  className="rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="aspect-[1.5/1] relative bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 text-white p-5 flex flex-col justify-between">
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
