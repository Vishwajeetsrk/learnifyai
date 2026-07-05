CREATE TABLE IF NOT EXISTS public.design_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    path TEXT,
    color TEXT,
    course_modules JSONB DEFAULT '[]'::jsonb,
    architecture_nodes JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.design_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to design_projects"
ON public.design_projects FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow admin full access to design_projects"
ON public.design_projects FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'role') = 'admin' OR 
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true OR
  (SELECT email FROM public.profiles WHERE id = auth.uid()) = 'vishwajeetsrk@gmail.com'
);
