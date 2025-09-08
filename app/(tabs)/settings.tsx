import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Animated, Image, SafeAreaView, StyleSheet, Switch, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import CustomText from '../../components/ui/CustomText';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';
import { useAuth } from '../../providers/AuthProvider';


interface SettingsItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  color: string;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}


const profileSettings: SettingsItem[] = [
  {
    id: 'edit-profile',
    title: 'Edit Profile',
    subtitle: 'Update your personal information',
    icon: 'person',
    color: Colors.appIdentity.primaryBrand,
    type: 'navigation',
  },
  {
    id: 'payment-methods',
    title: 'Add Payment Methods',
    subtitle: 'Manage your payment options',
    icon: 'card',
    color: Colors.secondary.coral,
    type: 'navigation',
  },
  {
    id: 'change-password',
    title: 'Change Password',
    subtitle: 'Update your account security',
    icon: 'lock-closed',
    color: Colors.functional.warning,
    type: 'navigation',
  },
];

const appPreferences: SettingsItem[] = [
  {
    id: 'dark-mode',
    title: 'Dark Mode',
    subtitle: 'Switch between light and dark themes',
    icon: 'moon',
    color: Colors.appIdentity.primaryBrand,
    type: 'toggle',
    value: false,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Manage your notification preferences',
    icon: 'notifications',
    color: Colors.functional.success,
    type: 'toggle',
    value: true,
  },
  {
    id: 'language',
    title: 'App Language',
    subtitle: 'Change the app language',
    icon: 'language',
    color: Colors.secondary.teal,
    type: 'navigation',
  },
];

const supportItems: SettingsItem[] = [
  {
    id: 'help-center',
    title: 'Help Center',
    subtitle: 'Find answers to common questions',
    icon: 'help-circle',
    color: Colors.appIdentity.primaryBrand,
    type: 'navigation',
  },
  {
    id: 'contact-us',
    title: 'Contact Us',
    subtitle: 'Get in touch with our support team',
    icon: 'mail',
    color: Colors.functional.success,
    type: 'navigation',
  },
  {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    subtitle: 'Read our privacy policy',
    icon: 'shield-checkmark',
    color: Colors.functional.warning,
    type: 'navigation',
  },
];

// Development items removed for production

export default function SettingsScreen() {
  const { user, signOut, loading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));


  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleItemPress = (item: SettingsItem) => {
    // Add haptic feedback animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Navigate to appropriate page based on item id
    switch (item.id) {
      case 'edit-profile':
        router.push('/settings/edit-profile');
        break;
      case 'payment-methods':
        router.push('/settings/payment-methods');
        break;
      case 'change-password':
        router.push('/settings/change-password');
        break;
      case 'language':
        router.push('/settings/language');
        break;
      case 'help-center':
        router.push('/settings/help-center');
        break;
      case 'contact-us':
        router.push('/settings/contact-us');
        break;
      case 'privacy-policy':
        router.push('/settings/privacy-policy');
        break;
      default:
        console.log('Pressed:', item.title);
    }
  };


  const handleToggle = (itemId: string, value: boolean) => {
    if (itemId === 'dark-mode') {
      setDarkMode(value);
    } else if (itemId === 'notifications') {
      setNotifications(value);
    }
  };

  const handleLogout = async () => {
    console.log('handleLogout called');
    
    try {
      // Simple direct logout without confirmation for now
      console.log('Starting direct logout...');
      const result = await signOut();
      console.log('SignOut result:', result);
      
      if (result.success) {
        console.log('Logout successful, redirecting...');
        router.replace('/auth/login');
      } else {
        console.error('Logout failed:', result.error);
        Alert.alert('Error', 'Failed to logout. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Modern Header with Gradient */}
      <LinearGradient
        colors={Colors.gradients.primary || ['#FB923C', '#F97316']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <CustomText variant="h2" style={styles.headerTitle}>Account</CustomText>
            <CustomText variant="body" style={styles.headerSubtitle}>Manage your profile and preferences</CustomText>
          </View>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim }]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Section */}
        <Animated.View style={[styles.profileSection, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' }}
                  style={styles.profileImage}
                />
                <TouchableOpacity style={styles.editImageButton}>
                  <Ionicons name="camera" size={16} color={Colors.neutrals.white} />
                </TouchableOpacity>
              </View>
              <View style={styles.profileDetails}>
                <CustomText variant="h2" style={styles.profileName}>
                  {user?.fullName || user?.email?.split('@')[0] || 'Guest User'}
                </CustomText>
                <CustomText variant="bodySmall" style={styles.profileUsername}>
                  {user ? `@${user.email?.split('@')[0]}` : '@guest'}
                </CustomText>
              </View>
            </View>
          </View>
        </Animated.View>


        {/* Profile Settings */}
        <View style={styles.settingsSection}>
          <CustomText variant="h3" style={styles.sectionTitle}>Profile Settings</CustomText>
          {profileSettings.map((item, index) => (
            <Animated.View
              key={item.id}
              style={{
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
              }}
            >
              <TouchableOpacity
                style={styles.settingsItem}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.8}
              >
                <View style={[styles.itemIcon, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <View style={styles.itemContent}>
                  <CustomText variant="h3" style={styles.itemTitle}>{item.title}</CustomText>
                  {item.subtitle && (
                    <CustomText variant="bodySmall" style={styles.itemSubtitle}>{item.subtitle}</CustomText>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.neutrals.gray600} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* App Preferences */}
        <View style={styles.settingsSection}>
          <CustomText variant="h3" style={styles.sectionTitle}>App Preferences</CustomText>
          {appPreferences.map((item, index) => (
            <Animated.View
              key={item.id}
              style={{
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
              }}
            >
              <View style={styles.settingsItem}>
                <View style={[styles.itemIcon, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <View style={styles.itemContent}>
                  <CustomText variant="h3" style={styles.itemTitle}>{item.title}</CustomText>
                  {item.subtitle && (
                    <CustomText variant="bodySmall" style={styles.itemSubtitle}>{item.subtitle}</CustomText>
                  )}
                </View>
                {item.type === 'toggle' ? (
                  <Switch
                    value={item.id === 'dark-mode' ? darkMode : notifications}
                    onValueChange={(value) => handleToggle(item.id, value)}
                    trackColor={{ false: Colors.neutrals.gray300, true: Colors.appIdentity.primaryBrand }}
                    thumbColor={Colors.neutrals.white}
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color={Colors.neutrals.gray600} />
                )}
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Support */}
        <View style={styles.settingsSection}>
          <CustomText variant="h3" style={styles.sectionTitle}>Support</CustomText>
          {supportItems.map((item, index) => (
            <Animated.View
              key={item.id}
              style={{
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
              }}
            >
              <TouchableOpacity
                style={styles.settingsItem}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.8}
              >
                <View style={[styles.itemIcon, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <View style={styles.itemContent}>
                  <CustomText variant="h3" style={styles.itemTitle}>{item.title}</CustomText>
                  {item.subtitle && (
                    <CustomText variant="bodySmall" style={styles.itemSubtitle}>{item.subtitle}</CustomText>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.neutrals.gray600} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>



        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={handleLogout}
            >
              <Ionicons name="log-out" size={20} color={Colors.functional.error} />
              <CustomText variant="buttonText" style={styles.logoutButtonText}>Logout</CustomText>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals.white,
  } as ViewStyle,
  header: {
    paddingTop: DesignTokens.spacing.xl,
    paddingBottom: DesignTokens.spacing.xl,
    paddingHorizontal: DesignTokens.spacing.lg,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  headerLeft: {
    flex: 1,
  } as ViewStyle,
  headerTitle: {
    color: Colors.neutrals.white,
    marginBottom: DesignTokens.spacing.xs,
  } as TextStyle,
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  } as TextStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    paddingBottom: 140,
  } as ViewStyle,
  profileSection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.lg,
  } as ViewStyle,
  profileCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.accessibility.cardPadding,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
  } as ViewStyle,
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  profileImageContainer: {
    position: 'relative',
    marginRight: DesignTokens.spacing.md,
  } as ViewStyle,
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: DesignTokens.borderRadius.circular,
  } as any,
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.appIdentity.primaryBrand,
    borderRadius: DesignTokens.borderRadius.circular,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.neutrals.white,
  } as ViewStyle,
  profileDetails: {
    flex: 1,
  } as ViewStyle,
  profileName: {
    color: Colors.neutrals.gray900,
    marginBottom: DesignTokens.spacing.xs,
  } as TextStyle,
  profileUsername: {
    color: Colors.neutrals.gray600,
  } as TextStyle,
  settingsSection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.xl,
  } as ViewStyle,
  sectionTitle: {
    color: Colors.neutrals.gray900,
    marginBottom: DesignTokens.spacing.lg,
  } as TextStyle,
  settingsItem: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.accessibility.cardPadding,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.sm,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
  } as ViewStyle,
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: DesignTokens.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DesignTokens.spacing.md,
  } as ViewStyle,
  itemContent: {
    flex: 1,
  } as ViewStyle,
  itemTitle: {
    color: Colors.neutrals.gray900,
    marginBottom: 2,
  } as TextStyle,
  itemSubtitle: {
    color: Colors.neutrals.gray600,
  } as TextStyle,
  logoutSection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.xl,
  } as ViewStyle,
  logoutButton: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    paddingVertical: DesignTokens.spacing.md,
    paddingHorizontal: DesignTokens.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DesignTokens.spacing.sm,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.functional.error,
  } as ViewStyle,
  logoutButtonText: {
    color: Colors.functional.error,
  } as TextStyle,
  bottomSpacing: {
    height: DesignTokens.spacing.xl,
  } as ViewStyle,
});
