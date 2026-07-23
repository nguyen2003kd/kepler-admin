/* eslint-disable */
import type { PostContentImageInput } from './postContentImageInput';

export interface PostContentInput {
  /** Content text */
  content: string;
  /** Content position */
  position: number;
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
  post_content_images?: PostContentImageInput[];
}
