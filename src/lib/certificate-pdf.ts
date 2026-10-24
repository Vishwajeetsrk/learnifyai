import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

/** Render an HTMLElement to a downloaded landscape A4 PDF. */
export async function downloadElementAsPdf(el: HTMLElement, filename: string) {
  // Ultra-high DPI render (3x scale produces crisp ~3500px print-ready raster)
  const canvas = await html2canvas(el, {
    scale: 3,
    backgroundColor: null,
    useCORS: true,
    logging: false,
    imageTimeout: 15000,
  });
  const imgData = canvas.toDataURL("image/png", 1.0);
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  
  // Full-bleed fit while preserving exact aspect ratio
  const ratio = Math.min(pageW / canvas.width, pageH / canvas.height);
  const w = canvas.width * ratio;
  const h = canvas.height * ratio;
  const x = (pageW - w) / 2;
  const y = (pageH - h) / 2;
  
  pdf.addImage(imgData, "PNG", x, y, w, h, undefined, "FAST");
  pdf.save(filename);
}

/** Render an HTMLElement to a downloaded high-res PNG image (3x scale, 300+ DPI). */
export async function downloadElementAsImage(el: HTMLElement, filename: string) {
  const canvas = await html2canvas(el, {
    scale: 3,
    backgroundColor: null,
    useCORS: true,
    logging: false,
    imageTimeout: 15000,
  });
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png", 1.0);
  link.click();
}
