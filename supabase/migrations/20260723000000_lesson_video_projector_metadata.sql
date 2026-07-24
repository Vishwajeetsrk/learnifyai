ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS video_slides jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS subtitle_tracks jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS audio_tracks jsonb NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.lessons.video_slides IS
  'Timed lesson slide metadata for the interactive projector player.';

COMMENT ON COLUMN public.lessons.subtitle_tracks IS
  'Caption/subtitle track metadata. Supports embedded cue arrays or VTT/SRT URLs.';

COMMENT ON COLUMN public.lessons.audio_tracks IS
  'Alternate voice/audio track metadata for multilingual lesson playback.';
