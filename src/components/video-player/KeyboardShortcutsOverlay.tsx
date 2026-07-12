import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KEYBOARD_SHORTCUTS } from "./types";

interface KeyboardShortcutsOverlayProps {
  onClose: () => void;
}

export function KeyboardShortcutsOverlay({ onClose }: KeyboardShortcutsOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-label="Keyboard shortcuts"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-xl border border-border shadow-2xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-sm font-bold">Keyboard Shortcuts</h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={onClose}
            aria-label="Close shortcuts"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-y-auto p-4 space-y-2">
          {KEYBOARD_SHORTCUTS.map((s, i) => (
            <div key={`${s.action}-${i}`} className="flex items-center justify-between py-1.5">
              <span className="text-xs text-muted-foreground">{s.description}</span>
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono font-medium text-foreground border border-border">
                {s.ctrl && <span>Ctrl+</span>}
                {s.shift && <span>Shift+</span>}
                {s.alt && <span>Alt+</span>}
                {s.key.length === 1 ? s.key.toUpperCase() : s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
