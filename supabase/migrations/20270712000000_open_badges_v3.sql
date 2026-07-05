-- Migration for Learnify Credential OS 3.0
-- Open Badges 3.0, Bulk Batches, and Verification Analytics

CREATE TABLE IF NOT EXISTS public.open_badges_v3 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id TEXT NOT NULL,
  issuer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  image_url TEXT NOT NULL,
  criteria_url TEXT,
  alignment_skills TEXT[] DEFAULT '{}',
  w3c_vc_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.certificate_bulk_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id TEXT NOT NULL,
  total_records INT NOT NULL,
  processed_count INT DEFAULT 0,
  failed_count INT DEFAULT 0,
  status TEXT DEFAULT 'processing',
  error_log JSONB DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.certificate_verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id TEXT NOT NULL,
  verifier_ip TEXT,
  user_agent TEXT,
  country_code TEXT,
  is_valid BOOLEAN NOT NULL DEFAULT true,
  verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.open_badges_v3 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_bulk_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_verification_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read of badges and verification logs
CREATE POLICY "Public read open_badges_v3" ON public.open_badges_v3 FOR SELECT USING (true);
CREATE POLICY "Public insert verification_logs" ON public.certificate_verification_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read verification_logs" ON public.certificate_verification_logs FOR SELECT USING (true);

-- Allow authenticated admins/creators to insert badges and bulk batches
CREATE POLICY "Authenticated insert open_badges_v3" ON public.open_badges_v3 FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated manage bulk_batches" ON public.certificate_bulk_batches FOR ALL USING (auth.uid() IS NOT NULL);
