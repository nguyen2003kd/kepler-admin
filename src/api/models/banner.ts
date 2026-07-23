/* eslint-disable */

export interface Banner {
  /** Unique identifier */
  id?: string;
  /** Banner name */
  name?: string;
  /**
   * Banner description
   * @nullable
   */
  description?: string | null;
  /**
   * ID of the associated file
   * @nullable
   */
  file_id?: string | null;
  /**
   * Image URL
   * @nullable
   */
  img_url?: string | null;
  /**
   * Sort order for display
   * @nullable
   */
  sort_order?: string | null;
  /**
   * Display time configuration
   * @nullable
   */
  display_time?: string | null;
  /**
   * Active status
   * @nullable
   */
  is_active?: boolean | null;
  /**
   * Creation timestamp
   * @nullable
   */
  created_at?: string | null;
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
