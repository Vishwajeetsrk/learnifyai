import { useState, useRef, useCallback, useEffect } from "react";
import {
  FileText,
  Download,
  ExternalLink,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getFileType(
  url: string,
  mimeType?: string,
): "pdf" | "docx" | "image" | "text" | "unknown" {
  if (mimeType?.includes("pdf") || url.toLowerCase().endsWith(".pdf")) return "pdf";
  if (
    mimeType?.includes("word") ||
    mimeType?.includes("document") ||
    url.toLowerCase().endsWith(".docx") ||
    url.toLowerCase().endsWith(".doc")
  )
    return "docx";
  if (mimeType?.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i.test(url))
    return "image";
  if (
    mimeType?.startsWith("text/") ||
    /\.(txt|csv|json|xml|html|css|js|ts|py|java|cpp|c|rs|go|rb|php|md)$/i.test(url)
  )
    return "text";
  return "unknown";
}

function getFileName(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    return decodeURIComponent(pathname.split("/").pop() || "file");
  } catch {
    return url.split("/").pop() || "file";
  }
}

function PdfPreview({ url, fileName }: { url: string; fileName: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn("flex flex-col h-full", fullscreen && "fixed inset-0 z-50 bg-background")}>
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b bg-card shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 text-red-500 shrink-0" />
          <span className="text-xs font-medium truncate">{fileName}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            title="Zoom out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="text-[10px] font-mono min-w-[36px] text-center">{zoom}%</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            title="Zoom in"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <div className="h-4 w-px bg-border mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            title="Rotate"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setFullscreen(!fullscreen)}
            title="Toggle fullscreen"
          >
            {fullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
          <div className="h-4 w-px bg-border mx-1" />
          <a href={url} target="_blank" rel="noopener noreferrer" download={fileName}>
            <Button variant="ghost" size="icon" className="h-7 w-7" title="Download">
              <Download className="h-3.5 w-3.5" />
            </Button>
          </a>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-7 w-7" title="Open in new tab">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
        </div>
      </div>
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-zinc-100 dark:bg-zinc-900 flex items-start justify-center p-4"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {error ? (
          <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
            <AlertTriangle className="h-8 w-8" />
            <p className="text-sm">Could not load PDF preview.</p>
            <a href={url} target="_blank" rel="noopener noreferrer" download={fileName}>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" /> Download instead
              </Button>
            </a>
          </div>
        ) : (
          <iframe
            src={`${url}#page=${page}&zoom=${zoom / 100}`}
            className="w-full h-full border-0 rounded-lg shadow-lg bg-white"
            style={{
              minHeight: fullscreen ? "100vh" : "500px",
              transform: `rotate(${rotation}deg)`,
              transformOrigin: "center center",
            }}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            title={fileName}
          />
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 px-3 py-2 border-t bg-card shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function DocxPreview({ url, fileName }: { url: string; fileName: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const docxviewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b bg-card shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 text-blue-500 shrink-0" />
          <span className="text-xs font-medium truncate">{fileName}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <a href={url} target="_blank" rel="noopener noreferrer" download={fileName}>
            <Button variant="ghost" size="icon" className="h-7 w-7" title="Download">
              <Download className="h-3.5 w-3.5" />
            </Button>
          </a>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-7 w-7" title="Open in new tab">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
        </div>
      </div>
      <div className="flex-1 relative bg-white">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {error ? (
          <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
            <AlertTriangle className="h-8 w-8" />
            <p className="text-sm">Could not load document preview.</p>
            <p className="text-xs text-muted-foreground">
              Try opening in a new tab or downloading.
            </p>
            <div className="flex gap-2">
              <a href={url} target="_blank" rel="noopener noreferrer" download={fileName}>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </a>
              <a href={docxviewerUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" /> Open in Viewer
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <iframe
            src={docxviewerUrl}
            className="w-full h-full border-0"
            style={{ minHeight: "500px" }}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            title={fileName}
          />
        )}
      </div>
    </div>
  );
}

function ImagePreview({ url, fileName }: { url: string; fileName: string }) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className={cn("flex flex-col h-full", fullscreen && "fixed inset-0 z-50 bg-background")}>
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b bg-card shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 text-purple-500 shrink-0" />
          <span className="text-xs font-medium truncate">{fileName}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setZoom(Math.max(25, zoom - 25))}
            title="Zoom out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="text-[10px] font-mono min-w-[36px] text-center">{zoom}%</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setZoom(Math.min(300, zoom + 25))}
            title="Zoom in"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            title="Rotate"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setFullscreen(!fullscreen)}
            title="Toggle fullscreen"
          >
            {fullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
          <div className="h-4 w-px bg-border mx-1" />
          <a href={url} target="_blank" rel="noopener noreferrer" download={fileName}>
            <Button variant="ghost" size="icon" className="h-7 w-7" title="Download">
              <Download className="h-3.5 w-3.5" />
            </Button>
          </a>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center p-4">
        <img
          src={url}
          alt={fileName}
          className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-transform"
          loading="lazy"
          decoding="async"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: "center center",
          }}
        />
      </div>
    </div>
  );
}

function TextPreview({ url, fileName }: { url: string; fileName: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [url]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b bg-card shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 text-green-500 shrink-0" />
          <span className="text-xs font-medium truncate">{fileName}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <a href={url} target="_blank" rel="noopener noreferrer" download={fileName}>
            <Button variant="ghost" size="icon" className="h-7 w-7" title="Download">
              <Download className="h-3.5 w-3.5" />
            </Button>
          </a>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 bg-card">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
            <AlertTriangle className="h-8 w-8" />
            <p className="text-sm">Could not load file content.</p>
            <a href={url} target="_blank" rel="noopener noreferrer" download={fileName}>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" /> Download instead
              </Button>
            </a>
          </div>
        )}
        {!loading && !error && (
          <pre className="text-xs font-mono whitespace-pre-wrap text-foreground leading-relaxed">
            {content}
          </pre>
        )}
      </div>
    </div>
  );
}

function FallbackPreview({ url, fileName }: { url: string; fileName: string }) {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-4">
      <FileText className="h-12 w-12 text-muted-foreground" />
      <div>
        <p className="text-sm font-medium">{fileName}</p>
        <p className="text-xs text-muted-foreground mt-1">Preview not available for .{ext} files</p>
      </div>
      <div className="flex gap-2">
        <a href={url} target="_blank" rel="noopener noreferrer" download={fileName}>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
        </a>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" /> Open
          </Button>
        </a>
      </div>
    </div>
  );
}

interface FilePreviewProps {
  url: string;
  mimeType?: string;
  fileName?: string;
  className?: string;
}

export function FilePreview({
  url,
  mimeType,
  fileName: overrideName,
  className,
}: FilePreviewProps) {
  const fileType = getFileType(url, mimeType);
  const fileName = overrideName || getFileName(url);

  const wrapperClass = cn(
    "h-full min-h-[300px] rounded-xl border overflow-hidden bg-card",
    className,
  );

  switch (fileType) {
    case "pdf":
      return (
        <div className={wrapperClass}>
          <PdfPreview url={url} fileName={fileName} />
        </div>
      );
    case "docx":
      return (
        <div className={wrapperClass}>
          <DocxPreview url={url} fileName={fileName} />
        </div>
      );
    case "image":
      return (
        <div className={wrapperClass}>
          <ImagePreview url={url} fileName={fileName} />
        </div>
      );
    case "text":
      return (
        <div className={wrapperClass}>
          <TextPreview url={url} fileName={fileName} />
        </div>
      );
    default:
      return <FallbackPreview url={url} fileName={fileName} />;
  }
}
