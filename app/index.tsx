import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import CustomText from '../components/ui/CustomText';
import { Colors } from '../constants/Colors';
import { useAuth } from '../providers/AuthProvider';

export default function Index() {
  console.log('Index.tsx - Component mounted/rendered');
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('Index.tsx - User state:', user);
    console.log('Index.tsx - Auth loading:', authLoading);
    console.log('Index.tsx - App loading:', isLoading);
    console.log('Index.tsx - Component re-rendered');
  }, [user, authLoading, isLoading]);

  // Add a separate effect to track when user changes
  useEffect(() => {
    if (user) {
      console.log('Index.tsx - User detected, should redirect to dashboard');
    } else {
      console.log('Index.tsx - No user, should redirect to login');
    }
  }, [user]);

  // Force re-render when user changes
  const userKey = user ? `user-${user.id}` : 'no-user';

  if (isLoading || authLoading) {
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

  if (user) {
    console.log('Redirecting to dashboard for user:', user.email);
    // Add a small delay to ensure auth state is stable
    return <Redirect key={userKey} href="/(tabs)/dashboard" />;
  } else {
    console.log('Redirecting to login - no user');
    return <Redirect key={userKey} href="/auth/login" />;
  }
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
