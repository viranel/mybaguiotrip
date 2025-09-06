import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UserData {
  budget_range?: string;
  travel_style?: string;
  phone_number?: string;
}

interface PreferencesStepProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
}

const budgetOptions = [
  { id: "budget", label: "Budget", description: "₱1,000 - ₱3,000 per day", icon: "💰" },
  { id: "mid_range", label: "Mid-Range", description: "₱3,000 - ₱7,000 per day", icon: "💳" },
  { id: "luxury", label: "Luxury", description: "₱7,000+ per day", icon: "💎" },
];

const travelStyleOptions = [
  { id: "solo", label: "Solo Travel", description: "Just me, myself and I", icon: "🚶" },
  { id: "couple", label: "Couple", description: "Romantic getaway for two", icon: "💕" },
  { id: "family", label: "Family", description: "Fun for the whole family", icon: "👨‍👩‍👧‍👦" },
  { id: "group", label: "Group", description: "Friends and companions", icon: "👥" },
];

export default function PreferencesStep({ userData, updateUserData, onNext }: PreferencesStepProps) {
  const handleBudgetChange = (budgetId: string) => {
    updateUserData({ budget_range: budgetId });
  };

  const handleTravelStyleChange = (styleId: string) => {
    updateUserData({ travel_style: styleId });
  };

  const handlePhoneChange = (text: string) => {
    updateUserData({ phone_number: text });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Tell us about your preferences</Text>
        <Text style={styles.subtitle}>
          This helps us create the perfect itinerary for you
        </Text>
        <Text style={styles.requiredText}>
          Budget range and travel style are required
        </Text>
      </View>
      
      {/* Budget Range */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="wallet" size={20} color="#FF7F50" />
          <Text style={styles.sectionTitle}>Budget Range</Text>
        </View>
        
        <View style={styles.optionsGrid}>
          {budgetOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                userData.budget_range === option.id && styles.selectedOptionCard
              ]}
              onPress={() => handleBudgetChange(option.id)}
              activeOpacity={0.8}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <View style={styles.optionText}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Travel Style */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="people" size={20} color="#FF7F50" />
          <Text style={styles.sectionTitle}>Travel Style</Text>
        </View>
        
        <View style={styles.travelStyleGrid}>
          {travelStyleOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                userData.travel_style === option.id && styles.selectedOptionCard
              ]}
              onPress={() => handleTravelStyleChange(option.id)}
              activeOpacity={0.8}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <View style={styles.optionText}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Phone Number */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="call" size={20} color="#FF7F50" />
          <Text style={styles.sectionTitle}>Contact Number (Optional)</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="+63 9XX XXX XXXX"
          value={userData.phone_number || ""}
          onChangeText={handlePhoneChange}
          keyboardType="phone-pad"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!userData.budget_range || !userData.travel_style) && styles.continueButtonDisabled
          ]}
          onPress={onNext}
          disabled={!userData.budget_range || !userData.travel_style}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  requiredText: {
    fontSize: 14,
    color: '#FF7F50',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  optionsGrid: {
    gap: 12,
  },
  travelStyleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  selectedOptionCard: {
    borderColor: '#FF7F50',
    backgroundColor: '#FFF5F2',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  continueButton: {
    backgroundColor: '#FF7F50',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF7F50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
