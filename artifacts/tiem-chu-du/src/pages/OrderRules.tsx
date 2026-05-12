import React from "react";
import { useListOrderRules } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Markdown } from "@/components/Markdown";

export default function OrderRules() {
  const { data: rules, isLoading } = useListOrderRules();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl space-y-12">
        <div className="text-center space-y-4 mb-16">
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="border border-border/50 p-8 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  const sortedRules = rules ? [...rules].sort((a, b) => a.sortOrder - b.sortOrder) : [];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
      <header className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Quy định Order</h1>
        <div className="w-16 h-[1px] bg-primary/30 mx-auto mb-6"></div>
        <p className="text-lg text-muted-foreground italic font-light">
          Vui lòng đọc kỹ trước khi gửi gắm niềm tin tại tiệm.
        </p>
      </header>

      {!sortedRules || sortedRules.length === 0 ? (
        <div className="text-center p-12 border border-dashed border-border">
          <p className="text-muted-foreground italic">Chưa có quy định nào được thiết lập.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {sortedRules.map((rule, index) => (
            <section 
              key={rule.id} 
              className="relative border border-primary/10 bg-card/30 p-8 md:p-12 hover:border-primary/30 transition-colors duration-500"
            >
              <div className="absolute -top-5 left-8 bg-background px-4 font-serif text-3xl text-primary/40 italic">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h2 className="text-2xl font-serif text-primary mb-6">{rule.title}</h2>
              <Markdown content={rule.content} className="text-foreground/80 leading-relaxed" />
            </section>
          ))}
        </div>
      )}
      
      <div className="mt-24 text-center">
        <p className="font-serif italic text-primary text-xl">
          Cảm ơn bạn đã ghé thăm Tiệm Chu Du.
        </p>
      </div>
    </div>
  );
}
