'use client';

// import { AbilityContext } from '@configs/AbilityContext';
// import { buildAbilityFor } from '@configs/acl';
// import useAuthStore from '@/stores/auth';
import { QueryProvider } from '@/components/providers/query-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  // const permissions = useAuthStore((s) => s.permissions);

  // const ability = buildAbilityFor(permissions || []);

  return (
    <QueryProvider>
      {/* <AbilityContext.Provider value={ability}> */}
        {children}
      {/* </AbilityContext.Provider> */}
    </QueryProvider>
  );
}
