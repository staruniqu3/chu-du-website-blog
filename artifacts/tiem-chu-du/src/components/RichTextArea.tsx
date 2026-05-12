import React, { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface RichTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}

type ToolbarAction =
  | { type: "wrap"; before: string; after: string; placeholder: string }
  | { type: "image" };

const TOOLBAR_ITEMS: { label: string; title: string; action: ToolbarAction }[] = [
  { label: "B", title: "In đậm (Ctrl+B)", action: { type: "wrap", before: "**", after: "**", placeholder: "văn bản đậm" } },
  { label: "I", title: "In nghiêng (Ctrl+I)", action: { type: "wrap", before: "_", after: "_", placeholder: "văn bản nghiêng" } },
  { label: "H1", title: "Tiêu đề lớn", action: { type: "wrap", before: "# ", after: "", placeholder: "Tiêu đề" } },
  { label: "H2", title: "Tiêu đề vừa", action: { type: "wrap", before: "## ", after: "", placeholder: "Tiêu đề" } },
  { label: "❝", title: "Trích dẫn", action: { type: "wrap", before: "> ", after: "", placeholder: "Trích dẫn" } },
  { label: "• ", title: "Danh sách", action: { type: "wrap", before: "- ", after: "", placeholder: "mục" } },
  { label: "🔗", title: "Chèn link", action: { type: "wrap", before: "[", after: "](https://)", placeholder: "tên link" } },
  { label: "🖼", title: "Chèn ảnh", action: { type: "image" } },
];

export function RichTextArea({ value, onChange, rows = 16, placeholder, className }: RichTextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyAction = useCallback((action: ToolbarAction) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);

    if (action.type === "image") {
      const url = window.prompt("Nhập URL ảnh:");
      if (!url) return;
      const alt = window.prompt("Nhập mô tả ảnh (alt text):", "ảnh") ?? "ảnh";
      const insertion = `![${alt}](${url})`;
      const next = value.slice(0, start) + insertion + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start + insertion.length, start + insertion.length);
      });
      return;
    }

    const { before, after, placeholder: ph } = action;
    const text = selected || ph;

    // For line-start prefixes (H1, H2, blockquote, list) don't add suffix
    const isLinePrefix = after === "";
    const insertion = isLinePrefix ? before + text : before + text + after;

    const next = value.slice(0, start) + insertion + value.slice(end);
    onChange(next);

    requestAnimationFrame(() => {
      el.focus();
      if (!selected) {
        // Select the placeholder text so user can type over it
        const selStart = start + before.length;
        const selEnd = selStart + text.length;
        el.setSelectionRange(selStart, selEnd);
      } else {
        el.setSelectionRange(start + insertion.length, start + insertion.length);
      }
    });
  }, [value, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "b") {
      e.preventDefault();
      applyAction({ type: "wrap", before: "**", after: "**", placeholder: "văn bản đậm" });
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "i") {
      e.preventDefault();
      applyAction({ type: "wrap", before: "_", after: "_", placeholder: "văn bản nghiêng" });
    }
    // Tab inserts 2 spaces instead of leaving field
    if (e.key === "Tab") {
      e.preventDefault();
      const el = textareaRef.current!;
      const s = el.selectionStart;
      const next = value.slice(0, s) + "  " + value.slice(el.selectionEnd);
      onChange(next);
      requestAnimationFrame(() => el.setSelectionRange(s + 2, s + 2));
    }
  };

  return (
    <div className="rounded-lg border border-white/10 overflow-hidden focus-within:border-primary/60 transition-colors duration-150">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 flex-wrap px-2 py-1.5 bg-white/[0.03] border-b border-white/8">
        {TOOLBAR_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            title={item.title}
            onClick={() => applyAction(item.action)}
            className={cn(
              "px-2.5 py-1 rounded text-xs font-medium transition-colors duration-100 select-none",
              "text-white/50 hover:text-white hover:bg-white/10 active:bg-white/15",
              item.label === "B" && "font-bold",
              item.label === "I" && "italic"
            )}
          >
            {item.label}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-white/20 tracking-wide pr-1">Markdown</span>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={rows}
        placeholder={placeholder}
        className={cn(
          "w-full bg-transparent px-4 py-3 text-sm text-white/85 placeholder:text-white/25",
          "focus:outline-none resize-y leading-relaxed font-mono",
          className
        )}
      />
    </div>
  );
}
