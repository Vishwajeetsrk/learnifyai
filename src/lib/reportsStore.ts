/**
 * Learnify AI — User Explainer Reports Store
 * Handles user reports with attached canvas screenshots.
 */

export interface ExplainerReport {
  id: string;
  topicId: string;
  topicTitle: string;
  chapterTitle: string;
  videoTimestamp: string;
  reason: string;
  comment: string;
  screenshotUrl?: string;
  createdAt: string;
  status: "pending" | "resolved" | "dismissed";
}

const STORAGE_KEY = "learnify_user_reports";

export function getExplainerReports(): ExplainerReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Provide initial sample report so admin can see how it looks
      const sample: ExplainerReport = {
        id: "rep-demo-01",
        topicId: "html-basics",
        topicTitle: "HTML5 Foundations & Live DOM",
        chapterTitle: "Semantic Structure & Doctype",
        videoTimestamp: "0:25",
        reason: "Visual Feedback / Enhancement",
        comment: "The center infographic on DOM tree nodes is fantastic. Please add more details on HTML5 form validation.",
        screenshotUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        createdAt: "2026-10-26 18:30",
        status: "pending",
      };
      return [sample];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveExplainerReport(report: ExplainerReport): void {
  if (typeof window === "undefined") return;
  try {
    const current = getExplainerReports();
    const updated = [report, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("learnify_reports_changed"));
  } catch (e) {
    console.error("Failed to save report", e);
  }
}

export function updateReportStatus(id: string, status: "pending" | "resolved" | "dismissed"): void {
  if (typeof window === "undefined") return;
  try {
    const current = getExplainerReports();
    const updated = current.map((r) => (r.id === id ? { ...r, status } : r));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("learnify_reports_changed"));
  } catch (e) {
    console.error("Failed to update report status", e);
  }
}

export function deleteExplainerReport(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getExplainerReports();
    const updated = current.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("learnify_reports_changed"));
  } catch (e) {
    console.error("Failed to delete report", e);
  }
}
