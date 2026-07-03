import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Printer, X } from "lucide-react";

type CanvaTemplate = {
  id: string;
  name: string;
  category: string;
  bg_image_url: string;
  thumbnail_url: string | null;
  fields_json: Record<string, any>;
  theme_colors: Record<string, string>;
};

type PreviewData = {
  studentName: string;
  courseName: string;
  description: string;
  date: string;
  signatureName: string;
  signatureTitle: string;
  certId: string;
  badgeText: string;
};

type Props = {
  template: CanvaTemplate;
  onClose: () => void;
};

const DEFAULT_PREVIEW: PreviewData = {
  studentName: "Vishwajeet",
  courseName: "AI Fundamentals for Beginners",
  description: "covering the basics of Artificial Intelligence, Machine Learning, Neural Networks and Real-world Applications.",
  date: "May 25, 2026",
  signatureName: "Vishwajeet S.",
  signatureTitle: "Founder & CEO, Learnify AI",
  certId: "LAI-2026-05-00125",
  badgeText: "AI-Powered Learning  |  Industry Relevant  |  Career Focused  |  Lifetime Access",
};

export function CertDesignerPreview({ template, onClose }: Props) {
  const [data, setData] = useState<PreviewData>(DEFAULT_PREVIEW);
  const [zoom, setZoom] = useState(0.6);
  const [exporting, setExporting] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const fields = template.fields_json;
  const theme = template.theme_colors;

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
      pdf.save(`certificate-${data.studentName.replace(/\s+/g, "_")}-${Date.now()}.pdf`);
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
      link.download = `certificate-${data.studentName.replace(/\s+/g, "_")}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("PNG export failed:", err);
    } finally {
      setExporting(false);
    }
  }, [data.studentName]);

  const renderField = (key: string, value: string) => {
    const field = fields[key];
    if (!field) return null;
    return (
      <div
        key={key}
        style={{
          position: "absolute",
          left: `${field.x}%`,
          top: `${field.y}%`,
          transform: "translate(-50%, -50%)",
          fontSize: `${field.fontSize}px`,
          fontFamily: field.fontFamily || "Georgia",
          color: field.color || "#000",
          fontWeight: field.fontWeight || "normal",
          fontStyle: field.fontStyle || "normal",
          textAlign: "center",
          whiteSpace: "pre-line",
          maxWidth: "80%",
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
    );
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Preview: {template.name}</DialogTitle>
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
                }}
                crossOrigin="anonymous"
              />
              {renderField("studentName", data.studentName)}
              {renderField("courseName", data.courseName)}
              {renderField("description", data.description)}
              {renderField("date", data.date)}
              {renderField("signatureName", data.signatureName)}
              {renderField("signatureTitle", data.signatureTitle)}
              {renderField("certId", data.certId)}
              {renderField("badgeText", data.badgeText)}
            </div>
          </div>

          <div className="w-72 space-y-3 shrink-0 pr-4">
            <Label className="text-sm font-medium">Preview Data</Label>
            {Object.entries({
              studentName: "Student Name",
              courseName: "Course Name",
              description: "Description",
              date: "Date",
              signatureName: "Signature Name",
              signatureTitle: "Signature Title",
              certId: "Certificate ID",
              badgeText: "Badge Text",
            }).map(([key, label]) => (
              <div key={key}>
                <Label className="text-xs text-muted-foreground">{label}</Label>
                <Input
                  value={(data as any)[key]}
                  onChange={(e) => setData((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
            ))}

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

        <DialogFooter className="px-6 pb-6 pt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" /> Close
          </Button>
          <Button variant="outline" onClick={handleExportPng} disabled={exporting}>
            <Download className="h-4 w-4 mr-2" /> Export PNG
          </Button>
          <Button onClick={handleExportPdf} disabled={exporting}>
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
