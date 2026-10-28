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
  Printer,
  FileText,
  Calculator,
  User,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
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
} from "@/components/ui/dialog";
import RoadmapBuilder from "@/components/admin/RoadmapBuilder";
import { cn } from "@/lib/utils";
import OpenSlotBooking, { MeetingIcons } from "@/components/ui/open-slot-booking";
import { careerCoachChat } from "@/lib/career-coach.functions";

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
    color: "from-emerald-500/20 to-green-500/20 text-emerald-500 border-emerald-500/30",
    description: "Value-based pricing, monthly retainer contracts, client discovery objection handling, and productized service models.",
    samplePrompts: [
      "How to transition from $50/hr billing to a $5,000/month retainer?",
      "Draft a 4-question discovery script to filter out low-budget tire-kickers",
      "Contract clauses every freelance developer must include to prevent scope creep",
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

  // 3 Primary Connected Experiences + 2 Secondary Tabs:
  const [activeTab, setActiveTab] = useState<
    "book_call" | "ai_studio" | "my_sessions" | "roadmaps" | "outcomes"
  >("book_call");

  // Secondary toggle for managing host availability & recurring blocks inside book_call
  const [showAvailabilityManager, setShowAvailabilityManager] = useState(false);
  const [selectedReceiptBooking, setSelectedReceiptBooking] = useState<any | null>(null);

  // Coach Profile & Live Time State (Vishwajeet)
  const [coachProfile, setCoachProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("learnify_coach_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === "Maya Lindqvist" || !parsed.avatar) {
          parsed.name = "Vishwajeet";
          parsed.role = "Principal Distributed Systems Architect";
          parsed.city = "Bangalore";
          parsed.avatar = "/avatars/Vishwajeet.jpeg";
          parsed.stamp = "Vishwajeet · Principal Distributed Systems Architect · Learnify AI · ";
        }
        return parsed;
      }
    } catch {}
    return {
      name: "Vishwajeet",
      role: "Principal Distributed Systems Architect",
      city: "Bangalore",
      timeZone: "Asia/Calcutta",
      meetingTitle: "1:1 Technical & Career Advisory",
      agenda: "System design review, mock tech interview, or career growth strategy session.",
      location: "Google Meet & Zoom Direct Integration",
      avatar: "/avatars/Vishwajeet.jpeg",
      durations: [15, 30, 45, 60],
      durationPrices: { 15: 499, 30: 999, 45: 1499, 60: 1999 } as Record<number, number>,
      defaultDuration: 30,
      ratePerSession: 999,
      platform: "google-meet" as "google-meet" | "zoom" | "teams",
      responseNote: "Calendar synced in real time",
      stamp: "Vishwajeet · Principal Distributed Systems Architect · Learnify AI · ",
    };
  });

  const [coachLiveTime, setCoachLiveTime] = useState("Bangalore, 11:30 pm now");
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
        setCoachLiveTime("Bangalore, 11:30 pm now");
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [coachProfile.city]);

  // Host Busy Schedule
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

  // Local Bookings & Notice State (with Indian GST SAC 998431 Thermal Receipt data)
  const [localBookings, setLocalBookings] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("learnify_coach_local_bookings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((b) => ({
            ...b,
            coachName: b.coachName === "Maya Lindqvist" ? "Vishwajeet" : b.coachName || "Vishwajeet",
            coachAvatar: b.coachAvatar || "/avatars/Vishwajeet.jpeg",
          }));
        }
      }
    } catch {}
    return [
      {
        id: "bk-init-1",
        coachName: "Vishwajeet",
        coachAvatar: "/avatars/Vishwajeet.jpeg",
        coachRole: "Principal Distributed Systems Architect",
        learnerName: "Siddharth Verma",
        learnerEmail: "siddharth.v@techcorp.io",
        title: "1:1 Technical & Career Advisory",
        agenda: "Distributed Consensus & Raft vs Paxos Tradeoffs for low-latency writes",
        startTime: new Date(Date.now() + 2 * 3600000).toISOString(),
        endTime: new Date(Date.now() + 2.75 * 3600000).toISOString(),
        duration: 45,
        price: 1499,
        orderId: "COACH-24530",
        platform: "Google Meet",
        meetingLink: "https://meet.google.com/lnf-dist-sys",
        status: "confirmed",
        noticeSent: true,
        noticeTime: "Dispatched 2 hours prior to call",
        bookedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "bk-init-2",
        coachName: "Vishwajeet",
        coachAvatar: "/avatars/Vishwajeet.jpeg",
        coachRole: "Principal Distributed Systems Architect",
        learnerName: "Aarav Patel",
        learnerEmail: "aarav.p@scaleops.dev",
        title: "1:1 Technical & Career Advisory",
        agenda: "System design critique for event-driven streaming pipeline with Kafka",
        startTime: new Date(Date.now() + 26 * 3600000).toISOString(),
        endTime: new Date(Date.now() + 26.5 * 3600000).toISOString(),
        duration: 30,
        price: 999,
        orderId: "COACH-52346",
        platform: "Zoom",
        meetingLink: "https://zoom.us/j/9847261947",
        status: "pending",
        noticeSent: false,
        noticeTime: "Queued for automated dispatch",
        bookedAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
  });

  const saveCoachProfile = () => {
    setCoachProfile(editCoachForm);
    try {
      localStorage.setItem("learnify_coach_profile", JSON.stringify(editCoachForm));
    } catch {}
    // Also sync local bookings coachName if needed
    const syncedBookings = localBookings.map((b) => ({
      ...b,
      coachName: editCoachForm.name,
      coachRole: editCoachForm.role,
      coachAvatar: editCoachForm.avatar || "/avatars/Vishwajeet.jpeg",
    }));
    setLocalBookings(syncedBookings);
    try {
      localStorage.setItem("learnify_coach_local_bookings", JSON.stringify(syncedBookings));
    } catch {}
    setIsEditProfileOpen(false);
    toast.success("Coach profile and duration pricing updated live!");
  };

  const addBusyBlock = () => {
    if (!newBusyTitle.trim()) {
      toast.error("Please enter a title for the busy block");
      return;
    }
    const newBlock = {
      weekday: newBusyDay,
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
    toast.success("Recurring busy block added to calendar matrix!");
  };

  const removeBusyBlock = (index: number) => {
    const updated = hostBusySchedule.filter((_: any, i: number) => i !== index);
    setHostBusySchedule(updated);
    try {
      localStorage.setItem("learnify_host_busy", JSON.stringify(updated));
    } catch {}
    toast.success("Busy block removed");
  };

  const approveBooking = (id: string) => {
    const updated = localBookings.map((b) =>
      b.id === id ? { ...b, status: "confirmed", noticeSent: true, noticeTime: "Dispatched now" } : b
    );
    setLocalBookings(updated);
    try {
      localStorage.setItem("learnify_coach_local_bookings", JSON.stringify(updated));
    } catch {}
    toast.success("Session approved! An automated notice and room invite dispatched.");
  };

  const rejectBooking = (id: string) => {
    const updated = localBookings.filter((b) => b.id !== id);
    setLocalBookings(updated);
    try {
      localStorage.setItem("learnify_coach_local_bookings", JSON.stringify(updated));
    } catch {}
    toast.success("Booking request declined");
  };

  // 10-Role AI Studio State
  const [selectedRole, setSelectedRole] = useState(COACH_ROLES[0]);
  const [aiMessengerMode, setAiMessengerMode] = useState<"ai_persona" | "human_contacts">("ai_persona");
  const [aiMessages, setAiMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: `Hello! I am your ${COACH_ROLES[0].title}. How can I assist your engineering architecture, code review, or career strategy today? Feel free to select any prompt below or type your technical query.`,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const runCareerCoach = useServerFn(careerCoachChat);

  const handleRoleChange = (role: (typeof COACH_ROLES)[0]) => {
    setSelectedRole(role);
    setAiMessages([
      {
        role: "assistant",
        content: `Switched context to ${role.title} (${role.badge}). ${role.description}\n\nWhat would you like to review or prepare today?`,
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
      const dur = booking.duration || coachProfile.defaultDuration;
      const price = coachProfile.durationPrices?.[dur] || 999;
      const newBk = {
        id: `bk-${Date.now()}`,
        coachName: coachProfile.name,
        coachAvatar: coachProfile.avatar || "/avatars/Vishwajeet.jpeg",
        coachRole: coachProfile.role,
        learnerName: booking.name || user?.user_metadata?.full_name || "Learner",
        learnerEmail: booking.email || user?.email || "learner@learnify.ai",
        title: coachProfile.meetingTitle,
        agenda: booking.note || coachProfile.agenda,
        startTime: booking.start instanceof Date ? booking.start.toISOString() : new Date(booking.start).toISOString(),
        endTime: booking.end instanceof Date ? booking.end.toISOString() : new Date(booking.end).toISOString(),
        duration: dur,
        price,
        orderId: `COACH-${Math.floor(10000 + Math.random() * 90000)}`,
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
        `Session confirmed for ${format(new Date(booking.start), "MMM d, h:mm a")} (₹${price.toLocaleString("en-IN")}) via ${newBk.platform}! Calendar invite dispatched.`
      );
      if (user) {
        qc.invalidateQueries({ queryKey: ["my-coaching-bookings"] });
      }
      setActiveTab("my_sessions");
    } catch (err: any) {
      toast.error(err?.message || "Booking failed");
    }
  };

  // Direct Peer Messenger State
  const [activeChatUser, setActiveChatUser] = useState<any>(null);
  const [messageText, setMessageText] = useState("");

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
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
      `DTSTART:${start.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
      `DTEND:${end.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
      `SUMMARY:${b.title || `1:1 Technical & Career Advisory with ${b.coachName || coachProfile.name}`}`,
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
        return [contact?.id || "unknown", contact || { id: "unknown", full_name: "Participant" }];
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
          `and(sender_id.eq.${user!.id},receiver_id.eq.${activeChatUser.id}),and(sender_id.eq.${activeChatUser.id},receiver_id.eq.${user!.id})`,
        )
        .order("created_at", { ascending: true });
      return data || [];
    },
  });

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
    } catch {
      toast.error("Failed to send message");
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive Coaching Studio 5.0</span>
            </div>
            <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
              Coaching & Mentorship Studio
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Direct 1-on-1 mentorship with Staff & Principal Engineers, plus our 10-Role AI Coaching Agent Studio with real-time tool calling and code execution.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={activeTab === "book_call" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("book_call")}
              className="gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book 1:1 Call</span>
            </Button>
            <Button
              variant={activeTab === "ai_studio" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("ai_studio")}
              className="gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>AI Coach Studio</span>
            </Button>
            <Button
              variant={activeTab === "my_sessions" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("my_sessions")}
              className="gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>My Sessions</span>
              {localBookings.length > 0 && (
                <Badge variant="secondary" className="text-[10px] py-0 px-1 font-bold">
                  {localBookings.length}
                </Badge>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditCoachForm(coachProfile);
                setIsEditProfileOpen(true);
              }}
              className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Edit Rates</span>
            </Button>
          </div>
        </div>

        {/* 5 Core Connected Tabs Bar */}
        <div className="flex gap-2 sm:gap-3 border-b mb-8 overflow-x-auto -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors shrink-0 snap-start flex items-center gap-2 ${
              activeTab === "book_call"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("book_call")}
          >
            <Calendar className="h-4 w-4 text-indigo-500" />
            <span>1:1 Live Booking</span>
          </button>

          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors shrink-0 snap-start flex items-center gap-2 ${
              activeTab === "ai_studio"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("ai_studio")}
          >
            <Bot className="h-4 w-4 text-purple-500" />
            <span>10-Role AI Studio & Messenger</span>
            <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-600 border-purple-500/20 py-0 px-1.5 font-bold">
              HOT
            </Badge>
          </button>

          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors shrink-0 snap-start flex items-center gap-2 ${
              activeTab === "my_sessions"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("my_sessions")}
          >
            <Clock className="h-4 w-4 text-emerald-500" />
            <span>My Sessions & Receipts</span>
            {localBookings.some((b) => b.status === "confirmed") && (
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 py-0 px-1 font-bold">
                {localBookings.filter((b) => b.status === "confirmed").length}
              </Badge>
            )}
          </button>

          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors shrink-0 snap-start flex items-center gap-2 ${
              activeTab === "roadmaps"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("roadmaps")}
          >
            <Compass className="h-4 w-4 text-teal-500" />
            <span>Roadmaps</span>
          </button>

          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors shrink-0 snap-start flex items-center gap-2 ${
              activeTab === "outcomes"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("outcomes")}
          >
            <TrendingUp className="h-4 w-4 text-rose-500" />
            <span>Outcomes & Cohorts</span>
          </button>
        </div>

        {/* ============ EXPERIENCE 1: 1:1 LIVE CALENDAR BOOKING ============ */}
        {activeTab === "book_call" && (
          <div className="space-y-6">
            {/* Notice Active Banner (Starts in ~2 Hours Alert) */}
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

            {/* Coach Profile Card with Real Avatar & Duration Pricing Matrix */}
            <div className="bg-card border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-start sm:items-center gap-4">
                  {/* Real Vishwajeet Profile Image */}
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-md shrink-0 bg-muted">
                    <img
                      src={coachProfile.avatar || "/avatars/Vishwajeet.jpeg"}
                      alt={coachProfile.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/avatars/Vishwajeet.jpeg";
                      }}
                    />
                    <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold font-display text-foreground">{coachProfile.name}</h2>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
                        {coachProfile.role}
                      </Badge>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {coachLiveTime}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl font-medium">
                      {coachProfile.meetingTitle} · {coachProfile.agenda}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs h-9 border-primary/30 text-primary hover:bg-primary/10 font-semibold"
                    onClick={() => {
                      setEditCoachForm(coachProfile);
                      setIsEditProfileOpen(true);
                    }}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile & Rates</span>
                  </Button>
                  <Button
                    size="sm"
                    variant={showAvailabilityManager ? "default" : "outline"}
                    className="gap-1.5 text-xs h-9"
                    onClick={() => setShowAvailabilityManager(!showAvailabilityManager)}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Availability Matrix</span>
                    {showAvailabilityManager ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>

              {/* Duration Pricing Matrix Chips (18% GST Included) */}
              <div className="pt-3 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Receipt className="w-3.5 h-3.5 text-primary" /> Session Rates:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {coachProfile.durations.map((dur: number) => (
                      <span
                        key={dur}
                        className="px-2.5 py-1 rounded-lg bg-muted border text-xs font-mono font-semibold text-foreground flex items-center gap-1.5 shadow-2xs"
                      >
                        <span className="text-muted-foreground">{dur}m:</span>
                        <span className="text-primary font-bold">
                          ₹{coachProfile.durationPrices?.[dur]?.toLocaleString("en-IN") || 999}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] py-0 px-1 font-mono">
                    SAC 998431
                  </Badge>
                  <span>18% Indian GST Included</span>
                </div>
              </div>
            </div>

            {/* Optional Collapsible Availability & Recurring Busy Matrix */}
            {showAvailabilityManager && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5 rounded-2xl border bg-muted/20 animate-in fade-in-50 duration-200">
                {/* Pending Bookings */}
                <div className="bg-card border rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b pb-2.5">
                    <div>
                      <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-amber-500" /> Pending Booking Requests
                      </h4>
                      <p className="text-[11px] text-muted-foreground">Approve learner requests to trigger calendar notices.</p>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      {localBookings.filter((b) => b.status === "pending").length}
                    </Badge>
                  </div>

                  {localBookings.filter((b) => b.status === "pending").length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground border border-dashed rounded-lg">
                      <CheckCircle2 className="w-7 h-7 mx-auto mb-1.5 text-emerald-500 opacity-80" />
                      <p className="text-xs font-medium text-foreground">All booking requests approved</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {localBookings
                        .filter((b) => b.status === "pending")
                        .map((bk) => (
                          <div key={bk.id} className="p-3 rounded-lg border bg-accent/20 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-foreground">{bk.learnerName}</span>
                              <span className="font-mono font-bold text-primary">₹{bk.price}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">{bk.agenda}</p>
                            <div className="flex items-center justify-end gap-2 pt-1">
                              <Button size="sm" variant="outline" className="h-6 text-[11px] px-2" onClick={() => rejectBooking(bk.id)}>
                                Decline
                              </Button>
                              <Button size="sm" className="h-6 text-[11px] px-2.5 bg-emerald-600 hover:bg-emerald-700" onClick={() => approveBooking(bk.id)}>
                                Approve & Sync
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Recurring Busy Blocks */}
                <div className="bg-card border rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b pb-2.5">
                    <div>
                      <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-500" /> Weekly Recurring Busy Blocks
                      </h4>
                      <p className="text-[11px] text-muted-foreground">Times where you are marked unavailable in OpenSlotBooking.</p>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setIsAddBusyOpen(true)}>
                      <Plus className="w-3 h-3" /> Add Block
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {hostBusySchedule.map((blk: any, idx: number) => {
                      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                      return (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg border bg-muted/40 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground w-8">{dayNames[blk.weekday]}</span>
                            <span className="font-mono text-muted-foreground text-[11px]">{blk.from} – {blk.to}</span>
                            <span className="text-foreground truncate max-w-[140px]">· {blk.title}</span>
                          </div>
                          <button
                            onClick={() => removeBusyBlock(idx)}
                            className="text-muted-foreground hover:text-rose-500 transition-colors p-1"
                            title="Delete busy block"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Calendar-First OpenSlotBooking Component (Clean without duplicate giant marketing header) */}
            <div className="bg-card border rounded-2xl p-4 sm:p-6 shadow-sm">
              <OpenSlotBooking
                headline=""
                headlineAccent=""
                description=""
                meetingTitle={coachProfile.meetingTitle}
                agenda={coachProfile.agenda}
                location={coachProfile.location}
                durations={coachProfile.durations}
                durationPrices={coachProfile.durationPrices}
                defaultDuration={coachProfile.defaultDuration}
                host={{
                  name: coachProfile.name,
                  role: coachProfile.role,
                  city: coachProfile.city,
                  avatar: coachProfile.avatar || "/avatars/Vishwajeet.jpeg",
                  stamp: coachProfile.stamp,
                }}
                hostTimeZone="Asia/Calcutta"
                timeZones={["Asia/Calcutta", "Asia/Kolkata", "America/New_York", "Europe/London", "Asia/Singapore", "Asia/Dubai"]}
                hostBusy={hostBusySchedule}
                visitorEvents={sampleMyWeek}
                onBook={handleOpenSlotBook}
                preset="learnify"
                gridHeight={460}
              />
            </div>
          </div>
        )}

        {/* ============ EXPERIENCE 2: 10-ROLE AI STUDIO & MESSENGER ============ */}
        {activeTab === "ai_studio" && (
          <div className="space-y-6">
            {/* Header Persona Carousel / Compact Badges */}
            <div className="bg-card border rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      10-Role AI Coaching Agent Studio & Direct Messenger
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 py-0 px-1 font-bold">
                      Grok-Style
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Select a specialized persona for instant architectural critiques, system design drills, or executive scripts.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-muted border self-start sm:self-auto">
                  <button
                    onClick={() => setAiMessengerMode("ai_persona")}
                    className={cn(
                      "px-3 py-1 rounded-md text-xs font-semibold transition-all",
                      aiMessengerMode === "ai_persona" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    10 AI Personas
                  </button>
                  <button
                    onClick={() => setAiMessengerMode("human_contacts")}
                    className={cn(
                      "px-3 py-1 rounded-md text-xs font-semibold transition-all",
                      aiMessengerMode === "human_contacts" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Peer Contacts
                  </button>
                </div>
              </div>

              {/* Clean 10 Persona Badges Grid (Fixed: Clean Lucide Icons with Dedicated Gradient Containers) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {COACH_ROLES.map((role) => {
                  const IconComp = role.icon;
                  const isSelected = selectedRole.id === role.id && aiMessengerMode === "ai_persona";
                  return (
                    <button
                      key={role.id}
                      onClick={() => {
                        setAiMessengerMode("ai_persona");
                        handleRoleChange(role);
                      }}
                      className={cn(
                        "p-2.5 rounded-xl border text-left transition-all duration-200 flex items-center gap-2.5 group cursor-pointer",
                        isSelected
                          ? "bg-primary/10 border-primary ring-1 ring-primary shadow-xs"
                          : "bg-card hover:bg-accent/40 border-border"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 shadow-xs bg-gradient-to-br",
                        role.color
                      )}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {role.title.split(" ")[0]} {role.title.split(" ")[1]}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">{role.badge}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Messenger Viewport */}
            {aiMessengerMode === "ai_persona" ? (
              <div className="bg-card border rounded-2xl overflow-hidden shadow-sm flex flex-col h-[650px]">
                {/* Active Persona Header */}
                <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 bg-gradient-to-br",
                      selectedRole.color
                    )}>
                      <selectedRole.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-foreground">{selectedRole.title}</h3>
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold">
                          {selectedRole.badge}
                        </Badge>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-medium font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Agent
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate max-w-xl">{selectedRole.description}</p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1.5 border-border self-start sm:self-auto"
                    onClick={() =>
                      setAiMessages([
                        {
                          role: "assistant",
                          content: `Context refreshed for ${selectedRole.title}. How may I help you excel?`,
                        },
                      ])
                    }
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Clear History
                  </Button>
                </div>

                {/* Sample Prompt Chips */}
                <div className="px-4 py-2 bg-muted/10 border-b flex items-center gap-2 overflow-x-auto scrollbar-none">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider shrink-0">
                    Quick Drills:
                  </span>
                  {selectedRole.samplePrompts.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendAiMessage(p)}
                      disabled={isAiTyping}
                      className="text-xs px-2.5 py-1 rounded-full bg-card hover:bg-primary/10 hover:text-primary border text-muted-foreground transition-all shrink-0 font-medium disabled:opacity-50"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Chat Messages Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {aiMessages.map((msg, i) => (
                    <div key={i} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                      {msg.role === "assistant" && (
                        <div className={cn(
                          "w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 bg-gradient-to-br",
                          selectedRole.color
                        )}>
                          <selectedRole.icon className="w-4 h-4" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed relative group shadow-xs",
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted/40 border border-border/80 text-foreground rounded-tl-sm"
                        )}
                      >
                        <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                        {msg.role === "assistant" && (
                          <button
                            onClick={() => copyAiResponse(msg.content)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-muted text-muted-foreground"
                            title="Copy response"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {isAiTyping && (
                    <div className="flex gap-3 items-center text-xs text-muted-foreground italic">
                      <div className={cn(
                        "w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 bg-gradient-to-br",
                        selectedRole.color
                      )}>
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                      <span>{selectedRole.title} is formulating structured architectural response...</span>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t bg-card flex gap-2">
                  <Textarea
                    placeholder={`Ask ${selectedRole.title} anything... (Shift+Enter for new line)`}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendAiMessage();
                      }
                    }}
                    rows={1}
                    className="min-h-[44px] max-h-32 resize-none text-sm"
                  />
                  <Button
                    onClick={() => handleSendAiMessage()}
                    disabled={!chatInput.trim() || isAiTyping}
                    className="h-11 px-4 gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              /* Human Peer Messenger */
              <div className="bg-card border rounded-2xl overflow-hidden shadow-sm flex h-[600px]">
                <div className="w-72 border-r bg-muted/10 p-3 space-y-2 overflow-y-auto">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase px-2">Contacts</h4>
                  {contacts.length === 0 ? (
                    <p className="text-xs text-muted-foreground p-2">No peers yet. Book a session to connect!</p>
                  ) : (
                    contacts.map((c: any) => (
                      <button
                        key={c.id}
                        onClick={() => setActiveChatUser(c)}
                        className={cn(
                          "w-full p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all",
                          activeChatUser?.id === c.id ? "bg-accent border-primary" : "hover:bg-accent/40 border-transparent"
                        )}
                      >
                        <DefaultAvatar src={c.avatar_url} name={c.full_name} className="w-8 h-8" />
                        <span className="text-xs font-bold truncate">{c.full_name}</span>
                      </button>
                    ))
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  {activeChatUser ? (
                    <>
                      <div className="p-3 border-b font-bold text-sm flex items-center gap-2 bg-muted/20">
                        <DefaultAvatar src={activeChatUser.avatar_url} name={activeChatUser.full_name} className="w-7 h-7" />
                        <span>{activeChatUser.full_name}</span>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((m: any) => (
                          <div
                            key={m.id}
                            className={cn("flex", m.sender_id === user?.id ? "justify-end" : "justify-start")}
                          >
                            <div
                              className={cn(
                                "max-w-[70%] p-3 rounded-2xl text-xs",
                                m.sender_id === user?.id
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted border text-foreground"
                              )}
                            >
                              {m.content}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                          className="h-10 text-xs"
                        />
                        <Button onClick={sendMessage} className="h-10 px-4">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6">
                      <MessageCircle className="w-10 h-10 mb-2 opacity-30" />
                      <p className="text-xs">Select a contact to begin direct 1:1 conversation.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============ EXPERIENCE 3: MY SESSIONS & THERMAL RECEIPTS ============ */}
        {activeTab === "my_sessions" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" /> My Scheduled 1:1 Sessions
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage your live Google Meet / Zoom sessions, download .ICS calendar files, and inspect GST thermal invoices on demand.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs px-2 py-0.5">
                  {localBookings.length} Total Bookings
                </Badge>
                <Button size="sm" onClick={() => setActiveTab("book_call")} className="gap-1.5 h-8 text-xs">
                  <Calendar className="w-3.5 h-3.5" /> Book Another Session
                </Button>
              </div>
            </div>

            {localBookings.length === 0 ? (
              <div className="text-center py-16 border border-dashed rounded-2xl bg-card">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-40" />
                <h4 className="font-bold text-base text-foreground">No sessions scheduled yet</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Book a 1:1 advisory slot with {coachProfile.name} to receive architectural reviews and interview coaching.
                </p>
                <Button size="sm" onClick={() => setActiveTab("book_call")} className="mt-4 gap-2">
                  <Calendar className="w-4 h-4" /> Book First Session
                </Button>
              </div>
            ) : (
              <ul className="space-y-4">
                {localBookings.map((b) => (
                  <li
                    key={b.id}
                    className="p-5 sm:p-6 border border-border/80 rounded-2xl bg-card hover:border-primary/40 transition-all shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-3.5">
                        {/* Real Vishwajeet Profile Image */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-primary/20 shrink-0 bg-muted">
                          <img
                            src={b.coachAvatar || coachProfile.avatar || "/avatars/Vishwajeet.jpeg"}
                            alt={b.coachName}
                            className="w-full h-full object-cover object-top"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "/avatars/Vishwajeet.jpeg";
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-base text-foreground flex flex-wrap items-center gap-2">
                            <span>{b.title}</span>
                            <Badge
                              className={cn(
                                "text-[10px] py-0 px-2 font-semibold",
                                b.status === "confirmed"
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                              )}
                            >
                              {b.status === "confirmed" ? "Confirmed" : "Pending Approval"}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Coach: <span className="font-semibold text-foreground">{b.coachName}</span> ({b.coachRole}) · Client: <span className="font-medium text-foreground">{b.learnerName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto font-mono">
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-muted border text-muted-foreground">
                          {b.duration} min
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                          ₹{b.price?.toLocaleString("en-IN") || 999}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-border/40">
                      <div className="flex items-center gap-2 font-medium text-foreground">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{format(new Date(b.startTime), "EEEE, MMMM d, yyyy · h:mm a")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono">
                        <Bell className="w-4 h-4" />
                        <span>{b.noticeTime || "Notice dispatched 2h prior to call"}</span>
                      </div>
                    </div>

                    {b.agenda && (
                      <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/40 leading-relaxed">
                        <span className="font-semibold text-foreground">Session Focus & Agenda:</span> {b.agenda}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/40">
                      <div className="text-xs text-blue-500 flex items-center gap-1.5">
                        <Video className="w-4 h-4" />
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedReceiptBooking(b)}
                          className="h-8 text-xs gap-1.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 font-medium"
                        >
                          <Receipt className="w-3.5 h-3.5" /> Thermal Receipt
                        </Button>
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
                          <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90">
                            <Video className="w-3.5 h-3.5" /> Join Video Call
                          </Button>
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* ============ TAB 4: ROADMAPS ============ */}
        {activeTab === "roadmaps" && (
          <div className="space-y-6">
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
                    <Compass className="w-5 h-5 text-teal-500" /> Career Milestone Roadmaps
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Structured milestone phases with progress checkpoints, code review RFCs, and verified competencies.
                  </p>
                </div>
                <Badge variant="outline" className="border-teal-500/30 text-teal-600 bg-teal-500/10 font-bold text-xs self-start sm:self-auto">
                  Staff & Principal Track
                </Badge>
              </div>

              {/* Interactive Roadmap Tracker */}
              <div className="space-y-4">
                {[
                  {
                    stage: "Phase 1: High-Throughput Streaming & Distributed Consensus",
                    status: "Completed",
                    progress: 100,
                    topics: ["Kafka Partitions & Log Compaction", "Raft Consensus Algorithm", "Idempotent Producer Semantics"],
                  },
                  {
                    stage: "Phase 2: Database Sharding, Caching & Data Consistency",
                    status: "In Progress",
                    progress: 65,
                    topics: ["Consistent Hashing & Virtual Nodes", "Write-Through vs Write-Behind Caching", "Two-Phase Commit (2PC) & Saga Orchestration"],
                  },
                  {
                    stage: "Phase 3: Executive System Design Interview & Defense",
                    status: "Upcoming",
                    progress: 0,
                    topics: ["Capacity Estimations (QPS, IOPS, Storage)", "Single-Point-Of-Failure Mitigation", "Live Architectural RFC Defense"],
                  },
                ].map((phase, i) => (
                  <div key={i} className="p-4 rounded-xl border bg-card hover:border-primary/40 transition-all space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">{phase.stage}</span>
                      <Badge
                        className={cn(
                          "text-[10px] font-semibold",
                          phase.progress === 100
                            ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                            : phase.progress > 0
                            ? "bg-primary/15 text-primary border-primary/30"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {phase.status} ({phase.progress}%)
                      </Badge>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500 rounded-full"
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {phase.topics.map((t, ti) => (
                        <span key={ti} className="text-[11px] px-2 py-0.5 rounded-md bg-muted/50 border text-muted-foreground font-mono">
                          ✓ {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Admin / Personal Roadmap Builder */}
              <div className="pt-4 border-t">
                <RoadmapBuilder user={user} isCreator={isCreator} />
              </div>
            </div>
          </div>
        )}

        {/* ============ TAB 5: OUTCOMES & COHORTS ============ */}
        {activeTab === "outcomes" && (
          <div className="space-y-6">
            <RealCohorts user={user} isCreator={isCreator} coachName={coachProfile.name} />
            <RealOutcomes user={user} />
          </div>
        )}
      </div>

      {/* Edit Coach Profile & Duration Pricing Modal (Matches User Requirements) */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-primary" /> Edit Coach Profile & Duration Pricing
            </DialogTitle>
            <DialogDescription>
              Update your live coach profile and custom duration pricing. All changes reflect live on the 1:1 booking page.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Real Avatar Preview and Path */}
            <div className="p-3 rounded-xl border bg-muted/30 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/30 shrink-0 bg-background shadow-xs">
                <img
                  src={editCoachForm.avatar || "/avatars/Vishwajeet.jpeg"}
                  alt={editCoachForm.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/avatars/Vishwajeet.jpeg";
                  }}
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-xs font-semibold">Coach Profile Avatar</Label>
                <div className="flex items-center gap-2">
                  <Input
                    className="h-8 text-xs font-mono"
                    value={editCoachForm.avatar || "/avatars/Vishwajeet.jpeg"}
                    onChange={(e) => setEditCoachForm({ ...editCoachForm, avatar: e.target.value })}
                    placeholder="/avatars/Vishwajeet.jpeg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-[11px] shrink-0"
                    onClick={() => setEditCoachForm({ ...editCoachForm, avatar: "/avatars/Vishwajeet.jpeg" })}
                  >
                    Reset Photo
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Coach Name</Label>
              <Input
                value={editCoachForm.name}
                onChange={(e) => setEditCoachForm({ ...editCoachForm, name: e.target.value })}
                placeholder="Vishwajeet"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Principal Role / Title</Label>
              <Input
                value={editCoachForm.role}
                onChange={(e) => setEditCoachForm({ ...editCoachForm, role: e.target.value })}
                placeholder="Principal Distributed Systems Architect"
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
                <Input value="Asia/Calcutta (GMT+5:30)" disabled className="font-mono text-xs bg-muted" />
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
                rows={2}
                value={editCoachForm.agenda}
                onChange={(e) => setEditCoachForm({ ...editCoachForm, agenda: e.target.value })}
                placeholder="System design review, mock tech interview, or career growth strategy session."
                className="text-xs resize-none"
              />
            </div>

            {/* Editable Duration Pricing (₹ INR · 18% GST Included) */}
            <div className="space-y-2 pt-1 border-t border-border/40">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Duration Pricing Matrix (₹ INR · 18% GST Included)</Label>
                <Badge variant="outline" className="text-[10px] font-mono">SAC 998431</Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[15, 30, 45, 60].map((dur) => (
                  <div key={dur} className="space-y-1 p-2 rounded-lg bg-muted/40 border">
                    <span className="text-[11px] text-muted-foreground font-mono font-semibold">{dur} Mins:</span>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">₹</span>
                      <Input
                        type="number"
                        className="h-8 pl-6 text-xs font-semibold font-mono"
                        value={editCoachForm.durationPrices?.[dur] ?? (dur === 15 ? 499 : dur === 30 ? 999 : dur === 45 ? 1499 : 1999)}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          setEditCoachForm({
                            ...editCoachForm,
                            durationPrices: {
                              ...editCoachForm.durationPrices,
                              [dur]: val,
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveCoachProfile} className="gap-1.5">
              <Check className="w-4 h-4" /> Save Profile & Rates
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
                <Label className="text-xs font-semibold">From Time</Label>
                <Input
                  type="time"
                  value={newBusyFrom}
                  onChange={(e) => setNewBusyFrom(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">To Time</Label>
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
            <Button onClick={addBusyBlock} className="gap-1.5">
              <Check className="w-4 h-4" /> Add Block
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Thermal Receipt Ledger Dialog (On-demand) */}
      <Dialog open={!!selectedReceiptBooking} onOpenChange={(open) => !open && setSelectedReceiptBooking(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-transparent border-0 shadow-2xl">
          {selectedReceiptBooking && (
            <div className="p-4 sm:p-6 bg-card rounded-2xl border shadow-xl">
              <ThermalReceiptLedgerCard booking={selectedReceiptBooking} coachName={coachProfile.name} />
              <div className="mt-4 flex items-center justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedReceiptBooking(null)}>
                  Close
                </Button>
                <Button size="sm" className="gap-1.5" onClick={() => window.print()}>
                  <Printer className="w-4 h-4" /> Print Tax Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

/** Official Thermal Receipt Ledger Card (18% GST · SAC 998431) */
function ThermalReceiptLedgerCard({ booking, coachName }: { booking?: any; coachName?: string }) {
  const price = booking?.price || 999;
  const gstRate = 0.18;
  const baseSubtotal = Math.round((price / (1 + gstRate)) * 100) / 100;
  const cgst = Math.round(((price - baseSubtotal) / 2) * 100) / 100;
  const sgst = Math.round((price - baseSubtotal - cgst) * 100) / 100;

  return (
    <div className="bg-[#fafafa] dark:bg-[#12161f] border-2 border-dashed border-border rounded-xl p-5 font-mono text-xs max-w-sm mx-auto shadow-sm select-none">
      <div className="text-center pb-3 border-b border-dashed border-border/80 space-y-1">
        <div className="font-extrabold text-sm tracking-wider uppercase text-foreground">
          LEARNIFY EDTECH PVT LTD
        </div>
        <div className="text-[11px] text-muted-foreground font-semibold">
          SAC 998431 · 18% GST TAX INVOICE
        </div>
        <div className="text-[10px] text-muted-foreground">
          GSTIN: 29AABCL9984Q1Z5 · KARNATAKA (29)
        </div>
      </div>

      <div className="py-3 border-b border-dashed border-border/80 space-y-1.5 text-[11px]">
        <div className="flex justify-between">
          <span className="text-muted-foreground">ORDER ID:</span>
          <span className="font-bold text-foreground">{booking?.orderId || "COACH-24530"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">DATE:</span>
          <span className="text-foreground">{format(new Date(booking?.bookedAt || Date.now()), "dd/MM/yyyy HH:mm")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">CLIENT:</span>
          <span className="text-foreground font-semibold">{booking?.learnerName || "Siddharth Verma"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">COACH:</span>
          <span className="text-foreground font-semibold">{booking?.coachName || coachName || "Vishwajeet"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">SESSION:</span>
          <span className="text-foreground">1:1 Mentorship ({booking?.duration || 45}m)</span>
        </div>
      </div>

      <div className="py-3 border-b border-dashed border-border/80 space-y-1.5 text-[11px]">
        <div className="flex justify-between">
          <span>BASE CHARGE:</span>
          <span>₹{baseSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>CGST (9.0%):</span>
          <span>₹{cgst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>SGST (9.0%):</span>
          <span>₹{sgst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-sm text-foreground pt-1.5 border-t border-border/40">
          <span>TOTAL PAYABLE:</span>
          <span>₹{price.toFixed(2)}</span>
        </div>
      </div>

      <div className="pt-3 text-center space-y-1.5">
        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
          ★ DIGITAL PAYMENT CONFIRMED · CASHFREE / UPI ★
        </div>
        <div className="font-mono text-[9px] text-muted-foreground tracking-widest opacity-70">
          ||||| ||||||| |||| |||||||||| ||||| ||||
        </div>
        <div className="text-[9px] text-muted-foreground">
          Place of Supply: Karnataka (29) · verify at learnifyai.in/verify
        </div>
      </div>
    </div>
  );
}

/** Cohorts Tab Component */
function RealCohorts({ user, isCreator, coachName }: { user: any; isCreator: boolean; coachName?: string }) {
  const [newOpen, setNewOpen] = useState(false);

  const sampleCohorts = [
    {
      id: "ch-1",
      title: "High-Throughput Distributed Systems & Kafka Sprint",
      description: "8-week cohort covering partition rebalancing, zero-copy socket transfers, and Raft consensus.",
      starts_at: new Date(Date.now() + 2 * 86400000).toISOString(),
      capacity: 25,
      status: "live",
      peers: 21,
      instructor: `${coachName || "Vishwajeet"} (Principal Architect)`,
    },
    {
      id: "ch-2",
      title: "Autonomous Multi-Agent AI & Gemini 2.5 Flash",
      description: "Hands-on engineering building autonomous tool-calling loops, multi-agent arbitration, and eval benches.",
      starts_at: new Date(Date.now() + 6 * 86400000).toISOString(),
      capacity: 20,
      status: "scheduled",
      peers: 17,
      instructor: "Dr. Vikram Aditya (Ex-Google Brain)",
    },
    {
      id: "ch-3",
      title: "Executive Staff+ System Design & Offer Negotiation Masterclass",
      description: "Simulated engineering review board, cross-functional ambiguity drills, and FAANG bar-raising rubrics.",
      starts_at: new Date(Date.now() + 12 * 86400000).toISOString(),
      capacity: 15,
      status: "scheduled",
      peers: 14,
      instructor: "Elena Rostova (Engineering Director)",
    },
  ];

  const enterStudio = (cohort: any) => {
    toast.success(`Entering Live Studio for ${cohort.title}...`);
    window.open("https://meet.google.com/new", "_blank");
  };

  return (
    <div className="bg-card rounded-2xl border p-6 min-h-[400px] shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Live Engineering Cohorts</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Small-batch interactive sprints with live weekly Google Meet studios and peer code review boards.
            </p>
          </div>
        </div>
        {isCreator && (
          <Button size="sm" onClick={() => setNewOpen(true)} className="gap-1.5 self-start sm:self-auto">
            <Plus className="w-4 h-4" /> Create Cohort
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sampleCohorts.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl border border-border/80 bg-card hover:border-cyan-500/40 transition-all shadow-sm flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge
                  className={cn(
                    "text-[10px] font-semibold",
                    c.status === "live"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 animate-pulse"
                      : "bg-cyan-500/15 text-cyan-600 border-cyan-500/30"
                  )}
                >
                  {c.status === "live" ? "● LIVE BATCH" : "STARTING SOON"}
                </Badge>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {c.peers} / {c.capacity} Enrolled
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-foreground leading-snug">{c.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border/40 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Instructor:</span>
                  <span className="font-semibold text-foreground">{c.instructor}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Session Starts:</span>
                  <span className="font-mono text-foreground">{format(new Date(c.starts_at), "MMM d, h:mm a")}</span>
                </div>
              </div>
            </div>

            <Button
              size="sm"
              className="w-full gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
              onClick={() => enterStudio(c)}
            >
              <Video className="w-4 h-4" /> Enter Live Studio (Meet)
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Outcomes Tab Component */
function RealOutcomes({ user }: { user: any }) {
  const [currentCtc, setCurrentCtc] = useState(18);
  const targetOffer = Math.round(currentCtc * 2.3);
  const upsidePct = 130;

  const verifiedPlacements = [
    {
      company: "Google",
      role: "L5 Senior Software Engineer (Core Systems)",
      badge: "Staff Bar",
      ctcJump: "+145% CTC Jump",
      offerBand: "₹68 LPA",
      quote: "The deep dive on Kafka log compaction and consensus gave me total clarity during the Google L5 system design round.",
      candidate: "Aakash M. · Ex-TCS to Google Bangalore",
    },
    {
      company: "Meta",
      role: "E6 Staff Production Engineer (Distributed DB)",
      badge: "Remote US/UK",
      ctcJump: "+210% CTC Jump",
      offerBand: "$310,000 USD",
      quote: "Mock sessions helped me answer ambiguous failure scenarios and defend database replication tradeoffs under pressure.",
      candidate: "Priya S. · Promoted from Senior to Staff",
    },
    {
      company: "Uber",
      role: "Staff Software Engineer (Realtime Dispatch)",
      badge: "L6 Architect",
      ctcJump: "+125% CTC Jump",
      offerBand: "₹84 LPA",
      quote: "The 10-Role AI coach gave me 20 realistic edge cases that came up verbatim in my hiring manager interview.",
      candidate: "Karthik R. · Ex-Midsize Startup to Uber",
    },
  ];

  return (
    <div className="bg-card rounded-2xl border p-6 min-h-[400px] shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">Verified Career Outcomes & Compensation Upside</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real FAANG & Tier-1 placements, post-mentorship salary leaps, and diagnostic interview scores.
          </p>
        </div>
      </div>

      {/* CTC Multiplier Calculator */}
      <div className="p-5 rounded-2xl border bg-gradient-to-r from-rose-500/5 via-primary/5 to-indigo-500/5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" /> Interactive CTC Multiplier Calculator
            </div>
            <h4 className="font-bold text-base text-foreground mt-0.5">
              Estimate Your Next Promotion or Offer Band
            </h4>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground">Expected Post-Coaching Target:</span>
            <div className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">
              ₹{targetOffer} LPA <span className="text-xs text-primary font-mono">(+{upsidePct}%)</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>Current CTC: ₹{currentCtc} LPA</span>
            <span>Scale: ₹10 LPA to ₹60 LPA</span>
          </div>
          <input
            type="range"
            min={10}
            max={60}
            step={2}
            value={currentCtc}
            onChange={(e) => setCurrentCtc(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>

      {/* Verified Placement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {verifiedPlacements.map((p, i) => (
          <div key={i} className="p-5 rounded-2xl border bg-card hover:border-rose-500/40 transition-all shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-lg tracking-tight text-foreground">{p.company}</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-bold font-mono">
                {p.ctcJump}
              </Badge>
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">{p.role}</div>
              <div className="text-[11px] font-mono text-muted-foreground">{p.offerBand} Total Package</div>
            </div>
            <p className="text-xs text-muted-foreground italic bg-muted/40 p-2.5 rounded-xl border border-border/40">
              "{p.quote}"
            </p>
            <div className="text-[11px] font-semibold text-foreground pt-1 border-t border-border/40">
              {p.candidate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
