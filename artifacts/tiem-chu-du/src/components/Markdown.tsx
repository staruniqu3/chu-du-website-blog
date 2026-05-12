import React, { useMemo } from "react";
import { marked } from "marked";
import { cn } from "@/lib/utils";

marked.setOptions({ breaks: true });

export function Markdown({ content, className }: { content: string; className?: string }) {
  const html = useMemo(() => marked.parse(content ?? "") as string, [content]);

  return (
    <div
      className={cn(
        "prose prose-invert max-w-none",
        "prose-p:text-foreground/85 prose-p:leading-relaxed",
        "prose-headings:font-serif prose-headings:text-primary",
        "prose-strong:text-white prose-strong:font-bold",
        "prose-em:text-white/80 prose-em:italic",
        "prose-a:text-primary prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-primary/70",
        "prose-blockquote:border-l-primary/50 prose-blockquote:text-white/60 prose-blockquote:italic",
        "prose-img:rounded-xl prose-img:w-full prose-img:object-cover prose-img:my-6",
        "prose-ul:text-foreground/80 prose-ol:text-foreground/80",
        "prose-code:bg-white/8 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary prose-code:before:content-none prose-code:after:content-none",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
