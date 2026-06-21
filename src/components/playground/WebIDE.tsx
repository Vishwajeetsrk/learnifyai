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
import { Loader2, Save, Monitor, Smartphone, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  previewDevice: "desktop" | "mobile";
  setPreviewDevice: (d: "desktop" | "mobile") => void;
  fontSize: number;
  setFontSize: (s: number) => void;
  setKey: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { sandpack } = useSandpack();

  return (
    <div className="flex items-center gap-2 p-2 border-b bg-card">
      <Button onClick={() => onSave(sandpack.files)} disabled={saving} size="sm">
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        Save Project
      </Button>
      <div className="flex items-center border rounded-md mx-2 bg-muted/30">
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 px-3 rounded-none rounded-l-md transition ${previewDevice === "desktop" ? "bg-accent shadow-sm" : ""}`}
          onClick={() => setPreviewDevice("desktop")}
          title="Desktop Preview"
        >
          <Monitor className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 px-3 rounded-none rounded-r-md transition ${previewDevice === "mobile" ? "bg-accent shadow-sm" : ""}`}
          onClick={() => setPreviewDevice("mobile")}
          title="Mobile Preview"
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
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 ml-auto"
        onClick={() => setKey((k) => k + 1)}
        title="Hard Reset Environment"
      >
        <RotateCcw className="h-4 w-4 text-muted-foreground" />
      </Button>
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
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [fontSize, setFontSize] = useState(14);
  const [key, setKey] = useState(0);

  // We convert the Sandpack files object structure down to a flat record for Supabase sync
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
            <div
              style={{
                height: "100%",
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#121212",
                borderLeft: "1px solid var(--border)",
                padding: previewDevice === "mobile" ? "20px" : "0",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: previewDevice === "mobile" ? "375px" : "100%",
                  height: previewDevice === "mobile" ? "667px" : "100%",
                  background: "white",
                  boxShadow: previewDevice === "mobile" ? "0 10px 40px rgba(0,0,0,0.5)" : "none",
                  borderRadius: previewDevice === "mobile" ? "12px" : "0",
                  border: previewDevice === "mobile" ? "4px solid #333" : "none",
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
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
