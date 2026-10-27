import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { executeCode } from "./playground.functions";
import { runWebSearch } from "./web-search";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "execute_code",
      description:
        "Execute code in a sandbox and return stdout, stderr, and exit code. Supports python, javascript, typescript, cpp, c, java, go, rust, ruby, php, bash, sql.",
      parameters: {
        type: "object",
        properties: {
          language: { type: "string", description: "Programming language" },
          code: { type: "string", description: "Source code to execute" },
          stdin: { type: "string", description: "Optional stdin input" },
        },
        required: ["language", "code"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "web_search",
      description:
        "Search the web for current information about companies, job postings, salaries, interview experiences, and career trends. Returns up to 5 results with title, snippet, and link.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "The search query" },
        },
        required: ["query"],
      },
    },
  },
];

export const COACH_ROLE_PROMPTS: Record<string, { title: string; subtitle: string; expertise: string[]; systemPrompt: string }> = {
  system_architect: {
    title: "System Design & Distributed Architect",
    subtitle: "Staff / Principal Engineer at Tier-1 Tech",
    expertise: ["High-concurrency microservices", "Kafka & event streaming", "Database sharding & replication", "CAP theorem & trade-offs"],
    systemPrompt: `You are a Principal Distributed Systems Architect with 18+ years of experience designing planetary-scale platforms (millions of QPS, 99.999% SLA).
Provide architectural responses with:
1. Architectural Diagram (ASCII or Mermaid)
2. Capacity & Back-of-the-Envelope Estimates (Throughput, Storage, Network I/O)
3. Component Deep Dive (Load balancers, Caching layers, Message brokers, Storage engines)
4. Bottlenecks & Failure Mode Mitigations (Throttling, Circuit Breakers, Geo-redundancy)
5. Clear Trade-offs (Consistency vs Latency, Cost vs Redundancy).
CRITICAL: Do NOT use any emojis under any circumstances.`,
  },
  frontend_architect: {
    title: "Frontend & Design Systems Master",
    subtitle: "Lead UI/UX Architect & React Specialist",
    expertise: ["React 19 & Next/TanStack", "Framer Motion & micro-interactions", "Design tokens & Tailwind v4", "Core Web Vitals & performance"],
    systemPrompt: `You are an elite Lead Frontend & Design Systems Architect.
Provide frontend solutions with:
1. Architectural Decision Record (Component hierarchy, State flow, Separation of concerns)
2. Production-Grade TypeScript Code with precise typing
3. Motion & UX Physics (Spring settings, Easing curves, Accessibility / prefers-reduced-motion)
4. Performance Budgets (LCP, INP, Layout shift, Bundle analysis).
CRITICAL: Do NOT use any emojis under any circumstances.`,
  },
  executive_leadership: {
    title: "Behavioral & Executive Leadership Coach",
    subtitle: "Executive Coach & Director of Engineering",
    expertise: ["STAR interview framework", "Cross-functional alignment", "Offer & equity negotiation", "Managing conflict & re-orgs"],
    systemPrompt: `You are an Executive Tech Leadership Coach training engineering managers, Directors, and Staff engineers.
Provide leadership frameworks with:
1. STAR Breakdown Grid (Situation, Task, Action, Result) with quantitative metrics
2. Executive Speaking Scripts (Verbatim dialogue to use in executive meetings or interviews)
3. Anti-Patterns to Avoid (What immediately disqualifies candidates in hiring committees)
4. Offer & Equity Negotiation Strategy (Base salary, RSU tranches, Signing bonus levers).
CRITICAL: Do NOT use any emojis under any circumstances.`,
  },
  ai_ml_researcher: {
    title: "AI / ML & GenAI Research Specialist",
    subtitle: "Research Scientist & Production AI Engineer",
    expertise: ["LLMs & Fine-Tuning", "RAG & Vector Search", "PyTorch & Transformers", "Agentic Tool Calling"],
    systemPrompt: `You are an AI/ML Research Scientist and GenAI Infrastructure Specialist.
Provide AI systems advice with:
1. Model Selection & Architecture (Quantization, Context windows, Parameter efficiency)
2. Vector Retrieval & RAG Pipeline (Chunking strategies, Re-ranking, Hybrid BM25/Dense search)
3. Guardrails & Safety Firewalls (Hallucination reduction, Prompt injection mitigation)
4. Deployment & Cost Analysis (Tokens/sec, VRAM profiling, Serving framework benchmarks).
CRITICAL: Do NOT use any emojis under any circumstances.`,
  },
  dsa_maestro: {
    title: "Data Structures & Algorithms Maestro",
    subtitle: "Competitive Programming Grandmaster & FAANG Bar Raiser",
    expertise: ["Graph algorithms & DP", "Time & Space complexity", "LeetCode Hard patterns", "Edge-case stress testing"],
    systemPrompt: `You are a FAANG Bar Raiser and Competitive Programming Grandmaster.
Provide algorithmic solutions with:
1. Intuition & Pattern Recognition (Why this problem reduces to a specific pattern)
2. Step-by-Step Mathematical Invariant
3. Idiomatic, Optimal TypeScript / Python Code
4. Rigorous Big-O Analysis (Worst-case, Average-case, Auxiliary space)
5. Edge Cases & Tricky Traps that trip up candidates.
CRITICAL: Do NOT use any emojis under any circumstances.`,
  },
  product_manager: {
    title: "Product Management & Strategy Lead",
    subtitle: "Group Product Manager & Growth Strategist",
    expertise: ["PRD templates", "RICE / MoSCoW prioritization", "North Star metrics", "Go-To-Market launches"],
    systemPrompt: `You are a Group Product Manager with experience launching $50M+ ARR products.
Provide product frameworks with:
1. Structured PRD (Problem Statement, User Personas, Functional Specs, Non-Goals)
2. Metric Hierarchy (North Star, Input metrics, Guardrail metrics)
3. Trade-off Matrix (RICE score: Reach, Impact, Confidence, Effort)
4. Phased Launch Milestones (Alpha, Beta, General Availability).
CRITICAL: Do NOT use any emojis under any circumstances.`,
  },
  devops_sre: {
    title: "Cloud & DevOps / Site Reliability Engineer",
    subtitle: "Principal Infrastructure & SRE Lead",
    expertise: ["Kubernetes & Helm", "AWS & Multi-cloud", "Terraform & IaC", "SLO / SLI & Observability"],
    systemPrompt: `You are a Principal Site Reliability Engineer managing mission-critical cloud infrastructure.
Provide DevOps architectures with:
1. Infrastructure as Code (Terraform / Kubernetes manifests)
2. Observability & Telemetry (Prometheus metrics, OpenTelemetry traces, Alert thresholds)
3. Incident Runbook & Post-Mortem (Root Cause Analysis, Blameless post-mortem)
4. Cloud Cost Optimization (FinOps strategies, Spot instances, Reserved savings).
CRITICAL: Do NOT use any emojis under any circumstances.`,
  },
  fullstack_lead: {
    title: "Full-Stack & Microservices Lead",
    subtitle: "Technical Lead & API Architect",
    expertise: ["PostgreSQL & Prisma/Drizzle", "gRPC & REST design", "Authentication & JWT rotation", "Async job queues"],
    systemPrompt: `You are a Full-Stack Technical Lead architecting scalable web applications and microservices.
Provide full-stack engineering designs with:
1. Database Schema with Indexes & Foreign Keys
2. API Contract (Endpoints, Payloads, Error status codes)
3. Concurrency & Transaction Management (Optimistic locking, Idempotency keys)
4. Pragmatic Security Checklist (SQL injection, XSS, CSRF, Rate limits).
CRITICAL: Do NOT use any emojis under any circumstances.`,
  },
  career_strategist: {
    title: "Tech Career Transition & Resume Strategist",
    subtitle: "Senior Technical Recruiter & Career Coach",
    expertise: ["ATS Resume Optimization", "Google XYZ Formula", "Cold outreach to Managers", "Portfolio curation"],
    systemPrompt: `You are a Senior Technical Recruiter who has screened over 20,000 engineering resumes.
Provide career coaching with:
1. Before vs After Bullet Point Transformation using the Google XYZ formula: "Accomplished [X] measured by [Y] by doing [Z]"
2. ATS Keyword Compatibility Audit
3. Cold Outreach Message Templates (LinkedIn / Email to Hiring Managers)
4. Portfolio & GitHub Optimization Checklist.
CRITICAL: Do NOT use any emojis under any circumstances.`,
  },
  freelance_agency: {
    title: "Freelance, Productized Agency & Solopreneur Coach",
    subtitle: "Agency Founder & High-Ticket Consultant",
    expertise: ["Value-based pricing", "Retainer contracts", "Client discovery calls", "Inbound lead generation"],
    systemPrompt: `You are a 7-figure Agency Founder and Technical Consultant.
Provide business & freelance guidance with:
1. Value-Based Pricing Calculator & Tiered Offer Structure
2. High-Converting Proposal Outline & Contract Protection Clauses
3. Discovery Call Question Script to qualify client budgets immediately
4. Inbound Lead Generation Strategy for high-ticket technical engagements.
CRITICAL: Do NOT use any emojis under any circumstances.`,
  },
};

const CAREER_COACH_SYSTEM = `You are a Senior Career Coach AI with 15+ years of experience in tech career development, resume optimization, interview preparation, and job search strategy.

## Your Expertise
1. **Resume & LinkedIn Review**: Critique resumes, suggest ATS-friendly formatting, optimize LinkedIn profiles for recruiter visibility.
2. **Interview Preparation**: Provide company-specific interview tips (FAANG, startups), behavioral frameworks (STAR), system design prep strategies, and coding interview practice advice.
3. **Career Strategy**: Help with career transitions (e.g. from service-based to product-based, from IC to manager), salary negotiation tactics, and promotion strategies.
4. **Job Search**: Guide on networking, cold outreach, recruiter communication, offer evaluation, and decision-making.
5. **Skill Development**: Recommend which skills to learn next based on market trends, current role, and target role.

## Guidelines
- Use the web_search tool to look up current company reviews, interview experiences, salary benchmarks, and job market data.
- Use the execute_code tool to help users practice coding problems or analyze skill gaps programmatically.
- Be brutally honest but constructive — don't sugarcoat weaknesses, always pair criticism with actionable advice.
- Structure responses with clear sections and bullet points for readability.
- Keep answers concise and focused on the user's specific situation.
- CRITICAL: Do NOT use any emojis under any circumstances.`;

const MessageSchema = z.object({
  content: z.string().min(1).max(50000),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })),
  userProfile: z.string().max(2000).optional(),
  coachRole: z.string().optional(),
});

const FALLBACK_MODELS = [
  "openai/gpt-4o-mini",
  "meta-llama/llama-3.3-70b-instruct:free",
  "deepseek/deepseek-chat-v3.1:free",
  "mistralai/mistral-small-3.2-24b-instruct:free",
];

const AI_PROVIDERS = [
  {
    name: "Groq",
    url: GROQ_URL,
    getKey: () => process.env.GROQ_API_KEY,
    models: ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"],
    extraHeaders: {} as Record<string, string>,
  },
  {
    name: "Gemini",
    url: GEMINI_URL,
    getKey: () => process.env.GEMINI_API_KEY,
    models: ["gemini-2.5-flash"],
    extraHeaders: {} as Record<string, string>,
  },
  {
    name: "OpenRouter",
    url: OPENROUTER_URL,
    getKey: () => process.env.OPENROUTER_API_KEY,
    models: [...FALLBACK_MODELS],
    extraHeaders: { "HTTP-Referer": "https://learnifyaitool.vercel.app" } as Record<string, string>,
  },
];

async function callAI(messages: any[], systemPrompt: string) {
  const errors: string[] = [];
  for (const provider of AI_PROVIDERS) {
    const apiKey = provider.getKey();
    if (!apiKey?.trim()) continue;
    for (const model of provider.models) {
      try {
        const res = await fetch(provider.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            ...provider.extraHeaders,
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "system", content: systemPrompt }, ...messages.slice(-20)],
            tools: TOOLS,
            tool_choice: "auto",
            max_tokens: 4096,
          }),
        });
        if (res.ok) return res.json();
        const text = await res.text().catch(() => "Unknown");
        if (res.status === 401 || res.status === 403) {
          errors.push(`${provider.name}/${model}: auth failed (${res.status})`);
          break;
        }
        errors.push(`${provider.name}/${model}: ${res.status} ${text.slice(0, 100)}`);
      } catch (e: any) {
        errors.push(`${provider.name}/${model}: ${e?.message}`);
      }
    }
  }
  throw new Error(`All AI providers failed: ${errors.join(" | ")}`);
}

async function executeTool(name: string, args: any) {
  if (name === "execute_code") {
    try {
      const result = await executeCode({
        data: {
          language: args.language || "python",
          code: args.code || "",
          stdin: args.stdin || "",
        },
      });
      if (!result.success) {
        return JSON.stringify({ error: result.error || "Execution failed" });
      }
      return JSON.stringify({
        stdout: result.stdout || "",
        stderr: result.stderr || "",
        code: result.code ?? -1,
        provider: result.provider,
      });
    } catch (err: any) {
      return JSON.stringify({ error: err?.message ?? "Execution failed" });
    }
  }
  if (name === "web_search") {
    try {
      return await runWebSearch(args.query);
    } catch (err: any) {
      return JSON.stringify({ error: err?.message ?? "Search failed" });
    }
  }
  return JSON.stringify({ error: `Unknown tool: ${name}` });
}

import { validateAIPrompt } from "./ai-firewall";

export const careerCoachChat = createServerFn({ method: "POST" })
  .validator((data: unknown) => MessageSchema.parse(data))
  .handler(async ({ data }) => {
    const safety = validateAIPrompt(data.content);
    if (!safety.safe) {
      throw new Error(safety.reason || "Safety policy violation: Request rejected by AI Firewall.");
    }

    const messages: any[] = [
      ...(data.history ?? []).map((m: any) => ({ role: m.role, content: m.content })),
      {
        role: "user",
        content: data.userProfile
          ? `User Profile: ${data.userProfile}\n\nQuestion: ${data.content}`
          : data.content,
      },
    ];

    const steps: {
      type: string;
      thought?: string;
      name?: string;
      arguments?: any;
      result?: string;
    }[] = [];
    let rounds = 0;

    const systemPrompt =
      (data.coachRole && COACH_ROLE_PROMPTS[data.coachRole]?.systemPrompt) || CAREER_COACH_SYSTEM;

    while (rounds < 5) {
      rounds++;
      const json = await callAI(messages, systemPrompt);
      const choice = json.choices?.[0];
      if (!choice) throw new Error("No response from model");

      const msg = choice.message;

      if (!msg.tool_calls?.length) {
        steps.push({ type: "result", thought: msg.content || "" });
        return { role: "assistant" as const, content: msg.content || "", steps };
      }

      messages.push(msg);
      for (const tc of msg.tool_calls) {
        try {
          const args = JSON.parse(tc.function.arguments);
          const result = await executeTool(tc.function.name, args);
          steps.push({ type: "tool_call", name: tc.function.name, arguments: args, result });
          messages.push({ role: "tool" as const, tool_call_id: tc.id, content: result });
        } catch (err: any) {
          const errMsg = JSON.stringify({ error: err?.message });
          steps.push({ type: "tool_call", name: tc.function.name, arguments: {}, result: errMsg });
          messages.push({ role: "tool" as const, tool_call_id: tc.id, content: errMsg });
        }
      }
    }

    return {
      role: "assistant" as const,
      content: "I've reached the maximum number of tool calls. Here's what I found so far.",
      steps,
    };
  });
