import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Interest {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

interface UserData {
  interests?: string[];
}

interface InterestsStepProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
}

const interests: Interest[] = [
  { id: "sightseeing", label: "Sightseeing", icon: "location", description: "Visit famous landmarks" },
  { id: "food_trip", label: "Food Trip", icon: "restaurant", description: "Taste local cuisine" },
  { id: "shopping", label: "Shopping", icon: "bag", description: "Find unique souvenirs" },
  { id: "relaxing", label: "Relaxing", icon: "water", description: "Unwind and destress" },
  { id: "adventure", label: "Adventure", icon: "trending-up", description: "Thrilling activities" },
  { id: "nature", label: "Nature", icon: "leaf", description: "Explore natural beauty" },
  { id: "culture", label: "Culture", icon: "color-palette", description: "Learn local traditions" },
  { id: "photography", label: "Photography", icon: "camera", description: "Capture memories" },
];

export default function InterestsStep({ userData, updateUserData, onNext }: InterestsStepProps) {
  const handleInterestToggle = (interestId: string) => {
    const currentInterests = userData.interests || [];
    let newInterests: string[];
    
    if (currentInterests.includes(interestId)) {
      newInterests = currentInterests.filter(id => id !== interestId);
    } else {
      newInterests = [...currentInterests, interestId];
    }
    
    updateUserData({ interests: newInterests });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>What interests you most?</Text>
        <Text style={styles.subtitle}>
          Select at least 2 activities you'd like to experience in Baguio
        </Text>
      </View>
      
      <View style={styles.interestsGrid}>
        {interests.map((interest) => {
          const isSelected = userData.interests?.includes(interest.id);
          
          return (
            <TouchableOpacity
              key={interest.id}
              style={[
                styles.interestCard,
                isSelected && styles.selectedCard
              ]}
              onPress={() => handleInterestToggle(interest.id)}
              activeOpacity={0.8}
            >
              <View style={styles.interestContent}>
                <View style={[
                  styles.iconContainer,
                  isSelected && styles.selectedIconContainer
                ]}>
                  <Ionicons 
                    name={interest.icon} 
                    size={24} 
                    color={isSelected ? "white" : "#6B7280"} 
                  />
                </View>
                
                <View style={styles.textContainer}>
                  <Text style={[
                    styles.interestLabel,
                    isSelected && styles.selectedLabel
                  ]}>
                    {interest.label}
                  </Text>
                  <Text style={styles.interestDescription}>{interest.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      
      {userData.interests && userData.interests.length > 0 && (
        <View style={styles.selectionInfo}>
          <Text style={styles.selectionText}>
            {userData.interests.length} interest{userData.interests.length !== 1 ? 's' : ''} selected
            {userData.interests.length < 2 && (
              <Text style={styles.minimumText}> • Select at least 2 interests to continue</Text>
            )}
          </Text>
        </View>
      )}

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
                  <TouchableOpacity
            style={[
              styles.continueButton,
              (!userData.interests || userData.interests.length < 2) && styles.continueButtonDisabled
            ]}
            onPress={onNext}
            disabled={!userData.interests || userData.interests.length < 2}
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
    marginBottom: 32,
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
  interestsGrid: {
    gap: 16,
  },
  interestCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  selectedCard: {
    borderColor: '#FF7F50',
    backgroundColor: '#FFF5F2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  interestContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIconContainer: {
    backgroundColor: '#FF7F50',
  },
  textContainer: {
    flex: 1,
  },
  interestLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  selectedLabel: {
    color: '#FF7F50',
  },
  interestDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  selectionInfo: {
    alignItems: 'center',
    marginTop: 24,
  },
  selectionText: {
    color: '#FF7F50',
    fontWeight: '500',
    fontSize: 16,
  },
  minimumText: {
    color: '#6B7280',
    fontWeight: '400',
    fontSize: 14,
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
