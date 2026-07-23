/* eslint-disable */
import type { BadRequestResponseError } from './badRequestResponseError';
import type { BadRequestResponseResponseData } from './badRequestResponseResponseData';
import type { BadRequestResponseViolationItem } from './badRequestResponseViolationItem';

export type BadRequestResponse = {
  success?: boolean;
  error?: BadRequestResponseError;
  /** @nullable */
  message?: string | null;
  /** @nullable */
  message_en?: string | null;
  /** @nullable */
  responseData?: BadRequestResponseResponseData;
  status?: string;
  timeStamp?: string;
  /** @nullable */
  violation?: BadRequestResponseViolationItem[] | null;
};
