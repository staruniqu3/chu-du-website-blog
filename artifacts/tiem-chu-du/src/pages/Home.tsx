import React from "react";
import { useGetWelcome } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Markdown } from "@/components/Markdown";
import { Link } from "wouter";

export default function Home() {
  const { data: welcome, isLoading } = useGetWelcome();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-4xl space-y-8 animate-pulse">
        <Skeleton className="h-16 w-3/4 mx-auto" />
        <Skeleton className="h-8 w-1/2 mx-auto" />
        <div className="pt-12 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 md:py-32 max-w-3xl flex flex-col items-center text-center">
      <div className="space-y-6 mb-16">
        <h1 className="text-5xl md:text-7xl font-serif text-primary leading-tight">
          {welcome?.headline || "Tiệm Chu Du"}
        </h1>
        <h2 className="text-xl md:text-2xl text-muted-foreground font-light italic">
          {welcome?.subheadline || "Nơi lưu giữ những câu chuyện"}
        </h2>
      </div>
      
      <div className="w-16 h-[1px] bg-primary/30 mb-16"></div>
      
      <div className="text-left w-full">
        <Markdown content={welcome?.body || ""} className="text-lg md:text-xl text-foreground/90 prose-p:text-justify prose-p:mb-6" />
      </div>
      
      <div className="mt-24 flex gap-6">
        <Link 
          href="/blog" 
          className="px-8 py-3 border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-serif text-lg tracking-wide uppercase"
        >
          Đọc Blog
        </Link>
        <Link 
          href="/order-rules" 
          className="px-8 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-300 font-serif text-lg tracking-wide uppercase"
        >
          Mua Hàng
        </Link>
      </div>
    </div>
  );
}
