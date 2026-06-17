-- Idempotency for email sends + auto-retry budget
ALTER TABLE public.certificate_email_log
  ADD COLUMN IF NOT EXISTS idempotency_key text,
  ADD COLUMN IF NOT EXISTS next_retry_at timestamptz,
  ADD COLUMN IF NOT EXISTS max_attempts integer NOT NULL DEFAULT 5;

CREATE UNIQUE INDEX IF NOT EXISTS certificate_email_log_idem_key
  ON public.certificate_email_log(idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS certificate_email_log_pending_idx
  ON public.certificate_email_log(status, next_retry_at)
  WHERE status IN ('pending', 'failed');
