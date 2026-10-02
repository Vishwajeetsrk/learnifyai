-- Lesson transcripts (YouTube + self-hosted MP4), shared across player/AI features.
-- One row per lesson: timed segments for the player + cached AI summary ("remember" fast path).
-- APPLY: run this file in the Supabase SQL editor (service_role / postgres).

CREATE TABLE IF NOT EXISTS public.lesson_transcripts (
  lesson_id uuid PRIMARY KEY REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  source text NOT NULL DEFAULT 'youtube' CHECK (source IN ('youtube', 'mp4', 'upload')),
  transcript_text text NOT NULL DEFAULT '',
  segments jsonb NOT NULL DEFAULT '[]'::jsonb,
  chars integer NOT NULL DEFAULT 0,
  lang text NOT NULL DEFAULT 'en',
  summary_md text,
  summary_updated_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lesson_transcripts_course ON public.lesson_transcripts(course_id);

GRANT SELECT ON public.lesson_transcripts TO authenticated;
GRANT ALL ON public.lesson_transcripts TO service_role;

ALTER TABLE public.lesson_transcripts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authed read lesson transcripts" ON public.lesson_transcripts;
CREATE POLICY "Authed read lesson transcripts"
ON public.lesson_transcripts FOR SELECT TO authenticated USING (true);
