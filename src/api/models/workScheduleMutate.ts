/* eslint-disable */

export interface WorkScheduleMutate {
  /**
   * Work schedule title
   * @minLength 1
   * @maxLength 255
   */
  title: string;
  /**
   * Work schedule description
   * @nullable
   */
  description?: string | null;
  /**
   * Tasks in this work schedule
   * @nullable
   */
  tasks?: string | null;
  /** Host user ID */
  host_id: string;
  /** Work schedule date-time */
  schedule_time: string;
  /**
   * Work schedule end time
   * @nullable
   */
  end_time?: string | null;
  /**
   * Status of work schedule
   * @maxLength 50
   */
  status?: string;
}
