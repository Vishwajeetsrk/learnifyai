import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Send,
  Loader2,
  Copy,
  Check,
  ChevronDown,
  Plus,
  Trash2,
  Globe,
  Lock,
  Clock,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RequestParam {
  key: string;
  value: string;
  enabled: boolean;
}

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  size: string;
}

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

const COMMON_HEADERS = [
  "Content-Type",
  "Authorization",
  "Accept",
  "User-Agent",
  "Cache-Control",
  "X-Requested-With",
];

const CONTENT_TYPES = [
  "application/json",
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain",
  "text/xml",
  "application/xml",
];

export function APITesterPanel() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [headers, setHeaders] = useState<RequestParam[]>([
    { key: "Content-Type", value: "application/json", enabled: true },
  ]);
  const [body, setBody] = useState("{\n  \n}");
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"headers" | "body" | "params">("headers");
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [history, setHistory] = useState<
    { method: string; url: string; status: number; time: number }[]
  >([]);

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "", enabled: true }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: keyof RequestParam, value: string | boolean) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    setHeaders(newHeaders);
  };

  const sendRequest = async () => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      const requestHeaders: Record<string, string> = {};
      headers
        .filter((h) => h.enabled && h.key)
        .forEach((h) => {
          requestHeaders[h.key] = h.value;
        });

      const fetchOptions: RequestInit = {
        method,
        headers: requestHeaders,
      };

      if (["POST", "PUT", "PATCH"].includes(method) && body) {
        fetchOptions.body = body;
      }

      const res = await fetch(url, fetchOptions);
      const endTime = Date.now();
      const responseBody = await res.text();

      // Calculate response size
      const sizeBytes = new Blob([responseBody]).size;
      let sizeStr: string;
      if (sizeBytes < 1024) {
        sizeStr = `${sizeBytes} B`;
      } else if (sizeBytes < 1024 * 1024) {
        sizeStr = `${(sizeBytes / 1024).toFixed(1)} KB`;
      } else {
        sizeStr = `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
      }

      // Parse response headers
      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const apiResponse: ApiResponse = {
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: responseBody,
        time: endTime - startTime,
        size: sizeStr,
      };

      setResponse(apiResponse);

      // Add to history
      setHistory((prev) => [
        { method, url, status: res.status, time: endTime - startTime },
        ...prev.slice(0, 9),
      ]);
    } catch (error: any) {
      setResponse({
        status: 0,
        statusText: "Error",
        headers: {},
        body: error.message || "Request failed",
        time: Date.now() - startTime,
        size: "0 B",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response.body);
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-500";
    if (status >= 300 && status < 400) return "text-yellow-500";
    if (status >= 400 && status < 500) return "text-orange-500";
    if (status >= 500) return "text-red-500";
    return "text-muted-foreground";
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "POST":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "PUT":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "PATCH":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "DELETE":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b">
        <Globe className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm">API Tester</span>
      </div>

      {/* Request Builder */}
      <div className="p-3 border-b space-y-3">
        {/* URL Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className={cn("w-24 justify-between font-mono", getMethodColor(method))}
              onClick={() => setShowMethodDropdown(!showMethodDropdown)}
            >
              {method}
              <ChevronDown className="h-4 w-4" />
            </Button>
            {showMethodDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMethodDropdown(false)} />
                <div className="absolute top-full left-0 mt-1 w-24 bg-popover border rounded-md shadow-lg z-50 py-1">
                  {HTTP_METHODS.map((m) => (
                    <button
                      key={m}
                      className={cn(
                        "w-full px-3 py-1.5 text-sm text-left hover:bg-accent font-mono",
                        m === method && "bg-accent",
                      )}
                      onClick={() => {
                        setMethod(m);
                        setShowMethodDropdown(false);
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter request URL..."
            className="flex-1 bg-background border rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <Button
            onClick={sendRequest}
            disabled={isLoading || !url}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b">
          {(["headers", "body", "params"] as const).map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-none border-b-2 -mb-[1px]",
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground",
              )}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "headers" && headers.length > 0 && (
                <span className="ml-1 text-xs">({headers.length})</span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-3">
        {activeTab === "headers" && (
          <div className="space-y-2">
            {headers.map((header, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={header.enabled}
                  onChange={(e) => updateHeader(index, "enabled", e.target.checked)}
                  className="h-4 w-4"
                />
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) => updateHeader(index, "key", e.target.value)}
                  placeholder="Header name"
                  className="flex-1 bg-background border rounded px-2 py-1 text-sm font-mono"
                />
                <input
                  type="text"
                  value={header.value}
                  onChange={(e) => updateHeader(index, "value", e.target.value)}
                  placeholder="Value"
                  className="flex-1 bg-background border rounded px-2 py-1 text-sm font-mono"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeHeader(index)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addHeader}>
              <Plus className="h-4 w-4 mr-1" />
              Add Header
            </Button>
          </div>
        )}

        {activeTab === "body" && (
          <div className="h-full">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter request body..."
              className="w-full h-full min-h-[200px] bg-background border rounded-md p-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {activeTab === "params" && (
          <div className="text-center text-muted-foreground py-8">
            <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Query parameters</p>
            <p className="text-xs mt-2">Add parameters to the URL or use the params tab</p>
          </div>
        )}
      </div>

      {/* Response */}
      {response && (
        <div className="border-t">
          <div className="flex items-center justify-between px-3 py-2 bg-muted/50">
            <div className="flex items-center gap-4">
              <span className={cn("font-mono font-bold", getStatusColor(response.status))}>
                {response.status} {response.statusText}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {response.time}ms
              </span>
              <span className="text-xs text-muted-foreground">{response.size}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={copyResponse} className="h-7 px-2">
              {copiedResponse ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          <div className="max-h-[300px] overflow-auto">
            <pre className="p-3 text-xs font-mono whitespace-pre-wrap break-words bg-[#1e1e1e] text-zinc-300">
              {response.body}
            </pre>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="border-t">
          <div className="px-3 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground">
            Recent Requests
          </div>
          <div className="max-h-[150px] overflow-auto">
            {history.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-3 py-2 text-xs hover:bg-muted/50 cursor-pointer"
                onClick={() => {
                  setMethod(item.method);
                  setUrl(item.url);
                }}
              >
                <span
                  className={cn("font-mono font-bold", getMethodColor(item.method).split(" ")[1])}
                >
                  {item.method}
                </span>
                <span className="flex-1 truncate font-mono text-muted-foreground">{item.url}</span>
                <span className={cn("font-mono", getStatusColor(item.status))}>{item.status}</span>
                <span className="text-muted-foreground">{item.time}ms</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
