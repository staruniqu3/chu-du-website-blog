import React, { useState } from "react";
import { useListBlogs } from "@workspace/api-client-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const CROWN_SVG = (
  <svg viewBox="0 0 32 24" fill="none" className="w-8 h-8" aria-hidden>
    <path
      d="M2 20h28M4 20L2 8l7 6 7-10 7 10 7-6-2 12H4z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="2" cy="8" r="1.5" fill="currentColor" />
    <circle cx="16" cy="4" r="1.5" fill="currentColor" />
    <circle cx="30" cy="8" r="1.5" fill="currentColor" />
  </svg>
);

type TabId = "all" | "benefits" | "events" | "news";

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: "all", label: "Tất cả", emoji: "✦" },
  { id: "benefits", label: "Quyền lợi", emoji: "🎁" },
  { id: "events", label: "Sự kiện", emoji: "📅" },
  { id: "news", label: "Tin tức", emoji: "📢" },
];

function tagFromTitle(title: string): TabId | null {
  const lower = title.toLowerCase();
  if (lower.includes("quyền lợi") || lower.includes("benefit") || lower.includes("ưu đãi")) return "benefits";
  if (lower.includes("sự kiện") || lower.includes("event") || lower.includes("sắp tới") || lower.includes("hoạt động")) return "events";
  if (lower.includes("tin") || lower.includes("news") || lower.includes("thông báo") || lower.includes("cập nhật")) return "news";
  return null;
}

function PostCard({ post, index }: { post: { id: number; title: string; excerpt?: string | null; content: string; createdAt: string; coverImage?: string | null }; index: number }) {
  const tag = tagFromTitle(post.title);
  const tagLabel = tag === "benefits" ? "Quyền lợi" : tag === "events" ? "Sự kiện" : tag === "news" ? "Tin tức" : null;

  const gradients = [
    "from-pink-500/20 to-orange-500/20",
    "from-blue-500/20 to-pink-500/20",
    "from-orange-500/20 to-pink-400/20",
    "from-indigo-500/20 to-blue-500/20",
  ];
  const borderGrads = [
    "from-pink-500 to-orange-400",
    "from-blue-400 to-pink-500",
    "from-orange-400 to-pink-400",
    "from-indigo-400 to-blue-400",
  ];
  const grad = gradients[index % gradients.length];
  const borderGrad = borderGrads[index % borderGrads.length];

  return (
    <Link href={`/blog/${post.id}`} className="group block">
      <article className="relative rounded-2xl overflow-hidden h-full transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-pink-500/10">
        {/* gradient border via pseudo wrapper */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${borderGrad} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} style={{ padding: 1 }} />
        <div className={`relative bg-gradient-to-br ${grad} backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full flex flex-col gap-4 group-hover:border-transparent transition-colors duration-300`}>
          {/* Cover image strip */}
          {post.coverImage && (
            <div className="w-full aspect-[16/7] rounded-xl overflow-hidden -mt-1 mb-1">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          )}

          {/* Tags row */}
          <div className="flex items-center gap-2 flex-wrap">
            {tagLabel && (
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                {tagLabel}
              </span>
            )}
            <span className="text-[10px] font-medium tracking-widest text-white/35 uppercase ml-auto">
              {format(new Date(post.createdAt), "dd.MM.yyyy")}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold leading-snug text-white group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-sm text-white/55 line-clamp-3 flex-1 leading-relaxed">
            {post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 120) + "…"}
          </p>

          <span className="text-xs font-bold uppercase tracking-widest text-primary/70 group-hover:text-primary transition-colors flex items-center gap-1.5">
            Xem chi tiết
            <span className="inline-block transition-transform group-hover:translate-x-1 duration-200">→</span>
          </span>
        </div>
      </article>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4 h-64">
      <div className="flex gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full ml-auto" />
      </div>
      <Skeleton className="h-6 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export default function SovereignClub() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const { data: posts, isLoading } = useListBlogs({ published: true, category: "sovereign", limit: 50 });

  const filtered = activeTab === "all"
    ? (posts ?? [])
    : (posts ?? []).filter((p) => tagFromTitle(p.title) === activeTab);

  return (
    <div className="min-h-screen relative">
      {/* Dynamic background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[700px] h-[700px] rounded-full bg-pink-600/8 blur-[140px] animate-pulse" style={{ animationDuration: "6s" }} />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-orange-500/6 blur-[120px] animate-pulse" style={{ animationDuration: "9s" }} />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full bg-indigo-500/8 blur-[100px] animate-pulse" style={{ animationDuration: "12s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 py-14 max-w-6xl">
        {/* Hero Header */}
        <div className="mb-14">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-6">
            {CROWN_SVG}
            <span>Exclusive Membership</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-3">
                <span className="text-white">Sovereign</span>
                <br />
                <span className="bg-gradient-to-r from-pink-400 via-primary to-orange-400 bg-clip-text text-transparent">
                  Club
                </span>
              </h1>
              <p className="text-white/50 text-lg max-w-md leading-relaxed">
                Không gian dành riêng cho thành viên — quyền lợi đặc biệt, tin tức mới nhất và những hoạt động thú vị sắp tới.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex gap-6 md:gap-8 shrink-0">
              {[
                { label: "Bài viết", value: (posts?.length ?? 0).toString() },
                { label: "Độc quyền", value: "100%" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-3xl font-black bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">{value}</p>
                  <p className="text-xs text-white/35 uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mt-10 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 flex-wrap mb-10">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-primary text-background shadow-lg shadow-primary/30"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 border border-white/10"
              }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
              {tab.id !== "all" && posts && (
                <span className={`text-[10px] ml-1 ${activeTab === tab.id ? "text-background/70" : "text-white/25"}`}>
                  {posts.filter((p) => tagFromTitle(p.title) === tab.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
              {activeTab === "all" ? "✦" : TABS.find(t => t.id === activeTab)?.emoji}
            </div>
            <p className="text-white/40 text-lg">Chưa có nội dung trong mục này.</p>
            {activeTab !== "all" && (
              <button onClick={() => setActiveTab("all")} className="text-sm text-primary/70 hover:text-primary transition-colors underline underline-offset-4">
                Xem tất cả bài viết
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Featured first post — larger card */}
            {activeTab === "all" && filtered.length > 0 && (
              <div className="mb-5">
                <Link href={`/blog/${filtered[0].id}`} className="group block">
                  <article className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-pink-500/10 via-background to-orange-500/10 transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-2xl group-hover:shadow-primary/10">
                    <div className="flex flex-col md:flex-row">
                      {filtered[0].coverImage ? (
                        <div className="md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden">
                          <img src={filtered[0].coverImage} alt={filtered[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                      ) : (
                        <div className="md:w-2/5 aspect-[4/3] md:aspect-auto flex items-center justify-center bg-gradient-to-br from-primary/20 to-orange-500/20">
                          <div className="text-primary/30 scale-[3]">{CROWN_SVG}</div>
                        </div>
                      )}
                      <div className="flex-1 p-8 md:p-10 flex flex-col justify-center gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white">
                            ✦ Nổi bật
                          </span>
                          <span className="text-xs text-white/35 tracking-widest">
                            {format(new Date(filtered[0].createdAt), "dd.MM.yyyy")}
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white group-hover:text-primary transition-colors duration-200 leading-snug line-clamp-2">
                          {filtered[0].title}
                        </h2>
                        <p className="text-white/55 leading-relaxed line-clamp-3">
                          {filtered[0].excerpt || filtered[0].content.replace(/<[^>]*>/g, "").slice(0, 200) + "…"}
                        </p>
                        <span className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                          Đọc ngay <span>→</span>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            )}

            {/* Regular grid — skip first if showing all */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(activeTab === "all" ? filtered.slice(1) : filtered).map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
