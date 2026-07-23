'use client';

import { ReactNode, useMemo } from 'react';
import { AbilityContext } from '@configs/AbilityContext';
import { buildAbilityFor } from '@configs/acl';
import useAuthStore from '@stores/auth';

interface AbilityProviderProps {
  children: ReactNode;
}

/**
 * Provider component cung cấp CASL ability context cho toàn bộ dashboard
 * Tự động rebuild ability khi permissions hoặc roles thay đổi
 */
export const AbilityProvider = ({ children }: AbilityProviderProps) => {
  const permissions = useAuthStore(state => state.permissions) || [];
  const roles = useAuthStore(state => state.roles) || [];

  const ability = useMemo(() => {
    return buildAbilityFor(permissions, roles);
  }, [permissions, roles]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};
