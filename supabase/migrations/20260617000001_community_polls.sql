-- Community Hub - Polls, Announcements
-- Adds poll support and announcement type to existing posts system

-- Poll votes table
CREATE TABLE IF NOT EXISTS public.post_poll_votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  option_index integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

-- Add post_type column to posts for announcements
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS post_type text NOT NULL DEFAULT 'post';

-- Add pinned flag for announcements
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_pinned boolean NOT NULL DEFAULT false;

-- Poll votes are visible to post author and the voter
ALTER TABLE public.post_poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can vote on polls"
  ON public.post_poll_votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can see poll vote counts"
  ON public.post_poll_votes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete own vote"
  ON public.post_poll_votes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

GRANT ALL ON public.post_poll_votes TO authenticated;
