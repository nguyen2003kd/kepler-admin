/* eslint-disable */
import type { AppointmentMutateStatus } from './appointmentMutateStatus';

export interface AppointmentMutate {
  /**
   * Appointment title
   * @minLength 1
   * @maxLength 255
   */
  title: string;
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
  scheduled_at: string;
  /** Appointment status */
  status?: AppointmentMutateStatus;
}
