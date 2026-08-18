-- Add 'pending' to user_subscriptions status check constraint
-- This fixes: "new row for relation 'user_subscriptions' violates check constraint 'user_subscriptions_status_check'"

ALTER TABLE user_subscriptions DROP CONSTRAINT IF EXISTS user_subscriptions_status_check;

ALTER TABLE user_subscriptions ADD CONSTRAINT user_subscriptions_status_check
  CHECK (status IN ('active', 'cancelled', 'paused', 'expired', 'trial', 'pending'));
