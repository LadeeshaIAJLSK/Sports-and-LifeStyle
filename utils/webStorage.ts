import { Platform } from 'react-native';

// Mock storage that doesn't do anything if window is not available
const memoryStorage: Record<string, string> = {};

// Web-compatible storage adapter for redux-persist
const webStorage = {
  getItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        try {
          return typeof window !== 'undefined' && localStorage ? localStorage.getItem(key) : (memoryStorage[key] || null);
        } catch (e) {
          // localStorage not available, use memory storage
          return memoryStorage[key] || null;
        }
      }
      // For React Native, don't use storage
      return null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  },
  setItem: async (key: string, item: string) => {
    try {
      if (Platform.OS === 'web') {
        try {
          if (typeof window !== 'undefined' && localStorage) {
            localStorage.setItem(key, item);
          } else {
            memoryStorage[key] = item;
          }
        } catch (e) {
          // localStorage not available, use memory storage
          memoryStorage[key] = item;
        }
      }
      // For React Native, don't use storage
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  },
  removeItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        try {
          if (typeof window !== 'undefined' && localStorage) {
            localStorage.removeItem(key);
          } else {
            delete memoryStorage[key];
          }
        } catch (e) {
          // localStorage not available, use memory storage
          delete memoryStorage[key];
        }
      }
      // For React Native, don't use storage
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  },
};

export default webStorage;
