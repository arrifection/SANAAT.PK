// ──────────────────────────────────────────────
// SANAAT — Core Type Definitions
// ──────────────────────────────────────────────

// ── Database enums ──

export type ProductStatusEnum = 'draft' | 'active' | 'archived';
export type OrderStatus = 'new' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
export type OrderType = 'standard' | 'preorder';
export type PaymentMethod = 'cod' | 'jazzcash' | 'bank_transfer' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

// ── Fabric Types (Section 13) ──
export type FabricType = 'Lawn' | 'Khaddar' | 'Cotton' | 'Silk';

// ── Fabric Care (Section 14) ──
export type FabricCare = 'Washable' | 'Dry Clean';

// ── Product Type (Section 15 — determines size chart) ──
export type ProductType = 'Top' | 'Bottom' | 'Set';

// ── Derived display status (computed from data, not stored) ──
export type DisplayStatus = 'draft' | 'preorder' | 'available' | 'low_stock' | 'out_of_stock' | 'archived';

// ── Categories ──

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export type CategoryInsert = Omit<Category, 'id' | 'created_at'>;
export type CategoryUpdate = Partial<CategoryInsert>;

// ── Products ──

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number; // integer, PKR
  compare_at_price: number | null;
  category_id: string | null;
  status: ProductStatusEnum;
  is_published: boolean;
  is_featured: boolean;
  is_preorder: boolean;
  preorder_closes_at: string | null;
  estimated_dispatch_date: string | null;
  preorder_limit: number | null;
  tags: string[];
  fabric: string | null;        // Actual fabric type: Lawn | Khaddar | Cotton | Silk
  fabric_care: string | null;   // Fabric care: Washable | Dry Clean
  product_type: string | null;  // Top | Bottom | Set (determines size chart)
  color: string | null;         // Explicit color field
  care_instructions: string | null; // Legacy / additional care notes
  details: string | null;
  display_order: number;
  low_stock_threshold: number;
  created_at: string;
  updated_at: string;
}

export interface ProductWithRelations extends Product {
  category: Category | null;
  images: ProductImage[];
  variants: ProductVariant[];
}

export type ProductInsert = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type ProductUpdate = Partial<ProductInsert>;

// ── Product Images ──

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  storage_path: string | null;
  alt_text: string | null;
  position: number;
}

export type ProductImageInsert = Omit<ProductImage, 'id'>;

// ── Product Variants ──

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  stock_quantity: number;
  sku: string | null;
}

export type ProductVariantInsert = Omit<ProductVariant, 'id'>;

// ── Orders ──

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  shipping_address: ShippingAddress;
  subtotal: number;
  shipping_fee: number;
  total: number;
  order_type: OrderType;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  product_name_snapshot: string;
  size: string;
  unit_price: number;
  quantity: number;
  image_url_snapshot: string | null;
}

// ── Cart ──

export interface CartItem {
  product_id: string;
  variant_id: string;
  product_name: string;
  product_slug: string;
  size: string;
  unit_price: number;
  quantity: number;
  image_url: string | null;
  is_preorder: boolean;
  max_quantity: number; // stock or preorder limit
}

// ── Checkout ──

export interface CheckoutData {
  customer_name: string;
  email: string;
  phone: string;
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  notes?: string;
  items: Array<{
    product_id: string;
    variant_id: string;
    quantity: number;
  }>;
}

// ── Contact ──

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
}

export type ContactMessageInsert = Omit<ContactMessage, 'id' | 'created_at'>;

// ── Admin / Auth ──

export interface Profile {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

// ── Filters & Pagination ──

export interface ProductFilters {
  category_slug?: string;
  status?: DisplayStatus;
  search?: string;
  is_featured?: boolean;
  is_published?: boolean;
  is_preorder?: boolean;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
  page?: number;
  limit?: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  search?: string;
  order_type?: OrderType;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Dashboard Stats ──

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  preorderProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalOrders: number;
  newOrders: number;
}
