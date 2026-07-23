/* eslint-disable */
import type { FileCompressInfo } from './fileCompressInfo';

export interface File {
  /** Unique identifier of the file */
  id?: string;
  /** Relative path to the file in storage */
  path?: string;
  /** Original filename */
  name?: string;
  /** MIME type of the file */
  mime?: string;
  /** File category derived from mime type */
  type?: string;
  /**
   * File size in bytes
   * @nullable
   */
  size?: number | null;
  /**
   * Information about compressed variants (for images)
   * @nullable
   */
  compress_info?: FileCompressInfo;
  /**
   * Display title of the file
   * @nullable
   */
  title?: string | null;
  /**
   * Description of the file
   * @nullable
   */
  description?: string | null;
  /**
   * Additional notes for the file
   * @nullable
   */
  note?: string | null;
  /** Whether the file is available in the media library */
  is_in_library?: boolean;
  /** Creation timestamp */
  created_at?: string;
  /**
   * Last update timestamp
   * @nullable
   */
  updated_at?: string | null;
  /**
   * ID of the user who uploaded the file
   * @nullable
   */
  created_by?: string | null;
  /**
   * ID of the user who last updated the file
   * @nullable
   */
  updated_by?: string | null;
}
