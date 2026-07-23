/* eslint-disable */
import type { OrganizationChartMutateSize } from './organizationChartMutateSize';
import type { OrganizationChartMutateCoordinates } from './organizationChartMutateCoordinates';

export interface OrganizationChartMutate {
  /**
   * Full name
   * @minLength 1
   * @maxLength 255
   */
  full_name: string;
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
  size?: OrganizationChartMutateSize;
  /**
   * Node coordinates
   * @nullable
   */
  coordinates?: OrganizationChartMutateCoordinates;
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
  /**
   * Department ID
   * @nullable
   */
  department_id?: string | null;
}
