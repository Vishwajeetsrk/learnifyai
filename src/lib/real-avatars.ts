/**
 * Real Human Avatars Utility
 * Curated authentic human portraits (high-res, diverse, professional learners and educators)
 * Replacing cartoon / vector avatars across Learnify AI.
 */

// Local real human photos
export const LOCAL_HUMAN_AVATARS = [
  "/avatars/Anjali-Verma.png",
  "/avatars/Priya-Kapoor.png",
  "/avatars/Rishabh-Sharma.png",
  "/avatars/Vikram-Singh.png",
  "/avatars/Vishwajeet.jpeg",
];

// Curated high-res Unsplash real human portrait photos (diverse, professional learners & mentors)
export const UNSPLASH_HUMAN_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80", // Woman developer
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80", // Man tech engineer
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80", // Woman student / designer
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80", // Man learner
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80", // Woman coach / mentor
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80", // Man instructor / architect
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80", // Woman software engineer
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80", // Man student
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80", // Man professional
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80", // Woman student
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&h=256&q=80", // Man developer
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256&q=80", // Woman learner
];

export const ALL_REAL_HUMAN_AVATARS = [
  ...LOCAL_HUMAN_AVATARS,
  ...UNSPLASH_HUMAN_AVATARS,
];

// Named mapping for well-known testimonials or coaches
export const KNOWN_REAL_AVATARS: Record<string, string> = {
  "Rishabh Sharma": "/avatars/Rishabh-Sharma.png",
  "Anjali Verma": "/avatars/Anjali-Verma.png",
  "Priya Kapoor": "/avatars/Priya-Kapoor.png",
  "Vikram Singh": "/avatars/Vikram-Singh.png",
  "Vishwajeet": "/avatars/Vishwajeet.jpeg",
  "Vishwajeet Kumar": "/avatars/Vishwajeet.jpeg",
  "Arjun": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80",
  "Meera": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
  "Rahul": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
  "Divya": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80",
  "Alex": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
  "Sarah": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80",
  "Michael": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80",
  "Elena": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80",
};

/**
 * Deterministically pick a real human avatar based on name or identifier string.
 */
export function getRealHumanAvatar(identifier?: string | null): string {
  if (!identifier) {
    return ALL_REAL_HUMAN_AVATARS[0];
  }

  const trimmed = identifier.trim();
  if (KNOWN_REAL_AVATARS[trimmed]) {
    return KNOWN_REAL_AVATARS[trimmed];
  }

  // Consistent hash for stable avatar selection
  let hash = 0;
  for (let i = 0; i < trimmed.length; i++) {
    hash = ((hash << 5) - hash + trimmed.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % ALL_REAL_HUMAN_AVATARS.length;
  return ALL_REAL_HUMAN_AVATARS[idx];
}

/**
 * Returns a list of real human avatars for stacks / overlapping avatar previews.
 */
export function getRealAvatarStack(count: number = 4, seedPrefix: string = ""): string[] {
  const avatars: string[] = [];
  for (let i = 0; i < count; i++) {
    const key = `${seedPrefix}-${i}`;
    avatars.push(getRealHumanAvatar(key));
  }
  return avatars;
}
