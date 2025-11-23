import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  Modal,
  Linking,
  Image,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

const LOGO = require('@/assets/images/logo.png');
const LOGO_DARK = require('@/assets/images/logo_dark.png');

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Edit Profile Modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');

  // Privacy Modal
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  const handleToggleDarkMode = () => {
    console.log('🌙 Dark mode toggled');
    toggleTheme();
  };

  const handleToggleNotifications = (value: boolean) => {
    setNotificationsEnabled(value);
    if (value) {
      Alert.alert(
        'Notifications Enabled',
        'You will receive notifications about matches, scores, and updates.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Notifications Disabled',
        'You will not receive any notifications.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleEditProfile = () => {
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setEmail(user?.email || '');
    setEditModalVisible(true);
  };

  const handleSaveProfile = () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Update profile (you'll need to add this to AuthContext)
    Alert.alert(
      'Profile Updated',
      'Your profile has been updated successfully!',
      [
        {
          text: 'OK',
          onPress: () => setEditModalVisible(false),
        },
      ]
    );
    console.log('✅ Profile updated:', { firstName, lastName, email });
  };

  const handlePrivacy = () => {
    setPrivacyModalVisible(true);
  };

  const handleHelp = () => {
    Alert.alert(
      'Help & Support',
      'How can we help you?',
      [
        {
          text: 'FAQ',
          onPress: () => Alert.alert('FAQ', 'Frequently Asked Questions will be displayed here.'),
        },
        {
          text: 'Contact Support',
          onPress: () => {
            Alert.alert(
              'Contact Support',
              'Email: support@sportify.com\nPhone: +1 (555) 123-4567',
              [
                {
                  text: 'Send Email',
                  onPress: () => Linking.openURL('mailto:support@sportify.com'),
                },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          },
        },
        {
          text: 'Report Bug',
          onPress: () => Alert.alert('Report Bug', 'Bug report form will open here.'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About Sportify',
      'Version: 1.0.0\n\nA comprehensive sports tracking app for football enthusiasts.\n\n© 2024 Sportify Inc.\nAll rights reserved.',
      [
        {
          text: 'Terms of Service',
          onPress: () => Alert.alert('Terms of Service', 'Terms and conditions will be displayed here.'),
        },
        {
          text: 'Privacy Policy',
          onPress: () => Alert.alert('Privacy Policy', 'Privacy policy details will be displayed here.'),
        },
        { text: 'OK', style: 'cancel' },
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'Would you like to change your password?',
      [
        {
          text: 'Yes',
          onPress: () => {
            Alert.alert(
              'Password Reset',
              'A password reset link has been sent to your email.',
              [{ text: 'OK' }]
            );
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, isDarkMode && styles.headerDark]}>
          <Image 
            source={isDarkMode ? LOGO_DARK : LOGO}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, isDarkMode && styles.cardDark]}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.firstName?.[0]?.toUpperCase() || 'U'}
                {user?.lastName?.[0]?.toUpperCase() || 'S'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.editAvatarButton}
              onPress={() => Alert.alert('Change Avatar', 'Avatar upload feature coming soon!')}
            >
              <Feather name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.userName, isDarkMode && styles.textDark]}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={[styles.userEmail, isDarkMode && styles.textMuted]}>
            {user?.email}
          </Text>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuSection, isDarkMode && styles.cardDark]}>
          {/* Edit Profile */}
          <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FF4757' }]}>
                <Feather name="user" size={20} color="#fff" />
              </View>
              <View>
                <Text style={[styles.menuTitle, isDarkMode && styles.textDark]}>
                  Edit Profile
                </Text>
                <Text style={[styles.menuSubtitle, isDarkMode && styles.textMuted]}>
                  Update your information
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={isDarkMode ? '#666' : '#999'} />
          </TouchableOpacity>

          {/* Change Password */}
          <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#9C27B0' }]}>
                <Feather name="key" size={20} color="#fff" />
              </View>
              <View>
                <Text style={[styles.menuTitle, isDarkMode && styles.textDark]}>
                  Change Password
                </Text>
                <Text style={[styles.menuSubtitle, isDarkMode && styles.textMuted]}>
                  Update your password
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={isDarkMode ? '#666' : '#999'} />
          </TouchableOpacity>

          {/* Notifications */}
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#A8FF00' }]}>
                <Feather name="bell" size={20} color="#000" />
              </View>
              <View>
                <Text style={[styles.menuTitle, isDarkMode && styles.textDark]}>
                  Notifications
                </Text>
                <Text style={[styles.menuSubtitle, isDarkMode && styles.textMuted]}>
                  {notificationsEnabled ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#E0E0E0', true: '#A8FF00' }}
              thumbColor="#fff"
            />
          </View>

          {/* Dark Mode */}
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: isDarkMode ? '#FFA500' : '#764ba2' }]}>
                <Feather name={isDarkMode ? 'sun' : 'moon'} size={20} color="#fff" />
              </View>
              <View>
                <Text style={[styles.menuTitle, isDarkMode && styles.textDark]}>
                  Dark Mode
                </Text>
                <Text style={[styles.menuSubtitle, isDarkMode && styles.textMuted]}>
                  {isDarkMode ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: '#E0E0E0', true: '#764ba2' }}
              thumbColor="#fff"
            />
          </View>

          {/* Privacy */}
          <TouchableOpacity style={styles.menuItem} onPress={handlePrivacy}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#4CAF50' }]}>
                <Feather name="lock" size={20} color="#fff" />
              </View>
              <View>
                <Text style={[styles.menuTitle, isDarkMode && styles.textDark]}>
                  Privacy & Security
                </Text>
                <Text style={[styles.menuSubtitle, isDarkMode && styles.textMuted]}>
                  Manage your privacy
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={isDarkMode ? '#666' : '#999'} />
          </TouchableOpacity>

          {/* Help */}
          <TouchableOpacity style={styles.menuItem} onPress={handleHelp}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#2196F3' }]}>
                <Feather name="help-circle" size={20} color="#fff" />
              </View>
              <View>
                <Text style={[styles.menuTitle, isDarkMode && styles.textDark]}>
                  Help & Support
                </Text>
                <Text style={[styles.menuSubtitle, isDarkMode && styles.textMuted]}>
                  Get help
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={isDarkMode ? '#666' : '#999'} />
          </TouchableOpacity>

          {/* About */}
          <TouchableOpacity style={styles.menuItem} onPress={handleAbout}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FFC107' }]}>
                <Feather name="info" size={20} color="#fff" />
              </View>
              <View>
                <Text style={[styles.menuTitle, isDarkMode && styles.textDark]}>
                  About
                </Text>
                <Text style={[styles.menuSubtitle, isDarkMode && styles.textMuted]}>
                  Version 1.0.0
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={isDarkMode ? '#666' : '#999'} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, isDarkMode && styles.logoutButtonDark]} 
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color="#FF4757" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.modalDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && styles.textDark]}>
                Edit Profile
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Feather name="x" size={24} color={isDarkMode ? '#fff' : '#333'} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, isDarkMode && styles.textDark]}>
                  First Name
                </Text>
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark]}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter first name"
                  placeholderTextColor={isDarkMode ? '#666' : '#999'}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, isDarkMode && styles.textDark]}>
                  Last Name
                </Text>
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark]}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter last name"
                  placeholderTextColor={isDarkMode ? '#666' : '#999'}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, isDarkMode && styles.textDark]}>
                  Email
                </Text>
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email"
                  placeholderTextColor={isDarkMode ? '#666' : '#999'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Privacy Modal */}
      <Modal
        visible={privacyModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.modalDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && styles.textDark]}>
                Privacy & Security
              </Text>
              <TouchableOpacity onPress={() => setPrivacyModalVisible(false)}>
                <Feather name="x" size={24} color={isDarkMode ? '#fff' : '#333'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <TouchableOpacity style={styles.privacyItem}>
                <Feather name="eye-off" size={20} color="#4CAF50" />
                <Text style={[styles.privacyText, isDarkMode && styles.textDark]}>
                  Hide my online status
                </Text>
                <Switch value={false} onValueChange={() => {}} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.privacyItem}>
                <Feather name="lock" size={20} color="#FF4757" />
                <Text style={[styles.privacyText, isDarkMode && styles.textDark]}>
                  Two-factor authentication
                </Text>
                <Feather name="chevron-right" size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.privacyItem}>
                <Feather name="shield" size={20} color="#2196F3" />
                <Text style={[styles.privacyText, isDarkMode && styles.textDark]}>
                  Data & Privacy
                </Text>
                <Feather name="chevron-right" size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.privacyItem}>
                <Feather name="trash-2" size={20} color="#FF9800" />
                <Text style={[styles.privacyText, isDarkMode && styles.textDark]}>
                  Delete Account
                </Text>
                <Feather name="chevron-right" size={20} color="#999" />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 48,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBED',
  },
  headerDark: {
    backgroundColor: '#000000ff',
    borderBottomColor: '#000',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoImage: {
    width: 120,
    height: 50,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A8FF00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  textDark: {
    color: '#FFFFFF',
  },
  textMuted: {
    color: '#999',
  },
  profileCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#111111ff',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF4757',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#A8FF00',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuSectionDark: {
    backgroundColor: '#000000ff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: '#FF4757',
  },
  logoutButtonDark: {
    backgroundColor: '#121212',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4757',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 0,
    maxHeight: '80%',
  },
  modalDark: {
    backgroundColor: '#2A2A2A',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBED',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputDark: {
    backgroundColor: '#1A1A1A',
    color: '#fff',
    borderColor: '#333',
  },
  saveButton: {
    backgroundColor: '#FF4757',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBED',
    gap: 12,
  },
  privacyText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});