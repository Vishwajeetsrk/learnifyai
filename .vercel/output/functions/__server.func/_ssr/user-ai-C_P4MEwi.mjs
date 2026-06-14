const USER_AI_PROVIDERS = [
  {
    name: "Gemini API",
    keyEnv: "GEMINI_API_KEY",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    fastModel: "gemini-2.5-flash",
    proModel: "gemini-2.5-pro"
  },
  {
    name: "Groq",
    keyEnv: "GROQ_API_KEY",
    url: "https://api.groq.com/openai/v1/chat/completions",
    fastModel: "llama-3.3-70b-versatile",
    proModel: "llama-3.3-70b-versatile"
  },
  {
    name: "OpenRouter",
    keyEnv: "OPENROUTER_API_KEY",
    url: "https://openrouter.ai/api/v1/chat/completions",
    fastModel: "google/gemini-2.5-flash",
    proModel: "google/gemini-2.5-pro"
  }
];
async function callUserAiChat(body, quality = "fast") {
  const failures = [];
  for (const provider of USER_AI_PROVIDERS) {
    const apiKey = process.env[provider.keyEnv];
    if (!apiKey) continue;
    const model = body.model ?? (quality === "pro" ? provider.proModel : provider.fastModel);
    const res = await fetch(provider.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...provider.name === "OpenRouter" ? { Referer: "https://learnify.ai", "X-Title": "Learnify AI" } : {}
      },
      body: JSON.stringify({ ...body, model })
    });
    if (res.ok) return res;
    const text = await res.text().catch(() => "");
    failures.push(`${provider.name} ${res.status}${text ? `: ${text.slice(0, 180)}` : ""}`);
  }
  if (!failures.length)
    throw new Error(
      "No AI API key configured. Add GEMINI_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY."
    );
  throw new Error(`AI provider error: ${failures.join(" | ")}`);
}
export {
  callUserAiChat as c
};
