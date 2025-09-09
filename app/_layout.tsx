import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { AuthProvider } from '../providers/AuthProvider';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Nexa-ExtraLight': require('../assets/fonts/Nexa-ExtraLight.ttf'),
    'Nexa-Heavy': require('../assets/fonts/Nexa-Heavy.ttf'),
  });

  // For web, use fallback fonts and don't wait for custom fonts
  if (Platform.OS === 'web') {
    // Web doesn't need to wait for fonts
  } else if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          animation: Platform.OS === 'web' ? 'none' : 'slide_from_right',
          gestureEnabled: Platform.OS !== 'web',
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="simple-test" options={{ headerShown: false }} />
        <Stack.Screen name="web-debug" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="auth/web-login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="itinerary-detail" 
          options={{ 
            headerShown: false,
            animation: Platform.OS === 'web' ? 'none' : 'slide_from_right',
            gestureEnabled: Platform.OS !== 'web',
          }} 
        />
        <Stack.Screen 
          name="generating-itinerary" 
          options={{ 
            headerShown: false,
            animation: Platform.OS === 'web' ? 'none' : 'slide_from_right',
            gestureEnabled: Platform.OS !== 'web',
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
