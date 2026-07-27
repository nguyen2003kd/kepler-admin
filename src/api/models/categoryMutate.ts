/* eslint-disable */
import type { CategoryMutateLanguage } from './categoryMutateLanguage';

export interface CategoryMutate {
  /**
   * Name of the category
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /**
   * Unique code of the category
   * @minLength 1
   * @maxLength 100
   */
  code: string;
  /** Language of the category */
  language: CategoryMutateLanguage;
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
