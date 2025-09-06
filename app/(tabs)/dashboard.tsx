import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import FeaturedDestinations from '../../components/dashboard/FeaturedDestinations';
import QuickActions from '../../components/dashboard/QuickActions';
import CustomText from '../../components/ui/CustomText';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';

interface WeatherDay {
  day: string;
  temp: string;
  condition: string;
  icon: string;
}

const weatherForecast: WeatherDay[] = [
  { day: 'Today', temp: '22°C', condition: 'Partly Cloudy', icon: 'partly-sunny' },
  { day: 'Tomorrow', temp: '20°C', condition: 'Light Rain', icon: 'rainy' },
  { day: 'Wed', temp: '24°C', condition: 'Sunny', icon: 'sunny' },
];

const travelTips = [
  {
    id: '1',
    title: 'Best Time to Visit',
    description: 'March to May offers the best weather for outdoor activities',
    icon: 'sunny',
    color: Colors.secondary.coral,
  },
  {
    id: '2',
    title: 'Local Transportation',
    description: 'Use jeepneys and taxis for getting around the city',
    icon: 'car',
    color: Colors.appIdentity.primaryBrand,
  },
  {
    id: '3',
    title: 'Must-Try Food',
    description: 'Don\'t miss the famous strawberry taho and Baguio longganisa',
    icon: 'restaurant',
    color: Colors.functional.success,
  },
];

export default function DashboardScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={Colors.appIdentity.primaryBrand} />
      
      {/* Header with Gradient */}
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <LinearGradient
          colors={Colors.gradients.primary || ['#FB923C', '#F97316']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.welcomeSection}>
              <CustomText variant="h2" style={styles.welcomeTitle}>Welcome back!</CustomText>
              <CustomText variant="body" style={styles.welcomeSubtitle}>Ready for your next Baguio adventure?</CustomText>
            </View>
            
            {/* Weather Section */}
            <View style={styles.weatherSection}>
              <CustomText variant="h3" style={styles.weatherTitle}>Weather Forecast</CustomText>
              <View style={styles.weatherCards}>
                {weatherForecast.map((day, index) => (
                  <Animated.View 
                    key={index} 
                    style={[
                      styles.weatherCard,
                      {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                      }
                    ]}
                  >
                    <CustomText variant="caption" style={styles.weatherDay}>{day.day}</CustomText>
                    <Ionicons name={day.icon as any} size={20} color={Colors.neutrals.white} />
                    <CustomText variant="bodySmall" style={styles.weatherTemp}>{day.temp}</CustomText>
                    <CustomText variant="caption" style={styles.weatherCondition}>{day.condition}</CustomText>
                  </Animated.View>
                ))}
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View style={[styles.searchContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={Colors.neutrals.gray600} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search destinations, hotels, or activities..."
            placeholderTextColor={Colors.neutrals.gray600}
          />
        </View>
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Actions */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <QuickActions />
        </Animated.View>

        {/* Featured Destinations */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <FeaturedDestinations />
        </Animated.View>

        {/* Travel Tips */}
        <Animated.View style={[styles.tipsSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.sectionHeader}>
            <CustomText variant="h2" style={styles.sectionTitle}>Travel Tips</CustomText>
            <CustomText variant="bodySmall" style={styles.sectionSubtitle}>Make the most of your Baguio trip</CustomText>
          </View>
          
          <View style={styles.tipsGrid}>
            {travelTips.map((tip, index) => (
              <Animated.View 
                key={tip.id} 
                style={[
                  styles.tipCard,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                  }
                ]}
              >
                <View style={[styles.tipIcon, { backgroundColor: `${tip.color}15` }]}>
                  <Ionicons name={tip.icon as any} size={24} color={tip.color} />
                </View>
                <CustomText variant="h3" style={styles.tipTitle}>{tip.title}</CustomText>
                <CustomText variant="bodySmall" style={styles.tipDescription}>{tip.description}</CustomText>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
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
    gap: DesignTokens.spacing.lg,
  } as ViewStyle,
  welcomeSection: {
    marginBottom: DesignTokens.spacing.sm,
  } as ViewStyle,
  welcomeTitle: {
    color: Colors.neutrals.white,
    marginBottom: DesignTokens.spacing.xs,
  } as TextStyle,
  welcomeSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  } as TextStyle,
  weatherSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.spacing.md,
  } as ViewStyle,
  weatherTitle: {
    color: Colors.neutrals.white,
    marginBottom: DesignTokens.spacing.sm,
    fontSize: 16,
    fontWeight: '600',
  } as TextStyle,
  weatherCards: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.sm,
  } as ViewStyle,
  weatherCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: DesignTokens.spacing.sm,
  } as ViewStyle,
  weatherDay: {
    color: Colors.neutrals.white,
    marginBottom: DesignTokens.spacing.xs,
    fontWeight: '500',
  } as TextStyle,
  weatherTemp: {
    color: Colors.neutrals.white,
    marginTop: DesignTokens.spacing.xs,
    fontWeight: '600',
  } as TextStyle,
  weatherCondition: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontSize: 10,
  } as TextStyle,
  searchContainer: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: -DesignTokens.spacing.md,
    marginBottom: DesignTokens.spacing.sm,
  } as ViewStyle,
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.sm,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
  } as ViewStyle,
  searchIcon: {
    marginRight: DesignTokens.spacing.sm,
  } as TextStyle,
  searchInput: {
    flex: 1,
    fontSize: DesignTokens.typography.body.fontSize,
    color: Colors.neutrals.gray900,
  } as TextStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    paddingBottom: 140,
  } as ViewStyle,
  tipsSection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.xl,
  } as ViewStyle,
  sectionHeader: {
    marginBottom: DesignTokens.spacing.lg,
  } as ViewStyle,
  sectionTitle: {
    color: Colors.neutrals.gray900,
    marginBottom: DesignTokens.spacing.xs,
  } as TextStyle,
  sectionSubtitle: {
    color: Colors.neutrals.gray600,
  } as TextStyle,
  tipsGrid: {
    gap: DesignTokens.spacing.sm,
  } as ViewStyle,
  tipCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.accessibility.cardPadding,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
  } as ViewStyle,
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: DesignTokens.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DesignTokens.spacing.md,
  } as ViewStyle,
  tipTitle: {
    color: Colors.neutrals.gray900,
    marginBottom: 4,
    flex: 1,
  } as TextStyle,
  tipDescription: {
    color: Colors.neutrals.gray600,
    flex: 1,
  } as TextStyle,
  bottomSpacing: {
    height: DesignTokens.spacing.xl,
  } as ViewStyle,
});
