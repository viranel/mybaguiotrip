import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.iconContainer}>
        <View style={styles.mainIcon}>
          <Ionicons name="trending-up" size={48} color="white" />
        </View>
        
        <View style={styles.sparkleIcon}>
          <Ionicons name="sparkles" size={16} color="#92400E" />
        </View>
      </View>
      
      <View style={styles.textSection}>
        <Text style={styles.title}>Welcome to My Baguio Trip!</Text>
        <Text style={styles.subtitle}>
          Your AI-powered travel companion for exploring the beautiful city of Baguio. 
          Let's create the perfect itinerary just for you.
        </Text>
      </View>
      
      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>What we'll do:</Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <View style={styles.bullet} />
            <Text style={styles.featureText}>Learn about your travel interests</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.bullet} />
            <Text style={styles.featureText}>Set your budget and travel style</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.bullet} />
            <Text style={styles.featureText}>Generate personalized recommendations</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={onNext} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Get Started</Text>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  mainIcon: {
    width: 96,
    height: 96,
    backgroundColor: '#FF7F50',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  sparkleIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    backgroundColor: '#FBBF24',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 320,
  },
  featuresContainer: {
    backgroundColor: '#FFF5F2',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    width: '100%',
    maxWidth: 320,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bullet: {
    width: 8,
    height: 8,
    backgroundColor: '#FF7F50',
    borderRadius: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
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
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
