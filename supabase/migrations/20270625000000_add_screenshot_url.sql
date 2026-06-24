DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'playground_projects' AND schemaname = 'public') THEN
    ALTER TABLE playground_projects ADD COLUMN IF NOT EXISTS screenshot_url text;
  END IF;
END $$;
