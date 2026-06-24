import { useState, useMemo } from "react";
import { CodeEditor } from "./CodeEditor";
import { RefreshCw, Download, Smartphone, Monitor } from "lucide-react";

const DEFAULT_HTML =
  '<!doctype html>\n<html>\n  <head><meta charset="utf-8" /><title>My Page</title><link rel="stylesheet" href="style.css" /></head>\n  <body>\n    <h1>Hello, Learnify!</h1>\n    <p id="msg">Edit me — preview updates live.</p>\n    <button onclick="document.getElementById(\'msg\').innerText = \'Clicked!\'">Click me</button>\n  </body>\n</html>';
const DEFAULT_CSS =
  "body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }\nh1 { color: #4f46e5; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; }\nbutton { padding: 8px 16px; border-radius: 8px; border: 1px solid #d1d5db; background: #f9fafb; cursor: pointer; font-size: 14px; }\nbutton:hover { background: #e5e7eb; }";
const DEFAULT_JS = 'console.log("Preview ready!");\n// Your JavaScript code here\n';

const TABS = [
  {
    id: "html" as const,
    label: "HTML",
    color: "#E34F26",
    icon: "https://cdn.simpleicons.org/html5/E34F26",
  },
  {
    id: "css" as const,
    label: "CSS",
    color: "#1572B6",
    icon: "https://cdn.simpleicons.org/css3/1572B6",
  },
  {
    id: "js" as const,
    label: "JavaScript",
    color: "#F7DF1E",
    icon: "https://cdn.simpleicons.org/javascript/F7DF1E",
  },
];

export function WebPlayground() {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [tab, setTab] = useState<"html" | "css" | "js">("html");
  const [key, setKey] = useState(0);
  const [previewWidth, setPreviewWidth] = useState<"full" | "mobile">("full");

  const srcDoc = useMemo(() => {
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
  }, [html, css, js]);

  const value = tab === "html" ? html : tab === "css" ? css : js;
  const setValue = tab === "html" ? setHtml : tab === "css" ? setCss : setJs;

  const download = () => {
    const blob = new Blob([srcDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "playground.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 border-b bg-muted/20 text-xs shrink-0 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded whitespace-nowrap transition ${
              tab === t.id
                ? "bg-card shadow-sm border font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <img src={t.icon} alt="" className="w-3.5 h-3.5" loading="lazy" decoding="async" />
            {t.label}
          </button>
        ))}
        <div className="flex-1 min-w-[4px]" />
        <button
          onClick={() => setPreviewWidth(previewWidth === "full" ? "mobile" : "full")}
          className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground shrink-0"
          title={previewWidth === "full" ? "Mobile preview" : "Full preview"}
        >
          {previewWidth === "full" ? (
            <Smartphone className="h-3.5 w-3.5" />
          ) : (
            <Monitor className="h-3.5 w-3.5" />
          )}
        </button>
        <button
          onClick={() => setKey((k) => k + 1)}
          className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground shrink-0"
          title="Refresh preview"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={download}
          className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground shrink-0"
          title="Download HTML"
        >
          <Download className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex-1 flex flex-col md:flex-row gap-0">
        <div className="md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r">
          <CodeEditor
            language={tab === "js" ? "javascript" : tab}
            value={value}
            onChange={setValue}
          />
        </div>
        <div
          className={`md:w-1/2 h-1/2 md:h-full bg-white overflow-auto ${previewWidth === "mobile" ? "flex justify-center" : ""}`}
        >
          <iframe
            key={key}
            title="Preview"
            sandbox="allow-scripts"
            srcDoc={srcDoc}
            className={`h-full border-0 ${previewWidth === "mobile" ? "w-[375px] shrink-0" : "w-full"}`}
          />
        </div>
      </div>
    </div>
  );
}
