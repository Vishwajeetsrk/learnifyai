import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties, type Ref } from "react";
import QRCode from "qrcode";
import { Loader2, Award, Printer, Share2, Download, Mail, ChevronDown } from "lucide-react";
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
import { Maximize2, Image as ImageIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

function ScaledCanvas({
  children,
  className,
  style,
  ref,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}) {
  const scaleRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = scaleRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / 842);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={style}>
      <div
        ref={scaleRef}
        style={{ width: "100%" }}
      >
        <div
          style={{
            width: 842,
            height: 595,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

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
      // 1. Try the RPC first
      const { data: rpcData, error } = await supabase.rpc("get_certificate_by_code", {
        _code: code,
      });
      if (error) throw error;
      let row = Array.isArray(rpcData) ? rpcData[0] : rpcData;

      // 2. Fallback: query certificates table directly if RPC returned nothing
      if (!row) {
        const { data: certDirect } = await supabase
          .from("certificates")
          .select("*, courses:course_id(title, instructor, category, certificate_template_id)")
          .or(`code.eq.${code},id.eq.${code}`)
          .maybeSingle();
        if (certDirect) {
          row = {
            code: certDirect.code || code,
            recipient_name: (certDirect as any).learner_name || (certDirect as any).recipient_name || "Learner",
            course_title: (certDirect as any).courses?.title || "Learnify AI Course",
            course_instructor: (certDirect as any).courses?.instructor || "Vishwajeet (Founder & CEO)",
            issued_at: certDirect.issued_at,
            score: certDirect.score,
            total: certDirect.total,
            design_snapshot: certDirect.design_snapshot,
            course_id: certDirect.course_id,
            created_by: (certDirect as any).created_by,
          } as any;
        }
      }

      if (!row) throw new Error("Certificate not found.");

      const { data: certV2 } = await supabase
        .from("certificates")
        .select("template_id")
        .eq("code", code)
        .maybeSingle();

      let targetTemplateId = certV2?.template_id;

      // If certificate doesn't have template_id, check the course's certificate_template_id
      if (!targetTemplateId && (row as any)?.course_id) {
        const { data: courseRow } = await supabase
          .from("courses")
          .select("certificate_template_id")
          .eq("id", (row as any).course_id)
          .maybeSingle();
        targetTemplateId = (courseRow as any)?.certificate_template_id ?? null;
      }

      // If still no template_id, fetch the system default template
      if (!targetTemplateId) {
        const { data: defaultCanva } = await (supabase as any)
          .from("canva_templates")
          .select("id")
          .eq("is_default", true)
          .maybeSingle();
        if (defaultCanva?.id) {
          targetTemplateId = defaultCanva.id;
        } else {
          // Fallback to first available template if no default flag set
          const { data: firstCanva } = await (supabase as any)
            .from("canva_templates")
            .select("id")
            .limit(1)
            .maybeSingle();
          if (firstCanva?.id) targetTemplateId = firstCanva.id;
        }
      }

      let template = null;
      if (targetTemplateId) {
        const { data: canva } = await (supabase as any)
          .from("canva_templates")
          .select("*")
          .eq("id", targetTemplateId)
          .maybeSingle();
        if (canva) {
          const raw = canva as any;
          if (Array.isArray(raw.fields_json?.elements)) {
            template = { ...raw, config_json: raw.fields_json };
          } else if (raw.fields_json && typeof raw.fields_json === "object") {
            const { fieldsToElements, themeToDesign } = await import("@/lib/canva-cert.functions");
            template = {
              ...raw,
              config_json: { elements: fieldsToElements(raw.fields_json), design: themeToDesign(raw.theme_colors) },
            };
          } else {
            template = raw;
          }
        } else {
          const { data: legacy } = await (supabase as any)
            .from("certificate_templates")
            .select("*")
            .eq("id", targetTemplateId)
            .maybeSingle();
          template = legacy;
        }
      }

      let issuerOrgLogoUrl = null;
      if ((row as any).created_by) {
        const { data: issuerProfile } = await supabase
          .from("profiles")
          .select("org_logo_url")
          .eq("id", (row as any).created_by)
          .maybeSingle();
        issuerOrgLogoUrl = issuerProfile?.org_logo_url ?? null;
      }

      return {
        ...row,
        v2: certV2 ? { ...certV2, certificate_templates: template } : null,
        issuer_org_logo_url: issuerOrgLogoUrl,
      } as any;
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
      <div className="min-h-screen grid place-items-center p-10 text-center bg-gradient-to-br from-slate-100 via-indigo-50 to-violet-100">
        <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl border p-10 max-w-md w-full">
          <Award className="h-14 w-14 mx-auto text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Certificate Not Found</h2>
          <p className="text-sm text-muted-foreground mb-6">
            We couldn't find a certificate with code <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">{code}</code>.
            It may have been deleted, the code may be incorrect, or it hasn't been issued yet.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/certificates">
              <Button variant="outline">← My Certificates</Button>
            </Link>
            <Button onClick={() => q.refetch()}>Retry</Button>
          </div>
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
    <div
      className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-violet-100 py-6 sm:py-12 px-4"
      style={{ colorScheme: "light" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-2 mb-4 print:hidden flex-wrap">
          <div className="flex items-center gap-2">
            <Link to="/certificates" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              ← Certificates
            </Link>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={() => setFullPreviewOpen(true)}>
              <Maximize2 className="h-4 w-4" /> Expand
            </Button>
            <Button size="sm" variant="outline" onClick={share}>
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-[#0A66C2] text-white hover:bg-[#004182] hover:text-white border-none"
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
              LinkedIn
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" disabled={downloading}>
                  {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  {" "}Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDownloadPdf}>
                  <Download className="h-3.5 w-3.5 mr-2" /> PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadImage}>
                  <ImageIcon className="h-3.5 w-3.5 mr-2" /> Image (PNG)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()}>
                  <Printer className="h-3.5 w-3.5 mr-2" /> Print
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" onClick={() => setEmailOpen(true)}>
              <Mail className="h-4 w-4" /> Email
            </Button>
          </div>
        </div>

        {row.v2?.certificate_templates ? (
          <ScaledCanvas
            className="relative w-full mx-auto overflow-hidden shadow-2xl"
            ref={certRef}
            style={{ aspectRatio: "1.414 / 1" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: row.v2.certificate_templates.bg_image_url
                  ? `#fdfbf5 url(${row.v2.certificate_templates.bg_image_url}) center/cover no-repeat`
                  : "#fdfbf5",
                colorScheme: "light",
              }}
            />
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

                if (el.type === "image" && el.url) {
                  return (
                    <div
                      key={el.id}
                      className="absolute"
                      style={{
                        left: el.x,
                        top: el.y,
                        width: el.width || 100,
                        height: el.height || 60,
                      }}
                    >
                      <img src={el.url} alt="" className="w-full h-full object-contain" />
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
          </ScaledCanvas>
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
