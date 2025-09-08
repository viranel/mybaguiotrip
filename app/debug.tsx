import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import CustomText from '../components/ui/CustomText';
import { Colors } from '../constants/Colors';

export default function DebugScreen() {
  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Debug Information</CustomText>
      <CustomText style={styles.info}>Platform: {Platform.OS}</CustomText>
      <CustomText style={styles.info}>User Agent: {Platform.OS === 'web' ? navigator.userAgent : 'Native'}</CustomText>
      <CustomText style={styles.info}>App is working!</CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutrals.white,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.appIdentity.primaryBrand,
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: Colors.neutrals.gray600,
    marginBottom: 10,
    textAlign: 'center',
  },
});
