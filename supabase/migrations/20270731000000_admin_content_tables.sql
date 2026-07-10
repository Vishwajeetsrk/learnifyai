-- System Design Academy topics table
CREATE TABLE IF NOT EXISTS public.system_design_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'MonitorPlay',
  difficulty TEXT NOT NULL DEFAULT 'intermediate' CHECK (difficulty IN ('beginner','intermediate','advanced')),
  duration TEXT NOT NULL DEFAULT '30 min',
  companies TEXT[] DEFAULT '{}',
  prerequisites TEXT[] DEFAULT '{}',
  sections JSONB DEFAULT '[]'::jsonb,
  quiz JSONB DEFAULT '[]'::jsonb,
  architecture JSONB DEFAULT NULL,
  comparisons JSONB DEFAULT '[]'::jsonb,
  case_studies JSONB DEFAULT '[]'::jsonb,
  knowledge_nodes JSONB DEFAULT '[]'::jsonb,
  knowledge_links JSONB DEFAULT '[]'::jsonb,
  enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.system_design_topics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read system design topics" ON public.system_design_topics;
CREATE POLICY "Public read system design topics" ON public.system_design_topics FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin manage system design topics" ON public.system_design_topics;
CREATE POLICY "Admin manage system design topics" ON public.system_design_topics FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_system_design_topics_enabled ON public.system_design_topics(enabled);
CREATE INDEX IF NOT EXISTS idx_system_design_topics_sort ON public.system_design_topics(sort_order);

-- Add image_url and stock to store_items if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_items' AND column_name = 'image_url') THEN
    ALTER TABLE public.store_items ADD COLUMN image_url TEXT DEFAULT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_items' AND column_name = 'stock') THEN
    ALTER TABLE public.store_items ADD COLUMN stock INT DEFAULT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_items' AND column_name = 'tags') THEN
    ALTER TABLE public.store_items ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- Seed initial system design topics from static content
INSERT INTO public.system_design_topics (topic_id, title, subtitle, description, icon, difficulty, duration, sort_order) VALUES
  ('netflix', 'Netflix', 'Video Streaming Architecture', 'Design Netflix - a global video streaming platform serving millions of concurrent users with 4K content, adaptive bitrate streaming, and personalized recommendations.', 'MonitorPlay', 'advanced', '45 min', 1),
  ('uber', 'Uber', 'Ride-Hailing Platform', 'Design Uber - a real-time ride-hailing platform connecting riders with drivers, handling location tracking, pricing, and payments at global scale.', 'Navigation', 'advanced', '45 min', 2),
  ('whatsapp', 'WhatsApp', 'Messaging System', 'Design WhatsApp - a messaging platform handling billions of messages daily with end-to-end encryption, media sharing, and group chats.', 'MessageSquare', 'advanced', '45 min', 3),
  ('youtube', 'YouTube', 'Video Sharing Platform', 'Design YouTube - a video sharing platform handling 500+ hours of uploads per minute with transcoding, recommendations, and live streaming.', 'Video', 'advanced', '45 min', 4),
  ('twitter', 'Twitter/X', 'Social Media Platform', 'Design Twitter (X) - a real-time social networking platform handling millions of tweets per minute with trending topics, timelines, and search.', 'Hash', 'intermediate', '40 min', 5),
  ('amazon', 'Amazon', 'E-Commerce Platform', 'Design Amazon - a global e-commerce platform handling millions of products, orders, and payments with inventory management and recommendations.', 'ShoppingCart', 'advanced', '45 min', 6),
  ('google-search', 'Google Search', 'Search Engine', 'Design Google Search - a web search engine indexing billions of pages with relevance ranking, autocomplete, and sub-second query responses.', 'Search', 'advanced', '50 min', 7),
  ('instagram', 'Instagram', 'Photo Sharing App', 'Design Instagram - a photo and video sharing social network with Stories, Reels, feeds, and real-time notifications.', 'Camera', 'intermediate', '40 min', 8),
  ('slack', 'Slack', 'Team Communication', 'Design Slack - a team communication platform with real-time messaging, channels, file sharing, and integrations at enterprise scale.', 'MessageSquare', 'intermediate', '40 min', 9),
  ('zoom', 'Zoom', 'Video Conferencing', 'Design Zoom - a video conferencing platform handling millions of concurrent meetings with HD video, screen sharing, and virtual backgrounds.', 'Video', 'intermediate', '40 min', 10)
ON CONFLICT (topic_id) DO NOTHING;
