/**
 * CertificateSystemAdmin — Learnify AI Credential OS
 * Full 9-tab Certificate System matching the premium design mockups.
 * Tabs: Overview | All Certificates | Templates | Designer | Bulk Issue |
 *       Verification | Analytics | Categories | Settings
 */
import { useState, useMemo, useEffect, useRef } from "react";
import type { ReactNode, CSSProperties, MouseEvent as ReactMouseEvent, ChangeEvent as ReactChangeEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  listCanvaTemplates,
  saveCanvaTemplate,
  deleteCanvaTemplate,
  seedAllTemplates,
} from "@/lib/canva-cert.functions";
import {
  getCertificateStats,
  listAllCertificates,
  getCertCategories,
  getCertSettings,
  saveCertSettings,
  bulkIssueCertificates,
} from "@/lib/certificate-admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { DesignerWorkspace } from "./DesignerWorkspace";
import { BadgeDesigner } from "./BadgeDesigner";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Shield,
  ShieldCheck,
  FilePlus,
  FileText,
  Plus,
  Sparkles,
  Upload,
  Download,
  Share2,
  BarChart2,
  Mail,
  Eye,
  Copy,
  Heart,
  MoreHorizontal,
  Search,
  ChevronDown,
  Star,
  Trash2,
  Edit,
  RotateCcw,
  RotateCw,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  X,
  Check,
  AlertCircle,
  Clock,
  Users,
  Settings,
  Tag,
  Zap,
  Lock,
  Globe,
  QrCode,
  Type,
  RefreshCw,
  ExternalLink,
  Award,
  List,
  LayoutGrid,
  User,
  Calendar,
  Hash,
  AlignLeft,
  AlignCenter,
  AlignRight,
  CheckCircle,
  Wallet,
  Activity,
  Pen,
  FolderOpen,
  Palette,
  Bell,
  Phone,
  GraduationCap,
  Image,
  Square,
  FileUp,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
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

// ─── Design Tokens ──────────────────────────────────────────────────────────
const P = "#6B5BFB";
const PL = "#EEF0FF";
const SG = "#10B981";
const SGL = "#D1FAE5";
const WO = "#F59E0B";
const WOL = "#FEF3C7";
const ER = "#EF4444";
const ERL = "#FEE2E2";
const IN = "#3B82F6";
const INL = "#DBEAFE";
const WP = "#8B5CF6";
const PK = "#EC4899";
const BD = "#E5E7EB";
const TX = "#0F172A";
const TX2 = "#6B7280";
const TX3 = "#9CA3AF";
const BG = "#F8F9FA";

// ─── Data Helpers (computed from real stats) ─────────────────────────────────
/** Compute month-over-month delta % from monthlyGrowth array */
function computeDelta(monthlyGrowth?: { value: number }[]): string {
  if (!monthlyGrowth || monthlyGrowth.length < 2) return "";
  const prev = monthlyGrowth[monthlyGrowth.length - 2]?.value ?? 0;
  const curr = monthlyGrowth[monthlyGrowth.length - 1]?.value ?? 0;
  if (prev === 0) return curr > 0 ? "+100%" : "0%";
  const delta = ((curr - prev) / prev) * 100;
  return `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`;
}

/** Build a 7-point sparkline from monthlyGrowth, or generate a gentle ramp toward target */
function buildSparkData(monthlyGrowth?: { value: number }[], target = 0): { v: number; i: number }[] {
  if (monthlyGrowth && monthlyGrowth.length >= 7) {
    return monthlyGrowth.slice(-7).map((m, i) => ({ v: m.value, i }));
  }
  if (monthlyGrowth && monthlyGrowth.length >= 2) {
    return monthlyGrowth.map((m, i) => ({ v: m.value, i }));
  }
  const t = Math.max(1, target);
  return Array.from({ length: 7 }, (_, i) => ({ v: Math.round(t * (0.6 + 0.4 * (i / 6))), i }));
}

// Static spark shapes (used as fallback when monthlyGrowth has only 1 data point)
const sparkCerts = [1000, 1200, 1400, 1600, 1750, 1900, 2100].map((v, i) => ({ v, i }));
const sparkVerTotal = [19000, 20500, 21200, 22400, 23100, 24000, 24851].map((v, i) => ({ v, i }));
const sparkVerif = [18200, 19600, 20300, 21500, 22200, 23100, 23994].map((v, i) => ({ v, i }));
const sparkInvalid = [480, 420, 390, 360, 370, 355, 342].map((v, i) => ({ v, i }));
const sparkPending = [760, 800, 820, 840, 855, 850, 857].map((v, i) => ({ v, i }));
const sparkQR = [11000, 12500, 13200, 14100, 14800, 15500, 15986].map((v, i) => ({ v, i }));

// Fallback area chart data (used when stats.monthlyGrowth is unavailable)
const areaData = [
  { date: "—", value: 0 },
];
const barData = [
  { date: "—", downloads: 0, shares: 0 },
];

const recentCerts: any[] = [];

const verifyActivity: any[] = [];

const MOCK_TEMPLATES = [
  {
    name: "Engraved Rosette (ThreeUI Canvas)",
    badge: "Official Live Engine",
    badgeColor: "#065F46",
    badgeBg: "#D1FAE5",
    theme: "engraved",
    rating: 5.0,
    reviews: 1420,
    downloads: "5.4k",
  },
  {
    name: "Executive Blue Gold",
    badge: "Premium",
    badgeColor: "#92400E",
    badgeBg: "#FEF3C7",
    theme: "navy",
    rating: 4.9,
    reviews: 866,
    downloads: "2.7k",
  },
  {
    name: "Skyline Tech",
    badge: "Professional",
    badgeColor: "#1E40AF",
    badgeBg: "#DBEAFE",
    theme: "blue",
    rating: 4.8,
    reviews: 742,
    downloads: "2.3k",
  },
  {
    name: "Ivory Academic",
    badge: "Professional",
    badgeColor: "#1E40AF",
    badgeBg: "#DBEAFE",
    theme: "ivory",
    rating: 4.7,
    reviews: 520,
    downloads: "1.9k",
  },
  {
    name: "Onyx Calligraphy",
    badge: "Professional",
    badgeColor: "#1E40AF",
    badgeBg: "#DBEAFE",
    theme: "onyx",
    rating: 4.9,
    reviews: 914,
    downloads: "3.1k",
  },
  {
    name: "Rose Charcoal",
    badge: "Premium",
    badgeColor: "#92400E",
    badgeBg: "#FEF3C7",
    theme: "rose",
    rating: 4.6,
    reviews: 421,
    downloads: "1.2k",
  },
  {
    name: "Glassmorphism AI",
    badge: "New",
    badgeColor: "#0E7490",
    badgeBg: "#CFFAFE",
    theme: "glass",
    rating: 4.8,
    reviews: 312,
    downloads: "0.8k",
  },
  {
    name: "Modern Minimal",
    badge: "Professional",
    badgeColor: "#1E40AF",
    badgeBg: "#DBEAFE",
    theme: "minimal",
    rating: 4.5,
    reviews: 318,
    downloads: "0.9k",
  },
  {
    name: "Corporate Blue",
    badge: "Professional",
    badgeColor: "#1E40AF",
    badgeBg: "#DBEAFE",
    theme: "corporate",
    rating: 4.7,
    reviews: 486,
    downloads: "1.5k",
  },
  {
    name: "Classic University",
    badge: "Professional",
    badgeColor: "#1E40AF",
    badgeBg: "#DBEAFE",
    theme: "classic",
    rating: 4.6,
    reviews: 395,
    downloads: "1.1k",
  },
  {
    name: "Gradient Future",
    badge: "New",
    badgeColor: "#0E7490",
    badgeBg: "#CFFAFE",
    theme: "gradient",
    rating: 4.8,
    reviews: 612,
    downloads: "1.8k",
  },
];

const ALL_CERTS_DATA = Array.from({ length: 12 }, (_, i) => ({
  id: `LAI-2026-${String(i + 100).padStart(6, "0")}`,
  course: [
    "Full Stack Web Development",
    "Python Masterclass",
    "AI & ML Fundamentals",
    "UI/UX Design",
    "Data Science",
    "React Advanced",
    "Node.js Bootcamp",
    "Machine Learning",
    "Cloud Computing",
    "Cybersecurity",
    "DevOps Engineering",
    "Blockchain Basics",
  ][i],
  name: [
    "John Doe",
    "Sarah Wilson",
    "Michael Brown",
    "Emily Johnson",
    "David Lee",
    "Priya Patel",
    "James Smith",
    "Anna Chen",
    "Carlos Rivera",
    "Maria Santos",
    "Ravi Kumar",
    "Lisa Wang",
  ][i],
  email: [
    "john@example.com",
    "sarah@example.com",
    "michael@example.com",
    "emily@example.com",
    "david@example.com",
    "priya@example.com",
    "james@example.com",
    "anna@example.com",
    "carlos@example.com",
    "maria@example.com",
    "ravi@example.com",
    "lisa@example.com",
  ][i],
  status: [
    "Issued",
    "Verified",
    "Issued",
    "Downloaded",
    "Added to Wallet",
    "Issued",
    "Verified",
    "Downloaded",
    "Issued",
    "Verified",
    "Issued",
    "Verified",
  ][i],
  date: "May 25, 2026",
  expiry: i % 3 === 0 ? "No Expiry" : "May 25, 2027",
  theme: [
    "navy",
    "blue",
    "teal",
    "rose",
    "purple",
    "minimal",
    "navy",
    "blue",
    "teal",
    "onyx",
    "rose",
    "corporate",
  ][i],
}));

const CATS_DATA = [
  {
    name: "Technology",
    type: "Professional",
    certs: 4521,
    templates: 42,
    rating: 4.8,
    status: "Active",
    color: "#6B5BFB",
  },
  {
    name: "Business",
    type: "Professional",
    certs: 3241,
    templates: 38,
    rating: 4.7,
    status: "Active",
    color: "#10B981",
  },
  {
    name: "Design",
    type: "Creative",
    certs: 2187,
    templates: 28,
    rating: 4.9,
    status: "Active",
    color: "#EC4899",
  },
  {
    name: "Marketing",
    type: "Professional",
    certs: 1854,
    templates: 22,
    rating: 4.6,
    status: "Active",
    color: "#F59E0B",
  },
  {
    name: "Personal Dev",
    type: "Academic",
    certs: 1243,
    templates: 18,
    rating: 4.5,
    status: "Active",
    color: "#3B82F6",
  },
  {
    name: "Data Science",
    type: "Professional",
    certs: 987,
    templates: 15,
    rating: 4.8,
    status: "Active",
    color: "#8B5CF6",
  },
  {
    name: "AI & Machine Learning",
    type: "Technology",
    certs: 756,
    templates: 12,
    rating: 4.9,
    status: "Active",
    color: "#06B6D4",
  },
  {
    name: "Cybersecurity",
    type: "Professional",
    certs: 542,
    templates: 9,
    rating: 4.7,
    status: "Active",
    color: "#EF4444",
  },
];

const VERIFY_LIST: any[] = [];

// ─── Shared Components ───────────────────────────────────────────────────────

function CertThumbnail({
  theme = "navy",
  w = 48,
  h = 36,
  name,
  course,
  date,
  certId,
}: {
  theme?: string;
  w?: number;
  h?: number;
  name?: string;
  course?: string;
  date?: string;
  certId?: string;
}) {
  type TC = {
    bg1: string;
    bg2: string;
    bd: string;
    bd2: string;
    title: string;
    accent: string;
    name: string;
    sub: string;
    seal: string;
    light: boolean;
  };
  const T: Record<string, TC> = {
    navy: {
      bg1: "#0a0a2e",
      bg2: "#12124e",
      bd: "#C9A227",
      bd2: "rgba(201,162,39,0.35)",
      title: "#C9A227",
      accent: "rgba(201,162,39,0.25)",
      name: "#ffffff",
      sub: "#C9A227",
      seal: "#C9A227",
      light: false,
    },
    blue: {
      bg1: "#0c2461",
      bg2: "#1e3a8a",
      bd: "#60a5fa",
      bd2: "rgba(96,165,250,0.3)",
      title: "#93c5fd",
      accent: "rgba(96,165,250,0.15)",
      name: "#ffffff",
      sub: "#93c5fd",
      seal: "#60a5fa",
      light: false,
    },
    teal: {
      bg1: "#004d40",
      bg2: "#00695c",
      bd: "#80cbc4",
      bd2: "rgba(128,203,196,0.3)",
      title: "#b2dfdb",
      accent: "rgba(128,203,196,0.15)",
      name: "#ffffff",
      sub: "#80cbc4",
      seal: "#80cbc4",
      light: false,
    },
    rose: {
      bg1: "#4a0030",
      bg2: "#880e4f",
      bd: "#f48fb1",
      bd2: "rgba(244,143,177,0.3)",
      title: "#f48fb1",
      accent: "rgba(244,143,177,0.15)",
      name: "#ffffff",
      sub: "#f48fb1",
      seal: "#f48fb1",
      light: false,
    },
    purple: {
      bg1: "#1a0050",
      bg2: "#4527a0",
      bd: "#ce93d8",
      bd2: "rgba(206,147,216,0.3)",
      title: "#ce93d8",
      accent: "rgba(206,147,216,0.15)",
      name: "#ffffff",
      sub: "#ce93d8",
      seal: "#ce93d8",
      light: false,
    },
    onyx: {
      bg1: "#111111",
      bg2: "#2d2d2d",
      bd: "#d4d4d4",
      bd2: "rgba(212,212,212,0.25)",
      title: "#d4d4d4",
      accent: "rgba(212,212,212,0.08)",
      name: "#ffffff",
      sub: "#aaaaaa",
      seal: "#c0c0c0",
      light: false,
    },
    ivory: {
      bg1: "#fefce8",
      bg2: "#fdf8e1",
      bd: "#92400e",
      bd2: "rgba(146,64,14,0.3)",
      title: "#92400e",
      accent: "rgba(146,64,14,0.08)",
      name: "#3b1f0a",
      sub: "#92400e",
      seal: "#b45309",
      light: true,
    },
    glass: {
      bg1: "#0f172a",
      bg2: "#1e293b",
      bd: "rgba(255,255,255,0.5)",
      bd2: "rgba(255,255,255,0.15)",
      title: "rgba(255,255,255,0.9)",
      accent: "rgba(255,255,255,0.06)",
      name: "#ffffff",
      sub: "rgba(255,255,255,0.7)",
      seal: "rgba(255,255,255,0.8)",
      light: false,
    },
    minimal: {
      bg1: "#ffffff",
      bg2: "#f8fafc",
      bd: "#1e293b",
      bd2: "rgba(30,41,59,0.2)",
      title: "#1e293b",
      accent: "rgba(30,41,59,0.04)",
      name: "#0f172a",
      sub: "#334155",
      seal: "#475569",
      light: true,
    },
    corporate: {
      bg1: "#1565c0",
      bg2: "#0d47a1",
      bd: "#90caf9",
      bd2: "rgba(144,202,249,0.3)",
      title: "#bbdefb",
      accent: "rgba(144,202,249,0.15)",
      name: "#ffffff",
      sub: "#90caf9",
      seal: "#64b5f6",
      light: false,
    },
    classic: {
      bg1: "#fdf6e3",
      bg2: "#f5edd6",
      bd: "#8B6914",
      bd2: "rgba(139,105,20,0.3)",
      title: "#5c3d11",
      accent: "rgba(139,105,20,0.08)",
      name: "#3b2709",
      sub: "#8B6914",
      seal: "#a0752e",
      light: true,
    },
    gradient: {
      bg1: "#6B5BFB",
      bg2: "#a855f7",
      bd: "rgba(255,255,255,0.7)",
      bd2: "rgba(255,255,255,0.2)",
      title: "#ffffff",
      accent: "rgba(255,255,255,0.12)",
      name: "#ffffff",
      sub: "rgba(255,255,255,0.85)",
      seal: "#ffffff",
      light: false,
    },
  };
  const c = T[theme] || T.navy;
  const lt = c.light;
  return (
    <div
      style={{
        width: w,
        height: h,
        flexShrink: 0,
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid #E5E7EB",
      }}
    >
      <svg
        width={w}
        height={h}
        viewBox="0 0 400 280"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient
            id={`bg-${theme}-${w}-${name?.replace(/\s+/g, "") || "def"}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={c.bg1} />
            <stop offset="100%" stopColor={c.bg2} />
          </linearGradient>
        </defs>
        <rect
          width="400"
          height="280"
          fill={`url(#bg-${theme}-${w}-${name?.replace(/\s+/g, "") || "def"})`}
        />
        <rect x="10" y="10" width="380" height="260" fill="none" stroke={c.bd} strokeWidth="2" />
        <rect x="16" y="16" width="368" height="248" fill="none" stroke={c.bd2} strokeWidth="1" />
        <rect x="10" y="10" width="380" height="36" fill={c.accent} />
        <text
          x="200"
          y="32"
          textAnchor="middle"
          fill={c.title}
          fontSize="8"
          fontFamily="serif"
          letterSpacing="3"
          fontWeight="700"
        >
          LEARNIFY AI
        </text>
        <text
          x="200"
          y="70"
          textAnchor="middle"
          fill={lt ? "#0f172a" : "#ffffff"}
          fontSize="22"
          fontFamily="Playfair Display,Georgia,serif"
          fontWeight="700"
          letterSpacing="4"
        >
          CERTIFICATE
        </text>
        <text
          x="200"
          y="87"
          textAnchor="middle"
          fill={c.sub}
          fontSize="8"
          letterSpacing="5"
          fontFamily="sans-serif"
        >
          OF COMPLETION
        </text>
        <line x1="70" y1="96" x2="330" y2="96" stroke={c.bd} strokeWidth="0.8" />
        <text
          x="200"
          y="118"
          textAnchor="middle"
          fill={lt ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.55)"}
          fontSize="8"
          fontFamily="sans-serif"
        >
          This is to certify that
        </text>
        <text
          x="200"
          y="154"
          textAnchor="middle"
          fill={c.name}
          fontSize="22"
          fontFamily="Great Vibes,Georgia,serif"
          fontStyle="italic"
        >
          {name || "Learner"}
        </text>
        <line x1="70" y1="165" x2="330" y2="165" stroke={c.bd2} strokeWidth="0.6" />
        <text
          x="200"
          y="182"
          textAnchor="middle"
          fill={lt ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.55)"}
          fontSize="7.5"
          fontFamily="sans-serif"
        >
          has successfully completed
        </text>
        <text
          x="200"
          y="200"
          textAnchor="middle"
          fill={c.sub}
          fontSize="10.5"
          fontFamily="Playfair Display,Georgia,serif"
          fontWeight="700"
        >
          {course || "Full Stack Web Development"}
        </text>
        <circle cx="200" cy="240" r="20" fill={c.accent} stroke={c.bd} strokeWidth="1.2" />
        <circle cx="200" cy="240" r="15" fill="none" stroke={c.bd2} strokeWidth="0.8" />
        <text x="200" y="244" textAnchor="middle" fill={c.seal} fontSize="12" fontFamily="serif">
          ✦
        </text>
        <text
          x="100"
          y="228"
          textAnchor="middle"
          fill={lt ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)"}
          fontSize="6"
          fontFamily="sans-serif"
        >
          {date || "May 25, 2026"}
        </text>
        <text
          x="300"
          y="228"
          textAnchor="middle"
          fill={lt ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)"}
          fontSize="6"
          fontFamily="sans-serif"
        >
          {certId || "LAI-2026-000124"}
        </text>
        <rect
          x="352"
          y="248"
          width="22"
          height="22"
          fill={lt ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"}
          stroke={c.bd2}
          strokeWidth="0.5"
          rx="2"
        />
        <text x="363" y="263" textAnchor="middle" fill={c.bd2} fontSize="7">
          QR
        </text>
      </svg>
    </div>
  );
}

function SparkLine({ data, color }: { data: { v: number; i: number }[]; color: string }) {
  return (
    <div style={{ width: 60, height: 32, flexShrink: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Issued: { bg: PL, color: P },
    Verified: { bg: SGL, color: "#059669" },
    Downloaded: { bg: INL, color: "#2563EB" },
    "Added to Wallet": { bg: "#EDE9FE", color: "#7C3AED" },
    Invalid: { bg: ERL, color: "#DC2626" },
    Pending: { bg: WOL, color: "#B45309" },
    Active: { bg: SGL, color: "#059669" },
    Inactive: { bg: "#F3F4F6", color: TX2 },
  };
  const s = map[status] || { bg: "#F3F4F6", color: TX2 };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 6,
        display: "inline-flex",
        alignItems: "center",
        whiteSpace: "nowrap",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {status}
    </span>
  );
}

function KPICard({
  label,
  value,
  delta,
  icon,
  iconBg,
  sparkData,
  sparkColor,
}: {
  label: string;
  value: string;
  delta: string;
  icon: ReactNode;
  iconBg: string;
  sparkData: { v: number; i: number }[];
  sparkColor: string;
}) {
  const pos = delta.startsWith("+");
  return (
    <div
      style={{
        flex: 1,
        background: "white",
        border: `1px solid ${BD}`,
        borderRadius: 12,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        minWidth: 0,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: TX2, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: TX, lineHeight: 1 }}>{value}</div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: pos ? "#10B981" : "#EF4444",
            marginTop: 2,
          }}
        >
          {delta} this month
        </div>
      </div>
      <SparkLine data={sparkData} color={sparkColor} />
    </div>
  );
}

function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        background: "white",
        border: `1px solid ${BD}`,
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: TX }}>{title}</span>
        {action}
      </div>
      {children}
    </div>
  );
}

function Btn({
  children,
  variant = "primary",
  onClick,
  style = {},
  disabled,
}: {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost" | "danger";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: CSSProperties;
  disabled?: boolean;
}) {
  const styles = {
    primary: {
      background: disabled ? "#E5E7EB" : P,
      color: disabled ? "#9CA3AF" : "white",
      border: `1px solid ${disabled ? "#E5E7EB" : P}`,
    },
    outline: { background: "white", color: disabled ? "#9CA3AF" : TX, border: `1px solid ${BD}` },
    ghost: { background: "transparent", color: disabled ? "#9CA3AF" : TX2, border: "none" },
    danger: {
      background: disabled ? "#E5E7EB" : ERL,
      color: disabled ? "#9CA3AF" : ER,
      border: `1px solid ${disabled ? "#E5E7EB" : ER}`,
    },
  };
  const s = styles[variant];
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        ...s,
        padding: "7px 14px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ─── Tab IDs ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: <Shield size={15} /> },
  { id: "all-certs", label: "All Certificates", icon: <FileText size={15} /> },
  { id: "templates", label: "Templates", icon: <LayoutGrid size={15} /> },
  { id: "designer", label: "Designer", icon: <Pen size={15} /> },
  { id: "bulk-issue", label: "Bulk Issue", icon: <Upload size={15} /> },
  { id: "verification", label: "Verification", icon: <ShieldCheck size={15} /> },
  { id: "analytics", label: "Analytics", icon: <BarChart2 size={15} /> },
  { id: "badges", label: "Badges", icon: <Award size={15} /> },
  { id: "categories", label: "Categories", icon: <Tag size={15} /> },
  { id: "settings", label: "Settings", icon: <Settings size={15} /> },
];

// ─── Screen: Overview ────────────────────────────────────────────────────────
function OverviewScreen({
  setTab,
  stats,
  onOpenAiModal,
}: {
  setTab: (t: string) => void;
  stats: any;
  onOpenAiModal?: () => void;
}) {
  const totalCerts = stats?.totalCerts ?? 0;
  const totalVerifications = stats?.totalVerifications ?? 0;
  const totalTemplates = stats?.totalTemplates ?? 0;
  const listCertificates = stats?.recentCertificates?.length > 0 ? stats.recentCertificates : [];
  const recentVerificationLogs = stats?.recentVerificationLogs?.length > 0 ? stats.recentVerificationLogs : [];
  const pieStatusData = stats?.pieStatusData ?? [];
  const growth = stats?.monthlyGrowth as { value: number }[] | undefined;
  const downloadedCount = stats?.pieStatusData?.find((s: any) => s.name === "Downloaded")?.value ?? 0;
  const sharedCount = stats?.pieStatusData?.find((s: any) => s.name === "Shared")?.value ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <KPICard
          label="Certificates Issued"
          value={totalCerts.toLocaleString()}
          delta={computeDelta(growth)}
          icon={<FilePlus size={20} color={P} />}
          iconBg={PL}
          sparkData={buildSparkData(growth, totalCerts)}
          sparkColor={P}
        />
        <KPICard
          label="Verifications"
          value={totalVerifications.toLocaleString()}
          delta={computeDelta(growth)}
          icon={<ShieldCheck size={20} color={SG} />}
          iconBg={SGL}
          sparkData={buildSparkData(growth, totalVerifications)}
          sparkColor={SG}
        />
        <KPICard
          label="Active Templates"
          value={totalTemplates.toLocaleString()}
          delta={""}
          icon={<Download size={20} color={IN} />}
          iconBg={INL}
          sparkData={buildSparkData(growth, totalTemplates)}
          sparkColor={IN}
        />
        <KPICard
          label="Certificate Shares"
          value={sharedCount > 0 ? sharedCount.toLocaleString() : "—"}
          delta={""}
          icon={<Share2 size={20} color={WO} />}
          iconBg={WOL}
          sparkData={buildSparkData(growth, sharedCount)}
          sparkColor={WO}
        />
        <KPICard
          label="Downloads"
          value={downloadedCount > 0 ? downloadedCount.toLocaleString() : "—"}
          delta={""}
          icon={<Download size={20} color={PK} />}
          iconBg="#FCE7F3"
          sparkData={buildSparkData(growth, downloadedCount)}
          sparkColor={PK}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "4fr 3fr 3fr", gap: 16 }}>
        <SectionCard
          title="Recent Certificates"
          action={
            <a
              style={{ fontSize: 13, color: P, cursor: "pointer", fontWeight: 500 }}
              onClick={() => setTab("all-certs")}
            >
              View All →
            </a>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {listCertificates.length === 0 ? (
              <div style={{ padding: 20, textAlign: "center", color: TX2, fontSize: 13 }}>
                No certificates issued yet.
              </div>
            ) : (
              listCertificates.map((c: any, i: number) => (
                <a
                  key={i}
                  href={`/verify/${c.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    textDecoration: "none",
                    color: "inherit",
                    paddingBottom: i < listCertificates.length - 1 ? 10 : 0,
                    borderBottom: i < listCertificates.length - 1 ? `1px solid ${BD}` : "none",
                  }}
                >
                  <CertThumbnail
                    theme={c.theme}
                    name={c.name}
                    course={c.course}
                    date={c.date}
                    certId={c.id}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: TX,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {c.course} ↗
                    </div>
                    <div style={{ fontSize: 12, color: TX2 }}>Issued to {c.name}</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 4,
                      flexShrink: 0,
                    }}
                  >
                    <StatusBadge status={c.status} />
                    <span style={{ fontSize: 11, color: TX3 }}>{c.time}</span>
                  </div>
                  <ExternalLink size={14} color={TX3} style={{ flexShrink: 0 }} />
                </a>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard title="Quick Actions">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              {
                label: "Create Certificate",
                sub: "Create a new certificate manually",
                icon: <FilePlus size={22} color={P} />,
                iconBg: PL,
                action: () => setTab("all-certs"),
              },
              {
                label: "AI Designer",
                sub: "Generate certificates with AI",
                icon: <Sparkles size={22} color="#7C3AED" />,
                iconBg: "#EDE9FE",
                action: () => (onOpenAiModal ? onOpenAiModal() : setTab("designer")),
              },
              {
                label: "Bulk Issue",
                sub: "Upload CSV and issue in bulk",
                icon: <Upload size={22} color={SG} />,
                iconBg: SGL,
                action: () => setTab("bulk-issue"),
              },
              {
                label: "Template Library",
                sub: "Browse 50+ professional templates",
                icon: <LayoutGrid size={22} color={IN} />,
                iconBg: INL,
                action: () => setTab("templates"),
              },
              {
                label: "Verification Center",
                sub: "Verify any certificate",
                icon: <ShieldCheck size={22} color={WP} />,
                iconBg: "#EDE9FE",
                action: () => setTab("verification"),
              },
              {
                label: "Analytics Dashboard",
                sub: "View detailed reports",
                icon: <BarChart2 size={22} color={WO} />,
                iconBg: WOL,
                action: () => setTab("analytics"),
              },
            ].map((a, i) => (
              <div
                key={i}
                onClick={a.action}
                style={{
                  border: `1px solid ${BD}`,
                  borderRadius: 12,
                  padding: 14,
                  cursor: "pointer",
                  transition: "box-shadow 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.10)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: a.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  {a.icon}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: TX, marginBottom: 2 }}>
                  {a.label}
                </div>
                <div style={{ fontSize: 11, color: TX2, lineHeight: 1.3 }}>{a.sub}</div>
              </div>
            ))}
          </div>
          <div
            onClick={() => setTab("all-certs")}
            style={{
              border: `1px solid ${BD}`,
              borderRadius: 12,
              padding: 14,
              cursor: "pointer",
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.10)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: ERL,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Mail size={22} color={ER} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: TX }}>Email Center</div>
              <div style={{ fontSize: 11, color: TX2 }}>Send certificates via email</div>
            </div>
          </div>
        </SectionCard>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionCard
            title="Certificate Statistics"
            action={
              <select
                style={{
                  border: `1px solid ${BD}`,
                  borderRadius: 6,
                  padding: "3px 8px",
                  fontSize: 12,
                  color: TX2,
                }}
              >
                <option>This Month</option>
                <option>This Week</option>
                <option>This Year</option>
              </select>
            }
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <div style={{ position: "relative", width: 160, height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieStatusData}
                      innerRadius={52}
                      outerRadius={75}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {pieStatusData.map((e: any, i: number) => (
                        <Cell key={i} fill={[P, SG, IN, WO][i % 4]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => v.toLocaleString()} />
                  </PieChart>
                </ResponsiveContainer>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700, color: TX }}>{totalCerts}</div>
                  <div style={{ fontSize: 10, color: TX2 }}>Total</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {pieStatusData.map((s: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: [P, SG, IN, WO][i % 4],
                      }}
                    />
                    <span style={{ color: TX2 }}>{s.name}</span>
                  </div>
                  <span style={{ fontWeight: 600, color: TX }}>{s.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Recent Verification Activity"
            action={
              <a
                style={{ fontSize: 12, color: P, cursor: "pointer" }}
                onClick={() => setTab("verification")}
              >
                View All →
              </a>
            }
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recentVerificationLogs.length === 0 ? (
                <div style={{ padding: 20, textAlign: "center", color: TX2, fontSize: 12 }}>
                  No recent verification activity.
                </div>
              ) : (
                recentVerificationLogs.map((a: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <ShieldCheck size={16} color={SG} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: TX }}>
                        Certificate ID: {a.id}
                      </div>
                      <div style={{ fontSize: 11, color: TX2 }}>{a.msg}</div>
                    </div>
                    <span style={{ fontSize: 11, color: TX3, flexShrink: 0 }}>{a.time}</span>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: All Certificates ─────────────────────────────────────────────────
function AllCertsScreen({
  certificates = [],
  setTab,
  onRefresh,
}: {
  certificates: any[];
  setTab: (t: string) => void;
  onRefresh?: () => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [view, setView] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);
  const [previewCert, setPreviewCert] = useState<any | null>(null);
  const [exportCert, setExportCert] = useState<any | null>(null);

  const STATUSES = ["All", "Issued", "Verified", "Downloaded", "Invalid"];
  const filtered = certificates.filter((c) => {
    if (statusFilter !== "All" && c.status !== statusFilter) return false;
    if (
      search &&
      !c.course.toLowerCase().includes(search.toLowerCase()) &&
      !c.name.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const PER_PAGE = 8;
  const pages = Math.ceil(filtered.length / PER_PAGE);
  const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.error("No certificates to export");
      return;
    }
    const headers = [
      "Certificate ID",
      "Recipient Name",
      "Recipient Email",
      "Course ID",
      "Course Name",
      "Score",
      "Total",
      "Status",
      "Issue Date",
      "Expiry Date",
    ];
    const rows = filtered.map((c) => [
      c.id || "",
      c.name || "",
      c.email || "",
      c.course_id || "",
      c.course || "",
      c.score || "",
      c.total || "",
      c.status || "Issued",
      c.date || "",
      c.expiry || "No Expiry",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.join(","),
        ...rows.map((e) => e.map((val) => `"${val.toString().replace(/"/g, '""')}"`).join(",")),
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `learnify_certificates_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded successfully!");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to revoke and delete certificate ${id}?`)) return;
    try {
      const { error } = await supabase.from("certificates").delete().eq("id", id);
      if (error) throw error;
      toast.success("Certificate deleted/revoked successfully!");
      if (onRefresh) onRefresh();
    } catch (e: any) {
      toast.error("Failed to delete certificate: " + e.message);
    }
  };

  const handleDownloadPDF = async (c: any) => {
    toast.info("Generating high-quality PDF...");
    try {
      let el = document.getElementById(`preview-cert-capture-${c.id}`);
      let tempMounted = false;

      if (!el) {
        setExportCert(c);
        tempMounted = true;
        // Wait for React to render the component to the DOM
        await new Promise((resolve) => setTimeout(resolve, 200));
        el = document.getElementById(`export-cert-capture-${c.id}`);
      }

      if (!el) throw new Error("Preview element not found");
      const canvas = await html2canvas(el, { scale: 3, useCORS: true });
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 297, 210);
      pdf.save(`certificate_${c.name.replace(/\s+/g, "_")}.pdf`);
      toast.success("PDF Downloaded successfully!");

      if (tempMounted) {
        setExportCert(null);
      }
    } catch (err: any) {
      toast.error("PDF generation failed: " + err.message);
      setExportCert(null);
    }
  };

  const handleDownloadImage = async (c: any) => {
    toast.info("Generating PNG Image...");
    try {
      let el = document.getElementById(`preview-cert-capture-${c.id}`);
      let tempMounted = false;

      if (!el) {
        setExportCert(c);
        tempMounted = true;
        // Wait for React to render the component to the DOM
        await new Promise((resolve) => setTimeout(resolve, 200));
        el = document.getElementById(`export-cert-capture-${c.id}`);
      }

      if (!el) throw new Error("Preview element not found");
      const canvas = await html2canvas(el, { scale: 3, useCORS: true });
      const link = document.createElement("a");
      link.download = `certificate_${c.name.replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Image Downloaded successfully!");

      if (tempMounted) {
        setExportCert(null);
      }
    } catch (err: any) {
      toast.error("Image generation failed: " + err.message);
      setExportCert(null);
    }
  };

  const handleShare = (c: any) => {
    const url = `${window.location.origin}/verify/certificate/${c.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Verification link copied to clipboard!");
  };

  const handleSendEmail = (c: any) => {
    toast.success(`Certificate PDF and verification link sent to ${c.email}!`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "0 0 260px" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: TX3,
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search certificates..."
            style={{
              width: "100%",
              paddingLeft: 32,
              paddingRight: 12,
              height: 36,
              border: `1px solid ${BD}`,
              borderRadius: 8,
              fontSize: 13,
              color: TX,
              outline: "none",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                border: `1px solid ${statusFilter === s ? P : BD}`,
                background: statusFilter === s ? PL : "white",
                color: statusFilter === s ? P : TX2,
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => setView(view === "list" ? "grid" : "list")}
            style={{
              padding: "6px 10px",
              border: `1px solid ${BD}`,
              borderRadius: 8,
              background: "white",
              cursor: "pointer",
              display: "flex",
              gap: 4,
              alignItems: "center",
            }}
          >
            {view === "list" ? (
              <LayoutGrid size={16} color={TX2} />
            ) : (
              <List size={16} color={TX2} />
            )}
          </button>
          <Btn variant="primary" onClick={() => setTab("bulk-issue")}>
            <Plus size={14} />
            Issue Certificate
          </Btn>
          <Btn variant="outline" onClick={handleExport}>
            <Download size={14} />
            Export
          </Btn>
        </div>
      </div>

      <div
        style={{
          background: "white",
          border: `1px solid ${BD}`,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BD}`, background: BG }}>
              <th style={{ padding: "10px 16px", textAlign: "left", width: 36 }}>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelected(e.target.checked ? new Set(shown.map((_, i) => i)) : new Set())
                  }
                />
              </th>
              {["Certificate", "Recipient", "Status", "Issue Date", "Expiry", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 12px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 600,
                      color: TX2,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {shown.map((c, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: `1px solid ${BD}`,
                  background: selected.has(i) ? "#F5F3FF" : "white",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (!selected.has(i)) e.currentTarget.style.background = "#F9FAFB";
                }}
                onMouseLeave={(e) => {
                  if (!selected.has(i)) e.currentTarget.style.background = "white";
                }}
              >
                <td style={{ padding: "12px 16px" }}>
                  <input
                    type="checkbox"
                    checked={selected.has(i)}
                    onChange={(e) => {
                      const ns = new Set(selected);
                      e.target.checked ? ns.add(i) : ns.delete(i);
                      setSelected(ns);
                    }}
                  />
                </td>
                <td style={{ padding: "12px" }}>
                  <a
                    href={`/verify/${c.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <CertThumbnail
                      theme={c.theme}
                      name={c.name}
                      course={c.course}
                      date={c.date}
                      certId={c.id}
                    />
                    <div>
                      <div style={{ fontSize: 11, color: P, fontWeight: 600 }}>{c.id} ↗</div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: TX,
                          maxWidth: 180,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {c.course}
                      </div>
                    </div>
                  </a>
                </td>
                <td style={{ padding: "12px" }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: TX }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: TX3 }}>{c.email}</div>
                </td>
                <td style={{ padding: "12px" }}>
                  <StatusBadge status={c.status} />
                </td>
                <td style={{ padding: "12px", fontSize: 13, color: TX2 }}>{c.date}</td>
                <td
                  style={{
                    padding: "12px",
                    fontSize: 13,
                    color: c.expiry === "No Expiry" ? TX3 : TX2,
                  }}
                >
                  {c.expiry}
                </td>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <button
                      onClick={() => setPreviewCert(c)}
                      title="Preview Certificate"
                      style={{
                        padding: 5,
                        border: `1px solid ${BD}`,
                        borderRadius: 6,
                        background: "white",
                        cursor: "pointer",
                      }}
                    >
                      <Eye size={13} color={TX2} />
                    </button>
                    <button
                      onClick={() => handleShare(c)}
                      title="Copy Share Link"
                      style={{
                        padding: 5,
                        border: `1px solid ${BD}`,
                        borderRadius: 6,
                        background: "white",
                        cursor: "pointer",
                      }}
                    >
                      <Share2 size={13} color={TX2} />
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(c)}
                      title="Download PDF"
                      style={{
                        padding: 5,
                        border: `1px solid ${BD}`,
                        borderRadius: 6,
                        background: "white",
                        cursor: "pointer",
                      }}
                    >
                      <Download size={13} color={TX2} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      title="Delete / Revoke"
                      style={{
                        padding: 5,
                        border: `1px solid ${BD}`,
                        borderRadius: 6,
                        background: "white",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={13} color={ER} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderTop: `1px solid ${BD}`,
          }}
        >
          <span style={{ fontSize: 13, color: TX2 }}>
            Showing {shown.length} of {filtered.length} certificates
          </span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: "5px 10px",
                border: `1px solid ${BD}`,
                borderRadius: 6,
                background: "white",
                cursor: "pointer",
                fontSize: 13,
                color: TX2,
              }}
            >
              ‹ Prev
            </button>
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  padding: "5px 10px",
                  border: `1px solid ${page === i + 1 ? P : BD}`,
                  borderRadius: 6,
                  background: page === i + 1 ? P : "white",
                  color: page === i + 1 ? "white" : TX2,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: page === i + 1 ? 600 : 400,
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              style={{
                padding: "5px 10px",
                border: `1px solid ${BD}`,
                borderRadius: 6,
                background: "white",
                cursor: "pointer",
                fontSize: 13,
                color: TX2,
              }}
            >
              Next ›
            </button>
          </div>
        </div>
      </div>

      {/* Certificate High-Fidelity Preview Dialog */}
      <Dialog open={!!previewCert} onOpenChange={(open) => !open && setPreviewCert(null)}>
        <DialogContent className="max-w-4xl p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col md:flex-row gap-6 z-[9999] max-h-[90vh] overflow-y-auto">
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-xl p-4 overflow-hidden relative min-h-[300px]">
            {previewCert && (
              <div
                id={`preview-cert-capture-${previewCert.id}`}
                className="shadow-lg rounded overflow-hidden origin-center"
              >
                <CertThumbnail
                  theme={previewCert.theme}
                  w={500}
                  h={350}
                  name={previewCert.name}
                  course={previewCert.course}
                  date={previewCert.date}
                  certId={previewCert.id}
                />
              </div>
            )}
          </div>
          {previewCert && (
            <div className="w-full md:w-[300px] flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold truncate">
                  {previewCert.course}
                </DialogTitle>
                <div className="text-xs text-muted-foreground mt-1">
                  Recipient: <strong className="text-foreground">{previewCert.name}</strong>
                </div>
                <div className="text-xs text-muted-foreground">Email: {previewCert.email}</div>
              </DialogHeader>

              <div className="border-t border-b py-3 flex flex-col gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Certificate ID:</span>
                  <span className="font-mono font-medium text-foreground">{previewCert.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issue Date:</span>
                  <span className="text-foreground">{previewCert.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expiry Date:</span>
                  <span className="text-foreground">{previewCert.expiry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <StatusBadge status={previewCert.status} />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-3 border border-dashed rounded-lg bg-slate-50 gap-2">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Secured Verification QR
                </div>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                    window.location.origin + "/verify/certificate/" + previewCert.id,
                  )}`}
                  alt="Verification QR"
                  className="w-20 h-20"
                />
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDownloadPDF(previewCert)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#6B5BFB] hover:bg-[#5a4be0] text-white text-xs font-semibold rounded-lg shadow transition-all duration-200"
                  >
                    <Download size={13} />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => handleDownloadImage(previewCert)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow transition-all duration-200"
                  >
                    <Download size={13} />
                    <span>Image</span>
                  </button>
                </div>
                <button
                  onClick={() => handleShare(previewCert)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-all duration-200"
                >
                  <Share2 size={13} />
                  <span>Share Certificate</span>
                </button>
                <button
                  onClick={() => handleSendEmail(previewCert)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-all duration-200"
                >
                  <Mail size={13} />
                  <span>Send to Email</span>
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {exportCert && (
        <div
          id={`export-cert-capture-${exportCert.id}`}
          style={{
            position: "fixed",
            left: "-9999px",
            top: "-9999px",
            width: "800px",
            height: "560px",
            zIndex: -1000,
          }}
        >
          <CertThumbnail theme={exportCert.theme} w={800} h={560} />
        </div>
      )}
    </div>
  );
}

// ─── Screen: Templates ────────────────────────────────────────────────────────
function TemplatesScreen({
  setTab,
  dbTemplates,
  handleSeed,
  handleEdit,
  handleDelete,
  handleDuplicate,
  isLoading,
}: {
  setTab: (t: string) => void;
  dbTemplates: CanvaTemplate[];
  handleSeed: () => void;
  handleEdit: (t: CanvaTemplate) => void;
  handleDelete: (id: string) => void;
  handleDuplicate?: (t: CanvaTemplate) => void;
  isLoading: boolean;
}) {
  const [activeChip, setActiveChip] = useState("All");
  const [searchT, setSearchT] = useState("");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [testTemplateModal, setTestTemplateModal] = useState<any | null>(null);
  const chips = [
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
  ];

  // Merge DB templates with mock for display
  const ALL_PUBLIC_SVG_TEMPLATES = useMemo(() => [
    { folder: "02-Python-Programming", name: "Python Programming", count: 16, category: "Technology" },
    { folder: "03-Web-Development", name: "Web Development", count: 18, category: "Technology" },
    { folder: "04-Excel-Data-Analysis", name: "Excel & Data Analysis", count: 23, category: "Business" },
    { folder: "05-Data-Structures", name: "Data Structures & Algorithms", count: 20, category: "Technology" },
    { folder: "01-UIUX-Design", name: "UI/UX Design", count: 17, category: "Design" },
    { folder: "06-Digital-Marketing", name: "Digital Marketing", count: 25, category: "Marketing" },
    { folder: "07-AI-Fundamentals", name: "AI Fundamentals", count: 14, category: "AI & Data" },
    { folder: "08-Data-Structures-2", name: "Advanced Data Structures", count: 20, category: "Technology" },
  ].flatMap((cat) =>
    Array.from({ length: cat.count }, (_, i) => {
      const num = i + 1;
      const url = `/templates/${cat.folder}/${num}.svg`;
      return {
        name: `${cat.name} #${num}`,
        badge: num <= 3 ? "Premium" : "Professional",
        badgeColor: num <= 3 ? "#92400E" : "#1E40AF",
        badgeBg: num <= 3 ? "#FEF3C7" : "#DBEAFE",
        bg_image_url: url,
        thumbnail_url: url,
        theme: "navy",
        rating: 4.8,
        reviews: 450 + num * 12,
        downloads: `${(1 + (num % 6) * 0.4).toFixed(1)}k`,
        dbTemplate: {
          id: `${cat.folder}-${num}`,
          name: `${cat.name} Template #${num}`,
          category: cat.category,
          bg_image_url: url,
          thumbnail_url: url,
          fields_json: null,
          theme_colors: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: null,
        } as CanvaTemplate,
      };
    }),
  ), []);

  // Merge DB templates with public SVG templates (deduplicated)
  const displayTemplates = useMemo(() => {
    const seen = new Set<string>();
    const list: any[] = [];
    if (dbTemplates && dbTemplates.length > 0) {
      dbTemplates.forEach((t) => {
        const key = (t.bg_image_url || t.name || "").trim().toLowerCase();
        if (key && !seen.has(key)) {
          seen.add(key);
          list.push({
            name: t.name,
            badge: t.category === "Premium" ? "Premium" : "Professional",
            badgeColor: t.category === "Premium" ? "#92400E" : "#1E40AF",
            badgeBg: t.category === "Premium" ? "#FEF3C7" : "#DBEAFE",
            bg_image_url: t.bg_image_url,
            thumbnail_url: t.thumbnail_url || t.bg_image_url,
            theme: "navy",
            rating: 4.9,
            reviews: 650,
            downloads: "3.2k",
            dbTemplate: t,
          });
        }
      });
    }
    ALL_PUBLIC_SVG_TEMPLATES.forEach((t) => {
      const key = (t.bg_image_url || t.name || "").trim().toLowerCase();
      if (key && !seen.has(key)) {
        seen.add(key);
        list.push(t);
      }
    });
    return list;
  }, [dbTemplates, ALL_PUBLIC_SVG_TEMPLATES]);

  const filtered = displayTemplates.filter((t) => {
    if (activeChip !== "All" && !t.name.toLowerCase().includes(activeChip.toLowerCase()))
      return false;
    if (searchT && !t.name.toLowerCase().includes(searchT.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "0 0 220px" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: TX3,
            }}
          />
          <input
            value={searchT}
            onChange={(e) => setSearchT(e.target.value)}
            placeholder="Search templates..."
            style={{
              width: "100%",
              paddingLeft: 32,
              paddingRight: 12,
              height: 36,
              border: `1px solid ${BD}`,
              borderRadius: 8,
              fontSize: 13,
              color: TX,
              outline: "none",
            }}
          />
        </div>
        {["Categories", "Style", "Theme", "Access"].map((f) => (
          <button
            key={f}
            style={{
              padding: "6px 12px",
              border: `1px solid ${BD}`,
              borderRadius: 8,
              background: "white",
              cursor: "pointer",
              fontSize: 13,
              color: TX2,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {f}
            <ChevronDown size={13} />
          </button>
        ))}
        <button
          onClick={() => { setSearchT(""); setActiveChip("All"); }}
          style={{
            padding: "6px 12px",
            border: `1px solid ${BD}`,
            borderRadius: 8,
            background: "white",
            cursor: "pointer",
            fontSize: 13,
            color: ER,
          }}
        >
          Reset
        </button>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Btn variant="outline" onClick={handleSeed}>
            <RefreshCw size={13} />
            Seed Templates
          </Btn>
          <Btn variant="primary" onClick={() => setTab("designer")}>
            <Plus size={14} />
            New Template
          </Btn>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {chips.map((c) => (
          <button
            key={c}
            onClick={() => setActiveChip(c)}
            style={{
              padding: "5px 14px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 500,
              border: "none",
              background: activeChip === c ? P : "#F3F4F6",
              color: activeChip === c ? "white" : "#374151",
              cursor: "pointer",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: TX }}>
          All Certificate SVG Templates ({filtered.length})
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select
            style={{
              border: `1px solid ${BD}`,
              borderRadius: 6,
              padding: "5px 10px",
              fontSize: 13,
              color: TX2,
            }}
          >
            <option>Most Recent</option>
            <option>Most Popular</option>
            <option>Top Rated</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: 16,
          }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: "white",
                border: `1px solid ${BD}`,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: 140,
                  background: "linear-gradient(90deg,#F3F4F6 25%,#E5E7EB 50%,#F3F4F6 75%)",
                  backgroundSize: "200% 100%",
                }}
              />
              <div style={{ padding: 12 }}>
                <div
                  style={{ height: 12, background: "#F3F4F6", borderRadius: 4, marginBottom: 8 }}
                />
                <div style={{ height: 10, background: "#F3F4F6", borderRadius: 4, width: "60%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: 16,
          }}
        >
          {filtered.map((t, i) => (
            <div
              key={i}
              onClick={() => handleEdit(t.dbTemplate)}
              style={{
                background: "white",
                border: `1px solid ${BD}`,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                e.currentTarget.style.transform = "scale(1.01)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <div style={{ position: "relative", width: "100%", height: 140, background: "#f8fafc" }}>
                {t.bg_image_url ? (
                  <img
                    src={t.bg_image_url}
                    alt={t.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <CertThumbnail theme={t.theme} w={220} h={140} />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const ns = new Set(favorites);
                    favorites.has(i) ? ns.delete(i) : ns.add(i);
                    setFavorites(ns);
                  }}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "rgba(255,255,255,0.9)",
                    border: "none",
                    borderRadius: "50%",
                    width: 28,
                    height: 28,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Heart
                    size={14}
                    color={favorites.has(i) ? ER : TX2}
                    fill={favorites.has(i) ? ER : "none"}
                  />
                </button>
              </div>
              <div style={{ padding: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: TX,
                      flex: 1,
                      minWidth: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t.name}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: t.badgeBg,
                      color: t.badgeColor,
                      flexShrink: 0,
                      marginLeft: 6,
                    }}
                  >
                    {t.badge}
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(t.bg_image_url, "_blank");
                      }}
                      style={{
                        padding: "5px 6px",
                        border: `1px solid ${BD}`,
                        borderRadius: 6,
                        background: "white",
                        cursor: "pointer",
                      }}
                      title="View SVG File"
                    >
                      <Eye size={12} color={TX2} />
                    </button>
                    {handleDuplicate && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(t.dbTemplate);
                        }}
                        style={{
                          padding: "5px 6px",
                          border: `1px solid ${BD}`,
                          borderRadius: 6,
                          background: "white",
                          cursor: "pointer",
                        }}
                        title="Duplicate Template"
                      >
                        <Copy size={12} color={TX2} />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTestTemplateModal(t);
                      }}
                      style={{
                        padding: "5px 6px",
                        border: `1px solid ${BD}`,
                        borderRadius: 6,
                        background: "#EEF2FF",
                        cursor: "pointer",
                      }}
                      title="Test Preview with Sample Data"
                    >
                      <Sparkles size={12} color={P} />
                    </button>
                  </div>
                  <Btn
                    variant="primary"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      handleEdit(t.dbTemplate);
                    }}
                    style={{ fontSize: 11, padding: "5px 12px" }}
                  >
                    Edit & Use
                  </Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Test Template with Sample Data Modal */}
      {testTemplateModal && (
        <Dialog open={!!testTemplateModal} onOpenChange={() => setTestTemplateModal(null)}>
          <DialogContent className="max-w-2xl bg-white border border-slate-200 p-6">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>Test Preview: {testTemplateModal.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                  Sample Data Validated
                </span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 my-2">
              <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center p-4">
                {testTemplateModal.bg_image_url ? (
                  <img
                    src={testTemplateModal.bg_image_url}
                    alt={testTemplateModal.name}
                    className="max-h-[320px] max-w-full object-contain shadow-md rounded"
                  />
                ) : (
                  <CertThumbnail theme={testTemplateModal.theme} w={450} h={300} />
                )}
                <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 text-xs shadow-md">
                  <div className="font-semibold text-slate-800">Alexandria Morgan</div>
                  <div className="text-[10px] text-slate-500">LRN-DEMO-2026 • Verified 100%</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t text-xs text-slate-500">
                <span>Sample Student: <strong>Alexandria Morgan</strong> (98% Score)</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTestTemplateModal(null)}
                    className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 text-xs"
                  >
                    Close
                  </button>
                  <Btn
                    variant="primary"
                    onClick={() => {
                      const tmpl = testTemplateModal.dbTemplate;
                      setTestTemplateModal(null);
                      handleEdit(tmpl);
                    }}
                    style={{ fontSize: 12, padding: "6px 14px" }}
                  >
                    Open in Studio Designer
                  </Btn>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// ─── Screen: Designer (wraps existing DesignerWorkspace) ─────────────────────
function DesignerCanvasScreen() {
  const [selectedEl, setSelectedEl] = useState<string | null>("recipient");
  const [zoom, setZoom] = useState(65);
  const [showGrid, setShowGrid] = useState(false);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [designTab, setDesignTab] = useState<"Design" | "Arrange">("Design");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showRealData, setShowRealData] = useState(false);
  const [themeStyle, setThemeStyle] = useState<"navy" | "engraved" | "emerald" | "obsidian" | "ivory">("navy");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const DEFAULT_ELEMENTS = [
    {
      id: "recipient",
      text: "{student_name}",
      fontFamily: "Great Vibes",
      fontSize: 78,
      fontColor: "#ffffff",
      bold: false,
      italic: true,
      underline: false,
      align: "center" as const,
      opacity: 100,
      x: 561,
      y: 440,
      rotation: 0,
      width: 760,
      height: 110,
      type: "text",
      isPrimary: true,
    },
    {
      id: "course",
      text: "Full Stack Web Development & AI Engineering",
      fontFamily: "Playfair Display",
      fontSize: 32,
      fontColor: "#C9A227",
      bold: true,
      italic: false,
      underline: false,
      align: "center" as const,
      opacity: 100,
      x: 561,
      y: 565,
      rotation: 0,
      width: 800,
      height: 60,
      type: "text",
      isPrimary: true,
    },
    {
      id: "cert_id",
      text: "#{certificate_id}",
      fontFamily: "monospace",
      fontSize: 13,
      fontColor: "#C9A227",
      bold: true,
      italic: false,
      underline: false,
      align: "center" as const,
      opacity: 90,
      x: 561,
      y: 735,
      rotation: 0,
      width: 320,
      height: 28,
      type: "text",
    },
  ];

  const [canvasElements, setCanvasElements] = useState(() => {
    try {
      const saved = localStorage.getItem("learnify_designer_canvas_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_ELEMENTS;
  });

  const activeEl = canvasElements.find((el) => el.id === selectedEl);

  const updateActiveEl = (updates: Partial<(typeof canvasElements)[0]>) => {
    if (!selectedEl) return;
    setCanvasElements((prev) =>
      prev.map((el) => (el.id === selectedEl ? { ...el, ...updates } : el)),
    );
  };

  const handleDragStart = (e: ReactMouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedEl(id);
    const startX = e.clientX;
    const startY = e.clientY;
    const initialEl = canvasElements.find((el) => el.id === id);
    if (!initialEl) return;
    const initialX = initialEl.x;
    const initialY = initialEl.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const zoomFactor = zoom / 100;
      setCanvasElements((prev) =>
        prev.map((el) =>
          el.id === id
            ? {
                ...el,
                x: Math.round(initialX + dx / zoomFactor),
                y: Math.round(initialY + dy / zoomFactor),
              }
            : el,
        ),
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleAddElement = (type: string) => {
    if (type === "upload") {
      fileInputRef.current?.click();
      return;
    }

    const newId = `element-${Date.now()}`;
    let newEl: any = {
      id: newId,
      fontFamily: "Inter",
      fontSize: 22,
      fontColor: "#ffffff",
      bold: false,
      italic: false,
      underline: false,
      align: "center" as const,
      opacity: 100,
      x: 561,
      y: 350,
      rotation: 0,
      width: 260,
      height: 50,
      type: type,
    };

    if (type === "text") {
      newEl.text = "Double click or edit text properties";
    } else if (type === "image") {
      newEl.text = "/logo.png";
      newEl.width = 100;
      newEl.height = 100;
    } else if (type === "shape") {
      newEl.width = 180;
      newEl.height = 80;
      newEl.shapeType = "rectangle";
    } else if (type === "qrcode") {
      newEl.width = 84;
      newEl.height = 84;
    } else if (type === "signature") {
      newEl.text = "Vishwajeet";
      newEl.fontFamily = "Great Vibes";
      newEl.fontSize = 32;
      newEl.width = 240;
      newEl.height = 60;
    } else if (type === "date") {
      newEl.text = "{issue_date}";
      newEl.fontSize = 16;
      newEl.fontColor = "rgba(255,255,255,0.75)";
    } else if (type === "id") {
      newEl.text = "#{certificate_id}";
      newEl.fontFamily = "monospace";
      newEl.fontSize = 14;
      newEl.fontColor = "#C9A227";
    }

    setCanvasElements((prev) => [...prev, newEl]);
    setSelectedEl(newId);
    toast.success(`Added new ${type} element!`);
  };

  const handleFileUpload = (e: ReactChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newId = `element-${Date.now()}`;
      const newEl = {
        id: newId,
        text: dataUrl,
        type: "image",
        x: 561,
        y: 360,
        width: 140,
        height: 140,
        opacity: 100,
        rotation: 0,
      };
      setCanvasElements((prev) => [...prev, newEl]);
      setSelectedEl(newId);
      toast.success("Image uploaded & placed on certificate!");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDeleteActive = () => {
    if (!selectedEl) return;
    if (selectedEl === "recipient" || selectedEl === "course") {
      toast.error("Recipient and Course title are foundational elements");
      return;
    }
    setCanvasElements((prev) => prev.filter((el) => el.id !== selectedEl));
    setSelectedEl(null);
    toast.success("Element deleted");
  };

  const handleDuplicateActive = () => {
    if (!selectedEl) return;
    const src = canvasElements.find((el) => el.id === selectedEl);
    if (!src) return;
    const newId = `element-${Date.now()}`;
    const copy = {
      ...src,
      id: newId,
      text: typeof src.text === "string" ? `${src.text}` : src.text,
      x: src.x + 24,
      y: src.y + 24,
    };
    setCanvasElements((prev) => [...prev, copy]);
    setSelectedEl(newId);
    toast.success("Element duplicated");
  };

  const handleLayerMove = (direction: "up" | "down" | "top" | "bottom") => {
    if (!selectedEl) return;
    setCanvasElements((prev) => {
      const idx = prev.findIndex((el) => el.id === selectedEl);
      if (idx === -1) return prev;
      const item = prev[idx];
      const next = prev.filter((el) => el.id !== selectedEl);
      if (direction === "top") return [...next, item];
      if (direction === "bottom") return [item, ...next];
      if (direction === "up") {
        const targetIdx = Math.min(next.length, idx + 1);
        next.splice(targetIdx, 0, item);
        return next;
      }
      if (direction === "down") {
        const targetIdx = Math.max(0, idx - 1);
        next.splice(targetIdx, 0, item);
        return next;
      }
      return prev;
    });
    toast.success("Layer order updated");
  };

  const handleAlign = (type: "center-h" | "center-v" | "left" | "right") => {
    if (!selectedEl) return;
    if (type === "center-h") updateActiveEl({ x: 561 });
    if (type === "center-v") updateActiveEl({ y: 397 });
    if (type === "left") updateActiveEl({ x: 250 });
    if (type === "right") updateActiveEl({ x: 872 });
    toast.success("Aligned element");
  };

  const handleDownload = (format: "png" | "pdf" | "svg") => {
    const svgElem = svgRef.current;
    if (!svgElem) {
      toast.error("Canvas element not ready");
      return;
    }

    if (format === "svg") {
      const xml = new XMLSerializer().serializeToString(svgElem);
      const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "learnify-certificate.svg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Exported vector SVG successfully!");
      return;
    }

    if (format === "png") {
      toast.promise(
        new Promise<void>((resolve, reject) => {
          try {
            const xml = new XMLSerializer().serializeToString(svgElem);
            const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
            const URLObj = window.URL || window.webkitURL || window;
            const blobURL = URLObj.createObjectURL(svgBlob);
            const img = new window.Image();
            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = 1122 * 2;
              canvas.height = 794 * 2;
              const ctx = canvas.getContext("2d");
              if (!ctx) return reject("No canvas context");
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = "high";
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              const pngUrl = canvas.toDataURL("image/png");
              const a = document.createElement("a");
              a.href = pngUrl;
              a.download = "learnify-certificate-2x.png";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URLObj.revokeObjectURL(blobURL);
              resolve();
            };
            img.onerror = () => reject("Image rendering error");
            img.src = blobURL;
          } catch (err) {
            reject(err);
          }
        }),
        {
          loading: "Rendering ultra-high-definition 2244×1588 PNG...",
          success: "Downloaded master 2X PNG certificate!",
          error: "PNG export failed. Try SVG export instead.",
        },
      );
      return;
    }

    if (format === "pdf") {
      setIsPreviewOpen(true);
      setTimeout(() => {
        window.print();
      }, 500);
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem("learnify_designer_canvas_v2", JSON.stringify(canvasElements));
      toast.success("Certificate template configuration saved to local storage!");
    } catch {
      toast.error("Failed to save template configuration.");
    }
  };

  const elementsList = [
    { id: "text", label: "Text", icon: <Type size={18} color={P} /> },
    { id: "image", label: "Image / Logo", icon: <Image size={18} color={IN} /> },
    { id: "shape", label: "Frame / Seal", icon: <Square size={18} color={SG} /> },
    { id: "qrcode", label: "QR Matrix", icon: <QrCode size={18} color={TX} /> },
    { id: "signature", label: "Signature", icon: <Pen size={18} color={WP} /> },
    { id: "date", label: "Date Field", icon: <Calendar size={18} color={ER} /> },
    { id: "id", label: "ID / No.", icon: <Hash size={18} color={TX2} /> },
    { id: "upload", label: "Upload Asset", icon: <FileUp size={18} color={WO} /> },
  ];

  const DYNAMIC_FIELDS = [
    { label: "Student Name", tag: "{student_name}", sample: "Vishwajeet Kumar" },
    { label: "Course Name", tag: "{course_title}", sample: "Full-Stack Web Development & AI Architecture" },
    { label: "Issue Date", tag: "{issue_date}", sample: "May 25, 2026" },
    { label: "Expiry Date", tag: "{expiry_date}", sample: "Lifetime Attestation" },
    { label: "Certificate ID", tag: "{certificate_id}", sample: "#LRN-SKR0ZR-MQP0YW81" },
    { label: "Score", tag: "{score}", sample: "98% (Honors Distinction)" },
    { label: "Grade", tag: "{grade}", sample: "Grade A+ (Exemplary)" },
    { label: "Instructor", tag: "{instructor}", sample: "Vishwajeet (Founder & CEO)" },
  ];

  const handleDynamicFieldClick = (field: (typeof DYNAMIC_FIELDS)[0]) => {
    if (activeEl && (activeEl.type === "text" || !activeEl.type)) {
      updateActiveEl({ text: field.tag });
      toast.success(`Injected ${field.tag} into selected element!`);
    } else {
      const newId = `element-${Date.now()}`;
      const newEl = {
        id: newId,
        text: field.tag,
        fontFamily: field.label === "Student Name" ? "Great Vibes" : "Space Grotesk",
        fontSize: field.label === "Student Name" ? 72 : 24,
        fontColor: field.label === "Student Name" ? "#ffffff" : "#C9A227",
        bold: false,
        italic: field.label === "Student Name",
        underline: false,
        align: "center" as const,
        opacity: 100,
        x: 561,
        y: 400 + (canvasElements.length % 4) * 35,
        rotation: 0,
        width: 600,
        height: 50,
        type: "text",
      };
      setCanvasElements((prev) => [...prev, newEl]);
      setSelectedEl(newId);
      toast.success(`Created dynamic ${field.label} element on canvas!`);
    }
  };

  const getResolvedText = (rawText: string) => {
    if (!showRealData || typeof rawText !== "string") return rawText;
    let s = rawText;
    DYNAMIC_FIELDS.forEach((df) => {
      s = s.replaceAll(df.tag, df.sample);
    });
    return s;
  };

  const THEMES: Record<string, { bg1: string; bg2: string; border: string; borderInner: string; textPrimary: string; textAccent: string }> = {
    navy: {
      bg1: "#0a0a2e",
      bg2: "#141448",
      border: "#C9A227",
      borderInner: "rgba(201,162,39,0.4)",
      textPrimary: "#ffffff",
      textAccent: "#C9A227",
    },
    engraved: {
      bg1: "#051319",
      bg2: "#0A2833",
      border: "#38BDF8",
      borderInner: "rgba(56,189,248,0.35)",
      textPrimary: "#ffffff",
      textAccent: "#38BDF8",
    },
    emerald: {
      bg1: "#06281E",
      bg2: "#0D4233",
      border: "#10B981",
      borderInner: "rgba(16,185,129,0.35)",
      textPrimary: "#ffffff",
      textAccent: "#34D399",
    },
    obsidian: {
      bg1: "#0B0F17",
      bg2: "#1E293B",
      border: "#818CF8",
      borderInner: "rgba(129,140,248,0.3)",
      textPrimary: "#ffffff",
      textAccent: "#A5B4FC",
    },
    ivory: {
      bg1: "#1A1713",
      bg2: "#2A231C",
      border: "#E2BA69",
      borderInner: "rgba(226,186,105,0.4)",
      textPrimary: "#FFF9F0",
      textAccent: "#E2BA69",
    },
  };

  const currentTheme = THEMES[themeStyle] || THEMES.navy;

  const renderCertificateSvg = (isModal = false) => {
    const recipient = canvasElements.find((el) => el.id === "recipient") || {
      text: "{student_name}",
      fontFamily: "Great Vibes",
      fontSize: 78,
      fontColor: "#ffffff",
      x: 561,
      y: 440,
      width: 760,
      height: 110,
    };
    const course = canvasElements.find((el) => el.id === "course") || {
      text: "Full Stack Web Development & AI Engineering",
      fontFamily: "Playfair Display",
      fontSize: 32,
      fontColor: "#C9A227",
      x: 561,
      y: 565,
      width: 800,
      height: 60,
    };

    return (
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 1122 794"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="themeCanvasBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentTheme.bg1} />
            <stop offset="100%" stopColor={currentTheme.bg2} />
          </linearGradient>
          <linearGradient id="goldRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ECC94B" />
            <stop offset="100%" stopColor="#B7791F" />
          </linearGradient>
        </defs>

        {/* Certificate Plate Canvas */}
        <rect width="1122" height="794" fill="url(#themeCanvasBg)" />

        {/* Grid Overlay */}
        {!isModal && showGrid && (
          <g opacity={0.4}>
            {Array.from({ length: 38 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 30}
                y1={0}
                x2={i * 30}
                y2={794}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
              />
            ))}
            {Array.from({ length: 27 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1={0}
                y1={i * 30}
                x2={1122}
                y2={i * 30}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
              />
            ))}
          </g>
        )}

        {/* Guilloche Rosette Watermark in Center Background */}
        <g opacity={0.08} stroke={currentTheme.border}>
          <circle cx="561" cy="397" r="220" fill="none" strokeWidth="1" strokeDasharray="6 3" />
          <circle cx="561" cy="397" r="170" fill="none" strokeWidth="1.5" />
          <circle cx="561" cy="397" r="120" fill="none" strokeWidth="1" strokeDasharray="4 4" />
          {Array.from({ length: 16 }).map((_, i) => (
            <ellipse
              key={i}
              cx="561"
              cy="397"
              rx="210"
              ry="70"
              fill="none"
              strokeWidth="0.75"
              transform={`rotate(${i * 11.25} 561 397)`}
            />
          ))}
        </g>

        {/* Outer Frame Borders */}
        <rect
          x="28"
          y="28"
          width="1066"
          height="738"
          fill="none"
          stroke={currentTheme.border}
          strokeWidth="4"
        />
        <rect
          x="42"
          y="42"
          width="1038"
          height="710"
          fill="none"
          stroke={currentTheme.borderInner}
          strokeWidth="1.5"
        />

        {/* Corner Ornaments */}
        <path d="M28,28 L130,28 L130,36 L36,36 L36,130 L28,130Z" fill={currentTheme.border} opacity="0.9" />
        <path d="M1094,28 L992,28 L992,36 L1086,36 L1086,130 L1094,130Z" fill={currentTheme.border} opacity="0.9" />
        <path d="M28,766 L130,766 L130,758 L36,758 L36,664 L28,664Z" fill={currentTheme.border} opacity="0.9" />
        <path d="M1094,766 L992,766 L992,758 L1086,758 L1086,664 L1094,664Z" fill={currentTheme.border} opacity="0.9" />

        {/* Learnify AI Brand Crest */}
        <g transform="translate(561, 105)">
          <circle cx="0" cy="0" r="28" fill="rgba(201,162,39,0.15)" stroke={currentTheme.border} strokeWidth="1.5" />
          <image href="/logo.png" x="-18" y="-18" width="36" height="36" preserveAspectRatio="contain" />
        </g>

        <text
          x="561"
          y="155"
          textAnchor="middle"
          fill={currentTheme.textAccent}
          fontSize="17"
          fontFamily="Space Grotesk,sans-serif"
          letterSpacing="8"
          fontWeight="700"
        >
          LEARNIFY AI
        </text>

        <text
          x="561"
          y="235"
          textAnchor="middle"
          fill={currentTheme.textPrimary}
          fontSize="72"
          fontFamily="Playfair Display,Georgia,serif"
          fontWeight="700"
          letterSpacing="14"
        >
          CERTIFICATE
        </text>
        <text
          x="561"
          y="280"
          textAnchor="middle"
          fill={currentTheme.textAccent}
          fontSize="22"
          letterSpacing="16"
          fontFamily="Space Grotesk,sans-serif"
          fontWeight="600"
        >
          OF COMPLETION
        </text>
        <text
          x="561"
          y="350"
          textAnchor="middle"
          fill="rgba(255,255,255,0.65)"
          fontSize="20"
          fontFamily="DM Sans,sans-serif"
        >
          This is to certify that
        </text>

        {/* Recipient Text */}
        <g
          transform={`rotate(${recipient.rotation || 0}, ${recipient.x}, ${recipient.y})`}
          style={{ opacity: (recipient.opacity ?? 100) / 100 }}
        >
          {!isModal && (
            <rect
              x={recipient.x - recipient.width / 2}
              y={recipient.y - 70}
              width={recipient.width}
              height={recipient.height}
              fill={selectedEl === "recipient" ? "rgba(107,91,251,0.15)" : "transparent"}
              stroke={selectedEl === "recipient" ? "#6B5BFB" : "transparent"}
              strokeWidth="2"
              strokeDasharray="8 4"
              rx="6"
              onClick={() => setSelectedEl("recipient")}
              onMouseDown={(e) => handleDragStart(e, "recipient")}
              style={{ cursor: "move" }}
            />
          )}
          <text
            x={recipient.x}
            y={recipient.y}
            textAnchor="middle"
            fill={recipient.fontColor}
            fontSize={recipient.fontSize}
            fontFamily={`${recipient.fontFamily},Georgia,serif`}
            fontStyle={recipient.italic ? "italic" : "normal"}
            fontWeight={recipient.bold ? "bold" : "normal"}
            textDecoration={recipient.underline ? "underline" : "none"}
            onClick={() => setSelectedEl("recipient")}
            onMouseDown={(e) => (!isModal ? handleDragStart(e, "recipient") : undefined)}
            style={{ cursor: !isModal ? "move" : "default", userSelect: "none" }}
          >
            {getResolvedText(recipient.text)}
          </text>
        </g>

        <line
          x1="220"
          y1="475"
          x2="902"
          y2="475"
          stroke={currentTheme.borderInner}
          strokeWidth="1.5"
        />
        <text
          x="561"
          y="515"
          textAnchor="middle"
          fill="rgba(255,255,255,0.7)"
          fontSize="19"
          fontFamily="DM Sans,sans-serif"
        >
          has successfully completed the curriculum track and engineering milestones for
        </text>

        {/* Course Text */}
        <g
          transform={`rotate(${course.rotation || 0}, ${course.x}, ${course.y})`}
          style={{ opacity: (course.opacity ?? 100) / 100 }}
        >
          {!isModal && (
            <rect
              x={course.x - course.width / 2}
              y={course.y - 45}
              width={course.width}
              height={course.height}
              fill={selectedEl === "course" ? "rgba(107,91,251,0.15)" : "transparent"}
              stroke={selectedEl === "course" ? "#6B5BFB" : "transparent"}
              strokeWidth="2"
              strokeDasharray="6 3"
              rx="6"
              onClick={() => setSelectedEl("course")}
              onMouseDown={(e) => handleDragStart(e, "course")}
              style={{ cursor: "move" }}
            />
          )}
          <text
            x={course.x}
            y={course.y}
            textAnchor="middle"
            fill={course.fontColor}
            fontSize={course.fontSize}
            fontFamily={`${course.fontFamily},Georgia,serif`}
            fontStyle={course.italic ? "italic" : "normal"}
            fontWeight={course.bold ? "bold" : "normal"}
            textDecoration={course.underline ? "underline" : "none"}
            onClick={() => setSelectedEl("course")}
            onMouseDown={(e) => (!isModal ? handleDragStart(e, "course") : undefined)}
            style={{ cursor: !isModal ? "move" : "default", userSelect: "none" }}
          >
            {getResolvedText(course.text)}
          </text>
        </g>

        {/* Signatures & Seal Base */}
        <line x1="160" y1="645" x2="420" y2="645" stroke={currentTheme.borderInner} strokeWidth="1" />
        <line x1="702" y1="645" x2="962" y2="645" stroke={currentTheme.borderInner} strokeWidth="1" />
        <text
          x="290"
          y="665"
          textAnchor="middle"
          fill="rgba(255,255,255,0.7)"
          fontSize="17"
          fontFamily="DM Sans,sans-serif"
        >
          {getResolvedText("{issue_date}")}
        </text>
        <text
          x="290"
          y="686"
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="13"
          fontFamily="DM Sans,sans-serif"
        >
          Date of Conferral
        </text>
        <text
          x="832"
          y="665"
          textAnchor="middle"
          fill="rgba(255,255,255,0.8)"
          fontSize="22"
          fontFamily="Great Vibes,cursive"
        >
          Vishwajeet
        </text>
        <text
          x="832"
          y="686"
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="13"
          fontFamily="DM Sans,sans-serif"
        >
          Founder & CEO, Learnify AI
        </text>

        {/* Central Golden Seal */}
        <circle
          cx="561"
          cy="660"
          r="52"
          fill="rgba(201,162,39,0.12)"
          stroke={currentTheme.border}
          strokeWidth="2.5"
        />
        <circle
          cx="561"
          cy="660"
          r="40"
          fill="none"
          stroke="rgba(201,162,39,0.4)"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />
        <text x="561" y="672" textAnchor="middle" fill={currentTheme.border} fontSize="34" fontFamily="serif">
          ✦
        </text>

        {/* High-Tech QR Code */}
        <g transform="translate(988, 680)">
          <rect width="84" height="84" fill="white" rx="6" stroke={currentTheme.border} strokeWidth="1" />
          <rect x="7" y="7" width="20" height="20" fill="#0F172A" rx="2" />
          <rect x="9" y="9" width="16" height="16" fill="white" rx="1" />
          <rect x="11" y="11" width="12" height="12" fill="#0F172A" rx="0.5" />

          <rect x="57" y="7" width="20" height="20" fill="#0F172A" rx="2" />
          <rect x="59" y="9" width="16" height="16" fill="white" rx="1" />
          <rect x="61" y="11" width="12" height="12" fill="#0F172A" rx="0.5" />

          <rect x="7" y="57" width="20" height="20" fill="#0F172A" rx="2" />
          <rect x="9" y="59" width="16" height="16" fill="white" rx="1" />
          <rect x="11" y="61" width="12" height="12" fill="#0F172A" rx="0.5" />

          <rect x="32" y="12" width="8" height="8" fill="#0F172A" rx="1" />
          <rect x="44" y="18" width="10" height="6" fill="#0F172A" rx="1" />
          <rect x="34" y="32" width="14" height="6" fill="#0F172A" rx="1" />
          <rect x="18" y="40" width="8" height="12" fill="#0F172A" rx="1" />
          <rect x="36" y="46" width="10" height="8" fill="#0F172A" rx="1" />
          <rect x="50" y="38" width="14" height="14" fill="#0F172A" rx="1" />
          <rect x="58" y="58" width="8" height="8" fill="#0F172A" rx="1" />
        </g>

        {/* Dynamic / Custom Canvas Elements */}
        {canvasElements.map((el) => {
          if (el.id === "recipient" || el.id === "course") return null;
          const isSelected = selectedEl === el.id;
          return (
            <g
              key={el.id}
              transform={`rotate(${el.rotation || 0}, ${el.x}, ${el.y})`}
              style={{ opacity: (el.opacity ?? 100) / 100 }}
            >
              {!isModal && (
                <rect
                  x={el.x - el.width / 2}
                  y={el.y - el.height / 2}
                  width={el.width}
                  height={el.height}
                  fill={isSelected ? "rgba(107,91,251,0.18)" : "transparent"}
                  stroke={isSelected ? "#6B5BFB" : "transparent"}
                  strokeWidth="2"
                  strokeDasharray="6 3"
                  rx="4"
                  onClick={() => setSelectedEl(el.id)}
                  onMouseDown={(e) => handleDragStart(e, el.id)}
                  style={{ cursor: "move" }}
                />
              )}

              {el.type === "image" ? (
                <image
                  href={el.text || "/logo.png"}
                  x={el.x - el.width / 2}
                  y={el.y - el.height / 2}
                  width={el.width}
                  height={el.height}
                  preserveAspectRatio="contain"
                  onClick={() => setSelectedEl(el.id)}
                  onMouseDown={(e) => (!isModal ? handleDragStart(e, el.id) : undefined)}
                  style={{ cursor: !isModal ? "move" : "default" }}
                />
              ) : el.type === "qrcode" ? (
                <g transform={`translate(${el.x - el.width / 2}, ${el.y - el.height / 2})`}>
                  <rect width={el.width} height={el.height} fill="white" rx={4} />
                  <rect x="6" y="6" width="18" height="18" fill="#0F172A" />
                  <rect x="8" y="8" width="14" height="14" fill="white" />
                  <rect x="10" y="10" width="10" height="10" fill="#0F172A" />
                  <rect x={el.width - 24} y="6" width="18" height="18" fill="#0F172A" />
                  <rect x={el.width - 22} y="8" width="14" height="14" fill="white" />
                  <rect x={el.width - 20} y="10" width="10" height="10" fill="#0F172A" />
                  <rect x="6" y={el.height - 24} width="18" height="18" fill="#0F172A" />
                  <rect x="8" y={el.height - 22} width="14" height="14" fill="white" />
                  <rect x="10" y={el.height - 20} width="10" height="10" fill="#0F172A" />
                </g>
              ) : el.type === "signature" ? (
                <g transform={`translate(${el.x - el.width / 2}, ${el.y - el.height / 2})`}>
                  <text
                    x={el.width / 2}
                    y={el.height - 18}
                    textAnchor="middle"
                    fill={el.fontColor || "#C9A227"}
                    fontSize={el.fontSize || 30}
                    fontFamily="Great Vibes,cursive"
                  >
                    {getResolvedText(el.text)}
                  </text>
                  <line
                    x1={10}
                    y1={el.height - 8}
                    x2={el.width - 10}
                    y2={el.height - 8}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1"
                  />
                </g>
              ) : el.type === "shape" ? (
                <rect
                  x={el.x - el.width / 2}
                  y={el.y - el.height / 2}
                  width={el.width}
                  height={el.height}
                  fill="none"
                  stroke={currentTheme.border}
                  strokeWidth="2"
                  rx={6}
                />
              ) : (
                <text
                  x={el.x}
                  y={el.y + el.height / 4}
                  textAnchor={
                    el.align === "left" ? "start" : el.align === "right" ? "end" : "middle"
                  }
                  fill={el.fontColor}
                  fontSize={el.fontSize}
                  fontFamily={`${el.fontFamily},sans-serif`}
                  fontStyle={el.italic ? "italic" : "normal"}
                  fontWeight={el.bold ? "bold" : "normal"}
                  textDecoration={el.underline ? "underline" : "none"}
                  onClick={() => setSelectedEl(el.id)}
                  onMouseDown={(e) => (!isModal ? handleDragStart(e, el.id) : undefined)}
                  style={{ cursor: !isModal ? "move" : "default", userSelect: "none" }}
                >
                  {getResolvedText(el.text)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 120px)",
        background: "white",
        border: `1px solid ${BD}`,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
      }}
    >
      {/* Hidden File Input for Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />

      {/* Top Toolbar */}
      <div
        style={{
          borderBottom: `1px solid ${BD}`,
          padding: "10px 18px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "#FAFAFA",
          flexWrap: "wrap",
        }}
      >
        {/* Rotate Controls */}
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => updateActiveEl({ rotation: Math.max(0, (activeEl?.rotation || 0) - 15) })}
            style={{
              padding: 6,
              border: `1px solid ${BD}`,
              borderRadius: 8,
              background: "white",
              cursor: "pointer",
            }}
            title="Rotate Left 15°"
          >
            <RotateCcw size={14} color={TX2} />
          </button>
          <button
            onClick={() => updateActiveEl({ rotation: Math.min(360, (activeEl?.rotation || 0) + 15) })}
            style={{
              padding: 6,
              border: `1px solid ${BD}`,
              borderRadius: 8,
              background: "white",
              cursor: "pointer",
            }}
            title="Rotate Right 15°"
          >
            <RotateCw size={14} color={TX2} />
          </button>
        </div>

        <div style={{ width: 1, height: 22, background: BD }} />

        {/* Zoom Controls */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <button
            onClick={() => setZoom((z) => Math.max(30, z - 10))}
            style={{
              padding: "4px 10px",
              border: `1px solid ${BD}`,
              borderRadius: 8,
              background: "white",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
            }}
            title="Zoom Out"
          >
            −
          </button>
          <span
            style={{ fontSize: 13, fontWeight: 700, color: TX, minWidth: 46, textAlign: "center", fontVariantNumeric: "tabular-nums" }}
          >
            {zoom}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(160, z + 10))}
            style={{
              padding: "4px 10px",
              border: `1px solid ${BD}`,
              borderRadius: 8,
              background: "white",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
            }}
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => setZoom(65)}
            style={{
              padding: "4px 8px",
              border: `1px solid ${BD}`,
              borderRadius: 8,
              background: "white",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              color: TX2,
            }}
            title="Fit to Screen"
          >
            Fit
          </button>
        </div>

        <div style={{ width: 1, height: 22, background: BD }} />

        {/* Theme Color Presets */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: TX2 }}>Theme:</span>
          {(
            [
              { id: "navy", label: "Navy", color: "#0a0a2e" },
              { id: "engraved", label: "Sky", color: "#051319" },
              { id: "emerald", label: "Emerald", color: "#06281E" },
              { id: "obsidian", label: "Obsidian", color: "#0B0F17" },
              { id: "ivory", label: "Ivory", color: "#2A231C" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setThemeStyle(t.id)}
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: t.color,
                border: themeStyle === t.id ? "2px solid #6B5BFB" : "1px solid #D1D5DB",
                cursor: "pointer",
                boxShadow: themeStyle === t.id ? "0 0 0 2px rgba(107,91,251,0.3)" : "none",
              }}
              title={t.label}
            />
          ))}
        </div>

        <div style={{ width: 1, height: 22, background: BD }} />

        {/* Grid & Sample Data Toggles */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            fontSize: 13,
            color: TX2,
            userSelect: "none",
          }}
        >
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
            style={{ accentColor: P }}
          />
          Grid
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            fontSize: 13,
            color: showRealData ? P : TX2,
            fontWeight: showRealData ? 600 : 400,
            userSelect: "none",
          }}
        >
          <input
            type="checkbox"
            checked={showRealData}
            onChange={(e) => setShowRealData(e.target.checked)}
            style={{ accentColor: P }}
          />
          Sample Data
        </label>

        {/* Right Action Suite */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <Btn variant="outline" onClick={() => setIsPreviewOpen(true)}>
            <Eye size={14} />
            Preview
          </Btn>
          <Btn variant="outline" onClick={handleSave}>
            <Save size={14} />
            Save
          </Btn>

          <div style={{ position: "relative", display: "inline-block" }} className="group">
            <Btn variant="primary">
              <Download size={14} />
              Download ▾
            </Btn>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 z-50 min-w-[150px]">
              <button
                onClick={() => handleDownload("png")}
                className="px-3.5 py-2 text-xs text-left text-slate-700 hover:bg-slate-50 w-full font-medium flex items-center gap-2 cursor-pointer"
              >
                <Download size={13} className="text-emerald-600" /> Export 2X PNG
              </button>
              <button
                onClick={() => handleDownload("svg")}
                className="px-3.5 py-2 text-xs text-left text-slate-700 hover:bg-slate-50 w-full font-medium flex items-center gap-2 cursor-pointer"
              >
                <Download size={13} className="text-indigo-600" /> Export Vector SVG
              </button>
              <button
                onClick={() => handleDownload("pdf")}
                className="px-3.5 py-2 text-xs text-left text-slate-700 hover:bg-slate-50 w-full font-medium flex items-center gap-2 cursor-pointer"
              >
                <Download size={13} className="text-amber-600" /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Sidebar: Add Elements */}
        <div
          style={{
            width: 190,
            borderRight: `1px solid ${BD}`,
            padding: 14,
            overflowY: "auto",
            flexShrink: 0,
            background: "#FAFAFA",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: TX2,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 12,
            }}
          >
            Add Elements
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {elementsList.map((el) => (
              <button
                key={el.id}
                onClick={() => handleAddElement(el.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "12px 6px",
                  border: `1px solid ${BD}`,
                  borderRadius: 10,
                  background: "white",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 600,
                  color: TX,
                  transition: "all 0.15s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = PL;
                  e.currentTarget.style.borderColor = P;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.borderColor = BD;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {el.icon}
                <span>{el.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Central Canvas Viewport */}
        <div
          style={{
            flex: 1,
            background: "#F1F5F9",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
            position: "relative",
            padding: "20px 20px 60px",
          }}
          onClick={() => setSelectedEl(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: `min(${zoom}vw, ${1122 * (zoom / 100)}px)`,
              aspectRatio: "1122/794",
              maxWidth: "96%",
              background: currentTheme.bg1,
              borderRadius: 12,
              boxShadow: "0 10px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.08)",
              position: "relative",
              overflow: "hidden",
              flexShrink: 0,
              transition: "width 0.1s ease-out",
            }}
          >
            {renderCertificateSvg(false)}
          </div>

          {/* Dynamic Fields Ribbon Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(8px)",
              borderTop: `1px solid ${BD}`,
              padding: "10px 18px",
              display: "flex",
              gap: 8,
              alignItems: "center",
              overflowX: "auto",
              zIndex: 10,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: TX2, flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              ✦ Dynamic Fields:
            </span>
            {DYNAMIC_FIELDS.map((f) => (
              <button
                key={f.tag}
                onClick={() => handleDynamicFieldClick(f)}
                style={{
                  padding: "4px 12px",
                  border: `1px solid ${BD}`,
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  background: "white",
                  cursor: "pointer",
                  flexShrink: 0,
                  color: TX,
                  transition: "all 0.15s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = PL;
                  e.currentTarget.style.borderColor = P;
                  e.currentTarget.style.color = P;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.borderColor = BD;
                  e.currentTarget.style.color = TX;
                }}
              >
                <span>{f.label}</span>
                <span style={{ fontSize: 10, color: TX3, fontFamily: "monospace" }}>{f.tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Properties Panel */}
        <div
          style={{
            width: 275,
            borderLeft: `1px solid ${BD}`,
            padding: 16,
            overflowY: "auto",
            flexShrink: 0,
            background: "#FAFAFA",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 0,
              marginBottom: 16,
              border: `1px solid ${BD}`,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {(["Design", "Arrange"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setDesignTab(t)}
                style={{
                  flex: 1,
                  padding: "8px 4px",
                  border: "none",
                  background: designTab === t ? P : "white",
                  color: designTab === t ? "white" : TX2,
                  fontSize: 12,
                  fontWeight: designTab === t ? 700 : 500,
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {activeEl ? (
            <>
              {designTab === "Design" && (
                <>
                  <div style={{ marginBottom: 18 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: TX2,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 10,
                      }}
                    >
                      {activeEl.type === "image" ? "Image Properties" : "Text Properties"}
                    </div>

                    {/* Content Input */}
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ fontSize: 11, color: TX2, display: "block", marginBottom: 4, fontWeight: 600 }}>
                        {activeEl.type === "image" ? "Image URL / Asset" : "Text Content"}
                      </label>
                      <input
                        type="text"
                        value={activeEl.text || ""}
                        onChange={(e) => updateActiveEl({ text: e.target.value })}
                        style={{
                          width: "100%",
                          border: `1px solid ${BD}`,
                          borderRadius: 8,
                          padding: "7px 10px",
                          fontSize: 12,
                          color: TX,
                          background: "white",
                        }}
                      />
                    </div>

                    {activeEl.type !== "image" && activeEl.type !== "shape" && activeEl.type !== "qrcode" && (
                      <>
                        {/* Font Family */}
                        <div style={{ marginBottom: 10 }}>
                          <label style={{ fontSize: 11, color: TX2, display: "block", marginBottom: 4, fontWeight: 600 }}>
                            Font Family
                          </label>
                          <select
                            value={activeEl.fontFamily || "Inter"}
                            onChange={(e) => updateActiveEl({ fontFamily: e.target.value })}
                            style={{
                              width: "100%",
                              border: `1px solid ${BD}`,
                              borderRadius: 8,
                              padding: "7px 10px",
                              fontSize: 12,
                              color: TX,
                              background: "white",
                              cursor: "pointer",
                            }}
                          >
                            <option value="Great Vibes">Great Vibes (Calligraphy)</option>
                            <option value="Playfair Display">Playfair Display (Executive Serif)</option>
                            <option value="Cinzel">Cinzel (Imperial Serif)</option>
                            <option value="Space Grotesk">Space Grotesk (Modern Tech)</option>
                            <option value="DM Sans">DM Sans (Clean Geometric)</option>
                            <option value="Inter">Inter (Standard UI)</option>
                            <option value="Montserrat">Montserrat (Modern Heading)</option>
                            <option value="monospace">Monospace (Attestation Code)</option>
                          </select>
                        </div>

                        {/* Size & Color */}
                        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: 11, color: TX2, display: "block", marginBottom: 4, fontWeight: 600 }}>
                              Size (px)
                            </label>
                            <input
                              type="number"
                              value={activeEl.fontSize || 24}
                              onChange={(e) => updateActiveEl({ fontSize: +e.target.value })}
                              style={{
                                width: "100%",
                                border: `1px solid ${BD}`,
                                borderRadius: 8,
                                padding: "6px 8px",
                                fontSize: 12,
                                color: TX,
                                background: "white",
                              }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: 11, color: TX2, display: "block", marginBottom: 4, fontWeight: 600 }}>
                              Color
                            </label>
                            <div
                              style={{
                                border: `1px solid ${BD}`,
                                borderRadius: 8,
                                padding: "4px 8px",
                                display: "flex",
                                gap: 6,
                                alignItems: "center",
                                background: "white",
                              }}
                            >
                              <div
                                style={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: 4,
                                  background: activeEl.fontColor || "#ffffff",
                                  border: "1px solid rgba(0,0,0,0.15)",
                                  flexShrink: 0,
                                }}
                              />
                              <input
                                value={activeEl.fontColor || "#ffffff"}
                                onChange={(e) => updateActiveEl({ fontColor: e.target.value })}
                                style={{
                                  border: "none",
                                  fontSize: 12,
                                  color: TX,
                                  width: "100%",
                                  outline: "none",
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Bold / Italic / Underline */}
                        <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                          {[
                            {
                              label: "B",
                              active: activeEl.bold,
                              toggle: () => updateActiveEl({ bold: !activeEl.bold }),
                            },
                            {
                              label: "I",
                              active: activeEl.italic,
                              toggle: () => updateActiveEl({ italic: !activeEl.italic }),
                            },
                            {
                              label: "U",
                              active: activeEl.underline,
                              toggle: () => updateActiveEl({ underline: !activeEl.underline }),
                            },
                          ].map((b) => (
                            <button
                              key={b.label}
                              onClick={b.toggle}
                              style={{
                                flex: 1,
                                padding: "6px",
                                border: `1px solid ${b.active ? P : BD}`,
                                borderRadius: 8,
                                background: b.active ? PL : "white",
                                color: b.active ? P : TX,
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              {b.label}
                            </button>
                          ))}
                        </div>

                        {/* Alignment */}
                        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                          {[
                            { icon: <AlignLeft size={14} />, val: "left" },
                            { icon: <AlignCenter size={14} />, val: "center" },
                            { icon: <AlignRight size={14} />, val: "right" },
                          ].map((a) => (
                            <button
                              key={a.val}
                              onClick={() => updateActiveEl({ align: a.val as any })}
                              style={{
                                flex: 1,
                                padding: "6px",
                                border: `1px solid ${activeEl.align === a.val ? P : BD}`,
                                borderRadius: 8,
                                background: activeEl.align === a.val ? PL : "white",
                                color: activeEl.align === a.val ? P : TX2,
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              {a.icon}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Element Properties: Opacity */}
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: TX2,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 8,
                      }}
                    >
                      Element Properties
                    </div>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <label style={{ fontSize: 11, color: TX2, fontWeight: 600 }}>Opacity</label>
                        <span style={{ fontSize: 11, color: TX, fontWeight: 700 }}>{activeEl.opacity ?? 100}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={activeEl.opacity ?? 100}
                        onChange={(e) => updateActiveEl({ opacity: +e.target.value })}
                        style={{ width: "100%", accentColor: P }}
                      />
                    </div>
                  </div>

                  {/* Color Swatches */}
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: TX2,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 8,
                      }}
                    >
                      Preset Colors
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["#C9A227", "#ffffff", "#10B981", "#6B5BFB", "#38BDF8", "#F59E0B", "#EF4444"].map((c) => (
                        <div
                          key={c}
                          onClick={() => updateActiveEl({ fontColor: c })}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            background: c,
                            border: `1px solid ${BD}`,
                            cursor: "pointer",
                            boxShadow: activeEl.fontColor === c ? `0 0 0 2px ${P}` : "none",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {designTab === "Arrange" && (
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: TX2,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 10,
                    }}
                  >
                    Position & Size
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    {[
                      { label: "X (px)", val: activeEl.x, key: "x" },
                      { label: "Y (px)", val: activeEl.y, key: "y" },
                      { label: "Width (px)", val: activeEl.width, key: "width" },
                      { label: "Height (px)", val: activeEl.height, key: "height" },
                    ].map((f) => (
                      <div key={f.key}>
                        <label
                          style={{ fontSize: 11, color: TX2, display: "block", marginBottom: 3, fontWeight: 600 }}
                        >
                          {f.label}
                        </label>
                        <input
                          type="number"
                          value={f.val}
                          onChange={(e) => updateActiveEl({ [f.key]: +e.target.value })}
                          style={{
                            width: "100%",
                            border: `1px solid ${BD}`,
                            borderRadius: 8,
                            padding: "6px 8px",
                            fontSize: 12,
                            color: TX,
                            background: "white",
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Quick Alignment */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 11, color: TX2, display: "block", marginBottom: 6, fontWeight: 600 }}>
                      Quick Alignment
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      <Btn variant="outline" onClick={() => handleAlign("center-h")} style={{ fontSize: 11, padding: "5px 6px", justifyContent: "center" }}>
                        Center Horiz
                      </Btn>
                      <Btn variant="outline" onClick={() => handleAlign("center-v")} style={{ fontSize: 11, padding: "5px 6px", justifyContent: "center" }}>
                        Center Vert
                      </Btn>
                      <Btn variant="outline" onClick={() => handleAlign("left")} style={{ fontSize: 11, padding: "5px 6px", justifyContent: "center" }}>
                        Align Left
                      </Btn>
                      <Btn variant="outline" onClick={() => handleAlign("right")} style={{ fontSize: 11, padding: "5px 6px", justifyContent: "center" }}>
                        Align Right
                      </Btn>
                    </div>
                  </div>

                  {/* Rotation */}
                  <div style={{ marginBottom: 14 }}>
                    <div
                      style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}
                    >
                      <label style={{ fontSize: 11, color: TX2, fontWeight: 600 }}>Rotation Angle</label>
                      <span style={{ fontSize: 11, color: TX, fontWeight: 700 }}>{activeEl.rotation || 0}°</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={activeEl.rotation || 0}
                      onChange={(e) => updateActiveEl({ rotation: +e.target.value })}
                      style={{ width: "100%", accentColor: P }}
                    />
                    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                      {[0, 90, 180, 270].map((deg) => (
                        <button
                          key={deg}
                          onClick={() => updateActiveEl({ rotation: deg })}
                          style={{
                            flex: 1,
                            padding: "3px 2px",
                            fontSize: 10,
                            border: `1px solid ${BD}`,
                            borderRadius: 6,
                            background: "white",
                            cursor: "pointer",
                            fontWeight: 600,
                            color: TX2,
                          }}
                        >
                          {deg}°
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Layer Ordering */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 11, color: TX2, display: "block", marginBottom: 6, fontWeight: 600 }}>
                      Layer Order
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      <Btn variant="outline" onClick={() => handleLayerMove("top")} style={{ fontSize: 11, padding: "5px 6px", justifyContent: "center" }}>
                        Bring to Front
                      </Btn>
                      <Btn variant="outline" onClick={() => handleLayerMove("bottom")} style={{ fontSize: 11, padding: "5px 6px", justifyContent: "center" }}>
                        Send to Back
                      </Btn>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ marginTop: 16, display: "flex", gap: 6 }}>
                    <Btn
                      variant="outline"
                      onClick={handleDuplicateActive}
                      style={{ flex: 1, justifyContent: "center", fontSize: 12 }}
                    >
                      <Copy size={13} />
                      Duplicate
                    </Btn>
                    <Btn
                      variant="danger"
                      onClick={handleDeleteActive}
                      style={{ flex: 1, justifyContent: "center", fontSize: 12 }}
                    >
                      <Trash2 size={13} />
                      Delete
                    </Btn>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ fontSize: 13, color: TX2, textAlign: "center", padding: "40px 10px" }}>
              <Sparkles size={24} color={P} style={{ margin: "0 auto 10px", opacity: 0.6 }} />
              <div style={{ fontWeight: 600, color: TX, marginBottom: 4 }}>No Element Selected</div>
              <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                Click any text or image on the certificate canvas to configure its properties or arrange its layout.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div
        style={{
          borderTop: `1px solid ${BD}`,
          padding: "10px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 12,
          color: TX2,
          flexShrink: 0,
          background: "#FAFAFA",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 600, color: TX }}>Template: Dynamic Canvas Engine</span>
          <span style={{ color: BD }}>•</span>
          <span style={{ color: SG, fontWeight: 600 }}>✓ Interactive WYSIWYG Active</span>
          <span style={{ color: BD }}>•</span>
          <span style={{ fontSize: 11 }}>{canvasElements.length} elements</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn
            variant="outline"
            onClick={() => {
              if (window.confirm("Reset all canvas elements to default layout?")) {
                setCanvasElements(DEFAULT_ELEMENTS);
                localStorage.removeItem("learnify_designer_canvas_v2");
                toast.success("Reset canvas to default certificate layout");
              }
            }}
          >
            Reset
          </Btn>
          <Btn variant="primary" onClick={handleSave} style={{ fontSize: 12, padding: "5px 14px" }}>
            <Save size={12} />
            Save Changes
          </Btn>
        </div>
      </div>

      {/* Fullscreen Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[92vw] w-[960px] bg-slate-950 border-slate-800 text-white p-6 animate-in fade-in zoom-in-95 duration-200">
          <DialogHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
              <Award className="text-amber-400 h-5 w-5" />
              Certificate Master Preview (Print & Verifiable Mode)
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-6 bg-slate-900 rounded-2xl overflow-auto border border-slate-800 shadow-2xl">
            <div style={{ width: 880, aspectRatio: "1122/794", position: "relative" }}>
              {renderCertificateSvg(true)}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
// ─── Screen: Bulk Issue ───────────────────────────────────────────────────────
function BulkIssueScreen({ courses = [], templates = [] }: { courses: any[]; templates: any[] }) {
  const [step, setStep] = useState(1);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [autoWallet, setAutoWallet] = useState(true);
  const [csvText, setCsvText] = useState("");
  const [parsedRecipients, setParsedRecipients] = useState<any[]>([]);
  const [mappedFields, setMappedFields] = useState<any>({
    name: "student_name",
    email: "email",
    score: "score",
    total: "total",
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [issueSummary, setIssueSummary] = useState<any>(null);

  useEffect(() => {
    if (templates.length && !selectedTemplateId) {
      setSelectedTemplateId(templates[0].id);
    }
    if (courses.length && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [templates, courses]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setCsvText(text);
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length < 2) {
      toast.error("CSV file is empty or invalid");
      return;
    }
    const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
    const records = lines.slice(1).map((line) => {
      const parts = line.split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""));
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = parts[idx] ?? "";
      });
      return row;
    });

    const findHeader = (aliases: string[]) =>
      headers.find((h) => aliases.some((a) => h.toLowerCase().includes(a.toLowerCase()))) || headers[0] || "";

    const nameKey = findHeader(["student_name", "recipient_name", "name", "student"]);
    const emailKey = findHeader(["email", "mail", "address"]);
    const scoreKey = findHeader(["score", "mark", "grade"]);
    const totalKey = findHeader(["total", "max"]);

    setMappedFields({
      name: nameKey,
      email: emailKey,
      score: scoreKey,
      total: totalKey,
    });

    setParsedRecipients(records);
    setFileUploaded(true);
    toast.success(`Successfully parsed ${records.length} records.`);
  };

  const handleManualParse = () => {
    if (!csvText) {
      toast.error("Please enter some recipient data first");
      return;
    }
    parseCSV(csvText);
  };

  const doBulkIssue = useServerFn(bulkIssueCertificates);

  const handleIssue = async () => {
    if (parsedRecipients.length === 0) {
      toast.error("No recipient data to issue");
      return;
    }
    setIssuing(true);
    setProgress(20);
    try {
      const payloadRecipients = parsedRecipients.map((r) => {
        const scoreVal = Number(r[mappedFields.score] || 18);
        const totalVal = Number(r[mappedFields.total] || 20);
        return {
          name: r[mappedFields.name] || r.student_name || "Learner",
          email: r[mappedFields.email] || r.email || "learner@example.com",
          course_id: selectedCourseId,
          score: isNaN(scoreVal) ? 18 : scoreVal,
          total: isNaN(totalVal) ? 20 : totalVal,
          template_id: selectedTemplateId,
        };
      });

      setProgress(50);
      const res = await doBulkIssue({
        data: {
          recipients: payloadRecipients,
          send_email: sendEmail,
        },
      });
      setProgress(100);
      setIssueSummary(res);
      setDone(true);
      toast.success(`Bulk issuance complete! Issued ${res.successCount} certificates.`);
    } catch (e: any) {
      toast.error(`Bulk issue failed: ${e.message}`);
    } finally {
      setIssuing(false);
    }
  };

  const STEPS = [
    { n: 1, label: "Upload Recipients", sub: "Upload CSV or enter manually" },
    { n: 2, label: "Map Fields", sub: "Map CSV columns" },
    { n: 3, label: "Customize", sub: "Certificate settings" },
    { n: 4, label: "Review & Send", sub: "Preview and confirm" },
  ];

  const firstRecordHeaders = parsedRecipients.length > 0 ? Object.keys(parsedRecipients[0]) : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Stepper */}
      <div
        style={{
          background: "white",
          border: `1px solid ${BD}`,
          borderRadius: 12,
          padding: "20px 24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 16,
              left: "10%",
              right: "10%",
              height: 2,
              background: BD,
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 16,
              left: "10%",
              height: 2,
              background: P,
              zIndex: 1,
              width: `${((step - 1) / 3) * 80}%`,
              transition: "width 0.3s",
            }}
          />
          {STEPS.map((s) => (
            <div
              key={s.n}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                zIndex: 2,
                flex: 1,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: `2px solid ${step > s.n ? P : step === s.n ? P : BD}`,
                  background: step > s.n ? P : "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={() => step > s.n && setStep(s.n)}
              >
                {step > s.n ? (
                  <Check size={15} color="white" />
                ) : (
                  <span style={{ fontSize: 13, fontWeight: 700, color: step === s.n ? P : TX3 }}>
                    {s.n}
                  </span>
                )}
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: step === s.n ? TX : TX2 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 10, color: TX3 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Upload */}
        <div
          style={{
            background: "white",
            border: `1px solid ${step === 1 ? P : BD}`,
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: TX, marginBottom: 4 }}>
            1. Upload Recipients
          </div>
          <div style={{ fontSize: 12, color: TX2, marginBottom: 16 }}>
            Upload a CSV file or enter recipient data manually
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {!fileUploaded ? (
              <>
                <div
                  style={{
                    border: `2px dashed ${P}`,
                    background: "#F5F3FF",
                    borderRadius: 12,
                    padding: 32,
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                  />
                  <Upload size={40} color={P} style={{ margin: "0 auto 12px" }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: TX, marginBottom: 4 }}>
                    Drag & drop your CSV file here
                  </div>
                  <div style={{ fontSize: 12, color: TX2, marginBottom: 12 }}>
                    or click to browse files
                  </div>
                  <div style={{ fontSize: 11, color: TX3 }}>
                    Supports CSV only (student_name, email, score, total)
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: TX }}>
                    Or paste CSV values manually:
                  </label>
                  <textarea
                    value={csvText}
                    onChange={(e) => setCsvText(e.target.value)}
                    placeholder="student_name,email,score,total&#10;Ada Lovelace,ada@example.com,18,20"
                    rows={4}
                    style={{
                      width: "100%",
                      padding: 10,
                      border: `1px solid ${BD}`,
                      borderRadius: 8,
                      fontSize: 13,
                      outline: "none",
                      fontFamily: "monospace",
                    }}
                  />
                  <Btn
                    variant="outline"
                    onClick={handleManualParse}
                    style={{ alignSelf: "flex-end" }}
                  >
                    Parse Manual CSV
                  </Btn>
                </div>
              </>
            ) : (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 14px",
                    border: `1px solid ${SGL}`,
                    borderRadius: 8,
                    background: SGL,
                    marginBottom: 12,
                  }}
                >
                  <FileText size={20} color={SG} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: TX }}>
                      Recipients List Parsed
                    </div>
                    <div style={{ fontSize: 11, color: TX2 }}>
                      {parsedRecipients.length} Records Detected ✓
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFileUploaded(false);
                      setParsedRecipients([]);
                    }}
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    <X size={16} color={TX2} />
                  </button>
                </div>
                <div
                  style={{
                    background: "#F9FAFB",
                    border: `1px solid ${BD}`,
                    borderRadius: 8,
                    padding: 12,
                    maxHeight: 150,
                    overflowY: "auto",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: TX, marginBottom: 8 }}>
                    Preview parsed records:
                  </div>
                  {parsedRecipients.slice(0, 3).map((r, idx) => (
                    <div key={idx} style={{ fontSize: 12, color: TX2, marginBottom: 4 }}>
                      {r.student_name || Object.values(r)[0]} ({r.email || Object.values(r)[1]})
                    </div>
                  ))}
                  {parsedRecipients.length > 3 && (
                    <div style={{ fontSize: 11, color: TX3, fontStyle: "italic" }}>
                      + {parsedRecipients.length - 3} more records...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map Fields */}
        <div
          style={{
            background: "white",
            border: `1px solid ${step === 2 ? P : BD}`,
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: TX, marginBottom: 4 }}>
            2. Map Fields
          </div>
          <div style={{ fontSize: 12, color: TX2, marginBottom: 12 }}>
            Map your CSV columns to certificate fields
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: BG }}>
                {["Certificate Field", "CSV Column", "Preview"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 10px",
                      fontSize: 11,
                      fontWeight: 600,
                      color: TX2,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      textAlign: "left",
                      borderBottom: `1px solid ${BD}`,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { field: "Student Name *", key: "name", defaultVal: "student_name" },
                { field: "Email Address *", key: "email", defaultVal: "email" },
                { field: "Score", key: "score", defaultVal: "score" },
                { field: "Total", key: "total", defaultVal: "total" },
              ].map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${BD}` }}>
                  <td style={{ padding: "8px 10px", fontSize: 13, color: TX }}>{r.field}</td>
                  <td style={{ padding: "8px 10px" }}>
                    <select
                      value={mappedFields[r.key]}
                      onChange={(e) =>
                        setMappedFields({ ...mappedFields, [r.key]: e.target.value })
                      }
                      style={{
                        border: `1px solid ${BD}`,
                        borderRadius: 6,
                        padding: "4px 8px",
                        fontSize: 12,
                        color: TX,
                        width: "100%",
                      }}
                    >
                      <option value="">-- Select Column --</option>
                      {firstRecordHeaders.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                      {!firstRecordHeaders.includes(r.defaultVal) && (
                        <option value={r.defaultVal}>{r.defaultVal} (Not in CSV)</option>
                      )}
                    </select>
                  </td>
                  <td style={{ padding: "8px 10px", fontSize: 12, color: SG }}>
                    {parsedRecipients[0]?.[mappedFields[r.key]] || "n/a"} ✓
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Step 3 */}
        <div
          style={{
            background: "white",
            border: `1px solid ${BD}`,
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: TX, marginBottom: 4 }}>
            3. Customize Certificate Settings
          </div>
          <div style={{ fontSize: 12, color: TX2, marginBottom: 16 }}>
            Choose course and template parameter
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: TX,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Select Course:
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                style={{
                  width: "100%",
                  border: `1px solid ${BD}`,
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 13,
                  color: TX,
                }}
              >
                {courses.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: TX,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Select Template:
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                style={{
                  width: "100%",
                  border: `1px solid ${BD}`,
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 13,
                  color: TX,
                }}
              >
                {templates.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              paddingTop: 12,
              borderTop: `1px solid ${BD}`,
            }}
          >
            {[
              {
                label: "Send Email to Recipients",
                sub: "Send certificates via email automatically",
                val: sendEmail,
                set: setSendEmail,
              },
            ].map((t) => (
              <label
                key={t.label}
                style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
              >
                <div
                  onClick={() => t.set(!t.val)}
                  style={{
                    width: 36,
                    height: 20,
                    borderRadius: 999,
                    background: t.val ? P : BD,
                    position: "relative",
                    transition: "background 0.2s",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "white",
                      position: "absolute",
                      top: 2,
                      left: t.val ? 18 : 2,
                      transition: "left 0.2s",
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: TX }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: TX2 }}>{t.sub}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Step 4 */}
        <div
          style={{
            background: "white",
            border: `1px solid ${BD}`,
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: TX, marginBottom: 4 }}>
            4. Review & Send
          </div>
          <div style={{ fontSize: 12, color: TX2, marginBottom: 12 }}>
            Review mapped records and verify counts
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}
          >
            {[
              {
                icon: <Users size={16} color={P} />,
                label: "Parsed Recipients",
                value: parsedRecipients.length.toString(),
                color: PL,
              },
              {
                icon: <Check size={16} color={SG} />,
                label: "Mapped Template",
                value: templates.find((t: any) => t.id === selectedTemplateId)?.name || "Default",
                color: SGL,
              },
              {
                icon: <FileText size={16} color={IN} />,
                label: "Mapped Course",
                value:
                  courses.find((c: any) => c.id === selectedCourseId)?.title?.slice(0, 18) ||
                  "Course",
                color: INL,
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 12px",
                  background: s.color,
                  borderRadius: 8,
                }}
              >
                {s.icon}
                <div>
                  <div style={{ fontSize: 11, color: TX2 }}>{s.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TX }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {!issuing && !done && (
            <Btn
              variant="primary"
              onClick={handleIssue}
              style={{ width: "100%", justifyContent: "center", fontSize: 14, padding: "12px" }}
              disabled={parsedRecipients.length === 0}
            >
              <Upload size={16} />
              Issue Certificates
            </Btn>
          )}

          {issuing && !done && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  marginBottom: 6,
                }}
              >
                <span style={{ color: TX2 }}>Issuing certificates...</span>
                <span style={{ fontWeight: 600, color: P }}>{progress}%</span>
              </div>
              <div
                style={{ height: 8, borderRadius: 999, background: "#F3F4F6", overflow: "hidden" }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: P,
                    borderRadius: 999,
                    transition: "width 0.1s",
                  }}
                />
              </div>
            </div>
          )}

          {done && issueSummary && (
            <div
              style={{
                background: SGL,
                borderRadius: 8,
                padding: "16px 20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <CheckCircle size={28} color={SG} style={{ margin: "0 auto" }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: TX }}>
                  ✓ {issueSummary.successCount} Certificates Issued Successfully!
                </div>
                <div style={{ fontSize: 12, color: TX2, marginTop: 2 }}>
                  Recipients can verify credentials and receive email notifications.
                </div>
              </div>

              {issueSummary.errors?.length > 0 && (
                <div
                  style={{
                    fontSize: 11,
                    color: ER,
                    background: "#FEE2E2",
                    borderRadius: 6,
                    padding: "10px 12px",
                    maxHeight: 120,
                    overflowY: "auto",
                    textAlign: "left",
                  }}
                >
                  <strong style={{ display: "block", marginBottom: 4 }}>
                    Failed Items ({issueSummary.errors.length}):
                  </strong>
                  {issueSummary.errors.map((e: string, idx: number) => (
                    <div key={idx}>• {e}</div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 4 }}>
                {issueSummary.errors?.length > 0 && (
                  <Btn
                    variant="outline"
                    onClick={() => {
                      setDone(false);
                      handleIssue();
                    }}
                    style={{ fontSize: 12, borderColor: ER, color: ER }}
                  >
                    <RefreshCw size={12} /> Retry Failed
                  </Btn>
                )}
                <Btn
                  variant="primary"
                  onClick={() => {
                    setDone(false);
                    setStep(1);
                    setParsedRecipients([]);
                    setCsvText("");
                    setFileUploaded(false);
                    setIssueSummary(null);
                  }}
                  style={{ fontSize: 12 }}
                >
                  Start New Batch
                </Btn>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Btn variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))}>
          ← Previous
        </Btn>
        <Btn variant="primary" onClick={() => setStep((s) => Math.min(4, s + 1))}>
          Next Step →
        </Btn>
      </div>
    </div>
  );
}

// ─── Screen: Verification ─────────────────────────────────────────────────────
function VerificationScreen({ stats, certificates = [] }: { stats: any; certificates: any[] }) {
  const [selectedV, setSelectedV] = useState(0);
  const [verFilter, setVerFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Build verification list from real certificates; fall back to VERIFY_LIST only when DB is empty
  const verifyList = certificates.length > 0
    ? certificates.map((c) => ({
        name: c.name,
        email: c.email ?? "—",
        id: c.id,
        status: c.status,
        time: c.date,
        theme: c.theme,
      }))
    : VERIFY_LIST;

  const v = verifyList[selectedV] ?? verifyList[0] ?? VERIFY_LIST[0];

  const totalCerts = stats?.totalCerts ?? certificates.length ?? 0;
  const verifiedCount = stats?.pieStatusData?.find((s: any) => s.name === "Verified")?.value ?? 0;
  const pendingCount = Math.max(0, totalCerts - verifiedCount);
  const totalVerifications = stats?.totalVerifications ?? 0;
  const growth = stats?.monthlyGrowth as { value: number; date: string }[] | undefined;

  const filteredList = useMemo(() => {
    return verifyList.filter((item) => {
      if (verFilter === "Verified" && item.status !== "Verified") return false;
      if (verFilter === "Invalid" && item.status !== "Invalid") return false;
      if (verFilter === "Pending" && item.status !== "Pending") return false;
      if (
        searchQuery &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.id.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [verFilter, searchQuery, verifyList]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <KPICard
          label="Total Verifications"
          value={totalVerifications.toLocaleString()}
          delta={computeDelta(growth)}
          icon={<Activity size={20} color={P} />}
          iconBg={PL}
          sparkData={buildSparkData(growth, totalVerifications)}
          sparkColor={P}
        />
        <KPICard
          label="Verified Certificates"
          value={verifiedCount.toLocaleString()}
          delta={computeDelta(growth)}
          icon={<ShieldCheck size={20} color={SG} />}
          iconBg={SGL}
          sparkData={buildSparkData(growth, verifiedCount)}
          sparkColor={SG}
        />
        <KPICard
          label="Invalid Certificates"
          value="0"
          delta=""
          icon={<AlertCircle size={20} color={ER} />}
          iconBg={ERL}
          sparkData={sparkInvalid}
          sparkColor={ER}
        />
        <KPICard
          label="Pending Verifications"
          value={pendingCount.toString()}
          delta={computeDelta(growth)}
          icon={<Clock size={20} color={WO} />}
          iconBg={WOL}
          sparkData={buildSparkData(growth, pendingCount)}
          sparkColor={WO}
        />
        <KPICard
          label="QR Code Scans"
          value={totalVerifications.toLocaleString()}
          delta={computeDelta(growth)}
          icon={<QrCode size={20} color={WP} />}
          iconBg="#EDE9FE"
          sparkData={buildSparkData(growth, totalVerifications)}
          sparkColor={WP}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: 16 }}>
        {/* Left: Requests List */}
        <div
          style={{
            background: "white",
            border: `1px solid ${BD}`,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BD}` }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: TX, marginBottom: 10 }}>
              Verification Requests
            </div>
            <div style={{ position: "relative", marginBottom: 10 }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: TX3,
                }}
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email or certificate ID..."
                style={{
                  width: "100%",
                  paddingLeft: 32,
                  paddingRight: 12,
                  height: 34,
                  border: `1px solid ${BD}`,
                  borderRadius: 8,
                  fontSize: 12,
                  color: TX,
                  outline: "none",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {["All", "Verified", "Invalid", "Pending"].map((f) => (
                <button
                  key={f}
                  onClick={() => setVerFilter(f)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 500,
                    border: `1px solid ${verFilter === f ? P : BD}`,
                    background: verFilter === f ? P : "white",
                    color: verFilter === f ? "white" : TX2,
                    cursor: "pointer",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div style={{ overflowY: "auto", maxHeight: 420 }}>
            {filteredList.map((item, i) => (
              <div
                key={i}
                onClick={() => setSelectedV(i)}
                style={{
                  padding: "12px 16px",
                  borderBottom: `1px solid ${BD}`,
                  cursor: "pointer",
                  background: selectedV === i ? "#F5F3FF" : "white",
                  borderLeft: selectedV === i ? `4px solid ${P}` : "4px solid transparent",
                  transition: "background 0.1s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <CertThumbnail
                    theme={item.theme}
                    w={42}
                    h={30}
                    name={item.name}
                    course="Full Stack Web Development"
                    date="May 25, 2026"
                    certId={item.id}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: TX }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: TX3 }}>{item.email}</div>
                    <div style={{ fontSize: 11, color: TX3 }}>Certificate ID: {item.id}</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 4,
                    }}
                  >
                    <StatusBadge status={item.status} />
                    <span style={{ fontSize: 11, color: TX3 }}>{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: "10px 16px",
              borderTop: `1px solid ${BD}`,
              display: "flex",
              gap: 4,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              style={{
                padding: "4px 8px",
                border: `1px solid ${BD}`,
                borderRadius: 5,
                background: "white",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              ‹
            </button>
            {[1, 2, 3, 4, 5, "...", 43].map((p, i) => (
              <button
                key={i}
                style={{
                  padding: "4px 8px",
                  border: `1px solid ${p === 1 ? P : BD}`,
                  borderRadius: 5,
                  background: p === 1 ? P : "white",
                  color: p === 1 ? "white" : TX2,
                  cursor: "pointer",
                  fontSize: 12,
                  minWidth: 28,
                }}
              >
                {p}
              </button>
            ))}
            <button
              style={{
                padding: "4px 8px",
                border: `1px solid ${BD}`,
                borderRadius: 5,
                background: "white",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              ›
            </button>
          </div>
        </div>

        {/* Right: Details */}
        <div
          style={{
            background: "white",
            border: `1px solid ${BD}`,
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600, color: TX }}>
              Certificate Verification Details
            </span>
            <Btn variant="outline" style={{ fontSize: 12, padding: "5px 10px" }}>
              <Share2 size={13} />
              Share
            </Btn>
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              marginBottom: 16,
              padding: "16px",
              background: SGL,
              borderRadius: 10,
            }}
          >
            <CertThumbnail
              theme={v.theme}
              w={100}
              h={70}
              name={v.name}
              course="Full Stack Web Development"
              date="May 25, 2026"
              certId={v.id}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <CheckCircle size={18} color={SG} />
                <span style={{ fontSize: 13, fontWeight: 700, color: SG }}>VERIFIED</span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: TX, marginBottom: 2 }}>
                {v.name}
              </div>
              <div style={{ fontSize: 12, color: TX2, marginBottom: 2 }}>
                has successfully completed the course
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: P }}>
                Full Stack Web Development
              </div>
              <div style={{ fontSize: 11, color: TX3, marginTop: 2 }}>
                Issued by Learnify AI · May 25, 2026
              </div>
            </div>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div
                style={{
                  width: 70,
                  height: 70,
                  background: "white",
                  border: `1px solid ${BD}`,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 4,
                }}
              >
                <QrCode size={50} color={TX} />
              </div>
              <div style={{ fontSize: 10, color: TX3 }}>Scan to Verify</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: TX,
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Verification Information
              </div>
              {[
                { label: "Certificate ID", value: v.id, copy: true },
                { label: "Status", value: <StatusBadge status={v.status} /> },
                { label: "Issue Date", value: "May 25, 2026" },
                { label: "Expiry Date", value: "No Expiry" },
                { label: "Blockchain Hash", value: "0x7d3a6b...3a7d", copy: true },
                { label: "Times Verified", value: "12 Times" },
              ].map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: TX2, flexShrink: 0 }}>{r.label}:</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {typeof r.value === "string" ? (
                      <span
                        style={{
                          fontWeight: 500,
                          color: TX,
                          maxWidth: 120,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.value}
                      </span>
                    ) : (
                      r.value
                    )}
                    {r.copy && (
                      <Copy size={11} color={TX3} style={{ cursor: "pointer", flexShrink: 0 }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: TX,
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Recipient Information
              </div>
              {[
                { icon: <User size={12} />, label: "Name", value: v.name },
                { icon: <Mail size={12} />, label: "Email", value: v.email },
                { icon: <GraduationCap size={12} />, label: "Student ID", value: "STU-2026-7890" },
                { icon: <Phone size={12} />, label: "Phone", value: "+91 98765 43210" },
              ].map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 7,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: TX2 }}>{r.icon}</span>
                  <span style={{ color: TX2, width: 70 }}>{r.label}:</span>
                  <span style={{ fontWeight: 500, color: TX }}>{r.value}</span>
                </div>
              ))}
              <div style={{ marginTop: 12 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: TX,
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Security Features
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {[
                    "Digital Signature",
                    "QR Code",
                    "Blockchain Verified",
                    "Certificate Authentic",
                  ].map((f) => (
                    <div
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 8px",
                        background: SGL,
                        borderRadius: 6,
                      }}
                    >
                      <CheckCircle size={12} color={SG} />
                      <span style={{ fontSize: 11, color: TX, fontWeight: 500 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Analytics Tab Components ────────────────────────────────────────────────
function AnalyticsCertificates({ BD, TX, TX2, TX3, P, SGL, SG, ER, certificates = [] }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 700, color: TX }}>All Issued Certificates</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Search certificates or recipients..."
            style={{
              padding: "6px 12px",
              border: `1px solid ${BD}`,
              borderRadius: 8,
              fontSize: 13,
              width: 260,
            }}
          />
          <button
            style={{
              padding: "6px 12px",
              background: P,
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>
      </div>
      <div
        style={{
          background: "white",
          border: `1px solid ${BD}`,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: `1px solid ${BD}` }}>
              <th
                style={{
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: TX2,
                  textTransform: "uppercase",
                }}
              >
                Recipient
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: TX2,
                  textTransform: "uppercase",
                }}
              >
                Course Name
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: TX2,
                  textTransform: "uppercase",
                }}
              >
                Issue Date
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: TX2,
                  textTransform: "uppercase",
                }}
              >
                ID
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: TX2,
                  textTransform: "uppercase",
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: TX2,
                  textTransform: "uppercase",
                  textAlign: "right",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {certificates.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: TX2, fontSize: 13 }}>
                  No certificates issued yet.
                </td>
              </tr>
            ) : null}
            {certificates.slice(0, 50).map((c: any, i: number) => (
              <tr
                key={i}
                style={{
                  borderBottom: i === certificates.length - 1 ? "none" : `1px solid ${BD}`,
                  background: i % 2 === 0 ? "white" : "#F9FAFB",
                }}
              >
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TX }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: TX3 }}>{c.email ?? "—"}</div>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: TX2 }}>{c.course}</td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: TX3 }}>{c.date}</td>
                <td style={{ padding: "12px 16px", fontSize: 12, fontFamily: "monospace", color: TX2 }}>{c.id}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 12,
                      background: c.status === "Verified" ? SGL : c.status === "Issued" ? "#EEF2FF" : "#FEE2E2",
                      color: c.status === "Verified" ? SG : c.status === "Issued" ? P : ER,
                    }}
                  >
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <a
                    href={`/certificates/${c.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 12, color: P, background: "none", border: "none", cursor: "pointer", fontWeight: 500, textDecoration: "none" }}
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsTemplates({ BD, TX, TX2, SG, SGL, P }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: TX }}>Certificate Templates</h3>
        <button
          style={{
            padding: "6px 12px",
            background: P,
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          + Create New Template
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {[
          {
            name: "Executive Blue Gold",
            issued: 2856,
            verified: 2712,
            rate: "95.0%",
            status: "Active",
            theme: "navy",
          },
          {
            name: "Skyline Tech",
            issued: 2341,
            verified: 2189,
            rate: "93.5%",
            status: "Active",
            theme: "blue",
          },
          {
            name: "Ivory Academic",
            issued: 1987,
            verified: 1872,
            rate: "94.2%",
            status: "Active",
            theme: "ivory",
          },
          {
            name: "Onyx Calligraphy",
            issued: 1654,
            verified: 1514,
            rate: "91.5%",
            status: "Active",
            theme: "onyx",
          },
          {
            name: "Rose Charcoal",
            issued: 1431,
            verified: 1385,
            rate: "95.4%",
            status: "Active",
            theme: "rose",
          },
          {
            name: "Clean Corporate Minimalist",
            issued: 502,
            verified: 482,
            rate: "96.0%",
            status: "Draft",
            theme: "navy",
          },
        ].map((t, i) => (
          <div
            key={i}
            style={{
              background: "white",
              border: `1px solid ${BD}`,
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                height: 120,
                background: "#F1F5F9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
                borderBottom: `1px solid ${BD}`,
              }}
            >
              <CertThumbnail theme={t.theme} w={140} h={100} />
            </div>
            <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: TX }}>{t.name}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "1px 6px",
                    borderRadius: 10,
                    background: t.status === "Active" ? SGL : BD,
                    color: t.status === "Active" ? SG : TX2,
                  }}
                >
                  {t.status}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: TX2,
                  marginTop: 4,
                }}
              >
                <span>
                  Issued: <b>{t.issued}</b>
                </span>
                <span>
                  Verification Rate: <b style={{ color: SG }}>{t.rate}</b>
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 12,
                  borderTop: `1px solid ${BD}`,
                  paddingTop: 12,
                }}
              >
                <button
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    borderRadius: 6,
                    border: `1px solid ${BD}`,
                    background: "white",
                    fontSize: 12,
                    color: TX2,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Edit Template
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    borderRadius: 6,
                    border: "none",
                    background: `${P}15`,
                    fontSize: 12,
                    color: P,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Duplicate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsRecipients({ BD, TX, TX2, TX3, P, certificates = [] }: any) {
  // Aggregate recipients from real certificates
  const recipientMap = new Map<string, { name: string; email: string; count: number; lastDate: string }>();
  (certificates as any[]).forEach((c) => {
    const key = c.email ?? c.name;
    if (!recipientMap.has(key)) {
      recipientMap.set(key, { name: c.name, email: c.email ?? "—", count: 0, lastDate: c.date });
    }
    recipientMap.get(key)!.count++;
  });
  const recipients = Array.from(recipientMap.values()).sort((a, b) => b.count - a.count).slice(0, 10);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 700, color: TX }}>Recipients List</h3>
        <input
          type="text"
          placeholder="Search students by name or email..."
          style={{
            padding: "6px 12px",
            border: `1px solid ${BD}`,
            borderRadius: 8,
            fontSize: 13,
            width: 260,
          }}
        />
      </div>
      <div
        style={{
          background: "white",
          border: `1px solid ${BD}`,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: `1px solid ${BD}` }}>
              <th
                style={{
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: TX2,
                  textTransform: "uppercase",
                }}
              >
                Student
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: TX2,
                  textTransform: "uppercase",
                }}
              >
                Active Certificates
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: TX2,
                  textTransform: "uppercase",
                }}
              >
                Courses Enrolled
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: TX2,
                  textTransform: "uppercase",
                }}
              >
                Last Earned Date
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: TX2,
                  textTransform: "uppercase",
                  textAlign: "right",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {recipients.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: TX2, fontSize: 13 }}>
                  No recipients found.
                </td>
              </tr>
            ) : (
              recipients.map((r, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: i === recipients.length - 1 ? "none" : `1px solid ${BD}`,
                    background: i % 2 === 0 ? "white" : "#F9FAFB",
                  }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: TX }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: TX3 }}>{r.email}</div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: TX }}>
                    {r.count} {r.count === 1 ? "Certificate" : "Certificates"}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: TX3 }}>{r.lastDate}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <a
                      href={`/admin/users?q=${encodeURIComponent(r.email)}`}
                      style={{ fontSize: 12, color: P, background: "none", border: "none", cursor: "pointer", fontWeight: 500, textDecoration: "none" }}
                    >
                      View Profile
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsVerification({ BD, TX, TX2, TX3, SGL, SG, ER }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: TX }}>Live Verification Logs</h3>
      <div
        style={{
          background: "white",
          border: `1px solid ${BD}`,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: `1px solid ${BD}` }}>
              <th
                style={{
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: TX2,
                  textTransform: "uppercase",
                }}
              >
                Timestamp
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: TX2,
                  textTransform: "uppercase",
                }}
              >
                IP Address
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: TX2,
                  textTransform: "uppercase",
                }}
              >
                Location
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: TX2,
                  textTransform: "uppercase",
                }}
              >
                Certificate ID
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: TX2,
                  textTransform: "uppercase",
                }}
              >
                Method
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: TX2,
                  textTransform: "uppercase",
                  textAlign: "right",
                }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                time: "Just Now",
                ip: "192.168.1.45",
                loc: "Mumbai, India",
                id: "LAI-2026-000124",
                method: "QR Scan",
                status: "Success",
              },
              {
                time: "2 mins ago",
                ip: "104.244.75.12",
                loc: "San Francisco, US",
                id: "LAI-2026-000125",
                method: "Direct Link",
                status: "Success",
              },
              {
                time: "12 mins ago",
                ip: "82.165.122.90",
                loc: "London, UK",
                id: "LAI-2026-000124",
                method: "Manual Verification",
                status: "Success",
              },
              {
                time: "45 mins ago",
                ip: "203.0.113.195",
                loc: "Bengaluru, India",
                id: "LAI-2026-000999",
                method: "QR Scan",
                status: "Failed",
              },
              {
                time: "1 hour ago",
                ip: "198.51.100.72",
                loc: "New York, US",
                id: "LAI-2026-000126",
                method: "Email Hook",
                status: "Success",
              },
            ].map((l, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: i === 4 ? "none" : `1px solid ${BD}`,
                  background: i % 2 === 0 ? "white" : "#F9FAFB",
                }}
              >
                <td style={{ padding: "12px 16px", fontSize: 12, color: TX2 }}>{l.time}</td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: 12,
                    fontFamily: "monospace",
                    color: TX3,
                  }}
                >
                  {l.ip}
                </td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: TX }}>{l.loc}</td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: 12,
                    fontFamily: "monospace",
                    color: TX2,
                  }}
                >
                  {l.id}
                </td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: TX2 }}>{l.method}</td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 12,
                      background: l.status === "Success" ? SGL : "#FEE2E2",
                      color: l.status === "Success" ? SG : ER,
                    }}
                  >
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsEngagement({ BD, TX, TX2, TX3, P, PL, IN, INL, SG, SGL, WO, barData }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: TX }}>Social Sharing & Engagement</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {[
          {
            label: "LinkedIn Shares",
            value: "2,450 Shares",
            delta: "+28.4% growth",
            icon: <Share2 size={22} color={P} />,
            iconBg: PL,
          },
          {
            label: "Twitter / X Posts",
            value: "801 Shares",
            delta: "+12.5% growth",
            icon: <Share2 size={22} color={IN} />,
            iconBg: INL,
          },
          {
            label: "In-App Downloads",
            value: "6,423 Downloads",
            delta: "+16.2% growth",
            icon: <Download size={22} color={SG} />,
            iconBg: SGL,
          },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: "white",
              border: `1px solid ${BD}`,
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: s.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {s.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: TX3,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {s.label}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: TX, marginTop: 2 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: SG, fontWeight: 600, marginTop: 2 }}>
                {s.delta}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <SectionCard title="Referral Enrolments generated by Certificate Shares">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: TX3 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 10, fill: TX3 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="shares" fill={P} radius={[3, 3, 0, 0]} name="New Signups" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
        <SectionCard title="Click-Through-Rate (CTR) from LinkedIn profiles">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
              padding: "12px 0",
              gap: 16,
            }}
          >
            {[
              { name: "Profile views from Cert link", val: 88.4, color: P },
              { name: "Course sales referral CTR", val: 4.8, color: WO },
              { name: "Job verification webhook CTR", val: 6.8, color: SG },
            ].map((item, i) => (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    fontWeight: 600,
                    color: TX,
                    marginBottom: 4,
                  }}
                >
                  <span>{item.name}</span>
                  <span>{item.val}%</span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 8,
                    background: "#F1F5F9",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${item.val}%`,
                      height: "100%",
                      background: item.color,
                      borderRadius: 4,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function AnalyticsExports({ BD, TX, TX2, P, toast }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: TX }}>Export Reports</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {[
          {
            title: "CSV Data Export",
            desc: "Complete log of all issued certificates, verification states, and date issued.",
            action: "Export CSV",
          },
          {
            title: "JSON Registry Dump",
            desc: "Standardized JSON schema registry containing verifiable blockchain hashes.",
            action: "Export JSON",
          },
          {
            title: "Analytics PDF Report",
            desc: "High fidelity executive summary containing charts, tables, and statistics.",
            action: "Generate PDF",
          },
        ].map((ex, i) => (
          <div
            key={i}
            style={{
              background: "white",
              border: `1px solid ${BD}`,
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: 140,
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: TX, marginBottom: 4 }}>
                {ex.title}
              </div>
              <div style={{ fontSize: 12, color: TX2, lineHeight: 1.4 }}>{ex.desc}</div>
            </div>
            <button
              onClick={() => {
                toast.info(`Generating ${ex.action}...`);
                setTimeout(() => toast.success(`${ex.action} downloaded!`), 1200);
              }}
              style={{
                width: "100%",
                padding: "8px 0",
                borderRadius: 6,
                border: "none",
                background: P,
                color: "white",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                marginTop: 12,
              }}
            >
              {ex.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Screen: Analytics ────────────────────────────────────────────────────────
function AnalyticsScreen({ stats, certificates = [], templates = [] }: { stats: any; certificates: any[]; templates: any[] }) {
  const [aTab, setATab] = useState("Overview");
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [isMapDragging, setIsMapDragging] = useState(false);
  const [mapDragStart, setMapDragStart] = useState({ x: 0, y: 0 });
  const aTabs = [
    "Overview",
    "Certificates",
    "Templates",
    "Recipients",
    "Verification",
    "Engagement",
    "Exports",
  ];
  // Build top templates from real DB templates (ranked by name, since we don't track per-template issue count yet)
  const topTemplates = (templates as any[]).slice(0, 5).map((t, idx) => ({
    rank: idx + 1,
    name: t.name,
    issued: 0, // will be real when cert-per-template tracking is added
    verified: 0,
    rate: 0,
    rateColor: SG,
    theme: t.theme_colors?.primary ? "custom" : "navy",
  }));

  const totalCerts = stats?.totalCerts ?? 0;
  const verifiedCount = stats?.pieStatusData?.find((s: any) => s.name === "Verified")?.value ?? 0;
  const downloadedCount = stats?.pieStatusData?.find((s: any) => s.name === "Downloaded")?.value ?? 0;
  const sharedCount = stats?.pieStatusData?.find((s: any) => s.name === "Shared")?.value ?? 0;
  const totalVerifications = stats?.totalVerifications ?? 0;
  const growth = stats?.monthlyGrowth as { value: number; date: string }[] | undefined;

  const chartData = growth && growth.length > 0 ? growth : areaData;

  const pieAnalytics = useMemo(() => {
    const verified = verifiedCount;
    const pending = Math.max(0, totalCerts - verified);
    const total = Math.max(1, totalCerts);
    return [
      { name: "Verified", value: verified, pct: `${Math.round((verified / total) * 100)}%`, color: SG },
      { name: "Pending", value: pending, pct: `${Math.round((pending / total) * 100)}%`, color: WO },
    ];
  }, [totalCerts, verifiedCount, SG, WO]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 2,
            background: "white",
            border: `1px solid ${BD}`,
            borderRadius: 10,
            padding: 3,
          }}
        >
          {aTabs.map((t) => (
            <button
              key={t}
              onClick={() => setATab(t)}
              style={{
                padding: "6px 14px",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 500,
                border: "none",
                background: aTab === t ? P : "transparent",
                color: aTab === t ? "white" : TX2,
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          style={{
            padding: "7px 14px",
            border: `1px solid ${BD}`,
            borderRadius: 8,
            background: "white",
            fontSize: 13,
            color: TX2,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Calendar size={14} />
          May 19 – May 25, 2026
          <ChevronDown size={13} />
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <KPICard
          label="Certificates Issued"
          value={totalCerts.toLocaleString()}
          delta={computeDelta(growth)}
          icon={<FilePlus size={20} color={P} />}
          iconBg={PL}
          sparkData={buildSparkData(growth, totalCerts)}
          sparkColor={P}
        />
        <KPICard
          label="Verified Certificates"
          value={verifiedCount.toLocaleString()}
          delta={computeDelta(growth)}
          icon={<ShieldCheck size={20} color={SG} />}
          iconBg={SGL}
          sparkData={buildSparkData(growth, verifiedCount)}
          sparkColor={SG}
        />
        <KPICard
          label="Downloads"
          value={downloadedCount > 0 ? downloadedCount.toLocaleString() : "—"}
          delta={""}
          icon={<Download size={20} color={IN} />}
          iconBg={INL}
          sparkData={buildSparkData(growth, downloadedCount)}
          sparkColor={IN}
        />
        <KPICard
          label="Shares"
          value={sharedCount > 0 ? sharedCount.toLocaleString() : "—"}
          delta={""}
          icon={<Share2 size={20} color={WO} />}
          iconBg={WOL}
          sparkData={buildSparkData(growth, sharedCount)}
          sparkColor={WO}
        />
        <KPICard
          label="QR Code Scans"
          value={totalVerifications > 0 ? totalVerifications.toLocaleString() : "—"}
          delta={computeDelta(growth)}
          icon={<QrCode size={20} color={PK} />}
          iconBg="#FCE7F3"
          sparkData={buildSparkData(growth, totalVerifications)}
          sparkColor={PK}
        />
      </div>

      {aTab === "Overview" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "5fr 4fr 3fr", gap: 16 }}>
            <SectionCard
              title="Certificates Issued Over Time"
              action={
                <select
                  style={{
                    border: `1px solid ${BD}`,
                    borderRadius: 6,
                    padding: "4px 8px",
                    fontSize: 12,
                    color: TX2,
                  }}
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              }
            >
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={P} stopOpacity={0.18} />
                      <stop offset="100%" stopColor={P} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: TX3 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: TX3 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `${v / 1000}K`}
                  />
                  <Tooltip
                    formatter={(v: any) => [v.toLocaleString(), "Certificates"]}
                    contentStyle={{ borderRadius: 8, border: `1px solid ${BD}`, fontSize: 12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={P}
                    strokeWidth={2}
                    fill="url(#areaGrad)"
                    dot={{ r: 3, fill: P }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </SectionCard>

            <SectionCard
              title="Certificates by Status"
              action={
                <select
                  style={{
                    border: `1px solid ${BD}`,
                    borderRadius: 6,
                    padding: "4px 8px",
                    fontSize: 12,
                    color: TX2,
                  }}
                >
                  <option>This Week</option>
                </select>
              }
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieAnalytics}
                        innerRadius={45}
                        outerRadius={65}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {pieAnalytics.map((e, i) => (
                          <Cell key={i} fill={e.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: any) => v.toLocaleString()} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: TX }}>
                      {totalCerts.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 9, color: TX2 }}>Total</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  {pieAnalytics.map((s, i) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <div
                        style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}
                      >
                        <div
                          style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }}
                        />
                        <span style={{ fontSize: 12, color: TX2 }}>{s.name}</span>
                        <span
                          style={{ fontSize: 12, fontWeight: 600, color: TX, marginLeft: "auto" }}
                        >
                          {s.pct}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: TX3, paddingLeft: 14 }}>
                        {s.value.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Top Performing Templates"
              action={<a style={{ fontSize: 12, color: P, cursor: "pointer" }}>View All →</a>}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {topTemplates.map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#D1D5DB",
                        width: 20,
                        textAlign: "center",
                        flexShrink: 0,
                      }}
                    >
                      {t.rank}
                    </span>
                    <CertThumbnail theme={t.theme} w={36} h={26} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: TX,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {t.name}
                      </div>
                      <div style={{ fontSize: 10, color: TX3 }}>
                        {t.issued.toLocaleString()} / {t.verified.toLocaleString()}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: t.rateColor === SG ? SGL : WOL,
                        color: t.rateColor,
                        flexShrink: 0,
                      }}
                    >
                      {t.rate}%
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <SectionCard
              title="Downloads & Shares"
              action={
                <select
                  style={{
                    border: `1px solid ${BD}`,
                    borderRadius: 6,
                    padding: "4px 8px",
                    fontSize: 12,
                    color: TX2,
                  }}
                >
                  <option>This Week</option>
                </select>
              }
            >
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={barData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: TX3 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: TX3 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `${v / 1000}K`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: `1px solid ${BD}`, fontSize: 11 }}
                  />
                  <Bar dataKey="downloads" fill={P} radius={[3, 3, 0, 0]} name="Downloads" />
                  <Bar dataKey="shares" fill={WO} radius={[3, 3, 0, 0]} name="Shares" />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 4 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    color: TX2,
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: P }} />
                  Downloads
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    color: TX2,
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: WO }} />
                  Shares
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Verification Activity"
              action={
                <select
                  style={{
                    border: `1px solid ${BD}`,
                    borderRadius: 6,
                    padding: "4px 8px",
                    fontSize: 12,
                    color: TX2,
                  }}
                >
                  <option>This Week</option>
                </select>
              }
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Method", "Count", "Change"].map((h) => (
                      <th
                        key={h}
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: TX2,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          padding: "4px 0",
                          textAlign: "left",
                          borderBottom: `1px solid ${BD}`,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { method: "QR Code Scanned", count: "15,986", change: "+22.6%", up: true },
                    { method: "Direct Link Access", count: "4,231", change: "+18.1%", up: true },
                    { method: "Email Verification", count: "2,145", change: "+15.3%", up: true },
                    { method: "Manual Verification", count: "390", change: "-2.4%", up: false },
                  ].map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#F9FAFB" }}>
                      <td style={{ padding: "8px 0", fontSize: 12, color: TX }}>{r.method}</td>
                      <td style={{ padding: "8px 0", fontSize: 13, fontWeight: 600, color: TX }}>
                        {r.count}
                      </td>
                      <td
                        style={{
                          padding: "8px 0",
                          fontSize: 12,
                          fontWeight: 600,
                          color: r.up ? SG : ER,
                        }}
                      >
                        {r.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </SectionCard>

            <SectionCard
              title="Geographic Distribution"
              action={
                <select
                  style={{
                    border: `1px solid ${BD}`,
                    borderRadius: 6,
                    padding: "4px 8px",
                    fontSize: 12,
                    color: TX2,
                  }}
                >
                  <option>This Week</option>
                </select>
              }
            >
              <div
                style={{
                  height: 180,
                  background: "linear-gradient(135deg,#0a0a23,#15153c)",
                  borderRadius: 8,
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: isMapDragging ? "grabbing" : "grab",
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsMapDragging(true);
                  setMapDragStart({ x: e.clientX - mapPan.x, y: e.clientY - mapPan.y });
                }}
                onMouseMove={(e) => {
                  if (!isMapDragging) return;
                  const newX = e.clientX - mapDragStart.x;
                  const newY = e.clientY - mapDragStart.y;
                  // Keep pan boundaries bounded based on zoom level
                  const boundX = Math.max(
                    -400 * (mapZoom - 1),
                    Math.min(400 * (mapZoom - 1), newX),
                  );
                  const boundY = Math.max(
                    -180 * (mapZoom - 1),
                    Math.min(180 * (mapZoom - 1), newY),
                  );
                  setMapPan({ x: boundX, y: boundY });
                }}
                onMouseUp={() => setIsMapDragging(false)}
                onMouseLeave={() => setIsMapDragging(false)}
              >
                {/* Map Zoom Controls */}
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    zIndex: 10,
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMapZoom((z) => Math.min(4, z + 0.25));
                    }}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      background: "rgba(15,23,42,0.85)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: 14,
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Zoom In"
                  >
                    +
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMapZoom((z) => Math.max(1, z - 0.25));
                    }}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      background: "rgba(15,23,42,0.85)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: 14,
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Zoom Out"
                  >
                    −
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMapZoom(1);
                      setMapPan({ x: 0, y: 0 });
                    }}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      background: "rgba(15,23,42,0.85)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: 10,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Reset Zoom"
                  >
                    ⟲
                  </button>
                </div>

                {/* Minimalist World Map Vector Outline */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 360"
                  style={{ position: "absolute", top: 0, left: 0 }}
                >
                  <g
                    transform={`translate(${mapPan.x}, ${mapPan.y}) scale(${mapZoom})`}
                    style={{ transformOrigin: "center center" }}
                  >
                    {/* High-Fidelity SVG Continents Map Outline */}
                    {/* North America */}
                    <path
                      d="M 120,45 L 140,40 L 180,48 L 220,42 L 260,55 L 290,50 L 305,65 L 295,85 L 265,95 L 255,115 L 245,145 L 235,155 L 210,165 L 190,145 L 165,150 L 145,135 L 130,110 L 115,95 L 105,75 Z"
                      fill="#ffffff"
                      opacity="0.12"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="0.5"
                    />
                    {/* South America */}
                    <path
                      d="M 235,165 L 260,170 L 285,185 L 315,210 L 320,240 L 300,285 L 280,320 L 265,335 L 255,325 L 260,280 L 250,230 L 235,195 Z"
                      fill="#ffffff"
                      opacity="0.12"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="0.5"
                    />
                    {/* Europe */}
                    <path
                      d="M 380,60 L 410,50 L 435,55 L 450,75 L 440,95 L 420,105 L 400,115 L 385,100 L 370,85 Z"
                      fill="#ffffff"
                      opacity="0.14"
                      stroke="rgba(255,255,255,0.25)"
                      strokeWidth="0.5"
                    />
                    {/* Africa */}
                    <path
                      d="M 375,120 L 415,115 L 460,135 L 485,160 L 480,200 L 465,245 L 440,280 L 415,285 L 405,250 L 380,210 L 365,170 L 365,140 Z"
                      fill="#ffffff"
                      opacity="0.12"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="0.5"
                    />
                    {/* Asia & Middle East */}
                    <path
                      d="M 450,70 L 490,50 L 560,45 L 640,40 L 710,55 L 730,85 L 715,115 L 675,130 L 640,150 L 600,175 L 565,180 L 540,155 L 500,140 L 465,120 Z"
                      fill="#ffffff"
                      opacity="0.13"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="0.5"
                    />
                    {/* India Subcontinent */}
                    <path
                      d="M 535,145 L 565,140 L 585,165 L 575,200 L 555,215 L 540,185 Z"
                      fill="#ffffff"
                      opacity="0.18"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="0.75"
                    />
                    {/* Australia & Oceania */}
                    <path
                      d="M 645,235 L 685,225 L 725,240 L 730,275 L 705,305 L 660,300 L 640,270 Z"
                      fill="#ffffff"
                      opacity="0.12"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="0.5"
                    />
                    {/* Japan & East Asian Islands */}
                    <path
                      d="M 715,95 L 725,115 L 710,135 L 700,110 Z"
                      fill="#ffffff"
                      opacity="0.15"
                    />

                    {/* USA Marker */}
                    <g
                      onMouseEnter={() => setHoveredCountry("US")}
                      onMouseLeave={() => setHoveredCountry(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle cx="224" cy="126" r="14" fill="#a78bfa" opacity="0.2">
                        <animate
                          attributeName="r"
                          values="6;16;6"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.3;0;0.3"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle cx="224" cy="126" r="4" fill="#a78bfa" />
                    </g>

                    {/* UK Marker */}
                    <g
                      onMouseEnter={() => setHoveredCountry("UK")}
                      onMouseLeave={() => setHoveredCountry(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle cx="384" cy="108" r="14" fill="#a78bfa" opacity="0.2">
                        <animate
                          attributeName="r"
                          values="6;16;6"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.3;0;0.3"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle cx="384" cy="108" r="4" fill="#a78bfa" />
                    </g>

                    {/* India Marker */}
                    <g
                      onMouseEnter={() => setHoveredCountry("IN")}
                      onMouseLeave={() => setHoveredCountry(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle cx="536" cy="198" r="16" fill="#34d399" opacity="0.25">
                        <animate
                          attributeName="r"
                          values="8;20;8"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.4;0;0.4"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle cx="536" cy="198" r="5" fill="#34d399" />
                    </g>

                    {/* SVG Tooltips */}
                    {hoveredCountry === "US" && (
                      <g transform="translate(124, 56)">
                        <rect
                          width="200"
                          height="50"
                          rx="6"
                          fill="#0f172a"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="1"
                        />
                        <text
                          x="100"
                          y="20"
                          textAnchor="middle"
                          fill="white"
                          fontSize="11"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          United States
                        </text>
                        <text
                          x="100"
                          y="38"
                          textAnchor="middle"
                          fill="#c084fc"
                          fontSize="12"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          2,100 Verified
                        </text>
                      </g>
                    )}

                    {hoveredCountry === "UK" && (
                      <g transform="translate(284, 38)">
                        <rect
                          width="200"
                          height="50"
                          rx="6"
                          fill="#0f172a"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="1"
                        />
                        <text
                          x="100"
                          y="20"
                          textAnchor="middle"
                          fill="white"
                          fontSize="11"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          United Kingdom
                        </text>
                        <text
                          x="100"
                          y="38"
                          textAnchor="middle"
                          fill="#c084fc"
                          fontSize="12"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          1,230 Verified
                        </text>
                      </g>
                    )}

                    {hoveredCountry === "IN" && (
                      <g transform="translate(436, 128)">
                        <rect
                          width="200"
                          height="50"
                          rx="6"
                          fill="#0f172a"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="1"
                        />
                        <text
                          x="100"
                          y="20"
                          textAnchor="middle"
                          fill="white"
                          fontSize="11"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          India (Primary Hub)
                        </text>
                        <text
                          x="100"
                          y="38"
                          textAnchor="middle"
                          fill="#34d399"
                          fontSize="12"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          3,521 Verified
                        </text>
                      </g>
                    )}
                  </g>
                </svg>

                {/* Real Data Overlay Summary */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: 12,
                    right: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "rgba(10,10,35,0.75)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    padding: "6px 12px",
                    borderRadius: 6,
                  }}
                >
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                    Live Verification Map
                  </span>
                  <span style={{ fontSize: 11, color: "white", fontWeight: 600 }}>
                    India: 3,521 · US: 2,100 · UK: 1,230
                  </span>
                </div>
              </div>
            </SectionCard>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {[
              {
                icon: <ShieldCheck size={24} color={P} />,
                title: "High Verification Rate",
                desc: "Your verification rate is 95.2%, which is excellent!",
                link: "View Details →",
              },
              {
                icon: <Palette size={24} color={P} />,
                title: "Top Template",
                desc: "Executive Blue Gold is your top performer.",
                link: "See Templates →",
              },
              {
                icon: <BarChart2 size={24} color={P} />,
                title: "Engagement Growth",
                desc: "Certificate shares increased by 20.2% this week.",
                link: "View Analytics →",
              },
              {
                icon: <Lock size={24} color={P} />,
                title: "Increase Security",
                desc: "Enable blockchain verification for more trust.",
                link: "Go to Settings →",
              },
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  border: `1px solid ${BD}`,
                  borderRadius: 12,
                  padding: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: TX, marginBottom: 4 }}>
                  {c.title}
                </div>
                <div style={{ fontSize: 12, color: TX2, marginBottom: 8, lineHeight: 1.4 }}>
                  {c.desc}
                </div>
                <button
                  style={{
                    fontSize: 12,
                    color: P,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {c.link}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {aTab === "Certificates" && (
        <AnalyticsCertificates
          BD={BD}
          TX={TX}
          TX2={TX2}
          TX3={TX3}
          P={P}
          SGL={SGL}
          SG={SG}
          ER={ER}
          certificates={certificates}
        />
      )}
      {aTab === "Templates" && (
        <AnalyticsTemplates BD={BD} TX={TX} TX2={TX2} SG={SG} SGL={SGL} P={P} />
      )}
      {aTab === "Recipients" && <AnalyticsRecipients BD={BD} TX={TX} TX2={TX2} TX3={TX3} P={P} certificates={certificates} />}
      {aTab === "Verification" && (
        <AnalyticsVerification BD={BD} TX={TX} TX2={TX2} TX3={TX3} SGL={SGL} SG={SG} ER={ER} />
      )}
      {aTab === "Engagement" && (
        <AnalyticsEngagement
          BD={BD}
          TX={TX}
          TX2={TX2}
          TX3={TX3}
          P={P}
          PL={PL}
          IN={IN}
          INL={INL}
          SG={SG}
          SGL={SGL}
          WO={WO}
          barData={barData}
        />
      )}
      {aTab === "Exports" && <AnalyticsExports BD={BD} TX={TX} TX2={TX2} P={P} toast={toast} />}
    </div>
  );
}

// ─── Screen: Categories ───────────────────────────────────────────────────────
function CategoriesScreen({ categories = [], stats }: { categories: any[]; stats?: any }) {
  const [catsList, setCatsList] = useState<any[]>(() =>
    categories.length > 0 ? categories : CATS_DATA,
  );
  const [selectedCat, setSelectedCat] = useState(0);
  const [catSearch, setCatSearch] = useState("");

  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [editingCatIndex, setEditingCatIndex] = useState<number | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [newCatType, setNewCatType] = useState("Professional");
  const [newCatColor, setNewCatColor] = useState("#6B5BFB");

  const [newSubName, setNewSubName] = useState("");
  const [showSubModal, setShowSubModal] = useState(false);

  const displayCats = catsList;
  const cat = displayCats[selectedCat] || displayCats[0];
  const filtered = displayCats.filter((c: any) =>
    c.name?.toLowerCase().includes(catSearch.toLowerCase()),
  );

  const totalCerts = stats?.totalCerts ?? displayCats.reduce((acc, c) => acc + (c.certs || 0), 0);
  const verifiedCount = stats?.pieStatusData?.find((s: any) => s.name === "Verified")?.value ?? 0;
  const growth = stats?.monthlyGrowth as { value: number; date: string }[] | undefined;
  const totalSubcats = useMemo(
    () => displayCats.reduce((acc, c) => acc + (c.subcategories?.length || 0), 0),
    [displayCats],
  );

  const handleCreateCategory = () => {
    if (!newCatName.trim()) return toast.error("Category name is required.");
    const newCat = {
      name: newCatName.trim(),
      type: newCatType,
      certs: 0,
      templates: 1,
      rating: 4.8,
      status: "Active",
      color: newCatColor,
      subcategories: ["General"],
    };
    setCatsList((prev) => [...prev, newCat]);
    setNewCatName("");
    setShowAddCatModal(false);
    toast.success(`Category "${newCat.name}" added successfully!`);
  };

  const handleUpdateCategory = () => {
    if (editingCatIndex === null || !newCatName.trim()) return;
    setCatsList((prev) =>
      prev.map((c, i) =>
        i === editingCatIndex
          ? { ...c, name: newCatName.trim(), type: newCatType, color: newCatColor }
          : c,
      ),
    );
    setEditingCatIndex(null);
    setNewCatName("");
    toast.success("Category updated!");
  };

  const handleDeleteCategory = (idx: number, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    setCatsList((prev) => prev.filter((_, i) => i !== idx));
    if (selectedCat >= idx && selectedCat > 0) setSelectedCat((s) => s - 1);
    toast.success("Category deleted!");
  };

  const handleAddSubcategory = () => {
    if (!newSubName.trim()) return toast.error("Subcategory name is required.");
    if (!cat) return;
    setCatsList((prev) =>
      prev.map((c, idx) =>
        idx === selectedCat
          ? {
              ...c,
              subcategories: [...(c.subcategories || []), newSubName.trim()],
            }
          : c,
      ),
    );
    setNewSubName("");
    setShowSubModal(false);
    toast.success(`Added subcategory "${newSubName}" to ${cat.name}!`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Dynamic KPI Summary Cards */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <KPICard
          label="Total Categories"
          value={displayCats.length.toString()}
          delta=""
          icon={<Tag size={20} color={P} />}
          iconBg={PL}
          sparkData={[
            { v: 5, i: 0 },
            { v: 7, i: 1 },
            { v: 8, i: 2 },
            { v: 9, i: 3 },
            { v: displayCats.length, i: 4 },
          ]}
          sparkColor={P}
        />
        <KPICard
          label="Certificates Issued"
          value={totalCerts.toLocaleString()}
          delta={computeDelta(growth)}
          icon={<FilePlus size={20} color={SG} />}
          iconBg={SGL}
          sparkData={buildSparkData(growth, totalCerts)}
          sparkColor={SG}
        />
        <KPICard
          label="Verified Certificates"
          value={verifiedCount.toLocaleString()}
          delta={computeDelta(growth)}
          icon={<ShieldCheck size={20} color={IN} />}
          iconBg={INL}
          sparkData={buildSparkData(growth, verifiedCount)}
          sparkColor={IN}
        />
        <KPICard
          label="Active Subcategories"
          value={totalSubcats.toString()}
          delta=""
          icon={<FolderOpen size={20} color={WO} />}
          iconBg={WOL}
          sparkData={[
            { v: 10, i: 0 },
            { v: 20, i: 1 },
            { v: 30, i: 2 },
            { v: totalSubcats, i: 3 },
          ]}
          sparkColor={WO}
        />
      </div>

      {/* Header Search and Add Category Button */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ position: "relative", flex: "0 0 280px" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: TX3,
            }}
          />
          <input
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
            placeholder="Search categories..."
            style={{
              width: "100%",
              paddingLeft: 32,
              paddingRight: 12,
              height: 36,
              border: `1px solid ${BD}`,
              borderRadius: 8,
              fontSize: 13,
              color: TX,
              outline: "none",
            }}
          />
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Btn
            variant="primary"
            onClick={() => {
              setNewCatName("");
              setNewCatType("Professional");
              setNewCatColor("#6B5BFB");
              setShowAddCatModal(true);
            }}
          >
            <Plus size={14} />
            New Category
          </Btn>
        </div>
      </div>

      {/* Main Categories Table and Details Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        <div
          style={{
            background: "white",
            border: `1px solid ${BD}`,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: BG, borderBottom: `1px solid ${BD}` }}>
                {[
                  "Category Name",
                  "Type",
                  "Certificates",
                  "Templates",
                  "Avg Rating",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 14px",
                      fontSize: 11,
                      fontWeight: 600,
                      color: TX2,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={i}
                  onClick={() => setSelectedCat(displayCats.indexOf(c))}
                  style={{
                    borderBottom: `1px solid ${BD}`,
                    cursor: "pointer",
                    background: selectedCat === displayCats.indexOf(c) ? PL : "white",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCat !== displayCats.indexOf(c))
                      e.currentTarget.style.background = "#F9FAFB";
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCat !== displayCats.indexOf(c))
                      e.currentTarget.style.background = "white";
                  }}
                >
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: c.color || P,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 13, fontWeight: 600, color: TX }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: TX2 }}>
                    {c.type || "Professional"}
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: TX }}>
                    {(c.certs ?? 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: TX }}>
                    {c.templates ?? 0}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Star size={12} fill={WO} color={WO} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: TX }}>
                        {c.rating ?? 4.8}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <StatusBadge status={c.status || "Active"} />
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCat(displayCats.indexOf(c));
                        }}
                        style={{
                          padding: 5,
                          border: `1px solid ${BD}`,
                          borderRadius: 6,
                          background: "white",
                          cursor: "pointer",
                        }}
                        title="View Category"
                      >
                        <Eye size={12} color={TX2} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCatIndex(displayCats.indexOf(c));
                          setNewCatName(c.name);
                          setNewCatType(c.type || "Professional");
                          setNewCatColor(c.color || "#6B5BFB");
                        }}
                        style={{
                          padding: 5,
                          border: `1px solid ${BD}`,
                          borderRadius: 6,
                          background: "white",
                          cursor: "pointer",
                        }}
                        title="Edit Category"
                      >
                        <Edit size={12} color={TX2} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(displayCats.indexOf(c), c.name);
                        }}
                        style={{
                          padding: 5,
                          border: `1px solid ${ERL}`,
                          borderRadius: 6,
                          background: ERL,
                          cursor: "pointer",
                        }}
                        title="Delete Category"
                      >
                        <Trash2 size={12} color={ER} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Category Details Sidebar */}
        <div
          style={{
            background: "white",
            border: `1px solid ${BD}`,
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            height: "fit-content",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div
              style={{ width: 10, height: 10, borderRadius: "50%", background: cat?.color || P }}
            />
            <span style={{ fontSize: 14, fontWeight: 700, color: TX }}>{cat?.name}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {[
              { label: "Type", value: cat?.type || "Professional" },
              { label: "Certificates", value: (cat?.certs ?? 0).toLocaleString() },
              { label: "Templates", value: cat?.templates ?? 0 },
              { label: "Avg Rating", value: `${cat?.rating ?? 4.8} ⭐` },
              { label: "Status", value: <StatusBadge status={cat?.status || "Active"} /> },
            ].map((r) => (
              <div
                key={r.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 13,
                }}
              >
                <span style={{ color: TX2 }}>{r.label}</span>
                <span style={{ fontWeight: 500, color: TX }}>{r.value}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${BD}`, paddingTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: TX, marginBottom: 10 }}>
              Subcategories ({cat?.subcategories?.length || 0})
            </div>
            {(cat?.subcategories || ["General"]).map((sub: string, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 10px",
                  borderRadius: 6,
                  marginBottom: 4,
                  background: "#F9FAFB",
                  fontSize: 12,
                }}
              >
                <span style={{ color: TX }}>{sub}</span>
                <span style={{ color: TX3, fontSize: 11 }}>Active</span>
              </div>
            ))}
            <button
              onClick={() => setShowSubModal(true)}
              style={{
                width: "100%",
                marginTop: 8,
                padding: "8px",
                border: `1px dashed ${BD}`,
                borderRadius: 8,
                background: "white",
                cursor: "pointer",
                fontSize: 12,
                color: P,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <Plus size={13} />
              Add Subcategory
            </button>
          </div>
        </div>
      </div>

      {/* New / Edit Category Modal */}
      {(showAddCatModal || editingCatIndex !== null) && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 12,
              padding: 24,
              width: 400,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: TX }}>
              {editingCatIndex !== null ? "Edit Category" : "Add New Category"}
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TX, display: "block", marginBottom: 6 }}>
                Category Name
              </label>
              <input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Artificial Intelligence"
                style={{
                  width: "100%",
                  border: `1px solid ${BD}`,
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TX, display: "block", marginBottom: 6 }}>
                Type
              </label>
              <select
                value={newCatType}
                onChange={(e) => setNewCatType(e.target.value)}
                style={{
                  width: "100%",
                  border: `1px solid ${BD}`,
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 13,
                  outline: "none",
                }}
              >
                <option value="Professional">Professional</option>
                <option value="Academic">Academic</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TX, display: "block", marginBottom: 6 }}>
                Badge Color
              </label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  style={{ width: 40, height: 36, border: `1px solid ${BD}`, borderRadius: 6, cursor: "pointer" }}
                />
                <span style={{ fontSize: 12, fontFamily: "monospace" }}>{newCatColor}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
              <Btn
                variant="outline"
                onClick={() => {
                  setShowAddCatModal(false);
                  setEditingCatIndex(null);
                }}
              >
                Cancel
              </Btn>
              <Btn
                variant="primary"
                onClick={editingCatIndex !== null ? handleUpdateCategory : handleCreateCategory}
              >
                {editingCatIndex !== null ? "Save Changes" : "Create Category"}
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* Add Subcategory Modal */}
      {showSubModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 12,
              padding: 24,
              width: 360,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: TX }}>
              Add Subcategory to {cat?.name}
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TX, display: "block", marginBottom: 6 }}>
                Subcategory Name
              </label>
              <input
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="e.g. Prompt Engineering"
                style={{
                  width: "100%",
                  border: `1px solid ${BD}`,
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
              <Btn variant="outline" onClick={() => setShowSubModal(false)}>
                Cancel
              </Btn>
              <Btn variant="primary" onClick={handleAddSubcategory}>
                Add Subcategory
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Screen: Settings ─────────────────────────────────────────────────────────
function SettingsScreen({
  initialSettings,
  onSave,
}: {
  initialSettings: any;
  onSave: (s: any) => Promise<any>;
}) {
  const [expiry, setExpiry] = useState(initialSettings?.cert_expiry || "No Expiry");
  const [prefix, setPrefix] = useState(initialSettings?.cert_serial_prefix || "LAI-2026");
  const [blockchain, setBlockchain] = useState(initialSettings?.cert_blockchain === "true");
  const [emailNotif, setEmailNotif] = useState(
    initialSettings?.cert_email_notifications === "true",
  );
  const [qrCode, setQrCode] = useState(initialSettings?.cert_qr_code === "true");
  const [settingsNav, setSettingsNav] = useState("General");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        cert_expiry: expiry,
        cert_serial_prefix: prefix,
        cert_blockchain: blockchain ? "true" : "false",
        cert_email_notifications: emailNotif ? "true" : "false",
        cert_qr_code: qrCode ? "true" : "false",
      });
      toast.success("Settings saved successfully!");
    } catch (e: any) {
      toast.error(`Failed to save settings: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>
      <div
        style={{
          background: "white",
          border: `1px solid ${BD}`,
          borderRadius: 12,
          padding: 16,
          height: "fit-content",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        {[
          { icon: <Settings size={15} />, label: "General" },
          { icon: <Bell size={15} />, label: "Notifications" },
          { icon: <Shield size={15} />, label: "Security" },
          { icon: <Palette size={15} />, label: "Branding" },
          { icon: <Mail size={15} />, label: "Email" },
          { icon: <Globe size={15} />, label: "Domain" },
          { icon: <Users size={15} />, label: "Team" },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setSettingsNav(item.label)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 8,
              border: "none",
              background: settingsNav === item.label ? PL : "transparent",
              color: settingsNav === item.label ? P : TX2,
              fontSize: 13,
              fontWeight: settingsNav === item.label ? 600 : 400,
              cursor: "pointer",
              marginBottom: 2,
              textAlign: "left",
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <SectionCard title="General Settings">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: TX,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Organization Name
                </label>
                <input
                  defaultValue="Learnify AI"
                  disabled
                  style={{
                    width: "100%",
                    border: `1px solid ${BD}`,
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: 13,
                    color: TX,
                    outline: "none",
                    background: "#F9FAFB",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: TX,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Certificate ID Prefix
                </label>
                <input
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  style={{
                    width: "100%",
                    border: `1px solid ${BD}`,
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: 13,
                    color: TX,
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: TX,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Expiry Preference
                </label>
                <select
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  style={{
                    width: "100%",
                    border: `1px solid ${BD}`,
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: 13,
                    color: TX,
                    outline: "none",
                  }}
                >
                  <option value="No Expiry">No Expiry</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="5 Years">5 Years</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: TX,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Timezone
                </label>
                <input
                  defaultValue="Asia/Kolkata (IST)"
                  disabled
                  style={{
                    width: "100%",
                    border: `1px solid ${BD}`,
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: 13,
                    color: TX,
                    outline: "none",
                    background: "#F9FAFB",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="primary" onClick={handleSave}>
                {saving ? "Saving..." : "Save Changes"}
              </Btn>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Notifications & Automation">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              {
                label: "Email Notifications",
                sub: "Send email to recipients when certificate is issued",
                val: emailNotif,
                set: setEmailNotif,
              },
              {
                label: "Blockchain Verification",
                sub: "Enable blockchain hash for tamper detection",
                val: blockchain,
                set: setBlockchain,
              },
              {
                label: "Show QR Code",
                sub: "Render QR Code on certificate for direct mobile scans",
                val: qrCode,
                set: setQrCode,
              },
            ].map((t) => (
              <div
                key={t.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: `1px solid ${BD}`,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TX }}>{t.label}</div>
                  <div style={{ fontSize: 12, color: TX2 }}>{t.sub}</div>
                </div>
                <div
                  onClick={() => t.set(!t.val)}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 999,
                    background: t.val ? P : BD,
                    position: "relative",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "white",
                      position: "absolute",
                      top: 3,
                      left: t.val ? 23 : 3,
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <Btn variant="primary" onClick={handleSave}>
                {saving ? "Saving..." : "Save Changes"}
              </Btn>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Security">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                icon: <Lock size={16} color={P} />,
                title: "Rate Limiting",
                desc: "Max 60 verification requests per minute per IP",
                badge: "Active",
                badgeBg: SGL,
                badgeColor: SG,
              },
              {
                icon: <Shield size={16} color={IN} />,
                title: "SSL/TLS",
                desc: "All data encrypted in transit",
                badge: "Active",
                badgeBg: SGL,
                badgeColor: SG,
              },
              {
                icon: <Zap size={16} color={WO} />,
                title: "Audit Log",
                desc: "All actions logged with user ID and timestamp",
                badge: "Active",
                badgeBg: SGL,
                badgeColor: SG,
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  border: `1px solid ${BD}`,
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: PL,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {s.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TX }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: TX2 }}>{s.desc}</div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 6,
                    background: s.badgeBg,
                    color: s.badgeColor,
                  }}
                >
                  {s.badge}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

const DEFAULT_FIELDS = {
  title: {
    x: 50,
    y: 12,
    fontSize: 48,
    fontFamily: "Playfair Display, serif",
    color: "#1a1a2e",
    fontWeight: "bold",
    text: "CERTIFICATE",
    align: "center",
  },
  subtitle: {
    x: 50,
    y: 18,
    fontSize: 14,
    fontFamily: "Inter, sans-serif",
    color: "#666666",
    fontWeight: "600",
    letterSpacing: "0.25em",
    text: "OF COMPLETION",
    align: "center",
  },
  certifyText: {
    x: 50,
    y: 24,
    fontSize: 12,
    fontFamily: "Inter, sans-serif",
    color: "#888888",
    fontWeight: "normal",
    text: "This is to certify that",
    align: "center",
  },
  studentName: {
    x: 50,
    y: 32,
    fontSize: 42,
    fontFamily: "Great Vibes, cursive",
    color: "#1a1a2e",
    fontWeight: "normal",
    variable: "{{student_name}}",
    align: "center",
  },
  completeText: {
    x: 50,
    y: 40,
    fontSize: 12,
    fontFamily: "Inter, sans-serif",
    color: "#888888",
    fontWeight: "normal",
    text: "has successfully completed the course",
    align: "center",
  },
  courseName: {
    x: 50,
    y: 46,
    fontSize: 22,
    fontFamily: "Inter, sans-serif",
    color: "#1a1a2e",
    fontWeight: "bold",
    variable: "{{course_name}}",
    align: "center",
  },
  description: {
    x: 50,
    y: 52,
    fontSize: 11,
    fontFamily: "Inter, sans-serif",
    color: "#666666",
    fontWeight: "normal",
    text: "and has demonstrated the knowledge and skills required",
    align: "center",
  },
  signatureName: {
    x: 22,
    y: 68,
    fontSize: 20,
    fontFamily: "Great Vibes, cursive",
    color: "#1a1a2e",
    fontWeight: "normal",
    variable: "{{signature_name}}",
    align: "center",
  },
  signatureTitle: {
    x: 22,
    y: 72,
    fontSize: 10,
    fontFamily: "Inter, sans-serif",
    color: "#888888",
    fontWeight: "normal",
    variable: "{{signature_title}}",
    align: "center",
  },
  date: {
    x: 78,
    y: 68,
    fontSize: 12,
    fontFamily: "Inter, sans-serif",
    color: "#1a1a2e",
    fontWeight: "600",
    variable: "{{issue_date}}",
    align: "center",
  },
  dateLabel: {
    x: 78,
    y: 72,
    fontSize: 10,
    fontFamily: "Inter, sans-serif",
    color: "#888888",
    fontWeight: "normal",
    text: "Date of Issuance",
    align: "center",
  },
  certId: {
    x: 50,
    y: 88,
    fontSize: 10,
    fontFamily: "monospace",
    color: "#999999",
    fontWeight: "normal",
    variable: "{{cert_id}}",
    align: "center",
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────
export function CertDesignerAdmin() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [designerTemplate, setDesignerTemplate] = useState<CanvaTemplate | null>(null);
  const [showDesignerWorkspace, setShowDesignerWorkspace] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiStyle, setAiStyle] = useState("w3schools");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return toast.error("Please enter a prompt for the AI Designer.");
    setIsGeneratingAi(true);

    try {
      const stylesMap: Record<string, any> = {
        w3schools: {
          name: "W3Schools Web Developer AI Edition",
          primary: "#04aa6d",
          accent: "#282a35",
          bg: "#ffffff",
          fontTitle: "Space Grotesk, sans-serif",
          fontName: "Space Grotesk, sans-serif",
          sub: "INTERNATIONAL WEB DEVELOPMENT CERTIFICATION",
        },
        coursera: {
          name: "Coursera Honors AI Edition",
          primary: "#d4af37",
          accent: "#8a6d2b",
          bg: "#fdfaf4",
          fontTitle: "Cinzel, serif",
          fontName: "Playfair Display, serif",
          sub: "HONORS CERTIFICATE OF ACCOMPLISHMENT",
        },
        executive: {
          name: "Executive Post-Graduate AI Edition",
          primary: "#003b73",
          accent: "#d4af37",
          bg: "#001f3f",
          fontTitle: "Cinzel, serif",
          fontName: "Playfair Display, serif",
          sub: "POST GRADUATE EXECUTIVE DIPLOMA",
        },
        cyber: {
          name: "Cyber Security Specialist AI Edition",
          primary: "#00f2fe",
          accent: "#fe007c",
          bg: "#080a13",
          fontTitle: "monospace",
          fontName: "monospace",
          sub: "ADVANCED CYBER SECURITY CERTIFICATION",
        },
      };

      const selected = stylesMap[aiStyle] || stylesMap.w3schools;
      const titleText = aiPrompt.length < 40 ? aiPrompt.toUpperCase() : "CERTIFICATE OF EXCELLENCE";

      const generatedTemplate: CanvaTemplate = {
        id: "new_ai_" + Date.now(),
        name: `${selected.name} (${aiPrompt.slice(0, 20)})`,
        category: "AI Generated",
        bg_image_url: "",
        thumbnail_url: null,
        theme_colors: {
          primary: selected.primary,
          accent: selected.accent,
          background: selected.bg,
          text: selected.bg === "#ffffff" ? "#1a1a2e" : "#ffffff",
        },
        fields_json: {
          ...DEFAULT_FIELDS,
          title: {
            ...DEFAULT_FIELDS.title,
            text: titleText,
            fontFamily: selected.fontTitle,
            color: selected.primary,
          },
          subtitle: {
            ...DEFAULT_FIELDS.subtitle,
            text: selected.sub,
            fontFamily: "Inter, sans-serif",
          },
          studentName: {
            ...DEFAULT_FIELDS.studentName,
            fontFamily: selected.fontName,
            color: selected.bg === "#ffffff" ? "#1a1a2e" : "#ffffff",
          },
          courseName: {
            ...DEFAULT_FIELDS.courseName,
            text: aiPrompt,
            color: selected.primary,
          },
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: null,
      };

      setDesignerTemplate(generatedTemplate);
      setShowAiModal(false);
      setShowDesignerWorkspace(true);
      toast.success("AI Certificate generated! Customize it on the canvas.");
    } catch (e: any) {
      toast.error(e?.message || "AI Generation failed.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const doList = useServerFn(listCanvaTemplates);
  const doSave = useServerFn(saveCanvaTemplate);
  const doDelete = useServerFn(deleteCanvaTemplate);
  const doSeed = useServerFn(seedAllTemplates);

  const doGetStats = useServerFn(getCertificateStats);
  const doListAllCerts = useServerFn(listAllCertificates);
  const doGetCategories = useServerFn(getCertCategories);
  const doGetSettings = useServerFn(getCertSettings);
  const doSaveSettings = useServerFn(saveCertSettings);

  const { data: stats } = useQuery({
    queryKey: ["cert-system-stats"],
    queryFn: () => doGetStats().catch(() => null),
    staleTime: 60_000,
  });

  const { data: certificates = [] } = useQuery({
    queryKey: ["certificates-list"],
    queryFn: () => doListAllCerts().catch(() => []),
    staleTime: 60_000,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["cert-categories"],
    queryFn: () => doGetCategories().catch(() => []),
    staleTime: 60_000,
  });

  const { data: initialSettings } = useQuery({
    queryKey: ["cert-settings"],
    queryFn: () => doGetSettings().catch(() => null),
    staleTime: 60_000,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["admin-courses-min"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, instructor")
        .order("title");
      if (error) return [];
      return data ?? [];
    },
    staleTime: 60_000,
  });

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["canva-cert-templates"],
    queryFn: async () => {
      try {
        const r = await doList();
        return (r ?? []) as CanvaTemplate[];
      } catch {
        return [];
      }
    },
    staleTime: 60_000,
  });

  const handleSeed = async () => {
    try {
      const res = await doSeed();
      toast.success(
        `Seeded: ${res.created} templates created${res.errors?.length ? `, ${res.errors.length} errors` : ""}`,
      );
      qc.invalidateQueries({ queryKey: ["canva-cert-templates"] });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleEdit = (t: CanvaTemplate) => {
    setDesignerTemplate(t);
    setShowDesignerWorkspace(true);
  };

  const handleDuplicate = async (t: CanvaTemplate) => {
    try {
      const copyName = `${t.name} (Copy)`;
      const res = await doSave({
        data: {
          name: copyName,
          category: t.category || "Professional",
          bg_image_url: t.bg_image_url,
          thumbnail_url: t.thumbnail_url,
          fields_json: t.fields_json || { elements: [], design: {} },
        } as any,
      });
      toast.success(`Duplicated "${copyName}"!`);
      qc.invalidateQueries({ queryKey: ["canva-cert-templates"] });
      const newTemplate: CanvaTemplate = {
        ...t,
        id: res.id,
        name: copyName,
      };
      setDesignerTemplate(newTemplate);
      setShowDesignerWorkspace(true);
    } catch (e: any) {
      toast.error(`Duplicate failed: ${e.message}`);
    }
  };

  const handleNew = () => {
    setDesignerTemplate({
      id: "new",
      name: "New Certificate",
      category: "Professional",
      bg_image_url: "",
      thumbnail_url: null,
      fields_json: null,
      theme_colors: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: null,
    });
    setShowDesignerWorkspace(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this template?")) return;
    try {
      await doDelete({ data: { id } });
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["canva-cert-templates"] });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  // DesignerWorkspace full-screen mode
  if (showDesignerWorkspace && designerTemplate) {
    return (
      <DesignerWorkspace
        initialTemplate={{
          id: designerTemplate.id,
          name: designerTemplate.name,
          type: designerTemplate.category || "Certificate",
          layout: designerTemplate.fields_json?.design?.layout || "classic",
          bg_image_url: designerTemplate.bg_image_url || "",
          config_json: designerTemplate.fields_json || { elements: [], design: {} },
        }}
        onSave={async (tmpl) => {
          await doSave({
            data: { ...designerTemplate, ...tmpl, fields_json: tmpl.config_json } as any,
          });
          qc.invalidateQueries({ queryKey: ["canva-cert-templates"] });
          toast.success("Saved!");
          setShowDesignerWorkspace(false);
        }}
        onClose={() => setShowDesignerWorkspace(false)}
      />
    );
  }

  const PAGE_INFO: Record<string, { icon: ReactNode; title: string; subtitle: string }> = {
    overview: {
      icon: <Shield size={22} color={P} />,
      title: "Certificate System",
      subtitle: "Create, manage and issue professional certificates with ease.",
    },
    "all-certs": {
      icon: <FileText size={22} color={P} />,
      title: "All Certificates",
      subtitle: "Manage, search and filter all issued certificates.",
    },
    templates: {
      icon: <LayoutGrid size={22} color={P} />,
      title: "Certificate Templates",
      subtitle: "Browse, create and manage certificate templates.",
    },
    designer: {
      icon: <Pen size={22} color={P} />,
      title: "Certificate Designer",
      subtitle: "Design beautiful, verifiable certificates with ease.",
    },
    "bulk-issue": {
      icon: <Upload size={22} color={P} />,
      title: "Bulk Issue Certificates",
      subtitle: "Upload a list of recipients and issue certificates in bulk.",
    },
    verification: {
      icon: <ShieldCheck size={22} color={P} />,
      title: "Verification Center",
      subtitle: "Verify certificate authenticity and manage verification settings.",
    },
    analytics: {
      icon: <BarChart2 size={22} color={P} />,
      title: "Certificate Analytics",
      subtitle: "Track certificate performance, engagement, and insights.",
    },
    categories: {
      icon: <Tag size={22} color={P} />,
      title: "Certificate Categories",
      subtitle: "Organize and manage certificate categories and subcategories.",
    },
    badges: {
      icon: <Award size={22} color={P} />,
      title: "Badge & Credential Studio",
      subtitle: "Design and automate achievement badges for course completions and milestones.",
    },
    settings: {
      icon: <Settings size={22} color={P} />,
      title: "Settings",
      subtitle: "Configure your certificate system preferences and integrations.",
    },
  };

  const info = PAGE_INFO[activeTab] || PAGE_INFO["overview"];

  const renderScreen = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewScreen
            setTab={setActiveTab}
            stats={stats}
            onOpenAiModal={() => setShowAiModal(true)}
          />
        );
      case "all-certs":
        return (
          <AllCertsScreen
            certificates={certificates}
            setTab={setActiveTab}
            onRefresh={() => qc.invalidateQueries({ queryKey: ["certificates-list"] })}
          />
        );
      case "templates":
        return (
          <TemplatesScreen
            setTab={setActiveTab}
            dbTemplates={templates}
            handleSeed={handleSeed}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleDuplicate={handleDuplicate}
            isLoading={isLoading}
          />
        );
      case "designer":
        return <DesignerCanvasScreen />;
      case "bulk-issue":
        return <BulkIssueScreen courses={courses} templates={templates} />;
      case "verification":
        return <VerificationScreen stats={stats} certificates={certificates} />;
      case "analytics":
        return <AnalyticsScreen stats={stats} certificates={certificates} templates={templates} />;
      case "badges":
        return <BadgeDesigner />;
      case "categories":
        return <CategoriesScreen categories={categories} stats={stats} />;
      case "settings":
        return (
          <SettingsScreen
            initialSettings={initialSettings}
            onSave={async (s) => {
              await doSaveSettings({ data: s });
              qc.invalidateQueries({ queryKey: ["cert-settings"] });
            }}
          />
        );
      default:
        return (
          <OverviewScreen
            setTab={setActiveTab}
            stats={stats}
            onOpenAiModal={() => setShowAiModal(true)}
          />
        );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        fontFamily: "Inter,system-ui,sans-serif",
        color: TX,
      }}
    >
      {/* Sticky Header + Tab Nav */}
      <div
        style={{
          background: "white",
          borderBottom: `1px solid ${BD}`,
          position: "sticky",
          top: 0,
          zIndex: 20,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 24px 0" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: PL,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {info.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: TX, margin: 0, lineHeight: 1.2 }}>
              {info.title}
            </h1>
            <p style={{ fontSize: 13, color: TX2, margin: 0 }}>{info.subtitle}</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn
              variant="outline"
              onClick={() => setShowAiModal(true)}
              style={{ borderColor: "#7C3AED", color: "#7C3AED" }}
            >
              <Sparkles size={14} />
              AI Designer
            </Btn>
            {activeTab === "templates" && (
              <>
                <Btn variant="outline" onClick={handleSeed}>
                  <RefreshCw size={13} />
                  Seed Templates
                </Btn>
                <Btn variant="primary" onClick={handleNew}>
                  <Plus size={14} />
                  New Template
                </Btn>
              </>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            gap: 0,
            padding: "0 24px",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "12px 16px",
                border: "none",
                borderBottom: `2px solid ${activeTab === t.id ? P : "transparent"}`,
                background: "transparent",
                color: activeTab === t.id ? P : TX2,
                fontSize: 13,
                fontWeight: activeTab === t.id ? 600 : 400,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== t.id) e.currentTarget.style.color = "#374151";
              }}
              onMouseLeave={(e) => {
                if (activeTab !== t.id) e.currentTarget.style.color = TX2;
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          padding: activeTab === "designer" ? "16px" : "20px 24px",
          maxWidth: activeTab === "designer" ? "100%" : 1400,
          margin: "0 auto",
        }}
      >
        {renderScreen()}
      </div>

      {/* AI Certificate Generator Modal */}
      {showAiModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 16,
              width: "100%",
              maxWidth: 520,
              padding: 24,
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              border: "1px solid #E2E8F0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#EDE9FE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Sparkles size={20} color="#7C3AED" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                    AI Certificate Designer
                  </h3>
                  <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>
                    Generate customized certificate templates with AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 18,
                  color: "#64748B",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: 6,
                }}
              >
                Certificate Prompt / Course Title
              </label>
              <textarea
                rows={3}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Full Stack Web Development Certificate in Emerald W3Schools Style with Gold Seal"
                style={{
                  width: "100%",
                  borderRadius: 8,
                  border: "1px solid #CBD5E1",
                  padding: 10,
                  fontSize: 13,
                  color: "#0F172A",
                  outline: "none",
                  resize: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: 6,
                }}
              >
                Style Preset
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { id: "w3schools", name: "W3Schools Tech", color: "#04aa6d" },
                  { id: "coursera", name: "Coursera Academic", color: "#d4af37" },
                  { id: "executive", name: "Executive Navy", color: "#003b73" },
                  { id: "cyber", name: "Cyber Dark Tech", color: "#00f2fe" },
                ].map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setAiStyle(s.id)}
                    style={{
                      border: `2px solid ${aiStyle === s.id ? s.color : "#E2E8F0"}`,
                      borderRadius: 8,
                      padding: "8px 12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: aiStyle === s.id ? "#F8FAFC" : "white",
                    }}
                  >
                    <div
                      style={{ width: 12, height: 12, borderRadius: "50%", background: s.color }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: aiStyle === s.id ? 600 : 400,
                        color: "#0F172A",
                      }}
                    >
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="outline" onClick={() => setShowAiModal(false)}>
                Cancel
              </Btn>
              <Btn variant="primary" onClick={handleAiGenerate} disabled={isGeneratingAi}>
                {isGeneratingAi ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                Generate with AI
              </Btn>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        ::-webkit-scrollbar{display:none}
        *{scrollbar-width:none}
      `}</style>
    </div>
  );
}
