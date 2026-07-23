'use client';

import { createContext } from 'react';
import { Ability } from '@casl/ability';
import type { AppAbility } from './acl';

/**
 * Default ability với không có quyền nào (guest)
 * Dùng làm default context value để tránh undefined
 */
const defaultAbility = new Ability([]) as AppAbility;

export const AbilityContext = createContext<AppAbility>(defaultAbility);
