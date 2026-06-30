import { useState, useRef } from "react";
import { Upload, FileText, Loader2, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { parseResumeFile } from "@/lib/file-parser";
import { toast } from "sonner";

interface ResumeFileUploadProps {
  onTextExtracted: (text: string) => void;
  label?: string;
  className?: string;
}

export function ResumeFileUpload({ onTextExtracted, label, className }: ResumeFileUploadProps) {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const ext = file.name.toLowerCase().split(".").pop();
    if (!["pdf", "docx", "doc", "txt"].includes(ext || "")) {
      setError("Unsupported format. Upload PDF, DOCX, or TXT.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Max 10MB.");
      return;
    }

    setLoading(true);
    setError(null);
    setFileName(file.name);
    try {
      const text = await parseResumeFile(file);
      if (text.trim().length < 20) {
        setError("Could not extract enough text from the file.");
        setLoading(false);
        return;
      }
      onTextExtracted(text);
      toast.success(`Extracted text from ${file.name}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file.");
      setFileName(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="text-xs text-muted-foreground font-medium">{label}</p>}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-colors",
          loading ? "border-primary/30 bg-primary/5" : error ? "border-red-300 bg-red-50 dark:bg-red-950/20" : fileName ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20" : "border-muted-foreground/20 hover:border-primary/40 hover:bg-accent/50",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleChange}
          className="hidden"
        />

        {loading ? (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Parsing {fileName}...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
            <Button variant="ghost" size="sm" className="text-xs h-6" onClick={(e) => { e.stopPropagation(); setError(null); }}>
              Try again
            </Button>
          </div>
        ) : fileName ? (
          <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
            <Check className="h-4 w-4" />
            <FileText className="h-4 w-4" />
            {fileName}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Drop a resume file or <span className="text-primary font-medium">browse</span>
            </span>
            <span className="text-[10px] text-muted-foreground/60">PDF, DOCX, TXT up to 10MB</span>
          </div>
        )}
      </div>
    </div>
  );
}
