-- ══════════════════════════════════════════════════════════════
-- SANAAT — PROMOTE ACCOUNT TO STORE ADMINISTRATOR
-- Replace YOUR_EMAIL_HERE with your exact Supabase email address.
-- Example: WHERE email = 'sara@example.com'
-- ══════════════════════════════════════════════════════════════

INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'YOUR_EMAIL_HERE'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Run this check to verify the administrator role was granted:
SELECT id, email, role, created_at
FROM public.profiles
WHERE email = 'YOUR_EMAIL_HERE';
