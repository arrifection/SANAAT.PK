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
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || null;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || null;

  return {
    supabaseUrl,
    supabaseAnonKey,
    siteUrl: import.meta.env.VITE_SITE_URL || 'http://localhost:5173',
    siteName: import.meta.env.VITE_SITE_NAME || 'SANAAT',
    whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '+923001234567',
    instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/sanaat.pk',
    shippingFee: Number(import.meta.env.VITE_SHIPPING_FEE) || 250,
    freeShippingThreshold: Number(import.meta.env.VITE_FREE_SHIPPING_THRESHOLD) || 5000,
    isSupabaseConfigured: Boolean(supabaseUrl && supabaseAnonKey),
  };
}

export const env = getEnv();
