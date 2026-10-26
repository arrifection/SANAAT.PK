// ──────────────────────────────────────────────
// SANAAT — Site Configuration Constants
// ──────────────────────────────────────────────

function env(key: string, fallback: string): string {
  return (import.meta.env[key] as string | undefined) ?? fallback;
}

function envNumber(key: string, fallback: number): number {
  const raw = import.meta.env[key] as string | undefined;
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isNaN(n) ? fallback : n;
}

/** Flat-rate shipping fee in PKR */
export const SHIPPING_FEE = envNumber('VITE_SHIPPING_FEE', 250);

/** Minimum order total for free shipping (PKR) */
export const FREE_SHIPPING_THRESHOLD = envNumber('VITE_FREE_SHIPPING_THRESHOLD', 5000);

/** WhatsApp number with country code (used for wa.me links) */
export const WHATSAPP_NUMBER = env('VITE_WHATSAPP_NUMBER', '923001234567');

/** Instagram profile URL */
export const INSTAGRAM_URL = env(
  'VITE_INSTAGRAM_URL',
  'https://instagram.com/sanaat.pk',
);

/** Canonical site name */
export const SITE_NAME = 'SANAAT';

/** Short tagline used in meta / footer */
export const SITE_TAGLINE = 'Modest Fashion, Modern Craft';

/** PKR currency symbol / prefix */
export const CURRENCY_SYMBOL = 'Rs.';

/** Maximum items per page for shop grid */
export const PRODUCTS_PER_PAGE = 12;

/** Default SEO meta description */
export const DEFAULT_META_DESCRIPTION =
  'SANAAT — contemporary Pakistani fashion rooted in artisan heritage. Shop modest, modern silhouettes crafted from handloom textiles.';
