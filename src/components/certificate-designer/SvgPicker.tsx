import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SVG_ICONS, SVG_CATEGORIES } from "./types";

type SvgPickerProps = {
  onAdd: (svg: string, name: string) => void;
  color?: string;
};

export function SvgPicker({ onAdd, color = "#0f1b3d" }: SvgPickerProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return SVG_ICONS.filter((icon) => {
      const matchSearch = !search || icon.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || icon.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search icons..."
          className="h-8 pl-8 text-xs"
        />
      </div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {SVG_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap transition-colors ${
              category === c.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-1 max-h-48 overflow-y-auto pr-1">
        {filtered.map((icon) => (
          <button
            key={icon.id}
            onClick={() => onAdd(icon.svg, icon.name)}
            className="aspect-square p-1.5 rounded-md border hover:border-primary/50 hover:bg-accent/50 transition-colors flex items-center justify-center"
            title={icon.name}
            dangerouslySetInnerHTML={{
              __html: icon.svg.replace(/currentColor/, color),
            }}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-5 text-xs text-muted-foreground text-center py-4">No icons found</p>
        )}
      </div>
    </div>
  );
}
