/* eslint-disable */

export interface BannerMutate {
  /**
   * Banner name
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /**
   * Banner description
   * @maxLength 1000
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
}
