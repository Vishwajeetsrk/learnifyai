DO $$
BEGIN
  -- Create playground_projects if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'playground_projects' AND schemaname = 'public') THEN
    CREATE TABLE public.playground_projects (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references auth.users(id) on delete cascade,
      title text not null default 'Untitled Project',
      description text,
      language text not null default 'javascript',
      template text default 'blank',
      is_public boolean not null default false,
      tags text[] default '{}',
      screenshot_url text,
      github text,
      image_url text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    ALTER TABLE public.playground_projects ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can CRUD own projects"
      ON public.playground_projects
      USING (user_id = auth.uid());

    CREATE POLICY "Anyone can read public projects"
      ON public.playground_projects FOR SELECT
      USING (is_public = true);

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_playground_projects_user') THEN
      CREATE INDEX idx_playground_projects_user ON public.playground_projects(user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_playground_projects_public') THEN
      CREATE INDEX idx_playground_projects_public ON public.playground_projects(is_public);
    END IF;
  END IF;

  -- Add FK constraints for project_likes and project_comments if they exist and don't have FKs
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'project_likes' AND schemaname = 'public') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'project_likes_project_id_fkey') THEN
      ALTER TABLE public.project_likes ADD CONSTRAINT project_likes_project_id_fkey
        FOREIGN KEY (project_id) REFERENCES public.playground_projects(id) ON DELETE CASCADE;
    END IF;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'project_comments' AND schemaname = 'public') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'project_comments_project_id_fkey') THEN
      ALTER TABLE public.project_comments ADD CONSTRAINT project_comments_project_id_fkey
        FOREIGN KEY (project_id) REFERENCES public.playground_projects(id) ON DELETE CASCADE;
    END IF;
  END IF;

  -- Create playground_files if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'playground_files' AND schemaname = 'public') THEN
    CREATE TABLE public.playground_files (
      id uuid primary key default gen_random_uuid(),
      project_id uuid not null references public.playground_projects(id) on delete cascade,
      name text not null default 'main.txt',
      path text not null default '/',
      content text not null default '',
      language text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
    ALTER TABLE public.playground_files ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can CRUD own project files"
      ON public.playground_files
      USING (project_id IN (SELECT id FROM public.playground_projects WHERE user_id = auth.uid()));
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_playground_files_project') THEN
      CREATE INDEX idx_playground_files_project ON public.playground_files(project_id);
    END IF;
  END IF;

  -- Create playground_runs if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'playground_runs' AND schemaname = 'public') THEN
    CREATE TABLE public.playground_runs (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references auth.users(id) on delete cascade,
      project_id uuid references public.playground_projects(id) on delete set null,
      language text not null,
      code text not null,
      stdin text default '',
      stdout text default '',
      stderr text default '',
      exit_code int default -1,
      execution_time_ms int,
      memory_kb int,
      status text not null default 'success',
      created_at timestamptz not null default now()
    );
    ALTER TABLE public.playground_runs ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can insert own runs" ON public.playground_runs FOR INSERT WITH CHECK (user_id = auth.uid());
    CREATE POLICY "Users can read own runs" ON public.playground_runs FOR SELECT USING (user_id = auth.uid());
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_playground_runs_user') THEN
      CREATE INDEX idx_playground_runs_user ON public.playground_runs(user_id);
    END IF;
  END IF;
END $$;
