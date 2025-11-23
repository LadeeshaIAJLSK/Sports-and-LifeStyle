import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    console.log('🔍 Index Screen - Checking auth:', { isLoading, isAuthenticated, user });
    
    if (!isLoading) {
      if (isAuthenticated && user) {
        console.log('✅ User authenticated, navigating to tabs');
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 100);
      } else {
        console.log('❌ User not authenticated, navigating to welcome');
        setTimeout(() => {
          router.replace('/(auth)/welcome');
        }, 100);
      }
    }
  }, [isAuthenticated, isLoading, user]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA' }}>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 32, marginBottom: 20 }}>⚽</Text>
        <ActivityIndicator size="large" color="#FF4757" />
        <Text style={{ marginTop: 16, color: '#666', fontSize: 14 }}>Loading Sportify...</Text>
      </View>
    </View>
  );
}