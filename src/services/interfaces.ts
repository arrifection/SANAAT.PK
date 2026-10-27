// ──────────────────────────────────────────────
// SANAAT — Service Interfaces
// All data access goes through these interfaces.
// Implementations: mock (local) or supabase (production)
// ──────────────────────────────────────────────

import type {
  Category, CategoryInsert, CategoryUpdate,
  Product, ProductWithRelations, ProductInsert, ProductUpdate,
  ProductImage, ProductImageInsert,
  ProductVariant, ProductVariantInsert,
  Order, OrderWithItems, OrderFilters, OrderStatus,
  CheckoutData,
  ContactMessageInsert,
  ProductFilters, PaginatedResult,
  DashboardStats,
  Profile,
} from '../types';

// ── Product Service ──

export interface ProductService {
  // Storefront (public)
  getPublishedProducts(filters?: ProductFilters): Promise<PaginatedResult<ProductWithRelations>>;
  getProductBySlug(slug: string): Promise<ProductWithRelations | null>;
  getFeaturedProducts(limit?: number): Promise<ProductWithRelations[]>;
  getNewProducts(limit?: number): Promise<ProductWithRelations[]>;
  getProductsByCategory(categorySlug: string, filters?: ProductFilters): Promise<PaginatedResult<ProductWithRelations>>;
  getRelatedProducts(productId: string, categoryId: string | null, limit?: number): Promise<ProductWithRelations[]>;
  searchProducts(query: string, limit?: number): Promise<ProductWithRelations[]>;

  // Admin
  getAllProducts(filters?: ProductFilters): Promise<PaginatedResult<ProductWithRelations>>;
  getProductById(id: string): Promise<ProductWithRelations | null>;
  createProduct(data: ProductInsert): Promise<Product>;
  updateProduct(id: string, data: ProductUpdate): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  // Images
  addProductImage(data: ProductImageInsert): Promise<ProductImage>;
  updateProductImage(id: string, data: Partial<ProductImageInsert>): Promise<ProductImage>;
  deleteProductImage(id: string): Promise<void>;
  reorderProductImages(productId: string, imageIds: string[]): Promise<void>;

  // Variants
  setProductVariants(productId: string, variants: Omit<ProductVariantInsert, 'product_id'>[]): Promise<ProductVariant[]>;
  updateVariantStock(variantId: string, quantity: number): Promise<ProductVariant>;
}

// ── Category Service ──

export interface CategoryService {
  getActiveCategories(): Promise<Category[]>;
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | null>;
  createCategory(data: CategoryInsert): Promise<Category>;
  updateCategory(id: string, data: CategoryUpdate): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
}

// ── Order Service ──

export interface OrderService {
  createOrder(data: CheckoutData): Promise<{ order_number: string }>;
  getOrderByNumber(orderNumber: string): Promise<OrderWithItems | null>;
  
  // Admin
  getAllOrders(filters?: OrderFilters): Promise<PaginatedResult<OrderWithItems>>;
  getOrderById(id: string): Promise<OrderWithItems | null>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order>;
  deleteOrder(id: string): Promise<void>;
}

// ── Auth Service ──

export interface AuthService {
  signIn(email: string, password: string): Promise<{ user: Profile }>;
  signOut(): Promise<void>;
  getSession(): Promise<Profile | null>;
  onAuthStateChange(callback: (profile: Profile | null) => void): () => void;
}

// ── Storage Service ──

export interface StorageService {
  uploadProductImage(file: File, productId: string): Promise<{ url: string; storage_path: string }>;
  deleteProductImage(storagePath: string): Promise<void>;
}

// ── Contact Service ──

export interface ContactService {
  submitMessage(data: ContactMessageInsert): Promise<void>;
}

// ── Dashboard Service ──

export interface DashboardService {
  getStats(): Promise<DashboardStats>;
  getRecentOrders(limit?: number): Promise<OrderWithItems[]>;
  getLowStockProducts(limit?: number): Promise<ProductWithRelations[]>;
}

// ── Aggregated Services ──

export interface Services {
  products: ProductService;
  categories: CategoryService;
  orders: OrderService;
  auth: AuthService;
  storage: StorageService;
  contact: ContactService;
  dashboard: DashboardService;
}
