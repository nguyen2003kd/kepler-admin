/* eslint-disable */
import type { ResponseResponseData } from './responseResponseData';
import type { ResponseViolationItem } from './responseViolationItem';

export interface Response {
  message?: string;
  message_en?: string;
  responseData?: ResponseResponseData;
  status?: string;
  timeStamp?: string;
  violation?: ResponseViolationItem[];
}
