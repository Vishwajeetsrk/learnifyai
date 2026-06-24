import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  ExternalLink,
  GripVertical,
  Menu as MenuIcon,
  ChevronRight,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { wcmsListMenus, wcmsSaveMenus, wcmsDeleteMenuItem } from "@/lib/wcms.functions";

type MenuItem = {
  id?: string;
  menu_key: string;
  label: string;
  url: string | null;
  icon: string | null;
  parent_id: string | null;
  sort_order: number;
  visible: boolean;
  open_new_tab: boolean;
};

const MENU_KEYS = ["main", "footer", "sidebar", "mobile", "admin"];
const ICON_OPTIONS = [
  "Home",
  "BookOpen",
  "Code",
  "Users",
  "Award",
  "Trophy",
  "Map",
  "MessageSquare",
  "Bot",
  "Image",
  "Settings",
  "HelpCircle",
  "Mail",
  "Sparkles",
  "Zap",
  "Star",
  "Heart",
  "Globe",
  "Search",
];

export default function MenuManager() {
  const qc = useQueryClient();
  const listMenusFn = useServerFn(wcmsListMenus);
  const saveMenusFn = useServerFn(wcmsSaveMenus);

  const [menuKey, setMenuKey] = useState("main");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    label: "",
    url: "/",
    icon: null,
    parent_id: null,
    visible: true,
    open_new_tab: false,
  });
  const [saving, setSaving] = useState(false);

  const loadMenu = async (key: string) => {
    setMenuKey(key);
    setLoaded(false);
    try {
      const result = await listMenusFn({ data: { menuKey: key } });
      setItems(result as MenuItem[]);
    } catch (e: any) {
      toast.error(e?.message || "Load failed");
    }
    setLoaded(true);
  };

  useQuery({
    queryKey: ["wcms-menu", menuKey],
    queryFn: async () => {
      const result = await listMenusFn({ data: { menuKey } });
      setItems(result as MenuItem[]);
      setLoaded(true);
      return result;
    },
  });

  const addItem = () => {
    if (!newItem.label) return toast.error("Label required");
    setItems([
      ...items,
      {
        menu_key: menuKey,
        label: newItem.label ?? "",
        url: newItem.url ?? null,
        icon: newItem.icon ?? null,
        parent_id: newItem.parent_id ?? null,
        sort_order: items.length,
        visible: newItem.visible ?? true,
        open_new_tab: newItem.open_new_tab ?? false,
      },
    ]);
    setNewItem({
      label: "",
      url: "/",
      icon: null,
      parent_id: null,
      visible: true,
      open_new_tab: false,
    });
    setAddOpen(false);
  };

  const updateItem = (idx: number, updates: Partial<MenuItem>) => {
    setItems(items.map((item, i) => (i === idx ? { ...item, ...updates } : item)));
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const moveItem = (idx: number, dir: -1 | 1) => {
    const arr = [...items];
    const swap = idx + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    setItems(arr.map((item, i) => ({ ...item, sort_order: i })));
  };

  const saveMenu = async () => {
    setSaving(true);
    try {
      await saveMenusFn({ data: { menuKey, items } });
      toast.success("Menu saved");
      qc.invalidateQueries({ queryKey: ["wcms-menu", menuKey] });
    } catch (e: any) {
      toast.error(e?.message || "Save failed");
    }
    setSaving(false);
  };

  const rootItems = items.filter((i) => !i.parent_id);
  const childItems = (parentId: string) => items.filter((i) => i.parent_id === parentId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold font-display flex items-center gap-2">
            <MenuIcon className="h-5 w-5 text-primary" /> Menu / Navigation Manager
          </h2>
          <p className="text-sm text-muted-foreground">
            Edit navigation menus, footer links, and sidebar items.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Item
          </Button>
          <Button onClick={saveMenu} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Menu
          </Button>
        </div>
      </div>

      {/* Menu Key Selector */}
      <div className="flex gap-2">
        {MENU_KEYS.map((key) => (
          <Button
            key={key}
            size="sm"
            variant={menuKey === key ? "default" : "outline"}
            onClick={() => loadMenu(key)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Button>
        ))}
      </div>

      {/* Menu Items */}
      {!loaded ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-10 border border-dashed rounded-xl text-muted-foreground">
          <MenuIcon className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p>No menu items yet. Add your first navigation link.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {rootItems.map((item, idx) => {
            const children = childItems(items.indexOf(item).toString());
            const globalIdx = items.indexOf(item);
            return (
              <div key={globalIdx}>
                <div className="rounded-xl border bg-card p-3 flex items-center gap-3 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4"
                      onClick={() => moveItem(globalIdx, -1)}
                      disabled={idx === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4"
                      onClick={() => moveItem(globalIdx, 1)}
                      disabled={idx === rootItems.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm flex items-center gap-2">
                      {item.label}
                      {item.url && (
                        <span className="text-xs text-muted-foreground font-mono">{item.url}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.open_new_tab && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    )}
                    <Switch
                      checked={item.visible}
                      onCheckedChange={(v) => updateItem(globalIdx, { visible: v })}
                      className="scale-75"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(globalIdx)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {/* Children */}
                {children.length > 0 && (
                  <div className="ml-8 space-y-1 mt-1">
                    {children.map((child, cIdx) => {
                      const childGlobalIdx = items.indexOf(child);
                      return (
                        <div
                          key={childGlobalIdx}
                          className="rounded-lg border bg-muted/30 p-2 flex items-center gap-2"
                        >
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                          <div className="min-w-0 flex-1">
                            <span className="text-sm">{child.label}</span>
                            {child.url && (
                              <span className="text-xs text-muted-foreground ml-2 font-mono">
                                {child.url}
                              </span>
                            )}
                          </div>
                          <Switch
                            checked={child.visible}
                            onCheckedChange={(v) => updateItem(childGlobalIdx, { visible: v })}
                            className="scale-75"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeItem(childGlobalIdx)}
                            className="text-destructive hover:text-destructive h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Item Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
            <DialogDescription>Add a new link to the {menuKey} menu.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={newItem.label ?? ""}
                onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                placeholder="Features"
              />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={newItem.url ?? ""}
                onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                placeholder="/features"
              />
            </div>
            <div className="space-y-2">
              <Label>Icon (optional)</Label>
              <Select
                value={newItem.icon ?? "__none__"}
                onValueChange={(v) => setNewItem({ ...newItem, icon: v === "__none__" ? null : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">No icon</SelectItem>
                  {ICON_OPTIONS.map((ic) => (
                    <SelectItem key={ic} value={ic}>
                      {ic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {items.length > 0 && (
              <div className="space-y-2">
                <Label>Parent Item (optional — for dropdowns)</Label>
                <Select
                  value={newItem.parent_id ?? "__root__"}
                  onValueChange={(v) =>
                    setNewItem({ ...newItem, parent_id: v === "__root__" ? null : v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Root level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__root__">Root level (no parent)</SelectItem>
                    {items.map((item, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={newItem.open_new_tab ?? false}
                  onCheckedChange={(v) => setNewItem({ ...newItem, open_new_tab: v })}
                />
                <Label className="text-sm">Open in new tab</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addItem}>
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
