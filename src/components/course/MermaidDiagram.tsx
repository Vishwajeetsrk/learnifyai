/**
 * MermaidDiagram — lazy-loaded Mermaid.js renderer
 * Only bundled when a diagram block is present
 */
import { useEffect, useRef, useState } from "react";

interface Props {
  definition: string;
  className?: string;
}

export default function MermaidDiagram({ definition, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    if (!definition.trim()) return;

    let cancelled = false;
    const render = async () => {
      try {
        // @ts-ignore - lazy loaded CDN / node package
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          fontFamily: "DM Sans, sans-serif",
          darkMode: true,
        });
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, definition.trim());
        if (!cancelled) setSvg(svg);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Diagram render error");
      }
    };
    render();
    return () => { cancelled = true; };
  }, [definition]);

  if (error) {
    return (
      <div className="rounded-lg bg-red-950/30 border border-red-500/30 p-4 text-sm text-red-300">
        <p className="font-medium mb-1">Diagram Error</p>
        <pre className="text-xs text-red-400 overflow-x-auto">{error}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="animate-pulse rounded-lg bg-white/5 h-32 flex items-center justify-center">
        <span className="text-slate-500 text-sm">Rendering diagram...</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: svg }}
      style={{ maxWidth: "100%", overflowX: "auto" }}
    />
  );
}
