// Trip management service for saving and retrieving itineraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface GeneratedItinerary {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  travelers: number;
  totalBudget: number;
  currency: string;
  preference: string;
  days: any[];
  summary: string;
  tips: string[];
  createdAt: string;
}

class TripsService {
  private getStorageKey(userEmail: string): string {
    // Use email as the primary identifier for complete isolation
    if (!userEmail || userEmail === 'undefined' || userEmail === 'null') {
      throw new Error('User email is required for trip storage');
    }
    const cleanEmail = userEmail.toLowerCase().trim();
    console.log('Creating storage key for email:', cleanEmail);
    return `userTrips_${cleanEmail}`;
  }


  // Save itinerary to storage for specific user
  async saveItinerary(itinerary: GeneratedItinerary, userEmail: string): Promise<void> {
    try {
      const storageKey = this.getStorageKey(userEmail);
      const existingTrips = await this.getTrips(userEmail);
      existingTrips.push(itinerary);
      if (Platform.OS === 'web') {
        localStorage.setItem(storageKey, JSON.stringify(existingTrips));
      } else {
        await AsyncStorage.setItem(storageKey, JSON.stringify(existingTrips));
      }
      console.log('✅ Itinerary saved successfully for user:', { userEmail, storageKey, itineraryId: itinerary.id, totalTrips: existingTrips.length });
    } catch (error) {
      console.error('❌ Error saving itinerary:', error);
      throw error;
    }
  }

  // Get all saved trips for specific user
  async getTrips(userEmail: string): Promise<GeneratedItinerary[]> {
    try {
      const storageKey = this.getStorageKey(userEmail);
      let tripsArray: GeneratedItinerary[] = [];
      if (Platform.OS === 'web') {
        const trips = localStorage.getItem(storageKey);
        tripsArray = trips ? JSON.parse(trips) : [];
      } else {
        const trips = await AsyncStorage.getItem(storageKey);
        tripsArray = trips ? JSON.parse(trips) : [];
      }
      console.log('📋 Loading trips for user:', { userEmail, storageKey, tripsCount: tripsArray.length });
      return tripsArray;
    } catch (error) {
      console.error('❌ Error retrieving trips:', error);
      return [] as GeneratedItinerary[];
    }
  }

  // Get trip by ID for specific user
  async getTripById(id: string, userEmail: string): Promise<GeneratedItinerary | null> {
    try {
      const trips = await this.getTrips(userEmail);
      const trip = trips.find(trip => trip.id === id) || null;
      console.log('🔍 Looking for trip:', { id, userEmail, found: !!trip });
      return trip;
    } catch (error) {
      console.error('❌ Error retrieving trip:', error);
      return null;
    }
  }

  // Delete trip by ID for specific user
  async deleteTrip(id: string, userEmail: string): Promise<void> {
    try {
      const storageKey = this.getStorageKey(userEmail);
      const trips = await this.getTrips(userEmail);
      const filteredTrips = trips.filter(trip => trip.id !== id);
      if (Platform.OS === 'web') {
        localStorage.setItem(storageKey, JSON.stringify(filteredTrips));
      } else {
        await AsyncStorage.setItem(storageKey, JSON.stringify(filteredTrips));
      }
      console.log('🗑️ Trip deleted successfully for user:', { userEmail, id, remainingTrips: filteredTrips.length });
    } catch (error) {
      console.error('❌ Error deleting trip:', error);
      throw error;
    }
  }

  // Get trip statistics for specific user
  async getTripStats(userEmail: string) {
    const trips = await this.getTrips(userEmail);
    const totalTrips = trips.length;
    const totalDays = trips.reduce((sum, trip) => sum + trip.duration, 0);
    const totalBudget = trips.reduce((sum, trip) => sum + trip.totalBudget, 0);
    
    return {
      totalTrips,
      totalDays,
      totalBudget,
      averageTripLength: totalTrips > 0 ? Math.round(totalDays / totalTrips) : 0,
      averageBudget: totalTrips > 0 ? Math.round(totalBudget / totalTrips) : 0,
    };
  }

  // Get recent trips (last 5) for specific user
  async getRecentTrips(userEmail: string): Promise<GeneratedItinerary[]> {
    const trips = await this.getTrips(userEmail);
    return trips
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }
}

export const tripsService = new TripsService();