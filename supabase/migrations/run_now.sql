UPDATE site_settings SET value = (
  SELECT jsonb_agg(item) FROM jsonb_array_elements(value::jsonb) AS item
  WHERE item->>'title' != 'Vishwajeet'
) WHERE key = 'roadmap_items' AND value::text LIKE '%Vishwajeet%';
UPDATE courses SET cover_url = NULL WHERE slug = 'ai-prompt-engineering';
UPDATE job_postings SET active = false WHERE title = 'UI/UX Designer';

-- Ensure XP Store table exists (20270715000000_xp_store_purchases)
CREATE TABLE IF NOT EXISTS public.xp_purchases (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  perk_id     TEXT NOT NULL,
  perk_name   TEXT NOT NULL,
  cost        INTEGER NOT NULL CHECK (cost > 0),
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_xp_purchases_user_id ON public.xp_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_purchases_created_at ON public.xp_purchases(created_at DESC);
ALTER TABLE public.xp_purchases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own purchases" ON public.xp_purchases;
CREATE POLICY "Users view own purchases" ON public.xp_purchases FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role full access" ON public.xp_purchases;
CREATE POLICY "Service role full access" ON public.xp_purchases FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- Fix 1: Ensure xp_log table exists (dashboard weekly activity)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.xp_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  source TEXT NOT NULL DEFAULT 'lesson',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.xp_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own XP log" ON public.xp_log;
CREATE POLICY "Users can read own XP log" ON public.xp_log FOR SELECT USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Service role can insert XP log" ON public.xp_log;
CREATE POLICY "Service role can insert XP log" ON public.xp_log FOR INSERT WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_xp_log_user ON public.xp_log(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_log_created ON public.xp_log(created_at DESC);

-- ============================================================
-- Fix 2: Create 'media' storage bucket (demo tour video uploads)
-- ============================================================
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  false,
  52428800,
  ARRAY['image/*', 'video/*', 'application/pdf', 'application/zip']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Allow public reads on media bucket
DROP POLICY IF EXISTS "Public Read media" ON storage.objects;
CREATE POLICY "Public Read media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Allow authenticated uploads to media bucket
DROP POLICY IF EXISTS "Authenticated Upload media" ON storage.objects;
CREATE POLICY "Authenticated Upload media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media');

-- Allow authenticated updates/deletes on own files
DROP POLICY IF EXISTS "Authenticated Update media" ON storage.objects;
CREATE POLICY "Authenticated Update media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Authenticated Delete media" ON storage.objects;
CREATE POLICY "Authenticated Delete media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media' AND auth.uid() = owner);

-- Grant schema access for anon and authenticated roles
GRANT USAGE ON SCHEMA storage TO anon, authenticated;
GRANT SELECT ON storage.buckets TO anon, authenticated;
