/* eslint-disable */

export interface FileUpload {
  /** The file to upload */
  file: Blob;
  /** File category (image, video or file) */
  type?: string;
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
}
