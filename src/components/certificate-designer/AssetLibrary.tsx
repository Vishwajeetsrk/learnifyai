import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Upload } from "lucide-react";
import { SHAPE_OPTIONS, ShapeType } from "./types";

type AssetLibraryProps = {
  onAddShape: (shapeType: ShapeType) => void;
  onAddSvg: (svg: string, name: string) => void;
  onAddDivider: () => void;
  onUploadImage: (file: File) => void;
  accentColor: string;
};

const DECORATIVE_SVGS: { name: string; svg: string }[] = [
  {
    name: "Ornament 1",
    svg: '<svg viewBox="0 0 200 30" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 15 Q50 0 100 15 Q150 30 190 15"/><path d="M10 15 Q50 30 100 15 Q150 0 190 15"/></svg>',
  },
  {
    name: "Ornament 2",
    svg: '<svg viewBox="0 0 200 20" fill="none" stroke="currentColor" stroke-width="1"><line x1="0" y1="10" x2="80" y2="10"/><circle cx="100" cy="10" r="6" fill="none"/><line x1="120" y1="10" x2="200" y2="10"/></svg>',
  },
  {
    name: "Ornament 3",
    svg: '<svg viewBox="0 0 200 30" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 15 Q25 0 50 15 Q75 30 100 15 Q125 0 150 15 Q175 30 200 15"/></svg>',
  },
  {
    name: "Divider Dots",
    svg: '<svg viewBox="0 0 200 10" fill="currentColor"><circle cx="20" cy="5" r="2"/><circle cx="40" cy="5" r="2"/><circle cx="60" cy="5" r="2"/><circle cx="80" cy="5" r="2"/><circle cx="100" cy="5" r="3"/><circle cx="120" cy="5" r="2"/><circle cx="140" cy="5" r="2"/><circle cx="160" cy="5" r="2"/><circle cx="180" cy="5" r="2"/></svg>',
  },
  {
    name: "Divider Star",
    svg: '<svg viewBox="0 0 200 20" fill="none" stroke="currentColor" stroke-width="1"><line x1="0" y1="10" x2="85" y2="10"/><polygon points="100,2 105,8 112,9 107,14 108,21 100,17 92,21 93,14 88,9 95,8" transform="scale(0.7) translate(43, -2)"/><line x1="115" y1="10" x2="200" y2="10"/></svg>',
  },
  {
    name: "Corner Flourish",
    svg: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 95 Q5 5 95 5"/><path d="M15 95 Q15 15 95 15"/><circle cx="5" cy="95" r="3" fill="currentColor"/></svg>',
  },
];

const STAMP_SVGS: { name: string; svg: string }[] = [
  {
    name: "Gold Seal",
    svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="#c9a84c" stroke-width="3"/><circle cx="50" cy="50" r="38" fill="none" stroke="#c9a84c" stroke-width="1" stroke-dasharray="4 2"/><text x="50" y="45" text-anchor="middle" font-size="8" fill="#c9a84c" font-family="serif" font-weight="bold">CERTIFIED</text><text x="50" y="60" text-anchor="middle" font-size="6" fill="#c9a84c" font-family="serif">Learnify AI</text></svg>',
  },
  {
    name: "Hologram",
    svg: '<svg viewBox="0 0 100 100"><defs><linearGradient id="holo" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:0.6"/><stop offset="50%" style="stop-color:#4ecdc4;stop-opacity:0.6"/><stop offset="100%" style="stop-color:#45b7d1;stop-opacity:0.6"/></linearGradient></defs><circle cx="50" cy="50" r="45" fill="url(#holo)" stroke="none"/><circle cx="50" cy="50" r="40" fill="none" stroke="white" stroke-width="0.5" opacity="0.5"/></svg>',
  },
  {
    name: "Official Stamp",
    svg: '<svg viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" rx="5" fill="none" stroke="currentColor" stroke-width="3"/><rect x="15" y="15" width="70" height="70" rx="3" fill="none" stroke="currentColor" stroke-width="1"/><text x="50" y="42" text-anchor="middle" font-size="7" fill="currentColor" font-weight="bold">OFFICIAL</text><text x="50" y="55" text-anchor="middle" font-size="6" fill="currentColor">STAMP</text><line x1="25" y1="62" x2="75" y2="62" stroke="currentColor" stroke-width="0.5"/></svg>',
  },
  {
    name: "Verified Badge",
    svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="currentColor" opacity="0.1"/><circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="2"/><path d="M35 50 L45 60 L65 40" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
];

export function AssetLibrary({ onAddShape, onAddSvg, onAddDivider, onUploadImage, accentColor }: AssetLibraryProps) {
  const [tab, setTab] = useState("shapes");
  const [search, setSearch] = useState("");

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="grid grid-cols-4 w-full h-8">
        <TabsTrigger value="shapes" className="text-[10px]">Shapes</TabsTrigger>
        <TabsTrigger value="ornaments" className="text-[10px]">Ornaments</TabsTrigger>
        <TabsTrigger value="stamps" className="text-[10px]">Stamps</TabsTrigger>
        <TabsTrigger value="upload" className="text-[10px]">Upload</TabsTrigger>
      </TabsList>

      <TabsContent value="shapes" className="mt-2 space-y-2">
        <div className="grid grid-cols-4 gap-1.5">
          {SHAPE_OPTIONS.map((s) => (
            <button
              key={s.type}
              onClick={() => onAddShape(s.type)}
              className="aspect-square p-2 rounded-md border hover:border-primary/50 hover:bg-accent/50 transition-colors flex flex-col items-center justify-center gap-1"
              title={s.label}
            >
              <span className="text-lg leading-none">{s.icon}</span>
              <span className="text-[9px] text-muted-foreground">{s.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onAddDivider}
          className="w-full py-2 rounded-md border hover:border-primary/50 hover:bg-accent/50 transition-colors text-xs font-medium"
        >
          + Add Divider Line
        </button>
      </TabsContent>

      <TabsContent value="ornaments" className="mt-2">
        <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
          {DECORATIVE_SVGS.map((d, i) => (
            <button
              key={i}
              onClick={() => onAddSvg(d.svg, d.name)}
              className="aspect-[3/1] p-2 rounded-md border hover:border-primary/50 hover:bg-accent/50 transition-colors flex items-center justify-center"
              title={d.name}
              dangerouslySetInnerHTML={{ __html: d.svg.replace(/currentColor/, accentColor) }}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="stamps" className="mt-2">
        <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
          {STAMP_SVGS.map((s, i) => (
            <button
              key={i}
              onClick={() => onAddSvg(s.svg, s.name)}
              className="aspect-square p-3 rounded-md border hover:border-primary/50 hover:bg-accent/50 transition-colors flex items-center justify-center"
              title={s.name}
              dangerouslySetInnerHTML={{ __html: s.svg.replace(/currentColor/, accentColor) }}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="upload" className="mt-2">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/30 transition-colors">
          <Upload className="h-6 w-6 text-muted-foreground mb-2" />
          <span className="text-xs text-muted-foreground">Click or drop image</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUploadImage(file);
            }}
          />
        </label>
      </TabsContent>
    </Tabs>
  );
}
