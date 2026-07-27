/* eslint-disable */

export interface WorkSchedule {
  /** Unique identifier */
  id?: string;
  /** Work schedule title */
  title?: string;
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
  host_id?: string;
  /** Work schedule date-time */
  schedule_time?: string;
  /**
   * Work schedule end time
   * @nullable
   */
  end_time?: string | null;
  /**
   * Status of work schedule
   * @nullable
   */
  status?: string | null;
  /** Created by user ID */
  created_by?: string;
  /**
   * Creation timestamp
   * @nullable
   */
  created_at?: string | null;
}
