/* eslint-disable */

export interface RoleMutate {
  /**
   * Name of the role
   * @minLength 1
   * @maxLength 100
   */
  name: string;
  /**
   * Description of the role
   * @nullable
   */
  description?: string | null;
}
