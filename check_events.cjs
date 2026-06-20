const fs = require('fs');
function readEnv(f) {
  try {
    const env = {};
    for (const l of fs.readFileSync(f, 'utf8').split('\n')) {
      const m = l.match(/^([^#=]+)=(.*)/);
      if (m) env[m[1].trim()] = m[2].trim().replace(/^"|"$/g, '');
    }
    return env;
  } catch { return {}; }
}
const { createClient } = require('@supabase/supabase-js');
const env = { ...readEnv('.env'), ...readEnv('.env.local') };
const sb = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
(async () => {
  const { data, error } = await sb.from('events').select('id,title,starts_at,image_url,location').order('starts_at');
  console.log('Events:', JSON.stringify({ data, error }, null, 2));
})();
