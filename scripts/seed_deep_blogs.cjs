const fs = require('fs');
const dotenv = require('dotenv');
const env = dotenv.parse(fs.readFileSync('.env'));
const { createClient } = require('@supabase/supabase-js');

async function seedPosts() {
  const adminClient = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const posts = [
    {
      slug: 'full-stack-ai-engineer-roadmap-2026',
      title: 'How to Become a Full-Stack AI Engineer in 2026: The Complete Roadmap',
      excerpt: 'The definitive guide to mastering React 19, TanStack Start, Supabase pgvector, LangChain, Groq, and autonomous agents to build high-scale AI products in 2026.',
      featured_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      published: true,
      content: `# How to Become a Full-Stack AI Engineer in 2026: The Complete Roadmap

In 2026, the traditional boundaries separating frontend developers, backend architects, and machine learning researchers have dissolved. The industry has standardized on a new tier of engineering excellence: the **Full-Stack AI Engineer**.

Unlike prompt engineers or traditional full-stack developers, a Full-Stack AI Engineer designs end-to-end user experiences powered by autonomous LLM agent graphs, vector search retrieval (RAG), and ultra-low latency streaming inference.

![Full-Stack AI Engineering Architecture](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80)

---

## 2026 Market Reality & Compensation Benchmarks

Organizations across India, the United States, and Europe are aggressively transitioning from superficial chatbot interfaces to production agentic workflows that execute complex business operations.

| Region | Entry-Level AI Engineer | Senior AI Engineer | Staff / Lead AI Architect |
| :--- | :--- | :--- | :--- |
| **India (INR)** | ₹14,00,000 – ₹22,00,000 | ₹28,00,000 – ₹55,00,000 | ₹60,00,000 – ₹1,20,00,000+ |
| **United States (USD)** | $120,000 – $165,000 | $185,000 – $275,000 | $300,000 – $480,000+ |
| **Remote Global (USD)** | $90,000 – $130,000 | $140,000 – $210,000 | $220,000 – $340,000+ |

> [!TIP]
> The single biggest differentiator in 2026 hiring isn't another fine-tuned model checkpoint; it is the demonstrated ability to build reliable, evaluated agentic systems with guardrails, low latency, and zero hallucination blowups.

---

## Traditional Full-Stack vs. 2026 Full-Stack AI Engineer

| Engineering Pillar | Traditional Web 2.0 Full-Stack | 2026 Full-Stack AI Engineer |
| :--- | :--- | :--- |
| **Frontend UI** | Static pages, REST fetch, loading spinners | Real-time token streaming, generative UI widgets, Monaco live code execution |
| **State Layer** | Redux, Pinia, React Query | Vector embedding cache, session memory checkpoints, multi-agent state machines |
| **Database** | Normalized PostgreSQL tables | Hybrid search (Full-Text BM25 + HNSW pgvector 1536-dim embeddings) |
| **Backend Execution** | Synchronous REST / GraphQL APIs | Event-driven background tasks, cyclic agent graphs, human-in-the-loop gates |
| **Testing & QA** | Jest, Cypress unit/e2e tests | LLM Evals, precision/recall benchmark matrices, prompt regression suites |

---

## The 2026 Architecture Blueprint

Here is how modern production applications like Learnify AI are built:

\`\`\`diagram
  [ React 19 + TanStack Start UI ]
                 │
           Streaming SSR
                 ▼
    [ Edge Server Functions ]
    ├── Auth Guard & Rate Limiting
    ├── Input Sanitization Firewall
    └── Payment Invoicing (Cashfree/Razorpay)
                 │
        ┌────────┴────────┐
        ▼                 ▼
[ Supabase PostgreSQL ]   [ Autonomous Agent Graph ]
  - pgvector RAG Index      - Planner / Orchestrator
  - User Profiles & Tiers   - Code Execution Sandbox
  - Realtime Channel Sync   - Output Validator & Eval
\`\`\`

---

## Step 1: Master Type-Safe Full-Stack React & SSR

Forget fragile client-side SPAs that flash blank spinners while fetching data. Modern applications require Server-Side Rendering (SSR) with compiled type contracts.

- **TanStack Start & React 19**: Server functions wrapped in \`{ data: { ... } }\` guarantee compile-time and runtime safety across the network boundary.
- **Tailwind CSS v4 & LightningCSS**: 10x faster build times with CSS variables and responsive glassmorphism tokens.
- **Micro-Animations**: Elevate UI with tactile hover physics, subtle border glows, and accessible ARIA attributes.

\`\`\`tsx
// Example: Server Function with Zod Validation in TanStack Start
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const generateStudyPlan = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      careerGoal: z.string().min(3),
      weeklyHours: z.number().min(5).max(40),
    }).parse(d)
  )
  .handler(async ({ data }) => {
    // Run deep learning synthesis on the server
    return { status: "success", goal: data.careerGoal };
  });
\`\`\`

---

## Step 2: Implement Hybrid Vector Search (RAG) with Supabase pgvector

Pure vector search frequently misses exact keyword matches (like error codes or function names). Modern RAG combines **BM25 lexical search** with **semantic vector cosine distance**.

\`\`\`sql
-- Enable pgvector in PostgreSQL
CREATE EXTENSION IF NOT EXISTS vector;

-- Create embeddings table with 768-dim Google text-embedding-004 vectors
CREATE TABLE documentation_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chunk_text text NOT NULL,
  metadata jsonb NOT NULL,
  embedding vector(768) NOT NULL
);

-- Fast HNSW index for sub-10ms nearest neighbor queries
CREATE INDEX doc_embeddings_hnsw ON documentation_embeddings 
USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
\`\`\`

---

## Step 3: Orchestrate Stateful Multi-Agent Graphs

Single-prompt completions cannot handle multi-step reasoning. Move to cyclic state graphs using LangGraph or custom orchestrators:

1. **Planner Agent**: Deconstructs user objectives into verified subtasks.
2. **Execution Worker**: Generates code, runs queries, or interacts with external APIs.
3. **Critic / Linter**: Compiles the output in an isolated sandbox, detects syntax errors, and retries automatically.
4. **Human Approver**: Pauses execution before financial debit or destructive actions.

---

## Step 4: Production Observability, Evals & Guardrails

Deploying AI without automated evaluations is like launching code without automated tests.

- **Prompt Regression Testing**: Run automated test suites against 100+ standard golden prompts on every git commit.
- **Input Firewalling**: Neutralize prompt injection attempts (\`Ignore all previous instructions...\`) before sending tokens to LLMs.
- **Cost & Latency Routing**: Use lightweight models (Gemini Flash, Llama 3 8B) for fast classification, reserving frontier models (Gemini Pro, Claude 3.5 Sonnet) for synthesis.

---

## Recommended Learning Path on Learnify AI

1. [Full Stack Developer Mastery](/courses/fullstack-mastery) — React 19, Node.js, and Supabase database architecture.
2. [Python for Beginners to Pro](/courses/python-for-beginners) — Python fundamentals, async I/O, and API development.
3. [System Design Academy](/system-design) — High-throughput distributed systems, caching, and database sharding.
4. [Career Studio & AI Mock Interview](/career-studio?tab=interview) — Test your technical skills with our live AI engineering evaluation panel.
`
    },
    {
      slug: 'autonomous-ai-agents-langgraph-python',
      title: 'Building Production Autonomous AI Agents with LangGraph & Python',
      excerpt: 'Comprehensive architecture guide: stateful multi-agent graphs, human-in-the-loop interruption, PostgreSQL checkpointers, and cyclic error recovery in Python.',
      featured_image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
      published: true,
      content: `# Building Production Autonomous AI Agents with LangGraph & Python

Most tutorials demonstrate AI agents as basic while-loops wrapped around an OpenAI API call. In real-world enterprise environments, that naive approach fails catastrophically: agents get stuck in infinite token-burning loops, hallucinate tool parameters, and crash unpredictably upon network timeouts.

To build production-grade AI systems, you need **deterministic state machines**, **persistent checkpoints**, and **human-in-the-loop gates**. This is where **LangGraph** has emerged as the industry standard.

![Autonomous AI Agents Workflow](https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80)

---

## Framework Comparison: LangGraph vs. CrewAI vs. AutoGen

| Architectural Feature | LangGraph (LangChain) | CrewAI | Microsoft AutoGen |
| :--- | :--- | :--- | :--- |
| **Control Flow** | Explicit cyclic directed graph | Role-playing hierarchical list | Multi-agent conversation chat |
| **State Persistence** | First-class PostgreSQL checkpointer | In-memory session | In-memory state |
| **Human-in-the-Loop** | Native \`interrupt()\` & breakpoint resumption | Basic confirmation prompt | User proxy agent |
| **Streaming UI** | Token-by-token + node state streaming | CLI stdout | Console print |
| **Enterprise Readiness** | Production standard (used at scale) | Rapid prototyping | Research & experimental |

---

## The Supervisor-Worker Graph Architecture

In a production LangGraph system, work is divided across specialized node functions governed by a typed state dictionary:

\`\`\`diagram
               [ User Request ]
                      │
                      ▼
             [ Supervisor Router ]
             ┌────────┴────────┐
             ▼                 ▼
     [ Research Agent ]   [ Code Agent ]
             │                 │
             └────────┬────────┘
                      ▼
             [ Validator / Linter ]
                      │
             Is output approved?
             ├── No ──► [ Error Recovery Node ]
             └── Yes ─► [ Human-in-the-Loop Gate ] ──► [ Deliver Output ]
\`\`\`

---

## Step-by-Step Python Implementation

Here is a complete, production-ready pattern using Python 3.12 and LangGraph:

\`\`\`python
from typing import Annotated, TypedDict, List
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.postgres import PostgresSaver

# 1. Define the Global Typed State
class AgentState(TypedDict):
    task: str
    code: str
    lint_errors: List[str]
    iteration_count: int
    is_approved: bool

# 2. Define Node Functions
def code_generator_node(state: AgentState) -> dict:
    prompt = f"Write Python code for: {state['task']}. Past errors: {state['lint_errors']}"
    # Call Gemini or OpenAI LLM with structured code output
    generated_code = "def process_data(items): return [x * 2 for x in items]"
    return {
        "code": generated_code,
        "iteration_count": state["iteration_count"] + 1
    }

def code_linter_node(state: AgentState) -> dict:
    errors = []
    try:
        compile(state["code"], "<string>", "exec")
    except Exception as e:
        errors.append(str(e))
    
    return {
        "lint_errors": errors,
        "is_approved": len(errors) == 0
    }

# 3. Conditional Routing Function
def should_continue(state: AgentState) -> str:
    if state["is_approved"]:
        return "human_approval"
    if state["iteration_count"] >= 3:
        return END  # Safety circuit breaker to prevent infinite loops
    return "generator"

# 4. Assemble the Stateful Graph
workflow = StateGraph(AgentState)
workflow.add_node("generator", code_generator_node)
workflow.add_node("linter", code_linter_node)

workflow.set_entry_point("generator")
workflow.add_edge("generator", "linter")
workflow.add_conditional_edges("linter", should_continue, {
    "human_approval": END,
    "generator": "generator",
    END: END
})

# 5. Compile with Checkpointing
app = workflow.compile()
\`\`\`

---

## 5 Production Commandments for Autonomous Agents

1. **Always Set Iteration Limits**: Hardcode a maximum iteration ceiling (\`max_iterations = 5\`). Never trust an LLM to decide when to stop calling tools.
2. **Isolate Sandbox Execution**: Never execute LLM-generated code directly on the host machine. Use Docker containers or WebAssembly runtimes with network isolation.
3. **Idempotent Tool Calls**: Ensure tool functions (e.g. database inserts, email triggers) can safely be retried multiple times without creating duplicate records.
4. **Log Token Metrics Per Node**: Track token consumption at every node transition to detect runaway loops before bills skyrocket.
5. **Enforce Human Approval for High-Risk Actions**: Any mutation affecting user wallets, production databases, or billing subscriptions must require explicit human click approval via an \`interrupt()\` breakpoint.
`
    },
    {
      slug: 'cashfree-vs-razorpay-india-saas',
      title: 'Comparing Cashfree vs Razorpay for Indian EdTech & SaaS Applications',
      excerpt: 'Comprehensive 2026 breakdown: transaction MDR fees, GST 18% SAC 998431 tax compliance, RBI recurring e-mandates, and domain approval timelines.',
      featured_image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
      published: true,
      content: `# Comparing Cashfree vs Razorpay for Indian EdTech & SaaS Applications

Launching an online learning platform or SaaS application in India requires navigating rigorous regulatory standards: **Reserve Bank of India (RBI) recurring e-Mandates**, **18% Goods and Services Tax (GST)** under **SAC 998431** (Online Education Services), and merchant domain verification.

In this exhaustive 2026 benchmark, we compare India's two leading payment processors — **Cashfree Payments** and **Razorpay** — across pricing, developer APIs, webhook reliability, and automated GST invoice generation.

![Indian Payment Gateways Comparison](https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80)

---

## 2026 Feature & Fee Comparison Matrix

| Capability | Cashfree Payments | Razorpay |
| :--- | :--- | :--- |
| **Domestic UPI Rate** | **1.75% – 1.90%** (Custom volume pricing available) | **2.00% flat** + 18% GST on fees |
| **Debit & Credit Cards** | **1.85% – 1.95%** | **2.00%** (RuPay Debit 0%) |
| **International Cards** | 3.50% + ₹7 | 3.00% – 3.50% + ₹7 |
| **Automated Payouts** | Instant 24x7 via IMPS / UPI rails | RazorpayX instant payouts |
| **Recurring Subscriptions** | Cashfree Subscriptions (UPI AutoPay + Cards) | Razorpay Subscriptions (UPI AutoPay + Cards) |
| **GST SAC 998431 Support** | Built-in CGST/SGST/IGST breakdown in receipts | Standard invoice generator |
| **Domain Whitelisting** | Fast approval for both \`.in\` and \`.com\` domains | Strict underwriting for custom domains |
| **Developer Documentation** | Clean modern REST APIs + TypeScript SDKs | Extensive SDKs & legacy plugins |

---

## Indian Regulatory Compliance: The 18% GST Rule

Under Indian tax legislation, digital educational courses, career masteries, and AI coaching platforms are categorized under:
- **Service Accounting Code (SAC):** \`998431\` (Higher Education & Online Skill Services)
- **GST Rate:** 18% Total

### Tax Calculation Breakdown

- **Intrastate Transactions (Same State as Company HQ):**
  - CGST: **9%**
  - SGST: **9%**
  - Total: **18%**
- **Interstate Transactions (Customer in a Different State):**
  - IGST: **18%**

\`\`\`typescript
// Production GST Calculation Logic in Learnify AI
export function computeGstBreakdown(basePriceInr: number, customerStateCode: string, merchantStateCode: string = "27") {
  const isIntrastate = customerStateCode === merchantStateCode;
  const gstRate = 0.18;
  const totalTax = Math.round(basePriceInr * gstRate * 100) / 100;
  
  if (isIntrastate) {
    const half = Math.round((totalTax / 2) * 100) / 100;
    return {
      cgstRate: 9,
      cgstAmount: half,
      sgstRate: 9,
      sgstAmount: half,
      igstRate: 0,
      igstAmount: 0,
      totalTax,
      grandTotal: basePriceInr + totalTax
    };
  } else {
    return {
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: 18,
      igstAmount: totalTax,
      totalTax,
      grandTotal: basePriceInr + totalTax
    };
  }
}
\`\`\`

---

## Securing Webhook Signatures: Critical Best Practice

Never credit course enrollments or update wallet balances without cryptographically verifying the incoming webhook signature. A malicious user can easily spoof an HTTP POST request to your webhook endpoint.

\`\`\`typescript
import crypto from "crypto";

export function verifyCashfreeWebhookSignature(
  rawBody: string,
  receivedSignature: string,
  timestamp: string,
  secretKey: string
): boolean {
  // Cashfree signature verification algorithm
  const data = timestamp + rawBody;
  const expectedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(data)
    .digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(receivedSignature),
    Buffer.from(expectedSignature)
  );
}
\`\`\`

---

## The Verdict: Which Gateway Should You Choose?

- **Choose Cashfree if:** You want lower transaction MDR fees (1.9%), high-volume automated creator payouts, and transparent recurring subscription billing with fast domain approval.
- **Choose Razorpay if:** You want a ubiquitous checkout experience that almost every Indian consumer recognizes, or need out-of-the-box international card processing on day one.
- **The Ideal Architecture:** Implement **Cashfree as the primary gateway** for Indian subscriptions and creator earnings, with **Razorpay as a resilient secondary payment option**.
`
    }
  ];

  for (const p of posts) {
    const { error } = await adminClient.from('blog_posts').upsert(p, { onConflict: 'slug' });
    if (error) console.error('Error upserting', p.slug, error);
    else console.log('Successfully upserted blog post:', p.title);
  }
}
seedPosts();
