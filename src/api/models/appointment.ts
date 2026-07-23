/* eslint-disable */
import type { AppointmentStatus } from './appointmentStatus';

export interface Appointment {
  /** Unique identifier */
  id?: string;
  /** Appointment title */
  title?: string;
  /**
   * Appointment description
   * @nullable
   */
  description?: string | null;
  /**
   * Target department ID
   * @nullable
   */
  department_id?: string | null;
  /**
   * Target role ID
   * @nullable
   */
  role_id?: string | null;
  /** Scheduled meeting date-time */
  scheduled_at?: string;
  /**
   * Appointment status
   * @nullable
   */
  status?: AppointmentStatus;
  /**
   * Creation timestamp
   * @nullable
   */
  created_at?: string | null;
  /**
   * Created by user ID
   * @nullable
   */
  created_by?: string | null;
  /**
   * Last update timestamp
   * @nullable
   */
  updated_at?: string | null;
  /**
   * Updated by user ID
   * @nullable
   */
  updated_by?: string | null;
}
