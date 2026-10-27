import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from './use-services';
import type { OrderWithItems, OrderFilters, PaginatedResult, CheckoutData, OrderStatus } from '../types';

export function useOrderByNumber(orderNumber: string) {
  const services = useServices();
  return useQuery<OrderWithItems | null>({
    queryKey: ['order', orderNumber],
    queryFn: () => services.orders.getOrderByNumber(orderNumber),
    enabled: Boolean(orderNumber),
  });
}

export function useCreateOrder() {
  const services = useServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CheckoutData) => services.orders.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

// ── Admin ──

export function useAdminOrders(filters?: OrderFilters) {
  const services = useServices();
  return useQuery<PaginatedResult<OrderWithItems>>({
    queryKey: ['admin-orders', filters],
    queryFn: () => services.orders.getAllOrders(filters),
  });
}

export function useAdminOrderById(id: string) {
  const services = useServices();
  return useQuery<OrderWithItems | null>({
    queryKey: ['admin-order', id],
    queryFn: () => services.orders.getOrderById(id),
    enabled: Boolean(id),
  });
}

export function useUpdateOrderStatus() {
  const services = useServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      services.orders.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-order'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-recent-orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteOrder() {
  const services = useServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => services.orders.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-order'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-recent-orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
