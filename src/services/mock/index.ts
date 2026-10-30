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
  SiteSettings,
} from '../../types';
import { defaultSiteSettings } from '../../content/site-content';

const STORAGE_KEYS = {
  CATEGORIES: 'sanaat_categories_v4',
  PRODUCTS: 'sanaat_products_v4',
  IMAGES: 'sanaat_images_v4',
  VARIANTS: 'sanaat_variants_v4',
  ORDERS: 'sanaat_orders_v4',
  ORDER_ITEMS: 'sanaat_order_items_v4',
  SETTINGS: 'sanaat_site_settings_v1',
};

function loadOrFallback<T>(key: string, fallback: T): T {
  try {
    // Purge legacy v3 mock products containing dummy items (e.g. prod-noor-001) so old browser caches don't pollute devices
    const legacyProducts = localStorage.getItem('sanaat_products_v3');
    if (legacyProducts && legacyProducts.includes('prod-noor-001')) {
      localStorage.removeItem('sanaat_products_v3');
      localStorage.removeItem('sanaat_images_v3');
      localStorage.removeItem('sanaat_variants_v3');
    }

    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Discard any array containing legacy dummy IDs
        const hasLegacyDummy = parsed.some((item: any) => typeof item?.id === 'string' && item.id.startsWith('prod-'));
        if (!hasLegacyDummy) {
          return parsed as T;
        }
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
  const rawImages: ProductImage[] = loadOrFallback(STORAGE_KEYS.IMAGES, seedImages);

  // Auto-heal legacy cached broken URLs in localStorage
  const images: ProductImage[] = rawImages.map((img) => {
    let url = img.url;
    if (url.includes('photo-1583391733956-6c78276477e2')) {
      url = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=85&auto=format&fit=crop';
    } else if (url.includes('photo-1583391733981-8b530eaef1c1')) {
      url = 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=900&q=85&auto=format&fit=crop';
    }
    return { ...img, url };
  });

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
    settings: {
      async getSettings() {
        return loadOrFallback(STORAGE_KEYS.SETTINGS, defaultSiteSettings);
      },
      async updateSettings(data: Partial<SiteSettings>) {
        const current = loadOrFallback(STORAGE_KEYS.SETTINGS, defaultSiteSettings);
        const updated = { ...current, ...data, updated_at: new Date().toISOString() };
        save(STORAGE_KEYS.SETTINGS, updated);
        return updated;
      },
    },
  };
}
