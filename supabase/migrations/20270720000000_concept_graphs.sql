CREATE TABLE IF NOT EXISTS public.concept_graphs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  nodes JSONB NOT NULL DEFAULT '[]',
  edges JSONB NOT NULL DEFAULT '[]',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id)
);

ALTER TABLE public.concept_graphs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "concept_graphs_select" ON public.concept_graphs FOR SELECT USING (true);
CREATE POLICY "concept_graphs_insert" ON public.concept_graphs FOR INSERT WITH CHECK (true);
CREATE POLICY "concept_graphs_update" ON public.concept_graphs FOR UPDATE USING (true);

CREATE TABLE IF NOT EXISTS public.explanations_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  level TEXT NOT NULL CHECK (level IN ('beginner','intermediate','expert','analogy')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id, level)
);

ALTER TABLE public.explanations_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "explanations_cache_select" ON public.explanations_cache FOR SELECT USING (true);
CREATE POLICY "explanations_cache_insert" ON public.explanations_cache FOR INSERT WITH CHECK (true);
CREATE POLICY "explanations_cache_update" ON public.explanations_cache FOR UPDATE USING (true);

CREATE INDEX IF NOT EXISTS idx_concept_graphs_lesson ON public.concept_graphs(lesson_id);
CREATE INDEX IF NOT EXISTS idx_concept_graphs_course ON public.concept_graphs(course_id);
CREATE INDEX IF NOT EXISTS idx_explanations_cache_lesson ON public.explanations_cache(lesson_id);
