import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import CustomText from '../components/ui/CustomText';
import { Colors } from '../constants/Colors';
import { DesignTokens } from '../constants/DesignTokens';

const { width: screenWidth } = Dimensions.get('window');

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: string;
  description: string;
  images: string[];
  amenities: string[];
  rooms: Room[];
}

interface Room {
  id: string;
  type: string;
  price: string;
  capacity: string;
  amenities: string[];
  image: string;
}

// Mock data
const mockHotel: Hotel = {
  id: '1',
  name: 'The Grand Baguio Hotel',
  location: 'Baguio City, Philippines',
  rating: 4.8,
  reviewCount: 234,
  price: '$120/night',
  description: 'Experience luxury and comfort at The Grand Baguio Hotel, nestled in the heart of Baguio City. Our hotel offers stunning mountain views, world-class amenities, and exceptional service to make your stay unforgettable.',
  images: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop'
  ],
  amenities: [
    'Free WiFi',
    'Swimming Pool',
    'Fitness Center',
    'Restaurant',
    'Room Service',
    'Parking',
    'Spa & Wellness',
    'Business Center'
  ],
  rooms: [
    {
      id: '1',
      type: 'Deluxe Room',
      price: '$120/night',
      capacity: '2 guests',
      amenities: ['King Bed', 'City View', 'Free WiFi', 'Mini Bar'],
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&h=200&fit=crop'
    },
    {
      id: '2',
      type: 'Executive Suite',
      price: '$200/night',
      capacity: '4 guests',
      amenities: ['King Bed', 'Mountain View', 'Free WiFi', 'Living Area'],
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=300&h=200&fit=crop'
    },
    {
      id: '3',
      type: 'Presidential Suite',
      price: '$350/night',
      capacity: '6 guests',
      amenities: ['King Bed', 'Panoramic View', 'Free WiFi', 'Private Balcony'],
      image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=300&h=200&fit=crop'
    }
  ]
};

export default function HotelDetailScreen() {
  const params = useLocalSearchParams();
  const [hotel, setHotel] = useState<Hotel>(mockHotel);
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
    // Update hotel data from params only once
    if (params.name && hotel.name !== params.name) {
      const amenitiesList = params.amenities ? (params.amenities as string).split(',') : ['WiFi', 'Restaurant', 'Parking'];
      setHotel({
        id: params.id as string || '1',
        name: params.name as string,
        location: `${params.location as string}, Baguio City, Philippines`,
        rating: parseFloat(params.rating as string) || 4.5,
        reviewCount: Math.floor(Math.random() * 300) + 100,
        price: params.price as string || '₱3,000/night',
        description: `Experience comfort and convenience at ${params.name}. This hotel offers excellent amenities and service to make your stay in Baguio memorable.`,
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop'
        ],
        amenities: amenitiesList,
        rooms: mockHotel.rooms
      });
    }
  }, [params.name, params.id, params.rating, params.price, params.location, params.amenities]);

  const handleRoomPress = (room: Room) => {
    Alert.alert(
      'Room Selected',
      `You selected: ${room.type}\nPrice: ${room.price}\nCapacity: ${room.capacity}`,
      [
        {
          text: 'View Details',
          onPress: () => {
            Alert.alert('Room Details', 'Room detail screen would open here');
          },
        },
        {
          text: 'Book Now',
          onPress: () => {
            Alert.alert('Booking', 'Booking screen would open here');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };


  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hotel.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
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
            <Image source={{ uri: hotel.images[currentImageIndex] }} style={styles.headerImage} />
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
              {hotel.images.map((_, index) => (
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
            {/* Hotel Info */}
            <View style={styles.hotelInfo}>
              <CustomText variant="h1" style={styles.hotelName}>{hotel.name}</CustomText>
              
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={16} color={Colors.neutrals.darkGray} />
                <CustomText variant="body" style={styles.locationText}>{hotel.location}</CustomText>
              </View>

              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color={Colors.functional.warning} />
                <CustomText variant="body" style={styles.ratingText}>{hotel.rating}</CustomText>
                <CustomText variant="caption" style={styles.reviewText}>({hotel.reviewCount} reviews)</CustomText>
                <View style={styles.priceContainer}>
                  <CustomText variant="h3" style={styles.priceText}>{hotel.price}</CustomText>
                </View>
              </View>

              <CustomText variant="body" style={styles.description}>
                {hotel.description}
              </CustomText>
            </View>

            {/* Amenities */}
            <View style={styles.section}>
              <CustomText variant="h3" style={styles.sectionTitle}>Amenities</CustomText>
              <View style={styles.amenitiesGrid}>
                {hotel.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityItem}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.functional.success} />
                    <CustomText variant="body" style={styles.amenityText}>{amenity}</CustomText>
                  </View>
                ))}
              </View>
            </View>

            {/* Available Rooms */}
            <View style={styles.section}>
              <CustomText variant="h3" style={styles.sectionTitle}>Available Rooms</CustomText>
              
              {hotel.rooms.map((room) => (
                <TouchableOpacity
                  key={room.id}
                  style={styles.roomCard}
                  onPress={() => handleRoomPress(room)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: room.image }} style={styles.roomImage} />
                  <View style={styles.roomContent}>
                    <CustomText variant="h3" style={styles.roomType}>{room.type}</CustomText>
                    <CustomText variant="caption" style={styles.roomCapacity}>{room.capacity}</CustomText>
                    <CustomText variant="bodySmall" style={styles.roomPrice}>{room.price}</CustomText>
                    
                    <View style={styles.roomAmenities}>
                      {room.amenities.slice(0, 2).map((amenity, index) => (
                        <View key={index} style={styles.roomAmenityItem}>
                          <Ionicons name="checkmark" size={12} color={Colors.functional.success} />
                          <CustomText variant="caption" style={styles.roomAmenityText}>{amenity}</CustomText>
                        </View>
                      ))}
                    </View>

                    <TouchableOpacity style={styles.roomButton}>
                      <CustomText variant="buttonText" style={styles.roomButtonText}>Select</CustomText>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
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
  hotelInfo: {
    padding: DesignTokens.spacing.lg,
  } as ViewStyle,
  hotelName: {
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
  priceContainer: {
    marginLeft: 'auto',
  } as ViewStyle,
  priceText: {
    color: Colors.appIdentity.primaryBrand,
    fontWeight: '600',
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
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DesignTokens.spacing.sm,
  } as ViewStyle,
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: DesignTokens.spacing.sm,
  } as ViewStyle,
  amenityText: {
    color: Colors.neutrals.charcoal,
    marginLeft: DesignTokens.spacing.sm,
  } as TextStyle,
  roomCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    marginBottom: DesignTokens.spacing.md,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  } as ViewStyle,
  roomImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  } as any,
  roomContent: {
    padding: DesignTokens.spacing.md,
  } as ViewStyle,
  roomType: {
    color: Colors.neutrals.charcoal,
    marginBottom: DesignTokens.spacing.xs,
  } as TextStyle,
  roomCapacity: {
    color: Colors.neutrals.darkGray,
    marginBottom: DesignTokens.spacing.xs,
  } as TextStyle,
  roomPrice: {
    color: Colors.appIdentity.primaryBrand,
    fontWeight: '600',
    marginBottom: DesignTokens.spacing.sm,
  } as TextStyle,
  roomAmenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DesignTokens.spacing.sm,
    marginBottom: DesignTokens.spacing.md,
  } as ViewStyle,
  roomAmenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  roomAmenityText: {
    color: Colors.neutrals.darkGray,
    marginLeft: DesignTokens.spacing.xs,
  } as TextStyle,
  roomButton: {
    backgroundColor: Colors.appIdentity.primaryBrand,
    borderRadius: DesignTokens.borderRadius.medium,
    paddingVertical: DesignTokens.spacing.sm,
    paddingHorizontal: DesignTokens.spacing.md,
    alignSelf: 'flex-start',
  } as ViewStyle,
  roomButtonText: {
    color: Colors.neutrals.white,
    fontWeight: '600',
  } as TextStyle,
});
