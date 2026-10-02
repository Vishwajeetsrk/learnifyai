-- Cached mid-video quiz checkpoints per lesson:
-- quiz = [{ "id": "q1", "time": 95, "question": "...", "options": ["a","b","c","d"], "answer": 1, "explanation": "..." }]
-- APPLY: run in Supabase SQL editor (service_role / postgres).

ALTER TABLE public.lesson_transcripts
  ADD COLUMN IF NOT EXISTS quiz jsonb NOT NULL DEFAULT '[]'::jsonb;
