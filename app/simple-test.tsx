import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import CustomText from '../components/ui/CustomText';
import { Colors } from '../constants/Colors';

export default function SimpleTestScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <CustomText variant="h1" style={styles.title}>
          🏔️ My Baguio Trip
        </CustomText>
        
        <View style={styles.section}>
          <CustomText variant="h2" style={styles.sectionTitle}>
            ✅ Web App is Working!
          </CustomText>
          <CustomText variant="body" style={styles.info}>
            Platform: {Platform.OS}
          </CustomText>
          <CustomText variant="body" style={styles.info}>
            Time: {new Date().toLocaleString()}
          </CustomText>
        </View>

        <View style={styles.section}>
          <CustomText variant="h2" style={styles.sectionTitle}>
            🎯 Features Available
          </CustomText>
          <CustomText variant="body" style={styles.info}>
            ✅ Responsive Design
          </CustomText>
          <CustomText variant="body" style={styles.info}>
            ✅ Navigation Working
          </CustomText>
          <CustomText variant="body" style={styles.info}>
            ✅ Components Loading
          </CustomText>
          <CustomText variant="body" style={styles.info}>
            ✅ Web Optimization
          </CustomText>
        </View>

        <View style={styles.section}>
          <CustomText variant="h2" style={styles.sectionTitle}>
            🚀 Next Steps
          </CustomText>
          <CustomText variant="body" style={styles.info}>
            1. Navigate to /(tabs) to see the main app
          </CustomText>
          <CustomText variant="body" style={styles.info}>
            2. Test all the features
          </CustomText>
          <CustomText variant="body" style={styles.info}>
            3. Check responsive design
          </CustomText>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals.white,
  },
  content: {
    padding: 20,
    paddingTop: 90, // Account for web navigation bar
  },
  title: {
    color: Colors.appIdentity.primaryBrand,
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: Colors.neutrals.gray50,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.appIdentity.primaryBrand,
  },
  sectionTitle: {
    color: Colors.neutrals.gray900,
    marginBottom: 15,
    fontSize: 20,
    fontWeight: '600',
  },
  info: {
    color: Colors.neutrals.gray700,
    marginBottom: 8,
    lineHeight: 24,
    fontSize: 16,
  },
});
