-- Brand fixes:
-- 1. Remove irrelevant downloads from Template Mastery (3D kit, brand logo, cert pack)
-- 2. Brand the admin profile as the Learnify AI instructor (Vishwajeet + org logo)
-- 3. Point Template Mastery at the branded instructor (real DB-backed subscribe)
-- 4. Careers: drop self-referencing apply_url links so the in-app apply form opens

delete from public.course_materials
where course_id = '00000000-0000-4000-8000-000000000101'
  and id in (
    '00000000-0000-4000-8000-000000000141',
    '00000000-0000-4000-8000-000000000142',
    '00000000-0000-4000-8000-000000000143'
  );

update public.profiles
set full_name = 'Vishwajeet',
    org_name = 'Learnify AI',
    org_logo_url = '/logo.png',
    bio = 'Founder & CEO of Learnify AI. Building an intelligent learning OS — practical, hands-on courses in web development, data, AI, and productivity tools.',
    username = 'vishwajeet'
where id = 'aa073db3-bce9-47cd-a490-40a6894a9edf';

update public.courses
set instructor = 'Vishwajeet',
    created_by = 'aa073db3-bce9-47cd-a490-40a6894a9edf',
    category = 'Web Dev',
    level = 'Beginner',
    cover_url = '/course-logos/template.svg',
    enrollment_count = 1284
where id = '00000000-0000-4000-8000-000000000101';

update public.job_postings
set apply_url = null
where apply_url ilike '%learnifyai.in%';
