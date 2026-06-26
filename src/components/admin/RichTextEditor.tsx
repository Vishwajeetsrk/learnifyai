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

const FONT_SIZES = ["12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "64"];

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [fontSize, setFontSize] = useState("16");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
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

  const addLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addVideo = () => {
    const url = prompt("Enter YouTube/Vimeo embed URL:");
    if (url) {
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
    }
  };

  const setFontSizeValue = (val: string) => {
    setFontSize(val);
    editor.chain().focus().setMark("textStyle", { fontSize: `${val}px` }).run();
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

  return (
    <div className="border rounded-xl overflow-hidden bg-card">
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b bg-muted/30 sticky top-0 z-10">
        <select
          value={fontSize}
          onChange={(e) => setFontSizeValue(e.target.value)}
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

        <Divider />

        <ToolBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive("textAlign", { textAlign: "left" })} title="Align left">
          ≡
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive("textAlign", { textAlign: "center" })} title="Center">
          ≡
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive("textAlign", { textAlign: "right" })} title="Align right">
          ≡
        </ToolBtn>

        <Divider />

        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={isActive("bulletList")} title="Bullet list">
          •≡
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={isActive("orderedList")} title="Numbered list">
          1.
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={isActive("blockquote")} title="Blockquote">
          "
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={isActive("code")} title="Code">
          {">"}
        </ToolBtn>

        <Divider />

        <ToolBtn onClick={addLink} active={isActive("link")} title="Insert link">
          🔗
        </ToolBtn>
        <ToolBtn onClick={addImage} title="Insert image">
          🖼
        </ToolBtn>
        <ToolBtn onClick={addVideo} title="Insert video">
          ▶
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
            ↩
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
            ↪
          </ToolBtn>
        </div>
      </div>

      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[280px] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
      />
    </div>
  );
}
