-- =====================================================
-- FIX: Allow users to sign up and auto-create profiles
-- Run this in Supabase SQL Editor ONE TIME
-- =====================================================

-- STEP 1: Drop ALL existing policies on profiles (clean slate)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.profiles';
    END LOOP;
END $$;

-- STEP 2: Re-create the auto-profile trigger (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, seller_status)
  VALUES (
    NEW.id,
    NEW.email,
    'customer',
    NULL
  )
  ON CONFLICT (id) DO NOTHING; -- safe to re-run
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and re-create trigger to ensure it's active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- STEP 3: Re-create seller profile function
CREATE OR REPLACE FUNCTION public.create_seller_profile(user_id UUID, user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET 
    role = 'seller',
    seller_status = 'pending',
    updated_at = NOW()
  WHERE id = user_id;
  
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, email, role, seller_status)
    VALUES (user_id, user_email, 'seller', 'pending');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 4: Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- STEP 5: Recreate clean, working policies

-- Service role can do everything (for triggers & admin operations)
CREATE POLICY "service_role_full_access"
ON public.profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Authenticated users can read their own profile
CREATE POLICY "users_read_own_profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Authenticated users can update their own profile
CREATE POLICY "users_update_own_profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  -- Prevent users from changing their own role
  role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

-- Admins can read ALL profiles
CREATE POLICY "admins_read_all_profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admins can update ALL profiles (for approving sellers, etc.)
CREATE POLICY "admins_update_all_profiles"
ON public.profiles FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admins can delete profiles
CREATE POLICY "admins_delete_profiles"
ON public.profiles FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- STEP 6: Verify everything is set up correctly
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- STEP 7: Show all current users
SELECT id, email, role, seller_status, created_at FROM public.profiles ORDER BY created_at DESC;
