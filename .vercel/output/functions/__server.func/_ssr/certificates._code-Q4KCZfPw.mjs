import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { Q as QRCode } from "../_libs/qrcode.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as Route$r, u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { I as Input } from "./input-BHvIASyb.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-CV-3vits.mjs";
import { e as emailCertificate } from "./cert.functions-Q4OaKeG8.mjs";
import { j as jsPDF } from "../_libs/jspdf.mjs";
import { h as html2canvas } from "../_libs/html2canvas-pro.mjs";
import { D as DEFAULT_DESIGN, C as CertificateRender, a as CertificateFullPreviewDialog } from "./CertificateFullPreviewDialog-Bqwk9fl-.mjs";
import "../_libs/seroval.mjs";
import { L as LoaderCircle, J as Award, a2 as Maximize2, a3 as Share2, u as Mail, a4 as Printer, a5 as Download } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "fs";
import "../_libs/dijkstrajs.mjs";
import "../_libs/pngjs.mjs";
import "zlib";
import "assert";
import "buffer";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./client.server-BbcUHF3e.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "./createSsrRpc-BR3wbl1z.mjs";
import "./server-BLOOEPZP.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-BVm8xUae.mjs";
import "path";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/dompurify.mjs";
import "../_libs/canvg.mjs";
import "../_libs/core-js.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/raf.mjs";
import "../_libs/performance-now.mjs";
import "../_libs/rgbcolor.mjs";
import "../_libs/svg-pathdata.mjs";
import "../_libs/stackblur-canvas.mjs";
async function downloadElementAsPdf(el, filename) {
  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false
  });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pageW / canvas.width, pageH / canvas.height);
  const w = canvas.width * ratio;
  const h = canvas.height * ratio;
  const x = (pageW - w) / 2;
  const y = (pageH - h) / 2;
  pdf.addImage(imgData, "PNG", x, y, w, h);
  pdf.save(filename);
}
function CertificatePage() {
  const {
    code
  } = Route$r.useParams();
  const {
    user
  } = useAuth();
  const certRef = reactExports.useRef(null);
  const [qrDataUrl, setQrDataUrl] = reactExports.useState("");
  const [emailOpen, setEmailOpen] = reactExports.useState(false);
  const [emailTo, setEmailTo] = reactExports.useState("");
  const [sending, setSending] = reactExports.useState(false);
  const [downloading, setDownloading] = reactExports.useState(false);
  const [fullPreviewOpen, setFullPreviewOpen] = reactExports.useState(false);
  const sendEmail = useServerFn(emailCertificate);
  const q = useQuery({
    queryKey: ["cert", code],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.rpc("get_certificate_by_code", {
        _code: code
      });
      if (error) throw error;
      const row2 = Array.isArray(data) ? data[0] : data;
      if (!row2) throw new Error("Certificate not found");
      return row2;
    }
  });
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    const url = window.location.origin + `/certificates/${code}`;
    QRCode.toDataURL(url, {
      margin: 1,
      width: 220,
      color: {
        dark: "#0f1b3d",
        light: "#ffffff"
      }
    }).then(setQrDataUrl).catch(() => setQrDataUrl(""));
  }, [code]);
  reactExports.useEffect(() => {
    if (user?.email) setEmailTo(user.email);
  }, [user]);
  if (q.isLoading) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-h-screen grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-6 w-6 animate-spin" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
      lineNumber: 67,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
      lineNumber: 66,
      columnNumber: 12
    }, this);
  }
  if (q.error || !q.data) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-h-screen grid place-items-center p-10 text-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Award, { className: "h-10 w-10 mx-auto text-muted-foreground" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
        lineNumber: 73,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-4 text-sm text-muted-foreground", children: "Certificate not found." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
        lineNumber: 74,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/", className: "text-primary underline text-sm mt-2 inline-block", children: "Home" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
        lineNumber: 75,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
      lineNumber: 72,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
      lineNumber: 71,
      columnNumber: 12
    }, this);
  }
  const row = q.data;
  const design = row.design_snapshot && typeof row.design_snapshot === "object" ? {
    ...DEFAULT_DESIGN,
    ...row.design_snapshot
  } : DEFAULT_DESIGN;
  const learnerName = row.recipient_name || row.learner_name || row.learner_email?.split("@")[0] || "Learner";
  const issueDate = format(new Date(row.issued_at), "dd MMM yyyy");
  const verifyUrl = typeof window !== "undefined" ? `${window.location.origin}/certificates/${row.code}` : "";
  const ctx = {
    name: learnerName,
    course: row.course_title ?? "Learnify AI Program",
    date: issueDate,
    role: row.role_title ?? "",
    from: row.date_from ? format(new Date(row.date_from), "dd MMM yyyy") : "",
    to: row.date_to ? format(new Date(row.date_to), "dd MMM yyyy") : issueDate,
    instructor: row.course_instructor ?? void 0,
    code: row.code,
    score: row.score,
    total: row.total,
    qrDataUrl
  };
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({
        url: verifyUrl,
        title: `Certificate — ${row.course_title ?? "Learnify"}`
      });
      else {
        await navigator.clipboard.writeText(verifyUrl);
        toast.success("Link copied");
      }
    } catch {
    }
  };
  const handleDownloadPdf = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      await downloadElementAsPdf(certRef.current, `certificate-${row.code}.pdf`);
      toast.success("PDF downloaded");
    } catch (e) {
      toast.error(e?.message ?? "Download failed");
    } finally {
      setDownloading(false);
    }
  };
  const handleEmail = async () => {
    if (!emailTo) return toast.error("Enter an email");
    setSending(true);
    try {
      await sendEmail({
        data: {
          code: row.code,
          to: emailTo
        }
      });
      toast.success(`Certificate sent to ${emailTo}`);
      setEmailOpen(false);
    } catch (e) {
      toast.error(e?.message ?? "Email failed");
    } finally {
      setSending(false);
    }
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-violet-100 py-6 sm:py-12 px-4", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between gap-2 mb-4 print:hidden flex-wrap", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/", className: "text-sm text-muted-foreground hover:text-foreground", children: "← Home" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
          lineNumber: 146,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => setFullPreviewOpen(true), children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Maximize2, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
              lineNumber: 151,
              columnNumber: 15
            }, this),
            " Expand"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
            lineNumber: 150,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: share, children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Share2, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
              lineNumber: 154,
              columnNumber: 15
            }, this),
            " Share"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
            lineNumber: 153,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => setEmailOpen(true), children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Mail, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
              lineNumber: 157,
              columnNumber: 15
            }, this),
            " Email"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
            lineNumber: 156,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => window.print(), children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Printer, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
              lineNumber: 160,
              columnNumber: 15
            }, this),
            " Print"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
            lineNumber: 159,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", onClick: handleDownloadPdf, disabled: downloading, children: [
            downloading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
              lineNumber: 163,
              columnNumber: 30
            }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Download, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
              lineNumber: 163,
              columnNumber: 77
            }, this),
            " ",
            "PDF"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
            lineNumber: 162,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
          lineNumber: 149,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
        lineNumber: 145,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CertificateRender, { ref: certRef, design, ctx }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
        lineNumber: 169,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-4 text-center text-[11px] text-muted-foreground print:hidden", children: [
        "Verify at ",
        typeof window !== "undefined" ? window.location.host : "learnify.ai",
        "/certificates/",
        row.code
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
        lineNumber: 171,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
      lineNumber: 144,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open: emailOpen, onOpenChange: setEmailOpen, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { children: "Email this certificate" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
          lineNumber: 180,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: "Send a verified link of this certificate to any email address." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
          lineNumber: 181,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
        lineNumber: 179,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "email", value: emailTo, onChange: (e) => setEmailTo(e.target.value), placeholder: "recipient@email.com" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
        lineNumber: 185,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: () => setEmailOpen(false), disabled: sending, children: "Cancel" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
          lineNumber: 187,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: handleEmail, disabled: sending, children: [
          sending ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
            lineNumber: 191,
            columnNumber: 26
          }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Mail, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
            lineNumber: 191,
            columnNumber: 73
          }, this),
          " ",
          "Send"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
          lineNumber: 190,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
        lineNumber: 186,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
      lineNumber: 178,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
      lineNumber: 177,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CertificateFullPreviewDialog, { open: fullPreviewOpen, onOpenChange: setFullPreviewOpen, design, ctx, title: `${row.course_title ?? "Certificate"} — ${learnerName}` }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
      lineNumber: 198,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("style", { children: `
        @media print {
          body { background: white !important; }
          @page { size: A4 landscape; margin: 10mm; }
        }
      ` }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
      lineNumber: 200,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/certificates.$code.tsx?tsr-split=component",
    lineNumber: 143,
    columnNumber: 10
  }, this);
}
export {
  CertificatePage as component
};
