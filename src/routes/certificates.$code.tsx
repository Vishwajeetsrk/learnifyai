import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Loader2, Award, Printer, Share2, Download, Mail } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { emailCertificate } from "@/lib/cert.functions";
import { downloadElementAsPdf, downloadElementAsImage } from "@/lib/certificate-pdf";
import { CertificateRender, DEFAULT_DESIGN, type CertDesign } from "@/components/CertificateDesign";
import { CertificateFullPreviewDialog } from "@/components/CertificateFullPreviewDialog";
import { AppleCertificateStage } from "@/components/certificates/AppleCertificateStage";
import { EngravedCertificateTemplate } from "@/components/certificate/EngravedCertificateTemplate";
import { Maximize2, Image as ImageIcon, Sparkles } from "lucide-react";

export const Route = createFileRoute("/certificates/$code")({
  head: () => ({ meta: [{ title: "Certificate — Learnify AI" }] }),
  component: CertificatePage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center p-10 text-center">
      <div>
        <Award className="h-10 w-10 mx-auto text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : String(error)}
        </p>
        <Link to="/" className="text-primary underline text-sm mt-2 inline-block">
          Home
        </Link>
      </div>
    </div>
  ),
});

function CertificatePage() {
  const { code } = Route.useParams();
  const { user } = useAuth();
  const certRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [sending, setSending] = useState(false);
  const [viewMode, setViewMode] = useState<"engraved" | "apple">("engraved");
  const [downloading, setDownloading] = useState(false);
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);
  const sendEmail = useServerFn(emailCertificate);

  const q = useQuery({
    queryKey: ["cert", code],
    queryFn: async () => {
      if (!code || typeof code !== "string") throw new Error("Certificate code is required");
      const cleanCode = code.trim();
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanCode);

      let row: any = null;

      // 1. Try get_certificate_by_code RPC
      try {
        const { data: rpcData } = await supabase.rpc("get_certificate_by_code", {
          _code: cleanCode,
        });
        const rpcRow = Array.isArray(rpcData) ? rpcData[0] : rpcData;
        if (rpcRow) row = rpcRow;
      } catch (err) {
        console.warn("RPC get_certificate_by_code error, checking table directly:", err);
      }

      // 2. Direct lookup on certificates table
      if (!row) {
        try {
          let query = supabase
            .from("certificates")
            .select("*, courses:course_id(title, instructor, category), profiles:user_id(full_name, email)");

          if (isUuid) {
            query = query.or(`id.eq.${cleanCode},code.ilike.${cleanCode}`);
          } else {
            query = query.ilike("code", cleanCode);
          }

          const { data: certRow } = await query.maybeSingle();
          if (certRow) {
            row = {
              id: certRow.id,
              code: certRow.code,
              user_id: certRow.user_id,
              course_id: certRow.course_id,
              score: certRow.score ?? 100,
              total: certRow.total ?? 100,
              issued_at: certRow.issued_at,
              learner_name: (certRow as any).learner_name || (certRow as any).recipient_name || (certRow as any).profiles?.full_name || "Learner",
              learner_email: (certRow as any).learner_email || (certRow as any).profiles?.email || "",
              course_title: (certRow as any).courses?.title || "Learnify Course",
              course_instructor: (certRow as any).courses?.instructor || "Learnify Instructor",
              course_category: (certRow as any).courses?.category || "General",
              design_snapshot: certRow.design_snapshot,
              recipient_name: (certRow as any).recipient_name || (certRow as any).learner_name || (certRow as any).profiles?.full_name,
              role_title: (certRow as any).role_title || "Certified Specialist",
              date_from: (certRow as any).date_from,
              date_to: (certRow as any).date_to,
              notes: (certRow as any).notes,
              template_id: (certRow as any).template_id,
              status: (certRow as any).status || ((certRow as any).revoked_at ? "revoked" : "verified"),
              revoked_at: (certRow as any).revoked_at,
            };
          }
        } catch (err) {
          console.warn("Certificates table lookup error:", err);
        }
      }

      // 3. Direct lookup on user_certificates table
      if (!row) {
        try {
          let query = (supabase as any)
            .from("user_certificates")
            .select("*, course:courses(title, instructor, category), user:profiles(full_name, email)");

          if (isUuid) {
            query = query.or(`id.eq.${cleanCode},certificate_number.ilike.${cleanCode}`);
          } else {
            query = query.ilike("certificate_number", cleanCode);
          }

          const { data: userCert } = await query.maybeSingle();
          if (userCert) {
            row = {
              id: userCert.id,
              code: userCert.certificate_number || userCert.id,
              user_id: userCert.user_id,
              course_id: userCert.course_id,
              score: userCert.score ? parseInt(userCert.score) : 100,
              total: 100,
              issued_at: userCert.issue_date || userCert.created_at || new Date().toISOString(),
              learner_name: userCert.recipient_name || userCert.user?.full_name || "Learner",
              learner_email: userCert.user?.email || "",
              course_title: userCert.course_title || userCert.course?.title || "Learnify AI Program",
              course_instructor: userCert.instructor_name || userCert.course?.instructor || "Learnify Instructor",
              course_category: userCert.course?.category || "Technology",
              design_snapshot: userCert.design_snapshot,
              recipient_name: userCert.recipient_name || userCert.user?.full_name || "Learner",
              role_title: "Certified Specialist",
              template_id: userCert.template_id,
              status: userCert.status || (userCert.revoked_at ? "revoked" : "verified"),
              revoked_at: userCert.revoked_at,
            };
          }
        } catch (err) {
          console.warn("user_certificates lookup error:", err);
        }
      }

      if (!row) throw new Error(`Certificate record not found for "${cleanCode}"`);

      // Template lookup
      const effectiveTemplateId = row.template_id || (row as any).v2?.template_id;
      let template = null;
      if (effectiveTemplateId) {
        try {
          const { data: tmpl } = await supabase
            .from("certificate_templates")
            .select("*")
            .eq("id", effectiveTemplateId)
            .maybeSingle();
          template = tmpl;
        } catch (err) {
          console.warn("Template fetch error:", err);
        }
      }

      let issuerOrgLogoUrl = null;
      if ((row as any).created_by) {
        try {
          const { data: issuerProfile } = await supabase
            .from("profiles")
            .select("org_logo_url")
            .eq("id", (row as any).created_by)
            .maybeSingle();
          issuerOrgLogoUrl = issuerProfile?.org_logo_url ?? null;
        } catch (err) {
          console.warn("Issuer profile error:", err);
        }
      }

      return {
        ...row,
        v2: template ? { template_id: effectiveTemplateId, certificate_templates: template } : null,
        issuer_org_logo_url: issuerOrgLogoUrl,
      } as any;
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = window.location.origin + `/verify/${q.data?.code || code}`;
    QRCode.toDataURL(url, { margin: 1, width: 220, color: { dark: "#0f1b3d", light: "#ffffff" } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [code, q.data?.code]);

  useEffect(() => {
    if (user?.email) setEmailTo(user.email);
  }, [user]);

  if (q.isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  if (q.error || !q.data) {
    return (
      <div className="min-h-screen grid place-items-center p-10 text-center">
        <div>
          <Award className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Certificate not found.</p>
          <Link to="/" className="text-primary underline text-sm mt-2 inline-block">
            Home
          </Link>
        </div>
      </div>
    );
  }

  const row = q.data;
  const design: CertDesign =
    row.design_snapshot && typeof row.design_snapshot === "object"
      ? { ...DEFAULT_DESIGN, ...row.design_snapshot }
      : DEFAULT_DESIGN;

  const learnerName =
    row.recipient_name || row.learner_name || row.learner_email?.split("@")[0] || "Learner";
  const issueDate = format(new Date(row.issued_at), "dd MMM yyyy");
  const verifyUrl =
    typeof window !== "undefined" ? `${window.location.origin}/certificates/${row.code}` : "";

  const ctx = {
    name: learnerName,
    course: row.course_title ?? "Learnify AI Program",
    date: issueDate,
    role: row.role_title ?? "",
    from: row.date_from ? format(new Date(row.date_from), "dd MMM yyyy") : "",
    to: row.date_to ? format(new Date(row.date_to), "dd MMM yyyy") : issueDate,
    instructor: row.course_instructor ?? undefined,
    code: row.code,
    score: row.score,
    total: row.total,
    qrDataUrl,
  };

  const share = async () => {
    try {
      if (navigator.share)
        await navigator.share({
          url: verifyUrl,
          title: `Certificate — ${row.course_title ?? "Learnify"}`,
        });
      else {
        await navigator.clipboard.writeText(verifyUrl);
        toast.success("Link copied");
      }
    } catch {}
  };

  const handleDownloadPdf = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      await downloadElementAsPdf(certRef.current, `certificate-${row.code}.pdf`);
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
      await downloadElementAsImage(certRef.current, `certificate-${row.code}.png`);
      toast.success("Image downloaded");
    } catch (e: any) {
      toast.error(e?.message ?? "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  const handleEmail = async () => {
    if (!emailTo) return toast.error("Enter an email");
    setSending(true);
    try {
      await sendEmail({ data: { code: row.code, to: emailTo } });
      toast.success(`Certificate sent to ${emailTo}`);
      setEmailOpen(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Email failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-neutral-950 text-white py-8 sm:py-12 px-4 selection:bg-white/20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Apple Style Top Navigation & Actions Bar */}
        <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-900/80 backdrop-blur-xl border border-white/10 shadow-xl print:hidden flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/certificates"
              className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors px-2 py-1"
            >
              ← All Certificates
            </Link>

            {/* Edition Switcher */}
            {!row.v2?.certificate_templates && (
              <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setViewMode("engraved")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === "engraved"
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>Engraved Rosette</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("apple")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === "apple"
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>3D Hologram</span>
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setFullPreviewOpen(true)}
              className="gap-1.5 text-xs rounded-xl bg-white/5 border-white/15 text-white hover:bg-white/15 cursor-pointer"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Full View</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-[#0A66C2] text-white hover:bg-[#004182] hover:text-white border-none rounded-xl text-xs font-semibold gap-1.5 cursor-pointer shadow-sm"
              onClick={() => {
                const issueDateObj = new Date(row.issued_at);
                const year = issueDateObj.getFullYear();
                const month = issueDateObj.getMonth() + 1;
                const linkedinUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
                  row.course_title ?? "Learnify AI Certification",
                )}&organizationName=Learnify+AI&issueYear=${year}&issueMonth=${month}&certUrl=${encodeURIComponent(
                  verifyUrl,
                )}&certId=${encodeURIComponent(row.code)}`;
                window.open(linkedinUrl, "_blank", "noopener,noreferrer");
              }}
            >
              <span>Add to LinkedIn</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEmailOpen(true)}
              className="gap-1.5 text-xs rounded-xl bg-white/5 border-white/15 text-white hover:bg-white/15 cursor-pointer"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Email</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.print()}
              className="gap-1.5 text-xs rounded-xl bg-white/5 border-white/15 text-white hover:bg-white/15 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </Button>
          </div>
        </div>

        {row.v2?.certificate_templates ? (
          <div
            ref={certRef}
            className="relative w-full mx-auto overflow-hidden shadow-2xl"
            style={{
              aspectRatio: "1.414 / 1",
              background: row.v2.certificate_templates.bg_image_url
                ? `#fdfbf5 url(${row.v2.certificate_templates.bg_image_url}) center/cover no-repeat`
                : "#fdfbf5",
              colorScheme: "light",
            }}
          >
            {row.v2.certificate_templates.config_json?.elements?.length > 0 ? (
              row.v2.certificate_templates.config_json.elements.map((el: any) => {
                let content = el.content || "";
                content = content
                  .replace("{name}", ctx.name)
                  .replace("{course}", ctx.course)
                  .replace("{date}", ctx.date)
                  .replace("{certificate_id}", ctx.code);

                if (el.type === "qr") {
                  return (
                    <div
                      key={el.id}
                      className="absolute"
                      style={{ left: el.x, top: el.y, width: el.width, height: el.height }}
                    >
                      {qrDataUrl && <img src={qrDataUrl} alt="QR" className="w-full h-full" />}
                    </div>
                  );
                }

                if (el.type === "org_logo") {
                  const logoUrl =
                    (row.v2?.certificate_templates as any)?.org_logo_url ||
                    (row as any)?.issuer_org_logo_url ||
                    "/logo.png";
                  return (
                    <div
                      key={el.id}
                      className="absolute"
                      style={{
                        left: el.x,
                        top: el.y,
                        width: el.width || 100,
                        height: el.height || 80,
                      }}
                    >
                      <img src={logoUrl} alt="Org Logo" className="w-full h-full object-contain" />
                    </div>
                  );
                }

                return (
                  <div
                    key={el.id}
                    className="absolute whitespace-pre-wrap"
                    style={{
                      left: el.x,
                      top: el.y,
                      fontSize: el.fontSize || "16px",
                      fontFamily: el.fontFamily || "Georgia, serif",
                      color: el.color || "#0f1b3d",
                      textAlign: el.align || "left",
                      width: el.width || "auto",
                      fontWeight: el.fontWeight || "normal",
                      fontStyle: el.fontStyle || "normal",
                      textDecoration: el.textDecoration === "underline" ? "underline" : "none",
                      transform:
                        el.align === "center"
                          ? "translateX(-50%)"
                          : el.align === "right"
                            ? "translateX(-100%)"
                            : "none",
                    }}
                  >
                    {content}
                  </div>
                );
              })
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center p-10 text-center"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {/* Logo in template fallback */}
                <div className="mb-2">
                  <img
                    src={
                      (row.v2?.certificate_templates as any)?.org_logo_url ||
                      (row as any)?.issuer_org_logo_url ||
                      "/logo.png"
                    }
                    alt="Logo"
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <div className="text-4xl font-bold mb-3" style={{ color: "#c9a84c" }}>
                  Certificate of Completion
                </div>
                <div className="text-xs uppercase tracking-widest mb-4 text-gray-500">
                  This is to certify that
                </div>
                <div className="text-3xl font-bold mb-3" style={{ color: "#0f1b3d" }}>
                  {ctx.name}
                </div>
                <div className="text-sm text-gray-600 max-w-md leading-relaxed mb-6">
                  has successfully completed the course <strong>{ctx.course}</strong> on {ctx.date}.
                </div>
                <div
                  className="border-t pt-3 text-xs uppercase tracking-widest text-gray-500"
                  style={{ borderColor: "#c9a84c" }}
                >
                  {row.v2.certificate_templates.signatory_name || "Learnify AI"}
                </div>
                <div className="mt-2 text-[10px] text-gray-400">
                  {ctx.qrDataUrl && <img src={qrDataUrl} alt="QR" className="h-12 w-12 mx-auto" />}
                </div>
                <div className="text-[10px] font-mono mt-1 text-gray-400">{ctx.code}</div>
              </div>
            )}
          </div>
        ) : viewMode === "engraved" ? (
          <EngravedCertificateTemplate
            ref={certRef}
            initialRecipientName={ctx.name}
            initialCourseTitle={ctx.course}
            initialIssueDate={ctx.date}
            initialCredentialId={ctx.code}
            initialSignatoryName={row.v2?.certificate_templates?.signatory_name || "Vishwajeet"}
            initialSignatoryTitle={
              row.v2?.certificate_templates?.signatory_title ||
              "Founder & Chief AI Architect, Learnify AI"
            }
            logoUrl={row.issuer_org_logo_url || "/logo.png"}
            qrDataUrl={qrDataUrl}
            onDownloadPdf={handleDownloadPdf}
            onDownloadImage={handleDownloadImage}
            downloading={downloading}
          />
        ) : (
          <AppleCertificateStage
            design={design}
            ctx={ctx}
            certRef={certRef}
            onDownloadPdf={handleDownloadPdf}
            onDownloadImage={handleDownloadImage}
            onShare={share}
            downloading={downloading}
          />
        )}

        <p className="mt-4 text-center text-[11px] text-muted-foreground print:hidden">
          Verify at {typeof window !== "undefined" ? window.location.host : "learnify.ai"}
          /certificates/{row.code}
        </p>
      </div>

      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email this certificate</DialogTitle>
            <DialogDescription>
              Send a verified link of this certificate to any email address.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="email"
            value={emailTo}
            onChange={(e) => setEmailTo(e.target.value)}
            placeholder="recipient@email.com"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailOpen(false)} disabled={sending}>
              Cancel
            </Button>
            <Button onClick={handleEmail} disabled={sending}>
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}{" "}
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CertificateFullPreviewDialog
        open={fullPreviewOpen}
        onOpenChange={setFullPreviewOpen}
        design={design}
        ctx={ctx}
        title={`${row.course_title ?? "Certificate"} — ${learnerName}`}
      />

      <style>{`
        @media print {
          body { background: white !important; }
          @page { size: A4 landscape; margin: 10mm; }
        }
      `}</style>
    </div>
  );
}
