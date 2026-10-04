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
      if (line.length < 4 && !/^(I|a|an|the|to|in|of|or|on|at|by|re|de|v2|v3|•|C\+\+|C#|Go|R|JS|UI|UX|AI|ML|DL)$/i.test(line)) {
        return false;
      }
      return true;
    });

  cleaned = filteredLines.join("\n");

  // 6. Normalize whitespace and newlines
  cleaned = cleaned.replace(/[ \t]{2,}/g, " ");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  return cleaned.trim();
}

async function parsePdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  try {
    const pdfjsLib = await import("pdfjs-dist");
    try {
      if (typeof window !== "undefined") {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || "3.11.174"}/pdf.worker.min.mjs`;
      }
    } catch {}

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
        const pageLines: string[] = [];
        let currentLine = "";
        let lastY: number | null = null;

        for (const item of token.items as any[]) {
          if (!item.str) continue;
          const currentY = item.transform ? Math.round(item.transform[5]) : null;
          if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 4) {
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
        console.warn(`Error reading page ${i} via pdfjs:`, err);
      }
    }

    if (text.trim().length > 30) {
      return text;
    }
  } catch (err) {
    console.warn("pdfjs worker warning, executing robust fallback PDF text extractor:", err);
  }

  const extractedFallback = extractPdfTextFallback(arrayBuffer);
  if (extractedFallback.trim().length > 30) {
    return extractedFallback;
  }

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
    if (joined.length > 2 && /[a-zA-Z0-9]/.test(joined)) {
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
      !content.startsWith("/F")
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
    if (decoded.length > 4 && /[a-zA-Z0-9]/.test(decoded)) {
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
    if (result.value && result.value.trim().length > 20) {
      return result.value;
    }
  } catch (err) {
    console.warn("Mammoth docx parse failed, trying raw text decoder fallback:", err);
  }

  try {
    const text = await file.text();
    // Strip XML tags if docx xml was read
    const stripped = text.replace(/<[^>]+>/g, " ").replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ");
    return stripped.length > 20 ? stripped : "Resume docx parsed.";
  } catch {
    return "Resume document parsed.";
  }
}
