import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlignLeft, AlignCenter, AlignRight, Type, Palette, Layout, Trash2, Copy, Eye, EyeOff } from "lucide-react";
import { CertElement, CertDesign, FONTS, BORDER_OPTIONS, PATTERN_OPTIONS, THEMES } from "./types";

type SidebarProps = {
  elements: CertElement[];
  design: CertDesign;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CertElement>) => void;
  onUpdateDesign: (updates: Partial<CertDesign>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
};

export function DesignerSidebar({
  elements,
  design,
  selectedId,
  onSelect,
  onUpdateElement,
  onUpdateDesign,
  onDeleteElement,
  onDuplicateElement
}: SidebarProps) {
  
  const selectedEl = elements.find(e => e.id === selectedId);

  return (
    <div className="w-[320px] bg-card border-l flex flex-col h-full overflow-hidden shrink-0">
      <Tabs defaultValue={selectedEl ? "properties" : "design"} className="flex-1 flex flex-col">
        <div className="p-2 border-b">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="layers">Layers</TabsTrigger>
            <TabsTrigger value="properties" disabled={!selectedEl}>Props</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* DESIGN TAB */}
          <TabsContent value="design" className="m-0 space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2"><Palette className="h-4 w-4 text-primary"/> Theme Presets</h3>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => onUpdateDesign({
                      accent_color: t.accent,
                      bg_color: t.bg,
                      text_color: t.text,
                      accent_color_2: t.accent2,
                      font_family: t.font,
                      border_style: t.border,
                      border_width: t.borderWidth,
                      corner_style: t.corner,
                      background_pattern: t.pattern,
                      layout: t.layout
                    })}
                    className="p-2 border rounded text-left hover:border-primary/50 text-xs truncate"
                    style={{ background: t.bg, color: t.text, borderLeft: `4px solid ${t.accent}` }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <h3 className="font-semibold text-sm">Colors</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Background</Label>
                  <div className="flex gap-2 items-center mt-1">
                    <input type="color" value={design.bg_color} onChange={e => onUpdateDesign({ bg_color: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
                    <Input value={design.bg_color} onChange={e => onUpdateDesign({ bg_color: e.target.value })} className="h-8 text-xs font-mono" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Accent</Label>
                  <div className="flex gap-2 items-center mt-1">
                    <input type="color" value={design.accent_color} onChange={e => onUpdateDesign({ accent_color: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
                    <Input value={design.accent_color} onChange={e => onUpdateDesign({ accent_color: e.target.value })} className="h-8 text-xs font-mono" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Text Color</Label>
                  <div className="flex gap-2 items-center mt-1">
                    <input type="color" value={design.text_color} onChange={e => onUpdateDesign({ text_color: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
                    <Input value={design.text_color} onChange={e => onUpdateDesign({ text_color: e.target.value })} className="h-8 text-xs font-mono" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <h3 className="font-semibold text-sm">Background Texture</h3>
              <Select value={design.background_pattern} onValueChange={v => onUpdateDesign({ background_pattern: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PATTERN_OPTIONS.map(p => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 border-t pt-4">
              <h3 className="font-semibold text-sm">Border Style</h3>
              <Select value={design.border_style} onValueChange={v => onUpdateDesign({ border_style: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BORDER_OPTIONS.map(b => <SelectItem key={b.id} value={b.id}>{b.icon} {b.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {design.border_style !== "none" && (
                <div className="pt-2">
                  <Label className="text-xs mb-2 block">Border Width: {design.border_width}px</Label>
                  <Slider value={[design.border_width]} min={1} max={40} onValueChange={v => onUpdateDesign({ border_width: v[0] })} />
                </div>
              )}
            </div>
            
          </TabsContent>

          {/* LAYERS TAB */}
          <TabsContent value="layers" className="m-0 space-y-2">
            {[...elements].reverse().map((el, i) => (
              <div 
                key={el.id} 
                className={`flex items-center justify-between p-2 rounded border cursor-pointer ${selectedId === el.id ? 'bg-primary/10 border-primary/30' : 'hover:bg-accent/50'}`}
                onClick={() => onSelect(el.id)}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground w-8 shrink-0">{el.type}</span>
                  <span className="text-xs truncate">{el.content || el.id}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onDeleteElement(el.id); }}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* PROPERTIES TAB */}
          <TabsContent value="properties" className="m-0 space-y-6">
            {selectedEl ? (
              <>
                {selectedEl.type === "text" && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs">Text Content</Label>
                      <Input 
                        value={selectedEl.content || ""} 
                        onChange={e => onUpdateElement(selectedEl.id, { content: e.target.value })} 
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Font Family</Label>
                        <Select value={selectedEl.fontFamily || design.font_family} onValueChange={v => onUpdateElement(selectedEl.id, { fontFamily: v })}>
                          <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {FONTS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Color</Label>
                        <div className="flex gap-2 items-center mt-1">
                          <input type="color" value={selectedEl.color || design.text_color} onChange={e => onUpdateElement(selectedEl.id, { color: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs flex justify-between mb-2"><span>Font Size</span> <span>{selectedEl.fontSize}px</span></Label>
                      <Slider value={[selectedEl.fontSize || 16]} min={8} max={200} onValueChange={v => onUpdateElement(selectedEl.id, { fontSize: v[0] })} />
                    </div>

                    <div className="grid grid-cols-4 gap-1 bg-muted p-1 rounded-md">
                      <Button variant={selectedEl.align === 'left' ? 'secondary' : 'ghost'} size="sm" className="h-8" onClick={() => onUpdateElement(selectedEl.id, { align: 'left' })}><AlignLeft className="h-4 w-4" /></Button>
                      <Button variant={selectedEl.align === 'center' ? 'secondary' : 'ghost'} size="sm" className="h-8" onClick={() => onUpdateElement(selectedEl.id, { align: 'center' })}><AlignCenter className="h-4 w-4" /></Button>
                      <Button variant={selectedEl.align === 'right' ? 'secondary' : 'ghost'} size="sm" className="h-8" onClick={() => onUpdateElement(selectedEl.id, { align: 'right' })}><AlignRight className="h-4 w-4" /></Button>
                      <Button variant={selectedEl.fontWeight === 'bold' ? 'secondary' : 'ghost'} size="sm" className="h-8" onClick={() => onUpdateElement(selectedEl.id, { fontWeight: selectedEl.fontWeight === 'bold' ? 'normal' : 'bold' })}><b className="font-serif">B</b></Button>
                    </div>

                    <div>
                      <Label className="text-xs flex justify-between mb-2"><span>Letter Spacing</span> <span>{selectedEl.letterSpacing || 0}px</span></Label>
                      <Slider value={[selectedEl.letterSpacing || 0]} min={-5} max={30} step={0.5} onValueChange={v => onUpdateElement(selectedEl.id, { letterSpacing: v[0] })} />
                    </div>
                  </div>
                )}

                {(selectedEl.type === "image" || selectedEl.type === "signature") && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs">Image URL</Label>
                      <Input 
                        value={selectedEl.url || ""} 
                        onChange={e => onUpdateElement(selectedEl.id, { url: e.target.value })} 
                        placeholder="https://..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                <div className="border-t pt-4 space-y-4">
                  <Label className="text-xs flex justify-between mb-2"><span>Opacity</span> <span>{Math.round((selectedEl.opacity ?? 1) * 100)}%</span></Label>
                  <Slider value={[(selectedEl.opacity ?? 1) * 100]} min={0} max={100} onValueChange={v => onUpdateElement(selectedEl.id, { opacity: v[0] / 100 })} />
                </div>

                <div className="border-t pt-4 grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => onDuplicateElement(selectedEl.id)}><Copy className="h-4 w-4 mr-2" /> Duplicate</Button>
                  <Button variant="destructive" size="sm" onClick={() => onDeleteElement(selectedEl.id)}><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground text-sm pt-10">
                Select an element to edit properties
              </div>
            )}
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}
