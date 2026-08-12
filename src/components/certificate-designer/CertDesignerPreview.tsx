import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Printer,
  X,
  Image,
  Type,
  QrCode,
  Linkedin,
  Award,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { generateOpenBadgeV3 } from "@/lib/open-badges.functions";
import { LinkedInShareModal } from "./LinkedInShareModal";
import { OpenBadges3Modal } from "./OpenBadges3Modal";

type CanvaTemplate = {
  id: string;
  name: string;
  category: string;
  bg_image_url: string;
  thumbnail_url: string | null;
  fields_json: Record<string, any>;
  theme_colors: Record<string, string>;
};

type PreviewData = Record<string, string>;

type Props = {
  template: CanvaTemplate;
  onClose: () => void;
};

const ALL_FIELDS = [
  { key: "learnifyLogo", label: "Logo URL" },
  { key: "certIdLabel", label: "Cert ID Label" },
  { key: "certId", label: "Cert ID" },
  { key: "title", label: "Title" },
  { key: "subtitle", label: "Subtitle" },
  { key: "certifyText", label: "Certify Text" },
  { key: "studentName", label: "Student Name" },
  { key: "completeText", label: "Complete Text" },
  { key: "courseName", label: "Course Name" },
  { key: "description", label: "Description" },
  { key: "signatureImage", label: "Signature Image URL" },
  { key: "signatureName", label: "Signature Name" },
  { key: "signatureTitle", label: "Signature Title" },
  { key: "signatureRole", label: "Signature Role" },
  { key: "centerLogo", label: "Center Logo URL" },
  { key: "date", label: "Date" },
  { key: "dateLabel", label: "Date Label" },
  { key: "verifyLabel", label: "Verify Label" },
  { key: "badgeAi", label: "Badge: AI" },
  { key: "badgeIndustry", label: "Badge: Industry" },
  { key: "badgeCareer", label: "Badge: Career" },
  { key: "badgeAccess", label: "Badge: Access" },
];

const DEFAULT_PREVIEW: PreviewData = {
  studentName: "Alex Rivera",
  courseName: "AI Fundamentals for Beginners",
  description: "and has demonstrated the knowledge and skills\nrequired to complete the course.",
  date: "May 25, 2026",
  signatureName: "Alex Rivera",
  signatureTitle: "Founder & CEO",
  signatureRole: "Founder & CEO, Learnify AI",
  certId: "LAI-2026-05-00125",
  certIdLabel: "Certificate ID",
  title: "CERTIFICATE",
  subtitle: "OF COMPLETION",
  certifyText: "This is to certify that",
  completeText: "has successfully completed the course",
  dateLabel: "Date of Completion",
  verifyLabel: "Verify Certificate",
  badgeAi: "AI-Powered Learning",
  badgeIndustry: "Industry Relevant",
  badgeCareer: "Career Focused",
  badgeAccess: "Lifetime Access",
  learnifyLogo: "/logo.png",
  signatureImage: "",
  centerLogo: "/logo.png",
};

export function CertDesignerPreview({ template, onClose }: Props) {
  const [data, setData] = useState<PreviewData>(DEFAULT_PREVIEW);
  const [zoom, setZoom] = useState(0.6);
  const [exporting, setExporting] = useState(false);
  const [activeFieldTab, setActiveFieldTab] = useState("all");
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [showOpenBadgesModal, setShowOpenBadgesModal] = useState(false);
  const [bgFailed, setBgFailed] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const fields = template.fields_json;
  const theme = template.theme_colors;
  const verificationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verified-certificates?id=${data.certId}`
      : `https://learnifyaitool.vercel.app/verified-certificates?id=${data.certId}`;

  const handleExportOpenBadge = () => {
    const badge = generateOpenBadgeV3({
      certificateId: data.certId,
      studentName: data.studentName,
      courseName: data.courseName,
      description: data.description,
      issueDate: data.date,
      skills: ["AI", "React", "TypeScript", "Prompt Engineering"],
      verificationUrl,
    });

    const blob = new Blob([JSON.stringify(badge, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `open-badge-v3-${data.certId}.json`;
    link.click();
    toast.success("Open Badges 3.0 W3C Verifiable Credential exported!");
  };

  const handleExportPdf = useCallback(async () => {
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");
      const el = certRef.current;
      if (!el) return;

      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
      pdf.save(
        `certificate-${(data.studentName || "certificate").replace(/\s+/g, "_")}-${Date.now()}.pdf`,
      );
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setExporting(false);
    }
  }, [data.studentName]);

  const handleExportPng = useCallback(async () => {
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const el = certRef.current;
      if (!el) return;

      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const link = document.createElement("a");
      link.download = `certificate-${(data.studentName || "certificate").replace(/\s+/g, "_")}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("PNG export failed:", err);
    } finally {
      setExporting(false);
    }
  }, [data.studentName]);

  const getFieldContent = (key: string): string => {
    const field = fields[key];
    if (!field) return "";
    if (field.type === "image" || field.type === "qr") return "";
    const userValue = data[key];
    if (userValue) return userValue;
    if (field.variable) return data[key] || key;
    return field.text || "";
  };

  const renderField = (key: string) => {
    const field = fields[key];
    if (!field) return null;

    const type = field.type || "text";

    if (type === "image") {
      const src = data[key] || field.src;
      if (!src) return null;
      return (
        <div
          key={key}
          style={{
            position: "absolute",
            left: `${field.x}%`,
            top: `${field.y}%`,
            transform: "translate(-50%, -50%)",
            width: `${field.width || 100}px`,
            height: `${field.height || 50}px`,
            textAlign: field.align || "center",
          }}
        >
          <img
            src={src}
            alt={key}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            crossOrigin="anonymous"
          />
        </div>
      );
    }

    if (type === "qr") {
      return (
        <div
          key={key}
          style={{
            position: "absolute",
            left: `${field.x}%`,
            top: `${field.y}%`,
            transform: "translate(-50%, -50%)",
            width: `${field.width || 80}px`,
            height: `${field.height || 80}px`,
            background: "#ffffff",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "8px",
            color: "#999",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "9px", color: "#0a6e8a", fontWeight: 600 }}>QR Code</div>
        </div>
      );
    }

    return (
      <div
        key={key}
        style={{
          position: "absolute",
          left: `${field.x}%`,
          top: `${field.y}%`,
          transform: "translate(-50%, -50%)",
          fontSize: `${field.fontSize || 14}px`,
          fontFamily: field.fontFamily || "Georgia, serif",
          color: field.color || "#000",
          fontWeight: field.fontWeight || "normal",
          textAlign: field.align || "center",
          letterSpacing: field.letterSpacing || "normal",
          whiteSpace: "pre-line",
          maxWidth: "80%",
          lineHeight: 1.2,
        }}
      >
        {getFieldContent(key)}
      </div>
    );
  };

  const filteredFields =
    activeFieldTab === "all"
      ? ALL_FIELDS
      : activeFieldTab === "images"
        ? ALL_FIELDS.filter((f) => f.key.includes("Image") || f.key.includes("Logo"))
        : ALL_FIELDS.filter((f) => !f.key.includes("Image") && !f.key.includes("Logo"));

  return (
    <>
      <Dialog open onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Certificate Preview: {template.name}
            </DialogTitle>
          </DialogHeader>

          <div className="flex gap-4 px-6">
            <div className="flex-1 overflow-auto max-h-[60vh] bg-gray-100 rounded-lg p-4">
              <div
                ref={certRef}
                style={{
                  width: "1000px",
                  height: "707px",
                  position: "relative",
                  overflow: "hidden",
                  background: theme?.background || "#f5f0e8",
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                }}
              >
                <img
                  src={template.bg_image_url}
                  alt="Certificate Background"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: bgFailed ? "none" : "block",
                  }}
                  crossOrigin="anonymous"
                  onError={() => setBgFailed(true)}
                />
                {bgFailed && (
                  <>
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        inset: 20,
                        border: `3px double ${theme?.accent || "#c9a84c"}66`,
                        borderRadius: 4,
                      }}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 50% 0%, ${theme?.accent || "#c9a84c"}22 0%, transparent 60%)`,
                      }}
                    />
                  </>
                )}
                {Object.keys(fields).map(renderField)}
              </div>
            </div>

            <div className="w-72 space-y-3 shrink-0 pr-4 overflow-y-auto max-h-[60vh]">
              <div className="flex gap-1 mb-2">
                <button
                  onClick={() => setActiveFieldTab("all")}
                  className={`px-2 py-1 text-[10px] rounded ${activeFieldTab === "all" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveFieldTab("text")}
                  className={`px-2 py-1 text-[10px] rounded ${activeFieldTab === "text" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  Text
                </button>
                <button
                  onClick={() => setActiveFieldTab("images")}
                  className={`px-2 py-1 text-[10px] rounded ${activeFieldTab === "images" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  Images
                </button>
              </div>

              {filteredFields.map(({ key, label }) => {
                const field = fields[key];
                if (!field) return null;
                return (
                  <div key={key}>
                    <Label className="text-[10px] text-muted-foreground flex items-center gap-1">
                      {field.type === "image" || field.type === "qr" ? (
                        <Image className="h-3 w-3" />
                      ) : (
                        <Type className="h-3 w-3" />
                      )}
                      {label}
                    </Label>
                    <Input
                      value={data[key] ?? ""}
                      onChange={(e) => setData((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="h-7 text-xs"
                      placeholder={field.variable || field.text || "Value..."}
                    />
                  </div>
                );
              })}

              <div>
                <Label className="text-xs text-muted-foreground">Zoom</Label>
                <input
                  type="range"
                  min={0.2}
                  max={1.5}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 pb-6 pt-4 flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLinkedInModal(true)}
              className="text-[#0A66C2] border-[#0A66C2]/30 hover:bg-[#0A66C2]/10"
            >
              <Linkedin className="h-4 w-4 mr-1.5" /> Add to LinkedIn
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowOpenBadgesModal(true)}>
              <Award className="h-4 w-4 mr-1.5 text-amber-500" /> Open Badges 3.0
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPng} disabled={exporting}>
              <Download className="h-4 w-4 mr-1.5" /> PNG
            </Button>
            <Button size="sm" onClick={handleExportPdf} disabled={exporting}>
              <Download className="h-4 w-4 mr-1.5" /> PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showLinkedInModal && (
        <LinkedInShareModal
          open={showLinkedInModal}
          onClose={() => setShowLinkedInModal(false)}
          studentName={data.studentName}
          courseName={data.courseName}
          certificateId={data.certId}
          issueDate={data.date}
          verificationUrl={verificationUrl}
        />
      )}

      {showOpenBadgesModal && (
        <OpenBadges3Modal
          open={showOpenBadgesModal}
          onClose={() => setShowOpenBadgesModal(false)}
          studentName={data.studentName}
          courseName={data.courseName}
          certificateId={data.certId}
          issueDate={data.date}
          description={data.description}
          verificationUrl={verificationUrl}
        />
      )}
    </>
  );
}
