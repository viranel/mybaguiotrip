import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import CompleteStep from '../components/onboarding/CompleteStep';
import InterestsStep from '../components/onboarding/InterestsStep';
import PreferencesStep from '../components/onboarding/PreferencesStep';
import WelcomeStep from '../components/onboarding/WelcomeStep';
import CustomText from '../components/ui/CustomText';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

interface UserData {
  interests?: string[];
  budget_range?: string;
  travel_style?: string;
  phone_number?: string;
}

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({});
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleComplete = async () => {
    try {
      // For now, just navigate to main app
      // TODO: Save user preferences to Supabase when needed
      console.log('Onboarding completed with data:', userData);
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      console.error('Onboarding completion error:', error);
      // Navigate to main app even if there's an error
      router.replace('/(tabs)/dashboard');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />;
      case 1:
        return (
          <InterestsStep
            userData={userData}
            updateUserData={updateUserData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <PreferencesStep
            userData={userData}
            updateUserData={updateUserData}
            onNext={nextStep}
          />
        );
      case 3:
        return (
          <CompleteStep
            userData={userData}
            onComplete={handleComplete}
            isLoading={false}
          />
        );
      default:
        return <WelcomeStep onNext={nextStep} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {initialLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.appIdentity.primaryBrand} />
          <CustomText variant="h3" style={styles.loadingText}>
            Setting up your profile...
          </CustomText>
        </View>
      ) : (
        <>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentStep + 1) / 4) * 100}%` }
                ]} 
              />
            </View>
            <View style={styles.stepIndicator}>
              {[0, 1, 2, 3].map((step) => (
                <View
                  key={step}
                  style={[
                    styles.stepDot,
                    step <= currentStep && styles.stepDotActive
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Step Content */}
          <View style={styles.stepContainer}>
            {renderStep()}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 20,
    color: Colors.appIdentity.primaryBrand,
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF7F50',
    borderRadius: 2,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  stepDotActive: {
    backgroundColor: '#FF7F50',
  },
  stepContainer: {
    flex: 1,
  },
});
