type ChatBody = {
  model?: string;
  messages: Array<{ role: string; content: string }>;
  response_format?: unknown;
  temperature?: number;
  max_tokens?: number;
};

const USER_AI_PROVIDERS = [
  {
    name: "Groq",
    keyEnv: "GROQ_API_KEY",
    url: "https://api.groq.com/openai/v1/chat/completions",
    models: [
      "llama-3.3-70b-versatile",
      "llama-3.1-70b-versatile",
      "llama3-70b-8192",
      "llama-3.1-8b-instant",
      "mixtral-8x7b-32768",
    ],
    maxRetries: 1,
  },
  {
    name: "Gemini API",
    keyEnv: "GEMINI_API_KEY",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    models: [
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-2.5-flash",
      "gemini-2.5-pro",
    ],
    maxRetries: 1,
  },
  {
    name: "OpenRouter",
    keyEnv: "OPENROUTER_API_KEY",
    url: "https://openrouter.ai/api/v1/chat/completions",
    models: [
      "google/gemini-2.0-flash-001",
      "meta-llama/llama-3.3-70b-instruct",
      "google/gemini-1.5-flash",
      "deepseek/deepseek-chat",
    ],
    maxRetries: 1,
  },
];

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

import { validateAIPrompt } from "@/lib/ai-firewall";

export async function callUserAiChat(body: ChatBody, quality: "fast" | "pro" = "fast") {
  const userMessages = body.messages.filter((m) => m.role === "user");
  const latestPrompt = userMessages[userMessages.length - 1]?.content || "";
  const safety = validateAIPrompt(latestPrompt);
  if (!safety.safe) {
    throw new Error(safety.reason || "Safety policy violation: Request rejected by AI Firewall.");
  }

  // Ensure max_tokens is safely clamped to prevent OpenRouter 402 budget rejection errors
  const clampedBody = {
    ...body,
    max_tokens: Math.min(body.max_tokens ?? 4096, 4096),
  };

  const failures: string[] = [];

  for (const provider of USER_AI_PROVIDERS) {
    const apiKey = process.env[provider.keyEnv];
    if (!apiKey) continue;

    // Determine model candidate list for this provider
    const candidateModels = body.model
      ? [body.model, ...provider.models]
      : provider.models;

    let lastError = "";

    for (const modelCandidate of candidateModels) {
      // Strip provider prefix if present (e.g., 'gemini/gemini-2.0-flash' -> 'gemini-2.0-flash')
      const targetModel =
        modelCandidate.includes("/") && provider.name !== "OpenRouter"
          ? modelCandidate.split("/").pop()!
          : modelCandidate;

      for (let attempt = 0; attempt <= provider.maxRetries; attempt++) {
        if (attempt > 0) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 3000);
          await sleep(delay);
        }

        try {
          const res = await fetch(provider.url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              ...(provider.name === "OpenRouter"
                ? { Referer: "https://learnify.ai", "X-Title": "Learnify AI" }
                : {}),
            },
            body: JSON.stringify({ ...clampedBody, model: targetModel }),
          });

          if (res.ok) return res;

          const text = await res.text().catch(() => "");
          lastError = `${provider.name} (${targetModel}) ${res.status}${text ? `: ${text.slice(0, 180)}` : ""}`;

          // If 404 (model not found/deprecated) or 400 invalid model, break attempt loop to try next model candidate immediately!
          if (res.status === 404 || (res.status === 400 && text.includes("model"))) {
            break;
          }

          if (res.status === 429 || res.status >= 500) {
            continue;
          }
          break;
        } catch (err: any) {
          lastError = `${provider.name} network error: ${err?.message || "unknown"}`;
          continue;
        }
      }

      // If we got a valid response, we already returned. If lastError is not 404/model error, don't try all candidates endlessly unless 404.
      if (
        !lastError.includes("404") &&
        !lastError.includes("not found") &&
        !lastError.includes("does not exist") &&
        !lastError.includes("no longer available")
      ) {
        break;
      }
    }

    if (lastError) failures.push(lastError);
  }

  if (!failures.length)
    throw new Error(
      "No AI API key configured. Add GEMINI_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY.",
    );
  throw new Error(`AI provider error: ${failures.join(" | ")}`);
}
