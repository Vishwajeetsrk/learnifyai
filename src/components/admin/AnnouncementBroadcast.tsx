import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Megaphone,
  Send,
  Loader2,
  Users,
  Globe,
  Mail,
  Sparkles,
  CheckCircle2,
  Tag,
  Paperclip,
  Image as ImageIcon,
  Copy,
  FileText,
  Plus,
  Trash2,
  Eye,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { sendAnnouncement, adminSendMarketingCampaign } from "@/lib/admin-announcements.functions";

const EMAIL_TEMPLATES = [
  {
    id: "early_50",
    label: "🚀 50% Off Early Adopter Pro Offer",
    subject: "Special Invitation: Unlock Pro Career OS at 50% Off (Limited Time)",
    headline: "Fast-Track Your Engineering Career with Learnify Pro",
    offerHighlight: "50% OFF · ₹249/MO LAUNCH OFFER",
    messageBody: `We noticed you've been exploring Learnify AI! As one of our first 55 foundation members, we want to give you an exclusive early-adopter advantage.

Upgrade today to unlock unlimited access to our 10-Role AI Coaching Agent Studio, Live Voice Mock Interview Simulator, 91 Verified Engineering Roadmaps, and ATS Resume Scorer for just ₹249/mo (regular ₹499/mo).

Your entire subscription includes 18% GST (SAC 998431) with tax invoices available for reimbursement.`,
    ctaText: "Claim 50% Off Pro Now",
    ctaUrl: "https://www.learnifyai.in/pricing?coupon=EARLY50",
  },
  {
    id: "bonus_credits",
    label: "⚡ 1,000 Bonus AI Credits + Advisory Pass",
    subject: "Exclusive: 1,000 Bonus AI Credits + 1:1 Architecture Review",
    headline: "Level Up with 1,000 Bonus Credits & Staff Mentors",
    offerHighlight: "BONUS 1,000 CREDITS + ADVISORY",
    messageBody: `Ready to master system design and crack senior tech interviews?

Subscribe to Learnify Career OS this week and receive an instant bonus of 1,000 AI Credits plus a priority 1:1 advisory review pass with our Staff & Principal Engineers.

Whether you're targeting FAANG, top startups, or high-growth remote roles, our interview studio and live sandpack IDE give you an unfair advantage.`,
    ctaText: "Unlock Bonus Credits & Pro",
    ctaUrl: "https://www.learnifyai.in/pricing?bonus=CREDITS1000",
  },
  {
    id: "voice_studio",
    label: "🎙️ Live Mock Interview Studio Launch",
    subject: "New Feature: AI Mock Interview Studio with Live Speech & Scoring",
    headline: "Practice Real Technical & Behavioral Interviews in Real-Time",
    offerHighlight: "NEW STUDIO 5.0 LIVE",
    messageBody: `We've just launched our AI 4.0 Mock Interview Prep Studio with real-time speech recognition, STAR behavioral analysis, and instant scoring!

Practice questions tailored to your exact target role (Frontend, Backend, System Architect, ML, Product Manager) with realistic AI interviewers.

Join our community of engineers landing high-CTC roles. Activate your membership today.`,
    ctaText: "Start Mock Interview Prep",
    ctaUrl: "https://www.learnifyai.in/career-studio",
  },
];

interface AttachmentItem {
  id: string;
  name: string;
  url: string;
  size?: string;
  type: string;
}

const DEFAULT_ATTACHMENTS: AttachmentItem[] = [
  {
    id: "att-logo",
    name: "Learnify_AI_Logo_Master.png",
    url: "/logo.png",
    size: "45 KB",
    type: "image/png",
  },
  {
    id: "att-inv",
    name: "Official_Tax_Invoice_Sample.pdf",
    url: "https://www.learnifyai.in/Learnify_AI_INV-B91D4407.pdf",
    size: "182 KB",
    type: "application/pdf",
  },
];

export function AnnouncementBroadcast() {
  const sendFn = useServerFn(sendAnnouncement);
  const sendEmailFn = useServerFn(adminSendMarketingCampaign);

  const [activeMode, setActiveMode] = useState<"email" | "inapp">("email");

  // In-App State
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<string>("info");
  const [targetRole, setTargetRole] = useState<string>("all");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ notifiedCount: number; totalTarget: number } | null>(null);

  // Email Campaign State
  const [emailSubject, setEmailSubject] = useState(EMAIL_TEMPLATES[0].subject);
  const [emailHeadline, setEmailHeadline] = useState(EMAIL_TEMPLATES[0].headline);
  const [emailHighlight, setEmailHighlight] = useState(EMAIL_TEMPLATES[0].offerHighlight);
  const [emailBody, setEmailBody] = useState(EMAIL_TEMPLATES[0].messageBody);
  const [emailCtaText, setEmailCtaText] = useState(EMAIL_TEMPLATES[0].ctaText);
  const [emailCtaUrl, setEmailCtaUrl] = useState(EMAIL_TEMPLATES[0].ctaUrl);
  const [emailTarget, setEmailTarget] = useState<"all" | "students" | "unsubscribed">("all");
  const [emailSending, setEmailSending] = useState(false);
  const [emailResult, setEmailResult] = useState<{ emailsSent: number; totalUsers: number } | null>(null);

  // Brand Assets & Attachments
  const [showAssetsModal, setShowAssetsModal] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentItem[]>(DEFAULT_ATTACHMENTS);
  const [newAttName, setNewAttName] = useState("");
  const [newAttUrl, setNewAttUrl] = useState("");

  const handleApplyTemplate = (tmpl: typeof EMAIL_TEMPLATES[number]) => {
    setEmailSubject(tmpl.subject);
    setEmailHeadline(tmpl.headline);
    setEmailHighlight(tmpl.offerHighlight);
    setEmailBody(tmpl.messageBody);
    setEmailCtaText(tmpl.ctaText);
    setEmailCtaUrl(tmpl.ctaUrl);
    toast.success(`Loaded "${tmpl.label}" template`);
  };

  const handleAddAttachment = () => {
    if (!newAttName.trim() || !newAttUrl.trim()) {
      toast.error("Please enter both file name and URL");
      return;
    }
    const item: AttachmentItem = {
      id: `att-${Date.now()}`,
      name: newAttName.trim(),
      url: newAttUrl.trim(),
      size: "Custom",
      type: newAttUrl.endsWith(".pdf") ? "application/pdf" : "image/png",
    };
    setAttachments((prev) => [...prev, item]);
    setNewAttName("");
    setNewAttUrl("");
    toast.success(`Added attachment "${item.name}"`);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
    toast.info("Attachment removed");
  };

  const handleSendInApp = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error("Title and body are required");
      return;
    }

    setSending(true);
    setResult(null);
    try {
      const res = await sendFn({
        data: {
          title: title.trim(),
          body: body.trim(),
          type: type as any,
          targetRole: targetRole as any,
        },
      });
      if (res.success) {
        setResult({ notifiedCount: res.notifiedCount ?? 0, totalTarget: res.totalTarget ?? 0 });
        toast.success(`Announcement sent to ${res.notifiedCount} users!`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send announcement");
    } finally {
      setSending(false);
    }
  };

  const handleSendEmailCampaign = async () => {
    if (!emailSubject.trim() || !emailHeadline.trim() || !emailBody.trim()) {
      toast.error("Subject, headline, and message body are required");
      return;
    }

    if (!confirm(`Are you sure you want to broadcast this marketing email to all targeted users?`)) {
      return;
    }

    setEmailSending(true);
    setEmailResult(null);
    try {
      const res = await sendEmailFn({
        data: {
          subject: emailSubject.trim(),
          headline: emailHeadline.trim(),
          offerHighlight: emailHighlight.trim(),
          messageBody: emailBody.trim(),
          ctaText: emailCtaText.trim(),
          ctaUrl: emailCtaUrl.trim(),
          targetRole: emailTarget,
        },
      });
      if (res.success) {
        setEmailResult({ emailsSent: res.emailsSent, totalUsers: res.totalUsers });
        toast.success(`Marketing campaign dispatched! ${res.emailsSent} emails sent.`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to dispatch email campaign");
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header with Brand Navigation & Media Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-primary">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg font-display flex items-center gap-2">
              Announcements &amp; Outreach
              <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                Learnify AI 4.0
              </Badge>
            </h3>
            <p className="text-xs text-muted-foreground">
              Direct email marketing blasts &amp; in-app announcements to convert learners
            </p>
          </div>
        </div>

        {/* Global Controls: Logo & Attachments + Mode Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5"
            onClick={() => setShowAssetsModal(true)}
          >
            <ImageIcon className="h-3.5 w-3.5 text-primary" />
            Brand Assets &amp; Logo
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5"
            onClick={() => setShowAttachmentsModal(true)}
          >
            <Paperclip className="h-3.5 w-3.5 text-primary" />
            Attachments ({attachments.length})
          </Button>

          {/* Mode Selector Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-muted border border-border/60">
            <button
              onClick={() => setActiveMode("email")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer",
                activeMode === "email"
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>Direct Email Campaign</span>
            </button>
            <button
              onClick={() => setActiveMode("inapp")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer",
                activeMode === "inapp"
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Megaphone className="w-3.5 h-3.5 text-rose-500" />
              <span>In-App Announcement</span>
            </button>
          </div>
        </div>
      </div>

      {activeMode === "email" ? (
        /* EMAIL CAMPAIGN TAB (Split Grid: Form Left / Live Card Preview Right) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-5">
            <Card className="p-6 rounded-2xl border shadow-xs space-y-5">
              {/* Quick-Select Offer Templates */}
              <div className="space-y-2">
                <Label className="text-xs font-bold flex items-center gap-1.5 text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Quick Pre-Made High-Converting Templates
                </Label>
                <div className="flex flex-wrap gap-2">
                  {EMAIL_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-muted/60 hover:bg-muted border border-border/70 text-foreground transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Tag className="w-3 h-3 text-primary" />
                      <span>{tmpl.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold">Email Subject Line</Label>
                  <Input
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Subject of the email"
                    className="text-xs"
                    disabled={emailSending}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold">Email Banner Headline</Label>
                  <Input
                    value={emailHeadline}
                    onChange={(e) => setEmailHeadline(e.target.value)}
                    placeholder="Big header title in email"
                    className="text-xs"
                    disabled={emailSending}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold">Offer Pill / Badge Text</Label>
                  <Input
                    value={emailHighlight}
                    onChange={(e) => setEmailHighlight(e.target.value)}
                    placeholder="e.g. 50% OFF · EXCLUSIVE"
                    className="text-xs"
                    disabled={emailSending}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold">Target Audience Filter</Label>
                  <Select value={emailTarget} onValueChange={(v: any) => setEmailTarget(v)} disabled={emailSending}>
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All 55+ Registered Users</SelectItem>
                      <SelectItem value="unsubscribed">Free / Unsubscribed Users Only</SelectItem>
                      <SelectItem value="students">Students with Active Profiles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold">Personalized Message Body (Markdown / Prose)</Label>
                <Textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="min-h-[160px] text-xs font-sans leading-relaxed"
                  placeholder="Write the conversion pitch..."
                  disabled={emailSending}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold">Call To Action (CTA) Button Text</Label>
                  <Input
                    value={emailCtaText}
                    onChange={(e) => setEmailCtaText(e.target.value)}
                    placeholder="Button label"
                    className="text-xs"
                    disabled={emailSending}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold">Destination URL</Label>
                  <Input
                    value={emailCtaUrl}
                    onChange={(e) => setEmailCtaUrl(e.target.value)}
                    placeholder="https://www.learnifyai.in/pricing"
                    className="text-xs"
                    disabled={emailSending}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  Emails dispatched directly via Resend / Verified SMTP with 18% GST tax receipt notice.
                </div>
                <Button
                  onClick={handleSendEmailCampaign}
                  disabled={emailSending || !emailSubject.trim() || !emailBody.trim()}
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs"
                >
                  {emailSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {emailSending ? "Dispatching Blast..." : "Send Campaign to All Users"}
                </Button>
              </div>

              {emailResult && (
                <Card className="p-4 rounded-xl border bg-primary/5 border-primary/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-bold text-xs text-foreground">
                        Campaign Broadcast Complete!
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Successfully delivered to <strong>{emailResult.emailsSent}</strong> of <strong>{emailResult.totalUsers}</strong> targeted users.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </Card>
          </div>

          {/* Right Column: Live Email Card Preview */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-primary" /> Live Email Blast Preview
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">Learnify AI Brand</span>
            </div>

            <div className="rounded-2xl border border-border/80 bg-white text-slate-900 shadow-md overflow-hidden">
              {/* Header bar */}
              <div className="px-4 py-2.5 bg-slate-900 text-slate-300 border-b border-slate-800 text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Subject: {emailSubject}</span>
                  <span className="text-[10px] text-slate-400">Now</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  From: <strong>Learnify AI</strong> &lt;support@learnifyai.in&gt;
                </div>
              </div>

              {/* Brand Banner */}
              <div className="bg-gradient-to-br from-[#0A1128] via-[#1D4ED8] to-[#00A6FB] text-white p-6 text-center space-y-2.5">
                <img src="/logo.png" alt="Learnify AI" className="h-8 mx-auto object-contain drop-shadow" />
                {emailHighlight && (
                  <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-widest text-cyan-200 uppercase border border-white/20">
                    {emailHighlight}
                  </div>
                )}
                <h3 className="text-base font-extrabold tracking-tight text-white leading-snug">
                  {emailHeadline}
                </h3>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3.5 text-xs text-slate-700 leading-relaxed bg-white">
                <p className="font-semibold text-slate-900">Hello, Priya! 👋</p>
                <div className="whitespace-pre-line text-slate-600">{emailBody}</div>

                {attachments.length > 0 && (
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-medium text-slate-800 truncate">{attachments[0].name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Verified</span>
                  </div>
                )}

                <div className="pt-2 text-center">
                  <a
                    href={emailCtaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2.5 rounded-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-bold text-xs shadow-md transition-colors"
                  >
                    {emailCtaText} &rarr;
                  </a>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400">
                &copy; {new Date().getFullYear()} Learnify EdTech Pvt. Ltd. &bull; 18% GST (SAC 998431)
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* IN-APP ANNOUNCEMENT TAB */
        <Card className="p-6 rounded-2xl border shadow-xs space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-bold">Title</Label>
            <Input
              placeholder="e.g. Platform Maintenance Tonight"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm"
              disabled={sending}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold">Body</Label>
            <Textarea
              placeholder="Write your announcement message..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[140px] text-sm"
              disabled={sending}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold">Type</Label>
              <Select value={type} onValueChange={setType} disabled={sending}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="promo">Promotion</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold">Target Role</Label>
              <Select value={targetRole} onValueChange={setTargetRole} disabled={sending}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="students">Students Only</SelectItem>
                  <SelectItem value="creators">Creators Only</SelectItem>
                  <SelectItem value="admins">Admins Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              Notifications appear in targeted users' notification feeds immediately.
            </div>
            <Button
              onClick={handleSendInApp}
              disabled={sending || !title.trim() || !body.trim()}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {sending ? "Sending..." : "Send Announcement"}
            </Button>
          </div>

          {result && (
            <Card className="p-4 rounded-xl border bg-primary/5 border-primary/20">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-bold text-xs text-foreground">Announcement Dispatched!</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Notified <strong>{result.notifiedCount}</strong> of <strong>{result.totalTarget}</strong> eligible users.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </Card>
      )}

      {/* ─── MODAL: Brand Assets & Logo Viewer ─────────────────────────────────── */}
      <Dialog open={showAssetsModal} onOpenChange={setShowAssetsModal}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              Brand Assets &amp; Official Logo
            </DialogTitle>
            <DialogDescription>
              Official Learnify AI graphic assets, logo lockups, and design tokens for email &amp; outreach.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-6 rounded-xl border border-border bg-muted/30 flex flex-col items-center justify-center gap-3">
              <div className="p-4 rounded-xl bg-white/90 border border-border/60 shadow-xs flex items-center justify-center">
                <img src="/logo.png" alt="Learnify AI Master Logo" className="h-10 object-contain" />
              </div>
              <div className="text-center space-y-1">
                <div className="text-xs font-bold text-foreground">Official Master Logo (`/logo.png`)</div>
                <div className="text-[11px] text-muted-foreground font-mono">Format: PNG • Aspect: Horizontal Lockup</div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1.5"
                onClick={() => {
                  navigator.clipboard.writeText("https://www.learnifyai.in/logo.png");
                  toast.success("Copied live logo URL to clipboard!");
                }}
              >
                <Copy className="w-3 h-3" /> Copy Live Logo URL
              </Button>
            </div>

            {/* Brand Color Tokens Palette */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Official Learnify AI Brand Color Palette
              </span>
              <div className="grid grid-cols-4 gap-2">
                <div className="p-2.5 rounded-lg border border-border bg-[#0A1128] text-white">
                  <div className="text-[11px] font-bold">Midnight Navy</div>
                  <div className="text-[10px] font-mono">#0A1128</div>
                </div>
                <div className="p-2.5 rounded-lg border border-border bg-[#1D4ED8] text-white">
                  <div className="text-[11px] font-bold">Electric Blue</div>
                  <div className="text-[10px] font-mono">#1D4ED8</div>
                </div>
                <div className="p-2.5 rounded-lg border border-border bg-[#00A6FB] text-white">
                  <div className="text-[11px] font-bold">Cyan Glow</div>
                  <div className="text-[10px] font-mono">#00A6FB</div>
                </div>
                <div className="p-2.5 rounded-lg border border-border bg-[#FF8A45] text-white">
                  <div className="text-[11px] font-bold">Accent Coral</div>
                  <div className="text-[10px] font-mono">#FF8A45</div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button size="sm" onClick={() => setShowAssetsModal(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── MODAL: Attachments Manager ────────────────────────────────────────── */}
      <Dialog open={showAttachmentsModal} onOpenChange={setShowAttachmentsModal}>
        <DialogContent className="max-w-xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Paperclip className="h-5 w-5 text-primary" />
              Manage Email Attachments &amp; Resources
            </DialogTitle>
            <DialogDescription>
              Attach PDFs, invoices, course materials, or resource links to broadcast emails.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-foreground">Current Attachments</span>
              {attachments.length === 0 ? (
                <div className="text-xs text-muted-foreground p-4 text-center border border-dashed rounded-lg">
                  No attachments added yet.
                </div>
              ) : (
                <div className="divide-y divide-border border rounded-xl overflow-hidden bg-background">
                  {attachments.map((att) => (
                    <div key={att.id} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-primary shrink-0" />
                        <div className="min-w-0">
                          <div className="font-semibold text-foreground truncate">{att.name}</div>
                          <div className="text-[10px] font-mono text-muted-foreground truncate">{att.url}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {att.size || "Resource"}
                        </Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                          onClick={() => handleRemoveAttachment(att.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl border border-border bg-muted/30 space-y-2.5">
              <span className="text-xs font-semibold text-foreground">Add New Attachment Link</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  placeholder="File name (e.g. Syllabus_2026.pdf)"
                  value={newAttName}
                  onChange={(e) => setNewAttName(e.target.value)}
                  className="h-8 text-xs bg-background"
                />
                <Input
                  placeholder="URL (e.g. /Learnify_AI_INV.pdf)"
                  value={newAttUrl}
                  onChange={(e) => setNewAttUrl(e.target.value)}
                  className="h-8 text-xs bg-background"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddAttachment}
                className="h-8 text-xs w-full gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Attachment
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button size="sm" onClick={() => setShowAttachmentsModal(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
