/* eslint-disable */

export interface PageConfig {
  /** Unique identifier */
  id?: string;
  /** Configuration key (unique) */
  key?: string;
  /**
   * Configuration value
   * @nullable
   */
  value?: string | null;
  /**
   * Description of the configuration
   * @nullable
   */
  description?: string | null;
  /**
   * Whether the configuration is active
   * @nullable
   */
  is_active?: boolean | null;
  /** Creation timestamp */
  created_at?: string;
  /**
   * Last update timestamp
   * @nullable
   */
  updated_at?: string | null;
  /**
   * ID of the user who created the record
   * @nullable
   */
  created_by?: string | null;
  /**
   * ID of the user who last updated the record
   * @nullable
   */
  updated_by?: string | null;
}
