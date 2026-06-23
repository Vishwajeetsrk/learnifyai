import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  CloudUpload,
  X,
  Check,
  AlertCircle,
  RotateCcw,
  Trash2,
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  FileArchive,
  FileCode,
  File,
  Pause,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { UploadItem } from "@/hooks/use-upload";
import { formatFileSize, formatSpeed, formatETA } from "@/hooks/use-upload";

interface PremiumDropzoneProps {
  /** Accepted file types */
  accept?: string[];
  /** Max file size in bytes */
  maxSize?: number;
  /** Max number of files */
  maxFiles?: number;
  /** Whether multiple files are allowed */
  multiple?: boolean;
  /** Upload context label */
  label?: string;
  /** Description text */
  description?: string;
  /** Compact mode (fewer props needed) */
  compact?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom class */
  className?: string;
  /** Upload items from useUpload hook */
  items?: UploadItem[];
  /** Callback when files are dropped/selected */
  onFiles?: (files: File[]) => void;
  /** Callback to remove an item */
  onRemove?: (id: string) => void;
  /** Callback to retry a failed item */
  onRetry?: (id: string) => void;
  /** Callback to cancel an item */
  onCancel?: (id: string) => void;
  /** Overall progress 0-100 */
  totalProgress?: number;
  /** Whether upload is in progress */
  isUploading?: boolean;
}

function getFileIcon(category: string) {
  switch (category) {
    case "image":
      return <FileImage className="h-5 w-5" />;
    case "video":
      return <FileVideo className="h-5 w-5" />;
    case "audio":
      return <FileAudio className="h-5 w-5" />;
    case "document":
      return <FileText className="h-5 w-5" />;
    case "archive":
      return <FileArchive className="h-5 w-5" />;
    case "code":
      return <FileCode className="h-5 w-5" />;
    default:
      return <File className="h-5 w-5" />;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <Check className="h-4 w-4 text-emerald-500" />;
    case "failed":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "cancelled":
      return <X className="h-4 w-4 text-muted-foreground" />;
    case "uploading":
      return (
        <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      );
    default:
      return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "text-emerald-500";
    case "failed":
      return "text-red-500";
    case "cancelled":
      return "text-muted-foreground";
    case "uploading":
      return "text-primary";
    default:
      return "text-muted-foreground";
  }
}

function FileCard({
  item,
  onRemove,
  onRetry,
  onCancel,
}: {
  item: UploadItem;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  onCancel?: (id: string) => void;
}) {
  const ext = item.file.name.split(".").pop()?.toUpperCase() || "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative flex items-center gap-3 p-3 rounded-xl border bg-card transition-all",
        item.status === "completed" && "border-emerald-200 dark:border-emerald-800",
        item.status === "failed" && "border-red-200 dark:border-red-800",
        item.status === "uploading" && "border-primary/30 shadow-sm",
      )}
    >
      {/* Preview / Icon */}
      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
        {item.preview_url && item.category === "image" ? (
          <img
            src={item.preview_url}
            alt={item.sanitized_name}
            className="h-full w-full object-cover"
          />
        ) : item.preview_url && item.category === "video" ? (
          <div className="relative h-full w-full">
            <video src={item.preview_url} className="h-full w-full object-cover" muted />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Play className="h-4 w-4 text-white" fill="white" />
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">{getFileIcon(item.category)}</div>
        )}
        {/* Extension badge */}
        <span className="absolute bottom-0.5 right-0.5 text-[8px] font-bold bg-background/90 backdrop-blur-sm px-1 rounded">
          {ext}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.sanitized_name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-muted-foreground">
            {formatFileSize(item.total_bytes)}
          </span>
          {item.dimensions && (
            <span className="text-[11px] text-muted-foreground">
              {item.dimensions.width}x{item.dimensions.height}
            </span>
          )}
          {item.duration && item.duration > 0 && (
            <span className="text-[11px] text-muted-foreground">
              {Math.floor(item.duration / 60)}:
              {String(Math.floor(item.duration % 60)).padStart(2, "0")}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {(item.status === "uploading" || item.status === "processing") && (
          <div className="mt-2 space-y-1">
            <Progress value={item.progress} className="h-1.5" />
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{item.progress}%</span>
              <span>{formatSpeed(item.speed)}</span>
              <span>ETA {formatETA(item.eta)}</span>
            </div>
          </div>
        )}

        {/* Status text */}
        {item.status === "completed" && (
          <p className="text-[11px] text-emerald-500 mt-1">Uploaded successfully</p>
        )}
        {item.status === "failed" && (
          <p className="text-[11px] text-red-500 mt-1 truncate">{item.error || "Upload failed"}</p>
        )}
        {item.status === "cancelled" && (
          <p className="text-[11px] text-muted-foreground mt-1">Cancelled</p>
        )}
      </div>

      {/* Status icon + actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {getStatusIcon(item.status)}

        {item.status === "uploading" && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onCancel?.(item.id)}
          >
            <Pause className="h-3.5 w-3.5" />
          </Button>
        )}

        {item.status === "failed" && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onRetry?.(item.id)}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        )}

        {(item.status === "completed" ||
          item.status === "failed" ||
          item.status === "cancelled") && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onRemove?.(item.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export function PremiumDropzone({
  accept = ["image/*", "video/*", "audio/*", ".pdf", ".doc", ".docx"],
  maxSize = 50 * 1024 * 1024,
  maxFiles = 10,
  multiple = true,
  label = "Upload files",
  description,
  compact = false,
  disabled = false,
  className,
  items = [],
  onFiles,
  onRemove,
  onRetry,
  onCancel,
  totalProgress = 0,
  isUploading = false,
}: PremiumDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCountRef = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current++;
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current--;
    if (dragCountRef.current === 0) setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCountRef.current = 0;
      setIsDragOver(false);
      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) onFiles?.(files);
    },
    [disabled, onFiles],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) onFiles?.(files);
      e.target.value = "";
    },
    [onFiles],
  );

  const acceptHint = accept
    .map((a) => (a.startsWith(".") ? a.toUpperCase() : a.replace("/*", "")))
    .join(", ");

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop zone */}
      <motion.div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        animate={{
          scale: isDragOver ? 1.02 : 1,
          borderColor: isDragOver ? "hsl(var(--primary))" : "hsl(var(--border))",
        }}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 transition-colors cursor-pointer",
          "hover:border-primary/50 hover:bg-muted/30",
          isDragOver && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed",
          compact && "p-5",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept.join(",")}
          multiple={multiple}
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled}
        />

        <motion.div
          animate={{
            scale: isDragOver ? 1.2 : 1,
            y: isDragOver ? -5 : 0,
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {isDragOver ? (
            <CloudUpload className="h-12 w-12 text-primary" />
          ) : (
            <Upload className="h-12 w-12 text-muted-foreground/50" />
          )}
        </motion.div>

        <div className="text-center">
          <p className={cn("font-semibold", compact ? "text-sm" : "text-base")}>
            {isDragOver ? "Drop your files here" : label}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {description || `Drag & drop or click to browse`}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <span>Max {formatFileSize(maxSize)}</span>
          <span className="h-3 w-px bg-border" />
          <span>{acceptHint}</span>
          {maxFiles > 1 && (
            <>
              <span className="h-3 w-px bg-border" />
              <span>Up to {maxFiles} files</span>
            </>
          )}
        </div>

        {/* Drag overlay */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl bg-primary/5 border-2 border-primary pointer-events-none"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Overall progress */}
      {isUploading && items.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Uploading {items.filter((i) => i.status === "uploading").length} of {items.length}{" "}
              files
            </span>
            <span className="font-medium">{totalProgress}%</span>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </div>
      )}

      {/* File cards */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-2">
          {items.map((item) => (
            <FileCard
              key={item.id}
              item={item}
              onRemove={onRemove}
              onRetry={onRetry}
              onCancel={onCancel}
            />
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}

export { FileCard };
