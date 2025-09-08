import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';
import CustomText from '../ui/CustomText';

interface FeaturedPlace {
  name: string;
  description: string;
  image: any;
  category: string;
  rating: number;
  distance?: string;
}

const featuredPlaces: FeaturedPlace[] = [
  {
    name: "Burnham Park",
    description: "Historic park perfect for leisurely walks and boat rides",
    image: require("../../assetpics/burnhampark.jpg"),
    category: "Sightseeing",
    rating: 4.5,
    distance: "0.5 km",
  },
  {
    name: "Strawberry Farm",
    description: "Pick fresh strawberries and enjoy local delicacies",
    image: require("../../assetpics/strawberryfarm.jpg"),
    category: "Food Trip",
    rating: 4.3,
    distance: "2.1 km",
  },
  {
    name: "Session Road",
    description: "Main shopping and dining strip of Baguio",
    image: require("../../assetpics/sessionroad.jpg"),
    category: "Shopping",
    rating: 4.7,
    distance: "0.8 km",
  },
  {
    name: "Mines View Park",
    description: "Breathtaking views of the Cordillera mountains",
    image: require("../../assetpics/minesviewpark.jpg"),
    category: "Nature",
    rating: 4.6,
    distance: "3.2 km",
  },
];

export default function FeaturedDestinations() {
  const handlePlacePress = (place: FeaturedPlace) => {
    // Navigate to destination detail screen with place data
    router.push({
      pathname: '/destination-detail',
      params: {
        id: place.name.toLowerCase().replace(/\s+/g, '-'),
        name: place.name,
        description: place.description,
        category: place.category,
        rating: place.rating.toString(),
        distance: place.distance || '',
        image: place.image,
      }
    });
  };

  const handleSeeAllPress = () => {
    router.push('/(tabs)/attractions');
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'sightseeing': return 'eye';
      case 'food trip': return 'restaurant';
      case 'shopping': return 'bag';
      case 'nature': return 'leaf';
      default: return 'location';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <CustomText variant="h2" style={styles.title}>Featured Destinations</CustomText>
          <CustomText variant="bodySmall" style={styles.subtitle}>Popular places to visit in Baguio</CustomText>
        </View>
        <TouchableOpacity style={styles.seeAllButton} onPress={handleSeeAllPress}>
          <CustomText variant="bodySmall" style={styles.seeAllText}>See All</CustomText>
          <Ionicons name="arrow-forward" size={16} color={Colors.appIdentity.primaryBrand} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {featuredPlaces.map((place, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.card}
            onPress={() => handlePlacePress(place)}
            activeOpacity={0.8}
          >
            <View style={styles.imageContainer}>
              <Image 
                source={place.image as any}
                style={styles.image}
              />
              <View style={styles.overlay}>
                <View style={styles.badge}>
                  <Ionicons name={getCategoryIcon(place.category) as any} size={12} color={Colors.neutrals.white} />
                  <CustomText variant="caption" style={styles.badgeText}>{place.category}</CustomText>
                </View>
                <View style={styles.distanceBadge}>
                  <CustomText variant="caption" style={styles.distanceText}>{place.distance}</CustomText>
                </View>
              </View>
            </View>
            
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <CustomText variant="h3" style={styles.placeName} numberOfLines={1}>{place.name}</CustomText>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color={Colors.functional.warning} />
                  <CustomText variant="bodySmall" style={styles.rating}>{place.rating}</CustomText>
                </View>
              </View>
              
              <CustomText variant="body" style={styles.description} numberOfLines={2}>{place.description}</CustomText>
              
              <TouchableOpacity style={styles.exploreButton}>
                <CustomText variant="bodySmall" style={styles.exploreButtonText}>Explore</CustomText>
                <Ionicons name="arrow-forward" size={14} color={Colors.appIdentity.primaryBrand} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: DesignTokens.spacing.sm,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.lg,
    paddingHorizontal: DesignTokens.spacing.lg,
  } as ViewStyle,
  headerLeft: {
    flex: 1,
  } as ViewStyle,
  title: {
    color: Colors.neutrals.gray900,
    marginBottom: DesignTokens.spacing.xs,
  } as TextStyle,
  subtitle: {
    color: Colors.neutrals.gray700,
  } as TextStyle,
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.xs,
  } as ViewStyle,
  seeAllText: {
    color: Colors.appIdentity.primaryBrand,
    fontWeight: '600',
  } as TextStyle,
  scrollContainer: {
    marginLeft: DesignTokens.spacing.lg,
  } as ViewStyle,
  scrollContent: {
    paddingRight: DesignTokens.spacing.lg,
  } as ViewStyle,
  card: {
    width: 300,
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.extraLarge,
    marginRight: DesignTokens.spacing.md,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    overflow: 'hidden',
  } as ViewStyle,
  imageContainer: {
    position: 'relative',
    height: 180,
  } as ViewStyle,
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: DesignTokens.spacing.sm,
    left: DesignTokens.spacing.sm,
    right: DesignTokens.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  badge: {
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    paddingHorizontal: DesignTokens.spacing.sm,
    paddingVertical: DesignTokens.spacing.xs,
    borderRadius: DesignTokens.borderRadius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.xs,
  } as ViewStyle,
  badgeText: {
    color: Colors.neutrals.white,
    fontWeight: '600',
  } as TextStyle,
  distanceBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: DesignTokens.spacing.xs,
    borderRadius: DesignTokens.borderRadius.medium,
  } as ViewStyle,
  distanceText: {
    color: Colors.neutrals.white,
    fontWeight: '500',
  } as TextStyle,
  cardContent: {
    padding: DesignTokens.accessibility.cardPadding,
  } as ViewStyle,
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.sm,
  } as ViewStyle,
  placeName: {
    color: Colors.neutrals.gray900,
    flex: 1,
    marginRight: DesignTokens.spacing.sm,
  } as TextStyle,
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.xs,
  } as ViewStyle,
  rating: {
    fontWeight: '600',
    color: Colors.neutrals.gray900,
  } as TextStyle,
  description: {
    color: Colors.neutrals.gray700,
    marginBottom: DesignTokens.spacing.md,
  } as TextStyle,
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: DesignTokens.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.neutrals.gray300,
  } as ViewStyle,
  exploreButtonText: {
    color: Colors.appIdentity.primaryBrand,
    fontWeight: '600',
  } as TextStyle,
});
