import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Animated, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import CustomText from '../../components/ui/CustomText';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';
import { useAuth } from '../../providers/AuthProvider';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp, loading } = useAuth();
  const [slideAnim] = useState(new Animated.Value(300));

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, []);

  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    console.log('Starting signup process...');
    const result = await signUp(email, password, fullName);
    console.log('Signup result:', result);
    
    if (result.success) {
      if ((result as any).needsConfirmation) {
        Alert.alert(
          'Check Your Email', 
          'Account created! Please check your email and click the confirmation link to activate your account.',
          [
            { text: 'OK', onPress: () => router.replace('/auth/login') }
          ]
        );
      } else {
        // Navigate directly to tabs to avoid intermediate redirects on Android
        console.log('Signup successful, navigating to home tabs');
          router.replace('/(tabs)');
      }
    } else {
      console.error('Signup error:', result.error);
      Alert.alert('Error', result.error || 'Signup failed');
    }
  };

  const handleGoogleSignup = () => {
    Alert.alert('Google Signup', 'Google authentication would be implemented here');
  };

  const handleFacebookSignup = () => {
    Alert.alert('Facebook Signup', 'Facebook authentication would be implemented here');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFB366', '#FF8C42', '#FF7A2E']}
        style={styles.gradient}
      >
        <Animated.View style={[styles.content, { transform: [{ translateX: slideAnim }] }]}>
          {/* Header with Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="airplane" size={40} color={Colors.neutrals.white} />
            </View>
            <CustomText variant="h1" style={styles.title}>
              Create Account
            </CustomText>
            <CustomText variant="body" style={styles.subtitle}>
              Join us and start planning your trips
            </CustomText>
          </View>

          {/* Email/Password Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={Colors.neutrals.gray500} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={Colors.neutrals.gray500}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={Colors.neutrals.gray500} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={Colors.neutrals.gray500}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.neutrals.gray500} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.neutrals.gray500}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color={Colors.neutrals.gray500} 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.neutrals.gray500} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={Colors.neutrals.gray500}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color={Colors.neutrals.gray500} 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
              <CustomText variant="buttonText" style={styles.signupButtonText}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </CustomText>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <CustomText variant="caption" style={styles.dividerText}>
              OR
            </CustomText>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Signup Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignup}>
              <View style={styles.socialButtonContent}>
                <Ionicons name="logo-google" size={20} color="#DB4437" />
                <CustomText variant="buttonText" style={styles.socialButtonText}>
                  Continue with Google
                </CustomText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} onPress={handleFacebookSignup}>
              <View style={styles.socialButtonContent}>
                <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                <CustomText variant="buttonText" style={styles.socialButtonText}>
                  Continue with Facebook
                </CustomText>
              </View>
            </TouchableOpacity>
          </View>

          {/* Navigation Link */}
          <TouchableOpacity 
            style={styles.loginLink}
            onPress={() => router.push('/auth/login')}
          >
            <CustomText variant="body" style={styles.loginText}>
              Already have an account? <CustomText style={styles.loginLinkText}>Sign In</CustomText>
            </CustomText>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: DesignTokens.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: DesignTokens.spacing.lg,
  },
  title: {
    color: Colors.neutrals.white,
    marginBottom: DesignTokens.spacing.sm,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.neutrals.gray200,
    textAlign: 'center',
    fontSize: 16,
  },
  socialContainer: {
    marginBottom: DesignTokens.spacing.xl,
  },
  socialButton: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: 28,
    marginBottom: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    color: Colors.neutrals.gray900,
    marginLeft: DesignTokens.spacing.sm,
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: Colors.neutrals.gray200,
    marginHorizontal: DesignTokens.spacing.md,
    fontSize: 14,
    fontWeight: '500',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutrals.white,
    borderRadius: 28,
    marginBottom: DesignTokens.spacing.md,
    paddingHorizontal: DesignTokens.spacing.md,
    height: 56,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    marginRight: DesignTokens.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.neutrals.gray900,
  },
  eyeIcon: {
    padding: DesignTokens.spacing.xs,
  },
  signupButton: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: 28,
    paddingVertical: DesignTokens.spacing.md,
    alignItems: 'center',
    marginTop: DesignTokens.spacing.lg,
    marginBottom: DesignTokens.spacing.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signupButtonText: {
    color: Colors.primary.orange500,
    fontSize: 16,
    fontWeight: '700',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: DesignTokens.spacing.lg,
  },
  loginText: {
    color: Colors.neutrals.gray200,
    fontSize: 16,
  },
  loginLinkText: {
    color: Colors.neutrals.white,
    fontWeight: '600',
  },
});
