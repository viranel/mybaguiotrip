import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';

import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { DesignTokens } from '@/constants/DesignTokens';

export default function TabLayout() {
  const isWeb = Platform.OS === 'web';
  
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.appIdentity.primaryBrand,
          tabBarInactiveTintColor: Colors.neutrals.gray600,
          headerShown: false,
          tabBarBackground: Platform.OS === 'android' ? undefined : TabBarBackground,
          animation: 'shift',
          tabBarStyle: isWeb ? styles.webTabBar : styles.mobileTabBar,
          tabBarLabelStyle: {
            fontSize: DesignTokens.typography.caption.fontSize,
            fontWeight: '600',
            marginTop: DesignTokens.spacing.xs,
          },
          tabBarIconStyle: {
            marginTop: DesignTokens.spacing.sm,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={DesignTokens.iconSizes.navigation} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="hotels"
          options={{
            title: 'Hotels',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? "bed" : "bed-outline"} 
                size={DesignTokens.iconSizes.navigation} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="attractions"
          options={{
            title: 'Spots',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? "location" : "location-outline"} 
                size={DesignTokens.iconSizes.navigation} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="planner"
          options={{
            title: 'AI Planner',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? "sparkles" : "sparkles-outline"} 
                size={DesignTokens.iconSizes.navigation} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="trips"
          options={{
            title: 'My Trips',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? "airplane" : "airplane-outline"} 
                size={DesignTokens.iconSizes.navigation} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Account',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={DesignTokens.iconSizes.navigation} 
                color={color} 
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
  mobileTabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 80,
    backgroundColor: Colors.neutrals.white,
    borderRadius: 40,
    borderTopWidth: 0,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
    paddingHorizontal: DesignTokens.spacing.md,
    paddingBottom: DesignTokens.spacing.sm,
  },
  webTabBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: Colors.neutrals.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutrals.gray200,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingVertical: DesignTokens.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1000,
  },
});
