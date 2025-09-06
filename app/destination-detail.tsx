import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import CustomText from '../components/ui/CustomText';
import { Colors } from '../constants/Colors';
import { DesignTokens } from '../constants/DesignTokens';

const { width: screenWidth } = Dimensions.get('window');

interface Destination {
  id: string;
  name: string;
  country: string;
  rating: number;
  reviewCount: number;
  description: string;
  image: string;
  highlights: string[];
}

// Mock data
const mockDestination: Destination = {
  id: '1',
  name: 'Rio de Janeiro',
  country: 'Brazil',
  rating: 5.0,
  reviewCount: 143,
  description: 'Rio de Janeiro, often simply called Rio, is one of Brazil\'s most iconic cities, renowned for its stunning beaches, vibrant culture, and breathtaking landscapes. From the iconic Christ the Redeemer statue to the world-famous Copacabana and Ipanema beaches, Rio offers an unforgettable experience.',
  image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=300&fit=crop',
  highlights: [
    'Christ the Redeemer Statue',
    'Copacabana Beach',
    'Ipanema Beach',
    'Sugarloaf Mountain',
    'Tijuca National Park'
  ]
};

export default function DestinationDetailScreen() {
  const params = useLocalSearchParams();
  const [destination, setDestination] = useState<Destination>(mockDestination);
  const [screenSlideAnim] = useState(new Animated.Value(400)); // Start from bottom

  useEffect(() => {
    // Slide up from bottom animation
    Animated.spring(screenSlideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, []);

  useEffect(() => {
    // Update destination data from params only once
    if (params.name && destination.name !== params.name) {
      setDestination({
        id: params.id as string || '1',
        name: params.name as string,
        country: 'Philippines',
        rating: parseFloat(params.rating as string) || 4.5,
        reviewCount: Math.floor(Math.random() * 200) + 50,
        description: params.description as string || 'A beautiful destination in Baguio City.',
        image: params.image as string || 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=300&fit=crop',
        highlights: [
          'Scenic Views',
          'Local Culture',
          'Photo Opportunities',
          'Relaxing Atmosphere',
          'Family Friendly'
        ],
      });
    }
  }, [params.name, params.id, params.rating, params.description, params.image]);



  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'modal' }} />
      <Animated.View 
        style={[
          styles.container,
          {
            transform: [{ translateY: screenSlideAnim }],
          }
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header with Image */}
          <View style={styles.header}>
            <Image source={{ uri: destination.image }} style={styles.headerImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.imageOverlay}
            />
            
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={Colors.neutrals.white} />
            </TouchableOpacity>

            {/* Heart Button */}
            <TouchableOpacity style={styles.heartButton}>
              <Ionicons name="heart-outline" size={24} color={Colors.neutrals.white} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Destination Info */}
            <View style={styles.destinationInfo}>
              <CustomText variant="h1" style={styles.destinationName}>{destination.name}</CustomText>
              
              <View style={styles.countryContainer}>
                <View style={styles.countryIndicator} />
                <CustomText variant="body" style={styles.countryText}>{destination.country}</CustomText>
              </View>

              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color={Colors.functional.warning} />
                <CustomText variant="body" style={styles.ratingText}>{destination.rating}</CustomText>
                <CustomText variant="caption" style={styles.reviewText}>({destination.reviewCount} reviews)</CustomText>
              </View>

              <CustomText variant="body" style={styles.description}>
                {destination.description}
              </CustomText>
              <TouchableOpacity style={styles.readMoreButton}>
                <CustomText variant="bodySmall" style={styles.readMoreText}>Read more</CustomText>
              </TouchableOpacity>
            </View>

            {/* Highlights */}
            <View style={styles.section}>
              <CustomText variant="h3" style={styles.sectionTitle}>Highlights</CustomText>
              <View style={styles.highlightsList}>
                {destination.highlights.map((highlight, index) => (
                  <View key={index} style={styles.highlightItem}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.functional.success} />
                    <CustomText variant="body" style={styles.highlightText}>{highlight}</CustomText>
                  </View>
                ))}
              </View>
            </View>

          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals.background,
    borderTopLeftRadius: DesignTokens.borderRadius.xl,
    borderTopRightRadius: DesignTokens.borderRadius.xl,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  } as ViewStyle,
  safeArea: {
    flex: 1,
  } as ViewStyle,
  header: {
    height: 300,
    position: 'relative',
  } as ViewStyle,
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  } as any,
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  } as ViewStyle,
  backButton: {
    position: 'absolute',
    top: 50,
    left: DesignTokens.spacing.lg,
    width: 40,
    height: 40,
    borderRadius: DesignTokens.borderRadius.circular,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  heartButton: {
    position: 'absolute',
    top: 50,
    right: DesignTokens.spacing.lg,
    width: 40,
    height: 40,
    borderRadius: DesignTokens.borderRadius.circular,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    paddingBottom: 140,
  } as ViewStyle,
  destinationInfo: {
    padding: DesignTokens.spacing.lg,
  } as ViewStyle,
  destinationName: {
    color: Colors.neutrals.charcoal,
    marginBottom: DesignTokens.spacing.sm,
  } as TextStyle,
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.sm,
  } as ViewStyle,
  countryIndicator: {
    width: 8,
    height: 8,
    borderRadius: DesignTokens.borderRadius.circular,
    backgroundColor: Colors.functional.success,
    marginRight: DesignTokens.spacing.xs,
  } as ViewStyle,
  countryText: {
    color: Colors.neutrals.darkGray,
  } as TextStyle,
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.md,
  } as ViewStyle,
  ratingText: {
    color: Colors.neutrals.charcoal,
    marginLeft: DesignTokens.spacing.xs,
    fontWeight: '600',
  } as TextStyle,
  reviewText: {
    color: Colors.neutrals.darkGray,
    marginLeft: DesignTokens.spacing.xs,
  } as TextStyle,
  description: {
    color: Colors.neutrals.charcoal,
    lineHeight: 22,
    marginBottom: DesignTokens.spacing.sm,
  } as TextStyle,
  readMoreButton: {
    alignSelf: 'flex-start',
  } as ViewStyle,
  readMoreText: {
    color: Colors.appIdentity.primaryBrand,
    fontWeight: '600',
  } as TextStyle,
  section: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginBottom: DesignTokens.spacing.xl,
  } as ViewStyle,
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.lg,
  } as ViewStyle,
  sectionTitle: {
    color: Colors.neutrals.charcoal,
    marginBottom: DesignTokens.spacing.lg,
  } as TextStyle,
  highlightsList: {
    gap: DesignTokens.spacing.sm,
  } as ViewStyle,
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  highlightText: {
    color: Colors.neutrals.charcoal,
    marginLeft: DesignTokens.spacing.sm,
  } as TextStyle,
  toursScroll: {
    marginHorizontal: -DesignTokens.spacing.lg,
    paddingHorizontal: DesignTokens.spacing.lg,
  } as ViewStyle,
  tourCard: {
    width: screenWidth * 0.7,
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    marginRight: DesignTokens.spacing.md,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  } as ViewStyle,
  tourImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  } as any,
  tourContent: {
    padding: DesignTokens.spacing.md,
  } as ViewStyle,
  tourTitle: {
    color: Colors.neutrals.charcoal,
    marginBottom: DesignTokens.spacing.xs,
  } as TextStyle,
  tourDuration: {
    color: Colors.neutrals.darkGray,
    marginBottom: DesignTokens.spacing.xs,
  } as TextStyle,
  tourPrice: {
    color: Colors.appIdentity.primaryBrand,
    fontWeight: '600',
    marginBottom: DesignTokens.spacing.sm,
  } as TextStyle,
  tourRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.sm,
  } as ViewStyle,
  tourRatingText: {
    color: Colors.neutrals.charcoal,
    marginLeft: DesignTokens.spacing.xs,
    fontWeight: '600',
  } as TextStyle,
  tourReviewText: {
    color: Colors.neutrals.darkGray,
    marginLeft: DesignTokens.spacing.xs,
  } as TextStyle,
  tourButton: {
    position: 'absolute',
    bottom: DesignTokens.spacing.md,
    right: DesignTokens.spacing.md,
    width: 32,
    height: 32,
    borderRadius: DesignTokens.borderRadius.circular,
    backgroundColor: Colors.appIdentity.primaryBrand,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
});
