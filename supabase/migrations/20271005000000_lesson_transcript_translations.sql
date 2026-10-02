-- Cached AI translations of lesson transcripts, keyed by language code:
-- translations = { "hi": { "text": "...", "segments": [...], "updated_at": "..." }, ... }
-- APPLY: run in Supabase SQL editor (service_role / postgres).

ALTER TABLE public.lesson_transcripts
  ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb;
