-- =====================================================
-- STEP 7: Customer-Specific RLS Policies
-- =====================================================
-- Customers can only access their own data

-- Note: This assumes you have orders, products, and other tables
-- Adjust table names and policies based on your actual schema

-- Example: Orders table RLS (create table if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  seller_id UUID REFERENCES public.profiles(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Customers can view their own orders
CREATE POLICY "Customers can view own orders"
  ON public.orders
  FOR SELECT
  USING (
    customer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'customer'
    )
  );

-- Policy: Customers can create their own orders
CREATE POLICY "Customers can create orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (
    customer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'customer'
    )
  );

-- Policy: Customers can update their own pending orders
CREATE POLICY "Customers can update own pending orders"
  ON public.orders
  FOR UPDATE
  USING (
    customer_id = auth.uid() AND
    status = 'pending' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'customer'
    )
  )
  WITH CHECK (
    customer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'customer'
    )
  );

-- Policy: Sellers can view orders for their products
CREATE POLICY "Sellers can view their orders"
  ON public.orders
  FOR SELECT
  USING (
    seller_id = auth.uid() AND
    is_approved_seller()
  );

-- Policy: Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON public.orders
  FOR SELECT
  USING (is_admin());

-- Policy: Admins can update all orders
CREATE POLICY "Admins can update all orders"
  ON public.orders
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- =====================================================
-- Products Table RLS (if you have a products table)
-- =====================================================

-- Note: Adjust this based on your actual products structure
-- This is a placeholder for demonstration

-- Policy: Everyone can view approved products
-- CREATE POLICY "Anyone can view products"
--   ON public.products
--   FOR SELECT
--   USING (true);

-- Policy: Only sellers can create products
-- CREATE POLICY "Sellers can create products"
--   ON public.products
--   FOR INSERT
--   WITH CHECK (
--     seller_id = auth.uid() AND
--     is_approved_seller()
--   );

-- Policy: Sellers can update their own products
-- CREATE POLICY "Sellers can update own products"
--   ON public.products
--   FOR UPDATE
--   USING (
--     seller_id = auth.uid() AND
--     is_approved_seller()
--   )
--   WITH CHECK (
--     seller_id = auth.uid() AND
--     is_approved_seller()
--   );

-- =====================================================
-- Customer Data Protection
-- =====================================================

-- Ensure customers cannot:
-- 1. View other customers' data
-- 2. Modify seller or admin data
-- 3. Escalate their own role
-- 4. Access seller-only or admin-only features

-- All of these are enforced by the RLS policies above
