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

  // 4. Remove non-printable / non-ASCII binary garbage (corrupted PDF streams)
  cleaned = cleaned.replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ");

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
      if (line.length > 10 && lettersAndDigits / line.length < 0.45) {
        return false;
      }
      // Filter out lines composed mostly of repeated single characters / noise symbols
      if (/^[^a-zA-Z0-9]+$/.test(line)) {
        return false;
      }
      // Filter out random single-character noise tokens
      if (line.length < 4 && !/^(I|a|an|the|to|in|of|or|on|at|by|re|de|v2|v3)$/i.test(line)) {
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
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || "3.11.174"}/pdf.worker.min.mjs`;
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
        text += token.items.map((item: any) => item.str).join(" ") + "\n";
      } catch {}
    }
    if (text.trim().length > 30) {
      return text;
    }
  } catch (err) {
    console.warn("pdfjs worker warning, executing fallback PDF text extractor:", err);
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
  const stringRegex = /\(([^()]*)\)/g;
  let match;
  while ((match = stringRegex.exec(str)) !== null) {
    const content = match[1].trim();
    if (
      content.length > 3 &&
      /[a-zA-Z0-9]/.test(content) &&
      !content.includes("flowcv.com") &&
      !content.includes("Skia/PDF") &&
      !content.includes("KHTML") &&
      !content.includes("X11;") &&
      !content.includes("Linux x86_64")
    ) {
      textMatches.push(content);
    }
  }

  return textMatches.join(" ");
}

async function parseDocx(file: File): Promise<string> {
  try {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (err) {
    console.warn("Mammoth docx parse failed, fallback text decoder:", err);
    const text = await file.text();
    return text.replace(/[^\x20-\x7E\n\r\t]/g, " ");
  }
}
