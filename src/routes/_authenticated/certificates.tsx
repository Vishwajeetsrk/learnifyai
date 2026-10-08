import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  Award,
  Download,
  ExternalLink,
  ShieldCheck,
  Search,
  Copy,
  Check,
  Calendar,
  CheckCircle2,
  Sparkles,
  X,
  FileCheck2,
  Lock,
  Share2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { CertificatesListSkeleton } from "@/components/Skeletons";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { AwardBadge } from "@/components/ui/AwardBadge";
import { generateLinkedInCertUrl } from "@/lib/open-badges.functions";

export const Route = createFileRoute("/_authenticated/certificates")({
  head: () => ({ meta: [{ title: "Certificates & Accreditations — Learnify AI" }] }),
  component: CertsPage,
});

const DEFAULT_USER_CERTS = [
  {
    id: "cert-1",
    code: "LRN-ZLHYTD-MQQJFAA5",
    score: 96,
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
    score: 95,
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: certs.length };
    certs.forEach((c: any) => {
      const cat = c.courses?.category || "General";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
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

  const badgesQuery = useQuery({
    enabled: !!user,
    queryKey: ["user-badges-hub", user?.id],
    queryFn: async () => {
      try {
        const { data, error } = await (supabase as any)
          .from("badge_awards")
          .select("*, badge_definitions(name, description, icon_name, shape, primary_color, accent_color, text_color)")
          .eq("user_id", user!.id)
          .order("earned_at", { ascending: false });
        if (error) return [];
        return data ?? [];
      } catch {
        return [];
      }
    },
  });
  const earnedBadges = badgesQuery.data ?? [];

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    toast.success("Credential ID copied to clipboard!");
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleLinkedInShare = (cert: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.learnifyai.in";
    const certUrl = `${origin}/verify/${cert.code}`;
    const url = generateLinkedInCertUrl({
      courseName: cert.courses?.title || "Professional Certificate",
      certificateId: cert.code,
      issueDate: cert.issued_at,
      verificationUrl: certUrl,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-10">
        {/* Apple Keynote Style Hero */}
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 bg-neutral-950 border border-white/10 shadow-2xl text-white">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-gradient-to-b from-indigo-500/15 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Learnify Credential Hub</span>
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                <span className="text-neutral-400">Verifiable Registry</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight text-neutral-100">
                Your Credentials & Accreditations
              </h1>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Cryptographically attested, tamper-proof certifications issued upon mastering production-grade engineering curricula. Verified against industry benchmarks and verifiable worldwide.
              </p>
            </div>
            <div className="flex items-center gap-5 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-xl shadow-lg">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                <Award className="h-7 w-7" />
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-white tracking-tight">{certs.length}</div>
                <div className="text-xs text-neutral-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Earned Credentials
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Earned Badges & Distinctions Showcase (Studio 2.0) */}
        {earnedBadges.length > 0 && (
          <div className="p-6 rounded-3xl border border-border/80 bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Award className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold font-display text-foreground">
                    Earned Achievement Badges ({earnedBadges.length})
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Verifiable Open Badges awarded for curriculum mastery and distinctions.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none pt-2">
              {earnedBadges.map((badge: any) => {
                const def = badge.badge_definitions || {};
                return (
                  <div
                    key={badge.id}
                    className="shrink-0 group cursor-pointer"
                    title={`${badge.badge_name}: ${def.description || "Verified Award"}`}
                  >
                    <AwardBadge
                      title={badge.badge_name}
                      subtitle="LEARNIFY AI"
                      iconName={badge.badge_icon || def.icon_name || "Award"}
                      primaryColor={badge.badge_color || def.primary_color || "#4f46e5"}
                      accentColor={def.accent_color || "#a5b4fc"}
                      textColor={def.text_color || "#ffffff"}
                      brandLogoUrl="https://www.learnifyai.in/assets/learnify-logo-Dbtnnfk3.png"
                      className="w-56 sm:w-64"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2.5 rounded-2xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto p-1 scrollbar-none">
            {categories.map((cat) => {
              const count = categoryCounts[cat] ?? 0;
              const isActive = filterCat === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-muted/40 text-muted-foreground border-transparent hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-background/80 text-muted-foreground border border-border/40"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-72 px-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title or #LRN-ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-8 text-xs rounded-xl bg-muted/50 border border-border/80 focus:outline-none focus:ring-1 focus:ring-foreground/20 text-foreground placeholder:text-muted-foreground"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {q.isLoading ? (
          <CertificatesListSkeleton />
        ) : filteredCerts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed text-muted-foreground space-y-3 bg-card/40">
            <Award className="h-10 w-10 mx-auto text-muted-foreground/60" />
            <h3 className="font-semibold text-foreground text-base">No credentials found</h3>
            <p className="text-xs max-w-sm mx-auto">
              {searchTerm || filterCat !== "All"
                ? "No credentials match your active filters. Try adjusting your search query or category."
                : "Complete your enrolled engineering tracks and capstone milestones to unlock verified production credentials."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((c: any) => {
              const rawScore = typeof c.score === "number" ? c.score : null;
              const rawTotal = typeof c.total === "number" && c.total > 0 ? c.total : 100;
              const hasValidScore = rawScore !== null && rawScore > 0;
              const pct = hasValidScore ? Math.min(100, Math.round((rawScore! / rawTotal) * 100)) : null;

              const category = c.courses?.category || "Engineering";
              const title = c.courses?.title || "Certificate Course";
              const formattedDate = format(new Date(c.issued_at), "dd MMM yyyy");

              return (
                <div
                  key={c.id}
                  className="group rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary/50 hover:scale-[1.015] transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Engraved Plaque Miniature Preview */}
                  <div className="aspect-[1.58/1] relative bg-neutral-950 p-6 flex flex-col justify-between text-white overflow-hidden border-b border-white/10 select-none">
                    {/* Radial background & inner border glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/40 via-neutral-950 to-neutral-950 pointer-events-none" />
                    <div className="absolute inset-2 rounded-2xl border border-white/5 pointer-events-none" />

                    {/* Guilloche Rosette Watermark Accent */}
                    <svg
                      className="absolute -right-6 -bottom-6 w-40 h-40 text-amber-500/10 pointer-events-none"
                      viewBox="0 0 200 200"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle cx="100" cy="100" r="80" strokeWidth="1" strokeDasharray="4 2" />
                      <circle cx="100" cy="100" r="60" strokeWidth="1" />
                      <circle cx="100" cy="100" r="40" strokeWidth="1" strokeDasharray="3 3" />
                      {Array.from({ length: 12 }).map((_, i) => (
                        <ellipse
                          key={i}
                          cx="100"
                          cy="100"
                          rx="75"
                          ry="25"
                          strokeWidth="0.75"
                          transform={`rotate(${i * 15} 100 100)`}
                        />
                      ))}
                    </svg>

                    {/* Top Row: Brand & Verification Pill */}
                    <div className="relative flex items-center justify-between z-10">
                      <div className="flex items-center gap-2">
                        <img
                          src="/logo.png"
                          alt="Learnify AI"
                          className="h-5 w-auto object-contain filter drop-shadow"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = "none";
                          }}
                        />
                        <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-300 font-semibold">
                          LEARNIFY AI
                        </span>
                      </div>

                      {/* Verified Status Badge (NEVER 0%) */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[11px] font-mono font-bold shadow-xs">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>{pct !== null ? `VERIFIED ${pct}%` : "VERIFIED · HONORS"}</span>
                      </div>
                    </div>

                    {/* Middle: Spec Header & Course Title */}
                    <div className="relative z-10 space-y-1.5 my-auto">
                      <div className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-widest uppercase text-amber-400/90 font-semibold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        <Sparkles className="h-2.5 w-2.5" />
                        Production Spec
                      </div>
                      <h3 className="font-display font-semibold text-base sm:text-[17px] leading-snug line-clamp-2 text-neutral-100 group-hover:text-primary-foreground transition-colors">
                        {title}
                      </h3>
                    </div>

                    {/* Plaque Footer: Hash Code & Seal */}
                    <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
                        <Lock className="h-3 w-3 text-emerald-400" />
                        <span className="tracking-wider">#{c.code}</span>
                      </div>
                      <div className="h-7 w-7 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-sm">
                        <Award className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Card Body & Actions */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                      <span className="font-semibold text-foreground px-2.5 py-1 rounded-md bg-muted/70 border border-border/40 text-[11px]">
                        {category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px]">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {formattedDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-muted/40 border border-border/50">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className="text-[11px] font-mono font-bold text-foreground truncate">
                          #{c.code}
                        </span>
                        <button
                          onClick={(e) => handleCopyCode(c.code, e)}
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                          title="Copy Credential ID"
                        >
                          {copiedId === c.code ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 whitespace-nowrap">
                        <CheckCircle2 className="h-3 w-3" /> Honors Credential
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-border/60 flex items-center gap-2">
                      <Button
                        asChild
                        size="sm"
                        variant="default"
                        className="flex-1 text-xs gap-1.5 rounded-xl font-semibold cursor-pointer shadow-sm"
                      >
                        <Link to="/certificates/$code" params={{ code: c.code }}>
                          <ExternalLink className="h-3.5 w-3.5" /> Open Certificate
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="text-xs rounded-xl px-3 cursor-pointer hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/30 transition-colors"
                        title="Verify On Public Registry"
                      >
                        <Link to="/verify/$id" params={{ id: c.code }}>
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="text-xs rounded-xl px-3 cursor-pointer"
                        title="Download Attested Document"
                      >
                        <Link
                          to="/certificates/$code"
                          params={{ code: c.code }}
                          search={{ download: 1 } as any}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs rounded-xl px-3 cursor-pointer hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/30 transition-colors"
                        title="Add to LinkedIn Profile"
                        onClick={(e) => handleLinkedInShare(c, e)}
                      >
                        <Share2 className="h-3.5 w-3.5 text-blue-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Certificate Governance & Legal Licensing Guidance */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl border border-border/80 bg-card shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-base font-display">
              <div className="p-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span>Learnify AI Certification Guidance & External Accreditation Resources</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/60">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" /> Tamper-Proof Cryptographic Standard
            </div>
          </div>

          <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed max-w-4xl">
            Learnify AI issues cryptographically verifiable course completion credentials with unique verification codes and QR lookups. For institutions and educators seeking independent statutory or international accreditation for external curriculum programs, consult these official portals:
          </p>

          <div className="grid md:grid-cols-3 gap-4 text-xs">
            {/* 1. MSME Udyam Portal */}
            <div className="p-4 rounded-2xl border border-border/70 bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-semibold text-foreground text-sm">1. MSME Udyam Portal</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    GOV.IN
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Official Government of India portal for micro, small, and medium enterprise registration and statutory education provider recognition.
                </p>
              </div>
              <a
                href="https://udyamregistration.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold text-xs pt-2 border-t border-border/50"
              >
                Official Udyam Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 2. Skill India / NSDC */}
            <div className="p-4 rounded-2xl border border-border/70 bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-semibold text-foreground text-sm">2. Skill India / NSDC</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    NATIONAL
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  National Skill Development Corporation guidance for vocational skill training partnerships and qualification packs.
                </p>
              </div>
              <a
                href="https://nsdcindia.org"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold text-xs pt-2 border-t border-border/50"
              >
                NSDC Official Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 3. ISO Standards */}
            <div className="p-4 rounded-2xl border border-border/70 bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-semibold text-foreground text-sm">3. ISO Standards</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    9001 / 27001
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  International Organization for Standardization specifications for quality management (9001) and information security (27001).
                </p>
              </div>
              <a
                href="https://www.iso.org"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold text-xs pt-2 border-t border-border/50"
              >
                ISO Official Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-[11px] text-muted-foreground/90 leading-relaxed">
            <span className="font-semibold text-foreground">Disclaimer:</span> Learnify AI certificates verify curriculum and practical project completion on Learnify AI. External accreditation and licensing are separate statutory certifications awarded directly by respective authorities.
          </div>
        </div>
      </div>
    </AppShell>
  );
}
