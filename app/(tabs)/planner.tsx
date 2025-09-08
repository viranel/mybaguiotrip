import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, SafeAreaView, ScrollView, StyleSheet, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import AnimatedScreen from '../../components/ui/AnimatedScreen';
import CustomText from '../../components/ui/CustomText';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';
import { ItineraryRequest } from '../../lib/aiService';
import { getAPIStatus, isAPIConfigured } from '../../lib/config';

// Import DateTimePicker only for native platforms
let DateTimePicker: any = null;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

interface BudgetPreset {
  id: string;
  name: string;
  description: string;
  dailyBudget: number;
  color: string;
}

interface TripPreference {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const budgetPresets: BudgetPreset[] = [
  {
    id: 'budget-friendly',
    name: 'Budget Friendly',
    description: 'Affordable options',
    dailyBudget: 2000,
    color: Colors.functional.success,
  },
  {
    id: 'mid-range',
    name: 'Mid-Range',
    description: 'Balanced comfort & cost',
    dailyBudget: 4000,
    color: Colors.appIdentity.primaryBrand,
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Premium experience',
    dailyBudget: 8000,
    color: Colors.secondary.coral,
  },
];

const tripPreferences: TripPreference[] = [
  {
    id: 'relaxed',
    name: 'Relaxed',
    description: 'Leisurely pace, spa & cafes',
    icon: 'leaf',
    color: Colors.functional.success,
  },
  {
    id: 'moderate',
    name: 'Moderate',
    description: 'Balanced activities',
    icon: 'walk',
    color: Colors.appIdentity.primaryBrand,
  },
  {
    id: 'active',
    name: 'Active',
    description: 'Adventure & outdoor activities',
    icon: 'fitness',
    color: Colors.secondary.coral,
  },
];

export default function PlannerScreen() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)); // 2 days later
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [travelers, setTravelers] = useState('2');
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('PHP');
  const [selectedBudgetPreset, setSelectedBudgetPreset] = useState<string | null>(null);
  const [selectedPreference, setSelectedPreference] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const formatDate = (date: Date): string => {
    // Use ISO format for better compatibility
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  const formatDateForDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const validateForm = (): string | null => {
    if (!startDate || !endDate) {
      return 'Please select your trip dates.';
    }

    if (startDate >= endDate) {
      return 'End date must be after start date.';
    }

    if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
      return 'Please enter a valid budget amount (minimum ₱1,000).';
    }

    if (Number(budget) < 1000) {
      return 'Budget must be at least ₱1,000 per day for a comfortable trip.';
    }

    if (!travelers || isNaN(Number(travelers)) || Number(travelers) <= 0) {
      return 'Please enter a valid number of travelers (minimum 1).';
    }

    if (Number(travelers) > 10) {
      return 'Maximum 10 travelers per trip.';
    }

    if (!selectedPreference) {
      return 'Please select your travel preference.';
    }

    if (!isAPIConfigured()) {
      return 'AI service is not configured. Please check your API key.';
    }

    return null;
  };

  const handleGenerateItinerary = async () => {
    console.log('Generate button pressed');
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Invalid Input', validationError);
        return;
      }

    // Check API configuration
    console.log('Checking API configuration...');
    const apiStatus = getAPIStatus();
    console.log('API Status:', apiStatus);
    
    if (!isAPIConfigured()) {
      Alert.alert('API Not Configured', apiStatus.message);
        return;
    }

    // Prepare request data
    const request: ItineraryRequest = {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      travelers: parseInt(travelers),
      budget: parseInt(budget),
      currency,
      preference: selectedPreference || 'balanced',
      destination: 'Baguio City, Philippines',
    };

    console.log('Navigating to loading screen with request:', request);
    
    // Navigate to loading screen
    router.push({
      pathname: '/generating-itinerary',
      params: {
        requestData: JSON.stringify(request)
      }
    });
  };

  const handleBudgetPresetSelect = (presetId: string) => {
    setSelectedBudgetPreset(presetId);
    const preset = budgetPresets.find(p => p.id === presetId);
    if (preset) {
      setBudget(preset.dailyBudget.toString());
    }
  };


  return (
    <AnimatedScreen animationType="fadeIn" style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
      {/* Modern Header with Gradient */}
      <LinearGradient
        colors={Colors.gradients.primary || ['#FB923C', '#F97316']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <CustomText variant="h2" style={styles.headerTitle}>AI Itinerary Planner</CustomText>
            <CustomText variant="body" style={styles.headerSubtitle}>Create your perfect Baguio adventure</CustomText>
          </View>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Trip Dates */}
        <View style={styles.section}>
          <CustomText variant="h3" style={styles.sectionTitle}>Trip Dates</CustomText>
          <View style={styles.dateInputs}>
            <View style={styles.inputGroup}>
              <CustomText variant="bodySmall" style={styles.inputLabel}>Start Date</CustomText>
              {Platform.OS === 'web' ? (
                <input
                  type="date"
                  value={startDate.toISOString().split('T')[0]}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    if (!isNaN(newDate.getTime())) {
                      setStartDate(newDate);
                    }
                  }}
                  style={{
                    backgroundColor: Colors.neutrals.white,
                    borderRadius: DesignTokens.borderRadius.medium,
                    padding: DesignTokens.spacing.md,
                    border: `1px solid ${Colors.neutrals.gray300}`,
                    fontSize: DesignTokens.typography.body.fontSize,
                    color: Colors.neutrals.gray900,
                    width: '100%',
                    minHeight: '48px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    boxSizing: 'border-box',
                  }}
                />
              ) : (
                <TouchableOpacity 
                  style={styles.dateInput}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <CustomText variant="body" style={styles.dateText}>
                    {formatDateForDisplay(startDate)}
                  </CustomText>
                  <Ionicons name="calendar-outline" size={20} color={Colors.neutrals.gray600} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.inputGroup}>
              <CustomText variant="bodySmall" style={styles.inputLabel}>End Date</CustomText>
              {Platform.OS === 'web' ? (
                <input
                  type="date"
                  value={endDate.toISOString().split('T')[0]}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    if (!isNaN(newDate.getTime())) {
                      setEndDate(newDate);
                    }
                  }}
                  style={{
                    backgroundColor: Colors.neutrals.white,
                    borderRadius: DesignTokens.borderRadius.medium,
                    padding: DesignTokens.spacing.md,
                    border: `1px solid ${Colors.neutrals.gray300}`,
                    fontSize: DesignTokens.typography.body.fontSize,
                    color: Colors.neutrals.gray900,
                    width: '100%',
                    minHeight: '48px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    boxSizing: 'border-box',
                  }}
                />
              ) : (
                <TouchableOpacity 
                  style={styles.dateInput}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <CustomText variant="body" style={styles.dateText}>
                    {formatDateForDisplay(endDate)}
                  </CustomText>
                  <Ionicons name="calendar-outline" size={20} color={Colors.neutrals.gray600} />
          </TouchableOpacity>
              )}
            </View>
          </View>
          
          {/* Date Pickers - Only for native platforms */}
          {Platform.OS !== 'web' && showStartDatePicker && DateTimePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleStartDateChange}
              minimumDate={new Date()}
            />
          )}
          {Platform.OS !== 'web' && showEndDatePicker && DateTimePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleEndDateChange}
              minimumDate={startDate}
            />
          )}
        </View>

        {/* Number of Travelers */}
        <View style={styles.section}>
          <CustomText variant="h3" style={styles.sectionTitle}>Number of Travelers</CustomText>
          <View style={styles.travelersInput}>
            <TextInput
              style={styles.textInput}
              value={travelers}
              onChangeText={setTravelers}
              placeholder="2"
              placeholderTextColor={Colors.neutrals.gray600}
              keyboardType="numeric"
            />
            <CustomText variant="bodySmall" style={styles.inputHint}>people</CustomText>
          </View>
        </View>

        {/* Budget Section */}
        <View style={styles.section}>
          <CustomText variant="h3" style={styles.sectionTitle}>Total Budget</CustomText>
          
          <View style={styles.budgetInput}>
            <View style={styles.currencySelector}>
              <TouchableOpacity style={styles.currencyButton}>
                <CustomText variant="body" style={styles.currencyText}>{currency}</CustomText>
                <Ionicons name="chevron-down" size={16} color={Colors.neutrals.gray600} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.textInput, styles.budgetTextInput]}
              value={budget}
              onChangeText={setBudget}
              placeholder="4000"
              placeholderTextColor={Colors.neutrals.gray600}
              keyboardType="numeric"
            />
            <CustomText variant="bodySmall" style={styles.inputHint}>per day</CustomText>
          </View>

          {/* Budget Presets */}
          <CustomText variant="bodySmall" style={styles.presetTitle}>Quick Budget Presets</CustomText>
          <View style={styles.presetsGrid}>
            {budgetPresets.map((preset) => (
              <TouchableOpacity
                key={preset.id}
                style={[
                  styles.presetCard,
                  selectedBudgetPreset === preset.id && styles.presetCardSelected,
                  { borderColor: preset.color }
                ]}
                onPress={() => handleBudgetPresetSelect(preset.id)}
              >
                <CustomText variant="h3" style={styles.presetName}>{preset.name}</CustomText>
                <CustomText variant="bodySmall" style={styles.presetDescription}>{preset.description}</CustomText>
                <CustomText variant="body" style={[styles.presetBudget, { color: preset.color }]}>
                  ₱{preset.dailyBudget.toLocaleString()}/day
                </CustomText>
          </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trip Preferences */}
        <View style={styles.section}>
          <CustomText variant="h3" style={styles.sectionTitle}>Trip Preferences</CustomText>
          <View style={styles.preferencesGrid}>
            {tripPreferences.map((preference) => (
              <TouchableOpacity
                key={preference.id}
                style={[
                  styles.preferenceCard,
                  selectedPreference === preference.id && styles.preferenceCardSelected,
                  { borderColor: preference.color }
                ]}
                onPress={() => setSelectedPreference(preference.id)}
              >
                <View style={[styles.preferenceIcon, { backgroundColor: `${preference.color}15` }]}>
                  <Ionicons name={preference.icon as any} size={24} color={preference.color} />
                      </View>
                <CustomText variant="h3" style={styles.preferenceName}>{preference.name}</CustomText>
                <CustomText variant="bodySmall" style={styles.preferenceDescription}>{preference.description}</CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generate Button */}
        <View style={styles.generateSection}>
          <TouchableOpacity 
            style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]} 
            onPress={handleGenerateItinerary}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color={Colors.neutrals.white} />
            ) : (
              <Ionicons name="sparkles" size={24} color={Colors.neutrals.white} />
            )}
            <CustomText variant="buttonText" style={styles.generateButtonText}>
              {isGenerating ? 'Generating...' : 'Generate Itinerary'}
            </CustomText>
          </TouchableOpacity>
          
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals.white,
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
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  headerLeft: {
    flex: 1,
  } as ViewStyle,
  headerTitle: {
    color: Colors.neutrals.white,
    marginBottom: DesignTokens.spacing.xs,
  } as TextStyle,
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  } as TextStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    paddingBottom: 140,
  } as ViewStyle,
  section: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.xl,
  } as ViewStyle,
  sectionTitle: {
    color: Colors.neutrals.gray900,
    marginBottom: DesignTokens.spacing.lg,
  } as TextStyle,
  dateInputs: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.md,
    justifyContent: 'space-between',
  } as ViewStyle,
  inputGroup: {
    flex: 1,
    minWidth: 0, // Prevents overflow
  } as ViewStyle,
  inputLabel: {
    color: Colors.neutrals.gray600,
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
    color: Colors.neutrals.gray900,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  } as TextStyle,
  dateInput: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.medium,
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 48, // Ensure consistent height
    flex: 1, // Take available space
  } as ViewStyle,
  dateText: {
    fontSize: DesignTokens.typography.body.fontSize,
    color: Colors.neutrals.gray900,
  } as TextStyle,
  travelersInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.md,
  } as ViewStyle,
  inputHint: {
    color: Colors.neutrals.gray600,
    fontWeight: '500',
  } as TextStyle,
  budgetInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.md,
    marginBottom: DesignTokens.spacing.lg,
  } as ViewStyle,
  currencySelector: {
    marginRight: DesignTokens.spacing.sm,
  } as ViewStyle,
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.xs,
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.medium,
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
    minWidth: 60,
    justifyContent: 'center',
  } as ViewStyle,
  currencyText: {
    color: Colors.neutrals.gray900,
    fontWeight: '600',
  } as TextStyle,
  budgetTextInput: {
    flex: 1,
  } as TextStyle,
  presetTitle: {
    color: Colors.neutrals.gray600,
    marginBottom: DesignTokens.spacing.md,
    fontWeight: '600',
  } as TextStyle,
  presetsGrid: {
    gap: DesignTokens.spacing.sm,
  } as ViewStyle,
  presetCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.accessibility.cardPadding,
    borderWidth: 2,
    borderColor: Colors.neutrals.gray300,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  } as ViewStyle,
  presetCardSelected: {
    borderColor: Colors.appIdentity.primaryBrand,
    backgroundColor: `${Colors.appIdentity.primaryBrand}05`,
  } as ViewStyle,
  presetName: {
    color: Colors.neutrals.gray900,
    marginBottom: 4,
  } as TextStyle,
  presetDescription: {
    color: Colors.neutrals.gray600,
    marginBottom: DesignTokens.spacing.sm,
  } as TextStyle,
  presetBudget: {
    fontWeight: '600',
  } as TextStyle,
  preferencesGrid: {
    gap: DesignTokens.spacing.sm,
  } as ViewStyle,
  preferenceCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.accessibility.cardPadding,
    borderWidth: 2,
    borderColor: Colors.neutrals.gray300,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  } as ViewStyle,
  preferenceCardSelected: {
    borderColor: Colors.appIdentity.primaryBrand,
    backgroundColor: `${Colors.appIdentity.primaryBrand}05`,
  } as ViewStyle,
  preferenceIcon: {
    width: 48,
    height: 48,
    borderRadius: DesignTokens.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: DesignTokens.spacing.sm,
  } as ViewStyle,
  preferenceName: {
    color: Colors.neutrals.gray900,
    marginBottom: 4,
  } as TextStyle,
  preferenceDescription: {
    color: Colors.neutrals.gray600,
  } as TextStyle,
  generateSection: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginTop: DesignTokens.spacing.xl,
  } as ViewStyle,
  generateButton: {
    backgroundColor: Colors.appIdentity.primaryBrand,
    borderRadius: DesignTokens.borderRadius.large,
    paddingVertical: DesignTokens.spacing.md,
    paddingHorizontal: DesignTokens.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DesignTokens.spacing.sm,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  } as ViewStyle,
  generateButtonText: {
    color: Colors.neutrals.white,
  } as TextStyle,
  generateButtonDisabled: {
    backgroundColor: Colors.neutrals.gray400,
    opacity: 0.7,
  } as ViewStyle,
  bottomSpacing: {
    height: DesignTokens.spacing.xl,
  } as ViewStyle,
});
