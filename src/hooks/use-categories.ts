import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from './use-services';
import type { Category, CategoryInsert, CategoryUpdate } from '../types';

export function useCategories() {
  const services = useServices();
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => services.categories.getActiveCategories(),
  });
}

export function useAllCategories() {
  const services = useServices();
  return useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: () => services.categories.getAllCategories(),
  });
}

export function useCategory(slug: string) {
  const services = useServices();
  return useQuery<Category | null>({
    queryKey: ['category', slug],
    queryFn: () => services.categories.getCategoryBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useCreateCategory() {
  const services = useServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryInsert) => services.categories.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });
}

export function useUpdateCategory() {
  const services = useServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryUpdate }) =>
      services.categories.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });
}

export function useDeleteCategory() {
  const services = useServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => services.categories.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });
}
