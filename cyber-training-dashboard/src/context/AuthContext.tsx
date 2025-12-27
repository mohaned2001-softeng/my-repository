import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  getUserAPIClient,
  loginAPIClient,
  logoutAPIClient,
  registerAPIClient,
  sendOTPAPIClient,
  sendForgotPasswordOTPAPIClient,
  verifyOTPAPIClient,
  setPasswordAPIClient,
  editUserAPIClient,
  refreshTokenAPIClient
} from '../core/apiClient';
import { useLab } from '@/contexts/LabContext';
import { AuthTokens, User } from '../types';
import { jwtDecode } from 'jwt-decode';

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
  token: AuthTokens | null;
  signUp: (user: User) => Promise<RegisterResult>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendOTP: (email: string) => Promise<MessageResult>;
  sendForgotPasswordOTP: (email: string) => Promise<MessageResult>;
  verifyOTP: (user: string | null, otpCode: string) => Promise<MessageResult>;
  getUserProfile: (token: string) => Promise<User>;
  editProfile: (fullName:string , bio:string) => Promise<void>;
  refreshToken: () => Promise<void>;
  setPassword: (email: string, password: string ,confirmPassword: string) => Promise<MessageResult>;
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
  const [token  , setToken] = useState<AuthTokens | null>(null);
  const {setLab , lab} = useLab();
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = getStoredToken(ACCESS_TOKEN_KEY);
      const refreshToken = getStoredToken(REFRESH_TOKEN_KEY);
      if (!accessToken || !refreshToken) {
        setLoading(false);
        return;
      }
      setToken({ access_token: accessToken, refresh_token: refreshToken });
      try {
        const response = await getUserAPIClient(accessToken);
        setUser(response.data.user);
      } catch (_error) {
        clearStoredAuth();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const signUp = async (user:User): Promise<RegisterResult> => {
    const response = await registerAPIClient(user);
    return {
      status: response.status,
      message: response.data.message,
      user: response.data.user,
    };
  };

  const signIn = async (email: string, password: string) => {
    const response = await loginAPIClient(email, password);
    const { access_token, refresh_token, user: user } = response.data;
    setToken({access_token, refresh_token});
    persistTokens(access_token, refresh_token);
    setUser(user);
  };

  const signOut = async () => {
    try {
      if (token?.refresh_token && token?.access_token) {
         setLab({ ...lab,
            id:"",
            title: '',
            description: '',
            difficulty: 'Beginner',
            category: 'Linux',
            image: null,
            image_url: null,
            writeup_url: '',
            skills: [],
            estimated_time: 0
          });
        await logoutAPIClient(token.refresh_token , token.access_token);
      }
    } finally {
      clearStoredAuth();
      setUser(null);
      setToken(null);
    }
  };

  const sendOTP = async (email: string): Promise<MessageResult> => {
    const response = await sendOTPAPIClient(email);
    return {
      status: response.status,
      message: response.data.message,
    };
  };
  
  const getUserProfile = async (token: string): Promise<User> => {
    const response = await getUserAPIClient(token);
    return response.data.user;
  }
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
    setToken({ access_token, refresh_token });
    setUser(userData);
    return {
      status: response.status,
      message: response.data.message,
    };
  };

  const setPassword = async (email: string, password: string ,confirmPassword: string): Promise<MessageResult> => {
    const response = await setPasswordAPIClient(email, password, confirmPassword);
    return {
      status: response.status,
      message: response.data.message,
    };
  };

  const refreshToken = useCallback(async () => {
    const refreshTokenValue = token?.refresh_token ?? getStoredToken(REFRESH_TOKEN_KEY);
    if (!refreshTokenValue) return;
    try {
      const response = await refreshTokenAPIClient(refreshTokenValue);
      const { access_token } = response.data;
      setToken(prev => ({
        access_token,
        refresh_token: prev?.refresh_token ?? refreshTokenValue,
      }));
      persistTokens(access_token, refreshTokenValue);
    } catch (error) {
      clearStoredAuth();
      setUser(null);
      setToken(null);
    }
  }, [token?.refresh_token]);

  useEffect(() => {
    if (!token?.access_token || !token.refresh_token) {
      return;
    }
    let refreshTimer: number | undefined;
    try {
      const decoded = jwtDecode<{ exp: number }>(token.access_token);
      if (!decoded?.exp) {
        refreshToken();
        return;
      }
      const expirationTime = decoded.exp * 1000;
      const delay = Math.max(expirationTime - Date.now() - 60000, 5000);
      refreshTimer = window.setTimeout(() => {
        refreshToken();
      }, delay);
    } catch (_error) {
      refreshToken();
    }
    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, [token?.access_token, token?.refresh_token, refreshToken]);
  const editProfile = async (fullName:string , bio:string) => {
  //  const accessToken = getStoredToken(ACCESS_TOKEN_KEY);
    if (!token?.access_token || !user?.email) return;
    const response = await editUserAPIClient(token.access_token , user.email, fullName , bio ,'');
    setUser(response.data.user);
  }
  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, sendOTP, getUserProfile , editProfile, sendForgotPasswordOTP, verifyOTP, setPassword , token ,refreshToken }}>
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
