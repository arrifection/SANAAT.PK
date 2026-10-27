// ──────────────────────────────────────────────
// SANAAT — Authentic Seed Data
// Collections: Winter Formals, Summer Edit, Occasion Wear
// ──────────────────────────────────────────────

import type {
  Category,
  Product,
  ProductImage,
  ProductVariant,
  Order,
  OrderItem,
} from '../../types';

const now = new Date().toISOString();

// ── 3 Core Categories per Section 4 ──
export const seedCategories: Category[] = [
  {
    id: 'cat-winter-formals',
    name: 'Winter Formals',
    slug: 'winter-formals',
    description: 'Rich textures and refined handcraft tailored for winter evenings.',
    image_url: '/images/collections/winter-formals.webp',
    display_order: 1,
    is_active: true,
    created_at: now,
  },
  {
    id: 'cat-summer-edit',
    name: 'Summer Edit',
    slug: 'summer-edit',
    description: 'Airy pure cotton lawns and organza pairings designed for graceful summer modesty.',
    image_url: '/images/collections/summer-edit.jpg',
    display_order: 2,
    is_active: true,
    created_at: now,
  },
  {
    id: 'cat-occasion-wear',
    name: 'Occasion Wear',
    slug: 'occasion-wear',
    description: 'Heirloom-inspired festive formals featuring delicate resham and tilla handcraft.',
    image_url: '/images/collections/occasion-wear.jpg',
    display_order: 3,
    is_active: true,
    created_at: now,
  },
];

// ── Products ──
export const seedProducts: Product[] = [
  {
    id: 'prod-noor-001',
    name: 'Noor',
    slug: 'noor',
    description:
      'A graceful three-piece silhouette crafted in pure Sanaat Plum khaddar. Features delicate tonal hand-embroidery along the neckline and cuffs, paired with a flowing dupatta. Designed for effortless modesty and timeless presence.',
    price: 18500,
    compare_at_price: null,
    category_id: 'cat-winter-formals',
    status: 'active',
    is_published: true,
    is_featured: true, // Featured dress 1 on homepage
    is_preorder: true, // Pre-order demonstration
    preorder_closes_at: null,
    estimated_dispatch_date: null,
    preorder_limit: 25,
    tags: ['Khaddar', 'Plum', 'Winter Formals', 'Pre-Order'],
    fabric: 'Khaddar',
    fabric_care: 'Dry Clean',
    product_type: 'Set',
    color: 'Plum',
    care_instructions: 'Dry clean only. Store in a breathable garment bag.',
    details: 'Three-piece stitched ensemble with hand-finished hems and tonal resham detailing.',
    display_order: 1,
    low_stock_threshold: 3,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'prod-mehr-002',
    name: 'Mehr',
    slug: 'mehr',
    description:
      'An heirloom-inspired formal ensemble in rich ivory gold. Accented with refined resham threadwork and subtle hand-embellished accents, complemented by an ethereal dupatta. Perfectly suited for intimate gatherings and celebrations.',
    price: 24000,
    compare_at_price: null,
    category_id: 'cat-occasion-wear',
    status: 'active',
    is_published: true,
    is_featured: true, // Featured dress 2 on homepage
    is_preorder: false,
    preorder_closes_at: null,
    estimated_dispatch_date: null,
    preorder_limit: null,
    tags: ['Raw Silk', 'Ivory', 'Occasion Wear'],
    fabric: 'Silk',
    fabric_care: 'Dry Clean',
    product_type: 'Set',
    color: 'Ivory',
    care_instructions: 'Dry clean only.',
    details: 'Long shirt with tailored straight trousers and embroidered dupatta borders.',
    display_order: 2,
    low_stock_threshold: 3,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'prod-aira-003',
    name: 'Aira',
    slug: 'aira',
    description:
      'Understated elegance for the modern woman. Cut in pure breathable handloom lawn in powder sage, featuring minimalist finishings and a relaxed modest drape. An indispensable staple for considered wardrobes.',
    price: 14500,
    compare_at_price: null,
    category_id: 'cat-summer-edit',
    status: 'active',
    is_published: true,
    is_featured: true, // Featured dress 3 on homepage
    is_preorder: false,
    preorder_closes_at: null,
    estimated_dispatch_date: null,
    preorder_limit: null,
    tags: ['Lawn', 'Sage', 'Summer Edit'],
    fabric: 'Lawn',
    fabric_care: 'Washable',
    product_type: 'Set',
    color: 'Sage',
    care_instructions: 'Hand wash cold or gentle machine cycle. Iron inside out.',
    details: 'Relaxed A-line silhouette with scalloped organza sleeves and straight pants.',
    display_order: 3,
    low_stock_threshold: 3,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'prod-elara-004',
    name: 'Elara',
    slug: 'elara',
    description:
      'Tailored with architectural restraint in deep charcoal black. This piece pairs clean silhouettes with purposeful artisan detailing along the neckline for quiet sophistication.',
    price: 21000,
    compare_at_price: null,
    category_id: 'cat-winter-formals',
    status: 'active',
    is_published: true,
    is_featured: false,
    is_preorder: false,
    preorder_closes_at: null,
    estimated_dispatch_date: null,
    preorder_limit: null,
    tags: ['Charcoal', 'Winter Formals'],
    fabric: 'Khaddar',
    fabric_care: 'Dry Clean',
    product_type: 'Set',
    color: 'Charcoal',
    care_instructions: 'Dry clean only.',
    details: 'Modest straight-cut shirt with tonal embroidery and tailored cigarette trousers.',
    display_order: 4,
    low_stock_threshold: 3,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'prod-zoya-005',
    name: 'Zoya',
    slug: 'zoya',
    description:
      'Handcrafted deep emerald ensemble accented with intricate zardozi motifs across the neckline and sleeves. Paired with a tissue organza dupatta for festive grandeur.',
    price: 26500,
    compare_at_price: null,
    category_id: 'cat-occasion-wear',
    status: 'active',
    is_published: true,
    is_featured: false,
    is_preorder: true,
    preorder_closes_at: null,
    estimated_dispatch_date: null,
    preorder_limit: 15,
    tags: ['Emerald', 'Occasion Wear', 'Pre-Order'],
    fabric: 'Silk',
    fabric_care: 'Dry Clean',
    product_type: 'Set',
    color: 'Emerald',
    care_instructions: 'Dry clean only.',
    details: 'Includes embellished shirt, matching flared trousers, and finished dupatta.',
    display_order: 5,
    low_stock_threshold: 3,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'prod-inaya-006',
    name: 'Inaya',
    slug: 'inaya',
    description:
      'A breathable summer coordinate ensemble cut from fine cotton silk in blush terracotta. Minimalist boat neck with understated stitch detailing and relaxed trousers.',
    price: 13500,
    compare_at_price: null,
    category_id: 'cat-summer-edit',
    status: 'active',
    is_published: true,
    is_featured: false,
    is_preorder: false,
    preorder_closes_at: null,
    estimated_dispatch_date: null,
    preorder_limit: null,
    tags: ['Blush', 'Summer Edit'],
    fabric: 'Cotton',
    fabric_care: 'Washable',
    product_type: 'Set',
    color: 'Blush',
    care_instructions: 'Gentle hand wash. Iron on low heat.',
    details: 'Boxy relaxed tunic with matching wide-leg culottes.',
    display_order: 6,
    low_stock_threshold: 3,
    created_at: now,
    updated_at: now,
  },
];

// ── Up to 3 Product Images per dress (Section 6 & 17) ──
export const seedImages: ProductImage[] = [
  // Noor (Plum)
  {
    id: 'img-noor-1',
    product_id: 'prod-noor-001',
    url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=900&q=85&auto=format&fit=crop',
    storage_path: null,
    alt_text: 'Noor — Embroidered Khaddar Ensemble front view',
    position: 0,
  },
  {
    id: 'img-noor-2',
    product_id: 'prod-noor-001',
    url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=85&auto=format&fit=crop',
    storage_path: null,
    alt_text: 'Noor — Close up embroidery detail',
    position: 1,
  },
  {
    id: 'img-noor-3',
    product_id: 'prod-noor-001',
    url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=85&auto=format&fit=crop',
    storage_path: null,
    alt_text: 'Noor — Full silhouette drape',
    position: 2,
  },

  // Mehr (Ivory)
  {
    id: 'img-mehr-1',
    product_id: 'prod-mehr-002',
    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=900&q=85&auto=format&fit=crop',
    storage_path: null,
    alt_text: 'Mehr — Pure Raw Silk Occasion Ensemble',
    position: 0,
  },
  {
    id: 'img-mehr-2',
    product_id: 'prod-mehr-002',
    url: 'https://images.unsplash.com/photo-1583391733981-8b530eaef1c1?w=900&q=85&auto=format&fit=crop',
    storage_path: null,
    alt_text: 'Mehr — Artisanal hand embroidery work',
    position: 1,
  },
  {
    id: 'img-mehr-3',
    product_id: 'prod-mehr-002',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85&auto=format&fit=crop',
    storage_path: null,
    alt_text: 'Mehr — Dupatta styling',
    position: 2,
  },

  // Aira (Sage)
  {
    id: 'img-aira-1',
    product_id: 'prod-aira-003',
    url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=85&auto=format&fit=crop',
    storage_path: null,
    alt_text: 'Aira — Artisanal Summer Lawn',
    position: 0,
  },
  {
    id: 'img-aira-2',
    product_id: 'prod-aira-003',
    url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=900&q=85&auto=format&fit=crop',
    storage_path: null,
    alt_text: 'Aira — Fabric texture & drape',
    position: 1,
  },
  {
    id: 'img-aira-3',
    product_id: 'prod-aira-003',
    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=900&q=85&auto=format&fit=crop',
    storage_path: null,
    alt_text: 'Aira — Summer lookbook',
    position: 2,
  },

  // Elara (Charcoal)
  {
    id: 'img-elara-1',
    product_id: 'prod-elara-004',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85&auto=format&fit=crop',
    storage_path: null,
    alt_text: 'Elara — Architectural Charcoal Formal',
    position: 0,
  },
  {
    id: 'img-elara-2',
    product_id: 'prod-elara-004',
    url: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=900&q=85&auto=format&fit=crop',
    storage_path: null,
    alt_text: 'Elara — Minimalist finishings',
    position: 1,
  },

  // Zoya (Emerald)
  {
    id: 'img-zoya-1',
    product_id: 'prod-zoya-005',
    url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=85&auto=format&fit=crop',
    storage_path: null,
    alt_text: 'Zoya — Emerald Festive Raw Silk',
    position: 0,
  },
  {
    id: 'img-zoya-2',
    product_id: 'prod-zoya-005',
    url: 'https://images.unsplash.com/photo-1583391733981-8b530eaef1c1?w=900&q=85&auto=format&fit=crop',
    storage_path: null,
    alt_text: 'Zoya — Handcrafted details',
    position: 1,
  },

  // Inaya (Blush)
  {
    id: 'img-inaya-1',
    product_id: 'prod-inaya-006',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85&auto=format&fit=crop',
    storage_path: null,
    alt_text: 'Inaya — Terracotta Blush Coordinates',
    position: 0,
  },
  {
    id: 'img-inaya-2',
    product_id: 'prod-inaya-006',
    url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=85&auto=format&fit=crop',
    storage_path: null,
    alt_text: 'Inaya — Relaxed modest fit',
    position: 1,
  },
];

// ── Default S / M / L / XL Variants per Section 6 & 17 ──
export const seedVariants: ProductVariant[] = [
  // Noor
  { id: 'var-noor-s', product_id: 'prod-noor-001', size: 'S', stock_quantity: 8, sku: 'SAN-NOOR-S' },
  { id: 'var-noor-m', product_id: 'prod-noor-001', size: 'M', stock_quantity: 10, sku: 'SAN-NOOR-M' },
  { id: 'var-noor-l', product_id: 'prod-noor-001', size: 'L', stock_quantity: 6, sku: 'SAN-NOOR-L' },
  { id: 'var-noor-xl', product_id: 'prod-noor-001', size: 'XL', stock_quantity: 4, sku: 'SAN-NOOR-XL' },

  // Mehr
  { id: 'var-mehr-s', product_id: 'prod-mehr-002', size: 'S', stock_quantity: 5, sku: 'SAN-MEHR-S' },
  { id: 'var-mehr-m', product_id: 'prod-mehr-002', size: 'M', stock_quantity: 7, sku: 'SAN-MEHR-M' },
  { id: 'var-mehr-l', product_id: 'prod-mehr-002', size: 'L', stock_quantity: 4, sku: 'SAN-MEHR-L' },
  { id: 'var-mehr-xl', product_id: 'prod-mehr-002', size: 'XL', stock_quantity: 2, sku: 'SAN-MEHR-XL' },

  // Aira
  { id: 'var-aira-s', product_id: 'prod-aira-003', size: 'S', stock_quantity: 6, sku: 'SAN-AIRA-S' },
  { id: 'var-aira-m', product_id: 'prod-aira-003', size: 'M', stock_quantity: 8, sku: 'SAN-AIRA-M' },
  { id: 'var-aira-l', product_id: 'prod-aira-003', size: 'L', stock_quantity: 5, sku: 'SAN-AIRA-L' },
  { id: 'var-aira-xl', product_id: 'prod-aira-003', size: 'XL', stock_quantity: 3, sku: 'SAN-AIRA-XL' },

  // Elara
  { id: 'var-elara-s', product_id: 'prod-elara-004', size: 'S', stock_quantity: 4, sku: 'SAN-ELARA-S' },
  { id: 'var-elara-m', product_id: 'prod-elara-004', size: 'M', stock_quantity: 6, sku: 'SAN-ELARA-M' },
  { id: 'var-elara-l', product_id: 'prod-elara-004', size: 'L', stock_quantity: 3, sku: 'SAN-ELARA-L' },
  { id: 'var-elara-xl', product_id: 'prod-elara-004', size: 'XL', stock_quantity: 2, sku: 'SAN-ELARA-XL' },

  // Zoya
  { id: 'var-zoya-s', product_id: 'prod-zoya-005', size: 'S', stock_quantity: 5, sku: 'SAN-ZOYA-S' },
  { id: 'var-zoya-m', product_id: 'prod-zoya-005', size: 'M', stock_quantity: 5, sku: 'SAN-ZOYA-M' },
  { id: 'var-zoya-l', product_id: 'prod-zoya-005', size: 'L', stock_quantity: 4, sku: 'SAN-ZOYA-L' },
  { id: 'var-zoya-xl', product_id: 'prod-zoya-005', size: 'XL', stock_quantity: 3, sku: 'SAN-ZOYA-XL' },

  // Inaya
  { id: 'var-inaya-s', product_id: 'prod-inaya-006', size: 'S', stock_quantity: 7, sku: 'SAN-INAYA-S' },
  { id: 'var-inaya-m', product_id: 'prod-inaya-006', size: 'M', stock_quantity: 9, sku: 'SAN-INAYA-M' },
  { id: 'var-inaya-l', product_id: 'prod-inaya-006', size: 'L', stock_quantity: 4, sku: 'SAN-INAYA-L' },
  { id: 'var-inaya-xl', product_id: 'prod-inaya-006', size: 'XL', stock_quantity: 2, sku: 'SAN-INAYA-XL' },
];

// ── Customer Orders (Empty by default — real orders created at checkout) ──
export const seedOrders: Order[] = [];
export const seedOrderItems: OrderItem[] = [];
