import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Megaphone, Send, Loader2, Users, Globe, Mail, Sparkles, CheckCircle2, Tag } from "lucide-react";
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
import { toast } from "sonner";
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

export function AnnouncementBroadcast() {
  const sendFn = useServerFn(sendAnnouncement);
  const sendEmailFn = useServerFn(adminSendMarketingCampaign);

  const [activeMode, setActiveMode] = useState<"inapp" | "email">("email");

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

  const handleApplyTemplate = (tmpl: typeof EMAIL_TEMPLATES[number]) => {
    setEmailSubject(tmpl.subject);
    setEmailHeadline(tmpl.headline);
    setEmailHighlight(tmpl.offerHighlight);
    setEmailBody(tmpl.messageBody);
    setEmailCtaText(tmpl.ctaText);
    setEmailCtaUrl(tmpl.ctaUrl);
    toast.success(`Loaded "${tmpl.label}" template`);
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
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <Mail className="h-5 w-5 text-[#347A3D] dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg font-display">User Outreach &amp; Marketing Broadcast</h3>
            <p className="text-xs text-muted-foreground">
              Direct email marketing blasts &amp; in-app announcements to convert learners
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-muted border border-border/60">
          <button
            onClick={() => setActiveMode("email")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === "email"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-[#347A3D]" />
            <span>Direct Email Campaign</span>
          </button>
          <button
            onClick={() => setActiveMode("inapp")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === "inapp"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-rose-500" />
            <span>In-App Announcement</span>
          </button>
        </div>
      </div>

      {activeMode === "email" ? (
        /* EMAIL CAMPAIGN TAB */
        <Card className="p-6 rounded-2xl border shadow-sm space-y-5">
          {/* Quick-Select Offer Templates */}
          <div className="space-y-2">
            <Label className="text-xs font-bold flex items-center gap-1.5 text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-[#347A3D]" /> Quick Pre-Made High-Converting Templates
            </Label>
            <div className="flex flex-wrap gap-2">
              {EMAIL_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-muted/60 hover:bg-muted border border-border/70 text-foreground transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Tag className="w-3 h-3 text-[#347A3D]" />
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
              className="gap-2 bg-[#347A3D] hover:bg-[#245F30] text-white font-semibold text-xs"
            >
              {emailSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {emailSending ? "Dispatching Blast..." : "Send Campaign to All Users"}
            </Button>
          </div>

          {emailResult && (
            <Card className="p-4 rounded-xl border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-bold text-xs text-emerald-700 dark:text-emerald-300">
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
      ) : (
        /* IN-APP ANNOUNCEMENT TAB */
        <Card className="p-6 rounded-2xl border shadow-sm space-y-5">
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
              <Label className="text-xs font-bold">Target Audience</Label>
              <Select value={targetRole} onValueChange={setTargetRole} disabled={sending}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5" /> All Users
                    </div>
                  </SelectItem>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="creators">Creators</SelectItem>
                  <SelectItem value="admins">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSendInApp}
              disabled={sending || !title.trim() || !body.trim()}
              className="gap-2 bg-[#347A3D] hover:bg-[#245F30] text-white"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {sending ? "Sending..." : "Send Announcement"}
            </Button>
          </div>

          {result && (
            <Card className="p-4 rounded-xl border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-bold text-xs text-emerald-700 dark:text-emerald-300">
                    Announcement sent successfully!
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Notified <strong>{result.notifiedCount}</strong> of <strong>{result.totalTarget}</strong> users.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </Card>
      )}
    </div>
  );
}
