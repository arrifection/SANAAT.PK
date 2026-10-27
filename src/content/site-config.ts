// ──────────────────────────────────────────────
// SANAAT — Site Configuration Constants
// Brand Identity: Fashion with Modesty
// ──────────────────────────────────────────────

/** Canonical site name */
export const SITE_NAME = 'SANAAT';

/** Official Tagline */
export const SITE_TAGLINE = 'FASHION WITH MODESTY';

/** Brand Colors */
export const BRAND_COLORS = {
  plum: '#6C255D',
  white: '#FFFFFF',
  black: '#000000',
  onPlum: '#FFFFFF',
} as const;

/** Shipping Fees in PKR */
export const SHIPPING_RATES = {
  punjab: 250,
  outsidePunjab: 350,
} as const;

/** Helper function to calculate shipping fee based on province */
export function calculateShippingFee(province: string): number {
  const normalized = province.trim().toLowerCase();
  if (normalized === 'punjab') {
    return SHIPPING_RATES.punjab;
  }
  return SHIPPING_RATES.outsidePunjab;
}

/** Contact Details */
export const CONTACT_INFO = {
  instagramHandle: 'sanaat.pk',
  instagramUrl: 'https://instagram.com/sanaat.pk',
  facebookHandle: 'sanaat.pk',
  facebookUrl: 'https://facebook.com/sanaat.pk',
  email: 'arrifection@gmail.com',
  phoneDisplay: '03424786076',
  whatsappRaw: '03424786076',
  whatsappNumber: '923424786076',
  whatsappUrl: 'https://wa.me/923424786076',
} as const;

export const WHATSAPP_NUMBER = CONTACT_INFO.whatsappNumber;
export const INSTAGRAM_URL = CONTACT_INFO.instagramUrl;
export const FACEBOOK_URL = CONTACT_INFO.facebookUrl;
export const CONTACT_EMAIL = CONTACT_INFO.email;

/** JazzCash Payment Details */
export const JAZZCASH_INFO = {
  accountName: 'Sara Ahmed',
  accountNumber: '03424786076',
} as const;

/** Pre-Order Policy Defaults */
export const PREORDER_POLICY = {
  preparationTime: '10–12 days before dispatch',
  heading: 'Made especially for you.',
} as const;

/** PKR currency symbol / prefix */
export const CURRENCY_SYMBOL = 'Rs.';

/** Maximum items per page for shop grid */
export const PRODUCTS_PER_PAGE = 12;

/** Default SEO meta description */
export const DEFAULT_META_DESCRIPTION =
  'SANAAT — Fashion with Modesty. Thoughtful design and modest elegance — timeless, graceful Pakistani silhouettes crafted with artisanal care.';
