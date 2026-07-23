/* eslint-disable */

export type GetApiV10AnalyticsActiveUsersParams = {
/**
 * Get all-time page views from 2020-01-01 to today (overrides startDate/endDate)
 */
allTime?: boolean;
/**
 * Start date for page views (default "30daysAgo")
 */
startDate?: string;
/**
 * End date for page views (default "today")
 */
endDate?: string;
};
