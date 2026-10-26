import { useQuery } from '@tanstack/react-query';
import { useServices } from './use-services';
import type { DashboardStats, OrderWithItems, ProductWithRelations } from '../types';

export function useDashboardStats() {
  const services = useServices();
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => services.dashboard.getStats(),
  });
}

export function useDashboardRecentOrders(limit = 5) {
  const services = useServices();
  return useQuery<OrderWithItems[]>({
    queryKey: ['dashboard-recent-orders', limit],
    queryFn: () => services.dashboard.getRecentOrders(limit),
  });
}

export function useDashboardLowStock(limit = 6) {
  const services = useServices();
  return useQuery<ProductWithRelations[]>({
    queryKey: ['dashboard-low-stock', limit],
    queryFn: () => services.dashboard.getLowStockProducts(limit),
  });
}
