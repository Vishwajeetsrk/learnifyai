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
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    try {
      const page = await pdf.getPage(i);
      const token = await page.getTextContent();
      text += token.items.map((item: any) => item.str).join(" ") + "\n";
    } catch {
      // Skip corrupted pages instead of failing entirely
    }
  }
  return text;
}

async function parseDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}
