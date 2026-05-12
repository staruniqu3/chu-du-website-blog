import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetWelcome,
  useUpdateWelcome,
  getGetWelcomeQueryKey,
  useListBlogs,
  useCreateBlog,
  useUpdateBlog,
  useDeleteBlog,
  getListBlogsQueryKey,
  useListOrderRules,
  useCreateOrderRule,
  useUpdateOrderRule,
  useDeleteOrderRule,
  getListOrderRulesQueryKey,
} from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

type AdminTab = "welcome" | "blog" | "order-rules";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>("welcome");

  const tabs: { id: AdminTab; label: string }[] = [
    { id: "welcome", label: "Trang chào mừng" },
    { id: "blog", label: "Viết blog" },
    { id: "order-rules", label: "Quy định order" },
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <header className="mb-12 border-b border-border pb-8">
        <h1 className="text-4xl font-serif text-primary">Quản trị</h1>
        <p className="mt-2 text-muted-foreground italic">Khu vực chỉ dành cho người quản lý.</p>
      </header>

      <div className="flex gap-1 mb-12 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in duration-300">
        {activeTab === "welcome" && <WelcomeTab />}
        {activeTab === "blog" && <BlogTab />}
        {activeTab === "order-rules" && <OrderRulesTab />}
      </div>
    </div>
  );
}

function WelcomeTab() {
  const queryClient = useQueryClient();
  const { data: welcome, isLoading } = useGetWelcome();
  const updateWelcome = useUpdateWelcome();
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (welcome) {
      setHeadline(welcome.headline);
      setSubheadline(welcome.subheadline);
      setBody(welcome.body);
    }
  }, [welcome]);

  const handleSave = () => {
    updateWelcome.mutate(
      { data: { headline, subheadline, body } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetWelcomeQueryKey() });
          setSaved(true);
          setTimeout(() => setSaved(false), 2500);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground">Chỉnh sửa nội dung trang chào mừng hiển thị với khách.</p>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80 tracking-wide uppercase">Tiêu đề chính</label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="w-full bg-input border border-border rounded px-4 py-3 text-foreground font-serif text-lg focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80 tracking-wide uppercase">Tiêu đề phụ</label>
        <input
          type="text"
          value={subheadline}
          onChange={(e) => setSubheadline(e.target.value)}
          className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80 tracking-wide uppercase">Nội dung</label>
        <p className="text-xs text-muted-foreground">Hỗ trợ định dạng Markdown cơ bản.</p>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow resize-y leading-relaxed font-sans"
        />
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={updateWelcome.isPending}
          className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors font-serif tracking-wide"
        >
          {updateWelcome.isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
        {saved && (
          <span className="text-sm text-primary italic animate-in fade-in duration-300">
            Đã lưu thành công.
          </span>
        )}
      </div>
    </div>
  );
}

function BlogTab() {
  const queryClient = useQueryClient();
  const { data: blogs, isLoading } = useListBlogs();
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();

  const [view, setView] = useState<"list" | "new" | "edit">("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [published, setPublished] = useState(false);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setExcerpt("");
    setPublished(false);
    setEditingId(null);
  };

  const handleNew = () => {
    resetForm();
    setView("new");
  };

  const handleEdit = (blog: NonNullable<typeof blogs>[number]) => {
    setTitle(blog.title);
    setContent(blog.content);
    setExcerpt(blog.excerpt ?? "");
    setPublished(blog.published);
    setEditingId(blog.id);
    setView("edit");
  };

  const handleSave = () => {
    if (view === "new") {
      createBlog.mutate(
        { data: { title, content, excerpt, published } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListBlogsQueryKey() });
            resetForm();
            setView("list");
          },
        }
      );
    } else if (view === "edit" && editingId !== null) {
      updateBlog.mutate(
        { id: editingId, data: { title, content, excerpt, published } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListBlogsQueryKey() });
            resetForm();
            setView("list");
          },
        }
      );
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    deleteBlog.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBlogsQueryKey() });
        },
      }
    );
  };

  const handleTogglePublish = (blog: NonNullable<typeof blogs>[number]) => {
    updateBlog.mutate(
      { id: blog.id, data: { published: !blog.published } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBlogsQueryKey() });
        },
      }
    );
  };

  if (view === "new" || view === "edit") {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { resetForm(); setView("list"); }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Quay lại
          </button>
          <h2 className="text-2xl font-serif text-primary">
            {view === "new" ? "Bài viết mới" : "Chỉnh sửa bài viết"}
          </h2>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80 tracking-wide uppercase">Tiêu đề</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tiêu đề bài viết..."
            className="w-full bg-input border border-border rounded px-4 py-3 text-foreground font-serif text-lg focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80 tracking-wide uppercase">Tóm tắt</label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Một câu mô tả ngắn..."
            className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80 tracking-wide uppercase">Nội dung</label>
          <p className="text-xs text-muted-foreground">Hỗ trợ Markdown cơ bản.</p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            placeholder="Viết nội dung bài..."
            className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow resize-y leading-relaxed"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-muted peer-focus:ring-1 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-foreground after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
          </label>
          <span className="text-sm text-foreground/80">Xuất bản ngay</span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={createBlog.isPending || updateBlog.isPending || !title.trim() || !content.trim()}
            className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors font-serif tracking-wide"
          >
            {createBlog.isPending || updateBlog.isPending ? "Đang lưu..." : "Lưu bài viết"}
          </button>
          <button
            onClick={() => { resetForm(); setView("list"); }}
            className="px-6 py-3 border border-border text-foreground/80 hover:border-primary hover:text-primary transition-colors"
          >
            Hủy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Quản lý tất cả bài viết.</p>
        <button
          onClick={handleNew}
          className="px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-serif text-sm tracking-wide"
        >
          + Bài viết mới
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : !blogs || blogs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground italic">Chưa có bài viết nào.</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {blogs.map((blog) => (
            <div key={blog.id} className="py-5 flex items-start justify-between gap-4 group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    blog.published
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {blog.published ? "Đã xuất bản" : "Nháp"}
                  </span>
                  <time className="text-xs text-muted-foreground">
                    {format(new Date(blog.createdAt), "dd/MM/yyyy")}
                  </time>
                </div>
                <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors truncate">
                  {blog.title}
                </h3>
                {blog.excerpt && (
                  <p className="text-sm text-muted-foreground mt-1 truncate">{blog.excerpt}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleTogglePublish(blog)}
                  className="text-xs px-3 py-1.5 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors"
                >
                  {blog.published ? "Ẩn" : "Xuất bản"}
                </button>
                <button
                  onClick={() => handleEdit(blog)}
                  className="text-xs px-3 py-1.5 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="text-xs px-3 py-1.5 border border-border hover:border-destructive text-muted-foreground hover:text-destructive transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderRulesTab() {
  const queryClient = useQueryClient();
  const { data: rules, isLoading } = useListOrderRules();
  const createRule = useCreateOrderRule();
  const updateRule = useUpdateOrderRule();
  const deleteRule = useDeleteOrderRule();

  const [view, setView] = useState<"list" | "new" | "edit">("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSortOrder(0);
    setEditingId(null);
  };

  const handleEdit = (rule: NonNullable<typeof rules>[number]) => {
    setTitle(rule.title);
    setContent(rule.content);
    setSortOrder(rule.sortOrder);
    setEditingId(rule.id);
    setView("edit");
  };

  const handleSave = () => {
    if (view === "new") {
      createRule.mutate(
        { data: { title, content, sortOrder } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListOrderRulesQueryKey() });
            resetForm();
            setView("list");
          },
        }
      );
    } else if (view === "edit" && editingId !== null) {
      updateRule.mutate(
        { id: editingId, data: { title, content, sortOrder } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListOrderRulesQueryKey() });
            resetForm();
            setView("list");
          },
        }
      );
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa quy định này?")) return;
    deleteRule.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListOrderRulesQueryKey() });
        },
      }
    );
  };

  if (view === "new" || view === "edit") {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { resetForm(); setView("list"); }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Quay lại
          </button>
          <h2 className="text-2xl font-serif text-primary">
            {view === "new" ? "Quy định mới" : "Chỉnh sửa quy định"}
          </h2>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80 tracking-wide uppercase">Tiêu đề</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tên quy định..."
            className="w-full bg-input border border-border rounded px-4 py-3 text-foreground font-serif text-lg focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80 tracking-wide uppercase">Nội dung</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            placeholder="Nội dung quy định..."
            className="w-full bg-input border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow resize-y leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80 tracking-wide uppercase">Thứ tự hiển thị</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-32 bg-input border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={createRule.isPending || updateRule.isPending || !title.trim() || !content.trim()}
            className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors font-serif tracking-wide"
          >
            {createRule.isPending || updateRule.isPending ? "Đang lưu..." : "Lưu quy định"}
          </button>
          <button
            onClick={() => { resetForm(); setView("list"); }}
            className="px-6 py-3 border border-border text-foreground/80 hover:border-primary hover:text-primary transition-colors"
          >
            Hủy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Quản lý các quy định order.</p>
        <button
          onClick={() => { resetForm(); setView("new"); }}
          className="px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-serif text-sm tracking-wide"
        >
          + Quy định mới
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : !rules || rules.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground italic">Chưa có quy định nào.</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {rules.map((rule) => (
            <div key={rule.id} className="py-5 flex items-start justify-between gap-4 group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground">#{rule.sortOrder}</span>
                </div>
                <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">
                  {rule.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{rule.content}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(rule)}
                  className="text-xs px-3 py-1.5 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(rule.id)}
                  className="text-xs px-3 py-1.5 border border-border hover:border-destructive text-muted-foreground hover:text-destructive transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
