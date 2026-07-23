/* eslint-disable */

/**
 * Department status
 * @nullable
 */
export type DepartmentStatus = typeof DepartmentStatus[keyof typeof DepartmentStatus] | null;


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DepartmentStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;
