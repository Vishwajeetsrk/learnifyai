DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'project_likes' AND schemaname = 'public') THEN
    CREATE TABLE public.project_likes (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id uuid NOT NULL,
      user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      created_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT project_likes_unique UNIQUE (project_id, user_id)
    );
    ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Project likes are viewable by everyone"
      ON public.project_likes FOR SELECT USING (true);
    CREATE POLICY "Users can like projects"
      ON public.project_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can unlike projects"
      ON public.project_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'project_comments' AND schemaname = 'public') THEN
    CREATE TABLE public.project_comments (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id uuid NOT NULL,
      user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      content text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
    ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Project comments are viewable by everyone"
      ON public.project_comments FOR SELECT USING (true);
    CREATE POLICY "Users can create project comments"
      ON public.project_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can delete their project comments"
      ON public.project_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;

  -- Add FK to playground_projects if it exists
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'playground_projects' AND schemaname = 'public') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'project_likes_project_id_fkey') THEN
      ALTER TABLE public.project_likes ADD CONSTRAINT project_likes_project_id_fkey
        FOREIGN KEY (project_id) REFERENCES public.playground_projects(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'project_comments_project_id_fkey') THEN
      ALTER TABLE public.project_comments ADD CONSTRAINT project_comments_project_id_fkey
        FOREIGN KEY (project_id) REFERENCES public.playground_projects(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;
