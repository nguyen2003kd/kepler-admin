/* eslint-disable */
import type { OrganizationChartSize } from './organizationChartSize';
import type { OrganizationChartCoordinates } from './organizationChartCoordinates';

export interface OrganizationChart {
  /** Unique identifier */
  id?: string;
  /**
   * Department ID
   * @nullable
   */
  department_id?: string | null;
  /**
   * Department name (resolved from department_id)
   * @nullable
   */
  department_name?: string | null;
  /** Full name */
  full_name?: string;
  /**
   * Position or title
   * @nullable
   */
  position?: string | null;
  /**
   * Node color
   * @nullable
   */
  color?: string | null;
  /**
   * Node size metadata
   * @nullable
   */
  size?: OrganizationChartSize;
  /**
   * Node coordinates
   * @nullable
   */
  coordinates?: OrganizationChartCoordinates;
  /**
   * Avatar URL
   * @nullable
   */
  avatar_url?: string | null;
  /**
   * Description
   * @nullable
   */
  description?: string | null;
}
