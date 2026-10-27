// ──────────────────────────────────────────────
// SANAAT — Supabase Production Services Implementation
// ──────────────────────────────────────────────

import { supabase } from '../../lib/supabase';
import type {
  Services,
  ProductService,
  CategoryService,
  OrderService,
  AuthService,
  StorageService,
  ContactService,
  DashboardService,
} from '../interfaces';
import type {
  Category,
  CategoryInsert,
  CategoryUpdate,
  Product,
  ProductWithRelations,
  ProductInsert,
  ProductUpdate,
  ProductImage,
  ProductImageInsert,
  ProductVariant,
  ProductVariantInsert,
  Order,
  OrderWithItems,
  OrderFilters,
  OrderStatus,
  CheckoutData,
  ContactMessageInsert,
  ProductFilters,
  PaginatedResult,
  DashboardStats,
  Profile,
} from '../../types';
import { getTotalStock } from '../../utils/stock';

export function createSupabaseServices(): Services {
  if (!supabase) {
    throw new Error('Supabase client is not configured.');
  }

  const client = supabase;

  // ── Products ──
  const products: ProductService = {
    async getPublishedProducts(filters?: ProductFilters): Promise<PaginatedResult<ProductWithRelations>> {
      let query = client
        .from('products')
        .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)', {
          count: 'exact',
        })
        .eq('is_published', true)
        .eq('status', 'active');

      if (filters?.category_slug) {
        const { data: cat } = await client
          .from('categories')
          .select('id')
          .eq('slug', filters.category_slug)
          .maybeSingle();
        if (cat) {
          query = query.eq('category_id', cat.id);
        } else {
          return { data: [], total: 0, page: filters?.page || 1, limit: filters?.limit || 24, totalPages: 0 };
        }
      }
      if (filters?.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
      }
      if (filters?.is_preorder !== undefined) {
        query = query.eq('is_preorder', filters.is_preorder);
      }
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      // Sort
      if (filters?.sort === 'price_asc') query = query.order('price', { ascending: true });
      else if (filters?.sort === 'price_desc') query = query.order('price', { ascending: false });
      else if (filters?.sort === 'name_asc') query = query.order('name', { ascending: true });
      else query = query.order('created_at', { ascending: false });

      const page = filters?.page || 1;
      const limit = filters?.limit || 24;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, count, error } = await query.range(from, to);
      if (error) throw error;

      return {
        data: (data as any) || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      };
    },

    async getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
      const { data, error } = await client
        .from('products')
        .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)')
        .eq('slug', slug)
        .single();

      if (error) return null;
      return data as any;
    },

    async getFeaturedProducts(limit = 6): Promise<ProductWithRelations[]> {
      const { data, error } = await client
        .from('products')
        .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)')
        .eq('is_published', true)
        .eq('status', 'active')
        .eq('is_featured', true)
        .limit(limit);

      if (error) throw error;
      return (data as any) || [];
    },

    async getNewProducts(limit = 8): Promise<ProductWithRelations[]> {
      const { data, error } = await client
        .from('products')
        .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)')
        .eq('is_published', true)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as any) || [];
    },

    async getProductsByCategory(categorySlug: string, filters?: ProductFilters): Promise<PaginatedResult<ProductWithRelations>> {
      return this.getPublishedProducts({ ...filters, category_slug: categorySlug });
    },

    async getRelatedProducts(productId: string, categoryId: string | null, limit = 4): Promise<ProductWithRelations[]> {
      let query = client
        .from('products')
        .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)')
        .eq('is_published', true)
        .eq('status', 'active')
        .neq('id', productId);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query.limit(limit);
      if (error) throw error;
      return (data as any) || [];
    },

    async searchProducts(queryText: string, limit = 12): Promise<ProductWithRelations[]> {
      const q = queryText.trim();
      const { data, error } = await client
        .from('products')
        .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)')
        .eq('is_published', true)
        .eq('status', 'active')
        .or(`name.ilike.%${q}%,description.ilike.%${q}%,fabric.ilike.%${q}%,color.ilike.%${q}%`)
        .limit(limit);

      if (error) throw error;
      return (data as any) || [];
    },

    async getAllProducts(filters?: ProductFilters): Promise<PaginatedResult<ProductWithRelations>> {
      let query = client
        .from('products')
        .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)', {
          count: 'exact',
        });

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      if (filters?.category_slug) {
        const { data: cat } = await client
          .from('categories')
          .select('id')
          .eq('slug', filters.category_slug)
          .maybeSingle();
        if (cat) {
          query = query.eq('category_id', cat.id);
        } else {
          return { data: [], total: 0, page: filters?.page || 1, limit: filters?.limit || 24, totalPages: 0 };
        }
      }

      query = query.order('created_at', { ascending: false });

      const page = filters?.page || 1;
      const limit = filters?.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, count, error } = await query.range(from, to);
      if (error) throw error;

      return {
        data: (data as any) || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      };
    },

    async getProductById(id: string): Promise<ProductWithRelations | null> {
      const { data, error } = await client
        .from('products')
        .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)')
        .eq('id', id)
        .single();

      if (error) return null;
      return data as any;
    },

    async createProduct(data: ProductInsert): Promise<Product> {
      const { data: created, error } = await client
        .from('products')
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return created as Product;
    },

    async updateProduct(id: string, data: ProductUpdate): Promise<Product> {
      const { data: updated, error } = await client
        .from('products')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return updated as Product;
    },

    async deleteProduct(id: string): Promise<void> {
      const { error } = await client.from('products').delete().eq('id', id);
      if (error) throw error;
    },

    async addProductImage(data: ProductImageInsert): Promise<ProductImage> {
      const { data: img, error } = await client
        .from('product_images')
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return img as ProductImage;
    },

    async updateProductImage(id: string, data: Partial<ProductImageInsert>): Promise<ProductImage> {
      const { data: img, error } = await client
        .from('product_images')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return img as ProductImage;
    },

    async deleteProductImage(id: string): Promise<void> {
      const { error } = await client.from('product_images').delete().eq('id', id);
      if (error) throw error;
    },

    async reorderProductImages(productId: string, imageIds: string[]): Promise<void> {
      for (let i = 0; i < imageIds.length; i++) {
        await client
          .from('product_images')
          .update({ position: i })
          .eq('id', imageIds[i])
          .eq('product_id', productId);
      }
    },

    async setProductVariants(
      productId: string,
      variantsList: Omit<ProductVariantInsert, 'product_id'>[]
    ): Promise<ProductVariant[]> {
      // Delete existing and insert new
      await client.from('product_variants').delete().eq('product_id', productId);
      const rows = variantsList.map((v) => ({ ...v, product_id: productId }));
      const { data, error } = await client.from('product_variants').insert(rows).select();
      if (error) throw error;
      return data as ProductVariant[];
    },

    async updateVariantStock(variantId: string, quantity: number): Promise<ProductVariant> {
      const { data, error } = await client
        .from('product_variants')
        .update({ stock_quantity: quantity })
        .eq('id', variantId)
        .select()
        .single();
      if (error) throw error;
      return data as ProductVariant;
    },
  };

  // ── Categories ──
  const categories: CategoryService = {
    async getActiveCategories(): Promise<Category[]> {
      const { data, error } = await client
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return (data as Category[]) || [];
    },

    async getAllCategories(): Promise<Category[]> {
      const { data, error } = await client
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return (data as Category[]) || [];
    },

    async getCategoryBySlug(slug: string): Promise<Category | null> {
      const { data, error } = await client
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error) return null;
      return data as Category;
    },

    async createCategory(data: CategoryInsert): Promise<Category> {
      const { data: cat, error } = await client.from('categories').insert(data).select().single();
      if (error) throw error;
      return cat as Category;
    },

    async updateCategory(id: string, data: CategoryUpdate): Promise<Category> {
      const { data: cat, error } = await client
        .from('categories')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return cat as Category;
    },

    async deleteCategory(id: string): Promise<void> {
      const { error } = await client.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
  };

  // ── Orders ──
  const orders: OrderService = {
    async createOrder(data: CheckoutData): Promise<{ order_number: string }> {
      // Call secure database RPC
      const { data: res, error } = await client.rpc('create_order_atomic', {
        p_customer_name: data.customer_name,
        p_email: data.email,
        p_phone: data.phone,
        p_shipping_address: data.shipping_address,
        p_payment_method: data.payment_method,
        p_notes: data.notes || '',
        p_items: data.items,
      });

      if (error) throw new Error(error.message);
      return { order_number: res.order_number };
    },

    async getOrderByNumber(orderNumber: string): Promise<OrderWithItems | null> {
      const { data, error } = await client
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('order_number', orderNumber)
        .single();

      if (error) return null;
      return data as any;
    },

    async getAllOrders(filters?: OrderFilters): Promise<PaginatedResult<OrderWithItems>> {
      let query = client
        .from('orders')
        .select('*, items:order_items(*)', { count: 'exact' });

      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.order_type) query = query.eq('order_type', filters.order_type);
      if (filters?.search) {
        query = query.or(`order_number.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%`);
      }

      query = query.order('created_at', { ascending: false });

      const page = filters?.page || 1;
      const limit = filters?.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, count, error } = await query.range(from, to);
      if (error) throw error;

      return {
        data: (data as any) || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      };
    },

    async getOrderById(id: string): Promise<OrderWithItems | null> {
      const { data, error } = await client
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('id', id)
        .single();

      if (error) return null;
      return data as any;
    },

    async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
      const { data, error } = await client
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Order;
    },
  };

  // ── Auth ──
  const auth: AuthService = {
    async signIn(email: string, pass: string): Promise<{ user: Profile }> {
      const { data, error } = await client.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;

      const { data: profile, error: profError } = await client
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profError || !profile || profile.role !== 'admin') {
        await client.auth.signOut();
        throw new Error('Access denied. Administrator privileges required.');
      }

      return { user: profile as Profile };
    },

    async signOut(): Promise<void> {
      await client.auth.signOut();
    },

    async getSession(): Promise<Profile | null> {
      const { data } = await client.auth.getSession();
      if (!data.session) return null;

      const { data: profile } = await client
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();

      return (profile as Profile) || null;
    },

    onAuthStateChange(callback: (profile: Profile | null) => void): () => void {
      const { data: sub } = client.auth.onAuthStateChange(async (_event, session) => {
        if (!session) {
          callback(null);
          return;
        }
        const { data: profile } = await client
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        callback((profile as Profile) || null);
      });

      return () => sub.subscription.unsubscribe();
    },
  };

  // ── Storage ──
  const storage: StorageService = {
    async uploadProductImage(file: File, productId: string): Promise<{ url: string; storage_path: string }> {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}/${crypto.randomUUID()}.${fileExt}`;

      const { error } = await client.storage
        .from('product-images')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: publicData } = client.storage
        .from('product-images')
        .getPublicUrl(fileName);

      return {
        url: publicData.publicUrl,
        storage_path: fileName,
      };
    },

    async deleteProductImage(storagePath: string): Promise<void> {
      await client.storage.from('product-images').remove([storagePath]);
    },
  };

  // ── Contact ──
  const contact: ContactService = {
    async submitMessage(data: ContactMessageInsert): Promise<void> {
      const { error } = await client.from('contact_messages').insert(data);
      if (error) throw error;
    },
  };

  // ── Dashboard ──
  const dashboard: DashboardService = {
    async getStats(): Promise<DashboardStats> {
      const { data: allProds } = await client.from('products').select('*, variants:product_variants(*)');
      const { count: totalOrders } = await client.from('orders').select('*', { count: 'exact', head: true });
      const { count: newOrders } = await client
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');

      const prods = (allProds as any[]) || [];
      const totalProducts = prods.length;
      const activeProducts = prods.filter((p) => p.is_published && p.status === 'active').length;
      const preorderProducts = prods.filter((p) => p.is_preorder).length;

      let lowStockProducts = 0;
      let outOfStockProducts = 0;

      prods.forEach((p) => {
        const total = getTotalStock(p.variants || []);
        if (total === 0) outOfStockProducts++;
        else if (total <= p.low_stock_threshold) lowStockProducts++;
      });

      return {
        totalProducts,
        activeProducts,
        preorderProducts,
        lowStockProducts,
        outOfStockProducts,
        totalOrders: totalOrders || 0,
        newOrders: newOrders || 0,
      };
    },

    async getRecentOrders(limit = 5): Promise<OrderWithItems[]> {
      const { data } = await client
        .from('orders')
        .select('*, items:order_items(*)')
        .order('created_at', { ascending: false })
        .limit(limit);
      return (data as any) || [];
    },

    async getLowStockProducts(limit = 6): Promise<ProductWithRelations[]> {
      const { data } = await client
        .from('products')
        .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)')
        .eq('is_published', true)
        .eq('status', 'active');

      const filtered = ((data as any[]) || []).filter((p) => {
        const total = getTotalStock(p.variants || []);
        return total <= p.low_stock_threshold;
      });

      return filtered.slice(0, limit);
    },
  };

  return {
    products,
    categories,
    orders,
    auth,
    storage,
    contact,
    dashboard,
  };
}
