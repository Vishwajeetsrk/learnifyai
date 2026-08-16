-- certificate_payments: tracks ₹49 one-time certificate purchases by free-plan users
CREATE TABLE IF NOT EXISTS public.certificate_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  certificate_id uuid REFERENCES public.certificates(id) ON DELETE SET NULL,
  amount_inr numeric NOT NULL DEFAULT 49,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_cert_payments_user_course_paid
  ON public.certificate_payments (user_id, course_id)
  WHERE status = 'paid';

CREATE INDEX IF NOT EXISTS idx_cert_payments_user_id ON public.certificate_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_cert_payments_status ON public.certificate_payments(status);

GRANT SELECT, INSERT, UPDATE ON public.certificate_payments TO authenticated;
GRANT ALL ON public.certificate_payments TO service_role;

ALTER TABLE public.certificate_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own cert payments"
  ON public.certificate_payments FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users insert own cert payments"
  ON public.certificate_payments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins update cert payments"
  ON public.certificate_payments FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_cert_payments_updated_at
  BEFORE UPDATE ON public.certificate_payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
