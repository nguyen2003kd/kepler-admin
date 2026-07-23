/* eslint-disable */

export interface PageConfigMutate {
  /**
   * Configuration key (unique)
   * @minLength 1
   * @maxLength 100
   */
  key: string;
  /**
   * Configuration value
   * @nullable
   */
  value?: string | null;
  /**
   * Description of the configuration
   * @nullable
   */
  description?: string | null;
  /**
   * Whether the configuration is active
   * @nullable
   */
  is_active?: boolean | null;
}
