/* eslint-disable */

export interface FileMutate {
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
