-- =====================================================
-- STEP 2: Profiles Table + Seller Approval
-- =====================================================
-- This migration creates the profiles table with role management
-- and seller approval workflow
-- IDEMPOTENT VERSION: Safe to run multiple times

-- Create enum types (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('customer', 'seller', 'admin');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'seller_status') THEN
        CREATE TYPE seller_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
END $$;

-- Create profiles table (drop if exists for clean slate)
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'customer',
    seller_status seller_status DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_seller_status CHECK (
        (role = 'seller' AND seller_status IS NOT NULL) OR
        (role != 'seller' AND seller_status IS NULL)
    ),
    CONSTRAINT no_self_admin CHECK (
        role != 'admin' OR id IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    )
);

-- Create indexes for performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_seller_status ON public.profiles(seller_status) WHERE seller_status IS NOT NULL;
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

COMMENT ON TABLE public.profiles IS 'User profiles with role-based access control';
COMMENT ON COLUMN public.profiles.role IS 'User role: customer, seller, or admin';
COMMENT ON COLUMN public.profiles.seller_status IS 'Seller approval status (only for sellers)';
