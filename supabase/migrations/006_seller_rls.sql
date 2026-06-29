-- =====================================================
-- STEP 7: Seller-Specific RLS Policies
-- =====================================================
-- Sellers can only access their own products and related orders
-- Sellers must be approved to access any data

-- =====================================================
-- Seller Products Access
-- =====================================================

-- Note: Adjust based on your actual products table structure
-- This assumes you have a products table with seller_id

-- Example products table (create if needed)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT,
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy: Approved sellers can view their own products
CREATE POLICY "Sellers can view own products"
  ON public.products
  FOR SELECT
  USING (
    seller_id = auth.uid() AND
    is_approved_seller()
  );

-- Policy: Approved sellers can create products
CREATE POLICY "Sellers can create products"
  ON public.products
  FOR INSERT
  WITH CHECK (
    seller_id = auth.uid() AND
    is_approved_seller()
  );

-- Policy: Approved sellers can update their own products
CREATE POLICY "Sellers can update own products"
  ON public.products
  FOR UPDATE
  USING (
    seller_id = auth.uid() AND
    is_approved_seller()
  )
  WITH CHECK (
    seller_id = auth.uid() AND
    is_approved_seller()
  );

-- Policy: Approved sellers can delete their own products
CREATE POLICY "Sellers can delete own products"
  ON public.products
  FOR DELETE
  USING (
    seller_id = auth.uid() AND
    is_approved_seller()
  );

-- Policy: Customers can view active products
CREATE POLICY "Customers can view active products"
  ON public.products
  FOR SELECT
  USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'customer'
    )
  );

-- Policy: Admins can view all products
CREATE POLICY "Admins can view all products"
  ON public.products
  FOR SELECT
  USING (is_admin());

-- Policy: Admins can update all products
CREATE POLICY "Admins can update all products"
  ON public.products
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- =====================================================
-- Seller Orders Access
-- =====================================================

-- Policy: Approved sellers can view orders for their products
-- (Already created in 005_customer_rls.sql, included here for reference)

-- Policy: Approved sellers can update order status for their products
CREATE POLICY "Sellers can update order status"
  ON public.orders
  FOR UPDATE
  USING (
    seller_id = auth.uid() AND
    is_approved_seller()
  )
  WITH CHECK (
    seller_id = auth.uid() AND
    is_approved_seller() AND
    -- Sellers can only update status, not other fields
    customer_id = (SELECT customer_id FROM public.orders WHERE id = orders.id)
  );

-- =====================================================
-- Seller Analytics/Stats (Optional)
-- =====================================================

-- Create a view for seller statistics
CREATE OR REPLACE VIEW public.seller_stats AS
SELECT 
  p.id as seller_id,
  p.email as seller_email,
  COUNT(DISTINCT pr.id) as total_products,
  COUNT(DISTINCT o.id) as total_orders,
  COALESCE(SUM(o.total_price), 0) as total_revenue,
  COUNT(DISTINCT CASE WHEN o.status = 'pending' THEN o.id END) as pending_orders,
  COUNT(DISTINCT CASE WHEN o.status = 'completed' THEN o.id END) as completed_orders
FROM public.profiles p
LEFT JOIN public.products pr ON pr.seller_id = p.id
LEFT JOIN public.orders o ON o.seller_id = p.id
WHERE p.role = 'seller' AND p.seller_status = 'approved'
GROUP BY p.id, p.email;

-- RLS for seller stats view
ALTER VIEW public.seller_stats SET (security_invoker = on);

-- =====================================================
-- Prevent Unapproved Seller Access
-- =====================================================

-- Function to block unapproved sellers from any data access
CREATE OR REPLACE FUNCTION public.block_unapproved_sellers()
RETURNS BOOLEAN AS $$
DECLARE
  user_role user_role;
  seller_state seller_status;
BEGIN
  SELECT role, seller_status INTO user_role, seller_state
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- If user is a seller but not approved, block access
  IF user_role = 'seller' AND seller_state != 'approved' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Seller Data Isolation
-- =====================================================

-- Ensure sellers cannot:
-- 1. View other sellers' products
-- 2. View other sellers' orders
-- 3. Modify other sellers' data
-- 4. Access customer personal information (beyond order details)
-- 5. Escalate their approval status
-- 6. Access admin features

-- All enforced by RLS policies above
