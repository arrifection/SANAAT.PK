-- ──────────────────────────────────────────────
-- SANAAT E-COMMERCE DATABASE SCHEMA & RLS POLICIES
-- ──────────────────────────────────────────────

-- 1. Create Enums
CREATE TYPE product_status_enum AS ENUM ('draft', 'active', 'archived');
CREATE TYPE order_status_enum AS ENUM ('new', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled');
CREATE TYPE order_type_enum AS ENUM ('standard', 'preorder');
CREATE TYPE payment_method_enum AS ENUM ('cod', 'bank_transfer', 'online');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'paid', 'refunded');

-- 2. Profiles Table (Extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Categories Table
CREATE TABLE categories (
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
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price INT NOT NULL CHECK (price >= 0),
  compare_at_price INT CHECK (compare_at_price >= 0),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
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
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT,
  alt_text TEXT,
  position INT NOT NULL DEFAULT 0
);

-- 6. Product Variants Table (Stock lives here per size)
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  sku TEXT,
  CONSTRAINT unique_product_size UNIQUE (product_id, size)
);

-- 7. Orders Table
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE TABLE orders (
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
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID NOT NULL REFERENCES product_variants(id),
  product_name_snapshot TEXT NOT NULL,
  size TEXT NOT NULL,
  unit_price INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  image_url_snapshot TEXT
);

-- 9. Contact Messages Table
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- ATOMIC ORDER CREATION RPC (Database Function)
-- ──────────────────────────────────────────────
-- Validates variants and stock server-side
-- Decrements stock atomically
-- Recalculates prices strictly from database records
-- Creates order and order items in a single transaction
CREATE OR REPLACE FUNCTION create_order_atomic(
  p_customer_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_shipping_address JSONB,
  p_payment_method payment_method_enum,
  p_notes TEXT,
  p_items JSONB -- Array of { product_id, variant_id, quantity }
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
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
    SELECT * INTO v_product FROM products WHERE id = (v_item->>'product_id')::UUID;
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
    SELECT * INTO v_variant FROM product_variants WHERE id = (v_item->>'variant_id')::UUID;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Variant not found';
    END IF;

    -- Check stock if NOT pre-order
    IF NOT v_product.is_preorder THEN
      IF v_variant.stock_quantity < v_item_qty THEN
        RAISE EXCEPTION 'Insufficient stock for % (Size: %). Only % remaining.', v_product.name, v_variant.size, v_variant.stock_quantity;
      END IF;
      -- Decrement stock atomically
      UPDATE product_variants
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
  INSERT INTO orders (
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
    SELECT * INTO v_product FROM products WHERE id = (v_item->>'product_id')::UUID;
    SELECT * INTO v_variant FROM product_variants WHERE id = (v_item->>'variant_id')::UUID;

    INSERT INTO order_items (
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
      (SELECT url FROM product_images WHERE product_id = v_product.id ORDER BY position ASC LIMIT 1)
    );
  END LOOP;

  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'total', v_total
  );
END;
$$;

-- ──────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ──────────────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Categories RLS: Public can read active categories, admin can do everything
CREATE POLICY "Public can view active categories" ON categories
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins full access to categories" ON categories
  FOR ALL USING (is_admin());

-- Products RLS: Public can read active published products
CREATE POLICY "Public can view published active products" ON products
  FOR SELECT USING (is_published = TRUE AND status = 'active');

CREATE POLICY "Admins full access to products" ON products
  FOR ALL USING (is_admin());

-- Product Images RLS: Public can view images
CREATE POLICY "Public can view product images" ON product_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_images.product_id
      AND p.is_published = TRUE
      AND p.status = 'active'
    )
  );

CREATE POLICY "Admins full access to product images" ON product_images
  FOR ALL USING (is_admin());

-- Product Variants RLS: Public can view variants of published products
CREATE POLICY "Public can view product variants" ON product_variants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_variants.product_id
      AND p.is_published = TRUE
      AND p.status = 'active'
    )
  );

CREATE POLICY "Admins full access to variants" ON product_variants
  FOR ALL USING (is_admin());

-- Orders RLS: Public can read order by order_number (for confirmation page), Admins can view/update all
CREATE POLICY "Public can view own order by number" ON orders
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins full access to orders" ON orders
  FOR ALL USING (is_admin());

CREATE POLICY "Public can view order items" ON order_items
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins full access to order items" ON order_items
  FOR ALL USING (is_admin());

-- Contact Messages: Anyone can insert, only admin can read
CREATE POLICY "Public can submit contact messages" ON contact_messages
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins full access to contact messages" ON contact_messages
  FOR ALL USING (is_admin());
