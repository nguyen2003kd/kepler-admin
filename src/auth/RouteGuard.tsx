'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAbility } from '@/hooks/use-ability';
import { ReactNode, useEffect, useMemo, useState, ReactElement } from 'react';
import useAuthStore from '@stores/auth';
import {
  ROUTE_ACCESS,
  findMatchedRoute,
  hasRouteAccess,
  canViewRoute,
} from '@configs/permissions-matrix';

interface RouteGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

export function RouteGuard({ children, fallback }: RouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const ability = useAbility();
  const permissions = useAuthStore(state => state.permissions);
  const hasHydrated = useAuthStore(state => state._hasHydrated);
  const [isChecking, setIsChecking] = useState(true);

  // Memoize permissions de tranh recalculate moi render
  const permissionsMemo = useMemo(() => permissions ?? [], [permissions]);

  // Reset khi pathname thay đổi (sau redirect)
  useEffect(() => { setIsChecking(true) }, [pathname])

  useEffect(() => {
    if (!hasHydrated) return;

    // SuperAdmin: full access
    if (ability.can('manage', 'all')) {
      setIsChecking(false);
      return;
    }

    // Tim route dai nhat match voi pathname (order-independent)
    const matchedRoute = findMatchedRoute(pathname);

    // Khong co route protected -> cho phep
    if (!matchedRoute) {
      setIsChecking(false);
      return;
    }

    const routeRule = ROUTE_ACCESS[matchedRoute];
    const isExactMatch = pathname === matchedRoute;

    // Kiem tra quyen:
    // - Exact match: chi dung main resources (hasRouteAccess)
    // - Child route: dung main + extraViewer (canViewRoute)
    const hasPermission = isExactMatch
      ? hasRouteAccess(permissionsMemo, routeRule)
      : canViewRoute(permissionsMemo, routeRule, pathname);

    if (!hasPermission) {
      // Tim route dau tien user co quyen (dashboard uu tien)
      const allowedRoute = Object.entries(ROUTE_ACCESS)
        .sort(([a], [b]) => (a === '/dashboard' ? -1 : b === '/dashboard' ? 1 : 0))
        .find(([path, rule]) => path !== pathname && hasRouteAccess(permissionsMemo, rule));

      router.push(allowedRoute?.[0] ?? '/403');
    } else {
      setIsChecking(false);
    }
  }, [pathname, ability, router, permissionsMemo, hasHydrated]);

  if (isChecking || !hasHydrated) return fallback;

  return <>{children}</>;
}
