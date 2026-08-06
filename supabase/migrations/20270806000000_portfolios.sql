-- Public portfolios published from the Portfolio Builder (Career Studio).
-- Each user can publish one live portfolio, served publicly at /p/:username.

CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  views INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON public.portfolios(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_portfolios_user_unique ON public.portfolios(user_id);

ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Owner can view/update/delete their own portfolio
CREATE POLICY "Owner manages own portfolio"
  ON public.portfolios
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Anyone can read published portfolios
CREATE POLICY "Public can read portfolios"
  ON public.portfolios
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Service role full access
CREATE POLICY "Service role full access portfolios"
  ON public.portfolios
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT SELECT ON public.portfolios TO anon, authenticated;
GRANT ALL ON public.portfolios TO service_role;
