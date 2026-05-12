import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetWelcome, useUpdateWelcome, getGetWelcomeQueryKey,
  useListBlogs, useCreateBlog, useUpdateBlog, useDeleteBlog, getListBlogsQueryKey,
  useListOrderRules, useCreateOrderRule, useUpdateOrderRule, useDeleteOrderRule, getListOrderRulesQueryKey,
  useListFeatures, useCreateFeature, useUpdateFeature, useDeleteFeature, getListFeaturesQueryKey,
  useListPortfolio, useCreatePortfolioItem, useUpdatePortfolioItem, useDeletePortfolioItem, getListPortfolioQueryKey,
  useGetContactSettings, useUpdateContactSettings, getGetContactSettingsQueryKey,
  useChangeAdminPassword,
} from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminAuth } from "@/components/AdminAuth";

type AdminTab = "welcome" | "blog" | "order-rules" | "features" | "portfolio" | "settings";

const ICON_OPTIONS = [
  { value: "smartphone", label: "Điện thoại" },
  { value: "globe", label: "Website" },
  { value: "cart", label: "Giỏ hàng" },
  { value: "package", label: "Gói hàng" },
  { value: "heart", label: "Yêu thích" },
  { value: "chat", label: "Chat" },
  { value: "camera", label: "Camera" },
  { value: "music", label: "Âm nhạc" },
  { value: "ticket", label: "Vé" },
  { value: "gift", label: "Quà tặng" },
  { value: "map", label: "Địa điểm" },
  { value: "star", label: "Sao" },
];

export default function Admin() {
  const { logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("welcome");

  const tabs: { id: AdminTab; label: string }[] = [
    { id: "welcome", label: "Trang chào mừng" },
    { id: "features", label: "Tiệm có gì" },
    { id: "blog", label: "Viết blog" },
    { id: "order-rules", label: "Quy định order" },
    { id: "portfolio", label: "Portfolio" },
    { id: "settings", label: "Cài đặt" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin ambient */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-blue-700/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-pink-600/10 blur-[100px]" />
      </div>

      <header className="sticky top-0 z-40 w-full border-b border-white/8 bg-background/85 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between" style={{ height: "4.5rem" }}>
          <p className="font-serif text-xl text-primary tracking-wide">Tiệm Chu Du — Quản trị</p>
          <button
            onClick={logout}
            className="text-xs text-white/35 hover:text-white/70 transition-colors tracking-widest uppercase"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-10 max-w-4xl flex-1">
        <div className="flex gap-1 mb-10 border-b border-white/8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-3 text-sm font-medium transition-colors duration-200 border-b-2 -mb-px whitespace-nowrap shrink-0",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-white/45 hover:text-white/75"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in duration-300">
          {activeTab === "welcome" && <WelcomeTab />}
          {activeTab === "features" && <FeaturesTab />}
          {activeTab === "blog" && <BlogTab />}
          {activeTab === "order-rules" && <OrderRulesTab />}
          {activeTab === "portfolio" && <PortfolioTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}

/* ── WELCOME TAB ── */
function WelcomeTab() {
  const queryClient = useQueryClient();
  const { data: welcome, isLoading } = useGetWelcome();
  const updateWelcome = useUpdateWelcome();
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (welcome) { setHeadline(welcome.headline); setSubheadline(welcome.subheadline); setBody(welcome.body); }
  }, [welcome]);

  const handleSave = () => {
    updateWelcome.mutate({ data: { headline, subheadline, body } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetWelcomeQueryKey() });
        setSaved(true); setTimeout(() => setSaved(false), 2500);
      },
    });
  };

  if (isLoading) return <SkeletonForm rows={3} />;

  return (
    <div className="space-y-7">
      <p className="text-white/45 text-sm">Nội dung trang chào mừng hiển thị với khách.</p>
      <Field label="Tiêu đề chính">
        <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)}
          className={inputCls + " font-serif text-lg"} />
      </Field>
      <Field label="Tiêu đề phụ">
        <input type="text" value={subheadline} onChange={(e) => setSubheadline(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Nội dung" hint="Hỗ trợ Markdown cơ bản.">
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} className={inputCls + " resize-y leading-relaxed"} />
      </Field>
      <SaveRow isPending={updateWelcome.isPending} saved={saved} onSave={handleSave} />
    </div>
  );
}

/* ── FEATURES TAB ── */
function FeaturesTab() {
  const queryClient = useQueryClient();
  const { data: features, isLoading } = useListFeatures();
  const createFeature = useCreateFeature();
  const updateFeature = useUpdateFeature();
  const deleteFeature = useDeleteFeature();
  const [view, setView] = useState<"list" | "new" | "edit">("list");
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("star");
  const [enabled, setEnabled] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const reset = () => { setTitle(""); setDescription(""); setIcon("star"); setEnabled(true); setSortOrder(0); setEditId(null); };

  const handleEdit = (f: NonNullable<typeof features>[number]) => {
    setTitle(f.title); setDescription(f.description); setIcon(f.icon); setEnabled(f.enabled); setSortOrder(f.sortOrder); setEditId(f.id); setView("edit");
  };

  const handleSave = () => {
    const data = { title, description, icon, enabled, sortOrder };
    if (view === "new") {
      createFeature.mutate({ data }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListFeaturesQueryKey() }); reset(); setView("list"); } });
    } else if (editId !== null) {
      updateFeature.mutate({ id: editId, data }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListFeaturesQueryKey() }); reset(); setView("list"); } });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Xóa tính năng này?")) return;
    deleteFeature.mutate({ id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListFeaturesQueryKey() }) });
  };

  const handleToggle = (f: NonNullable<typeof features>[number]) => {
    updateFeature.mutate({ id: f.id, data: { enabled: !f.enabled } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListFeaturesQueryKey() }) });
  };

  if (view === "new" || view === "edit") {
    return (
      <div className="space-y-7">
        <BackRow onBack={() => { reset(); setView("list"); }} title={view === "new" ? "Tính năng mới" : "Chỉnh sửa tính năng"} />
        <Field label="Tên tính năng">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Ứng dụng điện thoại" className={inputCls + " font-serif"} />
        </Field>
        <Field label="Mô tả">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Mô tả ngắn về tính năng..." className={inputCls + " resize-y"} />
        </Field>
        <Field label="Biểu tượng">
          <select value={icon} onChange={(e) => setIcon(e.target.value)} className={inputCls}>
            {ICON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label} ({o.value})</option>)}
          </select>
        </Field>
        <Field label="Thứ tự hiển thị">
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className={inputCls + " w-28"} />
        </Field>
        <div className="flex items-center gap-3">
          <Toggle checked={enabled} onChange={setEnabled} />
          <span className="text-sm text-white/60">Hiển thị trên trang chủ</span>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={!title.trim() || createFeature.isPending || updateFeature.isPending}
            className={btnPrimary}>{createFeature.isPending || updateFeature.isPending ? "Đang lưu..." : "Lưu"}</button>
          <button onClick={() => { reset(); setView("list"); }} className={btnOutline}>Hủy</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <ListHeader label="Quản lý các tính năng/dịch vụ hiển thị trên trang chủ." onAdd={() => { reset(); setView("new"); }} addLabel="+ Thêm tính năng" />
      {isLoading ? <SkeletonList /> : !features?.length ? <Empty label="Chưa có tính năng nào." /> : (
        <div className="divide-y divide-white/6">
          {features.map((f) => (
            <div key={f.id} className="py-4 flex items-center justify-between gap-4 group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", f.enabled ? "bg-primary/15 text-primary" : "bg-white/8 text-white/35")}>
                    {f.enabled ? "Hiển thị" : "Ẩn"}
                  </span>
                  <span className="text-xs text-white/30">#{f.sortOrder}</span>
                </div>
                <p className="font-serif text-base text-white/85 group-hover:text-primary transition-colors truncate">{f.title}</p>
                <p className="text-xs text-white/40 truncate mt-0.5">{f.description}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <SmallBtn onClick={() => handleToggle(f)}>{f.enabled ? "Ẩn" : "Hiện"}</SmallBtn>
                <SmallBtn onClick={() => handleEdit(f)}>Sửa</SmallBtn>
                <SmallBtn danger onClick={() => handleDelete(f.id)}>Xóa</SmallBtn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── BLOG TAB ── */
function BlogTab() {
  const queryClient = useQueryClient();
  const { data: blogs, isLoading } = useListBlogs();
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();
  const [view, setView] = useState<"list" | "new" | "edit">("list");
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [published, setPublished] = useState(false);

  const reset = () => { setTitle(""); setContent(""); setExcerpt(""); setPublished(false); setEditId(null); };

  const handleEdit = (b: NonNullable<typeof blogs>[number]) => {
    setTitle(b.title); setContent(b.content); setExcerpt(b.excerpt ?? ""); setPublished(b.published); setEditId(b.id); setView("edit");
  };

  const handleSave = () => {
    if (view === "new") {
      createBlog.mutate({ data: { title, content, excerpt, published } }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListBlogsQueryKey() }); reset(); setView("list"); },
      });
    } else if (editId !== null) {
      updateBlog.mutate({ id: editId, data: { title, content, excerpt, published } }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListBlogsQueryKey() }); reset(); setView("list"); },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Xóa bài viết này?")) return;
    deleteBlog.mutate({ id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListBlogsQueryKey() }) });
  };

  const handleTogglePublish = (b: NonNullable<typeof blogs>[number]) => {
    updateBlog.mutate({ id: b.id, data: { published: !b.published } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListBlogsQueryKey() }),
    });
  };

  if (view === "new" || view === "edit") {
    return (
      <div className="space-y-7">
        <BackRow onBack={() => { reset(); setView("list"); }} title={view === "new" ? "Bài viết mới" : "Chỉnh sửa bài viết"} />
        <Field label="Tiêu đề">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề bài viết..." className={inputCls + " font-serif text-lg"} />
        </Field>
        <Field label="Tóm tắt">
          <input type="text" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Một câu mô tả ngắn..." className={inputCls} />
        </Field>
        <Field label="Nội dung" hint="Hỗ trợ Markdown cơ bản.">
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={16} placeholder="Viết nội dung bài..." className={inputCls + " resize-y leading-relaxed"} />
        </Field>
        <div className="flex items-center gap-3">
          <Toggle checked={published} onChange={setPublished} />
          <span className="text-sm text-white/60">Xuất bản ngay</span>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={!title.trim() || !content.trim() || createBlog.isPending || updateBlog.isPending}
            className={btnPrimary}>{createBlog.isPending || updateBlog.isPending ? "Đang lưu..." : "Lưu bài viết"}</button>
          <button onClick={() => { reset(); setView("list"); }} className={btnOutline}>Hủy</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <ListHeader label="Quản lý tất cả bài viết." onAdd={() => { reset(); setView("new"); }} addLabel="+ Bài viết mới" />
      {isLoading ? <SkeletonList /> : !blogs?.length ? <Empty label="Chưa có bài viết nào." /> : (
        <div className="divide-y divide-white/6">
          {blogs.map((b) => (
            <div key={b.id} className="py-4 flex items-start justify-between gap-4 group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", b.published ? "bg-primary/15 text-primary" : "bg-white/8 text-white/35")}>
                    {b.published ? "Đã xuất bản" : "Nháp"}
                  </span>
                  <time className="text-xs text-white/30">{format(new Date(b.createdAt), "dd/MM/yyyy")}</time>
                </div>
                <p className="font-serif text-base text-white/85 group-hover:text-primary transition-colors truncate">{b.title}</p>
                {b.excerpt && <p className="text-xs text-white/40 truncate mt-0.5">{b.excerpt}</p>}
              </div>
              <div className="flex gap-1.5 shrink-0">
                <SmallBtn onClick={() => handleTogglePublish(b)}>{b.published ? "Ẩn" : "Xuất bản"}</SmallBtn>
                <SmallBtn onClick={() => handleEdit(b)}>Sửa</SmallBtn>
                <SmallBtn danger onClick={() => handleDelete(b.id)}>Xóa</SmallBtn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── ORDER RULES TAB ── */
function OrderRulesTab() {
  const queryClient = useQueryClient();
  const { data: rules, isLoading } = useListOrderRules();
  const createRule = useCreateOrderRule();
  const updateRule = useUpdateOrderRule();
  const deleteRule = useDeleteOrderRule();
  const [view, setView] = useState<"list" | "new" | "edit">("list");
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  const reset = () => { setTitle(""); setContent(""); setSortOrder(0); setEditId(null); };

  const handleEdit = (r: NonNullable<typeof rules>[number]) => {
    setTitle(r.title); setContent(r.content); setSortOrder(r.sortOrder); setEditId(r.id); setView("edit");
  };

  const handleSave = () => {
    if (view === "new") {
      createRule.mutate({ data: { title, content, sortOrder } }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListOrderRulesQueryKey() }); reset(); setView("list"); },
      });
    } else if (editId !== null) {
      updateRule.mutate({ id: editId, data: { title, content, sortOrder } }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListOrderRulesQueryKey() }); reset(); setView("list"); },
      });
    }
  };

  if (view === "new" || view === "edit") {
    return (
      <div className="space-y-7">
        <BackRow onBack={() => { reset(); setView("list"); }} title={view === "new" ? "Quy định mới" : "Chỉnh sửa quy định"} />
        <Field label="Tiêu đề">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tên quy định..." className={inputCls + " font-serif"} />
        </Field>
        <Field label="Nội dung">
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} className={inputCls + " resize-y leading-relaxed"} />
        </Field>
        <Field label="Thứ tự hiển thị">
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className={inputCls + " w-28"} />
        </Field>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={!title.trim() || !content.trim() || createRule.isPending || updateRule.isPending}
            className={btnPrimary}>{createRule.isPending || updateRule.isPending ? "Đang lưu..." : "Lưu"}</button>
          <button onClick={() => { reset(); setView("list"); }} className={btnOutline}>Hủy</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <ListHeader label="Quản lý các quy định order." onAdd={() => { reset(); setView("new"); }} addLabel="+ Quy định mới" />
      {isLoading ? <SkeletonList /> : !rules?.length ? <Empty label="Chưa có quy định nào." /> : (
        <div className="divide-y divide-white/6">
          {rules.map((r) => (
            <div key={r.id} className="py-4 flex items-start justify-between gap-4 group">
              <div className="flex-1 min-w-0">
                <span className="text-xs text-white/30 mb-0.5 block">#{r.sortOrder}</span>
                <p className="font-serif text-base text-white/85 group-hover:text-primary transition-colors">{r.title}</p>
                <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{r.content}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <SmallBtn onClick={() => handleEdit(r)}>Sửa</SmallBtn>
                <SmallBtn danger onClick={() => { if (!confirm("Xóa quy định này?")) return; deleteRule.mutate({ id: r.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListOrderRulesQueryKey() }) }); }}>Xóa</SmallBtn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── PORTFOLIO TAB ── */
function PortfolioTab() {
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useListPortfolio();
  const createItem = useCreatePortfolioItem();
  const updateItem = useUpdatePortfolioItem();
  const deleteItem = useDeletePortfolioItem();
  const [view, setView] = useState<"list" | "new" | "edit">("list");
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  const reset = () => { setTitle(""); setDescription(""); setCoverImage(""); setLink(""); setTags(""); setSortOrder(0); setEditId(null); };

  const handleEdit = (item: NonNullable<typeof items>[number]) => {
    setTitle(item.title); setDescription(item.description); setCoverImage(item.coverImage ?? ""); setLink(item.link ?? ""); setTags(item.tags); setSortOrder(item.sortOrder); setEditId(item.id); setView("edit");
  };

  const handleSave = () => {
    const data = { title, description, coverImage: coverImage || undefined, link: link || undefined, tags, sortOrder };
    if (view === "new") {
      createItem.mutate({ data }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPortfolioQueryKey() }); reset(); setView("list"); } });
    } else if (editId !== null) {
      updateItem.mutate({ id: editId, data }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPortfolioQueryKey() }); reset(); setView("list"); } });
    }
  };

  if (view === "new" || view === "edit") {
    return (
      <div className="space-y-7">
        <BackRow onBack={() => { reset(); setView("list"); }} title={view === "new" ? "Dự án mới" : "Chỉnh sửa dự án"} />
        <Field label="Tên dự án">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tên dự án..." className={inputCls + " font-serif"} />
        </Field>
        <Field label="Mô tả">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className={inputCls + " resize-y"} />
        </Field>
        <Field label="Ảnh bìa (URL)" hint="Dán URL ảnh từ internet.">
          <input type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." className={inputCls} />
        </Field>
        <Field label="Link dự án">
          <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." className={inputCls} />
        </Field>
        <Field label="Tags" hint="Phân cách bằng dấu phẩy. VD: K-pop, Album, Japan">
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="VD: K-pop, Album, Japan" className={inputCls} />
        </Field>
        <Field label="Thứ tự hiển thị">
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className={inputCls + " w-28"} />
        </Field>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={!title.trim() || createItem.isPending || updateItem.isPending}
            className={btnPrimary}>{createItem.isPending || updateItem.isPending ? "Đang lưu..." : "Lưu"}</button>
          <button onClick={() => { reset(); setView("list"); }} className={btnOutline}>Hủy</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <ListHeader label="Quản lý các dự án đã support." onAdd={() => { reset(); setView("new"); }} addLabel="+ Dự án mới" />
      {isLoading ? <SkeletonList /> : !items?.length ? <Empty label="Chưa có dự án nào." /> : (
        <div className="divide-y divide-white/6">
          {items.map((item) => (
            <div key={item.id} className="py-4 flex items-start justify-between gap-4 group">
              <div className="flex-1 min-w-0">
                <p className="font-serif text-base text-white/85 group-hover:text-primary transition-colors truncate">{item.title}</p>
                {item.tags && <p className="text-xs text-primary/60 mt-0.5">{item.tags}</p>}
                <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{item.description}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <SmallBtn onClick={() => handleEdit(item)}>Sửa</SmallBtn>
                <SmallBtn danger onClick={() => { if (!confirm("Xóa dự án này?")) return; deleteItem.mutate({ id: item.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListPortfolioQueryKey() }) }); }}>Xóa</SmallBtn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── SETTINGS TAB ── */
function SettingsTab() {
  const queryClient = useQueryClient();
  const { data: contact, isLoading: contactLoading } = useGetContactSettings();
  const updateContact = useUpdateContactSettings();
  const changePassword = useChangeAdminPassword();
  const [email, setEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);

  React.useEffect(() => { if (contact) setEmail(contact.email); }, [contact]);

  const saveEmail = () => {
    updateContact.mutate({ data: { email } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetContactSettingsQueryKey() });
        setEmailSaved(true); setTimeout(() => setEmailSaved(false), 2500);
      },
    });
  };

  const savePw = () => {
    setPwError("");
    if (newPw.length < 4) { setPwError("Mật khẩu mới phải có ít nhất 4 ký tự."); return; }
    if (newPw !== confirmPw) { setPwError("Mật khẩu xác nhận không khớp."); return; }
    changePassword.mutate({ data: { currentPassword: currentPw, newPassword: newPw } }, {
      onSuccess: () => { setCurrentPw(""); setNewPw(""); setConfirmPw(""); setPwSaved(true); setTimeout(() => setPwSaved(false), 2500); },
      onError: () => setPwError("Mật khẩu hiện tại không đúng."),
    });
  };

  return (
    <div className="space-y-12">
      {/* Contact email */}
      <div className="space-y-6">
        <h3 className="font-serif text-xl text-primary border-b border-white/8 pb-4">Thông tin liên hệ</h3>
        {contactLoading ? <SkeletonForm rows={1} /> : (
          <>
            <Field label="Email liên hệ" hint="Hiển thị ở footer của trang.">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" className={inputCls} />
            </Field>
            <SaveRow isPending={updateContact.isPending} saved={emailSaved} onSave={saveEmail} />
          </>
        )}
      </div>

      {/* Change password */}
      <div className="space-y-6">
        <h3 className="font-serif text-xl text-primary border-b border-white/8 pb-4">Đổi mật khẩu Admin</h3>
        <Field label="Mật khẩu hiện tại">
          <input type="password" value={currentPw} onChange={(e) => { setCurrentPw(e.target.value); setPwError(""); }} className={inputCls} />
        </Field>
        <Field label="Mật khẩu mới">
          <input type="password" value={newPw} onChange={(e) => { setNewPw(e.target.value); setPwError(""); }} className={inputCls} />
        </Field>
        <Field label="Xác nhận mật khẩu mới">
          <input type="password" value={confirmPw} onChange={(e) => { setConfirmPw(e.target.value); setPwError(""); }} className={inputCls} />
        </Field>
        {pwError && <p className="text-destructive text-sm">{pwError}</p>}
        <SaveRow isPending={changePassword.isPending} saved={pwSaved} onSave={savePw} saveLabel="Đổi mật khẩu" savedLabel="Đã đổi thành công." />
      </div>
    </div>
  );
}

/* ── SHARED UI ── */
const inputCls = "w-full bg-white/4 border border-white/10 px-4 py-3 text-foreground placeholder:text-white/25 focus:outline-none focus:border-primary/50 transition-colors";
const btnPrimary = "px-7 py-2.5 bg-primary text-background hover:bg-primary/90 disabled:opacity-50 transition-colors font-serif text-sm tracking-wide";
const btnOutline = "px-6 py-2.5 border border-white/15 text-white/60 hover:border-white/30 hover:text-white/80 transition-colors text-sm";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-white/45 tracking-widest uppercase">{label}</label>
      {hint && <p className="text-xs text-white/30">{hint}</p>}
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
    </label>
  );
}

function SmallBtn({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={cn("text-xs px-2.5 py-1.5 border transition-colors",
      danger ? "border-white/10 text-white/35 hover:border-destructive hover:text-destructive" : "border-white/10 text-white/45 hover:border-primary/50 hover:text-primary"
    )}>{children}</button>
  );
}

function BackRow({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <button onClick={onBack} className="text-sm text-white/40 hover:text-white/70 transition-colors">← Quay lại</button>
      <h2 className="text-2xl font-serif text-primary">{title}</h2>
    </div>
  );
}

function ListHeader({ label, onAdd, addLabel }: { label: string; onAdd: () => void; addLabel: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-white/45 text-sm">{label}</p>
      <button onClick={onAdd} className={btnPrimary}>{addLabel}</button>
    </div>
  );
}

function SaveRow({ isPending, saved, onSave, saveLabel = "Lưu thay đổi", savedLabel = "Đã lưu thành công." }: { isPending: boolean; saved: boolean; onSave: () => void; saveLabel?: string; savedLabel?: string }) {
  return (
    <div className="flex items-center gap-4">
      <button onClick={onSave} disabled={isPending} className={btnPrimary}>{isPending ? "Đang lưu..." : saveLabel}</button>
      {saved && <span className="text-sm text-primary italic animate-in fade-in duration-300">{savedLabel}</span>}
    </div>
  );
}

function SkeletonForm({ rows }: { rows: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: rows }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="text-center py-14">
      <p className="text-white/30 italic text-sm">{label}</p>
    </div>
  );
}
