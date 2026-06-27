"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import { AlignLeft, AlignCenter, AlignRight, Strikethrough, Code, Code2, Minus, RemoveFormatting, Link2, ImageIcon, Video } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FONT_SIZES = ["12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "64"];

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

type DialogMode = "link" | "image" | "video" | null;

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [fontSize, setFontSize] = useState("16");
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [dialogUrl, setDialogUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder: placeholder || "Start writing..." }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const openDialog = (mode: DialogMode) => {
    setDialogMode(mode);
    setDialogUrl("");
  };

  const handleDialogSubmit = () => {
    const url = dialogUrl.trim();
    if (!url) return;

    switch (dialogMode) {
      case "link":
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        break;
      case "image":
        editor.chain().focus().setImage({ src: url }).run();
        break;
      case "video": {
        const embedUrl = url.includes("youtube.com/watch?v=")
          ? url.replace("youtube.com/watch?v=", "youtube.com/embed/").split("&")[0]
          : url.includes("youtu.be/")
            ? url.replace("youtu.be/", "youtube.com/embed/")
            : url;
        editor
          .chain()
          .focus()
          .insertContent(
            `<div style="position:relative;padding-bottom:56.25%;height:0;margin:1rem 0"><iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px" allowfullscreen></iframe></div>`,
          )
          .run();
        break;
      }
    }
    setDialogMode(null);
  };

  const isActive = (type: string, attrs?: any) => editor.isActive(type, attrs);

  const ToolBtn = ({
    onClick,
    active,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded hover:bg-muted text-sm leading-none transition-colors ${active ? "bg-muted text-primary" : "text-muted-foreground"}`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-5 bg-border mx-0.5 shrink-0" />;

  const dialogTitles = { link: "Insert Link", image: "Insert Image", video: "Insert Video" };
  const dialogLabels = { link: "URL", image: "Image URL", video: "Video URL" };
  const dialogPlaceholders = {
    link: "https://example.com",
    image: "https://example.com/image.jpg",
    video: "https://youtube.com/watch?v=... or https://vimeo.com/...",
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-card">
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b bg-muted/30 sticky top-0 z-10">
        <select
          value={fontSize}
          onChange={(e) => {
            setFontSize(e.target.value);
            editor.chain().focus().setMark("textStyle", { fontSize: `${e.target.value}px` }).run();
          }}
          className="h-7 text-xs rounded border bg-background px-1 mr-1"
        >
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}px
            </option>
          ))}
        </select>

        <Divider />

        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={isActive("bold")} title="Bold">
          <strong className="font-bold">B</strong>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={isActive("italic")} title="Italic">
          <em className="italic">I</em>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={isActive("underline")} title="Underline">
          <span className="underline">U</span>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={isActive("strike")} title="Strikethrough">
          <Strikethrough className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={isActive("code")} title="Inline code">
          <Code className="h-4 w-4" />
        </ToolBtn>

        <Divider />

        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={isActive("heading", { level: 1 })} title="Heading 1">
          H1
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={isActive("heading", { level: 2 })} title="Heading 2">
          H2
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={isActive("heading", { level: 3 })} title="Heading 3">
          H3
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} active={isActive("heading", { level: 4 })} title="Heading 4">
          H4
        </ToolBtn>

        <Divider />

        <ToolBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={isActive("textAlign", { textAlign: "left" })} title="Align left">
          <AlignLeft className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={isActive("textAlign", { textAlign: "center" })} title="Center">
          <AlignCenter className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={isActive("textAlign", { textAlign: "right" })} title="Align right">
          <AlignRight className="h-4 w-4" />
        </ToolBtn>

        <Divider />

        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={isActive("bulletList")} title="Bullet list">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={isActive("orderedList")} title="Numbered list">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 .5-1.5 1-2 .5-.5 1-1 1-1.5 .5-.5 0-1 0-1H4"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={isActive("blockquote")} title="Blockquote">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={isActive("codeBlock")} title="Code block">
          <Code2 className="h-4 w-4" />
        </ToolBtn>

        <Divider />

        <ToolBtn onClick={() => openDialog("link")} active={isActive("link")} title="Insert link">
          <Link2 className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => openDialog("image")} title="Insert image">
          <ImageIcon className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => openDialog("video")} title="Insert video">
          <Video className="h-4 w-4" />
        </ToolBtn>

        <Divider />

        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
          <Minus className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear formatting">
          <RemoveFormatting className="h-4 w-4" />
        </ToolBtn>

        <Divider />

        <input
          type="color"
          value={editor.getAttributes("textStyle").color || "#000000"}
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          title="Text color"
          className="w-6 h-6 p-0 border rounded cursor-pointer"
        />
        <input
          type="color"
          value={editor.getAttributes("highlight").color || "#ffff00"}
          onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
          title="Highlight color"
          className="w-6 h-6 p-0 border rounded cursor-pointer"
        />

        <div className="ml-auto flex gap-0.5">
          <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
          </ToolBtn>
        </div>
      </div>

      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[280px] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
      />

      <Dialog open={!!dialogMode} onOpenChange={(v) => { if (!v) setDialogMode(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogMode ? dialogTitles[dialogMode] : ""}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label htmlFor="url-input">{dialogMode ? dialogLabels[dialogMode] : ""}</Label>
              <Input
                id="url-input"
                value={dialogUrl}
                onChange={(e) => setDialogUrl(e.target.value)}
                placeholder={dialogMode ? dialogPlaceholders[dialogMode] : ""}
                onKeyDown={(e) => { if (e.key === "Enter") handleDialogSubmit(); }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogMode(null)}>Cancel</Button>
            <Button onClick={handleDialogSubmit} disabled={!dialogUrl.trim()}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
