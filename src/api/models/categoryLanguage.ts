/* eslint-disable */

/**
 * Language of the category
 */
export type CategoryLanguage = typeof CategoryLanguage[keyof typeof CategoryLanguage];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CategoryLanguage = {
  vi: 'vi',
  en: 'en',
} as const;
