/* eslint-disable */

export interface Candidate {
  id?: string;
  /** @nullable */
  recruitment_id?: string | null;
  /** @nullable */
  position?: string | null;
  full_name?: string;
  address?: string;
  email?: string;
  phone?: string;
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
  created_at?: string;
  /** @nullable */
  updated_at?: string | null;
}
