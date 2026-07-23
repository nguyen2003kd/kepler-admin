/* eslint-disable */

/**
 * Appointment status
 */
export type AppointmentMutateStatus = typeof AppointmentMutateStatus[keyof typeof AppointmentMutateStatus];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AppointmentMutateStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;
