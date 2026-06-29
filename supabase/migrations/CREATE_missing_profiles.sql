-- =====================================================
-- CREATE MISSING PROFILES
-- =====================================================
-- This creates profiles for users who don't have them yet

-- First, check which users are missing profiles
SELECT 
    au.id,
    au.email,
    au.email_confirmed_at,
    p.id as profile_id
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- Create profiles for all users that don't have one
INSERT INTO public.profiles (id, email, role, seller_status)
SELECT 
    au.id,
    au.email,
    'customer'::user_role,
    NULL
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- Verify all users now have profiles
SELECT 
    au.email,
    au.email_confirmed_at,
    p.role,
    p.seller_status,
    p.created_at as profile_created
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC;
