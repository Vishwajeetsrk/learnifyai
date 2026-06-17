import { Moon, Sun, Monitor, Palette, Check, Zap, ZapOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COLOR_THEMES, useTheme, type ColorTheme, type Mode } from "@/hooks/use-theme";
import { useMotionPref, type MotionPref } from "@/hooks/use-motion-pref";
import { cn } from "@/lib/utils";

const MODES: { id: Mode; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

const MOTIONS: { id: MotionPref; label: string; icon: typeof Sun }[] = [
  { id: "auto", label: "Match system", icon: Monitor },
  { id: "full", label: "Full motion", icon: Zap },
  { id: "reduced", label: "Reduce motion", icon: ZapOff },
];

export function ThemeToggle({ size = "icon" }: { size?: "icon" | "sm" }) {
  const { mode, color, resolvedMode, setMode, setColor } = useTheme();
  const { pref: motionPref, setPref: setMotionPref } = useMotionPref();
  const Icon = resolvedMode === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={size === "icon" ? "icon" : "sm"}
          aria-label="Theme and motion preferences"
        >
          <Icon className="h-4 w-4 transition-transform hover:rotate-12 motion-reduce:transition-none motion-reduce:hover:rotate-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-3.5 w-3.5" /> Appearance
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MODES.map((m) => {
          const MIcon = m.icon;
          const active = mode === m.id;
          return (
            <DropdownMenuItem key={m.id} onSelect={() => setMode(m.id)} className="gap-2">
              <MIcon className="h-4 w-4" />
              <span className="flex-1">{m.label}</span>
              {active && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Color theme</DropdownMenuLabel>
        <div className="grid grid-cols-6 gap-1.5 px-2 pb-2 pt-1">
          {COLOR_THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setColor(t.id as ColorTheme)}
              aria-label={t.label}
              title={t.label}
              className={cn(
                "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring motion-reduce:transition-none motion-reduce:hover:scale-100",
                color === t.id ? "border-foreground" : "border-transparent",
              )}
              style={{ background: t.swatch }}
            >
              {color === t.id && <Check className="h-3.5 w-3.5 text-white mx-auto drop-shadow" />}
            </button>
          ))}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Motion</DropdownMenuLabel>
        {MOTIONS.map((m) => {
          const MIcon = m.icon;
          const active = motionPref === m.id;
          return (
            <DropdownMenuItem key={m.id} onSelect={() => setMotionPref(m.id)} className="gap-2">
              <MIcon className="h-4 w-4" />
              <span className="flex-1">{m.label}</span>
              {active && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
