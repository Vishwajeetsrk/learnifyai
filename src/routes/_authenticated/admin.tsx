import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Users,
  ShieldAlert,
  Wallet,
  BarChart3,
  Bell,
  Loader2,
  Download,
  RefreshCw,
  Calendar as CalendarIcon,
  MoreHorizontal,
  Pencil,
  Plus,
  KeyRound,
  Ban,
  Trash2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  UserPlus,
  VideoOff,
  Award,
  Mail,
  Send,
  Eye,
  Save,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  format,
  startOfWeek,
  startOfMonth,
  subDays,
  eachDayOfInterval,
  parse,
  differenceInCalendarDays,
  startOfDay,
  endOfDay,
} from "date-fns";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  adminListUsers,
  adminUpdateUser,
  adminSetPassword,
  adminSetDisabled,
  adminDeleteUser,
  adminSetAiCredits,
  adminSetUserRoles,
  adminCreateUser,
} from "@/lib/admin-users.functions";
import { DemandForecastWidget } from "@/components/DemandForecastWidget";
import {
  adminListEmailTemplates,
  adminGetEmailTemplate,
  adminSaveEmailTemplate,
  adminSendTestEmail,
} from "@/lib/welcome-email.functions";

const APP_ROLES = ["super_admin", "admin", "creator", "student"] as const;
type AppRole = (typeof APP_ROLES)[number];

// Activity SVG icon (placed after all imports to avoid bundle initialization crash)
function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Command Center — Learnify AI" }] }),
  component: AdminPage,
});

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
const fmtDate = (d: Date) => format(d, "dd-MM-yyyy");

type RangePreset = "7d" | "30d" | "month" | "90d" | "custom";

function AdminPage() {
  const location = useLocation();

  if (location.pathname !== "/admin") return <Outlet />;
  return <AdminOverview />;
}

function AdminOverview() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [forbidden, setForbidden] = useState(false);

  // ───────── Date range filter (default last 30 days) ─────────
  const today = useMemo(() => new Date(), []);
  const [preset, setPreset] = useState<RangePreset>("30d");
  const [from, setFrom] = useState<Date>(subDays(today, 29));
  const [to, setTo] = useState<Date>(today);
  const [txFilter, setTxFilter] = useState<string>("all");

  const TX_FILTERS = [
    { value: "all", label: "All" },
    { value: "topup", label: "Top-up" },
    { value: "subscription", label: "Subscription" },
    { value: "course", label: "Course purchase" },
    { value: "creator", label: "Creator earning" },
    { value: "withdrawal", label: "Withdrawal" },
  ];

  const txFilterFn = (t: { description?: string | null; type: string }) => {
    if (txFilter === "all") return true;
    const desc = (t.description ?? "").toLowerCase();
    switch (txFilter) {
      case "topup":
        return desc.includes("top-up") || desc.includes("topup");
      case "subscription":
        return desc.includes("purchased plan");
      case "course":
        return desc.includes("course purchase");
      case "creator":
        return desc.includes("creator earning");
      case "withdrawal":
        return desc.includes("withdrawal");
      default:
        return true;
    }
  };

  const applyPreset = (p: RangePreset) => {
    setPreset(p);
    const now = new Date();
    if (p === "7d") {
      setFrom(subDays(now, 6));
      setTo(now);
    } else if (p === "30d") {
      setFrom(subDays(now, 29));
      setTo(now);
    } else if (p === "month") {
      setFrom(startOfMonth(now));
      setTo(now);
    } else if (p === "90d") {
      setFrom(subDays(now, 89));
      setTo(now);
    }
  };

  useEffect(() => {
    if (!loading && !isAdmin) setForbidden(true);
  }, [loading, isAdmin]);

  // ───────── QUERIES ─────────
  const aiReq24hQuery = useQuery({
    enabled: isAdmin && typeof window !== "undefined",
    queryKey: ["admin", "ai24"],
    queryFn: async () => {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count, error } = await supabase
        .from("chat_messages")
        .select("id", { count: "exact", head: true })
        .gte("created_at", since);
      if (error) throw error;
      return count ?? 0;
    },
  });

  const notificationsQuery = useQuery({
    enabled: isAdmin && typeof window !== "undefined",
    queryKey: ["admin", "notifications"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  // Transactions in selected range
  const fromIso = startOfDay(from).toISOString();
  const toIso = endOfDay(to).toISOString();
  const txQuery = useQuery({
    enabled: isAdmin && typeof window !== "undefined",
    queryKey: ["admin", "transactions", fromIso, toIso],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("id, user_id, amount_inr, type, status, description, created_at")
        .gte("created_at", fromIso)
        .lte("created_at", toIso)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const listUsersFn = useServerFn(adminListUsers);
  const usersQuery = useQuery({
    enabled: isAdmin && typeof window !== "undefined",
    queryKey: ["admin", "users"],
    queryFn: () => listUsersFn(),
  });

  // Cohorts
  const adminCohortsQuery = useQuery({
    enabled: isAdmin && typeof window !== "undefined",
    queryKey: ["admin", "cohorts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cohorts")
        .select(
          "id, title, description, kind, starts_at, capacity, status, creator_id, created_at, meeting_url",
        )
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  // Withdrawal requests
  const withdrawalsQuery = useQuery({
    enabled: isAdmin && typeof window !== "undefined",
    queryKey: ["admin", "withdrawals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("creator_withdrawals")
        .select(
          "id, user_id, amount_inr, method, destination, status, admin_notes, created_at, processed_at",
        )
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });

  // AI cost in range
  const aiCostQuery = useQuery({
    enabled: isAdmin && typeof window !== "undefined",
    queryKey: ["admin", "ai-cost", fromIso, toIso],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_usage")
        .select("model, cost_usd, cost_inr, total_tokens, created_at")
        .gte("created_at", fromIso)
        .lte("created_at", toIso)
        .order("created_at", { ascending: false })
        .limit(5000);
      if (error) throw error;
      return data ?? [];
    },
  });

  // Creator applications queue
  const creatorAppsQuery = useQuery({
    enabled: isAdmin && typeof window !== "undefined",
    queryKey: ["admin", "creator-apps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("creator_applications")
        .select("id, user_id, motivation, portfolio_url, expertise, status, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });

  // ───────── REALTIME ─────────
  useEffect(() => {
    if (!isAdmin) return;
    const ch = supabase
      .channel("admin-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "wallet_transactions" }, () =>
        qc.invalidateQueries({ queryKey: ["admin", "transactions"] }),
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () =>
        qc.invalidateQueries({ queryKey: ["admin", "users"] }),
      )
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, () =>
        qc.invalidateQueries({ queryKey: ["admin", "ai24"] }),
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () =>
        qc.invalidateQueries({ queryKey: ["admin", "notifications"] }),
      )
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "ai_usage" }, () =>
        qc.invalidateQueries({ queryKey: ["admin", "ai-cost"] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [isAdmin, qc]);

  // ───────── DERIVED METRICS (range-aware) ─────────
  const tx = txQuery.data ?? [];
  const filteredTx = useMemo(() => tx.filter(txFilterFn), [tx, txFilter]);
  const rangeRevenue = useMemo(
    () =>
      tx
        .filter((t) => t.status === "completed" && t.type === "credit")
        .reduce((s, t) => s + Number(t.amount_inr), 0),
    [tx],
  );
  const weeklyRevenue = useMemo(() => {
    const wkStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return tx
      .filter(
        (t) => t.status === "completed" && t.type === "credit" && new Date(t.created_at) >= wkStart,
      )
      .reduce((s, t) => s + Number(t.amount_inr), 0);
  }, [tx]);
  const monthlyRevenue = useMemo(() => {
    const mStart = startOfMonth(new Date());
    return tx
      .filter(
        (t) => t.status === "completed" && t.type === "credit" && new Date(t.created_at) >= mStart,
      )
      .reduce((s, t) => s + Number(t.amount_inr), 0);
  }, [tx]);

  // Daily series across the selected range
  const dailySeries = useMemo(() => {
    const days = eachDayOfInterval({ start: from, end: to });
    const buckets = new Map(days.map((d) => [format(d, "yyyy-MM-dd"), 0] as [string, number]));
    for (const t of tx) {
      if (t.status !== "completed" || t.type !== "credit") continue;
      const k = format(new Date(t.created_at), "yyyy-MM-dd");
      if (buckets.has(k)) buckets.set(k, (buckets.get(k) ?? 0) + Number(t.amount_inr));
    }
    return Array.from(buckets, ([date, revenue]) => ({
      date: format(new Date(date), "dd-MM"),
      revenue,
    }));
  }, [tx, from, to]);

  // Weekly series across the range (max 16 buckets)
  const weeklySeries = useMemo(() => {
    const totalDays = Math.max(1, differenceInCalendarDays(to, from) + 1);
    const weeks = Math.max(1, Math.ceil(totalDays / 7));
    const out: { week: string; revenue: number }[] = [];
    for (let i = 0; i < weeks; i++) {
      const ws = subDays(to, (weeks - i) * 7 - 1);
      const we = subDays(to, (weeks - i - 1) * 7 - 1);
      const sum = tx
        .filter(
          (t) =>
            t.status === "completed" &&
            t.type === "credit" &&
            new Date(t.created_at) >= ws &&
            new Date(t.created_at) <= we,
        )
        .reduce((s, t) => s + Number(t.amount_inr), 0);
      out.push({ week: format(ws, "dd-MM"), revenue: sum });
    }
    return out;
  }, [tx, from, to]);

  const rangeLabel = `${fmtDate(from)} → ${fmtDate(to)}`;

  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    // ─── Helper: style a sheet with column widths + header row bold ───
    const styleSheet = (ws: XLSX.WorkSheet, widths: number[], headerFill?: string) => {
      ws["!cols"] = widths.map((w) => ({ wch: w }));
      // Freeze header row
      ws["!freeze"] = { xSplit: 0, ySplit: 1 };
      if (headerFill) {
        const range = XLSX.utils.decode_range(ws["!ref"] ?? "A1");
        for (let c = range.s.c; c <= range.e.c; c++) {
          const addr = XLSX.utils.encode_cell({ r: 0, c });
          if (ws[addr]) {
            ws[addr].s = {
              font: { bold: true, color: { rgb: "FFFFFF" } },
              fill: { fgColor: { rgb: headerFill } },
              alignment: { horizontal: "center" },
            };
          }
        }
      }
      return ws;
    };

    // ─── 1. SUMMARY SHEET ───
    const summaryData = [
      ["", ""],
      ["LEARNIFY AI — ADMIN REPORT", ""],
      ["", ""],
      ["Metric", "Value"],
      ["Report period", rangeLabel],
      ["Transaction filter", TX_FILTERS.find((f) => f.value === txFilter)?.label ?? "All"],
      ["Total registered users", usersQuery.data?.total ?? 0],
      ["AI requests (last 24h)", aiReq24hQuery.data ?? 0],
      [`Revenue in period (INR)`, rangeRevenue],
      ["Revenue this week (INR)", weeklyRevenue],
      ["Revenue this month (INR)", monthlyRevenue],
      ["Notifications sent", notificationsQuery.data ?? 0],
      ["", ""],
      ["Generated at", format(new Date(), "dd-MM-yyyy HH:mm")],
      ["Generated by", user?.email ?? "admin"],
    ];
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    summaryWs["!cols"] = [{ wch: 30 }, { wch: 40 }];
    // Merge title row
    summaryWs["!merges"] = [{ s: { r: 1, c: 0 }, e: { r: 1, c: 1 } }];
    XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

    // ─── 2. DAILY REVENUE ───
    const dailyHeader = [["Date", "Revenue (₹)"]];
    const dailyRows = dailySeries.map((d) => [d.date, d.revenue]);
    dailyRows.push(["", ""]);
    dailyRows.push(["TOTAL", dailySeries.reduce((s, d) => s + d.revenue, 0)]);
    const dailyWs = XLSX.utils.aoa_to_sheet([...dailyHeader, ...dailyRows]);
    styleSheet(dailyWs, [18, 18], "4472C4");
    XLSX.utils.book_append_sheet(wb, dailyWs, "Daily Revenue");

    // ─── 3. WEEKLY REVENUE ───
    const weeklyHeader = [["Week Starting", "Revenue (₹)"]];
    const weeklyRows = weeklySeries.map((w) => [w.week, w.revenue]);
    weeklyRows.push(["", ""]);
    weeklyRows.push(["TOTAL", weeklySeries.reduce((s, w) => s + w.revenue, 0)]);
    const weeklyWs = XLSX.utils.aoa_to_sheet([...weeklyHeader, ...weeklyRows]);
    styleSheet(weeklyWs, [20, 18], "4472C4");
    XLSX.utils.book_append_sheet(wb, weeklyWs, "Weekly Revenue");

    // ─── 4. TRANSACTIONS ───
    const txHeader = [
      ["Transaction ID", "User ID", "Amount (₹)", "Type", "Status", "Description", "Date"],
    ];
    const txRows = tx.map((t) => [
      t.id,
      t.user_id,
      Number(t.amount_inr),
      t.type,
      t.status,
      t.description ?? "",
      format(new Date(t.created_at), "dd-MM-yyyy HH:mm"),
    ]);
    const txWs = XLSX.utils.aoa_to_sheet([...txHeader, ...txRows]);
    styleSheet(txWs, [38, 38, 14, 10, 12, 35, 20], "2E75B6");
    XLSX.utils.book_append_sheet(wb, txWs, "Transactions");

    // ─── 5. USERS ───
    const userRows = usersQuery.data?.rows ?? [];
    const usersHeader = [
      ["User ID", "Full Name", "Email", "Roles", "Status", "AI Credits", "Joined", "Last Sign In"],
    ];
    const usersData = userRows.map((u) => [
      u.id,
      u.full_name ?? "",
      u.email ?? "",
      u.roles.join(", "),
      u.disabled ? "🔴 Banned" : "🟢 Active",
      u.credits_remaining,
      format(new Date(u.created_at), "dd-MM-yyyy"),
      u.last_sign_in_at ? format(new Date(u.last_sign_in_at), "dd-MM-yyyy HH:mm") : "Never",
    ]);
    const usersWs = XLSX.utils.aoa_to_sheet([...usersHeader, ...usersData]);
    styleSheet(usersWs, [38, 22, 30, 28, 12, 12, 14, 20], "548235");
    XLSX.utils.book_append_sheet(wb, usersWs, "Users");

    // ─── 6. AI COST BREAKDOWN ───
    const aiCosts = aiCostQuery.data ?? [];
    if (aiCosts.length > 0) {
      const aiHeader = [["Model", "Cost (USD)", "Cost (INR)", "Tokens", "Date"]];
      const aiRows = aiCosts.map((a) => [
        a.model ?? "unknown",
        Number(a.cost_usd ?? 0).toFixed(4),
        Number(a.cost_inr ?? 0).toFixed(2),
        a.total_tokens ?? 0,
        format(new Date(a.created_at), "dd-MM-yyyy HH:mm"),
      ]);
      const totalUsd = aiCosts.reduce((s, a) => s + Number(a.cost_usd ?? 0), 0);
      const totalInr = aiCosts.reduce((s, a) => s + Number(a.cost_inr ?? 0), 0);
      const totalTokens = aiCosts.reduce((s, a) => s + Number(a.total_tokens ?? 0), 0);
      aiRows.push(["", "", "", "", ""]);
      aiRows.push(["TOTAL", totalUsd.toFixed(4), totalInr.toFixed(2), totalTokens, ""]);
      const aiWs = XLSX.utils.aoa_to_sheet([...aiHeader, ...aiRows]);
      styleSheet(aiWs, [25, 14, 14, 14, 20], "BF8F00");
      XLSX.utils.book_append_sheet(wb, aiWs, "AI Costs");
    }

    // ─── Download ───
    XLSX.writeFile(wb, `Learnify-Report_${fmtDate(from)}_to_${fmtDate(to)}.xlsx`);
    toast.success("Report downloaded!");
  };

  const handleExportCSV = (all = false) => {
    const data = all ? (txQuery.data ?? []) : filteredTx;
    const header = ["Date", "Type", "Status", "Description", "Amount (INR)"];
    const rows = data.map((t: any) => [
      format(new Date(t.created_at), "dd-MM-yyyy HH:mm"),
      t.type,
      t.status,
      t.description ?? "",
      Number(t.amount_inr),
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Transactions_${fmtDate(from)}_to_${fmtDate(to)}${all ? "_all" : `_${txFilter}`}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(all ? "All transactions downloaded!" : "CSV downloaded!");
  };

  const refreshAll = () => qc.invalidateQueries({ queryKey: ["admin"] });

  // ───────── User actions modals ─────────
  type AdminUser = NonNullable<typeof usersQuery.data>["rows"][number];
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [pwdFor, setPwdFor] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState<AdminUser | null>(null);
  const [creditsFor, setCreditsFor] = useState<AdminUser | null>(null);
  const [creditsValue, setCreditsValue] = useState<string>("");
  const [rolesFor, setRolesFor] = useState<AdminUser | null>(null);
  const [rolesValue, setRolesValue] = useState<AppRole[]>([]);
  const [creating, setCreating] = useState(false);
  const [showEmailTemplates, setShowEmailTemplates] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [cohortCreateOpen, setCohortCreateOpen] = useState(false);
  const [cohortForm, setCohortForm] = useState({
    title: "",
    description: "",
    kind: "cohort",
    starts_at: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    capacity: "50",
    status: "draft",
    meeting_url: "",
  });
  const [newRoles, setNewRoles] = useState<AppRole[]>(["student"]);
  const [busy, setBusy] = useState(false);

  const updateUser = useServerFn(adminUpdateUser);
  const setPassword = useServerFn(adminSetPassword);
  const setDisabled = useServerFn(adminSetDisabled);
  const deleteUser = useServerFn(adminDeleteUser);
  const setAiCredits = useServerFn(adminSetAiCredits);
  const setUserRoles = useServerFn(adminSetUserRoles);
  const createUser = useServerFn(adminCreateUser);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [pwdValue, setPwdValue] = useState("");

  useEffect(() => {
    if (rolesFor) setRolesValue((rolesFor.roles as AppRole[]) ?? []);
  }, [rolesFor]);

  useEffect(() => {
    if (editing) {
      setEditName(editing.full_name ?? "");
      setEditEmail(editing.email ?? "");
    }
  }, [editing]);

  useEffect(() => {
    if (creditsFor) setCreditsValue(String(creditsFor.credits_remaining ?? 0));
  }, [creditsFor]);

  async function saveEdit() {
    if (!editing) return;
    setBusy(true);
    try {
      await updateUser({
        data: { userId: editing.id, fullName: editName.trim(), email: editEmail.trim() },
      });
      toast.success("User updated");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function savePassword() {
    if (!pwdFor) return;
    if (pwdValue.length < 8) return toast.error("At least 8 characters");
    setBusy(true);
    try {
      await setPassword({ data: { userId: pwdFor.id, password: pwdValue } });
      toast.success("Password reset");
      setPwdFor(null);
      setPwdValue("");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function toggleDisabled(u: AdminUser) {
    setBusy(true);
    try {
      await setDisabled({ data: { userId: u.id, disabled: !u.disabled } });
      toast.success(u.disabled ? "User enabled" : "User disabled");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await deleteUser({ data: { userId: deleting.id } });
      toast.success("User deleted");
      setDeleting(null);
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function saveCredits() {
    if (!creditsFor) return;
    const n = Number(creditsValue);
    if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
      return toast.error("Enter a whole number ≥ 0");
    }
    setBusy(true);
    try {
      await setAiCredits({ data: { userId: creditsFor.id, creditsRemaining: n } });
      toast.success(`AI credits updated to ${n.toLocaleString("en-IN")}`);
      setCreditsFor(null);
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function toggleRole(list: AppRole[], r: AppRole, set: (v: AppRole[]) => void) {
    set(list.includes(r) ? list.filter((x) => x !== r) : [...list, r]);
  }
  async function saveRoles() {
    if (!rolesFor) return;
    setBusy(true);
    try {
      await setUserRoles({ data: { userId: rolesFor.id, roles: rolesValue } });
      toast.success("Roles updated");
      setRolesFor(null);
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function saveCreate() {
    const email = newEmail.trim();
    const name = newName.trim();
    if (!email || !name) return toast.error("Name and email are required");
    if (newPwd.length < 8) return toast.error("Password must be at least 8 characters");
    if (newRoles.length === 0) return toast.error("Pick at least one role");
    setBusy(true);
    try {
      await createUser({ data: { email, fullName: name, password: newPwd, roles: newRoles } });
      toast.success("User created");
      setCreating(false);
      setNewEmail("");
      setNewName("");
      setNewPwd("");
      setNewRoles(["student"]);
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (forbidden) {
    return (
      <AppShell>
        <div className="min-h-[60vh] grid place-items-center p-10 text-center">
          <div>
            <ShieldAlert className="h-10 w-10 mx-auto text-destructive" />
            <h1 className="mt-4 text-2xl font-display font-semibold">Restricted area</h1>
            <p className="mt-2 text-muted-foreground">
              You need admin privileges to view this page.
            </p>
            <button
              className="mt-6 text-sm text-primary underline"
              onClick={() => navigate({ to: "/dashboard" })}
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const stats = [
    {
      label: "Total users",
      value: usersQuery.isLoading ? "…" : (usersQuery.data?.total ?? 0),
      icon: Users,
      tint: "from-primary/30 to-primary/0",
    },
    {
      label: "AI requests (24h)",
      value: aiReq24hQuery.isLoading ? "…" : (aiReq24hQuery.data ?? 0).toLocaleString("en-IN"),
      icon: ActivityIcon,
      tint: "from-violet-500/30 to-violet-500/0",
    },
    {
      label: `Revenue · ${rangeLabel}`,
      value: txQuery.isLoading ? "…" : inr(rangeRevenue),
      icon: Wallet,
      tint: "from-emerald-500/30 to-emerald-500/0",
    },
    {
      label: "Notifications sent",
      value: notificationsQuery.isLoading
        ? "…"
        : (notificationsQuery.data ?? 0).toLocaleString("en-IN"),
      icon: Bell,
      tint: "from-amber-500/30 to-amber-500/0",
    },
  ];

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-7xl">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-medium">
              Command Center
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-display font-semibold tracking-tight">
              Admin overview
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Realtime view of the platform.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
            </Badge>
            <Button variant="outline" size="sm" onClick={() => navigate({ to: "/admin/content" })}>
              <CalendarIcon className="h-4 w-4" /> Events & Jobs
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: "/admin/missing-videos" })}
            >
              <VideoOff className="h-4 w-4" /> Missing videos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: "/admin/certificates" })}
            >
              <Award className="h-4 w-4" /> Certificates
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowEmailTemplates(true)}>
              <Mail className="h-4 w-4" /> Email Templates
            </Button>
            <Button variant="outline" size="sm" onClick={refreshAll}>
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
            <div className="hidden md:flex items-center gap-2">
              <Button size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" /> Export Excel
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleExportCSV()}>
                <Download className="h-4 w-4 mr-2" /> Export CSV
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleExportCSV(true)}>
                <Download className="h-4 w-4 mr-2" /> Export All
              </Button>
            </div>
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline">
                    Export <Download className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExport}>Export Excel</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportCSV()}>Export CSV</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportCSV(true)}>
                    Export All
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Report filter */}
        <div className="mt-6 rounded-2xl border bg-card p-4 shadow-card">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-medium mr-2 flex items-center gap-2 w-full sm:w-auto">
                <CalendarIcon className="h-4 w-4 text-primary" /> Report range
              </div>
              {(["7d", "30d", "month", "90d"] as const).map((p) => (
                <Button
                  key={p}
                  size="sm"
                  variant={preset === p ? "default" : "outline"}
                  onClick={() => applyPreset(p)}
                  className="flex-1 sm:flex-none"
                >
                  {p === "7d"
                    ? "Last 7 days"
                    : p === "30d"
                      ? "Last 30 days"
                      : p === "month"
                        ? "This month"
                        : "Last 90 days"}
                </Button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 lg:ml-auto w-full lg:w-auto">
              <div className="w-full sm:w-auto">
                <DateField
                  label="Start Date"
                  value={from}
                  onChange={(d) => {
                    setFrom(d);
                    setPreset("custom");
                  }}
                />
              </div>
              <span className="text-muted-foreground hidden sm:inline-block">→</span>
              <div className="w-full sm:w-auto mt-2 sm:mt-0">
                <DateField
                  label="End Date"
                  value={to}
                  onChange={(d) => {
                    setTo(d);
                    setPreset("custom");
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
            <span>
              Showing data for <span className="font-medium text-foreground">{rangeLabel}</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Type:</span>
              <Select value={txFilter} onValueChange={setTxFilter}>
                <SelectTrigger className="h-7 text-xs w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TX_FILTERS.map((f) => (
                    <SelectItem key={f.value} value={f.value} className="text-xs">
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-xl border bg-card p-5 shadow-card"
            >
              <div
                className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${s.tint} blur-2xl`}
              />
              <s.icon className="h-5 w-5 text-primary relative" />
              <div className="mt-3 text-xl md:text-2xl font-display font-semibold relative">
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1 relative">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">This week</div>
            <div className="mt-2 text-3xl font-display font-semibold">{inr(weeklyRevenue)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Revenue since {fmtDate(startOfWeek(new Date(), { weekStartsOn: 1 }))}
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              This month
            </div>
            <div className="mt-2 text-3xl font-display font-semibold">{inr(monthlyRevenue)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Revenue since {fmtDate(startOfMonth(new Date()))}
            </div>
          </div>
        </div>

        {/* AI demand forecast */}
        <div className="mt-6">
          <DemandForecastWidget />
        </div>

        {/* AI Cost panel (real-time) */}
        <AiCostPanel
          rows={aiCostQuery.data ?? []}
          loading={aiCostQuery.isLoading}
          rangeLabel={rangeLabel}
        />

        {/* Charts */}
        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-lg font-semibold">Daily revenue</h2>
                <p className="text-xs text-muted-foreground">{rangeLabel}</p>
              </div>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailySeries}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.72 0.18 245)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="oklch(0.72 0.18 245)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0 0 0 / 0.06)" />
                  <XAxis dataKey="date" stroke="oklch(0.5 0.03 260)" fontSize={11} />
                  <YAxis
                    stroke="oklch(0.5 0.03 260)"
                    fontSize={11}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                    }}
                    formatter={(v: number) => inr(v)}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="oklch(0.72 0.18 245)"
                    fill="url(#rev)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold">Weekly revenue</h2>
            <p className="text-xs text-muted-foreground mb-4">Per-week totals in range</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklySeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0 0 0 / 0.06)" />
                  <XAxis dataKey="week" stroke="oklch(0.5 0.03 260)" fontSize={11} />
                  <YAxis
                    stroke="oklch(0.5 0.03 260)"
                    fontSize={11}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                    }}
                    formatter={(v: number) => inr(v)}
                  />
                  <Bar dataKey="revenue" fill="oklch(0.55 0.22 260)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="mt-8 rounded-2xl border bg-card shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-display text-lg font-semibold">Transactions</h2>
            <p className="text-xs text-muted-foreground">
              {filteredTx.length} of {tx.length} in {rangeLabel}
              {txFilter !== "all" &&
                ` · filtered: ${TX_FILTERS.find((f) => f.value === txFilter)?.label}`}
            </p>
          </div>
          {txQuery.isLoading ? (
            <div className="p-10 grid place-items-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filteredTx.length === 0 ? (
            <div className="p-10 text-sm text-muted-foreground text-center">
              No transactions{txFilter !== "all" ? " matching filter" : ""} in this range.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">When</th>
                    <th className="text-left px-6 py-3 font-medium">Type</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-left px-6 py-3 font-medium">Description</th>
                    <th className="text-right px-6 py-3 font-medium">Amount</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTx.map((t) => (
                    <tr key={t.id} className="border-t hover:bg-accent/30">
                      <td className="px-6 py-3 text-muted-foreground text-xs">
                        {format(new Date(t.created_at), "dd-MM-yyyy HH:mm")}
                      </td>
                      <td className="px-6 py-3">
                        <Badge
                          variant={t.type === "credit" ? "default" : "secondary"}
                          className="text-[10px]"
                        >
                          {t.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-xs">{t.status}</td>
                      <td className="px-6 py-3 text-muted-foreground">{t.description ?? "—"}</td>
                      <td className="px-6 py-3 text-right font-medium">
                        {inr(Number(t.amount_inr))}
                      </td>
                      <td className="px-2 py-3 text-right">
                        <button
                          onClick={async () => {
                            if (!window.confirm("Delete this transaction? This cannot be undone."))
                              return;
                            const { error } = await supabase
                              .from("wallet_transactions")
                              .delete()
                              .eq("id", t.id);
                            if (error) return toast.error(error.message);
                            toast.success("Transaction deleted");
                            qc.invalidateQueries({ queryKey: ["admin", "transactions"] });
                          }}
                          className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                          title="Delete transaction"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Creator applications */}
        <ApprovalsSection
          creatorApps={creatorAppsQuery.data ?? []}
          appsLoading={creatorAppsQuery.isLoading}
          userMap={new Map((usersQuery.data?.rows ?? []).map((u) => [u.id, u]))}
          adminId={user?.id ?? ""}
          onChanged={() => {
            qc.invalidateQueries({ queryKey: ["admin", "creator-apps"] });
            qc.invalidateQueries({ queryKey: ["admin", "withdrawals"] });
            qc.invalidateQueries({ queryKey: ["admin", "transactions"] });
          }}
        />

        <WithdrawalsSection
          withdrawals={withdrawalsQuery.data ?? []}
          isLoading={withdrawalsQuery.isLoading}
          userMap={new Map((usersQuery.data?.rows ?? []).map((u) => [u.id, u]))}
          adminId={user?.id ?? ""}
          onChanged={() => {
            qc.invalidateQueries({ queryKey: ["admin", "withdrawals"] });
            qc.invalidateQueries({ queryKey: ["admin", "transactions"] });
          }}
        />

        {/* Admin cohorts */}
        <div className="mt-8 rounded-2xl border bg-card shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold">Cohorts</h2>
              <p className="text-xs text-muted-foreground">
                {adminCohortsQuery.data?.length ?? 0} total · manage cohorts, office hours, study
                groups
              </p>
            </div>
            <Dialog open={cohortCreateOpen} onOpenChange={setCohortCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4" /> Create
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create cohort</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Title</Label>
                    <Input
                      value={cohortForm.title}
                      onChange={(e) => setCohortForm((f) => ({ ...f, title: e.target.value }))}
                      maxLength={120}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Description</Label>
                    <Textarea
                      value={cohortForm.description}
                      onChange={(e) =>
                        setCohortForm((f) => ({ ...f, description: e.target.value }))
                      }
                      rows={2}
                      maxLength={500}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Type</Label>
                      <Select
                        value={cohortForm.kind}
                        onValueChange={(v) => setCohortForm((f) => ({ ...f, kind: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cohort">Live cohort</SelectItem>
                          <SelectItem value="office_hours">Office hours</SelectItem>
                          <SelectItem value="study_group">Study group</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Status</Label>
                      <Select
                        value={cohortForm.status}
                        onValueChange={(v) => setCohortForm((f) => ({ ...f, status: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="live">Live</SelectItem>
                          <SelectItem value="ended">Ended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Starts at</Label>
                      <Input
                        type="datetime-local"
                        value={cohortForm.starts_at}
                        onChange={(e) =>
                          setCohortForm((f) => ({ ...f, starts_at: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Capacity</Label>
                      <Input
                        type="number"
                        min={1}
                        max={10000}
                        value={cohortForm.capacity}
                        onChange={(e) => setCohortForm((f) => ({ ...f, capacity: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Meeting URL</Label>
                    <Input
                      value={cohortForm.meeting_url}
                      onChange={(e) =>
                        setCohortForm((f) => ({ ...f, meeting_url: e.target.value }))
                      }
                      placeholder="https://"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={async () => {
                      if (!cohortForm.title.trim()) return toast.error("Title required");
                      const { error } = await supabase.from("cohorts").insert({
                        title: cohortForm.title.trim(),
                        description: cohortForm.description.trim() || null,
                        kind: cohortForm.kind,
                        starts_at: new Date(cohortForm.starts_at).toISOString(),
                        capacity: Math.max(1, Number(cohortForm.capacity) || 50),
                        status: cohortForm.status,
                        meeting_url: cohortForm.meeting_url.trim() || null,
                        creator_id: user?.id ?? "",
                      });
                      if (error) return toast.error(error.message);
                      toast.success("Cohort created");
                      setCohortCreateOpen(false);
                      setCohortForm({
                        title: "",
                        description: "",
                        kind: "cohort",
                        starts_at: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
                        capacity: "50",
                        status: "draft",
                        meeting_url: "",
                      });
                      qc.invalidateQueries({ queryKey: ["admin", "cohorts"] });
                      qc.invalidateQueries({ queryKey: ["cohorts"] });
                      qc.invalidateQueries({ queryKey: ["community-cohorts"] });
                    }}
                  >
                    <Plus className="h-4 w-4" /> Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {adminCohortsQuery.isLoading ? (
            <div className="p-8 grid place-items-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : !adminCohortsQuery.data || adminCohortsQuery.data.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No cohorts yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 md:px-6 py-3 font-medium">Title</th>
                    <th className="text-left px-4 md:px-6 py-3 font-medium">Type</th>
                    <th className="text-left px-4 md:px-6 py-3 font-medium">Status</th>
                    <th className="text-left px-4 md:px-6 py-3 font-medium">Starts</th>
                    <th className="text-left px-4 md:px-6 py-3 font-medium">Capacity</th>
                    <th className="px-4 md:px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {(adminCohortsQuery.data ?? []).map((c: any) => (
                    <tr key={c.id} className="border-t hover:bg-accent/30">
                      <td className="px-4 md:px-6 py-3 font-medium">{c.title}</td>
                      <td className="px-4 md:px-6 py-3 capitalize">{c.kind.replace("_", " ")}</td>
                      <td className="px-4 md:px-6 py-3">
                        <Badge
                          variant={
                            c.status === "live"
                              ? "default"
                              : c.status === "draft"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-[10px] capitalize"
                        >
                          {c.status}
                        </Badge>
                      </td>
                      <td className="px-4 md:px-6 py-3 text-muted-foreground text-xs">
                        {c.starts_at ? format(new Date(c.starts_at), "dd MMM HH:mm") : "—"}
                      </td>
                      <td className="px-4 md:px-6 py-3">{c.capacity}</td>
                      <td className="px-4 md:px-6 py-3">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" asChild>
                            <Link to="/cohorts/$id" params={{ id: c.id }}>
                              View
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={async () => {
                              const confirmed = window.confirm("Delete this cohort?");
                              if (!confirmed) return;
                              await supabase.from("cohorts").delete().eq("id", c.id);
                              toast.success("Deleted");
                              qc.invalidateQueries({ queryKey: ["admin", "cohorts"] });
                              qc.invalidateQueries({ queryKey: ["cohorts"] });
                              qc.invalidateQueries({ queryKey: ["community-cohorts"] });
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Users management */}
        <div className="mt-8 rounded-2xl border bg-card shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold">Users</h2>
              <p className="text-xs text-muted-foreground">
                {usersQuery.data?.total ?? 0} total · manage profile, roles, password, status
              </p>
            </div>
            <Button size="sm" onClick={() => setCreating(true)} className="gap-1.5">
              <UserPlus className="h-4 w-4" /> Add user
            </Button>
          </div>
          {usersQuery.isLoading ? (
            <div className="p-10 grid place-items-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : usersQuery.error ? (
            <div className="p-10 text-sm text-destructive text-center">
              {(usersQuery.error as Error).message}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 md:px-6 py-3 font-medium">User</th>
                    <th className="text-left px-4 md:px-6 py-3 font-medium">Email</th>
                    <th className="text-left px-4 md:px-6 py-3 font-medium">Roles</th>
                    <th className="text-left px-4 md:px-6 py-3 font-medium">AI credits</th>
                    <th className="text-left px-4 md:px-6 py-3 font-medium">Status</th>
                    <th className="text-left px-4 md:px-6 py-3 font-medium">Joined</th>
                    <th className="px-4 md:px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {(usersQuery.data?.rows ?? []).map((u) => {
                    const isMe = u.id === user?.id;
                    return (
                      <tr
                        key={u.id}
                        className={cn("border-t hover:bg-accent/30", u.disabled && "opacity-60")}
                      >
                        <td className="px-4 md:px-6 py-3 font-medium">{u.full_name ?? "—"}</td>
                        <td className="px-4 md:px-6 py-3 text-muted-foreground">{u.email}</td>
                        <td className="px-4 md:px-6 py-3">
                          <div className="flex flex-wrap gap-1">
                            {u.roles.length === 0 ? (
                              <span className="text-xs text-muted-foreground">—</span>
                            ) : (
                              u.roles.map((r) => (
                                <Badge
                                  key={r}
                                  variant={r === "super_admin" ? "default" : "secondary"}
                                  className="text-[10px]"
                                >
                                  {r}
                                </Badge>
                              ))
                            )}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-3">
                          <button
                            type="button"
                            onClick={() => setCreditsFor(u)}
                            className="inline-flex items-center gap-1.5 rounded-md border bg-background px-2 py-1 text-xs font-medium hover:bg-accent transition"
                            title="Edit AI credits"
                          >
                            <Sparkles className="h-3 w-3 text-violet-500" />
                            {(u.credits_remaining ?? 0).toLocaleString("en-IN")}
                            <span className="text-muted-foreground font-normal">
                              · used {(u.credits_used ?? 0).toLocaleString("en-IN")}
                            </span>
                          </button>
                        </td>
                        <td className="px-4 md:px-6 py-3">
                          {u.disabled ? (
                            <Badge variant="destructive" className="text-[10px]">
                              Disabled
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px]">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 md:px-6 py-3 text-muted-foreground text-xs">
                          {format(new Date(u.created_at), "dd-MM-yyyy")}
                        </td>
                        <td className="px-4 md:px-6 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" disabled={busy}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditing(u)}>
                                <Pencil className="h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setRolesFor(u)}>
                                <ShieldCheck className="h-4 w-4" /> Manage roles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setPwdFor(u)}>
                                <KeyRound className="h-4 w-4" /> Change password
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setCreditsFor(u)}>
                                <Sparkles className="h-4 w-4" /> Edit AI credits
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem disabled={isMe} onClick={() => toggleDisabled(u)}>
                                <Ban className="h-4 w-4" />{" "}
                                {u.disabled ? "Enable user" : "Disable user"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={isMe}
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleting(u)}
                              >
                                <Trash2 className="h-4 w-4" /> Delete user
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>Update profile and email.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password dialog */}
      <Dialog
        open={!!pwdFor}
        onOpenChange={(o) => {
          if (!o) {
            setPwdFor(null);
            setPwdValue("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set new password</DialogTitle>
            <DialogDescription>This will overwrite the user's current password.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>New password</Label>
            <Input type="password" value={pwdValue} onChange={(e) => setPwdValue(e.target.value)} />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPwdFor(null);
                setPwdValue("");
              }}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button onClick={savePassword} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI credits dialog */}
      <Dialog
        open={!!creditsFor}
        onOpenChange={(o) => {
          if (!o) {
            setCreditsFor(null);
            setCreditsValue("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-500" /> Edit AI credits
            </DialogTitle>
            <DialogDescription>
              Set the remaining AI credits for <b>{creditsFor?.email}</b>. Used so far:{" "}
              {(creditsFor?.credits_used ?? 0).toLocaleString("en-IN")}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>Credits remaining</Label>
            <Input
              type="number"
              min={0}
              step={1}
              value={creditsValue}
              onChange={(e) => setCreditsValue(e.target.value)}
              placeholder="e.g. 500"
            />
            <p className="text-[11px] text-muted-foreground">
              Whole number, between 0 and 1,000,000.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreditsFor(null);
                setCreditsValue("");
              }}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button onClick={saveCredits} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save credits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      {/* Manage roles dialog */}
      <Dialog open={!!rolesFor} onOpenChange={(o) => !o && setRolesFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Manage roles
            </DialogTitle>
            <DialogDescription>
              Control role-based access for <b>{rolesFor?.email}</b>. A user can have multiple
              roles.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {APP_ROLES.map((r) => {
              const checked = rolesValue.includes(r);
              const isSelfSuper = rolesFor?.id === user?.id && r === "super_admin";
              return (
                <label
                  key={r}
                  className={cn(
                    "flex items-center gap-3 rounded-md border p-2.5 cursor-pointer hover:bg-accent/40",
                    checked && "border-primary/50 bg-primary/5",
                  )}
                >
                  <Checkbox
                    checked={checked}
                    disabled={isSelfSuper && checked}
                    onCheckedChange={() => toggleRole(rolesValue, r, setRolesValue)}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium capitalize">{r.replace("_", " ")}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {r === "super_admin" &&
                        "Full access to everything, including this admin console."}
                      {r === "admin" && "Manage content, courses, certificates, and most settings."}
                      {r === "creator" &&
                        "Create and publish courses & lessons; access creator studio."}
                      {r === "student" &&
                        "Default learner role; enroll, learn, and earn certificates."}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRolesFor(null)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={saveRoles} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save roles
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create user dialog */}
      <Dialog
        open={creating}
        onOpenChange={(o) => {
          if (!o) setCreating(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" /> Add new user
            </DialogTitle>
            <DialogDescription>
              Create an account and assign one or more roles. The user can sign in immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="jane@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Temporary password</Label>
              <Input
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="At least 8 characters"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Roles</Label>
              <div className="flex flex-wrap gap-2">
                {APP_ROLES.map((r) => {
                  const checked = newRoles.includes(r);
                  return (
                    <button
                      type="button"
                      key={r}
                      onClick={() => toggleRole(newRoles, r, setNewRoles)}
                      className={cn(
                        "px-2.5 py-1 rounded-full border text-xs capitalize transition",
                        checked
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-accent",
                      )}
                    >
                      {r.replace("_", " ")}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreating(false)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={saveCreate} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Create user
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes <b>{deleting?.email}</b> and all their auth/profile data.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={busy}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Email Templates Dialog */}
      {showEmailTemplates && (
        <Dialog open={showEmailTemplates} onOpenChange={setShowEmailTemplates}>
          <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0">
            <DialogHeader className="px-6 py-4 border-b shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Email Templates
              </DialogTitle>
              <DialogDescription>
                Edit platform email templates. Changes apply immediately to all future emails.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              <EmailTemplatesPanel />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AppShell>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Date;
  onChange: (d: Date) => void;
}) {
  const [text, setText] = useState(format(value, "dd-MM-yyyy"));
  useEffect(() => setText(format(value, "dd-MM-yyyy")), [value]);
  return (
    <Popover>
      <div className="flex items-center gap-1.5">
        <Label className="text-xs text-muted-foreground hidden sm:inline">{label}</Label>
        <Input
          className="h-9 w-32 font-mono text-xs"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => {
            const parsed = parse(text, "dd-MM-yyyy", new Date());
            if (!isNaN(parsed.getTime())) onChange(parsed);
            else setText(format(value, "dd-MM-yyyy"));
          }}
          placeholder="DD-MM-YYYY"
        />
        <PopoverTrigger asChild>
          <Button size="icon" variant="outline" className="h-9 w-9">
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => d && onChange(d)}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}

type CreatorAppRow = {
  id: string;
  user_id: string;
  motivation: string;
  portfolio_url: string | null;
  expertise: string | null;
  status: string;
  created_at: string;
};
type UserLite = { id: string; email: string; full_name: string | null };

function ApprovalsSection({
  creatorApps,
  appsLoading,
  userMap,
  adminId,
  onChanged,
}: {
  creatorApps: CreatorAppRow[];
  appsLoading: boolean;
  userMap: Map<string, UserLite>;
  adminId: string;
  onChanged: () => void;
}) {
  const pendingApps = creatorApps.filter((a) => a.status === "pending");

  async function decideApp(a: CreatorAppRow, approve: boolean) {
    const status = approve ? "approved" : "rejected";
    const { error } = await supabase.from("creator_applications").update({ status }).eq("id", a.id);
    if (error) return toast.error(error.message);
    if (approve) {
      await supabase.from("user_roles").insert({ user_id: a.user_id, role: "creator" });
    }
    await supabase.from("notifications").insert({
      user_id: a.user_id,
      title: approve ? "Creator application approved" : "Creator application rejected",
      body: approve
        ? "You can now publish courses from Creator Studio."
        : "Your application wasn't accepted this time.",
      type: approve ? "success" : "info",
    });
    toast.success(approve ? "Creator approved" : "Application rejected");
    onChanged();
  }

  const fmtUser = (id: string) => {
    const u = userMap.get(id);
    return u?.full_name || u?.email || id.slice(0, 8);
  };

  return (
    <div className="mt-8 rounded-2xl border bg-card shadow-card overflow-hidden">
      {/* Manual top-ups note */}
      <div className="px-6 py-4 border-b flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center shrink-0">
          <Wallet className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">Wallet top-ups</p>
          <p className="text-xs text-muted-foreground">
            Manual top-ups discontinued. All top-ups are processed instantly via Cashfree.
          </p>
        </div>
      </div>

      {/* Creator applications */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">Creator applications</h2>
          <p className="text-xs text-muted-foreground">
            {pendingApps.length} pending · {creatorApps.length} total
          </p>
        </div>
        <Badge variant={pendingApps.length ? "default" : "secondary"} className="text-[10px]">
          {pendingApps.length} to review
        </Badge>
      </div>
      {appsLoading ? (
        <div className="p-8 grid place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : creatorApps.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">No applications yet.</div>
      ) : (
        <ul className="divide-y">
          {creatorApps.slice(0, 20).map((a) => (
            <li key={a.id} className="px-6 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{fmtUser(a.user_id)}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.expertise ?? "—"} · {format(new Date(a.created_at), "dd-MM-yyyy")}
                  </div>
                </div>
                {a.status === "pending" ? (
                  <div className="flex items-center gap-1 shrink-0">
                    <Button size="sm" onClick={() => decideApp(a, true)}>
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => decideApp(a, false)}>
                      Reject
                    </Button>
                  </div>
                ) : (
                  <Badge
                    variant={a.status === "approved" ? "default" : "secondary"}
                    className="text-[10px] capitalize"
                  >
                    {a.status}
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{a.motivation}</p>
              {a.portfolio_url && (
                <a
                  href={a.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary underline"
                >
                  {a.portfolio_url}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AiCostPanel({
  rows,
  loading,
  rangeLabel,
}: {
  rows: {
    model: string;
    cost_usd: number;
    cost_inr: number;
    total_tokens: number;
    created_at: string;
  }[];
  loading: boolean;
  rangeLabel: string;
}) {
  const totalUsd = rows.reduce((s, r) => s + Number(r.cost_usd), 0);
  const totalInr = rows.reduce((s, r) => s + Number(r.cost_inr), 0);
  const totalTokens = rows.reduce((s, r) => s + Number(r.total_tokens), 0);
  const byModel = new Map<string, { usd: number; inr: number; tokens: number; calls: number }>();
  for (const r of rows) {
    const k = r.model;
    const cur = byModel.get(k) ?? { usd: 0, inr: 0, tokens: 0, calls: 0 };
    cur.usd += Number(r.cost_usd);
    cur.inr += Number(r.cost_inr);
    cur.tokens += Number(r.total_tokens);
    cur.calls += 1;
    byModel.set(k, cur);
  }
  const modelRows = Array.from(byModel, ([model, v]) => ({ model, ...v })).sort(
    (a, b) => b.usd - a.usd,
  );

  return (
    <div className="mt-6 rounded-2xl border bg-card shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <ActivityIcon className="h-4 w-4 text-primary" /> AI cost (real-time)
          </h2>
          <p className="text-xs text-muted-foreground">
            {rangeLabel} · {rows.length.toLocaleString("en-IN")} requests
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
        </Badge>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        <Metric label="Total cost (USD)" value={`$${totalUsd.toFixed(4)}`} />
        <Metric label="Total cost (INR)" value={`₹${totalInr.toFixed(2)}`} />
        <Metric label="Total tokens" value={totalTokens.toLocaleString("en-IN")} />
        <Metric label="Requests" value={rows.length.toLocaleString("en-IN")} />
      </div>
      {loading ? (
        <div className="p-8 grid place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : modelRows.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          No AI usage in this range yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Model</th>
                <th className="text-right px-6 py-3 font-medium">Calls</th>
                <th className="text-right px-6 py-3 font-medium">Tokens</th>
                <th className="text-right px-6 py-3 font-medium">Cost (USD)</th>
                <th className="text-right px-6 py-3 font-medium">Cost (INR)</th>
              </tr>
            </thead>
            <tbody>
              {modelRows.map((r) => (
                <tr key={r.model} className="border-t hover:bg-accent/30">
                  <td className="px-6 py-3 font-mono text-xs">{r.model}</td>
                  <td className="px-6 py-3 text-right">{r.calls.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-3 text-right">{r.tokens.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-3 text-right">${r.usd.toFixed(4)}</td>
                  <td className="px-6 py-3 text-right font-medium">₹{r.inr.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background/40 p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-display font-semibold">{value}</div>
    </div>
  );
}

type WithdrawalRow = {
  id: string;
  user_id: string;
  amount_inr: number;
  method: string;
  destination: any;
  status: string;
  admin_notes: string | null;
  created_at: string;
  processed_at: string | null;
};

function WithdrawalsSection({
  withdrawals,
  isLoading,
  userMap,
  adminId,
  onChanged,
}: {
  withdrawals: WithdrawalRow[];
  isLoading: boolean;
  userMap: Map<string, UserLite>;
  adminId: string;
  onChanged: () => void;
}) {
  const pending = withdrawals.filter((w) => w.status === "pending");
  const fmtUser = (id: string) => {
    const u = userMap.get(id);
    return u?.full_name || u?.email || id.slice(0, 8);
  };

  async function approve(w: WithdrawalRow) {
    const { error } = await supabase
      .from("creator_withdrawals")
      .update({
        status: "paid",
        processed_at: new Date().toISOString(),
        processed_by: adminId,
        admin_notes: "Processed via Cashfree Payouts",
      })
      .eq("id", w.id);
    if (error) return toast.error(error.message);
    await supabase.from("notifications").insert({
      user_id: w.user_id,
      title: "Withdrawal paid",
      body: `₹${w.amount_inr} withdrawal via ${w.method} has been processed (Cashfree Payouts).`,
      type: "success",
    });
    toast.success("Withdrawal marked as paid");
    onChanged();
  }

  async function reject(w: WithdrawalRow) {
    const notes = window.prompt("Rejection reason (optional):") ?? "";
    const { error } = await supabase
      .from("creator_withdrawals")
      .update({
        status: "rejected",
        admin_notes: notes || null,
        processed_at: new Date().toISOString(),
        processed_by: adminId,
      })
      .eq("id", w.id);
    if (error) return toast.error(error.message);
    await supabase.from("notifications").insert({
      user_id: w.user_id,
      title: "Withdrawal rejected",
      body: notes ? `Reason: ${notes}` : "Your withdrawal request was rejected.",
      type: "warning",
    });
    toast.success("Rejected");
    onChanged();
  }

  async function editDestination(w: WithdrawalRow) {
    const current = formatDest(w);
    const next = window.prompt("Edit payout destination (admin only):", current);
    if (next == null) return;
    const merged = { ...(w.destination ?? {}), details: next.trim(), edited_by_admin: true };
    const { error } = await supabase
      .from("creator_withdrawals")
      .update({ destination: merged })
      .eq("id", w.id);
    if (error) return toast.error(error.message);
    toast.success("Destination updated");
    onChanged();
  }

  return (
    <div className="mt-8 rounded-2xl border bg-card shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">Creator withdrawals · Payouts</h2>
          <p className="text-xs text-muted-foreground">
            {pending.length} pending · {withdrawals.length} total · Wallet debited upfront via
            Cashfree Payouts
          </p>
        </div>
        <Badge variant={pending.length ? "default" : "secondary"} className="text-[10px]">
          {pending.length} to process
        </Badge>
      </div>
      {isLoading ? (
        <div className="p-8 grid place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : withdrawals.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          No withdrawal requests yet.
        </div>
      ) : (
        <ul className="divide-y">
          {withdrawals.slice(0, 30).map((w) => (
            <li key={w.id} className="px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">
                  {inr(Number(w.amount_inr))} · {fmtUser(w.user_id)}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  <span className="uppercase font-medium text-foreground">{w.method}</span> ·{" "}
                  {formatDest(w) || "—"} · {format(new Date(w.created_at), "dd-MM-yyyy HH:mm")}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {w.status === "pending" ? (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => editDestination(w)}>
                      Edit
                    </Button>
                    <Button size="sm" onClick={() => approve(w)}>
                      Approve & pay
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => reject(w)}>
                      Reject
                    </Button>
                  </>
                ) : (
                  <Badge
                    variant={
                      w.status === "paid"
                        ? "default"
                        : w.status === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                    className="text-[10px] capitalize"
                  >
                    {w.status}
                  </Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatDest(w: WithdrawalRow): string {
  const d = w.destination ?? {};
  if (d.details) return String(d.details);
  const saved = d.saved ?? {};
  if (w.method === "upi") return saved.upi_id ?? "";
  if (w.method === "bank")
    return [saved.account_name, saved.account_number, saved.ifsc].filter(Boolean).join(" · ");
  return "";
}

// ─── Email Templates Panel ────────────────────────────────────────────────────
function EmailTemplatesPanel() {
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
  const [selected, setSelected] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editHtml, setEditHtml] = useState("");
  const [editName, setEditName] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    listFn({})
      .then((data: any) => {
        setTemplates((data ?? []) as TemplateRow[]);
        setLoading(false);
        if (data?.length) selectTemplate(data[0].id);
      })
      .catch(() => setLoading(false));
  }, []);

  async function selectTemplate(id: string) {
    setSelected(id);
    setPreview(false);
    const tpl = (await getFn({ data: { id } })) as any;
    if (tpl) {
      setEditName(tpl.name);
      setEditSubject(tpl.subject);
      setEditHtml(tpl.html_body);
    }
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    try {
      await saveFn({
        data: { id: selected, name: editName, subject: editSubject, html_body: editHtml },
      });
      toast.success("Template saved!");
      const updated = (await listFn({})) as any;
      setTemplates((updated ?? []) as TemplateRow[]);
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    if (!selected || !testEmail) return;
    setTesting(true);
    try {
      const res = await testFn({ data: { templateId: selected, to: testEmail } });
      toast.success(`Test email sent via ${res.provider}!`);
    } catch (e: any) {
      toast.error(e?.message ?? "Send failed");
    } finally {
      setTesting(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="flex h-full">
      {/* Sidebar: template list */}
      <div className="w-56 shrink-0 border-r overflow-y-auto">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => selectTemplate(tpl.id)}
            className={cn(
              "w-full text-left px-4 py-3 border-b text-sm transition-colors hover:bg-muted/50",
              selected === tpl.id &&
                "bg-primary/10 text-primary font-medium border-l-2 border-l-primary",
            )}
          >
            <div className="font-medium truncate">{tpl.name}</div>
            <div className="text-xs text-muted-foreground mt-0.5 truncate">{tpl.id}</div>
          </button>
        ))}
      </div>

      {/* Editor area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {selected ? (
          <>
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b shrink-0 flex-wrap">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium truncate">{editName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={preview ? "default" : "outline"}
                  onClick={() => setPreview((v) => !v)}
                >
                  <Eye className="h-4 w-4" />
                  {preview ? "Edit" : "Preview"}
                </Button>
                <div className="flex items-center gap-1.5">
                  <Input
                    placeholder="test@email.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="h-8 text-xs w-40"
                    type="email"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleTest}
                    disabled={testing || !testEmail}
                  >
                    {testing ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    Send Test
                  </Button>
                </div>
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save
                </Button>
              </div>
            </div>

            {/* Subject */}
            <div className="px-4 py-3 border-b shrink-0">
              <Label className="text-xs text-muted-foreground mb-1 block">Subject line</Label>
              <Input
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                className="font-mono text-sm"
                placeholder="Email subject..."
              />
            </div>

            {/* HTML Editor or Preview */}
            <div className="flex-1 overflow-auto">
              {preview ? (
                <div className="w-full h-full">
                  <iframe
                    srcDoc={editHtml}
                    title="Email Preview"
                    className="w-full h-full border-0"
                    sandbox="allow-same-origin"
                  />
                </div>
              ) : (
                <Textarea
                  value={editHtml}
                  onChange={(e) => setEditHtml(e.target.value)}
                  className="h-full w-full resize-none rounded-none border-0 font-mono text-xs p-4 focus-visible:ring-0"
                  placeholder="HTML email body..."
                />
              )}
            </div>

            {/* Variables hint */}
            {!preview && (
              <div className="px-4 py-2 border-t bg-muted/30 shrink-0">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Variables:</span> Use{" "}
                  {(templates.find((t) => t.id === selected)?.variables ?? []).map((v) => (
                    <code
                      key={v}
                      className="text-xs bg-primary/10 text-primary px-1 py-0.5 rounded mx-0.5"
                    >
                      {"{{" + v + "}}"}
                    </code>
                  ))}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a template to edit
          </div>
        )}
      </div>
    </div>
  );
}
