import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Palette, Image, Type, QrCode } from "lucide-react";

const CATEGORIES = [
  "Professional",
  "Achievement",
  "Academic",
  "Technology",
  "Executive",
  "Certification",
];
const PRESET_THEMES = [
  {
    name: "Navy & Gold",
    primary: "#0a1628",
    accent: "#c9a84c",
    background: "#f5f0e8",
    text: "#1a2744",
  },
  {
    name: "Purple & Gold",
    primary: "#2d1b69",
    accent: "#c9a84c",
    background: "#f5f0e8",
    text: "#2d1b69",
  },
  {
    name: "Teal & Gold",
    primary: "#0d5c5c",
    accent: "#c9a84c",
    background: "#f5f0e8",
    text: "#0d5c5c",
  },
  {
    name: "Classic Navy",
    primary: "#1a2744",
    accent: "#c9a84c",
    background: "#ffffff",
    text: "#1a2744",
  },
  {
    name: "Emerald",
    primary: "#065f46",
    accent: "#c9a84c",
    background: "#f0fdf4",
    text: "#065f46",
  },
  { name: "Rose", primary: "#881337", accent: "#c9a84c", background: "#fff1f2", text: "#881337" },
];

const FIELD_GROUPS: {
  label: string;
  icon: React.ReactNode;
  fields: { key: string; label: string; type: string }[];
}[] = [
  {
    label: "Top",
    icon: <Type className="h-3 w-3" />,
    fields: [
      { key: "learnifyLogo", label: "Logo", type: "image" },
      { key: "certIdLabel", label: "Cert ID Label", type: "text" },
      { key: "certId", label: "Cert ID", type: "text" },
    ],
  },
  {
    label: "Title",
    icon: <Type className="h-3 w-3" />,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "text" },
    ],
  },
  {
    label: "Student",
    icon: <Type className="h-3 w-3" />,
    fields: [
      { key: "certifyText", label: "Certify Text", type: "text" },
      { key: "studentName", label: "Student Name", type: "text" },
    ],
  },
  {
    label: "Course",
    icon: <Type className="h-3 w-3" />,
    fields: [
      { key: "completeText", label: "Complete Text", type: "text" },
      { key: "courseName", label: "Course Name", type: "text" },
      { key: "description", label: "Description", type: "text" },
    ],
  },
  {
    label: "Signature",
    icon: <Type className="h-3 w-3" />,
    fields: [
      { key: "signatureImage", label: "Signature Image", type: "image" },
      { key: "signatureName", label: "Signature Name", type: "text" },
      { key: "signatureTitle", label: "Signature Title", type: "text" },
      { key: "signatureRole", label: "Signature Role", type: "text" },
    ],
  },
  {
    label: "Bottom",
    icon: <Type className="h-3 w-3" />,
    fields: [
      { key: "centerLogo", label: "Center Logo", type: "image" },
      { key: "date", label: "Date", type: "text" },
      { key: "dateLabel", label: "Date Label", type: "text" },
    ],
  },
  {
    label: "QR",
    icon: <QrCode className="h-3 w-3" />,
    fields: [
      { key: "qrCode", label: "QR Code", type: "qr" },
      { key: "verifyLabel", label: "Verify Label", type: "text" },
    ],
  },
  {
    label: "Badges",
    icon: <Type className="h-3 w-3" />,
    fields: [
      { key: "badgeAi", label: "Badge: AI-Powered", type: "text" },
      { key: "badgeIndustry", label: "Badge: Industry", type: "text" },
      { key: "badgeCareer", label: "Badge: Career", type: "text" },
      { key: "badgeAccess", label: "Badge: Access", type: "text" },
    ],
  },
];

type CanvaTemplate = {
  id: string;
  name: string;
  category: string;
  bg_image_url: string;
  thumbnail_url: string | null;
  fields_json: Record<string, any>;
  theme_colors: Record<string, string>;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

type Props = {
  template: CanvaTemplate;
  onSave: (tpl: CanvaTemplate) => void;
  onClose: () => void;
};

export function CertDesignerEditor({ template, onSave, onClose }: Props) {
  const [name, setName] = useState(template.name);
  const [category, setCategory] = useState(template.category);
  const [fieldsJson, setFieldsJson] = useState<Record<string, any>>({ ...template.fields_json });
  const [themeColors, setThemeColors] = useState<Record<string, string>>({
    ...template.theme_colors,
  });
  const [activeGroup, setActiveGroup] = useState("Top");
  const [activeTab, setActiveTab] = useState("fields");
  const [saving, setSaving] = useState(false);

  const updateField = (fieldKey: string, prop: string, value: any) => {
    setFieldsJson((prev) => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey], [prop]: value },
    }));
  };

  const updateTheme = (prop: string, value: string) => {
    setThemeColors((prev) => ({ ...prev, [prop]: value }));
  };

  const applyPreset = (preset: (typeof PRESET_THEMES)[0]) => {
    setThemeColors({ ...preset });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        ...template,
        name,
        category,
        fields_json: fieldsJson,
        theme_colors: themeColors,
      });
    } finally {
      setSaving(false);
    }
  };

  const renderFieldEditor = (key: string, label: string, fieldType: string) => {
    const field = fieldsJson[key] || {};
    const isText = fieldType === "text";
    const isImage = fieldType === "image" || fieldType === "qr";

    return (
      <div key={key} className="border rounded-lg p-3 space-y-2 mb-2">
        <div className="flex items-center gap-2">
          {fieldType === "image" ? (
            <Image className="h-3 w-3 text-muted-foreground" />
          ) : fieldType === "qr" ? (
            <QrCode className="h-3 w-3 text-muted-foreground" />
          ) : (
            <Type className="h-3 w-3 text-muted-foreground" />
          )}
          <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
          {field.type && (
            <span className="text-[10px] text-muted-foreground ml-auto">type: {field.type}</span>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div>
            <Label className="text-[10px] text-muted-foreground">X%</Label>
            <Input
              type="number"
              value={field.x ?? 50}
              onChange={(e) => updateField(key, "x", Number(e.target.value))}
              className="h-7 text-xs"
              min={0}
              max={100}
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">Y%</Label>
            <Input
              type="number"
              value={field.y ?? 50}
              onChange={(e) => updateField(key, "y", Number(e.target.value))}
              className="h-7 text-xs"
              min={0}
              max={100}
            />
          </div>
          {(field.width != null) !== undefined && (
            <div>
              <Label className="text-[10px] text-muted-foreground">W</Label>
              <Input
                type="number"
                value={field.width ?? 100}
                onChange={(e) => updateField(key, "width", Number(e.target.value))}
                className="h-7 text-xs"
                min={10}
                max={500}
              />
            </div>
          )}
          {(field.height != null) !== undefined && (
            <div>
              <Label className="text-[10px] text-muted-foreground">H</Label>
              <Input
                type="number"
                value={field.height ?? 100}
                onChange={(e) => updateField(key, "height", Number(e.target.value))}
                className="h-7 text-xs"
                min={10}
                max={500}
              />
            </div>
          )}
          {field.width == null && field.height == null && <div />}
          {field.width == null && field.height == null && <div />}
        </div>

        {(isImage || fieldType === "qr") && (field.width == null || field.height == null) && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-muted-foreground">Width</Label>
              <Input
                type="number"
                value={field.width ?? 100}
                onChange={(e) => updateField(key, "width", Number(e.target.value))}
                className="h-7 text-xs"
                min={10}
                max={500}
              />
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground">Height</Label>
              <Input
                type="number"
                value={field.height ?? 100}
                onChange={(e) => updateField(key, "height", Number(e.target.value))}
                className="h-7 text-xs"
                min={10}
                max={500}
              />
            </div>
          </div>
        )}

        {isText && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] text-muted-foreground">Font Size</Label>
                <Input
                  type="number"
                  value={field.fontSize ?? 14}
                  onChange={(e) => updateField(key, "fontSize", Number(e.target.value))}
                  className="h-7 text-xs"
                  min={6}
                  max={72}
                />
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <Label className="text-[10px] text-muted-foreground">Color</Label>
                  <Input
                    type="color"
                    value={field.color ?? "#000000"}
                    onChange={(e) => updateField(key, "color", e.target.value)}
                    className="h-7 w-10 p-0.5"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-[10px] text-muted-foreground">Weight</Label>
                  <Select
                    value={field.fontWeight ?? "normal"}
                    onValueChange={(v) => updateField(key, "fontWeight", v)}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="500">Medium</SelectItem>
                      <SelectItem value="600">Semi Bold</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] text-muted-foreground">Font</Label>
                <Select
                  value={field.fontFamily ?? "Georgia"}
                  onValueChange={(v) => updateField(key, "fontFamily", v)}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Great Vibes, cursive">Great Vibes</SelectItem>
                    <SelectItem value="Playfair Display, Georgia, serif">
                      Playfair Display
                    </SelectItem>
                    <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                    <SelectItem value="monospace">Monospace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Align</Label>
                <Select
                  value={field.align ?? "center"}
                  onValueChange={(v) => updateField(key, "align", v)}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground">Content</Label>
              <Input
                value={field.text ?? field.variable ?? ""}
                onChange={(e) =>
                  updateField(key, field.variable ? "variable" : "text", e.target.value)
                }
                className="h-7 text-xs"
                placeholder={field.variable ? "{{variable}}" : "Static text"}
              />
            </div>
          </>
        )}

        {isImage && fieldType === "image" && (
          <div>
            <Label className="text-[10px] text-muted-foreground">Image URL</Label>
            <Input
              value={field.src ?? ""}
              onChange={(e) => updateField(key, "src", e.target.value)}
              className="h-7 text-xs"
              placeholder="/path/to/image.png"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Template: {name}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
          </TabsList>

          <TabsContent value="fields" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Template Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 border-b pb-2 overflow-x-auto">
              {FIELD_GROUPS.map((g) => (
                <button
                  key={g.label}
                  onClick={() => setActiveGroup(g.label)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${activeGroup === g.label ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                >
                  {g.icon}
                  {g.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {FIELD_GROUPS.find((g) => g.label === activeGroup)?.fields.map((f) =>
                renderFieldEditor(f.key, f.label, f.type),
              )}
            </div>
          </TabsContent>

          <TabsContent value="theme" className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-2">
              {PRESET_THEMES.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="flex items-center gap-2 p-2 rounded-lg border hover:border-primary transition-colors text-left"
                >
                  <div className="flex gap-1">
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <span className="text-xs font-medium">{preset.name}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {Object.entries(themeColors).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <Label className="text-xs w-20 capitalize">{key}</Label>
                  <Input
                    type="color"
                    value={value}
                    onChange={(e) => updateTheme(key, e.target.value)}
                    className="h-8 w-10 p-0.5"
                  />
                  <Input
                    value={value}
                    onChange={(e) => updateTheme(key, e.target.value)}
                    className="h-8 text-xs flex-1"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !name.trim()}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" /> Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
