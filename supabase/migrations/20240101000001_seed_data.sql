-- ──────────────────────────────────────────────
-- SANAAT SEED DATA (Categories & Demo Products)
-- ──────────────────────────────────────────────

-- 1. Insert Categories
INSERT INTO categories (id, name, slug, description, image_url, display_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Lawn Formals', 'lawn-formals', 'Pure cotton lawn tailored with intricate artisanal resham and thread work.', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80', 1, TRUE),
  ('c1000000-0000-0000-0000-000000000002', 'Silk & Chiffon', 'silk-chiffon', 'Luxurious pure silk shirts paired with lightweight embroidered chiffon dupattas.', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80', 2, TRUE),
  ('c1000000-0000-0000-0000-000000000003', 'Handloom Khaddar', 'handloom-khaddar', 'Coarse hand-spun winter khaddar crafted by ateliers across South Punjab.', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', 3, TRUE),
  ('c1000000-0000-0000-0000-000000000004', 'Everyday Solids', 'everyday-solids', 'Understated monochromatic matching separates for refined daily modesty.', 'https://images.unsplash.com/photo-1583391733981-8b530eaef1c1?w=800&q=80', 4, TRUE)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- 2. Insert Products (using valid hex UUIDs)
INSERT INTO products (
  id, name, slug, description, price, compare_at_price, category_id,
  status, is_published, is_featured, is_preorder, preorder_closes_at,
  estimated_dispatch_date, preorder_limit, tags, fabric, care_instructions,
  details, display_order, low_stock_threshold
) VALUES
  (
    'd1000000-0000-0000-0000-000000000001',
    'Zahra Embroidered Lawn Ensemble',
    'zahra-embroidered-lawn-ensemble',
    'A masterpiece of subdued luxury. Features tonal ivory embroidery along the neckline and cuffs with a diaphanous organza border.',
    14500, 16500, 'c1000000-0000-0000-0000-000000000001',
    'active', TRUE, TRUE, FALSE, NULL, NULL, NULL,
    ARRAY['lawn', 'embroidered', 'summer', 'bestseller'],
    '100% Pima Cotton Lawn shirt with Cotton Net Dupatta',
    'Dry clean recommended. Iron on reverse side of embroidery.',
    'Includes 3 pieces: Stitched Shirt, Straight Trousers, and Dupatta',
    1, 3
  ),
  (
    'd1000000-0000-0000-0000-000000000002',
    'Noor Organza Silk Formal',
    'noor-organza-silk-formal',
    'Crafted from feather-light organza layered over pure raw silk slips. Detailed with hand-rendered tilla and seed pearl accents.',
    24000, NULL, 'c1000000-0000-0000-0000-000000000002',
    'active', TRUE, TRUE, TRUE,
    NOW() + INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '45 days',
    30,
    ARRAY['silk', 'formal', 'preorder', 'luxury'],
    'Pure Organza with 80g Raw Silk lining',
    'Strictly dry clean only. Store in a cotton garment bag.',
    'Pre-order reservation: hand-tailored upon order confirmation',
    2, 3
  ),
  (
    'd1000000-0000-0000-0000-000000000003',
    'Mehr Handloom Khaddar Kurti',
    'mehr-handloom-khaddar-kurti',
    'Woven on traditional wooden pit-looms in Kamalia. Breathable, structured drape with minimal stitch line detailing.',
    8500, NULL, 'c1000000-0000-0000-0000-000000000003',
    'active', TRUE, FALSE, FALSE, NULL, NULL, NULL,
    ARRAY['khaddar', 'handloom', 'casual'],
    '100% Handloom Cotton Khaddar',
    'Hand wash cold separately with mild detergent. Hang dry in shade.',
    'A-line silhouette with side slit pockets and mandarin collar',
    3, 3
  ),
  (
    'd1000000-0000-0000-0000-000000000004',
    'Layla Plum Monochrome Co-ord',
    'layla-plum-monochrome-co-ord',
    'In signature SANAAT deep plum. Pure linen-cotton tailored in a relaxed loose cut with subtle pleats.',
    9500, 11000, 'c1000000-0000-0000-0000-000000000004',
    'active', TRUE, TRUE, FALSE, NULL, NULL, NULL,
    ARRAY['co-ord', 'plum', 'signature', 'modest'],
    'Premium Linen Cotton Blend',
    'Machine wash delicate. Steam iron on medium heat.',
    '2-piece matching set: tunic shirt and tapered trousers',
    4, 3
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  category_id = EXCLUDED.category_id,
  status = EXCLUDED.status,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  is_preorder = EXCLUDED.is_preorder,
  preorder_closes_at = EXCLUDED.preorder_closes_at,
  estimated_dispatch_date = EXCLUDED.estimated_dispatch_date,
  preorder_limit = EXCLUDED.preorder_limit,
  tags = EXCLUDED.tags,
  fabric = EXCLUDED.fabric,
  care_instructions = EXCLUDED.care_instructions,
  details = EXCLUDED.details,
  display_order = EXCLUDED.display_order,
  low_stock_threshold = EXCLUDED.low_stock_threshold;

-- Clean existing demo images and re-insert
DELETE FROM product_images WHERE product_id IN (
  'd1000000-0000-0000-0000-000000000001',
  'd1000000-0000-0000-0000-000000000002',
  'd1000000-0000-0000-0000-000000000003',
  'd1000000-0000-0000-0000-000000000004'
);

-- 3. Insert Product Images
INSERT INTO product_images (product_id, url, position, alt_text) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80', 0, 'Zahra Ensemble Front'),
  ('d1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80', 1, 'Zahra Ensemble Detail'),
  ('d1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1597983073512-ce20e7781138?w=800&q=80', 0, 'Noor Silk Formal'),
  ('d1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', 0, 'Mehr Khaddar Kurti'),
  ('d1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1583391733981-8b530eaef1c1?w=800&q=80', 0, 'Layla Plum Co-ord');

-- 4. Insert Variants with Stock
INSERT INTO product_variants (product_id, size, stock_quantity, sku) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'XS', 5, 'SNT-ZAHRA-XS'),
  ('d1000000-0000-0000-0000-000000000001', 'S', 8, 'SNT-ZAHRA-S'),
  ('d1000000-0000-0000-0000-000000000001', 'M', 10, 'SNT-ZAHRA-M'),
  ('d1000000-0000-0000-0000-000000000001', 'L', 4, 'SNT-ZAHRA-L'),
  ('d1000000-0000-0000-0000-000000000002', 'S', 0, 'SNT-NOOR-S'), -- Pre-order, stock 0 but purchasable
  ('d1000000-0000-0000-0000-000000000002', 'M', 0, 'SNT-NOOR-M'),
  ('d1000000-0000-0000-0000-000000000003', 'S', 2, 'SNT-MEHR-S'), -- Low stock
  ('d1000000-0000-0000-0000-000000000003', 'M', 1, 'SNT-MEHR-M'),
  ('d1000000-0000-0000-0000-000000000004', 'XS', 6, 'SNT-LAYLA-XS'),
  ('d1000000-0000-0000-0000-000000000004', 'S', 7, 'SNT-LAYLA-S'),
  ('d1000000-0000-0000-0000-000000000004', 'M', 12, 'SNT-LAYLA-M'),
  ('d1000000-0000-0000-0000-000000000004', 'L', 5, 'SNT-LAYLA-L')
ON CONFLICT (product_id, size) DO UPDATE SET stock_quantity = EXCLUDED.stock_quantity;
