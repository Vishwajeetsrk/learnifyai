ALTER TABLE public.assignment_submissions
  ADD CONSTRAINT assignment_submissions_course_id_fkey
    FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

ALTER TABLE public.assignment_submissions
  ADD CONSTRAINT assignment_submissions_assignment_id_fkey
    FOREIGN KEY (assignment_id) REFERENCES public.course_assignments(id) ON DELETE CASCADE;

ALTER TABLE public.assignment_submissions
  ADD CONSTRAINT assignment_submissions_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;