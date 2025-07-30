'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

// Define a specific type for login/register credentials
interface LoginCredentials {
  email: string;
  password: string;
}

interface OtpCredentials {
  email: string;
  otp: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
}

// Define the type for our User object
interface User {
  profilePicture: string | Blob | undefined;
  _id: string;
  name: string;
  email: string;
}

// Update the context type to include the register function
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; message: string }>; // Add register
  verifyOtp: (credentials: OtpCredentials) => Promise<void>; 
  logout: () => Promise<void>;
}

// Create the context with a default value of 'undefined'
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get('/auth/session');
        if (response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    setUser(response.data.user);
    router.push('/dashboard');
  };

  // Add the register function
  const register = async (credentials: RegisterCredentials) => {
    const response = await api.post('/auth/register', credentials);
    return { success: response.data.success, message: response.data.message };
  };

  // --- ADD THE VERIFY OTP FUNCTION ---
  const verifyOtp = async (credentials: OtpCredentials) => {
    const response = await api.post('/auth/verify-otp', credentials);
    // On successful verification, the backend returns a user object and token (which is set as a cookie)
    setUser(response.data.user);
    router.push('/dashboard'); // Redirect to dashboard after verification
  };
  // ------------------------------------

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  const value = { user, isAuthenticated: !!user, isLoading, login, register, verifyOtp, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create the custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
