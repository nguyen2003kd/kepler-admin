/* eslint-disable */
import type { FooterAddressItem } from './footerAddressItem';
import type { FooterSocialLinks } from './footerSocialLinks';
import type { FooterLinksItem } from './footerLinksItem';
import type { FooterTotalViews } from './footerTotalViews';

export interface Footer {
  /** Unique identifier of the footer */
  id?: string;
  /** Footer language */
  language?: 'vi' | 'en';
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
  address?: FooterAddressItem[] | null;
  /**
   * Contact phone number
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
  social_links?: FooterSocialLinks;
  /**
   * Footer links in JSON array format
   * @nullable
   */
  links?: FooterLinksItem[] | null;
  /**
   * Current number of online visitors
   * @nullable
   */
  online_visitors?: number | null;
  /**
   * Total number of page views (can be number or numeric string)
   * @nullable
   */
  total_views?: FooterTotalViews;
  /**
   * Whether the footer is active
   * @nullable
   */
  is_active?: boolean | null;
  /** Creation timestamp */
  created_at?: string;
  /**
   * Last update timestamp
   * @nullable
   */
  updated_at?: string | null;
  /**
   * ID of the user who created the footer
   * @nullable
   */
  created_by?: string | null;
  /**
   * ID of the user who last updated the footer
   * @nullable
   */
  updated_by?: string | null;
}
