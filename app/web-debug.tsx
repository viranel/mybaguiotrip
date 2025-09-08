import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import CustomText from '../components/ui/CustomText';
import { Colors } from '../constants/Colors';

export default function WebDebug() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Direct navigation to login for web
      console.log('Web debug mode - navigating directly to login');
      router.replace('/auth/login');
    }
  }, []);

  return (
    <View style={styles.container}>
      <CustomText style={styles.text}>
        Web Debug Mode - Redirecting...
      </CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutrals.white,
  },
  text: {
    fontSize: 18,
    color: Colors.neutrals.gray600,
  },
});
