# MYRAA / Learnify AI — AI Gateway & Model Infrastructure V2 Audit Report

> **Author**: Principal AI Infrastructure Architect  
> **Date**: October 2026  
> **Project**: Learnify AI 4.6 / MYRAA AI Gateway  
> **Status**: COMPLETED AUDIT & CANONICAL ARCHITECTURE SPECIFICATION  

---

## 1. Executive Summary & Objective

Learnify AI incorporates an intelligent, multi-provider AI engine ("MYRAA") across student tutoring, lesson content generation, coding assistance, document RAG, career roadmaps, and presentation generation. This audit establishes a single, unified server-side AI Gateway rather than disparate, feature-by-feature AI integrations.

### Key Mandates
1. **Zero Disconnected AI Layers**: Every feature routes through the canonical gateway.
2. **Strict Credential Hygiene**: No API keys or secrets in client bundles; strictly enforce `.env.example` placeholders.
3. **Pluggable Multi-Provider Architecture**: Groq, Gemini, OpenRouter, NVIDIA, and local inference (Ollama / Local Stable Diffusion).
4. **Stable Diffusion Research Review**: Full evaluation of `CompVis/stable-diffusion` for image/thumbnail generation.

---

## 2. Comprehensive Inventory of Existing AI Systems

| System / Component | Primary File(s) | Role & Status | Issues / Duplication Found |
| :--- | :--- | :--- | :--- |
| **Chat API Route** | `src/routes/api/chat.ts` | Server-Sent Events (SSE) streaming endpoint with token budgeting, AI firewall, and Redis rate limiting. | Handles chat & agent conversations; historically separate from standalone tools. |
| **Model Registry** | `src/lib/user-ai.ts` | Authoritative registry of Groq, Gemini, OpenRouter models and connection tester. | Previously did not include image generation or local models in registry. |
| **Admin AI Infrastructure** | `src/components/admin/AiInfrastructureManager.tsx` & `src/lib/ai-gateway-admin.functions.ts` | Admin dashboard for testing provider health and viewing masked credentials. | Works well; tested against real providers; expandable for image & local backends. |
| **AI Firewall** | `src/lib/ai-firewall.ts` | Prompt injection detection, system-prompt leak defense, regex guards. | Reusable; applied in `/api/chat`. |
| **RAG / Vector Ingestion** | `src/lib/rag.functions.ts` | Document ingestion, chunking, embedding generation, pgvector matching. | Uses Gemini embedding models; supports course & document context. |
| **Thumbnail & Visual Generation** | `src/lib/thumbnail.functions.ts` & `src/components/ThumbnailEditor.tsx` | Thumbnail prompt generation + image synthesis. | Historically routed directly to Gemini image generation; needs pluggable adapter for Stable Diffusion / HuggingFace. |
| **Playground AI** | `src/lib/playground/ai.ts` & `src/components/playground/` | Interactive coding sandbox assistance. | Functional; uses `/api/chat` streaming interface. |
| **Lesson & Course Generation** | `src/lib/lesson-ai.functions.ts` | Server functions generating syllabus, lessons, quizzes. | Cleanly integrated with model fallback. |

---

## 3. Security & Credential Hygiene Audit

1. **Client Bundle Scan**:
   - `VITE_` prefixed variables inspected. Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are exposed to the client, which is standard for Supabase client-side sessions.
   - `GROQ_API_KEY`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY`, `CASHFREE_SECRET_KEY`, and `RESEND_API_KEY` are kept server-side only in `.env` and accessed via TanStack Start `createServerFn` or `/api/chat`.
2. **Repository File Audit**:
   - No plaintext secrets found hardcoded in version-controlled `.ts`, `.tsx`, or markdown files.
   - `.gitignore` properly excludes `.env*` and explicitly keeps `!.env.example`.
   - `.env.example` has been created with sanitized placeholders for all providers and payment gateways.

---

## 4. Stable Diffusion Integration & Feasibility Analysis

### Analysis of `CompVis/stable-diffusion`
- **Source**: `https://github.com/CompVis/stable-diffusion` (Original Latent Diffusion Models by Rombach et al.)
- **License**: CreativeML OpenRAIL M license with strict downstream usage restrictions (no harmful/deceptive generation, military use, or illegal content).
- **Hardware Profile**:
  - The v1 model requires a discrete NVIDIA GPU with **~10 GB VRAM** for FP32/FP16 inference at 512x512 resolution.
  - On serverless environments (e.g., Vercel Functions), running local Python PyTorch/CUDA inference is **physically impossible** due to 250MB–1GB bundle limits and lack of GPU passthrough.
- **Recommended Architectural Pattern**:
  ```
  Client / Thumbnail Editor / Visual Generator
                      │
                      ▼
            Image Generation API
                      │
                      ▼
            Image Provider Adapter
                      │
        ┌─────────────┼──────────────┐
        ▼             ▼              ▼
  Hosted Provider   Local SD Worker  Cloud Inference
  (Gemini / HF)     (A1111/ComfyUI)  (Replicate/RunPod)
  ```
  - **Phase A**: Use Google Gemini 2.0 Flash / Imagen 3 or Hugging Face Inference API for production Vercel deployment.
  - **Phase B**: Expose a pluggable adapter endpoint (`LOCAL_SD_ENDPOINT`) to route requests to a self-hosted GPU worker (e.g. running Automatic1111 / ComfyUI / diffusers) when configured in `.env`.
  - **Thumbnail Composition Rule**: Separate art generation from typography. Generate background visuals with Stable Diffusion / Gemini, then overlay SVG text & branding badges deterministically in `ThumbnailEditor.tsx`.

---

## 5. Canonical MYRAA AI Gateway Architecture

```
User / Feature Request (Chat, Code, RAG, Tutor, Career, Resume, Slide)
                                │
                                ▼
                      Task & Intent Router
          (Modality, Token Budget, Privacy Level, Latency SLA)
                                │
                                ▼
                       AI Firewall Guard
              (Prompt Injection & Toxic Input Defense)
                                │
                                ▼
                      Unified Model Router
        ┌───────────────────────┼──────────────────────┐
        ▼                       ▼                      ▼
  High-Throughput        Deep Reasoning          Multimodal &
   (Groq Llama 3.3)      (Gemini 1.5 Pro)          Vision (Gemini 2.0)
        │                       │                      │
        └───────────────────────┼──────────────────────┘
                                ▼
                       Fallback & Retry Engine
          (Primary Fail ➔ Secondary Model ➔ Local/OpenRouter)
                                │
                                ▼
                       Rate Limiter & Cache
              (Upstash Redis + Token-Bucket Fallback)
                                │
                                ▼
                 Streaming Response & Telemetry
```

---

## 6. Provider Verification & Capabilities Matrix

| Provider | Key Env | Status | Latency SLA | Modality | Primary Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Groq Cloud** | `GROQ_API_KEY` | Available | ~250ms (ultra-fast) | Text, Code | Quick Q&A, Chat, Summaries, Instant Flashcards |
| **Google Gemini** | `GEMINI_API_KEY` | Available | ~800ms | Text, Vision, Audio, Embeddings | Long-Context Documents, RAG, Lesson Tutoring |
| **OpenRouter** | `OPENROUTER_API_KEY` | Available | ~1.2s | Multi-model fallback | Resilient backup for Llama & Gemini models |
| **Local Inference** | `OLLAMA_BASE_URL` | Pluggable | Depends on host | Text, Code | Offline-first / local privacy processing |
| **Local Stable Diffusion**| `LOCAL_SD_ENDPOINT` | Pluggable | ~3s (GPU dependent) | Image | On-premise / GPU workstation visual generation |

---

## 7. Next Action Plan & Milestones

1. **Deploy Model Registry Extensions**: Incorporate image and embedding task tags directly into `src/lib/user-ai.ts`.
2. **Consolidate Rate Limiting**: Ensure all new server endpoints utilize the unified `src/lib/api-rate-limit.ts` helper.
3. **Enhance Vercel Configuration**: Ensure all serverless routes and cron functions have appropriate execution timeouts and memory settings in `vercel.json`.
4. **Documentation Sync**: Update root `README.md` with complete architecture changelog and deployment instructions.
