import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import CustomText from '../../components/ui/CustomText';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';

// Mock hotel data
const mockHotels = [
  {
    id: 1,
    name: 'The Manor Hotel',
    location: 'Camp John Hay',
    price: '₱8,500',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant'],
    description: 'Luxury hotel in the heart of Camp John Hay with stunning mountain views.'
  },
  {
    id: 2,
    name: 'Baguio Country Club',
    location: 'Country Club Road',
    price: '₱12,000',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
    amenities: ['Golf Course', 'Pool', 'Spa', 'Fine Dining'],
    description: 'Exclusive country club with world-class facilities and breathtaking scenery.'
  },
  {
    id: 3,
    name: 'Hotel Elizabeth',
    location: 'Session Road',
    price: '₱4,500',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    amenities: ['Free WiFi', 'Restaurant', 'Parking', 'Concierge'],
    description: 'Modern hotel in the city center with easy access to shopping and dining.'
  },
  {
    id: 4,
    name: 'Microtel by Wyndham',
    location: 'Legarda Road',
    price: '₱3,200',
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
    amenities: ['Free WiFi', 'Breakfast', 'Parking', 'Business Center'],
    description: 'Comfortable and affordable accommodation with modern amenities.'
  },
  {
    id: 5,
    name: 'Crimson Hotel',
    location: 'Loakan Road',
    price: '₱6,800',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Fitness Center'],
    description: 'Contemporary hotel with excellent service and beautiful architecture.'
  },
];

export default function HotelsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleHotelPress = (hotel: any) => {
    router.push({
      pathname: '/hotel-detail',
      params: {
        id: hotel.id.toString(),
        name: hotel.name,
        location: hotel.location,
        price: hotel.price,
        rating: hotel.rating.toString(),
        image: hotel.image,
        amenities: hotel.amenities.join(','),
        description: hotel.description,
      },
    });
  };

  const filteredHotels = mockHotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <CustomText variant="h1" style={styles.headerTitle}>
          Find Hotels
        </CustomText>
        <CustomText variant="body" style={styles.headerSubtitle}>
          Discover the perfect place to stay in Baguio
        </CustomText>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.neutrals.gray500} style={styles.searchIcon} />
        <CustomText
          style={styles.searchInput}
          onPress={() => Alert.alert('Search', 'Search functionality coming soon!')}
        >
          Search hotels...
        </CustomText>
      </View>

      {/* Hotels List */}
      <ScrollView style={styles.hotelsList} showsVerticalScrollIndicator={false}>
        {filteredHotels.map((hotel) => (
          <TouchableOpacity
            key={hotel.id}
            style={styles.hotelCard}
            onPress={() => handleHotelPress(hotel)}
            activeOpacity={0.7}
          >
            <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
            <View style={styles.hotelInfo}>
              <View style={styles.hotelHeader}>
                <CustomText variant="h3" style={styles.hotelName}>
                  {hotel.name}
                </CustomText>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color={Colors.semantic.warning} />
                  <CustomText variant="caption" style={styles.rating}>
                    {hotel.rating}
                  </CustomText>
                </View>
              </View>
              
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={14} color={Colors.neutrals.gray600} />
                <CustomText variant="bodySmall" style={styles.location}>
                  {hotel.location}
                </CustomText>
              </View>

              <View style={styles.amenitiesContainer}>
                {hotel.amenities.slice(0, 3).map((amenity, index) => (
                  <View key={index} style={styles.amenityTag}>
                    <CustomText variant="caption" style={styles.amenityText}>
                      {amenity}
                    </CustomText>
                  </View>
                ))}
                {hotel.amenities.length > 3 && (
                  <CustomText variant="caption" style={styles.moreAmenities}>
                    +{hotel.amenities.length - 3} more
                  </CustomText>
                )}
              </View>

              <View style={styles.priceContainer}>
                <CustomText variant="h3" style={styles.price}>
                  {hotel.price}
                </CustomText>
                <CustomText variant="caption" style={styles.priceUnit}>
                  per night
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
  hotelsList: {
    flex: 1,
    paddingHorizontal: DesignTokens.spacing.lg,
  },
  hotelCard: {
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
  hotelImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  hotelInfo: {
    padding: DesignTokens.spacing.lg,
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: DesignTokens.spacing.sm,
  },
  hotelName: {
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.md,
  },
  location: {
    color: Colors.neutrals.gray600,
    marginLeft: DesignTokens.spacing.xs,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: DesignTokens.spacing.lg,
  },
  amenityTag: {
    backgroundColor: Colors.appIdentity.primaryBrandLight,
    paddingHorizontal: DesignTokens.spacing.sm,
    paddingVertical: DesignTokens.spacing.xs,
    borderRadius: DesignTokens.borderRadius.small,
    marginRight: DesignTokens.spacing.sm,
    marginBottom: DesignTokens.spacing.xs,
  },
  amenityText: {
    color: Colors.appIdentity.primaryBrand,
    fontSize: 12,
  },
  moreAmenities: {
    color: Colors.neutrals.gray500,
    alignSelf: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    color: Colors.appIdentity.primaryBrand,
    marginRight: DesignTokens.spacing.xs,
  },
  priceUnit: {
    color: Colors.neutrals.gray500,
  },
});

