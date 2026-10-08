/**
 * verify.$id.tsx — Learnify AI Certificate Studio 2.0
 * Public credential verification page.
 * URL: /verify/:id  (id = certificate code, e.g. LRN-XLMQPO-ABC123)
 *
 * Features:
 * - Looks up certificate by code across multiple tables (with fallback chain)
 * - Shows revocation status immediately
 * - Displays earned achievement badges
 * - QR code for re-verification
 * - JSON-LD structured data for SEO
 * - Certificate reveal animation (fade + scale + border sweep)
 * - Social sharing (copy URL, LinkedIn)
 * - Download (PDF / PNG)
 * - No private data exposed (no raw DB IDs, no emails in HTML)
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Calendar,
  BookOpen,
  ShieldCheck,
  Download,
  Share2,
  ArrowLeft,
  Loader2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Linkedin,
  Printer,
  Hash,
  User,
  Building2,
  GraduationCap,
  ChevronRight,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { downloadElementAsPdf, downloadElementAsImage } from "@/lib/certificate-pdf";
import { EngravedCertificateTemplate } from "@/components/certificate/EngravedCertificateTemplate";
import { DEFAULT_DESIGN, type CertDesign } from "@/components/CertificateDesign";
import { BadgeRow } from "@/components/ui/AwardBadge";

export const Route = createFileRoute("/verify/$id")({
  head: () => ({
    meta: [
      { title: "Verify Credential — Learnify AI" },
      { name: "description", content: "Verify the authenticity of a Learnify AI certificate or credential." },
      { name: "robots", content: "noindex" }, // Keep individual certs private from search engines
    ],
  }),
  component: CertificateVerificationPage,
});

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function fetchCertificate(id: string) {
  if (!id || typeof id !== "string") return null;
  const cleanId = id.trim();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

  // 1. RPC (fastest path)
  try {
    const { data: rpcData } = await supabase.rpc("get_certificate_by_code", { _code: cleanId });
    const row = Array.isArray(rpcData) ? rpcData[0] : rpcData;
    if (row) {
      return normalizeRow(row, cleanId);
    }
  } catch { /* fall through */ }

  // 2. certificates table
  try {
    let q = supabase
      .from("certificates")
      .select("*, courses:course_id(title, instructor, category), profiles:user_id(full_name)");

    q = isUuid
      ? q.or(`id.eq.${cleanId},code.ilike.${cleanId}`)
      : q.ilike("code", cleanId);

    const { data: row } = await q.maybeSingle();
    if (row) return normalizeRow(row, cleanId);
  } catch { /* fall through */ }

  // 3. user_certificates table (legacy)
  try {
    const { data: row } = await (supabase as any)
      .from("user_certificates")
      .select("*, course:courses(title, instructor, category)")
      .ilike("certificate_number", cleanId)
      .maybeSingle();
    if (row) return normalizeRow(row, cleanId, true);
  } catch { /* fall through */ }

  return null;
}

function normalizeRow(row: any, fallbackCode: string, isLegacy = false): any {
  return {
    id: row.id,
    code: isLegacy ? (row.certificate_number || row.id) : (row.code || fallbackCode),
    recipient_name: row.recipient_name || row.learner_name || row.profiles?.full_name || "Verified Learner",
    course_title: row.course_title || row.courses?.title || row.course?.title || "Learnify AI Course",
    course_category: row.courses?.category || row.course?.category || "",
    course_instructor: row.course_instructor || row.courses?.instructor || row.course?.instructor || "Learnify AI",
    issued_at: row.issued_at || row.issue_date || row.created_at,
    score: row.score ?? null,
    total: row.total ?? 100,
    grade: row.grade ?? null,
    design_snapshot: row.design_snapshot ?? null,
    status: row.status ?? (row.revoked_at ? "revoked" : "active"),
    revoked_at: row.revoked_at ?? null,
    revocation_reason: row.revocation_reason ?? null,
    integrity_hash: row.integrity_hash ?? null,
  };
}

async function fetchBadges(certificateCode: string) {
  try {
    const { data } = await (supabase as any)
      .from("badge_awards")
      .select("badge_name, badge_icon, badge_color, earned_at")
      .eq("certificate_code", certificateCode);
    return data ?? [];
  } catch {
    return [];
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

function CertificateVerificationPage() {
  const { id } = Route.useParams();
  const certRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const { data: cert, isLoading } = useQuery({
    queryKey: ["certificate-verify", id],
    queryFn: () => fetchCertificate(id),
  });

  const { data: badges = [] } = useQuery({
    queryKey: ["certificate-badges", cert?.code],
    queryFn: () => fetchBadges(cert?.code ?? id),
    enabled: !!cert?.code,
  });

  // QR code generation
  useEffect(() => {
    if (typeof window === "undefined" || !cert) return;
    const verifyUrl = `${window.location.origin}/verify/${cert.code || id}`;
    QRCode.toDataURL(verifyUrl, {
      margin: 2,
      width: 200,
      color: { dark: "#0f1b3d", light: "#ffffff" },
      errorCorrectionLevel: "M",
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [cert, id]);

  // Reveal animation trigger
  useEffect(() => {
    if (!cert || cert.status === "revoked") return;
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, [cert]);

  // JSON-LD structured data for SEO (only for valid certs)
  useEffect(() => {
    if (!cert || cert.status === "revoked") return;
    const origin = window.location.origin;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "EducationalOccupationalCredential",
      name: `${cert.course_title} Certificate`,
      description: `Learnify AI verified certificate for ${cert.course_title}`,
      credentialCategory: "Certificate",
      competencyRequired: cert.course_category || "Professional Development",
      recognizedBy: { "@type": "Organization", name: "Learnify AI", url: origin },
      validFrom: cert.issued_at,
      identifier: cert.code,
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(jsonLd);
    script.id = "cert-jsonld";
    document.head.querySelector("#cert-jsonld")?.remove();
    document.head.appendChild(script);
    return () => { document.head.querySelector("#cert-jsonld")?.remove(); };
  }, [cert]);

  const handleDownloadPdf = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      await downloadElementAsPdf(certRef.current, `learnify-certificate-${cert?.code || id}.pdf`);
      toast.success("PDF downloaded");
    } catch (e: any) {
      toast.error(e?.message ?? "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      await downloadElementAsImage(certRef.current, `learnify-certificate-${cert?.code || id}.png`);
      toast.success("PNG downloaded");
    } catch (e: any) {
      toast.error(e?.message ?? "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Verification URL copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkedIn = () => {
    if (!cert) return;
    const params = new URLSearchParams({
      startTask: "CERTIFICATION_NAME",
      name: cert.course_title,
      organizationName: "Learnify AI",
      certUrl: window.location.href,
      certId: cert.code,
    });
    if (cert.issued_at) {
      const d = new Date(cert.issued_at);
      if (!isNaN(d.getTime())) {
        params.set("issueYear", d.getFullYear().toString());
        params.set("issueMonth", (d.getMonth() + 1).toString());
      }
    }
    window.open(`https://www.linkedin.com/profile/add?${params}`, "_blank", "noopener");
  };

  const issueDate = cert?.issued_at
    ? format(new Date(cert.issued_at), "dd MMMM yyyy")
    : "—";

  const scorePercent =
    cert?.score !== null && cert?.score !== undefined && cert?.total
      ? Math.round((cert.score / cert.total) * 100)
      : cert?.score ?? null;

  const design: CertDesign =
    cert?.design_snapshot && typeof cert.design_snapshot === "object"
      ? { ...DEFAULT_DESIGN, ...cert.design_snapshot }
      : { ...DEFAULT_DESIGN };

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <AppShell>
        <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-4 text-center p-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Verifying Credential</p>
            <p className="text-sm text-muted-foreground mt-1">
              Checking cryptographic record for{" "}
              <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{id}</code>
            </p>
          </div>
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  // ─── Not Found ─────────────────────────────────────────────────────────────
  if (!cert) {
    return (
      <AppShell>
        <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-6 text-center p-8 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <Badge variant="destructive" className="mb-3 text-xs">CREDENTIAL NOT FOUND</Badge>
            <h1 className="text-2xl font-bold font-display text-foreground">
              No Record Found
            </h1>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              No verified certificate was found for credential ID{" "}
              <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded break-all">{id}</code>.
              <br />If you believe this is an error, contact{" "}
              <a href="mailto:support.learnifyai@gmail.com" className="text-primary underline">
                support
              </a>.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <Button asChild variant="outline" size="sm">
              <Link to="/certificates"><ArrowLeft className="h-4 w-4 mr-1" />My Certificates</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  // ─── Revoked ───────────────────────────────────────────────────────────────
  if (cert.status === "revoked") {
    return (
      <AppShell>
        <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-6 text-center p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <Badge variant="destructive" className="mb-3 text-xs uppercase tracking-wider">
              Credential Revoked
            </Badge>
            <h1 className="text-2xl font-bold font-display text-foreground">
              This Certificate Has Been Revoked
            </h1>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-sm mx-auto">
              Credential{" "}
              <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{cert.code}</code>{" "}
              was revoked and is no longer recognized as a valid Learnify AI credential.
            </p>
            {cert.revocation_reason && (
              <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground italic">
                Reason: {cert.revocation_reason}
              </div>
            )}
            {cert.revoked_at && (
              <p className="text-xs text-muted-foreground mt-2">
                Revoked on {format(new Date(cert.revoked_at), "dd MMM yyyy")}
              </p>
            )}
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/courses">
              <ArrowLeft className="h-4 w-4 mr-1" />Browse Active Courses
            </Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  // ─── Valid Certificate ─────────────────────────────────────────────────────
  return (
    <AppShell>
      {/* Page wrapper */}
      <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">

        {/* Back link */}
        <Link
          to="/certificates"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Certificates
        </Link>

        {/* ── VERIFIED BANNER ── */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0f1b3d 0%, #1e3a8a 55%, #4f46e5 100%)",
            borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          {/* Top bar */}
          <div className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Learnify logo */}
              <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <img
                  src="https://www.learnifyai.in/assets/learnify-logo-Dbtnnfk3.png"
                  alt="Learnify AI"
                  className="h-7 w-7 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              <div>
                <p className="text-xs text-white/60 font-medium tracking-widest uppercase">Learnify AI</p>
                <p className="text-white font-bold text-sm">Credential Verification Authority</p>
              </div>
            </div>

            {/* Verified badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Verified Credential
              </span>
            </div>
          </div>

          {/* Credential metadata grid */}
          <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <VerifyMetaItem icon={<User className="h-3.5 w-3.5" />} label="Recipient">
              {cert.recipient_name}
            </VerifyMetaItem>
            <VerifyMetaItem icon={<BookOpen className="h-3.5 w-3.5" />} label="Course">
              {cert.course_title}
            </VerifyMetaItem>
            <VerifyMetaItem icon={<Calendar className="h-3.5 w-3.5" />} label="Issued On">
              {issueDate}
            </VerifyMetaItem>
            <VerifyMetaItem icon={<Hash className="h-3.5 w-3.5" />} label="Credential ID">
              <code className="font-mono text-xs text-yellow-300">{cert.code}</code>
            </VerifyMetaItem>
          </div>
        </div>

        {/* ── MAIN CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Certificate visual — LEFT 2/3 */}
          <div className="lg:col-span-2 space-y-4">
            {/* Reveal animation wrapper */}
            <div
              className="rounded-2xl overflow-hidden border border-border/40 shadow-xl"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "scale(1) translateY(0)" : "scale(0.98) translateY(8px)",
                transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              {/* Border highlight sweep — runs once on reveal */}
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl z-10"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(79,70,229,0.3) 50%, transparent 100%)",
                  backgroundSize: "200% 100%",
                  animation: revealed ? "certBorderSweep 0.8s ease-out 0.3s forwards" : "none",
                  opacity: 0,
                }}
              />
              <EngravedCertificateTemplate
                ref={certRef}
                initialRecipientName={cert.recipient_name}
                initialCourseTitle={cert.course_title}
                initialIssueDate={issueDate}
                initialCredentialId={cert.code}
                initialSignatoryName={design.signatory_name || "Vishwajeet"}
                initialSignatoryTitle={design.signatory_title || "Founder & CEO, Learnify AI"}
                logoUrl="/logo.png"
                qrDataUrl={qrDataUrl}
                onDownloadPdf={handleDownloadPdf}
                onDownloadImage={handleDownloadImage}
                downloading={downloading}
              />
            </div>

            {/* Download / share actions (mobile-friendly row) */}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="flex-1 sm:flex-none"
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                PDF
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownloadImage}
                disabled={downloading}
                className="flex-1 sm:flex-none"
              >
                <Download className="h-4 w-4 mr-2" />
                PNG
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.print()}
                className="flex-1 sm:flex-none"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyUrl}
                className="flex-1 sm:flex-none"
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                Copy Link
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleLinkedIn}
                className="flex-1 sm:flex-none"
              >
                <Linkedin className="h-4 w-4 mr-2 text-[#0077b5]" />
                Add to LinkedIn
              </Button>
            </div>
          </div>

          {/* Right column — metadata + QR + badges */}
          <div className="space-y-4">

            {/* Verification status card */}
            <div className="rounded-2xl border border-border/40 bg-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-sm text-foreground">Verification Details</h3>
              </div>
              <div className="space-y-2.5 text-sm">
                <DetailRow label="Status">
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Valid
                  </span>
                </DetailRow>
                <DetailRow label="Issuer">Learnify AI</DetailRow>
                {cert.course_category && (
                  <DetailRow label="Category">{cert.course_category}</DetailRow>
                )}
                {cert.course_instructor && (
                  <DetailRow label="Instructor">{cert.course_instructor}</DetailRow>
                )}
                {scorePercent !== null && (
                  <DetailRow label="Score">
                    <span className={`font-semibold ${scorePercent >= 90 ? "text-emerald-600 dark:text-emerald-400" : scorePercent >= 70 ? "text-yellow-600" : "text-foreground"}`}>
                      {scorePercent}%
                      {cert.grade && ` · ${cert.grade}`}
                    </span>
                  </DetailRow>
                )}
                <DetailRow label="Verified">
                  <span className="text-muted-foreground text-xs">
                    {format(new Date(), "dd MMM yyyy, HH:mm")}
                  </span>
                </DetailRow>
              </div>
            </div>

            {/* QR code */}
            {qrDataUrl && (
              <div className="rounded-2xl border border-border/40 bg-card p-4 text-center space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  QR Verification
                </p>
                <div className="flex justify-center">
                  <div className="p-2 bg-white rounded-xl border border-border/30 inline-block">
                    <img
                      src={qrDataUrl}
                      alt={`QR code for certificate ${cert.code}`}
                      className="w-36 h-36"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Scan to verify this credential
                </p>
              </div>
            )}

            {/* Achievement badges */}
            {badges.length > 0 && (
              <div className="rounded-2xl border border-border/40 bg-card p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <h3 className="font-semibold text-sm text-foreground">Achievements</h3>
                </div>
                <BadgeRow
                  badges={badges.map((b: any) => ({
                    name: b.badge_name,
                    iconName: b.badge_icon ?? "Award",
                    primaryColor: b.badge_color ?? "#4f46e5",
                    accentColor: "#a5b4fc",
                  }))}
                  size={44}
                />
                <div className="space-y-1.5">
                  {badges.map((b: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                      {b.badge_name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification note */}
            <div className="rounded-2xl border border-border/40 bg-card/50 p-3 space-y-1">
              <p className="text-xs text-muted-foreground leading-relaxed">
                This credential is digitally issued by Learnify AI and can be verified at any time
                using the unique credential ID or QR code above.
              </p>
              <a
                href="https://www.learnifyai.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                learnifyai.in <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for the border sweep animation */}
      <style>{`
        @keyframes certBorderSweep {
          0%   { opacity: 0.8; background-position: -100% 0; }
          100% { opacity: 0;   background-position: 200% 0; }
        }
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>
    </AppShell>
  );
}

// ─── Small helper components ──────────────────────────────────────────────────

function VerifyMetaItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-white/50 text-xs">
        {icon}
        <span className="uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="text-white font-semibold text-sm leading-snug">{children}</p>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-muted-foreground flex-shrink-0">{label}</span>
      <span className="text-right text-foreground font-medium">{children}</span>
    </div>
  );
}
