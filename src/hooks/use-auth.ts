'use client';

import { useState, useEffect } from 'react';
import { User, AuthCredentials, SignupData } from '@/types';
import { authUtils } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const currentUser = authUtils.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials: AuthCredentials): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await authUtils.login(credentials);
      if (result.success && result.user) {
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (data: SignupData): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await authUtils.signup(data);
      if (result.success && result.user) {
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = (): void => {
    authUtils.logout();
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return {
    user,
    login,
    signup,
    logout,
    isAuthenticated,
    loading
  };
}