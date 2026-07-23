/* eslint-disable */
import type { ApiResponseResponseData } from './apiResponseResponseData';
import type { ApiResponseViolationItem } from './apiResponseViolationItem';

export interface ApiResponse {
  message?: string;
  message_en?: string;
  responseData?: ApiResponseResponseData;
  status?: string;
  timeStamp?: string;
  violation?: ApiResponseViolationItem[];
}
