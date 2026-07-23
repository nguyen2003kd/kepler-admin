/* eslint-disable */
import type { DepartmentMutateStatus } from './departmentMutateStatus';

export interface DepartmentMutate {
  /**
   * Department name
   * @minLength 1
   * @maxLength 100
   */
  name: string;
  /**
   * Department code
   * @minLength 1
   * @maxLength 50
   */
  code?: string;
  /** Department description */
  description?: string;
  /** Department status */
  status?: DepartmentMutateStatus;
}
