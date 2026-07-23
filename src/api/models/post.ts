/* eslint-disable */
import type { PostStatus } from './postStatus';

export interface Post {
  /** Unique identifier */
  id?: string;
  /** Post title */
  title?: string;
  /** Post code */
  code?: string;
  /** URL-friendly slug */
  slug?: string;
  /**
   * Path to thumbnail image
   * @nullable
   */
  thumbnail_path?: string | null;
  /**
   * Post summary
   * @nullable
   */
  summary?: string | null;
  /**
   * Post title in English
   * @nullable
   */
  title_en?: string | null;
  /**
   * URL-friendly slug in English
   * @nullable
   */
  slug_en?: string | null;
  /**
   * Post summary in English
   * @nullable
   */
  summary_en?: string | null;
  /**
   * Display position
   * @nullable
   */
  position?: number | null;
  /**
   * Whether the post is hidden
   * @nullable
   */
  is_hidden?: boolean | null;
  /**
   * Approval status
   * @nullable
   */
  status?: PostStatus;
  /**
   * Whether the post is a service
   * @nullable
   */
  is_service?: boolean | null;
  /**
   * Expiration date
   * @nullable
   */
  expired_at?: string | null;
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
  /** Number of page views for this post */
  view?: number;
}
