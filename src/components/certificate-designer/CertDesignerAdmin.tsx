import { useState, useRef, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  listCanvaTemplates,
  saveCanvaTemplate,
  deleteCanvaTemplate,
  seedAllTemplates,
} from "@/lib/canva-cert.functions";
import { Button } from "@/components/ui/button";
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
  FileText,
  Clock,
  Zap,
  Type,
  Image as ImageIcon,
  Square,
  Ribbon,
  FileSpreadsheet,
  Layers,
  Sparkle,
  Sliders,
  Maximize2,
  Undo,
  Redo,
  RotateCcw,
  AlertCircle,
  X,
  Lock,
  ChevronLeft,
} from "lucide-react";

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

const CATEGORY_PILLS = [
  "All",
  "Professional",
  "Academic",
  "Modern",
  "Minimal",
  "Luxury",
  "Creative",
  "Corporate",
  "Technology",
  "AI",
  "Workshop",
  "Bootcamp",
  "Internship",
];

const RECENT_CERTIFICATES = [
  {
    id: "1",
    course: "Full Stack Web Development",
    recipient: "John Doe",
    time: "2 minutes ago",
    status: "Issued",
    statusColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
    bg: "from-amber-900 to-slate-900",
  },
  {
    id: "2",
    course: "Python Programming Masterclass",
    recipient: "Sarah Wilson",
    time: "15 minutes ago",
    status: "Verified",
    statusColor: "bg-blue-50 text-blue-600 border-blue-200",
    bg: "from-blue-900 to-indigo-950",
  },
  {
    id: "3",
    course: "AI & ML Fundamentals",
    recipient: "Michael Brown",
    time: "1 hour ago",
    status: "Issued",
    statusColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
    bg: "from-purple-950 to-slate-900",
  },
  {
    id: "4",
    course: "UI/UX Design Principles",
    recipient: "Emily Johnson",
    time: "2 hours ago",
    status: "Downloaded",
    statusColor: "bg-amber-50 text-amber-600 border-amber-200",
    bg: "from-slate-900 to-purple-950",
  },
  {
    id: "5",
    course: "Data Science with Python",
    recipient: "David Lee",
    time: "3 hours ago",
    status: "Added to Wallet",
    statusColor: "bg-purple-50 text-purple-600 border-purple-200",
    bg: "from-[#0a1628] to-[#1e293b]",
  },
];

const RECENT_VERIFICATIONS = [
  { id: "LAI-2026-000124", status: "Verified successfully", time: "2 min ago" },
  { id: "LAI-2026-000123", status: "Verified successfully", time: "6 min ago" },
  { id: "LAI-2026-000122", status: "Verified successfully", time: "12 min ago" },
  { id: "LAI-2026-000121", status: "Verified successfully", time: "18 min ago" },
];

export function CertDesignerAdmin() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview"); // overview, templates, designer, bulk, etc.
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bulkStep, setBulkStep] = useState(1);
  const [designerStudentName, setDesignerStudentName] = useState("Vishwajeet Sharma");
  const [designerCourse, setDesignerCourse] = useState("Full Stack Web Development");
  const [designerFont, setDesignerFont] = useState("Playfair Display");
  const [designerFontSize, setDesignerFontSize] = useState("72");
  const [designerColor, setDesignerColor] = useState("#0F172A");
  const [activeElement, setActiveElement] = useState<string | null>("Student Name");

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
        selectedCategory === "All" ||
        (selectedCategory === "Luxury" && t.name.toLowerCase().includes("gold")) ||
        t.category.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchSearch && matchCat;
    });
  }, [templates, search, selectedCategory]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      {/* 1. LEFT SIDEBAR NAVIGATION (Matching Image 1 & Image 4 Light Design) */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none z-30">
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-100">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900 tracking-tight">Learnify AI</h1>
            <p className="text-[11px] text-slate-500 font-medium">Credential OS</p>
          </div>
        </div>

        {/* Sidebar Nav List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === "overview"
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <Award className="h-4 w-4" /> Courses
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <Sparkles className="h-4 w-4" /> AI Tutor
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <FileText className="h-4 w-4" /> Career Studio
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <Users className="h-4 w-4" /> Community
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <Clock className="h-4 w-4" /> Coaching
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <Zap className="h-4 w-4" /> AI Tools
            </button>

            {/* Certificates Active Group */}
            <div className="pt-2">
              <button
                onClick={() => setActiveTab("overview")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4" /> Certificates
                </div>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              <div className="ml-7 mt-1 space-y-1 border-l-2 border-slate-100 pl-3">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full text-left py-1.5 text-xs ${
                    activeTab === "overview" ? "font-bold text-blue-600" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("overview")}
                  className="w-full text-left py-1.5 text-xs text-slate-500 hover:text-slate-900"
                >
                  All Certificates
                </button>
                <button
                  onClick={() => setActiveTab("templates")}
                  className={`w-full text-left py-1.5 text-xs ${
                    activeTab === "templates" ? "font-bold text-blue-600" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Templates
                </button>
                <button
                  onClick={() => setActiveTab("designer")}
                  className={`w-full text-left py-1.5 text-xs ${
                    activeTab === "designer" ? "font-bold text-blue-600" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Designer
                </button>
                <button
                  onClick={() => setActiveTab("bulk")}
                  className={`w-full text-left py-1.5 text-xs ${
                    activeTab === "bulk" ? "font-bold text-blue-600" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Bulk Issue
                </button>
                <button
                  onClick={() => setActiveTab("overview")}
                  className="w-full text-left py-1.5 text-xs text-slate-500 hover:text-slate-900"
                >
                  Verification
                </button>
                <button
                  onClick={() => setActiveTab("overview")}
                  className="w-full text-left py-1.5 text-xs text-slate-500 hover:text-slate-900"
                >
                  Analytics
                </button>
                <button
                  onClick={() => setActiveTab("overview")}
                  className="w-full text-left py-1.5 text-xs text-slate-500 hover:text-slate-900"
                >
                  Categories
                </button>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("overview")}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 mt-4"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4" /> Cart
              </div>
              <span className="h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                1
              </span>
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <Wallet className="h-4 w-4" /> Wallet
            </button>
          </div>

          {/* Support Pill */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-left text-xs">
              <p className="font-bold text-slate-900">Learnify Support</p>
              <p className="text-[10px] text-slate-500">Online Assistant</p>
            </div>
          </div>
        </div>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop"
                alt="Vishwajeet"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">Vishwajeet S.</p>
                <p className="text-[10px] text-slate-500">Administrator</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] overflow-y-auto">
        {/* Top Navigation Bar & Action Bar */}
        <header className="h-16 px-8 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 tracking-tight">
                {activeTab === "overview" && "Certificate System"}
                {activeTab === "bulk" && "Bulk Issue Certificates"}
                {activeTab === "designer" && "Certificate Designer"}
                {activeTab === "templates" && "Certificate Templates"}
              </h2>
              <p className="text-xs text-slate-500">
                {activeTab === "overview" && "Create, manage and issue professional certificates with ease."}
                {activeTab === "bulk" && "Upload a list of recipients and issue certificates in bulk."}
                {activeTab === "designer" && "Design beautiful, verifiable certificates with ease."}
                {activeTab === "templates" && "Choose a template or create your own beautiful certificate."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 px-3.5 py-2 rounded-xl flex items-center gap-1.5 bg-white shadow-sm">
              View Public Gallery <ExternalLink className="h-3.5 w-3.5" />
            </button>

            <button className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 relative bg-white shadow-sm">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600" />
            </button>

            <div className="flex items-center gap-2 pl-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop"
                alt="Avatar"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500"
              />
              <div className="text-left text-xs hidden sm:block">
                <p className="font-bold text-slate-900 leading-none">Vishwajeet S.</p>
                <p className="text-[10px] text-slate-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Secondary Navigation Sub-Tabs Bar (Matching Image 1 & 4) */}
        <div className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "overview"
                  ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" /> Overview
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <Award className="h-3.5 w-3.5" /> All Certificates
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "templates"
                  ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutTemplate className="h-3.5 w-3.5" /> Templates
            </button>
            <button
              onClick={() => setActiveTab("designer")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "designer"
                  ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Palette className="h-3.5 w-3.5" /> Designer
            </button>
            <button
              onClick={() => setActiveTab("bulk")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "bulk"
                  ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="h-3.5 w-3.5" /> Bulk Issue
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Verification
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <BarChart3 className="h-3.5 w-3.5" /> Analytics
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <Layers className="h-3.5 w-3.5" /> Categories
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <Settings className="h-3.5 w-3.5" /> Settings
            </button>
          </div>
        </div>

        {/* 3. TAB CONTENT VIEWS */}
        <main className="p-8 space-y-8 flex-1">
          {/* TAB 1: OVERVIEW DASHBOARD (Match Image 1 1:1) */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* 5 Top Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Card 1 */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-medium">Certificates Issued</span>
                    <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <FileText className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900">12,420</p>
                  <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    ↑ 24.5% <span className="text-slate-400 font-normal">This Month</span>
                  </p>
                </div>

                {/* Card 2 */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-medium">Verifications</span>
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900">8,752</p>
                  <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    ↑ 18.7% <span className="text-slate-400 font-normal">This Month</span>
                  </p>
                </div>

                {/* Card 3 */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-medium">Downloads</span>
                    <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Download className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900">6,423</p>
                  <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    ↑ 16.2% <span className="text-slate-400 font-normal">This Month</span>
                  </p>
                </div>

                {/* Card 4 */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-medium">LinkedIn Shares</span>
                    <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Linkedin className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900">3,251</p>
                  <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    ↑ 20.2% <span className="text-slate-400 font-normal">This Month</span>
                  </p>
                </div>

                {/* Card 5 */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-medium">Wallet Added</span>
                    <div className="h-8 w-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                      <Wallet className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900">7,983</p>
                  <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    ↑ 21.4% <span className="text-slate-400 font-normal">This Month</span>
                  </p>
                </div>
              </div>

              {/* Middle Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Certificates (4 cols) */}
                <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">Recent Certificates</h3>
                    <button className="text-xs text-blue-600 hover:underline font-semibold">View All</button>
                  </div>
                  <div className="space-y-3">
                    {RECENT_CERTIFICATES.map((cert) => (
                      <div key={cert.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-3">
                        <div className={`w-14 h-10 rounded-lg bg-gradient-to-br ${cert.bg} p-1 text-[7px] text-white font-serif flex flex-col justify-center text-center shrink-0`}>
                          <p className="font-bold">Certificate</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 line-clamp-1">{cert.course}</p>
                          <p className="text-[10px] text-slate-500">Issued to {cert.recipient} • {cert.time}</p>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${cert.statusColor}`}>
                          {cert.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions (4 cols) */}
                <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-slate-900">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setActiveTab("designer")}
                      className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 hover:border-purple-300 text-left space-y-2 transition-all hover:shadow-sm"
                    >
                      <div className="h-8 w-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                        <FileText className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-900">Create Certificate</p>
                      <p className="text-[10px] text-slate-500">Create a new certificate manually</p>
                    </button>

                    <button
                      onClick={() => setActiveTab("designer")}
                      className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 hover:border-blue-300 text-left space-y-2 transition-all hover:shadow-sm"
                    >
                      <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-900">AI Designer</p>
                      <p className="text-[10px] text-slate-500">Generate certificates with AI</p>
                    </button>

                    <button
                      onClick={() => setActiveTab("bulk")}
                      className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-300 text-left space-y-2 transition-all hover:shadow-sm"
                    >
                      <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                        <Upload className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-900">Bulk Issue</p>
                      <p className="text-[10px] text-slate-500">Upload CSV and issue in bulk</p>
                    </button>

                    <button
                      onClick={() => setActiveTab("templates")}
                      className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 hover:border-amber-300 text-left space-y-2 transition-all hover:shadow-sm"
                    >
                      <div className="h-8 w-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                        <LayoutTemplate className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-900">Template Library</p>
                      <p className="text-[10px] text-slate-500">Browse 50+ professional templates</p>
                    </button>

                    <button
                      onClick={() => setActiveTab("overview")}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-left space-y-2 transition-all hover:shadow-sm"
                    >
                      <div className="h-8 w-8 rounded-lg bg-slate-800 text-white flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-900">Verification Center</p>
                      <p className="text-[10px] text-slate-500">Verify any certificate</p>
                    </button>

                    <button
                      onClick={() => setActiveTab("overview")}
                      className="p-4 rounded-xl bg-pink-50/50 border border-pink-100 hover:border-pink-300 text-left space-y-2 transition-all hover:shadow-sm"
                    >
                      <div className="h-8 w-8 rounded-lg bg-pink-600 text-white flex items-center justify-center">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-900">Analytics Dashboard</p>
                      <p className="text-[10px] text-slate-500">View detailed reports</p>
                    </button>
                  </div>
                </div>

                {/* Certificate Statistics & Activity (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-900">Certificate Statistics</h3>
                      <span className="text-xs text-slate-500">This Month</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        <div className="w-full h-full rounded-full border-8 border-purple-600 border-t-emerald-500 border-r-blue-500 border-b-amber-500 flex flex-col items-center justify-center">
                          <p className="text-sm font-extrabold text-slate-900">12,420</p>
                          <p className="text-[9px] text-slate-500">Total</p>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-purple-600" /> Issued: 12,420 (50.2%)</div>
                        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Verified: 8,752 (35.4%)</div>
                        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500" /> Downloaded: 6,423 (25.9%)</div>
                        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" /> Shared: 3,251 (13.1%)</div>
                        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-pink-500" /> Wallet Added: 7,983 (32.2%)</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-900">Recent Verification Activity</h3>
                      <button className="text-xs text-blue-600 hover:underline font-semibold">View All</button>
                    </div>
                    <div className="space-y-2.5">
                      {RECENT_VERIFICATIONS.map((ver) => (
                        <div key={ver.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <div>
                              <p className="font-bold text-slate-900">Certificate ID: {ver.id}</p>
                              <p className="text-[10px] text-slate-500">{ver.status}</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400">{ver.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Pro Plan Upgrade Banner (Matching Image 1) */}
              <div className="p-6 rounded-2xl bg-blue-600 text-white flex items-center justify-between gap-6 flex-wrap shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center text-amber-300">
                    <Crown className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Upgrade to Pro Plan</h3>
                    <p className="text-xs text-blue-100">
                      Unlock premium templates, advanced analytics, bulk issue and more powerful features.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs text-blue-100 flex-wrap">
                  <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-white" /> Unlimited Certificates</span>
                  <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-white" /> Custom Branding</span>
                  <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-white" /> Advanced Analytics</span>
                  <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-white" /> Priority Support</span>
                  <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-white" /> Bulk Issue (No Limit)</span>
                </div>

                <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs px-6 h-10 rounded-xl shadow-lg">
                  Upgrade Now →
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: BULK ISSUE (Match Image 2 1:1) */}
          {activeTab === "bulk" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Stepper Bar */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-8 text-xs font-semibold">
                  <div className="flex items-center gap-2 text-blue-600">
                    <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                    Upload Recipients
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="h-6 w-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">2</span>
                    Map Fields
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="h-6 w-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">3</span>
                    Customize
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="h-6 w-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">4</span>
                    Review & Send
                  </div>
                </div>

                <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 h-9 rounded-xl">
                  Issue Certificates
                </Button>
              </div>

              {/* Grid for Steps 1 & 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Step 1: Upload Recipients */}
                <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-slate-900">1. Upload Recipients</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-1.5 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold border border-blue-200">
                      Upload CSV File
                    </button>
                    <button className="px-4 py-1.5 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-50">
                      Enter Manually
                    </button>
                  </div>

                  <div className="border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center space-y-3 bg-blue-50/20">
                    <div className="h-10 w-10 mx-auto rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">Drag & drop your CSV file here</p>
                      <p className="text-[10px] text-slate-500">or</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs font-semibold">Choose File</Button>
                    <p className="text-[10px] text-slate-400">Supports CSV, XLSX (Max size: 10MB)</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                      <div>
                        <p className="font-bold text-slate-900">recipients_list.csv</p>
                        <p className="text-[10px] text-slate-400">2.45 KB</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      120 Records ✓
                    </span>
                  </div>
                </div>

                {/* Step 2: Map Fields */}
                <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">2. Map Fields</h3>
                    <button className="text-xs text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1 rounded-lg">
                      Preview Data
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-700">Student Name *</span>
                      <span className="font-mono text-slate-500">student_name → Vishwajeet Sharma ✓</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-700">Email Address *</span>
                      <span className="font-mono text-slate-500">email → vishwajeet@example.com ✓</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-700">Course Name *</span>
                      <span className="font-mono text-slate-500">course_name → Full Stack Web Dev ✓</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-700">Issue Date</span>
                      <span className="font-mono text-slate-500">issue_date → May 25, 2026 ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CERTIFICATE DESIGNER (Match Image 3 1:1) */}
          {activeTab === "designer" && (
            <div className="h-[calc(100vh-140px)] flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-300">
              {/* Designer Top Control Bar */}
              <div className="h-12 border-b border-slate-200 px-4 flex items-center justify-between bg-slate-50/50 text-xs">
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-slate-200"><Undo className="h-4 w-4 text-slate-600" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-slate-200"><Redo className="h-4 w-4 text-slate-600" /></button>
                  <div className="h-4 w-px bg-slate-300 mx-1" />
                  <span className="font-semibold text-slate-700">100%</span>
                  <div className="h-4 w-px bg-slate-300 mx-1" />
                  <button className="p-1.5 rounded-lg hover:bg-slate-200"><Grid className="h-4 w-4 text-slate-600" /> Show Grid</button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs font-semibold">Save as Template</Button>
                  <Button size="sm" className="bg-blue-600 text-white text-xs font-bold">Download</Button>
                </div>
              </div>

              {/* 3-Column Designer Studio Body */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Add Elements Sidebar */}
                <div className="w-56 border-r border-slate-200 p-4 bg-slate-50/30 overflow-y-auto space-y-4">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Add Elements</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-400 flex flex-col items-center gap-1.5">
                      <Type className="h-5 w-5 text-blue-600" /> Text
                    </button>
                    <button className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-400 flex flex-col items-center gap-1.5">
                      <ImageIcon className="h-5 w-5 text-purple-600" /> Image
                    </button>
                    <button className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-400 flex flex-col items-center gap-1.5">
                      <Square className="h-5 w-5 text-emerald-600" /> Shapes
                    </button>
                    <button className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-400 flex flex-col items-center gap-1.5">
                      <Ribbon className="h-5 w-5 text-amber-600" /> Badges
                    </button>
                    <button className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-400 flex flex-col items-center gap-1.5">
                      <QrCode className="h-5 w-5 text-slate-800" /> QR Code
                    </button>
                    <button className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-400 flex flex-col items-center gap-1.5">
                      <Upload className="h-5 w-5 text-pink-600" /> Upload
                    </button>
                  </div>
                </div>

                {/* Center Canvas */}
                <div className="flex-1 bg-slate-100 p-8 flex flex-col items-center justify-center relative overflow-auto">
                  <div className="w-[800px] h-[565px] bg-white rounded-xl border-8 border-double border-[#0F172A] p-10 flex flex-col justify-between relative shadow-2xl">
                    <div className="text-center space-y-2">
                      <div className="h-10 w-10 mx-auto rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                        L
                      </div>
                      <h1 className="font-serif text-3xl font-bold tracking-widest text-[#0F172A] uppercase">
                        Certificate of Completion
                      </h1>
                      <p className="text-xs text-slate-500 italic">This is to certify that</p>
                    </div>

                    <div className="text-center my-auto space-y-4">
                      <h2 className="font-cursive text-5xl font-bold text-[#0F172A]">{designerStudentName}</h2>
                      <p className="text-xs text-slate-500">has successfully completed the course</p>
                      <h3 className="font-serif text-xl font-bold text-blue-900">{designerCourse}</h3>
                    </div>

                    <div className="flex justify-between items-end text-xs text-slate-700 pt-6 border-t border-slate-200">
                      <div>
                        <p className="font-bold">May 25, 2026</p>
                        <p className="text-[10px] text-slate-400">Date of Completion</p>
                      </div>
                      <div className="text-center">
                        <p className="font-cursive text-xl text-slate-900">Vishwajeet S.</p>
                        <p className="text-[10px] text-slate-400 font-bold">Founder & CEO, Learnify AI</p>
                      </div>
                      <div className="text-right">
                        <QrCode className="h-10 w-10 ml-auto text-slate-900" />
                        <p className="text-[9px] font-mono text-slate-400 mt-1">Verify Certificate</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Properties Inspector */}
                <div className="w-64 border-l border-slate-200 p-4 bg-slate-50/30 overflow-y-auto space-y-4 text-xs">
                  <p className="font-bold text-slate-900 uppercase tracking-wider">Text Properties</p>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-[11px] text-slate-500">Font Family</Label>
                      <Select value={designerFont} onValueChange={setDesignerFont}>
                        <SelectTrigger className="h-8 text-xs bg-white"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Great Vibes">Great Vibes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-[11px] text-slate-500">Font Size</Label>
                      <Input
                        value={designerFontSize}
                        onChange={(e) => setDesignerFontSize(e.target.value)}
                        className="h-8 text-xs bg-white"
                      />
                    </div>

                    <div>
                      <Label className="text-[11px] text-slate-500">Student Name</Label>
                      <Input
                        value={designerStudentName}
                        onChange={(e) => setDesignerStudentName(e.target.value)}
                        className="h-8 text-xs bg-white"
                      />
                    </div>

                    <div>
                      <Label className="text-[11px] text-slate-500">Course Name</Label>
                      <Input
                        value={designerCourse}
                        onChange={(e) => setDesignerCourse(e.target.value)}
                        className="h-8 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TEMPLATE LIBRARY (Match Image 4 1:1) */}
          {activeTab === "templates" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Certificate Templates</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose a template or create your own beautiful certificate.
                  </p>
                </div>
                <Button onClick={() => setActiveTab("designer")} className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 h-9 rounded-xl shadow-md">
                  <Plus className="h-4 w-4 mr-1.5" /> New Template
                </Button>
              </div>

              {/* Category Pills Bar (Matching Image 4) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORY_PILLS.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Template Cards Grid (Matching Image 4) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredTemplates.map((t) => (
                  <div
                    key={t.id}
                    className="group rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col relative"
                  >
                    <div className="aspect-[1.414] relative bg-gradient-to-br from-slate-900 to-indigo-950 p-4 flex flex-col justify-between overflow-hidden">
                      <div className="flex items-center justify-between z-10">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-amber-400 border border-amber-400/20 backdrop-blur-md">
                          {t.category || "Professional"}
                        </span>
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-white/80 transition-all">
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-white/80 transition-all">
                            <Heart className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="my-auto text-center z-10 text-white">
                        <h4 className="font-serif font-bold text-sm line-clamp-1">{t.name}</h4>
                        <p className="text-[10px] text-slate-300 line-clamp-1">Certificate of Completion</p>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 p-4 z-20">
                        <Button
                          size="sm"
                          onClick={() => setActiveTab("designer")}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 rounded-xl"
                        >
                          Use Template
                        </Button>
                      </div>
                    </div>

                    <div className="p-3 bg-white flex items-center justify-between text-xs border-t border-slate-100">
                      <span className="font-medium text-slate-900 line-clamp-1">{t.name}</span>
                      <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        Free
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
