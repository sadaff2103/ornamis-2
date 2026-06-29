-- =====================================================
-- STEP 4 & 5: Authentication Triggers
-- =====================================================
-- Auto-create profile on signup with proper role assignment

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, seller_status)
  VALUES (
    NEW.id,
    NEW.email,
    'customer', -- Default role
    NULL -- No seller status for customers
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to handle seller signup
-- This should be called explicitly when user selects "seller" during signup
CREATE OR REPLACE FUNCTION public.create_seller_profile(user_id UUID, user_email TEXT)
RETURNS VOID AS $$
BEGIN
  -- Update existing customer profile to seller with pending status
  UPDATE public.profiles
  SET 
    role = 'seller',
    seller_status = 'pending',
    updated_at = NOW()
  WHERE id = user_id;
  
  -- If no profile exists, create one (shouldn't happen with trigger, but safety check)
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, email, role, seller_status)
    VALUES (user_id, user_email, 'seller', 'pending');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate seller can login (must be approved)
CREATE OR REPLACE FUNCTION public.can_seller_login(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  seller_state seller_status;
BEGIN
  SELECT seller_status INTO seller_state
  FROM public.profiles
  WHERE id = user_id AND role = 'seller';
  
  RETURN seller_state = 'approved';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve seller (admin only)
CREATE OR REPLACE FUNCTION public.approve_seller(seller_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can approve sellers';
  END IF;
  
  -- Update seller status
  UPDATE public.profiles
  SET 
    seller_status = 'approved',
    updated_at = NOW()
  WHERE id = seller_id AND role = 'seller';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Seller not found';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reject seller (admin only)
CREATE OR REPLACE FUNCTION public.reject_seller(seller_id UUID, reason TEXT DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can reject sellers';
  END IF;
  
  -- Update seller status
  UPDATE public.profiles
  SET 
    seller_status = 'rejected',
    updated_at = NOW()
  WHERE id = seller_id AND role = 'seller';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Seller not found';
  END IF;
  
  -- TODO: Send rejection email with reason
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Audit log table for role changes
CREATE TABLE public.role_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES public.profiles(id),
  old_role user_role,
  new_role user_role,
  old_seller_status seller_status,
  new_seller_status seller_status,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on audit log
CREATE INDEX idx_role_audit_log_user_id ON public.role_audit_log(user_id);
CREATE INDEX idx_role_audit_log_created_at ON public.role_audit_log(created_at DESC);

-- Trigger to log role changes
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.role != NEW.role OR OLD.seller_status IS DISTINCT FROM NEW.seller_status) THEN
    INSERT INTO public.role_audit_log (
      user_id, 
      changed_by, 
      old_role, 
      new_role, 
      old_seller_status, 
      new_seller_status
    )
    VALUES (
      NEW.id,
      auth.uid(),
      OLD.role,
      NEW.role,
      OLD.seller_status,
      NEW.seller_status
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach audit trigger
CREATE TRIGGER on_profile_role_change
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_role_change();
