import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from './use-services';
import type { SiteSettings } from '../types';

export function useSiteSettings() {
  const services = useServices();
  return useQuery<SiteSettings>({
    queryKey: ['site-settings'],
    queryFn: () => services.settings.getSettings(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpdateSiteSettings() {
  const services = useServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SiteSettings>) => services.settings.updateSettings(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['site-settings'], updated);
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
  });
}
