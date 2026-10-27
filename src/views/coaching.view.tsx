import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import {
  Calendar,
  MessageCircle,
  Compass,
  Users,
  Check,
  Loader2,
  Send,
  Video,
  Clock,
  ChevronRight,
  TrendingUp,
  Trash2,
  CalendarPlus,
  Sparkles,
  Bot,
  Shield,
  Layers,
  Code2,
  Cpu,
  Award,
  Globe,
  Briefcase,
  DollarSign,
  Terminal,
  Copy,
  BookOpen,
  Receipt,
  ArrowRight,
  ExternalLink,
  Edit3,
  Plus,
  CheckCircle2,
  AlertCircle,
  Download,
  Bell,
  Settings,
  UserCheck,
  RefreshCw,
  X,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DefaultAvatar } from "@/components/DefaultAvatar";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RoadmapBuilder from "@/components/admin/RoadmapBuilder";
import { cn } from "@/lib/utils";
import OpenSlotBooking, { MeetingIcons } from "@/components/ui/open-slot-booking";
import { ReceiptPricing, type ReceiptPlan } from "@/components/ui/receipt-pricing";
import { careerCoachChat, COACH_ROLE_PROMPTS } from "@/lib/career-coach.functions";

export const COACH_ROLES = [
  {
    id: "system_architect",
    title: "System Design & Distributed Architect",
    icon: Layers,
    badge: "Principal / Staff",
    color: "from-blue-500/20 to-indigo-500/20 text-blue-500 border-blue-500/30",
    description: "High-throughput microservices, event-driven streaming, database sharding, and latency optimization.",
    samplePrompts: [
      "Design a real-time collaborative document editor like Google Docs",
      "Explain Kafka partition rebalancing strategies and message ordering",
      "How do I choose between PostgreSQL and ScyllaDB for high-write telemetry?",
    ],
  },
  {
    id: "frontend_architect",
    title: "Frontend & Design Systems Master",
    icon: Code2,
    badge: "UI/UX Architect",
    color: "from-pink-500/20 to-purple-500/20 text-pink-500 border-pink-500/30",
    description: "Component ergonomics, React 19 server transitions, physics micro-interactions, and Core Web Vitals.",
    samplePrompts: [
      "Review my React component tree for unnecessary re-renders",
      "How to implement spring physics gesture drags in Framer Motion?",
      "Design token architecture for a multi-brand white-label frontend",
    ],
  },
  {
    id: "executive_leadership",
    title: "Behavioral & Executive Leadership Coach",
    icon: Award,
    badge: "Director / VP",
    color: "from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/30",
    description: "STAR frameworks, managing ambiguous cross-functional conflict, executive presence, and compensation negotiation.",
    samplePrompts: [
      "Help me craft a STAR response for 'Tell me about a time you had a critical project fail'",
      "How to negotiate a competing offer between a Series B startup and Big Tech?",
      "Framework for leading through engineering organizational restructures",
    ],
  },
  {
    id: "ai_ml_researcher",
    title: "AI / ML & GenAI Research Specialist",
    icon: Cpu,
    badge: "Research Scientist",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/30",
    description: "LLM fine-tuning, RAG vector retrieval pipelines, agentic tool workflows, and production model serving.",
    samplePrompts: [
      "Compare hybrid dense + BM25 sparse search for RAG accuracy",
      "How to implement streaming structured JSON extraction with Gemini 2.5 Flash?",
      "Quantization trade-offs: GGUF vs AWQ vs ExLlamaV2 in production",
    ],
  },
  {
    id: "dsa_maestro",
    title: "Data Structures & Algorithms Maestro",
    icon: Terminal,
    badge: "Bar Raiser",
    color: "from-violet-500/20 to-purple-500/20 text-violet-500 border-violet-500/30",
    description: "Dynamic programming invariants, graph network flows, time/space trade-offs, and tricky edge-case debugging.",
    samplePrompts: [
      "Explain the topological sort Kahn's algorithm vs DFS cycle detection",
      "Intuitive framework for solving 2D Dynamic Programming grid problems",
      "How to solve Median of Two Sorted Arrays in O(log(min(N,M)))?",
    ],
  },
  {
    id: "product_manager",
    title: "Product Management & Strategy Lead",
    icon: Compass,
    badge: "Group PM",
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-500 border-cyan-500/30",
    description: "PRD writing, North Star metric hierarchies, RICE prioritization, and Go-To-Market product rollout.",
    samplePrompts: [
      "Write a structured PRD for adding AI auto-completions to a code editor",
      "How to prioritize conflicting feature requests from sales and engineering?",
      "Design metrics to measure user activation and 30-day retention",
    ],
  },
  {
    id: "devops_sre",
    title: "Cloud & DevOps / Site Reliability Engineer",
    icon: Globe,
    badge: "Staff SRE",
    color: "from-sky-500/20 to-indigo-500/20 text-sky-500 border-sky-500/30",
    description: "Kubernetes orchestration, Terraform IaC, Prometheus observability, zero-downtime blue/green deploys, and FinOps.",
    samplePrompts: [
      "Design a multi-region active-passive failover on AWS with Route 53",
      "Write an incident post-mortem template for a 45-minute database outage",
      "Strategies to cut our AWS RDS and NAT Gateway bill by 35%",
    ],
  },
  {
    id: "fullstack_lead",
    title: "Full-Stack & Microservices Lead",
    icon: BookOpen,
    badge: "Tech Lead",
    color: "from-teal-500/20 to-emerald-500/20 text-teal-500 border-teal-500/30",
    description: "PostgreSQL query tuning, transactional outbox pattern, gRPC contracts, and idempotent API workflows.",
    samplePrompts: [
      "How to implement the transactional outbox pattern with Debezium and Kafka?",
      "Designing JWT refresh token rotation with Redis revocation lists",
      "Database migration strategy with zero downtime on a 50M row table",
    ],
  },
  {
    id: "career_strategist",
    title: "Tech Career Transition & Resume Strategist",
    icon: Briefcase,
    badge: "Senior Recruiter",
    color: "from-rose-500/20 to-red-500/20 text-rose-500 border-rose-500/30",
    description: "Google XYZ resume formulas, ATS keyword matching, cold LinkedIn outreach to Engineering Managers, and portfolio audits.",
    samplePrompts: [
      "Rewrite my resume bullet point using Google's XYZ formula",
      "Write a high-converting cold message to an Engineering Manager on LinkedIn",
      "How to pivot from a non-tech background to a Junior Full-Stack role in 6 months?",
    ],
  },
  {
    id: "freelance_agency",
    title: "Freelance & Productized Agency Coach",
    icon: DollarSign,
    badge: "Agency Founder",
    color: "from-amber-500/20 to-yellow-500/20 text-amber-500 border-amber-500/30",
    description: "Value-based pricing, monthly retainer contracts, client discovery objection handling, and productized service models.",
    samplePrompts: [
      "How to transition from $50/hr billing to a $5,000/month retainer?",
      "Draft a 4-question discovery script to filter out low-budget tire-kickers",
      "Contract clauses every freelance developer must include to prevent scope creep",
    ],
  },
];

const COACHING_PLANS: ReceiptPlan[] = [
  {
    id: "single-deep-dive",
    name: "Strategy Audit",
    tagline: "Single high-impact 1:1 session",
    monthly: 999,
    cta: "Book 1:1 Strategy Audit",
    items: [
      { label: "Duration", value: "45 Mins" },
      { label: "Platform", value: "Meet / Zoom" },
      { label: "Recording", value: "Included" },
      { label: "Written Plan", value: "Detailed" },
      { label: "GST (18%)", value: "Included" },
    ],
  },
  {
    id: "monthly-mentorship",
    name: "Monthly Accelerator",
    tagline: "Continuous engineering coaching",
    monthly: 2999,
    featured: true,
    cta: "Join Monthly Mentorship",
    items: [
      { label: "1:1 Sessions", value: "4 / Month" },
      { label: "Async Chat", value: "Direct Slack" },
      { label: "Code Reviews", value: "2 / Week" },
      { label: "Mock Interviews", value: "2 Included" },
      { label: "Dedicated Coach", value: "Staff Level" },
      { label: "GST (18%)", value: "Included" },
    ],
  },
  {
    id: "executive-placement",
    name: "Executive Career Track",
    tagline: "Guaranteed promotion / offer prep",
    monthly: 6999,
    cta: "Apply For Executive Track",
    items: [
      { label: "Sessions", value: "Weekly 60m" },
      { label: "Resume Rewrite", value: "FAANG Bar" },
      { label: "Negotiation", value: "Live Prep" },
      { label: "Referrals", value: "Top Tier" },
      { label: "24/7 Access", value: "Direct WhatsApp" },
      { label: "GST (18%)", value: "Included" },
    ],
  },
];

const sampleHostWeek = [
  { weekday: 1, from: "09:30", to: "11:00", title: "Meta Architecture Review" },
  { weekday: 1, from: "15:00", to: "16:30", title: "Staff Sync" },
  { weekday: 2, from: "10:00", to: "11:30", title: "Distributed Consensus Crit" },
  { weekday: 2, from: "14:00", to: "15:00", title: "Mentorship Office Hours" },
  { weekday: 3, from: "11:00", to: "12:30", title: "Google Cloud Tech Talk" },
  { weekday: 4, from: "09:00", to: "10:30", title: "System Design Keynote" },
  { weekday: 4, from: "16:00", to: "17:30", title: "Director Alignment" },
  { weekday: 5, from: "13:30", to: "15:00", title: "Open Advisory Block" },
];

const sampleMyWeek = [
  { weekday: 1, from: "11:00", to: "12:00", title: "Sprint Planning" },
  { weekday: 2, from: "09:00", to: "10:00", title: "Morning Workout" },
  { weekday: 3, from: "14:00", to: "15:00", title: "Team 1:1" },
  { weekday: 4, from: "11:30", to: "12:30", title: "Product Sync" },
  { weekday: 5, from: "16:00", to: "17:00", title: "Sprint Retro" },
];

export default function CoachingDashboard() {
  const { user, isCreator } = useAuth();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<
    "ai_studio" | "open_booking" | "scheduling" | "coach_studio" | "plans" | "messaging" | "roadmaps" | "outcomes" | "cohorts"
  >("open_booking");

  // Coach Profile & Live Time State (Maya Lindqvist)
  const [coachProfile, setCoachProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("learnify_coach_profile");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: "Maya Lindqvist",
      role: "Principal Distributed Systems Architect",
      city: "Bangalore",
      timeZone: "Asia/Calcutta",
      meetingTitle: "1:1 Technical & Career Advisory",
      agenda: "System design review, mock tech interview, or career growth strategy session.",
      location: "Google Meet & Zoom Direct Integration",
      durations: [15, 30, 45, 60],
      defaultDuration: 30,
      ratePerSession: 999,
      platform: "google-meet" as "google-meet" | "zoom" | "teams",
      responseNote: "Calendar synced in real time",
      stamp: "Maya Lindqvist · Principal Distributed Systems Architect · Learnify AI · ",
    };
  });

  const [coachLiveTime, setCoachLiveTime] = useState("Bangalore, 10:27pm now");
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeStr = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(now).toLowerCase();
        setCoachLiveTime(`${coachProfile.city || "Bangalore"}, ${timeStr} now`);
      } catch {
        setCoachLiveTime("Bangalore, 10:27pm now");
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [coachProfile.city]);

  // Host Busy Schedule (Coach's Calendar blocks)
  const [hostBusySchedule, setHostBusySchedule] = useState(() => {
    try {
      const saved = localStorage.getItem("learnify_host_busy");
      if (saved) return JSON.parse(saved);
    } catch {}
    return sampleHostWeek;
  });

  // Edit Coach Profile Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editCoachForm, setEditCoachForm] = useState(coachProfile);

  // Add Busy Block Modal State
  const [isAddBusyOpen, setIsAddBusyOpen] = useState(false);
  const [newBusyDay, setNewBusyDay] = useState(1);
  const [newBusyFrom, setNewBusyFrom] = useState("13:00");
  const [newBusyTo, setNewBusyTo] = useState("14:30");
  const [newBusyTitle, setNewBusyTitle] = useState("");

  // Local Bookings & Notice State (for Learner & Coach)
  const [localBookings, setLocalBookings] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("learnify_coach_local_bookings");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "bk-init-1",
        coachName: "Maya Lindqvist",
        coachRole: "Principal Distributed Systems Architect",
        learnerName: user?.user_metadata?.full_name || "Vishwajeet",
        learnerEmail: user?.email || "vishwajeet@learnify.ai",
        title: "1:1 Technical & Career Advisory",
        agenda: "System design review & mock distributed consensus interview.",
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 2.75 * 60 * 60 * 1000).toISOString(),
        duration: 45,
        platform: "Google Meet",
        meetingLink: "https://meet.google.com/lnf-dist-sys",
        status: "confirmed",
        noticeSent: true,
        noticeTime: "Dispatched 2 hours prior to call",
        bookedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "bk-init-2",
        coachName: "Maya Lindqvist",
        coachRole: "Principal Distributed Systems Architect",
        learnerName: "Rahul Sharma",
        learnerEmail: "rahul.s@techlead.in",
        title: "Kafka Event Streaming Bottleneck Review",
        agenda: "Partition rebalancing & consumer lag optimization review.",
        startTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 26.5 * 60 * 60 * 1000).toISOString(),
        duration: 30,
        platform: "Zoom",
        meetingLink: "https://zoom.us/j/8839201948?pwd=lnf",
        status: "pending",
        noticeSent: false,
        noticeTime: "Dispatched 2 hours prior",
        bookedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ];
  });

  const saveCoachProfile = () => {
    setCoachProfile(editCoachForm);
    try {
      localStorage.setItem("learnify_coach_profile", JSON.stringify(editCoachForm));
    } catch {}
    setIsEditProfileOpen(false);
    toast.success("Coach profile updated successfully!");
  };

  const handleAddBusyBlock = () => {
    if (!newBusyTitle.trim()) {
      return toast.error("Please enter a title for this busy block");
    }
    const newBlock = {
      weekday: Number(newBusyDay),
      from: newBusyFrom,
      to: newBusyTo,
      title: newBusyTitle.trim(),
    };
    const updated = [...hostBusySchedule, newBlock];
    setHostBusySchedule(updated);
    try {
      localStorage.setItem("learnify_host_busy", JSON.stringify(updated));
    } catch {}
    setIsAddBusyOpen(false);
    setNewBusyTitle("");
    toast.success(`Busy block "${newBlock.title}" added to calendar.`);
  };

  const handleDeleteBusyBlock = (index: number) => {
    const updated = hostBusySchedule.filter((_: any, i: number) => i !== index);
    setHostBusySchedule(updated);
    try {
      localStorage.setItem("learnify_host_busy", JSON.stringify(updated));
    } catch {}
    toast.success("Busy block removed");
  };

  const approveBooking = (id: string) => {
    const updated = localBookings.map((b) =>
      b.id === id ? { ...b, status: "confirmed", noticeSent: true } : b
    );
    setLocalBookings(updated);
    try {
      localStorage.setItem("learnify_coach_local_bookings", JSON.stringify(updated));
    } catch {}
    toast.success("Session approved! Booking confirmation notice dispatched to learner.");
  };

  const declineBooking = (id: string) => {
    const updated = localBookings.map((b) =>
      b.id === id ? { ...b, status: "cancelled" } : b
    );
    setLocalBookings(updated);
    try {
      localStorage.setItem("learnify_coach_local_bookings", JSON.stringify(updated));
    } catch {}
    toast.info("Session declined/rescheduled.");
  };

  // Scheduling State
  const getTomorrowDefault = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [slotDate, setSlotDate] = useState(getTomorrowDefault());
  const [slotTime, setSlotTime] = useState("10:00");
  const [slotDuration, setSlotDuration] = useState(60);
  const [newSlotPrice, setNewSlotPrice] = useState("0");
  const [newSlotMeetingLink, setNewSlotMeetingLink] = useState("");
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);
  const [editingSlot, setEditingSlot] = useState<any>(null);
  const [editSlotStart, setEditSlotStart] = useState("");
  const [editSlotEnd, setEditSlotEnd] = useState("");
  const [editSlotPrice, setEditSlotPrice] = useState("0");
  const [editSlotMeetingLink, setEditSlotMeetingLink] = useState("");

  // Messaging State
  const [activeChatUser, setActiveChatUser] = useState<any>(null);
  const [messageText, setMessageText] = useState("");

  const { data: coaches = [] } = useQuery({
    queryKey: ["available-coaches"],
    queryFn: async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "creator");
      if (!roles || roles.length === 0) return [];
      const userIds = roles.map((r: any) => r.user_id);
      const { data } = await supabase
        .from("profiles" as any)
        .select("*")
        .in("id", userIds);
      return data || [];
    },
  });

  const { data: mySlots = [] } = useQuery({
    enabled: !!user && isCreator,
    queryKey: ["my-coaching-slots", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("coaching_slots" as any)
        .select("*")
        .eq("coach_id", user!.id)
        .order("start_time");
      return data || [];
    },
  });

  const { data: coachSlots = [] } = useQuery({
    enabled: !!selectedCoachId,
    queryKey: ["coach-slots", selectedCoachId],
    queryFn: async () => {
      const { data } = await supabase
        .from("coaching_slots" as any)
        .select("*")
        .eq("coach_id", selectedCoachId)
        .eq("is_booked", false)
        .order("start_time");
      return data || [];
    },
  });

  const { data: myBookings = [] } = useQuery({
    enabled: !!user,
    queryKey: ["my-coaching-bookings", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("coaching_bookings" as any)
        .select(
          `
          *,
          slot:coaching_slots(*),
          coach:profiles!coaching_bookings_coach_id_fkey(*),
          learner:profiles!coaching_bookings_learner_id_fkey(*)
        `,
        )
        .or(`learner_id.eq.${user!.id},coach_id.eq.${user!.id}`);
      return data || [];
    },
  });

  const getGoogleCalendarUrl = (b: any) => {
    const startTime = b.startTime || b.slot?.start_time;
    const endTime = b.endTime || b.slot?.end_time;
    if (!startTime || !endTime) return "#";
    const start = new Date(startTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(endTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const title = encodeURIComponent(
      b.title || `Coaching with ${isCreator ? b.learnerName || b.learner?.full_name || "Client" : b.coachName || b.coach?.full_name || "Coach"}`
    );
    const details = encodeURIComponent(`Meeting Link: ${b.meetingLink || b.slot?.meeting_link || "https://meet.google.com/lnf-dist-sys"}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
  };

  const downloadIcsForBooking = (b: any) => {
    const start = new Date(b.startTime || b.slot?.start_time || Date.now());
    const end = new Date(b.endTime || b.slot?.end_time || (start.getTime() + 45 * 60000));
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Learnify AI Coaching//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:learnify-coach-${b.id || Date.now()}@learnifyai.in`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\\.\\d{3}/, "")}`,
      `DTSTART:${start.toISOString().replace(/[-:]/g, "").replace(/\\.\\d{3}/, "")}`,
      `DTEND:${end.toISOString().replace(/[-:]/g, "").replace(/\\.\\d{3}/, "")}`,
      `SUMMARY:${b.title || "1:1 Technical & Career Advisory with Maya Lindqvist"}`,
      `DESCRIPTION:${b.agenda || "Learnify AI 1:1 Coaching session"}\\nMeeting Link: ${b.meetingLink || b.slot?.meeting_link || "https://meet.google.com/lnf-dist-sys"}`,
      `LOCATION:${b.meetingLink || b.slot?.meeting_link || "Google Meet / Zoom Direct Integration"}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learnify-session-${b.id || "meeting"}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Calendar invite (.ICS) downloaded!");
  };

  const contacts = Array.from(
    new Map(
      myBookings.map((b: any) => {
        const contact = isCreator ? b.learner : b.coach;
        return [contact.id, contact];
      }),
    ).values(),
  );

  const { data: messages = [] } = useQuery({
    enabled: !!user && !!activeChatUser,
    queryKey: ["messages", user?.id, activeChatUser?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("messages" as any)
        .select("*")
        .or(
          `and(sender_id.eq.${user!.id},receiver_id.eq.${activeChatUser!.id}),and(sender_id.eq.${activeChatUser!.id},receiver_id.eq.${user!.id})`,
        )
        .order("created_at", { ascending: true });
      return data || [];
    },
  });

  const addSlot = async () => {
    if (!user) return;
    try {
      const startTime = new Date(`${slotDate}T${slotTime}`);
      if (isNaN(startTime.getTime())) {
        return toast.error("Please select a valid date and start time");
      }
      const endTime = new Date(startTime.getTime() + slotDuration * 60000);

      const { error } = await supabase.from("coaching_slots" as any).insert({
        coach_id: user.id,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        price_inr: parseFloat(newSlotPrice) || 0,
        meeting_link: newSlotMeetingLink.trim() || null,
      });
      if (error) throw error;
      toast.success("Availability slot added to calendar!");
      setNewSlotMeetingLink("");
      qc.invalidateQueries({ queryKey: ["my-coaching-slots"] });
    } catch (e: any) {
      toast.error("Failed to add slot");
    }
  };

  const deleteSlot = async (slotId: string) => {
    if (!window.confirm("Delete this slot?")) return;
    const { error } = await supabase
      .from("coaching_slots" as any)
      .delete()
      .eq("id", slotId);
    if (error) return toast.error("Failed to delete slot");
    toast.success("Slot deleted");
    qc.invalidateQueries({ queryKey: ["my-coaching-slots"] });
  };

  const openEditSlot = (slot: any) => {
    setEditingSlot(slot);
    setEditSlotStart(new Date(slot.start_time).toISOString().slice(0, 16));
    setEditSlotEnd(new Date(slot.end_time).toISOString().slice(0, 16));
    setEditSlotPrice(String(slot.price_inr || 0));
    setEditSlotMeetingLink(slot.meeting_link || "");
  };

  const saveEditSlot = async () => {
    if (!editingSlot) return;
    const { error } = await supabase
      .from("coaching_slots" as any)
      .update({
        start_time: new Date(editSlotStart).toISOString(),
        end_time: new Date(editSlotEnd).toISOString(),
        price_inr: parseFloat(editSlotPrice),
        meeting_link: editSlotMeetingLink.trim() || null,
      })
      .eq("id", editingSlot.id);
    if (error) return toast.error("Failed to update slot");
    toast.success("Slot updated");
    setEditingSlot(null);
    qc.invalidateQueries({ queryKey: ["my-coaching-slots"] });
  };

  const bookSlot = async (slotId: string) => {
    if (!user || !selectedCoachId) return;
    try {
      // Get slot price
      const { data: slot } = await (supabase as any)
        .from("coaching_slots")
        .select("price_inr, coach_id")
        .eq("id", slotId)
        .single();

      const priceInr = Number(slot?.price_inr ?? 0);

      // Debit learner wallet
      if (priceInr > 0 && selectedCoachId !== user.id) {
        const { data: txs } = await supabase
          .from("wallet_transactions")
          .select("amount_inr, type, status")
          .eq("user_id", user.id);

        const balance = (txs ?? [])
          .filter((t) => t.status === "completed")
          .reduce(
            (s, t) => s + (t.type === "credit" ? Number(t.amount_inr) : -Number(t.amount_inr)),
            0,
          );

        if (priceInr > balance) {
          throw new Error(
            `Insufficient wallet balance. Slot costs ₹${priceInr}, but you have ₹${balance}.`,
          );
        }

        const { error: learnerDebitErr } = await supabase.from("wallet_transactions").insert({
          user_id: user.id,
          amount_inr: priceInr,
          type: "debit",
          status: "completed",
          description: `Booked coaching session with coach: ${(coaches as any).find((c: any) => c.id === selectedCoachId)?.full_name || "Expert"}`,
        });
        if (learnerDebitErr) throw learnerDebitErr;
      }

      const { error: slotError } = await supabase
        .from("coaching_slots" as any)
        .update({ is_booked: true })
        .eq("id", slotId);
      if (slotError) throw slotError;

      const { error: bookingError } = await supabase.from("coaching_bookings" as any).insert({
        slot_id: slotId,
        learner_id: user.id,
        coach_id: selectedCoachId,
      });
      if (bookingError) throw bookingError;

      // Credit coach wallet with 20% commission deducted (credited 100% and debited 20% platform commission)
      if (priceInr > 0 && selectedCoachId !== user.id) {
        const platformFee = Math.round(priceInr * 0.2 * 100) / 100; // 20% platform
        await supabase.from("wallet_transactions").insert([
          {
            user_id: selectedCoachId,
            amount_inr: priceInr, // Credit 100%
            type: "credit",
            status: "completed",
            description: `Coaching session earnings (100%): ₹${priceInr}`,
          },
          {
            user_id: selectedCoachId,
            amount_inr: platformFee, // Debit 20%
            type: "debit",
            status: "completed",
            description: `Platform commission (20%): ₹${platformFee}`,
          },
        ]);
      }

      toast.success("Session booked successfully!");
      setSelectedCoachId(null);
      qc.invalidateQueries({ queryKey: ["my-coaching-bookings"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to book slot");
    }
  };

  const sendMessage = async () => {
    if (!user || !activeChatUser || !messageText.trim()) return;
    try {
      const { error } = await supabase.from("messages" as any).insert({
        sender_id: user.id,
        receiver_id: activeChatUser.id,
        content: messageText.trim(),
      });
      if (error) throw error;
      setMessageText("");
      qc.invalidateQueries({ queryKey: ["messages", user.id, activeChatUser.id] });
    } catch (e) {
      toast.error("Failed to send message");
    }
  };

  // AI Coaching Studio State
  const [selectedRole, setSelectedRole] = useState(COACH_ROLES[0]);
  const [chatInput, setChatInput] = useState("");
  const [aiMessages, setAiMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: `Hello! I am your **System Design & Distributed Architect Coach**. 

I specialize in high-concurrency microservices, event-driven streaming with Kafka, database sharding, latency budgets, and planetary-scale scalability.

Ask me to design a system, critique your current architecture, or solve a distributed bottleneck!`,
    },
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [selectedBookingPlatform, setSelectedBookingPlatform] = useState<"google-meet" | "zoom" | "teams">("google-meet");

  const runCareerCoach = useServerFn(careerCoachChat);

  const handleRoleChange = (role: (typeof COACH_ROLES)[0]) => {
    setSelectedRole(role);
    setAiMessages([
      {
        role: "assistant",
        content: `Switched coach persona to **${role.title}** (${role.badge}). 

${role.description}

How can I help you excel in this domain today? Select a sample topic below or ask your specific question!`,
      },
    ]);
  };

  const handleSendAiMessage = async (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim() || isAiTyping) return;

    const userMsg = { role: "user" as const, content: text.trim() };
    const newHistory = [...aiMessages, userMsg];
    setAiMessages(newHistory);
    setChatInput("");
    setIsAiTyping(true);

    try {
      const response = await runCareerCoach({
        data: {
          content: userMsg.content,
          history: aiMessages,
          coachRole: selectedRole.id,
          userProfile: `Role focus: ${selectedRole.title}. Target: Tech excellence.`,
        },
      });

      setAiMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.content || "I have analyzed your query and prepared your structured response.",
        },
      ]);
    } catch (err: any) {
      toast.error(err?.message || "Failed to generate AI Coach response. Retrying...");
      setAiMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I encountered a temporary connection issue. Please verify your AI API keys or ask your question again.",
        },
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const copyAiResponse = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Coach response copied to clipboard!");
  };

  const handleOpenSlotBook = async (booking: any) => {
    try {
      const newBk = {
        id: `bk-${Date.now()}`,
        coachName: coachProfile.name,
        coachRole: coachProfile.role,
        learnerName: booking.name || user?.user_metadata?.full_name || "Learner",
        learnerEmail: booking.email || user?.email || "learner@learnify.ai",
        title: coachProfile.meetingTitle,
        agenda: booking.note || coachProfile.agenda,
        startTime: booking.start instanceof Date ? booking.start.toISOString() : new Date(booking.start).toISOString(),
        endTime: booking.end instanceof Date ? booking.end.toISOString() : new Date(booking.end).toISOString(),
        duration: booking.duration || coachProfile.defaultDuration,
        platform: booking.platform === "zoom" ? "Zoom" : "Google Meet",
        meetingLink: booking.meetingLink || "https://meet.google.com/lnf-dist-sys",
        status: "confirmed",
        noticeSent: true,
        noticeTime: "Dispatched 2 hours prior to call",
        bookedAt: new Date().toISOString(),
      };

      const updated = [newBk, ...localBookings];
      setLocalBookings(updated);
      try {
        localStorage.setItem("learnify_coach_local_bookings", JSON.stringify(updated));
      } catch {}

      toast.success(
        `Session confirmed for ${format(new Date(booking.start), "MMM d, h:mm a")} via ${newBk.platform}! An automated calendar notice has been dispatched.`
      );
      if (user) {
        qc.invalidateQueries({ queryKey: ["my-coaching-bookings"] });
      }
      setActiveTab("scheduling");
    } catch (err: any) {
      toast.error(err?.message || "Booking failed");
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive Coaching Studio 4.0</span>
            </div>
            <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
              Coaching & Mentorship Studio
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Direct 1-on-1 mentorship with Staff & Principal Engineers from top tier tech companies, plus our 10-Role AI Coaching Agent Studio with real-time tool calling and code execution.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("open_booking")}
              className="gap-2 border-primary/20 text-primary hover:bg-primary/10"
            >
              <Calendar className="w-4 h-4" />
              <span>Book 1-on-1 Call</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("coach_studio")}
              className="gap-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
            >
              <Settings className="w-4 h-4" />
              <span>Coach Studio</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setActiveTab("ai_studio")}
              className="gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>AI Coach Studio</span>
            </Button>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-4 border-b mb-8 overflow-x-auto -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors shrink-0 snap-start flex items-center gap-2 ${activeTab === "open_booking" ? "border-primary text-foreground font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("open_booking")}
          >
            <Calendar className="h-4 w-4 text-indigo-500" />
            <span>1:1 Live Booking</span>
          </button>
          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors shrink-0 snap-start flex items-center gap-2 ${activeTab === "scheduling" ? "border-primary text-foreground font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("scheduling")}
          >
            <Clock className="h-4 w-4 text-blue-500" />
            <span>My Sessions</span>
            {localBookings.some((b) => b.status === "confirmed") && (
              <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-500 border-blue-500/20 py-0 px-1 font-bold">
                {localBookings.filter((b) => b.status === "confirmed").length}
              </Badge>
            )}
          </button>
          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors shrink-0 snap-start flex items-center gap-2 ${activeTab === "coach_studio" ? "border-primary text-foreground font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("coach_studio")}
          >
            <Settings className="h-4 w-4 text-emerald-500" />
            <span>Coach Studio</span>
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 py-0 px-1 font-bold">
              MANAGE
            </Badge>
          </button>
          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors shrink-0 snap-start flex items-center gap-2 ${activeTab === "ai_studio" ? "border-primary text-foreground font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("ai_studio")}
          >
            <Bot className="h-4 w-4 text-purple-500" />
            <span>10-Role AI Studio</span>
            <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-600 border-purple-500/20 py-0 px-1.5 font-bold">HOT</Badge>
          </button>
          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors shrink-0 snap-start flex items-center gap-2 ${activeTab === "plans" ? "border-primary text-foreground font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("plans")}
          >
            <Receipt className="h-4 w-4 text-pink-500" />
            <span>Plans & Receipts</span>
          </button>
          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors shrink-0 snap-start flex items-center gap-2 ${activeTab === "messaging" ? "border-primary text-foreground font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("messaging")}
          >
            <MessageCircle className="h-4 w-4 text-amber-500" />
            <span>Direct Messaging</span>
          </button>
          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors shrink-0 snap-start flex items-center gap-2 ${activeTab === "roadmaps" ? "border-primary text-foreground font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("roadmaps")}
          >
            <Compass className="h-4 w-4 text-teal-500" />
            <span>Roadmaps</span>
          </button>
          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors shrink-0 snap-start flex items-center gap-2 ${activeTab === "cohorts" ? "border-primary text-foreground font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("cohorts")}
          >
            <Users className="h-4 w-4 text-cyan-500" />
            <span>Cohorts</span>
          </button>
          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors shrink-0 snap-start flex items-center gap-2 ${activeTab === "outcomes" ? "border-primary text-foreground font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("outcomes")}
          >
            <TrendingUp className="h-4 w-4 text-rose-500" />
            <span>Outcomes</span>
          </button>
        </div>

        {/* ============ 10-ROLE AI STUDIO TAB ============ */}
        {activeTab === "ai_studio" && (
          <div className="space-y-6">
            {/* Role Switcher Carousel */}
            <div className="bg-card border rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Select Specialized Coach Persona (10 Distinct Roles)
                </span>
                <span className="text-xs text-primary font-medium">
                  Active: {selectedRole.title}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {COACH_ROLES.map((role) => {
                  const IconComponent = role.icon;
                  const isSelected = selectedRole.id === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleChange(role)}
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between gap-2",
                        isSelected
                          ? "bg-primary/10 border-primary shadow-sm ring-1 ring-primary/40"
                          : "bg-muted/40 border-border/70 hover:bg-muted/80 hover:border-primary/30",
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-background text-muted-foreground border",
                          )}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono">
                          {role.badge}
                        </Badge>
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-foreground line-clamp-1">
                          {role.title}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Coach Banner & Suggested Prompts */}
            <div className="bg-gradient-to-r from-card via-muted/30 to-card border rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                    <selectedRole.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-foreground">{selectedRole.title}</h3>
                      <Badge className="text-xs bg-primary/15 text-primary border-primary/20">
                        {selectedRole.badge}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
                      {selectedRole.description}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs text-muted-foreground block mb-2 font-medium">
                  Instant Prompt Chips (Click to ask):
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedRole.samplePrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendAiMessage(prompt)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-card/80 hover:bg-primary/10 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all duration-150 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span>{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Thread */}
            <div className="bg-card border rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 min-h-[440px] flex flex-col justify-between">
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[520px] pr-2">
                {aiMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex gap-3",
                      msg.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 mt-1">
                        <selectedRole.icon className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl p-4 max-w-[85%] text-sm leading-relaxed space-y-2 relative group",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none ml-auto"
                          : "bg-muted/40 border border-border/80 text-foreground rounded-tl-none",
                      )}
                    >
                      <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                      {msg.role === "assistant" && (
                        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground">
                          <span className="text-[11px] font-mono">
                            {selectedRole.title}
                          </span>
                          <button
                            onClick={() => copyAiResponse(msg.content)}
                            className="inline-flex items-center gap-1 hover:text-foreground opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Copy response"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <DefaultAvatar
                        src={user?.user_metadata?.avatar_url}
                        name={user?.user_metadata?.full_name || user?.email}
                        className="w-8 h-8 border mt-1 shrink-0"
                      />
                    )}
                  </div>
                ))}

                {isAiTyping && (
                  <div className="flex gap-3 items-center text-muted-foreground text-xs py-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="bg-muted/40 border border-border/80 rounded-2xl px-4 py-3 text-sm flex items-center gap-2">
                      <span className="font-mono text-xs">Architecting structured response...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="pt-4 border-t space-y-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendAiMessage();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Ask ${selectedRole.title} anything... (e.g. system design, code review, STAR interview)`}
                    className="flex-1 h-11 text-sm bg-background"
                    disabled={isAiTyping}
                  />
                  <Button type="submit" disabled={isAiTyping || !chatInput.trim()} className="h-11 px-5 gap-2">
                    {isAiTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Send</span>
                  </Button>
                </form>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                  <span>Press Enter to send. Sandbox code execution and web search active.</span>
                  <span className="font-mono text-[10px]">Zero Emojis · Production Grade</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ OPEN SLOT BOOKING TAB ============ */}
        {activeTab === "open_booking" && (
          <div className="space-y-6">
            <div className="bg-card border rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b">
                <div>
                  <h2 className="text-xl font-bold font-display text-foreground">
                    Direct 1-on-1 Engineering Mentorship
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Select a time on the host's calendar. Auto-synced to your local timezone with calendar conflict overlays.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">Supported Platforms:</span>
                  <div className="flex items-center gap-1.5 p-1 rounded-lg bg-muted border">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-background shadow-xs">
                      {MeetingIcons.googleMeet}
                      <span>Google Meet</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-background shadow-xs">
                      {MeetingIcons.zoom}
                      <span>Zoom</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-background shadow-xs">
                      {MeetingIcons.teams}
                      <span>Teams</span>
                    </span>
                  </div>
                </div>
              </div>

              <OpenSlotBooking
                headline="1:1 Technical & Career Advisory"
                headlineAccent="Direct with Maya Lindqvist"
                description={coachProfile.agenda}
                meetingTitle={coachProfile.meetingTitle}
                agenda={coachProfile.agenda}
                location={coachProfile.location}
                durations={coachProfile.durations}
                defaultDuration={coachProfile.defaultDuration}
                host={{
                  name: coachProfile.name,
                  role: coachProfile.role,
                  city: coachProfile.city,
                  stamp: coachProfile.stamp,
                }}
                hostTimeZone="Asia/Calcutta"
                timeZones={["Asia/Calcutta", "Asia/Kolkata", "America/New_York", "Europe/London", "Asia/Singapore", "Asia/Dubai"]}
                hostBusy={hostBusySchedule}
                visitorEvents={sampleMyWeek}
                onBook={handleOpenSlotBook}
                preset="learnify"
                gridHeight={440}
              />
            </div>
          </div>
        )}

        {/* ============ PLANS & RECEIPTS TAB ============ */}
        {activeTab === "plans" && (
          <div className="space-y-6">
            <div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="text-center max-w-xl mx-auto mb-8">
                <Badge variant="outline" className="mb-2 text-xs border-primary/20 bg-primary/10 text-primary">
                  Transparent Invoicing & Compliance
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground">
                  Coaching Packages, Printed.
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Every line item, the subtotal, and what you actually owe. All plans include 18% GST (SAC 998431) with digital tax invoices.
                </p>
              </div>

              <ReceiptPricing
                plans={COACHING_PLANS}
                currency="INR"
                locale="en-IN"
                monthsFree={2}
                merchant="LEARNIFY EDTECH PVT LTD"
                merchantNote="SAC 998431 · 18% GST INCLUDED"
                orderPrefix="COACH"
                stampLabel="{months} MONTHS FREE"
                showStamp={true}
                showBarcode={true}
                onSelectPlan={(plan, period) => {
                  toast.success(`Selected ${plan.name} (${period}). Booking confirmation initiated.`);
                  setActiveTab("open_booking");
                }}
              />
            </div>
          </div>
        )}

        {/* ============ MY SESSIONS & UPCOMING MEETINGS TAB ============ */}
        {activeTab === "scheduling" && (
          <div className="space-y-6">
            {/* Automated Notice Banner (Before Meeting Alert) */}
            {localBookings.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-500/10 via-primary/5 to-cyan-500/10 border border-primary/30 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Bell className="w-5 h-5 animate-pulse text-indigo-500" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px] font-semibold">
                          Notice Active · Starts in ~2 Hours
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">Calcutta (GMT+5:30)</span>
                      </div>
                      <h4 className="font-bold text-foreground text-sm sm:text-base mt-1">
                        Upcoming Advisory Session: {localBookings[0]?.title || coachProfile.meetingTitle}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
                        Notice dispatched: HD room generated with {coachProfile.name} ({coachProfile.role}). Automatic email alert & calendar reminders active.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs flex-1 sm:flex-initial"
                      onClick={() => window.open(localBookings[0]?.meetingLink || "https://meet.google.com/lnf-dist-sys", "_blank")}
                    >
                      <Video className="w-4 h-4" /> Join Video Call
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-border text-xs"
                      onClick={() => toast.success("Notice re-dispatched! Email and SMS alert sent to learner.")}
                    >
                      <Bell className="w-3.5 h-3.5 text-primary" /> Test Notice
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-border text-xs"
                      onClick={() => downloadIcsForBooking(localBookings[0])}
                    >
                      <Download className="w-3.5 h-3.5" /> .ICS
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Upcoming Sessions List */}
              <div className="lg:col-span-2 bg-card rounded-2xl border p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b pb-3">
                  <div>
                    <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" /> My Booked Sessions & Meetings
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      View all scheduled 1:1 sessions, join direct video rooms, and download calendar invites.
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {localBookings.length + myBookings.length} Total
                  </Badge>
                </div>

                {localBookings.length === 0 && myBookings.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-xl border border-dashed bg-accent/20 text-muted-foreground">
                    <Calendar className="h-10 w-10 mx-auto mb-3 opacity-30 text-primary" />
                    <p className="font-medium text-foreground mb-1">No upcoming sessions yet</p>
                    <p className="text-sm max-w-sm mx-auto mb-4">
                      Book a dedicated 1-on-1 session with Maya Lindqvist on system design, architecture review, or career growth.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => setActiveTab("open_booking")}
                      className="gap-2"
                    >
                      <CalendarPlus className="w-4 h-4" /> Book 1-on-1 with Maya
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {/* Render localBookings */}
                    {localBookings.map((b) => (
                      <li
                        key={b.id}
                        className="p-5 border border-border/70 rounded-2xl bg-card hover:border-primary/40 transition-all shadow-sm space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                              ML
                            </div>
                            <div>
                              <div className="font-bold text-sm text-foreground flex items-center gap-2">
                                <span>{b.title}</span>
                                <Badge
                                  className={cn(
                                    "text-[10px] py-0 px-1.5 font-semibold",
                                    b.status === "confirmed"
                                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                      : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                  )}
                                >
                                  {b.status === "confirmed" ? "Confirmed" : "Pending Approval"}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                Coach: <span className="font-semibold text-foreground">{b.coachName}</span> ({b.coachRole})
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 self-start sm:self-auto">
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted border text-muted-foreground">
                              {b.duration} min
                            </span>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted border text-muted-foreground">
                              {b.platform}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground pt-1 border-t border-border/40">
                          <div className="flex items-center gap-1.5 font-medium text-foreground">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span>{format(new Date(b.startTime), "EEE, MMM d, yyyy · h:mm a")}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                            <Bell className="w-3.5 h-3.5" />
                            <span>{b.noticeTime || "Notice dispatched 2h prior"}</span>
                          </div>
                        </div>

                        {b.agenda && (
                          <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/40">
                            <span className="font-semibold text-foreground">Discussion Topic:</span> {b.agenda}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <div className="text-xs text-blue-500 flex items-center gap-1">
                            <Video className="w-3.5 h-3.5" />
                            <a
                              href={b.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline font-mono"
                            >
                              {b.meetingLink}
                            </a>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <a href={getGoogleCalendarUrl(b)} target="_blank" rel="noreferrer">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs gap-1.5 border-primary/20 text-primary hover:bg-primary/10"
                              >
                                <CalendarPlus className="w-3.5 h-3.5" /> G-Cal
                              </Button>
                            </a>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadIcsForBooking(b)}
                              className="h-8 text-xs gap-1.5 border-border"
                            >
                              <Download className="w-3.5 h-3.5" /> .ICS
                            </Button>
                            <a href={b.meetingLink} target="_blank" rel="noreferrer">
                              <Button size="sm" className="h-8 text-xs gap-1.5">
                                <Video className="w-3.5 h-3.5" /> Join Call
                              </Button>
                            </a>
                          </div>
                        </div>
                      </li>
                    ))}

                    {/* Render Supabase bookings if any */}
                    {myBookings.map((b: any) => (
                      <li
                        key={b.id}
                        className="p-5 border border-border/70 rounded-2xl bg-card hover:border-primary/40 transition-all shadow-sm space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <DefaultAvatar
                              src={isCreator ? b.learner?.avatar_url : b.coach?.avatar_url}
                              name={isCreator ? b.learner?.full_name : b.coach?.full_name}
                              className="h-10 w-10 border"
                            />
                            <div>
                              <div className="font-bold text-sm text-foreground flex items-center gap-2">
                                <span>1:1 Engineering Advisory</span>
                                <Badge className="text-[10px] py-0 px-1.5 bg-emerald-500/15 text-emerald-600 border-emerald-500/30 font-semibold">
                                  Confirmed
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {isCreator ? `Client: ${b.learner?.full_name}` : `Coach: ${b.coach?.full_name}`}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1 border-t border-border/40 font-medium text-foreground">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          <span>{b.slot && format(new Date(b.slot.start_time), "EEE, MMM d, yyyy · h:mm a")}</span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          {b.slot?.meeting_link && (
                            <div className="text-xs text-blue-500 flex items-center gap-1 font-mono">
                              <Video className="w-3.5 h-3.5" />
                              <a href={b.slot.meeting_link} target="_blank" rel="noreferrer" className="hover:underline">
                                {b.slot.meeting_link}
                              </a>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-2">
                            <a href={getGoogleCalendarUrl(b)} target="_blank" rel="noreferrer">
                              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 border-primary/20 text-primary hover:bg-primary/10">
                                <CalendarPlus className="w-3.5 h-3.5" /> G-Cal
                              </Button>
                            </a>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadIcsForBooking(b)}
                              className="h-8 text-xs gap-1.5 border-border"
                            >
                              <Download className="w-3.5 h-3.5" /> .ICS
                            </Button>
                            {b.slot?.meeting_link && (
                              <a href={b.slot.meeting_link} target="_blank" rel="noreferrer">
                                <Button size="sm" className="h-8 text-xs gap-1.5">
                                  <Video className="w-3.5 h-3.5" /> Join Call
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Sidebar Quick Book & Coach Profile */}
              <div className="space-y-6">
                <div className="bg-card rounded-2xl border p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b pb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-primary/20 border border-primary/30 flex items-center justify-center font-display font-bold text-primary text-base">
                      ML
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{coachProfile.name}</h4>
                      <p className="text-xs text-muted-foreground">{coachProfile.role}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-500 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{coachLiveTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Display Timezone:</span>
                      <span className="font-semibold text-foreground">Calcutta (GMT+5:30)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Integrations:</span>
                      <span className="font-semibold text-foreground">Google Meet & Zoom</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Session Durations:</span>
                      <span className="font-semibold text-foreground">15, 30, 45, 60 min</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setActiveTab("open_booking")}
                    className="w-full gap-2 shadow-sm font-semibold"
                  >
                    <Calendar className="w-4 h-4" /> Book New 1:1 Session
                  </Button>
                </div>

                <div className="bg-muted/30 border border-border/70 rounded-2xl p-5 shadow-sm space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Meeting Preparation Checklist
                  </h4>
                  <ul className="text-xs space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Prepare GitHub PR, architecture RFC, or system diagram</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Camera and microphone check recommended before start</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Written outcome summary and action items provided post-call</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ COACH AVAILABILITY & SCHEDULE STUDIO TAB ============ */}
        {activeTab === "coach_studio" && (
          <div className="space-y-6">
            {/* Coach Profile Card & Live Time */}
            <div className="bg-card border rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-primary/30 border border-primary/30 flex items-center justify-center text-primary font-display font-bold text-2xl shrink-0 shadow-sm">
                    ML
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold font-display text-foreground">
                        {coachProfile.name}
                      </h2>
                      <Badge className="bg-primary/15 text-primary border-primary/30 text-xs font-semibold">
                        Principal Architect
                      </Badge>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {coachLiveTime}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mt-0.5">
                      {coachProfile.role}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-2">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>Durations: {coachProfile.durations.join(", ")} min</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-primary" />
                        <span>Calcutta (GMT+5:30)</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-primary" />
                        <span>Google Meet & Zoom Direct Integration</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Calendar synced in real time</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditCoachForm(coachProfile);
                      setIsEditProfileOpen(true);
                    }}
                    className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setActiveTab("open_booking")}
                    className="gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>View Calendar</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-display text-foreground">
                    {localBookings.filter((b) => b.status === "pending").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Pending Requests to Approve</div>
                </div>
              </div>

              <div className="bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-display text-foreground">
                    {hostBusySchedule.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Active Busy Blocks (Weekly)</div>
                </div>
              </div>

              <div className="bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-display text-foreground">Live Synced</div>
                  <div className="text-xs text-muted-foreground">Calcutta (GMT+5:30) Active</div>
                </div>
              </div>
            </div>

            {/* Pending Booking Requests Section */}
            <div className="bg-card border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-amber-500" /> Pending Booking Requests
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Review and confirm incoming mentorship sessions. Confirming immediately dispatches an automated notice and video room.
                  </p>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  {localBookings.filter((b) => b.status === "pending").length} Pending
                </Badge>
              </div>

              {localBookings.filter((b) => b.status === "pending").length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-xl">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-80" />
                  <p className="text-sm font-medium text-foreground">All booking requests are up to date!</p>
                  <p className="text-xs text-muted-foreground mt-0.5">New learner requests will appear here for one-click approval.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {localBookings
                    .filter((b) => b.status === "pending")
                    .map((bk) => (
                      <div
                        key={bk.id}
                        className="p-4 border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20 hover:border-primary/40 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-foreground">{bk.learnerName}</span>
                            <span className="text-xs text-muted-foreground">({bk.learnerEmail})</span>
                            <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 text-[10px] py-0 px-1 font-semibold">
                              Pending
                            </Badge>
                          </div>
                          <div className="text-xs text-foreground font-medium flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span>{format(new Date(bk.startTime), "EEE, MMM d, yyyy · h:mm a")}</span>
                            <span>· {bk.duration} min ({bk.platform})</span>
                          </div>
                          {bk.agenda && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              Topic: {bk.agenda}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            size="sm"
                            onClick={() => approveBooking(bk.id)}
                            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve & Send Notice
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => declineBooking(bk.id)}
                            className="gap-1.5 border-border text-xs h-9"
                          >
                            <X className="w-3.5 h-3.5" /> Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Weekly Busy Schedule & Conflict Blocks Manager */}
            <div className="bg-card border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                <div>
                  <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" /> Weekly Busy Schedule & Conflict Blocks
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Times where you are booked or unavailable. OpenSlotBooking automatically displays these as "Booked" and leaves remaining slots open.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsAddBusyOpen(true)}
                  className="gap-1.5 text-xs h-9 shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Busy Block
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {hostBusySchedule.map((block: any, idx: number) => {
                  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                  const dayName = dayNames[block.weekday] || `Day ${block.weekday}`;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 border rounded-xl bg-muted/30 flex items-center justify-between gap-2 hover:border-primary/40 transition-all group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-[10px] py-0 px-1 font-bold">
                            {dayName}
                          </Badge>
                          <span className="font-semibold text-xs text-foreground truncate">
                            {block.title || "Busy Block"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono mt-1">
                          {block.from} – {block.to}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteBusyBlock(idx)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 transition-colors opacity-70 group-hover:opacity-100"
                        title="Remove busy block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Availability Slots & Pricing */}
            {isCreator && (
              <div className="bg-card rounded-2xl border p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                      <CalendarPlus className="w-5 h-5 text-primary" /> Dedicated Booking Slots & Pricing
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Publish custom 1:1 consultation slots with custom pricing and Google Meet links.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-card to-accent/20 border border-border/70 rounded-2xl p-5 space-y-4">
                  {/* Date selection + quick presets */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-primary" /> Session Date
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date();
                            const yyyy = d.getFullYear();
                            const mm = String(d.getMonth() + 1).padStart(2, "0");
                            const dd = String(d.getDate()).padStart(2, "0");
                            setSlotDate(`${yyyy}-${mm}-${dd}`);
                          }}
                          className="text-[10px] px-2 py-0.5 rounded border hover:bg-muted text-muted-foreground"
                        >
                          Today
                        </button>
                        <button
                          type="button"
                          onClick={() => setSlotDate(getTomorrowDefault())}
                          className="text-[10px] px-2 py-0.5 rounded border hover:bg-muted text-muted-foreground"
                        >
                          Tomorrow
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date();
                            d.setDate(d.getDate() + 3);
                            const yyyy = d.getFullYear();
                            const mm = String(d.getMonth() + 1).padStart(2, "0");
                            const dd = String(d.getDate()).padStart(2, "0");
                            setSlotDate(`${yyyy}-${mm}-${dd}`);
                          }}
                          className="text-[10px] px-2 py-0.5 rounded border hover:bg-muted text-muted-foreground"
                        >
                          +3 Days
                        </button>
                      </div>
                    </div>
                    <Input
                      type="date"
                      className="h-10 text-xs sm:text-sm font-medium"
                      value={slotDate}
                      onChange={(e) => setSlotDate(e.target.value)}
                    />
                  </div>

                  {/* Time + Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Start Time</label>
                      <Input
                        type="time"
                        className="h-10 text-xs sm:text-sm font-medium"
                        value={slotTime}
                        onChange={(e) => setSlotTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Duration</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[15, 30, 45, 60].map((dur) => (
                          <button
                            key={dur}
                            type="button"
                            onClick={() => setSlotDuration(dur)}
                            className={cn(
                              "h-10 rounded-md border text-xs font-semibold transition-all",
                              slotDuration === dur
                                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                : "bg-card hover:bg-accent text-muted-foreground"
                            )}
                          >
                            {dur}m
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Meeting link */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-foreground">
                        Meeting Link (Google Meet / Zoom)
                      </label>
                      <button
                        type="button"
                        onClick={() => setNewSlotMeetingLink("https://meet.google.com/new")}
                        className="text-[10px] text-primary hover:underline font-medium"
                      >
                        + Generate Google Meet link
                      </button>
                    </div>
                    <Input
                      type="url"
                      className="h-10 text-xs font-mono"
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      value={newSlotMeetingLink}
                      onChange={(e) => setNewSlotMeetingLink(e.target.value)}
                    />
                  </div>

                  {/* Price + Add Button */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Session Fee</label>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {[
                        { label: "Free (₹0)", val: "0" },
                        { label: "₹299", val: "299" },
                        { label: "₹499", val: "499" },
                        { label: "₹999", val: "999" },
                        { label: "₹1499", val: "1499" },
                      ].map((chip) => (
                        <button
                          key={chip.val}
                          type="button"
                          onClick={() => setNewSlotPrice(chip.val)}
                          className={cn(
                            "text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer",
                            newSlotPrice === chip.val
                              ? "bg-primary/10 border-primary text-primary font-bold"
                              : "border-border text-muted-foreground hover:bg-accent"
                          )}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="relative w-full sm:w-1/3">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                          ₹
                        </span>
                        <Input
                          type="number"
                          className="h-10 pl-7 text-xs font-semibold"
                          placeholder="0"
                          value={newSlotPrice}
                          onChange={(e) => setNewSlotPrice(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={addSlot}
                        disabled={!slotDate || !slotTime}
                        className="w-full sm:w-2/3 h-10 shadow-sm font-semibold gap-1.5"
                      >
                        <CalendarPlus className="h-4 w-4" /> Add Slot to Calendar
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-semibold text-foreground">Active Slots</h4>
                  {mySlots.map((s: any) => (
                    <div
                      key={s.id}
                      className="p-3.5 border rounded-xl text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card hover:bg-accent/10 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>{format(new Date(s.start_time), "MMM d, yyyy")}</span>
                        <span className="text-muted-foreground mx-1">·</span>
                        <span>
                          {format(new Date(s.start_time), "h:mm a")} - {format(new Date(s.end_time), "h:mm a")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {s.meeting_link && (
                          <a
                            href={s.meeting_link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-500 hover:underline truncate max-w-[140px] hidden sm:block font-mono"
                          >
                            <Video className="h-3 w-3 inline mr-1" />
                            Meet
                          </a>
                        )}
                        <span className="font-semibold px-2 py-0.5 rounded-md border text-muted-foreground text-xs">
                          ₹{s.price_inr}
                        </span>
                        {s.is_booked ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Booked
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs font-medium px-2.5 py-1 rounded-full bg-accent">
                            Available
                          </span>
                        )}
                        {!s.is_booked && (
                          <>
                            <button
                              onClick={() => openEditSlot(s)}
                              className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent transition-colors"
                              title="Edit Slot"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteSlot(s.id)}
                              className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 transition-colors"
                              title="Delete Slot"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {mySlots.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground border border-dashed rounded-xl text-xs">
                      No custom slots added yet. Learners book directly from Maya's open calendar above.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit Coach Profile Modal */}
        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-primary" /> Edit Coach Profile & Live Details
              </DialogTitle>
              <DialogDescription>
                Update your coaching details, agenda, and calendar preferences. Changes reflect live on the booking page.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Coach Name</Label>
                <Input
                  value={editCoachForm.name}
                  onChange={(e) => setEditCoachForm({ ...editCoachForm, name: e.target.value })}
                  placeholder="e.g. Maya Lindqvist"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Principal Role / Title</Label>
                <Input
                  value={editCoachForm.role}
                  onChange={(e) => setEditCoachForm({ ...editCoachForm, role: e.target.value })}
                  placeholder="e.g. Principal Distributed Systems Architect"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Location / City</Label>
                  <Input
                    value={editCoachForm.city}
                    onChange={(e) => setEditCoachForm({ ...editCoachForm, city: e.target.value })}
                    placeholder="Bangalore"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Timezone</Label>
                  <Input
                    value={editCoachForm.timeZone}
                    disabled
                    className="font-mono text-xs bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Session Title</Label>
                <Input
                  value={editCoachForm.meetingTitle}
                  onChange={(e) => setEditCoachForm({ ...editCoachForm, meetingTitle: e.target.value })}
                  placeholder="1:1 Technical & Career Advisory"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Session Agenda / Overview</Label>
                <Textarea
                  rows={3}
                  value={editCoachForm.agenda}
                  onChange={(e) => setEditCoachForm({ ...editCoachForm, agenda: e.target.value })}
                  placeholder="System design review, mock tech interview, or career growth strategy session."
                  className="text-xs resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Available Durations (min)</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60].map((dur) => {
                    const isChecked = editCoachForm.durations.includes(dur);
                    return (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => {
                          const updatedDurs = isChecked
                            ? editCoachForm.durations.filter((d: number) => d !== dur)
                            : [...editCoachForm.durations, dur].sort((a: number, b: number) => a - b);
                          if (updatedDurs.length > 0) {
                            setEditCoachForm({ ...editCoachForm, durations: updatedDurs });
                          }
                        }}
                        className={cn(
                          "h-9 rounded-lg border text-xs font-semibold transition-all",
                          isChecked
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : "bg-muted/40 text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {dur}m
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveCoachProfile} className="gap-1.5">
                <Check className="w-4 h-4" /> Save Profile
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Custom Busy Block Modal */}
        <Dialog open={isAddBusyOpen} onOpenChange={setIsAddBusyOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> Add Weekly Busy Block
              </DialogTitle>
              <DialogDescription>
                Block out recurring commitments on your calendar so learners see them as Booked.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Event / Meeting Title</Label>
                <Input
                  value={newBusyTitle}
                  onChange={(e) => setNewBusyTitle(e.target.value)}
                  placeholder="e.g. Meta Architecture Review, Staff Sync, Workout"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Day of Week</Label>
                <div className="grid grid-cols-6 gap-1.5">
                  {[
                    { day: 1, label: "Mon" },
                    { day: 2, label: "Tue" },
                    { day: 3, label: "Wed" },
                    { day: 4, label: "Thu" },
                    { day: 5, label: "Fri" },
                    { day: 6, label: "Sat" },
                  ].map((d) => (
                    <button
                      key={d.day}
                      type="button"
                      onClick={() => setNewBusyDay(d.day)}
                      className={cn(
                        "h-9 rounded-lg border text-xs font-semibold transition-all",
                        newBusyDay === d.day
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-muted/40 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Start Time</Label>
                  <Input
                    type="time"
                    value={newBusyFrom}
                    onChange={(e) => setNewBusyFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">End Time</Label>
                  <Input
                    type="time"
                    value={newBusyTo}
                    onChange={(e) => setNewBusyTo(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddBusyOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBusyBlock} className="gap-1.5">
                <Plus className="w-4 h-4" /> Add Busy Block
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {activeTab === "messaging" && (
          <div className="bg-card rounded-2xl border h-[400px] sm:h-[600px] flex overflow-hidden">
            {/* Contacts Sidebar */}
            <div className="w-1/3 border-r bg-accent/10 flex flex-col">
              <div className="p-4 border-b font-medium">Conversations</div>
              <div className="flex-1 overflow-y-auto">
                {contacts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center p-4">
                    No contacts yet. Book a session first!
                  </p>
                ) : (
                  contacts.map((c: any) => (
                    <div
                      key={c.id}
                      onClick={() => setActiveChatUser(c)}
                      className={`p-4 border-b cursor-pointer flex gap-3 items-center transition-colors ${activeChatUser?.id === c.id ? "bg-accent" : "hover:bg-accent/50"}`}
                    >
                      <DefaultAvatar src={c.avatar_url} name={c.full_name} />
                      <div className="font-medium text-sm">{c.full_name}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-background">
              {activeChatUser ? (
                <>
                  <div className="p-4 border-b font-medium flex items-center gap-3">
                    <DefaultAvatar
                      src={activeChatUser.avatar_url}
                      name={activeChatUser.full_name}
                      className="h-8 w-8"
                    />
                    {activeChatUser.full_name}
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <p className="text-center text-muted-foreground text-sm py-10">
                        No messages yet. Say hello!
                      </p>
                    ) : (
                      messages.map((m: any) => {
                        const isMine = m.sender_id === user?.id;
                        return (
                          <div
                            key={m.id}
                            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMine ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-accent rounded-tl-sm"}`}
                            >
                              {m.content}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="p-4 border-t flex gap-2">
                    <Textarea
                      placeholder="Type a message..."
                      className="min-h-[40px] h-[40px] resize-none"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button onClick={sendMessage} disabled={!messageText.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mb-4 opacity-20" />
                  <p>Select a conversation to start messaging.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "roadmaps" && <RoadmapBuilder user={user} isCreator={isCreator} />}

        {activeTab === "outcomes" && <RealOutcomes user={user} />}

        {activeTab === "cohorts" && <RealCohorts user={user} isCreator={isCreator} />}
      </div>
    </AppShell>
  );
}

function RealCohorts({ user, isCreator }: { user: any; isCreator: boolean }) {
  const qc = useQueryClient();
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    starts_at: "",
    kind: "cohort",
    capacity: 20,
  });
  const [editingCohort, setEditingCohort] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    starts_at: "",
    kind: "cohort",
    capacity: 20,
  });

  const { data: cohorts = [], isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["coaching-cohorts", user?.id, isCreator],
    queryFn: async () => {
      let q = supabase.from("cohorts").select("*, cohort_members(count)");
      if (isCreator) {
        q = q.eq("creator_id", user!.id);
      }
      const { data } = await q.order("starts_at", { ascending: false });
      return data ?? [];
    },
  });

  const createCohort = async () => {
    if (!form.title.trim() || !form.starts_at) return toast.error("Title and start date required");
    const { error } = await supabase.from("cohorts").insert({
      creator_id: user.id,
      title: form.title.trim(),
      description: form.description.trim() || null,
      starts_at: new Date(form.starts_at).toISOString(),
      kind: form.kind,
      capacity: form.capacity,
    });
    if (error) return toast.error(error.message);
    toast.success("Cohort created");
    setNewOpen(false);
    setForm({ title: "", description: "", starts_at: "", kind: "cohort", capacity: 20 });
    qc.invalidateQueries({ queryKey: ["coaching-cohorts"] });
  };

  const launchCohort = async (id: string) => {
    const { error } = await supabase.from("cohorts").update({ status: "live" }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["coaching-cohorts"] });
    toast.success("Cohort launched");
  };

  const deleteCohort = async (id: string) => {
    if (!window.confirm("Delete this cohort?")) return;
    const { error } = await supabase.from("cohorts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Cohort deleted");
    qc.invalidateQueries({ queryKey: ["coaching-cohorts"] });
  };

  const openEditCohort = (c: any) => {
    setEditingCohort(c);
    setEditForm({
      title: c.title,
      description: c.description || "",
      starts_at: new Date(c.starts_at).toISOString().slice(0, 16),
      kind: c.kind,
      capacity: c.capacity,
    });
  };

  const saveEditCohort = async () => {
    if (!editingCohort) return;
    const { error } = await supabase
      .from("cohorts")
      .update({
        title: editForm.title.trim(),
        description: editForm.description.trim() || null,
        starts_at: new Date(editForm.starts_at).toISOString(),
        kind: editForm.kind,
        capacity: editForm.capacity,
      })
      .eq("id", editingCohort.id);
    if (error) return toast.error(error.message);
    toast.success("Cohort updated");
    setEditingCohort(null);
    qc.invalidateQueries({ queryKey: ["coaching-cohorts"] });
  };

  const shareViaWhatsApp = (c: any) => {
    const text = encodeURIComponent(
      `Join my cohort: ${c.title}\nStarts: ${format(new Date(c.starts_at), "MMM d, yyyy · h:mm a")}\n${c.description || ""}\n\nSign up here: ${window.location.origin}/coaching`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const enterStudio = (c: any) => {
    toast.success(`Entering Live Studio for ${c.title}...`);
    window.open(`https://meet.google.com/new`, "_blank");
  };

  return (
    <div className="bg-card rounded-2xl border p-6 min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h3 className="font-medium text-lg text-foreground">Live Cohort Manager</h3>
            <p className="text-sm text-muted-foreground">
              Manage your cohorts, sessions, and members.
            </p>
          </div>
        </div>
        {isCreator && (
          <Dialog open={newOpen} onOpenChange={setNewOpen}>
            <DialogTrigger asChild>
              <Button>
                <Users className="h-4 w-4" /> New cohort
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create cohort</DialogTitle>
                <DialogDescription>Set up a new live learning cohort.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Fall 2026 Bootcamp"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Start date</Label>
                    <Input
                      type="datetime-local"
                      value={form.starts_at}
                      onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Capacity</Label>
                    <Input
                      type="number"
                      value={form.capacity}
                      onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={createCohort}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin mx-auto my-12" />
      ) : cohorts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">
          <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No cohorts yet</p>
          <p className="text-sm mt-1">Create your first cohort to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {cohorts.map((c: any) => {
            const memberCount = c.cohort_members?.[0]?.count ?? c.cohort_members?.length ?? 0;
            const isLive = c.status === "live";
            const isScheduled = c.status === "scheduled";
            return (
              <div
                key={c.id}
                className="rounded-xl border p-4 space-y-3 flex flex-col hover:shadow-md transition-shadow bg-gradient-to-br from-card to-accent/5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold truncate">{c.title}</h4>
                      {isLive && (
                        <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {c.kind.replace("_", " ")} · {memberCount} enrolled
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 flex-wrap">
                    {isCreator && !isLive && (
                      <>
                        <button
                          onClick={() => openEditCohort(c)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                          title="Edit Cohort"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteCohort(c.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete Cohort"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => shareViaWhatsApp(c)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                      title="Share on WhatsApp"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </button>
                    <Badge
                      className={`text-[10px] ${isLive ? "bg-rose-500/20 text-rose-500 border-rose-500/30" : "bg-muted text-muted-foreground"}`}
                      variant={isLive ? "outline" : "secondary"}
                    >
                      {c.status}
                    </Badge>
                  </div>
                </div>
                {c.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                )}
                <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {format(new Date(c.starts_at), "MMM d, yyyy · h:mm a")}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {memberCount}/{c.capacity}
                  </div>
                </div>
                <div className="flex gap-2">
                  {isScheduled && isCreator && (
                    <Button size="sm" className="flex-1" onClick={() => launchCohort(c.id)}>
                      <Video className="h-4 w-4" /> Launch Now
                    </Button>
                  )}
                  {isLive && (
                    <Button size="sm" className="flex-1 gap-2" onClick={() => enterStudio(c)}>
                      <Video className="h-4 w-4" /> Enter Studio
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Cohort Dialog */}
      <Dialog
        open={!!editingCohort}
        onOpenChange={(open) => {
          if (!open) setEditingCohort(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Cohort</DialogTitle>
            <DialogDescription>Update your cohort details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Start date</Label>
                <Input
                  type="datetime-local"
                  value={editForm.starts_at}
                  onChange={(e) => setEditForm({ ...editForm, starts_at: e.target.value })}
                />
              </div>
              <div>
                <Label>Capacity</Label>
                <Input
                  type="number"
                  value={editForm.capacity}
                  onChange={(e) => setEditForm({ ...editForm, capacity: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCohort(null)}>
              Cancel
            </Button>
            <Button onClick={saveEditCohort}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RealOutcomes({ user }: { user: any }) {
  const { data: attempts = [] } = useQuery({
    enabled: !!user,
    queryKey: ["coaching-outcomes", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("mcq_attempts")
        .select("course_id, score, total, passed, created_at, courses:course_id(title)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: enroll = [] } = useQuery({
    enabled: !!user,
    queryKey: ["coaching-enroll", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("course_id, progress_pct, completed_at, courses:course_id(title)")
        .eq("user_id", user!.id);
      return data ?? [];
    },
  });

  const totalAttempts = attempts.length;
  const passed = attempts.filter((a: any) => a.passed).length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(
          attempts.reduce(
            (s: number, a: any) => s + (a.total > 0 ? (a.score / a.total) * 100 : 0),
            0,
          ) / totalAttempts,
        )
      : 0;
  const completedCourses = enroll.filter((e: any) => e.completed_at).length;

  return (
    <div className="bg-card rounded-2xl border p-6 min-h-[400px]">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="h-8 w-8 text-primary" />
        <div>
          <h3 className="font-medium text-lg text-foreground">Outcome Tracking</h3>
          <p className="text-sm text-muted-foreground">
            Real quiz scores, course progress, and milestones.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-accent/10 p-4">
          <div className="text-2xl font-bold">{totalAttempts}</div>
          <div className="text-xs text-muted-foreground">Quiz attempts</div>
        </div>
        <div className="rounded-xl border bg-emerald-500/10 p-4">
          <div className="text-2xl font-bold text-emerald-600">
            {passed}/{totalAttempts}
          </div>
          <div className="text-xs text-muted-foreground">Passed</div>
        </div>
        <div className="rounded-xl border bg-primary/5 p-4">
          <div className="text-2xl font-bold">{avgScore}%</div>
          <div className="text-xs text-muted-foreground">Avg score</div>
        </div>
        <div className="rounded-xl border bg-amber-500/10 p-4">
          <div className="text-2xl font-bold">
            {completedCourses}/{enroll.length}
          </div>
          <div className="text-xs text-muted-foreground">Courses completed</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4 space-y-3">
          <h4 className="font-semibold text-sm">Recent Attempts</h4>
          {attempts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No quiz attempts yet.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {attempts.slice(0, 10).map((a: any) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between text-sm border-b pb-1 last:border-0"
                >
                  <span className="truncate mr-2">{a.courses?.title ?? "Quiz"}</span>
                  <span
                    className={`font-semibold tabular-nums ${a.passed ? "text-emerald-600" : "text-rose-600"}`}
                  >
                    {a.score}/{a.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border p-4 space-y-3">
          <h4 className="font-semibold text-sm">Course Progress</h4>
          {enroll.length === 0 ? (
            <p className="text-sm text-muted-foreground">No enrollments yet.</p>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {enroll.map((e: any) => (
                <div key={e.course_id} className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="truncate mr-2">{e.courses?.title ?? "Course"}</span>
                    <span className="font-semibold tabular-nums">{e.progress_pct ?? 0}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${e.progress_pct ?? 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
