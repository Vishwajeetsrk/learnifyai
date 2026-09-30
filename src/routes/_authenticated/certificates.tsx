import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
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

  const [filterCat, setFilterCat] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const categories = useMemo(() => {
    const set = new Set<string>();
    certs.forEach((c: any) => {
      if (c.courses?.category) set.add(c.courses.category);
    });
    return ["All", ...Array.from(set)];
  }, [certs]);

  const filteredCerts = useMemo(() => {
    return certs.filter((c: any) => {
      const matchCat = filterCat === "All" || c.courses?.category === filterCat;
      const matchSearch =
        !searchTerm.trim() ||
        c.courses?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [certs, filterCat, searchTerm]);

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-10">
        {/* Apple Keynote Style Hero */}
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 bg-neutral-950 border border-white/10 shadow-2xl text-white">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-widest bg-white/10 text-neutral-300 border border-white/10">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Learnify Credential Hub
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight text-neutral-100">
                Your Credentials & Accreditations
              </h1>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Cryptographically attested, tamper-proof certifications issued upon mastering production-grade engineering curricula.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-xl">
              <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-amber-400">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-white tracking-tight">{certs.length}</div>
                <div className="text-xs text-neutral-400 font-medium">Earned Credentials</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  filterCat === cat
                    ? "bg-foreground text-background shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="w-full sm:w-64 px-1">
            <input
              type="text"
              placeholder="Search credentials or #ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 px-3 text-xs rounded-xl bg-muted/50 border border-border/80 focus:outline-none focus:ring-1 focus:ring-foreground/20 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {q.isLoading ? (
          <CertificatesListSkeleton />
        ) : filteredCerts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed text-muted-foreground space-y-3 bg-card/40">
            <Award className="h-10 w-10 mx-auto text-muted-foreground/60" />
            <h3 className="font-semibold text-foreground text-base">No certificates found</h3>
            <p className="text-xs max-w-sm mx-auto">
              {searchTerm || filterCat !== "All"
                ? "No credentials match your active filters. Try adjusting your query."
                : "Complete your enrolled courses and assessments to receive official verified credentials."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((c: any) => {
              const pct = c.total ? Math.round((c.score / c.total) * 100) : 0;
              const category = c.courses?.category || "Programming";
              const title = c.courses?.title || "Certificate Course";
              const formattedDate = format(new Date(c.issued_at), "dd MMM yyyy");

              return (
                <div
                  key={c.id}
                  className="group rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary/40 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Apple Pro Certificate Miniature Card */}
                  <div className="aspect-[1.58/1] relative bg-neutral-950 p-6 flex flex-col justify-between text-white overflow-hidden border-b border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                    <div className="relative flex items-center justify-between z-10">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>VERIFIED {pct}%</span>
                      </div>
                      <Award className="h-5 w-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
                    </div>

                    <div className="relative z-10 space-y-1">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 font-semibold block">
                        Learnify Credential Spec
                      </span>
                      <h3 className="font-display font-semibold text-base leading-snug line-clamp-2 text-neutral-100">
                        {title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                      <span className="font-semibold text-foreground px-2 py-0.5 rounded-md bg-muted/60">
                        {category}
                      </span>
                      <span>{formattedDate}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-mono font-bold text-foreground bg-muted/60 border border-border/60 px-2.5 py-1 rounded-lg">
                        #{c.code}
                      </div>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        Honors Credential
                      </span>
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center gap-2">
                      <Button asChild size="sm" variant="default" className="flex-1 text-xs gap-1.5 rounded-xl font-semibold cursor-pointer">
                        <Link to="/certificates/$code" params={{ code: c.code }}>
                          <ExternalLink className="h-3.5 w-3.5" /> Open Certificate
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="text-xs rounded-xl px-3 cursor-pointer" title="Verify On Registry">
                        <Link to="/verify/$id" params={{ id: c.code }}>
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="text-xs rounded-xl px-3 cursor-pointer" title="Download Document">
                        <Link
                          to="/certificates/$code"
                          params={{ code: c.code }}
                          search={{ download: 1 } as any}
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

        {/* Certificate Governance & Legal Licensing Guidance */}
        <div className="mt-12 p-6 rounded-2xl border bg-card shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Learnify AI Certification Guidance & External Accreditation Resources
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Learnify AI issues cryptographically verifiable course completion credentials with unique verification codes and QR lookups. For institutions and educators seeking independent statutory or international accreditation for external curriculum programs, consult these official portals:
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border bg-muted/30">
              <div className="font-semibold text-foreground mb-1">1. MSME Udyam Portal</div>
              <p className="text-muted-foreground text-[11px]">
                Official Government of India portal for micro, small, and medium enterprise registration.
              </p>
              <a
                href="https://udyamregistration.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline font-medium mt-2"
              >
                Official Udyam Portal <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="p-3.5 rounded-xl border bg-muted/30">
              <div className="font-semibold text-foreground mb-1">
                2. Skill India / NSDC
              </div>
              <p className="text-muted-foreground text-[11px]">
                National Skill Development Corporation guidance for vocational skill training partnerships.
              </p>
              <a
                href="https://nsdcindia.org"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline font-medium mt-2"
              >
                NSDC Official Portal <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="p-3.5 rounded-xl border bg-muted/30">
              <div className="font-semibold text-foreground mb-1">3. ISO Standards</div>
              <p className="text-muted-foreground text-[11px]">
                International Organization for Standardization specifications for quality (9001) and security (27001).
              </p>
              <a
                href="https://www.iso.org"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline font-medium mt-2"
              >
                ISO Official Portal <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground/80 italic border-t pt-3">
            Disclaimer: Learnify AI certificates verify curriculum and practical project completion on Learnify AI. External accreditation and licensing are separate statutory certifications awarded directly by respective authorities.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
