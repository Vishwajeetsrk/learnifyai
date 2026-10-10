const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env" });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
supabase.from("badge_definitions").select("*").then(console.log).catch(console.error);
