-- =====================================================
-- STEP 9: Optional OTP & Advanced Security Features
-- =====================================================
-- Enhanced security for sellers and admins

-- =====================================================
-- MFA/OTP Configuration
-- =====================================================

-- Note: Supabase has built-in MFA support via auth.mfa_factors
-- This migration configures additional security features

-- Table to track login attempts
CREATE TABLE public.login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_login_attempts_user_id ON public.login_attempts(user_id);
CREATE INDEX idx_login_attempts_email ON public.login_attempts(email);
CREATE INDEX idx_login_attempts_created_at ON public.login_attempts(created_at DESC);
CREATE INDEX idx_login_attempts_ip_address ON public.login_attempts(ip_address);

-- Enable RLS
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own login attempts
CREATE POLICY "Users can view own login attempts"
  ON public.login_attempts
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Admins can view all login attempts
CREATE POLICY "Admins can view all login attempts"
  ON public.login_attempts
  FOR SELECT
  USING (is_admin());

-- Policy: System can insert login attempts
CREATE POLICY "System can insert login attempts"
  ON public.login_attempts
  FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- Suspicious Activity Detection
-- =====================================================

-- Function to detect suspicious login patterns
CREATE OR REPLACE FUNCTION public.detect_suspicious_login(
  p_email TEXT,
  p_ip_address INET
)
RETURNS BOOLEAN AS $$
DECLARE
  failed_attempts INTEGER;
  different_ips INTEGER;
BEGIN
  -- Check failed login attempts in last 15 minutes
  SELECT COUNT(*) INTO failed_attempts
  FROM public.login_attempts
  WHERE email = p_email
    AND success = false
    AND created_at > NOW() - INTERVAL '15 minutes';
  
  -- If more than 5 failed attempts, flag as suspicious
  IF failed_attempts >= 5 THEN
    RETURN true;
  END IF;
  
  -- Check for logins from multiple IPs in last hour
  SELECT COUNT(DISTINCT ip_address) INTO different_ips
  FROM public.login_attempts
  WHERE email = p_email
    AND created_at > NOW() - INTERVAL '1 hour';
  
  -- If more than 3 different IPs, flag as suspicious
  IF different_ips >= 3 THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log login attempt
CREATE OR REPLACE FUNCTION public.log_login_attempt(
  p_user_id UUID,
  p_email TEXT,
  p_success BOOLEAN,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_failure_reason TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.login_attempts (
    user_id,
    email,
    success,
    ip_address,
    user_agent,
    failure_reason
  )
  VALUES (
    p_user_id,
    p_email,
    p_success,
    p_ip_address,
    p_user_agent,
    p_failure_reason
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Session Management
-- =====================================================

-- Table to track active sessions
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON public.user_sessions(expires_at);
CREATE INDEX idx_user_sessions_session_token ON public.user_sessions(session_token);

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own sessions
CREATE POLICY "Users can view own sessions"
  ON public.user_sessions
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Users can delete their own sessions (logout)
CREATE POLICY "Users can delete own sessions"
  ON public.user_sessions
  FOR DELETE
  USING (user_id = auth.uid());

-- Policy: Admins can view all sessions
CREATE POLICY "Admins can view all sessions"
  ON public.user_sessions
  FOR SELECT
  USING (is_admin());

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.user_sessions
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Password Reset Security
-- =====================================================

-- Table to track password reset requests
CREATE TABLE public.password_reset_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_password_reset_user_id ON public.password_reset_requests(user_id);
CREATE INDEX idx_password_reset_token ON public.password_reset_requests(token);
CREATE INDEX idx_password_reset_expires_at ON public.password_reset_requests(expires_at);

-- Enable RLS
ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own reset requests
CREATE POLICY "Users can view own reset requests"
  ON public.password_reset_requests
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Admins can view all reset requests
CREATE POLICY "Admins can view all reset requests"
  ON public.password_reset_requests
  FOR SELECT
  USING (is_admin());

-- =====================================================
-- Email Notifications for Security Events
-- =====================================================

-- Note: Actual email sending would be done via Supabase Edge Functions
-- This creates a queue table for security notifications

CREATE TABLE public.security_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  message TEXT NOT NULL,
  sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX idx_security_notifications_user_id ON public.security_notifications(user_id);
CREATE INDEX idx_security_notifications_sent ON public.security_notifications(sent);
CREATE INDEX idx_security_notifications_created_at ON public.security_notifications(created_at DESC);

-- Enable RLS
ALTER TABLE public.security_notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.security_notifications
  FOR SELECT
  USING (user_id = auth.uid());

-- Function to queue security notification
CREATE OR REPLACE FUNCTION public.queue_security_notification(
  p_user_id UUID,
  p_notification_type TEXT,
  p_message TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.security_notifications (
    user_id,
    notification_type,
    message
  )
  VALUES (
    p_user_id,
    p_notification_type,
    p_message
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- MFA Enforcement for Sellers and Admins
-- =====================================================

-- Function to check if MFA is required for user
CREATE OR REPLACE FUNCTION public.is_mfa_required()
RETURNS BOOLEAN AS $$
DECLARE
  user_role user_role;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- Require MFA for sellers and admins
  RETURN user_role IN ('seller', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Automated Security Tasks
-- =====================================================

-- Note: These would typically be run via pg_cron or Supabase Edge Functions

-- Clean up expired sessions daily
-- SELECT cron.schedule('cleanup-expired-sessions', '0 0 * * *', 'SELECT cleanup_expired_sessions()');

-- Clean up old login attempts (keep last 30 days)
-- CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
-- RETURNS INTEGER AS $$
-- DECLARE
--   deleted_count INTEGER;
-- BEGIN
--   DELETE FROM public.login_attempts
--   WHERE created_at < NOW() - INTERVAL '30 days';
--   
--   GET DIAGNOSTICS deleted_count = ROW_COUNT;
--   RETURN deleted_count;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
