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
  address?: string | null;
  website?: string | null;
  signature?: string | null;
  terms?: string | null;
  refund_policy?: string | null;
  template?: string | null;
  qr_enabled?: string | null;
  watermark?: string | null;
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
  address: "102, Innovation Hub, Outer Ring Road, Bangalore, KA, 560103",
  website: "https://learnifyai.com",
  signature: "",
  terms: "1. Fees paid are non-refundable. 2. Subscriptions auto-renew until cancelled.",
  refund_policy: "Refunds are processed within 5-7 working days under special circumstances.",
  template: "modern",
  qr_enabled: "true",
  watermark: "PAID",
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
  style: "F" | "D" | "FD" = "F",
) {
  doc.roundedRect(x, y, w, h, r, r, style);
}

export async function downloadInvoicePdf(
  inv: InvoiceData,
  userEmail: string,
  brandingOverrides?: Partial<BrandingData>,
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const branding = { ...DEFAULT_BRANDING, ...brandingOverrides };
  const templateStyle = branding.template || "modern";

  // Template-specific palette defaults
  let primaryHex = branding.primary_color || DEFAULT_BRANDING.primary_color!;
  let secondaryHex = branding.secondary_color || DEFAULT_BRANDING.secondary_color!;
  
  if (templateStyle === "minimal") {
    primaryHex = "#1e293b";
    secondaryHex = "#475569";
  } else if (templateStyle === "luxury") {
    primaryHex = "#0f1b3d";
    secondaryHex = "#d4af37";
  } else if (templateStyle === "dark") {
    primaryHex = "#0f172a";
    secondaryHex = "#38bdf8";
  }

  const primary = hexToRgb(primaryHex);
  const secondary = hexToRgb(secondaryHex);

  const pageW = 210;
  const margin = 14;

  // Set dark background for dark mode template
  if (templateStyle === "dark") {
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageW, 297, "F");
  }

  // ─── 1. HEADER GRADIENT BAND ─────────────────────────────────────────────
  if (templateStyle === "minimal") {
    // Minimalist clean thin line separator
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.8);
    doc.line(margin, 24, pageW - margin, 24);
  } else if (templateStyle === "luxury") {
    // Luxury top line with gold borders
    doc.setFillColor(15, 27, 61); // deep navy
    doc.rect(0, 0, pageW, 46, "F");
    doc.setFillColor(212, 175, 55); // gold accent bar
    doc.rect(0, 46, pageW, 3, "F");
  } else {
    // Solid header with primary color (Modern/Dark/Corporate)
    doc.setFillColor(primary[0], primary[1], primary[2]);
    doc.rect(0, 0, pageW, 48, "F");
    // Accent strip on right side
    doc.setFillColor(secondary[0], secondary[1], secondary[2]);
    doc.rect(pageW - 25, 0, 25, 48, "F");
  }

  // ─── 2. LOGO (top-left in header) ────────────────────────────────────────
  const logoSrc = branding.logo_url || "/logo.png";
  const logoBase64 = await loadImageAsBase64(logoSrc);
  if (logoBase64) {
    try {
      const ext = logoBase64.includes("image/png")
        ? "PNG"
        : logoBase64.includes("image/svg")
          ? "SVG"
          : "PNG";
      const logoY = templateStyle === "minimal" ? 6 : 8;
      doc.addImage(logoBase64, ext, margin, logoY, 28, 28);
    } catch {
      // logo failed — skip silently
    }
  }

  // ─── 3. COMPANY NAME & LEGAL INFO (header) ────────────────────────────────
  const textStartX = logoBase64 ? margin + 32 : margin;
  const isDarkT = templateStyle === "dark" || templateStyle === "luxury" || templateStyle === "modern" || templateStyle === "corporate";
  
  doc.setTextColor(isDarkT ? 255 : 30, isDarkT ? 255 : 41, isDarkT ? 255 : 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const titleY = templateStyle === "minimal" ? 14 : 18;
  doc.text(String(branding.company_name || "Learnify AI"), textStartX, titleY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(isDarkT ? 210 : 100, isDarkT ? 210 : 110, isDarkT ? 255 : 120);
  doc.text(String(branding.legal_name || ""), textStartX, titleY + 6);
  if (branding.gstin) doc.text(`GSTIN: ${branding.gstin}`, textStartX, titleY + 12);
  if (branding.contact) doc.text(String(branding.contact), textStartX, titleY + 18);

  // ─── 4. TAX INVOICE LABEL + INVOICE # (top-right) ─────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(isDarkT ? 255 : 15, isDarkT ? 255 : 23, isDarkT ? 255 : 42);
  doc.text("TAX INVOICE", pageW - margin, titleY, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(isDarkT ? 210 : 100, isDarkT ? 210 : 110, isDarkT ? 255 : 120);
  doc.text(`#${inv.invoice_number || ""}`, pageW - margin, titleY + 7, { align: "right" });

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
  
  const pillY = templateStyle === "minimal" ? titleY + 11 : titleY + 12;
  drawRoundedRect(doc, pageW - margin - 34, pillY, 34, 8, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(statusLabel, pageW - margin - 17, pillY + 5.5, { align: "center" });

  // ─── 6. DATE BLOCK (below header) ─────────────────────────────────────────
  const startY = templateStyle === "luxury" ? 56 : 52;
  doc.setDrawColor(templateStyle === "dark" ? 50 : 230, templateStyle === "dark" ? 70 : 230, templateStyle === "dark" ? 100 : 240);
  doc.setLineWidth(0.4);
  doc.line(margin, startY, pageW - margin, startY);

  const infoY = startY + 8;
  const dateItems = [
    {
      label: "Invoice Date",
      value: inv.created_at ? format(new Date(inv.created_at), "dd MMM yyyy") : "N/A",
    },
    ...(inv.due_date
      ? [{ label: "Due Date", value: format(new Date(inv.due_date), "dd MMM yyyy") }]
      : []),
    ...(inv.paid_at
      ? [{ label: "Paid On", value: format(new Date(inv.paid_at), "dd MMM yyyy") }]
      : []),
  ];
  const blockW = Math.floor((pageW - margin * 2) / dateItems.length);
  dateItems.forEach((item, i) => {
    const bx = margin + i * blockW;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(templateStyle === "dark" ? 180 : 130);
    doc.text(item.label, bx, infoY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(templateStyle === "dark" ? 255 : 40);
    doc.text(item.value, bx, infoY + 5.5);
  });

  // ─── 7. BILL TO / FROM SECTION ────────────────────────────────────────────
  const billY = infoY + 16;
  const cardBgColor = templateStyle === "dark" ? [30, 41, 59] : [248, 248, 255];
  doc.setFillColor(cardBgColor[0], cardBgColor[1], cardBgColor[2]);
  drawRoundedRect(doc, margin, billY, 86, 32, 2.5, "F");
  
  const recipientBg = templateStyle === "dark" ? [15, 32, 60] : [248, 255, 252];
  doc.setFillColor(recipientBg[0], recipientBg[1], recipientBg[2]);
  drawRoundedRect(doc, margin + 96, billY, 86, 32, 2.5, "F");

  // Bill From
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.text("FROM", margin + 4, billY + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(templateStyle === "dark" ? 255 : 40);
  doc.text(String(branding.company_name || "Learnify AI"), margin + 4, billY + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(templateStyle === "dark" ? 200 : 100);
  
  const addrText = branding.address || "";
  const splitAddr = doc.splitTextToSize(addrText, 78);
  doc.text(splitAddr, margin + 4, billY + 17);

  // Bill To
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(34, 197, 94);
  doc.text("BILL TO", margin + 100, billY + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(templateStyle === "dark" ? 255 : 40);
  
  const emailTrimmed = (userEmail || "Customer").substring(0, 36);
  doc.text(emailTrimmed, margin + 100, billY + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(templateStyle === "dark" ? 200 : 100);
  
  doc.text("Premium Learnify Account Holder", margin + 100, billY + 17);
  if (inv.gstin) doc.text(`GSTIN: ${inv.gstin}`, margin + 100, billY + 23);
  else if (inv.payment_method) {
    doc.text(`Payment: ${inv.payment_method}`, margin + 100, billY + 23);
  }

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
    tableBody = [
      [
        "Subscription Plan Access / Renewal",
        "1",
        `₹${p.toFixed(2)}`,
        `₹${Number(inv.total_inr || p).toFixed(2)}`,
      ],
    ];
  }

  const subtotal = Number(inv.amount_inr || inv.subtotal_inr || inv.total_inr || 0);
  const tax = Number(inv.tax_inr || 0);
  const cgst = tax / 2;
  const sgst = tax / 2;

  autoTable(doc, {
    startY: billY + 36,
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: primary,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8.5,
      halign: "center",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: templateStyle === "dark" ? [240, 240, 240] : [50, 50, 50],
      fillColor: templateStyle === "dark" ? [30, 41, 59] : [255, 255, 255],
    },
    alternateRowStyles: {
      fillColor: templateStyle === "dark" ? [15, 23, 42] : [248, 248, 255],
    },
    footStyles: {
      fillColor: templateStyle === "dark" ? [30, 41, 59] : [240, 240, 255],
      textColor: templateStyle === "dark" ? [255, 255, 255] : [50, 50, 50],
      fontStyle: "bold",
      fontSize: 8.5,
    },
    head: [["#", "Description", "Qty", "Rate (₹)", "Amount (₹)"]],
    body: tableBody.map((row, i) => [(i + 1).toString(), row[0], row[1], row[2], row[3]]),
    foot: [
      ...(tax > 0 ? [["", "Subtotal", "", "", `₹${subtotal.toFixed(2)}`]] : []),
      ...(tax > 0 ? [["", "CGST @ 9% (SAC 9992)", "", "", `₹${cgst.toFixed(2)}`]] : []),
      ...(tax > 0 ? [["", "SGST @ 9% (SAC 9992)", "", "", `₹${sgst.toFixed(2)}`]] : []),
      ["", "TOTAL AMOUNT PAID", "", "", `₹${Number(inv.total_inr).toFixed(2)}`],
    ],
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 86 },
      2: { cellWidth: 12, halign: "center" },
      3: { cellWidth: 32, halign: "right" },
      4: { cellWidth: 34, halign: "right" },
    },
  });

  // ─── 9. TOTAL HIGHLIGHT BOX ───────────────────────────────────────────────
  const lastTable = (doc as any).lastAutoTable;
  let finalY = Number(lastTable?.finalY ?? 200);

  doc.setFillColor(primary[0], primary[1], primary[2]);
  drawRoundedRect(doc, pageW - margin - 55, finalY + 4, 55, 12, 2.5, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(220, 220, 255);
  doc.text("TOTAL PAID", pageW - margin - 4, finalY + 8.5, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(`₹${Number(inv.total_inr).toFixed(2)}`, pageW - margin - 4, finalY + 13.5, {
    align: "right",
  });

  // ─── 10. PAYMENT DETAILS BOX ─────────────────────────────────────────────
  const payBoxY = finalY + 18;
  const payBoxBg = templateStyle === "dark" ? [30, 41, 59] : [249, 250, 251];
  doc.setFillColor(payBoxBg[0], payBoxBg[1], payBoxBg[2]);
  doc.setDrawColor(templateStyle === "dark" ? 70 : 210, templateStyle === "dark" ? 80 : 210, templateStyle === "dark" ? 100 : 230);
  doc.setLineWidth(0.4);
  drawRoundedRect(doc, margin, payBoxY, pageW - margin * 2, 20, 2.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.text("Payment details", margin + 4, payBoxY + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(templateStyle === "dark" ? 220 : 80);
  const payDetails = [
    `Invoice: ${inv.invoice_number || ""}`,
    `Status: ${(inv.status || "").toUpperCase()}`,
    ...(inv.cashfree_order_id ? [`Order ID: ${inv.cashfree_order_id}`] : []),
    ...(inv.payment_method ? [`Method: ${inv.payment_method}`] : []),
  ];
  payDetails.forEach((txt, i) => {
    const col = Math.floor(i / 2);
    const row = i % 2;
    doc.text(txt, margin + 4 + col * 86, payBoxY + 10 + row * 5.5);
  });

  // ─── 11. VERIFICATION URL & QR CODE ───────────────────────────────────────
  const footerStartY = payBoxY + 25;
  const verifyUrl = `https://learnifyai.com/verify/invoice/${inv.invoice_number || ""}`;
  
  if (branding.qr_enabled === "true") {
    try {
      const QRCodeLib = await import("qrcode");
      const qrDataUrl = await QRCodeLib.toDataURL(verifyUrl, { margin: 1 });
      if (qrDataUrl) {
        doc.addImage(qrDataUrl, "PNG", margin, footerStartY, 18, 18);
      }
    } catch {
      // qr failed — skip silently
    }
  }

  // Draw signature
  if (branding.signature) {
    const sigBase64 = await loadImageAsBase64(branding.signature);
    if (sigBase64) {
      try {
        doc.addImage(sigBase64, "PNG", pageW - margin - 32, footerStartY, 28, 10);
      } catch {
        // signature failed — skip silently
      }
    }
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(templateStyle === "dark" ? 180 : 130);
    doc.text("Digitally Signed", pageW - margin - 30, footerStartY + 6);
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(templateStyle === "dark" ? 240 : 60);
  doc.text("Authorized Signatory", pageW - margin, footerStartY + 13, { align: "right" });

  // ─── 12. FOOTER NOTES & TERMS ─────────────────────────────────────────────
  const noteX = (branding.qr_enabled === "true") ? margin + 22 : margin;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(templateStyle === "dark" ? 160 : 120);
  
  let currentFooterY = footerStartY + 4;
  if (branding.footer) {
    doc.text(`Note: ${branding.footer}`, noteX, currentFooterY);
    currentFooterY += 4;
  }
  if (branding.terms) {
    doc.text(`Terms: ${branding.terms}`, noteX, currentFooterY);
    currentFooterY += 4;
  }
  if (branding.refund_policy) {
    doc.text(`Refunds: ${branding.refund_policy}`, noteX, currentFooterY);
  }

  // ─── 13. BOTTOM BAR ───────────────────────────────────────────────────────
  doc.setFillColor(primary[0], primary[1], primary[2]);
  doc.rect(0, 289, pageW, 8, "F");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.text(
    `© ${new Date().getFullYear()} ${branding.company_name || "Learnify AI"} · ${branding.legal_name || ""}`,
    pageW / 2,
    294,
    { align: "center" },
  );

  // ─── 14. WATERMARK ────────────────────────────────────────────────────────
  if (branding.watermark) {
    doc.saveGraphicsState();
    doc.setGState(new (doc as any).GState({ opacity: 0.05 }));
    doc.setFontSize(56);
    doc.setTextColor(34, 197, 94);
    doc.setFont("helvetica", "bold");
    doc.text(branding.watermark.toUpperCase(), pageW / 2, 160, { align: "center" });
    doc.restoreGraphicsState();
  }

  doc.save(
    `${(branding.company_name || "Learnify_AI").replace(/\s+/g, "_")}_${inv.invoice_number || "invoice"}.pdf`,
  );
}

export function formatCurrency(amount: number): string {
  return `₹${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
