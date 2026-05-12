import React from "react";
import { useListPortfolio } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Portfolio() {
  const { data: items, isLoading } = useListPortfolio();

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <header className="mb-16 border-b border-white/8 pb-10">
        <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Dự án</p>
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-5">Portfolio</h1>
        <p className="text-white/55 italic text-lg">
          Những dự án Tiệm Chu Du đã đồng hành và hỗ trợ.
        </p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-white/30 italic text-lg font-serif">
            Chưa có dự án nào được thêm vào.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {items.map((item) => {
            const tags = item.tags ? item.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
            return (
              <article
                key={item.id}
                className="group flex flex-col border border-white/8 hover:border-primary/25 transition-all duration-400 overflow-hidden"
              >
                {item.coverImage ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-white/3 flex items-center justify-center">
                    <span className="font-serif text-3xl text-white/10">Tiệm Chu Du</span>
                  </div>
                )}

                <div className="p-7 flex flex-col flex-1 gap-4">
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 border border-primary/25 text-primary/80 tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h2 className="font-serif text-2xl text-primary group-hover:text-primary/85 transition-colors">
                    {item.title}
                  </h2>

                  <p className="text-white/60 leading-relaxed text-sm flex-1">
                    {item.description}
                  </p>

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="self-start text-sm font-serif italic text-secondary hover:text-secondary/80 transition-colors border-b border-secondary/30 hover:border-secondary/60 pb-0.5"
                    >
                      Xem dự án
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
