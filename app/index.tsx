import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import CustomText from '../components/ui/CustomText';
import { Colors } from '../constants/Colors';
import { useAuth } from '../providers/AuthProvider';

export default function Index() {
  console.log('Index.tsx - Component mounted/rendered');
  const [isLoading, setIsLoading] = useState(true);
  const [forceNavigation, setForceNavigation] = useState(false);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Add a timeout to force navigation if auth takes too long
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('Index.tsx - Auth timeout, forcing navigation');
      setForceNavigation(true);
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    try {
      console.log('Index.tsx - User state:', user);
      console.log('Index.tsx - Auth loading:', authLoading);
      console.log('Index.tsx - App loading:', isLoading);
      console.log('Index.tsx - Component re-rendered');
    } catch (error) {
      console.error('Index.tsx - Error in useEffect:', error);
    }
  }, [user, authLoading, isLoading]);

  // Add a separate effect to track when user changes
  useEffect(() => {
    try {
      if (user) {
        console.log('Index.tsx - User detected, should redirect to dashboard');
      } else {
        console.log('Index.tsx - No user, should redirect to login');
      }
    } catch (error) {
      console.error('Index.tsx - Error in user change effect:', error);
    }
  }, [user]);

  // Force re-render when user changes
  const userKey = user ? `user-${user.id}` : 'no-user';

  // Navigate once loading is complete or force navigation is triggered
  useEffect(() => {
    if ((isLoading || authLoading) && !forceNavigation) return;
    try {
      if (user) {
        console.log('Routing to dashboard for user:', user.email);
        router.replace('/(tabs)');
      } else {
        console.log('Routing to login - no user');
        router.replace('/auth/login');
      }
    } catch (e) {
      console.error('Index.tsx - navigation error', e);
      // Fallback navigation if there's an error
      router.replace('/auth/login');
    }
  }, [isLoading, authLoading, user, userKey, forceNavigation]);

  // Always render a lightweight loading state; navigation will replace this screen
  return (
    <View style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.appIdentity.primaryBrand} />
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
  },
  loadingSubtext: {
    marginTop: 8,
    color: Colors.neutrals.gray600,
    textAlign: 'center',
  },
});
