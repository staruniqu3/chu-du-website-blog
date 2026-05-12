import React from "react";
import { useListRecentBlogs } from "@workspace/api-client-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogListing() {
  const { data: blogs, isLoading } = useListRecentBlogs();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <Skeleton className="h-12 w-48 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[4/3] w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <header className="mb-16 border-b border-border pb-8">
        <h1 className="text-4xl md:text-5xl font-serif text-primary">Nhật ký Chu Du</h1>
        <p className="mt-4 text-muted-foreground text-lg italic">Những dòng ghi chép dọc đường.</p>
      </header>

      {!blogs || blogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground italic text-lg">Chưa có bài viết nào được xuất bản.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {blogs.map((blog) => (
            <article key={blog.id} className="group cursor-pointer flex flex-col">
              <Link href={`/blog/${blog.id}`} className="block overflow-hidden mb-6 aspect-[4/3] bg-muted/30 relative">
                {blog.coverImage ? (
                  <img 
                    src={blog.coverImage} 
                    alt={blog.title} 
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <span className="font-serif text-4xl">Tiệm Chu Du</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors duration-500" />
              </Link>
              
              <div className="flex flex-col flex-1">
                <time className="text-xs tracking-widest text-muted-foreground mb-3 uppercase">
                  {format(new Date(blog.createdAt), "dd MMM yyyy")}
                </time>
                <Link href={`/blog/${blog.id}`}>
                  <h2 className="text-2xl font-serif text-primary mb-4 group-hover:text-primary/80 transition-colors line-clamp-2">
                    {blog.title}
                  </h2>
                </Link>
                <p className="text-foreground/80 line-clamp-3 mb-6 flex-1">
                  {blog.excerpt || "Không có tóm tắt."}
                </p>
                <Link 
                  href={`/blog/${blog.id}`}
                  className="text-sm font-serif italic text-primary group-hover:text-primary/70 transition-colors w-fit border-b border-transparent group-hover:border-primary/50 pb-1"
                >
                  Đọc tiếp
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
