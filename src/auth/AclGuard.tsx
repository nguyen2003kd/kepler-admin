'use client';

import { AbilityContext } from '@configs/AbilityContext';

// ** React Imports
import { ReactNode, useMemo } from 'react'

// ** Types
import { ACLObj, AppAbility, buildAbilityFor } from '@configs/acl'

// ** Hooks
import useAuthStore from '@stores/auth'

// ** Others
import { usePathname, useRouter } from 'next/navigation'

interface AclGuardProps {
  children: ReactNode
  aclAbilities: ACLObj
}

const AclGuard = ({ aclAbilities, children }: AclGuardProps) => {
  const auth = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()

  const ability: AppAbility = useMemo(() => {
    const permissions = auth.permissions ?? []
    const roles = auth.roles ?? []
    return buildAbilityFor(permissions, roles)
  }, [auth.permissions, auth.roles])

  // Allow error pages and public routes without auth
  if (pathname === '/500' || pathname === '/404' || pathname === '/401') {
    if (auth.email) {
      return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    }
    return <>{children}</>
  }

  // User not authenticated
  if (!auth.email) {
    return <div>Redirecting to login...</div>
  }

  // Check permissions
  if (ability.can(aclAbilities.action, aclAbilities.subject)) {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  // User doesn't have permission
  if (typeof window !== 'undefined') {
    router.push('/403')
  }
  
  return <div>Access Denied. Redirecting...</div>
}

export default AclGuard
