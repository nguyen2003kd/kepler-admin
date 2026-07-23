/* eslint-disable */
import type { GetApiV10AuthProfile200DataRole } from './getApiV10AuthProfile200DataRole';

export type GetApiV10AuthProfile200Data = {
  id?: string;
  email?: string;
  username?: string;
  role?: GetApiV10AuthProfile200DataRole;
  permissions?: string[];
};
