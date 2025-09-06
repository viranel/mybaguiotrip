# My Baguio Trip App

An AI-powered travel planning application for Baguio City, Philippines, built with React Native and Expo.

## Features

- **AI-Powered Itinerary Generation**: Create personalized travel plans based on preferences
- **Attraction Discovery**: Browse and filter attractions by category
- **Hotel Booking**: Find accommodations that match your budget and preferences
- **Trip Management**: Organize and track your planned trips
- **User Onboarding**: Personalized setup process to understand travel preferences

## App Structure

```
mybaguiotrip/
├── app/                          # Expo Router app directory
│   ├── (tabs)/                  # Tab-based navigation
│   │   ├── dashboard.tsx        # Home dashboard
│   │   ├── attractions.tsx      # Attractions listing
│   │   ├── hotels.tsx          # Hotels listing
│   │   ├── planner.tsx         # Trip planning form
│   │   ├── trips.tsx           # User trips management
│   │   └── _layout.tsx         # Tab navigation layout
│   ├── onboarding.tsx          # User onboarding flow
│   ├── index.tsx               # App entry point
│   └── _layout.tsx             # Root layout
├── components/                  # Reusable UI components
│   ├── dashboard/              # Dashboard-specific components
│   │   ├── WelcomeHero.tsx     # Welcome section
│   │   ├── FeaturedDestinations.tsx
│   │   ├── QuickActions.tsx
│   │   └── TripStats.tsx
│   ├── attractions/            # Attraction-related components
│   │   └── AttractionCard.tsx
│   ├── hotels/                 # Hotel-related components
│   │   └── HotelCard.tsx
│   ├── onboarding/             # Onboarding flow components
│   │   ├── WelcomeStep.tsx
│   │   ├── InterestsStep.tsx
│   │   ├── PreferencesStep.tsx
│   │   └── CompleteStep.tsx
│   ├── planner/                # Trip planning components
│   │   └── PlannerForm.tsx
│   └── trips/                  # Trip management components
│       └── TripCard.tsx
├── data/                       # Data schemas and mock data
│   └── attractions/
│       ├── Attraction.json
│       ├── Hotel.json
│       └── Itinerary.json
└── constants/                  # App constants and configuration
    └── Colors.ts
```

## Components Overview

### Dashboard Components
- **WelcomeHero**: Personalized greeting with quick action buttons
- **FeaturedDestinations**: Horizontal scroll of popular attractions
- **QuickActions**: Grid of main app functions
- **TripStats**: User's travel statistics

### Onboarding Components
- **WelcomeStep**: App introduction and feature overview
- **InterestsStep**: Interest selection for personalized recommendations
- **PreferencesStep**: Budget and travel style preferences
- **CompleteStep**: Profile summary and completion

### Content Components
- **AttractionCard**: Display attraction information with images and ratings
- **HotelCard**: Hotel information with pricing and amenities
- **TripCard**: Trip summary with dates and traveler count
- **PlannerForm**: Comprehensive trip planning form

## Navigation Structure

The app uses Expo Router with a tab-based navigation system:

1. **Home (Dashboard)**: Main landing page with overview and quick actions
2. **Attractions**: Browse and filter Baguio attractions
3. **Hotels**: Find and compare accommodations
4. **Planner**: AI-powered trip planning tool
5. **My Trips**: Manage saved itineraries

## Data Models

### Attraction
- Basic info (name, description, location)
- Category (sightseeing, food_trip, shopping, etc.)
- Ratings and duration
- Images and tips

### Hotel
- Accommodation details
- Pricing and ratings
- Amenities and location
- Contact information

### Itinerary
- Trip dates and duration
- Budget and traveler count
- Daily activities and schedule
- Status tracking

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Run on device or simulator:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

## Dependencies

- **React Native**: Mobile app framework
- **Expo**: Development platform and tools
- **Expo Router**: File-based navigation
- **@expo/vector-icons**: Icon library
- **expo-linear-gradient**: Gradient backgrounds

## Development Notes

- Components are built with TypeScript for type safety
- Uses React Native StyleSheet for consistent styling
- Implements proper loading states and error handling
- Follows React Native best practices for performance
- Uses mock data for development (replace with API calls in production)

## Future Enhancements

- Integration with real AI services for itinerary generation
- Payment processing for hotel bookings
- Push notifications for trip reminders
- Offline support for saved itineraries
- Social sharing features
- Multi-language support
- Dark mode theme
