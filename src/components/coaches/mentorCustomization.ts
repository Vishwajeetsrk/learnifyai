export type MentorTone = "candid" | "encouraging" | "socratic" | "concise" | "deep_dive";

export interface MentorPluginsConfig {
  gmail: boolean;
  googleDocs: boolean;
  googleSheets: boolean;
  googleSlides: boolean;
  github: boolean;
  webSearch: boolean;
}

export interface MentorCustomization {
  mentorId: string;
  learnerBackground: string;
  careerGoal: string;
  preferredTone: MentorTone;
  customPrompt: string;
  plugins: MentorPluginsConfig;
  mentorLevel: number;
  mentorXp: number;
  updatedAt: string;
}

export const DEFAULT_PLUGINS: MentorPluginsConfig = {
  gmail: true,
  googleDocs: true,
  googleSheets: true,
  googleSlides: true,
  github: true,
  webSearch: true,
};

export const DEFAULT_CUSTOMIZATION = (mentorId: string): MentorCustomization => ({
  mentorId,
  learnerBackground: "Full-stack engineer preparing for Staff / Principal interviews and architecture challenges.",
  careerGoal: "Crack Tier-1 Tech Offer (Google / Uber / Microsoft / Atlassian) & scale distributed systems.",
  preferredTone: "candid",
  customPrompt: "",
  plugins: { ...DEFAULT_PLUGINS },
  mentorLevel: 2,
  mentorXp: 1850,
  updatedAt: new Date().toISOString(),
});

export function getMentorCustomization(mentorId: string): MentorCustomization {
  try {
    const raw = localStorage.getItem(`learnify_mentor_config_${mentorId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_CUSTOMIZATION(mentorId),
        ...parsed,
        plugins: { ...DEFAULT_PLUGINS, ...parsed.plugins },
      };
    }
  } catch {}
  return DEFAULT_CUSTOMIZATION(mentorId);
}

export function saveMentorCustomization(config: MentorCustomization): void {
  try {
    localStorage.setItem(
      `learnify_mentor_config_${config.mentorId}`,
      JSON.stringify({ ...config, updatedAt: new Date().toISOString() })
    );
  } catch (err) {
    console.error("Failed to persist mentor customization:", err);
  }
}

// ==========================================
// REAL PLUGIN WORKING UTILITIES & EXPORTERS
// ==========================================

export function openGmailCompose(opts: { to?: string; subject: string; body: string }): void {
  const params = new URLSearchParams();
  params.set("view", "cm");
  params.set("fs", "1");
  if (opts.to) params.set("to", opts.to);
  params.set("su", opts.subject);
  params.set("body", opts.body);
  const url = `https://mail.google.com/mail/?${params.toString()}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function openGoogleDocsWithContent(title: string, markdownContent: string): void {
  // 1. Copy formatted text to clipboard so user can simply Paste (Ctrl+V / Cmd+V)
  navigator.clipboard.writeText(`# ${title}\n\n${markdownContent}`);
  // 2. Open new Google Doc in full screen
  window.open("https://docs.google.com/document/create", "_blank", "noopener,noreferrer");
}

export function openGoogleSheetsWithData(title: string, csvData: string): void {
  // 1. Copy CSV/TSV table to clipboard so it immediately pastes into cells
  const tsv = csvData.replace(/,/g, "\t");
  navigator.clipboard.writeText(tsv);
  // 2. Open new Google Sheet in full screen
  window.open("https://sheets.new", "_blank", "noopener,noreferrer");
}

export function openGoogleSlidesWithDeck(title: string, slidesOutline: string): void {
  // 1. Copy presentation outline to clipboard
  navigator.clipboard.writeText(`PRESENTATION: ${title}\n\n${slidesOutline}`);
  // 2. Open new Google Slides presentation
  window.open("https://slides.new", "_blank", "noopener,noreferrer");
}

export function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
