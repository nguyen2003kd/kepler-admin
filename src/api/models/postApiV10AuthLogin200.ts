/* eslint-disable */
import type { LoginResponse } from './loginResponse';
import type { PostApiV10AuthLogin200Message } from './postApiV10AuthLogin200Message';

export type PostApiV10AuthLogin200 = {
  success?: boolean;
  data?: LoginResponse;
  message?: PostApiV10AuthLogin200Message;
};
