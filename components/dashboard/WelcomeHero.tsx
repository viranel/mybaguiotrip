import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';
import CustomText from '../ui/CustomText';

interface WelcomeHeroProps {
  user?: {
    full_name?: string;
  };
}

export default function WelcomeHero({ user }: WelcomeHeroProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSettings = () => {
    router.push('/(tabs)/settings');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.primary || ['#FB923C', '#F97316']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.textSection}>
            <View style={styles.greetingContainer}>
              <CustomText variant="h2" style={styles.greeting}>
                {getGreeting()}, {user?.full_name?.split(' ')[0] || 'Traveler'}! 👋
              </CustomText>
            </View>
            
            <CustomText variant="body" style={styles.description}>
              Ready to explore Baguio? Let's create your perfect adventure with AI-powered recommendations.
            </CustomText>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleSettings}>
                <Ionicons name="settings" size={DesignTokens.iconSizes.actionPrimary} color={Colors.neutrals.white} />
                <CustomText variant="buttonText" style={styles.primaryButtonText}>Settings</CustomText>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.iconSection}>
            <View style={styles.iconContainer}>
              <Ionicons name="airplane" size={32} color={Colors.neutrals.white} />
            </View>
            <View style={styles.sparkleContainer}>
              <Ionicons name="sparkles" size={16} color="#FFD700" />
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.md,
    borderRadius: DesignTokens.borderRadius.extraLarge,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  } as ViewStyle,
  gradient: {
    borderRadius: DesignTokens.borderRadius.extraLarge,
  } as ViewStyle,
  content: {
    padding: DesignTokens.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 180,
  } as ViewStyle,
  textSection: {
    flex: 1,
    marginRight: DesignTokens.spacing.lg,
  } as ViewStyle,
  greetingContainer: {
    marginBottom: DesignTokens.spacing.sm,
  } as ViewStyle,
  greeting: {
    color: Colors.neutrals.white,
    lineHeight: DesignTokens.typography.h2.lineHeight,
  } as TextStyle,
  description: {
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: DesignTokens.typography.body.lineHeight,
    marginBottom: DesignTokens.spacing.lg,
  } as TextStyle,
  buttonContainer: {
    gap: DesignTokens.spacing.sm,
  } as ViewStyle,
  primaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: DesignTokens.borderRadius.medium,
    paddingVertical: DesignTokens.spacing.sm,
    paddingHorizontal: DesignTokens.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minHeight: DesignTokens.accessibility.minTouchTarget,
  } as ViewStyle,
  primaryButtonText: {
    color: Colors.neutrals.white,
    marginLeft: DesignTokens.spacing.sm,
  } as TextStyle,
  iconSection: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: DesignTokens.borderRadius.circular,
    backgroundColor: 'rgba(254, 247, 240, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(254, 247, 240, 0.5)',
  } as ViewStyle,
  sparkleContainer: {
    position: 'absolute',
    top: -DesignTokens.spacing.sm,
    right: -DesignTokens.spacing.sm,
    width: 32,
    height: 32,
    borderRadius: DesignTokens.borderRadius.medium,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
});
