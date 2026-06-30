UPDATE site_settings SET value = (
  SELECT jsonb_agg(item) FROM jsonb_array_elements(value::jsonb) AS item
  WHERE item->>'title' != 'Vishwajeet'
) WHERE key = 'roadmap_items' AND value::text LIKE '%Vishwajeet%';
UPDATE courses SET cover_url = NULL WHERE slug = 'ai-prompt-engineering';
UPDATE job_postings SET active = false WHERE title = 'UI/UX Designer';
