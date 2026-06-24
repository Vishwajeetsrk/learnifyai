DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'playground_projects' AND schemaname = 'public') THEN
    ALTER TABLE public.playground_projects ADD COLUMN IF NOT EXISTS github text;
    ALTER TABLE public.playground_projects ADD COLUMN IF NOT EXISTS image_url text;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_playground_projects_github') THEN
      CREATE INDEX idx_playground_projects_github ON public.playground_projects(github);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_playground_projects_image_url') THEN
      CREATE INDEX idx_playground_projects_image_url ON public.playground_projects(image_url);
    END IF;
  END IF;
END $$;
