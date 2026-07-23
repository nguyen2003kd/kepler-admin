"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, LogOut, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { postApiV10AuthLogout } from '@/api/endpoints/authentication';
import { clearAuthPresenceCookie } from '@/lib/auth-cookie';

export default function NotFound() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await postApiV10AuthLogout();
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        clearAuthPresenceCookie();
      }
      router.push('/login');
    }
  };
  return (
    <section className="relative isolate overflow-hidden bg-background">
      <div className="pointer-events-none absolute -left-28 -top-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-28 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[42rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.12),transparent_70%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-220px)] w-full max-w-6xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-3 inline-flex items-center rounded-full border border-primary/20 bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Error 403
            </p>

            <h1 className="text-[2.2rem] font-black leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
              Trang bạn tìm
              <span className="block text-primary">không tồn tại</span>
            </h1>

            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-base">
              Có thể đường dẫn đã thay đổi hoặc nội dung đã được cập nhật. Bạn có thể quay
              về trang chủ, sử dụng tìm kiếm hoặc xem nhanh các chuyên mục chính.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Home className="h-4 w-4" />
                Về trang chủ
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                {isLoading ? "Đang đăng xuất..." : "Đăng xuất"}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xl shadow-primary/10 sm:p-8">
              <div className="absolute right-0 top-0 h-24 w-24 bg-[radial-gradient(circle_at_top_right,hsl(var(--secondary-foreground)/0.16),transparent_72%)]" />
              <div className="absolute bottom-0 left-0 h-20 w-20 bg-[radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.18),transparent_70%)]" />
              <div className="mt-6 flex items-end gap-2">
                <span className="text-7xl font-black leading-none text-primary">4</span>
                <span className="text-7xl font-black leading-none text-muted-foreground">0</span>
                <span className="text-7xl font-black leading-none text-primary">3</span>
              </div>

              <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                <p className="rounded-md border border-border bg-muted/50 px-3 py-2">
                  Gợi ý: kiểm tra lại chính tả của đường dẫn URL.
                </p>
                <p className="rounded-md border border-border bg-secondary/50 px-3 py-2">
                  Hoặc quay lại menu trên cùng để chọn đúng chuyên mục.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
