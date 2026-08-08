-- ============================================================
-- Learnify AI v4.9 — Lesson Content Blocks System
-- Enables no-code Notion-style block editing for courses
-- ============================================================

-- 1. lesson_content_blocks — flexible JSONB content blocks per lesson
CREATE TABLE IF NOT EXISTS lesson_content_blocks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id    UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  type         TEXT NOT NULL DEFAULT 'text',
  content      JSONB NOT NULL DEFAULT '{}',
  order_index  INT  NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast ordered fetching
CREATE INDEX IF NOT EXISTS idx_lesson_content_blocks_lesson
  ON lesson_content_blocks(lesson_id, order_index);

-- Constraint on allowed block types
ALTER TABLE lesson_content_blocks
  DROP CONSTRAINT IF EXISTS chk_block_type;
ALTER TABLE lesson_content_blocks
  ADD CONSTRAINT chk_block_type CHECK (
    type IN ('text','video','image','quiz','code','callout','divider','embed','diagram','file')
  );

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_lesson_content_blocks_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
DROP TRIGGER IF EXISTS trg_lcb_updated_at ON lesson_content_blocks;
CREATE TRIGGER trg_lcb_updated_at
  BEFORE UPDATE ON lesson_content_blocks
  FOR EACH ROW EXECUTE FUNCTION update_lesson_content_blocks_updated_at();

-- RLS
ALTER TABLE lesson_content_blocks ENABLE ROW LEVEL SECURITY;

-- Students can read blocks for lessons in courses they are enrolled in
CREATE POLICY "lcb_enrolled_read" ON lesson_content_blocks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN lessons l ON l.course_id = e.course_id
      WHERE l.id = lesson_content_blocks.lesson_id
        AND e.user_id = auth.uid()
    )
    OR
    -- Free preview lessons are public-readable
    EXISTS (
      SELECT 1 FROM lessons l
      WHERE l.id = lesson_content_blocks.lesson_id
        AND (l.is_preview = true OR COALESCE((l.is_free_preview)::boolean, false) = true)
    )
  );

-- Admins can read/write all
CREATE POLICY "lcb_admin_all" ON lesson_content_blocks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin','super_admin')
    )
  );

-- Creators can write blocks for their own course lessons
CREATE POLICY "lcb_creator_write" ON lesson_content_blocks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM lessons l
      JOIN courses c ON c.id = l.course_id
      WHERE l.id = lesson_content_blocks.lesson_id
        AND c.created_by = auth.uid()
    )
  );

-- ============================================================
-- 2. user_quiz_attempts — track inline block quiz results
-- ============================================================
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  block_id     UUID NOT NULL REFERENCES lesson_content_blocks(id) ON DELETE CASCADE,
  lesson_id    UUID REFERENCES lessons(id) ON DELETE CASCADE,
  course_id    UUID REFERENCES courses(id) ON DELETE CASCADE,
  score        INT NOT NULL DEFAULT 0,
  max_score    INT NOT NULL DEFAULT 0,
  passed       BOOLEAN NOT NULL DEFAULT false,
  answers      JSONB NOT NULL DEFAULT '[]',
  time_taken_s INT,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user
  ON user_quiz_attempts(user_id, block_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_course
  ON user_quiz_attempts(user_id, course_id);

ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "qa_user_own" ON user_quiz_attempts
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "qa_admin_read" ON user_quiz_attempts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','super_admin'))
  );

-- ============================================================
-- 3. Additions to lessons table
-- ============================================================
ALTER TABLE lessons
  ADD COLUMN IF NOT EXISTS content_format TEXT NOT NULL DEFAULT 'markdown';

ALTER TABLE lessons
  ADD COLUMN IF NOT EXISTS is_free_preview BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE lessons
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

ALTER TABLE lessons
  ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]';

-- content_format constraint
ALTER TABLE lessons
  DROP CONSTRAINT IF EXISTS chk_lessons_content_format;
ALTER TABLE lessons
  ADD CONSTRAINT chk_lessons_content_format
  CHECK (content_format IN ('markdown','blocks','html'));

-- ============================================================
-- 4. Additions to courses table
-- ============================================================
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS teaser_video_url TEXT;

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS requirements TEXT[] DEFAULT '{}';

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS outcomes TEXT[] DEFAULT '{}';

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS target_audience TEXT;

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}';

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS drip_schedule JSONB;

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'en';

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS certificate_enabled BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS completion_threshold INT NOT NULL DEFAULT 80;

-- ============================================================
-- 5. Seed: ensure existing lessons have correct content_format
-- ============================================================
UPDATE lessons
  SET content_format = 'markdown'
  WHERE content_format IS NULL OR content_format = '';

-- ============================================================
-- Done
-- ============================================================
