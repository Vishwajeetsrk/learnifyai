/**
 * Lesson Content Normalization & De-duplication
 * Safely removes accidental duplicate sections (e.g. repeated "## First Understanding"
 * or "## Suggestions and Tips" caused by legacy seed scripts) while strictly preserving
 * all educational content, quiz blocks, tables, and code snippets.
 */

const HEADING_FIRST_UNDERSTANDING = "## First Understanding";
const HEADING_SUGGESTIONS_TIPS = "## Suggestions and Tips";

/**
 * Counts occurrences of a substring in a document.
 */
function countOccurrences(text: string, sub: string): number {
  let count = 0;
  let idx = text.indexOf(sub);
  while (idx !== -1) {
    count++;
    idx = text.indexOf(sub, idx + sub.length);
  }
  return count;
}

/**
 * Finds all index positions of a substring in a document.
 */
function findPositions(text: string, sub: string): number[] {
  const positions: number[] = [];
  let idx = text.indexOf(sub);
  while (idx !== -1) {
    positions.push(idx);
    idx = text.indexOf(sub, idx + sub.length);
  }
  return positions;
}

/**
 * Deduplicates a specific heading section in markdown text.
 * - For "First Understanding", keeps the second occurrence (which carries continuation text).
 * - For "Suggestions and Tips", keeps the first occurrence and removes trailing duplicate.
 */
function dedupeSection(md: string, heading: string, keep: "first" | "last"): string {
  const positions = findPositions(md, heading);
  if (positions.length < 2) return md;

  if (keep === "last") {
    // Drop everything between the first occurrence and the second occurrence
    const start = positions[0];
    const end = positions[1];
    return md.slice(0, start) + md.slice(end);
  }

  // keep === "first": drop trailing duplicate
  const start = positions[1];
  const rest = md.slice(start);
  return md.slice(0, start) + rest.replace(/^\s*/, "");
}

/**
 * Normalizes lesson markdown text by removing repeated duplicate sections.
 */
export function deduplicateLessonSections(raw: string | null | undefined): string {
  if (!raw) return "";
  let out = raw;

  // 1. Dedupe "## First Understanding" if duplicated
  if (countOccurrences(out, HEADING_FIRST_UNDERSTANDING) >= 2) {
    out = dedupeSection(out, HEADING_FIRST_UNDERSTANDING, "last");
  }

  // 2. Dedupe "## Suggestions and Tips" if duplicated
  if (countOccurrences(out, HEADING_SUGGESTIONS_TIPS) >= 2) {
    const positions = findPositions(out, HEADING_SUGGESTIONS_TIPS);
    const afterSecond = out.slice(positions[1] + HEADING_SUGGESTIONS_TIPS.length);
    const trailing = afterSecond.trim().length === 0;
    out = dedupeSection(out, HEADING_SUGGESTIONS_TIPS, trailing ? "first" : "last");
  }

  // 3. Clean up any 3+ consecutive newlines left behind
  out = out.replace(/\n{3,}/g, "\n\n").trimEnd();
  return out;
}
