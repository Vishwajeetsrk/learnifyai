import { validateAIPrompt } from "@/lib/ai-firewall";

export type ChatBody = {
  model?: string;
  messages: Array<{ role: string; content: string }>;
  response_format?: unknown;
  temperature?: number;
  max_tokens?: number;
  task?: "summary" | "exercise" | "quiz" | "doubt" | "general" | "chat";
};

export interface AIProviderConfig {
  name: string;
  keyEnv: string;
  url: string;
  primaryModel: string;
  fallbackModels: string[];
  maxTokensDefault: number;
  maxRetries: number;
  headers?: Record<string, string>;
}

export interface ModelRegistryEntry {
  id: string;
  provider: "groq" | "gemini" | "openrouter" | "nvidia" | "huggingface" | "local";
  displayName: string;
  contextWindow: number;
  maxOutputTokens: number;
  recommendedTask: string;
  enabled: boolean;
  modality?: "text" | "vision" | "multimodal" | "image" | "embedding";
}

export const AI_MODEL_REGISTRY: ModelRegistryEntry[] = [
  {
    id: "groq/llama-3.3-70b-versatile",
    provider: "groq",
    displayName: "Groq — Llama 3.3 70B (Ultra Fast)",
    contextWindow: 128000,
    maxOutputTokens: 2500,
    recommendedTask: "Summaries & Quick Explanations",
    enabled: true,
    modality: "text",
  },
  {
    id: "groq/llama-3.1-8b-instant",
    provider: "groq",
    displayName: "Groq — Llama 3.1 8B (Instant)",
    contextWindow: 128000,
    maxOutputTokens: 2000,
    recommendedTask: "Instant Q&A & Flashcards",
    enabled: true,
    modality: "text",
  },
  {
    id: "gemini/gemini-2.0-flash",
    provider: "gemini",
    displayName: "Gemini — 2.0 Flash (Multimodal & Fast)",
    contextWindow: 1048576,
    maxOutputTokens: 2500,
    recommendedTask: "Lesson Tutoring & Visual Help",
    enabled: true,
    modality: "multimodal",
  },
  {
    id: "gemini/gemini-1.5-flash",
    provider: "gemini",
    displayName: "Gemini — 1.5 Flash (Rock Solid)",
    contextWindow: 1048576,
    maxOutputTokens: 2000,
    recommendedTask: "Course Summaries & Doubts",
    enabled: true,
    modality: "multimodal",
  },
  {
    id: "gemini/gemini-1.5-pro",
    provider: "gemini",
    displayName: "Gemini — 1.5 Pro (Deep Reasoning)",
    contextWindow: 2097152,
    maxOutputTokens: 3000,
    recommendedTask: "Complex Code & Architecture",
    enabled: true,
    modality: "multimodal",
  },
  {
    id: "gemini/imagen-3.0-generate-002",
    provider: "gemini",
    displayName: "Google Imagen 3 (High-Fidelity Visuals)",
    contextWindow: 0,
    maxOutputTokens: 0,
    recommendedTask: "Course Artwork & Thumbnails",
    enabled: true,
    modality: "image",
  },
  {
    id: "huggingface/stabilityai/stable-diffusion-xl-base-1.0",
    provider: "huggingface",
    displayName: "Stable Diffusion XL (Hosted Inference)",
    contextWindow: 0,
    maxOutputTokens: 0,
    recommendedTask: "Thumbnails & Background Art",
    enabled: true,
    modality: "image",
  },
  {
    id: "local/stable-diffusion-v1-5",
    provider: "local",
    displayName: "Local Stable Diffusion v1.5 (A1111/ComfyUI API)",
    contextWindow: 0,
    maxOutputTokens: 0,
    recommendedTask: "Offline / On-Premise Visual Assets (Requires ~10GB VRAM)",
    enabled: false,
    modality: "image",
  },
  {
    id: "openrouter/google/gemini-2.0-flash-001",
    provider: "openrouter",
    displayName: "OpenRouter — Gemini 2.0 Flash",
    contextWindow: 1000000,
    maxOutputTokens: 2500,
    recommendedTask: "Secondary Fallback",
    enabled: true,
    modality: "multimodal",
  },
  {
    id: "openrouter/meta-llama/llama-3.3-70b-instruct",
    provider: "openrouter",
    displayName: "OpenRouter — Llama 3.3 70B Instruct",
    contextWindow: 131072,
    maxOutputTokens: 2500,
    recommendedTask: "Secondary Coding Backup",
    enabled: true,
    modality: "text",
  },
];

export const TASK_TOKEN_BUDGETS: Record<string, number> = {
  summary: 1500,
  exercise: 2000,
  quiz: 1500,
  doubt: 2000,
  general: 2000,
  chat: 2500,
};

const USER_AI_PROVIDERS: AIProviderConfig[] = [
  {
    name: "Groq",
    keyEnv: "GROQ_API_KEY",
    url: "https://api.groq.com/openai/v1/chat/completions",
    primaryModel: "llama-3.3-70b-versatile",
    fallbackModels: ["llama-3.1-8b-instant", "llama3-70b-8192"],
    maxTokensDefault: 2000,
    maxRetries: 2,
  },
  {
    name: "Gemini API",
    keyEnv: "GEMINI_API_KEY",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    primaryModel: "gemini-2.0-flash",
    fallbackModels: ["gemini-1.5-flash", "gemini-1.5-pro"],
    maxTokensDefault: 2000,
    maxRetries: 2,
  },
  {
    name: "OpenRouter",
    keyEnv: "OPENROUTER_API_KEY",
    url: "https://openrouter.ai/api/v1/chat/completions",
    primaryModel: "google/gemini-2.0-flash-001",
    fallbackModels: ["meta-llama/llama-3.3-70b-instruct"],
    maxTokensDefault: 2000,
    maxRetries: 1,
    headers: {
      "HTTP-Referer": "https://www.learnifyai.in",
      "X-Title": "Learnify AI",
    },
  },
];

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// In-memory LRU for identical AI requests — repeat questions answer instantly.
// Key = hash(task + model + temperature + messages). 10-min TTL, capped at 100 entries.
const AI_RESPONSE_CACHE = new Map<string, { body: string; at: number }>();
const AI_CACHE_TTL_MS = 10 * 60 * 1000;
const AI_CACHE_MAX = 100;

function hashRequest(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  }
  return `ai:${(h >>> 0).toString(36)}`;
}

function getCachedAiResponse(key: string): Response | null {
  const hit = AI_RESPONSE_CACHE.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > AI_CACHE_TTL_MS) {
    AI_RESPONSE_CACHE.delete(key);
    return null;
  }
  // Refresh recency
  AI_RESPONSE_CACHE.delete(key);
  AI_RESPONSE_CACHE.set(key, hit);
  return new Response(hit.body, {
    status: 200,
    headers: { "Content-Type": "application/json", "X-Learnify-Cache": "hit" },
  });
}

function setCachedAiResponse(key: string, body: string) {
  AI_RESPONSE_CACHE.set(key, { body, at: Date.now() });
  if (AI_RESPONSE_CACHE.size > AI_CACHE_MAX) {
    const oldest = AI_RESPONSE_CACHE.keys().next().value;
    if (oldest) AI_RESPONSE_CACHE.delete(oldest);
  }
}

export function normalizeAiError(
  failures: Array<{ provider: string; status?: number; errorSnippet?: string }>,
): string {
  // Detailed provider diagnostic logged strictly on server side — never shown to user
  console.error(
    "[AI Gateway] All provider attempts exhausted:",
    failures
      .map((f) => `${f.provider} (status: ${f.status || "network"}) => ${f.errorSnippet || "no details"}`)
      .join(" | "),
  );

  const has429 = failures.some((f) => f.status === 429);
  const has402 = failures.some((f) => f.status === 402 || f.errorSnippet?.includes("credit") || f.errorSnippet?.includes("quota"));
  const has503 = failures.some((f) => f.status === 503 || f.status === 502);

  if (has429) {
    return "The AI service is experiencing high demand. Please try again in a few moments.";
  }
  if (has402) {
    return "AI generation capacity is temporarily allocated. Switching to our secondary engine — please try again in 5 seconds.";
  }
  if (has503) {
    return "The AI engine is temporarily busy. Retrying with an alternate model...";
  }
  return "AI assistance is temporarily unavailable. Please try again shortly or contact support if this continues.";
}

/**
 * Robust AI Gateway with Token Budgeting, Multi-Model Fallbacks, and Error Normalization.
 * Enforces task-specific output token limits so OpenRouter never requests 65,535 tokens.
 */
export async function callUserAiChat(body: ChatBody, quality: "fast" | "pro" = "fast") {
  const userMessages = body.messages.filter((m) => m.role === "user");
  const latestPrompt = userMessages[userMessages.length - 1]?.content || "";
  const safety = validateAIPrompt(latestPrompt);
  if (!safety.safe) {
    throw new Error(safety.reason || "Safety policy violation: Request rejected by AI Firewall.");
  }

  // 1. Task-Specific Token Budgeting
  // Clamps output tokens to reasonable task ranges (1,000–2,500), preventing OpenRouter 402 "requested up to 65535 tokens"
  const defaultTokens = body.task ? TASK_TOKEN_BUDGETS[body.task] || 2000 : quality === "pro" ? 2500 : 1500;
  const maxTokens = body.max_tokens ? Math.min(Math.max(body.max_tokens, 100), 4000) : defaultTokens;

  // Trim excess context history if payload is abnormally large
  let sanitizedMessages = [...body.messages];
  if (sanitizedMessages.length > 12) {
    const system = sanitizedMessages.find((m) => m.role === "system");
    const recent = sanitizedMessages.slice(-8);
    sanitizedMessages = system ? [system, ...recent.filter((m) => m !== system)] : recent;
  }

  const payloadBase = {
    ...body,
    messages: sanitizedMessages,
    max_tokens: maxTokens,
  };

  // Fast path: identical recent request → answer instantly without hitting providers
  const cacheKey = hashRequest(
    JSON.stringify({
      task: body.task ?? null,
      model: body.model ?? null,
      temperature: (body as any).temperature ?? null,
      max_tokens: maxTokens,
      messages: sanitizedMessages,
    }),
  );
  const cached = getCachedAiResponse(cacheKey);
  if (cached) return cached;

  const failures: Array<{ provider: string; status?: number; errorSnippet?: string }> = [];

  // Preferred-provider routing: a body.model like "gemini/..." tries that
  // provider's chain first so speed/capability-sensitive tasks land correctly.
  const preferred = body.model?.split("/")[0]?.toLowerCase() ?? "";
  const orderedProviders =
    preferred.length > 0
      ? [...USER_AI_PROVIDERS].sort((a, b) => {
          const score = (p: (typeof USER_AI_PROVIDERS)[number]) =>
            p.name.toLowerCase().includes(preferred) ? 0 : 1;
          return score(a) - score(b);
        })
      : USER_AI_PROVIDERS;

  for (const provider of orderedProviders) {
    const apiKey = process.env[provider.keyEnv]?.trim();
    if (!apiKey) continue;

    // Collect candidate models for this provider in priority order
    const candidateModels = [
      body.model && body.model.includes(provider.name.toLowerCase()) ? body.model : provider.primaryModel,
      ...provider.fallbackModels,
    ];

    let providerSuccessResponse: Response | null = null;

    for (const modelId of candidateModels) {
      if (providerSuccessResponse) break;

      for (let attempt = 0; attempt <= provider.maxRetries; attempt++) {
        if (attempt > 0) {
          const delay = Math.min(600 * Math.pow(2, attempt - 1), 2500);
          await sleep(delay);
        }

        try {
          // Fail fast (25s) so a hung provider cascades to the next one instead of stalling
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 25000);
          let res: Response;
          try {
            res = await fetch(provider.url, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                ...(provider.headers || {}),
              },
              body: JSON.stringify({
                ...payloadBase,
                model: modelId,
              }),
              signal: ctrl.signal,
            });
          } finally {
            clearTimeout(timer);
          }

          if (res.ok) {
            // Remember success: identical repeat requests skip providers entirely
            try {
              const bodyText = await res.text();
              setCachedAiResponse(cacheKey, bodyText);
              providerSuccessResponse = new Response(bodyText, {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            } catch {
              providerSuccessResponse = res;
            }
            break;
          }

          const errorText = await res.text().catch(() => "");
          failures.push({
            provider: `${provider.name} (${modelId})`,
            status: res.status,
            errorSnippet: errorText.slice(0, 160),
          });

          // If 404 (model not found / deprecated) or 400 with invalid model, stop retrying this model and move to alternate model
          if (res.status === 404 || errorText.toLowerCase().includes("model_not_found")) {
            console.warn(`[AI Gateway] Model ${modelId} not found on ${provider.name}. Trying alternate model.`);
            break;
          }

          // If rate limit (429) or transient 503, retry with backoff
          if (res.status === 429 || res.status >= 500) {
            continue;
          }

          // Non-retriable provider error (e.g. 401, 402) - stop retrying this provider and cascade to next provider
          break;
        } catch (err: any) {
          failures.push({
            provider: `${provider.name} (${modelId})`,
            errorSnippet: err?.message || "network error",
          });
          continue;
        }
      }
    }

    if (providerSuccessResponse) {
      return providerSuccessResponse;
    }
  }

  if (failures.length === 0) {
    throw new Error(
      "No active AI API keys configured. Please configure GEMINI_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY.",
    );
  }

  // Normalize error — never expose raw provider JSON, API keys, or provider internal names to user
  const friendlyMessage = normalizeAiError(failures);
  throw new Error(friendlyMessage);
}

/**
 * Health Check ping for Admin to test an AI provider connection safely
 */
export async function testAiProviderConnection(providerName: "groq" | "gemini" | "openrouter", customKey?: string) {
  const provider = USER_AI_PROVIDERS.find((p) => p.name.toLowerCase().includes(providerName));
  if (!provider) {
    return { ok: false, status: 400, message: `Unknown provider: ${providerName}` };
  }

  const key = customKey?.trim() || process.env[provider.keyEnv]?.trim();
  if (!key) {
    return { ok: false, status: 401, message: `No API key configured for ${provider.name}.` };
  }

  const startTime = Date.now();
  try {
    const res = await fetch(provider.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        ...(provider.headers || {}),
      },
      body: JSON.stringify({
        model: provider.primaryModel,
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 10,
      }),
    });

    const latencyMs = Date.now() - startTime;
    if (res.ok) {
      return { ok: true, latencyMs, model: provider.primaryModel, message: `Healthy (${latencyMs}ms)` };
    }

    const txt = await res.text().catch(() => "");
    return {
      ok: false,
      status: res.status,
      latencyMs,
      message: `Failed HTTP ${res.status}: ${txt.slice(0, 120)}`,
    };
  } catch (err: any) {
    return {
      ok: false,
      status: 500,
      latencyMs: Date.now() - startTime,
      message: `Network error: ${err?.message || "Failed to reach provider"}`,
    };
  }
}

