-- Stale-summary detection: hash of (notes + video_url + transcript) at summary time.
-- If lesson content changes, the hash mismatches and the summary regenerates.
-- APPLY: run in Supabase SQL editor (service_role / postgres).

ALTER TABLE public.lesson_transcripts
  ADD COLUMN IF NOT EXISTS content_hash text;
