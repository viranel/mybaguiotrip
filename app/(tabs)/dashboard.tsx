import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import CustomText from '../../components/ui/CustomText';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';

export default function DashboardScreenSimple() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <CustomText variant="h1" style={styles.title}>
          Welcome to My Baguio Trip!
        </CustomText>
        <CustomText variant="body" style={styles.subtitle}>
          Your dashboard is loading...
        </CustomText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DesignTokens.spacing.lg,
  },
  title: {
    color: Colors.appIdentity.primaryBrand,
    textAlign: 'center',
    marginBottom: DesignTokens.spacing.md,
  },
  subtitle: {
    color: Colors.neutrals.gray600,
    textAlign: 'center',
  },
});
