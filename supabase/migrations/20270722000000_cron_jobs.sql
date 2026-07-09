CREATE TABLE IF NOT EXISTS public.cron_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  schedule TEXT NOT NULL,
  handler TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  last_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cron_jobs_enabled ON public.cron_jobs (enabled);
CREATE INDEX IF NOT EXISTS idx_cron_jobs_last_run ON public.cron_jobs (last_run_at DESC);

ALTER TABLE public.cron_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role all on cron_jobs"
  ON public.cron_jobs FOR ALL
  TO service_role
  USING (true);

GRANT ALL ON public.cron_jobs TO service_role;

INSERT INTO public.cron_jobs (name, schedule, handler, enabled) VALUES
  ('Auto Maintenance', '0 3 * * *', '/api/cron/auto-maintenance', true),
  ('Check Subscriptions', '0 */6 * * *', '/api/cron/check-subscriptions', true),
  ('Retry Certificate Emails', '*/30 * * * *', '/api/cron/retry-cert-emails', true),
  ('Run Reminders', '*/15 * * * *', '/api/public/hooks/run-reminders', true)
ON CONFLICT DO NOTHING;
