/**
 * Seed: Insert one Event and one Job into Supabase.
 * Run with: node seed-event-job.mjs
 */
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const envContent = fs.readFileSync(".env", "utf-8");
const getEnv = (key) => {
  const m = envContent.match(new RegExp(`(?:^|\\n)${key}="?([^"\\n]+)"?`));
  return m ? m[1].trim() : null;
};

const supabaseUrl = getEnv("VITE_SUPABASE_URL");
const supabaseKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ── Event ─────────────────────────────────────────────────────────────
const { data: event, error: eErr } = await supabase
  .from("events")
  .insert({
    title: "Learnify AI Launch Meetup — Mumbai",
    description:
      "Celebrate the public launch of Learnify AI with creators, coaches, and learners in Mumbai. Live demos, creator Q&A, and networking.",
    starts_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    location: "WeWork BKC, Mumbai, India",
    rsvp_url: "https://learnify.ai/events",
    image_url: null,
  })
  .select("id, title")
  .single();

if (eErr) {
  console.error("❌ Event insert failed:", eErr.message);
} else {
  console.log("✅ Event created:", event.title, "(id:", event.id + ")");
}

// ── Job Posting ───────────────────────────────────────────────────────
const { data: job, error: jErr } = await supabase
  .from("job_postings")
  .insert({
    title: "Full-Stack Engineer (React / TanStack)",
    team: "Product & Engineering",
    location: "Remote (India Preferred)",
    apply_url: "https://learnify.ai/careers",
    active: true,
  })
  .select("id, title")
  .single();

if (jErr) {
  console.error("❌ Job insert failed:", jErr.message);
} else {
  console.log("✅ Job created:", job.title, "(id:", job.id + ")");
}

process.exit(0);
