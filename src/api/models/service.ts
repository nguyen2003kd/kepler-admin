/* eslint-disable */

export interface Service {
  /** Unique identifier of the service */
  id?: string;
  /** Name of the service */
  name?: string;
  /** Creation timestamp */
  created_at?: string;
  /**
   * Last update timestamp
   * @nullable
   */
  updated_at?: string | null;
  /**
   * ID of the user who created the service
   * @nullable
   */
  created_by?: string | null;
  /**
   * ID of the user who last updated the service
   * @nullable
   */
  updated_by?: string | null;
}
