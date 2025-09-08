import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AnimatedScreen from '../components/ui/AnimatedScreen';
import CustomText from '../components/ui/CustomText';
import { Colors } from '../constants/Colors';
import { DesignTokens } from '../constants/DesignTokens';
import { aiService, ItineraryRequest } from '../lib/aiService';
import { tripsService } from '../lib/trips';
import { useAuth } from '../providers/AuthProvider';

export default function GeneratingItineraryScreen() {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);

  useEffect(() => {
    generateItinerary();
  }, []);

  const generateItinerary = async () => {
    try {
      // Check user authentication first
      console.log('User authentication check:', {
        user: !!user,
        userId: user?.id,
        userEmail: user?.email,
        authLoading: false
      });
      
      if (!user?.email) {
        throw new Error('User not authenticated. Please log in again.');
      }
      
      // Parse the request data from params
      const requestData = JSON.parse(params.requestData as string) as ItineraryRequest;
      
      console.log('Generating itinerary with:', requestData);
      
      // Add timeout for AI generation
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('AI generation timed out. Please try again.')), 120000); // 2 minute timeout
      });
      
      // Add retry logic for AI generation
      let itinerary;
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          console.log(`AI generation attempt ${retryCount + 1}/${maxRetries + 1}`);
          setRetryAttempt(retryCount + 1);
          const itineraryPromise = aiService.generateItinerary(requestData);
          itinerary = await Promise.race([itineraryPromise, timeoutPromise]) as any;
          break; // Success, exit retry loop
        } catch (error) {
          retryCount++;
          if (retryCount > maxRetries) {
            throw error; // Re-throw if all retries failed
          }
          console.log(`AI generation attempt ${retryCount} failed, retrying...`);
          // Wait 2 seconds before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      console.log('Generated itinerary:', itinerary);
      console.log('Itinerary type:', typeof itinerary);
      console.log('Itinerary keys:', Object.keys(itinerary || {}));
      console.log('Days property:', itinerary?.days);
      console.log('Days type:', typeof itinerary?.days);
      console.log('Days length:', itinerary?.days?.length);
      
      // Validate generated itinerary
      if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
        console.error('Invalid itinerary structure:', itinerary);
        console.error('Validation failed - itinerary:', !!itinerary);
        console.error('Validation failed - days:', !!itinerary?.days);
        console.error('Validation failed - days length:', itinerary?.days?.length);
        throw new Error('Invalid itinerary data: missing required fields');
      }
      
      // Save itinerary to trips
      console.log('About to save itinerary to trips...');
      try {
        await saveItineraryToTrips(itinerary);
        console.log('Successfully saved itinerary to trips');
        
        // Navigate to itinerary detail screen with only the ID
        router.replace({
          pathname: '/itinerary-detail',
          params: {
            itineraryId: itinerary.id
          }
        });
      } catch (saveError) {
        console.error('Error saving itinerary:', saveError);
        throw new Error('Failed to save itinerary: ' + (saveError as Error).message);
      }

    } catch (error) {
      console.error('Error generating itinerary:', error);
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = 'AI generation took too long. This might be due to slow internet connection or high server load. Please try again.';
        } else if (error.message.includes('API')) {
          errorMessage = 'AI service is temporarily unavailable. Please try again later.';
        } else if (error.message.includes('missing required fields')) {
          errorMessage = 'The AI generated incomplete data. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      setIsGenerating(false);
    }
  };

  const saveItineraryToTrips = async (itinerary: any) => {
    try {
      console.log('saveItineraryToTrips called with user:', {
        userId: user?.id,
        userEmail: user?.email,
        itineraryId: itinerary?.id
      });
      
      if (!user?.id) {
        console.error('No user ID available for saving itinerary');
        throw new Error('User authentication lost. Please log in again.');
      }

      if (!user.email) {
        console.error('❌ No user email available for saving itinerary');
        throw new Error('User email not available. Please log in again.');
      }

      console.log('💾 Saving itinerary to trips for user:', user.email, itinerary.id, itinerary.title);
      await tripsService.saveItinerary(itinerary, user.email);
      console.log('✅ Itinerary saved successfully to trips');
      
      // Verify it was saved
      const savedTrips = await tripsService.getTrips(user.email);
      console.log('📊 Total trips in storage for user:', user.email, savedTrips.length);
      console.log('📝 Latest trip:', savedTrips[savedTrips.length - 1]?.title);
    } catch (error) {
      console.error('Error saving itinerary:', error);
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsGenerating(true);
    generateItinerary();
  };

  const handleGoBack = () => {
    router.back();
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
          <CustomText variant="h2" style={styles.headerTitle}>
            AI Itinerary Generator
          </CustomText>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {isGenerating && !error && (
          <>
            {/* Loading Animation */}
            <View style={styles.loadingContainer}>
              <View style={styles.spinnerContainer}>
                <ActivityIndicator size="large" color={Colors.appIdentity.primaryBrand} />
              </View>
              
              <CustomText variant="h2" style={styles.loadingTitle}>
                Hold on, our AI is generating your itinerary for you
              </CustomText>
              
              <CustomText variant="body" style={styles.loadingSubtitle}>
                {retryAttempt > 0 
                  ? `Attempt ${retryAttempt}/3 - This may take a few moments while we create your perfect Baguio adventure`
                  : 'This may take a few moments while we create your perfect Baguio adventure'
                }
              </CustomText>

              {/* Loading Steps */}
              <View style={styles.stepsContainer}>
                <View style={styles.step}>
                  <View style={styles.stepIcon}>
                    <Ionicons name="search" size={20} color={Colors.appIdentity.primaryBrand} />
                  </View>
                  <CustomText variant="bodySmall" style={styles.stepText}>
                    Analyzing your preferences
                  </CustomText>
                </View>
                
                <View style={styles.step}>
                  <View style={styles.stepIcon}>
                    <Ionicons name="map" size={20} color={Colors.appIdentity.primaryBrand} />
                  </View>
                  <CustomText variant="bodySmall" style={styles.stepText}>
                    Finding the best attractions
                  </CustomText>
                </View>
                
                <View style={styles.step}>
                  <View style={styles.stepIcon}>
                    <Ionicons name="restaurant" size={20} color={Colors.appIdentity.primaryBrand} />
                  </View>
                  <CustomText variant="bodySmall" style={styles.stepText}>
                    Selecting restaurants and activities
                  </CustomText>
                </View>
                
                <View style={styles.step}>
                  <View style={styles.stepIcon}>
                    <Ionicons name="calendar" size={20} color={Colors.appIdentity.primaryBrand} />
                  </View>
                  <CustomText variant="bodySmall" style={styles.stepText}>
                    Creating your daily schedule
                  </CustomText>
                </View>
              </View>
            </View>
          </>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <View style={styles.errorIcon}>
              <Ionicons name="alert-circle" size={48} color={Colors.functional.error} />
            </View>
            
            <CustomText variant="h3" style={styles.errorTitle}>
              Generation Failed
            </CustomText>
            
            <CustomText variant="body" style={styles.errorMessage}>
              {error}
            </CustomText>
            
            <View style={styles.errorActions}>
              <CustomText 
                variant="buttonText" 
                style={styles.retryButton}
                onPress={handleRetry}
              >
                Try Again
              </CustomText>
              
              <CustomText 
                variant="buttonText" 
                style={styles.backButton}
                onPress={handleGoBack}
              >
                Go Back
              </CustomText>
            </View>
          </View>
        )}
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals.white,
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
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.neutrals.white,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DesignTokens.spacing.lg,
  },
  loadingContainer: {
    alignItems: 'center',
    maxWidth: 400,
  },
  spinnerContainer: {
    marginBottom: DesignTokens.spacing.xl,
  },
  loadingTitle: {
    color: Colors.neutrals.gray900,
    textAlign: 'center',
    marginBottom: DesignTokens.spacing.md,
  },
  loadingSubtitle: {
    color: Colors.neutrals.gray700,
    textAlign: 'center',
    marginBottom: DesignTokens.spacing.xl,
    lineHeight: 22,
    fontWeight: '400',
  },
  stepsContainer: {
    width: '100%',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.md,
    paddingHorizontal: DesignTokens.spacing.md,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: DesignTokens.borderRadius.circular,
    backgroundColor: Colors.appIdentity.primaryBrandLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DesignTokens.spacing.md,
  },
  stepText: {
    color: Colors.neutrals.gray900,
    flex: 1,
    fontWeight: '500',
  },
  errorContainer: {
    alignItems: 'center',
    maxWidth: 400,
  },
  errorIcon: {
    marginBottom: DesignTokens.spacing.lg,
  },
  errorTitle: {
    color: Colors.neutrals.gray900,
    textAlign: 'center',
    marginBottom: DesignTokens.spacing.md,
  },
  errorMessage: {
    color: Colors.neutrals.gray600,
    textAlign: 'center',
    marginBottom: DesignTokens.spacing.xl,
    lineHeight: 22,
  },
  errorActions: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.lg,
  },
  retryButton: {
    color: Colors.appIdentity.primaryBrand,
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingVertical: DesignTokens.spacing.sm,
    backgroundColor: Colors.appIdentity.primaryBrandLight,
    borderRadius: DesignTokens.borderRadius.medium,
  },
  backButton: {
    color: Colors.neutrals.gray600,
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingVertical: DesignTokens.spacing.sm,
    backgroundColor: Colors.neutrals.gray100,
    borderRadius: DesignTokens.borderRadius.medium,
  },
});
