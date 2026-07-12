import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  Check,
  Copy,
  Download,
  ExternalLink,
  ShieldCheck,
  Code,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { generateOpenBadgeV3 } from "@/lib/open-badges.functions";

type Props = {
  open: boolean;
  onClose: () => void;
  studentName: string;
  courseName: string;
  certificateId: string;
  issueDate?: string;
  description?: string;
  skills?: string[];
  verificationUrl: string;
};

export function OpenBadges3Modal({
  open,
  onClose,
  studentName,
  courseName,
  certificateId,
  issueDate,
  description,
  skills = ["AI Engineering", "React 19", "Verifiable Credentials"],
  verificationUrl,
}: Props) {
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const openBadgeJson = generateOpenBadgeV3({
    certificateId,
    studentName,
    courseName,
    description,
    issueDate,
    skills,
    verificationUrl,
  });

  const jsonString = JSON.stringify(openBadgeJson, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopiedJson(true);
    toast.success("Open Badges 3.0 W3C JSON-LD copied!");
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopiedUrl(true);
    toast.success("Verification URL copied!");
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleDownloadBadge = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `open-badge-v3-${certificateId}.json`;
    link.click();
    toast.success("Open Badges 3.0 JSON-LD file downloaded!");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl p-6 bg-card border-border rounded-2xl shadow-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Award className="h-5 w-5 text-amber-500" />
            Open Badges 3.0 W3C Credential
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="badge" className="mt-2 space-y-4">
          <TabsList className="grid grid-cols-2 w-full bg-muted/60 p-1 rounded-xl">
            <TabsTrigger value="badge" className="rounded-lg text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
              Verified Badge Card
            </TabsTrigger>
            <TabsTrigger value="jsonld" className="rounded-lg text-xs font-semibold">
              <Code className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
              W3C JSON-LD Spec
            </TabsTrigger>
          </TabsList>

          <TabsContent value="badge" className="space-y-4 focus-visible:outline-none">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white border border-indigo-500/20 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white tracking-tight">{courseName}</h4>
                    <p className="text-xs text-indigo-300 font-medium">Issued to {studentName}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]"
                >
                  W3C OBv3 Standard
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-slate-300 border-t border-white/10 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Issuer:</span>
                  <span className="font-semibold text-white">Learnify AI Accreditation Board</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Credential Type:</span>
                  <span className="font-mono text-amber-300">VerifiableCredential</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Issued On:</span>
                  <span className="text-white">{issueDate || "Today"}</span>
                </div>
              </div>

              {skills.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Aligned Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
                className="flex-1 text-xs"
              >
                {copiedUrl ? (
                  <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                )}
                Copy Badge Link
              </Button>
              <Button
                size="sm"
                onClick={handleDownloadBadge}
                className="flex-1 text-xs bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download OBv3 JSON
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="jsonld" className="space-y-3 focus-visible:outline-none">
            <div className="relative">
              <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto max-h-80 border border-slate-800">
                {jsonString}
              </pre>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyJson}
                className="absolute top-2 right-2 text-xs text-slate-400 hover:text-white bg-slate-900/80 border border-slate-700"
              >
                {copiedJson ? (
                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1" />
                )}
                {copiedJson ? "Copied" : "Copy JSON"}
              </Button>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                size="sm"
                onClick={handleDownloadBadge}
                className="text-xs bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download JSON-LD
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
