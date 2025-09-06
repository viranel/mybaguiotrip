import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Animated, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import CustomText from '../../components/ui/CustomText';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';
import { useAuth } from '../../providers/AuthProvider';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading } = useAuth();
  const [slideAnim] = useState(new Animated.Value(300));

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    console.log('Attempting login with:', { email });
    const result = await signIn(email, password);
    console.log('Login result:', result);
    
    if (result.success) {
      // Don't show alert, let the index.tsx handle navigation
      console.log('Login successful, user should be redirected automatically');
      // Force navigation back to index to trigger the redirect logic
      setTimeout(() => {
        router.replace('/');
      }, 100);
    } else {
      console.error('Login error:', result.error);
      Alert.alert('Error', result.error || 'Login failed');
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google authentication would be implemented here');
  };

  const handleFacebookLogin = () => {
    Alert.alert('Facebook Login', 'Facebook authentication would be implemented here');
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
              Welcome Back
            </CustomText>
            <CustomText variant="body" style={styles.subtitle}>
              Sign in to continue your journey
            </CustomText>
          </View>

          {/* Email/Password Form */}
          <View style={styles.form}>
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

            <TouchableOpacity style={styles.forgotPassword}>
              <CustomText variant="caption" style={styles.forgotPasswordText}>
                Forgot Password?
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
              <CustomText variant="buttonText" style={styles.loginButtonText}>
                {loading ? 'Signing In...' : 'Sign In'}
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

          {/* Social Login Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
              <View style={styles.socialButtonContent}>
                <Ionicons name="logo-google" size={20} color="#DB4437" />
                <CustomText variant="buttonText" style={styles.socialButtonText}>
                  Continue with Google
                </CustomText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
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
            style={styles.signupLink}
            onPress={() => router.push('/auth/signup')}
          >
            <CustomText variant="body" style={styles.signupText}>
              Don't have an account? <CustomText style={styles.signupLinkText}>Sign Up</CustomText>
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
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: DesignTokens.spacing.lg,
  },
  forgotPasswordText: {
    color: Colors.neutrals.white,
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: 28,
    paddingVertical: DesignTokens.spacing.md,
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.lg,
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
    color: Colors.primary.orange500,
    fontSize: 16,
    fontWeight: '700',
  },
  signupLink: {
    alignItems: 'center',
  },
  signupText: {
    color: Colors.neutrals.gray200,
    fontSize: 16,
  },
  signupLinkText: {
    color: Colors.neutrals.white,
    fontWeight: '600',
  },
});
