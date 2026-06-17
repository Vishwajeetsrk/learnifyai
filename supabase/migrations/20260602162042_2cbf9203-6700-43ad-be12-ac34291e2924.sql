
ALTER TABLE public.certificate_templates
  ADD COLUMN IF NOT EXISTS title_font text,
  ADD COLUMN IF NOT EXISTS body_font text,
  ADD COLUMN IF NOT EXISTS title_size numeric NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS name_size numeric NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS body_size numeric NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS border_style text NOT NULL DEFAULT 'double',
  ADD COLUMN IF NOT EXISTS border_width integer NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS corner_style text NOT NULL DEFAULT 'diagonal',
  ADD COLUMN IF NOT EXISTS background_pattern text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS accent_color_2 text,
  ADD COLUMN IF NOT EXISTS layout text NOT NULL DEFAULT 'classic';
