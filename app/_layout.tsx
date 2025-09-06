import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '../providers/AuthProvider';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Nexa-ExtraLight': require('../assets/fonts/Nexa-ExtraLight.ttf'),
    'Nexa-Heavy': require('../assets/fonts/Nexa-Heavy.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Stack
          screenOptions={{
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="itinerary-detail" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
              gestureEnabled: true,
            }} 
          />
          <Stack.Screen 
            name="generating-itinerary" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
              gestureEnabled: true,
            }} 
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </ErrorBoundary>
  );
}
