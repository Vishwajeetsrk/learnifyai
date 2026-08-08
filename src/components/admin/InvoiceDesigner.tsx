import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Loader2,
  Upload,
  Palette,
  FileText,
  Building2,
  ShieldAlert,
  Save,
  Undo2,
  Printer,
  QrCode,
} from "lucide-react";
import { toast } from "sonner";
import { adminContentQuery, adminContentUpsert } from "@/lib/admin-content.functions";
import { logAdminAction } from "@/lib/admin-audit.functions";
import { supabase } from "@/integrations/supabase/client";
import { downloadInvoicePdf } from "@/lib/invoice-pdf";

const DEFAULT_INVOICE_SETTINGS: Record<string, string> = {
  invoice_company_name: "Learnify AI",
  invoice_legal_name: "Learnify EdTech Pvt. Ltd.",
  invoice_gstin: "29XXXXX1234X1Z5",
  invoice_prefix: "INV",
  invoice_footer:
    "Thank you for supporting Learnify AI! For queries, contact support@learnifyai.in.",
  invoice_logo_url: "/logo.png",
  invoice_contact: "support@learnifyai.in · +91 99182 31234",
  invoice_address: "102, Innovation Hub, Outer Ring Road, Bangalore, KA, 560103",
  invoice_website: "https://www.learnifyai.in",
  invoice_primary_color: "#4f46e5",
  invoice_secondary_color: "#7c3aed",
  invoice_text_color: "#1e293b",
  invoice_band_text_color: "#ffffff",
  invoice_title: "TAX INVOICE",
  invoice_test_number: "INV-B91D4407",
  invoice_watermark: "PAID",
  invoice_signature: "",
  invoice_terms:
    "1. Fees paid are governed under Consumer Protection (E-Commerce) Rules 2020. 2. Subscriptions auto-renew until cancelled.",
  invoice_refund_policy:
    "Auto-approved refunds are processed within 5-7 working days via Cashfree.",
  invoice_template: "modern",
  invoice_qr_enabled: "true",
};

export default function InvoiceDesigner() {
  const qc = useQueryClient();
  const doQuery = useServerFn(adminContentQuery);
  const doUpsert = useServerFn(adminContentUpsert);
  const doLogAudit = useServerFn(logAdminAction);

  const [settings, setSettings] = useState<Record<string, string>>(DEFAULT_INVOICE_SETTINGS);
  const [logoUploading, setLogoUploading] = useState(false);
  const [sigUploading, setSigUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load current settings
  const { data: rawSettings, isLoading } = useQuery({
    queryKey: ["admin-invoice-designer-settings"],
    queryFn: async () => {
      const res = await doQuery({
        data: {
          table: "site_settings",
          columns: "key,value",
        },
      });
      const data = (res as any[]) || [];
      const loaded: Record<string, string> = {};
      data.forEach((item) => {
        if (item.key.startsWith("invoice_")) {
          loaded[item.key] = item.value || "";
        }
      });
      return loaded;
    },
  });

  useEffect(() => {
    if (rawSettings) {
      setSettings({
        ...DEFAULT_INVOICE_SETTINGS,
        ...rawSettings,
      });
    }
  }, [rawSettings]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(false);
    setSaving(true);
    try {
      const rows = Object.keys(settings).map((key) => ({
        key,
        value: settings[key] ?? "",
      }));

      // Ingest into Supabase via serverFn
      await doUpsert({
        data: {
          table: "site_settings",
          data: rows,
          onConflict: "key",
        },
      });

      // Audit log tracking
      await doLogAudit({
        data: {
          action: "update_invoice_designer_settings",
          entityType: "invoice_settings",
          changes: {
            before: rawSettings || {},
            after: settings,
          },
        },
      });

      toast.success("Invoice settings and template saved!");
      qc.invalidateQueries({ queryKey: ["admin-invoice-designer-settings"] });
      qc.invalidateQueries({ queryKey: ["site-settings"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File, type: "logo" | "signature") => {
    const isLogo = type === "logo";
    if (isLogo) setLogoUploading(true);
    else setSigUploading(true);

    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `invoice-designer/${type}-${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from("media")
        .upload(path, file, { contentType: file.type, upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      const url = urlData.publicUrl;

      handleChange(isLogo ? "invoice_logo_url" : "invoice_signature", url);
      toast.success(`${isLogo ? "Logo" : "Signature"} uploaded successfully!`);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      if (isLogo) setLogoUploading(false);
      else setSigUploading(false);
    }
  };

  const triggerDownloadTest = async () => {
    const mockInvoice = {
      invoice_number: settings.invoice_test_number || "INV-TEST-2026",
      created_at: new Date().toISOString(),
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "paid",
      amount_inr: 4999.0,
      tax_inr: 899.82,
      total_inr: 5898.82,
      line_items: [{ name: "Premium SaaS Accelerator Program", quantity: 1, amount: 4999.0 }],
      payment_method: "UPI (Cashfree)",
      paid_at: new Date().toISOString(),
      cashfree_order_id: "CF_ORDER_9918231",
      notes: "This is a verification test invoice.",
      terms: settings.invoice_terms,
    };

    try {
      await downloadInvoicePdf(mockInvoice, "student@example.com", {
        company_name: settings.invoice_company_name,
        legal_name: settings.invoice_legal_name,
        gstin: settings.invoice_gstin,
        prefix: settings.invoice_prefix,
        footer: settings.invoice_footer,
        logo_url: settings.invoice_logo_url,
        contact: settings.invoice_contact,
        address: settings.invoice_address,
        website: settings.invoice_website,
        primary_color: settings.invoice_primary_color,
        secondary_color: settings.invoice_secondary_color,
        template: settings.invoice_template,
        qr_enabled: settings.invoice_qr_enabled,
        watermark: settings.invoice_watermark,
        signature: settings.invoice_signature,
        terms: settings.invoice_terms,
        refund_policy: settings.invoice_refund_policy,
        title: settings.invoice_title,
        text_color: settings.invoice_text_color,
        band_text_color: settings.invoice_band_text_color,
      });
      toast.success("Test PDF download triggered!");
    } catch (err: any) {
      toast.error(err.message || "Failed to download test PDF");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Preview styling variables
  const primaryColor = settings.invoice_primary_color || "#4f46e5";
  const secondaryColor = settings.invoice_secondary_color || "#7c3aed";
  const templateStyle = settings.invoice_template || "modern";
  const qrEnabled = settings.invoice_qr_enabled === "true";
  const textColor = settings.invoice_text_color || "#1e293b";
  const bandTextColor = settings.invoice_band_text_color || "#ffffff";
  const invoiceTitle = settings.invoice_title || "TAX INVOICE";
  const invoiceTestNumber = settings.invoice_test_number || "INV-B91D4407";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Settings Form - Left Panel */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="border-border/60 shadow-md">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" /> Invoice Designer Settings
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Branding and compliance parameters for dynamic generation.
                </p>
              </div>
            </div>

            <Tabs defaultValue="company" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4 h-9">
                <TabsTrigger value="company" className="text-xs">
                  Company
                </TabsTrigger>
                <TabsTrigger value="design" className="text-xs">
                  Aesthetics
                </TabsTrigger>
                <TabsTrigger value="compliance" className="text-xs">
                  Policies
                </TabsTrigger>
              </TabsList>

              {/* Company Info tab */}
              <TabsContent value="company" className="space-y-4">
                <div className="space-y-2">
                  <Label>Company Brand Name</Label>
                  <Input
                    value={settings.invoice_company_name}
                    onChange={(e) => handleChange("invoice_company_name", e.target.value)}
                    placeholder="e.g. Learnify AI"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Legal Business Name</Label>
                  <Input
                    value={settings.invoice_legal_name}
                    onChange={(e) => handleChange("invoice_legal_name", e.target.value)}
                    placeholder="e.g. Learnify EdTech Pvt. Ltd."
                  />
                </div>
                <div className="space-y-2">
                  <Label>GSTIN (Tax Registration)</Label>
                  <Input
                    value={settings.invoice_gstin}
                    onChange={(e) => handleChange("invoice_gstin", e.target.value)}
                    placeholder="e.g. 29XXXXX1234X1Z5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Address</Label>
                  <Textarea
                    value={settings.invoice_address}
                    onChange={(e) => handleChange("invoice_address", e.target.value)}
                    placeholder="Street, City, State, Pin Code"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Support Contact Info (Email / Phone)</Label>
                  <Input
                    value={settings.invoice_contact}
                    onChange={(e) => handleChange("invoice_contact", e.target.value)}
                    placeholder="support@learnifyai.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Website URL</Label>
                  <Input
                    value={settings.invoice_website}
                    onChange={(e) => handleChange("invoice_website", e.target.value)}
                    placeholder="https://learnifyai.com"
                  />
                </div>
              </TabsContent>

              {/* Aesthetics Design tab */}
              <TabsContent value="design" className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Template Layout Style</Label>
                  <Select
                    value={templateStyle}
                    onValueChange={(val) => handleChange("invoice_template", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern Layout (Solid Bands)</SelectItem>
                      <SelectItem value="minimal">Minimalist Layout (Clean Lines)</SelectItem>
                      <SelectItem value="corporate">Corporate Layout (Structured)</SelectItem>
                      <SelectItem value="luxury">Luxury Layout (Navy & Gold Accent)</SelectItem>
                      <SelectItem value="dark">Dark Mode Layout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: primaryColor }}
                      />
                      Primary Theme Color
                    </Label>
                    <Input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => handleChange("invoice_primary_color", e.target.value)}
                      className="h-10 p-1 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: secondaryColor }}
                      />
                      Secondary Color
                    </Label>
                    <Input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => handleChange("invoice_secondary_color", e.target.value)}
                      className="h-10 p-1 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: textColor }}
                      />
                      Body Text Color
                    </Label>
                    <Input
                      type="color"
                      value={textColor}
                      onChange={(e) => handleChange("invoice_text_color", e.target.value)}
                      className="h-10 p-1 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: bandTextColor }}
                      />
                      Header Band Text
                    </Label>
                    <Input
                      type="color"
                      value={bandTextColor}
                      onChange={(e) => handleChange("invoice_band_text_color", e.target.value)}
                      className="h-10 p-1 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Watermark Label (e.g. PAID)</Label>
                  <Input
                    value={settings.invoice_watermark}
                    onChange={(e) => handleChange("invoice_watermark", e.target.value)}
                    placeholder="PAID"
                  />
                </div>

                <div className="space-y-2 border-t pt-3">
                  <Label>Company Logo Image</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      value={settings.invoice_logo_url}
                      onChange={(e) => handleChange("invoice_logo_url", e.target.value)}
                      placeholder="/logo.png"
                      className="flex-1"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="invoice-logo-uploader"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(file, "logo");
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={logoUploading}
                      onClick={() => document.getElementById("invoice-logo-uploader")?.click()}
                    >
                      {logoUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Authorized Digital Signature Image</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      value={settings.invoice_signature}
                      onChange={(e) => handleChange("invoice_signature", e.target.value)}
                      placeholder="Paste Signature Image URL"
                      className="flex-1"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="invoice-sig-uploader"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(file, "signature");
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={sigUploading}
                      onClick={() => document.getElementById("invoice-sig-uploader")?.click()}
                    >
                      {sigUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Policies tab */}
              <TabsContent value="compliance" className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="space-y-0.5">
                    <Label className="cursor-pointer">QR Verification Link</Label>
                    <p className="text-[10px] text-muted-foreground">
                      Draws a verification QR code leading to verify page.
                    </p>
                  </div>
                  <Switch
                    checked={qrEnabled}
                    onCheckedChange={(checked) =>
                      handleChange("invoice_qr_enabled", checked ? "true" : "false")
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Invoice Number Prefix</Label>
                  <Input
                    value={settings.invoice_prefix}
                    onChange={(e) => handleChange("invoice_prefix", e.target.value)}
                    placeholder="INV"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Invoice Title (Header Label)</Label>
                    <Input
                      value={settings.invoice_title}
                      onChange={(e) => handleChange("invoice_title", e.target.value)}
                      placeholder="TAX INVOICE"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Test Invoice Number</Label>
                    <Input
                      value={settings.invoice_test_number}
                      onChange={(e) => handleChange("invoice_test_number", e.target.value)}
                      placeholder="INV-B91D4407"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Terms & Conditions</Label>
                  <Textarea
                    value={settings.invoice_terms}
                    onChange={(e) => handleChange("invoice_terms", e.target.value)}
                    placeholder="1. Paid fees are non-refundable..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Refund Policy</Label>
                  <Textarea
                    value={settings.invoice_refund_policy}
                    onChange={(e) => handleChange("invoice_refund_policy", e.target.value)}
                    placeholder="Refund rules..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Footer Note</Label>
                  <Input
                    value={settings.invoice_footer}
                    onChange={(e) => handleChange("invoice_footer", e.target.value)}
                    placeholder="This is a computer generated invoice..."
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-4 border-t">
              <Button className="flex-1" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Settings
              </Button>
              <Button variant="outline" onClick={triggerDownloadTest}>
                <Printer className="h-4 w-4 mr-2" /> Test PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Preview Panel - Right Panel */}
      <div className="lg:col-span-7">
        <div className="sticky top-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-1.5">
              <FileText className="h-4 w-4" /> Live Invoice Canvas Preview (
              {templateStyle.toUpperCase()})
            </h4>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
            >
              PAID Live Render
            </Badge>
          </div>

          <div
            className={`w-full border rounded-2xl p-8 shadow-2xl transition-all duration-300 font-sans aspect-[1/1.4] overflow-hidden relative ${
              templateStyle === "dark"
                ? "bg-slate-900 text-slate-100 border-slate-700"
                : templateStyle === "luxury"
                  ? "bg-[#faf9f6] border-[#d4af37]/60"
                  : "bg-white border-border/80"
            }`}
            style={{ color: templateStyle === "dark" ? undefined : textColor }}
          >
            {/* Watermark Label */}
            {settings.invoice_watermark && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
                style={{ opacity: 0.05 }}
              >
                <span className="text-[120px] font-black tracking-widest text-emerald-500 rotate-12">
                  {settings.invoice_watermark.toUpperCase()}
                </span>
              </div>
            )}

            {/* Template Header Layout */}
            {templateStyle === "minimal" ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b-2 pb-4" style={{ borderColor: textColor }}>
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                      {settings.invoice_company_name}
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">
                      {settings.invoice_legal_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-lg font-bold">{invoiceTitle}</h2>
                    <p className="text-xs font-mono text-muted-foreground">#{invoiceTestNumber}</p>
                  </div>
                </div>
              </div>
            ) : templateStyle === "luxury" ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#d4af37] pb-4">
                  <div className="flex items-center gap-3">
                    {settings.invoice_logo_url && (
                      <img
                        src={settings.invoice_logo_url}
                        alt="Logo"
                        className="w-12 h-12 object-contain"
                      />
                    )}
                    <div>
                      <h1 className="text-xl font-bold tracking-widest text-[#0f1b3d] font-serif">
                        {settings.invoice_company_name.toUpperCase()}
                      </h1>
                      <p className="text-[10px] text-muted-foreground">
                        {settings.invoice_legal_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs tracking-widest border border-[#d4af37] px-3 py-1 rounded text-[#d4af37] font-semibold bg-[#0f1b3d]/5">
                      {invoiceTitle}
                    </span>
                    <p className="text-xs font-mono mt-2">#{invoiceTestNumber}</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Default/Modern/Dark layout bands */
              <div
                className="p-6 -mx-8 -mt-8 flex justify-between items-center relative overflow-hidden"
                style={{
                  backgroundColor: templateStyle === "dark" ? "#1e293b" : primaryColor,
                  color: templateStyle === "dark" ? "#ffffff" : bandTextColor,
                }}
              >
                <div className="flex items-center gap-3 z-10">
                  {settings.invoice_logo_url && (
                    <img
                      src={settings.invoice_logo_url}
                      alt="Logo"
                      className="w-12 h-12 bg-white/10 rounded p-1 object-contain"
                    />
                  )}
                  <div>
                    <h1 className="text-xl font-bold">{settings.invoice_company_name}</h1>
                    <p
                      className="text-[10px]"
                      style={{ opacity: 0.7 }}
                    >
                      {settings.invoice_legal_name}
                    </p>
                  </div>
                </div>
                <div className="text-right z-10">
                  <h2 className="text-lg font-bold tracking-wider">{invoiceTitle}</h2>
                  <p className="text-xs font-mono" style={{ opacity: 0.8 }}>
                    #{invoiceTestNumber}
                  </p>
                </div>
                {/* Accent band */}
                <div
                  className="absolute right-0 top-0 bottom-0 w-8 opacity-25"
                  style={{ backgroundColor: secondaryColor }}
                />
              </div>
            )}

            {/* Invoice Info block */}
            <div className="grid grid-cols-3 gap-4 mt-6 text-[10px] border-b pb-4">
              <div>
                <span className="text-muted-foreground uppercase block font-semibold">
                  Invoice Date
                </span>
                <strong className="text-xs block mt-0.5">12 Jul 2026</strong>
              </div>
              <div>
                <span className="text-muted-foreground uppercase block font-semibold">
                  Payment Status
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 mt-0.5">
                  {settings.invoice_watermark || "PAID"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground uppercase block font-semibold">
                  Place of Supply
                </span>
                <strong className="text-xs block mt-0.5">Karnataka (Code: 29)</strong>
              </div>
            </div>

            {/* Bill Info grid */}
            <div className="grid grid-cols-2 gap-6 mt-5 text-[11px]">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground tracking-wider uppercase block">
                  From
                </span>
                <strong className="block text-xs">{settings.invoice_company_name}</strong>
                <p className="text-[10px] text-muted-foreground leading-relaxed whitespace-pre-line">
                  {settings.invoice_address || "Innovation Hub, Bangalore, India"}
                </p>
                <span className="text-[10px] text-muted-foreground block mt-1">
                  GSTIN: <strong>{settings.invoice_gstin}</strong>
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Support: {settings.invoice_contact || "support@learnifyai.in"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground tracking-wider uppercase block">
                  Bill To
                </span>
                <strong className="block text-xs">Alex Rivera</strong>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  alex.rivera@example.com · +91 99182 31234
                  <br />
                  H.No. 405, Sector 4, HSR Layout, Bangalore, Karnataka, 560102
                </p>
                <span className="text-[10px] text-muted-foreground block mt-1">
                  Place of Supply: State Code 29 (KA)
                </span>
              </div>
            </div>

            {/* Items Table */}
            <div className="mt-6">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr
                    className="border-b text-[9px] font-bold text-muted-foreground uppercase tracking-wider"
                    style={{ borderBottomColor: primaryColor }}
                  >
                    <th className="py-2">Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Rate</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-3 font-medium">
                      Premium SaaS Accelerator Program (Course Access)
                    </td>
                    <td className="py-3 text-center text-muted-foreground">1</td>
                    <td className="py-3 text-right">₹4,999.00</td>
                    <td className="py-3 text-right">₹4,999.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total breakdown block */}
            <div className="mt-4 flex justify-between items-start text-[11px] border-t pt-4">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground tracking-wider uppercase block">
                  Payment Details
                </span>
                <p className="text-[10px] text-muted-foreground">
                  Gateway: <strong>Cashfree Payments</strong>
                  <br />
                  Transaction ID: <strong>TXN_CF_881923</strong>
                  <br />
                  Method: <strong>UPI (GPay)</strong>
                </p>
              </div>

              <div className="w-48 text-right space-y-1.5">
                <div className="flex justify-between text-muted-foreground text-[10px]">
                  <span>Subtotal:</span>
                  <span>₹4,999.00</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-[10px]">
                  <span>CGST @ 9%:</span>
                  <span>₹449.91</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-[10px]">
                  <span>SGST @ 9%:</span>
                  <span>₹449.91</span>
                </div>
                <div
                  className="flex justify-between font-bold text-xs p-2 rounded mt-1 text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span>TOTAL PAID:</span>
                  <span>₹5,898.82</span>
                </div>
              </div>
            </div>

            {/* Footer QR, Signature, Policies */}
            <div className="absolute bottom-10 inset-x-8 grid grid-cols-2 gap-4 items-end text-[10px] border-t pt-4">
              <div>
                {qrEnabled ? (
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-16 border rounded p-1 bg-white flex items-center justify-center shrink-0">
                      <QrCode className="w-full h-full text-slate-800" />
                    </div>
                    <div>
                      <strong className="block text-[8px] uppercase tracking-wider text-muted-foreground">
                        Scan to Verify
                      </strong>
                      <span className="text-[8px] text-muted-foreground block leading-tight mt-0.5">
                        Secured & tamper-proof validation on learnifyai.com.
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-[8px] text-muted-foreground italic">
                    QR Verification is disabled.
                  </span>
                )}
              </div>

              <div className="text-right space-y-1">
                {settings.invoice_signature ? (
                  <div className="h-10 flex justify-end">
                    <img
                      src={settings.invoice_signature}
                      alt="Signature"
                      className="h-full object-contain max-w-[120px]"
                    />
                  </div>
                ) : (
                  <div className="h-10 flex items-center justify-end">
                    <span className="text-[8px] text-muted-foreground italic border-b border-dashed">
                      Digitally Signed
                    </span>
                  </div>
                )}
                <span className="text-[9px] font-bold text-muted-foreground block">
                  Authorized Signatory
                </span>
              </div>
            </div>

            {/* Bottom Brand Ribbon */}
            <div
              className="absolute bottom-0 left-0 right-0 h-2"
              style={{ backgroundColor: primaryColor }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
