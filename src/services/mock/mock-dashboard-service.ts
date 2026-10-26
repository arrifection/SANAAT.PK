// ──────────────────────────────────────────────
// SANAAT — Mock Dashboard Service
// ──────────────────────────────────────────────

import type { DashboardService } from '../interfaces';
import type {
  DashboardStats,
  Product,
  ProductVariant,
  Order,
  OrderItem,
  OrderWithItems,
  ProductWithRelations,
  Category,
  ProductImage,
} from '../../types';
import { getDisplayStatus, getTotalStock } from '../../utils/stock';

const delay = () => new Promise<void>((r) => setTimeout(r, 80));

export function createMockDashboardService(
  products: Product[],
  variants: ProductVariant[],
  orders: Order[],
  orderItems: OrderItem[],
  categories: Category[],
  images: ProductImage[],
): DashboardService {
  function hydrateProduct(product: Product): ProductWithRelations {
    return {
      ...product,
      category: categories.find((c) => c.id === product.category_id) ?? null,
      images: images.filter((i) => i.product_id === product.id).sort((a, b) => a.position - b.position),
      variants: variants.filter((v) => v.product_id === product.id),
    };
  }

  function hydrateOrder(order: Order): OrderWithItems {
    return {
      ...order,
      items: orderItems.filter((i) => i.order_id === order.id),
    };
  }

  const service: DashboardService = {
    async getStats(): Promise<DashboardStats> {
      await delay();

      const activeProducts = products.filter((p) => p.status === 'active' && p.is_published);
      let preorderCount = 0;
      let lowStockCount = 0;
      let outOfStockCount = 0;

      for (const product of activeProducts) {
        const prodVariants = variants.filter((v) => v.product_id === product.id);
        const status = getDisplayStatus(product, prodVariants);

        switch (status) {
          case 'preorder':
            preorderCount++;
            break;
          case 'low_stock':
            lowStockCount++;
            break;
          case 'out_of_stock':
            outOfStockCount++;
            break;
        }
      }

      return {
        totalProducts: products.length,
        activeProducts: activeProducts.length,
        preorderProducts: preorderCount,
        lowStockProducts: lowStockCount,
        outOfStockProducts: outOfStockCount,
        totalOrders: orders.length,
        newOrders: orders.filter((o) => o.status === 'new').length,
      };
    },

    async getRecentOrders(limit = 5): Promise<OrderWithItems[]> {
      await delay();
      return [...orders]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit)
        .map(hydrateOrder);
    },

    async getLowStockProducts(limit = 10): Promise<ProductWithRelations[]> {
      await delay();
      return products
        .filter((p) => {
          if (p.status !== 'active' || !p.is_published) return false;
          const prodVariants = variants.filter((v) => v.product_id === p.id);
          const total = getTotalStock(prodVariants);
          return total > 0 && total <= p.low_stock_threshold;
        })
        .slice(0, limit)
        .map(hydrateProduct);
    },
  };

  return service;
}
