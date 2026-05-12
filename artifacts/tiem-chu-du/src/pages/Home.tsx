import React from "react";
import { useGetWelcome, useListFeatures } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Markdown } from "@/components/Markdown";
import { Link } from "wouter";

const ICON_MAP: Record<string, string> = {
  smartphone: "📱",
  globe: "🌐",
  star: "⭐",
  cart: "🛒",
  package: "📦",
  heart: "💗",
  chat: "💬",
  camera: "📷",
  music: "🎵",
  ticket: "🎟",
  gift: "🎁",
  map: "📍",
};

export default function Home() {
  const { data: welcome, isLoading: welcomeLoading } = useGetWelcome();
  const { data: features, isLoading: featuresLoading } = useListFeatures();

  const enabledFeatures = features?.filter((f) => f.enabled) ?? [];

  return (
    <div className="flex flex-col">
      {/* Welcome content */}
      <section className="container mx-auto px-4 py-16 md:py-24 max-w-3xl flex flex-col items-center text-center">
        {welcomeLoading ? (
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

      {/* Tiệm Chu Du có gì */}
      {(featuresLoading || enabledFeatures.length > 0) && (
        <section className="w-full border-t border-white/8 py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">
                Tiệm Chu Du có gì?
              </h2>
              <div className="flex items-center gap-3 justify-center">
                <div className="w-10 h-[1px] bg-primary/25" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/35" />
                <div className="w-10 h-[1px] bg-primary/25" />
              </div>
            </div>

            {featuresLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {enabledFeatures.map((feature) => (
                  <div
                    key={feature.id}
                    className="group relative border border-white/8 bg-white/3 hover:border-primary/30 hover:bg-white/5 transition-all duration-400 p-7 flex flex-col gap-4"
                  >
                    <div className="text-3xl leading-none">
                      {ICON_MAP[feature.icon] ?? ICON_MAP["star"]}
                    </div>
                    <h3 className="font-serif text-xl text-primary group-hover:text-primary/90 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Portfolio teaser */}
      <section className="w-full border-t border-white/8 py-16">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <p className="text-white/40 text-sm tracking-widest uppercase mb-4">Dự án</p>
          <h2 className="text-2xl md:text-3xl font-serif text-primary mb-6">
            Các dự án Tiệm đã support
          </h2>
          <Link
            href="/portfolio"
            className="inline-block px-8 py-3 border border-white/15 text-white/70 hover:border-primary/50 hover:text-primary transition-all duration-300 font-serif text-sm tracking-widest uppercase"
          >
            Xem Portfolio
          </Link>
        </div>
      </section>
    </div>
  );
}
