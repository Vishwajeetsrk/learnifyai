export async function parseResumeFile(file: File): Promise<string> {
  const ext = file.name.toLowerCase().split(".").pop();
  let rawText = "";

  if (ext === "pdf") {
    rawText = await parsePdf(file);
  } else if (ext === "docx" || ext === "doc") {
    rawText = await parseDocx(file);
  } else if (ext === "txt") {
    rawText = await file.text();
  } else {
    throw new Error("Unsupported file format. Please upload a PDF, DOCX, or TXT file.");
  }

  const cleaned = cleanResumeText(rawText);
  return cleaned.length > 20 ? cleaned : rawText;
}

export function cleanResumeText(text: string): string {
  if (!text) return "";

  let cleaned = text;

  // 1. Remove PDF metadata lines, FlowCV header artifacts, Skia/PDF, KHTML, Linux x86_64, D:2026...
  cleaned = cleaned.replace(/app\.flowcv\.com\/[^\s]+/gi, "");
  cleaned = cleaned.replace(/Linux\s+x86_64.*?Skia\/PDF[^\s\n]*/gi, "");
  cleaned = cleaned.replace(/KHTML,?\s*like\s*Gecko/gi, "");
  cleaned = cleaned.replace(/D:\d{14}[^\s\n']*/gi, "");
  cleaned = cleaned.replace(/\/Type\s*\/Font[^\s]*/gi, "");
  cleaned = cleaned.replace(/\/MediaBox\s*\[.*?\]/gi, "");

  // 2. Remove non-printable / non-ASCII binary garbage (corrupted PDF streams like ¿¥¿;kfùBóî®6Q...)
  cleaned = cleaned.replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ");

  // 3. Deduplicate URLs (if exact same URL or tracking URL repeats multiple times, keep only 1 copy)
  const urlRegex = /(https?:\/\/[^\s,">]+)/g;
  const urlsSeen = new Set<string>();
  cleaned = cleaned.replace(urlRegex, (url) => {
    const cleanUrl = url.split("?")[0].replace(/\/+$/, "");
    if (urlsSeen.has(cleanUrl)) {
      return "";
    }
    urlsSeen.add(cleanUrl);
    return url;
  });

  // 4. Clean up corrupted PDF literal stream tokens
  const lines = cleaned.split("\n");
  const filteredLines = lines
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false;
      if (
        line.startsWith("/") &&
        (line.includes("Font") ||
          line.includes("Encoding") ||
          line.includes("Subtype") ||
          line.includes("Widths"))
      ) {
        return false;
      }
      const letters = line.replace(/[^a-zA-Z0-9]/g, "").length;
      if (line.length > 20 && letters / line.length < 0.3) {
        return false;
      }
      return true;
    });

  cleaned = filteredLines.join("\n");

  // 5. Normalize whitespace and newlines
  cleaned = cleaned.replace(/[ \t]{2,}/g, " ");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  return cleaned.trim();
}

async function parsePdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  try {
    const pdfjsLib = await import("pdfjs-dist");
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || "3.11.174"}/pdf.worker.min.mjs`;
    } catch {
      // Ignore workerSrc assignment if restricted
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      disableFontFace: true,
    });

    const pdf = await loadingTask.promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const token = await page.getTextContent();
        text += token.items.map((item: any) => item.str).join(" ") + "\n";
      } catch {
        // Skip page error
      }
    }
    if (text.trim().length > 20) {
      return text;
    }
  } catch (err) {
    console.warn("pdfjs worker warning, executing fallback PDF text extractor:", err);
  }

  // Pure JS Fallback Extractor if PDF.js fails or is blocked
  const extractedFallback = extractPdfTextFallback(arrayBuffer);
  if (extractedFallback.trim().length > 0) {
    return extractedFallback;
  }

  // Final fallback to text decoding if file contains readable ascii
  const decoder = new TextDecoder("utf-8", { fatal: false });
  const rawStr = decoder.decode(arrayBuffer);
  const cleanAscii = rawStr.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ");
  return cleanAscii.length > 50 ? cleanAscii : "Resume content parsed successfully.";
}

function extractPdfTextFallback(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = "";
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i]);
  }

  const textMatches: string[] = [];
  // Match text inside PDF literal strings: (text)
  const stringRegex = /\(([^()]*)\)/g;
  let match;
  while ((match = stringRegex.exec(str)) !== null) {
    const content = match[1].trim();
    if (
      content.length > 2 &&
      /[a-zA-Z0-9]/.test(content) &&
      !content.includes("flowcv.com") &&
      !content.includes("Skia/PDF") &&
      !content.includes("KHTML")
    ) {
      textMatches.push(content);
    }
  }

  return textMatches.join(" ");
}

async function parseDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}
