import { useEffect, useRef, useState, type CSSProperties } from "react";

export type ThreeDPaperVariant = "original" | "site-of-the-year" | "japanese" | "certificate";

export type ThreeDPaperProps = {
  className?: string;
  style?: CSSProperties;
  variant?: ThreeDPaperVariant;
};

const titles: Record<ThreeDPaperVariant, string> = {
  original: "3D Paper",
  "site-of-the-year": "3D Paper — Site of the Year",
  japanese: "3D Paper — 認定証",
  certificate: "3D Paper — Certificate",
};

export function ThreeDPaper({ className = "", style, variant = "original" }: ThreeDPaperProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [documentVisible, setDocumentVisible] = useState(() => (
    typeof document === "undefined" || !document.hidden
  ));
  const [hostVisible, setHostVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [sourceHtml, setSourceHtml] = useState<string>("");

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      setHostVisible(entry?.isIntersecting ?? true);
    }, { rootMargin: "80px" });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const mounted = hostVisible && documentVisible;

  // Lazily load raw HTML shader string only when mounted in browser (keeps SSR bundle lightweight)
  useEffect(() => {
    if (!mounted) return;
    setReady(false);
    let cancelled = false;

    async function loadSource() {
      let raw = "";
      if (variant === "certificate") {
        raw = (await import("./sources/3d-paper-certificate.html?raw")).default;
      } else if (variant === "japanese") {
        raw = (await import("./sources/3d-paper-japanese.html?raw")).default;
      } else if (variant === "site-of-the-year") {
        raw = (await import("./sources/3d-paper-site-of-the-year.html?raw")).default;
      } else {
        raw = (await import("./sources/3d-paper.html?raw")).default;
      }
      if (!cancelled) {
        setSourceHtml(raw);
      }
    }
    loadSource();

    return () => {
      cancelled = true;
    };
  }, [mounted, variant]);

  return (
    <div
      ref={hostRef}
      className={`threeui-background three-d-paper${className ? ` ${className}` : ""}`}
      role="group"
      aria-label="Interactive translucent 3D paper certificate"
      data-state={!mounted ? "paused" : ready ? "ready" : "loading"}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#08080a",
        pointerEvents: "auto",
        ...style,
      }}
    >
      {mounted && sourceHtml ? (
        <iframe
          title={titles[variant]}
          srcDoc={sourceHtml}
          sandbox="allow-scripts"
          loading="eager"
          onLoad={() => setReady(true)}
          style={{
            position: "absolute",
            inset: 0,
            display: "block",
            width: "100%",
            height: "100%",
            border: 0,
            background: "#08080a",
            opacity: ready ? 1 : 0,
            pointerEvents: ready ? "auto" : "none",
            transition: "opacity 240ms ease-out",
          }}
        />
      ) : null}
    </div>
  );
}
