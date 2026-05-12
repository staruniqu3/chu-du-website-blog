import React from "react";
import { useGetBlog, getGetBlogQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Markdown } from "@/components/Markdown";

export default function BlogDetail() {
  const params = useParams();
  const id = params.id ? parseInt(params.id, 10) : 0;
  
  const { data: blog, isLoading } = useGetBlog(id, {
    query: {
      enabled: !!id,
      queryKey: getGetBlogQueryKey(id)
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl space-y-8">
        <Skeleton className="h-8 w-32 mx-auto" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="aspect-[21/9] w-full mt-12" />
        <div className="space-y-4 mt-12">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-32 text-center max-w-xl">
        <h1 className="text-4xl font-serif text-primary mb-6">Không tìm thấy bài viết</h1>
        <p className="text-muted-foreground mb-12">Bài viết này có thể đã bị xóa hoặc chưa được xuất bản.</p>
        <Link href="/blog" className="text-primary hover:underline uppercase tracking-widest text-sm font-serif">
          Trở về Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-24">
      <header className="container mx-auto px-4 pt-16 md:pt-24 pb-12 max-w-3xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-12 h-[1px] bg-primary/40"></div>
        </div>
        <time className="text-sm tracking-[0.2em] text-muted-foreground uppercase mb-6 block">
          {format(new Date(blog.createdAt), "dd MMMM yyyy")}
        </time>
        <h1 className="text-4xl md:text-6xl font-serif text-primary leading-tight mb-8">
          {blog.title}
        </h1>
        {blog.excerpt && (
          <p className="text-xl md:text-2xl text-muted-foreground font-light italic max-w-2xl mx-auto leading-relaxed">
            {blog.excerpt}
          </p>
        )}
      </header>

      {blog.coverImage && (
        <div className="w-full max-w-5xl mx-auto px-4 mb-16 md:mb-24">
          <div className="aspect-[21/9] md:aspect-[2.5/1] overflow-hidden relative">
            <img 
              src={blog.coverImage} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10"></div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-2xl">
        <div className="first-letter:text-7xl first-letter:font-serif first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-none">
          <Markdown content={blog.content} className="text-lg md:text-xl leading-loose" />
        </div>
        
        <div className="mt-24 pt-12 border-t border-border/40 text-center">
          <p className="font-serif italic text-muted-foreground mb-6">Kết thúc biên niên ký.</p>
          <Link href="/blog" className="inline-block border border-primary/30 px-6 py-2 text-primary hover:bg-primary/5 transition-colors uppercase tracking-widest text-xs">
            Đọc bài khác
          </Link>
        </div>
      </div>
    </article>
  );
}
