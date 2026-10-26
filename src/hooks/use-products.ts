import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from './use-services';
import type {
  ProductFilters,
  ProductWithRelations,
  PaginatedResult,
  ProductInsert,
  ProductUpdate,
  ProductImageInsert,
  ProductVariantInsert,
} from '../types';

export function useProducts(filters?: ProductFilters) {
  const services = useServices();
  return useQuery<PaginatedResult<ProductWithRelations>>({
    queryKey: ['products', filters],
    queryFn: () => services.products.getPublishedProducts(filters),
  });
}

export function useProduct(slug: string) {
  const services = useServices();
  return useQuery<ProductWithRelations | null>({
    queryKey: ['product', slug],
    queryFn: () => services.products.getProductBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useFeaturedProducts(limit = 6) {
  const services = useServices();
  return useQuery<ProductWithRelations[]>({
    queryKey: ['featured-products', limit],
    queryFn: () => services.products.getFeaturedProducts(limit),
  });
}

export function useNewProducts(limit = 8) {
  const services = useServices();
  return useQuery<ProductWithRelations[]>({
    queryKey: ['new-products', limit],
    queryFn: () => services.products.getNewProducts(limit),
  });
}

export function useRelatedProducts(productId: string, categoryId: string | null, limit = 4) {
  const services = useServices();
  return useQuery<ProductWithRelations[]>({
    queryKey: ['related-products', productId, categoryId, limit],
    queryFn: () => services.products.getRelatedProducts(productId, categoryId, limit),
    enabled: Boolean(productId),
  });
}

export function useSearchProducts(query: string, limit = 8) {
  const services = useServices();
  return useQuery<ProductWithRelations[]>({
    queryKey: ['search-products', query, limit],
    queryFn: () => services.products.searchProducts(query, limit),
    enabled: query.trim().length > 0,
  });
}

// ── Admin Hooks ──

export function useAdminProducts(filters?: ProductFilters) {
  const services = useServices();
  return useQuery<PaginatedResult<ProductWithRelations>>({
    queryKey: ['admin-products', filters],
    queryFn: () => services.products.getAllProducts(filters),
  });
}

export function useAdminProductById(id: string) {
  const services = useServices();
  return useQuery<ProductWithRelations | null>({
    queryKey: ['admin-product', id],
    queryFn: () => services.products.getProductById(id),
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const services = useServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductInsert) => services.products.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
}

export function useUpdateProduct() {
  const services = useServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductUpdate }) =>
      services.products.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
}

export function useDeleteProduct() {
  const services = useServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => services.products.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
}

export function useUpdateStock() {
  const services = useServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) =>
      services.products.updateVariantStock(variantId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-low-stock'] });
    },
  });
}

export function useSetProductVariants() {
  const services = useServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      variants,
    }: {
      productId: string;
      variants: Omit<ProductVariantInsert, 'product_id'>[];
    }) => services.products.setProductVariants(productId, variants),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
}

export function useAddProductImage() {
  const services = useServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductImageInsert) => services.products.addProductImage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-product'] });
    },
  });
}

export function useDeleteProductImage() {
  const services = useServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => services.products.deleteProductImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-product'] });
    },
  });
}
