import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import AnimatedScreen from '../components/ui/AnimatedScreen';
import CustomText from '../components/ui/CustomText';
import { Colors } from '../constants/Colors';
import { DesignTokens } from '../constants/DesignTokens';
import { tripsService } from '../lib/trips';
import { useAuth } from '../providers/AuthProvider';

interface Activity {
  time: string;
  name: string;
  location: string;
  description: string;
  duration: string;
  cost: number;
  category: 'attraction' | 'food' | 'accommodation' | 'transport' | 'shopping' | 'entertainment';
  bookingRequired?: boolean;
  tips?: string;
}

interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
  estimatedCost: number;
  notes?: string;
}

interface GeneratedItinerary {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  travelers: number;
  totalBudget: number;
  currency: string;
  preference: string;
  days: ItineraryDay[];
  summary: string;
  tips: string[];
  createdAt: string;
}

export default function ItineraryDetailScreen() {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadItinerary();
  }, []);

  const loadItinerary = async () => {
    try {
      if (!user?.id) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const itineraryId = params.itineraryId as string;
      if (!itineraryId) {
        setError('No itinerary ID provided');
        setLoading(false);
        return;
      }

      if (!user.email) {
        setError('User email not available');
        setLoading(false);
        return;
      }

      console.log('🔍 Loading itinerary for user:', user.email, 'ID:', itineraryId);
      
      const loadedItinerary = tripsService.getTripById(itineraryId, user.email);
      
      if (!loadedItinerary) {
        setError('Itinerary not found for this user');
        setLoading(false);
        return;
      }

      // Validate itinerary data
      if (!loadedItinerary.title || !loadedItinerary.days || loadedItinerary.days.length === 0) {
        setError('Invalid itinerary data: missing required fields');
        setLoading(false);
        return;
      }

      setItinerary(loadedItinerary);
      console.log('Itinerary loaded successfully:', loadedItinerary.title);
    } catch (error) {
      console.error('Error loading itinerary:', error);
      setError('Failed to load itinerary');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.appIdentity.primaryBrand} />
        <CustomText variant="body" style={styles.loadingText}>Loading itinerary...</CustomText>
      </View>
    );
  }

  if (error || !itinerary) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color={Colors.functional.error} style={styles.errorIcon} />
        <CustomText variant="h2" style={styles.errorText}>
          {error || 'No itinerary found'}
        </CustomText>
        <CustomText variant="body" style={styles.errorSubtext}>
          Please try generating a new itinerary.
        </CustomText>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <CustomText variant="buttonText" style={styles.backButtonText}>
            Go Back
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'attraction': return 'camera';
      case 'food': return 'restaurant';
      case 'accommodation': return 'bed';
      case 'transport': return 'car';
      case 'shopping': return 'bag';
      case 'entertainment': return 'musical-notes';
      default: return 'location';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'attraction': return Colors.functional.info;
      case 'food': return Colors.functional.success;
      case 'accommodation': return Colors.appIdentity.primaryBrand;
      case 'transport': return Colors.secondary.coral;
      case 'shopping': return Colors.functional.warning;
      case 'entertainment': return Colors.secondary.teal;
      default: return Colors.neutrals.gray600;
    }
  };

  return (
    <AnimatedScreen animationType="slideInRight" style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={Colors.gradients.primary || ['#FB923C', '#F97316']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButtonHeader}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.neutrals.white} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <CustomText variant="h2" style={styles.headerTitle}>
              {itinerary.title}
            </CustomText>
            <CustomText variant="body" style={styles.headerSubtitle}>
              {itinerary.duration} days • {itinerary.travelers} travelers
            </CustomText>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Trip Summary */}
        <View style={styles.summarySection}>
          <CustomText variant="h3" style={styles.sectionTitle}>Trip Summary</CustomText>
          <View style={styles.summaryCard}>
            <CustomText variant="body" style={styles.summaryText}>
              {itinerary.summary}
            </CustomText>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <CustomText variant="caption" style={styles.statLabel}>Total Budget</CustomText>
                <CustomText variant="h3" style={styles.statValue}>
                  {itinerary.currency} {itinerary.totalBudget.toLocaleString()}
                </CustomText>
              </View>
              <View style={styles.statItem}>
                <CustomText variant="caption" style={styles.statLabel}>Duration</CustomText>
                <CustomText variant="h3" style={styles.statValue}>
                  {itinerary.duration} days
                </CustomText>
              </View>
              <View style={styles.statItem}>
                <CustomText variant="caption" style={styles.statLabel}>Style</CustomText>
                <CustomText variant="h3" style={styles.statValue}>
                  {itinerary.preference}
                </CustomText>
              </View>
            </View>
          </View>
        </View>

        {/* Daily Itinerary */}
        <View style={styles.itinerarySection}>
          <CustomText variant="h3" style={styles.sectionTitle}>Daily Itinerary</CustomText>
          {itinerary.days.map((day, dayIndex) => (
            <View key={dayIndex} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <CustomText variant="h3" style={styles.dayTitle}>
                  Day {day.day}
                </CustomText>
                <CustomText variant="bodySmall" style={styles.dayDate}>
                  {day.date}
                </CustomText>
                <CustomText variant="caption" style={styles.dayCost}>
                  {itinerary.currency} {day.estimatedCost.toLocaleString()}
                </CustomText>
              </View>

              {day.activities.map((activity, activityIndex) => (
                <View key={activityIndex} style={styles.activityCard}>
                  <View style={styles.activityHeader}>
                    <View style={styles.activityTime}>
                      <CustomText variant="bodySmall" style={styles.timeText}>
                        {activity.time}
                      </CustomText>
                    </View>
                    <View style={styles.activityInfo}>
                      <View style={styles.activityTitleRow}>
                        <CustomText variant="body" style={styles.activityName}>
                          {activity.name}
                        </CustomText>
                        <View style={[styles.categoryTag, { backgroundColor: `${getCategoryColor(activity.category)}15` }]}>
                          <Ionicons 
                            name={getCategoryIcon(activity.category) as any} 
                            size={12} 
                            color={getCategoryColor(activity.category)} 
                          />
                          <CustomText variant="caption" style={[styles.categoryText, { color: getCategoryColor(activity.category) }]}>
                            {activity.category}
                          </CustomText>
                        </View>
                      </View>
                      <CustomText variant="bodySmall" style={styles.activityLocation}>
                        📍 {activity.location}
                      </CustomText>
                      <CustomText variant="bodySmall" style={styles.activityDescription}>
                        {activity.description}
                      </CustomText>
                      <View style={styles.activityDetails}>
                        <CustomText variant="caption" style={styles.durationText}>
                          ⏱️ {activity.duration}
                        </CustomText>
                        <CustomText variant="caption" style={styles.costText}>
                          💰 {itinerary.currency} {activity.cost.toLocaleString()}
                        </CustomText>
                      </View>
                      {activity.tips && (
                        <View style={styles.tipsContainer}>
                          <CustomText variant="caption" style={styles.tipsText}>
                            💡 {activity.tips}
                          </CustomText>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}

              {day.notes && (
                <View style={styles.dayNotes}>
                  <CustomText variant="bodySmall" style={styles.notesText}>
                    📝 {day.notes}
                  </CustomText>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* General Tips */}
        {itinerary.tips && itinerary.tips.length > 0 && (
          <View style={styles.tipsSection}>
            <CustomText variant="h3" style={styles.sectionTitle}>Travel Tips</CustomText>
            <View style={styles.tipsCard}>
              {itinerary.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <CustomText variant="bodySmall" style={styles.tipText}>
                    💡 {tip}
                  </CustomText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </AnimatedScreen>
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
    backgroundColor: Colors.neutrals.white,
  },
  loadingText: {
    color: Colors.neutrals.gray600,
    marginTop: DesignTokens.spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DesignTokens.spacing.lg,
  },
  errorIcon: {
    marginBottom: DesignTokens.spacing.lg,
  },
  errorText: {
    color: Colors.neutrals.gray900,
    marginBottom: DesignTokens.spacing.sm,
    textAlign: 'center',
  },
  errorSubtext: {
    color: Colors.neutrals.gray600,
    textAlign: 'center',
    marginBottom: DesignTokens.spacing.xl,
  },
  header: {
    paddingTop: DesignTokens.spacing.xl,
    paddingBottom: DesignTokens.spacing.lg,
    paddingHorizontal: DesignTokens.spacing.lg,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonHeader: {
    marginRight: DesignTokens.spacing.md,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: Colors.neutrals.white,
    marginBottom: DesignTokens.spacing.xs,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scrollView: {
    flex: 1,
  },
  summarySection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.lg,
  },
  sectionTitle: {
    color: Colors.neutrals.gray900,
    marginBottom: DesignTokens.spacing.md,
  },
  summaryCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.spacing.lg,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryText: {
    color: Colors.neutrals.gray700,
    marginBottom: DesignTokens.spacing.lg,
    lineHeight: 22,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: Colors.neutrals.gray600,
    marginBottom: DesignTokens.spacing.xs,
  },
  statValue: {
    color: Colors.appIdentity.primaryBrand,
  },
  itinerarySection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.xl,
  },
  dayCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    marginBottom: DesignTokens.spacing.lg,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  dayHeader: {
    backgroundColor: Colors.appIdentity.primaryBrandLight,
    padding: DesignTokens.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayTitle: {
    color: Colors.neutrals.gray900,
  },
  dayDate: {
    color: Colors.neutrals.gray600,
  },
  dayCost: {
    color: Colors.appIdentity.primaryBrand,
    fontWeight: '600',
  },
  activityCard: {
    padding: DesignTokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutrals.gray100,
  },
  activityHeader: {
    flexDirection: 'row',
  },
  activityTime: {
    width: 60,
    marginRight: DesignTokens.spacing.md,
  },
  timeText: {
    color: Colors.appIdentity.primaryBrand,
    fontWeight: '600',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: DesignTokens.spacing.xs,
  },
  activityName: {
    color: Colors.neutrals.gray900,
    fontWeight: '600',
    flex: 1,
    marginRight: DesignTokens.spacing.sm,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DesignTokens.spacing.sm,
    paddingVertical: DesignTokens.spacing.xs,
    borderRadius: DesignTokens.borderRadius.small,
  },
  categoryText: {
    marginLeft: DesignTokens.spacing.xs,
    fontSize: 10,
    textTransform: 'capitalize',
  },
  activityLocation: {
    color: Colors.neutrals.gray600,
    marginBottom: DesignTokens.spacing.xs,
  },
  activityDescription: {
    color: Colors.neutrals.gray700,
    marginBottom: DesignTokens.spacing.sm,
    lineHeight: 18,
  },
  activityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationText: {
    color: Colors.neutrals.gray500,
  },
  costText: {
    color: Colors.appIdentity.primaryBrand,
    fontWeight: '600',
  },
  tipsContainer: {
    marginTop: DesignTokens.spacing.sm,
    backgroundColor: Colors.neutrals.gray50,
    padding: DesignTokens.spacing.sm,
    borderRadius: DesignTokens.borderRadius.small,
  },
  tipsText: {
    color: Colors.neutrals.gray600,
    fontStyle: 'italic',
  },
  dayNotes: {
    padding: DesignTokens.spacing.lg,
    backgroundColor: Colors.neutrals.gray50,
  },
  notesText: {
    color: Colors.neutrals.gray600,
    fontStyle: 'italic',
  },
  tipsSection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.xl,
  },
  tipsCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.spacing.lg,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tipItem: {
    marginBottom: DesignTokens.spacing.sm,
  },
  tipText: {
    color: Colors.neutrals.gray700,
    lineHeight: 18,
  },
  bottomSpacing: {
    height: DesignTokens.spacing.xl,
  },
});
