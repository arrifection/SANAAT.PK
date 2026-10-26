// ──────────────────────────────────────────────
// SANAAT — Service Provider
// Selects mock or Supabase implementation based on env
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

  if (env.isSupabaseConfigured) {
    // Dynamic import to avoid bundling Supabase impl when not needed
    const { createSupabaseServices } = await import('../services/supabase/index');
    servicesInstance = createSupabaseServices();
    console.log('[SANAAT] Using Supabase services');
  } else {
    const { createMockServices } = await import('../services/mock/index');
    servicesInstance = createMockServices();
    console.log('[SANAAT] Using mock services (no Supabase configured)');
  }

  return servicesInstance;
}
