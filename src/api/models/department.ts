/* eslint-disable */
import type { DepartmentStatus } from './departmentStatus';

export interface Department {
  /** Unique identifier */
  id?: string;
  /** Department name */
  name?: string;
  /**
   * Department code
   * @nullable
   */
  code?: string | null;
  /**
   * Department description
   * @nullable
   */
  description?: string | null;
  /**
   * Department status
   * @nullable
   */
  status?: DepartmentStatus;
  /**
   * Creation timestamp
   * @nullable
   */
  created_at?: string | null;
  /**
   * ID of the user who created the record
   * @nullable
   */
  created_by?: string | null;
  /**
   * Last update timestamp
   * @nullable
   */
  updated_at?: string | null;
  /**
   * ID of the user who last updated the record
   * @nullable
   */
  updated_by?: string | null;
}
