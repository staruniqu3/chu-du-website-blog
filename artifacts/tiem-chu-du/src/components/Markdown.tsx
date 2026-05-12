import React from "react";
import { cn } from "@/lib/utils";

// A very simple markdown formatter since we don't have react-markdown
// This is not a full markdown parser, just enough for basic formatting
export function Markdown({ content, className }: { content: string; className?: string }) {
  const formatMarkdown = (text: string) => {
    if (!text) return { __html: "" };
    
    let html = text
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      // Blockquotes
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      // Lists (simple)
      .replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>')
      // Images
      .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' class='rounded-md border border-border shadow-md my-4 max-h-[600px] object-cover mx-auto' />")
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' class='text-primary hover:underline'>$1</a>")
      // Paragraphs
      .replace(/\n\n/gim, '</p><p>')
      // Line breaks
      .replace(/\n/gim, '<br />');
      
    // Wrap loose text in paragraphs
    if (!html.startsWith('<')) {
      html = '<p>' + html;
    }
    if (!html.endsWith('>')) {
      html = html + '</p>';
    }
    
    // Fix nested uls
    html = html.replace(/<\/ul>\n<ul>/gim, '');
    html = html.replace(/<\/ul><br \/><ul>/gim, '');
    
    return { __html: html };
  };

  return (
    <div 
      className={cn("prose prose-stone dark:prose-invert max-w-none font-sans prose-headings:font-serif prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80", className)}
      dangerouslySetInnerHTML={formatMarkdown(content)}
    />
  );
}
