-- XP Store Purchase History Table
-- Tracks all store purchases server-side for admin visibility

CREATE TABLE IF NOT EXISTS public.xp_purchases (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  perk_id     TEXT NOT NULL,
  perk_name   TEXT NOT NULL,
  cost        INTEGER NOT NULL CHECK (cost >= 0),
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ
);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_xp_purchases_user_id ON public.xp_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_purchases_created_at ON public.xp_purchases(created_at DESC);

-- Enable RLS but allow admin + service role access
ALTER TABLE public.xp_purchases ENABLE ROW LEVEL SECURITY;

-- Users can see their own purchases
CREATE POLICY "Users view own purchases"
  ON public.xp_purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can do everything (used by server functions)
CREATE POLICY "Service role full access"
  ON public.xp_purchases FOR ALL
  USING (true)
  WITH CHECK (true);
