// ──────────────────────────────────────────────
// SANAAT — Authentic Seed Data (Mirrors Supabase Production)
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

// ── 3 Core Categories ──
export const seedCategories: Category[] = [
  {
    "id": "cat-winter-formals",
    "name": "Winter Formals",
    "slug": "winter-formals",
    "description": "Rich textures and refined handcraft tailored for winter evenings.",
    "image_url": "/images/collections/winter-formals-cover.jpg",
    "display_order": 1,
    "is_active": true,
    "created_at": "2026-10-27T14:56:27.016Z"
  },
  {
    "id": "cat-summer-edit",
    "name": "Summer Edit",
    "slug": "summer-edit",
    "description": "Airy pure cotton lawns and organza pairings designed for graceful summer modesty.",
    "image_url": "/images/collections/summer-edit-cover.jpg",
    "display_order": 2,
    "is_active": true,
    "created_at": "2026-10-27T14:56:27.016Z"
  },
  {
    "id": "cat-occasion-wear",
    "name": "Occasion Wear",
    "slug": "occasion-wear",
    "description": "Heirloom-inspired festive formals featuring delicate resham and tilla handcraft.",
    "image_url": "/images/collections/occasion-wear.jpg",
    "display_order": 3,
    "is_active": true,
    "created_at": "2026-10-27T14:56:27.016Z"
  }
];

// ── 3 Authentic Published Dresses (Mehr, Elara, Noor) ──
export const seedProducts: Product[] = [
  {
    "id": "a0ce180b-d857-4f8b-b5ad-f3d2485b6b49",
    "name": "Mehr",
    "slug": "mehr",
    "description": "Understated elegance for the modern woman. Cut in pure breathable handloom fabric in White and Blue, featuring minimalist finishings and a relaxed modest drape. An indispensable staple for considered wardrobes.",
    "price": 4500,
    "compare_at_price": null,
    "category_id": "cat-winter-formals",
    "status": "active",
    "is_published": true,
    "is_featured": true,
    "is_preorder": true,
    "preorder_closes_at": null,
    "estimated_dispatch_date": null,
    "preorder_limit": 30,
    "tags": [
      "White and Blue",
      "Pre-Order"
    ],
    "fabric": "Khaddar",
    "care_instructions": "Dry clean recommended.",
    "details": "Graceful three-piece ensemble tailored with artisanal finishings.",
    "display_order": 0,
    "low_stock_threshold": 3,
    "created_at": "2026-10-27T14:49:52.150Z",
    "updated_at": "2026-10-27T14:55:03.462Z",
    "color": "White and Blue",
    "fabric_care": "Dry Clean",
    "product_type": "Set"
  },
  {
    "id": "4df317f1-3ff1-4201-8a80-8ce932bddfe8",
    "name": "Elara",
    "slug": "elara",
    "description": "Understated elegance for the modern woman. Cut in pure breathable handloom fabric in Blush, featuring minimalist finishings and a relaxed modest drape. An indispensable staple for considered wardrobes.",
    "price": 4000,
    "compare_at_price": null,
    "category_id": "cat-winter-formals",
    "status": "active",
    "is_published": true,
    "is_featured": true,
    "is_preorder": true,
    "preorder_closes_at": null,
    "estimated_dispatch_date": null,
    "preorder_limit": 30,
    "tags": [
      "Blush",
      "Pre-Order"
    ],
    "fabric": "Khaddar",
    "care_instructions": "Dry clean recommended.",
    "details": "Graceful three-piece ensemble tailored with artisanal finishings.",
    "display_order": 0,
    "low_stock_threshold": 3,
    "created_at": "2026-10-27T11:18:42.085Z",
    "updated_at": "2026-10-27T14:55:05.060Z",
    "color": "Blush",
    "fabric_care": "Dry Clean",
    "product_type": "Set"
  },
  {
    "id": "48c5efe5-6596-4b15-ae31-45ef8fb78510",
    "name": "Noor",
    "slug": "noor",
    "description": "Designed with architectural restraint in white. This piece pairs clean silhouettes with purposeful artisan detailing along the borders for quiet sophistication.",
    "price": 3500,
    "compare_at_price": null,
    "category_id": "cat-winter-formals",
    "status": "active",
    "is_published": true,
    "is_featured": true,
    "is_preorder": true,
    "preorder_closes_at": null,
    "estimated_dispatch_date": null,
    "preorder_limit": 30,
    "tags": [
      "white",
      "Pre-Order"
    ],
    "fabric": "Khaddar",
    "care_instructions": "Dry clean recommended.",
    "details": "Graceful three-piece ensemble tailored with artisanal finishings.",
    "display_order": 0,
    "low_stock_threshold": 3,
    "created_at": "2026-10-27T11:14:31.605Z",
    "updated_at": "2026-10-27T14:55:10.838Z",
    "color": "White",
    "fabric_care": "Dry Clean",
    "product_type": "Set"
  }
];

// ── Product Images (Persistent High-Resolution Assets) ──
export const seedImages: ProductImage[] = [
  {
    "id": "cbc34c90-15cf-4142-b5eb-1ffdecac4e05",
    "product_id": "48c5efe5-6596-4b15-ae31-45ef8fb78510",
    "url": "/images/products/noor-1.jpg",
    "storage_path": "images/products/noor-1.jpg",
    "alt_text": "Noor — view 1",
    "position": 0
  },
  {
    "id": "27865e47-4296-4b8c-824f-e7e6f6f2aa03",
    "product_id": "48c5efe5-6596-4b15-ae31-45ef8fb78510",
    "url": "/images/products/noor-2.jpg",
    "storage_path": "images/products/noor-2.jpg",
    "alt_text": "Noor — view 2",
    "position": 1
  },
  {
    "id": "68c96138-ea75-43b8-838d-6443b7a0343b",
    "product_id": "48c5efe5-6596-4b15-ae31-45ef8fb78510",
    "url": "/images/products/noor-3.jpg",
    "storage_path": "images/products/noor-3.jpg",
    "alt_text": "Noor — view 3",
    "position": 2
  },
  {
    "id": "fabe7032-ac59-40c0-88cb-de6fefc80087",
    "product_id": "4df317f1-3ff1-4201-8a80-8ce932bddfe8",
    "url": "/images/products/elara-1.jpg",
    "storage_path": "images/products/elara-1.jpg",
    "alt_text": "Elara — view 1",
    "position": 0
  },
  {
    "id": "603a3562-f071-44d2-8d0c-18ee38b19aa1",
    "product_id": "4df317f1-3ff1-4201-8a80-8ce932bddfe8",
    "url": "/images/products/elara-2.jpg",
    "storage_path": "images/products/elara-2.jpg",
    "alt_text": "Elara — view 2",
    "position": 1
  },
  {
    "id": "f2f23af6-1558-4127-9abc-479ff8f1e06e",
    "product_id": "4df317f1-3ff1-4201-8a80-8ce932bddfe8",
    "url": "/images/products/elara-3.jpg",
    "storage_path": "images/products/elara-3.jpg",
    "alt_text": "Elara — view 3",
    "position": 2
  },
  {
    "id": "f1068e8e-f469-46c2-b3ad-29cb1d32b65d",
    "product_id": "a0ce180b-d857-4f8b-b5ad-f3d2485b6b49",
    "url": "/images/products/mehr-1.jpg",
    "storage_path": "images/products/mehr-1.jpg",
    "alt_text": "Mehr — view 1",
    "position": 0
  },
  {
    "id": "85d6f9c3-ac31-49bc-8c5e-79627b9f34b7",
    "product_id": "a0ce180b-d857-4f8b-b5ad-f3d2485b6b49",
    "url": "/images/products/mehr-2.jpg",
    "storage_path": "images/products/mehr-2.jpg",
    "alt_text": "Mehr — view 2",
    "position": 1
  },
  {
    "id": "d0cc53c6-e568-4771-b007-42e4c0cecbe6",
    "product_id": "a0ce180b-d857-4f8b-b5ad-f3d2485b6b49",
    "url": "/images/products/mehr-3.jpg",
    "storage_path": "images/products/mehr-3.jpg",
    "alt_text": "Mehr — view 3",
    "position": 2
  }
];

// ── Size Variants (S, M, L, XL with 5 Stock Each) ──
export const seedVariants: ProductVariant[] = [
  {
    "id": "f619dff0-9777-46d4-80e9-ba3f79ec346b",
    "product_id": "48c5efe5-6596-4b15-ae31-45ef8fb78510",
    "size": "S",
    "stock_quantity": 5,
    "sku": "SAN-NOOR-S"
  },
  {
    "id": "cdb01b67-c4e7-4419-8da0-c64fcb54f575",
    "product_id": "48c5efe5-6596-4b15-ae31-45ef8fb78510",
    "size": "M",
    "stock_quantity": 5,
    "sku": "SAN-NOOR-M"
  },
  {
    "id": "9ebbeb4a-3e14-401b-866e-ff38d61b8272",
    "product_id": "48c5efe5-6596-4b15-ae31-45ef8fb78510",
    "size": "L",
    "stock_quantity": 5,
    "sku": "SAN-NOOR-L"
  },
  {
    "id": "de688b87-838d-4f7c-b186-451370c9ec57",
    "product_id": "48c5efe5-6596-4b15-ae31-45ef8fb78510",
    "size": "XL",
    "stock_quantity": 5,
    "sku": "SAN-NOOR-XL"
  },
  {
    "id": "da24f0f0-4074-4f20-8068-0f458607e3c4",
    "product_id": "4df317f1-3ff1-4201-8a80-8ce932bddfe8",
    "size": "S",
    "stock_quantity": 5,
    "sku": "SAN-ELARA-S"
  },
  {
    "id": "06237d33-13bd-4029-9154-2cbdcc0a1a40",
    "product_id": "4df317f1-3ff1-4201-8a80-8ce932bddfe8",
    "size": "M",
    "stock_quantity": 5,
    "sku": "SAN-ELARA-M"
  },
  {
    "id": "cac6f6a6-52e3-43c5-9336-ac67c67c0d5f",
    "product_id": "4df317f1-3ff1-4201-8a80-8ce932bddfe8",
    "size": "L",
    "stock_quantity": 5,
    "sku": "SAN-ELARA-L"
  },
  {
    "id": "eaa71a22-a98a-4e50-a745-d831001a4203",
    "product_id": "4df317f1-3ff1-4201-8a80-8ce932bddfe8",
    "size": "XL",
    "stock_quantity": 5,
    "sku": "SAN-ELARA-XL"
  },
  {
    "id": "79ae7ae6-94bd-43eb-b347-4fa0aaaf7efd",
    "product_id": "a0ce180b-d857-4f8b-b5ad-f3d2485b6b49",
    "size": "S",
    "stock_quantity": 5,
    "sku": "SAN-MEHR-S"
  },
  {
    "id": "16980135-2e65-4e5f-8218-cb3e022cf1c3",
    "product_id": "a0ce180b-d857-4f8b-b5ad-f3d2485b6b49",
    "size": "M",
    "stock_quantity": 5,
    "sku": "SAN-MEHR-M"
  },
  {
    "id": "9836fc41-7204-46ed-8bd5-ef5a6daada5a",
    "product_id": "a0ce180b-d857-4f8b-b5ad-f3d2485b6b49",
    "size": "L",
    "stock_quantity": 5,
    "sku": "SAN-MEHR-L"
  },
  {
    "id": "794ccd1f-13bb-47ad-9168-ce7eb2c71f2d",
    "product_id": "a0ce180b-d857-4f8b-b5ad-f3d2485b6b49",
    "size": "XL",
    "stock_quantity": 5,
    "sku": "SAN-MEHR-XL"
  }
];

// ── Seed Orders (Empty in Production) ──
export const seedOrders: Order[] = [];
export const seedOrderItems: OrderItem[] = [];
