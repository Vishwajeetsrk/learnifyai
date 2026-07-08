import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { FONTS, FONT_CATEGORIES } from "./types";

type FontPickerProps = {
  value: string;
  onChange: (font: string) => void;
};

export function FontPicker({ value, onChange }: FontPickerProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return FONTS.filter((f) => {
      const matchSearch = !search || f.label.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || f.category === category;
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
          placeholder="Search fonts..."
          className="h-8 pl-8 text-xs"
        />
      </div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {FONT_CATEGORIES.map((c) => (
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
      <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1">
        {filtered.map((f) => (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`w-full text-left px-2.5 py-1.5 rounded-md text-sm transition-colors ${
              value === f.value ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent/50"
            }`}
            style={{ fontFamily: f.value }}
          >
            {f.label}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No fonts found</p>
        )}
      </div>
    </div>
  );
}
