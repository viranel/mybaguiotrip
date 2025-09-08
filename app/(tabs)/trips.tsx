import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import CustomText from '../../components/ui/CustomText';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';
import { tripsService } from '../../lib/trips';
import { useAuth } from '../../providers/AuthProvider';

interface Itinerary {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: string;
  travelers: number;
  budget: number;
  status: 'planned' | 'ongoing' | 'completed';
  activities: string[];
  image?: string;
}


export default function TripsScreen() {
  const { user } = useAuth();
  const [userTrips, setUserTrips] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserTrips();
  }, [user]);

  // Refresh trips when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadUserTrips();
    }, [user])
  );

  const loadUserTrips = async () => {
    if (!user) {
      setUserTrips([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (!user.email) {
        console.error('❌ No user email available for loading trips');
        setUserTrips([]);
        setLoading(false);
        return;
      }

      // Get AI-generated itineraries from local storage for this user
      const aiTrips = await tripsService.getTrips(user.email);
      console.log('📋 Loading trips from storage for user:', user.email, aiTrips.length, 'trips found');
      console.log('📝 Trip titles:', aiTrips.map(trip => trip.title));
      
      // Convert AI trips to our interface format
      const convertedAITrips: Itinerary[] = aiTrips.map(trip => {
        // Better date handling
        const formatDate = (dateString: string) => {
          try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
              // If date is invalid, try to parse it as ISO string or return original
              console.warn('Invalid date string:', dateString);
              return dateString; // Return original string if can't parse
            }
            return date.toLocaleDateString();
          } catch (error) {
            console.warn('Error formatting date:', dateString, error);
            return dateString; // Return original string if error
          }
        };

        return {
          id: trip.id,
          title: trip.title,
          destination: trip.destination,
          startDate: formatDate(trip.startDate),
          endDate: formatDate(trip.endDate),
          duration: `${trip.duration} days`,
          travelers: trip.travelers,
          budget: trip.totalBudget,
          status: 'planned' as const,
          activities: trip.days?.map(day => day.activities?.map((activity: any) => activity.name)).flat() || [],
          image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=200&fit=crop',
        };
      });
      
      // Use only AI-generated trips
      setUserTrips(convertedAITrips);
    } catch (error) {
      console.error('Error loading trips:', error);
      setUserTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = () => {
    // Navigate to AI Planner
    router.push('/(tabs)/planner');
  };


  const handleViewItinerary = async (itinerary: Itinerary) => {
    try {
      console.log('View itinerary:', itinerary.title);
      // Navigate to full itinerary details
      router.push({
        pathname: '/itinerary-detail',
        params: {
          itineraryId: itinerary.id
        }
      });
    } catch (error) {
      console.error('Error navigating to itinerary:', error);
    }
  };

  const getStatusColor = (status: Itinerary['status']) => {
    switch (status) {
      case 'planned': return Colors.appIdentity.primaryBrand;
      case 'ongoing': return Colors.functional.warning;
      case 'completed': return Colors.functional.success;
      default: return Colors.neutrals.gray600;
    }
  };

  const getStatusIcon = (status: Itinerary['status']) => {
    switch (status) {
      case 'planned': return 'calendar';
      case 'ongoing': return 'play-circle';
      case 'completed': return 'checkmark-circle';
      default: return 'time';
    }
  };

  const handleTripPress = async (trip: Itinerary) => {
    if (!user?.id) {
      console.log('No user logged in');
      return;
    }

    if (!user.email) {
      console.log('❌ No user email available for trip lookup');
      return;
    }

    // Check if this is an AI-generated trip for this user
    const aiTrip = await tripsService.getTripById(trip.id, user.email);
    if (aiTrip) {
      // Navigate to itinerary detail with only the ID
      router.push({
        pathname: '/itinerary-detail',
        params: {
          itineraryId: trip.id
        }
      });
    } else {
      // For mock trips, show a placeholder
      console.log('Mock trip selected:', trip.title);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Modern Header with Gradient */}
      <LinearGradient
        colors={Colors.gradients.primary || ['#FB923C', '#F97316']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <CustomText variant="h2" style={styles.headerTitle}>My Trips</CustomText>
            <CustomText variant="body" style={styles.headerSubtitle}>Your planned itineraries from AI Planner</CustomText>
      </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton} onPress={handleCreateTrip}>
              <Ionicons name="add" size={DesignTokens.iconSizes.navigation} color={Colors.neutrals.white} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Itineraries List */}
        <View style={styles.itinerariesSection}>
          <CustomText variant="h3" style={styles.sectionTitle}>Your Itineraries</CustomText>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.appIdentity.primaryBrand} />
              <CustomText variant="body" style={styles.loadingText}>Loading your trips...</CustomText>
            </View>
          ) : userTrips.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="airplane-outline" size={64} color={Colors.appIdentity.primaryBrand} />
              </View>
              <CustomText variant="h3" style={styles.emptyTitle}>No trips yet</CustomText>
              <CustomText variant="body" style={styles.emptySubtitle}>
                Start planning your first adventure with our AI Itinerary Planner!
              </CustomText>
              <TouchableOpacity 
                style={styles.createTripButton}
                onPress={() => router.push('/(tabs)/planner')}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={20} color={Colors.neutrals.white} />
                <CustomText variant="buttonText" style={styles.createTripButtonText}>
                  Create Your First Trip
                </CustomText>
              </TouchableOpacity>
            </View>
          ) : (
            userTrips.map((itinerary) => (
            <TouchableOpacity
              key={itinerary.id}
              style={styles.itineraryCard}
              onPress={() => handleTripPress(itinerary)}
              activeOpacity={0.8}
            >
              <View style={styles.itineraryContent}>
                <View style={styles.itineraryInfo}>
                  <CustomText variant="h3" style={styles.itineraryTitle}>{itinerary.title}</CustomText>
                  <CustomText variant="bodySmall" style={styles.itineraryDestination}>{itinerary.destination}</CustomText>
                  
                  <View style={styles.itineraryDetails}>
                    <View style={styles.itineraryDetail}>
                      <Ionicons name="calendar-outline" size={16} color={Colors.neutrals.gray600} />
                      <CustomText variant="caption" style={styles.itineraryDetailText}>
                        {itinerary.startDate} - {itinerary.endDate}
                      </CustomText>
                    </View>
                    <View style={styles.itineraryDetail}>
                      <Ionicons name="people-outline" size={16} color={Colors.neutrals.gray600} />
                      <CustomText variant="caption" style={styles.itineraryDetailText}>
                        {itinerary.travelers} travelers
                      </CustomText>
                    </View>
                    <View style={styles.itineraryDetail}>
                      <Ionicons name="wallet-outline" size={16} color={Colors.neutrals.gray600} />
                      <CustomText variant="caption" style={styles.itineraryDetailText}>
                        ₱{itinerary.budget.toLocaleString()}
                      </CustomText>
                    </View>
                  </View>

                  {/* Activities Preview */}
                  <View style={styles.activitiesPreview}>
                    <CustomText variant="caption" style={styles.activitiesLabel}>Activities:</CustomText>
                    <CustomText variant="caption" style={styles.activitiesText}>
                      {itinerary.activities.slice(0, 3).join(', ')}
                      {itinerary.activities.length > 3 && '...'}
                    </CustomText>
                  </View>
                </View>
                
                <View style={styles.itineraryActions}>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(itinerary.status)}15` }]}>
                    <Ionicons name={getStatusIcon(itinerary.status) as any} size={16} color={getStatusColor(itinerary.status)} />
                    <CustomText variant="caption" style={[styles.statusText, { color: getStatusColor(itinerary.status) }]}>
                      {itinerary.status.charAt(0).toUpperCase() + itinerary.status.slice(1)}
                    </CustomText>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.neutrals.gray600} />
                </View>
              </View>
            </TouchableOpacity>
            ))
          )}
        </View>

        {/* Create New Trip Button */}
        <View style={styles.createSection}>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateTrip}>
            <Ionicons name="sparkles" size={24} color={Colors.neutrals.white} />
            <CustomText variant="buttonText" style={styles.createButtonText}>Create New Itinerary</CustomText>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals.white,
  } as ViewStyle,
  header: {
    paddingTop: DesignTokens.spacing.xl,
    paddingBottom: DesignTokens.spacing.xl,
    paddingHorizontal: DesignTokens.spacing.lg,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  headerLeft: {
    flex: 1,
  } as ViewStyle,
  headerTitle: {
    color: Colors.neutrals.white,
    marginBottom: DesignTokens.spacing.xs,
  } as TextStyle,
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  } as TextStyle,
  headerRight: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.sm,
  } as ViewStyle,
  headerButton: {
    width: DesignTokens.accessibility.minTouchTarget,
    height: DesignTokens.accessibility.minTouchTarget,
    borderRadius: DesignTokens.borderRadius.circular,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    paddingBottom: 140,
  } as ViewStyle,
  itinerariesSection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.xl,
  } as ViewStyle,
  sectionTitle: {
    color: Colors.neutrals.gray900,
    marginBottom: DesignTokens.spacing.lg,
  } as TextStyle,
  itineraryCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.accessibility.cardPadding,
    marginBottom: DesignTokens.spacing.sm,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
  } as ViewStyle,
  itineraryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  } as ViewStyle,
  itineraryInfo: {
    flex: 1,
  } as ViewStyle,
  itineraryTitle: {
    color: Colors.neutrals.gray900,
    marginBottom: DesignTokens.spacing.xs,
  } as TextStyle,
  itineraryDestination: {
    color: Colors.neutrals.gray600,
    marginBottom: DesignTokens.spacing.sm,
  } as TextStyle,
  itineraryDetails: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.md,
    marginBottom: DesignTokens.spacing.sm,
  } as ViewStyle,
  itineraryDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.xs,
  } as ViewStyle,
  itineraryDetailText: {
    color: Colors.neutrals.gray600,
  } as TextStyle,
  activitiesPreview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: DesignTokens.spacing.xs,
  } as ViewStyle,
  activitiesLabel: {
    color: Colors.neutrals.gray600,
    fontWeight: '600',
  } as TextStyle,
  activitiesText: {
    color: Colors.neutrals.gray600,
    flex: 1,
  } as TextStyle,
  itineraryActions: {
    alignItems: 'center',
    gap: DesignTokens.spacing.sm,
  } as ViewStyle,
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.xs,
    paddingHorizontal: DesignTokens.spacing.sm,
    paddingVertical: DesignTokens.spacing.xs,
    borderRadius: DesignTokens.borderRadius.pill,
  } as ViewStyle,
  statusText: {
    fontWeight: '600',
  } as TextStyle,
  createSection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.xl,
  } as ViewStyle,
  createButton: {
    backgroundColor: Colors.appIdentity.primaryBrand,
    borderRadius: DesignTokens.borderRadius.large,
    paddingVertical: DesignTokens.spacing.md,
    paddingHorizontal: DesignTokens.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DesignTokens.spacing.sm,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  } as ViewStyle,
  createButtonText: {
    color: Colors.neutrals.white,
  } as TextStyle,
  bottomSpacing: {
    height: DesignTokens.spacing.xl,
  } as ViewStyle,
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: DesignTokens.spacing.xl,
  } as ViewStyle,
  loadingText: {
    color: Colors.neutrals.gray600,
  } as TextStyle,
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: DesignTokens.spacing.xl,
    paddingHorizontal: DesignTokens.spacing.lg,
  } as ViewStyle,
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: DesignTokens.borderRadius.circular,
    backgroundColor: Colors.appIdentity.primaryBrandLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: DesignTokens.spacing.lg,
  } as ViewStyle,
  emptyTitle: {
    color: Colors.neutrals.gray700,
    marginBottom: DesignTokens.spacing.sm,
    textAlign: 'center',
  } as TextStyle,
  emptySubtitle: {
    color: Colors.neutrals.gray600,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: DesignTokens.spacing.xl,
  } as TextStyle,
  createTripButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.appIdentity.primaryBrand,
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingVertical: DesignTokens.spacing.md,
    borderRadius: DesignTokens.borderRadius.medium,
    gap: DesignTokens.spacing.sm,
  } as ViewStyle,
  createTripButtonText: {
    color: Colors.neutrals.white,
  } as TextStyle,
});
