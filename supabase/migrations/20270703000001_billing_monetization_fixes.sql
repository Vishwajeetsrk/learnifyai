-- Monetization fixes: payout batching, phone fix, commission tracking
-- is_batched: marks withdrawals queued for weekly batch processing

ALTER TABLE public.creator_withdrawals
  ADD COLUMN IF NOT EXISTS is_batched boolean NOT NULL DEFAULT false;

-- Update existing pending withdrawals to batched
UPDATE public.creator_withdrawals SET is_batched = true WHERE status = 'pending';
