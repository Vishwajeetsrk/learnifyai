DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cart_items_course_id_fkey') THEN
    ALTER TABLE public.cart_items ADD CONSTRAINT cart_items_course_id_fkey
      FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enrollments_course_id_fkey') THEN
    ALTER TABLE public.enrollments ADD CONSTRAINT enrollments_course_id_fkey
      FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'certificates_course_id_fkey') THEN
    ALTER TABLE public.certificates ADD CONSTRAINT certificates_course_id_fkey
      FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lessons_course_id_fkey') THEN
    ALTER TABLE public.lessons ADD CONSTRAINT lessons_course_id_fkey
      FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mcq_attempts_course_id_fkey') THEN
    ALTER TABLE public.mcq_attempts ADD CONSTRAINT mcq_attempts_course_id_fkey
      FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
