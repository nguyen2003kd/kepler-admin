/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react';
import { toast } from '@/components/ui/toaster'

// ** Stores & Hooks
import useAuthStore from '@stores/auth';
import { useRouter, usePathname } from 'next/navigation';
import { clearAuthPresenceCookie, setAuthPresenceCookie } from '@/lib/auth-cookie';

interface AuthGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const AuthGuard = ({ children, fallback }: AuthGuardProps) => {
  const auth = useAuthStore();
  const setStore = useAuthStore((state) => state.setStore);
  const resetStore = useAuthStore((state) => state.resetStore);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const router = useRouter();
  const pathname = usePathname();



  useEffect(() => {
    if (pathname === '/' || pathname === '/admin') {
      return;
    }
    
    if (!hasHydrated) return;

    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('auth-token')
        : null;

    if (!auth.username || !token) {
      resetStore();
      localStorage.removeItem('auth-token');
      clearAuthPresenceCookie();
      if (pathname !== '/login') {
        router.replace(
          `/login?returnUrl=${encodeURIComponent(pathname)}`
        );
      }
      return;
    }

    setAuthPresenceCookie();
  }, [auth.username, pathname, router, resetStore, hasHydrated]);

  if (!hasHydrated || !auth.username) {
    return fallback;
  }

  return <>{children}</>;
};

export default AuthGuard;
