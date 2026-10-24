/**
 * Resume File Parser & Sanitizer
 * Supports PDF, DOCX, DOC, and TXT files with dual client/server extraction,
 * adversarial binary/JPEG noise rejection, and clean ATS layout formatting.
 */

export function isBinaryGarbage(text: string): boolean {
  if (!text || typeof text !== "string") return false;

  // 1. Repeating JPEG DCT / quantization markers or restart sequences (e.g. QE QE QE QE, Q@ Q@ Q@, P E P E P E)
  if (/(?:QE\s*){3,}|(?:Q@\s*){3,}|(?:P\s*E\s*){3,}/i.test(text)) return true;

  // 2. Raw PDF indirect object, stream, or cross-reference markers
  if (/\b\d+\s+0\s+obj\b|\bendobj\b|\bendstream\b|\bstartxref\b|%%EOF/i.test(text)) return true;

  // 3. Density of unprintable or binary symbols
  const cleanAscii = text.replace(/[^\x20-\x7E\n\r\t]/g, "");
  if (text.length > 50 && cleanAscii.length / text.length < 0.65) return true;

  // 4. Low proportion of dictionary/word characters in long text
  const words = text.match(/[a-zA-Z]{3,}/g) || [];
  const wordsTotalLen = words.reduce((sum, w) => sum + w.length, 0);
  if (text.length > 100 && wordsTotalLen / text.length < 0.35) return true;

  return false;
}

export function cleanResumeText(text: string): string {
  if (!text) return "";
  if (isBinaryGarbage(text)) return "";

  let cleaned = text;

  // 1. Remove PDF metadata lines, FlowCV header artifacts, Skia/PDF, KHTML, Linux x86_64, D:2026...
  cleaned = cleaned.replace(/app\.flowcv\.com\/[^\s]+/gi, "");
  cleaned = cleaned.replace(/Linux\s+x86_64[^\n]*/gi, "");
  cleaned = cleaned.replace(/X11;\s*Linux[^\n]*/gi, "");
  cleaned = cleaned.replace(/KHTML,?\s*like\s*Gecko/gi, "");
  cleaned = cleaned.replace(/D:\d{14}[^\s\n']*/gi, "");
  cleaned = cleaned.replace(/\/Type\s*\/Font[^\s]*/gi, "");
  cleaned = cleaned.replace(/\/MediaBox\s*\[.*?\]/gi, "");

  // 2. Extract clean URLs, mailto, tel links before stripping garbage
  cleaned = cleaned.replace(/mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi, "$1");
  cleaned = cleaned.replace(/tel:([+\d\s-]{8,})/gi, "$1");

  // 3. Strip tracking parameters from URLs for clean presentation
  cleaned = cleaned.replace(/(https?:\/\/[^\s,">]+)/gi, (url) => {
    try {
      const u = new URL(url);
      u.search = ""; // strip tracking query params
      return u.toString().replace(/\/$/, "");
    } catch {
      return url.split("?")[0].replace(/\/$/, "");
    }
  });

  // 4. Preserve unicode bullets, dashes and accents while filtering unprintable binary garbage
  cleaned = cleaned.replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\u024F\u2010-\u205E\u2022\u25E6\u2023\u2043]/g, " ");

  // Normalize bullet points to a clean standard bullet format for clear parsing
  cleaned = cleaned.replace(/[\u2022\u25E6\u2023\u2043]/g, "\n• ");

  // 5. Clean up corrupted PDF literal stream tokens and noise lines
  const lines = cleaned.split("\n");
  const filteredLines = lines
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false;
      // Filter out PDF stream dictionary definitions
      if (
        line.startsWith("/") ||
        line.startsWith("<<") ||
        line.startsWith(">>") ||
        line.includes("endobj") ||
        line.includes("stream") ||
        line.includes("endstream")
      ) {
        return false;
      }
      if (
        line.includes("X11;") ||
        line.includes("feedView=") ||
        line.includes("utm_source=")
      ) {
        if (line.length > 100 && (line.includes("X11") || line.includes("'00'"))) {
          return false;
        }
      }
      // Filter out random isolated character noise lines (e.g. ";k f B 6Q I ]Y R\&k> ot @")
      const lettersAndDigits = line.replace(/[^a-zA-Z0-9]/g, "").length;
      if (line.length > 10 && lettersAndDigits / line.length < 0.35) {
        return false;
      }
      // Filter out lines composed mostly of repeated single characters / noise symbols
      if (/^[^a-zA-Z0-9]+$/.test(line) && !line.includes("•")) {
        return false;
      }
      // Filter out random single-character noise tokens
      if (
        line.length < 4 &&
        !/^(I|a|an|the|to|in|of|or|on|at|by|re|de|v2|v3|•|C\+\+|C#|Go|R|JS|UI|UX|AI|ML|DL)$/i.test(line)
      ) {
        return false;
      }
      return true;
    });

  cleaned = filteredLines.join("\n");

  // 6. Normalize whitespace and newlines
  cleaned = cleaned.replace(/[ \t]{2,}/g, " ");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  const finalResult = cleaned.trim();
  if (isBinaryGarbage(finalResult)) return "";
  return finalResult;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      const base64 = res.includes(",") ? res.split(",")[1] : res;
      resolve(base64);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

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

  if (isBinaryGarbage(rawText)) {
    throw new Error(
      "The uploaded document contains unreadable binary data. Please upload a PDF with selectable text, DOCX, or TXT file."
    );
  }

  const cleaned = cleanResumeText(rawText);
  if (cleaned.length < 20 || isBinaryGarbage(cleaned)) {
    throw new Error(
      "Could not extract sufficient text from this file. If this is a scanned image, please paste your resume text directly."
    );
  }

  return cleaned;
}

async function parsePdf(file: File): Promise<string> {
  // Strategy 1: Client-side pdfjs-dist with standard worker
  try {
    const pdfjsLib = await import("pdfjs-dist");
    try {
      if (typeof window !== "undefined") {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version || "6.1.200"}/build/pdf.worker.min.mjs`;
      }
    } catch {}

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      disableFontFace: true,
    });

    const pdf = await loadingTask.promise;
    let text = "";
    const numPages = Math.min(pdf.numPages, 15);

    for (let i = 1; i <= numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const token = await page.getTextContent();
        const pageLines: string[] = [];
        let currentLine = "";
        let lastY: number | null = null;

        for (const item of token.items as any[]) {
          if (!item.str) continue;
          const currentY = item.transform ? Math.round(item.transform[5]) : null;
          if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 3) {
            if (currentLine.trim()) pageLines.push(currentLine.trim());
            currentLine = item.str;
          } else {
            currentLine += (currentLine ? " " : "") + item.str;
          }
          lastY = currentY;
        }
        if (currentLine.trim()) pageLines.push(currentLine.trim());

        text += pageLines.join("\n") + "\n\n";
      } catch (err) {
        console.warn(`Error reading page ${i} via client pdfjs:`, err);
      }
    }

    const cleaned = cleanResumeText(text);
    if (cleaned.length > 30 && !isBinaryGarbage(cleaned)) {
      return cleaned;
    }
  } catch (err) {
    console.warn("Client pdfjs parser failed or worker blocked, using robust server extraction:", err);
  }

  // Strategy 2: Server-side TanStack Start function (pdfjs-dist legacy without browser worker restrictions)
  try {
    const base64Data = await fileToBase64(file);
    const { parseResumePdf } = await import("@/lib/resume.functions");
    const res = await parseResumePdf({
      data: {
        base64Data,
        fileName: file.name,
      },
    });

    if (res && res.success && res.text) {
      const cleaned = cleanResumeText(res.text);
      if (cleaned.length > 20 && !isBinaryGarbage(cleaned)) {
        return cleaned;
      }
    }
  } catch (serverErr) {
    console.warn("Server PDF extraction failed:", serverErr);
  }

  // Strategy 3: Fallback uncompressed PDF literal stream matching
  try {
    const arrayBuffer = await file.arrayBuffer();
    const extractedFallback = extractPdfTextFallback(arrayBuffer);
    const cleaned = cleanResumeText(extractedFallback);
    if (cleaned.length > 30 && !isBinaryGarbage(cleaned)) {
      return cleaned;
    }
  } catch {}

  // Strategy 4: If all fail, DO NOT dump raw ArrayBuffer TextDecoder bytes!
  throw new Error(
    "Could not extract readable text from this PDF. If this document is a scanned image or photo, please paste your resume text directly or upload a DOCX/TXT file."
  );
}

function extractPdfTextFallback(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = "";
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i]);
  }

  const textMatches: string[] = [];

  // Match text in PDF TJ arrays: [ (text1) -10 (text2) ] TJ
  const tjRegex = /\[(.*?)\]\s*TJ/gi;
  let tjMatch;
  while ((tjMatch = tjRegex.exec(str)) !== null) {
    const inner = tjMatch[1];
    const chunks = inner.match(/\(([^()]*)\)/g) || [];
    const joined = chunks
      .map((c) => c.slice(1, -1).replace(/\\([0-9]{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8))))
      .join(" ")
      .trim();
    if (joined.length > 2 && /[a-zA-Z0-9]/.test(joined) && !isBinaryGarbage(joined)) {
      textMatches.push(joined);
    }
  }

  // Match simple PDF string literals: (Text here) Tj or standalone (Text)
  const stringRegex = /\(([^()]{2,})\)/g;
  let match;
  while ((match = stringRegex.exec(str)) !== null) {
    let content = match[1].trim();
    // decode octal escapes \040 -> ' '
    content = content.replace(/\\([0-9]{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
    content = content.replace(/\\([\\()nrtbf])/g, "$1");
    if (
      content.length > 2 &&
      /[a-zA-Z0-9]/.test(content) &&
      !content.includes("flowcv.com") &&
      !content.includes("Skia/PDF") &&
      !content.includes("KHTML") &&
      !content.includes("X11;") &&
      !content.includes("Linux x86_64") &&
      !content.startsWith("/F") &&
      !isBinaryGarbage(content)
    ) {
      textMatches.push(content);
    }
  }

  // Match hex strings: <48656c6c6f>
  const hexRegex = /<([0-9A-Fa-f]{8,})>/g;
  let hexMatch;
  while ((hexMatch = hexRegex.exec(str)) !== null) {
    const hex = hexMatch[1];
    let decoded = "";
    for (let c = 0; c < hex.length; c += 2) {
      const byte = parseInt(hex.substr(c, 2), 16);
      if (byte >= 32 && byte <= 126) {
        decoded += String.fromCharCode(byte);
      }
    }
    if (decoded.length > 4 && /[a-zA-Z0-9]/.test(decoded) && !isBinaryGarbage(decoded)) {
      textMatches.push(decoded);
    }
  }

  return Array.from(new Set(textMatches)).join(" ");
}

async function parseDocx(file: File): Promise<string> {
  try {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    if (result.value && result.value.trim().length > 20 && !isBinaryGarbage(result.value)) {
      return result.value;
    }
  } catch (err) {
    console.warn("Mammoth docx parse failed:", err);
  }

  throw new Error(
    "Could not extract readable text from this DOCX file. Please upload a valid document or paste your resume text."
  );
}
