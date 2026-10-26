// ──────────────────────────────────────────────
// SANAAT — Mock Seed Data (Demo Only)
// ──────────────────────────────────────────────

import type {
  Category,
  Product,
  ProductImage,
  ProductVariant,
  Order,
  OrderItem,
} from '../../types';

// ── Helpers ──

const now = new Date().toISOString();
const twoMonthsFromNow = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();
const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();

function placeholder(label: string, w = 600, h = 800): string {
  return `https://placehold.co/${w}x${h}/f5f5f5/999999?text=${encodeURIComponent(label)}`;
}

// ── Categories ──

const catFormalId = crypto.randomUUID();
const catCasualId = crypto.randomUUID();
const catBridalId = crypto.randomUUID();
const catAccessoriesId = crypto.randomUUID();

export const seedCategories: Category[] = [
  {
    id: catFormalId,
    name: 'Formal Wear',
    slug: 'formal-wear',
    description: 'Elegant formal ensembles for special occasions',
    image_url: placeholder('Formal+Wear', 800, 600),
    display_order: 1,
    is_active: true,
    created_at: now,
  },
  {
    id: catCasualId,
    name: 'Casual Wear',
    slug: 'casual-wear',
    description: 'Everyday luxury in comfortable silhouettes',
    image_url: placeholder('Casual+Wear', 800, 600),
    display_order: 2,
    is_active: true,
    created_at: now,
  },
  {
    id: catBridalId,
    name: 'Bridal Collection',
    slug: 'bridal-collection',
    description: 'Handcrafted bridal couture for your special day',
    image_url: placeholder('Bridal+Collection', 800, 600),
    display_order: 3,
    is_active: true,
    created_at: now,
  },
  {
    id: catAccessoriesId,
    name: 'Accessories',
    slug: 'accessories',
    description: 'Curated accessories to complement your look',
    image_url: placeholder('Accessories', 800, 600),
    display_order: 4,
    is_active: true,
    created_at: now,
  },
];

// ── Product IDs (pre-generated for cross-referencing) ──

const p1 = crypto.randomUUID();
const p2 = crypto.randomUUID();
const p3 = crypto.randomUUID();
const p4 = crypto.randomUUID();
const p5 = crypto.randomUUID();
const p6 = crypto.randomUUID();
const p7 = crypto.randomUUID();
const p8 = crypto.randomUUID();
const p9 = crypto.randomUUID();
const p10 = crypto.randomUUID();
const p11 = crypto.randomUUID();
const p12 = crypto.randomUUID();
const p13 = crypto.randomUUID();
const p14 = crypto.randomUUID();

// ── Helper to build images ──

function makeImages(productId: string, productNum: number, count: number): ProductImage[] {
  const labels = ['Front', 'Back', 'Detail'];
  return Array.from({ length: count }, (_, i) => ({
    id: crypto.randomUUID(),
    product_id: productId,
    url: placeholder(`Demo+Product+${String(productNum).padStart(2, '0')}+${labels[i] ?? `View+${i + 1}`}`),
    storage_path: null,
    alt_text: `Demo product ${productNum} ${labels[i] ?? `view ${i + 1}`}`,
    position: i,
  }));
}

// ── Helper to build variants ──

type StockMap = Record<string, number>;
const SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;

function makeVariants(productId: string, stockMap: StockMap): ProductVariant[] {
  return SIZES.map((size) => ({
    id: crypto.randomUUID(),
    product_id: productId,
    size,
    stock_quantity: stockMap[size] ?? 0,
    sku: null,
  }));
}

// ── Products ──

export const seedProducts: Product[] = [
  // ── 1. Featured + Available (Formal) ──
  {
    id: p1,
    name: 'Noor Silk Formal',
    slug: 'noor-silk-formal',
    description: 'A stunning silk formal suit with intricate gold thread-work, perfect for evening gatherings.',
    price: 18500,
    compare_at_price: 22000,
    category_id: catFormalId,
    status: 'active',
    is_published: true,
    is_featured: true,
    is_preorder: false,
    preorder_closes_at: null,
    estimated_dispatch_date: null,
    preorder_limit: null,
    tags: ['silk', 'formal', 'embroidered', 'evening'],
    fabric: '100% Pure Silk',
    care_instructions: 'Dry clean only. Store in garment bag.',
    details: 'Includes shirt, dupatta and trousers. Hand-embroidered neckline and border.',
    display_order: 1,
    low_stock_threshold: 3,
    created_at: oneWeekAgo,
    updated_at: now,
  },
  // ── 2. Featured + Available (Formal) ──
  {
    id: p2,
    name: 'Zara Embroidered Lawn Suit',
    slug: 'zara-embroidered-lawn-suit',
    description: 'Premium lawn fabric with delicate floral embroidery and a chiffon dupatta.',
    price: 7500,
    compare_at_price: 9000,
    category_id: catFormalId,
    status: 'active',
    is_published: true,
    is_featured: true,
    is_preorder: false,
    preorder_closes_at: null,
    estimated_dispatch_date: null,
    preorder_limit: null,
    tags: ['lawn', 'embroidered', 'summer', 'formal'],
    fabric: 'Premium Lawn with Chiffon Dupatta',
    care_instructions: 'Machine wash cold. Hang dry. Iron on medium.',
    details: '3-piece suit: shirt, trousers, chiffon dupatta. Embroidered front and sleeves.',
    display_order: 2,
    low_stock_threshold: 3,
    created_at: oneWeekAgo,
    updated_at: now,
  },
  // ── 3. Featured + Available (Casual) ──
  {
    id: p3,
    name: 'Aisha Cotton Kurta',
    slug: 'aisha-cotton-kurta',
    description: 'Breathable cotton kurta with minimalist block print, ideal for daily wear.',
    price: 4200,
    compare_at_price: null,
    category_id: catCasualId,
    status: 'active',
    is_published: true,
    is_featured: true,
    is_preorder: false,
    preorder_closes_at: null,
    estimated_dispatch_date: null,
    preorder_limit: null,
    tags: ['cotton', 'casual', 'summer', 'block-print'],
    fabric: '100% Cotton Lawn',
    care_instructions: 'Machine wash cold. Tumble dry low.',
    details: 'Single shirt. Side slits with button detail. Straight-cut silhouette.',
    display_order: 3,
    low_stock_threshold: 3,
    created_at: fiveDaysAgo,
    updated_at: now,
  },
  // ── 4. Featured + Available (Casual) ──
  {
    id: p4,
    name: 'Sana Linen Co-ord Set',
    slug: 'sana-linen-coord-set',
    description: 'A relaxed linen co-ord set in earthy tones with hand-stitched accents.',
    price: 5800,
    compare_at_price: 6500,
    category_id: catCasualId,
    status: 'active',
    is_published: true,
    is_featured: true,
    is_preorder: false,
    preorder_closes_at: null,
    estimated_dispatch_date: null,
    preorder_limit: null,
    tags: ['linen', 'casual', 'co-ord', 'summer'],
    fabric: 'French Linen',
    care_instructions: 'Hand wash recommended. Iron while damp.',
    details: '2-piece set: oversized shirt and wide-leg trousers.',
    display_order: 4,
    low_stock_threshold: 3,
    created_at: fiveDaysAgo,
    updated_at: now,
  },
  // ── 5. Featured (Bridal) ──
  {
    id: p5,
    name: 'Mahira Bridal Lehenga',
    slug: 'mahira-bridal-lehenga',
    description: 'Show-stopping bridal lehenga with heavy zardozi work in royal maroon.',
    price: 95000,
    compare_at_price: null,
    category_id: catBridalId,
    status: 'active',
    is_published: true,
    is_featured: true,
    is_preorder: false,
    preorder_closes_at: null,
    estimated_dispatch_date: null,
    preorder_limit: null,
    tags: ['bridal', 'lehenga', 'zardozi', 'wedding'],
    fabric: 'Pure Organza with Zardozi',
    care_instructions: 'Professional dry clean only. Store flat in acid-free tissue.',
    details: '3-piece: lehenga, blouse, dupatta. Hand-embroidered with gold zardozi and Swarovski crystals.',
    display_order: 5,
    low_stock_threshold: 2,
    created_at: oneWeekAgo,
    updated_at: now,
  },
  // ── 6. Pre-order (Bridal) ──
  {
    id: p6,
    name: 'Anaya Velvet Shawl Set',
    slug: 'anaya-velvet-shawl-set',
    description: 'Winter bridal velvet shawl set with pearl embellishments. Made to order.',
    price: 45000,
    compare_at_price: null,
    category_id: catBridalId,
    status: 'active',
    is_published: true,
    is_featured: false,
    is_preorder: true,
    preorder_closes_at: null,
    estimated_dispatch_date: twoMonthsFromNow,
    preorder_limit: 20,
    tags: ['bridal', 'velvet', 'winter', 'preorder'],
    fabric: 'Silk Velvet',
    care_instructions: 'Dry clean only.',
    details: '3-piece: shirt, velvet shawl, jamawar trousers. Hand-applied pearl and sequin work.',
    display_order: 6,
    low_stock_threshold: 3,
    created_at: twoDaysAgo,
    updated_at: now,
  },
  // ── 7. Pre-order (Formal) ──
  {
    id: p7,
    name: 'Hira Organza Ensemble',
    slug: 'hira-organza-ensemble',
    description: 'An ethereal organza outfit with French-knot embroidery. Pre-order exclusive.',
    price: 24500,
    compare_at_price: null,
    category_id: catFormalId,
    status: 'active',
    is_published: true,
    is_featured: false,
    is_preorder: true,
    preorder_closes_at: null,
    estimated_dispatch_date: twoMonthsFromNow,
    preorder_limit: 15,
    tags: ['organza', 'formal', 'embroidered', 'preorder'],
    fabric: 'Pure Organza',
    care_instructions: 'Dry clean only. Handle with care.',
    details: '3-piece stitched outfit. Hand-embroidered motifs in French-knot technique.',
    display_order: 7,
    low_stock_threshold: 3,
    created_at: twoDaysAgo,
    updated_at: now,
  },
  // ── 8. Out of Stock (Casual) ──
  {
    id: p8,
    name: 'Fatima Printed Cambric',
    slug: 'fatima-printed-cambric',
    description: 'Vibrant cambric suit with bold geometric prints. Currently sold out.',
    price: 3500,
    compare_at_price: 4200,
    category_id: catCasualId,
    status: 'active',
    is_published: true,
    is_featured: false,
    is_preorder: false,
    preorder_closes_at: null,
    estimated_dispatch_date: null,
    preorder_limit: null,
    tags: ['cambric', 'casual', 'printed', 'summer'],
    fabric: 'Premium Cambric',
    care_instructions: 'Machine wash cold. Do not bleach.',
    details: '2-piece unstitched: shirt and trousers. Digital print.',
    display_order: 8,
    low_stock_threshold: 3,
    created_at: oneWeekAgo,
    updated_at: now,
  },
  // ── 9. Out of Stock (Accessories) ──
  {
    id: p9,
    name: 'Rania Pearl Clutch',
    slug: 'rania-pearl-clutch',
    description: 'Hand-beaded pearl clutch bag. Sold out — restocking soon.',
    price: 6800,
    compare_at_price: null,
    category_id: catAccessoriesId,
    status: 'active',
    is_published: true,
    is_featured: false,
    is_preorder: false,
    preorder_closes_at: null,
    estimated_dispatch_date: null,
    preorder_limit: null,
    tags: ['accessories', 'clutch', 'pearls', 'evening'],
    fabric: 'Satin with Pearl Beading',
    care_instructions: 'Wipe with soft cloth. Store in dust bag.',
    details: 'Dimensions: 22cm x 12cm. Magnetic snap closure. Chain strap included.',
    display_order: 9,
    low_stock_threshold: 2,
    created_at: oneWeekAgo,
    updated_at: now,
  },
  // ── 10. Low Stock (Casual) ──
  {
    id: p10,
    name: 'Maryam Pashmina Shawl',
    slug: 'maryam-pashmina-shawl',
    description: 'Ultra-soft pashmina shawl with delicate hand-embroidered border.',
    price: 8900,
    compare_at_price: 10000,
    category_id: catAccessoriesId,
    status: 'active',
    is_published: true,
    is_featured: false,
    is_preorder: false,
    preorder_closes_at: null,
    estimated_dispatch_date: null,
    preorder_limit: null,
    tags: ['accessories', 'shawl', 'pashmina', 'winter'],
    fabric: 'Pure Pashmina Wool',
    care_instructions: 'Dry clean only. Store folded with mothballs.',
    details: 'Dimensions: 200cm x 70cm. Hand-embroidered Kashmiri border.',
    display_order: 10,
    low_stock_threshold: 3,
    created_at: fiveDaysAgo,
    updated_at: now,
  },
  // ── 11. Low Stock (Accessories) ──
  {
    id: p11,
    name: 'Ayesha Chiffon Dupatta Set',
    slug: 'ayesha-chiffon-dupatta-set',
    description: 'Set of two pure chiffon dupattas with hand-finished edges.',
    price: 3200,
    compare_at_price: null,
    category_id: catAccessoriesId,
    status: 'active',
    is_published: true,
    is_featured: false,
    is_preorder: false,
    preorder_closes_at: null,
    estimated_dispatch_date: null,
    preorder_limit: null,
    tags: ['accessories', 'dupatta', 'chiffon', 'everyday'],
    fabric: 'Pure Chiffon',
    care_instructions: 'Hand wash cold. Air dry in shade.',
    details: 'Set of 2 dupattas: ivory and blush pink. 2.5m each.',
    display_order: 11,
    low_stock_threshold: 3,
    created_at: fiveDaysAgo,
    updated_at: now,
  },
  // ── 12. Regular (Formal) ──
  {
    id: p12,
    name: 'Layla Jacquard Three-Piece',
    slug: 'layla-jacquard-three-piece',
    description: 'Luxurious jacquard fabric with subtle self-print and silver detailing.',
    price: 12800,
    compare_at_price: 15000,
    category_id: catFormalId,
    status: 'active',
    is_published: true,
    is_featured: false,
    is_preorder: false,
    preorder_closes_at: null,
    estimated_dispatch_date: null,
    preorder_limit: null,
    tags: ['jacquard', 'formal', 'three-piece', 'silver'],
    fabric: 'Premium Jacquard',
    care_instructions: 'Dry clean recommended. Iron on medium.',
    details: '3-piece unstitched: shirt, dupatta, trousers. Self-print jacquard with silver screen-print border.',
    display_order: 12,
    low_stock_threshold: 3,
    created_at: oneWeekAgo,
    updated_at: now,
  },
  // ── 13. Draft / Unpublished (Casual) ──
  {
    id: p13,
    name: 'Kiran Summer Kurti (Draft)',
    slug: 'kiran-summer-kurti',
    description: 'Lightweight summer kurti in pastel palette. Not yet published.',
    price: 3800,
    compare_at_price: null,
    category_id: catCasualId,
    status: 'draft',
    is_published: false,
    is_featured: false,
    is_preorder: false,
    preorder_closes_at: null,
    estimated_dispatch_date: null,
    preorder_limit: null,
    tags: ['cotton', 'casual', 'summer', 'kurti'],
    fabric: 'Lawn Cotton',
    care_instructions: 'Machine washable.',
    details: 'Single kurti. A-line cut. Coming soon.',
    display_order: 13,
    low_stock_threshold: 3,
    created_at: twoDaysAgo,
    updated_at: now,
  },
  // ── 14. Archived (Formal) ──
  {
    id: p14,
    name: 'Meher Eid Collection (Archived)',
    slug: 'meher-eid-collection',
    description: 'Limited edition Eid collection. Season ended — archived.',
    price: 16000,
    compare_at_price: null,
    category_id: catFormalId,
    status: 'archived',
    is_published: false,
    is_featured: false,
    is_preorder: false,
    preorder_closes_at: null,
    estimated_dispatch_date: null,
    preorder_limit: null,
    tags: ['formal', 'eid', 'limited-edition', 'archived'],
    fabric: 'Silk Chiffon',
    care_instructions: 'Dry clean only.',
    details: '3-piece stitched. Discontinued seasonal item.',
    display_order: 14,
    low_stock_threshold: 3,
    created_at: oneWeekAgo,
    updated_at: now,
  },
];

// ── Images ──

export const seedImages: ProductImage[] = [
  ...makeImages(p1, 1, 3),
  ...makeImages(p2, 2, 3),
  ...makeImages(p3, 3, 2),
  ...makeImages(p4, 4, 3),
  ...makeImages(p5, 5, 3),
  ...makeImages(p6, 6, 2),
  ...makeImages(p7, 7, 2),
  ...makeImages(p8, 8, 2),
  ...makeImages(p9, 9, 2),
  ...makeImages(p10, 10, 2),
  ...makeImages(p11, 11, 2),
  ...makeImages(p12, 12, 3),
  ...makeImages(p13, 13, 2),
  ...makeImages(p14, 14, 2),
];

// ── Variants ──
// Stock distribution: p8, p9 = 0 (out of stock), p10 = total 2 (low), p11 = total 3 (low)

export const seedVariants: ProductVariant[] = [
  // p1 — good stock
  ...makeVariants(p1, { XS: 5, S: 10, M: 15, L: 8, XL: 3 }),
  // p2 — good stock
  ...makeVariants(p2, { XS: 8, S: 12, M: 10, L: 6, XL: 4 }),
  // p3 — good stock
  ...makeVariants(p3, { XS: 10, S: 15, M: 12, L: 8, XL: 5 }),
  // p4 — good stock
  ...makeVariants(p4, { XS: 6, S: 10, M: 14, L: 10, XL: 6 }),
  // p5 — moderate stock (bridal, lower quantities)
  ...makeVariants(p5, { XS: 2, S: 3, M: 4, L: 3, XL: 1 }),
  // p6 — preorder, stock irrelevant but some present
  ...makeVariants(p6, { XS: 0, S: 0, M: 0, L: 0, XL: 0 }),
  // p7 — preorder, stock irrelevant
  ...makeVariants(p7, { XS: 0, S: 0, M: 0, L: 0, XL: 0 }),
  // p8 — out of stock (all 0)
  ...makeVariants(p8, { XS: 0, S: 0, M: 0, L: 0, XL: 0 }),
  // p9 — out of stock (all 0)
  ...makeVariants(p9, { XS: 0, S: 0, M: 0, L: 0, XL: 0 }),
  // p10 — low stock (total = 2)
  ...makeVariants(p10, { XS: 0, S: 1, M: 1, L: 0, XL: 0 }),
  // p11 — low stock (total = 3)
  ...makeVariants(p11, { XS: 0, S: 1, M: 1, L: 1, XL: 0 }),
  // p12 — good stock
  ...makeVariants(p12, { XS: 4, S: 8, M: 12, L: 7, XL: 3 }),
  // p13 — draft, some stock
  ...makeVariants(p13, { XS: 5, S: 10, M: 10, L: 5, XL: 3 }),
  // p14 — archived, had stock
  ...makeVariants(p14, { XS: 2, S: 3, M: 1, L: 0, XL: 0 }),
];

// ── Seed Orders ──

function buildOrder(
  seq: number,
  name: string,
  email: string,
  phone: string,
  city: string,
  items: Omit<OrderItem, 'order_id'>[],
  overrides: Partial<Order> = {},
): { order: Order; items: OrderItem[] } {
  const orderId = crypto.randomUUID();
  const subtotal = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const shippingFee = subtotal >= 5000 ? 0 : 250;

  const order: Order = {
    id: orderId,
    order_number: `SNT-${String(seq).padStart(6, '0')}`,
    customer_name: name,
    email,
    phone,
    shipping_address: {
      line1: '123 Demo Street',
      city,
      province: 'Punjab',
      postal_code: '54000',
      country: 'Pakistan',
    },
    subtotal,
    shipping_fee: shippingFee,
    total: subtotal + shippingFee,
    order_type: 'standard',
    status: 'new',
    payment_method: 'cod',
    payment_status: 'pending',
    notes: null,
    created_at: twoDaysAgo,
    updated_at: twoDaysAgo,
    ...overrides,
  };

  const orderItems: OrderItem[] = items.map((item) => ({
    ...item,
    order_id: orderId,
  }));

  return { order, items: orderItems };
}

// Get variant IDs for order items
const p1Variants = seedVariants.filter((v) => v.product_id === p1);
const p2Variants = seedVariants.filter((v) => v.product_id === p2);
const p3Variants = seedVariants.filter((v) => v.product_id === p3);
const p5Variants = seedVariants.filter((v) => v.product_id === p5);
const p12Variants = seedVariants.filter((v) => v.product_id === p12);

const order1 = buildOrder(
  1,
  'Amna Khalid',
  'amna.khalid@demo.test',
  '+923001234567',
  'Lahore',
  [
    {
      id: crypto.randomUUID(),
      product_id: p1,
      variant_id: p1Variants.find((v) => v.size === 'M')!.id,
      product_name_snapshot: 'Noor Silk Formal',
      size: 'M',
      unit_price: 18500,
      quantity: 1,
      image_url_snapshot: placeholder('Demo+Product+01+Front'),
    },
  ],
  { status: 'confirmed', payment_status: 'paid', payment_method: 'bank_transfer' },
);

const order2 = buildOrder(
  2,
  'Sara Ahmed',
  'sara.ahmed@demo.test',
  '+923009876543',
  'Karachi',
  [
    {
      id: crypto.randomUUID(),
      product_id: p2,
      variant_id: p2Variants.find((v) => v.size === 'S')!.id,
      product_name_snapshot: 'Zara Embroidered Lawn Suit',
      size: 'S',
      unit_price: 7500,
      quantity: 1,
      image_url_snapshot: placeholder('Demo+Product+02+Front'),
    },
    {
      id: crypto.randomUUID(),
      product_id: p3,
      variant_id: p3Variants.find((v) => v.size === 'M')!.id,
      product_name_snapshot: 'Aisha Cotton Kurta',
      size: 'M',
      unit_price: 4200,
      quantity: 2,
      image_url_snapshot: placeholder('Demo+Product+03+Front'),
    },
  ],
  { status: 'processing' },
);

const order3 = buildOrder(
  3,
  'Zainab Hassan',
  'zainab.hassan@demo.test',
  '+923335551234',
  'Islamabad',
  [
    {
      id: crypto.randomUUID(),
      product_id: p5,
      variant_id: p5Variants.find((v) => v.size === 'S')!.id,
      product_name_snapshot: 'Mahira Bridal Lehenga',
      size: 'S',
      unit_price: 95000,
      quantity: 1,
      image_url_snapshot: placeholder('Demo+Product+05+Front'),
    },
  ],
  { status: 'dispatched', payment_status: 'paid', payment_method: 'online' },
);

const order4 = buildOrder(
  4,
  'Hina Tariq',
  'hina.tariq@demo.test',
  '+923211112222',
  'Faisalabad',
  [
    {
      id: crypto.randomUUID(),
      product_id: p12,
      variant_id: p12Variants.find((v) => v.size === 'L')!.id,
      product_name_snapshot: 'Layla Jacquard Three-Piece',
      size: 'L',
      unit_price: 12800,
      quantity: 1,
      image_url_snapshot: placeholder('Demo+Product+12+Front'),
    },
  ],
  { status: 'new' },
);

const order5 = buildOrder(
  5,
  'Nadia Malik',
  'nadia.malik@demo.test',
  '+923451231234',
  'Rawalpindi',
  [
    {
      id: crypto.randomUUID(),
      product_id: p3,
      variant_id: p3Variants.find((v) => v.size === 'L')!.id,
      product_name_snapshot: 'Aisha Cotton Kurta',
      size: 'L',
      unit_price: 4200,
      quantity: 1,
      image_url_snapshot: placeholder('Demo+Product+03+Front'),
    },
  ],
  { status: 'cancelled' },
);

export const seedOrders: Order[] = [
  order1.order,
  order2.order,
  order3.order,
  order4.order,
  order5.order,
];

export const seedOrderItems: OrderItem[] = [
  ...order1.items,
  ...order2.items,
  ...order3.items,
  ...order4.items,
  ...order5.items,
];
