-- ═══════════════════════════════════════════════════════════════
-- WCMS (Website Content Management System) + Coaching Roadmaps
-- ═══════════════════════════════════════════════════════════════

-- ───────── WCMS Pages ─────────
CREATE TABLE IF NOT EXISTS public.wcms_pages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  meta_title text,
  meta_description text,
  og_image_url text,
  published boolean NOT NULL DEFAULT false,
  template text DEFAULT 'default',
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT wcms_pages_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_wcms_pages_slug ON public.wcms_pages(slug);
CREATE INDEX idx_wcms_pages_published ON public.wcms_pages(published);

-- ───────── WCMS Page Blocks ─────────
CREATE TABLE IF NOT EXISTS public.wcms_blocks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.wcms_pages(id) ON DELETE CASCADE,
  block_type text NOT NULL,
  label text,
  content jsonb NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT wcms_blocks_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_wcms_blocks_page_id ON public.wcms_blocks(page_id);
CREATE INDEX idx_wcms_blocks_sort ON public.wcms_blocks(page_id, sort_order);

-- ───────── WCMS Media Library ─────────
CREATE TABLE IF NOT EXISTS public.media_library (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_name text NOT NULL,
  mime_type text NOT NULL,
  size_bytes integer NOT NULL,
  url text NOT NULL,
  alt_text text,
  folder text DEFAULT '/',
  tags text[] DEFAULT '{}',
  uploaded_by uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT media_library_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_media_library_folder ON public.media_library(folder);
CREATE INDEX idx_media_library_tags ON public.media_library USING gin(tags);

-- ───────── WCMS Feature/Tool Catalog ─────────
CREATE TABLE IF NOT EXISTS public.wcms_features (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  icon text DEFAULT 'Sparkles',
  category text DEFAULT 'general',
  color text DEFAULT '#6366f1',
  url text,
  badge text,
  sort_order integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT wcms_features_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_wcms_features_key ON public.wcms_features(key);
CREATE INDEX idx_wcms_features_category ON public.wcms_features(category);
CREATE INDEX idx_wcms_features_enabled ON public.wcms_features(enabled);

-- ───────── WCMS Menu / Navigation ─────────
CREATE TABLE IF NOT EXISTS public.wcms_menus (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  menu_key text NOT NULL DEFAULT 'main',
  label text NOT NULL,
  url text,
  icon text,
  parent_id uuid REFERENCES public.wcms_menus(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  open_new_tab boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT wcms_menus_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_wcms_menus_key ON public.wcms_menus(menu_key);
CREATE INDEX idx_wcms_menus_parent ON public.wcms_menus(parent_id);

-- ───────── WCMS Reusable Sections ─────────
CREATE TABLE IF NOT EXISTS public.wcms_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  block_type text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT wcms_sections_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_wcms_sections_key ON public.wcms_sections(key);

-- ───────── Coaching Roadmaps (enhanced) ─────────
CREATE TABLE IF NOT EXISTS public.coaching_roadmaps (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  learner_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  skill_level text DEFAULT 'beginner',
  estimated_hours integer DEFAULT 10,
  status text NOT NULL DEFAULT 'draft',
  source text NOT NULL DEFAULT 'manual',
  ai_prompt text,
  phases jsonb NOT NULL DEFAULT '[]',
  tags text[] DEFAULT '{}',
  is_template boolean NOT NULL DEFAULT false,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT coaching_roadmaps_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_coaching_roadmaps_creator ON public.coaching_roadmaps(creator_id);
CREATE INDEX idx_coaching_roadmaps_learner ON public.coaching_roadmaps(learner_id);
CREATE INDEX idx_coaching_roadmaps_status ON public.coaching_roadmaps(status);
CREATE INDEX idx_coaching_roadmaps_template ON public.coaching_roadmaps(is_template);

-- ───────── RLS Policies ─────────

-- WCMS Pages
ALTER TABLE public.wcms_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published pages viewable by everyone" ON public.wcms_pages FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all pages" ON public.wcms_pages FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "Admins can insert pages" ON public.wcms_pages FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "Admins can update pages" ON public.wcms_pages FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "Admins can delete pages" ON public.wcms_pages FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- WCMS Blocks
ALTER TABLE public.wcms_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Blocks viewable via page" ON public.wcms_blocks FOR SELECT USING (true);
CREATE POLICY "Admins can manage blocks" ON public.wcms_blocks FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- Media Library
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Media viewable by everyone" ON public.media_library FOR SELECT USING (true);
CREATE POLICY "Admins can upload media" ON public.media_library FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "Admins can update media" ON public.media_library FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "Admins can delete media" ON public.media_library FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- WCMS Features
ALTER TABLE public.wcms_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Features viewable by everyone" ON public.wcms_features FOR SELECT USING (true);
CREATE POLICY "Admins can manage features" ON public.wcms_features FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- WCMS Menus
ALTER TABLE public.wcms_menus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Menus viewable by everyone" ON public.wcms_menus FOR SELECT USING (true);
CREATE POLICY "Admins can manage menus" ON public.wcms_menus FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- WCMS Sections
ALTER TABLE public.wcms_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sections viewable by everyone" ON public.wcms_sections FOR SELECT USING (true);
CREATE POLICY "Admins can manage sections" ON public.wcms_sections FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- Coaching Roadmaps
ALTER TABLE public.coaching_roadmaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creators can view their roadmaps" ON public.coaching_roadmaps FOR SELECT TO authenticated USING (auth.uid() = creator_id);
CREATE POLICY "Learners can view their roadmaps" ON public.coaching_roadmaps FOR SELECT TO authenticated USING (auth.uid() = learner_id);
CREATE POLICY "Published templates viewable by creators" ON public.coaching_roadmaps FOR SELECT TO authenticated USING (is_template = true AND published_at IS NOT NULL);
CREATE POLICY "Creators can insert roadmaps" ON public.coaching_roadmaps FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update their roadmaps" ON public.coaching_roadmaps FOR UPDATE TO authenticated USING (auth.uid() = creator_id);
CREATE POLICY "Creators can delete their roadmaps" ON public.coaching_roadmaps FOR DELETE TO authenticated USING (auth.uid() = creator_id);

-- ───────── Seed default pages ─────────
INSERT INTO public.wcms_pages (slug, title, description, published, sort_order) VALUES
  ('home', 'Home Page', 'Main landing page', true, 0),
  ('pricing', 'Pricing Page', 'Subscription plans and pricing', true, 1),
  ('features', 'Features Page', 'Platform features showcase', true, 2),
  ('about', 'About Us', 'Company information', true, 3),
  ('careers', 'Careers', 'Job openings', true, 4),
  ('faq', 'FAQ', 'Frequently asked questions', true, 5),
  ('roadmap', 'Public Roadmap', 'Community-voted feature roadmap', true, 6),
  ('ai-tools', 'AI Tools', 'AI-powered learning tools', true, 7),
  ('courses', 'Courses', 'Course catalog', true, 8),
  ('community', 'Community', 'Community feed and groups', true, 9)
ON CONFLICT (slug) DO NOTHING;

-- ───────── Seed default features ─────────
INSERT INTO public.wcms_features (key, name, description, icon, category, color, sort_order) VALUES
  ('ai-assistant', 'AI Assistant', 'Get instant help from AI tutor', 'Bot', 'ai', '#8b5cf6', 0),
  ('ai-thumbnail', 'AI Thumbnail Generator', 'Generate course thumbnails with AI', 'Image', 'ai', '#06b6d4', 1),
  ('code-playground', 'Code Playground', 'Write and run code in-browser', 'Code', 'development', '#10b981', 2),
  ('roadmaps', 'Learning Roadmaps', 'Structured learning paths', 'Map', 'learning', '#f59e0b', 3),
  ('coaching', 'Coaching Hub', '1-on-1 mentorship sessions', 'Users', 'social', '#ec4899', 4),
  ('certificates', 'Certificates', 'Earn certificates for completion', 'Award', 'gamification', '#f97316', 5),
  ('leaderboard', 'Leaderboard', 'Compete with other learners', 'Trophy', 'gamification', '#eab308', 6),
  ('projects', 'Project Showcase', 'Build and share projects', 'Folder', 'development', '#3b82f6', 7),
  ('interview-prep', 'Interview Prep', 'Practice mock interviews', 'MessageSquare', 'career', '#14b8a6', 8),
  ('challenges', 'Coding Challenges', 'Daily coding challenges', 'Zap', 'gamification', '#ef4444', 9),
  ('community-chat', 'Community Chat', 'Real-time chat with peers', 'MessageCircle', 'social', '#8b5cf6', 10),
  ('pwa', 'PWA Support', 'Install as native app', 'Smartphone', 'platform', '#6366f1', 11)
ON CONFLICT (key) DO NOTHING;
