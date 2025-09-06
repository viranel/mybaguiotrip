import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, SafeAreaView, ScrollView, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import CustomText from '../../components/ui/CustomText';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'How do I plan a trip with AI?',
    answer: 'Go to the AI Planner tab, fill in your travel dates, number of travelers, budget, and preferences. Then tap "Generate Itinerary" to get a personalized travel plan.',
    category: 'Planning',
  },
  {
    id: '2',
    question: 'Can I modify my generated itinerary?',
    answer: 'Yes! After generating an itinerary, you can edit activities, change dates, or adjust your budget. Your itinerary will be saved in the My Trips section.',
    category: 'Planning',
  },
  {
    id: '3',
    question: 'How do I find hotels in Baguio?',
    answer: 'Use the "Find Hotels" quick action or search for accommodations in the Hotels section. You can filter by price range, amenities, and location.',
    category: 'Accommodation',
  },
  {
    id: '4',
    question: 'What are the must-visit attractions?',
    answer: 'Check out the "Discover Spots" section for popular attractions like Burnham Park, Mines View Park, Strawberry Farm, and Baguio Cathedral.',
    category: 'Attractions',
  },
  {
    id: '5',
    question: 'How do I save my favorite places?',
    answer: 'Tap the heart icon on any attraction or hotel card to add it to your favorites. You can view all saved items in your profile.',
    category: 'Features',
  },
  {
    id: '6',
    question: 'Is the app available offline?',
    answer: 'Basic features work offline, but for real-time information like weather and current prices, an internet connection is required.',
    category: 'Technical',
  },
];

const categories = ['All', 'Planning', 'Accommodation', 'Attractions', 'Features', 'Technical'];

export default function HelpCenterScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [screenSlideAnim] = useState(new Animated.Value(300)); // Start from right

  useEffect(() => {
    // Slide in from right animation
    Animated.spring(screenSlideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const filteredFAQs = selectedCategory === 'All' 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory);

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Choose how you would like to contact our support team',
      [
        {
          text: 'Email Support',
          onPress: () => {
            Alert.alert('Email Support', 'support@mybaguiotrip.com');
          },
        },
        {
          text: 'Live Chat',
          onPress: () => {
            Alert.alert('Live Chat', 'Live chat functionality would open here');
          },
        },
        {
          text: 'Phone Support',
          onPress: () => {
            Alert.alert('Phone Support', '+63 912 345 6789');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.View 
        style={[
          styles.container,
          {
            transform: [{ translateX: screenSlideAnim }],
          }
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
              {/* Header with Gradient */}
      <View>
          <LinearGradient
            colors={Colors.gradients.primary || ['#FB923C', '#F97316']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
                          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={Colors.neutrals.white} />
            </TouchableOpacity>
              <View style={styles.headerCenter}>
                <CustomText variant="h2" style={styles.headerTitle}>Help Center</CustomText>
                <CustomText variant="body" style={styles.headerSubtitle}>Find answers to common questions</CustomText>
              </View>
              <TouchableOpacity style={styles.searchButton}>
                <Ionicons name="search" size={24} color={Colors.neutrals.white} />
              </TouchableOpacity>
            </View>
                  </LinearGradient>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <CustomText variant="h3" style={styles.sectionTitle}>Quick Actions</CustomText>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionCard} onPress={handleContactSupport}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="mail" size={24} color={Colors.appIdentity.primaryBrand} />
              </View>
              <CustomText variant="h3" style={styles.quickActionTitle}>Contact Support</CustomText>
              <CustomText variant="bodySmall" style={styles.quickActionSubtitle}>Get direct help</CustomText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="document-text" size={24} color={Colors.functional.success} />
              </View>
              <CustomText variant="h3" style={styles.quickActionTitle}>User Guide</CustomText>
              <CustomText variant="bodySmall" style={styles.quickActionSubtitle}>Step-by-step tutorial</CustomText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Filters */}
        <View style={styles.section}>
          <CustomText variant="h3" style={styles.sectionTitle}>Browse by Category</CustomText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive
                ]}
                onPress={() => handleCategorySelect(category)}
                activeOpacity={0.8}
              >
                <CustomText 
                  variant="caption" 
                  style={[
                    styles.categoryLabel,
                    selectedCategory === category && styles.categoryLabelActive
                  ]}
                >
                  {category}
                </CustomText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <CustomText variant="h3" style={styles.sectionTitle}>Frequently Asked Questions</CustomText>
          <View style={styles.faqList}>
            {filteredFAQs.map((faq) => (
              <TouchableOpacity
                key={faq.id}
                style={styles.faqCard}
                onPress={() => toggleFAQ(faq.id)}
                activeOpacity={0.8}
              >
                <View style={styles.faqHeader}>
                  <View style={styles.faqQuestion}>
                    <CustomText variant="h3" style={styles.faqQuestionText}>{faq.question}</CustomText>
                    <CustomText variant="caption" style={styles.faqCategory}>{faq.category}</CustomText>
                  </View>
                  <Ionicons 
                    name={expandedFAQ === faq.id ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={Colors.neutrals.darkGray} 
                  />
                </View>
                {expandedFAQ === faq.id && (
                  <View style={styles.faqAnswer}>
                    <CustomText variant="bodySmall" style={styles.faqAnswerText}>{faq.answer}</CustomText>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <View style={styles.contactCard}>
            <Ionicons name="chatbubble-ellipses" size={32} color={Colors.appIdentity.primaryBrand} />
            <CustomText variant="h3" style={styles.contactTitle}>Still Need Help?</CustomText>
            <CustomText variant="bodySmall" style={styles.contactSubtitle}>
              Our support team is here to help you with any questions or issues
            </CustomText>
            <TouchableOpacity style={styles.contactButton} onPress={handleContactSupport}>
              <CustomText variant="buttonText" style={styles.contactButtonText}>Contact Support</CustomText>
            </TouchableOpacity>
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
  } as ViewStyle,
  safeArea: {
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  backButton: {
    width: 40,
    height: 40,
    borderRadius: DesignTokens.borderRadius.circular,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,
  headerTitle: {
    color: Colors.neutrals.white,
    marginBottom: DesignTokens.spacing.xs,
  } as TextStyle,
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  } as TextStyle,
  searchButton: {
    width: 40,
    height: 40,
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
  section: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginBottom: DesignTokens.spacing.xl,
  } as ViewStyle,
  sectionTitle: {
    color: Colors.neutrals.charcoal,
    marginBottom: DesignTokens.spacing.lg,
  } as TextStyle,
  quickActions: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.md,
  } as ViewStyle,
  quickActionCard: {
    flex: 1,
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.accessibility.cardPadding,
    alignItems: 'center',
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
  } as ViewStyle,
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: DesignTokens.borderRadius.medium,
    backgroundColor: `${Colors.appIdentity.primaryBrand}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: DesignTokens.spacing.sm,
  } as ViewStyle,
  quickActionTitle: {
    color: Colors.neutrals.charcoal,
    marginBottom: 4,
    textAlign: 'center',
  } as TextStyle,
  quickActionSubtitle: {
    color: Colors.neutrals.darkGray,
    textAlign: 'center',
  } as TextStyle,
  categoryScroll: {
    gap: DesignTokens.spacing.sm,
  } as ViewStyle,
  categoryButton: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.pill,
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
  } as ViewStyle,
  categoryButtonActive: {
    backgroundColor: Colors.appIdentity.primaryBrand,
    borderColor: Colors.appIdentity.primaryBrand,
  } as ViewStyle,
  categoryLabel: {
    color: Colors.neutrals.darkGray,
    fontWeight: '600',
  } as TextStyle,
  categoryLabelActive: {
    color: Colors.neutrals.white,
  } as TextStyle,
  faqList: {
    gap: DesignTokens.spacing.sm,
  } as ViewStyle,
  faqCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.accessibility.cardPadding,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
  } as ViewStyle,
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  faqQuestion: {
    flex: 1,
  } as ViewStyle,
  faqQuestionText: {
    color: Colors.neutrals.charcoal,
    marginBottom: 4,
  } as TextStyle,
  faqCategory: {
    color: Colors.appIdentity.primaryBrand,
    fontWeight: '500',
  } as TextStyle,
  faqAnswer: {
    marginTop: DesignTokens.spacing.md,
    paddingTop: DesignTokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutrals.gray300,
  } as ViewStyle,
  faqAnswerText: {
    color: Colors.neutrals.darkGray,
    lineHeight: 20,
  } as TextStyle,
  contactCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.spacing.xl,
    alignItems: 'center',
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
  } as ViewStyle,
  contactTitle: {
    color: Colors.neutrals.charcoal,
    marginTop: DesignTokens.spacing.md,
    marginBottom: DesignTokens.spacing.sm,
  } as TextStyle,
  contactSubtitle: {
    color: Colors.neutrals.darkGray,
    textAlign: 'center',
    marginBottom: DesignTokens.spacing.lg,
  } as TextStyle,
  contactButton: {
    backgroundColor: Colors.appIdentity.primaryBrand,
    borderRadius: DesignTokens.borderRadius.medium,
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingVertical: DesignTokens.spacing.md,
  } as ViewStyle,
  contactButtonText: {
    color: Colors.neutrals.white,
    fontWeight: '600',
  } as TextStyle,
});
