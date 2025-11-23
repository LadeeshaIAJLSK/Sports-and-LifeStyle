import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleCreateAccount = () => {
    router.push('/(auth)/register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logoImage}
              contentFit="contain"
            />
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          {/* Sports Image */}
          <View style={styles.imageContainer}>
            <Image
              source={require('@/assets/images/getting started.png')}
              style={styles.heroImage}
              contentFit="contain"
            />
          </View>

          {/* Main Text */}
          <View style={styles.textSection}>
            <Text style={styles.mainTitle}>KEEP AN EYE ON</Text>
            <Text style={styles.mainTitle}>THE STADIUM</Text>
            <Text style={styles.subtitle}>
              Watch sports live or highlights, read every{'\n'}news from your smartphone
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccount}>
            <Text style={styles.createAccountButtonText}>CREATE ACCOUNT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'flex-start',
    width: '100%',
  },
  logoContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  heroSection: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  imageContainer: {
    width: width * 0.85,
    height: height * 0.28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    zIndex: 2,
  },

  textSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonSection: {
    paddingBottom: 60,
    paddingTop: 30,
    gap: 16,
  },
  loginButton: {
    backgroundColor: '#FF4757',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAccountButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF4757',
  },
  createAccountButtonText: {
    color: '#FF4757',
    fontSize: 16,
    fontWeight: '600',
  },
});