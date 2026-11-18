"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Sparkles,
  Bot,
  RotateCcw,
  Square,
  Copy,
  Check,
  Search,
  Paperclip,
  Mic,
  MicOff,
  User,
  Users,
  Compass,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  X,
  FileCode,
  Image as ImageIcon,
  FileText,
  Bookmark,
  Share2,
  ThumbsUp,
  Heart,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Eye,
  EyeOff,
  Layers,
  Wrench,
  CheckCircle2,
  Terminal,
  Play,
  HelpCircle,
  Clock,
  RefreshCw,
  Plus,
  Phone,
  Sliders,
  Table,
  Presentation,
  Mail,
  GraduationCap,
  Target,
  Code2,
  MessageSquare,
  Zap,
  Pin,
  PinOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MENTORS, type MentorRole, type CoachingMode } from "./mentorData";
import { MentorAvatar } from "./MentorAvatar";
import { MentorProfileDialog } from "./MentorProfileDialog";
import { LiveOrb } from "@/components/ui/live-orb";
import { careerCoachChat } from "@/lib/career-coach.functions";
import { MentorUpgradeDialog } from "./MentorUpgradeDialog";
import { MentorVoiceCallDialog } from "./MentorVoiceCallDialog";
import {
  GmailActionCard,
  GoogleDocsActionCard,
  GoogleSheetsActionCard,
  GoogleSlidesActionCard,
  PluginToolbar,
} from "./PluginActionCards";
import {
  getMentorCustomization,
  type MentorCustomization,
} from "./mentorCustomization";
import { playBassPulse } from "./speechUtils";
import { MotionGrid, MotionGridCells } from "@/components/animate-ui/motion-grid";
import { IconButtonParticles } from "@/components/animate-ui/icon-button";
import { AutoHeight } from "@/components/animate-ui/auto-height";
import { startSpeechRecognition, type VoiceRecognitionSession } from "./speechUtils";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  status?: "sending" | "thinking" | "streaming" | "complete" | "failed";
  reactions?: string[];
  saved?: boolean;
  artifact?: {
    type: "blueprint" | "code_patch" | "star_scorecard" | "roadmap";
    title: string;
    description: string;
    content: string;
  };
  pluginCard?: {
    type: "gmail" | "docs" | "sheets" | "slides";
    title?: string;
    data: any;
  };
  toolsUsed?: string[];
}

export interface StoredConversation {
  mentorId: string;
  messages: ChatMessage[];
  lastUpdated: number;
  mode: CoachingMode;
}

interface AiMentorMessengerProps {
  user?: any;
  contacts?: any[];
  activeChatUser?: any;
  setActiveChatUser?: (c: any) => void;
  peerMessages?: any[];
  onSendPeerMessage?: (text: string) => void;
  onOpenBookingModal?: () => void;
}

const COACHING_MODES: Array<{ id: CoachingMode; label: string; icon: any; desc: string }> = [
  { id: "chat", label: "Direct Chat", icon: MessageSquare, desc: "Conversational 1-on-1 coaching" },
  { id: "teach_me", label: "Teach Me", icon: GraduationCap, desc: "Socratic deep-dive with analogies" },
  { id: "practice", label: "Practice Challenge", icon: Zap, desc: "Hands-on engineering problem" },
  { id: "mock_interview", label: "Mock Interview", icon: Target, desc: "FAANG-style interview simulation" },
  { id: "code_review", label: "Code Review", icon: Code2, desc: "Correctness, security & performance" },
  { id: "career_plan", label: "Career Plan", icon: Compass, desc: "Target role & roadmap milestones" },
  { id: "guide_me", label: "Guide Me", icon: Layers, desc: "Step-by-step phased curriculum" },
];

const GUIDED_STEPS: Record<string, string[]> = {
  system_architect: [
    "1. Requirements & Scope",
    "2. Capacity & Scale Math",
    "3. High-Level Architecture",
    "4. Data Model & Storage",
    "5. Failure Modes & Latency",
    "6. Trade-off Matrix",
  ],
  frontend_architect: [
    "1. Component Hierarchy",
    "2. State Flow & Re-renders",
    "3. Motion & UX Physics",
    "4. Core Web Vitals",
    "5. Accessibility Audit",
  ],
  dsa_maestro: [
    "1. Intuition & Pattern",
    "2. Mathematical Invariant",
    "3. Pseudocode & Traps",
    "4. Big-O Space/Time",
    "5. Production Code",
  ],
  executive_leadership: [
    "1. Situation (Context)",
    "2. Task (Ownership)",
    "3. Action (Leadership)",
    "4. Result (Metrics)",
    "5. Executive Polish",
  ],
};

export function AiMentorMessenger({
  user,
  contacts = [],
  activeChatUser,
  setActiveChatUser,
  peerMessages = [],
  onSendPeerMessage,
  onOpenBookingModal,
}: AiMentorMessengerProps) {
  // Navigation State
  const [messengerTab, setMessengerTab] = useState<"mentors" | "peers">("mentors");
  const [selectedMentor, setSelectedMentor] = useState<MentorRole>(MENTORS[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  // Active Coaching Mode
  const [activeMode, setActiveMode] = useState<CoachingMode>("chat");
  const [guidedStepIndex, setGuidedStepIndex] = useState(0);

  // Conversation Management
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>({});
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamStatus, setStreamStatus] = useState<"idle" | "thinking" | "streaming">("idle");
  const [peerInput, setPeerInput] = useState("");
  const [attachments, setAttachments] = useState<Array<{ name: string; type: string; size: string }>>([]);

  // Voice Input & Call State
  const [isRecording, setIsRecording] = useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [voiceCallDialogOpen, setVoiceCallDialogOpen] = useState(false);
  const [mentorConfig, setMentorConfig] = useState<MentorCustomization>(() => getMentorCustomization(selectedMentor.id));
  const voiceSessionRef = useRef<VoiceRecognitionSession | null>(null);

  // Sync customized preferences on mentor switch
  useEffect(() => {
    setMentorConfig(getMentorCustomization(selectedMentor.id));
  }, [selectedMentor.id]);

  // Pinned Mentors State (defaults to Maya Lin & Elena Rostova)
  const [pinnedMentorIds, setPinnedMentorIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("learnify_pinned_mentors");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return ["system_architect", "frontend_architect"];
  });

  const togglePinMentor = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedMentorIds((prev) => {
      const isCurrentlyPinned = prev.includes(id);
      const next = isCurrentlyPinned ? prev.filter((p) => p !== id) : [...prev, id];
      try {
        localStorage.setItem("learnify_pinned_mentors", JSON.stringify(next));
      } catch {}
      toast.success(isCurrentlyPinned ? "Mentor unpinned" : "Mentor pinned to top");
      return next;
    });
  };

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const runCareerCoach = useServerFn(careerCoachChat);

  // Load conversations from localStorage on mount & clean legacy robotic messages
  useEffect(() => {
    try {
      const stored = localStorage.getItem("learnify_ai_mentor_chats_v2");
      if (stored) {
        const parsed = JSON.parse(stored);
        let updated = false;
        Object.keys(parsed).forEach((mentorId) => {
          parsed[mentorId] = (parsed[mentorId] || []).map((msg: ChatMessage) => {
            if (
              msg.role === "assistant" &&
              (msg.content.includes("operating at full capacity") ||
               msg.content.includes("brief glitch on the audio line") ||
               (msg.content.includes("Chat context reset for") && parsed[mentorId].length <= 2))
            ) {
              updated = true;
              const mentor = MENTORS.find((m) => m.id === mentorId);
              return {
                ...msg,
                content: mentor?.initialMessage || "Hi Vishwajeet! Let's dive into high-leverage architecture and engineering drills today. What challenge are we tackling?",
              };
            }
            return msg;
          });
        });
        setConversations(parsed);
        if (updated) {
          localStorage.setItem("learnify_ai_mentor_chats_v2", JSON.stringify(parsed));
        }
      } else {
        // Initialize default greetings for all 10 mentors
        const initial: Record<string, ChatMessage[]> = {};
        MENTORS.forEach((m) => {
          initial[m.id] = [
            {
              id: `welcome-${m.id}`,
              role: "assistant",
              content: m.initialMessage,
              timestamp: Date.now() - 60000,
              status: "complete",
            },
          ];
        });
        setConversations(initial);
      }
    } catch {
      // Fallback
    }
  }, []);

  // Persist conversations to localStorage
  useEffect(() => {
    if (Object.keys(conversations).length > 0) {
      try {
        localStorage.setItem("learnify_ai_mentor_chats_v2", JSON.stringify(conversations));
      } catch {
        // storage quota exceeded or disabled
      }
    }
  }, [conversations]);

  // Current active mentor messages
  const activeMessages = useMemo(() => {
    return (
      conversations[selectedMentor.id] || [
        {
          id: `welcome-${selectedMentor.id}`,
          role: "assistant",
          content: selectedMentor.initialMessage,
          timestamp: Date.now(),
          status: "complete",
        },
      ]
    );
  }, [conversations, selectedMentor.id, selectedMentor.initialMessage]);

  // Auto-scroll when messages update, but respect user reading position
  useEffect(() => {
    const el = chatScrollContainerRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;
    if (isNearBottom || isGenerating) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeMessages, streamStatus]);

  // Filtered mentors list
  const filteredMentors = useMemo(() => {
    return MENTORS.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (categoryFilter === "all") return true;
      if (categoryFilter === "code") return ["architecture", "frontend", "algorithms", "fullstack"].includes(m.category);
      if (categoryFilter === "ai") return ["ai", "cloud"].includes(m.category);
      if (categoryFilter === "career") return ["leadership", "product", "career", "business"].includes(m.category);
      return true;
    });
  }, [searchQuery, categoryFilter]);

  // Sorted mentors with pinned at top
  const sortedMentors = useMemo(() => {
    return [...filteredMentors].sort((a, b) => {
      const aPinned = pinnedMentorIds.includes(a.id);
      const bPinned = pinnedMentorIds.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }, [filteredMentors, pinnedMentorIds]);

  // Send message handler with true typing & streaming states
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputMessage).trim();
    if (!text || isGenerating) return;

    const userMsgId = `usr-${Date.now()}`;
    const assistantMsgId = `asst-${Date.now() + 1}`;

    const userMessage: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: text,
      timestamp: Date.now(),
      status: "complete",
    };

    // Append attachments info if any
    if (attachments.length > 0) {
      const attachDesc = attachments.map((a) => `[Attached ${a.type}: ${a.name}]`).join("\n");
      userMessage.content += `\n\n${attachDesc}`;
      setAttachments([]);
    }

    // Append user message immediately
    setConversations((prev) => ({
      ...prev,
      [selectedMentor.id]: [...(prev[selectedMentor.id] || []), userMessage],
    }));

    setInputMessage("");
    setIsGenerating(true);
    setStreamStatus("thinking");
    playBassPulse("message");

    // Contextual system instruction adjustments based on coaching mode
    let modeInstruction = "";
    if (activeMode === "teach_me") {
      modeInstruction = " [MODE: Teach Me — Use Socratic questions, vivid analogies, and small digestible concept steps.]";
    } else if (activeMode === "mock_interview") {
      modeInstruction = " [MODE: Mock Interview — Act as a strict FAANG interviewer. Ask one challenging question at a time. Evaluate previous response with quantitative rubric.]";
    } else if (activeMode === "code_review") {
      modeInstruction = " [MODE: Code Review — Provide a structured checklist of Correctness, Performance, Security, and Code Quality with before/after snippets.]";
    } else if (activeMode === "career_plan") {
      modeInstruction = " [MODE: Career Plan — Break down advice into concrete 30-day, 60-day, and 90-day actionable milestones.]";
    } else if (activeMode === "guide_me") {
      const currentStep = GUIDED_STEPS[selectedMentor.id]?.[guidedStepIndex] || `Step ${guidedStepIndex + 1}`;
      modeInstruction = ` [MODE: Guide Me — Currently at ${currentStep}. Focus specifically on this step and provide practice checks.]`;
    }

    try {
      // 1. Call AI Server Function with mentor prompt & history
      const history = activeMessages.slice(-10).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      // Simulate network thinking transition
      await new Promise((r) => setTimeout(r, 600));
      setStreamStatus("streaming");

      const activePluginNames = Object.entries(mentorConfig.plugins)
        .filter(([_, v]) => v)
        .map(([k]) => k)
        .join(", ");

      const customSkillsSummary = (mentorConfig.customSkills || [])
        .map((s) => `[Skill: ${s.name}]\n${s.content.slice(0, 1500)}`)
        .join("\n\n");

      const isHindiQuery = /[\u0900-\u097F]/.test(userMessage.content) || /\b(kaise|kya|kyun|haan|nahi|namaste|bhai|theek|sunte|karo|batao|shukriya|boliye)\b/i.test(userMessage.content);
      const languageDirective = isHindiQuery ? "User is asking in Hindi/Hinglish. Respond in friendly, fluent Hindi/Hinglish." : "";

      const profilePayload = `User Name: ${user?.user_metadata?.full_name || "Learner"}.
Mentor Persona: ${mentorConfig.customName || selectedMentor.name} (${mentorConfig.customTitle || selectedMentor.title}).
Learner Background: ${mentorConfig.learnerBackground || "Software Engineer"}.
Target Career Goal: ${mentorConfig.careerGoal || "Staff Engineering Leadership"}.
Mentor Tone: ${mentorConfig.preferredTone}.
${languageDirective}
Custom Directives: ${mentorConfig.customPrompt || "Provide clear, structured, actionable engineering advice."}
Active Work Plugins: ${activePluginNames}. Mode: ${activeMode}.
Google Workspace Sync: ${mentorConfig.googleConnected ? "Active (support.learnifyai@gmail.com)" : "Disabled"}.
${customSkillsSummary ? `\nSkill Engine Knowledge Base:\n${customSkillsSummary}` : ""}`;

      const response = await runCareerCoach({
        data: {
          content: userMessage.content + modeInstruction,
          history,
          coachRole: selectedMentor.id,
          userProfile: profilePayload,
        },
      });

      const fullContent = response.content || "I have analyzed your request and prepared your structured recommendations.";

      // 2. Incremental streaming text appearance for natural typing feel
      let streamedLength = 0;
      const chunkSize = Math.max(12, Math.floor(fullContent.length / 30));

      // Append assistant placeholder
      setConversations((prev) => ({
        ...prev,
        [selectedMentor.id]: [
          ...(prev[selectedMentor.id] || []),
          {
            id: assistantMsgId,
            role: "assistant",
            content: "",
            timestamp: Date.now(),
            status: "streaming",
            toolsUsed: response.steps?.filter((s: any) => s.type === "tool_call").map((s: any) => s.name),
          },
        ],
      }));

      const streamTimer = setInterval(() => {
        streamedLength += chunkSize;
        const currentSlice = fullContent.slice(0, streamedLength);

        setConversations((prev) => {
          const list = prev[selectedMentor.id] || [];
          return {
            ...prev,
            [selectedMentor.id]: list.map((msg) =>
              msg.id === assistantMsgId ? { ...msg, content: currentSlice } : msg
            ),
          };
        });

        if (streamedLength >= fullContent.length) {
          clearInterval(streamTimer);
          playBassPulse("message");
          // Mark complete & detect if an artifact was created
          let artifactData: any = undefined;
          if (fullContent.includes("```") && (fullContent.includes("class ") || fullContent.includes("function ") || fullContent.includes("interface "))) {
            artifactData = {
              type: "code_patch",
              title: `${selectedMentor.name}'s Recommended Implementation`,
              description: "Production-ready engineering snippet with validation checks",
              content: fullContent,
            };
          } else if (fullContent.toLowerCase().includes("architecture") || fullContent.toLowerCase().includes("system design")) {
            artifactData = {
              type: "blueprint",
              title: `${selectedMentor.title} Blueprint`,
              description: "High-throughput architecture blueprint with component boundaries",
              content: fullContent,
            };
          }

          setConversations((prev) => {
            const list = prev[selectedMentor.id] || [];
            return {
              ...prev,
              [selectedMentor.id]: list.map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, content: fullContent, status: "complete", artifact: artifactData }
                  : msg
              ),
            };
          });

          setIsGenerating(false);
          setStreamStatus("idle");
        }
      }, 35);
    } catch (err: any) {
      toast.error(err?.message || "AI Mentor response interrupted. Retrying...");
      setConversations((prev) => ({
        ...prev,
        [selectedMentor.id]: [
          ...(prev[selectedMentor.id] || []),
          {
            id: assistantMsgId,
            role: "assistant",
            content: "I encountered a brief connection interruption. Please click Retry below to continue our discussion.",
            timestamp: Date.now(),
            status: "failed",
          },
        ],
      }));
      setIsGenerating(false);
      setStreamStatus("idle");
    }
  };

  // Stop generation
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
    setStreamStatus("idle");
    toast.info("AI response generation halted.");
  };

  // Retry failed message
  const handleRetry = () => {
    const lastUserMsg = [...activeMessages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  // Message reaction handler
  const handleToggleReaction = (msgId: string, emoji: string) => {
    setConversations((prev) => {
      const list = prev[selectedMentor.id] || [];
      return {
        ...prev,
        [selectedMentor.id]: list.map((m) => {
          if (m.id !== msgId) return m;
          const current = m.reactions || [];
          const updated = current.includes(emoji)
            ? current.filter((r) => r !== emoji)
            : [...current, emoji];
          return { ...m, reactions: updated };
        }),
      };
    });
  };

  // Bookmark / Save to library
  const handleToggleSave = (msgId: string) => {
    setConversations((prev) => {
      const list = prev[selectedMentor.id] || [];
      return {
        ...prev,
        [selectedMentor.id]: list.map((m) => {
          if (m.id !== msgId) return m;
          const newState = !m.saved;
          toast.success(newState ? "Saved to Learning Library!" : "Removed from Library");
          return { ...m, saved: newState };
        }),
      };
    });
  };

  // Clear conversation history
  const handleClearChat = () => {
    setConversations((prev) => ({
      ...prev,
      [selectedMentor.id]: [
        {
          id: `welcome-${selectedMentor.id}-${Date.now()}`,
          role: "assistant",
          content: `Chat context reset for ${selectedMentor.name}. What architecture or skill challenge shall we tackle next?`,
          timestamp: Date.now(),
          status: "complete",
        },
      ],
    }));
    toast.success(`Started new conversation with ${selectedMentor.name}`);
  };

  // Voice recording toggle using deduplicated speechUtils
  const handleToggleSpeech = () => {
    if (isRecording) {
      if (voiceSessionRef.current) {
        voiceSessionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const session = startSpeechRecognition({
      onResult: (transcript: string) => {
        if (transcript) {
          setInputMessage(transcript);
        }
      },
      onError: () => {
        setIsRecording(false);
        toast.error("Microphone input error.");
      },
      onEnd: () => {
        setIsRecording(false);
      },
    });

    if (session.isSupported) {
      voiceSessionRef.current = session;
      setIsRecording(true);
      toast.info("Listening... speak your engineering question.");
    } else {
      toast.error("Speech recognition is not supported in this browser.");
    }
  };

  // Handle triggering a plugin action directly from toolbar
  const handleTriggerPlugin = (pluginId: "gmail" | "docs" | "sheets" | "slides" | "github" | "web") => {
    if (pluginId === "gmail") {
      const draft = {
        to: "recruiter@techcorp.com",
        subject: `Application for Senior Software Engineer - Referral Follow-up`,
        body: `Hi there,\n\nI hope you're doing well. I wanted to follow up on my recent application for the Senior Software Engineer position.\n\nBest regards,\n[Your Name]`,
      };
      const newMsg: ChatMessage = {
        id: `plugin-gmail-${Date.now()}`,
        role: "assistant",
        content: `I've prepared a high-conversion follow-up email draft tailored for tech recruiters. You can launch it directly in Gmail with one click:`,
        timestamp: Date.now(),
        status: "complete",
        pluginCard: {
          type: "gmail",
          title: "Gmail Draft",
          data: draft,
        },
      };
      setConversations((prev) => ({
        ...prev,
        [selectedMentor.id]: [...(prev[selectedMentor.id] || []), newMsg],
      }));
      toast.success("Gmail action ready!");
    } else if (pluginId === "docs") {
      const docData = {
        title: `${selectedMentor.name} - System RFC & Architecture Spec`,
        content: `# System Architecture Specification\nPrepared by ${selectedMentor.name} (AI Mentor)\n\n## 1. Executive Summary\nHigh-throughput, event-driven microservices architecture targeting 99.99% availability.\n\n## 2. Key Components\n- API Gateway with JWT & rate limiting\n- Distributed Event Bus (Kafka / NATS)\n- Read-optimized PostgreSQL + Redis cache layer\n\n## 3. SLA & Observability\n- P99 latency < 80ms\n- OpenTelemetry tracing & Prometheus metrics`,
      };
      const newMsg: ChatMessage = {
        id: `plugin-docs-${Date.now()}`,
        role: "assistant",
        content: `I've drafted a production-grade System Architecture Spec / RFC. Click below to copy and create your Google Doc instantly:`,
        timestamp: Date.now(),
        status: "complete",
        pluginCard: {
          type: "docs",
          title: docData.title,
          data: docData,
        },
      };
      setConversations((prev) => ({
        ...prev,
        [selectedMentor.id]: [...(prev[selectedMentor.id] || []), newMsg],
      }));
      toast.success("Google Docs spec ready!");
    } else if (pluginId === "sheets") {
      const csvContent = `Company,Role,Stage,Target Base,Status,Follow-up Date\nGoogle,Staff SWE,Onsite Scheduled,₹85,00,000,In Progress,Nov 24\nMicrosoft,Principal SDE,Technical Screen,₹78,00,000,In Progress,Nov 28\nSwiggy,Lead Architect,Offer Discussion,₹65,00,000,Offer Received,Dec 01\nRazorpay,Staff Engineer,System Design 2,₹70,00,000,In Progress,Dec 05`;
      const sheetData = {
        title: "Tech Compensation & Interview Pipeline Tracker",
        csvData: csvContent,
      };
      const newMsg: ChatMessage = {
        id: `plugin-sheets-${Date.now()}`,
        role: "assistant",
        content: `Here is your structured pipeline tracker table. You can export as CSV or open in Google Sheets:`,
        timestamp: Date.now(),
        status: "complete",
        pluginCard: {
          type: "sheets",
          title: sheetData.title,
          data: sheetData,
        },
      };
      setConversations((prev) => ({
        ...prev,
        [selectedMentor.id]: [...(prev[selectedMentor.id] || []), newMsg],
      }));
      toast.success("Google Sheets table generated!");
    } else if (pluginId === "slides") {
      const slideData = {
        title: "Executive System Design Presentation",
        slides: [
          {
            slideNumber: 1,
            title: "Scalable Event Architecture",
            bullets: [
              "Event-driven architecture decoupling ingestion from processing",
              "Sub-50ms ingestion latency under 50,000 rps load",
              "Idempotent event consumers with Dead Letter Queue fallback",
            ],
            notes: "Highlight decoupling advantages and backpressure handling.",
          },
          {
            slideNumber: 2,
            title: "Data Layer & Partitioning",
            bullets: [
              "PostgreSQL primary with read replicas and connection pooling (PgBouncer)",
              "Multi-region Redis clusters for session & cached state",
              "Consistent hashing across distributed worker nodes",
            ],
            notes: "Emphasize connection pooling to prevent DB thread exhaustion.",
          },
          {
            slideNumber: 3,
            title: "Resilience & Chaos Engineering",
            bullets: [
              "Circuit breaker pattern with Resilience4j/Envoy",
              "Automated canary deployments with Istio service mesh",
              "Zero-downtime database schema migrations",
            ],
            notes: "Mention automated rollback upon error budget breach.",
          },
        ],
      };
      const newMsg: ChatMessage = {
        id: `plugin-slides-${Date.now()}`,
        role: "assistant",
        content: `I've prepared a slide deck outline for your executive design presentation:`,
        timestamp: Date.now(),
        status: "complete",
        pluginCard: {
          type: "slides",
          title: slideData.title,
          data: slideData,
        },
      };
      setConversations((prev) => ({
        ...prev,
        [selectedMentor.id]: [...(prev[selectedMentor.id] || []), newMsg],
      }));
      toast.success("Google Slides deck ready!");
    } else if (pluginId === "github") {
      setInputMessage("Audit this GitHub repository architecture and suggest structural refactoring improvements: ");
    } else if (pluginId === "web") {
      setInputMessage("Search live benchmarks and current industry standard salary/architectural patterns for: ");
    }
  };

  // Add dummy file attachment
  const handleAddAttachment = (type: string, name: string) => {
    setAttachments((prev) => [...prev, { name, type, size: "128 KB" }]);
    toast.success(`Attached ${name}`);
  };

  return (
    <div className="w-full bg-card border rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl flex flex-col h-[calc(100dvh-140px)] min-h-[580px] max-h-[860px]">
      {/* Mentor Profile Dialog */}
      <MentorProfileDialog
        mentor={selectedMentor}
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        onSelectPrompt={(p) => handleSendMessage(p)}
        activeMode={activeMode}
        onModeChange={setActiveMode}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* ============================================================== */}
        {/* LEFT PANEL: SOCIAL MENTOR / CONTACT LIST                       */}
        {/* ============================================================== */}
        <div
          className={cn(
            "w-full sm:w-72 lg:w-80 border-r bg-muted/15 flex flex-col shrink-0 transition-all duration-300",
            mobileShowChat ? "hidden sm:flex" : "flex"
          )}
        >
          {/* Header Switcher: AI Mentors vs Peer Contacts */}
          <div className="p-3.5 border-b bg-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-display text-foreground">Direct Messenger</span>
                <Badge variant="outline" className="text-[10px] font-bold py-0 px-1.5 bg-primary/10 text-primary border-primary/20">
                  v2.0
                </Badge>
              </div>
              <div className="flex items-center p-0.5 rounded-xl bg-muted border">
                <button
                  onClick={() => setMessengerTab("mentors")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1",
                    messengerTab === "mentors"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Bot className="w-3 h-3 text-primary" />
                  <span>AI Mentors</span>
                </button>
                <button
                  onClick={() => setMessengerTab("peers")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1",
                    messengerTab === "peers"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span>Peers</span>
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={messengerTab === "mentors" ? "Search AI mentors or topics..." : "Search peer students..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl bg-muted/40 border-border/70"
              />
            </div>

            {/* Quick Category Filter Pills (When in Mentors view) */}
            {messengerTab === "mentors" && (
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
                {[
                  { id: "all", label: "All 10" },
                  { id: "code", label: "Code & Arch" },
                  { id: "ai", label: "AI & Cloud" },
                  { id: "career", label: "Career & Biz" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-all",
                      categoryFilter === cat.id
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-card hover:bg-muted text-muted-foreground border border-border/60"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Social Contact Rows */}
          <ScrollArea className="flex-1">
            {messengerTab === "mentors" ? (
              <div className="p-2 space-y-1">
                {sortedMentors.map((mentor) => {
                  const isSelected = selectedMentor.id === mentor.id;
                  const isPinned = pinnedMentorIds.includes(mentor.id);
                  const msgs = conversations[mentor.id] || [];
                  const lastMsg = msgs[msgs.length - 1];
                  const previewText = lastMsg ? lastMsg.content : mentor.specialty;

                  return (
                    <button
                      key={mentor.id}
                      onClick={() => {
                        setSelectedMentor(mentor);
                        setMobileShowChat(true);
                      }}
                      className={cn(
                        "w-full p-2.5 rounded-2xl text-left transition-all flex items-center gap-3 cursor-pointer group relative border",
                        isSelected
                          ? "bg-primary/10 border-primary/40 shadow-xs ring-1 ring-primary/20"
                          : "hover:bg-muted/50 border-transparent"
                      )}
                    >
                      <MentorAvatar
                        mentor={mentor}
                        size="md"
                        status={isSelected && isGenerating ? "thinking" : "available"}
                      />

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {mentor.name}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            {/* Pin / Unpin Button */}
                            <span
                              onClick={(e) => togglePinMentor(mentor.id, e)}
                              className={cn(
                                "p-1 rounded-md transition-all hover:bg-muted/80 text-muted-foreground hover:text-foreground cursor-pointer",
                                isPinned ? "opacity-100 text-primary" : "opacity-0 group-hover:opacity-80"
                              )}
                              title={isPinned ? "Unpin Mentor" : "Pin Mentor to Top"}
                            >
                              {isPinned ? <PinOff className="w-3 h-3 text-primary" /> : <Pin className="w-3 h-3" />}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {lastMsg ? format(new Date(lastMsg.timestamp), "HH:mm") : "Online"}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-primary/80 font-medium truncate">
                          {mentor.title}
                        </p>

                        <p className="text-[11px] text-muted-foreground truncate">
                          {previewText}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Peer Contacts List */
              <div className="p-2 space-y-1">
                {contacts.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground space-y-2">
                    <Users className="w-8 h-8 mx-auto opacity-30" />
                    <p className="text-xs">No peer connections yet.</p>
                    <Button size="sm" variant="outline" onClick={onOpenBookingModal} className="text-xs h-8">
                      Book 1:1 Session
                    </Button>
                  </div>
                ) : (
                  contacts.map((c: any) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveChatUser?.(c);
                        setMobileShowChat(true);
                      }}
                      className={cn(
                        "w-full p-2.5 rounded-2xl text-left flex items-center gap-3 transition-all",
                        activeChatUser?.id === c.id
                          ? "bg-accent border-primary ring-1 ring-primary/20"
                          : "hover:bg-muted/40 border-transparent"
                      )}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 border flex items-center justify-center font-bold text-xs">
                        {c.full_name?.[0] || "U"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-foreground truncate">{c.full_name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">Peer Student</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* ============================================================== */}
        {/* RIGHT PANEL: CONVERSATION STREAM & COMPOSER                    */}
        {/* ============================================================== */}
        <div
          className={cn(
            "flex-1 flex flex-col bg-background min-w-0 relative",
            !mobileShowChat ? "hidden sm:flex" : "flex"
          )}
        >
          {messengerTab === "mentors" ? (
            <>
              {/* Active Mentor Header */}
              <div className="h-16 px-3 sm:px-4 border-b bg-card flex items-center justify-between gap-2 sm:gap-3 shrink-0">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
                  {/* Mobile Back Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="sm:hidden h-8 w-8 shrink-0"
                    onClick={() => setMobileShowChat(false)}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  {/* Header Mentor Avatar */}
                  <div
                    onClick={() => setProfileDialogOpen(true)}
                    className="cursor-pointer group flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden"
                  >
                    <MentorAvatar
                      mentor={selectedMentor}
                      size="md"
                      status={isGenerating ? "thinking" : "available"}
                      customColor={mentorConfig.customAvatarColor}
                      showStatusIndicator={true}
                    />

                    <div className="min-w-0 flex-1 flex flex-col justify-center overflow-hidden">
                      <div className="flex items-center gap-1.5 flex-nowrap min-w-0">
                        <h3 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors min-w-0">
                          {mentorConfig.customName || selectedMentor.name}
                        </h3>
                        <Badge variant="outline" className="hidden xl:inline-flex text-[10px] py-0 px-1.5 font-bold border-primary/30 text-primary shrink-0">
                          {selectedMentor.badge}
                        </Badge>
                        <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-emerald-500 font-semibold font-mono shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Available
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate min-w-0">
                        {mentorConfig.customTitle || selectedMentor.title}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Header Action Controls */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  {/* Coaching Mode Selector Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-semibold gap-1 sm:gap-1.5 rounded-xl border-border/80 px-2 sm:px-2.5"
                      >
                        {(() => {
                          const IconComp = COACHING_MODES.find((m) => m.id === activeMode)?.icon || MessageSquare;
                          return <IconComp className="w-3.5 h-3.5 text-primary" />;
                        })()}
                        <span className="hidden md:inline">{COACHING_MODES.find((m) => m.id === activeMode)?.label}</span>
                        <ChevronDown className="w-3 h-3 opacity-60" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-2xl">
                      <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase px-2 py-1">
                        Coaching Mode
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {COACHING_MODES.map((mode) => {
                        const IconComp = mode.icon;
                        return (
                          <DropdownMenuItem
                            key={mode.id}
                            onClick={() => {
                              setActiveMode(mode.id);
                              toast.success(`Switched to ${mode.label} mode`);
                            }}
                            className={cn(
                              "rounded-xl text-xs py-2 px-2.5 flex items-start gap-2.5 cursor-pointer",
                              activeMode === mode.id && "bg-primary/10 text-primary font-semibold"
                            )}
                          >
                            <IconComp className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold">{mode.label}</div>
                              <div className="text-[10px] text-muted-foreground">{mode.desc}</div>
                            </div>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Voice Call Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVoiceCallDialogOpen(true)}
                    className="h-8 text-xs font-semibold gap-1 sm:gap-1.5 rounded-xl border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 px-2 sm:px-2.5 cursor-pointer shrink-0"
                    title="Start 1:1 Voice Call with AI Mentor"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="hidden md:inline">Voice Call</span>
                  </Button>

                  {/* Customize & Skills Upgrade */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUpgradeDialogOpen(true)}
                    className="h-8 text-xs font-semibold gap-1 sm:gap-1.5 rounded-xl border-primary/30 text-primary hover:bg-primary/10 px-2 sm:px-2.5 cursor-pointer shrink-0"
                    title="Customize Memory & Skills (Gmail, Docs, Sheets, Slides)"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span className="hidden xl:inline">Plugins & Skills</span>
                  </Button>

                  {/* View Profile */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setProfileDialogOpen(true)}
                    className="h-8 w-8 rounded-xl"
                    title="View Mentor Profile & Capabilities"
                  >
                    <Bot className="w-4 h-4" />
                  </Button>

                  {/* Clear / New Chat */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearChat}
                    className="h-8 w-8 rounded-xl"
                    title="Clear history / Start new session"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Guided Step Bar (When in Guide Me mode) */}
              {activeMode === "guide_me" && GUIDED_STEPS[selectedMentor.id] && (
                <div className="px-4 py-2 bg-primary/5 border-b flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-primary" />
                    <span className="font-bold text-foreground">
                      {GUIDED_STEPS[selectedMentor.id][guidedStepIndex]}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      ({guidedStepIndex + 1}/{GUIDED_STEPS[selectedMentor.id].length})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={guidedStepIndex === 0}
                      onClick={() => setGuidedStepIndex((i) => i - 1)}
                      className="h-6 px-2 text-[11px]"
                    >
                      Back
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      disabled={guidedStepIndex >= GUIDED_STEPS[selectedMentor.id].length - 1}
                      onClick={() => {
                        const nextIdx = guidedStepIndex + 1;
                        setGuidedStepIndex(nextIdx);
                        handleSendMessage(`Proceeding to ${GUIDED_STEPS[selectedMentor.id][nextIdx]}. Guide me on this milestone.`);
                      }}
                      className="h-6 px-2 text-[11px]"
                    >
                      Next Step →
                    </Button>
                  </div>
                </div>
              )}

              {/* Messages Scroll Area */}
              <div
                ref={chatScrollContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
              >
                {activeMessages.map((msg, index) => {
                  const isUser = msg.role === "user";
                  const prevMsg = activeMessages[index - 1];
                  const isFirstInGroup = !prevMsg || prevMsg.role !== msg.role;

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex gap-3",
                        isUser ? "justify-end" : "justify-start"
                      )}
                    >
                      {/* Avatar for assistant */}
                      {!isUser && (
                        <div className="shrink-0 mt-1">
                          {isFirstInGroup ? (
                            <MentorAvatar mentor={selectedMentor} size="sm" showStatusIndicator={false} />
                          ) : (
                            <div className="w-8 h-8" />
                          )}
                        </div>
                      )}

                      {/* Message Bubble Container */}
                      <div className="max-w-[85%] sm:max-w-[78%] space-y-1.5 group">
                        <div
                          className={cn(
                            "rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed relative shadow-xs transition-all",
                            isUser
                              ? "bg-primary text-primary-foreground rounded-tr-xs"
                              : "bg-card border border-border/80 text-foreground rounded-tl-xs"
                          )}
                        >
                          {/* Markdown formatted content */}
                          <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                            <ReactMarkdown
                              components={{
                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                                code: ({ className, children, ...props }: any) => {
                                  const match = /language-(\w+)/.exec(className || "");
                                  const isInline = !match;
                                  return isInline ? (
                                    <code className="bg-muted px-1.5 py-0.5 rounded text-primary font-mono text-[11px]" {...props}>
                                      {children}
                                    </code>
                                  ) : (
                                    <div className="my-2 rounded-xl border border-border/80 overflow-hidden bg-slate-950 text-slate-100 font-mono text-xs">
                                      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400">
                                        <span>{match[1].toUpperCase()}</span>
                                        <button
                                          onClick={() => {
                                            navigator.clipboard.writeText(String(children));
                                            toast.success("Code copied!");
                                          }}
                                          className="hover:text-white flex items-center gap-1"
                                        >
                                          <Copy className="w-3 h-3" /> Copy
                                        </button>
                                      </div>
                                      <pre className="p-3 overflow-x-auto text-[11px] leading-relaxed">
                                        <code>{children}</code>
                                      </pre>
                                    </div>
                                  );
                                },
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>

                          {/* Interactive Artifact Card (if generated with AutoHeight) */}
                          {msg.artifact && (
                            <AutoHeight deps={[msg.artifact.content]} className="mt-3 p-3 rounded-xl bg-muted/40 border border-primary/20 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                                  <Layers className="w-3.5 h-3.5 text-primary" />
                                  <span>{msg.artifact.title}</span>
                                </div>
                                <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                                  {msg.artifact.type.replace("_", " ")}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-muted-foreground">{msg.artifact.description}</p>
                              <div className="flex items-center gap-2 pt-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-[11px] gap-1.5"
                                  onClick={() => {
                                    navigator.clipboard.writeText(msg.artifact!.content);
                                    toast.success("Artifact copied to clipboard!");
                                  }}
                                >
                                  <Copy className="w-3 h-3" /> Copy Artifact
                                </Button>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="h-7 text-[11px] gap-1.5"
                                  onClick={() => toast.success("Opened interactive blueprint viewer")}
                                >
                                  <Play className="w-3 h-3" /> View In Sandbox
                                </Button>
                              </div>
                            </AutoHeight>
                          )}

                          {/* Working Interactive Plugin Action Cards (Gmail, Docs, Sheets, Slides) */}
                          {msg.pluginCard?.type === "gmail" && (
                            <div className="mt-3">
                              <GmailActionCard
                                to={msg.pluginCard.data.to}
                                subject={msg.pluginCard.data.subject}
                                body={msg.pluginCard.data.body}
                              />
                            </div>
                          )}
                          {msg.pluginCard?.type === "docs" && (
                            <div className="mt-3">
                              <GoogleDocsActionCard
                                title={msg.pluginCard.data.title}
                                content={msg.pluginCard.data.content}
                              />
                            </div>
                          )}
                          {msg.pluginCard?.type === "sheets" && (
                            <div className="mt-3">
                              <GoogleSheetsActionCard
                                title={msg.pluginCard.data.title}
                                csvData={msg.pluginCard.data.csvData}
                              />
                            </div>
                          )}
                          {msg.pluginCard?.type === "slides" && (
                            <div className="mt-3">
                              <GoogleSlidesActionCard
                                title={msg.pluginCard.data.title}
                                slides={msg.pluginCard.data.slides}
                              />
                            </div>
                          )}

                          {/* Hover action toolbar for assistant responses */}
                          {!isUser && (
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-card/80 backdrop-blur-md border rounded-lg p-0.5">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(msg.content);
                                  toast.success("Copied to clipboard!");
                                }}
                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                                title="Copy message"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleToggleSave(msg.id)}
                                className={cn(
                                  "p-1 rounded hover:bg-muted text-muted-foreground",
                                  msg.saved && "text-amber-500 fill-amber-500"
                                )}
                                title={msg.saved ? "Saved in Library" : "Save to Learning Library"}
                              >
                                <Bookmark className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Reactions & Timestamp Bar */}
                        <div
                          className={cn(
                            "flex items-center gap-2 px-1 text-[10px] text-muted-foreground",
                            isUser ? "justify-end" : "justify-start"
                          )}
                        >
                          <span>{format(new Date(msg.timestamp), "HH:mm")}</span>

                          {/* SVG Reactions toolbar (No emojis, 100% real SVG icons) */}
                          {!isUser && (
                            <div className="flex items-center gap-0.5">
                              {[
                                { id: "thumbs", icon: ThumbsUp, label: "Helpful" },
                                { id: "idea", icon: Lightbulb, label: "Insight" },
                                { id: "rocket", icon: Rocket, label: "Brilliant" },
                                { id: "heart", icon: Heart, label: "Love it" },
                              ].map((react) => {
                                const hasReacted = msg.reactions?.includes(react.id);
                                const IconComp = react.icon;
                                return (
                                  <button
                                    key={react.id}
                                    onClick={() => handleToggleReaction(msg.id, react.id)}
                                    className={cn(
                                      "relative p-1 rounded text-xs hover:bg-muted transition-colors flex items-center justify-center cursor-pointer",
                                      hasReacted ? "bg-primary/20 text-primary font-bold" : "opacity-50 hover:opacity-100 text-muted-foreground"
                                    )}
                                    title={react.label}
                                  >
                                    <IconComp className={cn("w-3 h-3 transition-transform", hasReacted && "fill-primary text-primary scale-110")} />
                                    {hasReacted && <IconButtonParticles className="text-primary pointer-events-none" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* Retry button on failed messages */}
                          {msg.status === "failed" && (
                            <button
                              onClick={handleRetry}
                              className="text-rose-500 font-bold hover:underline flex items-center gap-1"
                            >
                              <RotateCcw className="w-2.5 h-2.5" /> Retry
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Real-time Typing / Generating Indicator with Animated MotionGrid Dot Matrix */}
                {isGenerating && streamStatus === "thinking" && (
                  <div className="flex items-center gap-3 text-xs text-muted-foreground italic pl-1 animate-in fade-in-50">
                    <MentorAvatar mentor={selectedMentor} size="sm" status="thinking" showStatusIndicator={true} />
                    <div className="flex items-center gap-2.5 bg-muted/60 border border-border/80 px-3.5 py-2 rounded-2xl shadow-xs">
                      <MotionGrid
                        gridSize={[5, 5]}
                        frames={[
                          [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]],
                          [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]],
                          [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]],
                          [[0, 0], [4, 4], [2, 2], [0, 4], [4, 0]],
                        ]}
                        className="w-fit gap-0.5"
                      >
                        <MotionGridCells className="aspect-square size-[2.5px] rounded-full bg-primary/30 data-[active=true]:bg-primary" />
                      </MotionGrid>
                      <span className="font-medium text-foreground">
                        {selectedMentor.name} is thinking &amp; architecting response...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Working Skills & Plugins Quick Toolbar (Gmail, Docs, Sheets, Slides, GitHub, Web Search) */}
              <div className="px-4 py-1.5 bg-muted/30 border-t flex items-center justify-between gap-2">
                <PluginToolbar
                  onTriggerPlugin={handleTriggerPlugin}
                />
                <button
                  onClick={() => setUpgradeDialogOpen(true)}
                  className="text-[10px] text-primary hover:underline font-semibold shrink-0 cursor-pointer hidden sm:inline"
                >
                  Configure Plugins →
                </button>
              </div>

              {/* Proactive Coaching Follow-up Prompt Chips */}
              <div className="px-4 py-2 bg-muted/20 border-t flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" /> Follow-up Drills:
                </span>
                {selectedMentor.samplePrompts.slice(0, 3).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isGenerating}
                    className="text-xs px-3 py-1 rounded-full bg-card hover:bg-primary/10 hover:text-primary border border-border/80 text-muted-foreground font-medium transition-all shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Attachment Previews */}
              {attachments.length > 0 && (
                <div className="px-4 py-2 border-t bg-muted/10 flex items-center gap-2">
                  {attachments.map((att, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-card border text-xs flex items-center gap-2 text-foreground font-medium"
                    >
                      <Paperclip className="w-3 h-3 text-primary" />
                      <span>{att.name}</span>
                      <button
                        onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Composer Input Area */}
              <div className="p-3 border-t bg-card flex items-end gap-2">
                {/* Plus / Attachment Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 shrink-0 rounded-2xl hover:bg-muted"
                      title="Attach code or diagram"
                    >
                      <Plus className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 p-1.5 rounded-2xl">
                    <DropdownMenuItem
                      onClick={() => handleAddAttachment("image", "system-architecture.png")}
                      className="gap-2 text-xs py-2 cursor-pointer rounded-xl"
                    >
                      <ImageIcon className="w-4 h-4 text-sky-500" /> Upload Architecture Diagram
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAddAttachment("code", "service-handler.ts")}
                      className="gap-2 text-xs py-2 cursor-pointer rounded-xl"
                    >
                      <FileCode className="w-4 h-4 text-emerald-500" /> Attach Code Snippet
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAddAttachment("resume", "engineering-resume.pdf")}
                      className="gap-2 text-xs py-2 cursor-pointer rounded-xl"
                    >
                      <FileText className="w-4 h-4 text-rose-500" /> Attach Resume (PDF)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Multiline auto-expanding textarea */}
                <div className="flex-1 relative">
                  <Textarea
                    placeholder={`Ask ${selectedMentor.name} anything... (Enter to send, Shift+Enter for new line)`}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    rows={1}
                    className="min-h-[44px] max-h-32 resize-none text-xs sm:text-sm py-2.5 px-3 rounded-2xl bg-muted/30 border-border/70 focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                {/* Speech Input Microphone */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleSpeech}
                  className={cn(
                    "h-10 w-10 shrink-0 rounded-2xl",
                    isRecording && "bg-rose-500/20 text-rose-500 animate-pulse"
                  )}
                  title={isRecording ? "Stop voice input" : "Voice question input"}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-muted-foreground" />}
                </Button>

                {/* Send / Stop Generation Button */}
                {isGenerating ? (
                  <Button
                    onClick={handleStopGeneration}
                    variant="destructive"
                    className="h-10 px-4 rounded-2xl gap-1.5 font-semibold text-xs shrink-0"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" /> Stop
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() && attachments.length === 0}
                    className="h-10 px-4 rounded-2xl gap-1.5 font-semibold text-xs shrink-0 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </>
          ) : (
            /* Peer Contacts 1:1 Messenger View */
            <div className="flex-1 flex flex-col justify-between">
              {activeChatUser ? (
                <>
                  <div className="h-16 px-4 border-b bg-card flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="sm:hidden h-8 w-8 shrink-0"
                        onClick={() => setMobileShowChat(false)}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <div className="w-10 h-10 rounded-full bg-primary/20 border flex items-center justify-center font-bold text-xs">
                        {activeChatUser.full_name?.[0] || "U"}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-foreground">{activeChatUser.full_name}</h3>
                        <p className="text-[11px] text-muted-foreground">Peer Student Connection</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {peerMessages.map((m: any) => (
                      <div
                        key={m.id}
                        className={cn("flex", m.sender_id === user?.id ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] p-3 rounded-2xl text-xs leading-relaxed",
                            m.sender_id === user?.id
                              ? "bg-primary text-primary-foreground rounded-tr-xs"
                              : "bg-muted border text-foreground rounded-tl-xs"
                          )}
                        >
                          {m.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t bg-card flex gap-2">
                    <Input
                      placeholder={`Message ${activeChatUser.full_name}...`}
                      value={peerInput}
                      onChange={(e) => setPeerInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onSendPeerMessage?.(peerInput);
                          setPeerInput("");
                        }
                      }}
                      className="h-10 text-xs rounded-xl"
                    />
                    <Button
                      onClick={() => {
                        onSendPeerMessage?.(peerInput);
                        setPeerInput("");
                      }}
                      className="h-10 px-4 rounded-xl"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground space-y-2">
                  <Users className="w-12 h-12 opacity-30" />
                  <p className="text-sm font-semibold text-foreground">Select a Peer Contact</p>
                  <p className="text-xs max-w-sm">
                    Connect with fellow engineers or book a 1-on-1 coaching call to discuss architecture reviews.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mentor Customization & Skills Upgrade Dialog */}
      <MentorUpgradeDialog
        mentor={selectedMentor}
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
        onCustomizationSaved={(updated: MentorCustomization) => setMentorConfig(updated)}
      />

      {/* Real-time Voice Call Dialog */}
      <MentorVoiceCallDialog
        mentor={selectedMentor}
        open={voiceCallDialogOpen}
        onOpenChange={setVoiceCallDialogOpen}
      />
    </div>
  );
}

export default AiMentorMessenger;
