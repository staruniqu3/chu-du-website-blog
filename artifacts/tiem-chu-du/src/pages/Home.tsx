import React from "react";
import { useGetWelcome } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Markdown } from "@/components/Markdown";
import { Link } from "wouter";

export default function Home() {
  const { data: welcome, isLoading } = useGetWelcome();

  return (
    <div className="flex flex-col">
      {/* Hero banner */}
      <section className="relative w-full overflow-hidden">
        <div className="relative w-full" style={{ aspectRatio: "940/352", maxHeight: "420px" }}>
          <img
            src="/banner.jpg"
            alt="Tiệm Chu Du Banner"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient fade into page background at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-transparent" />
        </div>
      </section>

      {/* Welcome content */}
      <section className="container mx-auto px-4 py-16 md:py-24 max-w-3xl flex flex-col items-center text-center">
        {isLoading ? (
          <div className="w-full space-y-6 animate-pulse">
            <Skeleton className="h-12 w-2/3 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <div className="pt-8 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-5 mb-12">
              <h1 className="text-4xl md:text-6xl font-serif text-primary leading-tight">
                {welcome?.headline || "Tiệm Chu Du"}
              </h1>
              <h2 className="text-lg md:text-xl text-white/55 font-light italic">
                {welcome?.subheadline || "Nơi lưu giữ những câu chuyện"}
              </h2>
            </div>

            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-[1px] bg-primary/30" />
              <div className="w-2 h-2 rounded-full bg-primary/40" />
              <div className="w-12 h-[1px] bg-primary/30" />
            </div>

            <div className="text-left w-full">
              <Markdown
                content={welcome?.body || ""}
                className="text-lg text-white/80 leading-loose prose-p:text-justify prose-p:mb-5"
              />
            </div>

            <div className="mt-16 flex flex-wrap gap-4 justify-center">
              <Link
                href="/blog"
                className="px-8 py-3 border border-primary/50 text-primary hover:bg-primary hover:text-background transition-all duration-300 font-serif text-base tracking-widest uppercase"
              >
                Đọc Blog
              </Link>
              <Link
                href="/order-rules"
                className="px-8 py-3 bg-secondary/90 text-white hover:bg-secondary transition-all duration-300 font-serif text-base tracking-widest uppercase"
              >
                Quy định Order
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
