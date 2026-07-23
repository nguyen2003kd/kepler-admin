/* eslint-disable */

/**
 * Appointment status
 * @nullable
 */
export type AppointmentStatus = typeof AppointmentStatus[keyof typeof AppointmentStatus] | null;


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AppointmentStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;
