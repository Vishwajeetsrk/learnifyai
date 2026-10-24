import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionsBarProps {
  actions: string[];
  onSelectAction: (actionText: string) => void;
  className?: string;
}

export function QuickActionsBar({
  actions,
  onSelectAction,
  className,
}: QuickActionsBarProps) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className={cn("mt-3 pt-2.5 border-t border-border/40 space-y-1.5", className)}>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        <Sparkles className="h-3 w-3 text-primary" />
        <span>Continue Learning & Practice</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => onSelectAction(action)}
            className="group inline-flex items-center gap-1 rounded-xl border border-border/70 bg-background/80 px-2.5 py-1 text-xs text-foreground/90 transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary cursor-pointer shadow-2xs"
          >
            <span>{action}</span>
            <ArrowRight className="h-3 w-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
}
