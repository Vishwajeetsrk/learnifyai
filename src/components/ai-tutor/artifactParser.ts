import type { ArtifactBlock, ArtifactType, ParsedSegment } from "./types";

export function sanitizeArtifactText(str: string): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
}

/**
 * Parses AI response text into alternating markdown segments and interactive artifact cards.
 * Designed to be fault-tolerant: if the AI is mid-stream with incomplete JSON, it gracefully
 * falls back to rendering as safe markdown until the JSON closing fence is complete.
 */
export function parseTutorResponse(content: string): ParsedSegment[] {
  if (!content) return [];

  const segments: ParsedSegment[] = [];
  const artifactRegex =
    /```interactive:(quiz|diagram|chart|flashcards|exam|plan|actions|clarification)\s*([\s\S]*?)```/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = artifactRegex.exec(content)) !== null) {
    const start = match.index;
    const end = artifactRegex.lastIndex;

    // Push preceding markdown if present
    if (start > lastIndex) {
      const text = content.slice(lastIndex, start).trim();
      if (text) {
        segments.push({ type: "markdown", content: text });
      }
    }

    const type = match[1] as ArtifactType;
    const jsonStr = match[2].trim();

    try {
      const data = JSON.parse(jsonStr);
      segments.push({
        type: "artifact",
        content: jsonStr,
        artifact: { type, data, raw: match[0] },
      });
    } catch {
      // If parsing fails (e.g. streaming cutoff), push as safe markdown fallback
      segments.push({
        type: "markdown",
        content: match[0],
      });
    }

    lastIndex = end;
  }

  // Push remaining text
  if (lastIndex < content.length) {
    const remaining = content.slice(lastIndex).trim();
    if (remaining) {
      segments.push({ type: "markdown", content: remaining });
    }
  }

  return segments;
}

/**
 * Strips interactive blocks to produce clean plain text for text-to-speech narration.
 */
export function getNarrationText(content: string): string {
  if (!content) return "";
  return content
    .replace(/```interactive:[\s\S]*?```/g, "")
    .replace(/```[\s\S]*?```/g, "Code block omitted.")
    .replace(/[#*_`~>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
