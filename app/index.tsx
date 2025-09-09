import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import CustomText from '../components/ui/CustomText';
import { Colors } from '../constants/Colors';

export default function Index() {
  console.log('Index.tsx - Component mounted/rendered');
  const isWeb = Platform.OS === 'web';

  // Simple navigation logic - bypass all authentication for web
  useEffect(() => {
    console.log('Index.tsx - Starting navigation logic for platform:', Platform.OS);
    
    const timer = setTimeout(() => {
      try {
        if (isWeb) {
          console.log('Index.tsx - Web platform, navigating to web login...');
          router.replace('/auth/web-login');
        } else {
          console.log('Index.tsx - Mobile platform, navigating to dashboard...');
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Index.tsx - Navigation error:', error);
        // Try alternative navigation
        try {
          router.push(isWeb ? '/auth/web-login' : '/(tabs)');
        } catch (pushError) {
          console.error('Index.tsx - Push navigation also failed:', pushError);
        }
      }
    }, 2000); // 2 second delay to ensure everything loads

    return () => clearTimeout(timer);
  }, [isWeb]);

  // Always render a loading state
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
          {isWeb ? 'Loading web app...' : 'Loading your adventure...'}
        </CustomText>
        <CustomText variant="caption" style={styles.debugText}>
          Platform: {Platform.OS} | Time: {new Date().toLocaleTimeString()}
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
  debugText: {
    color: Colors.neutrals.gray500,
    textAlign: 'center',
    fontSize: 12,
    marginTop: 10,
  },
});
