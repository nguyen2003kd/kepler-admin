/* eslint-disable */
import type { CategoryBulkItemLanguage } from './categoryBulkItemLanguage';

export interface CategoryBulkItem {
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
  language: CategoryBulkItemLanguage;
  /**
   * Display position/order
   * @nullable
   */
  position?: number | null;
  /**
   * Additional notes
   * @nullable
   */
  note?: string | null;
  /**
   * Category description
   * @nullable
   */
  description?: string | null;
  /**
   * Navigation link for the category
   * @nullable
   */
  link?: string | null;
  /**
   * URL of the category icon
   * @nullable
   */
  icon_url?: string | null;
  /** Nested child categories (recursive) */
  categories?: CategoryBulkItem[];
}
