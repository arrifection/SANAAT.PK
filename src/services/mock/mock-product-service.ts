// ──────────────────────────────────────────────
// SANAAT — Mock Product Service
// ──────────────────────────────────────────────

import type { ProductService } from '../interfaces';
import type {
  Product,
  ProductWithRelations,
  ProductInsert,
  ProductUpdate,
  ProductImage,
  ProductImageInsert,
  ProductVariant,
  ProductVariantInsert,
  ProductFilters,
  PaginatedResult,
  Category,
  DisplayStatus,
} from '../../types';
import { getDisplayStatus, isStorefrontVisible } from '../../utils/stock';
import { generateId, slugify } from '../../utils';

const delay = () => new Promise<void>((r) => setTimeout(r, 60));

export function createMockProductService(
  products: Product[],
  images: ProductImage[],
  variants: ProductVariant[],
  categories: Category[],
  onMutation?: () => void,
): ProductService {
  // ── Helpers ──

  function hydrate(product: Product): ProductWithRelations {
    return {
      ...product,
      category: categories.find((c) => c.id === product.category_id) ?? null,
      images: images.filter((i) => i.product_id === product.id).sort((a, b) => a.position - b.position),
      variants: variants.filter((v) => v.product_id === product.id),
    };
  }

  function matchesDisplayStatus(product: Product, target: DisplayStatus): boolean {
    const prodVariants = variants.filter((v) => v.product_id === product.id);
    return getDisplayStatus(product, prodVariants) === target;
  }

  function applyFilters(list: Product[], filters: ProductFilters): Product[] {
    let result = [...list];

    if (filters.category_slug) {
      const cat = categories.find((c) => c.slug === filters.category_slug);
      if (cat) {
        result = result.filter((p) => p.category_id === cat.id);
      } else {
        return [];
      }
    }

    if (filters.status) {
      result = result.filter((p) => matchesDisplayStatus(p, filters.status!));
    }

    if (filters.search) {
      const query = filters.search.toLowerCase().trim();
      result = result.filter((p) => {
        const inName = p.name.toLowerCase().includes(query);
        const inDesc = p.description?.toLowerCase().includes(query) ?? false;
        const inTags = p.tags?.some((t) => t.toLowerCase().includes(query)) ?? false;
        const inColor = p.color?.toLowerCase().includes(query) ?? false;
        const inFabric = p.fabric?.toLowerCase().includes(query) ?? false;
        const cat = categories.find((c) => c.id === p.category_id);
        const inCat = cat?.name.toLowerCase().includes(query) ?? false;
        return inName || inDesc || inTags || inColor || inFabric || inCat;
      });
    }

    if (filters.is_featured !== undefined) {
      result = result.filter((p) => p.is_featured === filters.is_featured);
    }

    if (filters.is_published !== undefined) {
      result = result.filter((p) => p.is_published === filters.is_published);
    }

    if (filters.is_preorder !== undefined) {
      result = result.filter((p) => p.is_preorder === filters.is_preorder);
    }

    return result;
  }

  function applySort(list: Product[], sort?: ProductFilters['sort']): Product[] {
    const copy = [...list];
    switch (sort) {
      case 'newest':
        return copy.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'oldest':
        return copy.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'price_asc':
        return copy.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return copy.sort((a, b) => b.price - a.price);
      case 'name_asc':
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return copy.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return copy.sort((a, b) => a.display_order - b.display_order);
    }
  }

  function paginate<T>(items: T[], page: number, limit: number): PaginatedResult<T> {
    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const data = items.slice(offset, offset + limit);

    return { data, total, page, limit, totalPages };
  }

  // ── Service ──

  const service: ProductService = {
    // ── Storefront ──

    async getPublishedProducts(filters: ProductFilters = {}) {
      await delay();
      const published = products.filter((p) => isStorefrontVisible(p));
      const filtered = applyFilters(published, filters);
      const sorted = applySort(filtered, filters.sort);
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 12;
      return paginate(sorted.map(hydrate), page, limit);
    },

    async getProductBySlug(slug: string) {
      await delay();
      const product = products.find((p) => p.slug === slug && isStorefrontVisible(p));
      return product ? hydrate(product) : null;
    },

    async getFeaturedProducts(limit = 8) {
      await delay();
      return products
        .filter((p) => isStorefrontVisible(p) && p.is_featured)
        .sort((a, b) => a.display_order - b.display_order)
        .slice(0, limit)
        .map(hydrate);
    },

    async getNewProducts(limit = 8) {
      await delay();
      return products
        .filter((p) => isStorefrontVisible(p))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit)
        .map(hydrate);
    },

    async getProductsByCategory(categorySlug: string, filters: ProductFilters = {}) {
      await delay();
      const published = products.filter((p) => isStorefrontVisible(p));
      const filtered = applyFilters(published, { ...filters, category_slug: categorySlug });
      const sorted = applySort(filtered, filters.sort);
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 12;
      return paginate(sorted.map(hydrate), page, limit);
    },

    async getRelatedProducts(productId: string, categoryId: string | null, limit = 4) {
      await delay();
      return products
        .filter((p) => isStorefrontVisible(p) && p.id !== productId && (!categoryId || p.category_id === categoryId))
        .sort((a, b) => a.display_order - b.display_order)
        .slice(0, limit)
        .map(hydrate);
    },

    async searchProducts(query: string, limit = 20) {
      await delay();
      const published = products.filter((p) => isStorefrontVisible(p));
      const filtered = applyFilters(published, { search: query });
      return filtered.slice(0, limit).map(hydrate);
    },

    // ── Admin ──

    async getAllProducts(filters: ProductFilters = {}) {
      await delay();
      const filtered = applyFilters(products, filters);
      const sorted = applySort(filtered, filters.sort ?? 'newest');
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 50;
      return paginate(sorted.map(hydrate), page, limit);
    },

    async getProductById(id: string) {
      await delay();
      const product = products.find((p) => p.id === id);
      return product ? hydrate(product) : null;
    },

    async createProduct(data: ProductInsert) {
      await delay();
      const now = new Date().toISOString();
      const product: Product = {
        id: generateId(),
        ...data,
        slug: data.slug || slugify(data.name),
        created_at: now,
        updated_at: now,
      };
      products.unshift(product);
      onMutation?.();
      return product;
    },

    async updateProduct(id: string, data: ProductUpdate) {
      await delay();
      const idx = products.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error(`Product not found: ${id}`);
      products[idx] = {
        ...products[idx],
        ...data,
        updated_at: new Date().toISOString(),
      };
      onMutation?.();
      return products[idx];
    },

    async deleteProduct(id: string) {
      await delay();
      const idx = products.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error(`Product not found: ${id}`);
      products.splice(idx, 1);
      // Clean up related images and variants
      const imgIndicesToRemove = images
        .map((img, i) => (img.product_id === id ? i : -1))
        .filter((i) => i !== -1)
        .reverse();
      for (const i of imgIndicesToRemove) images.splice(i, 1);

      const varIndicesToRemove = variants
        .map((v, i) => (v.product_id === id ? i : -1))
        .filter((i) => i !== -1)
        .reverse();
      for (const i of varIndicesToRemove) variants.splice(i, 1);

      onMutation?.();
    },

    // ── Images ──

    async addProductImage(data: ProductImageInsert) {
      await delay();
      const image: ProductImage = { id: generateId(), ...data };
      images.push(image);
      onMutation?.();
      return image;
    },

    async updateProductImage(id: string, data: Partial<ProductImageInsert>) {
      await delay();
      const idx = images.findIndex((i) => i.id === id);
      if (idx === -1) throw new Error(`Image not found: ${id}`);
      images[idx] = { ...images[idx], ...data };
      onMutation?.();
      return images[idx];
    },

    async deleteProductImage(id: string) {
      await delay();
      const idx = images.findIndex((i) => i.id === id);
      if (idx === -1) throw new Error(`Image not found: ${id}`);
      images.splice(idx, 1);
      onMutation?.();
    },

    async reorderProductImages(productId: string, imageIds: string[]) {
      await delay();
      imageIds.forEach((imgId, position) => {
        const img = images.find((i) => i.id === imgId && i.product_id === productId);
        if (img) img.position = position;
      });
      onMutation?.();
    },

    // ── Variants ──

    async setProductVariants(productId: string, newVariants: Omit<ProductVariantInsert, 'product_id'>[]) {
      await delay();
      // Remove existing variants for this product
      const toRemove = variants
        .map((v, i) => (v.product_id === productId ? i : -1))
        .filter((i) => i !== -1)
        .reverse();
      for (const i of toRemove) variants.splice(i, 1);

      // Add new variants
      const created: ProductVariant[] = newVariants.map((v) => ({
        id: generateId(),
        product_id: productId,
        ...v,
      }));
      variants.push(...created);
      onMutation?.();
      return created;
    },

    async updateVariantStock(variantId: string, quantity: number) {
      await delay();
      const variant = variants.find((v) => v.id === variantId);
      if (!variant) throw new Error(`Variant not found: ${variantId}`);
      variant.stock_quantity = Math.max(0, quantity);

      // Section 18: If stock reaches zero across variants, automatically mark product OUT OF STOCK
      const productVariants = variants.filter((v) => v.product_id === variant.product_id);
      const totalStock = productVariants.reduce((sum, v) => sum + v.stock_quantity, 0);
      const prodIdx = products.findIndex((p) => p.id === variant.product_id);
      if (prodIdx > -1) {
        if (totalStock === 0 && !products[prodIdx].is_preorder) {
          // If total stock is 0 and not preorder, keep it updated
          products[prodIdx].updated_at = new Date().toISOString();
        }
      }

      onMutation?.();
      return { ...variant };
    },
  };

  return service;
}
