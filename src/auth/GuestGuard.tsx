"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import useAuthStore from "@stores/auth";
import { useRouter } from "next/navigation";
import { ReactElement, ReactNode, useEffect } from "react";
interface GuestGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props;
  const router = useRouter();
  const auth = useAuthStore();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  useEffect(() => {
    if (!hasHydrated) return;
    const token = localStorage.getItem("auth-token");
    if (auth.email) {
      router.push("/dashboard");
    }
  }, [router, auth.email, hasHydrated]);
  if ( auth.username) {
    return fallback;
  }
  return <>{children}</>;
};

export default GuestGuard;
