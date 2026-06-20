import { useState } from "react";
import { ChevronDown, File, Folder, FolderOpen, Plus, Trash2, Edit3 } from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  path: string;
  language: string;
}

interface FileExplorerProps {
  files: FileItem[];
  activeFileId: string | null;
  onSelectFile: (id: string) => void;
  onNewFile: () => void;
  onDeleteFile: (id: string) => void;
  onRenameFile: (id: string, name: string) => void;
}

const LANG_ICONS: Record<string, string> = {
  javascript: "https://cdn.simpleicons.org/javascript/F7DF1E",
  typescript: "https://cdn.simpleicons.org/typescript/3178C6",
  html: "https://cdn.simpleicons.org/html5/E34F26",
  css: "https://cdn.simpleicons.org/css3/1572B6",
  jsx: "https://cdn.simpleicons.org/react/61DAFB",
  python: "https://cdn.simpleicons.org/python/3776AB",
  json: "https://cdn.simpleicons.org/json/000000",
  markdown: "https://cdn.simpleicons.org/markdown/000000",
  xml: "https://cdn.simpleicons.org/xml/000000",
  shell: "https://cdn.simpleicons.org/gnubash/4EAA25",
};

export function FileExplorer({
  files,
  activeFileId,
  onSelectFile,
  onNewFile,
  onDeleteFile,
  onRenameFile,
}: FileExplorerProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  return (
    <div className="h-full flex flex-col bg-[#252526] border-r border-[#333]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#333] text-[11px] text-[#888]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1 hover:text-[#ccc]"
        >
          {collapsed ? <Folder className="h-3 w-3" /> : <FolderOpen className="h-3 w-3" />}
          <span className="font-medium">Explorer</span>
        </button>
        <button
          onClick={onNewFile}
          className="p-0.5 rounded hover:bg-[#333] hover:text-[#ccc] transition"
          title="New File"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      {!collapsed && (
        <div className="flex-1 overflow-auto py-1">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs cursor-pointer group ${
                activeFileId === file.id
                  ? "bg-[#37373d] text-white"
                  : "text-[#ccc] hover:bg-[#2a2a2e]"
              }`}
            >
              <img
                src={LANG_ICONS[file.language] || LANG_ICONS.javascript}
                alt=""
                className="w-3.5 h-3.5 shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {renamingId === file.id ? (
                <input
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => {
                    if (renameValue.trim()) onRenameFile(file.id, renameValue.trim());
                    setRenamingId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (renameValue.trim()) onRenameFile(file.id, renameValue.trim());
                      setRenamingId(null);
                    }
                  }}
                  className="flex-1 bg-[#1e1e1e] border border-blue-500 rounded px-1 py-0.5 text-[11px] outline-none text-white"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="flex-1 truncate">{file.name}</span>
              )}
              <div className="hidden group-hover:flex items-center gap-0.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenamingId(file.id);
                    setRenameValue(file.name);
                  }}
                  className="p-0.5 rounded hover:bg-[#444] text-[#888] hover:text-[#ccc]"
                >
                  <Edit3 className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(file.id);
                  }}
                  className="p-0.5 rounded hover:bg-[#444] text-[#888] hover:text-red-400"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
