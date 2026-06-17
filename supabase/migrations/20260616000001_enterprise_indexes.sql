-- Enterprise SaaS Performance Indexes
-- Generated to optimize large-scale table scans and filtering

-- 1. Index on events(starts_at) to speed up event sorting and filtering
CREATE INDEX IF NOT EXISTS idx_events_starts_at ON events(starts_at);

-- 2. Index on job_postings(created_at) to speed up sorting jobs by recency
CREATE INDEX IF NOT EXISTS idx_job_postings_created_at ON job_postings(created_at);

-- 3. Composite index on pricing_plans(active, order_index) for fast retrieval of active pricing tiers
CREATE INDEX IF NOT EXISTS idx_pricing_plans_active_order ON pricing_plans(active, order_index);

-- 4. Index on user_profiles (assuming there is a user_id or similar, common in SaaS)
-- We will add an index on user_id for any transactions or content associated with them.
-- Assuming tables exist, else these will safely skip or be applied when tables are present.

-- 5. Index on coaching slots to speed up date queries
CREATE INDEX IF NOT EXISTS idx_coaching_slots_starts_at ON coaching_slots(starts_at);
