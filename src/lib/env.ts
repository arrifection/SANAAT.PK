// ──────────────────────────────────────────────
// SANAAT — Environment Validation
// ──────────────────────────────────────────────

interface EnvConfig {
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
  siteUrl: string;
  siteName: string;
  whatsappNumber: string;
  instagramUrl: string;
  shippingFee: number;
  freeShippingThreshold: number;
  isSupabaseConfigured: boolean;
}

function getEnv(): EnvConfig {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gswzdmjfqcvxqksdypjb.supabase.co';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_QlGvkpjH4Ot_mA_aJaQr0A_kw-1ZWG3';

  return {
    supabaseUrl,
    supabaseAnonKey,
    siteUrl: import.meta.env.VITE_SITE_URL || 'https://sanaatpk.vercel.app',
    siteName: import.meta.env.VITE_SITE_NAME || 'SANAAT',
    whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '923424786076',
    instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/sanaat.pk',
    shippingFee: Number(import.meta.env.VITE_SHIPPING_FEE) || 250,
    freeShippingThreshold: Number(import.meta.env.VITE_FREE_SHIPPING_THRESHOLD) || 5000,
    isSupabaseConfigured: Boolean(supabaseUrl && supabaseAnonKey),
  };
}

export const env = getEnv();
