import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Animated, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';
import CustomText from '../ui/CustomText';

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'plan-itineraries',
    title: 'Plan Itineraries',
    subtitle: 'Create AI-powered plans',
    icon: 'sparkles',
    color: Colors.appIdentity.primaryBrand,
    route: '/(tabs)/planner',
  },
  {
    id: 'find-hotels',
    title: 'Find Hotels',
    subtitle: 'Browse accommodations',
    icon: 'bed',
    color: Colors.secondary.coral,
    route: '/hotels',
  },
  {
    id: 'discover-spots',
    title: 'Discover Spots',
    subtitle: 'Explore attractions',
    icon: 'location',
    color: Colors.functional.success,
    route: '/attractions',
  },
  {
    id: 'show-itineraries',
    title: 'Show Itineraries',
    subtitle: 'View your trips',
    icon: 'airplane',
    color: Colors.appIdentity.accentBrand,
    route: '/(tabs)/trips',
  },
];

export default function QuickActions() {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleActionPress = (action: QuickAction) => {
    // Add haptic feedback animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    router.push(action.route as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomText variant="h2" style={styles.title}>Quick Actions</CustomText>
        <CustomText variant="bodySmall" style={styles.subtitle}>Get started with your Baguio adventure</CustomText>
      </View>
      
      <View style={styles.grid}>
        {quickActions.map((action, index) => (
          <Animated.View
            key={action.id}
            style={[
              styles.actionCard,
              {
                transform: [{ scale: scaleAnim }],
              }
            ]}
          >
            <TouchableOpacity
              style={styles.actionCardInner}
              onPress={() => handleActionPress(action)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${action.color}15` }]}>
                <Ionicons name={action.icon} size={DesignTokens.iconSizes.actionPrimary} color={action.color} />
              </View>
              
              <View style={styles.actionContent}>
                <CustomText variant="h3" style={styles.actionTitle}>{action.title}</CustomText>
                <CustomText variant="bodySmall" style={styles.actionSubtitle}>{action.subtitle}</CustomText>
              </View>
              
              <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={16} color={Colors.neutrals.darkGray} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: DesignTokens.spacing.sm,
    paddingHorizontal: DesignTokens.spacing.lg,
  } as ViewStyle,
  header: {
    marginBottom: DesignTokens.spacing.lg,
  } as ViewStyle,
  title: {
    color: Colors.neutrals.charcoal,
    marginBottom: DesignTokens.spacing.xs,
  } as TextStyle,
  subtitle: {
    color: Colors.neutrals.darkGray,
  } as TextStyle,
  grid: {
    gap: DesignTokens.spacing.sm,
  } as ViewStyle,
  actionCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
  } as ViewStyle,
  actionCardInner: {
    padding: DesignTokens.accessibility.cardPadding,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: DesignTokens.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DesignTokens.spacing.md,
  } as ViewStyle,
  actionContent: {
    flex: 1,
  } as ViewStyle,
  actionTitle: {
    color: Colors.neutrals.charcoal,
    marginBottom: 4,
  } as TextStyle,
  actionSubtitle: {
    color: Colors.neutrals.darkGray,
  } as TextStyle,
  arrowContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
});
