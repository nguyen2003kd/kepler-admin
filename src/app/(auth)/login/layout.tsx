"use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import useAuthStore from "@stores/auth";
import { Toaster } from "@components/ui/toaster";
import GuestGuard from "@/auth/GuestGuard";
import { FallbackSpinner } from "@/components/shared/fallbackspinner";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const router = useRouter();
  // const auth = useAuthStore();
  // useEffect(() => {

  //   if (!auth.username == null) {
  //     router.push("/dashboard");
  //   } else {
  //     router.push("/login");
  //   }
  // }, [router, auth.username]);

  return (
    <div className="min-h-screen bg-background">
      <GuestGuard fallback={<FallbackSpinner fullScreen={true}/>}>
        {children}
      </GuestGuard>
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
    </div>
  );
}
