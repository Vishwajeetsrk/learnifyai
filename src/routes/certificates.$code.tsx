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
      const { data, error } = await supabase.rpc("get_certificate_by_code", { _code: code });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (!row) throw new Error("Certificate not found");
      return row as any;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-violet-100 py-6 sm:py-12 px-4">
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

        <CertificateRender ref={certRef} design={design} ctx={ctx} />

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
