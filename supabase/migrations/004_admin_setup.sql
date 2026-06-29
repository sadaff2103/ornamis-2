-- =====================================================
-- STEP 6: Admin User Creation (MANUAL EXECUTION ONLY)
-- =====================================================
-- This script should be run MANUALLY in Supabase SQL Editor
-- DO NOT include this in automatic migrations

-- ⚠️ IMPORTANT: Replace the placeholders below with actual values
-- Run this script in Supabase SQL Editor after creating an admin user in Supabase Auth

-- Step 1: Create admin user in Supabase Auth Dashboard first
-- Go to: Authentication > Users > Add User
-- Email: admin@ornamis.com (or your admin email)
-- Password: Set a strong password
-- Email Confirm: Check "Auto Confirm User"

-- Step 2: Get the user ID from auth.users
-- Run this query to find the user ID:
-- SELECT id, email FROM auth.users WHERE email = 'admin@ornamis.com';

-- Step 3: Update the profile to admin role
-- Replace 'USER_ID_HERE' with the actual UUID from Step 2

-- Example:
-- UPDATE public.profiles
-- SET 
--   role = 'admin',
--   seller_status = NULL,
--   updated_at = NOW()
-- WHERE id = 'USER_ID_HERE';

-- Template for creating admin (UNCOMMENT AND MODIFY):
/*
UPDATE public.profiles
SET 
  role = 'admin',
  seller_status = NULL,
  updated_at = NOW()
WHERE id = 'PASTE_ADMIN_USER_ID_HERE';
*/

-- Verify admin was created successfully:
-- SELECT id, email, role, created_at FROM public.profiles WHERE role = 'admin';

-- =====================================================
-- Helper function to create admin (alternative method)
-- =====================================================
-- This function can only be called by existing admins or via SQL Editor

CREATE OR REPLACE FUNCTION public.create_admin_user(
  admin_email TEXT,
  admin_password TEXT
)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- This function should only be callable by existing admins or via SQL Editor
  -- In production, this should be restricted further
  
  -- Create user in auth.users (requires service role key)
  -- This is a placeholder - actual implementation depends on your setup
  RAISE EXCEPTION 'Admin users must be created manually via Supabase Auth Dashboard';
  
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Security Notes
-- =====================================================
-- 1. NEVER expose admin creation endpoints to the public
-- 2. Always create admins manually via Supabase Dashboard + SQL Editor
-- 3. Use strong passwords and enable MFA for admin accounts
-- 4. Regularly audit admin access via role_audit_log table
-- 5. Consider IP whitelisting for admin access in production
