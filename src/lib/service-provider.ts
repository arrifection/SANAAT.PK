// ──────────────────────────────────────────────
// SANAAT — Resilient Service Provider
// ──────────────────────────────────────────────

import { createContext, useContext } from 'react';
import type { Services } from '../services/interfaces';
import { env } from './env';

const ServicesContext = createContext<Services | null>(null);

export function useServices(): Services {
  const services = useContext(ServicesContext);
  if (!services) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return services;
}

export { ServicesContext };

let servicesInstance: Services | null = null;

export async function initializeServices(): Promise<Services> {
  if (servicesInstance) return servicesInstance;

  // If Supabase is configured in environment, verify whether it has data and is functional
  if (env.isSupabaseConfigured) {
    try {
      const { createSupabaseServices } = await import('../services/supabase/index');
      const supabaseServices = createSupabaseServices();
      const test = await supabaseServices.products.getPublishedProducts({ limit: 1 });
      if (test.data && test.data.length > 0) {
        servicesInstance = supabaseServices;
        console.log('[SANAAT] Connected to live Supabase backend');
        return servicesInstance;
      }
      console.warn('[SANAAT] Supabase database has 0 products; using persistent local storage store.');
    } catch (err) {
      console.warn('[SANAAT] Supabase query failed; using persistent local storage store.', err);
    }
  }

  // Persistent mock services (localStorage-backed)
  const { createMockServices } = await import('../services/mock/index');
  servicesInstance = createMockServices();
  console.log('[SANAAT] Using persistent local storage services');

  return servicesInstance;
}
