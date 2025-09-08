import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import CustomText from '../components/ui/CustomText';
import { Colors } from '../constants/Colors';
import { useAuth } from '../providers/AuthProvider';

export default function Index() {
  console.log('Index.tsx - Component mounted/rendered');
  const { user, loading: authLoading } = useAuth();

  // Simplified navigation logic
  useEffect(() => {
    console.log('Index.tsx - Auth state changed:', { 
      user: user?.email || 'No user', 
      authLoading,
      platform: Platform.OS 
    });

    // Don't navigate while auth is still loading
    if (authLoading) {
      console.log('Index.tsx - Auth still loading, waiting...');
      return;
    }

    // Add a small delay to ensure everything is ready
    const timer = setTimeout(() => {
      try {
        if (user) {
          console.log('Index.tsx - User found, navigating to tabs:', user.email);
          router.replace('/(tabs)');
        } else {
          console.log('Index.tsx - No user, navigating to login');
          router.replace('/auth/login');
        }
      } catch (error) {
        console.error('Index.tsx - Navigation error:', error);
        // Fallback to login
        router.replace('/auth/login');
      }
    }, 500); // Small delay to ensure smooth transition

    return () => clearTimeout(timer);
  }, [user, authLoading]);

  // Fallback timeout in case auth gets stuck
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      console.log('Index.tsx - Fallback timeout reached, forcing navigation to login');
      try {
        router.replace('/auth/login');
      } catch (error) {
        console.error('Index.tsx - Fallback navigation error:', error);
      }
    }, 10000); // 10 second fallback

    return () => clearTimeout(fallbackTimer);
  }, []);

  // Always render a lightweight loading state; navigation will replace this screen
  return (
    <View style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          size="large" 
          color={Colors.appIdentity.primaryBrand}
          accessibilityLabel="Loading application"
          accessibilityRole="progressbar"
        />
        <CustomText variant="h3" style={styles.loadingText}>
          My Baguio Trip
        </CustomText>
        <CustomText variant="body" style={styles.loadingSubtext}>
          Loading your adventure...
        </CustomText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 20,
    color: Colors.appIdentity.primaryBrand,
    textAlign: 'center',
    // Use modern CSS properties for better compatibility
    fontSize: 24,
    fontWeight: '600',
  },
  loadingSubtext: {
    marginTop: 8,
    color: Colors.neutrals.gray600,
    textAlign: 'center',
    fontSize: 16,
  },
});
