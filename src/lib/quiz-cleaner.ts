/**
 * Learnify AI — Quiz Question Sanitization Utility
 *
 * Ensures all quiz questions are clean, grammatically sound,
 * free of repeated punctuation (e.g. "What!!!!!!!!"), and properly terminated.
 */
export function cleanQuizQuestion(text: string): string {
  if (!text) return "";
  let clean = text
    .replace(/!{2,}/g, " ")      // Replace repeated exclamation marks with space
    .replace(/\?{2,}/g, "?")     // Replace repeated question marks with single ?
    .replace(/\s+/g, " ")        // Normalize multi-spaces
    .trim();

  // If question starts with an interrogative word and lacks '?', add '?'
  if (
    /^(what|why|how|where|when|which|who|whom|whose|can|does|is|are|should|will|did|do|could|would)\b/i.test(
      clean,
    ) &&
    !clean.endsWith("?")
  ) {
    clean = clean.replace(/[!.]+$/, "") + "?";
  }
  return clean;
}
