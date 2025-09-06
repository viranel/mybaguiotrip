import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

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

  useEffect(() => {
    const startAnimation = () => {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
    };

    startAnimation();
  }, [animatedValue, duration]);

  const getAnimationStyle = () => {
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

