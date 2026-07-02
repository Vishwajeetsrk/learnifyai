// Shared invoice PDF generation utility
// Used by billing, wallet, and admin pages

import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { format } from "date-fns";

interface InvoiceData {
  invoice_number: string;
  created_at: string;
  due_date?: string | null;
  status: string;
  amount_inr: number;
  tax_inr?: number;
  total_inr: number;
  subtotal_inr?: number;
  gstin?: string | null;
  line_items?: any[] | null;
  notes?: string | null;
  terms?: string | null;
  payment_method?: string | null;
  paid_at?: string | null;
  cashfree_order_id?: string | null;
}

interface BrandingData {
  company_name: string;
  legal_name: string;
  gstin: string;
  prefix: string;
  footer: string;
  logo_url?: string | null;
  contact?: string | null;
  primary_color?: string;
  secondary_color?: string;
  success_color?: string;
}

const DEFAULT_BRANDING: BrandingData = {
  company_name: "Learnify AI",
  legal_name: "Learnify EdTech Pvt. Ltd.",
  gstin: "29XXXXX1234X1Z5",
  prefix: "INV",
  footer: "This is a computer-generated invoice and does not require a signature.",
  primary_color: "#4F46E5",
  secondary_color: "#7C3AED",
  success_color: "#22C55E",
};

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  return [
    parseInt(c.substring(0, 2), 16),
    parseInt(c.substring(2, 4), 16),
    parseInt(c.substring(4, 6), 16),
  ];
}

/** Load a URL (including /logo.png) to base64 data URL */
async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    // For relative URLs, resolve against origin
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    const resp = await fetch(fullUrl);
    if (!resp.ok) return null;
    const blob = await resp.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/** Draw a rounded rectangle manually (for older jsPDF builds) */
function drawRoundedRect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  style: "F" | "D" | "FD" = "F"
) {
  doc.roundedRect(x, y, w, h, r, r, style);
}

export async function downloadInvoicePdf(
  inv: InvoiceData,
  userEmail: string,
  brandingOverrides?: Partial<BrandingData>
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const branding = { ...DEFAULT_BRANDING, ...brandingOverrides };
  const primary = hexToRgb(branding.primary_color || DEFAULT_BRANDING.primary_color!);
  const secondary = hexToRgb(branding.secondary_color || DEFAULT_BRANDING.secondary_color!);

  const pageW = 210;
  const margin = 14;

  // ─── 1. HEADER GRADIENT BAND ─────────────────────────────────────────────
  // Solid header with primary color
  doc.setFillColor(primary[0], primary[1], primary[2]);
  doc.rect(0, 0, pageW, 58, "F");
  // Accent strip on right side
  doc.setFillColor(secondary[0], secondary[1], secondary[2]);
  doc.rect(pageW - 30, 0, 30, 58, "F");

  // ─── 2. LOGO (top-left in header) ────────────────────────────────────────
  // Try custom logo_url first, then fallback to /logo.png
  const logoSrc = branding.logo_url || "/logo.png";
  const logoBase64 = await loadImageAsBase64(logoSrc);
  if (logoBase64) {
    try {
      const ext = logoBase64.includes("image/png") ? "PNG" : logoBase64.includes("image/svg") ? "SVG" : "PNG";
      doc.addImage(logoBase64, ext, margin, 10, 32, 32);
    } catch {
      // logo failed — skip silently
    }
  }

  // ─── 3. COMPANY NAME & LEGAL INFO (header) ────────────────────────────────
  const textStartX = logoBase64 ? margin + 36 : margin;
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(String(branding.company_name || "Learnify AI"), textStartX, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(210, 210, 255);
  doc.text(String(branding.legal_name || ""), textStartX, 30);
  if (branding.gstin) doc.text(`GSTIN: ${branding.gstin}`, textStartX, 37);
  if (branding.contact) doc.text(String(branding.contact), textStartX, 44);

  // ─── 4. TAX INVOICE LABEL + INVOICE # (top-right) ─────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("TAX INVOICE", pageW - margin, 18, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(210, 210, 255);
  doc.text(`#${inv.invoice_number || ""}`, pageW - margin, 26, { align: "right" });

  // ─── 5. STATUS PILL ──────────────────────────────────────────────────────
  const statusColors: Record<string, [number, number, number]> = {
    paid: [34, 197, 94],
    pending: [245, 158, 11],
    overdue: [239, 68, 68],
    failed: [239, 68, 68],
    refunded: [99, 102, 241],
    void: [107, 114, 128],
  };
  const sc = statusColors[inv.status] || [100, 100, 100];
  const statusLabel = (inv.status || "").toUpperCase();
  doc.setFillColor(sc[0], sc[1], sc[2]);
  drawRoundedRect(doc, pageW - margin - 38, 30, 38, 9, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(statusLabel, pageW - margin - 19, 36.5, { align: "center" });

  // ─── 6. DATE BLOCK (below header) ─────────────────────────────────────────
  const infoY = 68;
  doc.setDrawColor(230, 230, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, 62, pageW - margin, 62);

  const dateItems = [
    { label: "Invoice Date", value: inv.created_at ? format(new Date(inv.created_at), "dd MMM yyyy") : "N/A" },
    ...(inv.due_date ? [{ label: "Due Date", value: format(new Date(inv.due_date), "dd MMM yyyy") }] : []),
    ...(inv.paid_at ? [{ label: "Paid On", value: format(new Date(inv.paid_at), "dd MMM yyyy") }] : []),
  ];
  const blockW = Math.floor((pageW - margin * 2) / dateItems.length);
  dateItems.forEach((item, i) => {
    const bx = margin + i * blockW;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(130);
    doc.text(item.label, bx, infoY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(40);
    doc.text(item.value, bx, infoY + 6);
  });

  // ─── 7. BILL TO / FROM SECTION ────────────────────────────────────────────
  const billY = infoY + 18;
  doc.setFillColor(248, 248, 255);
  drawRoundedRect(doc, margin, billY, 85, 28, 3, "F");
  doc.setFillColor(248, 255, 252);
  drawRoundedRect(doc, margin + 90, billY, 85, 28, 3, "F");

  // Bill From
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.text("FROM", margin + 4, billY + 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(40);
  doc.text(String(branding.company_name || "Learnify AI"), margin + 4, billY + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100);
  if (branding.legal_name) doc.text(branding.legal_name, margin + 4, billY + 20);

  // Bill To
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(34, 197, 94);
  doc.text("BILL TO", margin + 94, billY + 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(40);
  const emailTrimmed = (userEmail || "Customer").substring(0, 34);
  doc.text(emailTrimmed, margin + 94, billY + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100);
  if (inv.gstin) doc.text(`GSTIN: ${inv.gstin}`, margin + 94, billY + 20);
  if (inv.payment_method && !inv.gstin)
    doc.text(`Payment: ${inv.payment_method}`, margin + 94, billY + 20);

  // ─── 8. LINE ITEMS TABLE ──────────────────────────────────────────────────
  let tableBody: any[][];
  if (inv.line_items && Array.isArray(inv.line_items) && inv.line_items.length > 0) {
    tableBody = inv.line_items.map((item: any) => {
      const qty = item.quantity || 1;
      const rate = item.amount || item.unit_price || inv.amount_inr || 0;
      const desc = item.description || item.name || "Charge";
      const amount = Number(rate) * qty;
      return [desc, qty.toString(), `₹${Number(rate).toFixed(2)}`, `₹${amount.toFixed(2)}`];
    });
  } else {
    const p = Number(inv.amount_inr || inv.total_inr || 0);
    tableBody = [["Subscription Plan / Renewal", "1", `₹${p.toFixed(2)}`, `₹${Number(inv.total_inr || p).toFixed(2)}`]];
  }

  const subtotal = Number(inv.amount_inr || inv.subtotal_inr || inv.total_inr || 0);
  const tax = Number(inv.tax_inr || 0);
  const cgst = tax / 2;
  const sgst = tax / 2;

  autoTable(doc, {
    startY: billY + 34,
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: primary,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8.5,
      halign: "center",
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [50, 50, 50],
    },
    alternateRowStyles: {
      fillColor: [248, 248, 255],
    },
    footStyles: {
      fillColor: [240, 240, 255],
      textColor: [50, 50, 50],
      fontStyle: "bold",
      fontSize: 9,
    },
    head: [["#", "Description", "Qty", "Rate (₹)", "Amount (₹)"]],
    body: tableBody.map((row, i) => [(i + 1).toString(), row[0], row[1], row[2], row[3]]),
    foot: [
      ...(tax > 0 ? [["", "Subtotal", "", "", `₹${subtotal.toFixed(2)}`]] : []),
      ...(tax > 0 ? [["", "CGST @ 9%", "", "", `₹${cgst.toFixed(2)}`]] : []),
      ...(tax > 0 ? [["", "SGST @ 9%", "", "", `₹${sgst.toFixed(2)}`]] : []),
      ["", "TOTAL AMOUNT", "", "", `₹${Number(inv.total_inr).toFixed(2)}`],
    ],
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 82 },
      2: { cellWidth: 14, halign: "center" },
      3: { cellWidth: 30, halign: "right" },
      4: { cellWidth: 34, halign: "right" },
    },
  });

  // ─── 9. TOTAL HIGHLIGHT BOX ───────────────────────────────────────────────
  const lastTable = (doc as any).lastAutoTable;
  let finalY = Number(lastTable?.finalY ?? 200);

  doc.setFillColor(primary[0], primary[1], primary[2]);
  drawRoundedRect(doc, pageW - margin - 60, finalY + 4, 60, 14, 3, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(200, 200, 255);
  doc.text("TOTAL PAID", pageW - margin - 5, finalY + 9.5, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`₹${Number(inv.total_inr).toFixed(2)}`, pageW - margin - 5, finalY + 15.5, { align: "right" });

  // ─── 10. PAYMENT DETAILS BOX ─────────────────────────────────────────────
  const payBoxY = finalY + 22;
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(210, 210, 230);
  doc.setLineWidth(0.4);
  drawRoundedRect(doc, margin, payBoxY, pageW - margin * 2, 22, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.text("Payment Details", margin + 4, payBoxY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80);
  const payDetails = [
    `Invoice: ${inv.invoice_number || ""}`,
    `Status: ${(inv.status || "").toUpperCase()}`,
    ...(inv.cashfree_order_id ? [`Order ID: ${inv.cashfree_order_id}`] : []),
    ...(inv.payment_method ? [`Method: ${inv.payment_method}`] : []),
  ];
  payDetails.forEach((txt, i) => {
    const col = Math.floor(i / 2);
    const row = i % 2;
    doc.text(txt, margin + 4 + col * 86, payBoxY + 13 + row * 6);
  });

  // ─── 11. VERIFICATION URL ─────────────────────────────────────────────────
  const footerStartY = payBoxY + 28;
  doc.setFontSize(7);
  doc.setTextColor(150);
  doc.setFont("helvetica", "italic");
  const verifyUrl = `${typeof window !== "undefined" ? window.location.origin : "https://learnifyaitool.vercel.app"}/verify-invoice/${inv.invoice_number || ""}`;
  doc.text(`Verify at: ${verifyUrl}`, margin, footerStartY);

  // ─── 12. FOOTER NOTE ──────────────────────────────────────────────────────
  if (branding.footer) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.setTextColor(140);
    doc.text(String(branding.footer), margin, footerStartY + 6);
  }
  if (inv.notes) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(80);
    doc.text(`Notes: ${inv.notes}`, margin, footerStartY + 12);
  }
  if (inv.terms) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(80);
    doc.text(`Terms: ${inv.terms}`, margin, footerStartY + 18);
  }

  // ─── 13. BOTTOM BAR ───────────────────────────────────────────────────────
  doc.setFillColor(primary[0], primary[1], primary[2]);
  doc.rect(0, 289, pageW, 8, "F");
  doc.setFontSize(7);
  doc.setTextColor(200, 200, 255);
  doc.setFont("helvetica", "normal");
  doc.text(
    `© ${new Date().getFullYear()} ${branding.company_name || "Learnify AI"} · ${branding.legal_name || ""}`,
    pageW / 2,
    294,
    { align: "center" }
  );

  // ─── 14. PAID WATERMARK ────────────────────────────────────────────────────
  if (inv.status === "paid") {
    doc.setFontSize(52);
    doc.setTextColor(34, 197, 94);
    doc.setFont("helvetica", "bold");
    doc.setGState(doc.GState({ opacity: 0.08 }));
    doc.text("PAID", pageW / 2, 165, { align: "center", angle: 45 });
    doc.setGState(doc.GState({ opacity: 1 }));
  }

  doc.save(`${(branding.company_name || "Learnify_AI").replace(/\s+/g, "_")}_${inv.invoice_number || "invoice"}.pdf`);
}

export function formatCurrency(amount: number): string {
  return `₹${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
