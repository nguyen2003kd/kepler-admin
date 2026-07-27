/* eslint-disable */

/**
 * Redis connection status
 */
export type HealthCheckChecksRedis = typeof HealthCheckChecksRedis[keyof typeof HealthCheckChecksRedis];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const HealthCheckChecksRedis = {
  ok: 'ok',
  failed: 'failed',
  skipped: 'skipped',
} as const;
