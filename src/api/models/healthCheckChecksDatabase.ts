/* eslint-disable */

/**
 * Database connection status
 */
export type HealthCheckChecksDatabase = typeof HealthCheckChecksDatabase[keyof typeof HealthCheckChecksDatabase];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const HealthCheckChecksDatabase = {
  ok: 'ok',
  failed: 'failed',
} as const;
