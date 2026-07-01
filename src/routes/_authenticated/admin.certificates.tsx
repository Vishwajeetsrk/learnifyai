import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Plus, Trash2, Save, Edit3, ShieldCheck, Copy, Upload, BarChart3,
  FolderTree, Users, Eye, Download, Award, Search, ExternalLink,
  CheckCircle2, TrendingUp, Share2, FileText, LayoutTemplate, LayoutGrid,
  HelpCircle, X, Info, Globe, ArrowRight, Palette,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/AppShell";
import { listTemplates, saveTemplate, deleteTemplate } from "@/lib/certificate-admin.functions";
import { useAuth } from "@/hooks/use-auth";
import { DesignerWorkspace } from "@/components/certificate-designer/DesignerWorkspace";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/_authenticated/admin/certificates")({
  component: AdminCertificatesPage,
});

type CertElement = {
  id: string;
  type: "text" | "image" | "org_logo";
  content?: string;
  url?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  align?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
};

type CertDesign = {
  accent_color: string;
  bg_color: string;
  text_color: string;
  font_family: string;
  border_style: string;
  border_width: number;
  corner_style: string;
  background_pattern: string;
  layout: string;
};

type CertTemplate = {
  id: string;
  name: string;
  type: string;
  category?: string;
  bg_image_url?: string;
  config_json: { elements: CertElement[]; design: CertDesign };
};

const CERT_TEMPLATES_DATA = [
  {
    id: "learnify-classic-navy-gold",
    name: "Classic Navy & Gold",
    category: "Professional",
    theme: { primary: "#0A1F44", secondary: "#D4AF37", accent: "#1E40AF", background: "#FFFFFF" },
    layout: "Landscape",
    style: "Corporate Luxury",
  },
  {
    id: "learnify-royal-purple",
    name: "Royal Purple Prestige",
    category: "Achievement",
    theme: { primary: "#5B21B6", secondary: "#EAB308", accent: "#8B5CF6", background: "#FFFFFF" },
    layout: "Landscape",
    style: "Prestige Award",
  },
  {
    id: "learnify-modern-glass",
    name: "Glassmorphism Future",
    category: "Technology",
    theme: { primary: "#2563EB", secondary: "#06B6D4", accent: "#8B5CF6", background: "#F8FAFC" },
    layout: "Landscape",
    style: "Futuristic SaaS",
  },
  {
    id: "learnify-black-gold",
    name: "Executive Black & Gold",
    category: "Executive",
    theme: { primary: "#111827", secondary: "#FBBF24", accent: "#F59E0B", background: "#0F172A" },
    layout: "Landscape",
    style: "Luxury Executive",
  },
  {
    id: "learnify-emerald-elite",
    name: "Emerald Elite",
    category: "Certification",
    theme: { primary: "#065F46", secondary: "#FBBF24", accent: "#10B981", background: "#FFFFFF" },
    layout: "Landscape",
    style: "Academic Excellence",
  },
];

const DYNAMIC_VARIABLES = [
  "{{student_name}}", "{{course_name}}", "{{completion_date}}", "{{issue_date}}",
  "{{certificate_id}}", "{{instructor_name}}", "{{organization_name}}",
  "{{verification_url}}", "{{linkedin_url}}", "{{skills_earned}}",
  "{{grade}}", "{{score}}", "{{duration}}", "{{credits}}",
];

const VERIFICATION_FEATURES = [
  "QR Verification", "Certificate ID", "Public Verification Page",
  "LinkedIn Sharing", "Download PDF", "Print Certificate", "Digital Seal", "Tamper Protection",
];

const THEMES = [
  { id: "classic", name: "Classic", accent: "#c9a84c", bg: "#fdfbf5", text: "#0f1b3d" },
  { id: "modern-blue", name: "Modern Blue", accent: "#2563eb", bg: "#f8fafc", text: "#1e293b" },
  { id: "elegant-purple", name: "Elegant Purple", accent: "#7c3aed", bg: "#faf5ff", text: "#1e1b4b" },
  { id: "dark-gold", name: "Dark Gold", accent: "#d4af37", bg: "#1a1a2e", text: "#e2e8f0" },
  { id: "emerald", name: "Emerald", accent: "#10b981", bg: "#f0fdf4", text: "#064e3b" },
];

const DEFAULT_ELEMENTS: CertElement[] = [
  { id: "1", type: "text", content: "CERTIFICATE", x: 421, y: 140, fontSize: 48, color: "#0f1b3d", fontFamily: "Playfair Display", align: "center", fontWeight: "bold", fontStyle: "normal", textDecoration: "none" },
  { id: "2", type: "text", content: "OF COMPLETION", x: 421, y: 190, fontSize: 20, color: "#c9a84c", fontFamily: "Playfair Display", align: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none" },
  { id: "3", type: "text", content: "This is to certify that", x: 421, y: 250, fontSize: 14, color: "#64748b", fontFamily: "Inter", align: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none" },
  { id: "4", type: "text", content: "{{student_name}}", x: 421, y: 290, fontSize: 36, color: "#0f1b3d", fontFamily: "Great Vibes", align: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none" },
  { id: "5", type: "text", content: "has successfully completed the course", x: 421, y: 340, fontSize: 14, color: "#64748b", fontFamily: "Inter", align: "center", fontWeight: "normal", fontStyle: "normal", textDecoration: "none" },
  { id: "6", type: "text", content: "{{course_name}}", x: 421, y: 380, fontSize: 22, color: "#2563eb", fontFamily: "Playfair Display", align: "center", fontWeight: "bold", fontStyle: "normal", textDecoration: "none" },
  { id: "7", type: "org_logo", x: 381, y: 440, width: 80, height: 80 },
];

function applyTheme(t: (typeof THEMES)[number]) {
  return { accent_color: t.accent, bg_color: t.bg, text_color: t.text, font_family: "Playfair Display", border_style: "double", border_width: 10, corner_style: "diagonal", background_pattern: "none", layout: "classic" };
}

function makeDefaultTemplate(): CertTemplate {
  const t = THEMES[0];
  return { id: crypto.randomUUID(), name: "New Template", type: t.name, config_json: { elements: [...DEFAULT_ELEMENTS], design: applyTheme(t) } };
}

const MOCK_CATEGORIES = [
  { id: "1", name: "Professional", count: 24, color: "#3b82f6" },
  { id: "2", name: "Achievement", count: 18, color: "#10b981" },
  { id: "3", name: "Technology", count: 12, color: "#f59e0b" },
  { id: "4", name: "Executive", count: 9, color: "#ec4899" },
  { id: "5", name: "Certification", count: 15, color: "#8b5cf6" },
  { id: "6", name: "Academic", count: 7, color: "#06b6d4" },
];

const MOCK_BULK_ISSUES = [
  { id: "1", date: "2026-06-25", count: 45, course: "Web Development Bootcamp", status: "completed", issuedBy: "Admin" },
  { id: "2", date: "2026-06-20", count: 32, course: "Data Structures & Algorithms", status: "completed", issuedBy: "Admin" },
  { id: "3", date: "2026-06-15", count: 28, course: "Python Programming Mastery", status: "completed", issuedBy: "System" },
  { id: "4", date: "2026-06-10", count: 56, course: "AI Fundamentals for Beginners", status: "completed", issuedBy: "Admin" },
  { id: "5", date: "2026-06-05", count: 18, course: "Machine Learning Bootcamp", status: "completed", issuedBy: "System" },
];

const MOCK_ANALYTICS = {
  totalIssued: 2847,
  verified: 2693,
  linkedinShares: 1843,
  activeTemplates: 5,
  monthlyGrowth: [120, 185, 232, 318, 395, 450, 388, 525, 640, 765, 880, 910],
  recentIssues: [
    { date: "2026-06-25", count: 45, course: "Web Development Bootcamp" },
    { date: "2026-06-20", count: 32, course: "Data Structures & Algorithms" },
    { date: "2026-06-15", count: 28, course: "Python Programming Mastery" },
  ],
};

const TAB_TOUR_INFO: Record<string, { title: string; whatIsIt: string; howToUse: string; whereItShows: string }> = {
  all: {
    title: "All Templates",
    whatIsIt: "The Certificate Designer where you create, edit, and manage all your certificate templates with a drag-and-drop visual editor.",
    howToUse: "Click 'New Template' to create from scratch, or hover any template card to Edit, Duplicate, or Delete it. Use the designer to add text, images, logos, and adjust colors/fonts.",
    whereItShows: "Templates appear in the certificate generation flow when students complete courses. The selected template is used to auto-generate their certificate.",
  },
  canva: {
    title: "Canva Templates",
    whatIsIt: "Upload and manage Canva-designed certificate templates as SVG or PNG files for use in your certificates.",
    howToUse: "Click 'Upload Template' to add a new Canva design. Hover any template to View, Edit, or Delete it. Drag and drop files or click to browse.",
    whereItShows: "Canva templates appear as options when generating certificates. Students can also see these designs on the Verified Certificates page.",
  },
  bulk: {
    title: "Bulk Issue",
    whatIsIt: "Issue certificates to multiple students at once by uploading a CSV file with student names, emails, and course details.",
    howToUse: "Upload a CSV file with columns: name, email, course. Click 'Preview & Issue' to review before sending. View history of past bulk issues below.",
    whereItShows: "Issued certificates appear in student dashboards, the public verification page, and can be shared on LinkedIn.",
  },
  analytics: {
    title: "Analytics",
    whatIsIt: "Track certificate issuance, verification rates, LinkedIn shares, and engagement trends over time.",
    howToUse: "View the stat cards for key metrics. The bar chart shows monthly issuance trends. Use this data to understand certificate engagement.",
    whereItShows: "Analytics data is aggregated from all certificate issuances across the platform. Numbers update in real-time.",
  },
  categories: {
    title: "Categories",
    whatIsIt: "Organize your certificate templates into categories (Professional, Achievement, Technology, etc.) for easy browsing and management.",
    howToUse: "Click 'Add Category' to create a new one with a name and color. Hover any category to Edit or Delete it. Use search to filter.",
    whereItShows: "Categories help organize templates in the admin panel. They may also appear as filters on the public certificates page.",
  },
};

function AdminCertificatesPage() {
  const { isAdmin } = useAuth();
  const qc = useQueryClient();
  const getTemplates = useServerFn(listTemplates);
  const saveTemp = useServerFn(saveTemplate);
  const delTemp = useServerFn(deleteTemplate);

  const [activeTab, setActiveTab] = useState("templates");
  const [activeSubTab, setActiveSubTab] = useState("all");
  const [active, setActive] = useState<CertTemplate | null>(null);
  const [selectedEl, setSelectedEl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [viewTemplate, setViewTemplate] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [categorySearch, setCategorySearch] = useState("");
  const [templateSearch, setTemplateSearch] = useState("");
  const [bulkSearch, setBulkSearch] = useState("");
  const [showTour, setShowTour] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [uploadedCanvaTemplates, setUploadedCanvaTemplates] = useState<Array<{ id: string; name: string; src: string; type: string; category: string }>>([]);
  const canvaFileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const q = useQuery({
    enabled: !!isAdmin,
    queryKey: ["admin-cert-templates"],
    queryFn: () => getTemplates(),
  });

  if (!isAdmin)
    return (
      <AppShell>
        <div className="p-10 text-center">Unauthorized</div>
      </AppShell>
    );

  const dbTemplates = q.data ?? [];
  const allTemplates = useMemo(() => {
    const seen = new Set<string>();
    const merged: any[] = [];
    for (const t of CERT_TEMPLATES_DATA) {
      if (!seen.has(t.id)) {
        seen.add(t.id);
        merged.push({ ...t, config_json: { elements: [...DEFAULT_ELEMENTS], design: applyTheme(THEMES[0]) } });
      }
    }
    for (const t of dbTemplates) {
      if (!seen.has(t.id)) {
        seen.add(t.id);
        merged.push(t);
      }
    }
    return merged;
  }, [dbTemplates]);

  const filteredTemplates = allTemplates.filter((t: any) =>
    t.name?.toLowerCase().includes(templateSearch.toLowerCase()) ||
    t.category?.toLowerCase().includes(templateSearch.toLowerCase())
  );

  const filteredBulkIssues = MOCK_BULK_ISSUES.filter((b) =>
    b.course.toLowerCase().includes(bulkSearch.toLowerCase())
  );

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const handleCreate = () => setActive(makeDefaultTemplate());

  const handleSaveTemplate = async (template: CertTemplate) => {
    setSaving(true);
    try {
      await saveTemp({ data: template });
      toast.success("Template saved!");
      qc.invalidateQueries({ queryKey: ["admin-cert-templates"] });
      setActive(null);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!deleteConfirm) return;
    try {
      await delTemp({ data: { id: deleteConfirm.id } });
      toast.success("Template deleted");
      qc.invalidateQueries({ queryKey: ["admin-cert-templates"] });
    } catch (e: any) {
      toast.error(e.message);
    }
    setDeleteConfirm(null);
  };

  const handleDuplicate = async (template: any) => {
    const dup = { ...template, id: crypto.randomUUID(), name: `${template.name} (Copy)` };
    try {
      await saveTemp({ data: dup });
      toast.success("Template duplicated");
      qc.invalidateQueries({ queryKey: ["admin-cert-templates"] });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const updateActiveEl = (updates: Partial<CertElement>) => {
    if (!active || !selectedEl) return;
    setActive({
      ...active,
      config_json: {
        ...active.config_json,
        elements: active.config_json.elements.map((e) => e.id === selectedEl ? { ...e, ...updates } : e),
      },
    });
  };

  const updateDesign = (updates: Partial<CertDesign>) => {
    if (!active) return;
    setActive({ ...active, config_json: { ...active.config_json, design: { ...active.config_json.design, ...updates } } });
  };

  const applyThemeColors = (themeId: string) => {
    const t = THEMES.find((th) => th.name === themeId || th.id === themeId);
    if (!t) return;
    setActive({ ...active!, type: t.name, config_json: { ...active!.config_json, design: { ...active!.config_json.design, ...applyTheme(t) } } });
  };

  const addText = () => {
    if (!active) return;
    setActive({ ...active, config_json: { ...active.config_json, elements: [...active.config_json.elements, { id: crypto.randomUUID(), type: "text", content: "New Text", x: 100, y: 100, fontSize: 24, color: active.config_json.design.text_color, fontFamily: active.config_json.design.font_family, align: "left", fontWeight: "normal", fontStyle: "normal", textDecoration: "none" }] } });
  };

  const addImage = () => {
    if (!active) return;
    setActive({ ...active, config_json: { ...active.config_json, elements: [...active.config_json.elements, { id: crypto.randomUUID(), type: "image", url: "", x: 100, y: 100, width: 160, height: 120 }] } });
  };

  const addOrgLogo = () => {
    if (!active) return;
    setActive({ ...active, config_json: { ...active.config_json, elements: [...active.config_json.elements, { id: crypto.randomUUID(), type: "org_logo", x: 60, y: 40, width: 100, height: 100 }] } });
  };

  const handleAddCategory = () => setEditingCategory({ id: crypto.randomUUID(), name: "", color: "#3b82f6", count: 0 });

  const handleSaveCategory = () => {
    if (!editingCategory?.name) { toast.error("Category name is required"); return; }
    if (categories.some((c) => c.id === editingCategory.id)) {
      setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? editingCategory : c)));
      toast.success("Category updated");
    } else {
      setCategories((prev) => [...prev, editingCategory]);
      toast.success("Category added");
    }
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    if (!confirm("Delete this category?")) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("Category deleted");
  };

  const getPatternStyle = (pattern: string, bg: string, accent: string) => {
    switch (pattern) {
      case "dots": return { backgroundImage: `radial-gradient(${accent}66 1.5px, transparent 1.5px)`, backgroundSize: "12px 12px", backgroundColor: bg };
      case "grid": return { backgroundImage: `linear-gradient(${accent}44 1px, transparent 1px), linear-gradient(90deg, ${accent}44 1px, transparent 1px)`, backgroundSize: "16px 16px", backgroundColor: bg };
      case "diagonal": return { backgroundImage: `repeating-linear-gradient(45deg, ${accent}22 0 1px, transparent 1px 8px)`, backgroundColor: bg };
      case "gradient": return { background: `linear-gradient(135deg, ${bg} 0%, ${accent}44 100%)` };
      default: return { backgroundColor: bg };
    }
  };

  const renderTemplateCard = (t: any, idx: number) => {
    const theme = t.theme || { primary: "#0A1F44", secondary: "#D4AF37", background: "#FFFFFF" };
    return (
      <motion.div
        key={t.id || idx}
        className="rounded-xl border bg-card overflow-hidden group hover:shadow-lg transition-all"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: idx * 0.03 }}
      >
        <div
          className="aspect-[1.414] relative overflow-hidden cursor-pointer"
          style={{ background: theme.background || theme.primary }}
          onClick={() => setViewTemplate(t)}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${theme.primary}15, ${theme.secondary}25)` }}>
            <div className="w-12 h-12 rounded-full mb-2 flex items-center justify-center" style={{ background: theme.primary }}>
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: theme.primary }}>Certificate</div>
            <div className="text-[10px] text-center" style={{ color: theme.secondary }}>of Completion</div>
            <div className="w-16 h-px my-2" style={{ background: theme.secondary }} />
            <div className="text-[10px] italic" style={{ color: theme.primary + "99" }}>Student Name</div>
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); setViewTemplate(t); }}><Eye className="h-4 w-4 mr-1" /> View</Button>
            <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); setActive({ ...t, config_json: { elements: [...DEFAULT_ELEMENTS], design: applyTheme(THEMES[0]) } }); }}><Edit3 className="h-4 w-4 mr-1" /> Edit</Button>
            <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); handleDuplicate(t); }}><Copy className="h-4 w-4 mr-1" /> Duplicate</Button>
            <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ id: t.id, name: t.name }); }}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="p-3 border-t">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold truncate">{t.name}</h3>
            {t.category && <Badge variant="secondary" className="text-[9px] shrink-0">{t.category}</Badge>}
          </div>
          {t.style && <p className="text-[10px] text-muted-foreground mt-0.5">{t.style}</p>}
        </div>
      </motion.div>
    );
  };

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" /> Certificates
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage templates, bulk issue, analytics, and categories.</p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-0.5 mb-8 border-b border-border overflow-x-auto pb-0">
          {[
            { id: "all", label: "All Templates", icon: LayoutGrid },
            { id: "canva", label: "Canva Templates", icon: LayoutTemplate },
            { id: "bulk", label: "Bulk Issue", icon: Upload },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "categories", label: "Categories", icon: FolderTree },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <div key={tab.id} className="flex items-center gap-0.5">
                <button
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-[1px] ${
                    isActive
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
                <button
                  onClick={() => setShowTour(showTour === tab.id ? null : tab.id)}
                  className={`text-muted-foreground hover:text-foreground transition-colors p-1 rounded mb-0.5 ${isActive ? "text-primary/60 hover:text-primary" : ""}`}
                  title={`What is ${tab.label}?`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Tour Popup */}
        <AnimatePresence>
          {showTour && TAB_TOUR_INFO[showTour] && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
              <div className="rounded-xl border bg-gradient-to-br from-primary/5 via-background to-primary/10 p-6 relative">
                <button onClick={() => setShowTour(null)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                <div className="flex items-center gap-2 mb-3">
                  <Info className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">{TAB_TOUR_INFO[showTour].title}</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="rounded-lg bg-background/80 p-4 border">
                    <div className="flex items-center gap-2 mb-2"><HelpCircle className="h-4 w-4 text-blue-500" /><span className="text-xs font-semibold uppercase text-blue-600">What is this?</span></div>
                    <p className="text-sm text-muted-foreground">{TAB_TOUR_INFO[showTour].whatIsIt}</p>
                  </div>
                  <div className="rounded-lg bg-background/80 p-4 border">
                    <div className="flex items-center gap-2 mb-2"><ArrowRight className="h-4 w-4 text-emerald-500" /><span className="text-xs font-semibold uppercase text-emerald-600">How to use</span></div>
                    <p className="text-sm text-muted-foreground">{TAB_TOUR_INFO[showTour].howToUse}</p>
                  </div>
                  <div className="rounded-lg bg-background/80 p-4 border">
                    <div className="flex items-center gap-2 mb-2"><Globe className="h-4 w-4 text-purple-500" /><span className="text-xs font-semibold uppercase text-purple-600">Where it shows</span></div>
                    <p className="text-sm text-muted-foreground">{TAB_TOUR_INFO[showTour].whereItShows}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== ALL TEMPLATES ===== */}
        {activeSubTab === "all" && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 shrink-0 hidden sm:block"><img src="/illustrations/Cyber_Security.svg" alt="" className="w-full h-full" loading="lazy" /></div>
                <div>
                  <h2 className="text-xl font-display font-semibold">Certificate Designer</h2>
                  <p className="text-muted-foreground text-sm mt-1">Design verifiable professional credentials with drag-and-drop.</p>
                </div>
              </div>
              {!active && (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search templates..." value={templateSearch} onChange={(e) => setTemplateSearch(e.target.value)} className="pl-9 w-56" />
                  </div>
                  <Button onClick={handleCreate}><Plus className="h-4 w-4" /> New Template</Button>
                </div>
              )}
            </div>
            {!active ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {filteredTemplates.map((t: any, i: number) => renderTemplateCard(t, i))}
                {filteredTemplates.length === 0 && !q.isLoading && (
                  <div className="col-span-full py-12 text-center text-muted-foreground">No templates found. Create your first one!</div>
                )}
              </div>
            ) : (
              <DesignerWorkspace initialTemplate={active as any} onSave={handleSaveTemplate as any} onClose={() => setActive(null)} />
            )}
          </>
        )}

        {/* ===== CANVA TEMPLATES ===== */}
        {activeSubTab === "canva" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h2 className="text-xl font-semibold">Canva Templates</h2><p className="text-sm text-muted-foreground">Upload and manage Canva-designed certificate templates.</p></div>
              <Button onClick={() => canvaFileInputRef.current?.click()}><Upload className="h-4 w-4 mr-2" /> Upload Template</Button>
              <input ref={canvaFileInputRef} type="file" accept=".svg,.png,.jpg,.jpeg" multiple className="hidden" onChange={(e) => {
                const files = e.target.files;
                if (!files) return;
                const newTemplates = Array.from(files).map((file) => ({
                  id: crypto.randomUUID(),
                  name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
                  src: URL.createObjectURL(file),
                  type: file.name.split(".").pop() || "svg",
                  category: "Uploaded",
                }));
                setUploadedCanvaTemplates((prev) => [...prev, ...newTemplates]);
                e.target.value = "";
              }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {uploadedCanvaTemplates.map((tmpl) => (
                <div key={tmpl.id} className="rounded-xl border bg-card overflow-hidden group">
                  <div className="aspect-[800/560] bg-muted overflow-hidden relative">
                    <img src={tmpl.src} alt={tmpl.name} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary"><Eye className="h-4 w-4 mr-1" /> View</Button>
                      <Button size="sm" variant="secondary"><Edit3 className="h-4 w-4 mr-1" /> Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => setUploadedCanvaTemplates((prev) => prev.filter((t) => t.id !== tmpl.id))}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="p-4"><h3 className="text-sm font-semibold">{tmpl.name}</h3><Badge variant="secondary" className="text-[9px] mt-1">{tmpl.category}</Badge></div>
                </div>
              ))}
              {[
                { name: "Blue & Gold Classic", src: "/certificate 0.png", type: "png", category: "Professional" },
                { name: "Purple & Gold Prestige", src: "/certificate 01.png", type: "png", category: "Achievement" },
                { name: "Emerald & Gold Elite", src: "/certificate 02.png", type: "png", category: "Executive" },
              ].map((tmpl) => (
                <div key={tmpl.name} className="rounded-xl border bg-card overflow-hidden group">
                  <div className="aspect-[800/560] bg-muted overflow-hidden relative">
                    <img src={tmpl.src} alt={tmpl.name} className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary"><Eye className="h-4 w-4 mr-1" /> View</Button>
                      <Button size="sm" variant="secondary"><Edit3 className="h-4 w-4 mr-1" /> Edit</Button>
                      <Button size="sm" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="p-4"><h3 className="text-sm font-semibold">{tmpl.name}</h3><Badge variant="secondary" className="text-[9px] mt-1">{tmpl.category}</Badge></div>
                </div>
              ))}
              <div className={`rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer min-h-[200px] ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/40"}`}
                onClick={() => canvaFileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); const files = e.dataTransfer.files; if (!files) return; const newTemplates = Array.from(files).filter((f) => f.type === "image/svg+xml" || f.type.startsWith("image/")).map((file) => ({ id: crypto.randomUUID(), name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "), src: URL.createObjectURL(file), type: file.name.split(".").pop() || "svg", category: "Uploaded" })); setUploadedCanvaTemplates((prev) => [...prev, ...newTemplates]); }}>
                <Upload className="h-8 w-8 text-muted-foreground mb-2" /><p className="text-sm font-medium">Drop SVG or PNG</p><p className="text-xs text-muted-foreground mt-1">or click to browse</p>
              </div>
            </div>
          </div>
        )}

        {/* ===== BULK ISSUE ===== */}
        {activeSubTab === "bulk" && (
          <div className="space-y-6">
            <div><h2 className="text-xl font-semibold">Bulk Issue Certificates</h2><p className="text-sm text-muted-foreground">Issue certificates to multiple students at once.</p></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold mb-2">Upload CSV</h3>
                <p className="text-xs text-muted-foreground mb-4">CSV format: name, email, course, date. Supports up to 500 rows per batch.</p>
                <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm font-medium">Choose CSV file</p><p className="text-xs text-muted-foreground mt-1">or drag and drop</p>
                </div>
                <Button className="w-full mt-4"><Users className="h-4 w-4 mr-2" /> Preview & Issue</Button>
              </div>
              <div className="rounded-xl border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Recent Bulk Issues</h3>
                  <div className="relative"><Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search..." value={bulkSearch} onChange={(e) => setBulkSearch(e.target.value)} className="pl-7 w-40 h-8 text-xs" /></div>
                </div>
                <div className="space-y-2">
                  {filteredBulkIssues.map((issue) => (
                    <div key={issue.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                      <div>
                        <div className="text-sm font-medium">{issue.course}</div>
                        <div className="text-xs text-muted-foreground">{issue.date} · {issue.count} certificates · by {issue.issuedBy}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-[10px]"><CheckCircle2 className="h-3 w-3 mr-1" />{issue.status}</Badge>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Eye className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Download className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== ANALYTICS ===== */}
        {activeSubTab === "analytics" && (
          <div className="space-y-6">
            <div><h2 className="text-xl font-semibold">Certificate Analytics</h2><p className="text-sm text-muted-foreground">Track certificate issuance, verification, and engagement.</p></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Issued", value: MOCK_ANALYTICS.totalIssued.toLocaleString(), change: "+23%", color: "text-emerald-600", icon: Award },
                { label: "Verified", value: MOCK_ANALYTICS.verified.toLocaleString(), change: "+18%", color: "text-emerald-600", icon: CheckCircle2 },
                { label: "LinkedIn Shares", value: MOCK_ANALYTICS.linkedinShares.toLocaleString(), change: "+12%", color: "text-emerald-600", icon: Share2 },
                { label: "Active Templates", value: MOCK_ANALYTICS.activeTemplates.toString(), change: "+2", color: "text-emerald-600", icon: FileText },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border bg-card p-5">
                  <div className="flex items-center justify-between mb-2"><div className="text-xs text-muted-foreground">{stat.label}</div><stat.icon className="h-4 w-4 text-muted-foreground" /></div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 mt-1"><TrendingUp className={`h-3 w-3 ${stat.color}`} /><span className={`text-xs font-medium ${stat.color}`}>{stat.change}</span><span className="text-xs text-muted-foreground">vs last month</span></div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 rounded-xl border bg-card p-6">
                <h3 className="font-semibold mb-4">Issuance Trend (2026)</h3>
                <div className="flex items-end gap-1.5 h-48">
                  {MOCK_ANALYTICS.monthlyGrowth.map((val, i) => {
                    const max = Math.max(...MOCK_ANALYTICS.monthlyGrowth);
                    const h = (val / max) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[9px] text-muted-foreground">{val}</span>
                        <div className="w-full rounded-t bg-primary/80 hover:bg-primary transition-colors cursor-pointer" style={{ height: `${h}%` }} title={`${val} certificates`} />
                        <span className="text-[9px] text-muted-foreground">{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold mb-3">Recent Issues</h3>
                <div className="space-y-3">
                  {MOCK_ANALYTICS.recentIssues.map((issue, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Award className="h-4 w-4 text-primary" /></div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{issue.course}</div>
                        <div className="text-xs text-muted-foreground">{issue.date} · {issue.count} certs</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== CATEGORIES ===== */}
        {activeSubTab === "categories" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h2 className="text-xl font-semibold">Certificate Categories</h2><p className="text-sm text-muted-foreground">Organize templates into categories for easy browsing.</p></div>
              <div className="flex items-center gap-2">
                <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={categorySearch} onChange={(e) => setCategorySearch(e.target.value)} className="pl-9 w-48" /></div>
                <Button onClick={handleAddCategory}><Plus className="h-4 w-4 mr-2" /> Add Category</Button>
              </div>
            </div>
            {editingCategory && (
              <div className="rounded-xl border bg-card p-6 space-y-4">
                <h3 className="font-semibold">{categories.some((c) => c.id === editingCategory.id) ? "Edit" : "New"} Category</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Name</Label><Input value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} placeholder="Category name" /></div>
                  <div><Label>Color</Label><div className="flex items-center gap-2"><input type="color" value={editingCategory.color} onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })} className="w-10 h-10 rounded border cursor-pointer" /><Input value={editingCategory.color} onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })} /></div></div>
                </div>
                <div className="flex gap-2"><Button onClick={handleSaveCategory}><Save className="h-4 w-4 mr-2" /> Save</Button><Button variant="ghost" onClick={() => setEditingCategory(null)}>Cancel</Button></div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredCategories.map((cat) => (
                <div key={cat.id} className="rounded-xl border bg-card p-5 flex items-center justify-between group hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: cat.color }}>{cat.name[0]}</div>
                    <div><h3 className="text-sm font-semibold">{cat.name}</h3><p className="text-xs text-muted-foreground">{cat.count} templates</p></div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setEditingCategory(cat)}><Edit3 className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleDeleteCategory(cat.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View Template Dialog */}
        {viewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setViewTemplate(null)}>
            <motion.div className="bg-background rounded-2xl border shadow-2xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{viewTemplate.name}</h3>
                  {viewTemplate.category && <Badge variant="secondary" className="text-xs mt-1">{viewTemplate.category}</Badge>}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setViewTemplate(null)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="aspect-[1.414] rounded-lg overflow-hidden border bg-muted mb-4">
                <div className="w-full h-full flex flex-col items-center justify-center p-8" style={{ background: `linear-gradient(135deg, ${viewTemplate.theme?.primary || "#0A1F44"}10, ${viewTemplate.theme?.secondary || "#D4AF37"}20)` }}>
                  <div className="w-16 h-16 rounded-full mb-3 flex items-center justify-center" style={{ background: viewTemplate.theme?.primary || "#0A1F44" }}><Award className="h-8 w-8 text-white" /></div>
                  <div className="text-sm font-bold tracking-widest uppercase mb-1" style={{ color: viewTemplate.theme?.primary || "#0A1F44" }}>Certificate of Completion</div>
                  <div className="w-20 h-px my-3" style={{ background: viewTemplate.theme?.secondary || "#D4AF37" }} />
                  <div className="text-lg italic" style={{ color: viewTemplate.theme?.primary || "#0A1F44" + "99" }}>Student Name</div>
                  <div className="text-xs text-muted-foreground mt-2">Course Name</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-4">
                <div><span className="font-medium text-foreground">Style:</span> {viewTemplate.style || "Professional"}</div>
                <div><span className="font-medium text-foreground">Layout:</span> {viewTemplate.layout || "Landscape"}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => { setViewTemplate(null); setActive({ ...viewTemplate, config_json: { elements: [...DEFAULT_ELEMENTS], design: applyTheme(THEMES[0]) } }); }}><Edit3 className="h-4 w-4 mr-2" /> Edit</Button>
                <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Download</Button>
                <Button variant="outline"><ExternalLink className="h-4 w-4 mr-2" /> Open in Canva</Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
            <motion.div className="bg-background rounded-2xl border shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center"><Trash2 className="h-5 w-5 text-destructive" /></div>
                <div><h3 className="font-semibold">Delete Template?</h3><p className="text-sm text-muted-foreground">This action cannot be undone.</p></div>
              </div>
              <p className="text-sm mb-6">Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteTemplate}><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
