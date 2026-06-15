-- Create Storage bucket for community uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'community-uploads', 
  'community-uploads', 
  true, 
  52428800, 
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'application/pdf', 'video/mp4']
) ON CONFLICT (id) DO NOTHING;

-- Bucket policies
CREATE POLICY "Public Access for Community Uploads" ON storage.objects
FOR SELECT USING (bucket_id = 'community-uploads');

CREATE POLICY "Authenticated Users Can Upload to Community" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'community-uploads');

CREATE POLICY "Users Can Update Their Own Community Uploads" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'community-uploads' AND auth.uid() = owner);

CREATE POLICY "Users Can Delete Their Own Community Uploads" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'community-uploads' AND auth.uid() = owner);

-- Table: posts
CREATE TABLE IF NOT EXISTS public.posts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content text NOT NULL,
    media_url text,
    media_type text, -- 'image', 'video', 'pdf'
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT posts_pkey PRIMARY KEY (id)
);

-- Table: post_likes
CREATE TABLE IF NOT EXISTS public.post_likes (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT post_likes_pkey PRIMARY KEY (id),
    CONSTRAINT post_likes_unique UNIQUE (post_id, user_id)
);

-- Table: post_comments
CREATE TABLE IF NOT EXISTS public.post_comments (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT post_comments_pkey PRIMARY KEY (id)
);

-- Table: post_saves
CREATE TABLE IF NOT EXISTS public.post_saves (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT post_saves_pkey PRIMARY KEY (id),
    CONSTRAINT post_saves_unique UNIQUE (post_id, user_id)
);

-- RLS Policies
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their posts" ON public.posts FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their posts" ON public.posts FOR DELETE TO authenticated USING (auth.uid() = author_id);

CREATE POLICY "Post likes are viewable by everyone" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Users can like posts" ON public.post_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike posts" ON public.post_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Post comments are viewable by everyone" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.post_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their comments" ON public.post_comments FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their comments" ON public.post_comments FOR DELETE TO authenticated USING (auth.uid() = author_id);

CREATE POLICY "Users can view their own saved posts" ON public.post_saves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save posts" ON public.post_saves FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave posts" ON public.post_saves FOR DELETE TO authenticated USING (auth.uid() = user_id);
