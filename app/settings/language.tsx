import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, SafeAreaView, ScrollView, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import CustomText from '../../components/ui/CustomText';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';

interface Language {
  id: string;
  name: string;
  nativeName: string;
  code: string;
  isSelected: boolean;
}

const languages: Language[] = [
  { id: 'en', name: 'English', nativeName: 'English', code: 'EN', isSelected: true },
  { id: 'tl', name: 'Filipino', nativeName: 'Filipino', code: 'TL', isSelected: false },
  { id: 'es', name: 'Spanish', nativeName: 'Español', code: 'ES', isSelected: false },
  { id: 'zh', name: 'Chinese', nativeName: '中文', code: 'ZH', isSelected: false },
  { id: 'ja', name: 'Japanese', nativeName: '日本語', code: 'JA', isSelected: false },
  { id: 'ko', name: 'Korean', nativeName: '한국어', code: 'KO', isSelected: false },
];

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
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

  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(languageId);
  };

  const handleSaveLanguage = () => {
    const selectedLang = languages.find(lang => lang.id === selectedLanguage);
    Alert.alert(
      'Language Changed',
      `App language has been changed to ${selectedLang?.nativeName}. The app will restart to apply the changes.`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
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
              <CustomText variant="h2" style={styles.headerTitle}>App Language</CustomText>
              <CustomText variant="body" style={styles.headerSubtitle}>Choose your preferred language</CustomText>
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
        {/* Current Language */}
        <View style={styles.section}>
          <CustomText variant="h3" style={styles.sectionTitle}>Current Language</CustomText>
          <View style={styles.currentLanguageCard}>
            <View style={styles.languageInfo}>
              <View style={styles.languageIcon}>
                <Ionicons name="checkmark-circle" size={24} color={Colors.functional.success} />
              </View>
              <View style={styles.languageDetails}>
                <CustomText variant="h3" style={styles.languageName}>English</CustomText>
                <CustomText variant="bodySmall" style={styles.languageNative}>English</CustomText>
              </View>
            </View>
            <View style={styles.currentBadge}>
              <CustomText variant="caption" style={styles.currentBadgeText}>Current</CustomText>
            </View>
          </View>
        </View>

        {/* Available Languages */}
        <View style={styles.section}>
          <CustomText variant="h3" style={styles.sectionTitle}>Available Languages</CustomText>
          <View style={styles.languagesList}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.id}
                style={[
                  styles.languageCard,
                  selectedLanguage === language.id && styles.languageCardSelected
                ]}
                onPress={() => {
                  handleLanguageSelect(language.id);
                  if (language.id !== selectedLanguage) {
                    handleSaveLanguage();
                  }
                }}
                activeOpacity={0.8}
              >
                <View style={styles.languageInfo}>
                  <View style={styles.languageIcon}>
                    <CustomText variant="h3" style={styles.languageCode}>{language.code}</CustomText>
                  </View>
                  <View style={styles.languageDetails}>
                    <CustomText variant="h3" style={styles.languageName}>{language.name}</CustomText>
                    <CustomText variant="bodySmall" style={styles.languageNative}>{language.nativeName}</CustomText>
                  </View>
                </View>
                {selectedLanguage === language.id && (
                  <Ionicons name="checkmark-circle" size={24} color={Colors.appIdentity.primaryBrand} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Language Notice */}
        <View style={styles.section}>
          <View style={styles.languageNotice}>
            <Ionicons name="information-circle" size={20} color={Colors.appIdentity.primaryBrand} />
            <View style={styles.noticeText}>
              <CustomText variant="bodySmall" style={styles.noticeTitle}>Language Change</CustomText>
              <CustomText variant="caption" style={styles.noticeSubtitle}>
                The app will restart to apply the new language settings
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
  currentLanguageCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.accessibility.cardPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 2,
    borderColor: Colors.functional.success,
  } as ViewStyle,
  languageCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.accessibility.cardPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: DesignTokens.spacing.sm,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
  } as ViewStyle,
  languageCardSelected: {
    borderColor: Colors.appIdentity.primaryBrand,
    backgroundColor: `${Colors.appIdentity.primaryBrand}05`,
  } as ViewStyle,
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  } as ViewStyle,
  languageIcon: {
    width: 48,
    height: 48,
    borderRadius: DesignTokens.borderRadius.medium,
    backgroundColor: `${Colors.appIdentity.primaryBrand}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DesignTokens.spacing.md,
  } as ViewStyle,
  languageCode: {
    color: Colors.appIdentity.primaryBrand,
    fontWeight: '600',
  } as TextStyle,
  languageDetails: {
    flex: 1,
  } as ViewStyle,
  languageName: {
    color: Colors.neutrals.charcoal,
    marginBottom: 2,
  } as TextStyle,
  languageNative: {
    color: Colors.neutrals.darkGray,
  } as TextStyle,
  currentBadge: {
    backgroundColor: Colors.functional.success,
    borderRadius: DesignTokens.borderRadius.pill,
    paddingHorizontal: DesignTokens.spacing.sm,
    paddingVertical: DesignTokens.spacing.xs,
  } as ViewStyle,
  currentBadgeText: {
    color: Colors.neutrals.white,
    fontWeight: '600',
  } as TextStyle,
  languagesList: {
    gap: DesignTokens.spacing.sm,
  } as ViewStyle,
  languageNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.appIdentity.primaryBrand}10`,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.spacing.md,
    borderWidth: 1,
    borderColor: `${Colors.appIdentity.primaryBrand}20`,
  } as ViewStyle,
  noticeText: {
    marginLeft: DesignTokens.spacing.sm,
    flex: 1,
  } as ViewStyle,
  noticeTitle: {
    color: Colors.appIdentity.primaryBrand,
    fontWeight: '600',
    marginBottom: 2,
  } as TextStyle,
  noticeSubtitle: {
    color: Colors.neutrals.darkGray,
  } as TextStyle,
});
