import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Eye, Loader2, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BlockRenderer } from "@/components/wcms/BlockRenderer";
import { wcmsListBlocks } from "@/lib/wcms.functions";

type WcmsBlock = {
  id: string;
  block_type: string;
  label: string | null;
  content: any;
  sort_order: number;
  visible: boolean;
};

export function PagePreviewDialog({
  pageId,
  pageTitle,
  open,
  onOpenChange,
}: {
  pageId: string;
  pageTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const listBlocksFn = useServerFn(wcmsListBlocks);

  const { data: blocks = [], isLoading } = useQuery({
    enabled: open && !!pageId,
    queryKey: ["wcms-blocks-preview", pageId],
    queryFn: () => listBlocksFn({ data: { pageId } }),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" /> Preview: {pageTitle}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (blocks as WcmsBlock[]).length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No blocks to preview. Add some blocks first.
            </div>
          ) : (
            <div className="bg-background">
              <BlockRenderer blocks={(blocks as WcmsBlock[]).filter((b) => b.visible)} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
