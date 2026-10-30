-- ─────────────────────────────────────────────────────────────
-- SANAAT Migration: Secure Admin Publishing, Grants & RLS
-- File: supabase/migrations/20261029000000_fix_admin_publishing_and_settings.sql
-- ─────────────────────────────────────────────────────────────
-- Description:
-- 1. Adds missing is_new_arrival column to products safely.
-- 2. Creates public.site_settings table with canonical id 'current'.
-- 3. Grants explicit table privileges to anon and authenticated roles.
-- 4. Hardens public.is_admin() helper with SET search_path = public.
-- 5. Enables RLS on public.profiles and allows users to read own profile.
-- 6. Implements strict, authenticated admin-only write policies for:
--    - public.products
--    - public.product_variants
--    - public.product_images
--    - public.categories
--    - public.site_settings
-- 7. Ensures arrifection@gmail.com is guaranteed admin role on both existing
--    or future profile rows without modifying other users' roles.
-- 8. Preserves all existing public product reads, image access, and order policies.
-- ─────────────────────────────────────────────────────────────

-- 1. Add is_new_arrival column to products if not exists
ALTER TABLE IF EXISTS public.products
  ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN NOT NULL DEFAULT false;

-- 2. Create site_settings table for homepage controls
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  announcement_text TEXT NOT NULL DEFAULT 'Free Delivery Across Pakistan on Orders Over PKR 10,000',
  announcement_visible BOOLEAN NOT NULL DEFAULT true,
  moving_ticker_text TEXT NOT NULL DEFAULT 'Pre-order Available ✦ Free Delivery Above Rs 10,000',
  moving_ticker_visible BOOLEAN NOT NULL DEFAULT true,
  hero_headline TEXT NOT NULL DEFAULT 'Winter Formals 2026',
  hero_title TEXT NOT NULL DEFAULT 'Timeless Modest Elegance',
  hero_subline TEXT NOT NULL DEFAULT 'Contemporary silhouettes woven with traditional Pakistani craftsmanship',
  hero_bg_image TEXT NOT NULL DEFAULT '/images/hero/sanaat-hero-campaign.webp',
  brand_quotes JSONB NOT NULL DEFAULT '["Simplicity is the ultimate sophistication.", "Grace woven into every thread.", "Understated luxury for the modern muse."]'::jsonb,
  about_heading TEXT NOT NULL DEFAULT 'About Sanaat',
  about_quote TEXT NOT NULL DEFAULT 'Each piece in our collection is an ode to understated luxury, designed for the woman who values modesty without compromising on poise.',
  about_description TEXT NOT NULL DEFAULT 'Sanaat is a luxury Pakistani modest wear brand celebrating the timeless beauty of eastern cuts, handcrafted textures, and refined minimalism.',
  about_visible BOOLEAN NOT NULL DEFAULT true,
  featured_visible BOOLEAN NOT NULL DEFAULT true,
  categories_visible BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed initial record with canonical ID 'current'
INSERT INTO public.site_settings (id)
VALUES ('current')
ON CONFLICT (id) DO NOTHING;

-- 3. Explicit Table Grants (Privilege Layer)
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Products
GRANT SELECT ON TABLE public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.products TO authenticated;

-- Product Variants
GRANT SELECT ON TABLE public.product_variants TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.product_variants TO authenticated;

-- Product Images
GRANT SELECT ON TABLE public.product_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.product_images TO authenticated;

-- Categories
GRANT SELECT ON TABLE public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.categories TO authenticated;

-- Site Settings
GRANT SELECT ON TABLE public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.site_settings TO authenticated;

-- Profiles
GRANT SELECT, UPDATE ON TABLE public.profiles TO authenticated;

-- Sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 4. Harden is_admin() Function
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

-- 5. Profiles RLS & Sync Trigger
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins full access to profiles" ON public.profiles;
CREATE POLICY "Admins full access to profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- User Sync Trigger (Ensures newly registered auth users receive a profile row)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE WHEN LOWER(NEW.email) = 'arrifection@gmail.com' THEN 'admin' ELSE 'user' END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = CASE WHEN LOWER(EXCLUDED.email) = 'arrifection@gmail.com' THEN 'admin' ELSE public.profiles.role END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill missing profile rows for existing auth users without altering other roles
INSERT INTO public.profiles (id, email, role)
SELECT
  id,
  email,
  CASE WHEN LOWER(email) = 'arrifection@gmail.com' THEN 'admin' ELSE 'user' END
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Explicitly ensure arrifection@gmail.com retains/receives admin role
UPDATE public.profiles
SET role = 'admin'
WHERE LOWER(email) = 'arrifection@gmail.com';

-- 6. Strict RLS for Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published active products" ON public.products;
CREATE POLICY "Public can view published active products"
  ON public.products
  FOR SELECT
  USING (is_published = TRUE AND status = 'active');

DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
CREATE POLICY "Admins can view all products"
  ON public.products
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins full access to products" ON public.products;
DROP POLICY IF EXISTS "Allow catalog writes" ON public.products;
CREATE POLICY "Admins full access to products"
  ON public.products
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 7. Strict RLS for Product Variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view product variants" ON public.product_variants;
CREATE POLICY "Public can view product variants"
  ON public.product_variants
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_variants.product_id
      AND p.is_published = TRUE
      AND p.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Admins full access to variants" ON public.product_variants;
DROP POLICY IF EXISTS "Allow variant writes" ON public.product_variants;
CREATE POLICY "Admins full access to variants"
  ON public.product_variants
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 8. Strict RLS for Product Images
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view product images" ON public.product_images;
CREATE POLICY "Public can view product images"
  ON public.product_images
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_images.product_id
      AND p.is_published = TRUE
      AND p.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Admins full access to product images" ON public.product_images;
DROP POLICY IF EXISTS "Allow image writes" ON public.product_images;
CREATE POLICY "Admins full access to product images"
  ON public.product_images
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 9. Strict RLS for Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories"
  ON public.categories
  FOR SELECT
  USING (is_active = TRUE);

DROP POLICY IF EXISTS "Admins full access to categories" ON public.categories;
DROP POLICY IF EXISTS "Allow category writes" ON public.categories;
CREATE POLICY "Admins full access to categories"
  ON public.categories
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 10. Strict RLS for Site Settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
  ON public.site_settings
  FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Admin write site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins full access to site settings" ON public.site_settings;
CREATE POLICY "Admins full access to site settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
