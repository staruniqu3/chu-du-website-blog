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
    <div className="min-h-[100dvh] flex flex-col selection:bg-primary/25">
      {/* Ambient glow blobs — echoes the galaxy/space motif from the banner */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-blue-700/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-pink-600/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-indigo-600/8 blur-[90px]" />
      </div>

      {/* Subtle noise texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025] z-10 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <header className="sticky top-0 z-40 w-full border-b border-white/8 bg-background/85 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8 h-18 flex items-center justify-between" style={{ height: "4.5rem" }}>
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl font-serif text-primary hover:opacity-85 transition-opacity tracking-wide">
              Tiệm Chu Du
            </span>
          </Link>

          <nav className="flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors duration-200 hover:text-primary relative py-2 tracking-wide",
                    isActive ? "text-primary" : "text-white/60"
                  )}
                >
                  {item.label}
                  <span className={cn(
                    "absolute bottom-0 left-0 w-full h-[1px] bg-primary origin-left transition-transform duration-300",
                    isActive ? "scale-x-100" : "scale-x-0"
                  )} />
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 animate-in fade-in duration-700 w-full relative z-10">
        {children}
      </main>

      <footer className="relative z-10 border-t border-white/8 py-14 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="font-serif text-2xl text-primary mb-3 tracking-wide">Tiệm Chu Du</p>
          <p className="text-white/40 text-sm tracking-wide">
            Nơi lưu giữ những câu chuyện và món đồ nhỏ bé.
          </p>
          <div className="mt-8 flex justify-center gap-6 text-xs text-white/30">
            <Link href="/admin" className="hover:text-primary transition-colors tracking-widest uppercase">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
