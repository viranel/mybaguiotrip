import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import CustomText from '../components/ui/CustomText';
import { Colors } from '../constants/Colors';
import { DesignTokens } from '../constants/DesignTokens';

const { width: screenWidth } = Dimensions.get('window');

interface Attraction {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  description: string;
  images: string[];
  highlights: string[];
  openingHours: string;
  admissionFee: string;
}

// Mock data
const mockAttraction: Attraction = {
  id: '1',
  name: 'Burnham Park',
  category: 'Park & Recreation',
  location: 'Baguio City, Philippines',
  rating: 4.6,
  reviewCount: 189,
  description: 'Burnham Park is the heart of Baguio City, a beautiful urban park designed by American architect Daniel Burnham. This iconic landmark offers various recreational activities, scenic views, and a peaceful atmosphere perfect for relaxation and family outings.',
  images: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop'
  ],
  highlights: [
    'Boating on the lake',
    'Children\'s playground',
    'Rose garden',
    'Skating rink',
    'Picnic areas',
    'Walking trails'
  ],
  openingHours: '6:00 AM - 10:00 PM',
  admissionFee: 'Free'
};

export default function AttractionDetailScreen() {
  const params = useLocalSearchParams();
  const [attraction, setAttraction] = useState<Attraction>(mockAttraction);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
    // Update attraction data from params only once
    if (params.name && attraction.name !== params.name) {
      const featuresList = params.features ? (params.features as string).split(',') : ['Scenic Views', 'Photo Spot'];
      setAttraction({
        id: params.id as string || '1',
        name: params.name as string,
        category: params.category as string || 'Attraction',
        location: 'Baguio City, Philippines',
        rating: parseFloat(params.rating as string) || 4.5,
        reviewCount: Math.floor(Math.random() * 200) + 50,
        description: params.description as string || `Discover the beauty of ${params.name} in Baguio City.`,
        images: [
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop'
        ],
        highlights: featuresList,
        openingHours: '6:00 AM - 10:00 PM',
        admissionFee: 'Free'
      });
    }
  }, [params.name, params.id, params.category, params.rating, params.description, params.features]);


  const handleGetDirections = () => {
    Alert.alert('Directions', 'Maps app would open with directions to this attraction');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % attraction.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + attraction.images.length) % attraction.images.length);
  };

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
            <Image source={{ uri: attraction.images[currentImageIndex] }} style={styles.headerImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.imageOverlay}
            />
            
            {/* Navigation Buttons */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={Colors.neutrals.white} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.heartButton}>
              <Ionicons name="heart-outline" size={24} color={Colors.neutrals.white} />
            </TouchableOpacity>

            {/* Image Navigation */}
            <TouchableOpacity style={styles.prevImageButton} onPress={prevImage}>
              <Ionicons name="chevron-back" size={20} color={Colors.neutrals.white} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextImageButton} onPress={nextImage}>
              <Ionicons name="chevron-forward" size={20} color={Colors.neutrals.white} />
            </TouchableOpacity>

            {/* Image Indicators */}
            <View style={styles.imageIndicators}>
              {attraction.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentImageIndex && styles.activeIndicator
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Attraction Info */}
            <View style={styles.attractionInfo}>
              <View style={styles.categoryContainer}>
                <CustomText variant="caption" style={styles.categoryText}>{attraction.category}</CustomText>
              </View>
              
              <CustomText variant="h1" style={styles.attractionName}>{attraction.name}</CustomText>
              
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={16} color={Colors.neutrals.darkGray} />
                <CustomText variant="body" style={styles.locationText}>{attraction.location}</CustomText>
              </View>

              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color={Colors.functional.warning} />
                <CustomText variant="body" style={styles.ratingText}>{attraction.rating}</CustomText>
                <CustomText variant="caption" style={styles.reviewText}>({attraction.reviewCount} reviews)</CustomText>
              </View>

              <CustomText variant="body" style={styles.description}>
                {attraction.description}
              </CustomText>
            </View>

            {/* Quick Info */}
            <View style={styles.section}>
              <CustomText variant="h3" style={styles.sectionTitle}>Quick Info</CustomText>
              <View style={styles.quickInfoGrid}>
                <View style={styles.quickInfoItem}>
                  <Ionicons name="time" size={20} color={Colors.appIdentity.primaryBrand} />
                  <View style={styles.quickInfoContent}>
                    <CustomText variant="caption" style={styles.quickInfoLabel}>Opening Hours</CustomText>
                    <CustomText variant="body" style={styles.quickInfoValue}>{attraction.openingHours}</CustomText>
                  </View>
                </View>
                
                <View style={styles.quickInfoItem}>
                  <Ionicons name="card" size={20} color={Colors.functional.success} />
                  <View style={styles.quickInfoContent}>
                    <CustomText variant="caption" style={styles.quickInfoLabel}>Admission Fee</CustomText>
                    <CustomText variant="body" style={styles.quickInfoValue}>{attraction.admissionFee}</CustomText>
                  </View>
                </View>
              </View>
            </View>

            {/* Highlights */}
            <View style={styles.section}>
              <CustomText variant="h3" style={styles.sectionTitle}>What to Expect</CustomText>
              <View style={styles.highlightsList}>
                {attraction.highlights.map((highlight, index) => (
                  <View key={index} style={styles.highlightItem}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.functional.success} />
                    <CustomText variant="body" style={styles.highlightText}>{highlight}</CustomText>
                  </View>
                ))}
              </View>
            </View>


            {/* Action Buttons */}
            <View style={styles.actionSection}>
              <TouchableOpacity style={styles.directionsButton} onPress={handleGetDirections}>
                <Ionicons name="navigate" size={20} color={Colors.appIdentity.primaryBrand} />
                <CustomText variant="buttonText" style={styles.directionsButtonText}>Get Directions</CustomText>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="share" size={20} color={Colors.neutrals.white} />
                <CustomText variant="buttonText" style={styles.shareButtonText}>Share</CustomText>
              </TouchableOpacity>
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
  prevImageButton: {
    position: 'absolute',
    top: '50%',
    left: DesignTokens.spacing.md,
    width: 36,
    height: 36,
    borderRadius: DesignTokens.borderRadius.circular,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -18 }],
  } as ViewStyle,
  nextImageButton: {
    position: 'absolute',
    top: '50%',
    right: DesignTokens.spacing.md,
    width: 36,
    height: 36,
    borderRadius: DesignTokens.borderRadius.circular,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -18 }],
  } as ViewStyle,
  imageIndicators: {
    position: 'absolute',
    bottom: DesignTokens.spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: DesignTokens.spacing.xs,
  } as ViewStyle,
  indicator: {
    width: 8,
    height: 8,
    borderRadius: DesignTokens.borderRadius.circular,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  } as ViewStyle,
  activeIndicator: {
    backgroundColor: Colors.neutrals.white,
  } as ViewStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    paddingBottom: 140,
  } as ViewStyle,
  attractionInfo: {
    padding: DesignTokens.spacing.lg,
  } as ViewStyle,
  categoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.appIdentity.primaryBrand,
    borderRadius: DesignTokens.borderRadius.medium,
    paddingHorizontal: DesignTokens.spacing.sm,
    paddingVertical: DesignTokens.spacing.xs,
    marginBottom: DesignTokens.spacing.sm,
  } as ViewStyle,
  categoryText: {
    color: Colors.neutrals.white,
    fontWeight: '600',
  } as TextStyle,
  attractionName: {
    color: Colors.neutrals.charcoal,
    marginBottom: DesignTokens.spacing.sm,
  } as TextStyle,
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.sm,
  } as ViewStyle,
  locationText: {
    color: Colors.neutrals.darkGray,
    marginLeft: DesignTokens.spacing.xs,
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
  } as TextStyle,
  section: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginBottom: DesignTokens.spacing.xl,
  } as ViewStyle,
  sectionTitle: {
    color: Colors.neutrals.charcoal,
    marginBottom: DesignTokens.spacing.lg,
  } as TextStyle,
  quickInfoGrid: {
    gap: DesignTokens.spacing.md,
  } as ViewStyle,
  quickInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.spacing.md,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  } as ViewStyle,
  quickInfoContent: {
    marginLeft: DesignTokens.spacing.md,
    flex: 1,
  } as ViewStyle,
  quickInfoLabel: {
    color: Colors.neutrals.darkGray,
    marginBottom: DesignTokens.spacing.xs,
  } as TextStyle,
  quickInfoValue: {
    color: Colors.neutrals.charcoal,
    fontWeight: '600',
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
  actionSection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingBottom: DesignTokens.spacing.xl,
    gap: DesignTokens.spacing.md,
  } as ViewStyle,
  directionsButton: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    paddingVertical: DesignTokens.spacing.lg,
    paddingHorizontal: DesignTokens.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.appIdentity.primaryBrand,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  } as ViewStyle,
  directionsButtonText: {
    color: Colors.appIdentity.primaryBrand,
    fontWeight: '600',
    marginLeft: DesignTokens.spacing.sm,
  } as TextStyle,
  shareButton: {
    backgroundColor: Colors.appIdentity.primaryBrand,
    borderRadius: DesignTokens.borderRadius.large,
    paddingVertical: DesignTokens.spacing.lg,
    paddingHorizontal: DesignTokens.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,
  shareButtonText: {
    color: Colors.neutrals.white,
    fontWeight: '600',
    marginLeft: DesignTokens.spacing.sm,
  } as TextStyle,
});
