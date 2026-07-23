/* eslint-disable */
import type { GetApiV10AnalyticsActiveUsers200AllOfResponseDataDateRange } from './getApiV10AnalyticsActiveUsers200AllOfResponseDataDateRange';

export type GetApiV10AnalyticsActiveUsers200AllOfResponseData = {
  /** Number of currently active users */
  activeUsers?: number;
  /** Timestamp of active users data */
  timestamp?: string;
  /** Total page views in date range */
  totalPageViews?: number;
  dateRange?: GetApiV10AnalyticsActiveUsers200AllOfResponseDataDateRange;
};
