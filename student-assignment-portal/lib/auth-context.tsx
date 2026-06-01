'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, UserRole, AuthResponseDto } from './types';
import { api, setTokens, clearTokens } from './api-client';

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function mapRole(apiRole: string): UserRole {
  switch (apiRole.toLowerCase()) {
    case 'student': return 'student';
    case 'teacher': return 'teacher';
    case 'admin': return 'admin';
    default: return 'student';
  }
}

function buildUserFromAuth(authData: AuthResponseDto): User {
  const jwtPayload = decodeJwtPayload(authData.token);
  const userId = (jwtPayload?.nameidentifier || jwtPayload?.sub || '') as string;

  return {
    id: userId,
    name: authData.fullName,
    email: authData.email,
    role: mapRole(authData.role),
    createdAt: authData.expiresAt,
  };
}

function buildUserFromMe(authData: AuthResponseDto, role: UserRole): User {
  return {
    id: '',
    name: authData.fullName,
    email: authData.email,
    role,
    createdAt: '',
  };
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserRole>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state from API token on mount
  useEffect(() => {
    async function initAuth() {
      if (typeof window === 'undefined') {
        setIsInitialized(true);
        return;
      }

      const savedUser = sessionStorage.getItem('user');
      const savedRole = sessionStorage.getItem('role');

      if (savedUser && savedRole) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setRole(savedRole as UserRole);
        } catch {
          // fall through to check API
        }
      } else {
        // Attempt to restore session via API
        try {
          const meData = await api.get<AuthResponseDto>('/api/auth/me');
          const r = mapRole(meData.role);
          const u = buildUserFromMe(meData, r);
          setUser(u);
          setRole(r);
          sessionStorage.setItem('user', JSON.stringify(u));
          sessionStorage.setItem('role', r);
        } catch {
          clearTokens();
        }
      }

      setIsInitialized(true);
    }

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const authData = await api.post<AuthResponseDto>('/api/auth/login', { email, password });

      setTokens(authData.token, authData.refreshToken);

      const u = buildUserFromAuth(authData);
      const r = mapRole(authData.role);

      setUser(u);
      setRole(r);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user', JSON.stringify(u));
        sessionStorage.setItem('role', r);
      }

      return r;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post<never>('/api/auth/logout');
    } catch {
      // proceed with local logout even if API call fails
    }
    clearTokens();
    setUser(null);
    setRole(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('role');
    }
  }, []);

  const value: AuthContextType = {
    user,
    role,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user && !!role,
  };

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
