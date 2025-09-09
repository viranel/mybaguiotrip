import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, ViewStyle } from 'react-native';

interface AnimatedScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  animationType?: 'slideInRight' | 'slideInLeft' | 'fadeIn' | 'scaleIn';
  duration?: number;
}

export default function AnimatedScreen({ 
  children, 
  style, 
  animationType = 'slideInRight',
  duration = 300 
}: AnimatedScreenProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    const startAnimation = () => {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: isWeb ? 150 : duration, // Faster animations on web
        useNativeDriver: true,
      }).start();
    };

    startAnimation();
  }, [animatedValue, duration, isWeb]);

  const getAnimationStyle = () => {
    // On web, use simpler animations for better performance
    if (isWeb) {
      switch (animationType) {
        case 'slideInRight':
        case 'slideInLeft':
        case 'scaleIn':
          return {
            opacity: animatedValue,
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          };
        case 'fadeIn':
        default:
          return {
            opacity: animatedValue,
          };
      }
    }

    // Mobile animations remain the same
    switch (animationType) {
      case 'slideInRight':
        return {
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [300, 0],
              }),
            },
          ],
          opacity: animatedValue,
        };
      case 'slideInLeft':
        return {
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-300, 0],
              }),
            },
          ],
          opacity: animatedValue,
        };
      case 'fadeIn':
        return {
          opacity: animatedValue,
        };
      case 'scaleIn':
        return {
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
          opacity: animatedValue,
        };
      default:
        return {
          opacity: animatedValue,
        };
    }
  };

  return (
    <Animated.View style={[styles.container, style, getAnimationStyle()]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
});

