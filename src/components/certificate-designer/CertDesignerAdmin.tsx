import { useState, useRef, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  listCanvaTemplates,
  saveCanvaTemplate,
  deleteCanvaTemplate,
  seedAllTemplates,
  updateAllTemplateFields,
  DEFAULT_FIELDS,
} from "@/lib/canva-cert.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Award,
  LayoutTemplate,
  Palette,
  ShieldCheck,
  CheckCircle2,
  Wallet,
  Users,
  Mail,
  BarChart3,
  Sparkles,
  ShoppingBag,
  Settings,
  Search,
  Bell,
  HelpCircle,
  Plus,
  ChevronDown,
  ArrowUpRight,
  Download,
  Share2,
  QrCode,
  Linkedin,
  Eye,
  Copy,
  Heart,
  MoreVertical,
  Filter,
  Grid,
  List,
  Upload,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Check,
  Crown,
  BookOpen,
  FileText,
  Clock,
  Zap,
} from "lucide-react";
import { CertDesignerPreview } from "./CertDesignerPreview";
import { CertDesignerEditor } from "./CertDesignerEditor";
import { LinkedInShareModal } from "./LinkedInShareModal";

type CanvaTemplate = {
  id: string;
  name: string;
  category: string;
  bg_image_url: string;
  thumbnail_url: string | null;
  fields_json: any;
  theme_colors: any;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

const CATEGORIES = [
  "All Templates",
  "Corporate",
  "University",
  "Technology",
  "AI & ML",
  "Workshop",
  "Bootcamp",
  "Coaching",
  "Internship",
  "Webinar",
  "Premium",
];

const MOCK_ACTIVITIES = [
  {
    id: "1",
    type: "generated",
    title: "React Development Course Certificate generated",
    meta: "Certificate ID: LAI-2026-05-00248",
    time: "2 min ago",
    icon: CheckCircle2,
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    id: "2",
    type: "verified",
    title: "Python Programming Certificate verified",
    meta: "Verified by: John D. from New Delhi, India",
    time: "15 min ago",
    icon: ShieldCheck,
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    id: "3",
    type: "bulk",
    title: "25 Certificates issued in bulk",
    meta: "Course: Web Development Bootcamp",
    time: "1 hour ago",
    icon: Users,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    id: "4",
    type: "linkedin",
    title: "12 learners shared certificates on LinkedIn",
    meta: "Great job! Your certificates are being recognized",
    time: "2 hours ago",
    icon: Linkedin,
    color: "text-[#0A66C2] bg-[#0A66C2]/10",
  },
  {
    id: "5",
    type: "download",
    title: "50 Certificates downloaded",
    meta: "Across 8 different courses",
    time: "3 hours ago",
    icon: Download,
    color: "text-rose-500 bg-rose-500/10",
  },
];

const MOCK_TOP_COURSES = [
  { name: "Web Development Bootcamp", count: 1248, percent: 25, color: "bg-indigo-600" },
  { name: "Python Programming Masterclass", count: 1105, percent: 22, color: "bg-blue-500" },
  { name: "AI & ML Fundamentals", count: 982, percent: 19, color: "bg-emerald-500" },
  { name: "UI/UX Design Principles", count: 756, percent: 15, color: "bg-purple-500" },
  { name: "Data Science with Python", count: 623, percent: 12, color: "bg-amber-500" },
];

const MOCK_EXPIRIES = [
  { name: "AWS Cloud Practitioner", expires: "Expires in 15 days", count: 25 },
  { name: "Google Analytics Certification", expires: "Expires in 30 days", count: 18 },
  { name: "Microsoft Azure Fundamentals", expires: "Expires in 45 days", count: 32 },
];

export function CertDesignerAdmin() {
  const qc = useQueryClient();
  const [activeNav, setActiveNav] = useState("dashboard"); // dashboard, templates, designer, etc.
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Templates");
  const [selectedTemplate, setSelectedTemplate] = useState<CanvaTemplate | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);

  const doList = useServerFn(listCanvaTemplates);
  const doSave = useServerFn(saveCanvaTemplate);
  const doDelete = useServerFn(deleteCanvaTemplate);
  const doSeed = useServerFn(seedAllTemplates);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["canva-cert-templates"],
    queryFn: async () => {
      const result = await doList();
      return (result ?? []) as CanvaTemplate[];
    },
  });

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
      const matchCat =
        selectedCategory === "All Templates" ||
        (selectedCategory === "Premium" && t.name.toLowerCase().includes("gold")) ||
        t.category.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchSearch && matchCat;
    });
  }, [templates, search, selectedCategory]);

  const handleAiGenerate = () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a description for your certificate!");
      return;
    }
    setAiGenerating(true);
    setTimeout(() => {
      setAiGenerating(false);
      toast.success("AI Certificate generated successfully!");
      setActiveNav("templates");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-[#090d16] text-foreground font-sans antialiased overflow-x-hidden">
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#0c101d] border-r border-white/10 flex flex-col shrink-0 select-none z-30">
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-white/10">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Award className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
              Learnify AI
              <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-400 px-1.5 py-0.2 rounded border border-indigo-500/30">
                3.0
              </span>
            </h1>
            <p className="text-[11px] text-white/50 font-medium">Credential OS</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* CREDENTIALS Group */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-white/40 tracking-wider uppercase">Credentials</span>
            <button
              onClick={() => setActiveNav("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === "dashboard"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveNav("certificates")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === "certificates"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Award className="h-4 w-4" />
              Certificates
            </button>
            <button
              onClick={() => setActiveNav("templates")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === "templates"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutTemplate className="h-4 w-4" />
              Templates
            </button>
            <button
              onClick={() => setActiveNav("designer")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === "designer"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Palette className="h-4 w-4" />
              Designer
            </button>
            <button
              onClick={() => setActiveNav("skills")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === "skills"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Skills & Badges
            </button>
            <button
              onClick={() => setActiveNav("verification")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === "verification"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              Verification
            </button>
            <button
              onClick={() => setActiveNav("wallet")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === "wallet"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Wallet className="h-4 w-4" />
              Wallet
            </button>
          </div>

          {/* AUTOMATION Group */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-white/40 tracking-wider uppercase">Automation</span>
            <button
              onClick={() => setActiveNav("bulk")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === "bulk"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Users className="h-4 w-4" />
              Bulk Issue
            </button>
            <button
              onClick={() => setActiveNav("email")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === "email"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Mail className="h-4 w-4" />
              Email Center
            </button>
          </div>

          {/* INSIGHTS Group */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-white/40 tracking-wider uppercase">Insights</span>
            <button
              onClick={() => setActiveNav("analytics")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === "analytics"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </button>
          </div>

          {/* TOOLS Group */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-white/40 tracking-wider uppercase">Tools</span>
            <button
              onClick={() => setActiveNav("ai-designer")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === "ai-designer"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-purple-400" />
                AI Designer
              </div>
              <span className="text-[9px] font-bold bg-purple-500 text-white px-1.5 py-0.5 rounded-full uppercase">
                New
              </span>
            </button>
            <button
              onClick={() => setActiveNav("marketplace")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === "marketplace"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              Marketplace
            </button>
          </div>

          {/* SETTINGS Group */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-white/40 tracking-wider uppercase">Settings</span>
            <button
              onClick={() => setActiveNav("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === "settings"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop"
                alt="Avatar"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-white line-clamp-1">Vishwajeet S.</p>
                <p className="text-[10px] text-white/50">Administrator</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-white/50" />
          </div>

          {/* Pro Plan Meter */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/20 text-xs space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-semibold text-white/80">
              <span>Pro Plan</span>
              <span className="text-indigo-400">Valid till May 2027</span>
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[95%]" />
            </div>
            <p className="text-[10px] text-white/60 text-right">AI Credits: 19,996 / 20,000</p>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#090d16] overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 px-8 border-b border-white/10 flex items-center justify-between gap-4 shrink-0 bg-[#0c101d]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="text"
                placeholder="Search anything... (⌘ K)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 transition-all">
              <HelpCircle className="h-4 w-4" />
            </button>
            <button className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 relative transition-all">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            </button>

            <Button
              onClick={() => setActiveNav("designer")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs px-4 h-9 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Create Certificate
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </Button>
          </div>
        </header>

        {/* 3. DYNAMIC CONTENT CONTAINER */}
        <main className="p-8 space-y-8 flex-1">
          {/* PAGE 1: CREDENTIAL DASHBOARD (Match Screenshot 1 1:1) */}
          {activeNav === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Hero Greeting */}
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  Welcome back, Vishwajeet! 👋
                </h2>
                <p className="text-xs text-white/60 mt-1">Here's what's happening with your credentials today.</p>
              </div>

              {/* 6 Top Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Card 1 */}
                <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/10 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-white/60">
                    <span className="text-[11px] font-medium">Certificates Issued</span>
                    <Award className="h-4 w-4 text-purple-400" />
                  </div>
                  <p className="text-2xl font-extrabold text-white">12,420</p>
                  <p className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    ↑ 24.5% <span className="text-white/40">this month</span>
                  </p>
                </div>

                {/* Card 2 */}
                <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/10 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-white/60">
                    <span className="text-[11px] font-medium">Verification Rate</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-extrabold text-white">96.7%</p>
                  <p className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    ↑ 18.7% <span className="text-white/40">this month</span>
                  </p>
                </div>

                {/* Card 3 */}
                <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/10 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-white/60">
                    <span className="text-[11px] font-medium">QR Scans</span>
                    <QrCode className="h-4 w-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-extrabold text-white">15,891</p>
                  <p className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    ↑ 28.4% <span className="text-white/40">this month</span>
                  </p>
                </div>

                {/* Card 4 */}
                <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/10 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-white/60">
                    <span className="text-[11px] font-medium">LinkedIn Shares</span>
                    <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                  </div>
                  <p className="text-2xl font-extrabold text-white">4,522</p>
                  <p className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    ↑ 32.1% <span className="text-white/40">this month</span>
                  </p>
                </div>

                {/* Card 5 */}
                <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/10 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-white/60">
                    <span className="text-[11px] font-medium">Wallet Credentials</span>
                    <Wallet className="h-4 w-4 text-amber-400" />
                  </div>
                  <p className="text-2xl font-extrabold text-white">12,420</p>
                  <p className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    ↑ 20.8% <span className="text-white/40">this month</span>
                  </p>
                </div>

                {/* Card 6 */}
                <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/10 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-white/60">
                    <span className="text-[11px] font-medium">Active Templates</span>
                    <LayoutTemplate className="h-4 w-4 text-pink-400" />
                  </div>
                  <p className="text-2xl font-extrabold text-white">38</p>
                  <p className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    ↑ 12 <span className="text-white/40">this month</span>
                  </p>
                </div>
              </div>

              {/* Middle Section: Recent Activity & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Activity (6 cols) */}
                <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0c101d] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">Recent Activity</h3>
                    <button className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">View all</button>
                  </div>
                  <div className="space-y-3">
                    {MOCK_ACTIVITIES.map((act) => {
                      const Icon = act.icon;
                      return (
                        <div key={act.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                          <div className={`p-2 rounded-xl ${act.color} shrink-0`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white line-clamp-1">{act.title}</p>
                            <p className="text-[10px] text-white/50 line-clamp-1 mt-0.5">{act.meta}</p>
                          </div>
                          <span className="text-[10px] text-white/40 shrink-0 font-medium">{act.time}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Actions Grid (6 cols) */}
                <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0c101d] border border-white/10 space-y-4">
                  <h3 className="font-bold text-sm text-white">Quick Actions</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setActiveNav("designer")}
                      className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/50 text-left space-y-2 transition-all hover:scale-[1.02]"
                    >
                      <div className="h-8 w-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center">
                        <Plus className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-bold text-white">Create Certificate</p>
                      <p className="text-[10px] text-white/50">Create single certificate</p>
                    </button>

                    <button
                      onClick={() => setActiveNav("ai-designer")}
                      className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/50 text-left space-y-2 transition-all hover:scale-[1.02] relative"
                    >
                      <span className="absolute top-2 right-2 text-[9px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">New</span>
                      <div className="h-8 w-8 rounded-lg bg-purple-500 text-white flex items-center justify-center">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-bold text-white">AI Designer</p>
                      <p className="text-[10px] text-white/50">Generate with AI</p>
                    </button>

                    <button
                      onClick={() => setActiveNav("bulk")}
                      className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/50 text-left space-y-2 transition-all hover:scale-[1.02]"
                    >
                      <div className="h-8 w-8 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                        <Users className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-bold text-white">Bulk Generate</p>
                      <p className="text-[10px] text-white/50">Upload CSV / Excel</p>
                    </button>

                    <button
                      onClick={() => setActiveNav("templates")}
                      className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/50 text-left space-y-2 transition-all hover:scale-[1.02]"
                    >
                      <div className="h-8 w-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                        <LayoutTemplate className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-bold text-white">Template Library</p>
                      <p className="text-[10px] text-white/50">Browse 30+ templates</p>
                    </button>

                    <button
                      onClick={() => setActiveNav("verification")}
                      className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/50 text-left space-y-2 transition-all hover:scale-[1.02]"
                    >
                      <div className="h-8 w-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-bold text-white">Verification Center</p>
                      <p className="text-[10px] text-white/50">Verify credentials</p>
                    </button>

                    <button
                      onClick={() => setActiveNav("wallet")}
                      className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 hover:border-pink-500/50 text-left space-y-2 transition-all hover:scale-[1.02]"
                    >
                      <div className="h-8 w-8 rounded-lg bg-pink-500 text-white flex items-center justify-center">
                        <Wallet className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-bold text-white">Credential Wallet</p>
                      <p className="text-[10px] text-white/50">View all credentials</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Top Courses & Status Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Top Courses Progress (7 cols) */}
                <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0c101d] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">Top Performing Courses</h3>
                    <span className="text-xs text-white/50">Share of Total Certificates</span>
                  </div>
                  <div className="space-y-4">
                    {MOCK_TOP_COURSES.map((course, idx) => (
                      <div key={course.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-white">
                            {idx + 1}. {course.name}
                          </span>
                          <span className="text-white/60 font-mono">
                            {course.count.toLocaleString()} ({course.percent}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${course.color}`} style={{ width: `${course.percent * 3.5}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status & Expiries (5 cols) */}
                <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0c101d] border border-white/10 space-y-6">
                  <div>
                    <h3 className="font-bold text-sm text-white mb-3">Certificate Status Breakdown</h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <span className="text-emerald-400 font-semibold">Active</span>
                        <span className="text-white font-bold">11,230 (90.4%)</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <span className="text-amber-400 font-semibold">Expired</span>
                        <span className="text-white font-bold">856 (6.9%)</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <span className="text-rose-400 font-semibold">Revoked</span>
                        <span className="text-white font-bold">214 (1.7%)</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <span className="text-blue-400 font-semibold">Draft</span>
                        <span className="text-white font-bold">120 (1.0%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-white">Upcoming Expiries</h4>
                    {MOCK_EXPIRIES.map((exp) => (
                      <div key={exp.name} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <div>
                          <p className="font-semibold text-white">{exp.name}</p>
                          <p className="text-[10px] text-amber-400">{exp.expires}</p>
                        </div>
                        <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">{exp.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upgrade Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 border border-indigo-500/30 flex items-center justify-between gap-6 flex-wrap shadow-2xl">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <Crown className="h-5 w-5 text-amber-400" />
                    Upgrade to Enterprise Plan
                  </h3>
                  <p className="text-xs text-white/70">
                    Unlock advanced custom branding, API access, SSO integration, and unlimited bulk issuance.
                  </p>
                </div>
                <Button className="bg-white hover:bg-white/90 text-indigo-950 font-bold text-xs px-6 h-10 rounded-xl shadow-lg">
                  Upgrade Now →
                </Button>
              </div>
            </div>
          )}

          {/* PAGE 2: TEMPLATE LIBRARY (Match Screenshot 2 1:1) */}
          {activeNav === "templates" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Template Library</h2>
                  <p className="text-xs text-white/60 mt-1">
                    Choose a template to create beautiful certificates in seconds.
                  </p>
                </div>
                <Button
                  onClick={() => setActiveNav("designer")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 h-9 rounded-xl shadow-md"
                >
                  <Plus className="h-4 w-4 mr-1.5" /> Create Template
                </Button>
              </div>

              {/* Category Pills Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "bg-[#0c101d] text-white/70 border border-white/10 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {cat === "Premium" ? "👑 Premium" : cat}
                  </button>
                ))}
              </div>

              {/* Template Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredTemplates.map((t) => (
                  <div
                    key={t.id}
                    className="group rounded-2xl bg-[#0c101d] border border-white/10 overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col relative"
                  >
                    <div className="aspect-[1.414] relative bg-gradient-to-br from-indigo-950 to-slate-900 overflow-hidden p-4 flex flex-col justify-between">
                      <div className="flex items-center justify-between z-10">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-amber-400 border border-amber-400/20 backdrop-blur-md">
                          {t.category || "Professional"}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setSelectedTemplate(t);
                              setPreviewOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-white/80 transition-all"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-white/80 transition-all">
                            <Heart className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="my-auto text-center z-10">
                        <h4 className="font-bold text-sm text-white line-clamp-1">{t.name}</h4>
                        <p className="text-[10px] text-white/60 line-clamp-1">Certificate of Completion</p>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 p-4 z-20">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedTemplate(t);
                            setActiveNav("designer");
                          }}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 rounded-xl"
                        >
                          Use Template
                        </Button>
                      </div>
                    </div>

                    <div className="p-3 bg-[#0c101d] flex items-center justify-between text-xs border-t border-white/5">
                      <span className="font-medium text-white line-clamp-1">{t.name}</span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Free
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAGE 3: AI CERTIFICATE DESIGNER */}
          {activeNav === "ai-designer" && (
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                  AI Certificate Designer
                </h2>
                <p className="text-xs text-white/60 mt-1">
                  Describe the certificate you want to build, and AI will generate custom layout, typography, borders, and color themes.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/10 space-y-4">
                <Label className="text-xs font-semibold text-white">Certificate Description / Prompt</Label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Create a luxury navy gold certificate for AI Robotics Masterclass with ornate borders and gold seal..."
                  className="w-full h-32 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500 resize-none"
                />

                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAiPrompt("Luxury navy and gold AI certification with gold seal")}
                      className="text-[10px] bg-white/5 hover:bg-white/10 text-white/80 px-2.5 py-1 rounded-lg border border-white/10"
                    >
                      Navy & Gold AI
                    </button>
                    <button
                      onClick={() => setAiPrompt("Minimalist dark tech bootcamp diploma with emerald accents")}
                      className="text-[10px] bg-white/5 hover:bg-white/10 text-white/80 px-2.5 py-1 rounded-lg border border-white/10"
                    >
                      Minimal Tech
                    </button>
                  </div>

                  <Button
                    onClick={handleAiGenerate}
                    disabled={aiGenerating}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold px-6 h-10 rounded-xl"
                  >
                    {aiGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    {aiGenerating ? "Generating Layout..." : "Generate Certificate"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Preview Modal */}
      {previewOpen && selectedTemplate && (
        <CertDesignerPreview template={selectedTemplate} onClose={() => setPreviewOpen(false)} />
      )}
    </div>
  );
}
