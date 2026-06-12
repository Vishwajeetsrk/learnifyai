
CREATE TABLE public.certificate_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id uuid NOT NULL,
  action text NOT NULL DEFAULT 'issued',
  issued_by uuid,
  recipient_user_id uuid NOT NULL,
  recipient_email text,
  recipient_name text,
  template_id uuid,
  template_name text,
  course_id uuid,
  course_title text,
  score integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  code text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.certificate_audit_log TO authenticated;
GRANT ALL ON public.certificate_audit_log TO service_role;

ALTER TABLE public.certificate_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view audit log" ON public.certificate_audit_log
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins insert audit log" ON public.certificate_audit_log
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE INDEX idx_cert_audit_created ON public.certificate_audit_log (created_at DESC);
CREATE INDEX idx_cert_audit_cert ON public.certificate_audit_log (certificate_id);


CREATE TABLE public.certificate_email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id uuid NOT NULL,
  recipient_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  provider_message_id text,
  error text,
  attempt integer NOT NULL DEFAULT 1,
  sent_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.certificate_email_log TO authenticated;
GRANT ALL ON public.certificate_email_log TO service_role;

ALTER TABLE public.certificate_email_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view email log" ON public.certificate_email_log
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users view own email log" ON public.certificate_email_log
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.certificates c
                 WHERE c.id = certificate_email_log.certificate_id AND c.user_id = auth.uid()));

CREATE POLICY "Admins insert email log" ON public.certificate_email_log
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE INDEX idx_cert_email_cert ON public.certificate_email_log (certificate_id, created_at DESC);
