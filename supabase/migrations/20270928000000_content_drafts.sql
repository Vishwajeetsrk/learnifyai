-- Content Drafts persistence table for Learnify AI Content Management System
CREATE TABLE IF NOT EXISTS public.content_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module TEXT NOT NULL,
  record_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT '',
  draft_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  version INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_autosaved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT content_drafts_unique_record UNIQUE (module, record_id, user_id)
);

ALTER TABLE public.content_drafts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage content drafts" ON public.content_drafts;
CREATE POLICY "Admins manage content drafts" ON public.content_drafts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_content_drafts_lookup ON public.content_drafts(module, record_id, user_id);
CREATE INDEX IF NOT EXISTS idx_content_drafts_updated ON public.content_drafts(updated_at DESC);
