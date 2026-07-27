/* eslint-disable */

/**
 * API health status
 */
export type HealthCheckChecksApi = typeof HealthCheckChecksApi[keyof typeof HealthCheckChecksApi];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const HealthCheckChecksApi = {
  ok: 'ok',
  failed: 'failed',
} as const;
