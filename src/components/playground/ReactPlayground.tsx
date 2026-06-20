import { useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { aquaBlue } from "@codesandbox/sandpack-themes";
import { RotateCcw } from "lucide-react";

const FILES = {
  "/App.jsx": {
    code: `import React from 'react';

export default function App() {
  const [count, setCount] = React.useState(0);
  return (
    <div style={{ fontFamily: 'system-ui', padding: '2rem' }}>
      <h1 style={{ color: '#4f46e5' }}>React Playground</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)} style={btnStyle}>+</button>
      <button onClick={() => setCount(c => c - 1)} style={btnStyle}>-</button>
      <button onClick={() => setCount(0)} style={{ ...btnStyle, background: '#6b7280' }}>Reset</button>
    </div>
  );
}

const btnStyle = {
  margin: '4px', padding: '8px 16px', borderRadius: '8px',
  border: '1px solid #d1d5db', background: '#4f46e5',
  color: 'white', cursor: 'pointer', fontSize: '16px',
};`,
  },
  "/index.jsx": {
    code: `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
const root = createRoot(document.getElementById('root'));
root.render(<App />);`,
  },
  "/public/index.html": {
    code: `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>React Playground</title></head><body><div id="root"></div></body></html>`,
  },
};

const SETUP = {
  dependencies: { react: "^18.0.0", "react-dom": "^18.0.0" },
  entry: "/index.jsx",
  environment: "create-react-app" as const,
};

export function ReactPlayground() {
  const [key, setKey] = useState(0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-1.5 border-b bg-muted/20 text-xs shrink-0">
        <span className="font-medium">React Sandbox</span>
        <span className="text-muted-foreground">— React 18, ES2022</span>
        <div className="flex-1" />
        <button
          onClick={() => setKey((k) => k + 1)}
          className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
          title="Reset"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex-1 overflow-hidden" key={key}>
        {typeof window !== "undefined" && (
          <SandpackProvider
            template="react"
            files={FILES}
            theme={aquaBlue}
            customSetup={SETUP}
            options={{ visibleFiles: ["/App.jsx", "/index.jsx"], activeFile: "/App.jsx" }}
          >
            <SandpackLayout style={{ borderRadius: 0, border: "none", height: "100%" }}>
              <SandpackFileExplorer style={{ height: "100%", minWidth: "150px" }} />
              <SandpackCodeEditor
                style={{ height: "100%" }}
                showLineNumbers
                showInlineErrors
                showTabs
              />
              <SandpackPreview style={{ height: "100%" }} showRefreshButton showOpenInCodeSandbox />
            </SandpackLayout>
          </SandpackProvider>
        )}
      </div>
    </div>
  );
}
