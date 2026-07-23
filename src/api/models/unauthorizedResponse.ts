/* eslint-disable */
import type { UnauthorizedResponseError } from './unauthorizedResponseError';
import type { UnauthorizedResponseResponseData } from './unauthorizedResponseResponseData';
import type { UnauthorizedResponseViolationItem } from './unauthorizedResponseViolationItem';

export type UnauthorizedResponse = {
  success?: boolean;
  error?: UnauthorizedResponseError;
  /** @nullable */
  message?: string | null;
  /** @nullable */
  message_en?: string | null;
  /** @nullable */
  responseData?: UnauthorizedResponseResponseData;
  status?: string;
  timeStamp?: string;
  /** @nullable */
  violation?: UnauthorizedResponseViolationItem[] | null;
};
