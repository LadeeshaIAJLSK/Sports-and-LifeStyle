import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => Promise<void>;
  colorScheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  } catch (e) {
    return false;
  }
};

// Helper function to handle storage for both web and native
const setThemeStorage = async (value: string): Promise<void> => {
  try {
    if (Platform.OS === 'web' && isLocalStorageAvailable()) {
      localStorage.setItem('theme_preference', value);
    } else {
      await AsyncStorage.setItem('theme_preference', value);
    }
  } catch (error) {
    console.error('Error saving theme preference:', error);
  }
};

const getThemeStorage = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web' && isLocalStorageAvailable()) {
      return localStorage.getItem('theme_preference');
    } else {
      return await AsyncStorage.getItem('theme_preference');
    }
  } catch (error) {
    console.error('Error loading theme preference:', error);
    return null;
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const saved = await getThemeStorage();
      if (saved !== null) {
        setIsDarkMode(saved === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleDarkMode = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await setThemeStorage(newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        colorScheme: isDarkMode ? 'dark' : 'light',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}