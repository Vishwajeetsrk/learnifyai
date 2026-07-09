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
