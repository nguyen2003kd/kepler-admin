/* eslint-disable */
import type { PostMutateStatus } from './postMutateStatus';
import type { PostContentInput } from './postContentInput';

export interface PostMutate {
  /**
   * Post title
   * @minLength 1
   * @maxLength 255
   */
  title: string;
  /**
   * Post code
   * @minLength 1
   * @maxLength 100
   */
  code: string;
  /**
   * URL-friendly slug
   * @minLength 1
   * @maxLength 255
   */
  slug: string;
  /**
   * Post summary
   * @nullable
   */
  summary?: string | null;
  /**
   * Post title in English
   * @minLength 1
   * @maxLength 255
   * @nullable
   */
  title_en?: string | null;
  /**
   * URL-friendly slug in English
   * @minLength 1
   * @maxLength 255
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
   * Whether the post is a service
   * @nullable
   */
  is_service?: boolean | null;
  /**
   * Whether the post is hidden
   * @nullable
   */
  is_hidden?: boolean | null;
  /**
   * Approval status
   * @nullable
   */
  status?: PostMutateStatus;
  /**
   * Expiration date
   * @nullable
   */
  expired_at?: string | null;
  /**
   * Publication date
   * @nullable
   */
  published_at?: string | null;
  /**
   * Array of Category IDs
   * @nullable
   */
  category_ids?: string[] | null;
  /**
   * Thumbnail file ID - the file's path and compress_info will be used for thumbnail_path and thumbnail_compress_info
   * @nullable
   */
  thumbnail_file_id?: string | null;
  /** Array of post content items */
  post_content?: PostContentInput[];
}
