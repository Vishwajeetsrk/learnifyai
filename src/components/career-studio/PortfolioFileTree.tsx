"use client";

import React, { useState } from "react";
import {
  FolderPlus,
  FilePlus,
  Trash2,
  Edit2,
  Copy,
  Scissors,
  ClipboardPaste,
  Check,
  X,
  FileCode,
  FileText,
  FileJson,
  Layers,
  Sparkles,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface VirtualFileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string; // e.g. "index.html", "css/style.css"
  extension?: string;
  content?: string;
  children?: VirtualFileNode[];
}

interface PortfolioFileTreeProps {
  files: VirtualFileNode[];
  activeFilePath: string;
  onSelectFile: (path: string) => void;
  onCreateFile: (parentPath?: string) => void;
  onCreateFolder: (parentPath?: string) => void;
  onRename: (path: string, newName: string) => void;
  onDelete: (path: string) => void;
  onCopy: (path: string) => void;
  onCut: (path: string) => void;
  onPaste: (destinationPath?: string) => void;
  canPaste: boolean;
  className?: string;
}

const getFileIcon = (extension?: string) => {
  switch (extension) {
    case "html":
      return { color: "text-orange-500 dark:text-orange-400", label: "HTML", symbol: "🌐" };
    case "css":
      return { color: "text-sky-500 dark:text-sky-400", label: "CSS", symbol: "◈" };
    case "js":
      return { color: "text-amber-400 dark:text-amber-300", label: "JS", symbol: "⚡" };
    case "ts":
    case "tsx":
      return { color: "text-blue-500 dark:text-blue-400", label: "TS", symbol: "◆" };
    case "json":
      return { color: "text-emerald-500 dark:text-emerald-400", label: "JSON", symbol: "{}" };
    case "md":
      return { color: "text-slate-400 dark:text-slate-300", label: "MD", symbol: "◊" };
    case "png":
    case "jpg":
    case "svg":
      return { color: "text-pink-500 dark:text-pink-400", label: "IMG", symbol: "◐" };
    default:
      return { color: "text-muted-foreground", label: "TXT", symbol: "◇" };
  }
};

interface FileItemRowProps {
  node: VirtualFileNode;
  depth: number;
  isLast: boolean;
  parentPath: boolean[];
  activeFilePath: string;
  onSelectFile: (path: string) => void;
  onCreateFile: (parentPath?: string) => void;
  onCreateFolder: (parentPath?: string) => void;
  onRename: (path: string, newName: string) => void;
  onDelete: (path: string) => void;
  onCopy: (path: string) => void;
  onCut: (path: string) => void;
  onPaste: (destinationPath?: string) => void;
  canPaste: boolean;
}

function FileItemRow({
  node,
  depth,
  isLast,
  parentPath,
  activeFilePath,
  onSelectFile,
  onCreateFile,
  onCreateFolder,
  onRename,
  onDelete,
  onCopy,
  onCut,
  onPaste,
  canPaste,
}: FileItemRowProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState(node.name);

  const isFolder = node.type === "folder";
  const hasChildren = isFolder && node.children && node.children.length > 0;
  const isSelected = !isFolder && activeFilePath === node.path;
  const fileIcon = getFileIcon(node.extension);

  const handleRenameSubmit = () => {
    const trimmed = renameVal.trim();
    if (!trimmed) {
      setRenameVal(node.name);
      setIsRenaming(false);
      return;
    }
    if (trimmed !== node.name) {
      onRename(node.path, trimmed);
    }
    setIsRenaming(false);
  };

  return (
    <div className="select-none">
      <div
        className={cn(
          "group relative flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer text-xs font-mono transition-all duration-150",
          isSelected
            ? "bg-primary/15 text-primary font-semibold border-l-2 border-primary"
            : isHovered
              ? "bg-muted/80 text-foreground"
              : "text-muted-foreground hover:text-foreground",
        )}
        onClick={() => {
          if (isFolder) setIsOpen(!isOpen);
          else onSelectFile(node.path);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
      >
        {/* Tree connection lines */}
        {depth > 0 && (
          <div
            className="absolute left-0 top-0 bottom-0 flex"
            style={{ left: `${(depth - 1) * 14 + 14}px` }}
          >
            <div
              className={cn(
                "w-px transition-colors duration-150",
                isSelected || isHovered ? "bg-primary/50" : "bg-border/60",
              )}
            />
          </div>
        )}

        {/* Folder expander chevron or file symbol */}
        <div
          className={cn(
            "flex items-center justify-center w-3.5 h-3.5 shrink-0 transition-transform duration-200",
            isFolder && isOpen && "rotate-90",
          )}
        >
          {isFolder ? (
            <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
          ) : (
            <span className={cn("text-[10px] font-bold", fileIcon.color)}>{fileIcon.symbol}</span>
          )}
        </div>

        {/* Visual Folder / File Icon */}
        <div
          className={cn(
            "flex items-center justify-center w-4 h-4 shrink-0 transition-all duration-150",
            isFolder
              ? isHovered || isOpen
                ? "text-amber-500 scale-105"
                : "text-amber-500/80"
              : cn(fileIcon.color, isHovered && "scale-105"),
          )}
        >
          {isFolder ? (
            <svg width="14" height="12" viewBox="0 0 16 14" fill="currentColor">
              <path d="M1.5 1C0.671573 1 0 1.67157 0 2.5V11.5C0 12.3284 0.671573 13 1.5 13H14.5C15.3284 13 16 12.3284 16 11.5V4.5C16 3.67157 15.3284 3 14.5 3H8L6.5 1H1.5Z" />
            </svg>
          ) : (
            <FileCode className="h-3.5 w-3.5 opacity-90" />
          )}
        </div>

        {/* Node Name or Inline Rename Input */}
        <div className="flex-1 min-w-0 pr-1">
          {isRenaming ? (
            <div
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                autoFocus
                value={renameVal}
                onChange={(e) => setRenameVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameSubmit();
                  if (e.key === "Escape") {
                    setRenameVal(node.name);
                    setIsRenaming(false);
                  }
                }}
                className="h-5 px-1 py-0 text-xs font-mono bg-background border border-primary rounded text-foreground w-full outline-none"
              />
              <button
                type="button"
                onClick={handleRenameSubmit}
                className="p-0.5 text-emerald-500 hover:text-emerald-400"
              >
                <Check className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setRenameVal(node.name);
                  setIsRenaming(false);
                }}
                className="p-0.5 text-rose-500 hover:text-rose-400"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <span
              className={cn(
                "truncate block text-[11px]",
                isSelected ? "text-primary font-semibold" : "text-foreground/90",
              )}
            >
              {node.name}
            </span>
          )}
        </div>

        {/* Action Menu Trigger (Visible on hover or active) */}
        {!isRenaming && (
          <div
            className={cn(
              "flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
              (isSelected || isHovered) && "opacity-100",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                  title="File Actions"
                >
                  <MoreVertical className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 text-xs font-mono">
                {isFolder && (
                  <>
                    <DropdownMenuItem onClick={() => onCreateFile(node.path)}>
                      <FilePlus className="h-3.5 w-3.5 mr-2 text-indigo-400" /> New File Here
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCreateFolder(node.path)}>
                      <FolderPlus className="h-3.5 w-3.5 mr-2 text-amber-400" /> New Folder Here
                    </DropdownMenuItem>
                    {canPaste && (
                      <DropdownMenuItem onClick={() => onPaste(node.path)}>
                        <ClipboardPaste className="h-3.5 w-3.5 mr-2 text-emerald-400" /> Paste Inside
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => setIsRenaming(true)}>
                  <Edit2 className="h-3.5 w-3.5 mr-2 text-blue-400" /> Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCopy(node.path)}>
                  <Copy className="h-3.5 w-3.5 mr-2 text-slate-400" /> Copy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCut(node.path)}>
                  <Scissors className="h-3.5 w-3.5 mr-2 text-violet-400" /> Cut (Move)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(node.path)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Children elements with smooth height transition */}
      {hasChildren && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-200 ease-out",
            isOpen ? "opacity-100" : "opacity-0 h-0",
          )}
          style={{
            maxHeight: isOpen ? `${node.children!.length * 150}px` : "0px",
          }}
        >
          {node.children!.map((child, index) => (
            <FileItemRow
              key={child.id || child.path}
              node={child}
              depth={depth + 1}
              isLast={index === node.children!.length - 1}
              parentPath={[...parentPath, !isLast]}
              activeFilePath={activeFilePath}
              onSelectFile={onSelectFile}
              onCreateFile={onCreateFile}
              onCreateFolder={onCreateFolder}
              onRename={onRename}
              onDelete={onDelete}
              onCopy={onCopy}
              onCut={onCut}
              onPaste={onPaste}
              canPaste={canPaste}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function PortfolioFileTree({
  files,
  activeFilePath,
  onSelectFile,
  onCreateFile,
  onCreateFolder,
  onRename,
  onDelete,
  onCopy,
  onCut,
  onPaste,
  canPaste,
  className,
}: PortfolioFileTreeProps) {
  return (
    <div
      className={cn(
        "bg-slate-950/70 border border-border/60 rounded-xl overflow-hidden flex flex-col font-mono",
        className,
      )}
    >
      {/* Explorer macOS Window Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
          </div>
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1.5">
            EXPLORER
          </span>
        </div>

        {/* Global Toolbar buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onCreateFile()}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/80 transition cursor-pointer"
            title="New File (Root)"
          >
            <FilePlus className="h-3.5 w-3.5 text-indigo-400" />
          </button>
          <button
            type="button"
            onClick={() => onCreateFolder()}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/80 transition cursor-pointer"
            title="New Folder (Root)"
          >
            <FolderPlus className="h-3.5 w-3.5 text-amber-400" />
          </button>
          {canPaste && (
            <button
              type="button"
              onClick={() => onPaste()}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/80 transition cursor-pointer"
              title="Paste to Root"
            >
              <ClipboardPaste className="h-3.5 w-3.5 text-emerald-400" />
            </button>
          )}
        </div>
      </div>

      {/* Tree Content list */}
      <div className="p-2 space-y-0.5 overflow-y-auto max-h-[500px]">
        {files.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground">
            No files in workspace.
          </div>
        ) : (
          files.map((node, index) => (
            <FileItemRow
              key={node.id || node.path}
              node={node}
              depth={0}
              isLast={index === files.length - 1}
              parentPath={[]}
              activeFilePath={activeFilePath}
              onSelectFile={onSelectFile}
              onCreateFile={onCreateFile}
              onCreateFolder={onCreateFolder}
              onRename={onRename}
              onDelete={onDelete}
              onCopy={onCopy}
              onCut={onCut}
              onPaste={onPaste}
              canPaste={canPaste}
            />
          ))
        )}
      </div>
    </div>
  );
}
