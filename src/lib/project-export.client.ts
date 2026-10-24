import { toast } from "sonner";
import confetti from "canvas-confetti";

/**
 * Triggers browser download of a base64 encoded ZIP archive.
 */
export function triggerZipDownload(base64Data: string, filename: string) {
  try {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/zip" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#6366f1", "#a855f7", "#10b981", "#3b82f6"],
    });

    toast.success(`Downloaded ${filename} successfully!`);
  } catch (err: any) {
    toast.error("Failed to download project archive: " + (err?.message || "Unknown error"));
  }
}
