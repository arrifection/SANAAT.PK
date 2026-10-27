-- ══════════════════════════════════════════════════════════════
-- SANAAT — PROMOTE ACCOUNT TO STORE ADMINISTRATOR
-- Run this in the Supabase SQL Editor after creating your user in Supabase Authentication.
-- ══════════════════════════════════════════════════════════════

-- 1. Promote user to admin role in public.profiles
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'arrifection@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 2. Verification query (Should return 1 row with role = 'admin')
SELECT id, email, role, created_at
FROM public.profiles
WHERE email = 'arrifection@gmail.com';
