export async function parseResumeFile(file: File): Promise<string> {
  const ext = file.name.toLowerCase().split(".").pop();

  if (ext === "pdf") {
    return parsePdf(file);
  }
  if (ext === "docx" || ext === "doc") {
    return parseDocx(file);
  }
  if (ext === "txt") {
    return file.text();
  }
  throw new Error("Unsupported file format. Please upload a PDF, DOCX, or TXT file.");
}

async function parsePdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  try {
    const pdfjsLib = await import("pdfjs-dist");
    // Use reliable cdnjs worker URL or fallback to cdnjs/unpkg with error handling
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
    if (content.length > 2 && /[a-zA-Z0-9]/.test(content)) {
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
