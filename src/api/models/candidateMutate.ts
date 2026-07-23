/* eslint-disable */

export interface CandidateMutate {
  /** @nullable */
  recruitment_id?: string | null;
  /**
   * @maxLength 255
   * @nullable
   */
  position?: string | null;
  /**
   * @minLength 1
   * @maxLength 255
   */
  full_name: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  address: string;
  /** @maxLength 255 */
  email: string;
  /**
   * @minLength 1
   * @maxLength 20
   */
  phone: string;
  /** @nullable */
  language_proficiency?: string | null;
  /** @nullable */
  it_proficiency?: string | null;
  /** @nullable */
  education_level?: string | null;
  /** @nullable */
  major?: string | null;
  /** @nullable */
  cv_url?: string | null;
  /** @nullable */
  cover_letter?: string | null;
  /** @nullable */
  status?: string | null;
  /** @nullable */
  note?: string | null;
}
