// ──────────────────────────────────────────────
// SANAAT — Persistent Mock Services
// Backed by localStorage with authentic seed fallback
// ──────────────────────────────────────────────

import type { Services } from '../interfaces';
import {
  seedCategories,
  seedProducts,
  seedImages,
  seedVariants,
  seedOrders,
  seedOrderItems,
} from './seed-data';
import { createMockProductService } from './mock-product-service';
import { createMockCategoryService } from './mock-category-service';
import { createMockOrderService } from './mock-order-service';
import { createMockAuthService } from './mock-auth-service';
import { createMockStorageService } from './mock-storage-service';
import { createMockContactService } from './mock-contact-service';
import { createMockDashboardService } from './mock-dashboard-service';
import type {
  Category,
  Product,
  ProductImage,
  ProductVariant,
  Order,
  OrderItem,
} from '../../types';

const STORAGE_KEYS = {
  CATEGORIES: 'sanaat_categories_v3',
  PRODUCTS: 'sanaat_products_v3',
  IMAGES: 'sanaat_images_v3',
  VARIANTS: 'sanaat_variants_v3',
  ORDERS: 'sanaat_orders_v3',
  ORDER_ITEMS: 'sanaat_order_items_v3',
};

function loadOrFallback<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as T;
      }
    }
  } catch {
    // ignore parse or storage error
  }
  return structuredClone(fallback);
}

function save<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`[SANAAT] Failed to persist ${key}:`, err);
  }
}

export function createMockServices(): Services {
  let categories: Category[] = loadOrFallback(STORAGE_KEYS.CATEGORIES, seedCategories);
  if (!categories || categories.length === 0) {
    categories = structuredClone(seedCategories);
  }

  const products: Product[] = loadOrFallback(STORAGE_KEYS.PRODUCTS, seedProducts);
  const images: ProductImage[] = loadOrFallback(STORAGE_KEYS.IMAGES, seedImages);
  const variants: ProductVariant[] = loadOrFallback(STORAGE_KEYS.VARIANTS, seedVariants);

  // Load orders and purge any hardcoded sample orders (Amina Tariq, Zainab Qureshi, ord-1001, ord-1002)
  const rawOrders: Order[] = loadOrFallback(STORAGE_KEYS.ORDERS, seedOrders);
  const rawOrderItems: OrderItem[] = loadOrFallback(STORAGE_KEYS.ORDER_ITEMS, seedOrderItems);

  const orders: Order[] = rawOrders.filter(
    (o) =>
      o.id !== 'ord-1001' &&
      o.id !== 'ord-1002' &&
      o.customer_name !== 'Amina Tariq' &&
      o.customer_name !== 'Zainab Qureshi'
  );
  const orderItems: OrderItem[] = rawOrderItems.filter(
    (item) => item.order_id !== 'ord-1001' && item.order_id !== 'ord-1002'
  );

  // Helper to persist everything whenever any modification occurs
  const syncStorage = () => {
    save(STORAGE_KEYS.CATEGORIES, categories);
    save(STORAGE_KEYS.PRODUCTS, products);
    save(STORAGE_KEYS.IMAGES, images);
    save(STORAGE_KEYS.VARIANTS, variants);
    save(STORAGE_KEYS.ORDERS, orders);
    save(STORAGE_KEYS.ORDER_ITEMS, orderItems);
  };

  // Initial save to establish keys
  syncStorage();

  return {
    products: createMockProductService(products, images, variants, categories, syncStorage),
    categories: createMockCategoryService(categories, syncStorage),
    orders: createMockOrderService(orders, orderItems, products, variants, images, syncStorage),
    auth: createMockAuthService(),
    storage: createMockStorageService(),
    contact: createMockContactService(),
    dashboard: createMockDashboardService(products, variants, orders, orderItems, categories, images),
  };
}
