import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

// Provider routing — use the owner's configured AI APIs only.
const PROVIDERS = {
  groq: {
    url: "https://api.groq.com/openai/v1/chat/completions",
    keyEnv: "GROQ_API_KEY",
    stripPrefix: true,
  },
  openrouter: {
    url: "https://openrouter.ai/api/v1/chat/completions",
    keyEnv: "OPENROUTER_API_KEY",
    stripPrefix: true,
  },
  gemini: {
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    keyEnv: "GEMINI_API_KEY",
    stripPrefix: false,
  },
} as const;

function resolveProvider(model: string) {
  const parts = model.split("/");
  const prefix = parts[0];
  const cfg = PROVIDERS[prefix as keyof typeof PROVIDERS];
  if (cfg) {
    const providerModel = cfg.stripPrefix
      ? parts.slice(1).join("/")
      : model.replace(/^gemini\//, "");
    return { cfg, providerModel };
  }

  // Fallback: try to detect provider by keyword in model string
  if (model.includes("gemini"))
    return { cfg: PROVIDERS.gemini, providerModel: model.replace(/^gemini\//, "") };
  if (model.includes("groq"))
    return { cfg: PROVIDERS.groq, providerModel: model.replace(/^groq\//, "") };
  if (model.includes("openrouter") || model.includes("openrouter.ai"))
    return { cfg: PROVIDERS.openrouter, providerModel: model.replace(/^openrouter\//, "") };

  // Default to Gemini provider when unsure
  return { cfg: PROVIDERS.gemini, providerModel: model };
}

const BodySchema = z.object({
  conversationId: z.string().uuid().nullable().optional(),
  model: z.string().min(1).max(200),
  content: z.string().min(1).max(10_000_000),
});

// USD price per 1M tokens. Approximate — adjust as providers change.
const MODEL_PRICING: Record<string, { in: number; out: number }> = {
  "google/gemini-2.5-flash": { in: 0.3, out: 2.5 },
  "google/gemini-2.5-pro": { in: 1.25, out: 10 },
  "google/gemini-2.5-flash-lite": { in: 0.1, out: 0.4 },
  "openai/gpt-5": { in: 1.25, out: 10 },
  "openai/gpt-5-mini": { in: 0.25, out: 2 },
  "openai/gpt-5-nano": { in: 0.05, out: 0.4 },
};
const USD_TO_INR = 84;
const CREDITS_PER_REQUEST = 1;

function priceFor(modelWithPrefix: string, ptok: number, ctok: number) {
  // Try to match known pricing keys by suffix or substring to be tolerant of different model naming schemes
  const keys = Object.keys(MODEL_PRICING);
  let key = keys.find((k) => modelWithPrefix.endsWith(k));
  if (!key) key = keys.find((k) => modelWithPrefix.includes(k));
  const p = MODEL_PRICING[key ?? ""] ?? { in: 0.3, out: 2.5 };
  const usd = (ptok / 1_000_000) * p.in + (ctok / 1_000_000) * p.out;
  return { usd, inr: usd * USD_TO_INR };
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = request.headers.get("authorization");
        const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
        if (!token) return new Response("Unauthorized", { status: 401 });

        const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
        if (userErr || !userData.user) return new Response("Unauthorized", { status: 401 });
        const userId = userData.user.id;

        // ── Credit check ──
        const { data: creditRow } = await supabaseAdmin
          .from("ai_credits")
          .select("credits_remaining")
          .eq("user_id", userId)
          .maybeSingle();
        let remaining = creditRow?.credits_remaining ?? null;
        if (remaining === null) {
          // Create row lazily for legacy users
          await supabaseAdmin
            .from("ai_credits")
            .insert({ user_id: userId, credits_remaining: 500 });
          remaining = 500;
        }
        if (remaining < CREDITS_PER_REQUEST) {
          return new Response(
            JSON.stringify({ error: "You're out of AI credits. Please top up to continue." }),
            { status: 402, headers: { "Content-Type": "application/json" } },
          );
        }

        let parsed;
        try {
          parsed = BodySchema.parse(await request.json());
        } catch (e) {
          return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
        }

        // Get or create conversation
        let conversationId = parsed.conversationId ?? null;
        if (!conversationId) {
          const { data: conv, error } = await supabaseAdmin
            .from("chat_conversations")
            .insert({ user_id: userId, model: parsed.model, title: parsed.content.slice(0, 60) })
            .select("id")
            .single();
          if (error || !conv) return new Response("Could not create conversation", { status: 500 });
          conversationId = conv.id;
        } else {
          // verify ownership
          const { data: conv } = await supabaseAdmin
            .from("chat_conversations")
            .select("id, user_id")
            .eq("id", conversationId)
            .single();
          if (!conv || conv.user_id !== userId) return new Response("Forbidden", { status: 403 });
        }

        // Insert user message
        await supabaseAdmin.from("chat_messages").insert({
          conversation_id: conversationId,
          user_id: userId,
          role: "user",
          content: parsed.content,
        });

        // Load conversation history (last 30 messages)
        const { data: history } = await supabaseAdmin
          .from("chat_messages")
          .select("role, content")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true })
          .limit(30);

        const { cfg, providerModel } = resolveProvider(parsed.model);
        const apiKey = process.env[cfg.keyEnv];
        if (!apiKey) {
          return new Response(JSON.stringify({ error: `${cfg.keyEnv} not configured` }), {
            status: 500,
          });
        }

        const systemPrompt = `You are Learnify AI — a Senior Technical Mentor, Research Assistant, Career Coach, Software Architect, Documentation Writer, and Product Educator. You are NOT a casual chatbot.

CORE IDENTITY
Every response must feel premium, expert-level, structured, and production-grade — like Notion AI, Perplexity Pro, or a senior consulting report. The user should feel they are interacting with a senior engineer and mentor.

GLOBAL RULES
- Provide extremely concise, direct answers.
- Use short bullet points for the best presentation. Avoid long paragraphs or fluff.
- Always be professionally formatted with proper markdown: clear H2/H3 headings, sections, subsections, tables for comparisons, numbered steps, bullet lists, and fenced code blocks with language tags.
- Always explain WHY and HOW briefly, not just WHAT.
- Include prerequisites, realistic timelines, free resources, project-based learning, industry best practices, and common mistakes when relevant, but keep them as brief bullet points.
- Use real, up-to-date information and modern tools (2025–2026 standards). Never invent libraries, courses, or links.
- No emoji spam. No motivational filler. No shallow "Here's a simple guide" intros. No unstructured text walls.

DEFAULT OUTPUT STRUCTURE (adapt sections to the question; omit irrelevant ones)
1. Title (H1)
2. Overview — short professional intro
3. Prerequisites
4. Skills Required (technical + soft)
5. Step-by-Step Roadmap / Solution (phased, with milestones)
6. Recommended Stack / Tools — explain why each
7. Free Courses & Resources — official docs, freeCodeCamp, MDN, YouTube channels, GitHub repos, practice platforms
8. Projects to Build — Beginner → Intermediate → Advanced
9. Industry Best Practices (production-level)
10. Common Mistakes
11. Timeline Estimate (realistic)
12. Career Opportunities (roles + salary ranges where relevant)
13. Final Recommendation

ROADMAP REQUESTS
When asked for a roadmap (frontend, backend, fullstack, AI, DevOps, etc.), always deliver: Beginner → Advanced phases, monthly breakdown, real project milestones, free courses, practice platforms, GitHub repos, deployment platforms, resume-worthy projects, interview prep, and career path guidance.

README REQUESTS
Generate production-grade READMEs only. Include: Project Name, Overview, Features, Tech Stack, Architecture & folder structure, Screenshots section, Installation steps, Environment Variables (example .env), API Endpoints (if backend), Authentication, Database Schema, Deployment (Vercel/Render/Docker), Performance Optimizations, Security Features (rate limiting, JWT, RLS, XSS), Future Improvements, License, Author.

CODE RESPONSES
- Explain the approach and architecture before code.
- Add inline comments.
- Discuss folder structure, scalability, security, and performance implications.
- Never dump raw code without explanation.

LEARNING REQUESTS ("How do I learn X?")
Always cover: what it is, why it matters, prerequisites, step-by-step learning path, free resources, practice projects, real-world use cases, industry tools, and portfolio projects.

QUALITY GUARDRAILS
NEVER give shallow answers, a single resource, outdated stacks, generic boilerplate, or incomplete roadmaps. ALWAYS recommend scalable architecture, deployment guidance, and production-level practices.`;

        const upstream = await fetch(cfg.url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            ...(cfg === PROVIDERS.openrouter
              ? { "HTTP-Referer": "https://learnify.ai", "X-Title": "Learnify AI" }
              : {}),
          },
          body: JSON.stringify({
            model: providerModel,
            stream: true,
            stream_options: { include_usage: true },
            messages: [
              { role: "system", content: systemPrompt },
              ...(history ?? []).map((m) => {
                let content: any = m.content;
                if (m.role === "user" && m.content.includes("![") && m.content.includes("](data:image/")) {
                  const parts: any[] = [];
                  const imgRegex = /!\[.*?\]\((data:image\/[^;]+;base64,[^\)]+)\)/g;
                  let lastIndex = 0;
                  let match;
                  while ((match = imgRegex.exec(m.content)) !== null) {
                    const textBefore = m.content.substring(lastIndex, match.index).trim();
                    if (textBefore) parts.push({ type: "text", text: textBefore });
                    parts.push({ type: "image_url", image_url: { url: match[1] } });
                    lastIndex = imgRegex.lastIndex;
                  }
                  const textAfter = m.content.substring(lastIndex).trim();
                  if (textAfter) parts.push({ type: "text", text: textAfter });
                  
                  if (parts.length > 0) {
                    content = parts;
                  }
                }
                return { role: m.role, content };
              }),
            ],
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const text = await upstream.text().catch(() => "");
          console.error("Upstream AI error", upstream.status, text);
          return new Response(JSON.stringify({ error: `AI provider error (${upstream.status})` }), {
            status: 502,
          });
        }

        // Tee: stream to client AND collect full text to persist as assistant message.
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        let assistantText = "";
        let promptTokens = 0;
        let completionTokens = 0;

        const stream = new ReadableStream({
          async start(controller) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ conversationId })}\n\n`));

            const reader = upstream.body!.getReader();
            let buffer = "";
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                let nl: number;
                while ((nl = buffer.indexOf("\n")) !== -1) {
                  let line = buffer.slice(0, nl);
                  buffer = buffer.slice(nl + 1);
                  if (line.endsWith("\r")) line = line.slice(0, -1);
                  if (!line.startsWith("data: ")) continue;
                  const payload = line.slice(6).trim();
                  if (payload === "[DONE]") continue;
                  try {
                    const json = JSON.parse(payload);
                    const delta = json.choices?.[0]?.delta?.content;
                    if (typeof delta === "string" && delta.length) {
                      assistantText += delta;
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
                    }
                    if (json.usage) {
                      promptTokens = json.usage.prompt_tokens ?? promptTokens;
                      completionTokens = json.usage.completion_tokens ?? completionTokens;
                    }
                  } catch {
                    // partial JSON; ignore
                  }
                }
              }
            } catch (err) {
              console.error("Stream error", err);
            } finally {
              if (assistantText) {
                // Estimate tokens if provider didn't send usage (~4 chars/token)
                if (!promptTokens) {
                  const promptChars =
                    (history ?? []).reduce((s, m) => s + m.content.length, 0) + systemPrompt.length;
                  promptTokens = Math.ceil(promptChars / 4);
                }
                if (!completionTokens) completionTokens = Math.ceil(assistantText.length / 4);

                const { usd, inr } = priceFor(parsed.model, promptTokens, completionTokens);

                await supabaseAdmin.from("chat_messages").insert({
                  conversation_id: conversationId,
                  user_id: userId,
                  role: "assistant",
                  content: assistantText,
                  model: parsed.model,
                  token_count: promptTokens + completionTokens,
                });
                await supabaseAdmin
                  .from("chat_conversations")
                  .update({ updated_at: new Date().toISOString() })
                  .eq("id", conversationId);

                await supabaseAdmin.from("ai_usage").insert({
                  user_id: userId,
                  conversation_id: conversationId,
                  model: parsed.model,
                  prompt_tokens: promptTokens,
                  completion_tokens: completionTokens,
                  total_tokens: promptTokens + completionTokens,
                  cost_usd: Number(usd.toFixed(6)),
                  cost_inr: Number(inr.toFixed(4)),
                  credits_charged: CREDITS_PER_REQUEST,
                });

                // Debit credits (read-modify-write; fine for low concurrency per user)
                const { data: cur } = await supabaseAdmin
                  .from("ai_credits")
                  .select("credits_remaining, credits_used")
                  .eq("user_id", userId)
                  .maybeSingle();
                const curRemaining = cur?.credits_remaining ?? (remaining as number);
                const curUsed = cur?.credits_used ?? 0;
                const newRemaining = Math.max(0, curRemaining - CREDITS_PER_REQUEST);
                await supabaseAdmin
                  .from("ai_credits")
                  .update({
                    credits_remaining: newRemaining,
                    credits_used: curUsed + CREDITS_PER_REQUEST,
                    updated_at: new Date().toISOString(),
                  })
                  .eq("user_id", userId);
                remaining = newRemaining;

                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ credits_remaining: newRemaining, cost_inr: Number(inr.toFixed(4)) })}\n\n`,
                  ),
                );
              }
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              controller.close();
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          },
        });
      },
    },
  },
});
