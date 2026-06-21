import { useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
  SandpackConsole,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { aquaBlue } from "@codesandbox/sandpack-themes";
import {
  Loader2,
  Save,
  Monitor,
  Smartphone,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RefreshCw,
  ExternalLink,
  Maximize2,
  Minimize2,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function WebIDEToolbar({
  onSave,
  saving,
  previewDevice,
  setPreviewDevice,
  fontSize,
  setFontSize,
  setKey,
}: {
  onSave: (files: Record<string, { code: string }>) => void;
  saving: boolean;
  previewDevice: "desktop" | "mobile" | "tablet";
  setPreviewDevice: (d: "desktop" | "mobile" | "tablet") => void;
  fontSize: number;
  setFontSize: (s: number) => void;
  setKey: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { sandpack } = useSandpack();

  return (
    <div className="flex items-center gap-2 p-2 border-b bg-card">
      <Button onClick={() => onSave(sandpack.files)} disabled={saving} size="sm" variant="outline">
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        Save
      </Button>

      <div className="flex items-center border rounded-md bg-muted/30">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 px-3 rounded-none rounded-l-md transition",
            previewDevice === "desktop" && "bg-accent shadow-sm",
          )}
          onClick={() => setPreviewDevice("desktop")}
          title="Desktop View"
        >
          <Monitor className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 px-3 rounded-none transition",
            previewDevice === "tablet" && "bg-accent shadow-sm",
          )}
          onClick={() => setPreviewDevice("tablet")}
          title="Tablet View"
        >
          <Monitor className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 px-3 rounded-none rounded-r-md transition",
            previewDevice === "mobile" && "bg-accent shadow-sm",
          )}
          onClick={() => setPreviewDevice("mobile")}
          title="Mobile View"
        >
          <Smartphone className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center border rounded-md bg-muted/30">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 rounded-none rounded-l-md hover:bg-accent"
          onClick={() => setFontSize(Math.max(10, fontSize - 1))}
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs font-mono px-2 min-w-[40px] text-center select-none">
          {fontSize}px
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 rounded-none rounded-r-md hover:bg-accent"
          onClick={() => setFontSize(Math.min(30, fontSize + 1))}
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2"
        onClick={() => setKey((k) => k + 1)}
        title="Hard Reset Environment"
      >
        <RotateCcw className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
}

function PreviewPanel({
  previewDevice,
  fontSize,
}: {
  previewDevice: "desktop" | "mobile" | "tablet";
  fontSize: number;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { sandpack } = useSandpack();

  const getDeviceWidth = () => {
    switch (previewDevice) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "100%";
    }
  };

  const getDeviceHeight = () => {
    switch (previewDevice) {
      case "mobile":
        return "667px";
      case "tablet":
        return "1024px";
      default:
        return "100%";
    }
  };

  return (
    <div
      className={cn(
        "h-full flex flex-col bg-[#121212]",
        isFullscreen && "fixed inset-0 z-50",
      )}
    >
      {/* Preview Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            localhost:3000
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-zinc-400 hover:text-zinc-200"
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            title="Copy URL"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-zinc-400 hover:text-zinc-200"
            onClick={() => window.open(window.location.href, "_blank")}
            title="Open in New Tab"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-zinc-400 hover:text-zinc-200"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3 w-3" />
            ) : (
              <Maximize2 className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
        <div
          style={{
            width: getDeviceWidth(),
            height: getDeviceHeight(),
            background: "white",
            boxShadow:
              previewDevice !== "desktop" ? "0 10px 40px rgba(0,0,0,0.5)" : "none",
            borderRadius: previewDevice !== "desktop" ? "12px" : "0",
            border:
              previewDevice !== "desktop" ? "4px solid #333" : "none",
            overflow: "hidden",
            transition: "all 0.3s ease",
          }}
        >
          <SandpackPreview
            style={{ height: "100%" }}
            showRefreshButton
            showOpenInCodeSandbox={false}
          />
        </div>
      </div>
    </div>
  );
}

export function WebIDE({
  files,
  template,
  onSave,
  saving,
}: {
  files: Record<string, { code: string }>;
  template: "react" | "vanilla" | "node";
  onSave: (files: Record<string, string>) => void;
  saving: boolean;
}) {
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile" | "tablet">("desktop");
  const [fontSize, setFontSize] = useState(14);
  const [key, setKey] = useState(0);

  // Convert the Sandpack files object structure down to a flat record for Supabase sync
  const handleSave = (sandpackFiles: Record<string, { code: string }>) => {
    const flatFiles: Record<string, string> = {};
    for (const [path, fileData] of Object.entries(sandpackFiles)) {
      flatFiles[path] = fileData.code;
    }
    onSave(flatFiles);
  };

  return (
    <div className="h-full flex flex-col bg-background" key={key}>
      <SandpackProvider
        template={template}
        files={files}
        theme={aquaBlue}
        options={{ autoReload: true }}
      >
        <WebIDEToolbar
          onSave={handleSave}
          saving={saving}
          previewDevice={previewDevice}
          setPreviewDevice={setPreviewDevice}
          fontSize={fontSize}
          setFontSize={setFontSize}
          setKey={setKey}
        />
        <SandpackLayout
          style={{ borderRadius: 0, border: "none", flex: 1, display: "flex", overflow: "hidden" }}
        >
          <SandpackFileExplorer
            style={{ height: "100%", minWidth: "220px", borderRight: "1px solid var(--border)" }}
          />
          <SandpackCodeEditor
            style={{ height: "100%", flex: 1 }}
            showLineNumbers
            showInlineErrors
            showTabs
            wrapContent
            options={{
              editorHeight: "100%",
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: fontSize,
            }}
          />
          {template === "node" ? (
            <SandpackConsole
              style={{ height: "100%", flex: 1, borderLeft: "1px solid var(--border)" }}
            />
          ) : (
            <div style={{ height: "100%", flex: 1, display: "flex" }}>
              <PreviewPanel previewDevice={previewDevice} fontSize={fontSize} />
            </div>
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
