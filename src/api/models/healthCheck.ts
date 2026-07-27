/* eslint-disable */
import type { HealthCheckStatus } from './healthCheckStatus';
import type { HealthCheckChecks } from './healthCheckChecks';

export interface HealthCheck {
  /** Service name */
  service?: string;
  /** Overall health status */
  status?: HealthCheckStatus;
  /** Timestamp of the health check */
  time?: string;
  /** Individual component checks */
  checks?: HealthCheckChecks;
  /** Response time in milliseconds */
  response_time_ms?: number;
  /**
   * Error message if status is unhealthy
   * @nullable
   */
  error?: string | null;
}
