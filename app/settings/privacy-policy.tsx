import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, SafeAreaView, ScrollView, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import CustomText from '../../components/ui/CustomText';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';

interface PolicySection {
  id: string;
  title: string;
  content: string;
  isExpanded: boolean;
}

const policySections: PolicySection[] = [
  {
    id: '1',
    title: 'Information We Collect',
    content: 'We collect information you provide directly to us, such as when you create an account, make a booking, or contact us for support. This may include your name, email address, phone number, travel preferences, and payment information.',
    isExpanded: false,
  },
  {
    id: '2',
    title: 'How We Use Your Information',
    content: 'We use the information we collect to provide, maintain, and improve our services, process your bookings, communicate with you, and personalize your experience. We may also use your information for analytics and to prevent fraud.',
    isExpanded: false,
  },
  {
    id: '3',
    title: 'Information Sharing',
    content: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with service providers who assist us in operating our platform.',
    isExpanded: false,
  },
  {
    id: '4',
    title: 'Data Security',
    content: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.',
    isExpanded: false,
  },
  {
    id: '5',
    title: 'Your Rights',
    content: 'You have the right to access, update, or delete your personal information. You can also opt out of certain communications and request a copy of your data. Contact us if you need assistance with any of these requests.',
    isExpanded: false,
  },
  {
    id: '6',
    title: 'Cookies and Tracking',
    content: 'We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences.',
    isExpanded: false,
  },
  {
    id: '7',
    title: 'Third-Party Services',
    content: 'Our app may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.',
    isExpanded: false,
  },
  {
    id: '8',
    title: 'Children\'s Privacy',
    content: 'Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.',
    isExpanded: false,
  },
  {
    id: '9',
    title: 'Changes to This Policy',
    content: 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of our services constitutes acceptance of the updated policy.',
    isExpanded: false,
  },
  {
    id: '10',
    title: 'Contact Us',
    content: 'If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@mybaguiotrip.com or through our contact form. We will respond to your inquiry within 48 hours.',
    isExpanded: false,
  },
];

export default function PrivacyPolicyScreen() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
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

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
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
                <CustomText variant="h2" style={styles.headerTitle}>Privacy Policy</CustomText>
                <CustomText variant="body" style={styles.headerSubtitle}>How we protect your information</CustomText>
              </View>
              <View style={styles.placeholder} />
            </View>
                  </LinearGradient>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Last Updated */}
        <View style={styles.section}>
          <View style={styles.lastUpdatedCard}>
            <Ionicons name="time" size={20} color={Colors.appIdentity.primaryBrand} />
            <View style={styles.lastUpdatedInfo}>
              <CustomText variant="bodySmall" style={styles.lastUpdatedTitle}>Last Updated</CustomText>
              <CustomText variant="caption" style={styles.lastUpdatedDate}>December 15, 2024</CustomText>
            </View>
          </View>
        </View>

        {/* Policy Sections */}
        <View style={styles.section}>
          <CustomText variant="h3" style={styles.sectionTitle}>Privacy Policy</CustomText>
          <View style={styles.policyList}>
            {policySections.map((section) => (
              <TouchableOpacity
                key={section.id}
                style={styles.policyCard}
                onPress={() => toggleSection(section.id)}
                activeOpacity={0.8}
              >
                <View style={styles.policyHeader}>
                  <View style={styles.policyTitleContainer}>
                    <CustomText variant="h3" style={styles.policyTitle}>{section.title}</CustomText>
                  </View>
                  <Ionicons 
                    name={expandedSections.has(section.id) ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={Colors.neutrals.darkGray} 
                  />
                </View>
                {expandedSections.has(section.id) && (
                  <View style={styles.policyContent}>
                    <CustomText variant="bodySmall" style={styles.policyText}>{section.content}</CustomText>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <View style={styles.contactCard}>
            <Ionicons name="shield-checkmark" size={32} color={Colors.functional.success} />
            <CustomText variant="h3" style={styles.contactTitle}>Questions About Privacy?</CustomText>
            <CustomText variant="bodySmall" style={styles.contactSubtitle}>
              We\'re committed to protecting your privacy and being transparent about our practices
            </CustomText>
            <TouchableOpacity style={styles.contactButton}>
              <CustomText variant="buttonText" style={styles.contactButtonText}>Contact Privacy Team</CustomText>
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
  placeholder: {
    width: 40,
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
  lastUpdatedCard: {
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
  lastUpdatedInfo: {
    marginLeft: DesignTokens.spacing.sm,
  } as ViewStyle,
  lastUpdatedTitle: {
    color: Colors.appIdentity.primaryBrand,
    fontWeight: '600',
    marginBottom: 2,
  } as TextStyle,
  lastUpdatedDate: {
    color: Colors.neutrals.darkGray,
  } as TextStyle,
  sectionTitle: {
    color: Colors.neutrals.charcoal,
    marginBottom: DesignTokens.spacing.lg,
  } as TextStyle,
  policyList: {
    gap: DesignTokens.spacing.sm,
  } as ViewStyle,
  policyCard: {
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
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  policyTitleContainer: {
    flex: 1,
  } as ViewStyle,
  policyTitle: {
    color: Colors.neutrals.charcoal,
    marginBottom: 0,
  } as TextStyle,
  policyContent: {
    marginTop: DesignTokens.spacing.md,
    paddingTop: DesignTokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutrals.gray300,
  } as ViewStyle,
  policyText: {
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
    backgroundColor: Colors.functional.success,
    borderRadius: DesignTokens.borderRadius.medium,
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingVertical: DesignTokens.spacing.md,
  } as ViewStyle,
  contactButtonText: {
    color: Colors.neutrals.white,
    fontWeight: '600',
  } as TextStyle,
});
