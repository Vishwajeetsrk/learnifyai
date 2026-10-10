-- ═══════════════════════════════════════════════════════════════════════════
-- CERTIFICATE STUDIO 2.0 MIGRATION
-- Learnify AI — Incremental schema additions for the Studio 2.0 upgrade.
-- ALL statements are idempotent (IF NOT EXISTS / DO NOTHING patterns).
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Add new columns to certificates table (immutability + revocation + versioning)
ALTER TABLE certificates
  ADD COLUMN IF NOT EXISTS integrity_hash text,
  ADD COLUMN IF NOT EXISTS template_version_id uuid,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  ADD COLUMN IF NOT EXISTS revoked_at timestamptz,
  ADD COLUMN IF NOT EXISTS revocation_reason text,
  ADD COLUMN IF NOT EXISTS date_to timestamptz;

-- Index for fast status lookups
CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates (status);
CREATE INDEX IF NOT EXISTS idx_certificates_code ON certificates (code);

-- 2. Certificate Template Versions table
-- Each time a template is published, a new version row is created.
-- Issued certs reference template_version_id, not the template directly.
CREATE TABLE IF NOT EXISTS certificate_template_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL,         -- reference to certificate_templates or canva_templates
  version integer NOT NULL DEFAULT 1,
  name text NOT NULL,
  config_json jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz,
  published_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (template_id, version)
);

CREATE INDEX IF NOT EXISTS idx_cert_template_versions_template_id
  ON certificate_template_versions (template_id);
CREATE INDEX IF NOT EXISTS idx_cert_template_versions_status
  ON certificate_template_versions (status);

-- RLS for certificate_template_versions
ALTER TABLE certificate_template_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage template versions"
  ON certificate_template_versions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Anyone can read published template versions"
  ON certificate_template_versions
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- 3. Badge Definitions table
-- Admin-configured achievement badge types.
CREATE TABLE IF NOT EXISTS badge_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text DEFAULT '',
  category text DEFAULT 'Achievement',
  icon_name text DEFAULT 'Award',
  shape text DEFAULT 'circle'
    CHECK (shape IN ('circle', 'shield', 'medal', 'ribbon', 'seal', 'pill', 'hexagon')),
  primary_color text DEFAULT '#4f46e5',
  accent_color text DEFAULT '#a5b4fc',
  text_color text DEFAULT '#ffffff',
  criteria jsonb DEFAULT '[]',
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_badge_definitions_status ON badge_definitions (status);

ALTER TABLE badge_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage badge definitions"
  ON badge_definitions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Anyone can read active badge definitions"
  ON badge_definitions
  FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

-- 4. Badge Awards table
-- Records every badge earned by a learner for a specific certificate.
CREATE TABLE IF NOT EXISTS badge_awards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_definition_id uuid REFERENCES badge_definitions (id) ON DELETE SET NULL,
  badge_name text NOT NULL,
  badge_icon text DEFAULT 'Award',
  badge_color text DEFAULT '#4f46e5',
  certificate_code text NOT NULL,    -- references certificates.code
  user_id uuid NOT NULL,
  course_id uuid,
  earned_at timestamptz DEFAULT now(),
  w3c_vc_json jsonb,                 -- Open Badge V3 credential JSON
  UNIQUE (badge_definition_id, user_id, certificate_code)  -- idempotency
);

CREATE INDEX IF NOT EXISTS idx_badge_awards_user_id ON badge_awards (user_id);
CREATE INDEX IF NOT EXISTS idx_badge_awards_cert_code ON badge_awards (certificate_code);
CREATE INDEX IF NOT EXISTS idx_badge_awards_course_id ON badge_awards (course_id);

ALTER TABLE badge_awards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own badge awards"
  ON badge_awards
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage badge awards"
  ON badge_awards
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
  );

-- Public read for certificate verification page (no auth)
CREATE POLICY "Badge awards are readable by certificate code"
  ON badge_awards
  FOR SELECT
  TO anon
  USING (true);

-- 5. Ensure certificate_audit_log has needed columns
ALTER TABLE certificate_audit_log
  ADD COLUMN IF NOT EXISTS action_metadata jsonb;

-- 6. Seed default badge definitions (idempotent via ON CONFLICT DO NOTHING)
INSERT INTO badge_definitions (name, description, category, icon_name, shape, primary_color, accent_color, text_color, criteria, status)
VALUES
  (
    'Course Champion',
    'Awarded for completing any Learnify AI course',
    'Completion', 'Trophy', 'circle', '#4f46e5', '#a5b4fc', '#ffffff',
    '[{"type":"course_completed"}]', 'active'
  ),
  (
    'High Achiever',
    'Scored 90% or above on a course',
    'Achievement', 'Star', 'medal', '#d97706', '#fcd34d', '#ffffff',
    '[{"type":"score_gte","threshold":90}]', 'active'
  ),
  (
    'Perfect Score',
    'Achieved a perfect 100% score',
    'Achievement', 'Crown', 'seal', '#059669', '#6ee7b7', '#ffffff',
    '[{"type":"score_gte","threshold":100}]', 'active'
  ),
  (
    'Fast Learner',
    'Completed the course in record time',
    'Speed', 'Zap', 'shield', '#0891b2', '#67e8f9', '#ffffff',
    '[{"type":"fast_learner"}]', 'active'
  ),
  (
    'AI Mastery',
    'Completed an AI course with distinction',
    'Specialization', 'Brain', 'hexagon', '#7c3aed', '#c4b5fd', '#ffffff',
    '[{"type":"score_gte","threshold":85}]', 'active'
  ),
  (
    'Full Stack Master',
    'Mastered a full-stack development course',
    'Specialization', 'Code2', 'shield', '#0f172a', '#64748b', '#ffffff',
    '[{"type":"score_gte","threshold":80}]', 'active'
  )
ON CONFLICT (name) DO NOTHING;

-- 7. Helper function: verify certificate integrity hash
-- hash = encode(digest(code || ':' || recipient_name || ':' || course_id || ':' || issue_date, 'sha256'), 'hex')
-- This is computed server-side and stored at issuance. 
-- Verification page calls this to check tamper status.
CREATE OR REPLACE FUNCTION verify_certificate_integrity(
  p_code text,
  p_hash text
) RETURNS boolean
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM certificates
    WHERE code = p_code
      AND integrity_hash = p_hash
      AND (status IS NULL OR status = 'active')
  );
$$;
