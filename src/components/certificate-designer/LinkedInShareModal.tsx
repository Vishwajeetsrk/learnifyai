import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Linkedin, Share2, Copy, Check, ExternalLink, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { generateLinkedInCertUrl } from "@/lib/open-badges.functions";

type Props = {
  open: boolean;
  onClose: () => void;
  studentName: string;
  courseName: string;
  certificateId: string;
  issueDate?: string;
  verificationUrl: string;
};

export function LinkedInShareModal({
  open,
  onClose,
  studentName,
  courseName,
  certificateId,
  issueDate,
  verificationUrl,
}: Props) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const linkedinAddUrl = generateLinkedInCertUrl({
    courseName,
    certificateId,
    issueDate,
    verificationUrl,
  });

  const shareText = `🎓 Proud to announce that I have earned my official certification in "${courseName}" from Learnify AI!\n\nVerify credential: ${verificationUrl}\n\n#LearnifyAI #Certification #${courseName.replace(/\s+/g, "")} #AI #SkillBuilding`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedText(true);
    toast.success("Share text copied to clipboard!");
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopiedUrl(true);
    toast.success("Verification URL copied!");
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg p-6 bg-card border-border rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Linkedin className="h-5 w-5 text-[#0A66C2]" />
            Add & Share Credential
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Section 1: Add to LinkedIn Profile */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                1-Click Add to Profile
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-medium px-2 py-0.5 rounded-full border border-emerald-500/20">
                Verified Badge
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Auto-fill your LinkedIn "Licenses & Certifications" section with course details, organization name, and verification URL.
            </p>
            <a
              href={linkedinAddUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <Linkedin className="h-4 w-4" />
              Add to LinkedIn Profile
              <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-80" />
            </a>
          </div>

          {/* Section 2: Social Post Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Social Post Caption</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyText}
                className="h-7 text-xs text-primary"
              >
                {copiedText ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                {copiedText ? "Copied" : "Copy Post"}
              </Button>
            </div>
            <Textarea
              value={shareText}
              readOnly
              className="text-xs font-sans bg-muted/30 border-border h-24 resize-none"
            />
          </div>

          {/* Section 3: Verification URL */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Public Verification URL</Label>
            <div className="flex gap-2">
              <Input
                value={verificationUrl}
                readOnly
                className="text-xs font-mono bg-muted/30"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyUrl}
                className="h-9 shrink-0 text-xs"
              >
                {copiedUrl ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
