/* eslint-disable */

export interface Category {
  /** Unique identifier of the category */
  id?: string;
  /** Name of the category */
  name?: string;
  /** Unique code of the category */
  code?: string;
  /**
   * Display position/order of the category
   * @nullable
   */
  position?: number | null;
  /**
   * Additional notes for the category
   * @nullable
   */
  note?: string | null;
  /**
   * Description of the category
   * @nullable
   */
  description?: string | null;
  /**
   * ID of the parent category (null for root categories)
   * @nullable
   */
  parent_category_id?: string | null;
  /** Creation timestamp */
  created_at?: string;
  /**
   * Last update timestamp
   * @nullable
   */
  updated_at?: string | null;
  /**
   * ID of the user who created the category
   * @nullable
   */
  created_by?: string | null;
  /**
   * ID of the user who last updated the category
   * @nullable
   */
  updated_by?: string | null;
  /**
   * Navigation link for the category
   * @nullable
   */
  link?: string | null;
  /** Indicates if the category is a service */
  is_service?: boolean;
  /**
   * URL of the category icon
   * @nullable
   */
  icon_url?: string | null;
}
