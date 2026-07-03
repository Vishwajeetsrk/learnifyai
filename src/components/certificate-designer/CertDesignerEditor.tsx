import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Palette } from "lucide-react";

const CATEGORIES = ["Professional", "Achievement", "Academic", "Technology", "Executive", "Certification"];
const PRESET_THEMES = [
  { name: "Navy & Gold", primary: "#0a1628", accent: "#c9a84c", background: "#f5f0e8", text: "#1a2744" },
  { name: "Purple & Gold", primary: "#2d1b69", accent: "#c9a84c", background: "#f5f0e8", text: "#2d1b69" },
  { name: "Teal & Gold", primary: "#0d5c5c", accent: "#c9a84c", background: "#f5f0e8", text: "#0d5c5c" },
  { name: "Classic Navy", primary: "#1a2744", accent: "#c9a84c", background: "#ffffff", text: "#1a2744" },
  { name: "Emerald", primary: "#065f46", accent: "#c9a84c", background: "#f0fdf4", text: "#065f46" },
  { name: "Rose", primary: "#881337", accent: "#c9a84c", background: "#fff1f2", text: "#881337" },
];

const FIELD_LABELS: Record<string, string> = {
  studentName: "Student Name",
  courseName: "Course Name",
  description: "Description",
  date: "Date",
  signatureName: "Signature Name",
  signatureTitle: "Signature Title",
  certId: "Certificate ID",
  badgeText: "Badge Text",
};

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
  const [themeColors, setThemeColors] = useState<Record<string, string>>({ ...template.theme_colors });
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

  const applyPreset = (preset: typeof PRESET_THEMES[0]) => {
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
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Field Positions (%)</Label>
              <p className="text-xs text-muted-foreground">
                Position fields as percentage of certificate width/height. 
                X=50 means center, Y=0 means top.
              </p>
              {Object.entries(FIELD_LABELS).map(([key, label]) => {
                const field = fieldsJson[key] || {};
                return (
                  <div key={key} className="grid grid-cols-6 gap-2 items-center text-xs">
                    <span className="col-span-1 font-medium truncate" title={label}>{label}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground w-3">X</span>
                      <Input
                        type="number"
                        value={field.x ?? 50}
                        onChange={(e) => updateField(key, "x", Number(e.target.value))}
                        className="h-7 text-xs"
                        min={0}
                        max={100}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground w-3">Y</span>
                      <Input
                        type="number"
                        value={field.y ?? 50}
                        onChange={(e) => updateField(key, "y", Number(e.target.value))}
                        className="h-7 text-xs"
                        min={0}
                        max={100}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground w-6">Size</span>
                      <Input
                        type="number"
                        value={field.fontSize ?? 14}
                        onChange={(e) => updateField(key, "fontSize", Number(e.target.value))}
                        className="h-7 text-xs"
                        min={6}
                        max={72}
                      />
                    </div>
                    <Input
                      type="color"
                      value={field.color ?? "#000000"}
                      onChange={(e) => updateField(key, "color", e.target.value)}
                      className="h-7 w-10 p-0.5"
                    />
                    <Select
                      value={field.fontFamily ?? "Georgia"}
                      onValueChange={(v) => updateField(key, "fontFamily", v)}
                    >
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Great Vibes">Great Vibes</SelectItem>
                        <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="monospace">Monospace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
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
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: preset.primary }} />
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: preset.accent }} />
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
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !name.trim()}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" /> Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
