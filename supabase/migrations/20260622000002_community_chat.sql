-- Community-wide real-time chat room
-- All authenticated users can read; only authenticated users can send

CREATE TABLE IF NOT EXISTS public.community_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_messages_created ON public.community_messages (created_at DESC);

GRANT SELECT, INSERT ON public.community_messages TO authenticated;
GRANT ALL ON public.community_messages TO service_role;

ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view community messages"
  ON public.community_messages FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can send community messages"
  ON public.community_messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_messages;
