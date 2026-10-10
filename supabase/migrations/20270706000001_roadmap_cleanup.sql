-- Remove "Vishwajeet" entry from roadmap_items in site_settings
-- The roadmap should only show platform features, not personal names

UPDATE site_settings
SET value = (
  SELECT jsonb_agg(item)
  FROM jsonb_array_elements(value::jsonb) AS item
  WHERE item->>'title' != 'Vishwajeet'
    AND item->>'desc' NOT LIKE '%Founder%'
)
WHERE key = 'roadmap_items'
  AND value::text LIKE '%Vishwajeet%';
