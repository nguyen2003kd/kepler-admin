/* eslint-disable */
import type { PostContentImage } from './postContentImage';

export interface PostContent {
  /** Unique identifier */
  id?: string;
  /** Content text */
  content?: string;
  /** Content position */
  position?: number;
  /**
   * Number of image columns
   * @nullable
   */
  image_columns?: number | null;
  /**
   * Number of image rows
   * @nullable
   */
  image_rows?: number | null;
  /** Post ID reference */
  post_id?: string;
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
  post_content_images?: PostContentImage[];
}
