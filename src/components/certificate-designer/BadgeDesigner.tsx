/**
 * BadgeDesigner.tsx
 * Admin UI for managing Open Badges and achievement credentials.
 * Learnify AI Certificate Studio 2.0
 */
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Check,
  Shield,
  Star,
  Trophy,
  Crown,
  Zap,
  Target,
  Brain,
  Code2,
  CheckCircle,
  RefreshCw,
  Sliders,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AwardBadge, type BadgeShape } from "@/components/ui/AwardBadge";
import {
  CRITERIA_DEFINITIONS,
  CRITERIA_PRESETS,
  getCriteriaLabel,
} from "./BadgeCriteriaEngine";
import type { BadgeCriteria, BadgeCriteriaType, BadgeDefinition } from "./types";
import {
  listBadgeDefinitions,
  saveBadgeDefinition,
  deleteBadgeDefinition,
  seedDefaultBadges,
} from "@/lib/badge.functions";

const COLOR_PRESETS = [
  { name: "Indigo Sapphire", primary: "#4f46e5", accent: "#a5b4fc" },
  { name: "Emerald Jade", primary: "#059669", accent: "#6ee7b7" },
  { name: "Amber Gold", primary: "#d97706", accent: "#fcd34d" },
  { name: "Cyber Violet", primary: "#7c3aed", accent: "#c4b5fd" },
  { name: "Rose Ruby", primary: "#e11d48", accent: "#fda4af" },
  { name: "Cyan Horizon", primary: "#0891b2", accent: "#67e8f9" },
  { name: "Obsidian Titanium", primary: "#1f2937", accent: "#9ca3af" },
];

const AVAILABLE_ICONS = [
  { name: "Award", icon: Award },
  { name: "Trophy", icon: Trophy },
  { name: "Star", icon: Star },
  { name: "Crown", icon: Crown },
  { name: "Zap", icon: Zap },
  { name: "Shield", icon: Shield },
  { name: "Target", icon: Target },
  { name: "Brain", icon: Brain },
  { name: "Code2", icon: Code2 },
  { name: "CheckCircle", icon: CheckCircle },
];

const SHAPES: BadgeShape[] = ["circle", "shield", "medal", "ribbon", "seal", "pill", "hexagon"];

export function BadgeDesigner() {
  const queryClient = useQueryClient();
  const getBadgesFn = useServerFn(listBadgeDefinitions);
  const saveBadgeFn = useServerFn(saveBadgeDefinition);
  const deleteBadgeFn = useServerFn(deleteBadgeDefinition);
  const seedBadgesFn = useServerFn(seedDefaultBadges);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Achievement");
  const [iconName, setIconName] = useState("Award");
  const [shape, setShape] = useState<BadgeShape>("circle");
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [accentColor, setAccentColor] = useState("#a5b4fc");
  const [textColor, setTextColor] = useState("#ffffff");
  const [criteria, setCriteria] = useState<BadgeCriteria[]>([{ type: "course_completed" }]);
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const { data: badges = [], isLoading } = useQuery({
    queryKey: ["badge-definitions"],
    queryFn: async () => {
      const res = await getBadgesFn();
      return (res ?? []) as any[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      return await saveBadgeFn({ data: payload });
    },
    onSuccess: () => {
      toast.success(editingId ? "Badge updated successfully!" : "Badge created successfully!");
      queryClient.invalidateQueries({ queryKey: ["badge-definitions"] });
      setModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save badge");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteBadgeFn({ data: { id } });
    },
    onSuccess: () => {
      toast.success("Badge definition removed");
      queryClient.invalidateQueries({ queryKey: ["badge-definitions"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete badge");
    },
  });

  const seedMutation = useMutation({
    mutationFn: async () => {
      return await seedBadgesFn();
    },
    onSuccess: (data: any) => {
      toast.success(data?.message || "Default badges seeded!");
      queryClient.invalidateQueries({ queryKey: ["badge-definitions"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to seed default badges");
    },
  });

  function resetForm() {
    setEditingId(null);
    setName("");
    setDescription("");
    setCategory("Achievement");
    setIconName("Award");
    setShape("circle");
    setPrimaryColor("#4f46e5");
    setAccentColor("#a5b4fc");
    setTextColor("#ffffff");
    setCriteria([{ type: "course_completed" }]);
    setStatus("active");
  }

  function handleOpenCreate() {
    resetForm();
    setModalOpen(true);
  }

  function handleOpenEdit(b: any) {
    setEditingId(b.id);
    setName(b.name || "");
    setDescription(b.description || "");
    setCategory(b.category || "Achievement");
    setIconName(b.icon_name || "Award");
    setShape((b.shape as BadgeShape) || "circle");
    setPrimaryColor(b.primary_color || "#4f46e5");
    setAccentColor(b.accent_color || "#a5b4fc");
    setTextColor(b.text_color || "#ffffff");
    setCriteria(b.criteria || [{ type: "course_completed" }]);
    setStatus(b.status || "active");
    setModalOpen(true);
  }

  function handleApplyPreset(preset: typeof CRITERIA_PRESETS[0]) {
    setName(preset.name);
    setCategory(preset.category);
    setIconName(preset.iconName);
    setPrimaryColor(preset.primaryColor);
    setAccentColor(preset.accentColor);
    setCriteria(preset.criteria);
  }

  function handleAddCriterion(type: BadgeCriteriaType) {
    const def = CRITERIA_DEFINITIONS[type];
    setCriteria((prev) => [
      ...prev,
      {
        type,
        threshold: def.defaultThreshold,
      },
    ]);
  }

  function handleRemoveCriterion(index: number) {
    setCriteria((prev) => prev.filter((_, i) => i !== index));
  }

  function handleThresholdChange(index: number, val: number) {
    setCriteria((prev) =>
      prev.map((c, i) => (i === index ? { ...c, threshold: val } : c))
    );
  }

  function handleSave() {
    if (!name.trim()) {
      toast.error("Please enter a badge name");
      return;
    }
    saveMutation.mutate({
      ...(editingId ? { id: editingId } : {}),
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      icon_name: iconName,
      shape,
      primary_color: primaryColor,
      accent_color: accentColor,
      text_color: textColor,
      criteria,
      status,
    });
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-display tracking-tight text-foreground">
              Badge & Credential Studio
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Design verifiable achievement badges awarded automatically on course completion and milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {badges.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => seedMutation.mutate()}
              disabled={seedMutation.isPending}
              className="gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              {seedMutation.isPending ? "Seeding..." : "Seed Default Badges"}
            </Button>
          )}

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="gap-1.5 bg-primary text-primary-foreground shadow-sm hover:opacity-95"
          >
            <Plus className="w-4 h-4" />
            Create Badge
          </Button>
        </div>
      </div>

      {/* Badges Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl border border-border/50 bg-muted/20 animate-pulse"
            />
          ))}
        </div>
      ) : badges.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl border border-dashed border-border/70 bg-card/40">
          <Award className="w-12 h-12 mx-auto text-muted-foreground/60 mb-3" />
          <h3 className="text-lg font-semibold text-foreground">No badges created yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1 mb-5">
            Add custom achievement badges for high scores, fast completion, or special recognitions.
            <br />
            <span className="text-xs text-rose-500 font-medium mt-2 block">
              If you see a database error or nothing happens when you click Seed Default Badges, please ensure you've applied the <b>certificate_studio_2.sql</b> migration to your Supabase instance to create the <code>badge_definitions</code> table.
            </span>
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => seedMutation.mutate()}
              disabled={seedMutation.isPending}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Seed 5 Default Badges
            </Button>
            <Button onClick={handleOpenCreate} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Custom Badge
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map((b: any) => {
            const criteriaList: BadgeCriteria[] = b.criteria || [];
            return (
              <div
                key={b.id}
                className="group relative flex flex-col items-center p-5 rounded-xl border border-border/60 bg-card/70 hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                {/* Status Indicator */}
                <span
                  className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    b.status === "active"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {b.status || "active"}
                </span>

                {/* Badge Category Tag */}
                <span className="self-start text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-3">
                  {b.category || "Achievement"}
                </span>

                {/* Animated Badge Display */}
                <div className="py-2 my-auto flex justify-center w-full">
                  <AwardBadge
                    name={b.name}
                    title={b.name}
                    subtitle={b.category || "LEARNIFY AI"}
                    brandLogoUrl="https://www.learnifyai.in/assets/learnify-logo-Dbtnnfk3.png"
                    description={b.description}
                    iconName={b.icon_name}
                    shape={b.shape || "circle"}
                    primaryColor={b.primary_color || "#4f46e5"}
                    accentColor={b.accent_color || "#a5b4fc"}
                    textColor={b.text_color || "#ffffff"}
                    size={200}
                  />
                </div>

                {/* Badge Metadata */}
                <div className="w-full text-center mt-3 space-y-1">
                  <h4 className="font-bold text-foreground text-sm line-clamp-1">{b.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                    {b.description || "Earned upon meeting credential requirements."}
                  </p>
                </div>

                {/* Criteria Tags */}
                <div className="w-full mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-1 justify-center">
                  {criteriaList.slice(0, 2).map((c, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-muted/60 text-muted-foreground max-w-full truncate"
                      title={getCriteriaLabel(c)}
                    >
                      {getCriteriaLabel(c)}
                    </span>
                  ))}
                  {criteriaList.length > 2 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground">
                      +{criteriaList.length - 2} more
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="w-full flex items-center justify-end gap-1.5 mt-3 pt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => handleOpenEdit(b)}
                    title="Edit badge"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      if (confirm(`Delete badge "${b.name}"?`)) {
                        deleteMutation.mutate(b.id);
                      }
                    }}
                    title="Delete badge"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              {editingId ? "Edit Badge Definition" : "Create New Badge"}
            </DialogTitle>
            <DialogDescription>
              Configure the visual appearance, shape, icon, and automated award criteria.
            </DialogDescription>
          </DialogHeader>

          {/* Quick Presets (only on new) */}
          {!editingId && (
            <div className="space-y-2 pb-3 border-b border-border/60">
              <Label className="text-xs text-muted-foreground">Quick Presets</Label>
              <div className="flex flex-wrap gap-2">
                {CRITERIA_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="text-xs px-2.5 py-1 rounded-full border border-border/60 hover:border-primary/50 bg-background hover:bg-muted transition flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Left: Configuration Form */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="badge-name">Badge Name</Label>
                <Input
                  id="badge-name"
                  placeholder="e.g. Course Champion"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="badge-desc">Description</Label>
                <Textarea
                  id="badge-desc"
                  rows={2}
                  placeholder="Explain why the learner earns this badge..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Achievement"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Shape Picker */}
              <div className="space-y-1.5">
                <Label>Shape</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {SHAPES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setShape(s)}
                      className={`text-xs capitalize py-1.5 px-2 rounded border transition ${
                        shape === s
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border/60 hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Picker */}
              <div className="space-y-1.5">
                <Label>Icon</Label>
                <div className="grid grid-cols-5 gap-1.5">
                  {AVAILABLE_ICONS.map(({ name: iName, icon: IconComp }) => (
                    <button
                      key={iName}
                      type="button"
                      onClick={() => setIconName(iName)}
                      className={`flex flex-col items-center justify-center p-2 rounded border transition ${
                        iconName === iName
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/60 hover:bg-muted text-muted-foreground"
                      }`}
                      title={iName}
                    >
                      <IconComp className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <Label>Color Palette</Label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setPrimaryColor(p.primary);
                        setAccentColor(p.accent);
                      }}
                      className="w-6 h-6 rounded-full border border-border/40 hover:scale-110 transition shadow-xs flex items-center justify-center"
                      style={{ backgroundColor: p.primary }}
                      title={p.name}
                    >
                      {primaryColor === p.primary && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-border/50"
                    />
                    <span className="text-xs text-muted-foreground font-mono">
                      {primaryColor}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-border/50"
                    />
                    <span className="text-xs text-muted-foreground font-mono">
                      {accentColor}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Live Preview & Criteria */}
            <div className="space-y-4 flex flex-col">
              {/* Preview Box */}
              <div className="p-6 rounded-xl border border-border/60 bg-muted/20 flex flex-col items-center justify-center min-h-[220px]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-4">
                  Live Interactive Preview
                </span>
                <AwardBadge
                  name={name || "Preview Badge"}
                  title={name || "Preview Badge"}
                  subtitle={category || "LEARNIFY AI"}
                  brandLogoUrl="https://www.learnifyai.in/assets/learnify-logo-Dbtnnfk3.png"
                  description={description}
                  iconName={iconName}
                  shape={shape}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                  textColor={textColor}
                  size={240}
                />
                <p className="mt-3 text-xs font-semibold text-foreground">
                  {name || "Badge Title"}
                </p>
                <span className="text-[10px] text-muted-foreground">
                  Hover to preview 3D tilt & reflection
                </span>
              </div>

              {/* Award Criteria Rules */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">Award Criteria</Label>
                  <select
                    className="text-xs h-7 rounded border border-input bg-background px-2"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddCriterion(e.target.value as BadgeCriteriaType);
                        e.target.value = "";
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      + Add rule...
                    </option>
                    {Object.entries(CRITERIA_DEFINITIONS).map(([typeKey, def]) => (
                      <option key={typeKey} value={typeKey}>
                        {def.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {criteria.map((c, index) => {
                    const def = CRITERIA_DEFINITIONS[c.type];
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2 p-2 rounded-lg border border-border/50 bg-background/80 text-xs"
                      >
                        <div className="flex-1 space-y-1">
                          <p className="font-medium text-foreground">{def?.label || c.type}</p>
                          {def?.requiresThreshold && (
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                              <span>Threshold:</span>
                              <Input
                                type="number"
                                className="h-6 w-16 text-xs px-1.5 py-0"
                                value={c.threshold ?? def.defaultThreshold ?? 0}
                                onChange={(e) =>
                                  handleThresholdChange(index, Number(e.target.value))
                                }
                              />
                              {def.unit && <span>{def.unit}</span>}
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => handleRemoveCriterion(index)}
                          title="Remove rule"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 pt-3 border-t border-border/60">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={saveMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="gap-1.5"
            >
              {saveMutation.isPending ? "Saving..." : editingId ? "Update Badge" : "Create Badge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
