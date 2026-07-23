"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { useSidebarStore } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import AuthGuard from "@/auth/AuthGuard";
import { RouteGuard } from "@/auth/RouteGuard";
import { FallbackSpinner } from "@/components/shared/fallbackspinner";
import { Toaster } from "@components/ui/toaster";
import useSyncUserProfile from "@/hooks/use-sync-user-profile";
import { AbilityProvider } from "@/components/providers/ability-provider";
import useSseNotifications from "@/hooks/use-sse-notifications";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebarStore();
  useSyncUserProfile();
  useSseNotifications();

  return (
    <div className="min-h-screen bg-background">

      <Providers>
        <AuthGuard fallback={<FallbackSpinner fullScreen={true} />}>
          <AbilityProvider>
            <RouteGuard fallback={<FallbackSpinner fullScreen={true} />}>
              <Sidebar />
              <div
                className={cn(
                  "transition-all duration-300",
                  isOpen ? "lg:pl-64" : "lg:pl-20",
                )}
              >
                {children}
              </div>
              <Toaster
                richColors
                closeButton
                position="bottom-right"
                toastOptions={{
                  duration: 3000,
                  className: "p-3 gap-2",
                  classNames: {
                    closeButton:
                      "left-auto right-0 top-0 -translate-y-2.5 translate-x-0",
                  },
                }}
              />
            </RouteGuard>
          </AbilityProvider>
        </AuthGuard>
      </Providers>
    </div>
  );
}