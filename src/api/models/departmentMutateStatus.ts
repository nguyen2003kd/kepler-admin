/* eslint-disable */

/**
 * Department status
 */
export type DepartmentMutateStatus = typeof DepartmentMutateStatus[keyof typeof DepartmentMutateStatus];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DepartmentMutateStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;
