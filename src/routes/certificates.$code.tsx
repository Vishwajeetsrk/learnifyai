import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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
import { downloadElementAsPdf } from "@/lib/certificate-pdf";
import { CertificateRender, DEFAULT_DESIGN, type CertDesign } from "@/components/CertificateDesign";
import { CertificateFullPreviewDialog } from "@/components/CertificateFullPreviewDialog";
import { Maximize2 } from "lucide-react";

export const Route = createFileRoute("/certificates/$code")({
  head: () => ({ meta: [{ title: "Certificate — Learnify AI" }] }),
  component: CertificatePage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center p-10 text-center">
      <div>
        <Award className="h-10 w-10 mx-auto text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">{error.message}</p>
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
  const [downloading, setDownloading] = useState(false);
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);
  const sendEmail = useServerFn(emailCertificate);

  const q = useQuery({
    queryKey: ["cert", code],
    queryFn: async () => {
      const { data: rpcData, error } = await supabase.rpc("get_certificate_by_code", { _code: code });
      if (error) throw error;
      const row = Array.isArray(rpcData) ? rpcData[0] : rpcData;
      if (!row) throw new Error("Certificate not found");
      
      const { data: certV2 } = await supabase
        .from("certificates")
        .select("template_id")
        .eq("code", code)
        .maybeSingle();

      let template = null;
      if (certV2?.template_id) {
        const { data: tmpl } = await supabase
          .from("certificate_templates")
          .select("*")
          .eq("id", certV2.template_id)
          .maybeSingle();
        template = tmpl;
      }

      let issuerOrgLogoUrl = null;
      if (row.created_by) {
        const { data: issuerProfile } = await supabase
          .from("profiles")
          .select("org_logo_url")
          .eq("id", row.created_by)
          .maybeSingle();
        issuerOrgLogoUrl = issuerProfile?.org_logo_url ?? null;
      }

      return { ...row, v2: certV2 ? { ...certV2, certificate_templates: template } : null, issuer_org_logo_url: issuerOrgLogoUrl } as any;
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = window.location.origin + `/certificates/${code}`;
    QRCode.toDataURL(url, { margin: 1, width: 220, color: { dark: "#0f1b3d", light: "#ffffff" } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [code]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-violet-100 py-6 sm:py-12 px-4" style={{ colorScheme: "light" }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-2 mb-4 print:hidden flex-wrap">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Home
          </Link>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={() => setFullPreviewOpen(true)}>
              <Maximize2 className="h-4 w-4" /> Expand
            </Button>
            <Button size="sm" variant="outline" onClick={share}>
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEmailOpen(true)}>
              <Mail className="h-4 w-4" /> Email
            </Button>
            <Button size="sm" variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button size="sm" onClick={handleDownloadPdf} disabled={downloading}>
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}{" "}
              PDF
            </Button>
          </div>
        </div>

        {row.v2?.certificate_templates ? (
          <div ref={certRef} className="relative w-full mx-auto overflow-hidden shadow-2xl" style={{ aspectRatio: "1.414 / 1", background: row.v2.certificate_templates.bg_image_url ? `#fdfbf5 url(${row.v2.certificate_templates.bg_image_url}) center/cover no-repeat` : "#fdfbf5", colorScheme: "light" }}>
            {row.v2.certificate_templates.config_json?.elements?.length > 0 ? (
              row.v2.certificate_templates.config_json.elements.map((el: any) => {
                let content = el.content || "";
                content = content.replace("{name}", ctx.name).replace("{course}", ctx.course).replace("{date}", ctx.date).replace("{certificate_id}", ctx.code);
                
                  if (el.type === 'qr') {
                    return (
                      <div key={el.id} className="absolute" style={{ left: el.x, top: el.y, width: el.width, height: el.height }}>
                        {qrDataUrl && <img src={qrDataUrl} alt="QR" className="w-full h-full" />}
                      </div>
                    );
                  }

                  if (el.type === 'org_logo') {
                    const logoUrl = (row.v2?.certificate_templates as any)?.org_logo_url || (row as any)?.issuer_org_logo_url;
                    return logoUrl ? (
                      <div key={el.id} className="absolute" style={{ left: el.x, top: el.y, width: el.width || 100, height: el.height || 80 }}>
                        <img src={logoUrl} alt="Org Logo" className="w-full h-full object-contain" />
                      </div>
                    ) : null;
                  }
                  
                  return (
                    <div key={el.id} className="absolute whitespace-pre-wrap" style={{ 
                      left: el.x, 
                      top: el.y, 
                      fontSize: el.fontSize || '16px', 
                      fontFamily: el.fontFamily || 'Georgia, serif', 
                      color: el.color || '#0f1b3d',
                      textAlign: el.align || 'left',
                      width: el.width || 'auto',
                      fontWeight: el.fontWeight || 'normal',
                      fontStyle: el.fontStyle || 'normal',
                      textDecoration: el.textDecoration === 'underline' ? 'underline' : 'none',
                      transform: el.align === 'center' ? 'translateX(-50%)' : el.align === 'right' ? 'translateX(-100%)' : 'none'
                    }}>
                      {content}
                    </div>
                  );
              })
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center" style={{ fontFamily: "'Georgia', serif" }}>
                <div className="text-4xl font-bold mb-3" style={{ color: '#c9a84c' }}>Certificate of Completion</div>
                <div className="text-xs uppercase tracking-widest mb-4 text-gray-500">This is to certify that</div>
                <div className="text-3xl font-bold mb-3" style={{ color: '#0f1b3d' }}>{ctx.name}</div>
                <div className="text-sm text-gray-600 max-w-md leading-relaxed mb-6">
                  has successfully completed the course <strong>{ctx.course}</strong> on {ctx.date}.
                </div>
                <div className="border-t pt-3 text-xs uppercase tracking-widest text-gray-500" style={{ borderColor: '#c9a84c' }}>
                  {row.v2.certificate_templates.signatory_name || 'Learnify AI'}
                </div>
                <div className="mt-2 text-[10px] text-gray-400">{ctx.qrDataUrl && <img src={qrDataUrl} alt="QR" className="h-12 w-12 mx-auto" />}</div>
                <div className="text-[10px] font-mono mt-1 text-gray-400">{ctx.code}</div>
              </div>
            )}
          </div>
        ) : (
          <CertificateRender ref={certRef} design={design} ctx={ctx} />
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
