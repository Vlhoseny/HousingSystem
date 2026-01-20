import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, setAuthToken, removeAuthToken } from '@/lib/api';

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
        removeAuthToken();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login({ username, password });

      if (response.error) {
        return { success: false, error: response.error };
      }

      if (response.data) {
        const payload = response.data as any;
        // Some backends wrap in { success, data: { token, userId, userName, role } }
        const inner = payload.data ?? payload;
        const token = inner.token;

        if (!token) {
          return { success: false, error: 'لم يتم استلام رمز الدخول من الخادم' };
        }

        // Normalize user object from possible shapes
        const userData = inner.user ?? {
          id: inner.userId ?? inner.id ?? 0,
          username: inner.userName ?? inner.username ?? username,
          role: inner.role ?? 'User',
        };

        // Persist token and user
        setAuthToken(token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        return { success: true };
      }

      return { success: false, error: 'لم يتم استلام بيانات صحيحة من الخادم' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'فشل الاتصال بالخادم' };
    }
  };

  const logout = () => {
    setUser(null);
    removeAuthToken();
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
