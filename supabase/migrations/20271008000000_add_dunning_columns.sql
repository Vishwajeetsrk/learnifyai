-- Migration: Add dunning idempotency columns to user_subscriptions
-- These columns prevent duplicate renewal reminder emails from the daily cron.
-- Also adds grace_notified_at for renewal_failed state notifications.

ALTER TABLE public.user_subscriptions
  ADD COLUMN IF NOT EXISTS renewal_3day_notified_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS renewal_1day_notified_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS grace_notified_at TIMESTAMPTZ DEFAULT NULL;

-- Index for efficient cron queries (filter by null notification + period_end range)
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_renewal_3day
  ON public.user_subscriptions (current_period_end, status)
  WHERE renewal_3day_notified_at IS NULL AND will_renew = TRUE;

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_renewal_1day
  ON public.user_subscriptions (current_period_end, status)
  WHERE renewal_1day_notified_at IS NULL AND will_renew = TRUE;

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_grace_notified
  ON public.user_subscriptions (status)
  WHERE grace_notified_at IS NULL;

-- Comment for documentation
COMMENT ON COLUMN public.user_subscriptions.renewal_3day_notified_at
  IS 'Timestamp when 3-day renewal reminder was sent. NULL = not yet sent.';

COMMENT ON COLUMN public.user_subscriptions.renewal_1day_notified_at
  IS 'Timestamp when 1-day renewal reminder was sent. NULL = not yet sent.';

COMMENT ON COLUMN public.user_subscriptions.grace_notified_at
  IS 'Timestamp when renewal_failed grace period notification was sent. NULL = not yet sent.';
