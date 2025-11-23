import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  } catch (e) {
    return false;
  }
};

// Helper functions to handle both web and native platforms
const setStorageItem = async (key: string, value: string): Promise<void> => {
  try {
    if (Platform.OS === 'web' && isLocalStorageAvailable()) {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error(`Error setting storage for key ${key}:`, error);
  }
};

const getStorageItem = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === 'web' && isLocalStorageAvailable()) {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error(`Error getting storage for key ${key}:`, error);
    return null;
  }
};

const removeStorageItem = async (key: string): Promise<void> => {
  try {
    if (Platform.OS === 'web' && isLocalStorageAvailable()) {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error(`Error removing storage for key ${key}:`, error);
  }
};

// Mock API functions - replace with real API calls
const mockLogin = async (email: string, password: string): Promise<{ user: User; token: string } | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation - in real app, this would be API call
  if (email && password.length >= 6) {
    return {
      user: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: email,
        username: email.split('@')[0]
      },
      token: 'mock_jwt_token_' + Date.now()
    };
  }
  return null;
};

const mockRegister = async (userData: RegisterData): Promise<{ user: User; token: string } | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (userData.email && userData.password.length >= 6) {
    return {
      user: {
        id: Date.now().toString(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        username: userData.email.split('@')[0]
      },
      token: 'mock_jwt_token_' + Date.now()
    };
  }
  return null;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth token on app start
  useEffect(() => {
    checkAuthToken();
  }, []);

  const checkAuthToken = async () => {
    try {
      const token = await getStorageItem(AUTH_TOKEN_KEY);
      const userData = await getStorageItem(USER_DATA_KEY);
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await mockLogin(email, password);
      
      if (response) {
        await setStorageItem(AUTH_TOKEN_KEY, response.token);
        await setStorageItem(USER_DATA_KEY, JSON.stringify(response.user));
        setUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await mockRegister(userData);
      
      if (response) {
        await setStorageItem(AUTH_TOKEN_KEY, response.token);
        await setStorageItem(USER_DATA_KEY, JSON.stringify(response.user));
        setUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await removeStorageItem(AUTH_TOKEN_KEY);
      await removeStorageItem(USER_DATA_KEY);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};