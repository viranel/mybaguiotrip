import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';
import CustomText from '../ui/CustomText';

interface TripStat {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route?: string;
}

const tripStats: TripStat[] = [
  {
    id: 'total-trips',
    title: 'Total Trips',
    value: '3',
    subtitle: 'Planned adventures',
    icon: 'airplane',
    color: Colors.appIdentity.accentBrand,
  },
  {
    id: 'saved-places',
    title: 'Saved Places',
    value: '12',
    subtitle: 'Favorites',
    icon: 'heart',
    color: Colors.functional.error,
  },
  {
    id: 'completed',
    title: 'Completed',
    value: '2',
    subtitle: 'Trips finished',
    icon: 'checkmark-circle',
    color: Colors.functional.success,
  },
  {
    id: 'upcoming',
    title: 'Upcoming',
    value: '1',
    subtitle: 'Next adventure',
    icon: 'calendar',
    color: Colors.appIdentity.primaryBrand,
  },
];

export default function TripStats() {
  const handleStatPress = (stat: TripStat) => {
    if (stat.route) {
      router.push(stat.route as any);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomText variant="h2" style={styles.title}>Your Trip Stats</CustomText>
        <CustomText variant="bodySmall" style={styles.subtitle}>Track your Baguio adventures</CustomText>
      </View>
      
      <View style={styles.grid}>
        {tripStats.map((stat) => (
          <TouchableOpacity
            key={stat.id}
            style={[
              styles.statCard,
              stat.route && styles.clickableCard
            ]}
            onPress={() => handleStatPress(stat)}
            activeOpacity={stat.route ? 0.8 : 1}
            disabled={!stat.route}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${stat.color}15` }]}>
              <Ionicons name={stat.icon} size={DesignTokens.iconSizes.actionSecondary} color={stat.color} />
            </View>
            
            <View style={styles.statContent}>
              <CustomText variant="h1" style={styles.statValue}>{stat.value}</CustomText>
              <CustomText variant="h3" style={styles.statTitle}>{stat.title}</CustomText>
              <CustomText variant="caption" style={styles.statSubtitle}>{stat.subtitle}</CustomText>
            </View>
            
            {stat.route && (
              <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={14} color={Colors.neutrals.darkGray} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.viewAllButton}
        onPress={() => console.log('View all trips')}
        activeOpacity={0.8}
      >
        <CustomText variant="body" style={styles.viewAllText}>View All Trips</CustomText>
        <Ionicons name="arrow-forward" size={16} color={Colors.appIdentity.primaryBrand} />
      </TouchableOpacity>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DesignTokens.spacing.sm,
    marginBottom: DesignTokens.spacing.lg,
  } as ViewStyle,
  statCard: {
    width: '48%',
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.accessibility.cardPadding,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
  } as ViewStyle,
  clickableCard: {
    borderColor: Colors.neutrals.gray300,
  } as ViewStyle,
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: DesignTokens.borderRadius.small,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: DesignTokens.spacing.sm,
  } as ViewStyle,
  statContent: {
    alignItems: 'flex-start',
  } as ViewStyle,
  statValue: {
    color: Colors.neutrals.charcoal,
    marginBottom: DesignTokens.spacing.xs,
  } as TextStyle,
  statTitle: {
    color: Colors.neutrals.charcoal,
    marginBottom: 4,
  } as TextStyle,
  statSubtitle: {
    color: Colors.neutrals.darkGray,
  } as TextStyle,
  arrowContainer: {
    position: 'absolute',
    top: DesignTokens.spacing.sm,
    right: DesignTokens.spacing.sm,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DesignTokens.spacing.sm,
    paddingVertical: DesignTokens.spacing.md,
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  } as ViewStyle,
  viewAllText: {
    fontWeight: '600',
    color: Colors.appIdentity.primaryBrand,
  } as TextStyle,
});
