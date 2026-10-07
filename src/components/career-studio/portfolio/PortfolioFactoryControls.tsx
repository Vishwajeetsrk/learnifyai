/**
 * LEARNIFY AI — PORTFOLIO FACTORY 4.0
 * Interactive Visual Controls: Persona Detection, 15 Design Families,
 * 10 Palette Swatches, 6 Typography Pairings, Design Locks, and Re-roll Generator.
 */

import React, { useMemo } from "react";
import {
  Wand2,
  Sparkles,
  Lock,
  Unlock,
  Shuffle,
  Palette,
  Type,
  Layout,
  Layers,
  Check,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  DESIGN_FAMILIES,
  COLOR_PALETTES,
  TYPOGRAPHY_PAIRINGS,
  detectPersona,
  type DesignFamilyId,
  type ColorPaletteId,
  type TypographyPairingId,
  type DesignLocks,
  type PortfolioData,
  type FactoryGenerationConfig,
} from "@/lib/portfolio-factory";
import { cn } from "@/lib/utils";

interface PortfolioFactoryControlsProps {
  portfolioData: Partial<PortfolioData>;
  config: FactoryGenerationConfig;
  onChangeConfig: (nextConfig: FactoryGenerationConfig) => void;
  className?: string;
}

export function PortfolioFactoryControls({
  portfolioData,
  config,
  onChangeConfig,
  className,
}: PortfolioFactoryControlsProps) {
  // Real-time persona detection
  const personaInfo = useMemo(() => detectPersona(portfolioData), [portfolioData]);

  const currentFamilyId = config.familyId || personaInfo.recommendedFamily;
  const currentFamily = DESIGN_FAMILIES[currentFamilyId] || DESIGN_FAMILIES["full-stack-dev"];
  const currentPaletteId = config.paletteId || currentFamily.defaultPalette;
  const currentPalette = COLOR_PALETTES[currentPaletteId] || COLOR_PALETTES["learnify-brand"];
  const currentTypographyId = config.typographyId || currentFamily.defaultTypography;
  const currentTypography = TYPOGRAPHY_PAIRINGS[currentTypographyId] || TYPOGRAPHY_PAIRINGS["modern-sans"];
  const locks: DesignLocks = config.locks || { content: true };

  const toggleLock = (key: keyof DesignLocks) => {
    onChangeConfig({
      ...config,
      locks: {
        ...locks,
        [key]: !locks[key],
      },
    });
  };

  const handleSelectFamily = (familyId: DesignFamilyId) => {
    const fam = DESIGN_FAMILIES[familyId];
    onChangeConfig({
      ...config,
      familyId,
      paletteId: locks.color ? config.paletteId : fam.defaultPalette,
      typographyId: locks.font ? config.typographyId : fam.defaultTypography,
      heroId: locks.layout ? config.heroId : fam.defaultHero,
      projectsLayoutId: locks.layout ? config.projectsLayoutId : fam.defaultProjectsLayout,
      skillsLayoutId: locks.layout ? config.skillsLayoutId : fam.defaultSkillsLayout,
    });
  };

  const handleSelectPalette = (paletteId: ColorPaletteId) => {
    onChangeConfig({
      ...config,
      paletteId,
    });
  };

  const handleSelectTypography = (typographyId: TypographyPairingId) => {
    onChangeConfig({
      ...config,
      typographyId,
    });
  };

  // Re-roll / Regenerate complementary design
  const handleRegenerateDesign = () => {
    const familyKeys = Object.keys(DESIGN_FAMILIES) as DesignFamilyId[];
    const paletteKeys = Object.keys(COLOR_PALETTES) as ColorPaletteId[];
    const typoKeys = Object.keys(TYPOGRAPHY_PAIRINGS) as TypographyPairingId[];

    // Pick a new family different from current
    const availableFamilies = familyKeys.filter((f) => f !== currentFamilyId);
    const randomFamily = availableFamilies[Math.floor(Math.random() * availableFamilies.length)];
    const famMeta = DESIGN_FAMILIES[randomFamily];

    const randomPalette = locks.color
      ? currentPaletteId
      : paletteKeys[Math.floor(Math.random() * paletteKeys.length)];

    const randomTypo = locks.font
      ? currentTypographyId
      : typoKeys[Math.floor(Math.random() * typoKeys.length)];

    onChangeConfig({
      ...config,
      familyId: locks.layout ? currentFamilyId : randomFamily,
      paletteId: randomPalette,
      typographyId: randomTypo,
      heroId: locks.layout ? config.heroId : famMeta.defaultHero,
      projectsLayoutId: locks.layout ? config.projectsLayoutId : famMeta.defaultProjectsLayout,
      skillsLayoutId: locks.layout ? config.skillsLayoutId : famMeta.defaultSkillsLayout,
    });
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card/90 backdrop-blur-md p-3.5 sm:p-4 shadow-sm space-y-3.5",
        className,
      )}
    >
      {/* Top Banner: Persona Detection */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-foreground tracking-tight">
                Portfolio Factory 4.0
              </span>
              <Badge
                variant="outline"
                className="text-[11px] font-semibold border-primary/30 text-primary bg-primary/5 py-0.5 px-2"
              >
                🎯 {personaInfo.label}
              </Badge>
              <span className="text-[10px] text-muted-foreground hidden sm:inline">
                ({Math.round(personaInfo.confidence * 100)}% match)
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-1">
              {personaInfo.reasoning}
            </p>
          </div>
        </div>

        {/* Regenerate / Re-roll button */}
        <Button
          size="sm"
          variant="outline"
          onClick={handleRegenerateDesign}
          className="h-8 text-xs gap-1.5 font-medium border-primary/20 hover:border-primary/40 hover:bg-primary/5"
          title="Regenerate theme, palette, and composition while preserving user data"
        >
          <Shuffle className="h-3.5 w-3.5 text-primary" />
          <span>Regenerate Design</span>
        </Button>
      </div>

      {/* Control Pickers Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {/* 1. Design Family Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 transition text-left text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Layout className="h-3.5 w-3.5 text-primary shrink-0" />
                <div className="truncate">
                  <div className="text-[10px] text-muted-foreground font-medium">Design Family</div>
                  <div className="font-semibold text-foreground truncate">{currentFamily.name}</div>
                </div>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 max-h-80 overflow-y-auto">
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Select Design Family (15 Options)
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(DESIGN_FAMILIES) as DesignFamilyId[]).map((fId) => {
              const meta = DESIGN_FAMILIES[fId];
              const isSelected = fId === currentFamilyId;
              const isRecommended = fId === personaInfo.recommendedFamily;
              return (
                <DropdownMenuItem
                  key={fId}
                  onClick={() => handleSelectFamily(fId)}
                  className="flex items-start justify-between py-2 cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs">{meta.name}</span>
                      {isRecommended && (
                        <Badge className="text-[9px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
                          Rec
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                      {meta.subtitle}
                    </p>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 2. Color Palette Dropdown with Swatches */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 transition text-left text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Palette className="h-3.5 w-3.5 text-primary shrink-0" />
                <div className="truncate">
                  <div className="text-[10px] text-muted-foreground font-medium">Color Palette</div>
                  <div className="flex items-center gap-1.5 font-semibold text-foreground truncate">
                    {/* Swatch dots */}
                    <span className="inline-flex items-center -space-x-1 shrink-0">
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-background shadow-xs"
                        style={{ backgroundColor: currentPalette.background }}
                      />
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-background shadow-xs"
                        style={{ backgroundColor: currentPalette.surface }}
                      />
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-background shadow-xs"
                        style={{ backgroundColor: currentPalette.primary }}
                      />
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-background shadow-xs"
                        style={{ backgroundColor: currentPalette.accent }}
                      />
                    </span>
                    <span className="truncate capitalize">{currentPaletteId.replace("-", " ")}</span>
                  </div>
                </div>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 max-h-80 overflow-y-auto">
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Select Color Palette (10 Curated)
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(COLOR_PALETTES) as ColorPaletteId[]).map((pId) => {
              const pal = COLOR_PALETTES[pId];
              const isSelected = pId === currentPaletteId;
              return (
                <DropdownMenuItem
                  key={pId}
                  onClick={() => handleSelectPalette(pId)}
                  className="flex items-center justify-between py-2 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center -space-x-1 shrink-0">
                      <span
                        className="h-3 w-3 rounded-full border border-border"
                        style={{ backgroundColor: pal.background }}
                      />
                      <span
                        className="h-3 w-3 rounded-full border border-border"
                        style={{ backgroundColor: pal.surface }}
                      />
                      <span
                        className="h-3 w-3 rounded-full border border-border"
                        style={{ backgroundColor: pal.primary }}
                      />
                      <span
                        className="h-3 w-3 rounded-full border border-border"
                        style={{ backgroundColor: pal.accent }}
                      />
                    </span>
                    <span className="text-xs font-semibold capitalize">
                      {pId.replace("-", " ")}
                    </span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 3. Typography Pairing Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 transition text-left text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Type className="h-3.5 w-3.5 text-primary shrink-0" />
                <div className="truncate">
                  <div className="text-[10px] text-muted-foreground font-medium">Typography</div>
                  <div className="font-semibold text-foreground truncate">
                    {currentTypography.displayFont} + {currentTypography.bodyFont}
                  </div>
                </div>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 max-h-80 overflow-y-auto">
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Select Typography Pairing
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(TYPOGRAPHY_PAIRINGS) as TypographyPairingId[]).map((tId) => {
              const pair = TYPOGRAPHY_PAIRINGS[tId];
              const isSelected = tId === currentTypographyId;
              return (
                <DropdownMenuItem
                  key={tId}
                  onClick={() => handleSelectTypography(tId)}
                  className="flex items-center justify-between py-2 cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-semibold">{pair.displayFont}</div>
                    <div className="text-[10px] text-muted-foreground">
                      Body: {pair.bodyFont} &bull; Code: {pair.codeFont}
                    </div>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 4. Design Locks Bar */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-border/60 bg-muted/20">
          <span className="text-[10px] text-muted-foreground font-semibold px-1">Locks:</span>
          <button
            type="button"
            onClick={() => toggleLock("color")}
            className={cn(
              "flex-1 h-7 rounded-lg text-[11px] font-medium transition flex items-center justify-center gap-1",
              locks.color
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:bg-muted/60",
            )}
            title="Lock current color palette when regenerating"
          >
            {locks.color ? <Lock className="h-2.5 w-2.5" /> : <Unlock className="h-2.5 w-2.5" />}
            Color
          </button>
          <button
            type="button"
            onClick={() => toggleLock("font")}
            className={cn(
              "flex-1 h-7 rounded-lg text-[11px] font-medium transition flex items-center justify-center gap-1",
              locks.font
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:bg-muted/60",
            )}
            title="Lock current typography when regenerating"
          >
            {locks.font ? <Lock className="h-2.5 w-2.5" /> : <Unlock className="h-2.5 w-2.5" />}
            Font
          </button>
          <button
            type="button"
            onClick={() => toggleLock("layout")}
            className={cn(
              "flex-1 h-7 rounded-lg text-[11px] font-medium transition flex items-center justify-center gap-1",
              locks.layout
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:bg-muted/60",
            )}
            title="Lock current layout when regenerating"
          >
            {locks.layout ? <Lock className="h-2.5 w-2.5" /> : <Unlock className="h-2.5 w-2.5" />}
            Layout
          </button>
        </div>
      </div>
    </div>
  );
}
