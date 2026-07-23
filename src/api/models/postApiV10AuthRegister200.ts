/* eslint-disable */
import type { RegisterResponse } from './registerResponse';
import type { PostApiV10AuthRegister200Message } from './postApiV10AuthRegister200Message';

export type PostApiV10AuthRegister200 = {
  success?: boolean;
  data?: RegisterResponse;
  message?: PostApiV10AuthRegister200Message;
};
