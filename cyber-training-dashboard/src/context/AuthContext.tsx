import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getUserAPIClient,
  loginAPIClient,
  logoutAPIClient,
  registerAPIClient,
  sendOTPAPIClient,
  sendForgotPasswordOTPAPIClient,
  verifyOTPAPIClient,
  setPasswordAPIClient,
} from '../core/apiClient';
import { RegisterState, User } from '../types';
import { Register } from '@tanstack/react-query';

const ACCESS_TOKEN_KEY = 'cyber_access_token';
const REFRESH_TOKEN_KEY = 'cyber_refresh_token';

interface RegisterResult {
  status: number;
  message: string;
  user: User;
}

interface MessageResult {
  status: number;
  message: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (user: RegisterState) => Promise<RegisterResult>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendOTP: (email: string) => Promise<MessageResult>;
  sendForgotPasswordOTP: (email: string) => Promise<MessageResult>;
  verifyOTP: (user: string | null, otpCode: string) => Promise<MessageResult>;
  setPassword: (email: string, password: string) => Promise<MessageResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isBrowser = typeof window !== 'undefined';

const persistTokens = (accessToken: string, refreshToken: string) => {
  if (!isBrowser) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const clearStoredAuth = () => {
  if (!isBrowser) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const getStoredToken = (key: string) => {
  if (!isBrowser) return null;
  return localStorage.getItem(key);
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = getStoredToken(ACCESS_TOKEN_KEY);
      if (!accessToken) {
        setLoading(false);
        return;
      }
      try {
        const response = await getUserAPIClient(accessToken);
        setUser(response.data.user);
      } catch (_error) {
        clearStoredAuth();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const signUp = async (user:RegisterState): Promise<RegisterResult> => {
    const response = await registerAPIClient(user);
    return {
      status: response.status,
      message: response.data.message,
      user: response.data.user,
    };
  };

  const signIn = async (email: string, password: string) => {
    const response = await loginAPIClient(email, password);
    const { access_token, refresh_token, user: userData } = response.data;
    persistTokens(access_token, refresh_token);
    setUser(userData);
  };

  const signOut = async () => {
    const accessToken = getStoredToken(ACCESS_TOKEN_KEY);
    try {
      if (accessToken) {
        await logoutAPIClient(accessToken);
      }
    } finally {
      clearStoredAuth();
      setUser(null);
    }
  };

  const sendOTP = async (email: string): Promise<MessageResult> => {
    const response = await sendOTPAPIClient(email);
    return {
      status: response.status,
      message: response.data.message,
    };
  };

  const sendForgotPasswordOTP = async (email: string): Promise<MessageResult> => {
    const response = await sendForgotPasswordOTPAPIClient(email);
    return {
      status: response.status,
      message: response.data.message,
    };
  };

  const verifyOTP = async (user: string | null, otpCode: string): Promise<MessageResult> => {
    const response = await verifyOTPAPIClient(user, otpCode);
    const { access_token, refresh_token, user: userData } = response.data;
    persistTokens(access_token, refresh_token);
    setUser(userData);
    return {
      status: response.status,
      message: response.data.message,
    };
  };

  const setPassword = async (email: string, password: string): Promise<MessageResult> => {
    const response = await setPasswordAPIClient(email, password);
    return {
      status: response.status,
      message: response.data.message,
    };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, sendOTP, sendForgotPasswordOTP, verifyOTP, setPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
