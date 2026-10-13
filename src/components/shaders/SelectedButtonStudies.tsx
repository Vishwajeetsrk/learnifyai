import { useMemo, useRef, useEffect } from "react";

import type { NeuformIsolatedEffectProps } from "./NeuformIsolatedEffects";
import source from "./sources/button-index.html?raw";

export const SELECTED_BUTTON_STUDIES = {
  "glassy-split": { index: 2, title: "Glassy Split", light: "#0e1014", dark: "#0e1014" },
  "generate-site": { index: 3, title: "Generate Site", light: "#100421", dark: "#100421" },
  "chrome-upload": { index: 4, title: "Chrome Upload", light: "#d1d1d1", dark: "#16191f" },
  "book-a-demo": { index: 7, title: "Book a Demo", light: "#fafafa", dark: "#171b1b" },
  "iridescent-glass": { index: 8, title: "Iridescent Glass", light: "#f2f2f1", dark: "#171b28" },
  "create-and-get-started": { index: 9, title: "Create & Get Started", light: "#ffffff", dark: "#191d25" },
  "soft-surface": { index: 10, title: "Soft Surface", light: "#dce1e5", dark: "#222a34" },
  balloon: { index: 11, title: "Balloon", light: "#11131d", dark: "#11131d" },
  "light-switch": { index: 14, title: "Light Switch", light: "#e6ebff", dark: "#171c33" },
  "start-growing": { index: 16, title: "Start Growing", light: "#ecf3e9", dark: "#102019" },
  "car-controls": { index: 18, title: "Car Controls", light: "#e8eaed", dark: "#191d24" },
} as const;

export type SelectedButtonStudyVariant = keyof typeof SELECTED_BUTTON_STUDIES;

function focusedSource(index: number, mode: "light" | "dark", background: string) {
  const style = `<style data-threeui-study-focus>
    html, body, body > main, .button-list, .button-row[data-index="${index}"],
    .button-row[data-index="${index}"] .stage-frame,
    .button-row[data-index="${index}"] .stage { width: 100% !important; height: 100% !important; min-height: 0 !important; }
    html, body { margin: 0 !important; padding: 0 !important; overflow: hidden !important; background: ${background} !important; }
    body > main { max-width: none !important; padding: 0 !important; }
    .list-header, .list-footer, .button-row .number, .button-row .study-meta, .button-row .source { display: none !important; }
    .button-list { display: block !important; margin: 0 !important; padding: 0 !important; list-style: none !important; }
    .button-row { display: none !important; }
    .button-row[data-index="${index}"] { display: block !important; border: 0 !important; padding: 0 !important; }
    .button-row[data-index="${index}"] .stage-frame { display: block !important; overflow: hidden !important; }
    .button-row[data-index="${index}"] .stage { display: block !important; overflow: hidden !important; }
    .button-row[data-index="${index}"] .artboard {
      top: 50% !important;
      transform: translate(-50%, -50%) scale(var(--threeui-study-scale, 1)) !important;
      transition: none !important;
    }
    .button-row[data-index="${index}"] .stage[data-hover=true] .artboard,
    .button-row[data-index="${index}"] .stage[data-pressed=true] .artboard {
      transform: translate(-50%, -50%) scale(var(--threeui-study-scale, 1)) !important;
    }
  </style>`;
  const script = `<script data-threeui-study-focus>
    (() => {
      const index = ${index};
      const mode = ${JSON.stringify(mode)};
      
      function disposeAllWebGL() {
        try {
          var canvases = document.querySelectorAll('canvas');
          for (var i = 0; i < canvases.length; i++) {
            var c = canvases[i];
            try {
              var gl = c.getContext('webgl') || c.getContext('experimental-webgl');
              if (gl) {
                var ext = gl.getExtension('WEBGL_lose_context');
                if (ext) ext.loseContext();
              }
            } catch (e) {}
          }
        } catch (err) {}
      }

      window.addEventListener('beforeunload', disposeAllWebGL);
      window.addEventListener('pagehide', disposeAllWebGL);
      window.addEventListener('message', function (ev) {
        if (ev && ev.data && ev.data.threeuiDispose) {
          disposeAllWebGL();
        }
      });

      document.querySelector('[data-theme-choice="' + mode + '"]')?.click();
      const stage = document.querySelector('#study-' + index);
      if (!stage) return;
      const fit = () => {
        const scale = Math.min(innerWidth / 850, innerHeight / 650, 1.4);
        stage.style.setProperty('--threeui-study-scale', String(scale));
        stage.style.setProperty('--scale', String(scale));
      };
      fit();
      addEventListener('resize', fit);
      document.querySelectorAll('.button-row').forEach(row => {
        if (Number(row.dataset.index) === index) return;
        row.setAttribute('aria-hidden', 'true');
        row.inert = true;
      });
      document.querySelector('.list-header')?.setAttribute('aria-hidden', 'true');
      document.querySelector('.list-footer')?.setAttribute('aria-hidden', 'true');

      try {
        window.parent.postMessage({ threeuiReady: true }, '*');
      } catch (e) {}
    })();
  </script>`;
  return source.replace(/<\/head>/i, `${style}</head>`).replace(/<\/body>/i, `${script}</body>`);
}

export function SelectedButtonStudies({
  variant,
  mode = "light",
  hue = 0,
  saturation = 1,
  brightness = 1,
  className,
  style,
  onReady,
  onError,
}: NeuformIsolatedEffectProps & {
  variant: SelectedButtonStudyVariant;
  onReady?: () => void;
  onError?: (error: string) => void;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const definition = SELECTED_BUTTON_STUDIES[variant];
  const selectedMode = mode === "dark" ? "dark" : "light";
  const background = definition[selectedMode];
  const document = useMemo(
    () => focusedSource(definition.index, selectedMode, background),
    [definition.index, selectedMode, background],
  );

  useEffect(() => {
    const frame = frameRef.current;
    return () => {
      try {
        if (frame?.contentWindow) {
          frame.contentWindow.postMessage({ threeuiDispose: true }, "*");
        }
        if (frame) {
          frame.src = "about:blank";
        }
      } catch (e) {}
    };
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    const handleMessage = (event: MessageEvent) => {
      if (frame && event.source === frame.contentWindow && event.data?.threeuiReady) {
        onReady?.();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onReady]);

  const handleFrameLoad = () => {
    const timer = setTimeout(() => {
      onReady?.();
    }, 200);
    return () => clearTimeout(timer);
  };

  return (
    <iframe
      ref={frameRef}
      className={className}
      data-variant={variant}
      title={`${definition.title} button study`}
      srcDoc={document}
      sandbox="allow-scripts"
      loading="eager"
      onLoad={handleFrameLoad}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        minHeight: "360px",
        border: 0,
        background,
        filter: `hue-rotate(${hue}deg) saturate(${saturation}) brightness(${brightness})`,
        ...style,
      }}
    />
  );
}
