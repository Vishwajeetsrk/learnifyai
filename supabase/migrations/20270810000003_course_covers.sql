-- Point all 12 courses at the new premium branded covers (public/course-covers/<slug>.svg).

update public.courses set cover_url = '/course-covers/html-css-essentials.svg',    updated_at = now() where slug = 'html-css-essentials';
update public.courses set cover_url = '/course-covers/javascript-zero-to-pro.svg', updated_at = now() where slug = 'javascript-zero-to-pro';
update public.courses set cover_url = '/course-covers/python-for-everyone.svg',    updated_at = now() where slug = 'python-for-everyone';
update public.courses set cover_url = '/course-covers/java-fundamentals.svg',      updated_at = now() where slug = 'java-fundamentals';
update public.courses set cover_url = '/course-covers/excel-sheets-mastery.svg',   updated_at = now() where slug = 'excel-sheets-mastery';
update public.courses set cover_url = '/course-covers/word-powerpoint-pro.svg',    updated_at = now() where slug = 'word-powerpoint-pro';
update public.courses set cover_url = '/course-covers/power-bi-visuals.svg',       updated_at = now() where slug = 'power-bi-visuals';
update public.courses set cover_url = '/course-covers/figma-ui-bootcamp.svg',      updated_at = now() where slug = 'figma-ui-bootcamp';
update public.courses set cover_url = '/course-covers/vs-code-git-essentials.svg', updated_at = now() where slug = 'vs-code-git-essentials';
update public.courses set cover_url = '/course-covers/chatgpt-claude-ai.svg',      updated_at = now() where slug = 'chatgpt-claude-ai';
update public.courses set cover_url = '/course-covers/google-workspace-pro.svg',   updated_at = now() where slug = 'google-workspace-pro';
update public.courses set cover_url = '/course-covers/template-mastery.svg',       updated_at = now() where slug = 'template-mastery';
