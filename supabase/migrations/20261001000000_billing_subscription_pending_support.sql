-- Support the pending checkout lifecycle on user_subscriptions.
--
-- initiateCheckout (src/lib/payments/payment.functions.ts) and the Cashfree
-- subscription flow (src/lib/subscription.functions.ts) write rows with
-- status = 'pending' plus provider order/subscription ids. The previous
-- CHECK constraint only allowed
-- ('active','cancelled','expired','past_due','paused') and the provider
-- reference columns did not exist, so those checkout writes failed.
--
-- Additive + constraint widening only. Reversible: drop the added columns
-- and restore the previous CHECK list if ever needed.

ALTER TABLE public.user_subscriptions
  DROP CONSTRAINT IF EXISTS user_subscriptions_status_check;

ALTER TABLE public.user_subscriptions
  ADD CONSTRAINT user_subscriptions_status_check
  CHECK (status IN ('pending', 'active', 'cancelled', 'expired', 'past_due', 'paused'));

ALTER TABLE public.user_subscriptions
  ADD COLUMN IF NOT EXISTS razorpay_order_id text,
  ADD COLUMN IF NOT EXISTS razorpay_subscription_id text,
  ADD COLUMN IF NOT EXISTS cashfree_order_id text,
  ADD COLUMN IF NOT EXISTS cashfree_subscription_id text,
  ADD COLUMN IF NOT EXISTS auto_renew boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS cancellation_requested_at timestamptz;
