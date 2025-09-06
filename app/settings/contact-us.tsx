import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, SafeAreaView, ScrollView, StyleSheet, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import CustomText from '../../components/ui/CustomText';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';

interface ContactMethod {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  action: string;
}

const contactMethods: ContactMethod[] = [
  {
    id: 'email',
    title: 'Email Support',
    subtitle: 'Get a response within 24 hours',
    icon: 'mail',
    color: Colors.appIdentity.primaryBrand,
    action: 'support@mybaguiotrip.com',
  },
  {
    id: 'chat',
    title: 'Live Chat',
    subtitle: 'Available 24/7 for urgent issues',
    icon: 'chatbubble-ellipses',
    color: Colors.functional.success,
    action: 'Start Chat',
  },
  {
    id: 'phone',
    title: 'Phone Support',
    subtitle: 'Call us during business hours',
    icon: 'call',
    color: Colors.secondary.coral,
    action: '+63 2 8123 4567',
  },
  {
    id: 'social',
    title: 'Social Media',
    subtitle: 'Follow us for updates and tips',
    icon: 'share-social',
    color: Colors.appIdentity.accentBrand,
    action: '@MyBaguioTrip',
  },
];

export default function ContactUsScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
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

  const handleContactMethod = (method: ContactMethod) => {
    Alert.alert(
      method.title,
      `${method.subtitle}\n\nAction: ${method.action}`,
      [
        {
          text: 'OK',
          onPress: () => {
            // In a real app, this would open the appropriate contact method
            if (method.id === 'email') {
              Alert.alert('Email', 'Email client would open here');
            } else if (method.id === 'phone') {
              Alert.alert('Phone', 'Phone dialer would open here');
            } else if (method.id === 'chat') {
              Alert.alert('Live Chat', 'Chat interface would open here');
            } else if (method.id === 'social') {
              Alert.alert('Social Media', 'Social media app would open here');
            }
          },
        },
      ]
    );
  };

  const handleSubmitForm = () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    Alert.alert(
      'Message Sent',
      'Thank you for contacting us! We will get back to you within 24 hours.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Clear form
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
            router.back();
          },
        },
      ]
    );
  };

  const isFormValid = name.length > 0 && email.length > 0 && subject.length > 0 && message.length > 0;

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
                <CustomText variant="h2" style={styles.headerTitle}>Contact Us</CustomText>
                <CustomText variant="body" style={styles.headerSubtitle}>Get in touch with our support team</CustomText>
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
        {/* Contact Methods */}
        <View style={styles.section}>
          <CustomText variant="h3" style={styles.sectionTitle}>Get in Touch</CustomText>
          <View style={styles.contactMethods}>
            {contactMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={styles.contactMethodCard}
                onPress={() => handleContactMethod(method)}
                activeOpacity={0.8}
              >
                <View style={[styles.contactMethodIcon, { backgroundColor: `${method.color}15` }]}>
                  <Ionicons name={method.icon as any} size={24} color={method.color} />
                </View>
                <View style={styles.contactMethodInfo}>
                  <CustomText variant="h3" style={styles.contactMethodTitle}>{method.title}</CustomText>
                  <CustomText variant="bodySmall" style={styles.contactMethodSubtitle}>{method.subtitle}</CustomText>
                  <CustomText variant="caption" style={[styles.contactMethodAction, { color: method.color }]}>
                    {method.action}
                  </CustomText>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.neutrals.darkGray} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.section}>
          <CustomText variant="h3" style={styles.sectionTitle}>Send us a Message</CustomText>
          
          <View style={styles.formGroup}>
            <CustomText variant="bodySmall" style={styles.inputLabel}>Full Name</CustomText>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.neutrals.darkGray}
            />
          </View>

          <View style={styles.formGroup}>
            <CustomText variant="bodySmall" style={styles.inputLabel}>Email Address</CustomText>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              placeholderTextColor={Colors.neutrals.darkGray}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <CustomText variant="bodySmall" style={styles.inputLabel}>Subject</CustomText>
            <TextInput
              style={styles.textInput}
              value={subject}
              onChangeText={setSubject}
              placeholder="What's this about?"
              placeholderTextColor={Colors.neutrals.darkGray}
            />
          </View>

          <View style={styles.formGroup}>
            <CustomText variant="bodySmall" style={styles.inputLabel}>Message</CustomText>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={message}
              onChangeText={setMessage}
              placeholder="Tell us how we can help..."
              placeholderTextColor={Colors.neutrals.darkGray}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]} 
            onPress={handleSubmitForm}
            disabled={!isFormValid}
          >
            <CustomText variant="buttonText" style={styles.submitButtonText}>Send Message</CustomText>
          </TouchableOpacity>
        </View>

        {/* Office Information */}
        <View style={styles.section}>
          <CustomText variant="h3" style={styles.sectionTitle}>Our Office</CustomText>
          <View style={styles.officeCard}>
            <View style={styles.officeIcon}>
              <Ionicons name="location" size={24} color={Colors.appIdentity.primaryBrand} />
            </View>
            <View style={styles.officeInfo}>
              <CustomText variant="h3" style={styles.officeTitle}>MyBaguioTrip Headquarters</CustomText>
              <CustomText variant="bodySmall" style={styles.officeAddress}>
                123 Session Road, Baguio City<br />
                Benguet, Philippines 2600
              </CustomText>
              <CustomText variant="caption" style={styles.officeHours}>
                Business Hours: Monday - Friday, 9:00 AM - 6:00 PM (PHT)
              </CustomText>
            </View>
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
  sectionTitle: {
    color: Colors.neutrals.charcoal,
    marginBottom: DesignTokens.spacing.lg,
  } as TextStyle,
  contactMethods: {
    gap: DesignTokens.spacing.sm,
  } as ViewStyle,
  contactMethodCard: {
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
  contactMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: DesignTokens.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DesignTokens.spacing.md,
  } as ViewStyle,
  contactMethodInfo: {
    flex: 1,
  } as ViewStyle,
  contactMethodTitle: {
    color: Colors.neutrals.charcoal,
    marginBottom: 2,
  } as TextStyle,
  contactMethodSubtitle: {
    color: Colors.neutrals.darkGray,
    marginBottom: 4,
  } as TextStyle,
  contactMethodAction: {
    fontWeight: '600',
  } as TextStyle,
  formGroup: {
    marginBottom: DesignTokens.spacing.lg,
  } as ViewStyle,
  inputLabel: {
    color: Colors.neutrals.darkGray,
    marginBottom: DesignTokens.spacing.xs,
    fontWeight: '600',
  } as TextStyle,
  textInput: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.medium,
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
    fontSize: DesignTokens.typography.body.fontSize,
    color: Colors.neutrals.charcoal,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  } as TextStyle,
  textArea: {
    height: 120,
    paddingTop: DesignTokens.spacing.md,
  } as TextStyle,
  submitButton: {
    backgroundColor: Colors.appIdentity.primaryBrand,
    borderRadius: DesignTokens.borderRadius.medium,
    paddingVertical: DesignTokens.spacing.md,
    alignItems: 'center',
    marginTop: DesignTokens.spacing.md,
  } as ViewStyle,
  submitButtonDisabled: {
    backgroundColor: Colors.neutrals.gray300,
  } as ViewStyle,
  submitButtonText: {
    color: Colors.neutrals.white,
    fontWeight: '600',
  } as TextStyle,
  officeCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.accessibility.cardPadding,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
  } as ViewStyle,
  officeIcon: {
    width: 48,
    height: 48,
    borderRadius: DesignTokens.borderRadius.medium,
    backgroundColor: `${Colors.appIdentity.primaryBrand}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DesignTokens.spacing.md,
  } as ViewStyle,
  officeInfo: {
    flex: 1,
  } as ViewStyle,
  officeTitle: {
    color: Colors.neutrals.charcoal,
    marginBottom: DesignTokens.spacing.sm,
  } as TextStyle,
  officeAddress: {
    color: Colors.neutrals.darkGray,
    marginBottom: DesignTokens.spacing.sm,
    lineHeight: 18,
  } as TextStyle,
  officeHours: {
    color: Colors.appIdentity.primaryBrand,
    fontWeight: '500',
  } as TextStyle,
});
