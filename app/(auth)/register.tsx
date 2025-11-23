import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../contexts/AuthContext';
import { authValidationSchema, type RegisterFormData } from '@/utils/validationSchemas';

export default function RegisterScreen() {
  const { register, isLoading } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(authValidationSchema.register),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const success = await register(data);
    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>CREATE YOUR SPORTIFY ID</Text>
                <Text style={styles.subtitle}>
                  Get news, game updates, highlights and more info on your favorite teams.
                </Text>
              </View>

              <View style={styles.formContainer}>
                {/* First Name Input */}
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.input, errors.firstName && styles.inputError]}
                        placeholder="First Name"
                        placeholderTextColor="#999"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="words"
                        autoComplete="given-name"
                      />
                    )}
                  />
                  {errors.firstName && (
                    <Text style={styles.errorText}>{errors.firstName.message}</Text>
                  )}
                </View>

                {/* Last Name Input */}
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.input, errors.lastName && styles.inputError]}
                        placeholder="Last Name"
                        placeholderTextColor="#999"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="words"
                        autoComplete="family-name"
                      />
                    )}
                  />
                  {errors.lastName && (
                    <Text style={styles.errorText}>{errors.lastName.message}</Text>
                  )}
                </View>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.input, errors.email && styles.inputError]}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                      />
                    )}
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  )}
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.input, errors.password && styles.inputError]}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry
                        autoComplete="new-password"
                      />
                    )}
                  />
                  {errors.password && (
                    <Text style={styles.errorText}>{errors.password.message}</Text>
                  )}
                  <Text style={styles.passwordHint}>
                    Password must be at least 6 characters long.
                  </Text>
                </View>

                {/* Confirm Password Input */}
                <View style={styles.inputContainer}>
                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.input, errors.confirmPassword && styles.inputError]}
                        placeholder="Confirm Password"
                        placeholderTextColor="#999"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry
                        autoComplete="new-password"
                      />
                    )}
                  />
                  {errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                  )}
                </View>

                {/* Terms and Conditions */}
                <View style={styles.termsContainer}>
                  <Text style={styles.termsText}>
                    I agree to the <Text style={styles.linkText}>Terms</Text> and{' '}
                    <Text style={styles.linkText}>Privacy Policy</Text>
                  </Text>
                </View>

                {/* Create Account Button */}
                <TouchableOpacity
                  style={[styles.createButton, isLoading && styles.buttonDisabled]}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isLoading}
                >
                  <Text style={styles.createButtonText}>
                    {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                  </Text>
                </TouchableOpacity>

                {/* Sign In Link */}
                <View style={styles.signInContainer}>
                  <Text style={styles.signInText}>
                    By creating ID to the above terms, you are consenting that your
                    personal information will be collected, stored, and processed in
                    the United States and the European Union on behalf of Sportify
                    Operations Inc.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
    backgroundColor: 'white',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 70,
    paddingBottom: 20,
  },
  logo: {
    width: 120,
    height: 40,
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF3333',
  },
  errorText: {
    color: '#FF3333',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  passwordHint: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    lineHeight: 16,
  },
  termsContainer: {
    marginVertical: 20,
    alignItems: 'flex-start',
  },
  termsText: {
    color: '#333',
    fontSize: 12,
    lineHeight: 18,
  },
  linkText: {
    color: '#FF4757',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#FF4757',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  signInText: {
    color: '#666',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
  },
});