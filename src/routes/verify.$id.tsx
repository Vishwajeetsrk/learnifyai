import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { Award, ShieldCheck, CheckCircle2, Download, Printer, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CertificateRender, DEFAULT_DESIGN } from "@/components/CertificateDesign";
import { useRef, useState, useEffect } from "react";
import QRCode from "qrcode";
import { downloadElementAsPdf } from "@/lib/certificate-pdf";

export const Route = createFileRoute("/verify/$id")({
  head: () => ({ meta: [{ title: "Verified Credential — Learnify AI" }] }),
  component: VerifyPage,
});

function VerifyPage() {
  const { id } = Route.useParams();
  const certRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [downloading, setDownloading] = useState(false);

  const q = useQuery({
    queryKey: ["verify", id],
    queryFn: async () => {
      // Find the certificate by code or verification ID
      const { data: certV2, error: v2Err } = await supabase
        .from("certificates")
        .select("*, courses(title, instructor), profiles(full_name, email), certificate_templates(*)")
        .eq("code", id)
        .maybeSingle();

      if (v2Err) throw v2Err;

      const { data: rpcData } = await supabase.rpc("get_certificate_by_code", { _code: id });
      const row = Array.isArray(rpcData) ? rpcData[0] : rpcData;

      if (!row && !certV2) throw new Error("Credential not found or invalid.");

      let issuerOrgLogoUrl = null;
      const createdBy = (certV2 as any)?.created_by || (row as any)?.created_by;
      if (createdBy) {
        const { data: issuerProfile } = await supabase
          .from("profiles")
          .select("org_logo_url")
          .eq("id", createdBy)
          .maybeSingle();
        issuerOrgLogoUrl = issuerProfile?.org_logo_url ?? null;
      }

      return { ...row, v2: certV2, issuer_org_logo_url: issuerOrgLogoUrl } as any;
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    QRCode.toDataURL(url, { margin: 1, width: 220, color: { dark: "#0f1b3d", light: "#ffffff" } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [id]);

  if (q.isLoading) {
    return <div className="min-h-screen grid place-items-center"><div className="animate-pulse flex flex-col items-center gap-4"><ShieldCheck className="h-10 w-10 text-muted-foreground" /><p>Verifying Blockchain Signature...</p></div></div>;
  }

  if (q.error || !q.data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Award className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Invalid Credential</h1>
        <p className="text-muted-foreground max-w-md mx-auto">This certificate ID does not exist in our verifiable credential registry.</p>
        <Button asChild className="mt-6"><Link to="/">Go Home</Link></Button>
      </div>
    );
  }

  const row = q.data;
  const learnerName = row.v2?.profiles?.full_name || row.recipient_name || row.learner_name || "Learner";
  const courseTitle = row.v2?.courses?.title || row.course_title || "Course";
  const issueDate = format(new Date(row.v2?.issued_at || row.issued_at), "dd MMM yyyy");

  const ctx = {
    name: learnerName,
    course: courseTitle,
    date: issueDate,
    role: row.role_title ?? "",
    from: row.date_from ? format(new Date(row.date_from), "dd MMM yyyy") : "",
    to: row.date_to ? format(new Date(row.date_to), "dd MMM yyyy") : issueDate,
    instructor: row.v2?.courses?.instructor || row.course_instructor || undefined,
    code: id,
    score: row.v2?.score || row.score,
    total: row.v2?.total || row.total,
    qrDataUrl,
  };

  const handleDownloadPdf = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      await downloadElementAsPdf(certRef.current, `verified-credential-${id}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Verification Banner */}
      <div className="bg-emerald-600 text-white p-4 text-center flex flex-col md:flex-row items-center justify-center gap-4 shadow-md sticky top-0 z-50 print:hidden">
        <div className="flex items-center gap-2 font-semibold">
          <CheckCircle2 className="h-6 w-6" />
          Officially Verified Credential
        </div>
        <div className="text-emerald-100 text-sm flex gap-4">
          <span>Issued by Learnify AI</span>
          <span className="opacity-50">|</span>
          <span className="font-mono">{id}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <h1 className="text-xl font-display font-bold">Credential Registry</h1>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
            <Button size="sm" onClick={handleDownloadPdf} disabled={downloading}>
              <Download className="h-4 w-4" /> Save PDF
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border">
          {/* Top Info Bar */}
          <div className="bg-slate-100 p-6 border-b flex flex-col md:flex-row gap-6 justify-between items-start md:items-center print:hidden">
            <div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-1">Recipient</div>
              <div className="text-xl font-bold">{learnerName}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-1">Achievement</div>
              <div className="text-xl font-bold">{courseTitle}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-1">Issue Date</div>
              <div className="text-xl font-bold text-primary">{issueDate}</div>
            </div>
          </div>

          <div className="p-8 bg-slate-100/50">
            {row.v2?.certificate_templates ? (
              <div ref={certRef} className="relative w-full mx-auto overflow-hidden shadow-2xl bg-white" style={{ aspectRatio: "1.414 / 1", backgroundImage: row.v2.certificate_templates.bg_image_url ? `url(${row.v2.certificate_templates.bg_image_url})` : 'none', backgroundSize: 'cover' }}>
                {row.v2.certificate_templates.config_json?.elements?.map((el: any) => {
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
                    const logoUrl = (row as any)?.issuer_org_logo_url;
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
                      fontSize: el.fontSize, 
                      fontFamily: el.fontFamily, 
                      color: el.color,
                      textAlign: el.align,
                      width: el.width || 'auto',
                      fontWeight: el.fontWeight || 'normal',
                      fontStyle: el.fontStyle || 'normal',
                      textDecoration: el.textDecoration === 'underline' ? 'underline' : 'none',
                      transform: el.align === 'center' ? 'translateX(-50%)' : el.align === 'right' ? 'translateX(-100%)' : 'none'
                    }}>
                      {content}
                    </div>
                  );
                })}
              </div>
            ) : (
              <CertificateRender ref={certRef} design={row.design_snapshot ? { ...DEFAULT_DESIGN, ...row.design_snapshot } : DEFAULT_DESIGN} ctx={ctx} />
            )}
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground print:hidden">
          <ShieldCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>This credential has been verified using cryptographic proofs.</p>
          <a href="https://learnify.ai" className="text-primary hover:underline flex items-center justify-center gap-1 mt-2">
            Learn more about Learnify AI <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
      
      <style>{`
        @media print {
          body { background: white !important; }
          @page { size: A4 landscape; margin: 10mm; }
        }
      `}</style>
    </div>
  );
}
