/* eslint-disable */

export type PostApiV10FileBulkBody = {
  files?: Blob[];
  /** Apply this value to `is_in_library` for all uploaded files (overrides per-file values) */
  is_in_library_all?: boolean;
};
