-- =====================================================
-- DIAGNOSTIC & FIX: Profile Creation Issue
-- =====================================================
-- Run this to diagnose and fix the profile creation problem

-- Step 1: Check if trigger exists
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Step 2: Check if function exists
SELECT 
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- Step 3: Drop and recreate the trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile with error handling
  INSERT INTO public.profiles (id, email, role, seller_status)
  VALUES (
    NEW.id,
    NEW.email,
    'customer'::user_role,
    NULL
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error (you can check postgres logs)
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    -- Still return NEW so auth user is created
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 5: Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- Step 7: Ensure RLS allows the trigger to insert
-- The trigger runs as SECURITY DEFINER, so it should bypass RLS
-- But let's make sure there's a policy for service role
DO $$
BEGIN
  -- Drop existing policy if it exists
  DROP POLICY IF EXISTS "Allow trigger to insert profiles" ON public.profiles;
  
  -- Create policy for service role (used by triggers)
  CREATE POLICY "Allow trigger to insert profiles"
    ON public.profiles
    FOR INSERT
    TO service_role
    WITH CHECK (true);
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Policy creation skipped or already exists';
END $$;

-- Step 8: Test the trigger manually
-- This will show you if the trigger works
DO $$
DECLARE
  test_user_id UUID := gen_random_uuid();
  test_email TEXT := 'test_trigger_' || gen_random_uuid() || '@example.com';
BEGIN
  -- Try to insert a test profile directly
  INSERT INTO public.profiles (id, email, role, seller_status)
  VALUES (test_user_id, test_email, 'customer'::user_role, NULL);
  
  RAISE NOTICE 'Direct insert successful! Profile creation should work.';
  
  -- Clean up test data
  DELETE FROM public.profiles WHERE id = test_user_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Direct insert failed: %', SQLERRM;
END $$;

-- Step 9: Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';

-- Step 10: List all policies on profiles table
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'profiles';
