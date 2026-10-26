-- ══════════════════════════════════════════════════════════════
-- SANAAT E-COMMERCE PLATFORM — ALL-IN-ONE SETUP SCRIPT
-- Paste this entire file into the Supabase SQL Editor and run it.
-- ══════════════════════════════════════════════════════════════

-- 1. Create Enums (Idempotent)
DO $$ BEGIN
  CREATE TYPE product_status_enum AS ENUM ('draft', 'active', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status_enum AS ENUM ('new', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_type_enum AS ENUM ('standard', 'preorder');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_enum AS ENUM ('cod', 'bank_transfer', 'online');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_enum AS ENUM ('pending', 'paid', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price INT NOT NULL CHECK (price >= 0),
  compare_at_price INT CHECK (compare_at_price >= 0),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  status product_status_enum NOT NULL DEFAULT 'active',
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_preorder BOOLEAN NOT NULL DEFAULT FALSE,
  preorder_closes_at TIMESTAMPTZ,
  estimated_dispatch_date DATE,
  preorder_limit INT CHECK (preorder_limit >= 0),
  tags TEXT[] NOT NULL DEFAULT '{}',
  fabric TEXT,
  care_instructions TEXT,
  details TEXT,
  display_order INT NOT NULL DEFAULT 0,
  low_stock_threshold INT NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Product Images Table
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT,
  alt_text TEXT,
  position INT NOT NULL DEFAULT 0
);

-- 6. Product Variants Table (Stock per size)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  sku TEXT,
  CONSTRAINT unique_product_size UNIQUE (product_id, size)
);

-- 7. Orders Table & Sequence
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal INT NOT NULL,
  shipping_fee INT NOT NULL DEFAULT 0,
  total INT NOT NULL,
  order_type order_type_enum NOT NULL DEFAULT 'standard',
  status order_status_enum NOT NULL DEFAULT 'new',
  payment_method payment_method_enum NOT NULL DEFAULT 'cod',
  payment_status payment_status_enum NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  variant_id UUID NOT NULL REFERENCES public.product_variants(id),
  product_name_snapshot TEXT NOT NULL,
  size TEXT NOT NULL,
  unit_price INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  image_url_snapshot TEXT
);

-- 9. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Enable Row Level Security (Compatible with Automatic RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 11. Helper Function: is_admin()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 12. Row Level Security Policies
-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins full access to profiles" ON public.profiles;
CREATE POLICY "Admins full access to profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

-- Categories
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories" ON public.categories
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Admins full access to categories" ON public.categories;
CREATE POLICY "Admins full access to categories" ON public.categories
  FOR ALL USING (public.is_admin());

-- Products
DROP POLICY IF EXISTS "Public can view published active products" ON public.products;
CREATE POLICY "Public can view published active products" ON public.products
  FOR SELECT USING (is_published = TRUE AND status = 'active');

DROP POLICY IF EXISTS "Admins full access to products" ON public.products;
CREATE POLICY "Admins full access to products" ON public.products
  FOR ALL USING (public.is_admin());

-- Product Images
DROP POLICY IF EXISTS "Public can view product images" ON public.product_images;
CREATE POLICY "Public can view product images" ON public.product_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_images.product_id
      AND p.is_published = TRUE
      AND p.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Admins full access to product images" ON public.product_images;
CREATE POLICY "Admins full access to product images" ON public.product_images
  FOR ALL USING (public.is_admin());

-- Product Variants
DROP POLICY IF EXISTS "Public can view product variants" ON public.product_variants;
CREATE POLICY "Public can view product variants" ON public.product_variants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_variants.product_id
      AND p.is_published = TRUE
      AND p.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Admins full access to variants" ON public.product_variants;
CREATE POLICY "Admins full access to variants" ON public.product_variants
  FOR ALL USING (public.is_admin());

-- Orders & Order Items
DROP POLICY IF EXISTS "Public can view own order by number" ON public.orders;
CREATE POLICY "Public can view own order by number" ON public.orders
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Admins full access to orders" ON public.orders;
CREATE POLICY "Admins full access to orders" ON public.orders
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public can view order items" ON public.order_items;
CREATE POLICY "Public can view order items" ON public.order_items
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Admins full access to order items" ON public.order_items;
CREATE POLICY "Admins full access to order items" ON public.order_items
  FOR ALL USING (public.is_admin());

-- Contact Messages
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admins full access to contact messages" ON public.contact_messages;
CREATE POLICY "Admins full access to contact messages" ON public.contact_messages
  FOR ALL USING (public.is_admin());

-- 13. Atomic Order RPC Function
CREATE OR REPLACE FUNCTION public.create_order_atomic(
  p_customer_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_shipping_address JSONB,
  p_payment_method payment_method_enum,
  p_notes TEXT,
  p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id UUID;
  v_seq INT;
  v_order_number TEXT;
  v_subtotal INT := 0;
  v_shipping_fee INT := 250;
  v_free_shipping_threshold INT := 5000;
  v_total INT;
  v_order_type order_type_enum := 'standard';
  v_item JSONB;
  v_product RECORD;
  v_variant RECORD;
  v_item_price INT;
  v_item_qty INT;
BEGIN
  -- Generate human readable order number
  v_seq := nextval('order_number_seq');
  v_order_number := 'SNT-' || LPAD(v_seq::TEXT, 6, '0');

  -- Pre-flight validation & calculate totals
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_item_qty := (v_item->>'quantity')::INT;
    IF v_item_qty <= 0 THEN
      RAISE EXCEPTION 'Item quantity must be greater than zero';
    END IF;

    -- Fetch product
    SELECT * INTO v_product FROM public.products WHERE id = (v_item->>'product_id')::UUID;
    IF NOT FOUND OR NOT v_product.is_published OR v_product.status != 'active' THEN
      RAISE EXCEPTION 'Product % is not available for purchase', v_item->>'product_id';
    END IF;

    -- Check pre-order flag
    IF v_product.is_preorder THEN
      v_order_type := 'preorder';
      IF v_product.preorder_closes_at IS NOT NULL AND v_product.preorder_closes_at < NOW() THEN
        RAISE EXCEPTION 'Pre-order window for % has closed', v_product.name;
      END IF;
    END IF;

    -- Fetch variant
    SELECT * INTO v_variant FROM public.product_variants WHERE id = (v_item->>'variant_id')::UUID;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Variant not found';
    END IF;

    -- Check stock if NOT pre-order
    IF NOT v_product.is_preorder THEN
      IF v_variant.stock_quantity < v_item_qty THEN
        RAISE EXCEPTION 'Insufficient stock for % (Size: %). Only % remaining.', v_product.name, v_variant.size, v_variant.stock_quantity;
      END IF;
      -- Decrement stock atomically
      UPDATE public.product_variants
      SET stock_quantity = stock_quantity - v_item_qty
      WHERE id = v_variant.id;
    END IF;

    -- Add to subtotal using authentic server price
    v_subtotal := v_subtotal + (v_product.price * v_item_qty);
  END LOOP;

  -- Calculate shipping
  IF v_subtotal >= v_free_shipping_threshold THEN
    v_shipping_fee := 0;
  END IF;
  v_total := v_subtotal + v_shipping_fee;

  -- Insert Order
  INSERT INTO public.orders (
    order_number,
    customer_name,
    email,
    phone,
    shipping_address,
    subtotal,
    shipping_fee,
    total,
    order_type,
    status,
    payment_method,
    payment_status,
    notes
  ) VALUES (
    v_order_number,
    p_customer_name,
    p_email,
    p_phone,
    p_shipping_address,
    v_subtotal,
    v_shipping_fee,
    v_total,
    v_order_type,
    'new',
    p_payment_method,
    'pending',
    p_notes
  ) RETURNING id INTO v_order_id;

  -- Insert Order Items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_item_qty := (v_item->>'quantity')::INT;
    SELECT * INTO v_product FROM public.products WHERE id = (v_item->>'product_id')::UUID;
    SELECT * INTO v_variant FROM public.product_variants WHERE id = (v_item->>'variant_id')::UUID;

    INSERT INTO public.order_items (
      order_id,
      product_id,
      variant_id,
      product_name_snapshot,
      size,
      unit_price,
      quantity,
      image_url_snapshot
    ) VALUES (
      v_order_id,
      v_product.id,
      v_variant.id,
      v_product.name,
      v_variant.size,
      v_product.price,
      v_item_qty,
      (SELECT url FROM public.product_images WHERE product_id = v_product.id ORDER BY position ASC LIMIT 1)
    );
  END LOOP;

  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'total', v_total
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_order_atomic TO anon, authenticated, service_role;

-- 14. Storage Bucket: product-images (Public read, admin-only write)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Access to product-images" ON storage.objects;
CREATE POLICY "Public Access to product-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins can upload to product-images" ON storage.objects;
CREATE POLICY "Admins can upload to product-images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can update product-images" ON storage.objects;
CREATE POLICY "Admins can update product-images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' AND public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can delete product-images" ON storage.objects;
CREATE POLICY "Admins can delete product-images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND public.is_admin()
  );

-- ══════════════════════════════════════════════════════════════
-- SEED DATA (Categories, Demo Products & Variants)
-- ══════════════════════════════════════════════════════════════

INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_active)
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

INSERT INTO public.products (
  id, name, slug, description, price, compare_at_price, category_id,
  status, is_published, is_featured, is_preorder, preorder_closes_at,
  estimated_dispatch_date, preorder_limit, tags, fabric, care_instructions,
  details, display_order, low_stock_threshold
) VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
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
    'p1000000-0000-0000-0000-000000000002',
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
    'p1000000-0000-0000-0000-000000000003',
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
    'p1000000-0000-0000-0000-000000000004',
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
DELETE FROM public.product_images WHERE product_id IN (
  'p1000000-0000-0000-0000-000000000001',
  'p1000000-0000-0000-0000-000000000002',
  'p1000000-0000-0000-0000-000000000003',
  'p1000000-0000-0000-0000-000000000004'
);

INSERT INTO public.product_images (product_id, url, position, alt_text) VALUES
  ('p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80', 0, 'Zahra Ensemble Front'),
  ('p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80', 1, 'Zahra Ensemble Detail'),
  ('p1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1597983073512-ce20e7781138?w=800&q=80', 0, 'Noor Silk Formal'),
  ('p1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', 0, 'Mehr Khaddar Kurti'),
  ('p1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1583391733981-8b530eaef1c1?w=800&q=80', 0, 'Layla Plum Co-ord');

INSERT INTO public.product_variants (product_id, size, stock_quantity, sku) VALUES
  ('p1000000-0000-0000-0000-000000000001', 'XS', 5, 'SNT-ZAHRA-XS'),
  ('p1000000-0000-0000-0000-000000000001', 'S', 8, 'SNT-ZAHRA-S'),
  ('p1000000-0000-0000-0000-000000000001', 'M', 10, 'SNT-ZAHRA-M'),
  ('p1000000-0000-0000-0000-000000000001', 'L', 4, 'SNT-ZAHRA-L'),
  ('p1000000-0000-0000-0000-000000000002', 'S', 0, 'SNT-NOOR-S'),
  ('p1000000-0000-0000-0000-000000000002', 'M', 0, 'SNT-NOOR-M'),
  ('p1000000-0000-0000-0000-000000000003', 'S', 2, 'SNT-MEHR-S'),
  ('p1000000-0000-0000-0000-000000000003', 'M', 1, 'SNT-MEHR-M'),
  ('p1000000-0000-0000-0000-000000000004', 'XS', 6, 'SNT-LAYLA-XS'),
  ('p1000000-0000-0000-0000-000000000004', 'S', 7, 'SNT-LAYLA-S'),
  ('p1000000-0000-0000-0000-000000000004', 'M', 12, 'SNT-LAYLA-M'),
  ('p1000000-0000-0000-0000-000000000004', 'L', 5, 'SNT-LAYLA-L')
ON CONFLICT (product_id, size) DO UPDATE SET stock_quantity = EXCLUDED.stock_quantity;
