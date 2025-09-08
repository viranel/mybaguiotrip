import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import CustomText from '../../components/ui/CustomText';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';

// Mock attractions data
const mockAttractions = [
  {
    id: 1,
    name: 'Burnham Park',
    category: 'Park & Recreation',
    rating: 4.5,
    image: require('../../assetpics/burnhampark.jpg'),
    description: 'A beautiful urban park in the heart of Baguio City, perfect for leisurely walks and outdoor activities.',
    features: ['Boating', 'Picnic Areas', 'Children\'s Playground', 'Walking Trails'],
    location: 'Jose Abad Santos Drive',
    hours: '6:00 AM - 10:00 PM',
    price: 'Free'
  },
  {
    id: 2,
    name: 'Mines View Park',
    category: 'Scenic Viewpoint',
    rating: 4.7,
    image: require('../../assetpics/minesviewpark.jpg'),
    description: 'Famous viewpoint offering panoramic views of the Benguet mountains and old mining sites.',
    features: ['Scenic Views', 'Photo Opportunities', 'Local Souvenirs', 'Strawberry Fields'],
    location: 'Mines View Road',
    hours: '6:00 AM - 6:00 PM',
    price: '₱10 entrance fee'
  },
  {
    id: 3,
    name: 'Baguio Cathedral',
    category: 'Religious Site',
    rating: 4.6,
    image: require('../../assetpics/burnhampark.jpg'), // Using Burnham Park image as placeholder
    description: 'Historic pink cathedral with stunning architecture and peaceful atmosphere for reflection.',
    features: ['Religious Services', 'Historical Architecture', 'Peaceful Environment', 'Gift Shop'],
    location: 'Cathedral Loop',
    hours: '5:00 AM - 8:00 PM',
    price: 'Free'
  },
  {
    id: 4,
    name: 'Camp John Hay',
    category: 'Recreation Complex',
    rating: 4.8,
    image: require('../../assetpics/burnhampark.jpg'), // Using Burnham Park image as placeholder
    description: 'Former American military base turned into a premier leisure destination with golf, hotels, and shopping.',
    features: ['Golf Course', 'Hotels', 'Shopping', 'Restaurants', 'Nature Trails'],
    location: 'Camp John Hay',
    hours: '24/7',
    price: 'Varies by activity'
  },
  {
    id: 5,
    name: 'Strawberry Farm',
    category: 'Agricultural Tourism',
    rating: 4.3,
    image: require('../../assetpics/strawberryfarm.jpg'),
    description: 'Experience strawberry picking and enjoy fresh strawberries in the cool mountain climate.',
    features: ['Strawberry Picking', 'Fresh Produce', 'Photo Opportunities', 'Local Products'],
    location: 'La Trinidad',
    hours: '7:00 AM - 5:00 PM',
    price: '₱200 per basket'
  },
  {
    id: 6,
    name: 'Tam-Awan Village',
    category: 'Cultural Site',
    rating: 4.4,
    image: require('../../assetpics/tamawan.jpg'),
    description: 'Cultural village showcasing traditional Ifugao houses and local arts and crafts.',
    features: ['Cultural Shows', 'Traditional Houses', 'Art Gallery', 'Workshops'],
    location: 'Tam-Awan Road',
    hours: '8:00 AM - 6:00 PM',
    price: '₱50 entrance fee'
  },
];

export default function AttractionsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleAttractionPress = (attraction: any) => {
    router.push({
      pathname: '/attraction-detail',
      params: {
        id: attraction.id.toString(),
        name: attraction.name,
        category: attraction.category,
        rating: attraction.rating.toString(),
        image: attraction.image,
        description: attraction.description,
        features: attraction.features.join(','),
        location: attraction.location,
        hours: attraction.hours,
        price: attraction.price,
      },
    });
  };

  const filteredAttractions = mockAttractions.filter(attraction => {
    const matchesSearch = attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attraction.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <CustomText variant="h1" style={styles.headerTitle}>
          Discover Spots
        </CustomText>
        <CustomText variant="body" style={styles.headerSubtitle}>
          Explore the best attractions in Baguio City
        </CustomText>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.neutrals.gray500} style={styles.searchIcon} />
        <CustomText
          style={styles.searchInput}
          onPress={() => Alert.alert('Search', 'Search functionality coming soon!')}
        >
          Search attractions...
        </CustomText>
      </View>

      {/* Attractions List */}
      <ScrollView style={styles.attractionsList} showsVerticalScrollIndicator={false}>
        {filteredAttractions.map((attraction) => (
          <TouchableOpacity
            key={attraction.id}
            style={styles.attractionCard}
            onPress={() => handleAttractionPress(attraction)}
            activeOpacity={0.7}
          >
            <Image source={attraction.image} style={styles.attractionImage} />
            <View style={styles.attractionInfo}>
              <View style={styles.attractionHeader}>
                <CustomText variant="h3" style={styles.attractionName}>
                  {attraction.name}
                </CustomText>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color={Colors.semantic.warning} />
                  <CustomText variant="caption" style={styles.rating}>
                    {attraction.rating}
                  </CustomText>
                </View>
              </View>
              
              <View style={styles.categoryTag}>
                <CustomText variant="caption" style={styles.categoryTagText}>
                  {attraction.category}
                </CustomText>
              </View>

              <CustomText variant="bodySmall" style={styles.description} numberOfLines={2}>
                {attraction.description}
              </CustomText>

              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={14} color={Colors.neutrals.gray600} />
                <CustomText variant="bodySmall" style={styles.location}>
                  {attraction.location}
                </CustomText>
              </View>

              <View style={styles.bottomInfo}>
                <View style={styles.hoursContainer}>
                  <Ionicons name="time-outline" size={14} color={Colors.neutrals.gray600} />
                  <CustomText variant="caption" style={styles.hours}>
                    {attraction.hours}
                  </CustomText>
                </View>
                <CustomText variant="caption" style={styles.price}>
                  {attraction.price}
                </CustomText>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals.white,
  },
  header: {
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingTop: DesignTokens.spacing.xl,
    paddingBottom: DesignTokens.spacing.md,
  },
  headerTitle: {
    color: Colors.neutrals.gray900,
    marginBottom: DesignTokens.spacing.xs,
  },
  headerSubtitle: {
    color: Colors.neutrals.gray600,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutrals.gray50,
    marginHorizontal: DesignTokens.spacing.lg,
    marginBottom: DesignTokens.spacing.lg,
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.sm,
    borderRadius: DesignTokens.borderRadius.medium,
  },
  searchIcon: {
    marginRight: DesignTokens.spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Colors.neutrals.gray500,
    fontSize: 16,
  },
  attractionsList: {
    flex: 1,
    paddingHorizontal: DesignTokens.spacing.lg,
  },
  attractionCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    marginBottom: DesignTokens.spacing.lg,
    shadowColor: Colors.neutrals.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  attractionImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  attractionInfo: {
    padding: DesignTokens.spacing.lg,
  },
  attractionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: DesignTokens.spacing.sm,
  },
  attractionName: {
    flex: 1,
    color: Colors.neutrals.gray900,
    marginRight: DesignTokens.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.semantic.warningLight,
    paddingHorizontal: DesignTokens.spacing.sm,
    paddingVertical: DesignTokens.spacing.xs,
    borderRadius: DesignTokens.borderRadius.small,
  },
  rating: {
    color: Colors.semantic.warning,
    marginLeft: DesignTokens.spacing.xs,
    fontWeight: '600',
  },
  categoryTag: {
    backgroundColor: Colors.appIdentity.primaryBrandLight,
    paddingHorizontal: DesignTokens.spacing.sm,
    paddingVertical: DesignTokens.spacing.xs,
    borderRadius: DesignTokens.borderRadius.small,
    alignSelf: 'flex-start',
    marginBottom: DesignTokens.spacing.sm,
  },
  categoryTagText: {
    color: Colors.appIdentity.primaryBrand,
    fontSize: 12,
  },
  description: {
    color: Colors.neutrals.gray600,
    marginBottom: DesignTokens.spacing.md,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.sm,
  },
  location: {
    color: Colors.neutrals.gray600,
    marginLeft: DesignTokens.spacing.xs,
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hours: {
    color: Colors.neutrals.gray500,
    marginLeft: DesignTokens.spacing.xs,
  },
  price: {
    color: Colors.appIdentity.primaryBrand,
    fontWeight: '600',
  },
});
