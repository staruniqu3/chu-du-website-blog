import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Trang chủ" },
    { href: "/blog", label: "Blog" },
    { href: "/order-rules", label: "Quy định Order" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col selection:bg-primary/20">
      {/* Texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif text-primary hover:opacity-80 transition-opacity">
            Tiệm Chu Du
          </Link>
          
          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative py-2",
                  location === item.href || (item.href !== "/" && location.startsWith(item.href))
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                {item.label}
                {(location === item.href || (item.href !== "/" && location.startsWith(item.href))) && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary scale-x-100 transition-transform origin-left" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 animate-in fade-in duration-700 w-full">
        {children}
      </main>

      <footer className="border-t border-border/40 py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="font-serif text-2xl text-primary mb-4">Tiệm Chu Du</p>
          <p className="text-muted-foreground text-sm">
            Nơi lưu giữ những câu chuyện và món đồ nhỏ bé.
          </p>
          <div className="mt-8 flex justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
