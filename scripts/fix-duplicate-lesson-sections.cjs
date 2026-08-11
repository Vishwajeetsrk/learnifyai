/**
 * fix-duplicate-lesson-sections.cjs
 *
 * The curriculum expansions (migrations …04/…05/…06 + template-mastery seed) wrote
 * every lesson with the "## First Understanding" and "## Suggestions and Tips"
 * sections duplicated — the first copy was pasted twice back-to-back.
 *
 * This script detects the duplicates and keeps a single copy of each section:
 *  - "## First Understanding": keeps the SECOND occurrence (it carries the
 *    continuation text) and deletes the first.
 *  - "## Suggestions and Tips": keeps the FIRST occurrence and deletes a
 *    trailing duplicate at the end of the document.
 *
 * Run: node scripts/fix-duplicate-lesson-sections.cjs
 */
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const env = {};
  const raw = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

const { createClient } = require("../node_modules/@supabase/supabase-js");
const supabase = createClient(loadEnv().SUPABASE_URL, loadEnv().SUPABASE_SERVICE_ROLE_KEY);

const HEADING_FU = "## First Understanding";
const HEADING_ST = "## Suggestions and Tips";

function occurrences(md, heading) {
  let count = 0;
  let idx = md.indexOf(heading);
  while (idx !== -1) {
    count++;
    idx = md.indexOf(heading, idx + heading.length);
  }
  return count;
}

function findPositions(md, heading) {
  const positions = [];
  let idx = md.indexOf(heading);
  while (idx !== -1) {
    positions.push(idx);
    idx = md.indexOf(heading, idx + heading.length);
  }
  return positions;
}

function dedupeSection(md, heading, keep) {
  const positions = findPositions(md, heading);
  if (positions.length < 2) return md;

  if (keep === "last") {
    // Drop everything between the first occurrence and the second occurrence.
    const start = positions[0];
    const end = positions[1];
    return md.slice(0, start) + md.slice(end);
  }

  // keep === "first": drop the trailing duplicate (and anything after it that is whitespace)
  const start = positions[1];
  const rest = md.slice(start);
  return md.slice(0, start) + rest.replace(/^\s*/, "");
}

function fix(md) {
  let out = md;

  if (occurrences(out, HEADING_FU) === 2) {
    out = dedupeSection(out, HEADING_FU, "last");
  }

  if (occurrences(out, HEADING_ST) === 2) {
    const positions = findPositions(out, HEADING_ST);
    const afterSecond = out.slice(positions[1] + HEADING_ST.length);
    const trailing = afterSecond.trim().length === 0;
    out = dedupeSection(out, HEADING_ST, trailing ? "first" : "last");
  }

  // Clean up any doubled blank lines left behind
  out = out.replace(/\n{3,}/g, "\n\n").replace(/^\s+/, "").trimEnd() + "\n";
  return out;
}

(async () => {
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("id, title, content_md");
  if (error) throw new Error(error.message);

  let fixed = 0;
  let suspicious = 0;

  for (const lesson of lessons ?? []) {
    const md = lesson.content_md || "";
    if (!md.includes(HEADING_FU) && !md.includes(HEADING_ST)) continue;

    const fuBefore = occurrences(md, HEADING_FU);
    const stBefore = occurrences(md, HEADING_ST);

    if (fuBefore !== 2 && stBefore !== 2) {
      suspicious++;
      console.log(`SKIP (unexpected counts FU=${fuBefore} ST=${stBefore}): ${lesson.title} (${lesson.id})`);
      continue;
    }

    const fixedMd = fix(md);
    const fuAfter = occurrences(fixedMd, HEADING_FU);
    const stAfter = occurrences(fixedMd, HEADING_ST);

    if (fuAfter !== 1 || stAfter !== 1) {
      suspicious++;
      console.log(`STILL BROKEN (FU=${fuAfter} ST=${stAfter}): ${lesson.title} (${lesson.id})`);
      continue;
    }

    const { error: updErr } = await supabase
      .from("lessons")
      .update({ content_md: fixedMd })
      .eq("id", lesson.id);
    if (updErr) {
      console.error(`UPDATE FAILED: ${lesson.title} — ${updErr.message}`);
      process.exit(1);
    }
    fixed++;
    console.log(`FIXED: ${lesson.title} (${lesson.id}) — ${md.length} → ${fixedMd.length} chars`);
  }

  console.log(`\nDone. Fixed: ${fixed}, skipped/suspicious: ${suspicious}`);
})().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
