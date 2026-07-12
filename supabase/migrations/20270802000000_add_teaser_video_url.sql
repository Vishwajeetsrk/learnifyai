ALTER TABLE public.design_projects
  ADD COLUMN IF NOT EXISTS teaser_video_url TEXT;

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS teaser_video_url TEXT;
