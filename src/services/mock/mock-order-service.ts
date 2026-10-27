// ──────────────────────────────────────────────
// SANAAT — Mock Order Service
// Province-based shipping: Punjab Rs. 250, Outside Punjab Rs. 350
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
  ProductImage,
} from '../../types';
import { isVariantPurchasable } from '../../utils/stock';
import { generateId, generateOrderNumber } from '../../utils';
import { calculateShippingFee } from '../../content/site-config';

const delay = () => new Promise<void>((r) => setTimeout(r, 80));

export function createMockOrderService(
  orders: Order[],
  orderItems: OrderItem[],
  products: Product[],
  variants: ProductVariant[],
  images: ProductImage[] = [],
  onMutation?: () => void
): OrderService {
  let orderSequence = orders.length + 10480;

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
            `Insufficient stock for ${product.name} (${variant.size}): requested ${item.quantity}, available ${variant.stock_quantity}`
          );
        }

        resolvedItems.push({ product, variant, quantity: item.quantity });
      }

      orderSequence += 1;
      const orderId = generateId();
      const orderNumber = generateOrderNumber(orderSequence);

      // Construct line items
      const lineItems: OrderItem[] = resolvedItems.map(({ product, variant, quantity }) => {
        const firstImg = images.find((img) => img.product_id === product.id && img.position === 0) ||
          images.find((img) => img.product_id === product.id);

        return {
          id: generateId(),
          order_id: orderId,
          product_id: product.id,
          variant_id: variant.id,
          product_name_snapshot: product.name,
          size: variant.size,
          unit_price: product.price,
          quantity,
          image_url_snapshot: firstImg ? firstImg.url : null,
        };
      });

      const subtotal = lineItems.reduce((s, i) => s + i.unit_price * i.quantity, 0);

      // Section 8: Punjab = Rs. 250, Outside Punjab = Rs. 350
      const province = data.shipping_address?.province || 'Punjab';
      const shippingFee = calculateShippingFee(province);
      const total = subtotal + shippingFee;

      const hasPreorder = resolvedItems.some(({ product }) => product.is_preorder);

      const now = new Date().toISOString();
      const order: Order = {
        id: orderId,
        order_number: orderNumber,
        customer_name: data.customer_name,
        email: data.email || 'customer@sanaat.pk',
        phone: data.phone,
        shipping_address: data.shipping_address,
        subtotal,
        shipping_fee: shippingFee,
        total,
        order_type: hasPreorder ? 'preorder' : 'standard',
        status: 'new',
        payment_method: data.payment_method,
        payment_status: 'pending',
        notes: data.notes ?? null,
        created_at: now,
        updated_at: now,
      };

      // Decrement stock for non-preorder items
      for (const { product, variant, quantity } of resolvedItems) {
        if (!product.is_preorder) {
          variant.stock_quantity = Math.max(0, variant.stock_quantity - quantity);
        }
      }

      orders.unshift(order);
      orderItems.push(...lineItems);

      onMutation?.();

      return {
        order_id: order.id,
        order_number: order.order_number,
        total: order.total,
      };
    },

    async getOrderByNumber(orderNumber: string) {
      await delay();
      const order = orders.find(
        (o) => o.order_number.toUpperCase() === orderNumber.toUpperCase()
      );
      return order ? hydrateOrder(order) : null;
    },

    async getOrderById(id: string) {
      await delay();
      const order = orders.find((o) => o.id === id);
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
        const query = filters.search.toLowerCase();
        result = result.filter(
          (o) =>
            o.order_number.toLowerCase().includes(query) ||
            o.customer_name.toLowerCase().includes(query) ||
            o.phone.includes(query) ||
            o.email.toLowerCase().includes(query)
        );
      }

      // Sort newest first
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      const page = filters.page ?? 1;
      const limit = filters.limit ?? 50;
      const total = result.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const offset = (page - 1) * limit;
      const data = result.slice(offset, offset + limit).map(hydrateOrder);

      return { data, total, page, limit, totalPages };
    },

    async updateOrderStatus(id: string, status: OrderStatus) {
      await delay();
      const order = orders.find((o) => o.id === id);
      if (!order) throw new Error(`Order not found: ${id}`);
      order.status = status;
      order.updated_at = new Date().toISOString();
      onMutation?.();
      return hydrateOrder(order);
    },

    async deleteOrder(id: string) {
      await delay();
      const idx = orders.findIndex((o) => o.id === id);
      if (idx === -1) throw new Error(`Order not found: ${id}`);
      orders.splice(idx, 1);

      // Remove items associated with this order
      const itemIndices = orderItems
        .map((it, i) => (it.order_id === id ? i : -1))
        .filter((i) => i !== -1)
        .reverse();
      for (const i of itemIndices) {
        orderItems.splice(i, 1);
      }

      onMutation?.();
    },
  };

  return service;
}
