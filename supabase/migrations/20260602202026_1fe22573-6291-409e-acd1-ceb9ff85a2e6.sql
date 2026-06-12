
-- Transcript cache (shared across courses)
CREATE TABLE public.youtube_transcripts (
  video_id text PRIMARY KEY,
  transcript text,
  summary_md text,
  lang text NOT NULL DEFAULT 'en',
  chars integer NOT NULL DEFAULT 0,
  fetched_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.youtube_transcripts TO authenticated;
GRANT ALL ON public.youtube_transcripts TO service_role;

ALTER TABLE public.youtube_transcripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authed read transcripts"
ON public.youtube_transcripts FOR SELECT TO authenticated USING (true);

-- Enrichment run audit log
CREATE TABLE public.enrichment_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL,
  started_by uuid NOT NULL,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  finished_at timestamp with time zone,
  status text NOT NULL DEFAULT 'running',
  youtube_key_status text NOT NULL DEFAULT 'unknown',
  total integer NOT NULL DEFAULT 0,
  updated_videos integer NOT NULL DEFAULT 0,
  updated_transcripts integer NOT NULL DEFAULT 0,
  warnings jsonb NOT NULL DEFAULT '[]'::jsonb,
  failures jsonb NOT NULL DEFAULT '[]'::jsonb,
  with_transcript boolean NOT NULL DEFAULT true
);
CREATE INDEX idx_enrichment_runs_course ON public.enrichment_runs(course_id, started_at DESC);

GRANT SELECT ON public.enrichment_runs TO authenticated;
GRANT ALL ON public.enrichment_runs TO service_role;

ALTER TABLE public.enrichment_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creator or admin view runs"
ON public.enrichment_runs FOR SELECT TO authenticated
USING (
  started_by = auth.uid()
  OR has_role(auth.uid(), 'super_admin'::app_role)
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM public.courses c WHERE c.id = enrichment_runs.course_id AND c.created_by = auth.uid())
);

-- Per-lesson progress (realtime)
CREATE TABLE public.enrichment_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES public.enrichment_runs(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL,
  lesson_title text NOT NULL,
  state text NOT NULL DEFAULT 'pending',
  message text,
  order_index integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(run_id, lesson_id)
);
CREATE INDEX idx_enrichment_progress_run ON public.enrichment_progress(run_id, order_index);

GRANT SELECT ON public.enrichment_progress TO authenticated;
GRANT ALL ON public.enrichment_progress TO service_role;

ALTER TABLE public.enrichment_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View progress for accessible runs"
ON public.enrichment_progress FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.enrichment_runs r
    WHERE r.id = enrichment_progress.run_id
      AND (
        r.started_by = auth.uid()
        OR has_role(auth.uid(), 'super_admin'::app_role)
        OR has_role(auth.uid(), 'admin'::app_role)
        OR EXISTS (SELECT 1 FROM public.courses c WHERE c.id = r.course_id AND c.created_by = auth.uid())
      )
  )
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.enrichment_progress;
ALTER TABLE public.enrichment_progress REPLICA IDENTITY FULL;
