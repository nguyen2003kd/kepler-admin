/* eslint-disable */

export interface PermissionMutate {
  /**
   * Name of the permission
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /**
   * Description of what this permission allows
   * @nullable
   */
  description?: string | null;
  /**
   * Resource that this permission applies to (e.g., user, post, category)
   * @minLength 1
   * @maxLength 100
   */
  resource: string;
  /**
   * Action that this permission allows (e.g., read, create, update, delete, manage)
   * @minLength 1
   * @maxLength 100
   */
  action: string;
}
