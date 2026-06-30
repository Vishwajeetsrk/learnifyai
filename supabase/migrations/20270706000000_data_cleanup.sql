-- ============================================================
-- DATA CLEANUP MIGRATION
-- Run this in Supabase SQL Editor to clean up stale data
-- ============================================================

-- 1. Remove "Vishwajeet" entry from roadmap_items in site_settings
UPDATE site_settings
SET value = (
  SELECT jsonb_agg(item)
  FROM jsonb_array_elements(value::jsonb) AS item
  WHERE item->>'title' != 'Vishwajeet'
    AND item->>'desc' NOT LIKE '%Founder%'
)
WHERE key = 'roadmap_items'
  AND value::text LIKE '%Vishwajeet%';

-- 2. Deactivate old job postings (set active=false for stale jobs)
-- Uncomment and adjust the WHERE clause to target specific jobs:
-- UPDATE job_postings SET active = false WHERE title = 'UI/UX Designer';
-- Or delete them entirely:
-- DELETE FROM job_postings WHERE title = 'UI/UX Designer';

-- 3. Clear old course cover for "AI for Beginners: Mastering Prompt Engineering"
-- The cover_url is used as video player thumbnail — clear it to show lesson thumbnail instead
-- Uncomment and run:
-- UPDATE courses SET cover_url = NULL WHERE slug = 'ai-prompt-engineering';

-- 4. List current job postings (for reference before deleting)
-- SELECT id, title, team, location, active, created_at FROM job_postings ORDER BY created_at DESC;

-- 5. List courses with covers (for reference)
-- SELECT id, slug, title, cover_url FROM courses WHERE cover_url IS NOT NULL;
