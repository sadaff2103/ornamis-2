/* @refresh reset */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebaseClient';
import {
  getCurrentAuthUser,
  signOut as firebaseSignOut,
  requestSellerRole as authRequestSellerRole,
} from '../services/authService';
import type { AuthUser, UserRole } from '../lib/firebaseClient';

export interface User2 {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  seller_status?: 'pending' | 'approved' | 'rejected';
}

interface AuthContextType {
  user: User2 | null;
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  requestSellerRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user2, setUser2] = useState<User2 | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadUser(firebaseUser: User | null) {
    if (!firebaseUser) {
      setUser2(null);
      setAuthUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const current = await getCurrentAuthUser();
      if (current) {
        setAuthUser(current);
        const googleName = firebaseUser.displayName || undefined;
        const emailName = current.profile.email.split('@')[0];
        const fallback = emailName.charAt(0).toUpperCase() + emailName.slice(1);
        setUser2({
          id: firebaseUser.uid,
          name: googleName || current.profile.full_name || fallback,
          email: current.profile.email,
          role: current.profile.role,
          seller_status: current.profile.seller_status || undefined,
        });
      } else {
        setUser2(null);
        setAuthUser(null);
      }
    } catch {
      setUser2(null);
      setAuthUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Firebase onAuthStateChanged fires on page load and on sign-in/out
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      loadUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    await firebaseSignOut();
    setUser2(null);
    setAuthUser(null);
  };

  const refreshUser = async () => {
    await loadUser(auth.currentUser);
  };

  const requestSellerRole = async () => {
    if (!user2) throw new Error('Not authenticated');
    await authRequestSellerRole(user2.id);
    await refreshUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user: user2,
        authUser,
        isAuthenticated: !!user2,
        isLoading,
        logout,
        refreshUser,
        requestSellerRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
