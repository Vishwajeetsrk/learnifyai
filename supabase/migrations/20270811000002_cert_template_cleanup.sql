-- Certificate template cleanup: dedupe legacy certificate_templates rows,
-- brand them with the real Learnify logo, and ensure a single default.
-- (No certificates reference these rows yet — certificates table is empty.)

-- 1. Dedupe: keep the earliest-created row per name.
delete from public.certificate_templates a
using public.certificate_templates b
where a.name = b.name
  and a.id <> b.id
  and (a.created_at > b.created_at
       or (a.created_at = b.created_at and a.id > b.id));

-- 2. Brand defaults for the legacy v1 render path.
update public.certificate_templates
set logo_url = coalesce(logo_url, '/logo.png'),
    font_family = 'Playfair Display',
    signatory_name = coalesce(nullif(signatory_name, ''), 'Learnify AI'),
    signatory_title = coalesce(nullif(signatory_title, ''), 'Director of Learning'),
    updated_at = now();

-- 3. Single default: the official Learnify design. If missing, seed it.
insert into public.certificate_templates (name, is_default, logo_url, accent_color, bg_color, text_color, font_family, signatory_name, signatory_title)
select 'Learnify Official (Navy + Gold)', true, '/logo.png', '#c9a84c', '#0a0f33', '#f7f0e0', 'Playfair Display', 'Learnify AI', 'Director of Learning'
where not exists (select 1 from public.certificate_templates where name = 'Learnify Official (Navy + Gold)');

update public.certificate_templates
set is_default = (name = 'Learnify Official (Navy + Gold)'),
    updated_at = now();

-- ─── canva_templates: purge legacy heavy Canva-export SVGs, keep the curated
-- Learnify-branded designs. Courses referencing removed templates are
-- re-pointed to the curated set first.

update public.courses
set certificate_template_id = t.id
from public.canva_templates t
where t.bg_image_url = '/templates/learnify/emerald-prestige.svg'
  and courses.title = 'Python for Everyone';

update public.courses
set certificate_template_id = t.id
from public.canva_templates t
where t.bg_image_url = '/templates/learnify/modern-minimal.svg'
  and courses.title = 'Figma UI Bootcamp';

update public.courses
set certificate_template_id = t.id
from public.canva_templates t
where t.bg_image_url = '/templates/learnify/aurora-gradient.svg'
  and courses.title = 'ChatGPT & Claude AI Productivity';

delete from public.canva_templates
where bg_image_url not like '/templates/learnify/%';
