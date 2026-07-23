/* eslint-disable */
import type { FooterMutateAddressItem } from './footerMutateAddressItem';
import type { FooterMutateSocialLinks } from './footerMutateSocialLinks';
import type { FooterMutateLinksItem } from './footerMutateLinksItem';
import type { FooterMutateTotalViews } from './footerMutateTotalViews';

export interface FooterMutate {
  /**
   * Footer description
   * @nullable
   */
  description?: string | null;
  /**
   * Footer sub description
   * @nullable
   */
  sub_description?: string | null;
  /**
   * Address information as array of locations
   * @nullable
   */
  address?: FooterMutateAddressItem[] | null;
  /**
   * Contact phone number (numbers, spaces, +, -, () allowed)
   * @nullable
   */
  phone?: string | null;
  /**
   * Contact email address
   * @nullable
   */
  email?: string | null;
  /**
   * Social media links in JSON format
   * @nullable
   */
  social_links?: FooterMutateSocialLinks;
  /**
   * Footer links in JSON array format
   * @nullable
   */
  links?: FooterMutateLinksItem[] | null;
  /**
   * Current number of online visitors
   * @minimum 0
   * @nullable
   */
  online_visitors?: number | null;
  /**
   * Total number of page views (can be number or numeric string)
   * @nullable
   */
  total_views?: FooterMutateTotalViews;
  /**
   * Whether the footer is active
   * @nullable
   */
  is_active?: boolean | null;
}
