import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  adminListEmailTemplates,
  adminGetEmailTemplate,
  adminSaveEmailTemplate,
  adminSendTestEmail,
} from "@/lib/welcome-email.functions";
import {
  adminSendMarketingCampaign,
  sendAnnouncement,
} from "@/lib/admin-announcements.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Send,
  Eye,
  Code,
  Save,
  Loader2,
  Paperclip,
  Image as ImageIcon,
  Check,
  CheckCircle2,
  Copy,
  Smartphone,
  Monitor,
  Award,
  BookOpen,
  Trophy,
  KeyRound,
  CreditCard,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
  Megaphone,
  Users,
  Tag,
  ShieldCheck,
  FileText,
  AlertCircle,
  Radio,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Pre-Made High-Converting Broadcast Templates ────────────────────────────
interface PreMadeCampaign {
  id: string;
  name: string;
  badge: string;
  icon: string;
  subject: string;
  headline: string;
  offerHighlight: string;
  targetRole: "all" | "students" | "unsubscribed";
  ctaText: string;
  ctaUrl: string;
  messageBody: string;
  attachmentName?: string;
  attachmentUrl?: string;
}

const PRE_MADE_CAMPAIGNS: PreMadeCampaign[] = [
  {
    id: "offer-50",
    name: "50% Off Early Adopter Pro Offer",
    badge: "50% OFF EARLY ADOPTER",
    icon: "🚀",
    subject: "🚀 Unlock 50% Off Learnify Pro — Master Real-World Full-Stack & AI",
    headline: "Supercharge Your Career with 50+ Production Templates & AI Studio",
    offerHighlight: "50% OFF EARLY ADOPTER",
    targetRole: "all",
    ctaText: "Claim 50% Discount Now",
    ctaUrl: "https://www.learnifyai.in/pricing",
    messageBody: `Upgrade to **Learnify AI Pro** today and unlock instant access to our comprehensive Career OS designed for modern high-performance developers.

**What is included in your early access pass:**
- 50+ Full-Stack Production Templates (React 19, Next.js, Node, Tailwind v4)
- Live Sandpack In-Browser Interactive Coding Environments
- AI Interview Studio with Voice Mock Interviews & Real-Time Scoring
- ATS Resume Optimizer & High-DPI Verified Technical Credentials
- Complete SAC 998431 Tax Invoices with itemized 18% GST (CGST 9% + SGST 9%)

Lock in your early adopter pricing before subscriptions adjust to regular rates.`,
    attachmentName: "Learnify_Pro_Curriculum_2026.pdf",
    attachmentUrl: "https://www.learnifyai.in/Learnify_AI_INV-B91D4407.pdf",
  },
  {
    id: "credits-1000",
    name: "1,000 Bonus AI Credits + Advisory Pass",
    badge: "1,000 FREE BONUS CREDITS",
    icon: "⚡",
    subject: "⚡ 1,000 Bonus AI Credits Added + Priority Career Advisory Pass",
    headline: "Your Practice Tokens Have Been Credited — Start Preparing Today",
    offerHighlight: "1,000 BONUS AI CREDITS",
    targetRole: "all",
    ctaText: "Redeem 1,000 Credits in Studio",
    ctaUrl: "https://www.learnifyai.in/studio",
    messageBody: `We've credited **1,000 Bonus AI Tokens** directly to your Learnify AI account so you can dive straight into high-impact practice without delay!

**High-leverage ways to spend your bonus credits:**
- Practice live voice mock interviews with AI Staff Architects & Directors
- Run deep ATS resume scans and generate tailored bullet rewrites
- Benchmark full-stack code against production test suites in Sandpack
- Generate interactive system design blueprints and cloud trade-off analyses

Your credits are ready to spend immediately inside your Career Studio workspace.`,
    attachmentName: "AI_Interview_Scorecard_Rubric.pdf",
    attachmentUrl: "https://www.learnifyai.in/Learnify_AI_INV-B91D4407.pdf",
  },
  {
    id: "studio-launch",
    name: "Live Mock Interview Studio Launch",
    badge: "NEW STUDIO 5.0 LIVE",
    icon: "🎙️",
    subject: "New Feature: AI Mock Interview Studio with Live Speech & Scoring",
    headline: "Practice Real Technical & Behavioral Interviews in Real-Time",
    offerHighlight: "NEW STUDIO 5.0 LIVE",
    targetRole: "all",
    ctaText: "Launch Interview Studio Now →",
    ctaUrl: "https://www.learnifyai.in/career-studio",
    messageBody: `We've just launched our **AI 4.0 Mock Interview Prep Studio** — engineered specifically for developers, engineering leads, and technical product managers.

**Key capabilities in Studio 5.0:**
- **Realistic Human AI Interviewers:** Priya Kapoor (Ex-Google Cloud AI), Vikram Singh (Ex-Amazon AWS), and Anjali Verma (Ex-Meta Recruiting)
- **Real-Time Speech Recognition:** Answer verbally using your microphone or fast text typing
- **Granular Rubric Scoring:** Architectural trade-offs, STAR behavioral framework, and communication precision
- **Target Role Coverage:** Frontend, Backend, Full-Stack, SDE-2, DevOps, and Product Management

Step into the studio today and practice your target role before real hiring loops.`,
    attachmentName: "System_Architecture_Cheatsheet.pdf",
    attachmentUrl: "https://www.learnifyai.in/Learnify_AI_INV-B91D4407.pdf",
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
  {
    id: "att-curriculum",
    name: "Engineering_Career_OS_Syllabus.pdf",
    url: "/preset-sites/macos-portfolio/index.html",
    size: "240 KB",
    type: "application/pdf",
  },
];

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  certificate_issued: <Award className="w-4 h-4 text-emerald-500" />,
  course_enrolled: <BookOpen className="w-4 h-4 text-blue-500" />,
  leaderboard_winner: <Trophy className="w-4 h-4 text-amber-500" />,
  password_reset: <KeyRound className="w-4 h-4 text-purple-500" />,
  subscription_activated: <CreditCard className="w-4 h-4 text-teal-500" />,
  welcome: <Sparkles className="w-4 h-4 text-emerald-400" />,
};

export function EmailTemplatesManager() {
  const [activeTab, setActiveTab] = useState<"templates" | "broadcast">("templates");

  // ─── Platform Templates State ──────────────────────────────────────────────
  const listFn = useServerFn(adminListEmailTemplates);
  const getFn = useServerFn(adminGetEmailTemplate);
  const saveFn = useServerFn(adminSaveEmailTemplate);
  const testFn = useServerFn(adminSendTestEmail);

  type TemplateRow = {
    id: string;
    name: string;
    subject: string;
    description: string | null;
    variables: string[] | null;
    updated_at: string;
  };

  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editHtml, setEditHtml] = useState("");
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [availableVars, setAvailableVars] = useState<string[]>([]);
  const [testEmail, setTestEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [previewMode, setPreviewMode] = useState<"code" | "desktop" | "mobile">("desktop");

  // ─── Media Assets & Attachments State ──────────────────────────────────────
  const [showAssetsModal, setShowAssetsModal] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentItem[]>(DEFAULT_ATTACHMENTS);
  const [newAttName, setNewAttName] = useState("");
  const [newAttUrl, setNewAttUrl] = useState("");

  // ─── User Outreach & Broadcast State ───────────────────────────────────────
  const sendCampaignFn = useServerFn(adminSendMarketingCampaign);
  const sendAnnouncementFn = useServerFn(sendAnnouncement);

  const [channelEmail, setChannelEmail] = useState(true);
  const [channelInApp, setChannelInApp] = useState(true);
  const [campaignSubject, setCampaignSubject] = useState(PRE_MADE_CAMPAIGNS[2].subject);
  const [campaignHeadline, setCampaignHeadline] = useState(PRE_MADE_CAMPAIGNS[2].headline);
  const [campaignOfferPill, setCampaignOfferPill] = useState(PRE_MADE_CAMPAIGNS[2].offerHighlight);
  const [campaignTargetRole, setCampaignTargetRole] = useState<"all" | "students" | "unsubscribed">("all");
  const [campaignBody, setCampaignBody] = useState(PRE_MADE_CAMPAIGNS[2].messageBody);
  const [campaignCtaText, setCampaignCtaText] = useState(PRE_MADE_CAMPAIGNS[2].ctaText);
  const [campaignCtaUrl, setCampaignCtaUrl] = useState(PRE_MADE_CAMPAIGNS[2].ctaUrl);
  const [broadcasting, setBroadcasting] = useState(false);
  const [confirmBroadcastOpen, setConfirmBroadcastOpen] = useState(false);
  const [broadcastPreviewMode, setBroadcastPreviewMode] = useState<"desktop" | "mobile">("desktop");

  // Load platform templates on mount
  useEffect(() => {
    listFn({})
      .then((data: any) => {
        const rows = (data ?? []) as TemplateRow[];
        setTemplates(rows);
        setLoading(false);
        if (rows.length > 0) {
          selectTemplate(rows[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to load email templates:", err);
        setLoading(false);
      });
  }, []);

  async function selectTemplate(id: string) {
    setSelectedId(id);
    try {
      const tpl = (await getFn({ data: { id } })) as any;
      if (tpl) {
        setEditName(tpl.name || "");
        setEditSubject(tpl.subject || "");
        setEditHtml(tpl.html_body || "");
        setEditDesc(tpl.description || "");
        setAvailableVars(tpl.variables || []);
      }
    } catch (e: any) {
      toast.error("Failed to load template content");
    }
  }

  async function handleSaveTemplate() {
    if (!selectedId) return;
    setSaving(true);
    try {
      await saveFn({
        data: {
          id: selectedId,
          name: editName,
          subject: editSubject,
          html_body: editHtml,
          description: editDesc,
        },
      });
      toast.success("Email template successfully saved!");
      const updated = (await listFn({})) as any;
      setTemplates((updated ?? []) as TemplateRow[]);
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleSendTest() {
    if (!selectedId || !testEmail) {
      toast.error("Please enter a destination email address");
      return;
    }
    setTesting(true);
    try {
      const res = await testFn({ data: { templateId: selectedId, to: testEmail } });
      toast.success(`Test email successfully sent via ${res.provider}! Check ${testEmail}`);
    } catch (e: any) {
      toast.error(e?.message ?? "Send test failed");
    } finally {
      setTesting(false);
    }
  }

  function handleInsertVariable(v: string) {
    const token = `{{${v}}}`;
    setEditSubject((prev) => `${prev} ${token}`);
    toast.info(`Appended ${token} to subject line`);
  }

  function handleApplyCampaignTemplate(item: PreMadeCampaign) {
    setCampaignSubject(item.subject);
    setCampaignHeadline(item.headline);
    setCampaignOfferPill(item.offerHighlight);
    setCampaignTargetRole(item.targetRole);
    setCampaignBody(item.messageBody);
    setCampaignCtaText(item.ctaText);
    setCampaignCtaUrl(item.ctaUrl);
    toast.success(`Loaded template: "${item.name}"`);
  }

  async function handleExecuteBroadcast() {
    if (!campaignSubject.trim() || !campaignHeadline.trim() || !campaignBody.trim()) {
      toast.error("Please fill in subject, headline, and message body");
      return;
    }
    if (!channelEmail && !channelInApp) {
      toast.error("Please select at least one delivery channel (Email or In-App)");
      return;
    }

    setBroadcasting(true);
    setConfirmBroadcastOpen(false);

    try {
      let emailResult: any = null;
      let inAppResult: any = null;

      if (channelEmail) {
        emailResult = await sendCampaignFn({
          data: {
            subject: campaignSubject,
            headline: campaignHeadline,
            offerHighlight: campaignOfferPill,
            messageBody: campaignBody,
            ctaText: campaignCtaText,
            ctaUrl: campaignCtaUrl,
            targetRole: campaignTargetRole,
          },
        });
      }

      if (channelInApp) {
        inAppResult = await sendAnnouncementFn({
          data: {
            title: campaignHeadline,
            body: campaignBody.slice(0, 500),
            type: "promo",
            targetRole: campaignTargetRole === "students" ? "students" : "all",
          },
        });
      }

      const emailCount = emailResult?.emailsSent ?? 0;
      const inAppCount = inAppResult?.notifiedCount ?? 0;

      toast.success(
        `Campaign blast dispatched! Sent ${emailCount} emails & notified ${inAppCount} learners.`,
        { duration: 6000 },
      );
    } catch (e: any) {
      toast.error(e?.message ?? "Campaign dispatch failed");
    } finally {
      setBroadcasting(false);
    }
  }

  function handleAddAttachment() {
    if (!newAttName.trim() || !newAttUrl.trim()) {
      toast.error("Please provide both name and URL");
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
    toast.success(`Attached "${item.name}"`);
  }

  function handleRemoveAttachment(id: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
    toast.info("Attachment removed");
  }

  return (
    <div className="flex flex-col h-full bg-background select-none">
      {/* ─── Top Brand Navigation Bar ────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/60 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2">
              Email Templates &amp; Marketing Broadcast
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] py-0 px-2">
                Brand OS v4.0
              </Badge>
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Manage transactional platform notifications and broadcast high-converting marketing campaigns.
            </p>
          </div>
        </div>

        {/* Global Controls: Logo & Attachments */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5 border-border hover:border-primary/50 transition-colors"
            onClick={() => setShowAssetsModal(true)}
          >
            <ImageIcon className="h-3.5 w-3.5 text-primary" />
            Brand Assets &amp; Logo
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5 border-border hover:border-primary/50 transition-colors"
            onClick={() => setShowAttachmentsModal(true)}
          >
            <Paperclip className="h-3.5 w-3.5 text-primary" />
            Attachments ({attachments.length})
          </Button>

          {/* Tab Switcher */}
          <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border">
            <button
              onClick={() => setActiveTab("templates")}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5",
                activeTab === "templates"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Mail className="w-3.5 h-3.5 text-emerald-500" />
              Platform Templates
            </button>
            <button
              onClick={() => setActiveTab("broadcast")}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5",
                activeTab === "broadcast"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Send className="w-3.5 h-3.5 text-primary" />
              Marketing Broadcast
            </button>
          </div>
        </div>
      </div>

      {/* ─── TAB 1: Platform Templates ────────────────────────────────────────── */}
      {activeTab === "templates" && (
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left Sidebar: 6 Templates */}
          <div className="w-64 shrink-0 border-r border-border bg-card/40 flex flex-col">
            <div className="px-4 py-3 border-b border-border bg-muted/20">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Platform Templates ({templates.length})
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-border/60">
              {loading ? (
                <div className="flex items-center justify-center p-8 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : (
                templates.map((tpl) => {
                  const isSelected = selectedId === tpl.id;
                  const icon = TEMPLATE_ICONS[tpl.id] || <Mail className="w-4 h-4 text-primary" />;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => selectTemplate(tpl.id)}
                      className={cn(
                        "w-full text-left px-4 py-3 text-xs transition-colors flex items-start gap-2.5",
                        isSelected
                          ? "bg-primary/10 border-l-4 border-l-primary text-foreground font-semibold"
                          : "hover:bg-muted/40 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <div className="mt-0.5 shrink-0">{icon}</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-foreground truncate">{tpl.name}</div>
                        <div className="text-[10px] font-mono text-muted-foreground truncate">{tpl.id}</div>
                        {tpl.description && (
                          <div className="text-[10px] text-muted-foreground/80 line-clamp-1 mt-0.5">
                            {tpl.description}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Sidebar Footer info */}
            <div className="p-3 border-t border-border bg-muted/20 text-[10px] text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Auto-rendered via Supabase
              </span>
              <span>v4.0</span>
            </div>
          </div>

          {/* Right Editor & Preview Canvas */}
          <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
            {selectedId ? (
              <>
                {/* Header Toolbar */}
                <div className="flex items-center justify-between px-6 py-2.5 border-b border-border bg-card/30 flex-wrap gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge variant="outline" className="font-mono text-xs bg-muted/50">
                      {selectedId}
                    </Badge>
                    <span className="text-sm font-semibold text-foreground truncate">{editName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View mode toggle */}
                    <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border">
                      <button
                        onClick={() => setPreviewMode("desktop")}
                        className={cn(
                          "px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1",
                          previewMode === "desktop"
                            ? "bg-background text-foreground shadow-xs border border-border"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                        title="Desktop Preview (600px)"
                      >
                        <Monitor className="w-3.5 h-3.5" /> Desktop
                      </button>
                      <button
                        onClick={() => setPreviewMode("mobile")}
                        className={cn(
                          "px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1",
                          previewMode === "mobile"
                            ? "bg-background text-foreground shadow-xs border border-border"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                        title="Mobile Preview (375px)"
                      >
                        <Smartphone className="w-3.5 h-3.5" /> Mobile
                      </button>
                      <button
                        onClick={() => setPreviewMode("code")}
                        className={cn(
                          "px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1",
                          previewMode === "code"
                            ? "bg-background text-foreground shadow-xs border border-border"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                        title="HTML Source Editor"
                      >
                        <Code className="w-3.5 h-3.5" /> Source
                      </button>
                    </div>

                    {/* Test sender */}
                    <div className="flex items-center gap-1.5 pl-2 border-l border-border">
                      <Input
                        placeholder="test@email.com"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        className="h-8 text-xs w-44 font-mono"
                        type="email"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleSendTest}
                        disabled={testing || !testEmail}
                        className="h-8 text-xs gap-1"
                      >
                        {testing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                        Send Test
                      </Button>
                    </div>

                    {/* Save Template button */}
                    <Button
                      size="sm"
                      onClick={handleSaveTemplate}
                      disabled={saving}
                      className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                      Save Template
                    </Button>
                  </div>
                </div>

                {/* Subject Line & Dynamic Variable Chips */}
                <div className="px-6 py-3 border-b border-border bg-card/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-primary" /> Subject line
                    </Label>
                    <span className="text-[11px] text-muted-foreground">Click a variable below to insert:</span>
                  </div>

                  <Input
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="font-mono text-sm bg-background border-border"
                    placeholder="Email subject line..."
                  />

                  {/* Variable chips */}
                  {availableVars.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Available Tokens:
                      </span>
                      {availableVars.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => handleInsertVariable(v)}
                          className="inline-flex items-center gap-1 text-[11px] font-mono bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-2 py-0.5 rounded cursor-pointer transition-colors"
                          title={`Insert {{${v}}}`}
                        >
                          <Plus className="w-2.5 h-2.5" />
                          {"{{" + v + "}}"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Main Content: HTML Code Editor OR Real Iframe Preview */}
                <div className="flex-1 overflow-auto bg-muted/20 p-4">
                  {previewMode === "code" ? (
                    <div className="h-full flex flex-col border border-border rounded-xl bg-card overflow-hidden shadow-xs">
                      <div className="px-4 py-2 border-b border-border bg-muted/40 flex items-center justify-between">
                        <span className="text-xs font-mono font-medium text-muted-foreground">
                          HTML Email Template Source (Responsive Table Layout)
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {editHtml.length} characters
                        </span>
                      </div>
                      <Textarea
                        value={editHtml}
                        onChange={(e) => setEditHtml(e.target.value)}
                        className="flex-1 w-full resize-none rounded-none border-0 font-mono text-xs p-4 focus-visible:ring-0 leading-relaxed bg-background"
                        placeholder="<!DOCTYPE html>..."
                        spellCheck={false}
                      />
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div
                        className={cn(
                          "h-full bg-white rounded-2xl shadow-xl border border-border/80 overflow-hidden flex flex-col transition-all duration-300",
                          previewMode === "desktop" ? "w-[620px]" : "w-[375px]",
                        )}
                      >
                        {/* Device Top Bar */}
                        <div className="px-4 py-2 bg-slate-900 text-slate-300 flex items-center justify-between text-[11px] shrink-0 border-b border-slate-800">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                          </div>
                          <span className="font-mono text-[10px] text-slate-400">
                            {previewMode === "desktop" ? "Desktop Client (620px)" : "Mobile Mail (375px)"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">100%</span>
                        </div>

                        {/* Responsive iframe */}
                        <iframe
                          srcDoc={editHtml}
                          title="Live Email Template Preview"
                          className="w-full flex-1 border-0 bg-white"
                          sandbox="allow-same-origin"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                <Mail className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium">Select a platform template from the left list to view or edit</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 2: User Outreach & Marketing Broadcast ──────────────────────── */}
      {activeTab === "broadcast" && (
        <div className="flex-1 overflow-y-auto p-6 bg-muted/10 space-y-6">
          {/* Quick Pre-Made High-Converting Templates Banner */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Quick Pre-Made High-Converting Templates
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  1-Click load battle-tested promotional templates to drive conversions, signups, and upgrades.
                </p>
              </div>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
                3 Production Templates Ready
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRE_MADE_CAMPAIGNS.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => handleApplyCampaignTemplate(tpl)}
                  className="group relative rounded-xl border border-border/80 bg-background/60 hover:border-primary/60 p-4 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{tpl.icon}</span>
                    <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
                      {tpl.badge}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {tpl.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {tpl.headline}
                  </p>
                  <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-primary font-semibold">
                    <span>Click to apply</span>
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Broadcast Composer (Split Grid: Left Form / Right Live Preview) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Form Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-primary" />
                      Campaign Dispatch Parameters
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Configure your message, audience filter, and multimedia assets.
                    </p>
                  </div>

                  {/* Channel Toggles */}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={channelEmail}
                        onChange={(e) => setChannelEmail(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                      />
                      Direct Email Campaign
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={channelInApp}
                        onChange={(e) => setChannelInApp(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                      />
                      In-App Announcement
                    </label>
                  </div>
                </div>

                {/* Target Audience Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-primary" /> Target Audience Filter
                  </Label>
                  <Select
                    value={campaignTargetRole}
                    onValueChange={(val: any) => setCampaignTargetRole(val)}
                  >
                    <SelectTrigger className="w-full bg-background border-border text-xs">
                      <SelectValue placeholder="Select target cohort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        All 55+ Registered Users (Entire Platform Database)
                      </SelectItem>
                      <SelectItem value="students">
                        Active Students &amp; Learners Only
                      </SelectItem>
                      <SelectItem value="unsubscribed">
                        Unsubscribed &amp; Free Users (Conversion Retargeting)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Email Subject Line */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Email Subject Line
                  </Label>
                  <Input
                    value={campaignSubject}
                    onChange={(e) => setCampaignSubject(e.target.value)}
                    className="bg-background border-border text-xs font-medium"
                    placeholder="e.g. New Feature: AI Mock Interview Studio with Live Speech & Scoring"
                  />
                </div>

                {/* 2-col: Banner Headline & Offer Pill */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Email Banner Headline
                    </Label>
                    <Input
                      value={campaignHeadline}
                      onChange={(e) => setCampaignHeadline(e.target.value)}
                      className="bg-background border-border text-xs"
                      placeholder="e.g. Practice Real Technical & Behavioral Interviews"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      <Tag className="w-3 h-3 text-primary" /> Offer Pill / Badge Text
                    </Label>
                    <Input
                      value={campaignOfferPill}
                      onChange={(e) => setCampaignOfferPill(e.target.value)}
                      className="bg-background border-border text-xs font-mono"
                      placeholder="e.g. NEW STUDIO 5.0 LIVE"
                    />
                  </div>
                </div>

                {/* Personalized Message Body */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-foreground">
                      Personalized Message Body (Markdown / Prose)
                    </Label>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Dynamic recipient greeting injected automatically
                    </span>
                  </div>
                  <Textarea
                    value={campaignBody}
                    onChange={(e) => setCampaignBody(e.target.value)}
                    rows={8}
                    className="bg-background border-border font-sans text-xs leading-relaxed"
                    placeholder="Write campaign details, benefits, bullet points..."
                  />
                </div>

                {/* CTA text & CTA URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      CTA Button Label
                    </Label>
                    <Input
                      value={campaignCtaText}
                      onChange={(e) => setCampaignCtaText(e.target.value)}
                      className="bg-background border-border text-xs"
                      placeholder="e.g. Launch Interview Studio Now"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      CTA Destination URL
                    </Label>
                    <Input
                      value={campaignCtaUrl}
                      onChange={(e) => setCampaignCtaUrl(e.target.value)}
                      className="bg-background border-border text-xs font-mono"
                      placeholder="https://www.learnifyai.in/pricing"
                    />
                  </div>
                </div>

                {/* Dispatch Button */}
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Targeting:{" "}
                    <span className="font-semibold text-foreground">
                      {campaignTargetRole === "all"
                        ? "55+ registered users"
                        : campaignTargetRole === "students"
                        ? "Active enrolled students"
                        : "Unsubscribed conversion cohort"}
                    </span>
                  </div>

                  <Button
                    onClick={() => setConfirmBroadcastOpen(true)}
                    disabled={broadcasting}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs px-5 gap-2 shadow-sm"
                  >
                    {broadcasting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Send Campaign Blast
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: Live Responsive Email Card Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-primary" /> Live Email Blast Preview
                </span>
                <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border">
                  <button
                    onClick={() => setBroadcastPreviewMode("desktop")}
                    className={cn(
                      "px-2 py-0.5 text-[11px] font-medium rounded transition-all",
                      broadcastPreviewMode === "desktop"
                        ? "bg-background text-foreground shadow-xs border border-border"
                        : "text-muted-foreground",
                    )}
                  >
                    Desktop
                  </button>
                  <button
                    onClick={() => setBroadcastPreviewMode("mobile")}
                    className={cn(
                      "px-2 py-0.5 text-[11px] font-medium rounded transition-all",
                      broadcastPreviewMode === "mobile"
                        ? "bg-background text-foreground shadow-xs border border-border"
                        : "text-muted-foreground",
                    )}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              {/* Email Card Container */}
              <div
                className={cn(
                  "mx-auto rounded-2xl border border-border/80 bg-white text-slate-900 shadow-lg overflow-hidden transition-all duration-200",
                  broadcastPreviewMode === "desktop" ? "w-full" : "max-w-[340px]",
                )}
              >
                {/* Email Client Header */}
                <div className="px-4 py-2.5 bg-slate-900 text-slate-300 border-b border-slate-800 text-[11px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Subject: {campaignSubject || "Exclusive Platform Announcement"}</span>
                    <span className="text-[10px] text-slate-400">Now</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span>From: <strong>Learnify AI</strong> &lt;support@learnifyai.in&gt;</span>
                  </div>
                </div>

                {/* Brand Banner with official Green Palette */}
                <div className="bg-gradient-to-br from-[#174422] via-[#245F30] to-[#347A3D] text-white p-6 text-center space-y-2.5">
                  <img
                    src="/logo.png"
                    alt="Learnify AI"
                    className="h-8 mx-auto object-contain drop-shadow"
                  />
                  {campaignOfferPill && (
                    <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-widest text-emerald-200 uppercase border border-white/20">
                      {campaignOfferPill}
                    </div>
                  )}
                  <h3 className="text-base font-extrabold tracking-tight text-white leading-snug">
                    {campaignHeadline || "Supercharge Your Engineering Career"}
                  </h3>
                </div>

                {/* Email Body */}
                <div className="p-5 space-y-3.5 text-xs text-slate-700 leading-relaxed bg-white">
                  <p className="font-semibold text-slate-900">
                    Hello, Priya! 👋
                  </p>

                  <div className="whitespace-pre-line text-slate-600">
                    {campaignBody}
                  </div>

                  {/* Attachment Card if present */}
                  {attachments.length > 0 && (
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium text-slate-800 truncate">
                          {attachments[0].name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        Verified
                      </span>
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="pt-2 text-center">
                    <a
                      href={campaignCtaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-2.5 rounded-full bg-[#347A3D] hover:bg-[#245F30] text-white font-bold text-xs shadow-md transition-colors"
                    >
                      {campaignCtaText || "Claim Exclusive Offer"} →
                    </a>
                  </div>
                </div>

                {/* Email Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center space-y-1">
                  <p className="text-[10px] text-slate-400">
                    © {new Date().getFullYear()} Learnify EdTech Pvt. Ltd. · 18% GST (CGST 9% + SGST 9%)
                  </p>
                  <p className="text-[9px] text-slate-400">
                    You received this official notification as a registered user of Learnify AI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            {/* Primary Logo Showcase */}
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
                Signature Brand Color Palette
              </span>
              <div className="grid grid-cols-4 gap-2">
                <div className="p-2.5 rounded-lg border border-border bg-[#347A3D] text-white">
                  <div className="text-[11px] font-bold">Primary Green</div>
                  <div className="text-[10px] font-mono">#347A3D</div>
                </div>
                <div className="p-2.5 rounded-lg border border-border bg-[#245F30] text-white">
                  <div className="text-[11px] font-bold">Dark Green</div>
                  <div className="text-[10px] font-mono">#245F30</div>
                </div>
                <div className="p-2.5 rounded-lg border border-border bg-[#174422] text-white">
                  <div className="text-[11px] font-bold">Deep Green</div>
                  <div className="text-[10px] font-mono">#174422</div>
                </div>
                <div className="p-2.5 rounded-lg border border-border bg-[#FF8A45] text-white">
                  <div className="text-[11px] font-bold">Accent Orange</div>
                  <div className="text-[10px] font-mono">#FF8A45</div>
                </div>
              </div>
            </div>

            {/* Alternate Assets Grid */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Included High-DPI Project &amp; Certificate Visuals
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-lg border border-border bg-background space-y-1">
                  <img src="/certificate 01.png" alt="Certificate" className="w-full aspect-video object-cover rounded" />
                  <div className="text-[10px] font-mono text-muted-foreground truncate">certificate 01.png</div>
                </div>
                <div className="p-2 rounded-lg border border-border bg-background space-y-1">
                  <img src="/previews/macbook-1.gif" alt="Studio IDE" className="w-full aspect-video object-cover rounded" />
                  <div className="text-[10px] font-mono text-muted-foreground truncate">macbook-1.gif</div>
                </div>
                <div className="p-2 rounded-lg border border-border bg-background space-y-1">
                  <img src="/vishwajeet fake sign.png" alt="Digital Signature" className="w-full aspect-video object-contain rounded bg-white p-1" />
                  <div className="text-[10px] font-mono text-muted-foreground truncate">vishwajeet sign.png</div>
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
            {/* List of current attachments */}
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

            {/* Add new attachment input */}
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

      {/* ─── MODAL: Confirmation for Campaign Broadcast ───────────────────────── */}
      <Dialog open={confirmBroadcastOpen} onOpenChange={setConfirmBroadcastOpen}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-500">
              <AlertCircle className="h-5 w-5" />
              Confirm Marketing Broadcast
            </DialogTitle>
            <DialogDescription>
              You are about to dispatch an official platform broadcast campaign.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded-lg border border-border bg-muted/40 space-y-1">
              <div className="font-semibold text-foreground">Campaign: {campaignHeadline}</div>
              <div className="text-muted-foreground">Subject: {campaignSubject}</div>
              <div className="text-muted-foreground">
                Channels: {channelEmail ? "Direct Email" : ""} {channelInApp ? "+ In-App Notification" : ""}
              </div>
              <div className="text-primary font-medium mt-1">
                Target: {campaignTargetRole === "all" ? "All 55+ Platform Users" : campaignTargetRole}
              </div>
            </div>
            <p className="text-muted-foreground text-[11px]">
              This will send live emails and create real notifications in student feeds immediately.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfirmBroadcastOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              onClick={handleExecuteBroadcast}
            >
              Confirm &amp; Blast Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
