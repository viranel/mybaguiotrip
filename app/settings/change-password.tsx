import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, SafeAreaView, ScrollView, StyleSheet, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import CustomText from '../../components/ui/CustomText';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [screenSlideAnim] = useState(new Animated.Value(300)); // Start from right

  useEffect(() => {
    // Slide in from right animation
    Animated.spring(screenSlideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, []);

  const handleChangePassword = () => {
    // Validate required fields
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Validation Error', 'Please fill in all password fields.');
      return;
    }

    // Validate password length
    if (newPassword.length < 8) {
      Alert.alert('Validation Error', 'New password must be at least 8 characters long.');
      return;
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      Alert.alert('Validation Error', 'New password and confirmation do not match.');
      return;
    }

    // Validate password strength (basic check)
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      Alert.alert(
        'Password Requirements',
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    // Simulate API call
    Alert.alert(
      'Success',
      'Your password has been changed successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            // Clear form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            router.back();
          },
        },
      ]
    );
  };

  const togglePasswordVisibility = (type: 'current' | 'new' | 'confirm') => {
    switch (type) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  const isFormValid = currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.View 
        style={[
          styles.container,
          {
            transform: [{ translateX: screenSlideAnim }],
          }
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
      {/* Header with Gradient */}
      <View>
        <LinearGradient
          colors={Colors.gradients.primary || ['#FB923C', '#F97316']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={Colors.neutrals.white} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <CustomText variant="h2" style={styles.headerTitle}>Change Password</CustomText>
              <CustomText variant="body" style={styles.headerSubtitle}>Update your account security</CustomText>
            </View>
            <TouchableOpacity 
              style={[styles.saveButton, !isFormValid && styles.saveButtonDisabled]} 
              onPress={handleChangePassword}
              disabled={!isFormValid}
            >
              <CustomText variant="buttonText" style={styles.saveButtonText}>Update</CustomText>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Security Notice */}
        <View style={styles.noticeSection}>
          <View style={styles.securityNotice}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.functional.success} />
            <View style={styles.securityText}>
              <CustomText variant="bodySmall" style={styles.securityTitle}>Security First</CustomText>
              <CustomText variant="caption" style={styles.securitySubtitle}>
                Your password will be securely updated with encryption
              </CustomText>
            </View>
          </View>
        </View>

        {/* Password Form */}
        <View style={styles.formSection}>
          <CustomText variant="h3" style={styles.sectionTitle}>Password Information</CustomText>
          
          <View style={styles.inputGroup}>
            <CustomText variant="bodySmall" style={styles.inputLabel}>Current Password</CustomText>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter your current password"
                placeholderTextColor={Colors.neutrals.darkGray}
                secureTextEntry={!showCurrentPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => togglePasswordVisibility('current')}
              >
                <Ionicons 
                  name={showCurrentPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color={Colors.neutrals.darkGray} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <CustomText variant="bodySmall" style={styles.inputLabel}>New Password</CustomText>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter your new password"
                placeholderTextColor={Colors.neutrals.darkGray}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => togglePasswordVisibility('new')}
              >
                <Ionicons 
                  name={showNewPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color={Colors.neutrals.darkGray} 
                />
              </TouchableOpacity>
            </View>
            <CustomText variant="caption" style={styles.passwordHint}>
              Password must be at least 8 characters long
            </CustomText>
          </View>

          <View style={styles.inputGroup}>
            <CustomText variant="bodySmall" style={styles.inputLabel}>Confirm New Password</CustomText>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your new password"
                placeholderTextColor={Colors.neutrals.darkGray}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => togglePasswordVisibility('confirm')}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color={Colors.neutrals.darkGray} 
                />
              </TouchableOpacity>
            </View>
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <CustomText variant="caption" style={styles.errorText}>
                Passwords do not match
              </CustomText>
            )}
          </View>
        </View>

        {/* Password Requirements */}
        <View style={styles.formSection}>
          <CustomText variant="h3" style={styles.sectionTitle}>Password Requirements</CustomText>
          
          <View style={styles.requirementsList}>
            <View style={styles.requirementItem}>
              <Ionicons 
                name={newPassword.length >= 8 ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={newPassword.length >= 8 ? Colors.functional.success : Colors.neutrals.darkGray} 
              />
              <CustomText variant="bodySmall" style={styles.requirementText}>At least 8 characters</CustomText>
            </View>
            
            <View style={styles.requirementItem}>
              <Ionicons 
                name={/[A-Z]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={/[A-Z]/.test(newPassword) ? Colors.functional.success : Colors.neutrals.darkGray} 
              />
              <CustomText variant="bodySmall" style={styles.requirementText}>One uppercase letter</CustomText>
            </View>
            
            <View style={styles.requirementItem}>
              <Ionicons 
                name={/[a-z]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={/[a-z]/.test(newPassword) ? Colors.functional.success : Colors.neutrals.darkGray} 
              />
              <CustomText variant="bodySmall" style={styles.requirementText}>One lowercase letter</CustomText>
            </View>
            
            <View style={styles.requirementItem}>
              <Ionicons 
                name={/\d/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={/\d/.test(newPassword) ? Colors.functional.success : Colors.neutrals.darkGray} 
              />
              <CustomText variant="bodySmall" style={styles.requirementText}>One number</CustomText>
            </View>
          </View>
        </View>
      </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals.background,
  } as ViewStyle,
  safeArea: {
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  backButton: {
    width: 40,
    height: 40,
    borderRadius: DesignTokens.borderRadius.circular,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,
  headerTitle: {
    color: Colors.neutrals.white,
    marginBottom: DesignTokens.spacing.xs,
  } as TextStyle,
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  } as TextStyle,
  saveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: DesignTokens.borderRadius.medium,
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.sm,
  } as ViewStyle,
  saveButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  } as ViewStyle,
  saveButtonText: {
    color: Colors.neutrals.white,
    fontWeight: '600',
  } as TextStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    paddingBottom: 140,
  } as ViewStyle,
  noticeSection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.lg,
  } as ViewStyle,
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.functional.success}10`,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.spacing.md,
    borderWidth: 1,
    borderColor: `${Colors.functional.success}20`,
  } as ViewStyle,
  securityText: {
    marginLeft: DesignTokens.spacing.sm,
    flex: 1,
  } as ViewStyle,
  securityTitle: {
    color: Colors.functional.success,
    fontWeight: '600',
    marginBottom: 2,
  } as TextStyle,
  securitySubtitle: {
    color: Colors.neutrals.darkGray,
  } as TextStyle,
  formSection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.xl,
  } as ViewStyle,
  sectionTitle: {
    color: Colors.neutrals.charcoal,
    marginBottom: DesignTokens.spacing.lg,
  } as TextStyle,
  inputGroup: {
    marginBottom: DesignTokens.spacing.lg,
  } as ViewStyle,
  inputLabel: {
    color: Colors.neutrals.darkGray,
    marginBottom: DesignTokens.spacing.xs,
    fontWeight: '600',
  } as TextStyle,
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  } as ViewStyle,
  passwordInput: {
    flex: 1,
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.md,
    fontSize: DesignTokens.typography.body.fontSize,
    color: Colors.neutrals.charcoal,
  } as TextStyle,
  eyeButton: {
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.md,
  } as ViewStyle,
  passwordHint: {
    color: Colors.neutrals.darkGray,
    marginTop: DesignTokens.spacing.xs,
  } as TextStyle,
  errorText: {
    color: Colors.functional.error,
    marginTop: DesignTokens.spacing.xs,
  } as TextStyle,
  requirementsList: {
    gap: DesignTokens.spacing.sm,
  } as ViewStyle,
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.sm,
  } as ViewStyle,
  requirementText: {
    color: Colors.neutrals.darkGray,
  } as TextStyle,
});
