/* eslint-disable */

export interface RecruitmentMutate {
  /**
   * @minLength 1
   * @maxLength 255
   */
  title: string;
  /** @nullable */
  description?: string | null;
  /** @nullable */
  requirements?: string | null;
  /** @nullable */
  benefits?: string | null;
  /** @nullable */
  location?: string | null;
  /** @nullable */
  salary_min?: number | null;
  /** @nullable */
  salary_max?: number | null;
  /**
   * @minimum 1
   * @nullable
   */
  quantity?: number | null;
  /** @nullable */
  experience?: string | null;
  /** @nullable */
  employment_type?: string | null;
  /** @nullable */
  file_id?: string | null;
  /** @nullable */
  deadline?: string | null;
  /** @nullable */
  is_active?: boolean | null;
  /** @nullable */
  required_documents?: string | null;
}
