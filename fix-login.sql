-- Run this in Supabase SQL Editor to fix login

-- Step 1: Enable pgcrypto extension (safe to run even if already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Step 2: Confirm email + set new password in one query
UPDATE auth.users
SET 
  encrypted_password = crypt('Ornamis@2024', gen_salt('bf', 10)),
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  updated_at = NOW()
WHERE email = 'sadafalisha0301@gmail.com';

-- Step 3: Verify it worked
SELECT email, email_confirmed_at, updated_at 
FROM auth.users 
WHERE email = 'sadafalisha0301@gmail.com';
