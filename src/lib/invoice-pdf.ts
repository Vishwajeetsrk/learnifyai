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
  footer: "This is a computer generated invoice and does not require a signature.",
  primary_color: "#4F46E5",
  secondary_color: "#7C3AED",
  success_color: "#22C55E",
};

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  return [parseInt(c.substring(0, 2), 16), parseInt(c.substring(2, 4), 16), parseInt(c.substring(4, 6), 16)];
}

export async function downloadInvoicePdf(
  inv: InvoiceData,
  userEmail: string,
  brandingOverrides?: Partial<BrandingData>,
) {
  const doc = new jsPDF();
  const branding = { ...DEFAULT_BRANDING, ...brandingOverrides };
  const primary = hexToRgb(branding.primary_color || DEFAULT_BRANDING.primary_color!);

  // --- Logo ---
  let logoHeight = 0;
  if (branding.logo_url) {
    try {
      const resp = await fetch(branding.logo_url);
      const blob = await resp.blob();
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      doc.addImage(base64, "PNG", 14, 10, 36, 36);
      logoHeight = 36;
    } catch {
      // skip
    }
  }

  // --- Colored header bar ---
  doc.setFillColor(primary[0], primary[1], primary[2]);
  doc.rect(0, 0, 210, logoHeight > 0 ? 52 : 44, "F");

  // --- Company name (white, on colored bar) ---
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text(branding.company_name, logoHeight > 0 ? 56 : 14, logoHeight > 0 ? 22 : 18);

  // --- Legal name + GSTIN (lighter on bar) ---
  doc.setFontSize(8);
  doc.setTextColor(220, 220, 255);
  const textX = logoHeight > 0 ? 56 : 14;
  doc.text(branding.legal_name, textX, logoHeight > 0 ? 30 : 26);
  doc.text(`GSTIN: ${branding.gstin}`, textX, logoHeight > 0 ? 37 : 32);

  // --- INVOICE title (right side on bar) ---
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("TAX INVOICE", 196, logoHeight > 0 ? 22 : 18, { align: "right" });

  // --- Invoice number + dates (right side, below bar) ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80);
  const rightStartY = Math.max(logoHeight > 0 ? 56 : 48, 48);
  doc.text(`Invoice #: ${inv.invoice_number}`, 196, rightStartY, { align: "right" });
  doc.text(`Date: ${inv.created_at ? format(new Date(inv.created_at), "dd MMM yyyy") : "N/A"}`, 196, rightStartY + 5, { align: "right" });
  if (inv.due_date) {
    doc.text(`Due Date: ${format(new Date(inv.due_date), "dd MMM yyyy")}`, 196, rightStartY + 10, { align: "right" });
  }
  if (inv.paid_at) {
    doc.text(`Paid On: ${format(new Date(inv.paid_at), "dd MMM yyyy")}`, 196, rightStartY + 15, { align: "right" });
  }

  // --- Status badge ---
  const badgeY = inv.paid_at ? rightStartY + 21 : rightStartY + 16;
  const statusColors: Record<string, [number, number, number]> = {
    paid: [34, 197, 94],
    pending: [245, 158, 11],
    overdue: [239, 68, 68],
    refunded: [107, 114, 128],
  };
  const sc = statusColors[inv.status] || [100, 100, 100];
  doc.setFillColor(sc[0], sc[1], sc[2]);
  doc.roundedRect(150, badgeY - 4, 46, 8, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(inv.status.toUpperCase(), 173, badgeY, { align: "center" });

  // --- Contact line ---
  let contactY = Math.max(rightStartY + 28, logoHeight > 0 ? 65 : 58);
  if (branding.contact) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(branding.contact, textX, contactY);
    contactY += 5;
  }

  // --- Separator line ---
  const sepY = Math.max(contactY + 2, logoHeight > 0 ? 72 : 65);
  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.line(14, sepY, 196, sepY);

  // --- Bill To section ---
  const billToY = sepY + 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.text("Bill To", 14, billToY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60);
  doc.text(userEmail || "Customer", 14, billToY + 7);
  let billToDetails = billToY + 7;
  if (inv.gstin) {
    billToDetails += 6;
    doc.text(`GSTIN: ${inv.gstin}`, 14, billToDetails);
  }
  if (inv.payment_method) {
    billToDetails += 6;
    doc.text(`Payment: ${inv.payment_method}`, 14, billToDetails);
  }

  // --- Line items table ---
  let tableBody: any[][];
  if (inv.line_items && Array.isArray(inv.line_items) && inv.line_items.length > 0) {
    tableBody = inv.line_items.map((item: any) => {
      const qty = item.quantity || 1;
      const rate = item.amount || item.unit_price || inv.amount_inr || 0;
      const desc = item.description || item.name || "Charge";
      const amount = Number(rate) * qty;
      return [desc, `₹${Number(rate).toFixed(2)}`, qty, `₹${amount.toFixed(2)}`];
    });
  } else {
    const p = Number(inv.amount_inr || inv.total_inr || 0);
    tableBody = [["Subscription Plan / Renewal", `₹${p.toFixed(2)}`, 1, `₹${(inv.total_inr || p).toFixed(2)}`]];
  }

  const subtotal = Number(inv.amount_inr || inv.subtotal_inr || inv.total_inr || 0);
  const tax = Number(inv.tax_inr || 0);
  const cgst = tax / 2;
  const sgst = tax / 2;

  autoTable(doc, {
    startY: billToDetails + 12,
    headStyles: {
      fillColor: primary,
      fontStyle: "bold",
      fontSize: 9,
      halign: "center",
    },
    bodyStyles: {
      fontSize: 9,
    },
    footStyles: {
      fillColor: [248, 248, 248],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      fontSize: 9,
    },
    head: [["#", "Description", "HSN/SAC", "Qty", "Rate (₹)", "Amount (₹)"]],
    body: tableBody.map((row, i) => [(i + 1).toString(), row[0], "", row[2].toString(), row[1], row[3]]),
    foot: [
      ...(tax > 0 ? [["", "Subtotal", "", "", "", `₹${subtotal.toFixed(2)}`]] : []),
      ...(tax > 0 ? [["", "CGST @ 9%", "", "", "", `₹${cgst.toFixed(2)}`]] : []),
      ...(tax > 0 ? [["", "SGST @ 9%", "", "", "", `₹${sgst.toFixed(2)}`]] : []),
      ["", "Total Paid", "", "", "", `₹${Number(inv.total_inr).toFixed(2)}`],
    ],
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 68 },
      2: { cellWidth: 24, halign: "center" },
      3: { cellWidth: 14, halign: "center" },
      4: { cellWidth: 28, halign: "right" },
      5: { cellWidth: 32, halign: "right" },
    },
  });

  // --- Footer ---
  const finalY = (doc as any).lastAutoTable?.finalY ?? 200;
  let footerY = finalY + 15;

  doc.setFontSize(8);
  doc.setTextColor(130);
  doc.setFont("helvetica", "italic");
  doc.text(branding.footer, 14, footerY);

  if (inv.notes) {
    footerY += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    doc.text(`Notes: ${inv.notes}`, 14, footerY);
  }

  if (inv.terms) {
    footerY += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    doc.text(`Terms: ${inv.terms}`, 14, footerY);
  }

  // --- Payment details box ---
  footerY += 10;
  doc.setDrawColor(primary[0], primary[1], primary[2]);
  doc.setFillColor(248, 248, 255);
  doc.roundedRect(14, footerY, 182, 28, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.text("Payment Details", 20, footerY + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(80);
  doc.text(`Invoice #: ${inv.invoice_number}`, 20, footerY + 15);
  doc.text(`Status: ${inv.status.toUpperCase()}`, 20, footerY + 21);
  if (inv.cashfree_order_id) {
    doc.text(`Order ID: ${inv.cashfree_order_id}`, 110, footerY + 15);
  }

  // --- Verification QR code area (placeholder) ---
  footerY += 34;
  doc.setFontSize(7);
  doc.setTextColor(150);
  doc.setFont("helvetica", "italic");
  doc.text(`Digitally verified at: ${typeof window !== "undefined" ? window.location.origin : ""}/verify-invoice/${inv.invoice_number}`, 14, footerY);

  // --- Bottom bar ---
  doc.setFillColor(primary[0], primary[1], primary[2]);
  doc.rect(0, 290, 210, 7, "F");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.text(`© ${new Date().getFullYear()} ${branding.company_name}. ${branding.legal_name}`, 105, 295, { align: "center" });

  // --- Watermark for paid invoices ---
  if (inv.status === "paid") {
    doc.setFontSize(48);
    doc.setTextColor(34, 197, 94, 0.08);
    doc.setFont("helvetica", "bold");
    doc.text("PAID", 105, 160, { align: "center", angle: 45 });
  }

  doc.save(`${branding.company_name.replace(/\s+/g, "_")}_${inv.invoice_number}.pdf`);
}

export function formatCurrency(amount: number): string {
  return `₹${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
