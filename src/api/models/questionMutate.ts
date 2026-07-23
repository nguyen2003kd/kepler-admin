/* eslint-disable */

export interface QuestionMutate {
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /** @maxLength 20 */
  phone_number: string;
  /** @maxLength 255 */
  email: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  address: string;
  /**
   * @maxLength 255
   * @nullable
   */
  major?: string | null;
  /** @minLength 1 */
  question: string;
}
