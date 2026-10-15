import { useState, useRef, useEffect } from "react";
import {
  LayoutTemplate,
  Type,
  Shapes,
  Award,
  PenTool,
  Palette,
  Layers,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Eraser,
  Check,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CertElement,
  CertDesign,
  ShapeType,
  FONTS,
  COLOR_PALETTES,
  PATTERN_OPTIONS,
  BORDER_OPTIONS,
} from "./types";
import { toast } from "sonner";

type CanvaLeftDockProps = {
  elements: CertElement[];
  design: CertDesign;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onAddElement: (type: CertElement["type"], overrides?: Partial<CertElement>) => void;
  onAddShape: (shapeType: ShapeType) => void;
  onAddSvg: (svg: string, name: string) => void;
  onAddDivider: (thickness?: number, style?: string) => void;
  onUploadImage: (file: File) => void;
  onUpdateElement: (id: string, updates: Partial<CertElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onUpdateDesign: (updates: Partial<CertDesign>) => void;
  onUpdateBgImageUrl: (url: string) => void;
  bgImageUrl?: string;
  onApplyTemplatePreset: (preset: any) => void;
};

type ActiveDockTab =
  | "templates"
  | "text"
  | "elements"
  | "badges"
  | "signatures"
  | "background"
  | "layers"
  | null;

// 8 Master Luxury Certificate Presets
const TEMPLATE_PRESETS = [
  {
    id: "classic-gold",
    name: "Classic Gold Prestige",
    category: "Academic & Corporate",
    bg_color: "#FAF8F5",
    accent_color: "#D4AF37",
    text_color: "#0F172A",
    font_family: "Playfair Display",
    border_style: "double",
    border_width: 8,
    corner_style: "diagonal",
    background_pattern: "none",
    badgeContent: "GOLD HONORS",
  },
  {
    id: "royal-crest",
    name: "Royal Crest Navy",
    category: "Executive Diploma",
    bg_color: "#0A1628",
    accent_color: "#F59E0B",
    text_color: "#FFFFFF",
    font_family: "Cinzel",
    border_style: "ornate",
    border_width: 6,
    corner_style: "ribbon",
    background_pattern: "guilloche",
    badgeContent: "OFFICIAL SEAL",
  },
  {
    id: "modern-minimal",
    name: "Modern Minimalist",
    category: "Tech & Professional",
    bg_color: "#FFFFFF",
    accent_color: "#2563EB",
    text_color: "#1E293B",
    font_family: "Inter",
    border_style: "solid",
    border_width: 4,
    corner_style: "none",
    background_pattern: "dots",
    badgeContent: "VERIFIED TECH",
  },
  {
    id: "cyber-neo",
    name: "Cyber Security Specialist",
    category: "High-Tech Security",
    bg_color: "#080A13",
    accent_color: "#00F2FE",
    text_color: "#F1F5F9",
    font_family: "Space Grotesk",
    border_style: "dashed",
    border_width: 3,
    corner_style: "diagonal",
    background_pattern: "mesh",
    badgeContent: "SECURITY VERIFIED",
  },
  {
    id: "academic-honors",
    name: "Grand Academic Honors",
    category: "University Accreditations",
    bg_color: "#FDFBF7",
    accent_color: "#991B1B",
    text_color: "#18181B",
    font_family: "Cormorant Garamond",
    border_style: "ornate",
    border_width: 7,
    corner_style: "ribbon",
    background_pattern: "waves",
    badgeContent: "SUMMA CUM LAUDE",
  },
  {
    id: "calligraphy-luxury",
    name: "Bespoke Calligraphy",
    category: "Art & Masterclasses",
    bg_color: "#FFFDF9",
    accent_color: "#047857",
    text_color: "#1C1917",
    font_family: "Great Vibes",
    border_style: "double",
    border_width: 5,
    corner_style: "diagonal",
    background_pattern: "gradient",
    badgeContent: "MASTER ARTISAN",
  },
  {
    id: "guilloche-security",
    name: "Guilloche High Security",
    category: "Tamper-Proof Banking",
    bg_color: "#F8FAFC",
    accent_color: "#0D9488",
    text_color: "#0F172A",
    font_family: "Space Grotesk",
    border_style: "ornate",
    border_width: 8,
    corner_style: "diagonal",
    background_pattern: "guilloche",
    badgeContent: "CRYPTOGRAPHIC QR",
  },
  {
    id: "executive-diploma",
    name: "Executive Post-Graduate",
    category: "Management & MBA",
    bg_color: "#020617",
    accent_color: "#FBBF24",
    text_color: "#F8FAFC",
    font_family: "Cinzel",
    border_style: "double",
    border_width: 9,
    corner_style: "none",
    background_pattern: "gradient",
    badgeContent: "EXECUTIVE BOARD",
  },
];

// Dynamic Certificate Tokens for fast Canva insertion
const DYNAMIC_TOKENS = [
  { token: "{student_name}", label: "Student Name", sub: "Recipient full name", font: "Great Vibes", size: 40 },
  { token: "{course_name}", label: "Course Title", sub: "Completed credential", font: "Space Grotesk", size: 24 },
  { token: "{issue_date}", label: "Issue Date", sub: "Formatted completion date", font: "Inter", size: 14 },
  { token: "{certificate_id}", label: "Certificate ID", sub: "Unique verification code", font: "monospace", size: 12 },
  { token: "{instructor_name}", label: "Instructor Signatory", sub: "Lead professor name", font: "Playfair Display", size: 16 },
  { token: "{grade}", label: "Honors / Grade", sub: "Score distinction badge", font: "Inter", size: 14 },
  { token: "{expiry_date}", label: "Expiry Date", sub: "Lifetime validity", font: "Inter", size: 12 },
  { token: "{score}", label: "Assessment Score", sub: "Percentage / GPA", font: "Inter", size: 14 },
];

export function CanvaLeftDock({
  elements,
  design,
  selectedId,
  onSelect,
  onAddElement,
  onAddShape,
  onAddSvg,
  onAddDivider,
  onUploadImage,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onUpdateDesign,
  onUpdateBgImageUrl,
  bgImageUrl,
  onApplyTemplatePreset,
}: CanvaLeftDockProps) {
  const [activeTab, setActiveTab] = useState<ActiveDockTab>("templates");
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Signature Pad State
  const canvasSignatureRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState("#000000");
  const [penWidth, setPenWidth] = useState(3);
  const [hasSignatureDrawing, setHasSignatureDrawing] = useState(false);

  // Signature drawing canvas listeners
  useEffect(() => {
    if (activeTab !== "signatures") return;
    const canvas = canvasSignatureRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasSignatureRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignatureDrawing(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasSignatureRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignaturePad = () => {
    const canvas = canvasSignatureRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignatureDrawing(false);
  };

  const insertSignatureToCanvas = () => {
    const canvas = canvasSignatureRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    onAddElement("image", {
      url: dataUrl,
      width: 180,
      height: 70,
      label: "Drawn Digital Signature",
    });
    toast.success("Signature added to certificate!");
    clearSignaturePad();
  };

  const toggleTab = (tab: ActiveDockTab) => {
    if (activeTab === tab && isDrawerOpen) {
      setIsDrawerOpen(false);
    } else {
      setActiveTab(tab);
      setIsDrawerOpen(true);
    }
  };

  const dockIcons = [
    { id: "templates", label: "Templates", icon: LayoutTemplate },
    { id: "text", label: "Text", icon: Type },
    { id: "elements", label: "Elements", icon: Shapes },
    { id: "badges", label: "Badges", icon: Award },
    { id: "signatures", label: "Signatures", icon: PenTool },
    { id: "background", label: "Background", icon: Palette },
    { id: "layers", label: "Layers", icon: Layers },
  ] as const;

  return (
    <div className="flex h-full select-none z-30 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      {/* 1. LEFT ICON RAIL (Canva-style 68px width) */}
      <div className="w-[68px] flex flex-col items-center py-3 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0">
        <div className="space-y-1 w-full px-1.5">
          {dockIcons.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id && isDrawerOpen;
            return (
              <button
                key={item.id}
                onClick={() => toggleTab(item.id)}
                className={`w-full flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                  isActive
                    ? "bg-white dark:bg-slate-800 text-primary shadow-xs font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                }`}
                title={item.label}
              >
                <Icon className={`h-5 w-5 mb-1 ${isActive ? "text-primary" : ""}`} />
                <span className="text-[10px] tracking-tight leading-none truncate max-w-full">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. EXPANDABLE FLYOUT DRAWER (320px width) */}
      {isDrawerOpen && activeTab && (
        <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full animate-in slide-in-from-left-4 duration-150">
          {/* Drawer Header */}
          <div className="h-12 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              {activeTab === "templates" && "Master Certificate Templates"}
              {activeTab === "text" && "Add Text & Dynamic Fields"}
              {activeTab === "elements" && "Shapes, Lines & Dividers"}
              {activeTab === "badges" && "Seals, Medallions & Crests"}
              {activeTab === "signatures" && "Digital Signatures & Pad"}
              {activeTab === "background" && "Textures & Security Patterns"}
              {activeTab === "layers" && "Element Layer Hierarchy"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              onClick={() => setIsDrawerOpen(false)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* ─── TAB: TEMPLATES ─── */}
            {activeTab === "templates" && (
              <div className="space-y-3">
                <p className="text-[11px] text-slate-500">
                  Select a master luxury template. Click to switch design, color palette, and border styles.
                </p>
                <div className="grid grid-cols-1 gap-2.5">
                  {TEMPLATE_PRESETS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onApplyTemplatePreset(t);
                        toast.success(`Applied ${t.name}`);
                      }}
                      className="group p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 text-left transition-all hover:shadow-md bg-white dark:bg-slate-800/50 flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
                          {t.name}
                        </span>
                        <div className="flex gap-1">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300"
                            style={{ backgroundColor: t.accent_color }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300"
                            style={{ backgroundColor: t.bg_color }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{t.category}</span>
                        <span className="font-mono">{t.font_family}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─── TAB: TEXT ─── */}
            {activeTab === "text" && (
              <div className="space-y-4">
                {/* Standard Text Additions */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Standard Text
                  </span>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-11 text-base font-bold font-display"
                    onClick={() =>
                      onAddElement("text", {
                        content: "CERTIFICATE OF ACHIEVEMENT",
                        fontSize: 34,
                        fontWeight: "bold",
                        fontFamily: design.font_family,
                        align: "center",
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add a Heading
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-9 text-sm font-semibold"
                    onClick={() =>
                      onAddElement("text", {
                        content: "THIS IS PROUDLY PRESENTED TO",
                        fontSize: 16,
                        fontWeight: "600",
                        letterSpacing: 3,
                        align: "center",
                      })
                    }
                  >
                    <Plus className="h-3.5 w-3.5 mr-2" /> Add a Subheading
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-8 text-xs font-normal"
                    onClick={() =>
                      onAddElement("text", {
                        content: "for successfully mastering and completing the intensive professional certification program.",
                        fontSize: 12,
                        align: "center",
                      })
                    }
                  >
                    <Plus className="h-3.5 w-3.5 mr-2" /> Add Body Paragraph
                  </Button>
                </div>

                {/* Dynamic Credential Tokens */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Dynamic Credential Tokens
                    </span>
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Inserted tokens automatically populate with learner records upon issuance.
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {DYNAMIC_TOKENS.map((token) => (
                      <button
                        key={token.token}
                        onClick={() =>
                          onAddElement("text", {
                            content: token.token,
                            fontSize: token.size,
                            fontFamily: token.font,
                            align: "center",
                            color: token.token === "{student_name}" ? design.accent_color : design.text_color,
                            fontWeight: token.token === "{course_name}" ? "bold" : "normal",
                          })
                        }
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary/50 text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 font-mono">
                            {token.token}
                          </div>
                          <div className="text-[10px] text-slate-500">{token.sub}</div>
                        </div>
                        <Plus className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB: ELEMENTS ─── */}
            {activeTab === "elements" && (
              <div className="space-y-4">
                {/* Geometric Shapes */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Geometric Shapes
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "rect", label: "Rectangle" },
                      { id: "circle", label: "Circle" },
                      { id: "diamond", label: "Diamond" },
                      { id: "triangle", label: "Triangle" },
                      { id: "hexagon", label: "Hexagon" },
                      { id: "star", label: "Star" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => onAddShape(s.id as ShapeType)}
                        className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary text-center transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col items-center justify-center gap-1.5"
                      >
                        <div
                          className="w-6 h-6 border-2 border-slate-700 dark:border-slate-300"
                          style={{
                            borderRadius: s.id === "circle" ? "50%" : s.id === "rect" ? "4px" : "0",
                            transform: s.id === "diamond" ? "rotate(45deg) scale(0.7)" : undefined,
                          }}
                        />
                        <span className="text-[9px] text-slate-600 dark:text-slate-400 font-medium truncate w-full">
                          {s.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider Lines */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Divider Lines & Rules
                  </span>
                  <div className="space-y-2">
                    <button
                      onClick={() => onAddDivider(2, "solid")}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col gap-1.5"
                    >
                      <span className="text-xs font-semibold">Hairline Gold Line (2px)</span>
                      <div className="w-full h-0.5 bg-amber-500 rounded-full" />
                    </button>
                    <button
                      onClick={() => onAddDivider(6, "double")}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col gap-1.5"
                    >
                      <span className="text-xs font-semibold">Double Oxford Rule (6px)</span>
                      <div className="w-full border-t-2 border-b-2 border-amber-500 h-1.5" />
                    </button>
                    <button
                      onClick={() =>
                        onAddElement("svg", {
                          svgContent: `<svg viewBox="0 0 300 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 12H120M180 12H300M150 4L158 12L150 20L142 12Z" stroke="currentColor" stroke-width="2"/><circle cx="150" cy="12" r="3" fill="currentColor"/></svg>`,
                          width: 320,
                          height: 24,
                          svgColor: design.accent_color,
                          label: "Rosette Crest Divider",
                        })
                      }
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col gap-1.5"
                    >
                      <span className="text-xs font-semibold">Filigree Rosette Crest Rule</span>
                      <div className="text-amber-500 text-[10px] text-center font-serif">─── ◆ ───</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB: BADGES & SEALS ─── */}
            {activeTab === "badges" && (
              <div className="space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Official Seals & Accreditations
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* 16-point Gold Starburst Seal */}
                  <button
                    onClick={() =>
                      onAddElement("svg", {
                        svgContent: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="50" cy="50" r="42" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="3" stroke-dasharray="2 3"/>
                          <circle cx="50" cy="50" r="36" stroke="currentColor" stroke-width="1.5"/>
                          <path d="M50 18L53 25H60L54 29L57 36L50 31L43 36L46 29L40 25H47L50 18Z" fill="currentColor"/>
                          <text x="50" y="55" font-family="Cinzel, serif" font-size="7" font-weight="bold" fill="currentColor" text-anchor="middle" letter-spacing="1">VERIFIED</text>
                          <text x="50" y="66" font-family="Inter, sans-serif" font-size="5" fill="currentColor" text-anchor="middle">EXCELLENCE</text>
                        </svg>`,
                        width: 100,
                        height: 100,
                        svgColor: design.accent_color,
                        label: "Gold Starburst Seal",
                      })
                    }
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary text-center transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-500 flex items-center justify-center text-amber-500 font-bold text-[9px]">
                      SEAL
                    </div>
                    <span className="text-xs font-semibold">16-Pt Gold Seal</span>
                  </button>

                  {/* Certified Stamp */}
                  <button
                    onClick={() =>
                      onAddElement("badge", {
                        content: "CERTIFIED",
                        width: 90,
                        height: 90,
                      })
                    }
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary text-center transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col items-center gap-2"
                  >
                    <ShieldCheck className="h-10 w-10 text-emerald-500" />
                    <span className="text-xs font-semibold">Verified Shield</span>
                  </button>

                  {/* QR Verification Code */}
                  <button
                    onClick={() => onAddElement("qr", { width: 80, height: 80 })}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary text-center transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col items-center gap-2"
                  >
                    <div className="w-10 h-10 bg-slate-900 rounded-md p-1 flex items-center justify-center text-white text-[8px] font-mono">
                      [QR]
                    </div>
                    <span className="text-xs font-semibold">Security QR Code</span>
                  </button>

                  {/* Guilloche Security Rosette */}
                  <button
                    onClick={() =>
                      onAddElement("guilloche_watermark", {
                        width: 220,
                        height: 220,
                      })
                    }
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary text-center transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col items-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-full border border-teal-500/50 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full border border-teal-500/80" />
                    </div>
                    <span className="text-xs font-semibold">Guilloche Weave</span>
                  </button>
                </div>
              </div>
            )}

            {/* ─── TAB: SIGNATURES & DIGITAL PAD ─── */}
            {activeTab === "signatures" && (
              <div className="space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Digital Signature Pad
                </span>
                <p className="text-[11px] text-slate-500">
                  Draw signature directly using your mouse, stylus, or touch screen. Insert on canvas with one click.
                </p>

                {/* HTML5 Drawing Canvas */}
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white shadow-xs">
                  <canvas
                    ref={canvasSignatureRef}
                    width={280}
                    height={130}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-32 cursor-crosshair touch-none bg-slate-50/50"
                  />
                </div>

                {/* Pen Controls */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {["#000000", "#1E3A8A", "#D4AF37"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setPenColor(c)}
                        className={`w-6 h-6 rounded-full border transition-transform ${penColor === c ? "scale-125 ring-2 ring-primary ring-offset-1" : "hover:scale-110"}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1 border rounded-md px-1.5 py-0.5">
                    {[2, 3, 5].map((w) => (
                      <button
                        key={w}
                        onClick={() => setPenWidth(w)}
                        className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${penWidth === w ? "bg-primary text-white" : "text-slate-500"}`}
                      >
                        {w}px
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs text-slate-500"
                    onClick={clearSignaturePad}
                  >
                    <Eraser className="h-3.5 w-3.5 mr-1" /> Clear
                  </Button>
                </div>

                <Button
                  className="w-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={!hasSignatureDrawing}
                  onClick={insertSignatureToCanvas}
                >
                  <Check className="h-4 w-4 mr-1.5" /> Insert Signature onto Certificate
                </Button>

                {/* Preset Script Signatures */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Pre-Made Signatures
                  </span>
                  <div className="space-y-2">
                    {[
                      { name: "Dr. Sarah Lin", title: "Lead AI Architect", font: "Great Vibes" },
                      { name: "Prof. Vikram Sharma", title: "Dean of Academics", font: "Alex Brush" },
                      { name: "Elena Rostova", title: "Executive Director", font: "Dancing Script" },
                    ].map((sig) => (
                      <button
                        key={sig.name}
                        onClick={() =>
                          onAddElement("text", {
                            content: sig.name,
                            fontFamily: sig.font,
                            fontSize: 28,
                            color: "#1a1a2e",
                            align: "center",
                            label: `Signature - ${sig.name}`,
                          })
                        }
                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <div
                          className="text-lg text-slate-900 dark:text-slate-100"
                          style={{ fontFamily: sig.font }}
                        >
                          {sig.name}
                        </div>
                        <div className="text-[10px] text-slate-500">{sig.title}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB: BACKGROUND & TEXTURES ─── */}
            {activeTab === "background" && (
              <div className="space-y-4">
                {/* Patterns */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Security Patterns
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PATTERN_OPTIONS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onUpdateDesign({ background_pattern: p.id })}
                        className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                          design.background_pattern === p.id
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Image Upload */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Custom Background Image
                  </span>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 cursor-pointer hover:border-primary transition-colors bg-slate-50 dark:bg-slate-800/40">
                    <Upload className="h-6 w-6 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Upload Certificate Background
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, or SVG (842×595 recommended)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          onUpdateBgImageUrl(url);
                          toast.success("Applied custom background!");
                        }
                      }}
                    />
                  </label>
                  {bgImageUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs text-red-500 hover:text-red-600"
                      onClick={() => onUpdateBgImageUrl("")}
                    >
                      Remove Background Image
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* ─── TAB: LAYERS ─── */}
            {activeTab === "layers" && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Layer Order ({elements.length})
                </span>
                <p className="text-[10px] text-slate-500">
                  Top elements render in front. Click to select, lock, or rearrange.
                </p>
                <div className="space-y-1.5 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
                  {[...elements].reverse().map((item, revIdx) => {
                    const isSelected = selectedId === item.id;
                    const isLocked = item.locked === true;
                    const isHidden = item.hidden === true;
                    return (
                      <div
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        className={`p-2 rounded-lg border text-xs flex items-center justify-between gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-xs"
                            : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                            {elements.length - revIdx}
                          </span>
                          <span className="font-medium truncate text-slate-800 dark:text-slate-200">
                            {item.label || item.content || item.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onUpdateElement(item.id, { hidden: !isHidden })}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                            title={isHidden ? "Show layer" : "Hide layer"}
                          >
                            {isHidden ? <EyeOff className="h-3.5 w-3.5 text-slate-400" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            onClick={() => onUpdateElement(item.id, { locked: !isLocked })}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                            title={isLocked ? "Unlock layer" : "Lock layer"}
                          >
                            {isLocked ? <Lock className="h-3.5 w-3.5 text-amber-500" /> : <Unlock className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            onClick={() => onDuplicateElement(item.id)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                            title="Duplicate layer"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteElement(item.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-950/40 rounded text-red-500"
                            title="Delete layer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
