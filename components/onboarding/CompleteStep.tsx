import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UserData {
  interests?: string[];
  budget_range?: string;
  travel_style?: string;
}

interface CompleteStepProps {
  userData: UserData;
  onComplete: () => void;
  isLoading: boolean;
}

export default function CompleteStep({ userData, onComplete, isLoading }: CompleteStepProps) {
  const getInterestLabels = () => {
    const labelMap: Record<string, string> = {
      sightseeing: "Sightseeing",
      food_trip: "Food Trip", 
      shopping: "Shopping",
      relaxing: "Relaxing",
      adventure: "Adventure",
      nature: "Nature",
      culture: "Culture",
      photography: "Photography"
    };
    
    return userData.interests?.map(interest => labelMap[interest]) || [];
  };

  const getBudgetLabel = () => {
    const labelMap: Record<string, string> = {
      budget: "Budget (₱1,000 - ₱3,000/day)",
      mid_range: "Mid-Range (₱3,000 - ₱7,000/day)",
      luxury: "Luxury (₱7,000+/day)"
    };
    return labelMap[userData.budget_range || ''] || "";
  };

  const getTravelStyleLabel = () => {
    const labelMap: Record<string, string> = {
      solo: "Solo Travel",
      couple: "Couple",
      family: "Family",
      group: "Group"
    };
    return labelMap[userData.travel_style || ''] || "";
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.checkIcon}>
          <Ionicons name="checkmark-circle" size={40} color="white" />
        </View>
      </View>
      
      <View style={styles.header}>
        <Text style={styles.title}>Perfect! You're all set 🎉</Text>
        <Text style={styles.subtitle}>
          Here's a summary of your travel profile
        </Text>
      </View>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summarySection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles" size={16} color="#FF7F50" />
            <Text style={styles.sectionTitle}>Your Interests</Text>
          </View>
          <View style={styles.interestsContainer}>
            {getInterestLabels().map((label, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestTagText}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Budget Range</Text>
          <Text style={styles.summaryValue}>{getBudgetLabel()}</Text>
        </View>
        
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Travel Style</Text>
          <Text style={styles.summaryValue}>{getTravelStyleLabel()}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={onComplete}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <>
            <ActivityIndicator size="small" color="white" />
            <Text style={styles.buttonText}>Setting up your profile...</Text>
          </>
        ) : (
          <>
            <Text style={styles.buttonText}>Start Exploring Baguio!</Text>
            <Ionicons name="sparkles" size={20} color="white" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  iconContainer: {
    marginBottom: 32,
  },
  checkIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#10B981',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
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
  summaryContainer: {
    backgroundColor: '#FFF5F2',
    borderRadius: 16,
    padding: 32,
    marginBottom: 32,
    width: '100%',
    maxWidth: 320,
  },
  summarySection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#FF7F50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  interestTagText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  summaryValue: {
    color: '#FF7F50',
    fontWeight: '500',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF7F50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

