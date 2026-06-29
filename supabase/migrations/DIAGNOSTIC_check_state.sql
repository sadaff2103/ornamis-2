-- =====================================================
-- DIAGNOSTIC: Check Database State
-- =====================================================

-- 1. Check if profiles table exists and has correct structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Check all users and their profiles
SELECT 
    au.id,
    au.email,
    au.email_confirmed_at,
    p.id as profile_id,
    p.role,
    p.seller_status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC;

-- 3. Check RLS policies on profiles
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- 4. Check if helper functions exist
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('is_admin', 'is_approved_seller', 'get_user_role')
ORDER BY routine_name;

-- 5. Try to manually query a specific user's profile
-- Replace with the actual user ID from the error
SELECT * FROM public.profiles 
WHERE id = '04eb16fa-d009-4e0a-9d91-5dde1b5fcbc4';
