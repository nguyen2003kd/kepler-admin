/* eslint-disable */
import type { HealthCheckChecksApi } from './healthCheckChecksApi';
import type { HealthCheckChecksDatabase } from './healthCheckChecksDatabase';
import type { HealthCheckChecksRedis } from './healthCheckChecksRedis';

/**
 * Individual component checks
 */
export type HealthCheckChecks = {
  /** API health status */
  api?: HealthCheckChecksApi;
  /** Database connection status */
  database?: HealthCheckChecksDatabase;
  /** Redis connection status */
  redis?: HealthCheckChecksRedis;
};
