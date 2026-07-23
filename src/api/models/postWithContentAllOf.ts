/* eslint-disable */
import type { PostContent } from './postContent';

export type PostWithContentAllOf = {
  post_content?: PostContent[];
  /** Array of Category IDs associated with the post */
  category_ids?: string[];
};
