'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { IUser } from '@/lib/types';


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



interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (credentials: OtpCredentials) => Promise<void>; 
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  handleAuthCallback: (token: string) => Promise<void>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/session');
          if (response.data.user) {
            setUser(response.data.user);
          }
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    router.push('/dashboard');
  };

  const register = async (credentials: RegisterCredentials) => {
    const response = await api.post('/auth/register', credentials);
    return { success: response.data.success, message: response.data.message };
  };

  const verifyOtp = async (credentials: OtpCredentials) => {
    const response = await api.post('/auth/verify-otp', credentials);
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    router.push('/dashboard');
  };
  
  const handleAuthCallback = async (token: string) => {
    localStorage.setItem('token', token);
    await checkSession();
    const sessionRes = await api.get('/auth/session');
    const u = sessionRes.data.user;
    if (u && !u.kycCompleted) {
      router.push('/complete-kyc');
    } else {
      router.push('/dashboard');
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };
  
  const checkSession = async () => {
    try {
      const response = await api.get('/auth/session');
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const value = { user, isAuthenticated: !!user, isLoading, login, register, verifyOtp, logout, checkSession, handleAuthCallback };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};