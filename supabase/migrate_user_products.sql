-- ══════════════════════════════════════════════════════════════
-- SANAAT — IDEMPOTENT PRODUCTION MIGRATION SCRIPT
-- Safely inserts/updates the 3 authentic published dresses,
-- images, variants, and collection categories into Supabase.
-- 
-- Run this in the Supabase SQL Editor:
-- Project: https://supabase.com/dashboard/project/gswzdmjfqcvxqksdypjb/sql
-- ══════════════════════════════════════════════════════════════

-- 1. Ensure SANAAT Categories Exist
INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_active)
VALUES
  (
    'c1000000-0000-0000-0000-000000000010',
    'Winter Formals',
    'winter-formals',
    'Rich textures and refined handcraft tailored for winter evenings.',
    '/images/collections/winter-formals-cover.jpg',
    1,
    TRUE
  ),
  (
    'c1000000-0000-0000-0000-000000000020',
    'Summer Edit',
    'summer-edit',
    'Airy pure cotton lawns and organza pairings designed for graceful summer modesty.',
    '/images/collections/summer-edit-cover.jpg',
    2,
    TRUE
  ),
  (
    'c1000000-0000-0000-0000-000000000030',
    'Occasion Wear',
    'occasion-wear',
    'Heirloom-inspired festive formals featuring delicate resham and tilla handcraft.',
    '/images/collections/occasion-wear.jpg',
    3,
    TRUE
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- 2. Insert / Update the 3 Authentic Published Dresses (Fabric: Khaddar)

-- Mehr (Rs. 4,500)
INSERT INTO public.products (
  id, name, slug, description, price, compare_at_price, category_id,
  status, is_published, is_featured, is_preorder, tags, fabric, care_instructions,
  details, display_order, low_stock_threshold
) VALUES (
  'a0ce180b-d857-4f8b-b5ad-f3d2485b6b49',
  'Mehr',
  'mehr',
  'Understated elegance for the modern woman. Cut in pure breathable handloom fabric in White and Blue, featuring intricate neckline handwork and refined finishings. Designed for graceful occasions with timeless presence.',
  4500,
  NULL,
  'c1000000-0000-0000-0000-000000000010',
  'active',
  TRUE,
  TRUE,
  FALSE,
  ARRAY['White and Blue', 'Pre-Order', 'Khaddar', 'Winter Formals'],
  'Khaddar',
  'Dry clean recommended.',
  'Graceful three-piece ensemble tailored with artisanal finishings.',
  1,
  3
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category_id = EXCLUDED.category_id,
  status = EXCLUDED.status,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  tags = EXCLUDED.tags,
  fabric = EXCLUDED.fabric,
  care_instructions = EXCLUDED.care_instructions,
  details = EXCLUDED.details,
  display_order = EXCLUDED.display_order,
  low_stock_threshold = EXCLUDED.low_stock_threshold;

-- Elara (Rs. 4,000)
INSERT INTO public.products (
  id, name, slug, description, price, compare_at_price, category_id,
  status, is_published, is_featured, is_preorder, tags, fabric, care_instructions,
  details, display_order, low_stock_threshold
) VALUES (
  '4df317f1-3ff1-4201-8a80-8ce932bddfe8',
  'Elara',
  'elara',
  'Understated elegance for the modern woman. Cut in pure breathable handloom fabric in Blush, featuring intricate neckline handwork and refined finishings. Designed for graceful occasions with timeless presence.',
  4000,
  NULL,
  'c1000000-0000-0000-0000-000000000010',
  'active',
  TRUE,
  TRUE,
  FALSE,
  ARRAY['Blush', 'Pre-Order', 'Khaddar', 'Winter Formals'],
  'Khaddar',
  'Dry clean recommended.',
  'Graceful three-piece ensemble tailored with artisanal finishings.',
  2,
  3
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category_id = EXCLUDED.category_id,
  status = EXCLUDED.status,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  tags = EXCLUDED.tags,
  fabric = EXCLUDED.fabric,
  care_instructions = EXCLUDED.care_instructions,
  details = EXCLUDED.details,
  display_order = EXCLUDED.display_order,
  low_stock_threshold = EXCLUDED.low_stock_threshold;

-- Noor (Rs. 3,500)
INSERT INTO public.products (
  id, name, slug, description, price, compare_at_price, category_id,
  status, is_published, is_featured, is_preorder, tags, fabric, care_instructions,
  details, display_order, low_stock_threshold
) VALUES (
  '48c5efe5-6596-4b15-ae31-45ef8fb78510',
  'Noor',
  'noor',
  'Understated elegance for the modern woman. Cut in pure breathable handloom fabric in white, featuring intricate neckline handwork and refined finishings. Designed for graceful occasions with timeless presence.',
  3500,
  NULL,
  'c1000000-0000-0000-0000-000000000010',
  'active',
  TRUE,
  TRUE,
  FALSE,
  ARRAY['white', 'Pre-Order', 'Khaddar', 'Winter Formals'],
  'Khaddar',
  'Dry clean recommended.',
  'Graceful three-piece ensemble tailored with artisanal finishings.',
  3,
  3
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category_id = EXCLUDED.category_id,
  status = EXCLUDED.status,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  tags = EXCLUDED.tags,
  fabric = EXCLUDED.fabric,
  care_instructions = EXCLUDED.care_instructions,
  details = EXCLUDED.details,
  display_order = EXCLUDED.display_order,
  low_stock_threshold = EXCLUDED.low_stock_threshold;

-- 3. Insert Product Images (3 images per dress with persistent paths)
INSERT INTO public.product_images (id, product_id, url, position)
VALUES
  ('cbc34c90-15cf-4142-b5eb-1ffdecac4e05', 'a0ce180b-d857-4f8b-b5ad-f3d2485b6b49', '/images/products/mehr-1.jpg', 0),
  ('9b7b9134-2e99-4d64-8fc7-60195d8523c1', 'a0ce180b-d857-4f8b-b5ad-f3d2485b6b49', '/images/products/mehr-2.jpg', 1),
  ('1e488ceb-6218-4b72-a720-337c7674d825', 'a0ce180b-d857-4f8b-b5ad-f3d2485b6b49', '/images/products/mehr-3.jpg', 2),
  ('1ce7ea9f-16b7-4e0e-8551-7f8e8b09d949', '4df317f1-3ff1-4201-8a80-8ce932bddfe8', '/images/products/elara-1.jpg', 0),
  ('863339ae-3c46-4cb1-80a5-2965306636aa', '4df317f1-3ff1-4201-8a80-8ce932bddfe8', '/images/products/elara-2.jpg', 1),
  ('33d83765-a1c1-4cb5-8d54-f5bb9ceba361', '4df317f1-3ff1-4201-8a80-8ce932bddfe8', '/images/products/elara-3.jpg', 2),
  ('12702581-c7ee-45df-bbca-5b871c89f417', '48c5efe5-6596-4b15-ae31-45ef8fb78510', '/images/products/noor-1.jpg', 0),
  ('a82d09bb-50ff-4e78-bc57-0a379133644f', '48c5efe5-6596-4b15-ae31-45ef8fb78510', '/images/products/noor-2.jpg', 1),
  ('8291f0eb-0294-4348-ba79-a7281f6d90fb', '48c5efe5-6596-4b15-ae31-45ef8fb78510', '/images/products/noor-3.jpg', 2)
ON CONFLICT (id) DO UPDATE SET
  url = EXCLUDED.url,
  position = EXCLUDED.position;

-- 4. Insert Size Variants (S, M, L, XL with 5 units each)
INSERT INTO public.product_variants (id, product_id, size, stock_quantity, sku)
VALUES
  ('619ff0e9-77a4-46d8-8e09-ba3f97ec34b7', '48c5efe5-6596-4b15-ae31-45ef8fb78510', 'S', 5, 'SAN-NOOR-S'),
  ('cdb016b4-c7e4-4149-8d0c-64fbc55f75e7', '48c5efe5-6596-4b15-ae31-45ef8fb78510', 'M', 5, 'SAN-NOOR-M'),
  ('df499611-3962-4217-ba50-10f769041b36', '48c5efe5-6596-4b15-ae31-45ef8fb78510', 'L', 5, 'SAN-NOOR-L'),
  ('a54d580f-9e58-45d4-be6a-f1001a4e21dc', '48c5efe5-6596-4b15-ae31-45ef8fb78510', 'XL', 5, 'SAN-NOOR-XL'),
  ('4ae21d74-c0e8-4665-8b77-3e1177694903', '4df317f1-3ff1-4201-8a80-8ce932bddfe8', 'S', 5, 'SAN-ELARA-S'),
  ('2cbff96d-3171-48e0-a436-7c98c199852c', '4df317f1-3ff1-4201-8a80-8ce932bddfe8', 'M', 5, 'SAN-ELARA-M'),
  ('cfdb2c45-2070-4354-9403-1250cf16e91f', '4df317f1-3ff1-4201-8a80-8ce932bddfe8', 'L', 5, 'SAN-ELARA-L'),
  ('073b6f00-349c-4aa3-8fa4-52d3a08c879a', '4df317f1-3ff1-4201-8a80-8ce932bddfe8', 'XL', 5, 'SAN-ELARA-XL'),
  ('09852c80-db4b-4a57-b08e-8a9d18b6fc25', 'a0ce180b-d857-4f8b-b5ad-f3d2485b6b49', 'S', 5, 'SAN-MEHR-S'),
  ('8080c98f-0a0d-4001-9be5-9276993175c5', 'a0ce180b-d857-4f8b-b5ad-f3d2485b6b49', 'M', 5, 'SAN-MEHR-M'),
  ('9c1c4f5b-6f0d-4ff5-ae52-c0cb4a7bfd3e', 'a0ce180b-d857-4f8b-b5ad-f3d2485b6b49', 'L', 5, 'SAN-MEHR-L'),
  ('044439c2-c6f3-470a-8bf7-5fe9c15b9c02', 'a0ce180b-d857-4f8b-b5ad-f3d2485b6b49', 'XL', 5, 'SAN-MEHR-XL')
ON CONFLICT (id) DO UPDATE SET
  stock_quantity = EXCLUDED.stock_quantity,
  sku = EXCLUDED.sku;

-- 5. Verification Query (Returns the 3 migrated products with their images and variants count)
SELECT
  p.name,
  p.slug,
  p.price,
  p.fabric,
  p.status,
  p.is_published,
  p.is_featured,
  COUNT(DISTINCT pi.id) AS image_count,
  COUNT(DISTINCT pv.id) AS variant_count
FROM public.products p
LEFT JOIN public.product_images pi ON pi.product_id = p.id
LEFT JOIN public.product_variants pv ON pv.product_id = p.id
WHERE p.id IN (
  'a0ce180b-d857-4f8b-b5ad-f3d2485b6b49',
  '4df317f1-3ff1-4201-8a80-8ce932bddfe8',
  '48c5efe5-6596-4b15-ae31-45ef8fb78510'
)
GROUP BY p.id;
