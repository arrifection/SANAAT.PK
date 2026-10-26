// ──────────────────────────────────────────────
// SANAAT — Supabase Client
// ──────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Only create the client if Supabase is configured
export const supabase = env.isSupabaseConfigured
  ? createClient(env.supabaseUrl!, env.supabaseAnonKey!)
  : null;
