// ──────────────────────────────────────────────
// SANAAT — Mock Order Service
// ──────────────────────────────────────────────

import type { OrderService } from '../interfaces';
import type {
  Order,
  OrderWithItems,
  OrderItem,
  OrderFilters,
  OrderStatus,
  CheckoutData,
  Product,
  ProductVariant,
} from '../../types';
import { isVariantPurchasable } from '../../utils/stock';
import { generateId, generateOrderNumber } from '../../utils';

const delay = () => new Promise<void>((r) => setTimeout(r, 100));

export function createMockOrderService(
  orders: Order[],
  orderItems: OrderItem[],
  products: Product[],
  variants: ProductVariant[],
): OrderService {
  let orderSequence = orders.length;

  function hydrateOrder(order: Order): OrderWithItems {
    return {
      ...order,
      items: orderItems.filter((i) => i.order_id === order.id),
    };
  }

  const service: OrderService = {
    async createOrder(data: CheckoutData) {
      await delay();

      // Validate and collect line items
      const resolvedItems: {
        product: Product;
        variant: ProductVariant;
        quantity: number;
      }[] = [];

      for (const item of data.items) {
        const product = products.find((p) => p.id === item.product_id);
        if (!product) throw new Error(`Product not found: ${item.product_id}`);

        const variant = variants.find((v) => v.id === item.variant_id && v.product_id === item.product_id);
        if (!variant) throw new Error(`Variant not found: ${item.variant_id}`);

        if (!isVariantPurchasable(product, variant)) {
          throw new Error(`Item is not purchasable: ${product.name} (${variant.size})`);
        }

        // For non-preorder, check stock
        if (!product.is_preorder && variant.stock_quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for ${product.name} (${variant.size}): requested ${item.quantity}, available ${variant.stock_quantity}`,
          );
        }

        resolvedItems.push({ product, variant, quantity: item.quantity });
      }

      // Calculate prices from product data (never trust client prices)
      const lineItems: OrderItem[] = resolvedItems.map(({ product, variant, quantity }) => {
        const firstImage = product.id
          ? undefined // We'll look it up below
          : undefined;

        // Find first image for this product
        const imageUrl =
          firstImage ?? null;

        return {
          id: generateId(),
          order_id: '', // Set below
          product_id: product.id,
          variant_id: variant.id,
          product_name_snapshot: product.name,
          size: variant.size,
          unit_price: product.price,
          quantity,
          image_url_snapshot: imageUrl,
        };
      });

      const subtotal = lineItems.reduce((s, i) => s + i.unit_price * i.quantity, 0);
      const shippingFee = subtotal >= 5000 ? 0 : 250;
      const hasPreorder = resolvedItems.some(({ product }) => product.is_preorder);

      orderSequence += 1;
      const orderId = generateId();
      const orderNumber = generateOrderNumber(orderSequence);

      const order: Order = {
        id: orderId,
        order_number: orderNumber,
        customer_name: data.customer_name,
        email: data.email,
        phone: data.phone,
        shipping_address: data.shipping_address,
        subtotal,
        shipping_fee: shippingFee,
        total: subtotal + shippingFee,
        order_type: hasPreorder ? 'preorder' : 'standard',
        status: 'new',
        payment_method: data.payment_method,
        payment_status: 'pending',
        notes: data.notes ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Decrement stock for non-preorder items
      for (const { product, variant, quantity } of resolvedItems) {
        if (!product.is_preorder) {
          variant.stock_quantity = Math.max(0, variant.stock_quantity - quantity);
        }
      }

      // Assign order_id and persist
      for (const item of lineItems) {
        item.order_id = orderId;
      }

      orders.push(order);
      orderItems.push(...lineItems);

      return { order_number: orderNumber };
    },

    async getOrderByNumber(orderNumber: string) {
      await delay();
      const order = orders.find((o) => o.order_number === orderNumber);
      return order ? hydrateOrder(order) : null;
    },

    async getAllOrders(filters: OrderFilters = {}) {
      await delay();
      let result = [...orders];

      if (filters.status) {
        result = result.filter((o) => o.status === filters.status);
      }

      if (filters.order_type) {
        result = result.filter((o) => o.order_type === filters.order_type);
      }

      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (o) =>
            o.order_number.toLowerCase().includes(q) ||
            o.customer_name.toLowerCase().includes(q) ||
            o.email.toLowerCase().includes(q) ||
            o.phone.includes(q),
        );
      }

      // Sort newest first
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const total = result.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const safePage = Math.min(Math.max(1, page), totalPages);
      const start = (safePage - 1) * limit;

      return {
        data: result.slice(start, start + limit).map(hydrateOrder),
        total,
        page: safePage,
        limit,
        totalPages,
      };
    },

    async getOrderById(id: string) {
      await delay();
      const order = orders.find((o) => o.id === id);
      return order ? hydrateOrder(order) : null;
    },

    async updateOrderStatus(id: string, status: OrderStatus) {
      await delay();
      const order = orders.find((o) => o.id === id);
      if (!order) throw new Error(`Order not found: ${id}`);
      order.status = status;
      order.updated_at = new Date().toISOString();
      return { ...order };
    },
  };

  return service;
}
