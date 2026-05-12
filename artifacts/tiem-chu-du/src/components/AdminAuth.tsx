import React, { useState, useEffect, createContext, useContext } from "react";
import { useGetAdminAuthStatus, useLoginAdmin, useSetupAdminPassword } from "@workspace/api-client-react";

const SESSION_KEY = "tiemduchdu_admin_auth";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue>({
  isAuthenticated: false,
  logout: () => {},
});

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  });

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  };

  const markAuthenticated = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setIsAuthenticated(true);
  };

  const { data: authStatus, isLoading } = useGetAdminAuthStatus();
  const loginMutation = useLoginAdmin();
  const setupMutation = useSetupAdminPassword();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return (
      <AdminAuthContext.Provider value={{ isAuthenticated, logout }}>
        {children}
      </AdminAuthContext.Provider>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  const isSetup = authStatus?.hasPassword ?? false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isSetup) {
      if (password.length < 4) {
        setError("Mật khẩu phải có ít nhất 4 ký tự.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Mật khẩu xác nhận không khớp.");
        return;
      }
      setupMutation.mutate(
        { data: { password } },
        {
          onSuccess: () => markAuthenticated(),
          onError: () => setError("Đã có lỗi xảy ra. Thử lại."),
        }
      );
    } else {
      loginMutation.mutate(
        { data: { password } },
        {
          onSuccess: () => markAuthenticated(),
          onError: () => setError("Mật khẩu không đúng."),
        }
      );
    }
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, logout }}>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <p className="font-serif text-3xl text-primary mb-2">Tiệm Chu Du</p>
            <p className="text-white/40 text-sm tracking-widest uppercase">
              {isSetup ? "Đăng nhập Admin" : "Thiết lập mật khẩu"}
            </p>
          </div>

          <div className="border border-white/10 bg-white/3 p-8">
            {!isSetup && (
              <p className="text-white/50 text-sm mb-6 leading-relaxed">
                Lần đầu truy cập. Hãy tạo mật khẩu để bảo vệ trang quản trị.
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 tracking-widest uppercase">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Nhập mật khẩu..."
                  autoFocus
                  className="w-full bg-white/5 border border-white/12 px-4 py-3 text-foreground placeholder:text-white/25 focus:outline-none focus:border-primary/50 focus:ring-0 transition-colors"
                />
              </div>

              {!isSetup && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 tracking-widest uppercase">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                    placeholder="Nhập lại mật khẩu..."
                    className="w-full bg-white/5 border border-white/12 px-4 py-3 text-foreground placeholder:text-white/25 focus:outline-none focus:border-primary/50 focus:ring-0 transition-colors"
                  />
                </div>
              )}

              {error && (
                <p className="text-destructive text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={loginMutation.isPending || setupMutation.isPending}
                className="w-full py-3 bg-primary text-background hover:bg-primary/90 disabled:opacity-50 transition-colors font-serif tracking-widest text-sm"
              >
                {loginMutation.isPending || setupMutation.isPending
                  ? "Đang xử lý..."
                  : isSetup
                  ? "Đăng nhập"
                  : "Tạo mật khẩu"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminAuthContext.Provider>
  );
}
