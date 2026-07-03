-- ============================================================
-- Certificate Designer Studio — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create canva_templates table
CREATE TABLE IF NOT EXISTS public.canva_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Professional',
  bg_image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  fields_json JSONB DEFAULT '{}',
  theme_colors JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- 2. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_canva_templates_category ON public.canva_templates(category);
CREATE INDEX IF NOT EXISTS idx_canva_templates_created_by ON public.canva_templates(created_by);

-- 3. Enable RLS
ALTER TABLE public.canva_templates ENABLE ROW LEVEL SECURITY;

-- 4. Admin policy — full access
CREATE POLICY "Admins can manage canva_templates"
  ON public.canva_templates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'super_admin')
    )
  );

-- 5. Creator policy — read access for creators
CREATE POLICY "Creators can read canva_templates"
  ON public.canva_templates
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('creator', 'admin', 'super_admin')
    )
  );

-- 6. Create storage bucket for canva templates
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'canva-templates',
  'canva-templates',
  true,
  10485760,  -- 10MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- 7. Storage policy — admin upload
CREATE POLICY "Admins can upload canva templates"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'canva-templates'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'super_admin')
    )
  );

-- 8. Storage policy — public read
CREATE POLICY "Public can view canva templates"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'canva-templates');

-- 9. Storage policy — admin delete
CREATE POLICY "Admins can delete canva templates"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'canva-templates'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'super_admin')
    )
  );

-- 10. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_canva_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS canva_templates_updated_at ON public.canva_templates;
CREATE TRIGGER canva_templates_updated_at
  BEFORE UPDATE ON public.canva_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_canva_templates_updated_at();
