/* eslint-disable */

/**
 * Overall health status
 */
export type HealthCheckStatus = typeof HealthCheckStatus[keyof typeof HealthCheckStatus];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const HealthCheckStatus = {
  healthy: 'healthy',
  unhealthy: 'unhealthy',
} as const;
