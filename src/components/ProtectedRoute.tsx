import { ReactNode, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  onNavigate: (page: string) => void;
  requiresAuth?: boolean;
}

/**
 * ProtectedRoute component that redirects unauthenticated users to login
 * Use this to wrap any page that requires authentication
 */
export function ProtectedRoute({ 
  children, 
  onNavigate,
  requiresAuth = true 
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  // If auth is required and user is not authenticated, redirect to login
  useEffect(() => {
    if (requiresAuth && !isAuthenticated) {
      onNavigate("login");
    }
  }, [requiresAuth, isAuthenticated, onNavigate]);

  // If not authenticated and auth is required, don't render anything yet
  // (the redirect will happen via useEffect and App will rerender with currentPage="login")
  if (requiresAuth && !isAuthenticated) {
    return null;
  }

  // Otherwise render the protected content
  return <>{children}</>;
}
