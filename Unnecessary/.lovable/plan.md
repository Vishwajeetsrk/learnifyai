# YouTube enrichment: progress, caching, audit, retries, tests

This is a large batch. I'll ship it in 3 turns so each piece is verified before stacking the next.

## Turn 1 — Backend resilience + persistence (foundation)

**Schema (one migration):**

- `youtube_transcripts` — cache table keyed by `video_id` (PK). Columns: `transcript text`, `summary_md text|null`, `lang text default 'en'`, `fetched_at`, `chars int`. RLS: read for authenticated, write only via server (service_role).
- `enrichment_runs` — audit log. Columns: `id`, `course_id`, `started_by`, `started_at`, `finished_at`, `status` (running/completed/failed), `youtube_key_status` (ok/invalid/quota/missing), `total`, `updated_videos`, `updated_transcripts`, `warnings jsonb`, `failures jsonb`. RLS: course creator + admins read; insert/update via server.
- `enrichment_progress` — per-lesson live status for the active run. Columns: `run_id`, `lesson_id`, `lesson_title`, `state` (pending/searching/transcript/summarizing/done/skipped/failed), `message text`, `updated_at`. Realtime enabled. RLS: same as `enrichment_runs`.

**Server (`src/lib/youtube.functions.ts`):**

- Add `fetchWithRetry()` — exponential backoff (250ms → 2s, 3 attempts) for 429 / 5xx; pass through 4xx as-is.
- Wrap `ytFetchVideoMeta` / `ytSearchTopVideo` with retry; preserve `explainYoutubeError` messaging on final failure.
- `fetchTranscript()` checks `youtube_transcripts` cache first; on miss, fetches + persists. `aiSummarizeTranscript()` also persists `summary_md` to the cache row.
- `regenerateCourseFromYouTube` now:
  - creates an `enrichment_runs` row (status=running),
  - upserts a `enrichment_progress` row per lesson as it advances states,
  - records warnings + failures, sets `youtube_key_status`, finalizes the run row.
- Add `getEnrichmentRun({ runId })` and `listCourseEnrichmentRuns({ courseId })` server fns for the UI.

## Turn 2 — Creator UI: progress dialog + audit history

In `src/routes/_authenticated/studio.tsx`:

- "Re-run YouTube enrichment" opens a dialog showing:
  - overall progress bar (`done / total`),
  - per-lesson list with state badge + message,
  - **ETA** computed from rolling avg of completed lessons × remaining,
  - YouTube key status pill,
  - warnings + failure list.
- Subscribes to `enrichment_progress` via Supabase Realtime, falls back to polling every 3s.
- Below the dialog trigger: collapsible "Past runs" table (last 10) from `enrichment_runs`.

## Turn 3 — Tests

`src/lib/__tests__/youtube.test.ts` with Vitest (already available via `bunx vitest run`):

- `explainYoutubeError` maps each known reason → friendly message.
- `fetchWithRetry` retries on 429/503, gives up after N attempts, does NOT retry 400/403/404.
- `verifyYoutubeKey` happy path + invalid-key path + missing-env path (mock global `fetch`).
- `extractVideoId` covers `youtu.be`, `?v=`, `/embed/`, `/shorts/`, raw 11-char.

## Technical notes

- All long-running work stays inside `createServerFn` (no Worker timeout risk — Gemini summarization is the slowest step at ~10s/lesson; retries are short).
- Transcript cache is keyed by `video_id` only — same video used across courses reuses the cached summary. Summary regeneration can be forced via a `force: true` flag (skipped from UI for now).
- Realtime publication: `ALTER PUBLICATION supabase_realtime ADD TABLE public.enrichment_progress;`
- ETA = `avg(perLessonMs) * (total - done)`, hidden until ≥2 lessons complete.
- No changes to the course builder's inline YouTube enrichment loop in this batch (already has graceful quota handling).

## Files

**Created:** migration, `src/lib/__tests__/youtube.test.ts`, `src/components/EnrichmentProgressDialog.tsx`
**Edited:** `src/lib/youtube.functions.ts`, `src/routes/_authenticated/studio.tsx`

Proceed with Turn 1 (migration + server changes) on approval?
