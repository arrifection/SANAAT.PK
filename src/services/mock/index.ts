// ──────────────────────────────────────────────
// SANAAT — Mock Services Index
// ──────────────────────────────────────────────

import type { Services } from '../interfaces';
import { seedCategories, seedProducts, seedImages, seedVariants, seedOrders, seedOrderItems } from './seed-data';
import { createMockProductService } from './mock-product-service';
import { createMockCategoryService } from './mock-category-service';
import { createMockOrderService } from './mock-order-service';
import { createMockAuthService } from './mock-auth-service';
import { createMockStorageService } from './mock-storage-service';
import { createMockContactService } from './mock-contact-service';
import { createMockDashboardService } from './mock-dashboard-service';

/**
 * Create a complete set of mock services backed by in-memory seed data.
 * All services share the same mutable arrays so changes (e.g. stock decrements
 * from orders) are reflected across services.
 */
export function createMockServices(): Services {
  // Clone seed data so each call gets a fresh, independent dataset
  const categories = structuredClone(seedCategories);
  const products = structuredClone(seedProducts);
  const images = structuredClone(seedImages);
  const variants = structuredClone(seedVariants);
  const orders = structuredClone(seedOrders);
  const orderItems = structuredClone(seedOrderItems);

  return {
    products: createMockProductService(products, images, variants, categories),
    categories: createMockCategoryService(categories),
    orders: createMockOrderService(orders, orderItems, products, variants),
    auth: createMockAuthService(),
    storage: createMockStorageService(),
    contact: createMockContactService(),
    dashboard: createMockDashboardService(products, variants, orders, orderItems, categories, images),
  };
}
