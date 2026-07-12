import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Eye, Edit3, Share2, Trash2, Copy, MoreVertical, Download, Award } from "lucide-react";
import { Certificate } from "./types";

type Props = {
  cert: Certificate;
  onPreview: (c: Certificate) => void;
  onEdit: (c: Certificate) => void;
  onShare: (c: Certificate) => void;
  onDuplicate: (c: Certificate) => void;
  onExport: (c: Certificate) => void;
  onDelete: (c: Certificate) => void;
};

export function CertificatePreviewCard({
  cert,
  onPreview,
  onEdit,
  onShare,
  onDuplicate,
  onExport,
  onDelete,
}: Props) {
  return (
    <Card className="group overflow-hidden border border-border/40 hover:border-primary/30 hover:shadow-lg transition-all duration-200">
      <div
        className="aspect-[1.414] bg-gradient-to-br from-slate-50 to-slate-100 relative cursor-pointer overflow-hidden"
        onClick={() => onPreview(cert)}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <Award className="h-8 w-8 text-primary/30 mb-2" />
          <h3 className="font-semibold text-sm text-foreground/80">{cert.title}</h3>
          {cert.courseTitle && (
            <p className="text-xs text-muted-foreground mt-1">{cert.courseTitle}</p>
          )}
        </div>
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
      </div>

      <div className="p-3 space-y-2">
        <div>
          <h3 className="font-semibold text-sm truncate">{cert.title}</h3>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {cert.courseTitle || "General"} · {cert.status === "active" ? "Published" : "Draft"}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => onPreview(cert)}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => onEdit(cert)}>
              <Edit3 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => onShare(cert)}>
              <Share2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onDuplicate(cert)}>
                <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport(cert)}>
                <Download className="h-3.5 w-3.5 mr-2" /> Export
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(cert)} className="text-destructive">
                <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
