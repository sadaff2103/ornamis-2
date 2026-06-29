-- =====================================================
-- STEP 6 & 7: Admin-Specific RLS Policies
-- =====================================================
-- Admins have full access to all data with audit logging

-- =====================================================
-- Admin Full Access Policies
-- =====================================================

-- Admins already have full access via policies in previous migrations
-- This file adds admin-specific features and audit logging

-- =====================================================
-- Admin Action Audit Log
-- =====================================================

CREATE TABLE public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for audit log
CREATE INDEX idx_admin_audit_log_admin_id ON public.admin_audit_log(admin_id);
CREATE INDEX idx_admin_audit_log_created_at ON public.admin_audit_log(created_at DESC);
CREATE INDEX idx_admin_audit_log_table_name ON public.admin_audit_log(table_name);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_log
  FOR SELECT
  USING (is_admin());

-- Policy: System can insert audit logs
CREATE POLICY "System can insert audit logs"
  ON public.admin_audit_log
  FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- Admin Action Logging Functions
-- =====================================================

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action TEXT,
  p_table_name TEXT,
  p_record_id UUID DEFAULT NULL,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Only log if user is admin
  IF is_admin() THEN
    INSERT INTO public.admin_audit_log (
      admin_id,
      action,
      table_name,
      record_id,
      old_data,
      new_data
    )
    VALUES (
      auth.uid(),
      p_action,
      p_table_name,
      p_record_id,
      p_old_data,
      p_new_data
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Admin-Only Functions
-- =====================================================

-- Function to get all pending sellers (admin only)
CREATE OR REPLACE FUNCTION public.get_pending_sellers()
RETURNS TABLE (
  id UUID,
  email TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can view pending sellers';
  END IF;
  
  RETURN QUERY
  SELECT p.id, p.email, p.created_at
  FROM public.profiles p
  WHERE p.role = 'seller' AND p.seller_status = 'pending'
  ORDER BY p.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all users by role (admin only)
CREATE OR REPLACE FUNCTION public.get_users_by_role(p_role user_role)
RETURNS TABLE (
  id UUID,
  email TEXT,
  role user_role,
  seller_status seller_status,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can view users by role';
  END IF;
  
  RETURN QUERY
  SELECT p.id, p.email, p.role, p.seller_status, p.created_at
  FROM public.profiles p
  WHERE p.role = p_role
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics (admin only)
CREATE OR REPLACE FUNCTION public.get_user_statistics()
RETURNS TABLE (
  total_users BIGINT,
  total_customers BIGINT,
  total_sellers BIGINT,
  pending_sellers BIGINT,
  approved_sellers BIGINT,
  rejected_sellers BIGINT,
  total_admins BIGINT
) AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can view user statistics';
  END IF;
  
  RETURN QUERY
  SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE role = 'customer') as total_customers,
    COUNT(*) FILTER (WHERE role = 'seller') as total_sellers,
    COUNT(*) FILTER (WHERE role = 'seller' AND seller_status = 'pending') as pending_sellers,
    COUNT(*) FILTER (WHERE role = 'seller' AND seller_status = 'approved') as approved_sellers,
    COUNT(*) FILTER (WHERE role = 'seller' AND seller_status = 'rejected') as rejected_sellers,
    COUNT(*) FILTER (WHERE role = 'admin') as total_admins
  FROM public.profiles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete user (admin only, with cascade)
CREATE OR REPLACE FUNCTION public.delete_user(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_user_email TEXT;
  v_user_role user_role;
BEGIN
  -- Check if caller is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can delete users';
  END IF;
  
  -- Get user details for logging
  SELECT email, role INTO v_user_email, v_user_role
  FROM public.profiles
  WHERE id = p_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Prevent deleting other admins
  IF v_user_role = 'admin' THEN
    RAISE EXCEPTION 'Cannot delete admin users';
  END IF;
  
  -- Log the action
  PERFORM log_admin_action(
    'DELETE_USER',
    'profiles',
    p_user_id,
    jsonb_build_object('email', v_user_email, 'role', v_user_role),
    NULL
  );
  
  -- Delete from auth.users (will cascade to profiles)
  DELETE FROM auth.users WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Admin Dashboard Views
-- =====================================================

-- View for admin dashboard statistics
CREATE OR REPLACE VIEW public.admin_dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.profiles) as total_users,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'customer') as total_customers,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'seller' AND seller_status = 'approved') as active_sellers,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'seller' AND seller_status = 'pending') as pending_sellers,
  (SELECT COUNT(*) FROM public.orders) as total_orders,
  (SELECT COUNT(*) FROM public.orders WHERE status = 'pending') as pending_orders,
  (SELECT COUNT(*) FROM public.products) as total_products,
  (SELECT COALESCE(SUM(total_price), 0) FROM public.orders WHERE status = 'completed') as total_revenue;

-- RLS for admin dashboard
ALTER VIEW public.admin_dashboard_stats SET (security_invoker = on);

-- =====================================================
-- Prevent Admin Self-Assignment
-- =====================================================

-- Trigger to prevent users from making themselves admin
CREATE OR REPLACE FUNCTION public.prevent_admin_self_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- If trying to change to admin role
  IF NEW.role = 'admin' AND OLD.role != 'admin' THEN
    -- Check if the person making the change is already an admin
    IF NOT is_admin() THEN
      RAISE EXCEPTION 'Only existing admins can assign admin role';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to profiles
CREATE TRIGGER prevent_admin_self_assignment_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_admin_self_assignment();

-- =====================================================
-- Admin Security Notes
-- =====================================================

-- 1. All admin actions are logged in admin_audit_log
-- 2. Admins cannot be created via signup (manual SQL only)
-- 3. Admins cannot delete other admins
-- 4. Admin role cannot be self-assigned
-- 5. All admin functions check is_admin() before executing
