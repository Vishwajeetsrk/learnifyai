const BLACKLIST_PATTERNS = [
  /system prompt/i,
  /ignore previous/i,
  /reveal instruction/i,
  /sql injection/i,
  /SELECT \* FROM/i,
  /bypass safety/i,
  /dan mode/i,
  /jailbreak/i,
];

export function validateAIPrompt(prompt: string): { safe: boolean; reason?: string } {
  if (!prompt) return { safe: true };
  for (const pattern of BLACKLIST_PATTERNS) {
    if (pattern.test(prompt)) {
      return { safe: false, reason: `Safety alert: Restricted prompt pattern detected.` };
    }
  }
  return { safe: true };
}
