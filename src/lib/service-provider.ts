// ──────────────────────────────────────────────
// SANAAT — Resilient Service Provider
// ──────────────────────────────────────────────

import { createContext, useContext } from 'react';
import type { Services } from '../services/interfaces';
import { env } from './env';
import { createMockServices } from '../services/mock/index';

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

export function getDefaultServices(): Services {
  if (!servicesInstance) {
    servicesInstance = createMockServices();
  }
  return servicesInstance;
}

export async function initializeServices(): Promise<Services> {
  // If Supabase is configured in environment, attempt connection with a fast timeout
  if (env.isSupabaseConfigured) {
    try {
      const { createSupabaseServices } = await import('../services/supabase/index');
      const supabaseServices = createSupabaseServices();

      // 5.0 second timeout to accommodate mobile networks (e.g. 4G/LTE in Pakistan)
      const timeoutPromise = new Promise<{ data: null }>((resolve) =>
        setTimeout(() => resolve({ data: null }), 5000)
      );

      const test = await Promise.race([
        supabaseServices.products.getPublishedProducts({ limit: 1 }),
        timeoutPromise,
      ]);

      if (Array.isArray(test.data)) {
        servicesInstance = supabaseServices;
        console.log('[SANAAT] Connected to live Supabase backend');
        return servicesInstance;
      }
      console.warn('[SANAAT] Supabase query timed out; using persistent local storage store.');
    } catch (err) {
      console.warn('[SANAAT] Supabase query failed; using persistent local storage store.', err);
    }
  }

  // Persistent mock services (localStorage-backed)
  servicesInstance = getDefaultServices();
  console.log('[SANAAT] Using persistent local storage services');

  return servicesInstance;
}
