-- Add Razorpay native subscription columns
-- pricing_plans: store synced Razorpay plan ID
ALTER TABLE pricing_plans
  ADD COLUMN IF NOT EXISTS razorpay_plan_id TEXT;

-- user_subscriptions: store Razorpay subscription ID for lifecycle tracking
ALTER TABLE user_subscriptions
  ADD COLUMN IF NOT EXISTS razorpay_subscription_id TEXT;

-- Index for webhook lookups by razorpay_subscription_id
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_razorpay_sub_id
  ON user_subscriptions (razorpay_subscription_id);
